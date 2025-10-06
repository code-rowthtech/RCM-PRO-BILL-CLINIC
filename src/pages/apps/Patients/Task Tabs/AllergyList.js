import { useEffect, useState } from 'react';
import { Row, Col, Table, Modal } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import AddAllergy from './AddAllergy';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../../constants/Spinner';
import {
    deleteAllergyAction,
    getAllergiesOfPatientAction,
    getAllergyDetailsAction,
} from '../../../../redux/allergyList/action';
import UpdateAllergy from './UpdateTasks/UpdateAllergy';
import Paginations from '../../../../helpers/Paginations';
import DeletionModal from '../../../../helpers/deletionModal';

const AllergyList = () => {
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const dispatch = useDispatch();

    const [showUpdateAllergy, setShowUpdateAllergy] = useState(false);
    const [selectedAllergy, setSelectedAllergy] = useState(null);
    const [allergyModal, setAllergyModal] = useState(false);
    const [skip, setSkip] = useState(1);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deletionId, setDeletionId] = useState(null)
    const store = useSelector((state) => state);
    const allergyData = store?.getAllergiesOfAPatientReducer?.data?.allergies;
    const deleteStatus = store?.deleteAllergyReducer?.data?.status;

    useEffect(() => {
        const data = {
            patientId: patientId,
            skip: skip,
        };
        dispatch(getAllergiesOfPatientAction(data));
    }, [dispatch, patientId, skip]);

    useEffect(() => {
        if (deleteStatus === 200) {
            const data = {
                patientId: patientId,
                skip: skip,
            };
            dispatch(getAllergiesOfPatientAction(data));
            setDeleteModal(false);
        }
    }, [deleteStatus, dispatch, patientId]);

    const handleDelete = () => {
        dispatch(deleteAllergyAction({ id: deletionId }));
    };
    const closeDeleteModal = () => {
        setDeleteModal(false);
    }
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };

    const handleEditClick = (allergy) => {
        setSelectedAllergy(allergy);
        setShowUpdateAllergy(true);
        setAllergyModal(true);
    };
    return (
        <>
            <div className="scroll-container" style={{ overflowX: 'hidden', height: '70vh' }}>
                <Row>
                    <Col sm={12}>
                        <Table responsive className="table-centered table-nowrap mb-0">
                            <thead className="text-white bg-dark">
                                <tr key="">
                                    {['S.No.', 'Clinical Status', 'Category', 'Allergy', 'Date', 'Action']?.map((data, index) => (
                                        <th key={index}>{data}</th>
                                    ))}
                                </tr>
                            </thead>
                            {store?.getAllergiesOfAPatientReducer?.loading ? (
                                <tbody>
                                    <tr>
                                        <td className="text-center" colSpan={10}>
                                            <Spinner className=" my-5 " />
                                        </td>
                                    </tr>
                                </tbody>

                            ) : (
                                <tbody>
                                    {allergyData?.length > 0 ? (
                                        allergyData?.map((data, index) => (
                                            <tr key={index}>
                                                <td className="text-capitalize">{index + 1}.</td>
                                                <td className="text-capitalize">
                                                    {data?.clinicalStatus?.coding?.[0]?.display || 'N/A'}
                                                </td>
                                                <td className="text-capitalize">
                                                    {data?.category?.[0]?.display || 'N/A'}
                                                </td>
                                                <td
                                                    className="text-capitalize"
                                                    title={data?.code?.coding?.[0]?.display}>
                                                    {data?.code?.coding?.[0]?.display?.length > 50
                                                        ? data?.code?.coding?.[0]?.display?.slice(0, 49) + '...'
                                                        : data?.code?.coding?.[0]?.display || 'N/A'}
                                                </td>
                                                <td className="text-capitalize">
                                                    {data?.onset?.onsetDateTime
                                                        ? new Date(data?.onset?.onsetDateTime).toLocaleDateString('en-US')
                                                        : 'N/A'}
                                                </td>
                                                <td>
                                                    <i
                                                        className="mdi mdi-square-edit-outline cursor-pointer fs-5"
                                                        onClick={() => {
                                                            handleEditClick(data);
                                                            const requestData = {
                                                                id: data?._id,
                                                            };
                                                            dispatch(getAllergyDetailsAction(requestData));
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
                                        <tr key="">
                                            <td colSpan={10} className="text-center">
                                                <h5 className="my-5">No Allergy Found!</h5>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            )}
                        </Table>
                    </Col>
                    <div className="col-12">
                        <div className="mt-2 d-flex justify-content-end">
                            <Paginations
                                currentPage={skip}
                                totalPages={store?.getAllergiesOfAPatientReducer?.data?.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </Row>
            </div>
            <DeletionModal show={deleteModal} onHide={closeDeleteModal} onConfirm={handleDelete} item={'selected allergy'} isLoading={store?.deleteAllergyReducer?.loading} />
            <Modal show={allergyModal} onHide={() => setAllergyModal(false)} size="lg" centered>
                <Modal.Header closeButton className="px-2 py-0 ">
                    <Modal.Title className="mb-0"> {showUpdateAllergy ? 'Update Allergy' : 'Add Allergy'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showUpdateAllergy ? (
                        <UpdateAllergy
                            // allergy={selectedAllergy}
                            onCancel={() => {
                                setShowUpdateAllergy(false);
                                setAllergyModal(false);
                            }}
                        />
                    ) : (
                        <AddAllergy
                            onCancel={() => {
                                setShowUpdateAllergy(false); // in case it's set
                                setAllergyModal(false);
                            }}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AllergyList;
