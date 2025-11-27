import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import Spinner from '../../../../constants/Spinner';
import { FormInput } from '../../../../components';
import { FiFileText, FiFilter } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { decryptMessage, encryptMessage } from '../../../../cryptoUtils';
import {
    getMastersDataAction,
    updateMastersDataAction,
} from '../../../../redux/settings/action';
import { IoMdClose } from 'react-icons/io';
import { IoSearchSharp } from 'react-icons/io5';
import ConsultationModal from './ConsultationModal';
import Paginations from '../../../../helpers/Paginations';
import { formatDateByUserTimeZone } from '../../../../components/timeZonePipe';

const ConsultationRoom = () => {
    const store = useSelector((state) => state);
    // const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const clinic_id = decryptMessage(localStorage?.getItem('subClinicLocation')) || '';
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm();
    const dispatch = useDispatch();
    const nameValue = watch('name');
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(true);
    const [skip, setSkip] = useState(1);
    const [edit, setEdit] = useState(null);
    const [consultationModal, setConsultationModal] = useState(false);

    const handleEdit = (data) => {
        setEdit(data);
        setConsultationModal(true);
    };

    const tableGetData = store?.getMastersDataReducer?.data1?.data?.result;

    useEffect(() => {
        dispatch(
            getMastersDataAction({
                status: status,
                category: 'Consultation Room',
                search: search,
                limit: 10,
                skip: skip,
            })
        );
    }, [dispatch, status, search, skip]);

    const handleStatusChange = (data) => {
        setStatus(data);
        setSearch('');
        setSkip(1);
    };

    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };

    const handleUpdate = (data) => {
        const payload = {
            id: data?._id,
            isActive: !data?.isActive,
            category: 'Consultation Room',
        };
        dispatch(updateMastersDataAction({ key: encryptMessage(payload) }));
    };

    const closeConsultationModal = () => {
        setConsultationModal(false);
        setEdit(null);
        reset();
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
                                        className={`active_inactive_buttons ${status === true ? 'text-white' : 'bg-white border-primary text-dark'
                                            } me-2`}>
                                        Active
                                    </Button>

                                    <Button
                                        variant={status === false ? 'outlined' : ''}
                                        onClick={() => handleStatusChange(false)}
                                        className={` active_inactive_buttons ${status === false ? 'text-white' : 'bg-white border-primary text-dark'
                                            } me-2`}>
                                        Inactive
                                    </Button>
                                </Col>
                                <Col sm={6} className="text-end mt-md-0 mt-2 mt-sm-0">
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col xs="auto" className="d-flex gap-2">
                                            <div
                                                className="input_search_box position-relative"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#e8f0fe',
                                                    padding: '0px 5px',
                                                    minWidth: 180,
                                                }}>
                                                <FormInput
                                                    type="text"
                                                    value={search}
                                                    onChange={(e) => {
                                                        setSearch(e.target.value);
                                                        setSkip(1);
                                                    }}
                                                    placeholder="Search..."
                                                    className="pe-4"
                                                    style={{
                                                        border: 'none',
                                                        outline: 'none',
                                                        flex: 1,
                                                        backgroundColor: '#ccc',
                                                        paddingRight: 30,
                                                    }}
                                                />
                                                {search ? (
                                                    <IoMdClose
                                                        style={{
                                                            fontSize: '1.2rem',
                                                            color: 'lightgray',
                                                            position: 'absolute',
                                                            right: 10,
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => {
                                                            setSearch('');
                                                            setSkip(1);
                                                        }}
                                                    />
                                                ) : (
                                                    <IoSearchSharp
                                                        style={{
                                                            fontSize: '1.2rem',
                                                            color: 'lightgray',
                                                            position: 'absolute',
                                                            right: 10,
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <Button className="custom-buttons py-0">
                                                <FiFilter className="fs-5" />
                                            </Button>
                                            <Button className="custom-buttons py-0">
                                                <FiFileText className="fs-5" />
                                            </Button>
                                            <Button
                                                onClick={() => setConsultationModal(true)}
                                                className="custom-buttons py-1">
                                                New consultation Room
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Table responsive className="table-centered table-nowrap mb-0 rounded">
                                <thead className="table-dark">
                                    <tr>
                                        <th>S.No.</th>
                                        <th>Consultation Room Name</th>
                                        <th>Description</th>
                                        <th>Created Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store?.getMastersDataReducer?.data1?.loading ? (
                                        <tr>
                                            <td colSpan={6} className="text-center">
                                                <Spinner />
                                            </td>
                                        </tr>
                                    ) : tableGetData?.length ? (
                                        tableGetData?.map((data, index) => (
                                            <tr key={data._id} className="border-bottom">
                                                <td>{index + 1}</td>
                                                <td>{data?.name?.charAt(0).toUpperCase() + data?.name?.slice(1)}</td>
                                                <td>{data.description || 'N/A'}</td>
                                                <td>
                                                    {formatDateByUserTimeZone(data.createdAt, {}, 'date')}
                                                </td>
                                                <td>
                                                    <Form.Switch
                                                        checked={data.isActive}
                                                        onChange={() => handleUpdate(data)}
                                                    />
                                                </td>
                                                <td>
                                                    <i
                                                        className="mdi mdi-square-edit-outline cursor-pointer fs-4 text-primary"
                                                        onClick={() => handleEdit(data)}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center">
                                                <h3 className="my-5">No Data Found</h3>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                            {tableGetData?.length > 0 && (
                                <Row>
                                    <Col className="mt-2 d-flex justify-content-end">
                                        <Paginations
                                            currentPage={skip}
                                            totalPages={
                                                store?.getMastersDataReducer?.data1?.data?.pagination?.totalPages
                                            }
                                            onPageChange={handlePageChange}
                                        />
                                    </Col>
                                </Row>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <ConsultationModal
                    show={consultationModal}
                    onClose={closeConsultationModal}
                    defaultValues={edit}
                    isEdit={!!edit}
                />
            </Row>
        </div>
    );
};

export default ConsultationRoom;
