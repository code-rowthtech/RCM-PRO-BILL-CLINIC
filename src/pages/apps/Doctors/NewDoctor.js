import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Form, InputGroup, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiDownloadCloud, FiUploadCloud } from "react-icons/fi";
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
import { getDepartmentDataAction, getMastersDataAction } from '../../../redux/settings/action';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';


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
    console.log(statesData, 'statesData')
    const role = store?.getDoctorsRolesReducer?.data
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

    // http://192.168.1.26:9001/api/v1/clinic/getAllRoles?search=&clinicId=677f4ab193938994008638c9&createdById=&status=true&page=1&limit=10


    const cities = store?.getCitiesReducer?.data?.cities;
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;
    const cities2 = store?.getCitiesReducer?.cities2?.data?.cities;
    const doctorDetails = store?.getDoctorDetailsReducer?.data?.result
    console.log(doctorDetails, 'doctorDetails')
    const createResponse = store?.createtDoctorsReducer?.data?.status
    const createData = store?.createtDoctorsReducer?.data?.doctor?._id;
    const newDoctorId = store?.createtDoctorsReducer?.data?.response?._id;
    const doctorRoleId = store?.getRoleDataReducer?.data?.roles?.[0]?._id;
    const doctorRole = store?.getRoleDataReducer?.data;
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
            setValue('firstName', doctorDetails?.name?.[0]?.given)
            setValue('lastName', doctorDetails?.name?.[0]?.family)
            setValue('email', doctorDetails?.userId?.email)
            setValue('phone', doctorDetails?.telecom?.[0]?.value)
            setValue('gender', doctorDetails?.userId?.gender)
            setValue('department', doctorDetails?.departmentId?._id)
            // setValue('city', cityName)
            setValue('zip1', doctorDetails?.userId?.primaryAddress?.zip)
            setValue('zip2', doctorDetails?.userId?.mailingAddress?.zip)
            setValue('street1', doctorDetails?.userId?.primaryAddress?.street)
            setValue('street2', doctorDetails?.userId?.mailingAddress?.street)
            setLongitude(doctorDetails?.userId?.primaryAddress?.longitude)
            setLatitude(doctorDetails?.userId?.primaryAddress?.latitude)
            setMailingLatitude(doctorDetails?.userId?.mailingAddress?.latitude)
            setMailingLongitude(doctorDetails?.userId?.mailingAddress?.longitude)
            setValue('degreeName', doctorDetails?.degree?.[0]?.name);
            setValue('specialist', doctorDetails?.specialities?.[0]);
            if (doctorDetails?.address) {
                setAddresses(doctorDetails.address);
            }
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
                setLogo(doctorDetails?.userId?.profileImage?.url)
            }
            if (doctorDetails?.degree) {
                setDegreeName(doctorDetails?.degree?.[0]?.uploadedDocument?.fileName);
                setDegree(doctorDetails?.degree?.[0]?.uploadedDocument?.url);
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
                given: [data?.firstName?data?.firstName:''],
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
            address: addresses,
            // role: doctorRoleId,
            // primaryAddress: {
            //     ...(data?.address1 ? { address: data?.address1 } : {}),
            //     ...(data?.street1 ? { street: data?.street1 } : {}),
            //     ...(data?.state1 ? { state: data?.state1 } : {}),
            //     ...(data?.zip1 ? { zip: data?.zip1 } : {}),
            //     ...(latitude ? { latitude: latitude } : {}),
            //     ...(longitude ? { longitude: longitude } : {}),
            //     ...(selectedCity || data?.city1 ? { city: selectedCity || data?.city1 } : {}),
            // },
            // mailingAddress: sameAsPrimary ?
            //     {
            //         ...(data?.address1 ? { address: data?.address1 } : {}),
            //         ...(data?.street1 ? { street: data?.street1 } : {}),
            //         ...(data?.state1 ? { state: data?.state1 } : {}),
            //         ...(data?.zip1 ? { zip: data?.zip1 } : {}),
            //         ...(latitude ? { latitude: latitude } : {}),
            //         ...(longitude ? { longitude: longitude } : {}),
            //         ...(selectedCity || data?.city1 ? { city: selectedCity || data?.city1 } : {}),
            //     }
            //     : {
            //         ...(data?.address2 ? { address: data?.address2 } : {}),
            //         ...(data?.street2 ? { street: data?.street2 } : {}),
            //         ...(data?.state2 ? { state: data?.state2 } : {}),
            //         ...(data?.zip2 ? { zip: data?.zip2 } : {}),
            //         ...(mailingLatitude ? { latitude: mailingLatitude } : {}),
            //         ...(mailingLongitude ? { longitude: mailingLongitude } : {}),
            //         ...(selectedCity || data?.city2 ? { city: selectedCity || data?.city2 } : {}),
            //     }
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
    const addressUses = ['home', 'work', 'temp', 'old', 'billing', 'mailing', 'primary'];
    const [addresses, setAddresses] = useState(doctorDetails?.address || [
        { use: '', line: [''], city: '', state: '', postalCode: '', country: '' }
    ]);

    const [activeAddressIndex, setActiveAddressIndex] = useState(null);
    const [addressFocused, setAddressFocused] = useState(false);

    const addAddress = () => {
        setAddresses([...addresses, { use: '', line: [''], city: '', state: '', postalCode: '', country: '' }]);
    };
    const removeAddress = (index) => {
        if (addresses.length > 1) {
            setAddresses(addresses.filter((_, i) => i !== index));
        }
    };
    const handleAddressChange = (index, field, value) => {
        setAddresses((prevAddresses) => {
            const updatedAddresses = [...prevAddresses];

            if (field === 'line') {
                updatedAddresses[index] = { ...updatedAddresses[index], line: value };
            } else {
                updatedAddresses[index] = { ...updatedAddresses[index], [field]: value };
            }

            return updatedAddresses;
        });

        // Sync with React Hook Form
        setValue(`address[${index}].${field}`, value);
    };


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
    useEffect(() => {
        if (cities1) {
            const selectedCounty = cities1 && cities1.find((data) => data?.name === selectedLocation?.components?.county || doctorDetails?.userId?.primaryAddress?.city?.name)?._id;
            setValue('city', selectedCounty)
            // setFormData((prevState) => ({
            //     ...prevState,
            //     primaryAddress: {
            //         ...prevState.primaryAddress,
            //         city: selectedCounty,
            //     }
            // }));
        }
        if (cities2) {
            const selectedCounty = cities2 && cities2.find((data) => data?.name === selectedMailingLocation?.components?.county || doctorDetails?.userId?.primaryAddress?.city?.name)?._id;
            setValue('city2', selectedCounty)
            // setFormData((prevState) => ({
            //     ...prevState,
            //     mailingAddress: {
            //         ...prevState.mailingAddress,
            //         city: selectedCounty,
            //     }
            // }));
        }
    }, [cities1, cities2])

    const handleStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        console.log("key", key);
        dispatch(getCitiesAction({ state_code: key, name: '', limit: 25, skip: '' }))
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
                                                        <hr className='my-1 ' />
                                                        <div className="col-md-6 col-12">
                                                            <Form.Group className="mb-1">
                                                                <Form.Label className="mb-0">Degree Name</Form.Label>
                                                                <Form.Control
                                                                    className='form-control'
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
                                                        </div>
                                                        <div className="col-md-6 col-12">
                                                            <div className="mb-1 d-flex flex-column position-relative">
                                                                <Form.Label className="mb-0">Degree</Form.Label>
                                                                <div
                                                                    onClick={() => degreeFileInputRef.current.click()}
                                                                    className={`custom-file-upload justify-content-between cursor-pointer form-control ${degreeName || degreeUploading ? '' : 'custom-form-fields'}`}
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
                                                        <div className="col-md-6 col-12 ">
                                                            <div className="mb-2 d-flex flex-column position-relative">
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

                                                        <div className="col-md-6 col-12">
                                                            <Form.Group className="mb-1">
                                                                <Form.Label className="mb-0">Specialist </Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    {...register('specialist',
                                                                        // { required: 'Specialist Name is required' }
                                                                    )}
                                                                    onChange={(e) => {
                                                                        clearErrors('specialist');
                                                                        setFormData({ ...formData, specialties: e.target.value });
                                                                    }}
                                                                    placeholder="Enter Specialist Name"
                                                                />
                                                                {/* {errors.specialist && <span className="text-danger">{errors?.specialist?.message}</span>} */}
                                                            </Form.Group>
                                                        </div>
                                                        <hr className='mb-1' />
                                                    </div>
                                                    <Row>
                                                        <Col sm={12}>
                                                            <h5>
                                                                Address Details
                                                                <span
                                                                    className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                                                    onClick={addAddress}></span>
                                                            </h5>
                                                        </Col>
                                                    </Row>
                                                    {addresses.map((item, index) => (
                                                        <Row key={index} className="mb-2">
                                                            {/* Address Use Field */}
                                                            <Col sm={4} className="mb-2">
                                                                <Form.Label className="mb-1">Use</Form.Label>
                                                                <Form.Select
                                                                    {...register(`address[${index}].use`)}
                                                                    value={watch(`address[${index}].use`) || item.use || ""}
                                                                    onChange={(e) => handleAddressChange(index, 'use', e.target.value)}
                                                                >
                                                                    <option value="">Select</option>
                                                                    {addressUses.map((use) => (
                                                                        <option key={use} className="text-capitalize" value={use}>
                                                                            {use}
                                                                        </option>
                                                                    ))}
                                                                </Form.Select>
                                                            </Col>

                                                            {/* Address Line */}
                                                            <Col sm={4} className="mb-2 position-relative">
                                                                <Form.Label className="mb-1">Address</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Street Address"
                                                                    {...register(`address[${index}].line[0]`)}
                                                                    value={watch(`address[${index}].line[0]`) || item.line?.[0] || ""}
                                                                    onChange={(e) => handleAddressChange(index, 'line', [e.target.value, item.line?.[1] || ""])}
                                                                />
                                                            </Col>

                                                            {/* City */}
                                                            <Col sm={4} className="mb-2">
                                                                <Form.Label className="mb-1">City</Form.Label>
                                                                <Form.Select
                                                                    {...register(`address[${index}].city`)}
                                                                    value={watch(`address[${index}].city`) || item.city || ""}
                                                                    onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                                                                >
                                                                    <option value="">Select City</option>
                                                                    {cities1?.map((data) => (
                                                                        <option key={data?.name} value={data?._id}>
                                                                            {data?.name}
                                                                        </option>
                                                                    ))}
                                                                </Form.Select>
                                                            </Col>

                                                            {/* State */}
                                                            <Col sm={4} className="mb-2">
                                                                <Form.Label className="mb-1">State</Form.Label>
                                                                <Form.Select
                                                                    {...register(`address[${index}].state`)}
                                                                    value={watch(`address[${index}].state`) || item.state || ""}
                                                                    onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                                                                >
                                                                    <option value="">Select State</option>
                                                                    {statesData?.states?.map((data) => (
                                                                        <option key={data?.name} value={data?.state_code}>
                                                                            {data?.name}
                                                                        </option>
                                                                    ))}
                                                                </Form.Select>
                                                            </Col>

                                                            {/* Postal Code */}
                                                            <Col sm={4}>
                                                                <Form.Group className="mb-2">
                                                                    <Form.Label className="mb-1">Postal Code</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        placeholder="Postal Code"
                                                                        {...register(`address[${index}].postalCode`)}
                                                                        value={watch(`address[${index}].postalCode`) || item.postalCode || ""}
                                                                        onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                                                                    />
                                                                </Form.Group>
                                                            </Col>

                                                            {/* Country */}
                                                            <Col sm={4} className="position-relative">
                                                                <Form.Label className="mb-1">Country</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Country"
                                                                    {...register(`address[${index}].country`)}
                                                                    value={watch(`address[${index}].country`) || item.country || ""}
                                                                    onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    ))}

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
