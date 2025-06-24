import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Row, Col, Spinner, Dropdown, InputGroup } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { createRolesAction, getRoleDataAction, getRolesAction, updateRolesAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartmentDataAction, getMastersDataAction } from '../../../redux/settings/action';
import CreateRoleSetting from '../Settings/Role/CreateRoleSetting';
import Adddepartment from './Adddepartment';
import us from '../../../assets/images/flags/us.jpg';
import { useSearchParams } from 'react-router-dom';
import { updateRolesReducer } from '../../../redux/roles/reducers';

const AddRole = ({ show, dataToEdit, setDataToEdit, setAddDepartmentModal }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const decryptedRolesData = store?.getRoleDataReducer?.data?.roles;
    const [isDropdownClicked, setIsDropdownClicked] = useState(false);
    const [isDropdownDesignation, setIsDropdownDesignation] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const createLoading = store?.createRolesReducer?.loading;
    const createSuccess = store?.createRolesReducer?.data?.status;
    const updateSuccess = store?.updateRolesReducer?.data?.status;
    const [addDesiginationModal, setAddDesiginationModal] = useState(false);
    const [telecom, setTelecom] = useState([
        { system: 'phone', value: '', use: 'work' },
        { system: 'phone', value: '', use: 'home' },
        { system: 'email', value: '', use: 'work' },
    ]);
    const [addDepartmentalModal, setAddDepartmentalModal] = useState(false);
    const designationData = store?.getMastersDataReducer?.data1?.data?.result;
    const designationDataLoading = store?.getMastersDataReducer?.data?.loading;
    const departmentGetData = store?.getDepartmentDataReducer?.data?.result;

    const {
        register,
        reset,
        trigger,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        getValues,
    } = useForm();

    const closeAddModal = () => {
        setAddDepartmentalModal(false);
        setAddDesiginationModal(false);
        reset();
    };

    useEffect(() => {
        if (dataToEdit) {
            setValue('firstName', dataToEdit?.name?.text);
            setValue('email', dataToEdit?.email);
            setValue('roleId', dataToEdit?.roleId);
            setValue(
                'joiningDate',
                dataToEdit?.joiningDate ? new Date(dataToEdit?.joiningDate).toISOString().split('T')[0] : ''
            );
            setValue('designation', dataToEdit?.designation);
            setValue('department', dataToEdit?.department);
            setValue(
                'phone',
                dataToEdit?.telecom?.find((data) => data?.system === 'phone' && data?.use === 'work')?.value || ''
            );
            setValue(
                'phNumberSecondary',
                dataToEdit?.telecom?.find((data) => data?.system === 'phone' && data?.use === 'home')?.value || ''
            );
            if (dataToEdit?.telecom) {
                setTelecom(dataToEdit.telecom);
            }
        }
    }, [dataToEdit, setValue]);

    const close = () => {
        setAddDepartmentModal(false);
        setDataToEdit(null);
        reset({
            firstName: '',
            email: '',
            roleId: '',
            joiningDate: '',
            designation: '',
            department: '',
            phone: '',
            phNumberSecondary: '',
            ...(!dataToEdit && { password: '', confirmPassword: '' }),
        });
        setTelecom([
            { system: 'phone', value: '', use: 'work' },
            { system: 'phone', value: '', use: 'home' },
            { system: 'email', value: '', use: 'work' },
        ]);
    };

    const [passwordVisibility, setPasswordVisibility] = useState({
        password: false,
        confirmPassword: false,
    });

    const togglePasswordVisibility = (field) => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

    const checkPasswordStrength = (password) => {
        if (strongRegex.test(password)) {
            setPasswordStrength('');
        } else {
            setPasswordStrength(
                'Password is too weak. Please use a mix of uppercase, lowercase, numbers, and special characters.'
            );
        }
    };

    useEffect(() => {
        if (createSuccess === 200) {
            reset();
            close();
        }
    }, [createSuccess]);
    useEffect(() => {
        if (updateSuccess === 200) {
            reset();
            close();
        }
    }, [updateSuccess]);

    const onSubmit = (data) => {
        data.clinicId = clinicId;
        data.reportingTo = data.reportingTo || clinicId;
        data.name = {
            text: data.firstName,
        };
        data.telecom = telecom;
        delete data.phone;
        delete data.phNumberSecondary;
        delete data.firstName;

        if (dataToEdit?._id) {
            data.id = dataToEdit?._id;
            delete data.email;
            delete data.password;
            delete data.confirmPassword;
            dispatch(updateRolesAction({ key: `${encryptMessage(data)}` }));
        } else {
            dispatch(createRolesAction({ key: `${encryptMessage(data)}` }));
        }
        console.log('Form submitted with data:', data);
    };

    const [showModal, setShowModal] = useState(false);

    const handleClosemodal = () => {
        setShowModal(false);
    };

    const [passwordStrength, setPasswordStrength] = useState('');

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
    const joiningDate = watch('joiningDate');
    const desigination = watch('designation');
    const department = watch('department');
    const role = watch('roleId');

    const handleContactChange = (value, field) => {
        // Remove all non-numeric characters
        let rawValue = value.replace(/\D/g, '');
        if (rawValue.length > 10) rawValue = rawValue.slice(0, 10);

        // Format as (XXX)XXX-XXXX
        const formattedValue = rawValue.replace(/(\d{1,3})(\d{0,3})(\d{0,4})/, (match, p1, p2, p3) => {
            if (p3) return `(${p1})${p2}-${p3}`;
            if (p2) return `(${p1})${p2}`;
            return `(${p1}`;
        });

        setTelecom((prevTelecom) =>
            prevTelecom.map((contact, index) => (index === field ? { ...contact, value: formattedValue } : contact))
        );
    };

    return (
        <>
            <Modal centered show={show} size="lg" onHide={close}>
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">{dataToEdit ? 'Update User' : 'Add New User'}</h4>
                        </Col>
                        {/* <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={close} />
                        </Col> */}
                    </Row>
                    {/* Form with handleSubmit to trigger onSubmit */}
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="mb-0">
                                        Name <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder=" Name"
                                        {...register('firstName', {
                                            required: dataToEdit ? false : 'Name is required',
                                            pattern: {
                                                value: /^(?! )[A-Za-z0-9 ]*$/,
                                                message: 'Special characters and leading spaces are not allowed',
                                            },
                                            validate: {
                                                noEmpty: (value) =>
                                                    value.trim() !== '' || 'Name cannot be empty or only spaces',
                                                noSpacesBeforeText: (value) =>
                                                    !/^\s/.test(value) || 'First character cannot be a space',
                                            },
                                        })}
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            if (value.trim() === '') {
                                                e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
                                            }
                                        }}
                                    />
                                    {errors.firstName && (
                                        <span className="text-danger fs-6">{errors.firstName.message}</span>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="mb-0">
                                        Email ID <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Email"
                                        autoComplete="off" // Disable autofill for email
                                        {...register('email', {
                                            required: dataToEdit ? false : 'Email is required',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Invalid email format',
                                            },
                                            validate: {
                                                noEmpty: (value) =>
                                                    value.trim() !== '' || 'Email cannot be empty or only spaces',
                                                noSpacesBeforeText: (value) =>
                                                    !/^\s/.test(value) || 'First character cannot be a space',
                                            },
                                        })}
                                        onChange={(e) => {
                                            handleContactChange(e.target.value, 2);
                                        }}
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            if (value.trim() === '') {
                                                e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
                                            }
                                        }}
                                    />
                                    {errors.email && <span className="text-danger fs-6">{errors.email.message}</span>}
                                </Form.Group>
                            </Col>
                            <Row className={`mx-auto px-0 ${dataToEdit?._id ? 'd-none ' : ''}`}>
                                <Col sm={6}>
                                    <Form.Group className="mb-2 position-relative">
                                        <Form.Label className="mb-0">
                                            Password <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type={passwordVisibility.password ? 'text' : 'password'}
                                            placeholder="Password"
                                            autoComplete="off"
                                            {...register('password', {
                                                required: dataToEdit ? false : 'Password is required',
                                                minLength: dataToEdit
                                                    ? false
                                                    : {
                                                        value: 8,
                                                        message: 'Password must be at least 8 characters',
                                                    },
                                                maxLength: dataToEdit
                                                    ? false
                                                    : {
                                                        value: 16,
                                                        message: 'Password must not exceed 16 characters',
                                                    },
                                                validate: dataToEdit
                                                    ? false
                                                    : {
                                                        noEmpty: (value) =>
                                                            value.trim() !== '' ||
                                                            'Password cannot be empty or only spaces',
                                                        noSpacesBeforeText: (value) =>
                                                            !/^\s/.test(value) || 'First character cannot be a space',
                                                        isStrong: (value) =>
                                                            strongRegex.test(value) ||
                                                            'Password must be strong (8-16 characters, at least one uppercase, one number, one special character)',
                                                    },
                                            })}
                                            onChange={(e) => {
                                                handlePasswordChange(e);
                                                checkPasswordStrength(e.target.value); // Check strength on change
                                                trigger('confirmPassword'); // Revalidate confirmPassword
                                            }}
                                            maxLength={16}
                                        />
                                        <span
                                            className="position-absolute fs-4"
                                            style={{ top: '23px', right: '10px', cursor: 'pointer' }}
                                            onClick={() => togglePasswordVisibility('password')}>
                                            {passwordVisibility.password ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                        {errors.password && (
                                            <span className="text-danger fs-6">{errors.password.message}</span>
                                        )}{' '}
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group className="mb-2 position-relative">
                                        <Form.Label className="mb-0">
                                            Confirm Password <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm password"
                                            {...register('confirmPassword', {
                                                required: dataToEdit ? false : 'Confirm password is required',
                                                validate: dataToEdit
                                                    ? false
                                                    : {
                                                        matchPassword: (value) =>
                                                            value === watch('password') || 'Passwords do not match',
                                                    },
                                            })}
                                            onChange={() => trigger('confirmPassword')}
                                            maxLength={16}
                                        />
                                        <span
                                            className="position-absolute d-flex align-items-center fs-4 justify-content-center"
                                            style={{ top: '27px', right: '10px', cursor: 'pointer' }}
                                            onClick={() => togglePasswordVisibility('confirmPassword')}
                                            onMouseEnter={(e) => (e.target.style.color = '#000')}
                                            onMouseLeave={(e) => (e.target.style.color = '#666')}>
                                            {passwordVisibility.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                        {errors.confirmPassword?.type === 'matchPassword' && (
                                            <span className="text-danger fs-6">{errors.confirmPassword.message}</span>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">
                                        Date of Joining <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="date"
                                        {...register('joiningDate', {
                                            required: dataToEdit ? false : 'Joining date is required',
                                        })}
                                        max={
                                            new Date(new Date().setFullYear(new Date().getFullYear()))
                                                .toISOString()
                                                .split('T')[0]
                                        }
                                        className={
                                            joiningDate
                                                ? 'text-dark border border-secondary'
                                                : 'custom-date-input border border-secondary'
                                        }
                                    />
                                    {errors.joiningDate && (
                                        <span className="text-danger fs-6">{errors.joiningDate.message}</span>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-0 position-relative">
                                    <Form.Label className="mb-0">
                                        Contact No. <span className="text-danger">*</span>
                                    </Form.Label>
                                    <InputGroup>
                                        {/* Country Code Prefix */}
                                        <InputGroup.Text className="p-0 px-1 d-flex align-items-center justify-content-center fs-6 gap-1 fw-bold text-black">
                                            <img src={us} alt="country code flag" width={16} />
                                            +1
                                        </InputGroup.Text>
                                        {/* Contact Input */}
                                        <Form.Control
                                            type="tel"
                                            {...register(
                                                'phone',
                                                !id
                                                    ? {
                                                        required: dataToEdit ? false : 'Contact number is required',
                                                        pattern: {
                                                            value: /^[0-9()\-\s]*$/,
                                                            message: 'Contact must be numeric only',
                                                        },
                                                        maxLength: {
                                                            value: 13, // (XXX)XXX-XXXX is 13 chars
                                                            message: 'Contact must not exceed 10 digits',
                                                        },
                                                        minLength: {
                                                            value: 13,
                                                            message: 'Contact must not be less than 10 digits',
                                                        },
                                                        validate: {
                                                            noEmpty: (value) =>
                                                                value.trim() !== '' ||
                                                                'Contact cannot be empty or only spaces',
                                                            noSpacesBeforeText: (value) =>
                                                                !/^\s/.test(value) ||
                                                                'First character cannot be a space',
                                                        },
                                                    }
                                                    : {}
                                            )}
                                            placeholder="(845)567-9292"
                                            maxLength={13}
                                            onChange={(e) => {
                                                let rawValue = e.target.value.replace(/\D/g, '');
                                                if (rawValue.length > 10) rawValue = rawValue.slice(0, 10);
                                                const formattedValue = rawValue.replace(
                                                    /(\d{1,3})(\d{0,3})(\d{0,4})/,
                                                    (match, p1, p2, p3) => {
                                                        if (p3) return `(${p1})${p2}-${p3}`;
                                                        if (p2) return `(${p1})${p2}`;
                                                        return `(${p1}`;
                                                    }
                                                );
                                                setValue('phone', formattedValue);
                                                handleContactChange(formattedValue, 0);
                                            }}
                                        />
                                    </InputGroup>
                                    {errors.phone && <span className="text-danger fs-6">{errors.phone.message}</span>}
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-0 position-relative">
                                    <Form.Label className="mb-0">Contact Number Secondary</Form.Label>
                                    <Form.Group>
                                        <InputGroup>
                                            <InputGroup.Text className="p-0 px-1 d-flex align-items-center justify-content-center fs-6 gap-1 fw-bold text-black">
                                                <img src={us} alt="country code flag" width={16} />
                                                +1
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="tel"
                                                {...register('phNumberSecondary', {
                                                    validate: {
                                                        isValid: (value) =>
                                                            !value ||
                                                            (/^[0-9()\-\s]*$/.test(value) && value.length === 13) ||
                                                            'Contact Number Secondary must be a 10-digit number',
                                                    },
                                                })}
                                                placeholder="(845)567-9292"
                                                maxLength={13}
                                                onChange={(e) => {
                                                    let rawValue = e.target.value.replace(/\D/g, '');
                                                    if (rawValue.length > 10) rawValue = rawValue.slice(0, 10);
                                                    const formattedValue = rawValue.replace(
                                                        /(\d{1,3})(\d{0,3})(\d{0,4})/,
                                                        (match, p1, p2, p3) => {
                                                            if (p3) return `(${p1})${p2}-${p3}`;
                                                            if (p2) return `(${p1})${p2}`;
                                                            return `(${p1}`;
                                                        }
                                                    );
                                                    setValue('phNumberSecondary', formattedValue);
                                                    handleContactChange(formattedValue, 1);
                                                }}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    {errors.phNumberSecondary && (
                                        <span className="text-danger fs-6">{errors.phNumberSecondary.message}</span>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="mb-0 d-flex align-items-center">
                                        Designation <span className="text-danger">*</span>
                                        <i
                                            className="bi bi-plus-circle text-primary ms-1"
                                            style={{ fontSize: '0.9rem' }}
                                            onClick={() => setAddDesiginationModal(true)}></i>
                                    </Form.Label>
                                    <Form.Select
                                        {...register('designation', {
                                            required: dataToEdit ? false : 'Designation is required',
                                        })}
                                        className={`text-dark border border-secondary ${desigination ? ' custom-date-input-select' : 'custom-date-input'}`}>
                                        {designationDataLoading ? (
                                            <div className="d-flex justify-content-center">
                                                <div className="spinner-border" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <option value="" className="select" hidden>
                                                    Select Designation
                                                </option>
                                                {designationData?.map((data) => (
                                                    <option
                                                        key={data?._id}
                                                        className="text-dark text-capitalize"
                                                        value={data?.name}>
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </>
                                        )}
                                    </Form.Select>
                                    {errors.designation && (
                                        <span className="text-danger fs-6">{errors.designation.message}</span>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="mb-0 d-flex align-items-center">
                                        <span>Role</span>
                                        <span className="text-danger">*</span>
                                        <i
                                            className="bi bi-plus-circle text-primary ms-1"
                                            style={{ fontSize: '0.9rem' }}
                                            onClick={() => setShowModal(true)}></i>
                                    </Form.Label>
                                    <Form.Select
                                        {...register('roleId', {
                                            required: dataToEdit ? false : 'Role is required',
                                        })}
                                        className={`text-dark border border-secondary ${role ? ' custom-date-input-select' : 'custom-date-input'}`}>
                                        <option value="" className="select" hidden>
                                            Select Role
                                        </option>
                                        {decryptedRolesData?.map((data) => (
                                            <option className="text-capitalize" key={data._id} value={data._id}>
                                                {data.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.roleId && <span className="text-danger fs-6">{errors.roleId.message}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Modal.Footer className="border-0 py-0">
                            <Button type="button" className="cancel-button" onClick={close}>
                                Cancel
                            </Button>

                            {dataToEdit ? (
                                <Button
                                    type="submit"
                                    variant="primary"
                                    style={{ width: '80px' }}
                                    className="ms-2 custom-buttons btn-height"
                                    disabled={store?.updateRolesReducer?.loading}>
                                    {store?.updateRolesReducer?.loading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                        </>
                                    ) : (
                                        'Update'
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="ms-2 custom-buttons btn-height"
                                    style={{ width: '80px' }}
                                    disabled={createLoading}>
                                    {createLoading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                        </>
                                    ) : (
                                        'Submit'
                                    )}
                                </Button>
                            )}
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
            <CreateRoleSetting show={showModal} closeModal={handleClosemodal} />
            <Adddepartment
                addDepartmentModal={addDepartmentalModal}
                addDesiginationModal={addDesiginationModal}
                setAddDesiginationModal={setAddDesiginationModal}
                setAddDepartmentModal={setAddDepartmentalModal}
                closeAddModal={closeAddModal}
            />
        </>
    );
};

export default AddRole;
