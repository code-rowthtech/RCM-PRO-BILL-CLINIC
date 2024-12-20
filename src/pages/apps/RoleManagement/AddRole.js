import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Row, Col, Spinner } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { createRolesAction, getRoleDataAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import { useDispatch, useSelector } from 'react-redux';
import { getMastersDataAction } from '../../../redux/settings/action';

const AddRole = ({ show, close }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const idFromStorage = JSON.parse(sessionStorage.getItem('hyper_user'));
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId
    const decryptedRolesData = store?.getRoleDataReducer?.data?.roles;
    const createLoading = store?.createRolesReducer?.loading
    const createStatus = store?.createRolesReducer?.data
    console.log({ createStatus })

    const tableGetData = store?.getMastersDataReducer?.data?.result;

    const userId = store?.getUserDataReducer?.data
    console.log({ tableGetData })

    const [showPassword, setShowPassword] = useState(false);

    const { register, reset, handleSubmit, formState: { errors }, getValues } = useForm();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    useEffect(() => {
        dispatch(getRoleDataAction({ clinicId: clinicId, limit: 10, search: '', page: 1, status: true }));
        dispatch(getMastersDataAction({ status: true, category: 'Department', search: '', skip: '', limit: '' }))

    }, [getRoleDataAction])
    const onSubmit = (data) => {
        const formattedJoiningDate = new Date(data.joiningDate).toISOString();
        // const formattedLeavingDate = new Date(data.leavingDate).toISOString();
        const payload = {
            firstName: data.name,
            email: data.email,
            password: data.password,
            phone: data?.phone,
            clinicId: clinicId,
            reportingTo: data?.reportingTo,
            joiningDate: formattedJoiningDate,
            role: data.role,
        };
        console.log('Form Data:', payload);

        if (createStatus === 200) {
            reset();
            close()
        }
        dispatch(createRolesAction({ key: `${encryptMessage(payload)}` }));
        dispatch(getRoleDataAction({ clinicId: clinicId, limit: 10, search: '', page: 1, status: true }));
        reset();
        close()


    };

    return (
        <>
            <Modal centered show={show} size="md" onHide={close}>
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">
                                Add New User
                            </h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={close} />
                        </Col>
                    </Row>
                    {/* Form with handleSubmit to trigger onSubmit */}
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder=" Name"
                                        {...register('name', {
                                            required: 'Name is required',
                                            pattern: {
                                                value: /^(?! )[A-Za-z0-9 ]*$/,
                                                message: 'Special characters and leading spaces are not allowed',
                                            },
                                        })}
                                    />
                                    {errors.name && <span className="text-danger fs-6">{errors.name.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">Email ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder=" Email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Invalid email format',
                                            },
                                        })}
                                    />
                                    {errors.email && <span className="text-danger fs-6">{errors.email.message}</span>}
                                </Form.Group>
                            </Col>
                        
                            <Col sm={6}>
                                <Form.Group className="mb-1 position-relative">
                                    <Form.Label className="mb-0">Password</Form.Label>
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters',
                                            },
                                        })}
                                    />
                                    <span
                                        className="position-absolute"
                                        style={{ top: '35px', right: '10px', cursor: 'pointer' }}
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                    {errors.password && (
                                        <span className="text-danger fs-6">
                                            {errors.password.message}
                                        </span>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1 position-relative">
                                    <Form.Label className="mb-0">Confirm Password</Form.Label>
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Confirm password"
                                        {...register('confirmPassword', {
                                            required: 'Confirm password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters',
                                            },
                                        })}
                                    />
                                    <span
                                        className="position-absolute d-flex align-items-center justify-content-center"
                                        style={{
                                            top: '35px',
                                            right: '10px',
                                            cursor: 'pointer',
                                            fontSize: '1.2rem',
                                            color: '#666',
                                            transition: 'color 0.3s ease-in-out',
                                        }}
                                        onClick={togglePasswordVisibility}
                                        onMouseEnter={(e) => (e.target.style.color = '#000')}
                                        onMouseLeave={(e) => (e.target.style.color = '#666')}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>

                                    {errors.confirmPassword && (
                                        <span className="text-danger fs-6">
                                            {errors.confirmPassword.message}
                                        </span>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">Date of Joining</Form.Label>
                                    <Form.Control
                                        type="date"
                                        {...register('joiningDate', { required: 'Joining date is required' })}
                                    />
                                    {errors.joiningDate && <span className="text-danger fs-6">{errors.joiningDate.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">Reporting</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder=" Reporting"
                                        {...register('reportingTo', {
                                            required: 'Reporting is required',
                                            pattern: {
                                                value: /^(?! )[A-Za-z0-9 ]*$/,
                                                message: 'Special characters and leading spaces are not allowed',
                                            },
                                        })}
                                    />
                                    {errors.reportingTo && <span className="text-danger fs-6">{errors.reportingTo.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">Contact No.</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder=" contact number"
                                        {...register('contact', {
                                            required: 'Contact number is required',
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: 'Only 10-digit numbers are allowed',
                                            },
                                        })}
                                    />
                                    {errors.contact && <span className="text-danger fs-6">{errors.contact.message}</span>}
                                </Form.Group>
                            </Col>
                         

                        

                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">Contact Number secondary  </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder=" phone number"
                                        {...register('phone', {
                                            required: 'Contact Number secondary   number is required',
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: 'Only 10-digit numbers are allowed',
                                            },
                                        })}
                                    />
                                    {errors.phone && <span className="text-danger fs-6">{errors.phone.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">Role</Form.Label>
                                    <Form.Select
                                        {...register('role', { required: 'Role is required' })}
                                    >
                                        <option value="">Select Role</option>
                                        {decryptedRolesData?.map((data) => (
                                            <option key={data._id} value={data.name}>
                                                {data.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.role && (
                                        <span className="text-danger fs-6">{errors.role.message}</span>
                                    )}
                                </Form.Group>
                            </Col>


                          

                        </Row>
                        <Modal.Footer className="border-0 py-0">
                            <Button type="button" className="custom-buttons" onClick={close}>
                                Cancel
                            </Button>


                            <Button type="submit" variant="primary" className="ms-2" disabled={createLoading}>
                                {createLoading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />

                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </Button>

                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AddRole;
