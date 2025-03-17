import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Row, Col, Spinner, Dropdown, InputGroup } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { createRolesAction, getRoleDataAction, getRolesAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartmentDataAction, getMastersDataAction } from '../../../redux/settings/action';
import CreateRoleSetting from '../Settings/Role/CreateRoleSetting';
import Adddepartment from './Adddepartment';
import us from '../../../assets/images/flags/us.jpg'
import { useSearchParams } from 'react-router-dom';


const AddRole = ({ show, setUpdateDepartmentModal, setAddDepartmentModal, setCurrentUser }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId
    const decryptedRolesData = store?.getRoleDataReducer?.data?.roles;
    const decryptedRolesDataLoading = store?.getRoleDataReducer?.loading;
    const [isDropdownClicked, setIsDropdownClicked] = useState(false);
    const [isDropdownDesignation, setIsDropdownDesignation] = useState(false);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const createLoading = store?.createRolesReducer?.loading
    const createStatus = store?.createRolesReducer?.data
    const createSuccess = store?.createRolesReducer?.data?.status
    const [addDesiginationModal, setAddDesiginationModal] = useState(false);

    const [addDepartmentalModal, setAddDepartmentalModal] = useState(false);

    const tableGetData = store?.getMastersDataReducer?.data?.result;
    const departmentGetData = store?.getDepartmentDataReducer?.data?.result;
    const tableGetDataLoading = store?.getMastersDataReducer?.data?.loading;
    const departmentGetDataLoading = store?.getDepartmentDataReducer?.data?.loading;
    const roleData = store?.getRolesDataReducer?.data
    const roleDataLoading = store?.getRolesDataReducer?.loading
    const { register, reset, trigger, handleSubmit, watch, setValue, formState: { errors }, getValues } = useForm();


    const closeAddModal = () => {
        setAddDepartmentalModal(false);
        setAddDesiginationModal(false);

        reset();
    };
    const close = () => {
        setAddDepartmentModal(false);
        setCurrentUser(null);
        setUpdateDepartmentModal(false);
        reset()
        setValue('')

    };
    useEffect(() => {
        if (createSuccess === 200) {
            dispatch(getRolesAction({ clinicId: clinicId, limit: '', search: '', page: '', status: true }));

        }
    }, [createSuccess])

    useEffect(() => {
        dispatch(getMastersDataAction({ status: true, category: 'Desigination', limit: 10, skip: 1, search: '' }));
    }, [dispatch]);

    const [showPassword, setShowPassword] = useState(false);


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

    const checkPasswordStrength = (password) => {
        if (strongRegex.test(password)) {
            setPasswordStrength("");
        } else {
            setPasswordStrength("Password is too weak. Please use a mix of uppercase, lowercase, numbers, and special characters.");
        }
    };
    useEffect(() => {
        dispatch(getRoleDataAction({ clinicId: clinicId, limit: 10, createdById: '', search: '', page: 1, status: true }));
        dispatch(getRolesAction({ clinicId: clinicId, limit: '', search: '', page: '', status: true }));
        dispatch(getDepartmentDataAction({ status: true, category: 'Department', limit: 10, skip: 1, search: '' }));




    }, [getRoleDataAction])
    useEffect(() => {
        if (createSuccess === 200) {
            reset();
            close()
            dispatch(getRolesAction({ clinicId: clinicId, limit: 10, search: '', page: 1, status: true }));

        }
    }, [createSuccess])
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


        dispatch(createRolesAction({ key: `${encryptMessage(payload)}` }));
        dispatch(getRoleDataAction({ clinicId: clinicId, limit: 10, createdById: '', search: '', page: 1, status: true }));



    };
    const [showModal, setShowModal] = useState(false)

    const handleClosemodal = () => {
        setShowModal(false)
    }

    const [passwordStrength, setPasswordStrength] = useState('');
    const passwordValue = watch('password', '');

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setValue('password', value);

        // Password strength check
        const lengthCriteria = value.length >= 8;
        const numberCriteria = /\d/.test(value);
        const specialCharacterCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const upperCaseCriteria = /[A-Z]/.test(value);

        if (lengthCriteria && numberCriteria && specialCharacterCriteria && upperCaseCriteria) {
            setPasswordStrength('Strong password');
        } else if (lengthCriteria && (numberCriteria || specialCharacterCriteria || upperCaseCriteria)) {
            setPasswordStrength('Medium password');
        } else {
            setPasswordStrength('Weak password');
        }
    };
    const joiningDate = watch('joiningDate')
    const desigination = watch('designation') 
    const department = watch('department')
    const role = watch('role')
   

    return (
        <>
            <Modal centered show={show} size="lg" onHide={close}>
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
                                    <Form.Label className="mb-0">Name <span className='text-danger'>*</span></Form.Label>
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
                                    <Form.Label className="mb-0">Email ID <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Email"
                                        autoComplete="off" // Disable autofill for email
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
                                    <Form.Label className="mb-0">
                                        Password <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        autoComplete="off"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters",
                                            },
                                            maxLength: {
                                                value: 16,
                                                message: "Password must not exceed 16 characters",
                                            },
                                            validate: {
                                                noEmpty: (value) => value.trim() !== "" || "Password cannot be empty or only spaces",
                                                noSpacesBeforeText: (value) => !/^\s/.test(value) || "First character cannot be a space",
                                                isStrong: (value) => strongRegex.test(value) || "Password must be strong (8-16 characters, at least one uppercase, one number, one special character)",
                                            },
                                        })}
                                        onChange={(e) => {
                                            handlePasswordChange(e);
                                            checkPasswordStrength(e.target.value); // Check strength on change
                                            trigger("confirmPassword"); // Revalidate confirmPassword
                                        }}
                                    />
                                    <span
                                        className="position-absolute fs-4"
                                        style={{ top: "26px", right: "10px", cursor: "pointer" }}
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                    {errors.password && (
                                        <span className="text-danger fs-6">{errors.password.message}</span>
                                    )}
                                    {passwordStrength && (
                                        <span
                                            className={`fs-6 ${passwordStrength === "Strong password"
                                                ? "text-success"
                                                : "text-danger"
                                                }`}
                                        >
                                            {passwordStrength}
                                        </span>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-2 position-relative">
                                    <Form.Label className="mb-0">
                                        Confirm Password <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirm password"
                                        {...register("confirmPassword", {
                                            required: "Confirm password is required",
                                            validate: {
                                                matchPassword: (value) =>
                                                    value === watch("password") || "Passwords do not match",
                                            },
                                        })}
                                        onInput={() => trigger("confirmPassword")} // Trigger revalidation on every input change
                                    />
                                    <span
                                        className="position-absolute d-flex align-items-center fs-4 justify-content-center"
                                        style={{ top: "32px", right: "10px", cursor: "pointer" }}
                                        onClick={togglePasswordVisibility}
                                        onMouseEnter={(e) => (e.target.style.color = "#000")}
                                        onMouseLeave={(e) => (e.target.style.color = "#666")}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                    {errors.confirmPassword?.type === "matchPassword" && (
                                        <span className="text-danger fs-6">
                                            {errors.confirmPassword.message}
                                        </span>
                                    )}
                                </Form.Group>
                            </Col>



                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">Date of Joining <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="date"
                                        {...register('joiningDate', { required: 'Joining date is required' })}
                                        className={joiningDate ? 'text-dark border border-secondary' : 'custom-date-input border border-secondary'}

                                    />
                                    {errors.joiningDate && <span className="text-danger fs-6">{errors.joiningDate.message}</span>}
                                </Form.Group>
                            </Col>
                            {/* <Col sm={6}>
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
                            </Col> */}
                            <Col sm={6}>
                                <Form.Group className="mb-0 position-relative">
                                    <Form.Label className="mb-0">Contact No. <span className='text-danger'>*</span></Form.Label>
                                    <InputGroup>
                                        {/* Country Code Prefix */}
                                        <InputGroup.Text className="ps-4   pe-1 fw-bold text-black">
                                            +1
                                        </InputGroup.Text>

                                        {/* Contact Input */}
                                        <Form.Control
                                            type="tel"
                                            {...register("contact", !id ? {
                                                required: "Contact number is required",
                                                pattern: {
                                                    value: /^[0-9]*$/,
                                                    message: "Contact must be numeric only",
                                                },
                                                maxLength: {
                                                    value: 10,
                                                    message: "Contact must not exceed 10 digits",
                                                },
                                                minLength: {
                                                    value: 10,
                                                    message: "Contact must not be less than 10 digits",
                                                },
                                                validate: {
                                                    noEmpty: (value) => value.trim() !== "" || "Contact cannot be empty or only spaces",
                                                    noSpacesBeforeText: (value) => !/^\s/.test(value) || "First character cannot be a space",
                                                },
                                            } : {})}
                                            placeholder="1234567890"
                                            maxLength={10}
                                            onInput={(e) => {
                                                const value = e.target.value;
                                                e.target.value = value.replace(/\s/g, ""); // Remove spaces
                                            }}
                                        />
                                    </InputGroup>

                                    {/* Validation Error Message */}
                                    {errors.contact && (
                                        <span className="text-danger fs-6">{errors.contact.message}</span>
                                    )}

                                    {/* Country Code Flag */}
                                    <div
                                        className="position-absolute "
                                        style={{
                                            top: "50%",
                                            left: "2%",
                                        }}
                                    >
                                        <img src={us} alt="country code flag" width={20} />
                                    </div>
                                </Form.Group>
                            </Col>


                            <Col sm={6}>
                                <Form.Group className="mb-0 position-relative">
                                    <Form.Label className="mb-0">Contact Number Secondary</Form.Label>
                                    <Form.Group>
                                        <InputGroup>
                                            <InputGroup.Text className="ps-3 pe-1 fw-bold text-black">
                                                &nbsp;&nbsp;+1
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="tel"
                                                {...register('phNumberSecondary', {
                                                    validate: {
                                                        isValid: (value) =>
                                                            !value || // If empty, allow submission
                                                            (/^[0-9]{10}$/.test(value) || 'Contact Number Secondary must be a 10-digit number'),
                                                    },
                                                })}
                                                placeholder="1234-234-234"
                                                maxLength={10}
                                                onInput={(e) => {
                                                    const value = e.target.value;
                                                    e.target.value = value.replace(/\s/g, ''); // Remove all spaces
                                                }}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <div className="position-absolute" style={{ top: '36%', left: '1%' }}>
                                        <img src={us} alt="country code flag" width={20} />
                                    </div>
                                    {errors.phNumberSecondary && (
                                        <span className="text-danger fs-6">{errors.phNumberSecondary.message}</span>
                                    )}
                                </Form.Group>
                            </Col>


                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="mb-0">Designation <span className='text-danger'>*</span></Form.Label>
                                    <div style={{ position: "relative" }}>
                                        {tableGetData?.length === 0 ? (
                                            <Dropdown
                                                show={isDropdownDesignation}
                                                onToggle={(isDropdownDesignation) => setIsDropdownDesignation(isDropdownDesignation)}
                                            >
                                                <Dropdown.Toggle
                                                    variant="outline-secondary"
                                                    className="w-100 text-start border border-secondary text-muted bg-white"
                                                    style={{
                                                        borderRadius: "4px",
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    Select Designation
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu
                                                    style={{
                                                        width: "100%",
                                                        maxHeight: "200px",
                                                        overflowY: "auto",
                                                    }}
                                                    className='border border-secondary'
                                                >
                                                    {tableGetDataLoading ? (
                                                        <Dropdown.Item disabled>Loading...</Dropdown.Item>
                                                    ) : (
                                                        <div
                                                            style={{
                                                                padding: "10px",
                                                                textAlign: "center",
                                                                color: "#f00",
                                                                fontSize: "12px",
                                                            }}
                                                            className='d-flex'
                                                        >
                                                            No data
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                style={{ fontSize: "12px", marginLeft: "10px" }}
                                                                onClick={() => setAddDesiginationModal(true)} // Show Designation Modal
                                                            >
                                                                Add Designation
                                                            </Button>
                                                        </div>
                                                    )}
                                                </Dropdown.Menu>
                                            </Dropdown>


                                        ) : (
                                            <Form.Select
                                                {...register('designation', { required: 'Designation is required' })}
                                                className={`text-dark border border-secondary ${desigination ? ' custom-date-input-select' : 'custom-date-input'}`}

                                            >
                                                {tableGetDataLoading ? (
                                                    <div className="d-flex justify-content-center">
                                                        <div className="spinner-border" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    </div>) : (
                                                    <>
                                                        <option value="" className='select' hidden>Select Designation</option>
                                                        {tableGetData?.map((data) => (
                                                            <option key={data?._id} className='text-dark' value={data?.name}>
                                                                {data?.name}
                                                            </option>
                                                        ))}
                                                    </>
                                                )}
                                            </Form.Select>
                                        )}
                                    </div>
                                    {errors.designation && (
                                        <span className="text-danger fs-6">{errors.designation.message}</span>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="mb-0">Department <span className='text-danger'>*</span></Form.Label>
                                    <div style={{ position: "relative" }}>
                                        {departmentGetData?.length === 0 ? (
                                            <Dropdown
                                                show={isDropdownClicked}
                                                onToggle={(isDropdownClicked) => setIsDropdownClicked(isDropdownClicked)}
                                            >
                                                <Dropdown.Toggle
                                                    variant="outline-secondary"
                                                    className="w-100 text-start border border-secondary text-muted bg-white"
                                                    style={{
                                                        borderRadius: "4px",
                                                        fontWeight: "600",
                                                    }}
                                                    hidden
                                                >
                                                    Select Department
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu
                                                    style={{
                                                        width: "100%",
                                                        maxHeight: "200px",
                                                        overflowY: "auto",
                                                    }}
                                                    className='border border-secondary'
                                                >
                                                    <div
                                                        style={{
                                                            padding: "10px",
                                                            textAlign: "center",
                                                            color: "#f00",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        No data
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            style={{ fontSize: "12px", marginLeft: "10px" }}
                                                            onClick={() => setAddDesiginationModal(true)} // Show Department Modal
                                                        >
                                                            Add Department
                                                        </Button>
                                                    </div>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        ) : (
                                            <Form.Select
                                                {...register("department", { required: "Department is required" })}
                                                className={`text-dark border border-secondary ${department ? ' custom-date-input-select' : 'custom-date-input'}`}

                                            >
                                                <option value="" hidden>Select Department</option>
                                                {departmentGetData?.map((data) => (
                                                    <option key={data?._id} value={data.name}>
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        )}
                                    </div>
                                    {errors.department && (
                                        <span className="text-danger fs-6">{errors.department.message}</span>
                                    )}
                                </Form.Group>
                            </Col>



                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="mb-0">Role <span className='text-danger'>*</span></Form.Label>
                                    <div style={{ position: "relative" }}>
                                        {decryptedRolesData?.length === 0 ? (
                                            <Dropdown
                                                show={isDropdownOpen}
                                                onToggle={(isOpen) => setIsDropdownOpen(isOpen)}
                                            >
                                                <Dropdown.Toggle
                                                    variant="outline-secondary"
                                                    className="w-100 text-start border border-secondary text-muted bg-white"
                                                    style={{
                                                        borderRadius: "4px",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    Select Role
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu
                                                    style={{
                                                        width: "100%",
                                                        maxHeight: "200px",
                                                        overflowY: "auto",
                                                    }}
                                                    className='border border-secondary'
                                                >
                                                    <div
                                                        style={{
                                                            padding: "10px",
                                                            textAlign: "center",
                                                            color: "#f00",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        No data
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            style={{ fontSize: "12px", marginLeft: "10px" }}
                                                            onClick={() => setShowModal(true)} // Show Role Modal
                                                        >
                                                            Add Role
                                                        </Button>
                                                    </div>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        ) : (
                                            <Form.Select
                                                {...register("role", { required: "Role is required" })}
                                                className={`text-dark border border-secondary ${role ? ' custom-date-input-select' : 'custom-date-input'}`}

                                            >
                                                <option value="" hidden>Select Role</option>
                                                {decryptedRolesData?.map((data) => (
                                                    <option key={data._id} value={data._id}>
                                                        {data.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        )}
                                    </div>
                                    {errors.role && (
                                        <span className="text-danger fs-6">{errors.role.message}</span>
                                    )}
                                </Form.Group>
                            </Col>




                        </Row>
                        <Modal.Footer className="border-0 py-0">
                            <Button type="button" className="cancel-button" onClick={close}>
                                Cancel
                            </Button>


                            <Button type="submit" variant="primary" className="ms-2 custom-buttons btn-height" disabled={createLoading}>
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
            <CreateRoleSetting show={showModal} closeModal={handleClosemodal} />
            <Adddepartment addDepartmentModal={addDepartmentalModal} addDesiginationModal={addDesiginationModal} setAddDesiginationModal={setAddDesiginationModal} setAddDepartmentModal={setAddDepartmentalModal} closeAddModal={closeAddModal} />

        </>
    );
};

export default AddRole;