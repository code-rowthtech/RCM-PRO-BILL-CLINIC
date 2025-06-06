import React, { useEffect, useState } from 'react';
import { FormInput } from 'lucide-react';
import { Button, Card, Col, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { FiFileText, FiFilter, FiUploadCloud } from 'react-icons/fi';
import { IoMdClose, IoMdRefresh } from 'react-icons/io';
import { IoSearchSharp } from 'react-icons/io5';
import { MdFileDownload } from 'react-icons/md';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { getMastersDataAction } from '../../../redux/settings/action';
import { useDispatch } from 'react-redux';
import { getDoctorsAction, getPatientsAction, getRolesAction } from '../../../redux/actions';
import { loggedInUser } from '../../../helpers/api/loggedInUser';
import { encryptMessage } from '../../../cryptoUtils';
import { createUserTasksAction } from '../../../redux/Tasks/action';

const ModalTask = ({ show, handleClose }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const CategoryData = store?.getMastersDataReducer?.data1?.data?.result;
    const roleData = store?.getRolesDataReducer?.data;
    const clinicId = loggedInUser?.clinicId;
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const patientsData = store?.getPatientsReducer?.data?.data;
    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        clearErrors,

        formState: { errors },
    } = useForm({
        defaultValues: {
            title: '',
            assignTo: '',
            category: '',
            status: 'open',
            dueDate: '',
            priority: 'medium',
            patient: '',
            note: '<ul><li></li></ul>',
        },
    });

    // const doctorsData = doctorDetails?.map((data) => ({
    //     _id: data?._id,
    //     name: data?.name?.[0]?.text,
    // }));

    // const rolesData = roleData?.users?.map((data) => ({
    //     _id: data?._id,
    //     name: data?.name?.text,
    //     department: data?.department,
    // }));

    // const finalData = doctorsData?.concat(rolesData);
    useEffect(() => {
        dispatch(getMastersDataAction({ status: '', category: 'task-category', limit: 10, skip: '', search: '' }));
    }, [dispatch]);
    useEffect(() => {
        dispatch(
            getRolesAction({
                clinicId: clinicId,
                limit: 10,
                search: '',
                page: 1,
                status: true,
            })
        );
    }, [dispatch]);
    useEffect(() => {
        const data = {
            clinicId: clinicId,
            page: 1,
            limit: 10,
            search: '',
        };
        dispatch(getPatientsAction(data));
    }, [dispatch]);

    // Reset form when modal closes
    useEffect(() => {
        if (!show) reset();
    }, [show, reset]);

    const onSubmit = (data) => {
        console.log(data, 'Task Modal Data:')
        dispatch(createUserTasksAction({ key: `${encryptMessage(data)}` }));
    };

    const handleReset = () => {
        reset();
        handleClose();
    };
    useEffect(() => {
        const doctorPayload = { status: '', search: '' };
        dispatch(getDoctorsAction(doctorPayload));
    }, [dispatch]);

    return (
        <>
            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header className="px-2 py-0" closeButton>
                    <Modal.Title>Add Task</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label>
                                        Task Title<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Task Title (required)"
                                        {...register('title', { required: 'Task title is required.' })}
                                    />
                                    {errors.title && (
                                        <Form.Text className="text-danger">{errors.title.message}</Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label>
                                        Assign To<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Controller
                                        name="assignTo"
                                        control={control}
                                        rules={{ required: 'Assign to is required.' }}
                                        render={({ field }) => (
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isClearable={true}
                                                isSearchable={true}
                                                name="assignTo"
                                                options={[
                                                    ...(doctorDetails?.map((t) => ({
                                                        value: t._id,
                                                        label: (
                                                            <span>
                                                                {t?.name?.[0]?.text || t?.name?.text || 'Unnamed'}
                                                                <span
                                                                    style={{
                                                                        fontSize: 10,
                                                                        marginLeft: 4,
                                                                        color: '#888',
                                                                    }}>
                                                                    (Doctor)
                                                                </span>
                                                            </span>
                                                        ),
                                                    })) || []),
                                                    ...(roleData?.users?.map((t) => ({
                                                        value: t._id,
                                                        label: (
                                                            <span>
                                                                {t?.name?.text || 'Unnamed'}
                                                                <span
                                                                    style={{
                                                                        fontSize: 10,
                                                                        marginLeft: 4,
                                                                        color: '#888',
                                                                    }}>
                                                                    (User)
                                                                </span>
                                                            </span>
                                                        ),
                                                    })) || []),
                                                ]}
                                                placeholder=" Select"
                                                value={
                                                    [
                                                        ...(doctorDetails?.map((t) => ({
                                                            value: t._id,
                                                            label: (
                                                                <span>
                                                                    {t?.name?.[0]?.text || t?.name?.text || 'Unnamed'}
                                                                    <span
                                                                        style={{
                                                                            fontSize: 10,
                                                                            marginLeft: 4,
                                                                            color: '#888',
                                                                        }}>
                                                                        (Doctor)
                                                                    </span>
                                                                </span>
                                                            ),
                                                        })) || []),
                                                        ...(roleData?.users?.map((t) => ({
                                                            value: t._id,
                                                            label: (
                                                                <span>
                                                                    {t?.name?.text || 'Unnamed'}
                                                                    <span
                                                                        style={{
                                                                            fontSize: 10,
                                                                            marginLeft: 4,
                                                                            color: '#888',
                                                                        }}>
                                                                        (User)
                                                                    </span>
                                                                </span>
                                                            ),
                                                        })) || []),
                                                    ].find((option) => option.value === field.value) || null
                                                }
                                                onChange={(option) => field.onChange(option ? option.value : '')}
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        height: '30px',
                                                        minHeight: '30px',
                                                        border: '0px',
                                                    }),
                                                    placeholder: (provided) => ({
                                                        ...provided,
                                                        fontWeight: 'bold',
                                                        fontSize: '12px',
                                                        paddingBottom: '5px',
                                                    }),
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.assignTo && (
                                        <Form.Text className="text-danger">{errors.assignTo.message}</Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-1">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select {...register('category')}>
                                        <option value="">Select</option>
                                        {CategoryData?.map((category) => (
                                            <option key={category?._id} value={category?._id}>
                                                {category?.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>
                                        Status<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select {...register('status', { required: 'Status is required.' })}>
                                        <option value="open">Open</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </Form.Select>
                                    {errors.status && (
                                        <Form.Text className="text-danger">{errors.status.message}</Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Due Date</Form.Label>
                                    <div className="d-flex align-items-center">
                                        <Form.Control type="date" {...register('dueDate')} />
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-1">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>
                                        Priority<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select {...register('priority', { required: 'Priority is required.' })}>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="low">Low</option>
                                    </Form.Select>
                                    {errors.priority && (
                                        <Form.Text className="text-danger">{errors.priority.message}</Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>
                                        Associated Patient <span className="text-secondary">(If any)</span>
                                    </Form.Label>
                                    <Controller
                                        name="patient"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={
                                                    patientsData?.map((patient) => ({
                                                        value: patient._id,
                                                        label:
                                                            patient?.name?.[0]?.text ||
                                                            patient?.name?.text ||
                                                            'Unnamed',
                                                    })) || []
                                                }
                                                placeholder="Select"
                                                className="basic-single w-100"
                                                classNamePrefix="select"
                                                isClearable
                                                value={
                                                    patientsData
                                                        ?.map((patient) => ({
                                                            value: patient._id,
                                                            label:
                                                                patient?.name?.[0]?.text ||
                                                                patient?.name?.text ||
                                                                'Unnamed',
                                                        }))
                                                        .find((option) => option.value === field.value) || null
                                                }
                                                onChange={(val) => field.onChange(val ? val.value : '')}
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        height: '30px',
                                                        minHeight: '30px',
                                                        border: '0px',
                                                    }),
                                                    placeholder: (provided) => ({
                                                        ...provided,
                                                        fontWeight: 'bold',
                                                        fontSize: '12px',
                                                        paddingBottom: '5px',
                                                    }),
                                                }}
                                            />
                                        )}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Col xs={12} className="mt-0 mb-5">
                            <Form.Group controlId="notes">
                                <Form.Label className="fw-medium mb-1">Notes</Form.Label>
                                <Controller
                                    name="note"
                                    control={control}
                                    defaultValue="<ul><li></li></ul>"
                                    render={({ field: { onChange, value } }) => (
                                        <div style={{ width: '100%', maxHeight: '25vh' }}>
                                            <ReactQuill
                                                value={value}
                                                onChange={(content, delta, source) => {
                                                    if (source === 'user') {
                                                        onChange(content);
                                                    }
                                                }}
                                                theme="snow"
                                                placeholder="Enter detailed notes here..."
                                                style={{ height: '20vh', backgroundColor: 'white' }}
                                                modules={{
                                                    toolbar: [
                                                        [{ header: [1, 2, false] }],
                                                        ['bold', 'italic', 'underline', 'strike'],
                                                        [{ list: 'ordered' }, { list: 'bullet' }],
                                                        ['clean'],
                                                    ],
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </Form.Group>
                        </Col>
                        <div className="d-flex justify-content-between">
                            <span className="text-danger">{errors.title ? errors.title.message : ''}</span>
                            <div className="d-flex gap-2">
                                <Button
                                    variant=""
                                    className="cancel-button text-white"
                                    type="button"
                                    onClick={handleReset}>
                                    Reset
                                </Button>{' '}
                                <Button variant="primary" className="custom-buttons" type="submit">
                                    Create task
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ModalTask;
