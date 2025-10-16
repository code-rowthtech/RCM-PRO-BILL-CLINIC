import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import Spinner from '../../../../constants/Spinner';
import { FormInput } from '../../../../components';
import { FiFileText, FiFilter } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { decryptMessage, encryptMessage } from '../../../../cryptoUtils';
import {
    createMastersDataAction,
    getDepartmentDataAction,
    getMastersDataAction,
    updateMastersDataAction,
} from '../../../../redux/settings/action';
import { IoMdClose } from 'react-icons/io';
import Paginations from '../../../../helpers/Paginations';
import { formatDate } from '../../../../helpers/dateFormat';
import { IoSearchSharp } from 'react-icons/io5';
import { formatDateByUserTimeZone } from '../../../../components/timeZonePipe';

const POV = () => {
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
    const [purposeOfVisit, setPurposeOfVisit] = useState(false);
    const [edit, setEdit] = useState(null);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(true);
    const [skip, setSkip] = useState(1);

    const closeAddModal = () => {
        setPurposeOfVisit(false);
        setEdit(null);
        reset();
    };

    const handleEdit = (data) => {
        setEdit(data);
        setValue('name', data.name);
        setValue('reEnterName', data.name);
        setValue('description', data.description);
        setPurposeOfVisit(true);
    };

    const addDepartment = (data) => {
        const payload = {
            //   id: edit?._id,
            ...(edit ? { id: edit?._id } : {}),
            name: data?.name,
            description: data?.description || 'N/A',
            category: 'purposeOfVisit',
            clinicId: clinic_id,
            showTo: 'clinic',
        };
        if (edit) {
            dispatch(updateMastersDataAction({ key: encryptMessage(payload) }));
        } else {
            dispatch(createMastersDataAction({ key: encryptMessage(payload) }));
        }
    };

    const createResponse = store?.createMastersDataReducer?.data?.status;
    const tableGetData = store?.getMastersDataReducer?.data1?.data?.result;

    const updateResponse = store?.updateMastersDataReducer?.data?.status;
    useEffect(() => {
        if (createResponse === 200) {
            setPurposeOfVisit(false);
            reset();
        }
    }, [createResponse]);
    useEffect(() => {
        if (updateResponse === 200) {
            setPurposeOfVisit(false);
            reset();
            setEdit(null);
        }
    }, [updateResponse]);
    useEffect(() => {
        dispatch(getMastersDataAction({ status, category: 'purposeOfVisit', limit: 10, skip, search }));
    }, [dispatch, status, search, skip]);
    useEffect(() => {
        if (createResponse === 200) {
            dispatch(getMastersDataAction({ status, category: 'purposeOfVisit', limit: 10, skip, search }));
            closeAddModal();
        }
    }, [createResponse]);
    useEffect(() => {
        if (updateResponse === 200) {
            dispatch(getMastersDataAction({ status, category: 'purposeOfVisit', limit: 10, skip, search }));
            closeAddModal();
        }
    }, [updateResponse]);
    const handleStatusChange = (isActive) => {
        setStatus(isActive);
        setSearch('');
    };
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
    const handleUpdate = (data) => {
        const payload = { id: data?._id, isActive: !data?.isActive, category: 'purposeOfVisit' };
        dispatch(updateMastersDataAction({ key: encryptMessage(payload) }));
    };

    return (
        <Row className="mt-2">
            <Col xs={12} className="px-0">
                <Card className="scroll-container page-height">
                    <Card.Body>
                        <Row className="mb-2">
                            <Col sm={6}>
                                <Button
                                    variant={status === false ? 'outlined' : ''}
                                    onClick={() => handleStatusChange(true)}
                                    className={`active_inactive_buttons ${status ? 'text-white' : 'bg-white border-primary text-dark'
                                        } me-2 py-1`}>
                                    Active
                                </Button>
                                <Button
                                    variant={status === true ? 'outlined' : ''}
                                    onClick={() => handleStatusChange(false)}
                                    className={` active_inactive_buttons ${!status ? 'text-white' : 'bg-white border-primary text-dark'
                                        } me-2 py-1`}>
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
                                        <Button className="custom-buttons">
                                            <FiFilter className="fs-4" />
                                        </Button>
                                        <Button className="custom-buttons">
                                            <FiFileText className="fs-4" />
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setPurposeOfVisit(true);
                                                setEdit(null);
                                            }}
                                            className="custom-buttons">
                                            New Purpose
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Table
                            responsive
                            className="table-centered table-nowrap mb-0  rounded"
                            style={{ height: tableGetData?.length === 0 ? '' : 'auto' }}>
                            <thead className="text-white">
                                <tr>
                                    <th className="text-white">S.No.</th>
                                    <th className="text-white">Purpose Name</th>
                                    <th className="text-white">Description</th>
                                    <th className="text-white">Created Date</th>
                                    <th className="text-white">Status</th>
                                    <th className="text-white">Action</th>
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
                                            <td>{data?.name}</td>
                                            <td>
                                                {data?.description?.length > 50
                                                    ? data?.description?.slice(0, 50) + '...'
                                                    : data?.description}
                                            </td>
                                            <td>
                                                {formatDateByUserTimeZone(data.createdAt, {}, 'date')}
                                            </td>
                                            <td>
                                                <Form.Switch
                                                    className={data.isActive ? 'custom-active' : ''}
                                                    checked={data.isActive}
                                                    onChange={() => handleUpdate(data)}
                                                />
                                            </td>
                                            <td>
                                                <i
                                                    className="mdi mdi-square-edit-outline cursor-pointer fs-4 text-primary"
                                                    onClick={() => handleEdit(data)}></i>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr key={''}>
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
                                        totalPages={store?.getMastersDataReducer?.data1?.data?.pagination?.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </Col>
                            </Row>
                        )}
                    </Card.Body>
                </Card>
            </Col>

            <Modal centered show={purposeOfVisit} onHide={closeAddModal}>
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2">
                        <Col sm={11} className="text-center">
                            <h4>{edit ? 'Edit Purpose' : 'New Purpose'}</h4>
                        </Col>
                        {/* <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeAddModal} />
                        </Col> */}
                    </Row>
                    <Form onSubmit={handleSubmit(addDepartment)}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>
                                        Purpose Name <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register('name', {
                                            required: 'Name is required',
                                            validate: {
                                                noEmpty: (value) =>
                                                    value.trim() !== '' || 'Name cannot be empty or only spaces',
                                                noSpacesBeforeText: (value) =>
                                                    !/^\s/.test(value) || 'First character cannot be a space',
                                            },
                                        })}
                                        placeholder="Enter Purpose Name"
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            // Prevent spaces when input is empty
                                            if (value.trim() === '') {
                                                e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
                                            }
                                        }}
                                    />
                                    {errors.name && <p className="text-danger">{errors.name.message}</p>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>
                                        Re-Enter Name <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register('reEnterName', {
                                            required: 'Re-enter Purpose name',
                                            validate: {
                                                noEmpty: (value) =>
                                                    value.trim() !== '' || 'Name cannot be empty or only spaces',
                                                noSpacesBeforeText: (value) =>
                                                    !/^\s/.test(value) || 'First character cannot be a space',
                                                matchName: (value) => value === watch('name') || 'Name do not match', // Match with 'name' field value
                                            },
                                        })}
                                        placeholder="Re-enter Purpose Name"
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            // Prevent spaces when input is empty
                                            if (value.trim() === '') {
                                                e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
                                            }
                                        }}
                                    />

                                    {errors.reEnterName && <p className="text-danger">{errors.reEnterName.message}</p>}
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        {...register('description')}
                                        placeholder="Enter description"
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            // Prevent spaces when input is empty
                                            if (value.trim() === '') {
                                                e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
                                            }
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Modal.Footer>
                            <Button onClick={closeAddModal} className="custom-buttons">
                                Close
                            </Button>
                            <Button type="submit" className="custom-buttons" style={{ width: '65px' }}>
                                {store?.createMastersDataReducer?.loading ||
                                    store?.updateMastersDataReducer?.loading ? (
                                    <div class="spinner-border spinner-border-sm" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </Row>
    );
};

export default POV;
