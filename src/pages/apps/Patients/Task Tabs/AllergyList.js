import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Button, Modal } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { FiEdit, FiPlus } from 'react-icons/fi';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { MdDeleteOutline } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import AddAllergy from './AddAllergy';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../../constants/Spinner';
import {
    deleteAllergyAction,
    getAllergiesOfPatientAction,
    getAllergyDetailsAction,
} from '../../../../redux/allergyList/action';
import UpdateAllergy from './UpdateTasks/UpdateAllergy';

const AllergyList = () => {
    const [showAddAllergy, setShowAddAllergy] = useState(false);
    const [showUpdateAllergy, setShowUpdateAllergy] = useState(false);
    const [selectedAllergy, setSelectedAllergy] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [searchParams] = useSearchParams();
    const [allergyModal, setAllergyModal] = useState(false);
    const patientId = searchParams.get('id');
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const allergyData = store?.getAllergiesOfAPatientReducer?.data?.allergies;
    const deleteStatus = store?.deleteAllergyReducer?.data?.status;

    useEffect(() => {
        const data = {
            patientId: patientId,
        };

        dispatch(getAllergiesOfPatientAction(data));
    }, [dispatch, patientId]);

    const handleEditClick = (allergy) => {
        setSelectedAllergy(allergy);
        setShowUpdateAllergy(true);
        setAllergyModal(true); // Open Modal
    };

    useEffect(() => {
        if (deleteStatus === 200) {
            const data = {
                patientId: patientId,
            };
            dispatch(getAllergiesOfPatientAction(data));
        }
    }, [deleteStatus, dispatch, patientId]);
    const stripHtml = (html) => {
        // Remove any <ul> or <li> tags with margin
        return (
            html
                ?.replace(/<ul>/g, '<ul style="margin-bottom: 0px !important;">')
                .replace(/<li>/g, '<li style="margin-bottom: 0px;">')
                ?.replace(/<[^>]+>/g, '') || ''
        );
    };
    const sanitizeNoteHtml = (html) => {
        if (!html) return 'N/A';
        return html
            .replace(/<ul>/g, '<ul style="margin-bottom: 0px; padding-left: 0px;">')
            .replace(/<p>/g, '<ul style="margin-bottom: 0px; padding-left: 0px;">')
            .replace(/<li>/g, '<li style="margin-bottom: 0px;">');
    };

    const handleDelete = (data) => {
        dispatch(deleteAllergyAction({ id: data?._id }));
    };
    return (
        <>
            <div className="scroll-container" style={{ overflowY: 'scroll', overflowX: 'hidden', height: '70vh' }}>
                <Row>
                    <Col sm={12} className="d-flex justify-content-between mt-2">
                        <h4>Allergy List</h4>
                        <Button
                            className="custom-buttons text-nowrap"
                            onClick={() => {
                                setSelectedAllergy(null); // Clear any previously selected allergy
                                setShowUpdateAllergy(false); // Ensure update mode is off
                                setAllergyModal(true); // Open the modal
                            }}>
                            <FiPlus className="fs-5 text-white" />
                            &nbsp; Add Allergy
                        </Button>
                    </Col>
                    <Col sm={12}>
                        <Table responsive className="table-centered table-nowrap mb-0">
                            <thead className="text-white bg-dark">
                                <tr key="">
                                    <th className="text-white">Sr.No.</th>

                                    {/* <th className="text-white">Verification Status</th> */}
                                    <th className="text-white">Clinical Status</th>
                                    <th className="text-white">Category</th>
                                    <th className="text-white">Allergy</th>
                                    {/* <th className="text-white">Verification Status</th> */}
                                    {/* <th className="text-white">Criticality</th> */}
                                    <th className="text-white">Date</th>
                                    {/* <th className="text-white">Notes</th> */}
                                    <th className="text-white">Action</th>
                                </tr>
                            </thead>
                            {store?.getAllergiesOfAPatientReducer?.loading ? (
                                <tr>
                                    <td className="text-center" colSpan={10}>
                                        <Spinner className=" my-5 " />
                                    </td>
                                </tr>
                            ) : (
                                <tbody>
                                    {allergyData?.length === 0 ? (
                                        <tr key="">
                                            <td colSpan={10} className="text-center">
                                                <h3 className="my-5">No Allergy Found!</h3>
                                            </td>
                                        </tr>
                                    ) : (
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
                                                    {data?.code?.coding?.[0]?.display?.length > 30
                                                        ? data?.code?.coding?.[0]?.display?.slice(0, 29) + '...'
                                                        : data?.code?.coding?.[0]?.display || 'N/A'}
                                                </td>
                                                {/* <td className="text-capitalize">
                                                        {data?.verificationStatus?.coding?.[0]?.display || 'N/A'}
                                                    </td> */}
                                                {/* <td className="text-capitalize">
                                                        {data?.type?.coding?.[0]?.display || 'N/A'}
                                                    </td> */}

                                                {/* <td className="text-capitalize">
                                                        {data?.criticality?.display || 'N/A'}
                                                    </td> */}
                                                <td className="text-capitalize">
                                                    {data?.onset?.onsetDateTime
                                                        ? new Date(data.onset.onsetDateTime).toISOString().split('T')[0]
                                                        : 'N/A'}
                                                </td>

                                                {/* <td
                                                    className="text-capitalize mb-0"
                                                    title={stripHtml(data?.note?.[0]?.text)}>
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                data?.note?.[0]?.text?.length > 35
                                                                    ? sanitizeNoteHtml(
                                                                          data?.note?.[0]?.text.slice(0, 34)
                                                                      ) + '...'
                                                                    : sanitizeNoteHtml(data?.note?.[0]?.text) || 'N/A',
                                                        }}
                                                    />
                                                </td> */}
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
                                                            dispatch(getAllergyDetailsAction(requestData));
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
                            )}
                        </Table>
                    </Col>
                </Row>
                {/* )} */}
            </div>

            <Modal show={allergyModal} onHide={() => setAllergyModal(false)} size="lg" centered>
                <Modal.Header closeButton className="px-2 py-0 ">
                    <Modal.Title className="mb-0"> {showUpdateAllergy ? 'Update Allergy' : 'Add Allergy'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showUpdateAllergy ? (
                        <UpdateAllergy
                            allergy={selectedAllergy}
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
