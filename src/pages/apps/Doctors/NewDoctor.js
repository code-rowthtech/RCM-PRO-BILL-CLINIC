import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Form, InputGroup, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiDownloadCloud, FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { createDoctorAction, getCities2Action, getCitiesAction, getDoctorDetailsAction, getDoctorsrolesAction, getStatesByCountryAction } from '../../../redux/actions';
import EmailToDoctorModal from './EmailToDoctorModal';
import DepartmentDetails from './DepartmentDetails';
import Documents from './Documents';
import { handleUpload } from '../../../helpers/HandleUpload';
import { encryptMessage } from '../../../cryptoUtils';
import us from '../../../assets/images/flags/us.jpg'
import { handleFirstSpace } from '../../../helpers/noSpace';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for eye visibility toggle
import { getDepartmentDataAction, getMastersDataAction } from '../../../redux/settings/action';


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
    const [sameAsPrimary, setSameAsPrimary] = useState(false);
    // const daaa=watch('state1')
    // console.log(,'daa')
    const [activeTab, setActiveTab] = useState("personalDetails");
    const [show, setShow] = useState(false);
    const logoFileInputRef = useRef(null);
    const degreeFileInputRef = useRef(null);
    const [logo, setLogo] = useState(null);
    const [logoName, setLogoName] = useState('');
    const [degree, setDegree] = useState(null);
    const [degreeName, setDegreeName] = useState('');
    const [docId, setDocId] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [mailingLongitude, setMailingLongitude] = useState(null);
    const [mailingLatitude, setMailingLatitude] = useState(null);
    const [stateToSelect, setStateToSelect] = useState(null);
    const [focused, setFocused] = useState(false);
    const [mailingFocused, setMailingFocused] = useState(false);
    const [updatePage, setUpdatePage] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const store = useSelector((state) => state);
    const [stateId, setStateId] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const password = watch('password');

    const statesData = store?.getStatesReducer?.data;
    const role = store?.getDoctorsRolesReducer?.data
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // If you want to remove any prefix (like "check")
    const updateId = id?.replace(/^check/, '');

    // console.log(updateId, 'cleaned id');

    useEffect(() => {
        dispatch(
            getDoctorsrolesAction({ search: 'Doctor' })
        );
    }, [dispatch]);

    useEffect(() => {
        const payload = {
            id: updateId
        }
        dispatch(getDoctorDetailsAction({ key: encryptMessage(payload) }));
        dispatch(getStatesByCountryAction())
    }, [dispatch]);



    const cities = store?.getCitiesReducer?.data?.cities;
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;
    const cities2 = store?.getCitiesReducer?.cities2?.data?.cities;
    const doctorDetails = store?.getDoctorDetailsReducer?.data?.result
    const createResponse = store?.createtDoctorsReducer?.data?.status
    const createData = store?.createtDoctorsReducer?.data?.doctor?._id;
    const newDoctorId = store?.createtDoctorsReducer?.data?.response?._id
    const doctorRoleId = store?.getDoctorsRolesReducer?.data?.result?.[0]?._id
    console.log(doctorDetails, 'newDoctorIddoctorDetails')
    const clinicDataToUpdate = store?.getClinicByIdReducer?.data?.clinic;
    const clinicsList = store?.getClinicsByParentReducer?.data?.data;
    const departmentGetData = store?.getDepartmentDataReducer?.data?.result;

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
            const cityName = doctorDetails?.userId?.address?.city?.name || ''; // Fallback to an empty string if name is missing
            // setValue('stateName', statesData?.states && statesData?.states?.find((data) => data?.id === doctorDetails?.userId?.address?.state?.id))
            setValue('firstName', doctorDetails?.userId?.firstName)
            setValue('lastName', doctorDetails?.userId?.lastName)
            setValue('email', doctorDetails?.userId?.email)
            setValue('phone', doctorDetails?.userId?.phone)
            setValue('gender', doctorDetails?.userId?.gender)
            // setValue('city', cityName)
            setValue('zip1', doctorDetails?.userId?.primaryAddress?.zip)
            setValue('zip2', doctorDetails?.userId?.mailingAddress?.zip)
            setValue('street1', doctorDetails?.userId?.primaryAddress?.street)
            setValue('street2', doctorDetails?.userId?.mailingAddress?.street)
            setLongitude(doctorDetails?.userId?.primaryAddress?.longitude)
            setLatitude(doctorDetails?.userId?.primaryAddress?.latitude)
            setMailingLatitude(doctorDetails?.userId?.mailingAddress?.latitude)
            setMailingLongitude(doctorDetails?.userId?.mailingAddress?.longitude)
            setValue('degreeName', doctorDetails?.userId?.degreeName)
            setValue('address1', doctorDetails?.userId?.primaryAddress?.address)
            setValue('address2', doctorDetails?.userId?.mailingAddress?.address)

            const formattedDateOfBirth = doctorDetails?.userId?.dob
                ? new Date(doctorDetails?.userId?.dob).toISOString().split('T')[0]
                : '';

            // data?.joiningDate ? new Date(data.joiningDate).toISOString().split('T')[0] : ''
            setValue('dateOfBirth', formattedDateOfBirth);
            const state = statesData?.states && statesData?.states.find((data) => data?._id === doctorDetails?.userId?.primaryAddress?.state?._id)?._id;
            if (state) {
                dispatch(getCitiesAction({ state_code: doctorDetails?.userId?.primaryAddress?.state?.id, name: doctorDetails?.userId?.primaryAddress?.city?.name, skip: '', limit: '' }))
            }
            setValue('state1', doctorDetails?.userId?.primaryAddress?.state?._id);
            const state2 = statesData?.states && statesData?.states.find((data) => data?._id === doctorDetails?.userId?.mailingAddress?.state?._id)?._id;
            if (state2) {
                dispatch(getCities2Action({ state_code: doctorDetails?.userId?.mailingAddress?.state?.id, name: doctorDetails?.userId?.mailingAddress?.city?.name, skip: '', limit: '' }))
            }
            setValue('state2', doctorDetails?.userId?.mailingAddress?.state?._id);
            if (doctorDetails?.userId?.profileImage) {
                setLogoName(doctorDetails?.userId?.profileImage?.fileName)
            }
            if (doctorDetails?.userId?.degreeDoc) {
                setDegreeName(doctorDetails?.userId?.degreeDoc?.fileName)
            }
        }
    }, [doctorDetails, setValue])



    const handleNewDoctor = () => {
        navigate('/apps/doctors/list');
        reset()
    };

    const [logoUploading, setLogoUploading] = useState(false)
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
    const [degreeUploading, setDegreeUploading] = useState(false);
    const handleFileChangeDegree = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setDegreeUploading);
            setDegree(url);
            setDegreeName(selectedFile?.name)
        } catch (error) {
            // console.error('Error during file upload:', error);
        }
    };
    // console.log(logo)

    const submitData = (data) => {
        const payload = {
            ...(updateId ? { id: updateId } : {}), // Conditionally add `id` if `updateId` exists
            // clinicId: clinicId,
            firstName: data?.firstName,
            lastName: data?.lastName,
            email: data?.email,
            department: data?.department,
            dob: data?.dateOfBirth,
            gender: data?.gender,
            ...(!updateId ? { password: data?.password } : {}),
            phone: data?.phone,
            degreeName: data?.degreeName,
            profileImage: {
                url: logo?.url?.split('?')[0],
                fileName: logoName,
            },
            degreeDoc: {
                url: degree?.url?.split('?')[0],
                fileName: degreeName,
            },
            role: doctorRoleId,
            primaryAddress: {
                ...(data?.address1 ? { address: data?.address1 } : {}),
                ...(data?.street1 ? { street: data?.street1 } : {}),
                ...(data?.state1 ? { state: data?.state1 } : {}),
                ...(data?.zip1 ? { zip: data?.zip1 } : {}),
                ...(latitude ? { latitude: latitude } : {}),
                ...(longitude ? { longitude: longitude } : {}),
                ...(selectedCity || data?.city1 ? { city: selectedCity || data?.city1 } : {}),
            },
            mailingAddress: sameAsPrimary ?
                {
                    ...(data?.address1 ? { address: data?.address1 } : {}),
                    ...(data?.street1 ? { street: data?.street1 } : {}),
                    ...(data?.state1 ? { state: data?.state1 } : {}),
                    ...(data?.zip1 ? { zip: data?.zip1 } : {}),
                    ...(latitude ? { latitude: latitude } : {}),
                    ...(longitude ? { longitude: longitude } : {}),
                    ...(selectedCity || data?.city1 ? { city: selectedCity || data?.city1 } : {}),
                }
                : {
                    ...(data?.address2 ? { address: data?.address2 } : {}),
                    ...(data?.street2 ? { street: data?.street2 } : {}),
                    ...(data?.state2 ? { state: data?.state2 } : {}),
                    ...(data?.zip2 ? { zip: data?.zip2 } : {}),
                    ...(mailingLatitude ? { latitude: mailingLatitude } : {}),
                    ...(mailingLongitude ? { longitude: mailingLongitude } : {}),
                    ...(selectedCity || data?.city2 ? { city: selectedCity || data?.city2 } : {}),
                }
        };
        console.log(payload, 'payload')
        // Encrypt and dispatch the payload
        dispatch(createDoctorAction({ key: encryptMessage(payload) }));
    };


    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const [searchedLocations, setSearchedLocations] = useState(null)
    const [searchedMailingLocations, setSearchedMailingLocations] = useState(null)

    const getGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed'; // Replace with your API key
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                return data; // Return the geocoding data
            } catch (error) {
                console.error("Failed to fetch geocode data:", error);
                return null; // Return null in case of error
            }
        }
        fetchGeocodeData(addressToSearch)
            .then((data) => {
                if (data) {
                    setSearchedLocations(data?.results)
                } else {
                    console.log("No data returned.");
                }
            });
    }

    const getMailingGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed'; // Replace with your API key
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                return data; // Return the geocoding data
            } catch (error) {
                console.error("Failed to fetch geocode data:", error);
                return null; // Return null in case of error
            }
        }
        fetchGeocodeData(addressToSearch)
            .then((data) => {
                if (data) {
                    setSearchedMailingLocations(data?.results)
                } else {
                    console.log("No data returned.");
                }
            });
    }
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedMailingLocation, setSelectedMailingLocation] = useState(null);
    console.log(selectedLocation, 'selectedLocationselectedLocation')
    useEffect(() => {
        if (selectedLocation) {
            setLatitude(selectedLocation?.bounds?.southwest?.lat);
            setLongitude(selectedLocation?.bounds?.southwest?.lng);
            setValue('address1', selectedLocation?.formatted)
            const stateId = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?.id;
            const selectedState = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?._id;
            setFormData((prevState) => ({
                ...prevState,
                primaryAddress: {
                    ...prevState.primaryAddress,
                    state: selectedState,
                }
            }));
            setValue('state1', selectedState)
            const countyName = selectedLocation?.components?.county;
            dispatch(getCitiesAction({ state_code: stateId, name: countyName, limit: '', skip: '' }))
        }
        if (selectedMailingLocation) {
            setMailingLatitude(selectedMailingLocation?.bounds?.southwest?.lat);
            setMailingLongitude(selectedMailingLocation?.bounds?.southwest?.lng);
            setValue('address2', selectedMailingLocation?.formatted)
            const stateId = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedMailingLocation?.components?.state_code)?.id;
            const selectedState = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedMailingLocation?.components?.state_code)?._id;
            setValue('state2', selectedState)
            const countyName = selectedMailingLocation?.components?.county;
            dispatch(getCities2Action({ state_code: stateId, name: countyName, limit: '', skip: '' }))
        }
    }, [selectedLocation, selectedMailingLocation, setValue, statesData, dispatch])
    console.log({ cities1 })
    useEffect(() => {
        if (cities1) {
            const selectedCounty = cities1 && cities1.find((data) => data?.name === selectedLocation?.components?.county || doctorDetails?.userId?.primaryAddress?.city?.name)?._id;
            setValue('city1', selectedCounty)
            setFormData((prevState) => ({
                ...prevState,
                primaryAddress: {
                    ...prevState.primaryAddress,
                    city: selectedCounty,
                }
            }));
        }
        if (cities2) {
            const selectedCounty = cities2 && cities2.find((data) => data?.name === selectedMailingLocation?.components?.county || doctorDetails?.userId?.primaryAddress?.city?.name)?._id;
            setValue('city2', selectedCounty)
            setFormData((prevState) => ({
                ...prevState,
                mailingAddress: {
                    ...prevState.mailingAddress,
                    city: selectedCounty,
                }
            }));
        }
    }, [cities1, cities2])

    const handleStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        dispatch(getCitiesAction({ state_code: key?.id, name: '', limit: 25, skip: '' }))
    };
    const handleMailingStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        dispatch(getCities2Action({ state_code: key?.id, name: '', limit: 25, skip: '' }))
    };

    const [formData, setFormData] = useState({
        role: doctorRoleId,
        firstName: '',
        email: '',
        lastName: '',
        phone: '',
        password: '',
    });
    console.log(formData, 'formDataformData')
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
            <div className='pt-1 pb-2'>
                <div className="container-fluid mt-2">
                    <Card className='px-2 py-2 '>
                        <Card.Body className='py-0'>
                            <div className="row">
                                <div className="col-12 d-flex justify-content-between align-items-center">
                                    {/* <p className="fw-bold" style={{ fontWeight: '600' }}>
                                        {!id ? 'NEW DOCTOR' : 'UPDATE DOCTOR'}
                                    </p> */}
                                    <div>
                                        <ul className="nav nav-underline">
                                            <li className="nav-item">
                                                <button
                                                    className={`text-black nav-link ${activeTab === "personalDetails" ? "active" : ""}`}
                                                    onClick={() => handleTabChange("personalDetails")}
                                                >
                                                    Personal Details
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button
                                                    className={`text-black nav-link ${activeTab === "departmentDetails" ? "active" : ""}`}
                                                    onClick={() => handleTabChange("departmentDetails")}
                                                >
                                                    Professional Information
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button
                                                    className={`text-black nav-link ${activeTab === "documents" ? "active" : ""}`}
                                                    onClick={() => handleTabChange("documents")}
                                                >
                                                    Documents
                                                </button>
                                            </li>
                                        </ul>
                                    </div>

                                    {activeTab === "personalDetails" && (
                                        <div className='d-flex gap-2'>
                                            {!id && (
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={isButtonDisabled ? requiredFieldTooltip : <></>}
                                                >
                                                    <span className="d-inline-block">
                                                        <Button
                                                            onClick={() => setShow(true)}
                                                            disabled={isButtonDisabled}
                                                            style={isButtonDisabled ? { pointerEvents: 'none' } : {}}
                                                        >
                                                            Email to Doctor
                                                        </Button>
                                                    </span>
                                                </OverlayTrigger>
                                            )}

                                            <Button variant='secondary' onClick={handleNewDoctor}>Back</Button>
                                        </div>
                                    )}

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
                                                    <div className="row" style={{ borderBottom: '1px solid #444141' }}>
                                                        <div className="col-3">
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
                                                                            value: /^[a-zA-Z]{3,}$/, // Regex: Only letters, at least 3 characters
                                                                            message: 'First name must contain only letters and be at least 3 characters long',
                                                                        },
                                                                    })}
                                                                    onChange={(e) => {
                                                                        clearErrors('firstName'); // Clears validation errors for 'dateOfBirth'
                                                                        setFormData({ ...formData, firstName: e.target.value });
                                                                    }}
                                                                    placeholder="Enter first name"
                                                                />
                                                                {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
                                                            </Form.Group>
                                                        </div>
                                                        <div className="col-3">
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
                                                                            value: /^[a-zA-Z]{3,}$/, // Regex: Only letters, at least 3 characters
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
                                                        <div className="col-3">
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
                                                        <div className="col-3">
                                                            <Form.Group className="mb-1">
                                                                <Form.Label className="mb-0">
                                                                    Date of Birth <span className='text-danger'>*</span>
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="date"
                                                                    max={new Date().toISOString().split('T')[0]} // Prevents future dates in date picker
                                                                    {...register('dateOfBirth', {
                                                                        required: 'Date of birth is required',
                                                                        validate: (value) => {
                                                                            const selectedDate = new Date(value);
                                                                            const today = new Date();
                                                                            today.setHours(0, 0, 0, 0); // Reset hours to ensure clean comparison
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
                                                        <div className="col-6">
                                                            <div className="col-12">
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <Form.Group className="mb-1">
                                                                            <Form.Label className="mb-0">
                                                                                Email {!id && <span className="text-danger">*</span>}
                                                                            </Form.Label>
                                                                            <Form.Control
                                                                                type="email"
                                                                                {...register('email', {
                                                                                    required: 'Email is required',
                                                                                    pattern: {
                                                                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for basic email format
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
                                                                    <div className="col-6">
                                                                            <Form.Group className="mb-2">
                                                                                <Form.Label className="mb-0">Department <span className='text-danger'>*</span></Form.Label>
                                                                                <Form.Select
                                                                                    {...register('department', { required: 'Department is required' })}
                                                                                >
                                                                                    <option value="">Select Department</option>
                                                                                    {departmentGetData?.map((data) => (
                                                                                        <option key={data._id} value={data.name}>
                                                                                            {data.name}
                                                                                        </option>
                                                                                    ))}
                                                                                </Form.Select>
                                                                                {errors.department && (
                                                                                    <span className="text-danger fs-6">{errors.department.message}</span>
                                                                                )}
                                                                            </Form.Group>
                                                                    </div>
                                                                </div>
                                                            </div>


                                                            <Form.Group className="mb-1">
                                                                <Form.Label className="mb-0">Degree Name</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    {...register('degreeName',
                                                                        // { required: 'Degree Name is required' }
                                                                    )}
                                                                    onChange={(e) => {
                                                                        clearErrors('degreeName');
                                                                        setFormData({ ...formData, degreeName: e.target.value });
                                                                    }}
                                                                    // value={formData.Degree Name}
                                                                    placeholder="Enter Degree Name"
                                                                />
                                                                {errors.email && <span className="text-danger">{errors?.degreeName?.message}</span>}
                                                            </Form.Group>
                                                            <div className="mb-2 d-flex flex-column position-relative">
                                                                <Form.Label className="mb-0">Profile Image</Form.Label>
                                                                <div
                                                                    onClick={() => logoFileInputRef.current.click()}
                                                                    className={`custom-file-upload justify-content-between cursor-pointer ${logoName || logoUploading ? '' : 'custom-form-fields'}`}
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
                                                                    accept=".png, .jpg, .jpeg, .svg" // Allow only specific file types
                                                                    ref={logoFileInputRef}
                                                                    onChange={handleFileChange}
                                                                />
                                                                {errors.profileImage &&
                                                                    <p className="text-danger">{errors.profileImage.message}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className='row '>
                                                                <div className='col-6 '>
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
                                                                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
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
                                                                <div className='col-6'>

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
                                                                <div className="mb-1 d-flex flex-column position-relative">
                                                                    <Form.Label className="mb-0">Degree</Form.Label>
                                                                    <div
                                                                        onClick={() => degreeFileInputRef.current.click()}
                                                                        className={`custom-file-upload justify-content-between cursor-pointer ${degreeName || degreeUploading ? '' : 'custom-form-fields'}`}
                                                                    >
                                                                        {degreeName ? degreeName : degreeUploading ? 'Uploading...' : 'Upload Degree'}
                                                                        <p className="mb-0">
                                                                            <FiUploadCloud />
                                                                        </p>
                                                                    </div>
                                                                    <Form.Control
                                                                        type="file"
                                                                        className="d-none "
                                                                        {...register('degreeDoc', {
                                                                        })}
                                                                        ref={degreeFileInputRef}
                                                                        onChange={handleFileChangeDegree}
                                                                    />
                                                                    {errors.degreeDoc && (
                                                                        <p className="text-danger">{errors.degreeDoc.message}</p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <Form.Group className="mb-1">
                                                                <Form.Label className="mb-0">
                                                                    Gender <span className="text-danger">*</span>
                                                                </Form.Label>
                                                                <Form.Control
                                                                    as="select"
                                                                    {...register("gender", { required: "Gender is required" })}
                                                                    onChange={(e) => {
                                                                        clearErrors("gender");
                                                                        setFormData((prev) => ({ ...prev, gender: e.target.value }));
                                                                    }}
                                                                // className="mt-1"
                                                                >
                                                                    <option value="">Select Gender</option>
                                                                    <option value="Male">Male</option>
                                                                    <option value="Female">Female</option>
                                                                    <option value="Other">Other</option>
                                                                </Form.Control>
                                                                {errors.gender && <span className="text-danger">{errors.gender.message}</span>}
                                                            </Form.Group>
                                                        </div>
                                                    </div>
                                                    <div className='row mt-1'>

                                                        <Col sm={12} className='pb-1' style={{ borderBottom: '1px solid #444141' }}>
                                                            <Row>
                                                                <Col sm={12} className=''>
                                                                    <span className='text-black fw-semibold form-label'>Primary Address</span>
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <Row className='position-relative'>
                                                                        <Col sm={12}>
                                                                            <Form.Group className="mb-1">
                                                                                <Form.Label className="mb-0">Address</Form.Label>
                                                                                <div style={{ position: 'relative' }}>
                                                                                    <Form.Control
                                                                                        type="text"
                                                                                        defaultValue={updatePage ? clinicDataToUpdate?.primaryAddress?.address : ''}
                                                                                        {...register('address1')}
                                                                                        onChange={(e) => {
                                                                                            // setFormData({ ...formData, address: e.target.value });

                                                                                            setFormData((prevState) => ({
                                                                                                ...prevState,
                                                                                                primaryAddress: {
                                                                                                    ...prevState.primaryAddress,
                                                                                                    address: e.target.value,
                                                                                                }
                                                                                            }));
                                                                                            getGeolocation(e);
                                                                                            setFocused(true); // Open dropdown on input
                                                                                        }}
                                                                                        onFocus={() => setFocused(true)} // Open dropdown when the field is focused
                                                                                        onBlur={() => {
                                                                                            setTimeout(() => setFocused(false), 200); // Delay to allow selection before hiding dropdown
                                                                                        }}
                                                                                        placeholder="Search for address"
                                                                                        autoComplete="off"
                                                                                    />
                                                                                    {/* {/ Dropdown suggestions /} */}
                                                                                    <div
                                                                                        style={{
                                                                                            position: 'absolute',
                                                                                            top: '100%',
                                                                                            left: 0,
                                                                                            width: '100%',
                                                                                            maxHeight: '150px',
                                                                                            overflow: 'auto',
                                                                                            zIndex: 111,
                                                                                            backgroundColor: '#fff',
                                                                                            border: '1px solid #ced4da',
                                                                                            borderTop: 'none',
                                                                                        }}
                                                                                        className={`scroll-container hover-bg-change ${searchedLocations?.length === 0 || !focused ? 'd-none' : ''}`}
                                                                                    >
                                                                                        {searchedLocations?.map((data, index) => (
                                                                                            <p
                                                                                                key={index}
                                                                                                onClick={() => {
                                                                                                    setSelectedLocation(data)
                                                                                                    console.log(data, 'data202020');
                                                                                                    setValue('zip1', data?.components?.postcode || '')    // Update only the address field
                                                                                                    setFormData((prevState) => ({
                                                                                                        ...prevState,
                                                                                                        primaryAddress: {
                                                                                                            ...prevState.primaryAddress,
                                                                                                            address: data?.formatted,
                                                                                                            ...(data?.bounds?.southwest?.lat ? { latitude: data?.bounds?.southwest?.lat } : {}),
                                                                                                            ...(data?.bounds?.southwest?.lng ? { longitude: data?.bounds?.southwest?.lng } : {}),
                                                                                                            ...(data?.components?.postcode ? { zip: data?.components?.postcode } : {}),     // Update only the address field
                                                                                                        }
                                                                                                    }));
                                                                                                    setFocused(false); // Close dropdown after selection
                                                                                                }}
                                                                                                style={{
                                                                                                    margin: 0,
                                                                                                    padding: '8px 12px',
                                                                                                    cursor: 'pointer',
                                                                                                }}
                                                                                                className="hover-bg-change text-black"
                                                                                            >
                                                                                                {data?.formatted}
                                                                                            </p>
                                                                                        ))}
                                                                                        {searchedLocations?.length === 0 && <p className="text-muted px-2 py-1">No results found</p>}
                                                                                    </div>
                                                                                </div>
                                                                            </Form.Group>
                                                                        </Col>

                                                                        <Col sm={6}>
                                                                            <Form.Group className="mb-1">
                                                                                <Form.Label className='mb-0'>Latitude</Form.Label>
                                                                                <Form.Control
                                                                                    type="text"
                                                                                    defaultValue={latitude}
                                                                                    onChange={(e) => {
                                                                                        setFormData((prevState) => ({
                                                                                            ...prevState,
                                                                                            primaryAddress: {
                                                                                                ...prevState.primaryAddress,
                                                                                                latitude: e.target.value,
                                                                                            }
                                                                                        }));
                                                                                    }}
                                                                                    placeholder="Latitude"
                                                                                />
                                                                                {/* {/ {errors.street && <span className="text-danger">{errors.street.message}</span>} /} */}
                                                                            </Form.Group>
                                                                        </Col>
                                                                        <Col sm={6}>
                                                                            <Form.Group className="mb-1">
                                                                                <Form.Label className='mb-0'>Longitude</Form.Label>
                                                                                <Form.Control
                                                                                    type="text"
                                                                                    defaultValue={longitude}
                                                                                    onChange={(e) => {
                                                                                        setFormData((prevState) => ({
                                                                                            ...prevState,
                                                                                            primaryAddress: {
                                                                                                ...prevState.primaryAddress,
                                                                                                longitude: e.target.value,
                                                                                            }
                                                                                        }));
                                                                                    }} placeholder="Longitude" />
                                                                                {/* {/ {errors.street && <span className="text-danger">{errors.street.message}</span>} /} */}
                                                                            </Form.Group>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <Row>
                                                                        <Col sm={6}>
                                                                            <Form.Group className="mb-1">
                                                                                <label htmlFor="state-select" className='fw-bold mb-0' style={{ display: "block", marginBottom: "6px" }}>
                                                                                    State
                                                                                </label>
                                                                                <select
                                                                                    id="state-select"
                                                                                    {...register("state1")}
                                                                                    onChange={(e) => {
                                                                                        setFormData((prevState) => ({
                                                                                            ...prevState,
                                                                                            primaryAddress: {
                                                                                                ...prevState.primaryAddress,
                                                                                                state: e.target.value,
                                                                                            }
                                                                                        }));
                                                                                        handleStateSelection(e);
                                                                                    }}
                                                                                    style={{
                                                                                        width: "100%",
                                                                                        padding: "7px ",
                                                                                        borderRadius: "4px",
                                                                                        border: "1px solid #ccc",
                                                                                        color: getValues('state1')?.length === 0 ? "#a9a9a9" : "black", // Black if state is selected, gray otherwise
                                                                                    }}
                                                                                >
                                                                                    <option value="" disabled>
                                                                                        Select state
                                                                                    </option>
                                                                                    {statesData?.states?.map((data) => (
                                                                                        <option
                                                                                            key={data?.id} // Unique key for each option
                                                                                            data-key={JSON.stringify({ id: data?.id, _id: data?._id, name: data?.name })} // Store the key as a data attribute
                                                                                            value={data?._id}
                                                                                        >
                                                                                            {data?.name}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>

                                                                            </Form.Group>

                                                                        </Col>
                                                                        <Col sm={6}>
                                                                            <Form.Group className="mb-1">
                                                                                <Form.Label className='mb-0'>City</Form.Label>

                                                                                <select
                                                                                    disabled={store?.getCitiesReducer?.loading}
                                                                                    {...register('city1')}
                                                                                    onChange={(e) => {
                                                                                        // setFormData({ ...formData, city: e.target.value })
                                                                                        setFormData((prevState) => ({
                                                                                            ...prevState,
                                                                                            primaryAddress: {
                                                                                                ...prevState.primaryAddress,
                                                                                                city: e.target.value,
                                                                                            }
                                                                                        }));
                                                                                    }}
                                                                                    style={{
                                                                                        width: "100%",
                                                                                        padding: "7px ",
                                                                                        borderRadius: "4px",
                                                                                        border: "1px solid #ccc",
                                                                                        color: getValues('city1')?.length === 0 ? "#a9a9a9" : "black",
                                                                                    }}
                                                                                >
                                                                                    <option value='' >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                                                    {cities1?.map((data) => (
                                                                                        <option data-key={JSON.stringify({ _id: data?._id, latitude: data?.latitude, longitude: data?.longitude })} key={data?._id} value={data?._id}>
                                                                                            {data?.name}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>

                                                                            </Form.Group>
                                                                        </Col>

                                                                        <Col sm={6}>
                                                                            <Form.Group className="mb-1">
                                                                                <Form.Label className='mb-0'>Street</Form.Label>
                                                                                <Form.Control
                                                                                    type="text"
                                                                                    {...register('street1')}
                                                                                    onKeyPress={handleFirstSpace}
                                                                                    onChange={(e) => {
                                                                                        setFormData((prevState) => ({
                                                                                            ...prevState,
                                                                                            primaryAddress: {
                                                                                                ...prevState.primaryAddress,
                                                                                                street: e.target.value,
                                                                                            }
                                                                                        }));
                                                                                    }}
                                                                                    placeholder="Street" />

                                                                                {/* {/ {errors.street && <span className="text-danger">{errors.street.message}</span>} /} */}
                                                                            </Form.Group>
                                                                        </Col>
                                                                        <Col sm={6}>
                                                                            <Form.Group className="mb-1">
                                                                                <Form.Label className='mb-0'>Zip</Form.Label>
                                                                                <Form.Control
                                                                                    defaultValue={updatePage ? clinicDataToUpdate?.primaryAddress?.zip : ''}
                                                                                    type="text"
                                                                                    {...register('zip1', {
                                                                                        minLength: {
                                                                                            value: 5,
                                                                                            message: 'ZIP code must be at least 5 characters long',
                                                                                        },
                                                                                        pattern: {
                                                                                            value: /^[0-9]+$/,
                                                                                            message: 'ZIP code must contain numbers only',
                                                                                        },
                                                                                    })}
                                                                                    onKeyPress={handleFirstSpace}
                                                                                    onChange={(e) => {
                                                                                        setFormData((prevState) => ({
                                                                                            ...prevState,
                                                                                            primaryAddress: {
                                                                                                ...prevState.primaryAddress,
                                                                                                zip: e.target.value,
                                                                                            }
                                                                                        }));
                                                                                    }}
                                                                                    placeholder="Zip"
                                                                                    maxLength={5}
                                                                                />
                                                                                {errors.zip && <span className="text-danger">{errors.zip.message}</span>}
                                                                            </Form.Group>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </div>

                                                    <div className='row mt-1'>

                                                        <Col sm={12}>
                                                            <Row>
                                                                <Col sm={12} className='mb-2'>
                                                                    <span className='text-black fw-semibold form-label'>Mailing Address</span>
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        label="Same as Primary Address"
                                                                        disabled={
                                                                            !(
                                                                                formData?.primaryAddress?.address && formData?.primaryAddress?.zip &&
                                                                                formData?.primaryAddress?.state && formData?.primaryAddress?.city &&
                                                                                formData?.primaryAddress?.street
                                                                            )
                                                                        }

                                                                        // style={{ cursor: getValues('zip') === '' ? 'not-allowed' : '' }}
                                                                        onChange={(e) => {

                                                                            if (e.target.checked) {
                                                                                setSameAsPrimary(true);
                                                                                setValue('address2', getValues('address1'));
                                                                                setValue('zip2', getValues('zip1'));
                                                                                setValue('street2', getValues('street1'));
                                                                                setMailingLatitude(latitude);
                                                                                setMailingLongitude(longitude);
                                                                                setFormData((prevState) => ({
                                                                                    ...prevState,
                                                                                    mailingAddress: {
                                                                                        ...prevState.mailingAddress,
                                                                                        address: formData?.primaryAddress?.address,
                                                                                        state: formData?.primaryAddress?.state,
                                                                                        city: formData?.primaryAddress?.city,
                                                                                        latitude: formData?.primaryAddress?.latitude,
                                                                                        longitude: formData?.primaryAddress?.longitude,
                                                                                        street: formData?.primaryAddress?.street,
                                                                                        zip: formData?.primaryAddress?.zip,
                                                                                    }
                                                                                }));
                                                                            } else {
                                                                                setSameAsPrimary(false)
                                                                                setValue('address2', '');
                                                                                setValue('zip2', '');
                                                                                setValue('street2', '');
                                                                                setMailingLatitude(null);
                                                                                setMailingLongitude(null);
                                                                                setFormData((prevState) => {
                                                                                    const updatedState = { ...prevState };
                                                                                    delete updatedState.mailingAddress; // Remove mailingAddress
                                                                                    return updatedState;
                                                                                });
                                                                            }
                                                                        }}
                                                                    />
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <Row className='position-relative'>
                                                                        <Col sm={12}>
                                                                            <Form.Group className="mb-1">
                                                                                <Form.Label className="mb-0">Address</Form.Label>
                                                                                <div style={{ position: 'relative' }}>
                                                                                    <Form.Control
                                                                                        type="text"
                                                                                        defaultValue={updatePage ? clinicDataToUpdate?.mailingAddress?.address : ''}
                                                                                        {...register('address2')}
                                                                                        onChange={(e) => {
                                                                                            setFormData({ ...formData, address: e.target.value });
                                                                                            getMailingGeolocation(e);
                                                                                            setMailingFocused(true); // Open dropdown on input
                                                                                        }}
                                                                                        readOnly={sameAsPrimary}
                                                                                        onFocus={() => setMailingFocused(true)} // Open dropdown when the field is focused
                                                                                        onBlur={() => {
                                                                                            setTimeout(() => setMailingFocused(false), 200); // Delay to allow selection before hiding dropdown
                                                                                        }}
                                                                                        placeholder="Search for mailing address"
                                                                                        autoComplete="off"
                                                                                    />
                                                                                    {/* {/ Dropdown suggestions /} */}
                                                                                    <div
                                                                                        style={{
                                                                                            position: 'absolute',
                                                                                            top: '100%',
                                                                                            left: 0,
                                                                                            width: '100%',
                                                                                            maxHeight: '150px',
                                                                                            overflow: 'auto',
                                                                                            zIndex: 111,
                                                                                            backgroundColor: '#fff',
                                                                                            border: '1px solid #ced4da',
                                                                                            borderTop: 'none',
                                                                                        }}
                                                                                        className={`scroll-container hover-bg-change ${searchedMailingLocations?.length === 0 || !mailingFocused ? 'd-none' : ''}`}
                                                                                    >
                                                                                        {searchedMailingLocations?.map((data, index) => (
                                                                                            <p
                                                                                                key={index}
                                                                                                onClick={() => {
                                                                                                    setSelectedMailingLocation(data)
                                                                                                    setMailingFocused(false); // Close dropdown after selection
                                                                                                }}
                                                                                                style={{
                                                                                                    margin: 0,
                                                                                                    padding: '8px 12px',
                                                                                                    cursor: 'pointer',
                                                                                                }}
                                                                                                className="hover-bg-change text-black"
                                                                                            >
                                                                                                {data?.formatted}
                                                                                            </p>
                                                                                        ))}
                                                                                        {searchedMailingLocations?.length === 0 && <p className="text-muted px-2 py-1">No results found</p>}
                                                                                    </div>
                                                                                </div>
                                                                            </Form.Group>
                                                                        </Col>

                                                                        <Col sm={6}>
                                                                            <Form.Group className="mb-1">
                                                                                <Form.Label className='mb-0'>Latitude</Form.Label>
                                                                                <Form.Control
                                                                                    type="text"
                                                                                    defaultValue={mailingLatitude}
                                                                                    readOnly={sameAsPrimary}
                                                                                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                                                                    placeholder="Latitude"
                                                                                />
                                                                            </Form.Group>
                                                                        </Col>
                                                                        <Col sm={6}>
                                                                            <Form.Group className="mb-1">
                                                                                <Form.Label className='mb-0'>Longitude</Form.Label>
                                                                                <Form.Control
                                                                                    type="text"
                                                                                    defaultValue={mailingLongitude}
                                                                                    readOnly={sameAsPrimary}
                                                                                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                                                                    placeholder="Longitude" />
                                                                            </Form.Group>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <Row>
                                                                        <Col sm={6}>
                                                                            <Form.Group className="mb-1">
                                                                                <Form.Label className='mb-0' >State</Form.Label>
                                                                                {sameAsPrimary ?
                                                                                    <Form.Control readOnly={sameAsPrimary} value={statesData?.states.find((data) => data?._id === formData?.primaryAddress?.state)?.name} />
                                                                                    :
                                                                                    <Form.Select
                                                                                        {...register('state2')}
                                                                                        onChange={(e) => {
                                                                                            setFormData({ ...formData, state: e.target.value });
                                                                                            handleMailingStateSelection(e);
                                                                                        }}
                                                                                    >
                                                                                        <option value=''>State</option>
                                                                                        {statesData?.states?.map((data) => (
                                                                                            <option
                                                                                                key={data?.id} // Unique key for each option
                                                                                                data-key={JSON.stringify({ id: data?.id, _id: data?._id })} // Store the key as a data attribute
                                                                                                value={data?._id}
                                                                                            >
                                                                                                {data?.name}
                                                                                            </option>
                                                                                        ))}
                                                                                    </Form.Select>
                                                                                }

                                                                            </Form.Group>

                                                                        </Col>
                                                                        <Col sm={6}>
                                                                            <Form.Group className="mb-1">
                                                                                <Form.Label className='mb-0'>City</Form.Label>
                                                                                {sameAsPrimary ?
                                                                                    <Form.Control readOnly={sameAsPrimary} value={cities1 && cities1.find((data) => data?._id === formData?.primaryAddress?.city)?.name} />
                                                                                    :
                                                                                    <Form.Select
                                                                                        disabled={store?.getCitiesReducer?.loading}
                                                                                        {...register('city2')}
                                                                                        onChange={(e) => {
                                                                                            setFormData({ ...formData, city: e.target.value })
                                                                                        }}
                                                                                    >
                                                                                        <option value='' >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                                                        {cities2?.map((data) => (
                                                                                            <option data-key={JSON.stringify({ _id: data?._id, latitude: data?.latitude, longitude: data?.longitude })} key={data?._id} value={data?._id}>
                                                                                                {data?.name}
                                                                                            </option>
                                                                                        ))}
                                                                                    </Form.Select>
                                                                                }
                                                                            </Form.Group>
                                                                        </Col>

                                                                        <Col sm={6}>
                                                                            <Form.Group className="mb-1">
                                                                                <Form.Label className='mb-0'>Street</Form.Label>
                                                                                <Form.Control
                                                                                    type="text"
                                                                                    {...register('street2')}
                                                                                    readOnly={sameAsPrimary}
                                                                                    onKeyPress={handleFirstSpace}
                                                                                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                                                                    placeholder="Street" />

                                                                                {/* {/ {errors.street && <span className="text-danger">{errors.street.message}</span>} /} */}
                                                                            </Form.Group>
                                                                        </Col>
                                                                        <Col sm={6}>
                                                                            <Form.Group className="mb-1">
                                                                                <Form.Label className='mb-0'>Zip</Form.Label>
                                                                                <Form.Control
                                                                                    readOnly={sameAsPrimary}
                                                                                    defaultValue={updatePage ? clinicDataToUpdate?.mailingAddress?.zip : ''}
                                                                                    type="text"
                                                                                    {...register('zip2', {
                                                                                        minLength: {
                                                                                            value: 5,
                                                                                            message: 'ZIP code must be at least 5 characters long',
                                                                                        },
                                                                                        pattern: {
                                                                                            value: /^[0-9]+$/,
                                                                                            message: 'ZIP code must contain numbers only',
                                                                                        },
                                                                                    })}
                                                                                    onKeyPress={handleFirstSpace}
                                                                                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                                                                    placeholder="Zip"
                                                                                    maxLength={5}
                                                                                />
                                                                                {errors.zip && <span className="text-danger">{errors.zip.message}</span>}
                                                                            </Form.Group>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </div>
                                                </div>
                                                <div className="col-12 d-flex justify-content-end gap-2 mt-1">
                                                    <Button variant="secondary">Cancel</Button>
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
