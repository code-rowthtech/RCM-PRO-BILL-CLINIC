import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { FiFileText, FiFilter } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { IoSearchSharp } from 'react-icons/io5';
import Paginations from '../../../../helpers/Paginations';
import ConsentModal from './ConsentModal';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { deleteConsentFormAction, getConsentFormAction, updateConsentFormAction } from '../../../../redux/settings/action';
import Spinner from '../../../../constants/Spinner';
import { formatDateByUserTimeZone } from '../../../../components/timeZonePipe';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { encryptMessage } from '../../../../cryptoUtils';

const Consent = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const consentForms = store?.getConsentFormReducer?.data?.documents;
    const createResponse = store?.createConsentFormReducer?.data?.status;
    const updateResponse = store?.updateConsentFormReducer?.data?.status;
    const deleteResponse = store?.deleteConsentFormReducer?.data?.status;
    const [confirmationModal, setConfirmationModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [status, setStatus] = useState(true);
    const [skip, setSkip] = useState(1);
    const [consentModal, setConsentModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        dispatch(getConsentFormAction({ limit: 10, page: skip, status }));
    }, [dispatch, skip, status]);

    useEffect(() => {
        if (createResponse === 201 || deleteResponse === 200 || updateResponse === 200) {
            dispatch(getConsentFormAction({ limit: 10, skip: 1, status }));
            setDeleteId(null);
            setConfirmationModal(false);
        }
    }, [createResponse, deleteResponse, updateResponse]);

    const handleStatusChange = (data) => {
        setStatus(data);
        setSkip(1);
    };

    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };

    const closeConsentModal = () => {
        setConsentModal(false);
        setEditData(null);
        setIsEdit(false);
    };

    const handleUpdate = (data) => {
        const payload = { id: data?._id, body: { status: !data?.status } };
        dispatch(updateConsentFormAction({ id: payload?.id, key: encryptMessage(payload?.body) }));
    };
    return (
        <div>
            <Row className="mt-2">
                <Col xs={12} className="px-0">
                    <Card className="scroll-container page-height">
                        <Card.Body>
                            <Row className="mb-2 ">
                                <Col sm={6}>
                                    <Button
                                        variant={status === true ? 'outlined' : ''}
                                        onClick={() => handleStatusChange(true)}
                                        className={`active_inactive_buttons ${status === true
                                            ? 'text-white'
                                            : 'bg-white border-primary text-dark'
                                            } me-2`}>
                                        Active
                                    </Button>

                                    <Button
                                        variant={status === false ? 'outlined' : ''}
                                        onClick={() => handleStatusChange(false)}
                                        className={`active_inactive_buttons ${status === false
                                            ? 'text-white'
                                            : 'bg-white border-primary text-dark'
                                            } me-2`}>
                                        Inactive
                                    </Button>
                                </Col>
                                <Col sm={6} className="text-end mt-md-0 mt-2 mt-sm-0">
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col xs="auto" className="d-flex gap-2">
                                            <Button
                                                onClick={() => {
                                                    setEditData(null);
                                                    setIsEdit(false);
                                                    setConsentModal(true);
                                                }}
                                                className="custom-buttons py-1">
                                                New Consent
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Table responsive className="table-centered table-nowrap mb-0 rounded">
                                <thead className="table-dark">
                                    <tr>
                                        <th>S.No.</th>
                                        <th>Consent Name</th>
                                        <th>Document</th>
                                        <th>Created On</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store?.getConsentFormReducer?.loading ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-5">
                                                <div className='py-5 my-5'>
                                                    <Spinner />
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        !consentForms ? (
                                            <tr>
                                                <td colSpan={6} className="text-center">
                                                    <h5 className='py-5 my-5'>
                                                        No Data Found
                                                    </h5>
                                                </td>
                                            </tr>
                                        ) : (
                                            consentForms?.map((form, index) => (
                                                <tr key={index}>
                                                    <td>{(skip - 1) * 10 + index + 1}</td>
                                                    <td>{form?.title || '-'}</td>
                                                    <td
                                                        onClick={() => window.open(form?.consentDocument?.url?.split('?')[0], '_blank')}
                                                        title={form?.consentDocument?.fileName}
                                                        className='cursor-pointer text-info'
                                                    >
                                                        {form?.consentDocument?.fileName?.length > 30
                                                            ? form?.consentDocument?.fileName?.slice(0, 30) + '...'
                                                            : form?.consentDocument?.fileName || 'N/A'}
                                                    </td>
                                                    <td>
                                                        {formatDateByUserTimeZone(form?.createdAt, {}, 'date')}
                                                    </td>
                                                    <td>
                                                        <Form.Switch
                                                            className={form?.status ? 'custom-active' : ''}
                                                            checked={form?.status}
                                                            onChange={() => handleUpdate(form)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <i
                                                            onClick={() => {
                                                                setEditData(form);
                                                                setIsEdit(true);
                                                                setConsentModal(true);
                                                            }}
                                                            className="mdi mdi-square-edit-outline cursor-pointer fs-4 text-primary me-2"
                                                        />
                                                        {/* <i
                                                            onClick={() => {
                                                                setDeleteId(form?._id);
                                                                setConfirmationModal(true);
                                                            }}
                                                            className="bi bi-trash-fill cursor-pointer fs-4 text-danger" /> */}
                                                    </td>
                                                </tr>
                                            ))
                                        ))}
                                </tbody>
                                <ConfirmationModal show={confirmationModal}
                                    onConfirm={() => {
                                        dispatch(deleteConsentFormAction({ id: deleteId }))
                                    }}
                                    onCancel={() => {
                                        setDeleteId(null);
                                        setConfirmationModal(false);
                                    }} />
                            </Table>
                            <Row>
                                <Col className="mt-2 d-flex justify-content-end">
                                    <Paginations
                                        currentPage={skip}
                                        totalPages={store?.getConsentFormReducer?.data?.pagination?.pages}
                                        onPageChange={handlePageChange}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                <ConsentModal
                    show={consentModal}
                    onClose={closeConsentModal}
                    defaultValues={editData}
                    isEdit={isEdit}
                />
            </Row>
        </div>
    );
};

export default Consent;
