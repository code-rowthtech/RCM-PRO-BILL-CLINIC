import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Form, Modal, Row, InputGroup, Spinner } from 'react-bootstrap';
import { FiDownloadCloud, FiEye, FiUploadCloud } from 'react-icons/fi';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
    createPatientsAction,
    getPatientByIdAction,
    getPatientsAction,
    getResponsiblePartyAction,
} from '../../../redux/patients/actions';
import { useForm, Controller } from 'react-hook-form';
import us from '../../../assets/images/flags/us.jpg';
import { encryptMessage } from '../../../cryptoUtils';
import { handleUpload } from '../../../helpers/HandleUpload';
import {
    getCitiesAction,
    getDoctorsAction,
    getStatesByCountryAction,
    getSubClinicCitiesAction,
} from '../../../redux/actions';
import Responsiblle from './Responsible';
import Select from 'react-select';
import Insurance from './Insurance/Insurance';
import Demographicdetails from './Demographic';
import ReferringDoctor from './referringDoctor';

const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    if (isNaN(birthDate.getTime())) {
        return '0.0';
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    // Adjust if the current month/day is before the birth month/day
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
        years--;
        months += 12; // Add 12 months to the negative month difference
    }

    // Adjust the month difference for the day of the month
    if (today.getDate() < birthDate.getDate()) {
        months--;
    }

    // Ensure months is non-negative after adjustment
    if (months < 0) {
        months += 12;
    }

    return `${String(years).padStart(2, '0')}.${String(months).padStart(2, '0')}`;
};

