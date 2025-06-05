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
import { getDoctorsAction } from '../../../redux/actions';

const ModalTask = ({ show, handleClose, onSubmit: parentOnSubmit }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const CategoryData = store?.getMastersDataReducer?.data1?.data?.result;
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const [doctorSearch, setDoctorSearch] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    // Dummy patient options for select
    const patientOptions = [
        { value: '1', label: 'John Doe' },
        { value: '2', label: 'Jane Smith' },
        { value: '3', label: 'Alice Johnson' },
    ];

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
            priority: '',
            patient: '',
            note: '<ul><li></li></ul>',
        },
    });

    useEffect(() => {
        dispatch(getMastersDataAction({ status: '', category: 'task-category', limit: 10, skip: '', search: '' }));
    }, [dispatch]);

    // Reset form when modal closes
    useEffect(() => {
        if (!show) reset();
    }, [show, reset]);

    const onSubmit = (data) => {
        if (parentOnSubmit) parentOnSubmit(data);
        reset();
        handleClose();
    };

    const handleReset = () => {
        reset();
        handleClose();
    };
    useEffect(() => {
        const doctorPayload = { status: '', search: '' };
        dispatch(getDoctorsAction(doctorPayload));
    }, [dispatch]);
    const handleInputChange = (data) => {
        setDoctorSearch(data);
    };
    const doctorOptions = doctorDetails?.map((data) => ({
        value: data?._id,
        label: data?.name?.[0]?.text,
    }));
    const handleChange = (selectedOption) => {
        setSelectedDoctor(selectedOption);
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header className="px-2 py-0" closeButton>
                    <Modal.Title>Add Task</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                            <Col md={12}>
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
                                    <Select
                                        className="basic-single"
                                        classNamePrefix="select"
                                        isClearable={true}
                                        isSearchable={true}
                                        {...register('assignTo', { required: 'Assign to is required.' })}
                                        onChange={(data) => {
                                            setValue('assignTo', data);
                                            clearErrors('assignTo');
                                        }}
                                        name="assignTo"
                                        options={patientOptions}
                                        placeholder="&nbsp; Select "
                                    />
                                    {errors.assignTo && (
                                        <Form.Text className="text-danger">{errors.assignTo.message}</Form.Text>
                                    )}
                                </Form.Group>
                            </Col>

                        <Row className="mb-1">
                            <Col md={6}>
                                <Form.Group className="responnsible-party-select">
                                    <Form.Label>
                                        Provider
                                        <span className="text-secondary" style={{ fontSize: '10px' }}>
                                            (Doctor Name)
                                        </span>
                                        <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Select
                                        className="basic-single"
                                        classNamePrefix="select"
                                        isLoading={store?.getDoctorsReducer?.loading}
                                        isClearable={true}
                                        value={selectedDoctor}
                                        isSearchable={true}
                                        {...register('selectedDoctor')}
                                        onInputChange={(inputValue) => handleInputChange(inputValue, 'doctor')}
                                        onChange={(data) => {
                                            setValue('selectedDoctor', data);
                                            handleChange(data);
                                            clearErrors('selectedDoctor');
                                        }}
                                        name="doctorName"
                                        options={doctorOptions}
                                        placeholder="&nbsp; Select "
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
                                    {errors.selectedDoctor && (
                                        <Form.Text className="text-danger">{errors.selectedDoctor.message}</Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select {...register('category')}>
                                        <option value="">Select one</option>
                                        {CategoryData?.map((category) => (
                                            <option key={category?._id} value={category?._id}>
                                                {category?.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-1">
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
                                                options={patientOptions}
                                                placeholder="Select patient..."
                                                className="basic-single w-100"
                                                classNamePrefix="select"
                                                isClearable
                                                value={
                                                    patientOptions.find((option) => option.value === field.value) ||
                                                    null
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
