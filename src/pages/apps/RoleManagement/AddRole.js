import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Row, Col, Spinner } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { createRolesAction, getRoleDataAction, getRolesAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartmentDataAction, getMastersDataAction } from '../../../redux/settings/action';

const AddRole = ({ show, close }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const idFromStorage = JSON.parse(sessionStorage.getItem('hyper_user'));
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId
    const decryptedRolesData = store?.getRoleDataReducer?.data?.roles;
    const createLoading = store?.createRolesReducer?.loading
    const createStatus = store?.createRolesReducer?.data
    const createSuccess = store?.createRolesReducer?.data?.status


    const tableGetData = store?.getMastersDataReducer?.data?.result;
    const departmentGetData = store?.getDepartmentDataReducer?.data?.result;
    const tableGetDataLoading = store?.getMastersDataReducer?.data?.loading;
    const departmentGetDataLoading = store?.getDepartmentDataReducer?.data?.loading;
    const roleData = store?.getRolesDataReducer?.data
    const roleDataLoading = store?.getRolesDataReducer?.loading

    useEffect(() => {
        if (createSuccess === 200) {
            dispatch(getRolesAction({ clinicId: clinicId, limit: '', search: '', page: '', status: true }));

        }
    }, [createSuccess])

    useEffect(() => {
        dispatch(getMastersDataAction({ status: true, category: 'Desigination', limit: 10, skip: 1, search: '' }));
    }, [dispatch]);

    const [showPassword, setShowPassword] = useState(false);

    const { register, reset, handleSubmit, formState: { errors }, getValues } = useForm();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    useEffect(() => {
        dispatch(getRoleDataAction({ clinicId: clinicId, limit: 10,createdById:'', search: '', page: 1, status: true }));
        dispatch(getRolesAction({ clinicId: clinicId, limit: '', search: '', page: '', status: true }));
        dispatch(getDepartmentDataAction({ status: true, category: 'Department', limit: 10, skip: 1, search: '' }));




    }, [getRoleDataAction])
    const onSubmit = (data) => {
        const formattedJoiningDate = new Date(data.joiningDate).toISOString();
        // const formattedLeavingDate = new Date(data.leavingDate).toISOString();
        const payload = {
            firstName: data.name,
            email: data.email,
            password: data.password,
            phone: data?.contact,
            phNumberSecondary: data.phNumberSecondary,
            clinicId: clinicId,
            reportingTo: data.reportingTo || clinicId,
            joiningDate: formattedJoiningDate,
            designation: data.designation,
            department: data.department,
            role: data.role,
        };
        console.log('Form Data:', payload);

        if (createStatus === 200) {
            reset();
            close()
            dispatch(getRolesAction({ clinicId: clinicId, limit: 10, search: '', page: 1, status: true }));

        }
        dispatch(createRolesAction({ key: `${encryptMessage(payload)}` }));
        dispatch(getRoleDataAction({ clinicId: clinicId, limit: 10,createdById:'', search: '', page: 1, status: true }));
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
                                <Form.Group className="mb-2">
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
                                            validate: {
                                                noEmpty: (value) => value.trim() !== "" || "Name cannot be empty or only spaces",
                                                noSpacesBeforeText: (value) => !/^\s/.test(value) || "First character cannot be a space",
                                              },
                                        })}
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            if (value.trim() === "") {
                                              e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
                                            }
                                          }}
                                    />
                                    {errors.name && <span className="text-danger fs-6">{errors.name.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-2">
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
                                            validate: {
                                                noEmpty: (value) => value.trim() !== "" || "Email cannot be empty or only spaces",
                                                noSpacesBeforeText: (value) => !/^\s/.test(value) || "First character cannot be a space",
                                              },
                                        })}
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            if (value.trim() === "") {
                                              e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
                                            }
                                          }}
                                    />
                                    {errors.email && <span className="text-danger fs-6">{errors.email.message}</span>}
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-2 position-relative">
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
                                            validate: {
                                                noEmpty: (value) => value.trim() !== "" || "Password cannot be empty or only spaces",
                                                noSpacesBeforeText: (value) => !/^\s/.test(value) || "First character cannot be a space",
                                              },
                                        })}
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            if (value.trim() === "") {
                                              e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
                                            }
                                          }}
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
                                            validate: {
                                                noEmpty: (value) => value.trim() !== "" || "Confirm password cannot be empty or only spaces",
                                                noSpacesBeforeText: (value) => !/^\s/.test(value) || "First character cannot be a space",
                                              },
                                        })}
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            if (value.trim() === "") {
                                              e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
                                            }
                                          }}
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
                                <Form.Group className="mb-2">
                                    <Form.Label className="mb-0">Reporting</Form.Label>
                                    <Form.Select
                                        {...register('reportingTo')} // No required validation
                                    >
                                        <option value="">Select Reporting</option>
                                        {roleDataLoading ? (
                                            <option disabled>Loading...</option> // Display "Loading..." as an option
                                        ) : Array.isArray(roleData?.users) && roleData?.users.length > 0 ? (
                                            roleData?.users.map((data) => (
                                                <option key={data._id} value={data._id}>
                                                    {data.firstName || "Unnamed User"} {data.lastName || ""}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>No RoleManagement</option> // Display "No Data Found" as an option
                                        )}
                                    </Form.Select>
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
                                            validate: {
                                                noEmpty: (value) => value.trim() !== "" || "Contact cannot be empty or only spaces",
                                                noSpacesBeforeText: (value) => !/^\s/.test(value) || "First character cannot be a space",
                                              },
                                        })}
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            if (value.trim() === "") {
                                              e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
                                            }
                                          }}
                                    />
                                    {errors.contact && <span className="text-danger fs-6">{errors.contact.message}</span>}
                                </Form.Group>
                            </Col>




                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="mb-0">Contact Number secondary  </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder=" phone number"
                                        {...register('phNumberSecondary', {
                                            required: 'Contact Number secondary   number is required',
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: 'Only 10-digit numbers are allowed',
                                            },
                                            validate: {
                                                noEmpty: (value) => value.trim() !== "" || "Phone number cannot be empty or only spaces",
                                                noSpacesBeforeText: (value) => !/^\s/.test(value) || "First character cannot be a space",
                                              },
                                        })}
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            if (value.trim() === "") {
                                              e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
                                            }
                                          }}
                                    />
                                    {errors.phNumberSecondary && <span className="text-danger fs-6">{errors.phNumberSecondary.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="mb-0">Designation</Form.Label>
                                    <Form.Select
                                        {...register('designation', { required: 'Designation is required' })}
                                    >
                                        {tableGetDataLoading ? (
                                            <option>Loading...</option>
                                        ) : departmentGetData && departmentGetData.length > 0 ? (


                                            <>
                                                <option value="">Select Designation</option>
                                                {tableGetData?.map((data) => (
                                                    <option key={data._id} value={data.name}>
                                                        {data.name}
                                                    </option>
                                                ))}
                                            </>
                                        ) : (
                                            <option>No Desigination Available</option> // Fallback for empty data
                                        )}
                                    </Form.Select>
                                    {errors.designation && (
                                        <span className="text-danger fs-6">{errors.designation.message}</span>
                                    )}
                                </Form.Group>
                            </Col>


                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="mb-0">Department</Form.Label>
                                    <Form.Select
                                        {...register('department', { required: 'Department is required' })}
                                    >
                                        {departmentGetDataLoading ? (
                                            <option>Loading...</option> // Placeholder while loading
                                        ) : departmentGetData && departmentGetData.length > 0 ? (
                                            <>
                                                <option value="">Select Department</option>
                                                {departmentGetData.map((data) => (
                                                    <option key={data._id} value={data.name}>
                                                        {data.name}
                                                    </option>
                                                ))}
                                            </>
                                        ) : (
                                            <option>No Department Available</option> // Fallback for empty data
                                        )}
                                    </Form.Select>
                                    {errors.department && (
                                        <span className="text-danger fs-6">{errors.department.message}</span>
                                    )}
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
                                            <option key={data._id} value={data?._id}>
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