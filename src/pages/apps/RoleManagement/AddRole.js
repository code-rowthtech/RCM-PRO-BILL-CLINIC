import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { createRolesAction, getRoleDataAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import { useDispatch, useSelector } from 'react-redux';

const AddRole = ({ show, close }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const idFromStorage = JSON.parse(sessionStorage.getItem('hyper_user'));
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId
    const decryptedRolesData = store?.getRoleDataReducer?.data?.roles;

    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors }, getValues } = useForm();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
useEffect(()=>{
    dispatch(getRoleDataAction({ clinicId:clinicId,limit: 10, search: '',page:1, status: true }));

},[getRoleDataAction])
    const onSubmit = (data) => {
        const payload = {
            firstName: data.name,
            email: data.email,
            password: data.password,
            phone: data?.phone,
            clinicId: clinicId,
            createdById: idFromStorage?._id,
            joiningDate: data.joiningDate,
            designation: data.designation,
            role: data.role,
        };
        console.log('Form Data:', payload);
        dispatch(createRolesAction({ key: encryptMessage(payload) }));

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
                                <Form.Group className="mb-2">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter name"
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
                                <Form.Group className="mb-2">
                                    <Form.Label>Email ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter email"
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
                                <Form.Group className="mb-2">
                                    <Form.Label>Contact No.</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter contact number"
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
                                <Form.Group className="mb-2 position-relative">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter password"
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
                                <Form.Group className="mb-2 position-relative">
                                    <Form.Label>Confirm Password</Form.Label>
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
                                        className="position-absolute"
                                        style={{ top: '35px', right: '10px', cursor: 'pointer' }}
                                        onClick={togglePasswordVisibility}
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
                                <Form.Group className="mb-2">
                                    <Form.Label>Date of Joining</Form.Label>
                                    <Form.Control
                                        type="date"
                                        {...register('joiningDate', { required: 'Joining date is required' })}
                                    />
                                    {errors.joiningDate && <span className="text-danger fs-6">{errors.joiningDate.message}</span>}
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Date of Leaving</Form.Label>
                                    <Form.Control
                                        type="date"
                                        {...register('leavingDate', { required: 'Leaving date is required' })}
                                    />
                                    {errors.leavingDate && <span className="text-danger fs-6">{errors.leavingDate.message}</span>}
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Designation</Form.Label>
                                    <Form.Select
                                        {...register('designation', { required: 'Designation is required' })}
                                    >
                                        <option value="">Select designation</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="patient">Patient</option>
                                        <option value="maker">Maker</option>
                                    </Form.Select>
                                    {errors.designation && <span className="text-danger fs-6">{errors.designation.message}</span>}
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Re-Enter Designation</Form.Label>
                                    <Form.Select
                                        {...register('reDesignation', { required: 'Designation is required' })}
                                    >
                                        <option value="">Select designation</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="patient">Patient</option>
                                        <option value="maker">Maker</option>
                                    </Form.Select>
                                    {errors.reDesignation && <span className="text-danger fs-6">{errors.reDesignation.message}</span>}
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Phone No.</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter phone number"
                                        {...register('phone', {
                                            required: 'Phone number is required',
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
                                <Form.Group className="mb-2">
                                    <Form.Label>Role</Form.Label>
                                <Form.Select
                                        {...register('role', { required: 'Role is required' })}
                                    >
                                        <option value="">Select designation</option>
                                        {decryptedRolesData?.map((role,index)=>(
                                      
                                        <option key={index} value={role?.name}>{role?.name}</option>
                                    ))}
                                    </Form.Select>
                                    {errors.role && <span className="text-danger fs-6">{errors.role.message}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Modal.Footer className="border-0">
                            <Button type="button" className="custom-buttons" onClick={close}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" className="ms-2">
                                Submit
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AddRole;
