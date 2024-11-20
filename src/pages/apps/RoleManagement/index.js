import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap'
import Spinner from '../../../constants/Spinner'
import { FormInput } from '../../../components'
import { FiEdit, FiFileText, FiFilter, FiTrash } from 'react-icons/fi'
import { IoMdClose } from 'react-icons/io'
import { FaEye, FaEyeSlash, FaStarOfLife } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ToastHandle from '../../../helpers/ToastMessage';



function formatDate(dateString) {
    const date = new Date(dateString);
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const day = date.getDate();
    const suffix = ["th", "st", "nd", "rd"][(day % 10 > 3 || Math.floor(day % 100 / 10) === 1) ? 0 : day % 10];
    return `${formattedTime} ${day}${suffix} ${formattedDate.split(' ')[1]} ${date.getFullYear()}`;
}

const RoleManagement = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [smShow, setSmShow] = useState(false);
    const [password, setPassword] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [timeoutId, setTimeoutId] = useState(null);
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [addDepartmentModal, setAddDepartmentModal] = useState(false);
    const [status, setStatus] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const handleShowDetails = () => {
        setSmShow(true);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === '1234') {
            setIsPasswordCorrect(true);
            setSmShow(false);
            setIsVisible(true);
            ToastHandle("password success", "success");

            const id = setTimeout(() => {
                setIsPasswordCorrect(false);
                setIsVisible(false);
            }, 300000);
            setPassword();

            setTimeoutId(id);
        } else {
            ToastHandle("password incorrect", "danger");
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);  // Clean up the timeout when component unmounts
            }
        };
    }, [timeoutId]);

    const toggleVisibility = () => {
        if (isPasswordCorrect) {
            setIsVisible(!isVisible);
        } else {
            handleShowDetails();
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const openEditModal = (user) => {
        setEditMode(true);
        setCurrentUser(user);
        setAddDepartmentModal(true);
        reset(user);  // Populate form fields with user details
    };
    const closeAddModal = () => {
        setAddDepartmentModal(false);
        setEditMode(false);
        setCurrentUser(null);
        reset();
    }; const [clinicTypeData] = useState([
        { name: "Clinic A", phone: "987-3468-334", userName: "x24@probillRCm" },
        { name: "Clinic B", phone: "987-3468-334", userName: "x24@probillRCm" }
    ]);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const onSubmit = (formData) => {
        const payload = {
            name: formData?.name,
            price: formData?.amount,
            billingFrequency: formData?.tenure,
            description: formData?.description,
            doctorLimit: formData?.doctorcount,
            patientLimit: formData?.patientcount,
            implimentFrom: formData?.date,
        }
        // dispatch(createSubscriptionsAction({ key: encryptMessage(payload) }));

    };


    return (
        <Row className='mt-2'>
            <Col xs={12}>
                <Card>
                    <Card.Body>
                        <Row className="mb-2">
                            <Col sm={6}>
                                <Button className="custom-buttons">
                                    Receptionist
                                </Button>
                            </Col>
                            <Col sm={6} className='text-end'>
                                <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                    <Col xs="auto" className='d-flex gap-2'>
                                        <FormInput
                                            type="text"
                                            placeholder="Search..."
                                        />
                                        {/* <Button className="custom-buttons">
                                            <FiFilter className='fs-4' />
                                        </Button>
                                        <Button className="custom-buttons">
                                            <FiFileText className='fs-4' />
                                        </Button> */}
                                        <Button onClick={() => setAddDepartmentModal(true)} className="custom-buttons">
                                            New Receptionist
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table responsive className="table-centered table-nowrap mb-0">
                                    <thead className="text-white">
                                        <tr>
                                            <th className="text-white">Sr.No.</th>
                                            <th className="text-white">Name</th>
                                            <th className="text-white">Phone</th>
                                            <th className="text-white">UserName</th>
                                            <th className="text-white">Status</th>
                                            <th className="text-white">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clinicTypeData.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className='text-center'>
                                                    <h3 className='my-5'>No Data Found</h3>
                                                </td>
                                            </tr>
                                        ) : (
                                            clinicTypeData.map((data, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{data.name}</td>
                                                    <td className="">{data.phone}</td>
                                                    <td>{data.userName}</td>
                                                    <td><Form.Switch checked /></td>
                                                    <td>
                                                        <div className='d-flex gap-2'>
                                                            <div>
                                                                <FiEdit className='fs-5 cursor-pointer' onClick={() => openEditModal(data)} />
                                                            </div>
                                                            <div>
                                                                <FiTrash className='fs-5' />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>

                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
            <Modal
                size="sm"
                show={smShow}
                centered
                onHide={() => setSmShow(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Body className="rounded-4 p-3">
                    <Form onSubmit={handlePasswordSubmit}>
                        <Form.Group controlId="password" className="text-center my-2">
                            <Form.Label className='mb-2'>View Phone Number</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Row className="mt-1">
                            <Col sm={12} className="text-center mt-2">
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>

                                <p className='fw-bold mt-2'>Show the number for 5 min only</p>

                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal centered show={addDepartmentModal} size="md" onHide={closeAddModal}>
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">{editMode ? "Edit New User" : "Add New User"}</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeAddModal} />
                        </Col>
                    </Row>
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
                                    <Form.Label>Re- Enter Designation</Form.Label>
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
                            {/* <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Re-designation</Form.Label>
                                    <Form.Select
                                        {...register('reDesignation', { required: 'Re-designation is required' })}
                                    >
                                        <option value="">Select re-designation</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="patient">Patient</option>
                                        <option value="maker">Maker</option>
                                    </Form.Select>
                                    {errors.reDesignation && <span className="text-danger fs-6">{errors.reDesignation.message}</span>}
                                </Form.Group>
                            </Col> */}
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
                                    <Form.Label>Reporting</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Reporting"
                                        {...register('Reporting', {
                                            required: 'Reporting is required',
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                // message: 'Only 10-digit numbers are allowed',
                                            },
                                        })}
                                    />
                                    {errors.phone && <span className="text-danger fs-6">{errors.phone.message}</span>}
                                </Form.Group>
                            </Col>
                           
                        </Row>
                        <Modal.Footer className="border-0">
                            <Button type="submit" className="custom-buttons">
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" className="ms-2">
                                {editMode ? 'Update' : 'Add'} User
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </Row>
    )
}

export default RoleManagement