const NewPatient = ({ isModal, handleClosePatientModal }) => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('updateid');
    const store = useSelector((state) => state);
    const createResponse = store?.createPatientsReducer?.data?.status;
    const createPatientResponse = store?.createPatientsReducer?.data?.data;
    const statesData = store?.getStatesReducer?.data;
    const cities = store?.getCitiesReducer?.cities1?.data?.cities;
    const patientDetails = store?.getPatientByIdReducer?.data?.patient;
    const responsibleParties = store?.getResponsiblePartyReducer?.data?.responsibleParties;
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const [submissionType, setSubmissionType] = useState(null);
    const [smShow, setSmShow] = useState(false);
    const [password, setPassword] = useState('');
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [patientId, setPatientId] = useState(null);
    const [genderIdentity, setGenderIdentity] = useState(null);
    const [age, setAge] = useState(null);
    const [status, setStatus] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedParty, setSelectedParty] = useState(null);
    const [doctorSearch, setDoctorSearch] = useState('');
    const logoFileInputRef = useRef(null);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [deceasedDateTime, setDeceasedDateTime] = useState('');
    const [showResponsibleTab, setShowResponsibleTab] = useState(true);
    const [showReferringTab, setShowReferringTab] = useState(true);
    const [activeTab, setActiveTab] = useState('personalDetails');
    const [btnShow, setBtnShow] = useState(true);
    const [stateToSelect, setStateToSelect] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [responsibleParty, setResponsibleParty] = useState('');
    const [referringPhysician, setReferringPhysician] = useState('');
    const [showModalPic, setShowModalPic] = useState(false);
    const [modalFileUrl, setModalFileUrl] = useState('');
    const [imageLoading, setImageLoading] = useState(true);
    const [skip, setSkip] = useState(1);

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
    const options = responsibleParties?.map((party) => ({
        value: party._id,
        label: party.fullName,
    }));

    const doctorOptions = doctorDetails?.map((data) => ({
        value: data?._id,
        label: data?.name?.[0]?.text,
    }));
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'personalDetails') {
            setBtnShow(true);
        } else {
            setBtnShow(false);
        }
    };
    const handleResponsibleChange = (e) => {
        const value = e.target.value;
        setResponsibleParty(value);
        setShowResponsibleTab(value === 'true');
    };

    const handleReferringChange = (e) => {
        const value = e.target.value;
        setReferringPhysician(value);
        setShowReferringTab(value === 'true');
    };

    const navigate = useNavigate();
    const {
        register,
        control,
        getValues,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        clearErrors,
        watch,
    } = useForm();
    const patientStatus = watch('patientStatus'); // Watch selected option

    const gender = watch('gender');
    const title = watch('title');

    useEffect(() => {
        if (age) {
            setValue('approxAge', age);
        }
    }, [age]);
    useEffect(() => {
        if (createResponse === 201) {
            if (submissionType === 'saveAndNext') {
                reset(); // Reset the form
                handleTabChange('demographicDetails');
                // setActiveTab('demographicDetails');
                setPatientId(createPatientResponse?._id);
                setGenderIdentity(createPatientResponse?.gender);
            } else if (submissionType === 'saveAndReset') {
                reset(); // Ensure the form resets
                setSelectedDoctor(null);
                setLogo(null);
                setLogoName(null);
                setPatientId(null);
                setGenderIdentity(null);
            } else if (submissionType === 'save') {
                setPatientId(createPatientResponse?._id);
            }
        }
    }, [createResponse, submissionType]);
    useEffect(() => {
        // const payload = {
        //     clinicId: clinicId,
        //     search: doctorSearch,
        //     limit: 20,
        // };
        // if (activeTab === 'personalDetails') {
        //     dispatch(getResponsiblePartyAction({ key: encryptMessage(payload) }));
        // }
        const doctorPayload = { status: status, search: search };
        dispatch(getDoctorsAction(doctorPayload));
    }, [
        dispatch,
        // , doctorSearch
        activeTab,
    ]);
    useEffect(() => {
        if (createResponse === 201) {
            setPatientId(createPatientResponse?._id);
            const data = { clinicId, page: skip, limit: 10, search };
            dispatch(getPatientsAction(data));
        }
    }, [createResponse, dispatch, skip, search, clinicId]);
    useEffect(() => {
        if (id) {
            const payload = {
                id: id,
            };
            dispatch(getPatientByIdAction(payload));
        }
    }, [id]);
    useEffect(() => {
        if (id) {
            setSelectedParty(
                options && options?.find((option) => option.value === patientDetails?.responsibleParty?._id)
            );
        }
    }, [id, patientDetails, responsibleParties]);

    useEffect(() => {
        if (selectedLocation) {
            setValue('address', selectedLocation?.formatted);
            const stateId =
                statesData?.states &&
                statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?.id;
            const selectedState =
                statesData?.states &&
                statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?._id;
            setValue('stateName', selectedState);
            const countyName = selectedLocation?.components?.county;
            dispatch(getCitiesAction({ state_code: stateId, name: countyName, limit: '', skip: '' }));
        }
    }, [selectedLocation, setValue, statesData, dispatch]);
    useEffect(() => {
        if (cities) {
            const selectedCounty =
                cities &&
                cities.find(
                    (data) => data?.name === selectedLocation?.components?.county || patientDetails?.address?.city?.name
                )?._id;
            setValue('city', selectedCounty);
        }
    }, [cities]);

    useEffect(() => {
        const currentTitle = getValues('title');

        if (!currentTitle || ['Mr.', 'Mrs.', 'Miss'].includes(currentTitle)) {
            if (gender === 'male') setValue('title', 'Mr.');
            else if (gender === 'female') setValue('title', 'Miss');
            else if (gender === 'other') setValue('title', 'Other');
            else if (gender === 'unknown') setValue('title', '');
        }
    }, [gender, title, setValue, getValues]);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === '1234') {
            setIsPasswordCorrect(true);
            setSmShow(false);
            setIsVisible(true);

            const id = setTimeout(() => {
                setIsPasswordCorrect(false);
                setIsVisible(false);
            }, 300000);
            setTimeoutId(id);
        }
    };
    const [profileUploading, setProfileUploading] = useState(false);
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setProfileUploading);
            setLogo(url);
            setLogoName(selectedFile?.name);
            clearErrors('profileImage');
        } catch (error) {}
    };
    useEffect(() => {
        dispatch(getStatesByCountryAction());
    }, [dispatch]);

    const [stateCode, setStateCode] = useState();

    useEffect(() => {
        if (stateToSelect) {
            dispatch(getSubClinicCitiesAction({ state_code: stateToSelect, name: '', limit: 25, skip: '' }));
        }
    }, [stateToSelect]);

    const [showCellPhone, setShowCellPhone] = useState(false);
    const [showOfficePhone, setShowOfficePhone] = useState(false);
    const [showAltEmail, setShowAltEmail] = useState(false);

    const formatPhone = (value) => {
        let rawValue = value.replace(/\D/g, '');
        if (rawValue.length > 10) rawValue = rawValue.slice(0, 10);
        return rawValue.replace(/(\d{1,3})(\d{0,3})(\d{0,4})/, (match, p1, p2, p3) => {
            if (p3) return `(${p1})${p2}-${p3}`;
            if (p2) return `(${p1})${p2}`;
            return `(${p1}`;
        });
    };

    const renderPhoneField = (label, name, iconToggle) => (
        <div className="col-md-3 col-12 mb-2">
            <Form.Group className="position-relative ">
                <Form.Label className="mb-0 d-flex justify-content-start gap-1 align-items-center">
                    {label}
                    {iconToggle}
                </Form.Label>
                <InputGroup>
                    <InputGroup.Text className="ps-3 pe-1 fw-bold text-black" style={{ height: '30px' }}>
                        &nbsp;&nbsp;+1
                    </InputGroup.Text>
                    <Controller
                        name={name}
                        control={control}
                        rules={
                            !id
                                ? {
                                      pattern: {
                                          value: /^\(\d{3}\)\d{3}-\d{4}$/,
                                          message: 'Format must be (XXX)XXX-XXXX',
                                      },
                                      maxLength: { value: 13, message: 'Max 13 characters' },
                                      minLength: { value: 13, message: 'Min 13 characters' },
                                  }
                                : {}
                        }
                        render={({ field: { onChange, value, ref } }) => (
                            <Form.Control
                                type="tel"
                                style={{ height: '30px' }}
                                placeholder="(XXX)XXX-XXXX"
                                maxLength={14}
                                value={value || ''}
                                onChange={(e) => {
                                    const formatted = formatPhone(e.target.value);
                                    onChange(formatted);
                                    clearErrors(name);
                                }}
                                onKeyPress={(e) => {
                                    if (!/[0-9]/.test(e.key)) e.preventDefault();
                                }}
                                ref={ref}
                            />
                        )}
                    />
                </InputGroup>
                <div className="position-absolute" style={{ top: '44%', left: '1%' }}>
                    <img src={us} alt="country code flag" width={20} />
                </div>
            </Form.Group>
        </div>
    );

    const maxInputsReached = showCellPhone && showOfficePhone;

    const onSubmit = (data) => {
        const payload = {
            clinicId: clinicId || '',
            birthDate: data?.dateOfBirth || '',
            approxAge: data?.approxAge || '0',
            followupDate: data?.followupDate || '',
            gender: data?.gender || '',
            followupReason: data?.followupReason || '',
            medicationHistoryConsent: true,
            patientCopayAmount: data?.patientCopayAmount || '0',
            ...(selectedDoctor?.value && { doctorId: selectedDoctor.value }),
            // Responsible Party & Referring Doctor
            responsibleParty: showResponsibleTab, // Convert string to boolean
            refferingDoctor: showReferringTab, // Convert string to boolean

            photo: logo?.url
                ? [
                      {
                          contentType: logo?.fileType || 'image/jpeg', // Assuming fileType exists, default to 'image/jpeg'
                          url: logo?.url?.split('?')[0], // Remove query params from URL
                          data: logo?.base64 || undefined, // If base64 data is available
                          hash: logo?.hash || '', // If you have a hash for verification
                          title: logoName || '', // Use provided file name as title
                          creation: new Date().toISOString(), // Current timestamp
                      },
                  ]
                : [],
            patientStatus: data?.patientStatus || '',
            paymentProfile: data?.paymentProfile || '',
            preferredCommunication: data?.preferredCommunication || '',
            // previousBirthName: data?.previousBirthName || '',
            //     profileImage: data?.profileImage || '',
            reminderLanguage: data?.reminderLanguage || '',

            //     selectedDoctor: data?.selectedDoctor || '',
            //     suffix: data?.suffix || '',
            //     title: data?.title || '',
        };

        // Structuring name inside an object
        payload.name = [
            {
                given: [data?.firstName || '', data?.middleName || ''].filter(Boolean),
                family: data?.lastName || '',
                preferred: true,
                text: `${data?.firstName || ''} ${data?.lastName || ''}`.trim(),
                use: 'official',
                suffix: [data?.suffix || ''],
                prefix: [data?.title || ''],
            },
        ];
        if (data?.previousBirthName) {
            payload.name.push({
                use: 'old', // Assuming 'old' or 'maiden' is appropriate for previous birth names
                text: data.previousBirthName,
                family: data.lastName || '', // Assuming the last name remains unchanged
                given: [data.firstName || '', data.middleName || ''].filter(Boolean),
                prefix: [], // Add any prefix if available
                suffix: [], // Add any suffix if available
                preferred: true, // Assuming this is the preferred name
                period: {
                    start: data?.previousBirthNameStartDate
                        ? new Date(data.previousBirthNameStartDate).toISOString()
                        : null,
                    end: data?.previousBirthNameEndDate ? new Date(data.previousBirthNameEndDate).toISOString() : null,
                },
            });
        }

        // Structuring telecom inside an array
        payload.telecom = [];

        payload.telecom.push({
            system: 'phone',
            use: 'home',
            value: data?.homePhone || '',
        });

        payload.telecom.push({
            system: 'phone',
            use: 'mobile',
            value: data?.cellPhone || '',
        });

        payload.telecom.push({
            system: 'phone',
            use: 'work',
            value: data?.officePhone || '',
        });

        payload.telecom.push({
            system: 'email',
            use: 'mobile',
            value: data?.email || '',
        });

        payload.telecom.push({
            system: 'email',
            use: 'work',
            value: data?.alternateEmail || '',
        });

        if (data?.patientStatus === 'Inactive-Deceased') {
            payload.deceasedBoolean = true;
            if (data?.deceasedDateTime) {
                payload.deceasedDateTime = new Date(data.deceasedDateTime).toISOString();
            }
        }
        dispatch(createPatientsAction({ key: encryptMessage(payload) }));
        if (submissionType === 'saveAndReset') {
            reset(); // Reset before dispatch
        }
    };

    const tableData = [
        { type: 'Patient', values: Array(6).fill('0.00') },
        { type: 'Insurance', values: Array(6).fill('0.00') }, // Add more rows as needed
    ];

    const handleInputChange = (data) => {
        setDoctorSearch(data);
    };
    const handleChange = (selectedOption) => {
        setSelectedDoctor(selectedOption);
    };
    return (
        <div className="background_Color ">
            <div className="container-fluid mt-2 px-0">
                <Card className="px-md-3 py-md-2 scroll-container page-height">
                    <div className="d-flex justify-content-between">
                        <div>
                            <ul className="nav nav-underline">
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${
                                            activeTab === 'personalDetails' ? 'active fw-bold' : ''
                                        }`}
                                        onClick={() => handleTabChange('personalDetails')}>
                                        Personal Details
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${
                                            activeTab === 'demographicDetails' ? 'active fw-bold' : ''
                                        }`}
                                        onClick={() => handleTabChange('demographicDetails')}>
                                        Demographic
                                    </button>
                                </li>
                                {showResponsibleTab && (
                                    <li className="nav-item">
                                        <button
                                            className={`text-black nav-link fw-medium ${
                                                activeTab === 'responsible' ? 'active fw-bold' : ''
                                            }`}
                                            onClick={() => handleTabChange('responsible')}>
                                            Responsible Party
                                        </button>
                                    </li>
                                )}
                                {showReferringTab && (
                                    <li className="nav-item">
                                        <button
                                            className={`text-black nav-link fw-medium ${
                                                activeTab === 'referringDoctor' ? 'active fw-bold' : ''
                                            }`}
                                            onClick={() => handleTabChange('referringDoctor')}>
                                            Referring Doctor
                                        </button>
                                    </li>
                                )}

                                {/* <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${activeTab === 'insurance' ? 'active fw-bold' : ''
                                            }`}
                                        onClick={() => handleTabChange('insurance')}>
                                        Insurance
                                    </button>
                                </li> */}
                            </ul>
                        </div>
                        <div className="d-flex">
                            {/* {activeTab === 'responsible' && (
                                <Button className="me-2 custom-buttons " onClick={() => handleTabChange('responsible')}>
                                    Payment
                                </Button>
                            )} */}

                            {/* <Button className="me-2">
                                Clear
                            </Button>
                            <Button className="me-2">
                                Set Password
                            </Button> */}
                            {isModal ? (
                                <Button className="cancel-button" onClick={handleClosePatientModal}>
                                    Close
                                </Button>
                            ) : (
                                <Button className="cancel-button" onClick={() => navigate(-1)}>
                                    Back
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="px-2">
                        {/* Form Section */}
                        {activeTab === 'personalDetails' && (
                            <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                                <div className="row mt-md-3">
                                    <div className="col-md-3 col-12 mb-2">
                                        <Form.Group>
                                            <Form.Label htmlFor="firstName" className="mb-0">
                                                First Name <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                id="firstName"
                                                type="text"
                                                placeholder="First Name"
                                                {...register('firstName', { required: 'First name is required' })}
                                                onKeyDown={(e) => {
                                                    if (e.key === ' ') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                            {errors.firstName && (
                                                <span className="text-danger fs-6">{errors.firstName.message}</span>
                                            )}
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-3 col-12 mb-2">
                                        <Form.Group>
                                            <Form.Label htmlFor="middleName" className="mb-0">
                                                Middle Name
                                            </Form.Label>
                                            <Form.Control
                                                id="middleName"
                                                type="text"
                                                placeholder="Middle Name"
                                                {...register('middleName')}
                                                onKeyDown={(e) => {
                                                    if (e.key === ' ') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                            {errors.middleName && (
                                                <span className="text-danger">{errors.middleName.message}</span>
                                            )}
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-3 col-12 mb-2">
                                        <Form.Group>
                                            <Form.Label htmlFor="lastName" className="mb-0">
                                                Last Name <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                id="lastName"
                                                type="text"
                                                placeholder="Last Name"
                                                {...register('lastName', { required: 'Last Name is required' })}
                                                onKeyDown={(e) => {
                                                    if (e.key === ' ') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                            {errors.lastName && (
                                                <span className="text-danger fs-6">{errors.lastName.message}</span>
                                            )}
                                        </Form.Group>
                                    </div>

                                    {/* <div className="col-md-3 col-12">
                                        <Form.Group className="mb-1 position-relative">
                                            <Form.Label className="mb-0">
                                                Cell Phone <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Group>
                                                <InputGroup>
                                                    <InputGroup.Text
                                                        className="ps-3 pe-1 fw-bold text-black"
                                                        style={{ height: '33px' }}>
                                                        &nbsp;&nbsp;+1
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type="tel"
                                                        style={{ height: '30px!important' }}
                                                        {...register(
                                                            'cellPhone',
                                                            !id
                                                                ? {
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
                                                                }
                                                                : {}
                                                        )}
                                                        onChange={(e) => {
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
                                                            e.target.value = formattedValue; // Update input value
                                                            clearErrors('cellPhone'); // Clear validation errors
                                                        }}
                                                        placeholder="(XXX)XXX-XXXX"
                                                        maxLength={14}
                                                        onKeyPress={(event) => {
                                                            // Only allow numeric characters (0-9)
                                                            if (!/[0-9]/.test(event.key)) {
                                                                event.preventDefault();
                                                            }
                                                        }}
                                                    />
                                                </InputGroup>
                                            </Form.Group>

                                            <div className="position-absolute" style={{ top: '48%', left: '1%' }}>
                                                <img src={us} alt="country code flag" width={20} />
                                            </div>
                                        </Form.Group>
                                       
                                    </div> */}
                                    {renderPhoneField(
                                        'Home Phone',
                                        'homePhone',
                                        !maxInputsReached && (
                                            <span
                                                className=" uil-plus-circle plusicon cursor-pointer"
                                                onClick={() => {
                                                    if (!showCellPhone) setShowCellPhone(true);
                                                    else if (!showOfficePhone) setShowOfficePhone(true);
                                                }}
                                            />
                                        )
                                    )}

                                    {showCellPhone &&
                                        renderPhoneField(
                                            'Cell Phone',
                                            'cellPhone',
                                            <span
                                                className=" uil-minus-circle minusicon text-danger cursor-pointer"
                                                onClick={() => setShowCellPhone(false)}
                                            />
                                        )}

                                    {showOfficePhone &&
                                        renderPhoneField(
                                            'Office Phone',
                                            'officePhone',
                                            <span
                                                className=" uil-minus-circle minusicon text-danger cursor-pointer"
                                                onClick={() => setShowOfficePhone(false)}
                                            />
                                        )}

                                    <div className="col-md-3 col-12 mb-2 mt-1">
                                        <Form.Group>
                                            <Form.Label className="mb-0 d-flex justify-content-start gap-1 align-items-center">
                                                Email ID
                                                {!showAltEmail && (
                                                    <span
                                                        className=" uil-plus-circle plusicon cursor-pointer"
                                                        onClick={() => setShowAltEmail(true)}
                                                    />
                                                )}
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Email ID"
                                                {...register('email', {
                                                    pattern: {
                                                        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                                        message: 'Invalid email address',
                                                    },
                                                })}
                                                onKeyDown={(e) => {
                                                    if (e.key === ' ') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                        </Form.Group>
                                    </div>

                                    {showAltEmail && (
                                        <div className="col-md-3 col-12 mb-2">
                                            <Form.Group>
                                                <Form.Label className="mb-0 d-flex gap-1  align-items-center">
                                                    Alternate Email
                                                    <span
                                                        onClick={() => setShowAltEmail(false)}
                                                        className=" uil-minus-circle minusicon text-danger cursor-pointer"></span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Alternate Email ID"
                                                    {...register('alternateEmail', {
                                                        pattern: {
                                                            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                                            message: 'Invalid email address',
                                                        },
                                                    })}
                                                    onKeyDown={(e) => {
                                                        if (e.key === ' ') {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                            </Form.Group>
                                        </div>
                                    )}

                                    <Col md={3} className="mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Date of Birth</Form.Label>
                                            <Form.Control
                                                type="date"
                                                {...register('dateOfBirth')}
                                                onChange={(e) => {
                                                    const calculatedAge = calculateAge(e.target.value);
                                                    setAge(calculatedAge);
                                                }}
                                                max={new Date().toISOString().split('T')[0]} // Restricts future dates
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label className="mb-0">Approx age (if DOB is unknown)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Approx. age"
                                                inputMode="decimal" // For numeric + dot keyboard on mobile
                                                pattern="^\d*\.?\d*$" // Regex for numbers with optional one dot
                                                {...register('approxAge')}
                                                onInput={(e) => {
                                                    const value = e.target.value;
                                                    // Allow only digits and one optional dot
                                                    const valid = value
                                                        .replace(/[^0-9.]/g, '')
                                                        .replace(/(\..*?)\..*/g, '$1');
                                                    e.target.value = valid;
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <div className="col-md-3 col-12 mb-2">
                                        <Form.Group>
                                            <Form.Label htmlFor="gender" className="mb-0">
                                                Gender
                                            </Form.Label>
                                            <Form.Select
                                                id="gender"
                                                {...register(
                                                    'gender'
                                                    //  { required: 'Gender is required' }
                                                )}>
                                                <option value="unknown">Unknown</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </Form.Select>
                                            {errors.gender && (
                                                <span className="text-danger">{errors.gender.message}</span>
                                            )}
                                        </Form.Group>
                                    </div>
                                </div>
                                <hr className="mt-0" />
                                <div className="row">
                                    <div className="col-md-3 col-12 mb-2">
                                        <Form.Group>
                                            <Form.Label htmlFor="patientstatus" className="mb-0">
                                                Patient Status
                                            </Form.Label>
                                            <Form.Select
                                                as="select" // Use 'select' to make it a dropdown
                                                id="patientstatus"
                                                {...register('patientStatus')}>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                                <option value="Inactive-Deceased">Inactive-Deceased</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                    {/* Show Date Input if "Inactive-Deceased" is selected */}
                                    {patientStatus === 'Inactive-Deceased' && (
                                        <div className="col-md-3 col-12">
                                            <Form.Group>
                                                <Form.Label htmlFor="deceasedDateTime" className="mb-0">
                                                    Deceased Date
                                                </Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    id="deceasedDateTime"
                                                    {...register('deceasedDateTime')}
                                                    value={deceasedDateTime}
                                                    onChange={(e) => setDeceasedDateTime(e.target.value)}
                                                />
                                            </Form.Group>
                                        </div>
                                    )}
                                    <div className="col-md-3 col-12 mb-2">
                                        <div className="d-flex flex-column position-relative">
                                            <Form.Label className="mb-0">Patient Photo</Form.Label>
                                            <div
                                                onClick={() => logoFileInputRef.current.click()}
                                                style={{ height: '30px', marginTop: '3px' }}
                                                className={`custom-file-upload justify-content-between cursor-pointer ${
                                                    logoName || profileUploading ? '' : 'custom-form-fields'
                                                }`}>
                                                {logoName
                                                    ? logoName.split('/').pop().slice(0, 30) + '...'
                                                    : profileUploading
                                                      ? 'Uploading...'
                                                      : 'Upload Photo'}
                                                <div className="d-flex align-items-center gap-2">
                                                    {(logo?.url || logo) && (
                                                        <FiEye
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleShowModal(logo?.url?.split('?')[0]);
                                                            }}
                                                            className="text-dark cursor-pointer"
                                                        />
                                                    )}

                                                    <p className="mb-0">
                                                        <FiDownloadCloud />
                                                    </p>
                                                </div>
                                            </div>
                                            <Form.Control
                                                type="file"
                                                className="d-none "
                                                style={{ height: '30px!important' }}
                                                {...register('profileImage', {})}
                                                accept=".png, .jpg, .jpeg, .svg"
                                                ref={logoFileInputRef}
                                                onChange={handleFileChange}
                                            />
                                            {errors.profileImage && (
                                                <span className="text-danger">{errors.profileImage.message}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-12 mb-2">
                                        <Form.Group>
                                            <Form.Label htmlFor="title" className="mb-0">
                                                Title
                                            </Form.Label>
                                            <Form.Select {...register('title')} aria-label="Select Title">
                                                <option value="" hidden>
                                                    Select
                                                </option>
                                                <option value="Mr.">Mr.</option>
                                                <option value="Mrs.">Mrs.</option>
                                                <option value="Miss">Miss</option>
                                                <option value="Dr.">Dr.</option>
                                                <option value="Other">Other</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-3 col-12 mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Suffix </Form.Label>
                                            <Form.Control type="text" placeholder="Suffix" {...register('suffix')} />
                                            {errors.suffix && (
                                                <span className="text-danger">{errors.suffix.message}</span>
                                            )}
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-3 col-12 mb-2">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Previous Birth Name </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Previous Birth Name"
                                                {...register('previousBirthName')}
                                            />
                                            {errors.previousBirthName && (
                                                <span className="text-danger">{errors.previousBirthName.message}</span>
                                            )}
                                        </Form.Group>
                                    </div>
                                    {/* <div className="col-md-3 col-12 mb-2">
                                        <Form.Group className="mb-1 position-relative">
                                            <Form.Label className="mb-0">Home Phone</Form.Label>
                                            <Form.Group>
                                                <InputGroup>
                                                    <InputGroup.Text
                                                        className="ps-3 pe-1 fw-bold text-black"
                                                        style={{ height: '33px' }}>
                                                        &nbsp;&nbsp;+1
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type="tel"
                                                        style={{ height: '30px!important' }}
                                                        {...register(
                                                            'homePhone',
                                                            !id
                                                                ? {
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
                                                                }
                                                                : {}
                                                        )}
                                                        onChange={(e) => {
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
                                                            e.target.value = formattedValue; // Update input value
                                                            clearErrors('homePhone'); // Clear validation errors
                                                        }}
                                                        placeholder="(XXX)XXX-XXXX"
                                                        maxLength={14}
                                                        onKeyPress={(event) => {
                                                            // Only allow numeric characters (0-9)
                                                            if (!/[0-9]/.test(event.key)) {
                                                                event.preventDefault();
                                                            }
                                                        }}
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                            <div className="position-absolute" style={{ top: '48%', left: '1%' }}>
                                                <img src={us} alt="country code flag" width={20} />
                                            </div>
                                        </Form.Group>
                                    </div> */}
                                    {/* <div className="col-md-3 col-12">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Alternate Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Alternate Email ID"
                                                {...register('alternateEmail', {
                                                    pattern: {
                                                        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                                        message: 'Invalid email address',
                                                    },
                                                })}
                                            />
                                        </Form.Group>
                                    </div> */}
                                    {/* <div className="col-md-3 col-12">
                                        <Form.Group className="mb-1 position-relative">
                                            <Form.Label className="mb-0">Office Phone</Form.Label>
                                            <Form.Group>
                                                <InputGroup>
                                                    <InputGroup.Text
                                                        className="ps-3 pe-1 fw-bold text-black"
                                                        style={{ height: '33px' }}>
                                                        &nbsp;&nbsp;+1
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type="tel"
                                                        style={{ height: '30px!important' }}
                                                        {...register(
                                                            'officePhone',
                                                            !id
                                                                ? {
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
                                                                }
                                                                : {}
                                                        )}
                                                        onChange={(e) => {
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
                                                            e.target.value = formattedValue; // Update input value
                                                            clearErrors('officePhone'); // Clear validation errors
                                                        }}
                                                        placeholder="(XXX)XXX-XXXX"
                                                        maxLength={14}
                                                        onKeyPress={(event) => {
                                                            // Only allow numeric characters (0-9)
                                                            if (!/[0-9]/.test(event.key)) {
                                                                event.preventDefault();
                                                            }
                                                        }}
                                                    />
                                                </InputGroup>
                                            </Form.Group>

                                            <div className="position-absolute " style={{ top: '48%', left: '1%' }}>
                                                <img src={us} alt="country code flag" width={20} />
                                            </div>
                                        </Form.Group>
                                    </div> */}
                                    <div className="col-md-3 col-12">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Preferred Communication</Form.Label>
                                            <Form.Select
                                                {...register('preferredCommunication')}
                                                aria-label="Select Title">
                                                <option value="" hidden>
                                                    Select
                                                </option>
                                                <option value="Home Phone">Home Phone</option>
                                                <option value="Work Phone">Work Phone</option>
                                                <option value="Cell Phone">Cell Phone</option>
                                                <option value="Email">Email</option>
                                                <option value="Text Message">Text Message</option>
                                                <option value="Declined">Declined</option>
                                                <option value="Snail Mail">Snail Mail</option>
                                                <option value="Other">Other</option>
                                            </Form.Select>
                                            {errors.preferredCommunication && (
                                                <span className="text-danger">
                                                    {errors.preferredCommunication.message}
                                                </span>
                                            )}
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-3 col-12">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Reminder Language</Form.Label>
                                            <Form.Select {...register('reminderLanguage')} defaultValue="English">
                                                <option value="English">English</option>
                                                <option value="Spanish">Spanish</option>
                                                <option value="French">French</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-3 col-12">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Responsible Party</Form.Label>
                                            <Form.Select onChange={handleResponsibleChange} value={responsibleParty}>
                                                <option value="">Select</option>
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-3 col-12">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Referring Doctor</Form.Label>
                                            <Form.Select onChange={handleReferringChange} value={referringPhysician}>
                                                <option value="">Select</option>
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                </div>
                                <hr className="mt-2" />

                                <div className="row">
                                    <div className="col-md-3 col-12 mb-2">
                                        <Form.Group className="responnsible-party-select">
                                            <Form.Label className="mb-0">Primary Provider (Doctor Name)</Form.Label>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isLoading={store?.getDoctorsReducer?.loading}
                                                isClearable={true}
                                                value={selectedDoctor}
                                                isDisabled={id ? true : false}
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
                                                        fontWeight: '600',
                                                        marginTop: '4px',
                                                        marginLeft: '-5px',
                                                        fontSize: '12px',
                                                        paddingBottom: '5px',
                                                    }),
                                                }}
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-3 col-12">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Medical History Concent</Form.Label>
                                            <Form.Select
                                                {...register('medicationHistoryConsent')}
                                                // defaultValue={'true'}
                                            >
                                                <option value={''}>Select</option>
                                                <option value={'true'}>Yes</option>
                                                <option value={'false'}>No</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-3 col-12">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Payment Profile</Form.Label>
                                            <Form.Select
                                                {...register('paymentProfile')}
                                                aria-label="Payment Profile"
                                                defaultValue={'Cash'}>
                                                <option value="Cash">Cash</option>
                                                <option value="Insurance">Insurance</option>
                                                <option value="Insurance Out of Network">
                                                    Insurance Out of Network
                                                </option>
                                                <option value="Auto Accident">Auto Accident</option>
                                                <option value="Worker's Comp">Worker's Comp</option>
                                                <option value="Other">Other</option>
                                            </Form.Select>
                                            {errors.paymentProfile && (
                                                <span className="text-danger">{errors.paymentProfile.message}</span>
                                            )}
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-3 col-12">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Patient's Copay (in $)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Patient's Copay"
                                                {...register('patientCopayAmount', {
                                                    pattern: {
                                                        value: /^[0-9]+(\.[0-9]+)?$/,
                                                        message: 'Only numbers or decimals are allowed',
                                                    },
                                                })}
                                                defaultValue={'0'}
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="col-md-3 col-12">
                                        <Form.Group>
                                            <Form.Label htmlFor="DOB" className="mb-0">
                                                Follow Up Date
                                            </Form.Label>
                                            <Form.Control
                                                type="date" // Change type to "date" for date input
                                                placeholder="Follow Up Date"
                                                {...register('followupDate')}
                                            />
                                            {errors.followupDate && (
                                                <span className="text-danger">{errors.followupDate.message}</span>
                                            )}
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-3 col-12">
                                        <Form.Group>
                                            <Form.Label className="mb-0">Follow Up Reason</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Follow Up Reason"
                                                {...register('followupReason')}
                                            />
                                        </Form.Group>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="d-flex gap-2 justify-content-end mb-2 mt-md-4">
                                    <Button
                                        className="cancel-button"
                                        onClick={() => {
                                            reset();
                                            setSelectedDoctor(null);
                                            setLogo(null);
                                            setLogoName(null);
                                        }}>
                                        Clear
                                    </Button>
                                    <Button
                                        onClick={() => setSubmissionType('saveAndReset')}
                                        disabled={
                                            store?.createPatientsReducer?.loading ||
                                            store?.updatePatientsReducer?.loading
                                        }
                                        className="custom-buttons "
                                        type="submit">
                                        Save & Add Another
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setSubmissionType('saveAndNext');
                                        }}
                                        disabled={
                                            store?.createPatientsReducer?.loading ||
                                            store?.updatePatientsReducer?.loading
                                        }
                                        className="custom-buttons "
                                        type="submit">
                                        Save & Continue Editing
                                    </Button>
                                    {/* <Button
                                        onClick={() => setSubmissionType('saveOnly')}
                                        disabled={
                                            store?.createPatientsReducer?.loading ||
                                            store?.updatePatientsReducer?.loading
                                        }
                                        className="custom-buttons "
                                        type="submit">
                                        Save
                                    </Button> */}
                                </div>
                            </Form>
                        )}
                        {activeTab === 'responsible' && (
                            <Responsiblle patientId={patientId} activeTab={activeTab} setActiveTab={setActiveTab} />
                        )}
                        {activeTab === 'insurance' && <Insurance patientId={patientId} />}
                        {activeTab === 'demographicDetails' && (
                            <Demographicdetails
                                patientId={patientId}
                                activeTab={activeTab}
                                gender={genderIdentity}
                                setActiveTab={setActiveTab}
                                showResponsibleTab={showResponsibleTab}
                                setShowResponsibleTab={setShowResponsibleTab}
                                showReferringTab={showReferringTab}
                                setShowReferringTab={setShowReferringTab}
                            />
                        )}
                        {activeTab === 'referringDoctor' && (
                            <ReferringDoctor patientId={patientId} activeTab={activeTab} setActiveTab={setActiveTab} />
                        )}
                    </div>
                </Card>
            </div>

            {/* Password Modal */}
            <Modal size="sm" show={smShow} centered onHide={() => setSmShow(false)} aria-labelledby="password-modal">
                <Modal.Body className="rounded-4 p-4">
                    <Form onSubmit={handlePasswordSubmit}>
                        <Form.Group controlId="password" className="text-center my-2">
                            <Form.Label className="mb-2">View Details</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Row className="mt-2">
                            <Col sm={12} className="text-center">
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                                <p className="fw-bold mt-2">Show the number for 5 min only</p>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
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
                            src={modalFileUrl}
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
    );
};
export default NewPatient;
