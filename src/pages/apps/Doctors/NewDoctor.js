import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Form, InputGroup, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createDoctorAction, createDoctorDetailAction, getCities2Action, getCitiesAction, getDoctorDetailsAction, getRoleDataAction, getStatesByCountryAction } from '../../../redux/actions';
import EmailToDoctorModal from './EmailToDoctorModal';
import DepartmentDetails from './DepartmentDetails';
import Documents from './Documents';
import { handleUpload } from '../../../helpers/HandleUpload';
import { encryptMessage } from '../../../cryptoUtils';
import us from '../../../assets/images/flags/us.jpg'
import { handleFirstSpace } from '../../../helpers/noSpace';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for eye visibility toggle
import { getDepartmentDataAction } from '../../../redux/settings/action';
import AddressForm from '../Common Pages/AddressForm';
import { FiUploadCloud } from 'react-icons/fi';


const NewDoctor = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch, getValues,
        setValue,
        clearErrors,
    } = useForm();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    // const daaa=watch('state1')
    const [activeTab, setActiveTab] = useState("personalDetails");
    const logoFileInputRef = useRef(null);
    const [show, setShow] = useState(false);
    const [logo, setLogo] = useState(null);
    const [logoName, setLogoName] = useState('');
    const [logoUploading, setLogoUploading] = useState(false)
    const [docId, setDocId] = useState(null);
    const store = useSelector((state) => state);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const password = watch('password');
    const [demographicAddresses, setDemographicAddresses] = useState([
        { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: '' },
    ]);
    const statesData = store?.getStatesReducer?.data;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // If you want to remove any prefix (like "check")
    const updateId = id?.replace(/^check/, '');


    useEffect(() => {
        dispatch(
            getRoleDataAction({ search: 'Doctor', clinicId: clinicId, status: true, page: 1, limit: 10, createdById: '' })
        );
    }, [dispatch]);

    useEffect(() => {
        const payload = {
            id: updateId
        }
        dispatch(getDoctorDetailsAction(payload));
        dispatch(getStatesByCountryAction())
    }, [dispatch]);

    const doctorDetails = store?.getDoctorDetailsReducer?.data?.result
    const createResponse = store?.createtDoctorsReducer?.data?.status
    const newDoctorId = store?.createtDoctorsReducer?.data?.response?._id;
    const doctorRoleId = store?.getRoleDataReducer?.data?.roles?.[0]?._id;

    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId
    useEffect(() => {
        dispatch(getDepartmentDataAction({ status: true, category: 'Department', limit: 10, skip: 1, search: '' }));
    }, [dispatch]);
    useEffect(() => {
        if (createResponse === 200) {
            setDocId(newDoctorId)
            setActiveTab('departmentDetails')
        }
    }, [createResponse])

    const closeModal = () => {
        setShow(false);
    };
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;


    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setLogoUploading);
            setLogo(url);
            setLogoName(selectedFile?.name)
        } catch (error) {
            // console.error('Error during file upload:', error);
        }
    };

    useEffect(() => {
        if (doctorDetails && updateId) {
            // setValue('stateName', statesData?.states && statesData?.states?.find((data) => data?.id === doctorDetails?.userId?.address?.state?.id))
            setValue('firstName', doctorDetails?.name?.[0]?.given)
            setValue('lastName', doctorDetails?.name?.[0]?.family)
            setValue('email', doctorDetails?.userId?.email)
            setValue('phone', doctorDetails?.telecom?.[0]?.value)
            setValue('gender', doctorDetails?.userId?.gender)
            setValue('department', doctorDetails?.departmentId?._id)
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
    }, [doctorDetails, setValue])
    useEffect(() => {
        if (doctorDetails && updateId && statesData) {
            const state = statesData?.states?.find((data) => data?.name === doctorDetails?.address?.[0]?.state)?.id
            dispatch(getCitiesAction({ state_code: state, name: doctorDetails?.address?.[0]?.city, limit: 10, skip: 1 }))
        }
    }, [statesData, doctorDetails])

    // useEffect(() => {
    //     if (doctorDetails && updateId && cities1) {
    //         setValue('city1', cities1?.find((data) => data?.name === doctorDetails?.address?.[0]?.city))
    //     }
    // }, [statesData, doctorDetails])


    const handleNewDoctor = () => {
        navigate('/apps/doctors/list');
        reset()
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
                use: "official",
                text: `${data?.firstName || ""} ${data?.lastName || ""}`.trim(),
                family: data?.lastName,
                given: data?.firstName
                // prefix: [''],
                // suffix: [],
            },
            photo: [{
                contentType: logo?.type || 'image/jpeg',
                url: logo?.url?.split('?')[0] || logo,
                data: logo?.data || null, // Assuming `data` contains base64 or buffer
                hash: logo?.hash || null, // You may need to generate or pass the hash
                title: logoName || null, // Use `logoName` as the title
                creation: new Date() // Automatically sets the creation date
            }],
            telecom: [
                {
                    system: "phone",
                    value: data?.phone,
                    use: "work"
                },
                {
                    system: "email",
                    value: data?.email,
                    use: "work"
                }
            ],
            address: demographicAddresses,
        };
        if (updateId) {
            dispatch(createDoctorDetailAction({ key: encryptMessage(payload) }));
        } else {
            dispatch(createDoctorAction({ key: encryptMessage(payload) }));
        }
        console.log(payload, 'payload')

    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const [addresses, setAddresses] = useState(doctorDetails?.address || [
        { use: '', line: [''], city: '', state: '', postalCode: '', country: '' }
    ]);

    const [formData, setFormData] = useState({
        role: doctorRoleId,
        firstName: '',
        email: '',
        lastName: '',
        phone: '',
        password: '',
    });
    useEffect(() => {
        if (logo) {
            setFormData({ ...formData, profileImage: logo?.url?.split('?')[0] })
        }
    }, [logo])
    const passwordValue = watch('password', '');
    React.useEffect(() => {
        setFormData((prev) => ({ ...prev, password: passwordValue }));
        if (doctorRoleId) {
            setFormData((prev) => ({ ...prev, role: doctorRoleId }));
        }
        if (id) {
            setValue('password', '********')
            setValue('confirmPassword', '********')
        }
    }, [passwordValue, doctorRoleId, id]);

    
    useEffect(() => {
        const isFormValid =
            formData?.firstName?.trim()?.length >= 3 &&
            /^[a-zA-Z]{3,}$/.test(formData.firstName) &&
            formData?.lastName?.trim()?.length >= 3 &&
            /^[a-zA-Z]{3,}$/.test(formData.lastName) &&
            // formData?.phone?.trim()?.length === 14 &&
            // /^\(\d{3}\)\d{3}-\d{4}$/.test(formData.phone) &&
            formData?.dateOfBirth &&
            new Date(formData.dateOfBirth) <= new Date(new Date().setFullYear(new Date().getFullYear() - 18)) &&
            formData?.email?.trim()?.length > 0 &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
            formData?.gender &&
            (id || (
                formData?.password?.trim()?.length >= 8 &&
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(formData.password) &&
                formData?.confirmPassword === formData?.password
            ));

        setIsButtonDisabled(!isFormValid);
    }, [formData, id]);

    const requiredFieldTooltip = (
        <Tooltip id="button-tooltip">
            Please fill all required fields.
        </Tooltip>
    );

    return (
        <>
            <div className='pt-1 pb-2 px-0'>
                <div className="container-fluid  px-0">
                    <Card className="px-md-3 py-md-2 scroll-container" style={{ height: '82vh', overflow: 'scroll' }}>
                        <Card.Body className='py-0 px-0'>
                            <div className="row">
                                <div className="col-12">
                                    <div className="row d-flex justify-content-between align-items-center">
                                        {/* Tabs Section */}
                                        <div className="col-9 col-md-8 mb-md-1 mb-1 mb-md-0">
                                            <ul className="nav nav-underline">
                                                <li className="nav-item">
                                                    <button
                                                        className={` font_active_tabs text-black nav-link ${activeTab === "personalDetails" ? "active" : ""}`}
                                                        onClick={() => handleTabChange("personalDetails")}
                                                    >
                                                        Personal Details
                                                    </button>
                                                </li>
                                                <li className="nav-item">
                                                    <button
                                                        className={` font_active_tabs text-black nav-link ${activeTab === "departmentDetails" ? "active" : ""}`}
                                                        onClick={() => handleTabChange("departmentDetails")}
                                                    >
                                                        Professional Information
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="col-3 col-md-4 d-flex justify-content-end align-items-center gap-md-2 gap-0 px-0">
                                            {activeTab === "personalDetails" && (
                                                <>
                                                    {!id && (
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={isButtonDisabled ? requiredFieldTooltip : <></>}
                                                        >
                                                            <span className="d-inline-block">
                                                                <Button
                                                                    onClick={() => setShow(true)}
                                                                    disabled={isButtonDisabled}
                                                                    style={isButtonDisabled ? {
                                                                        pointerEvents: "none",
                                                                        opacity: 0.6,  // Visual indication that the button is disabled
                                                                        cursor: "not-allowed"  // Shows the "not allowed" cursor
                                                                    } : {}}
                                                                    className='custom-buttons text-nowrap'
                                                                >
                                                                    Email to Doctor
                                                                </Button>
                                                            </span>
                                                        </OverlayTrigger>
                                                    )}
                                                    <div className='d-none d-md-block me-2'>
                                                        <Button className='cancel-button'
                                                            // onClick={handleNewDoctor}
                                                            onClick={() => {
                                                                navigate('/apps/doctors/list')
                                                                reset();
                                                            }}
                                                        >
                                                            Back
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>


                                {activeTab === "personalDetails" && (
                                    <Form onSubmit={handleSubmit(submitData)}>
                                        {store?.getDoctorDetailsReducer?.loading ?
                                            <div
                                                className="d-flex justify-content-center align-items-center"
                                                style={{ height: '75vh' }}
                                            >
                                                <Spinner />
                                            </div>

                                            :
                                            <>
                                                <div className="col-12 mt-1">
                                                    <div className="row" >
                                                        <div className="col-md-6 col-lg-3 col-sm-6  col-12">
                                                            <Form.Group className="mb-1">
                                                                <Form.Label className="mb-0">
                                                                    First Name {!id && <span className="text-danger">*</span>}
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    onKeyDown={(event) => handleFirstSpace(event, 0)}
                                                                    {...register('firstName', {
                                                                        required: 'First name is required',
                                                                        pattern: {
                                                                            value: /^[a-zA-Z]{3,}$/,
                                                                            message: 'First name must contain only letters and be at least 3 characters long',
                                                                        },
                                                                    })}
                                                                    onChange={(e) => {
                                                                        clearErrors('firstName');
                                                                        setFormData({ ...formData, firstName: e.target.value });
                                                                    }}
                                                                    placeholder="Enter first name"
                                                                />
                                                                {errors.firstName && <span className="text-danger err_font">{errors.firstName.message}</span>}
                                                            </Form.Group>
                                                        </div>
                                                        <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                                            <Form.Group className="mb-1">
                                                                <Form.Label className="mb-0">
                                                                    Last Name {!id && <span className="text-danger">*</span>}
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    onKeyDown={(event) => handleFirstSpace(event, 0)}
                                                                    {...register('lastName', {
                                                                        required: 'Last name is required',
                                                                        pattern: {
                                                                            value: /^[a-zA-Z]{3,}$/,
                                                                            message: 'Last name must contain only letters and be at least 3 characters long',
                                                                        },
                                                                    })}
                                                                    onChange={(e) => {
                                                                        clearErrors('lastName');
                                                                        setFormData({ ...formData, lastName: e.target.value })
                                                                    }}
                                                                    placeholder="Enter last name"
                                                                />
                                                                {errors.lastName && <span className="text-danger err_font">{errors.lastName.message}</span>}
                                                            </Form.Group>
                                                        </div>
                                                        <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                                            <div className="mb-1">
                                                                <Form.Group className="mb-0 position-relative">
                                                                    <Form.Label className="mb-0">
                                                                        Phone {!id && <span className="text-danger">*</span>}
                                                                    </Form.Label>
                                                                    <Form.Group>
                                                                        <InputGroup>
                                                                            <InputGroup.Text className="ps-3 pe-1 fw-bold text-black">
                                                                                &nbsp;&nbsp;+1
                                                                            </InputGroup.Text>
                                                                            <Form.Control
                                                                                type="tel"
                                                                                {...register('phone', !id ? {
                                                                                    required: 'This field is required',
                                                                                    pattern: {
                                                                                        value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                                                                        message:
                                                                                            'Contact must be in the format (XXX)XXX-XXXX',
                                                                                    },
                                                                                    maxLength: {
                                                                                        value: 13,
                                                                                        message: 'Contact must not exceed 13 digits',
                                                                                    },
                                                                                    minLength: {
                                                                                        value: 13,
                                                                                        message:
                                                                                            'Contact must not be less than 13 digits',
                                                                                    },
                                                                                } : {}
                                                                                )}
                                                                                onChange={(e) => {
                                                                                    clearErrors('phone');
                                                                                    let rawValue = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters
                                                                                    if (rawValue.length > 10) rawValue = rawValue.slice(0, 10); // Limit to 10 digits
                                                                                    const formattedValue = rawValue.replace(
                                                                                        /(\d{1,3})(\d{0,3})(\d{0,4})/,
                                                                                        (match, p1, p2, p3) => {
                                                                                            if (p3) return `(${p1})${p2}-${p3}`;
                                                                                            if (p2) return `(${p1})${p2}`;
                                                                                            return `(${p1}`;
                                                                                        }
                                                                                    ); // Format dynamically as (XXX)XXX-XXXX
                                                                                    e.target.value = formattedValue;
                                                                                    setFormData({ ...formData, phone: e.target.value });
                                                                                }}
                                                                                placeholder="(XXX)XXX-XXXX"
                                                                                maxLength={14}
                                                                            />
                                                                        </InputGroup>
                                                                        {errors.phone && <span className="text-danger err_font">{errors.phone.message}</span>}
                                                                    </Form.Group>
                                                                    <div
                                                                        className="position-absolute"
                                                                        style={{ top: '52%', left: '1%' }}
                                                                    >
                                                                        <img src={us} alt="country code flag" width={20} />
                                                                    </div>
                                                                </Form.Group>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                                            <Form.Group className="mb-1">
                                                                <Form.Label className="mb-0">
                                                                    Date of Birth {!id && <span className="text-danger">*</span>}
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="date"
                                                                    className="form-control"
                                                                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} // Set max date to 18 years ago
                                                                    {...register('dateOfBirth', {
                                                                        required: 'Date of birth is required',
                                                                        validate: (value) => {
                                                                            const selectedDate = new Date(value);
                                                                            const minAllowedDate = new Date();
                                                                            minAllowedDate.setFullYear(minAllowedDate.getFullYear() - 18);
                                                                            return selectedDate <= minAllowedDate || 'You must be at least 18 years old';
                                                                        },
                                                                    })}
                                                                    onChange={(e) => {
                                                                        clearErrors('dateOfBirth');
                                                                        setFormData({ ...formData, dateOfBirth: e.target.value });
                                                                    }}
                                                                />


                                                                {errors.dateOfBirth && <span className="text-danger err_font">{errors.dateOfBirth.message}</span>}
                                                            </Form.Group>
                                                        </div>
                                                        <div className="col-md-6 col-lg-3 col-sm-6 col-12 ">
                                                            <Form.Group className="mb-1">
                                                                <Form.Label className="mb-0">
                                                                    Email {!id && <span className="text-danger">*</span>}
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
                                                                        setFormData({ ...formData, email: e.target.value });
                                                                    }}
                                                                    placeholder="Enter email"
                                                                />
                                                                {errors.email && <span className="text-danger err_font">{errors.email.message}</span>}
                                                            </Form.Group>
                                                        </div>
                                                        <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                                            <Form.Group className="mb-1">
                                                                <Form.Label className="mb-0">
                                                                    Gender {!id && <span className="text-danger">*</span>}
                                                                </Form.Label>
                                                                <Form.Select
                                                                    as="select"
                                                                    data-has-value={!!watch('gender')}
                                                                    {...register("gender", { required: "Gender is required" })}
                                                                    onChange={(e) => {
                                                                        clearErrors("gender");
                                                                        setFormData((prev) => ({ ...prev, gender: e.target.value }));
                                                                    }}
                                                                    className="custom-select form-control"
                                                                >
                                                                    <option value="" hidden>Select Gender</option>
                                                                    <option value="Male">Male</option>
                                                                    <option value="Female">Female</option>
                                                                    <option value="Other">Other</option>
                                                                </Form.Select>
                                                                {errors.gender && <span className="text-danger err_font">{errors.gender.message}</span>}
                                                            </Form.Group>
                                                        </div>
                                                        <div className='col-md-6 col-lg-3 col-sm-6 col-12'>
                                                            <Form.Group className="mb-1">
                                                                <Form.Label className="mb-0">
                                                                    Password {!id && <span className="text-danger">*</span>}
                                                                </Form.Label>
                                                                <div className="position-relative">
                                                                    <Form.Control
                                                                        type={showPassword ? "text" : "password"}
                                                                        // onKeyDown={(event) => handleFirstSpace(event, 0)}

                                                                        onKeyDown={(e) => {
                                                                            if (e.key === " ") {
                                                                                e.preventDefault();
                                                                            }
                                                                        }}
                                                                        defaultValue={updateId ? '*********' : ''}
                                                                        onCopy={(e) => e.preventDefault()}
                                                                        onCut={(e) => e.preventDefault()}
                                                                        placeholder={"Password"}
                                                                        readOnly={updateId}
                                                                        onChange={(e) => {
                                                                            clearErrors('password');
                                                                            setFormData({ ...formData, password: e.target.value })
                                                                        }}
                                                                        {...register("password", {
                                                                            required: !updateId ? "Password is required" : false,
                                                                            pattern: {
                                                                                value: !updateId ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/ : '',
                                                                                message:
                                                                                    "At least 8 characters required, including 1 uppercase letter, 1 number, and 1 special character. Spaces are not allowed.",
                                                                            },

                                                                        })}
                                                                    />
                                                                    <span
                                                                        className="position-absolute end-0 top-0 me-2 cursor-pointer"
                                                                        style={{ marginTop: '3px' }}
                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                    >
                                                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                                    </span>
                                                                    {errors.password && (
                                                                        <span className="text-danger err_font">{errors.password.message}</span>
                                                                    )}
                                                                </div>
                                                            </Form.Group>
                                                        </div>
                                                        <div className='col-md-6 col-lg-3 col-sm-6 col-12'>
                                                            <Form.Group className='mb-1 '>
                                                                <Form.Label className="mb-0">Confirm Password {!id && <span className="text-danger">*</span>}</Form.Label>
                                                                <div className="position-relative">
                                                                    <Form.Control
                                                                        type={showConfirmPassword ? "text" : "password"}
                                                                        placeholder="Confirm Password"
                                                                        readOnly={id}
                                                                        onCopy={(e) => e.preventDefault()}
                                                                        onCut={(e) => e.preventDefault()}
                                                                        onChange={(e) => {
                                                                            clearErrors('confirmPassword');
                                                                            setFormData({ ...formData, confirmPassword: e.target.value })
                                                                        }}
                                                                        {...register('confirmPassword', {
                                                                            ...(!id ? { required: 'Please confirm your password' } : {}),
                                                                            pattern: {
                                                                                value: id ? '' : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                                                                                message: 'At least 8 characters required, including 1 uppercase letter, 1 number, and 1 special character',
                                                                            },
                                                                            validate: value =>
                                                                                value === password || 'Passwords do not match'
                                                                        })}
                                                                    />
                                                                    <span
                                                                        className="position-absolute end-0 top-0 me-2 cursor-pointer"
                                                                        style={{ marginTop: '3px' }}
                                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                    >
                                                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                                    </span>
                                                                    {errors.confirmPassword && <span className="text-danger err_font">{errors.confirmPassword.message}</span>}
                                                                </div>
                                                            </Form.Group>
                                                        </div>
                                                        <div className="col-md-3 col-12 ">
                                                            <div className="mb-1 d-flex flex-column position-relative">
                                                                <Form.Label className="mb-0">Profile Image</Form.Label>
                                                                <div
                                                                    onClick={() => logoFileInputRef.current.click()}
                                                                    className={`custom-file-upload justify-content-between cursor-pointer form-control ${logoName || logoUploading ? '' : 'custom-form-fields'}`}
                                                                >
                                                                    {logoName ? logoName : logoUploading ? 'Uploading...' : 'Upload Profile Image'}
                                                                    <p className="mb-0">
                                                                        <FiUploadCloud />
                                                                    </p>
                                                                </div>
                                                                <Form.Control

                                                                    type="file"
                                                                    className="d-none "
                                                                    {...register('profileImage', {
                                                                    })}
                                                                    accept=".png, .jpg, .jpeg, .svg"
                                                                    ref={logoFileInputRef}
                                                                    onChange={handleFileChange}
                                                                />
                                                                {errors.profileImage &&
                                                                    <p className="text-danger">{errors.profileImage.message}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                        <hr className='my-1' />
                                                    </div>
                                                    <AddressForm addresses={demographicAddresses} setAddresses={setDemographicAddresses} />

                                                </div>
                                                <div className="col-12 d-flex justify-content-end gap-2 mt-1">
                                                    <Button className="cancel-button" onClick={() => reset()}>Cancel</Button>
                                                    <Button variant="primary" type='submit' className='custom-buttons' disabled={store?.createtDoctorsReducer?.loading} >
                                                        {store?.createtDoctorsReducer?.loading ?
                                                            <Spinner color='white' className='spinner-border-sm' />
                                                            :
                                                            id ? "Update" : "Next"
                                                        }
                                                    </Button>
                                                </div>
                                            </>
                                        }

                                    </Form>
                                )}
                                {activeTab === "departmentDetails" && <DepartmentDetails docId={docId} setActiveTab={setActiveTab} />}
                                {activeTab === "documents" && <Documents />}
                            </div>
                        </Card.Body>
                    </Card >
                </div >
                <EmailToDoctorModal closeModal={closeModal} show={show} formData={formData} setFormData={setFormData} />
            </div >
        </>
    );
};

export default NewDoctor;
