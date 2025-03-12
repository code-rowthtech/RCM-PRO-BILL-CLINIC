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
    // console.log(,'daa')
    const [activeTab, setActiveTab] = useState("personalDetails");
    const [show, setShow] = useState(false);
    const [logo, setLogo] = useState(null);
    const [docId, setDocId] = useState(null);
    const store = useSelector((state) => state);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const password = watch('password');
    const [demographicAddresses, setDemographicAddresses] = useState([
        { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: '' },
    ]);
console.log(demographicAddresses,'demographicAddressesdemographicAddresses')
    const statesData = store?.getStatesReducer?.data;
    console.log(statesData, 'statesData')
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // If you want to remove any prefix (like "check")
    const updateId = id?.replace(/^check/, '');

    // console.log(updateId, 'cleaned id');

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
    console.log(doctorDetails, 'doctorDetails')
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
                setAddresses(doctorDetails.address);
            }
            const formattedDateOfBirth = doctorDetails?.userId?.dob
                ? new Date(doctorDetails?.userId?.dob).toISOString().split('T')[0]
                : '';
            // data?.joiningDate ? new Date(data.joiningDate).toISOString().split('T')[0] : ''
            setValue('dateOfBirth', formattedDateOfBirth);
        }
    }, [doctorDetails, setValue])

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
                given: [data?.firstName ? data?.firstName : ''],
                // prefix: [''],
                // suffix: [],
            },
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
            console.log({ payload })
            dispatch(createDoctorDetailAction({ key: encryptMessage(payload) }));
        } else {
            console.log({ payload })
            dispatch(createDoctorAction({ key: encryptMessage(payload) }));
        }
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
            formData?.firstName?.trim()?.length >= 3 && /^[a-zA-Z]{3,}$/.test(formData.firstName) &&
            formData?.email?.trim()?.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
            formData?.lastName?.trim()?.length >= 3 && /^[a-zA-Z]{3,}$/.test(formData.lastName) &&
            formData?.phone?.trim()?.length === 10 && /^[0-9]+$/.test(formData.phone) &&
            (id || (
                formData?.password?.trim()?.length >= 8 &&
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(formData.password)
            ));
        setIsButtonDisabled(!isFormValid);
    }, [formData]);

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
                                                                    style={isButtonDisabled ? { pointerEvents: "none" } : {}}
                                                                    className='custom-buttons text-nowrap'
                                                                >
                                                                    Email to Doctor
                                                                </Button>
                                                            </span>
                                                        </OverlayTrigger>
                                                    )}
                                                    <div className='d-none d-md-block me-2'>
                                                        <Button className='cancel-button' onClick={handleNewDoctor}>
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
                                                                    onKeyDown={(event) => handleFirstSpace(event, 5)}
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
                                                                {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
                                                            </Form.Group>
                                                        </div>
                                                        <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                                            <Form.Group className="mb-1">
                                                                <Form.Label className="mb-0">
                                                                    Last Name {!id && <span className="text-danger">*</span>}
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    onKeyDown={(event) => handleFirstSpace(event, 5)}
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
                                                                {errors.lastName && <span className="text-danger">{errors.lastName.message}</span>}
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
                                                                                        value: /^[0-9]*$/,
                                                                                        message: 'Contact must be a number',
                                                                                    },
                                                                                    maxLength: {
                                                                                        value: 10,
                                                                                        message: 'Contact must not exceed 10 digits',
                                                                                    },
                                                                                    minLength: {
                                                                                        value: 10,
                                                                                        message: 'Contact must not be less than 10 digits',
                                                                                    },
                                                                                } : {}
                                                                                )}
                                                                                onChange={(e) => {
                                                                                    clearErrors('phone');
                                                                                    setFormData({ ...formData, phone: e.target.value });
                                                                                }}
                                                                                placeholder="1234-234-234"
                                                                                maxLength={10}
                                                                            />
                                                                        </InputGroup>
                                                                        {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
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
                                                                    Date of Birth <span className='text-danger'>*</span>
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="date"
                                                                    className='form-control'
                                                                    max={new Date().toISOString().split('T')[0]}
                                                                    {...register('dateOfBirth', {
                                                                        required: 'Date of birth is required',
                                                                        validate: (value) => {
                                                                            const selectedDate = new Date(value);
                                                                            const today = new Date();
                                                                            today.setHours(0, 0, 0, 0);
                                                                            return selectedDate <= today || 'Date of birth cannot be in the future';
                                                                        },
                                                                    })}
                                                                    onChange={(e) => {
                                                                        clearErrors('dateOfBirth');
                                                                        setFormData({ ...formData, dateOfBirth: e.target.value })
                                                                    }}
                                                                />

                                                                {errors.dateOfBirth && <span className="text-danger">{errors.dateOfBirth.message}</span>}
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
                                                                {errors.email && <span className="text-danger">{errors.email.message}</span>}
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
                                                                {errors.gender && <span className="text-danger">{errors.gender.message}</span>}
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
                                                                        className="position-absolute end-0 top-0 mt-1 me-2 cursor-pointer"
                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                    >
                                                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                                    </span>
                                                                    {errors.password && (
                                                                        <span className="text-danger">{errors.password.message}</span>
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
                                                                        className="position-absolute end-0 top-0 mt-1 me-2 cursor-pointer"
                                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                    >
                                                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                                    </span>
                                                                    {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword.message}</span>}
                                                                </div>
                                                            </Form.Group>
                                                        </div>
                                                        <hr className='my-1' />
                                                    </div>
                                                    <AddressForm addresses={demographicAddresses} setAddresses={setDemographicAddresses} />

                                                </div>
                                                <div className="col-12 d-flex justify-content-end gap-2 mt-1">
                                                    <Button className='cancel-button'>Cancel</Button>
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
                                {activeTab === "departmentDetails" && <DepartmentDetails docId={docId} />}
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
