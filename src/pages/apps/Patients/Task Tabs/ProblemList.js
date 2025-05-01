import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Button, Modal } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { FiEdit, FiPlus } from 'react-icons/fi';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { MdDeleteOutline } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import AddProblem from './AddProblem';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteProblemListAction,
    getProblemDetailsAction,
    getProblemListAction,
} from '../../../../redux/ProblemList/action';
import Spinner from '../../../../constants/Spinner';
import UpdateProblem from './UpdateTasks/UpdateProblem';

const ProblemList = () => {
    const dispatch = useDispatch();
    const [showAddProblem, setShowAddProblem] = useState(false);
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const [problemModal, setProblemModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showUpdateProblem, setShowUpdateProblem] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const store = useSelector((state) => state);
    const problemList = store?.getProblemListReducer?.data?.problems;
    const isLoading = store?.getProblemListReducer?.loading;
    const deleteResponse = store?.deleteProblemListReducer?.data?.status;
    useEffect(() => {
        if (patientId) {
            dispatch(getProblemListAction({ patientId }));
        }
    }, [dispatch, patientId]);
    const handleEditClick = (problem) => {
        setSelectedProblem(problem);
        setIsEditMode(true);
        setProblemModal(true);
    };
    // delete function
    const handleDelete = (data) =>{
        dispatch(deleteProblemListAction({id:data?._id} ));
    }

    useEffect(() => {
        if (deleteResponse === 200) {
            dispatch(getProblemListAction({ patientId }));
        }
    }, [deleteResponse, dispatch, patientId]);
    return (
        <>
            <div>
                {/* {showAddProblem ? (
                <AddProblem onCancel={() => setShowAddProblem(false)} />
            ) : showUpdateProblem ? (
                <UpdateProblem problem={selectedProblem} onCancel={() => setShowUpdateProblem(false)} />
            ) : ( */}
                <Row>
                    <Col sm={12} className="d-flex justify-content-between">
                        <h4>Active Problem</h4>
                        <div className="d-flex gap-2">
                            <p className="mb-0 mt-1">
                                <input className="form-check-input bg-primary me-1" type="checkbox" />
                                Show Inactive Problem
                            </p>
                            <p className="mb-0 mt-1">
                                <input className="form-check-input bg-primary me-1" type="checkbox" />
                                Patient has no known active problem
                            </p>
                            <Button
                                className="custom-buttons text-nowrap"
                                //  onClick={() => setShowAddProblem(true)}
                                onClick={() => {
                                    setIsEditMode(false);
                                    setSelectedProblem(null);
                                    setProblemModal(true);
                                }}>
                                <FiPlus className="fs-5 text-white" />
                                &nbsp; Problem
                            </Button>
                        </div>
                    </Col>
                    <Col sm={12}>
                        <Table responsive className="table-centered table-nowrap mb-0">
                            <thead className="text-white bg-dark">
                                <tr>
                                    <th className="text-white">Problem</th>
                                    {/* <th className="text-white">Codes</th> */}
                                    <th className="text-white">ICD-CM Code</th>
                                    {/* <th className="text-white">Snomed</th> */}
                                    <th className="text-white">Diagnosed Date</th>
                                    {/* <th className="text-white">Date Changed</th> */}
                                    <th className="text-white">Status</th>
                                    <th className="text-white">Notes</th>
                                    {/* <th className="text-white">Updates</th> */}
                                    <th className="text-white">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td className="text-center" colSpan={10}>
                                            <Spinner className="my-5" />
                                        </td>
                                    </tr>
                                ) : problemList?.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="text-center">
                                            <h3 className="my-5">No Problems Found!</h3>
                                        </td>
                                    </tr>
                                ) : (
                                    problemList?.map((data, index) => (
                                        <tr key={data.id || index}>
                                            <td>{data?.code?.coding?.[0]?.display || 'N/A'}</td>
                                            <td>{data?.code?.coding?.[0]?.code || 'N/A'}</td>
                                            <td>{new Date(data?.onsetDateTime).toLocaleDateString('en-GB')}</td>
                                            <td>
                                                {data.clinicalStatus?.coding?.[0]?.display || 'N/A'}
                                            </td>
                                            <td>{data?.note?.[0]?.text || 'N/A'}</td>
                                            <td>
                                                <IoInformationCircleOutline className="fs-4 cursor-pointer text-black" />
                                                &nbsp;
                                                <FiEdit
                                                    className="fs-4 cursor-pointer text-black"
                                                    onClick={() => {
                                                        handleEditClick(data);
                                                        const requestData = {
                                                            id: data?._id,
                                                        };
                                                        dispatch(getProblemDetailsAction(requestData));
                                                    }}
                                                />
                                                &nbsp;
                                                <MdDeleteOutline
                                                    className="fs-4 cursor-pointer text-black"
                                                    onClick={() => {
                                                        handleDelete(data);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                {/* // )} */}
            </div>
            <Modal show={problemModal} onHide={() => setProblemModal(false)} size="lg" centered>
                <Modal.Header closeButton className='px-2 py-0'>
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
