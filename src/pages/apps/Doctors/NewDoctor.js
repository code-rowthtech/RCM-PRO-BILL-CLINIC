import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiDownloadCloud, FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { createDoctorAction, getCitiesAction, getDoctorDetailsAction, getDoctorsrolesAction, getStatesByCountryAction } from '../../../redux/actions';
import EmailToDoctorModal from './EmailToDoctorModal';
import DepartmentDetails from './DepartmentDetails';
import Documents from './Documents';
import { handleUpload } from '../../../helpers/HandleUpload';
import { encryptMessage } from '../../../cryptoUtils';
import us from '../../../assets/images/flags/us.jpg'
import { handleFirstSpace } from '../../../helpers/noSpace';


const NewDoctor = () => {
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
    const [stateToSelect, setStateToSelect] = useState(null);
    const [focused, setFocused] = useState(false);
    const [updatePage, setUpdatePage] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const store = useSelector((state) => state);
    const [stateId, setStateId] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const statesData = store?.getStatesReducer?.data;
    // console.log({stateToSelect})
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');


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

    const doctorDetails = store?.getDoctorDetailsReducer?.data?.result
    console.log(doctorDetails, 'doctorDetailsdoctorDetails')
    const createResponse = store?.createtDoctorsReducer?.data?.status
    // console.log(store?.createtDoctorsReducer?.data, '12345678')
    const newDoctorId = store?.createtDoctorsReducer?.data?.response?._id
    const doctorRoleId = store?.getDoctorsRolesReducer?.data?.result?.[0]?._id
    // console.log(doctorRoleId, 'newDoctorId')
    const clinicDataToUpdate = store?.getClinicByIdReducer?.data?.clinic;
    const clinicsList = store?.getClinicsByParentReducer?.data?.data;
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
            setValue('stateName', statesData?.states && statesData?.states?.find((data) => data?.id === doctorDetails?.userId?.address?.state?.id))
            setValue('firstName', doctorDetails?.userId?.firstName)
            setValue('lastName', doctorDetails?.userId?.lastName)
            setValue('email', doctorDetails?.userId?.email)
            setValue('phone', doctorDetails?.userId?.phone)
            setValue('gender', doctorDetails?.userId?.gender)
            setValue('city', cityName)
            setValue('zip', doctorDetails?.userId?.address?.zip)
            setValue('street', doctorDetails?.userId?.address?.street)
            setValue('longitude', doctorDetails?.userId?.address?.longitude)
            setValue('latitude', doctorDetails?.userId?.address?.latitude)
            setValue('profileImage', doctorDetails?.userId?.profileImage)
            setValue('degree', doctorDetails?.userId?.degree)
            setValue('address1', doctorDetails?.userId?.address?.address1)

            const formattedDateOfBirth = doctorDetails?.userId?.dob
                ? new Date(doctorDetails?.userId?.dob).toISOString().split('T')[0]
                : '';

            setValue('dateOfBirth', formattedDateOfBirth);
        }
    }, [doctorDetails, setValue])



    const handleNewDoctor = () => {
        navigate('/apps/doctors/list');
        reset()
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setLogo(url);
            setLogoName(selectedFile?.name)
        } catch (error) {
            // console.error('Error during file upload:', error);
        }
    };
    const handleFileChangeDegree = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
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
            firstName: data?.firstName,
            lastName: data?.lastName,
            email: data?.email,
            dob: data?.dateOfBirth,
            gender: data?.gender,
            password: data?.password,
            phone: data?.phone,
            confirmPassword: data?.confirmPassword,
            profileImage: logo?.url?.split('?')[0], // Extract URL up to `?`
            degree: degree?.url?.split('?')[0],    // Extract URL up to `?`
            role: doctorRoleId,
            address: {
                address1: data?.address1,
                street: data?.address2,
                city: selectedCity || data?.city,
                state: JSON.parse(selectedState)?._id || stateToSelect?._id || stateId,
                zip: data?.zip,
                latitude: latitude,
                longitude: longitude
            }
        };
        // console.log(payload,'payload')
        // Encrypt and dispatch the payload
        dispatch(createDoctorAction({ key: encryptMessage(payload) }));
    };


    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const [searchedLocations, setSearchedLocations] = useState(null)

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
    const [selectedLocation, setSelectedLocation] = useState(null);
    useEffect(() => {
        if (selectedLocation) {
            setLatitude(selectedLocation?.bounds?.southwest?.lat);
            setLongitude(selectedLocation?.bounds?.southwest?.lng);
            setValue('address', selectedLocation?.formatted)
            const stateId = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?.id;
            const selectedState = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?._id;
            setValue('stateName', selectedState)
            const countyName = selectedLocation?.components?.county;
            dispatch(getCitiesAction({ state_code: stateId, name: countyName, limit: '', skip: '' }))
        }
    }, [selectedLocation, setValue, statesData, dispatch])
    useEffect(() => {
        if (cities) {
            const selectedCounty = cities && cities.find((data) => data?.name === selectedLocation?.components?.county)?._id;
            setValue('city', selectedCounty)
        }
    }, [cities])

    const handleStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0]; // Get the selected <option>
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        console.log(key)

        dispatch(getCitiesAction({ state_code: key?.id, name: '', limit: 25, skip: '' }))
    };

    const handleCitySelection = (e) => {
        // const citySelected = JSON.parse(e.target.value);
        setSelectedCity(e.target.value)
    }

    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        phone: '',
        lastName: '',
    });

    const formDataChange = (field, value) => {
        const updatedFormData = { ...formData, [field]: value.trim() }; // Trim the value to remove extra spaces
        setFormData(updatedFormData);

        // Check if all fields are filled
        const areAllFieldsFilled =
            updatedFormData.firstName &&
            updatedFormData.email &&
            updatedFormData.phone &&
            updatedFormData.lastName;

        // Enable or disable the button
        setIsButtonDisabled(!areAllFieldsFilled);
    };

    return (
        <>
            <div className='pt-1 pb-2'>
                <div className="container-fluid mt-4">
                    <Card className='px-3 py-2'>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-between align-items-center">
                                <p className="fw-bold" style={{ fontWeight: '600' }}>
                                    {!id ? 'NEW DOCTOR' : 'UPDATE DOCTOR'}
                                </p>

                                {activeTab === "personalDetails" && (
                                    <div className='d-flex gap-2'>
                                        {!id && (
                                            <Button onClick={() => setShow(true)} disabled={isButtonDisabled}>Email to Doctor</Button>
                                        )}

                                        <Button onClick={handleNewDoctor}>Back</Button>
                                    </div>
                                )}

                            </div>
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
                                <Form onSubmit={handleSubmit(submitData)}>
                                    <div className="col-12 mt-3">
                                        <div className="row" style={{ borderBottom: '1px solid #444141' }}>
                                            <div className="col-6">
                                                <Form.Group className="mb-3">
                                                    <Form.Label>First Name {!id && <span className='text-danger'>*</span>}</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        {...register('firstName', !id ? { required: 'First name is required' } : {})}
                                                        onChange={(e) => formDataChange('firstName', e.target.value)}
                                                        // value={formData.firstName}
                                                        placeholder="Enter first name"
                                                    />
                                                    {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Email{!id && <span className='text-danger'>*</span>}</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        {...register('email', !id && { required: 'Email is required' })}
                                                        onChange={(e) => formDataChange('email', e.target.value)}
                                                        // value={formData.email}
                                                        placeholder="Enter email"
                                                    />
                                                    {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                                </Form.Group>

                                                <div className='mb-3'>
                                                    <Form.Group className="mb-0 position-relative">
                                                        <Form.Label className='mb-1'>Phone{!id && <span className='text-danger'>*</span>}</Form.Label>
                                                        <Form.Group>
                                                            <InputGroup>
                                                                <InputGroup.Text className='ps-3 pe-1 fw-bold text-black'>&nbsp;&nbsp;+1</InputGroup.Text>
                                                                <Form.Control
                                                                    type="tel"
                                                                    {...register('phone', !id ? {
                                                                        required: 'This field is required',
                                                                        pattern: {
                                                                            value: /^[0-9]*$/,
                                                                            message: 'Contact must be a number'
                                                                        },
                                                                        maxLength: {
                                                                            value: 10,
                                                                            message: 'Contact must not exceed 10 digits'
                                                                        },
                                                                        minLength: {
                                                                            value: 10,
                                                                            message: 'Contact must not be less than 10 digits'
                                                                        }
                                                                    } : {}
                                                                    )}
                                                                    onChange={(e) => formDataChange('phone', e.target.value)}
                                                                    // value={formData.phone}
                                                                    placeholder="1234-234-234"
                                                                    maxLength={10}
                                                                // onKeyPress={(event) => handleFirstSpace(event, 0)}
                                                                />
                                                            </InputGroup>
                                                        </Form.Group>

                                                        <div
                                                            className='position-absolute ' style={{ top: '52%', left: '1%' }}
                                                        >
                                                            <img
                                                                src={us}
                                                                alt="country code flag"
                                                                width={20} />
                                                        </div>


                                                    </Form.Group>
                                                    {errors.contact && <span className="text-danger">{errors.contact.message}</span>}
                                                </div>

                                                <div className="mb-3 d-flex flex-column position-relative">
                                                    <Form.Label>Profile Image{!id && <span className='text-danger'>*</span>}</Form.Label>
                                                    <div
                                                        onClick={() => logoFileInputRef.current.click()}
                                                        className={`custom-file-upload justify-content-between cursor-pointer ${logoName ? '' : 'custom-form-fields'}`}
                                                    >
                                                        {logoName ? logoName : 'Upload Profile Image'}
                                                        <p className="mb-0">
                                                            <FiUploadCloud />
                                                        </p>
                                                    </div>
                                                    <Form.Control
                                                        type="file"
                                                        className="d-none "
                                                        {...register('profileImage', {
                                                            // required: 'Profile image is required',
                                                        })}
                                                        ref={logoFileInputRef}
                                                        onChange={handleFileChange}
                                                    />
                                                    {errors.profileImage && (
                                                        <p className="text-danger">{errors.profileImage.message}</p>
                                                    )}
                                                </div>

                                                <div className="mb-3 d-flex flex-column position-relative">
                                                    <Form.Label>Degree{!id && <span className='text-danger'>*</span>}</Form.Label>
                                                    <div
                                                        onClick={() => degreeFileInputRef.current.click()}
                                                        className={`custom-file-upload justify-content-between cursor-pointer ${degreeName ? '' : 'custom-form-fields'}`}
                                                    >
                                                        {degreeName ? degreeName : 'Upload Degree'}
                                                        <p className="mb-0">
                                                            <FiUploadCloud />
                                                        </p>
                                                    </div>
                                                    <Form.Control
                                                        type="file"
                                                        className="d-none "
                                                        {...register('degree', {
                                                            // required: 'Profile image is required',
                                                        })}
                                                        ref={degreeFileInputRef}
                                                        onChange={handleFileChangeDegree}
                                                    />
                                                    {errors.profileImage && (
                                                        <p className="text-danger">{errors.degree.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Last Name{!id && <span className='text-danger'>*</span>}</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        {...register('lastName', { required: 'Last name is required' })}
                                                        onChange={(e) => formDataChange('lastName', e.target.value)}
                                                        // value={formData.lastName}
                                                        placeholder="Enter last name"
                                                    />
                                                    {errors.lastName && <span className="text-danger">{errors.lastName.message}</span>}
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Date of Birth{!id && <span className='text-danger'>*</span>}</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        {...register('dateOfBirth', { required: 'Date of birth is required' })}
                                                    />
                                                    {errors.dateOfBirth && <span className="text-danger">{errors.dateOfBirth.message}</span>}
                                                </Form.Group>
                                                <Form.Group className='mb-3'>
                                                    <Form.Label>Gender{!id && <span className='text-danger'>*</span>}</Form.Label>
                                                    <div className="d-flex gap-2 mt-1">
                                                        <Form.Check
                                                            type="radio"
                                                            label="Male"
                                                            value="Male"
                                                            {...register('gender', { required: 'Gender is required' })}
                                                        />
                                                        <Form.Check
                                                            type="radio"
                                                            label="Female"
                                                            value="Female"
                                                            {...register('gender')}
                                                        />
                                                        <Form.Check
                                                            type="radio"
                                                            label="Transgender"
                                                            value="Transgender"
                                                            {...register('gender')}
                                                        />
                                                    </div>
                                                    {errors.gender && <span className="text-danger">{errors.gender.message}</span>}
                                                </Form.Group>

                                                <div className='row '>
                                                    <div className='col-6 '>
                                                        <Form.Group className="mb-3 mt-1 ">
                                                            <Form.Label>Password{!id && <span className='text-danger'>*</span>}</Form.Label>
                                                            <Form.Control
                                                                type="password"
                                                                {...register('password', !id && { required: 'Password is required' })}
                                                                placeholder="Enter password"
                                                            />
                                                            {errors.password && <span className="text-danger">{errors.password.message}</span>}
                                                        </Form.Group>
                                                    </div>
                                                    <div className='col-6'>
                                                        <Form.Group className="mb-3 mt-1">
                                                            <Form.Label>
                                                                Confirm Password {!id && <span className="text-danger">*</span>}
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="password"
                                                                {...register('confirmPassword', {
                                                                    ...(!id ? { required: 'Please confirm your password' } : {}),
                                                                    validate: (value) => value === watch('password') || 'Passwords do not match',
                                                                })}
                                                                placeholder="Confirm password"
                                                            />
                                                            {errors.confirmPassword && (
                                                                <span className="text-danger">{errors.confirmPassword.message}</span>
                                                            )}
                                                        </Form.Group>

                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className='row mt-2'>

                                        <Col sm={12}>
                        <Row>
                            <Col sm={12} className='mb-2'>
                                <span className='text-black fw-semibold form-label'>Address Details</span>
                            </Col>
                            <Col sm={6}>
                                <Row className='position-relative'>
                                    <Col sm={12}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Address</Form.Label>
                                            <div style={{ position: 'relative' }}>
                                                <Form.Control
                                                    type="text"
                                                    defaultValue={updatePage ? clinicDataToUpdate?.address?.address1 : ''}
                                                    {...register('address')}
                                                    onChange={(e) => {
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
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Latitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                defaultValue={latitude}
                                                placeholder="Latitude"
                                            />
                                            {/* {/ {errors.street && <span className="text-danger">{errors.street.message}</span>} /} */}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Longitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                defaultValue={longitude}
                                                placeholder="Longitude" />
                                            {/* {/ {errors.street && <span className="text-danger">{errors.street.message}</span>} /} */}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1' >State</Form.Label>
                                            <Form.Select
                                                {...register('stateName')}
                                                onChange={(e) => handleStateSelection(e)}
                                            >
                                                <option>State</option>
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
                                        </Form.Group>

                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>City</Form.Label>
                                            {/* {
                                                store?.getCitiesReducer?.loading ?
                                                    <Row>
                                                        <Col sm={12}>
                                                            <Spinner className='fs-5' />
                                                        </Col>
                                                    </Row>
                                                    : */}
                                            <Form.Select
                                                disabled={store?.getCitiesReducer?.loading}
                                                {...register('city')}
                                                onChange={(e) => handleCitySelection(e)}
                                            >
                                                <option value='' >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                {cities?.map((data) => (
                                                    <option data-key={JSON.stringify({ _id: data?._id, latitude: data?.latitude, longitude: data?.longitude })} key={data?._id} value={data?._id}>

                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {/* {/ } /} */}
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Street</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register('street')}
                                                onKeyPress={handleFirstSpace}
                                                placeholder="Street" />

                                            {/* {/ {errors.street && <span className="text-danger">{errors.street.message}</span>} /} */}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className='mb-1'>Zip</Form.Label>
                                            <Form.Control
                                                defaultValue={updatePage ? clinicDataToUpdate?.address?.zip : ''}
                                                type="text"
                                                {...register('zip', {
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
                                    <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                                        <Button variant="secondary">Cancel</Button>
                                        <Button variant="primary" type='submit' className='custom-buttons' disabled={store?.createtDoctorsReducer?.loading} >
                                            {store?.createtDoctorsDetailReducer?.loading ?
                                                <Spinner color='white' className='spinner-border-sm' />
                                                :
                                                'Next'
                                            }
                                        </Button>
                                    </div>
                                </Form>
                            )}
                            {activeTab === "departmentDetails" && <DepartmentDetails docId={docId} />}
                            {activeTab === "documents" && <Documents />}
                        </div>
                    </Card>
                </div>
                <EmailToDoctorModal closeModal={closeModal} show={show} formData={formData} />
            </div>
        </>
    );
};

export default NewDoctor;
