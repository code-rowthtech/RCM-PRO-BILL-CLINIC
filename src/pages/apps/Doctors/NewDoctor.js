import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Form, InputGroup, Modal, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
    createDoctorAction,
    createDoctorDetailAction,
    getCities2Action,
    getCitiesAction,
    getDoctorDetailsAction,
    getRoleDataAction,
    getStatesByCountryAction,
} from '../../../redux/actions';
import EmailToDoctorModal from './EmailToDoctorModal';
import DepartmentDetails from './DepartmentDetails';
import Documents from './Documents';
import { handleUpload } from '../../../helpers/HandleUpload';
import { encryptMessage } from '../../../cryptoUtils';
import us from '../../../assets/images/flags/us.jpg';
import { handleFirstSpace } from '../../../helpers/noSpace';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for eye visibility toggle
import { getDepartmentDataAction } from '../../../redux/settings/action';
import AddressForm from '../Common Pages/AddressForm';
import { FiUploadCloud } from 'react-icons/fi';
import DoctorAddress from './DoctorAddressForm';
import DoctorQualifications from './Qualifications';

const NewDoctor = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        getValues,
        setValue,
        clearErrors,
    } = useForm();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [activeTab, setActiveTab] = useState('personalDetails');
    const logoFileInputRef = useRef(null);
    const [show, setShow] = useState(false);
    const [logo, setLogo] = useState(null);
    const [logoName, setLogoName] = useState('');
    const [logoUploading, setLogoUploading] = useState(false);
    const [docId, setDocId] = useState(null);
    const store = useSelector((state) => state);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const password = watch('password');

    const [showModalPic, setShowModalPic] = useState(false);
    const [modalFileUrl, setModalFileUrl] = useState('');
    const [imageLoading, setImageLoading] = useState(true);

    const handleShowModal = (url) => {
        setModalFileUrl(url);
        setShowModalPic(true);
    };
    const handleCloseModal = () => {
        setShowModalPic(false); // Close the modal
        setModalFileUrl(''); // Reset file URL
    };
    useEffect(() => {
        if (showModalPic && modalFileUrl) {
            setImageLoading(true);
        }
    }, [showModalPic, modalFileUrl]);
    const [demographicAddresses, setDemographicAddresses] = useState([
        {
            type: 'primary',
            line: [''],
            city: '',
            state: '',
            postalCode: '',
            country: '',
            telecom: [
                { system: 'phone', value: '', use: 'work' },
                { system: 'fax', value: '', use: 'work' },
            ],
        },
    ]);
    const statesData = store?.getStatesReducer?.data;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // If you want to remove any prefix (like "check")
    const updateId = id?.replace(/^check/, '');

    useEffect(() => {
        dispatch(
            getRoleDataAction({
                search: 'Doctor',
                clinicId: clinicId,
                status: true,
                page: 1,
                limit: 10,
                createdById: '',
            })
        );
    }, [dispatch]);

    useEffect(() => {
        const payload = {
            id: updateId,
        };
        dispatch(getDoctorDetailsAction(payload));
        dispatch(getStatesByCountryAction());
    }, [dispatch]);

    const doctorDetails = store?.getDoctorDetailsReducer?.data?.result;

    const createResponse = store?.createtDoctorsReducer?.data?.status;
    const updateResponse = store?.createtDoctorsDetailReducer?.data?.status;
    const newDoctorId = store?.createtDoctorsReducer?.data?.doctor?._id;
    const doctorRoleId = store?.getRoleDataReducer?.data?.roles?.[0]?._id;
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    useEffect(() => {
        dispatch(getDepartmentDataAction({ status: true, category: 'Department', limit: 10, skip: 1, search: '' }));
    }, [dispatch]);
    useEffect(() => {
        if (createResponse === 200) {
            setDocId(newDoctorId);
            setActiveTab('departmentDetails');
        }
    }, [createResponse]);

    useEffect(() => {
        if (updateResponse === 200) {
            const payload = {
                id: updateId,
            };
            dispatch(getDoctorDetailsAction(payload));
            if (activeTab === 'personalDetails') {
                setActiveTab('departmentDetails');
            } else if (activeTab === 'departmentDetails') {
                setActiveTab('qualifications');
            } else if (activeTab === 'qualifications') {
                navigate('/apps/providers/list');
            }
        }
    }, [updateResponse]);

    const closeModal = () => {
        setShow(false);
    };
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setLogoUploading);
            setLogo(url);
            setLogoName(selectedFile?.name);
        } catch (error) {
            // console.error('Error during file upload:', error);
        }
    };

    useEffect(() => {
        if (doctorDetails && updateId) {
            // setValue('stateName', statesData?.states && statesData?.states?.find((data) => data?.id === doctorDetails?.userId?.address?.state?.id))
            setValue('firstName', doctorDetails?.name?.[0]?.given);
            setValue('lastName', doctorDetails?.name?.[0]?.family);
            setValue('email', doctorDetails?.userId?.email);
            setValue('phone', doctorDetails?.telecom?.[0]?.value);
            setValue('gender', doctorDetails?.userId?.gender);
            setValue('department', doctorDetails?.departmentId?._id);
            setValue('specialist', doctorDetails?.specialties?.[0]);
            if (doctorDetails?.address) {
                setDemographicAddresses(doctorDetails.address);
            }
            if (doctorDetails?.photo) {
                setLogoName(doctorDetails.photo?.[0]?.title);
            }
            const formattedDateOfBirth = doctorDetails?.userId?.dob
                ? new Date(doctorDetails?.userId?.dob).toISOString().split('T')[0]
                : '';
            // data?.joiningDate ? new Date(data.joiningDate).toISOString().split('T')[0] : ''
            setValue('dateOfBirth', formattedDateOfBirth);
        }
    }, [doctorDetails, setValue]);
    useEffect(() => {
        if (doctorDetails && updateId && statesData) {
            const state = statesData?.states?.find((data) => data?.name === doctorDetails?.address?.[0]?.state)?.id;
            dispatch(
                getCitiesAction({ state_code: state, name: doctorDetails?.address?.[0]?.city, limit: 10, skip: 1 })
            );
        }
    }, [statesData, doctorDetails]);

    const handleNewDoctor = () => {
        navigate('/apps/providers/list');
        reset();
    };

    const submitData = (data) => {
        const payload = {
            ...(updateId ? { doctorId: store?.getDoctorDetailsReducer?.data?.result?._id } : {}), // Conditionally add id if updateId exists
            // clinicId: clinicId,
            email: data?.email,
            ...(!updateId ? { password: data?.password } : {}),
            dob: data?.dateOfBirth,
            gender: data?.gender,
            name: {
                use: 'official',
                text: `${data?.firstName || ''} ${data?.lastName || ''}`.trim(),
                family: data?.lastName,
                given: data?.firstName,
                // prefix: [''],
                // suffix: [],
            },
            photo: [
                {
                    contentType: logo?.type || 'image/jpeg',
                    url: logo?.url?.split('?')[0] || logo,
                    data: logo?.data || null, // Assuming `data` contains base64 or buffer
                    hash: logo?.hash || null, // You may need to generate or pass the hash
                    title: logoName || null, // Use `logoName` as the title
                    creation: new Date(), // Automatically sets the creation date
                },
            ],
            telecom: [
                {
                    system: 'phone',
                    value: data?.phone,
                    use: 'work',
                },
                {
                    system: 'email',
                    value: data?.email,
                    use: 'work',
                },
            ],
            address: demographicAddresses,
            specialties: [data?.specialist],
        };
        if (updateId) {
            dispatch(createDoctorDetailAction({ key: encryptMessage(payload) }));
        } else {
            dispatch(createDoctorAction({ key: encryptMessage(payload) }));
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const [addresses, setAddresses] = useState(
        doctorDetails?.address || [{ use: '', line: [''], city: '', state: '', postalCode: '', country: '' }]
    );

    const [formData, setFormData] = useState({
        role: doctorRoleId,
        email: '',
        name: {
            use: 'official',
            text: '',
            family: '',
            given: '',
        },
        phone: '',
        password: '',
        confirmPassword: '',
    });

    // Example of updating the state when data changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'firstName' || name === 'lastName') {
            setFormData((prev) => {
                const firstName = name === 'firstName' ? value : prev.name.given;
                const lastName = name === 'lastName' ? value : prev.name.family;

                return {
                    ...prev,
                    name: {
                        use: 'official',
                        text: `${firstName} ${lastName}`.trim(),
                        family: lastName,
                        given: firstName,
                    },
                };
            });
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    useEffect(() => {
        if (logo) {
            setFormData({ ...formData, profileImage: logo?.url?.split('?')[0] });
        }
    }, [logo]);
    const passwordValue = watch('password', '');

    React.useEffect(() => {
        setFormData((prev) => ({ ...prev, password: passwordValue }));
        if (doctorRoleId) {
            setFormData((prev) => ({ ...prev, role: doctorRoleId }));
        }
        if (id) {
            setValue('password', '********');
            setValue('confirmPassword', '********');
        }
    }, [passwordValue, doctorRoleId, id]);

    useEffect(() => {
        const isFirstNameValid = formData.name.given?.trim()?.length >= 3 && /^[a-zA-Z]{3,}$/.test(formData.name.given);
        const isLastNameValid =
            formData.name.family?.trim()?.length >= 3 && /^[a-zA-Z]{3,}$/.test(formData.name.family);
        const isPhoneValid = formData?.phone?.trim()?.length === 13 && /^\(\d{3}\)\d{3}-\d{4}$/.test(formData.phone);
        const isDOBValid =
            formData?.dateOfBirth &&
            new Date(formData.dateOfBirth) <= new Date(new Date().setFullYear(new Date().getFullYear() - 18));
        const isEmailValid = formData?.email?.trim()?.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
        const isGenderValid = !!formData?.gender;

        const isPasswordValid =
            id ||
            (formData?.password?.trim()?.length >= 8 &&
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(formData.password) &&
                formData?.confirmPassword === formData?.password);

        const isFormValid =
            isFirstNameValid &&
            isLastNameValid &&
            isDOBValid &&
            isEmailValid &&
            isGenderValid &&
            isPasswordValid &&
            isPhoneValid;
        setIsButtonDisabled(!isFormValid);
    }, [formData, id]);

    const requiredFieldTooltip = <Tooltip id="button-tooltip">Please fill all required fields.</Tooltip>;

    return (
        <>
            <div className="pt-1 pb-2 px-0">
                <div className="container-fluid  px-0">
                    <Card className="px-md-3 py-md-2 " style={{ height: '90vh' }}>
                        <Card.Body className="py-0 px-0">
                            <div className="row">
                                <div className="col-12">
                                    <div className="row d-flex justify-content-between align-items-center">
                                        {/* Tabs Section */}
                                        <div className="col-9 col-md-8 mb-md-1 mb-1 mb-md-0">
                                            <ul className="nav nav-underline">
                                                <li className="nav-item">
                                                    <button
                                                        className={` font_active_tabs text-black nav-link ${
                                                            activeTab === 'personalDetails' ? 'active' : ''
                                                        }`}
                                                        onClick={() => handleTabChange('personalDetails')}>
                                                        Personal Details
                                                    </button>
                                                </li>
                                                <li className="nav-item">
                                                    <button
                                                        className={` font_active_tabs text-black nav-link ${
                                                            activeTab === 'departmentDetails' ? 'active' : ''
                                                        }`}
                                                        onClick={() => handleTabChange('departmentDetails')}>
                                                        Professional Information
                                                    </button>
                                                </li>
                                                <li className="nav-item">
                                                    <button
                                                        className={` font_active_tabs text-black nav-link ${
                                                            activeTab === 'qualifications' ? 'active' : ''
                                                        }`}
                                                        onClick={() => handleTabChange('qualifications')}>
                                                        Qualifications
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="col-3 col-md-4 d-flex justify-content-end align-items-center gap-md-2 gap-0 px-0">
                                            {activeTab === 'personalDetails' && (
                                                <>
                                                    {!id && (
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={isButtonDisabled ? requiredFieldTooltip : <></>}>
                                                            <span className="d-inline-block">
                                                                <Button
                                                                    onClick={() => setShow(true)}
                                                                    disabled={isButtonDisabled}
                                                                    style={
                                                                        isButtonDisabled
                                                                            ? {
                                                                                  pointerEvents: 'none',
                                                                                  opacity: 0.6, // Visual indication that the button is disabled
                                                                                  cursor: 'not-allowed', // Shows the "not allowed" cursor
                                                                              }
                                                                            : {}
                                                                    }
                                                                    className="custom-buttons text-nowrap">
                                                                    Email to Provider
                                                                </Button>
                                                            </span>
                                                        </OverlayTrigger>
                                                    )}
                                                </>
                                            )}
                                            <div className="d-none d-md-block me-2">
                                                <Button className="cancel-button" onClick={handleNewDoctor}>
                                                    Back
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="" style={{ height: '82vh' }}>
                                    {activeTab === 'personalDetails' && (
                                        <Form onSubmit={handleSubmit(submitData)}>
                                            {store?.getDoctorDetailsReducer?.loading ? (
                                                <div
                                                    className="d-flex justify-content-center align-items-center"
                                                    style={{ height: '75vh' }}>
                                                    <Spinner />
                                                </div>
                                            ) : (
                                                <>
                                                    <div
                                                        className="col-12 mt-1 scroll-container"
                                                        style={{ height: '75vh', overflow: 'scroll' }}>
                                                        <div className="row">
                                                            <div className="col-md-6 col-lg-3 col-sm-6  col-12">
                                                                <Form.Group className="mb-1">
                                                                    <Form.Label className="mb-0">
                                                                        First Name{' '}
                                                                        <span className="text-danger">*</span>
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        onKeyDown={(event) =>
                                                                            handleFirstSpace(event, 0)
                                                                        }
                                                                        {...register('firstName', {
                                                                            required: 'First name is required',
                                                                            pattern: {
                                                                                value: /^[a-zA-Z]{3,}$/,
                                                                                message:
                                                                                    'First name must contain only letters and be at least 3 characters long',
                                                                            },
                                                                        })}
                                                                        onInput={(e) => {
                                                                            e.target.value = e.target.value.replace(
                                                                                /[^a-zA-Z]/g,
                                                                                ''
                                                                            );
                                                                        }}
                                                                        onChange={(e) => {
                                                                            clearErrors('firstName');
                                                                            // setFormData({
                                                                            //     ...formData,
                                                                            //     firstName: e.target.value,
                                                                            // });
                                                                            handleInputChange(e);
                                                                        }}
                                                                        placeholder="Enter first name"
                                                                    />
                                                                    {errors.firstName && (
                                                                        <span className="text-danger err_font">
                                                                            {errors.firstName.message}
                                                                        </span>
                                                                    )}
                                                                </Form.Group>
                                                            </div>
                                                            <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                                                <Form.Group className="mb-1">
                                                                    <Form.Label className="mb-0">
                                                                        Last Name <span className="text-danger">*</span>
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        onKeyDown={(event) =>
                                                                            handleFirstSpace(event, 0)
                                                                        }
                                                                        {...register('lastName', {
                                                                            required: 'Last name is required',
                                                                            pattern: {
                                                                                value: /^[a-zA-Z]{3,}$/,
                                                                                message:
                                                                                    'Last name must contain only letters and be at least 3 characters long',
                                                                            },
                                                                        })}
                                                                        onInput={(e) => {
                                                                            e.target.value = e.target.value.replace(
                                                                                /[^a-zA-Z]/g,
                                                                                ''
                                                                            );
                                                                        }}
                                                                        onChange={(e) => {
                                                                            clearErrors('lastName');
                                                                            // setFormData({
                                                                            //     ...formData,
                                                                            //     lastName: e.target.value,
                                                                            // });
                                                                            handleInputChange(e);
                                                                        }}
                                                                        placeholder="Enter last name"
                                                                    />
                                                                    {errors.lastName && (
                                                                        <span className="text-danger err_font">
                                                                            {errors.lastName.message}
                                                                        </span>
                                                                    )}
                                                                </Form.Group>
                                                            </div>
                                                            <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                                                <div className="mb-1">
                                                                    <Form.Group className="mb-0 position-relative">
                                                                        <Form.Label className="mb-0">
                                                                            Phone <span className="text-danger">*</span>
                                                                        </Form.Label>
                                                                        <Form.Group>
                                                                            <InputGroup>
                                                                                {/* <InputGroup.Text className="ps-3 pe-1 fw-bold text-black">
                                                                                &nbsp;&nbsp;+1
                                                                            </InputGroup.Text> */}
                                                                                <InputGroup.Text className="px-1 p-0 d-flex justify-content-center align-items-center fs-5 fw-semibold text-black">
                                                                                    <img
                                                                                        src={us}
                                                                                        alt="flag"
                                                                                        width={20}
                                                                                    />
                                                                                    +1
                                                                                </InputGroup.Text>
                                                                                <Form.Control
                                                                                    type="tel"
                                                                                    {...register('phone', {
                                                                                        required:
                                                                                            'Phone number is required',
                                                                                        pattern: {
                                                                                            value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                                                                            message:
                                                                                                'Contact must be in the format (XXX)XXX-XXXX',
                                                                                        },
                                                                                        maxLength: {
                                                                                            value: 13,
                                                                                            message:
                                                                                                'Contact must not exceed 10 digits',
                                                                                        },
                                                                                        minLength: {
                                                                                            value: 13,
                                                                                            message:
                                                                                                'Contact must not be less than 10 digits',
                                                                                        },
                                                                                    })}
                                                                                    onChange={(e) => {
                                                                                        clearErrors('phone');
                                                                                        let rawValue =
                                                                                            e.target.value.replace(
                                                                                                /\D/g,
                                                                                                ''
                                                                                            ); // Remove all non-numeric characters
                                                                                        if (rawValue.length > 10)
                                                                                            rawValue = rawValue.slice(
                                                                                                0,
                                                                                                10
                                                                                            ); // Limit to 10 digits
                                                                                        const formattedValue =
                                                                                            rawValue.replace(
                                                                                                /(\d{1,3})(\d{0,3})(\d{0,4})/,
                                                                                                (match, p1, p2, p3) => {
                                                                                                    if (p3)
                                                                                                        return `(${p1})${p2}-${p3}`;
                                                                                                    if (p2)
                                                                                                        return `(${p1})${p2}`;
                                                                                                    return `(${p1}`;
                                                                                                }
                                                                                            ); // Format dynamically as (XXX)XXX-XXXX
                                                                                        e.target.value = formattedValue;
                                                                                        setFormData({
                                                                                            ...formData,
                                                                                            phone: e.target.value,
                                                                                        });
                                                                                    }}
                                                                                    placeholder="(XXX)XXX-XXXX"
                                                                                    maxLength={14}
                                                                                />
                                                                            </InputGroup>
                                                                            {errors.phone && (
                                                                                <span className="text-danger err_font">
                                                                                    {errors.phone.message}
                                                                                </span>
                                                                            )}
                                                                        </Form.Group>
                                                                        {/* <div
                                                                        className="position-absolute"
                                                                        style={{ top: '52%', left: '1%' }}
                                                                    >
                                                                        <img src={us} alt="country code flag" width={20} />
                                                                    </div> */}
                                                                    </Form.Group>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                                                <Form.Group className="mb-1">
                                                                    <Form.Label className="mb-0">
                                                                        Date of Birth{' '}
                                                                        <span className="text-danger">*</span>
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="date"
                                                                        className="form-control"
                                                                        max={
                                                                            new Date(
                                                                                new Date().setFullYear(
                                                                                    new Date().getFullYear() - 18
                                                                                )
                                                                            )
                                                                                .toISOString()
                                                                                .split('T')[0]
                                                                        } // Set max date to 18 years ago
                                                                        {...register('dateOfBirth', {
                                                                            required: 'Date of birth is required',
                                                                            validate: (value) => {
                                                                                const selectedDate = new Date(value);
                                                                                const minAllowedDate = new Date();
                                                                                minAllowedDate.setFullYear(
                                                                                    minAllowedDate.getFullYear() - 18
                                                                                );
                                                                                return (
                                                                                    selectedDate <= minAllowedDate ||
                                                                                    'You must be at least 18 years old'
                                                                                );
                                                                            },
                                                                        })}
                                                                        onChange={(e) => {
                                                                            clearErrors('dateOfBirth');
                                                                            setFormData({
                                                                                ...formData,
                                                                                dateOfBirth: e.target.value,
                                                                            });
                                                                        }}
                                                                    />

                                                                    {errors.dateOfBirth && (
                                                                        <span className="text-danger err_font">
                                                                            {errors.dateOfBirth.message}
                                                                        </span>
                                                                    )}
                                                                </Form.Group>
                                                            </div>
                                                            <div className="col-md-6 col-lg-3 col-sm-6 col-12 ">
                                                                <Form.Group className="mb-1">
                                                                    <Form.Label className="mb-0">
                                                                        Email <span className="text-danger">*</span>
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="email"
                                                                        {...register('email', {
                                                                            required: 'Email is required',
                                                                            pattern: {
                                                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                                                message: 'Enter a valid email address',
                                                                            },
                                                                        })}
                                                                        onChange={(e) => {
                                                                            clearErrors('email');
                                                                            setFormData({
                                                                                ...formData,
                                                                                email: e.target.value,
                                                                            });
                                                                        }}
                                                                        placeholder="Enter email"
                                                                    />
                                                                    {errors.email && (
                                                                        <span className="text-danger err_font">
                                                                            {errors.email.message}
                                                                        </span>
                                                                    )}
                                                                </Form.Group>
                                                            </div>
                                                            <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                                                <Form.Group className="mb-1">
                                                                    <Form.Label className="mb-0">
                                                                        Gender <span className="text-danger">*</span>
                                                                    </Form.Label>
                                                                    <Form.Select
                                                                        as="select"
                                                                        data-has-value={!!watch('gender')}
                                                                        {...register('gender', {
                                                                            required: 'Gender is required',
                                                                        })}
                                                                        onChange={(e) => {
                                                                            clearErrors('gender');
                                                                            setFormData((prev) => ({
                                                                                ...prev,
                                                                                gender: e.target.value,
                                                                            }));
                                                                        }}
                                                                        className="custom-select form-control">
                                                                        <option value="" hidden>
                                                                            Select Gender
                                                                        </option>
                                                                        <option value="Male">Male</option>
                                                                        <option value="Female">Female</option>
                                                                        <option value="Other">Other</option>
                                                                    </Form.Select>
                                                                    {errors.gender && (
                                                                        <span className="text-danger err_font">
                                                                            {errors.gender.message}
                                                                        </span>
                                                                    )}
                                                                </Form.Group>
                                                            </div>
                                                            <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                                                <Form.Group className="mb-1">
                                                                    <Form.Label className="mb-0">
                                                                        Password <span className="text-danger">*</span>
                                                                    </Form.Label>
                                                                    <div className="position-relative">
                                                                        <Form.Control
                                                                            type={showPassword ? 'text' : 'password'}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === ' ') {
                                                                                    e.preventDefault();
                                                                                }
                                                                            }}
                                                                            value={formData.password} // Use value instead of defaultValue
                                                                            onCopy={(e) => e.preventDefault()}
                                                                            onCut={(e) => e.preventDefault()}
                                                                            placeholder={'Password'}
                                                                            readOnly={updateId}
                                                                            onChange={(e) => {
                                                                                clearErrors('password');
                                                                                setFormData({
                                                                                    ...formData,
                                                                                    password: e.target.value,
                                                                                });
                                                                            }}
                                                                            {...register('password', {
                                                                                required: !updateId
                                                                                    ? 'Password is required'
                                                                                    : false,
                                                                                ...(updateId
                                                                                    ? {} // Don't apply pattern if updating
                                                                                    : {
                                                                                          pattern: {
                                                                                              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                                                                                              message:
                                                                                                  'At least 8 characters required, including 1 uppercase letter, 1 number, and 1 special character. Spaces are not allowed.',
                                                                                          },
                                                                                      }),
                                                                            })}
                                                                        />

                                                                        <span
                                                                            className="position-absolute end-0 top-0 me-2 cursor-pointer"
                                                                            style={{ marginTop: '3px' }}
                                                                            onClick={() =>
                                                                                setShowPassword(!showPassword)
                                                                            }>
                                                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                                        </span>
                                                                        {errors.password && (
                                                                            <span className="text-danger err_font">
                                                                                {errors.password.message}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </Form.Group>
                                                            </div>
                                                            <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                                                <Form.Group className="mb-1 ">
                                                                    <Form.Label className="mb-0">
                                                                        Confirm Password{' '}
                                                                        <span className="text-danger">*</span>
                                                                    </Form.Label>
                                                                    <div className="position-relative">
                                                                        <Form.Control
                                                                            type={
                                                                                showConfirmPassword
                                                                                    ? 'text'
                                                                                    : 'password'
                                                                            }
                                                                            placeholder="Confirm Password"
                                                                            {...register('confirmPassword', {
                                                                                required: !id
                                                                                    ? 'Please confirm your password'
                                                                                    : false,
                                                                                validate: (value) =>
                                                                                    value === watch('password') ||
                                                                                    'Passwords do not match',
                                                                                onChange: (e) => {
                                                                                    clearErrors('confirmPassword');
                                                                                    setFormData((prev) => ({
                                                                                        ...prev,
                                                                                        confirmPassword: e.target.value,
                                                                                    }));
                                                                                },
                                                                            })}
                                                                        />
                                                                        <span
                                                                            className="position-absolute end-0 top-0 me-2 cursor-pointer"
                                                                            style={{ marginTop: '3px' }}
                                                                            onClick={() =>
                                                                                setShowConfirmPassword(
                                                                                    !showConfirmPassword
                                                                                )
                                                                            }>
                                                                            {showConfirmPassword ? (
                                                                                <FaEyeSlash />
                                                                            ) : (
                                                                                <FaEye />
                                                                            )}
                                                                        </span>
                                                                        {errors.confirmPassword && (
                                                                            <span className="text-danger err_font">
                                                                                {errors.confirmPassword.message}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </Form.Group>
                                                            </div>
                                                            <div className="col-md-3 col-12 ">
                                                                <div className="mb-1 d-flex flex-column position-relative">
                                                                    <Form.Label className="mb-0">
                                                                        Profile Image
                                                                    </Form.Label>
                                                                    <div
                                                                        onClick={() => logoFileInputRef.current.click()}
                                                                        className={`custom-file-upload justify-content-between cursor-pointer form-control ${
                                                                            logoName || logoUploading
                                                                                ? ''
                                                                                : 'custom-form-fields'
                                                                        }`}>
                                                                        <span>
                                                                            {logoUploading
                                                                                ? 'Uploading...'
                                                                                : logoName
                                                                                  ? logoName.length > 30
                                                                                      ? logoName.slice(0, 25) + '...'
                                                                                      : logoName
                                                                                  : 'Upload Profile Image'}
                                                                        </span>

                                                                        <div className="d-flex align-items-center gap-2">
                                                                            {(logo ||
                                                                                doctorDetails?.photo?.[0]?.url) && (
                                                                                <FaEye
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleShowModal(
                                                                                            logo ||
                                                                                                doctorDetails
                                                                                                    ?.photo?.[0]?.url
                                                                                        );
                                                                                    }}
                                                                                    className="text-dark cursor-pointer"
                                                                                />
                                                                            )}

                                                                            <p className="mb-0">
                                                                                <FiUploadCloud />
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <Form.Control
                                                                        type="file"
                                                                        className="d-none "
                                                                        {...register('profileImage', {})}
                                                                        accept=".png, .jpg, .jpeg, .svg"
                                                                        ref={logoFileInputRef}
                                                                        onChange={handleFileChange}
                                                                    />
                                                                    {errors.profileImage && (
                                                                        <p className="text-danger">
                                                                            {errors.profileImage.message}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3 col-12">
                                                                <Form.Group className="mb-1">
                                                                    <Form.Label className="mb-0">
                                                                        Specialist{' '}
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        {...register('specialist')}
                                                                        onChange={(e) => {
                                                                            clearErrors('specialist');
                                                                        }}
                                                                        placeholder="Enter Specialist Name"
                                                                    />
                                                                </Form.Group>
                                                            </div>
                                                            <hr className="my-1" />
                                                        </div>
                                                        <DoctorAddress
                                                            addresses={demographicAddresses}
                                                            setAddresses={setDemographicAddresses}
                                                        />
                                                    </div>
                                                    <div
                                                        className="col-12 d-flex justify-content-end gap-2 mt-1"
                                                        style={{ height: '6vh', overflow: 'hidden' }}>
                                                        {/* <Button className="cancel-button" onClick={() => reset()}>Cancel</Button> */}
                                                        <Button
                                                            variant="primary"
                                                            type="submit"
                                                            className="custom-buttons"
                                                            disabled={store?.createtDoctorsReducer?.loading}
                                                            style={{ width: '120px' }}>
                                                            {store?.createtDoctorsReducer?.loading ||
                                                            store?.createtDoctorsDetailReducer?.loading ? (
                                                                <Spinner color="white" className="spinner-border-sm" />
                                                            ) : id ? (
                                                                'Update & Next'
                                                            ) : (
                                                                'Save & Next'
                                                            )}
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </Form>
                                    )}
                                    {activeTab === 'departmentDetails' && (
                                        <DepartmentDetails docId={docId} setActiveTab={setActiveTab} />
                                    )}
                                    {activeTab === 'qualifications' && (
                                        <DoctorQualifications docId={docId} setActiveTab={setActiveTab} />
                                    )}
                                    {activeTab === 'documents' && <Documents />}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <EmailToDoctorModal closeModal={closeModal} show={show} formData={formData} setFormData={setFormData} />

                <Modal show={showModalPic} onHide={handleCloseModal} centered>
                    <Modal.Body>
                        <div className="d-flex justify-content-center">
                            <p className="fw-bold" style={{ color: '#6169D0' }}>
                                File Preview
                            </p>
                        </div>
                        <div
                            style={{
                                overflow: 'hidden',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: '300px', // minimum height to keep space for loader
                            }}>
                            {imageLoading && (
                                <div className="d-flex justify-content-center align-items-center">
                                    <Spinner />
                                </div>
                            )}
                            <img
                                src={modalFileUrl?.url || modalFileUrl}
                                alt="File Preview"
                                onLoad={() => setImageLoading(false)}
                                onError={() => setImageLoading(false)} // hide spinner on error too
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100vh',
                                    objectFit: 'contain',
                                    display: imageLoading ? 'none' : 'block', // hide while loading
                                }}
                            />
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
};

export default NewDoctor;
