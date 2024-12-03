import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiDownloadCloud, FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { createDoctorAction, getCitiesAction, getDoctorDetailsAction, getDoctorsrolesAction, getStatesByCountryAction } from '../../../redux/actions';
import EmailToDoctorModal from './EmailToDoctorModal';
import DepartmentDetails from './DepartmentDetails';
import Documents from './Documents';
import { handleUpload } from '../../../helpers/HandleUpload';
import { encryptMessage } from '../../../cryptoUtils';


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
    const statesData = store?.getStatesReducer?.data;

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
    console.log(doctorDetails, 'doctorDetails')
    const createResponse = store?.createtDoctorsReducer?.data?.status
    // console.log(store?.createtDoctorsReducer?.data, '12345678')
    const newDoctorId = store?.createtDoctorsReducer?.data?.response?._id
    const doctorRoleId = store?.getDoctorsRolesReducer?.data?.result?.[0]?._id
    // console.log(doctorRoleId, 'newDoctorId')
    // const doctorRoleId=doctorRole&&doctorRole.find((data=>data?.name==='doctor')?._id)
    // console.log(doctorRoleId, 'id')
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
            setValue('firstName', doctorDetails?.userId?.firstName)
            setValue('lastName', doctorDetails?.userId?.lastName)
            setValue('email', doctorDetails?.userId?.email)
            setValue('phone', doctorDetails?.userId?.phone)
            setValue('gender', doctorDetails?.userId?.gender)
            setValue('city', doctorDetails?.userId?.address?.city?.name)
            setValue('state', doctorDetails?.userId?.address?.state?.name)
            setValue('zip', doctorDetails?.userId?.address?.zip)
            setValue('longitude', doctorDetails?.userId?.address?.longitude)
            setValue('latitude', doctorDetails?.userId?.address?.latitude)
            // setValue('dateOfBirth', doctorDetails?.userId?.dateOfBirth)
            setValue('profileImage', doctorDetails?.userId?.profileImage)
            setValue('degree', doctorDetails?.userId?.degree)

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
            console.error('Error during file upload:', error);
        }
    };
    const handleFileChangeDegree = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setDegree(url);
            setDegreeName(selectedFile?.name)
        } catch (error) {
            console.error('Error during file upload:', error);
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
                state: JSON.parse(selectedState)?._id || stateToSelect?._id,
                zip: data?.zip,
                latitude: latitude,
                longitude: longitude
            }
        };
    console.log(payload,'payload')
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

    const handleStateSelection = (e) => {
        setSelectedState(e.target.value)
        try {
            const selectedState = JSON.parse(e.target.value);
            if (selectedState?.state_code) {
                dispatch(getCitiesAction({ state_code: selectedState.id, name: '', limit: 25 }));
            }
        } catch (error) {
            console.error('Error parsing selected state:', error);
        }
    };
    const handleCitySelection = (e) => {
        const citySelected =e.target.value;
        setSelectedCity(citySelected)
    }

    useEffect(() => {
        if (latitude && longitude) {
            setFocused(false);
        }
    }, [latitude, longitude])

    const stateGeoLocation = watch('stateName');
    useEffect(() => {
        if (stateGeoLocation) {
            setStateToSelect(statesData?.states && statesData?.states.find((data) => data?.state_code === stateGeoLocation));
        }
    }, [stateGeoLocation])

    useEffect(() => {
        if (stateToSelect) {
            console.log('called')
            dispatch(getCitiesAction({ state_code: stateToSelect?.id, name: '', limit: 25, skip: '' }));
        }
    }, [stateToSelect])




    return (
        <>
            <div className='pt-1 pb-2'>
                <div className="container-fluid mt-4">
                    <Card className='px-3 py-2'>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-between align-items-center">
                                <p className="fw-bold" style={{ fontWeight: '600' }}>
                                    NEW DOCTOR
                                </p>
                                <div className='d-flex gap-2'>
                                    <Button onClick={() => setShow(true)}>Email to Doctor</Button>
                                    <Button onClick={handleNewDoctor}>Back</Button>
                                </div>
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
                                                        placeholder="Enter first name"
                                                    />
                                                    {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Email{!id && <span className='text-danger'>*</span>}</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        {...register('email', !id && { required: 'Email is required' })}
                                                        placeholder="Enter email"
                                                    />
                                                    {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Phone{!id && <span className='text-danger'>*</span>}</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        {...register('phone', !id ? { required: 'Phone is required' } : {})}
                                                        placeholder="Enter phone number"
                                                    />
                                                    {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
                                                </Form.Group>

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
                                                        <Form.Group className="mb-3 mt-2 ">
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
                                                        <Form.Group className="mb-3 mt-2">
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
                                            {/* <div className='col-6'>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Address 1<span className='text-danger'>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        {...register('address1', { required: 'Address 1 is required' })}
                                                        placeholder="Enter address line 1"
                                                    />
                                                    {errors.address1 && <span className="text-danger">{errors.address1.message}</span>}
                                                </Form.Group>
                                                <div className='row'>
                                                    <div className='col-6'>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>City<span className='text-danger'>*</span></Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                {...register('city', { required: 'City is required' })}
                                                                placeholder="Enter city"
                                                            />
                                                            {errors.city && <span className="text-danger">{errors.city.message}</span>}
                                                        </Form.Group>
                                                    </div>
                                                    <div className='col-6'>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Zip Code<span className='text-danger'>*</span></Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                {...register('zip', { required: 'Zip code is required' })}
                                                                placeholder="Enter zip code"
                                                            />
                                                            {errors.zip && <span className="text-danger">{errors.zip.message}</span>}
                                                        </Form.Group>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-6'>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Address 2</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        {...register('address2')}
                                                        placeholder="Enter address line 2"
                                                    />
                                                </Form.Group>
                                            </div> */}
                                            <Col sm={12}>
                                                <Row>
                                                    <Col sm={12} className='mb-2'>
                                                        <span className='text-black fw-semibold form-label'>Address Details</span>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <Row className='position-relative'>
                                                            <Col sm={12}>
                                                                <Form.Group className="mb-2">
                                                                    <Form.Label className="mb-1">Address{!id && <span className='text-danger'>*</span>}</Form.Label>
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
                                                                        <div
                                                                            style={{
                                                                                position: 'absolute',
                                                                                top: '100%',
                                                                                left: 0,
                                                                                width: '100%',
                                                                                maxHeight: 'auto',
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
                                                                                        console.log(data)
                                                                                        setValue('zip', data?.components?.postcode)
                                                                                        setValue('stateName', data?.components?.state_code)
                                                                                        setLatitude(data?.bounds?.southwest?.lat);
                                                                                        setLongitude(data?.bounds?.southwest?.lng);
                                                                                        setValue('address', data?.formatted)
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
                                                                </Form.Group>
                                                            </Col>
                                                            <Col sm={6}>
                                                                <Form.Group className="mb-2">
                                                                    <Form.Label className='mb-1'>Longitude</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        defaultValue={longitude}
                                                                        placeholder="Longitude" />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <Row>
                                                            <Col sm={6}>
                                                                <Form.Group className="mb-2">
                                                                    <Form.Label className='mb-1'>State{!id && <span className='text-danger'>*</span>}</Form.Label>
                                                                    <Form.Select
                                                                        {...register('stateName')}
                                                                        onChange={(e) => handleStateSelection(e)}
                                                                    >
                                                                        <option>State</option>
                                                                        {statesData?.states?.map((data) => (
                                                                            <option
                                                                                key={data?.state_code} // Unique key for each option
                                                                                // defau={JSON.stringify({ name: data?.name, state_code: data?.state_code, id: data?.id, _id: data?._id }) || data?.state_code}
                                                                                value={data?.state_code}
                                                                            >
                                                                                {data?.name}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Select>
                                                                </Form.Group>

                                                            </Col>
                                                            <Col sm={6}>
                                                                <Form.Group className="mb-2">
                                                                    <Form.Label className='mb-1'>City{!id && <span className='text-danger'>*</span>}</Form.Label>
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
                                                                            <option key={data?._id} value={data?._id}>
                                                                                {data?.name}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Select>
                                                                </Form.Group>
                                                            </Col>

                                                            <Col sm={6}>
                                                                <Form.Group className="mb-2">
                                                                    <Form.Label className='mb-1'>Street{!id && <span className='text-danger'>*</span>}</Form.Label>
                                                                    <Form.Control
                                                                        defaultValue={updatePage ? clinicDataToUpdate?.address?.street : ''}
                                                                        type="text"
                                                                        {...register('street')}
                                                                        placeholder="Street" />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col sm={6}>
                                                                <Form.Group className="mb-2">
                                                                    <Form.Label className='mb-1'>Zip{!id && <span className='text-danger'>*</span>}</Form.Label>
                                                                    <Form.Control
                                                                        defaultValue={updatePage ? clinicDataToUpdate?.address?.zip : ''}
                                                                        type="text"
                                                                        {...register('zip')}
                                                                        placeholder="Zip" />
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
                                                'Save'
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
                <EmailToDoctorModal closeModal={closeModal} show={show} />
            </div>
        </>
    );
};

export default NewDoctor;
