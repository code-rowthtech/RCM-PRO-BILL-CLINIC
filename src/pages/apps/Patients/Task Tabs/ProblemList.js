import { useEffect, useState } from 'react';
import { Row, Col, Table, Button, Modal } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import AddProblem from './AddProblem';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteProblemListAction,
    getProblemDetailsAction,
    getProblemListAction,
} from '../../../../redux/ProblemList/action';
import Spinner from '../../../../constants/Spinner';
import UpdateProblem from './UpdateTasks/UpdateProblem';
import DeletionModal from '../../../../helpers/deletionModal';
import Paginations from '../../../../helpers/Paginations';

const ProblemList = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');

    const [problemModal, setProblemModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deletionId, setDeletionId] = useState(null);
    const [skip, setSkip] = useState(1);

    const store = useSelector((state) => state);
    const problemList = store?.getProblemListReducer?.data?.problems;
    const isLoading = store?.getProblemListReducer?.loading;
    const deleteResponse = store?.deleteProblemListReducer?.data?.status;

    useEffect(() => {
        dispatch(getProblemListAction({ patientId, skip }));
    }, [dispatch, patientId, skip]);

    const handleEditClick = (problem) => {
        setSelectedProblem(problem);
        setIsEditMode(true);
        setProblemModal(true);
    };

    // delete function
    const handleDelete = () => {
        dispatch(deleteProblemListAction({ id: deletionId }));
    };

    useEffect(() => {
        if (deleteResponse === 200) {
            dispatch(getProblemListAction({ patientId, skip: 1 }));
            setDeleteModal(false);
        }
    }, [deleteResponse, dispatch, patientId]);

    const closeDeleteModal = () => {
        setDeleteModal(false);
    }
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
    return (
        <>
            <div>
                <Row>
                    <Col sm={12}>
                        <Table responsive className="table-centered table-nowrap mb-0">
                            <thead className="bg-dark">
                                <tr>
                                    {['S.No.', 'Problem', 'ICD-CM Code', 'Diagnosed Date', 'Status', 'Action']?.map((data, index) => (
                                        <th key={index}>{data}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td className="text-center" colSpan={10}>
                                            <Spinner className="my-5" />
                                        </td>
                                    </tr>
                                ) : problemList?.length > 0 ? (
                                    problemList?.map((data, index) => (
                                        <tr key={data.id || index}>
                                            <td>{index + 1}</td>
                                            <td>{data?.code?.coding?.[0]?.display || 'N/A'}</td>
                                            <td>{data?.code?.coding?.[0]?.code || 'N/A'}</td>
                                            <td>{new Date(data?.onsetDateTime).toLocaleDateString('en-GB') || 'N/A'}</td>
                                            <td>{data.clinicalStatus?.coding?.[0]?.display || 'N/A'}</td>
                                            <td>
                                                <i
                                                    className="mdi mdi-square-edit-outline cursor-pointer fs-5"
                                                    onClick={() => {
                                                        handleEditClick(data);
                                                        const requestData = {
                                                            id: data?._id,
                                                        };
                                                        dispatch(getProblemDetailsAction(requestData));
                                                    }}
                                                />
                                                &nbsp;
                                                <i
                                                    className="bi bi-trash-fill text-danger cursor-pointer"
                                                    onClick={() => {
                                                        setDeletionId(data?._id)
                                                        setDeleteModal(true);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={10} className="text-center">
                                            <h5 className="my-5">No Problems Found!</h5>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                    <div className="col-12">
                        <div className="mt-2 d-flex justify-content-end">
                            <Paginations
                                currentPage={skip}
                                totalPages={store?.getProblemListReducer?.data?.pagination?.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </Row>
                <DeletionModal show={deleteModal} onHide={closeDeleteModal} onConfirm={handleDelete} item={'problem'} isLoading={store?.deleteProblemListReducer?.loading} />
            </div>
            <Modal show={problemModal} onHide={() => setProblemModal(false)} size="lg" centered>
                <Modal.Header closeButton className="px-2 py-0">
                    <Modal.Title>{isEditMode ? 'Update Problem' : 'Add Problem'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isEditMode ? (
                        <UpdateProblem problem={selectedProblem} onCancel={() => setProblemModal(false)} />
                    ) : (
                        <AddProblem onCancel={() => setProblemModal(false)} />
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ProblemList;
