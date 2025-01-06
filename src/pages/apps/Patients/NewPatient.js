import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import ProfileDummy from "../../../assets/images/profileDummy.png";
import { Button, Card, Col, Form, Modal, Row, InputGroup, Table, Spinner } from "react-bootstrap";
import { FiEdit, FiTrash, FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { createPatientsAction, updatePatientsAction, getPatientByIdAction, getResponsiblePartyAction } from "../../../redux/patients/actions";
import { useForm } from "react-hook-form";
import us from '../../../assets/images/flags/us.jpg';
import { encryptMessage } from "../../../cryptoUtils";
import { handleUpload } from '../../../helpers/HandleUpload';
import { getCitiesAction, getStatesByCountryAction, getSubClinicCitiesAction } from "../../../redux/actions";
import Responsiblle from "./Responsible";
import { getResponsibleParty } from "../../../helpers/api/apiEndpoints";
import Select from 'react-select';


const NewPatient = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('updateid');
    const store = useSelector((state) => state);
    const doctorRoleId = store?.getDoctorsRolesReducer?.data?.result?.[0]?._id;
    const createResponse = store?.createPatientsReducer?.data?.status;
    const statesData = store?.getStatesReducer?.data;
    const cities = store?.getCitiesReducer?.cities1?.data?.cities;
    const patientDetails = store?.getPatientByIdReducer?.data?.patient;
    const responsibleParties = store?.getResponsiblePartyReducer?.data?.responsibleParties;
    const [focused, setFocused] = useState(false);
    const [smShow, setSmShow] = useState(false);
    const [password, setPassword] = useState("");
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [formData, setFormData] = useState({
        role: doctorRoleId,
    });
    const [partySearch, setPartySearch] = useState('')
    const [selectedParty, setSelectedParty] = useState(null)

    const logoFileInputRef = useRef(null);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    const [searchedLocations, setSearchedLocations] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [updatePage, setUpdatePage] = useState(false);
    const [activeTab, setActiveTab] = useState("personalDetails");
    const [btnShow, setBtnShow] = useState(true);
    const [stateToSelect, setStateToSelect] = useState('');
    const [inputValue, setInputValue] = useState('');
    const options = responsibleParties?.map((party) => ({
        value: party._id,
        label: party.fullName,
    }));

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === "personalDetails") {
            setBtnShow(true);
        } else {
            setBtnShow(false);
        }
    };

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue, reset, clearErrors } = useForm();
    useEffect(() => {
        if (createResponse === 201) {
            reset();
        }
    }, [createResponse])
    useEffect(() => {

        const payload = {
            clinicId: clinicId,
            search: partySearch,
            limit: 20
        }
        if (activeTab === 'personalDetails') {
            dispatch(getResponsiblePartyAction({ key: encryptMessage(payload) }))
        }
    }, [dispatch, partySearch, activeTab])
    useEffect(() => {
        if (id) {
            const payload = {
                id: id,
            }
            dispatch(getPatientByIdAction({ key: encryptMessage(payload) }));
        }
    }, [id])
    useEffect(() => {
        if (id) {
            setSelectedParty(options && options?.find((option) => option.value === patientDetails?.responsibleParty?._id));
        }
    }, [id, patientDetails, responsibleParties])
    useEffect(() => {
        if (id && patientDetails) {
            setValue('fullName', patientDetails?.fullName)
            setValue('title', patientDetails?.title)
            setValue('gender', patientDetails?.gender)
            setValue('email', patientDetails?.email)
            setValue('contactNumber', patientDetails?.contactNumber)
            setValue('note', patientDetails?.note)
            setValue('maritalStatus', patientDetails?.maritalStatus)
            setValue('deceased', patientDetails?.deceased)
            setValue('ssn', patientDetails?.ssn)
            setValue('raceEthnicity', patientDetails?.raceEthnicity)
            setValue('relationship', patientDetails?.relationship)
            setValue('additionalMRN', patientDetails?.additionalMRN)
            setValue('responsiblePartyName', patientDetails?.responsibleParty?._id)
            setValue('chartNumber', patientDetails?.chartNumber)
            setValue('address', patientDetails?.address?.street);
            setValue('zip', patientDetails?.address?.zip);
            setValue('financialClass', patientDetails?.financialClass);
            setValue('employer', patientDetails?.employer);
            setValue('preferredLanguage', patientDetails?.preferredLanguage);
            const formattedDateOfBirth = patientDetails?.dateOfBirth
                ? new Date(patientDetails?.dateOfBirth).toISOString().split('T')[0]
                : '';
            setValue('dateOfBirth', formattedDateOfBirth);
            const stateId = statesData?.states && statesData?.states.find((data) => data?._id === patientDetails?.address?.state?._id)?.id;
            setValue('stateName', patientDetails?.address?.state?._id)
            if (stateId) {
                dispatch(getCitiesAction({ state_code: stateId, name: patientDetails?.address?.city?.name, limit: '', skip: '' }))
            }
            if (patientDetails?.profile?.fileName && patientDetails?.profile?.url) {
                setLogoName(patientDetails?.profile?.fileName)
                setLogo(patientDetails?.profile?.fileName)
            }
        }
    }, [id, patientDetails, statesData])
    useEffect(() => {
        if (selectedLocation) {
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
            const selectedCounty = cities && cities.find((data) => data?.name === selectedLocation?.components?.county || patientDetails?.address?.city?.name)?._id;
            setValue('city', selectedCounty)
        }
    }, [cities])
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === "1234") {
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
            clearErrors('profileImage')
        } catch (error) {
            // console.error('Error during file upload:', error);
        }
    };
    useEffect(() => {
        dispatch(getStatesByCountryAction());
        // dispatch(getSubClinicCitiesAction())
    }, [dispatch]);
    const getGeolocation = async (e) => {
        const addressToSearch = e.target.value;

        if (!addressToSearch) {
            setSearchedLocations([]);
            return;
        }

        const apiKey = '2a77840d874f4c35848e37042ce7c8ed'; // Replace with your API key
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(addressToSearch)}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.status}`);
            }
            const data = await response.json();
            setSearchedLocations(data.results || []);
        } catch (error) {
            console.error('Failed to fetch geocode data:', error);
        }
    };

    const [stateCode, setStateCode] = useState()

    const handleAddressSelection = (location) => {
        setValue('address', location.formatted);
        setValue('zip', location.components.postcode || '');
        setValue('stateName', location.components.state || '');
        setValue('city', location.components.city || location.components.town || '');
        setValue('street', location.components.road || location.components.street || '');
        setStateCode(location?.components?.state_code)
        dispatch(getSubClinicCitiesAction({ state_code: location?.components?.state_code, name: '', limit: 25, skip: '' }));

        const stateCode = statesData?.states?.find(
            (state) => state.name === location.components.state
        )?.state_code;

        setSelectedCity(location.components.city)

        if (stateCode) {
            setStateToSelect(stateCode);
            dispatch(getSubClinicCitiesAction({ state_code: stateCode, name: '', limit: 25, skip: '' }));
        }

        setFocused(false);
    };

    useEffect(() => {
        if (stateToSelect) {
            dispatch(getSubClinicCitiesAction({ state_code: stateToSelect, name: '', limit: 25, skip: '' }));
        }
    }, [stateToSelect]);


    const handleStateSelection = (e) => {
        const stateCode = e.target.value;
        if (stateCode) {
            setStateToSelect(stateCode);
            dispatch(getSubClinicCitiesAction({ state_code: stateCode, name: '', limit: 25, skip: '' }));
        }
    };

    const handleCitySelection = (e) => {
        const city = JSON.parse(e.target.value);
        if (city) {
            setSelectedCity(city);
        }
    };

    const stateGeoLocation = 'stateName';
    useEffect(() => {
        if (stateGeoLocation) {
            setStateToSelect(statesData?.states && statesData?.states.find((data) => data?.state_code === stateGeoLocation));
        }
    }, [stateGeoLocation])

    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId
    const onSubmit = (data) => {
        const payload = {
            ...(id ? { id: id } : {}),
            clinicId: clinicId,
            ...(logo?.url === undefined
                ? {}
                : {
                    profile: {
                        url: logo?.url?.split('?')[0],
                        fileName: logoName
                    }
                }),
            ...(data?.email ? { email: data?.email } : {}),
            ...(data?.dateOfBirth ? { dateOfBirth: data?.dateOfBirth } : {}),
            ...(data?.maritalStatus ? { maritalStatus: data?.maritalStatus } : {}),
            ...(data?.contactNumber ? { contactNumber: data?.contactNumber } : {}),
            ...(data?.fullName ? { fullName: data?.fullName } : {}),
            ...(data?.title ? { title: data?.title } : {}),
            ...(data?.gender ? { gender: data?.gender } : {}),
            ...(data?.chartNumber ? { chartNumber: data?.chartNumber } : {}),
            ...(selectedParty?.value ? { responsibleParty: selectedParty?.value } : {}),
            address: {
                ...(data?.address ? { street: data?.address } : {}),
                ...(data?.city ? { city: data?.city } : {}),
                ...(data?.stateName ? { state: data?.stateName } : {}),
                ...(data?.zip ? { zip: data?.zip } : {}),
            },
            ...(data?.note ? { note: data?.note } : {}),
            ...(data?.deceased ? { deceased: data?.deceased } : {}),
            ...(data?.ssn ? { ssn: data?.ssn } : {}),
            ...(data?.additionalMRN ? { additionalMRN: data?.additionalMRN } : {}),
            ...(data?.financialClass ? { financialClass: data?.financialClass } : {}),
            ...(data?.providerProfile ? { providerProfile: data?.providerProfile } : {}),
            ...(data?.employer ? { employer: data?.employer } : {}),
            ...(data?.relationship ? { relationship: data?.relationship } : {}),
            ...(data?.raceEthnicity ? { raceEthnicity: data?.raceEthnicity } : {}),
            ...(data?.pcp ? { pcp: data?.pcp } : {}),
            ...(data?.preferredLanguage ? { preferredLanguage: data?.preferredLanguage } : {}),
        }

        // reset();
        if (id) {
            console.log({ payload })
            dispatch(updatePatientsAction({ key: encryptMessage(payload) }))
        } else {
            dispatch(createPatientsAction({ key: encryptMessage(payload) }))
        }
    };
    const tableData = [
        { type: 'Patient', values: Array(6).fill("0.00") },
        { type: 'Insurance', values: Array(6).fill("0.00") }, // Add more rows as needed
    ];

    const handleInputChange = (data) => {
        setPartySearch(data)
    }
    const handleChange = (selectedOption) => {
        setSelectedParty(selectedOption, 'Selected Option');
    };

    return (
        <div className="background_Color pt-1 pb-2 px-0">
            <div className="container-fluid mt-2 px-0">
                <Card className="px-3 py-2">
                    <div className="d-flex justify-content-between">
                        <div>
                            <ul className="nav nav-underline">
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${activeTab === "personalDetails" ? "active fw-bold" : ""}`}
                                        onClick={() => handleTabChange("personalDetails")}
                                    >
                                        Personal Details
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${activeTab === "responsible" ? "active fw-bold" : ""}`}
                                        onClick={() => handleTabChange("responsible")}
                                    >
                                        Responsible party
                                    </button>
                                </li>
                            </ul>

                        </div>
                        <div>
                            {activeTab === "responsible" && (
                                <Button
                                    className="me-2"
                                    variant="primary"
                                    onClick={() => handleTabChange("responsible")}
                                >
                                    Payment
                                </Button>
                            )}

                            <Button className="me-2">
                                Clear
                            </Button>
                            <Button className="me-2">
                                Set Password
                            </Button>
                            <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </div>

                    <div className="px-2">


                        {/* Form Section */}
                        {activeTab === "personalDetails" && (<Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                            <div className="row mt-1" >
                                <Col sm={6} className="border-end">
                                    <Row>
                                        <div className="col-4 pe-0">
                                            <div className="mb-1 d-flex flex-column position-relative">
                                                <Form.Label className="mb-0">Profile Image</Form.Label>
                                                <div
                                                    onClick={() => logoFileInputRef.current.click()}
                                                    className={`custom-file-upload justify-content-between cursor-pointer ${logoName || profileUploading ? '' : 'custom-form-fields'}`}
                                                >
                                                    {logoName ? logoName : profileUploading ? 'Uploading...' : 'Upload Profile Image'}
                                                    <p className="mb-0">
                                                        <FiUploadCloud />
                                                    </p>
                                                </div>
                                                <Form.Control
                                                    type="file"
                                                    className="d-none "
                                                    {...register('profileImage', {
                                                        // required: 'This field is required'
                                                    })}
                                                    accept=".png, .jpg, .jpeg, .svg" // Allow only specific file types
                                                    ref={logoFileInputRef}
                                                    onChange={handleFileChange}

                                                />
                                                {errors.profileImage && (<span className="text-danger">{errors.profileImage.message}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-4 mb-1">
                                            <div>
                                                <Form.Label htmlFor="gender" className="mb-0">Gender<span className='text-danger'>*</span></Form.Label>
                                                <div className="d-flex gap-2">
                                                    <Form.Select
                                                        {...register('gender', { required: "Gender is required" })}
                                                        aria-label="Select Gender"
                                                    >
                                                        <option value="">Select Gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>

                                                    </Form.Select>

                                                </div>
                                                {errors.gender && <span className="text-danger">{errors.gender.message}</span>}
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <div className=" mb-1">
                                                <Form.Label htmlFor="title" className="mb-0">Title <span className="text-danger">*</span></Form.Label>
                                                <Form.Select
                                                    {...register('title', { required: "Title is required" })}
                                                    aria-label="Select Title"
                                                >
                                                    <option value="">Select Title</option>
                                                    <option value="Mr.">Mr.</option>
                                                    <option value="Mrs.">Mrs.</option>
                                                    <option value="Miss">Miss</option>
                                                    <option value="Dr.">Dr.</option>
                                                    <option value="Other">Other</option>
                                                </Form.Select>
                                                {errors.title && <span className="text-danger">{errors.title.message}</span>}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="col-4">
                                            <Form.Label htmlFor="email" className="mb-0">Email ID <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Email ID"
                                                {...register('email', { required: "Email is required", pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: "Invalid email address" } })}
                                            />
                                            {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                        </div>
                                        <div className='col-4'>
                                            <Form.Group className="mb-1 position-relative">
                                                <Form.Label className='mb-0'>Phone{!id && <span className='text-danger'>*</span>}</Form.Label>
                                                <Form.Group>
                                                    <InputGroup>
                                                        <InputGroup.Text className='ps-3 pe-1 fw-bold text-black'>&nbsp;&nbsp;+1</InputGroup.Text>
                                                        <Form.Control
                                                            type="tel"
                                                            {...register('contactNumber', !id ? {
                                                                required: 'This field is required',
                                                                pattern: {
                                                                    value: /^[0-9]*$/,
                                                                    message: 'Contact must be a number'
                                                                },
                                                                maxLength: {
                                                                    value: 15,
                                                                    message: 'Contact must not exceed 10 digits'
                                                                },
                                                                minLength: {
                                                                    value: 10,
                                                                    message: 'Contact must not be less than 10 digits'
                                                                }
                                                            } : {}
                                                            )}
                                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}                                                                                // value={formData.phone}
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
                                        </div>
                                        <div className="col-4 ">
                                            <Form.Label htmlFor="note" className="mb-0">Note (Text)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Note"
                                                {...register('note')}
                                            />
                                        </div>
                                        <hr />
                                        <div className="col-6 mb-1">
                                            <Form.Label htmlFor="marital" className="mb-0">Marital Status <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="select"  // Use 'select' to make it a dropdown
                                                id="marital"
                                                {...register('maritalStatus', { required: "Marital status is required" })}
                                            >
                                                <option value="">Select marital status</option>  {/* Default option */}
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Divorced">Divorced</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Other">Other</option>
                                            </Form.Control>
                                            {errors.maritalStatus && <span className="text-danger">{errors.maritalStatus.message}</span>}
                                        </div>
                                        <div className="col-6 mb-1">
                                            <Form.Label htmlFor="DOB" className="mb-0">Date of Birth <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="date"  // Change type to "date" for date input
                                                placeholder="Date of Birth"
                                                {...register('dateOfBirth', { required: "Date of Birth is required" })}
                                            />
                                            {errors.dateOfBirth && <span className="text-danger">{errors.dateOfBirth.message}</span>}
                                        </div>
                                        <div className="col-6 mb-1">
                                            <Form.Label htmlFor="deceased" className="mb-0">Deceased</Form.Label>
                                            <Form.Control
                                                as="select"
                                                id="deceased"
                                                {...register('deceased')}
                                            >
                                                <option value="">Select Deceased</option>
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </Form.Control>
                                            {errors.deceased && <span className="text-danger">{errors.deceased.message}</span>}
                                        </div>
                                        <div className="col-6 mb-1">
                                            <Form.Label htmlFor="SSN" className="mb-0">SSN# <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="SSN#"
                                                {...register('ssn', {
                                                    required: "SSN# is required", // Ensure it's not empty
                                                    pattern: {
                                                        value: /^\d{3}-\d{2}-\d{4}$/, // Regex pattern for SSN format
                                                        message: 'SSN must be in format XXX-XX-XXXX' // Custom error message
                                                    }
                                                })}
                                                maxLength={11}
                                            />
                                            {/* Display error message */}
                                            {errors.ssn && <span className="text-danger">{errors.ssn.message}</span>}
                                        </div>
                                        <div className="col-12 mb-1">
                                            <Form.Label htmlFor="additional" className="mb-0">Additional MRN</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Additional MRN"
                                                {...register('additionalMRN',
                                                    // { required: "Additional MRN is required" }
                                                )}
                                            />
                                        </div>
                                    </Row>
                                </Col>
                                <Col sm={6}>
                                    <Row>
                                        <div className="col-12 mb-1">
                                            <Form.Label htmlFor="fileName" className="mb-0">Full Name <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Full Name"
                                                {...register('fullName', { required: "Full name is required" })}
                                            />
                                            {errors.fullName && <span className="text-danger">{errors.fullName.message}</span>}
                                        </div>
                                        <div className="mb-1 col-12 mt-1 responnsible-party-select position-relative">
                                            <Form.Label htmlFor="responsibleParty" className="mb-0">Responsible Party Name
                                                <span
                                                    onMouseEnter={() => setShowTooltip(true)}
                                                    onMouseLeave={() => setShowTooltip(false)}
                                                    onClick={() => {
                                                        setShowTooltip(false);
                                                        setActiveTab('responsible');
                                                    }}
                                                    className='fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer'>
                                                </span>
                                                <div className={`position-absolute border bg-white p-1 ${showTooltip ? '' : 'd-none'}`} style={{ zIndex: '2', top: '-50%', left: '29.5%', borderRadius: '8px 8px 8px 0px' }}>
                                                    Click to add new responsible parties.
                                                </div>
                                            </Form.Label>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                value={
                                                    selectedParty || 'Select Responsible Party'  // Ensure null when no match is found
                                                }
                                                isLoading={store?.getResponsiblePartyReducer?.loading}
                                                isClearable={true}
                                                isSearchable={true}
                                                onInputChange={handleInputChange}
                                                onChange={handleChange}
                                                name="responsiblePartyName"
                                                options={options}
                                                placeholder="Select Responsible Party"
                                            />
                                        </div>
                                        <div className="mb-1 col-12">
                                            <Form.Label htmlFor="chartNumber" className="mb-0">Chart Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Chart Number"
                                                {...register('chartNumber',
                                                    //  { required: "Chart number is required" }
                                                )}
                                                maxLength={7}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <Form.Group className="mb-1">
                                                <Form.Label className="mb-0">Address</Form.Label>
                                                <div style={{ position: 'relative' }}>
                                                    <Form.Control
                                                        type="text"
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
                                                    {/* Dropdown suggestions */}
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
                                        </div>
                                        <div className="mb-1 col-12">
                                            <Form.Group className="">
                                                <Form.Label className='mb-0' >State</Form.Label>
                                                <Form.Select
                                                    {...register('stateName')}
                                                    onChange={(e) => handleStateSelection(e)}>
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
                                            </Form.Group>
                                        </div>
                                        <Col sm={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className='mb-0'>City</Form.Label>
                                                <Form.Select
                                                    disabled={store?.getCitiesReducer?.loading}
                                                    {...register('city')}
                                                    onChange={(e) => handleCitySelection(e)}
                                                >
                                                    <option value='' >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                    {cities?.map((data) => (
                                                        <option data-key={JSON.stringify({ _id: data?._id })} key={data?._id} value={data?._id}>
                                                            {data?.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                {/* } */}
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className='mb-0'>Zip</Form.Label>
                                                <Form.Control
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
                                                    // onKeyPress={handleFirstSpace}
                                                    placeholder="Zip"
                                                    maxLength={5}
                                                />
                                                {errors.zip && <span className="text-danger">{errors.zip.message}</span>}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                                <hr className="my-0" />
                                <Col sm={6} className="border-end mt-1">
                                    <div className="col-12">
                                        <Table responsive className="table-centered table-nowrap mb-0 mt-1">
                                            <thead className="text-white">
                                                <tr>
                                                    <th className='text-white'>Seq</th>
                                                    <th className='text-white'>Coverage</th>
                                                    <th className='text-white'>Carrier</th>
                                                    <th className='text-white'>Subscriber</th>
                                                    <th className='text-white'>Id#</th>
                                                    <th className='text-white'>Capay</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>Primary</td>
                                                    <td>Anthem</td>
                                                    <td>Test</td>
                                                    <td>2333</td>
                                                    <td>
                                                        0.00
                                                    </td>
                                                </tr>


                                            </tbody>
                                        </Table>
                                    </div>
                                    <div className="col-12">
                                        <Table responsive className="table-centered table-nowrap mb-0 mt-1 ">
                                            <thead className="text-white">
                                                <tr>
                                                    <th className="text-white"></th>
                                                    <th className="text-white">0-30</th>
                                                    <th className="text-white">31-60</th>
                                                    <th className="text-white">61-90</th>
                                                    <th className="text-white">91-120</th>
                                                    <th className="text-white">121+</th>
                                                    <th className="text-white">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableData.map((row, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        <td>{row.type}</td>
                                                        {row.values.map((value, colIndex) => (
                                                            <td key={colIndex}>
                                                                <Form.Group>
                                                                    <InputGroup>
                                                                        <Form.Control
                                                                            type="tel"
                                                                            placeholder={value}
                                                                        />
                                                                    </InputGroup>
                                                                </Form.Group>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Col>
                                <Col sm={6} className="mt-1">
                                    <div className="row pb-0 mt-1" >
                                        <div className="col-6 mb-1">
                                            <Form.Label htmlFor="financial" className="mb-0">Financial Class</Form.Label>
                                            <Form.Control
                                                as="select"  // Use 'select' to create a dropdown
                                                id="financial"
                                                {...register('financialClass',
                                                    // { required: "Financial Class is required" }
                                                )}
                                            >
                                                <option value="">Select Financial Class</option>
                                                <option value="Self-Pay">Self-Pay</option>
                                                <option value="Insurance">Insurance</option>
                                                <option value="Medicaid">Medicaid</option>
                                                <option value="Medicare">Medicare</option>
                                                <option value="Other">Other</option>
                                            </Form.Control>

                                        </div>

                                        <div className="col-6 mb-1">
                                            <Form.Label htmlFor="provider" className="mb-0">Provider Profile</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Provider Profile"
                                                {...register('providerProfile',
                                                    //  { required: "Provider Profile is required" }
                                                )}
                                            />
                                        </div>
                                        <div className="col-6 mb-1">
                                            <Form.Label htmlFor="employer" className="mb-0">Employer</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Employer"
                                                {...register('employer',
                                                    //  { required: "Employer is required" }
                                                )}
                                            />
                                        </div>
                                        <div className="col-6 mb-1">
                                            <Form.Label htmlFor="relationship" className="mb-0">Relationship</Form.Label>
                                            <Form.Control
                                                as="select"  // Use 'select' to create a dropdown
                                                id="relationship"
                                                {...register('relationship',
                                                    // { required: "Relationship is required" }
                                                )}
                                            >
                                                <option value="">Select Relationship</option>
                                                <option value="Self">Self</option>
                                                <option value="Spouse">Spouse</option>
                                                <option value="Child">Child</option>
                                                <option value="Other">Other</option>
                                            </Form.Control>

                                        </div>

                                        <div className="col-6 mb-1">
                                            <Form.Label htmlFor="preferred" className="mb-0">Preferred Language</Form.Label>
                                            <Form.Control
                                                as="select"  // Use 'select' to create a dropdown
                                                id="preferred"
                                                {...register('preferredLanguage',
                                                )}
                                            >
                                                <option value="">Select Preferred Language</option>
                                                <option value="English">English</option>
                                                <option value="Spanish">Spanish</option>
                                                <option value="Other">Other</option>
                                            </Form.Control>

                                        </div>

                                        <div className="col-6 mb-1">
                                            <Form.Label htmlFor="PCP" className="mb-0">PCP</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="PCP"
                                                {...register('pcp',
                                                )}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <Form.Label htmlFor="race" className="mb-0">Race & Ethnicity</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Race & Ethnicity"
                                                {...register('raceEthnicity',
                                                )}
                                            />
                                        </div>
                                    </div>
                                </Col>
                                {/* <div className="row pb-1 pe-0" style={{ borderBottom: "1px solid #444141" }}>
                                    <div className="col-3 mb-1">
                                        <Form.Label htmlFor="fileName" className="mb-0">Full Name <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Full Name"
                                            {...register('fullName', { required: "Full name is required" })}
                                        />
                                        {errors.fullName && <span className="text-danger">{errors.fullName.message}</span>}
                                    </div>
                                    <div className="col-3">
                                        <div className=" mb-1">
                                            <Form.Label htmlFor="title" className="mb-0">Title <span className="text-danger">*</span></Form.Label>
                                            <Form.Select
                                                {...register('title', { required: "Title is required" })}
                                                aria-label="Select Title"
                                            >
                                                <option value="">Select Title</option>
                                                <option value="Mr.">Mr.</option>
                                                <option value="Mrs.">Mrs.</option>
                                                <option value="Miss">Miss</option>
                                                <option value="Dr.">Dr.</option>
                                                <option value="Other">Other</option>
                                            </Form.Select>
                                            {errors.title && <span className="text-danger">{errors.title.message}</span>}
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div>
                                            <Form.Label htmlFor="gender" className="mb-0">Gender<span className='text-danger'>*</span></Form.Label>
                                            <div className="d-flex gap-2">
                                                <Form.Select
                                                    {...register('gender', { required: "Gender is required" })}
                                                    aria-label="Select Gender"
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>

                                                </Form.Select>

                                            </div>
                                            {errors.gender && <span className="text-danger">{errors.gender.message}</span>}

                                        </div>
                                    </div>

                                    <div className="col-3 pe-0">
                                        <div className="mb-1 d-flex flex-column position-relative">
                                            <Form.Label className="mb-0">Profile Image</Form.Label>
                                            <div
                                                onClick={() => logoFileInputRef.current.click()}
                                                className={`custom-file-upload justify-content-between cursor-pointer ${logoName || profileUploading ? '' : 'custom-form-fields'}`}
                                            >
                                                {logoName ? logoName : profileUploading ? 'Uploading...' : 'Upload Profile Image'}
                                                <p className="mb-0">
                                                    <FiUploadCloud />
                                                </p>
                                            </div>
                                            <Form.Control
                                                type="file"
                                                className="d-none "
                                                {...register('profileImage', {
                                                    // required: 'This field is required'
                                                })}
                                                ref={logoFileInputRef}
                                                onChange={handleFileChange}

                                            />
                                            {errors.profileImage && (<span className="text-danger">{errors.profileImage.message}</span>
                                            )}
                                        </div>
                                    </div>
                                </div> */}
                                {/* <div className="col-6" style={{ borderRight: "1px solid #444141" }}>

                                    <div className="row my-1 pb-2" style={{ borderBottom: "1px solid #444141" }}>
                                        <div className="col-4">
                                            <Form.Label htmlFor="email" className="mb-0">Email ID <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Email ID"
                                                {...register('email', { required: "Email is required", pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: "Invalid email address" } })}
                                            />
                                            {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                        </div>
                                        <div className=' col-4'>
                                            <Form.Group className="mb-0 position-relative">
                                                <Form.Label className='mb-0'>Phone{!id && <span className='text-danger'>*</span>}</Form.Label>
                                                <Form.Group>
                                                    <InputGroup>
                                                        <InputGroup.Text className='ps-3 pe-1 fw-bold text-black'>&nbsp;&nbsp;+1</InputGroup.Text>
                                                        <Form.Control
                                                            type="tel"
                                                            {...register('contactNumber', !id ? {
                                                                required: 'This field is required',
                                                                pattern: {
                                                                    value: /^[0-9]*$/,
                                                                    message: 'Contact must be a number'
                                                                },
                                                                maxLength: {
                                                                    value: 15,
                                                                    message: 'Contact must not exceed 10 digits'
                                                                },
                                                                minLength: {
                                                                    value: 10,
                                                                    message: 'Contact must not be less than 10 digits'
                                                                }
                                                            } : {}
                                                            )}
                                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}                                                                                // value={formData.phone}
                                                            placeholder="1234-234-234"
                                                            maxLength={10}
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
                                        </div>
                                        <div className="col-4 ">
                                            <Form.Label htmlFor="note" className="mb-0">Note (Text)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Note"
                                                {...register('note')}
                                            />
                                        </div>
                                    </div>
                                    <div className="row pb-2 mt-1" style={{ borderBottom: "1px solid #444141" }}>
                                        <div className="col-6 mb-1">
                                            <Form.Label htmlFor="marital" className="mb-0">Marital Status <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                as="select"  // Use 'select' to make it a dropdown
                                                id="marital"
                                                {...register('maritalStatus', { required: "Marital status is required" })}
                                            >
                                                <option value="">Select marital status</option>  
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Divorced">Divorced</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Other">Other</option>
                                            </Form.Control>
                                            {errors.maritalStatus && <span className="text-danger">{errors.maritalStatus.message}</span>}
                                        </div>

                                        <div className="col-6 mb-1">
                                            <Form.Label htmlFor="DOB" className="mb-0">Date of Birth <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="date"  // Change type to "date" for date input
                                                placeholder="Date of Birth"
                                                {...register('dateOfBirth', { required: "Date of Birth is required" })}
                                            />
                                            {errors.dateOfBirth && <span className="text-danger">{errors.dateOfBirth.message}</span>}
                                        </div>

                                        <div className="col-6 mb-1">
                                            <Form.Label htmlFor="deceased" className="mb-0">Deceased</Form.Label>
                                            <Form.Control
                                                as="select"
                                                id="deceased"
                                                {...register('deceased')}
                                            >
                                                <option value="">Select Deceased</option>
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </Form.Control>
                                            {errors.deceased && <span className="text-danger">{errors.deceased.message}</span>}
                                        </div>

                                        <div className="col-6 mb-1">
                                            <Form.Label htmlFor="SSN" className="mb-0">SSN# <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="SSN#"
                                                {...register('ssn', {
                                                    required: "SSN# is required", // Ensure it's not empty
                                                    pattern: {
                                                        value: /^\d{3}-\d{2}-\d{4}$/, // Regex pattern for SSN format
                                                        message: 'SSN must be in format XXX-XX-XXXX' // Custom error message
                                                    }
                                                })}
                                                maxLength={11}
                                            />
                                            {errors.ssn && <span className="text-danger">{errors.ssn.message}</span>}
                                        </div>

                                        <div className="col-12 ">
                                            <Form.Label htmlFor="additional" className="mb-0">Additional MRN</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Additional MRN"
                                                {...register('additionalMRN',
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div>
                                            <Table responsive className="table-centered table-nowrap mb-0 mt-1">
                                                <thead className="text-white">
                                                    <tr>
                                                        <th className='text-white'>Seq</th>
                                                        <th className='text-white'>Coverage</th>
                                                        <th className='text-white'>Carrier</th>
                                                        <th className='text-white'>Subscriber</th>
                                                        <th className='text-white'>Id#</th>
                                                        <th className='text-white'>Capay</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr >
                                                        <td>1</td>
                                                        <td>Primary</td>
                                                        <td className="">Anthem</td>
                                                        <td>Test</td>
                                                        <td>2333</td>
                                                        <td>
                                                            0.00
                                                        </td>
                                                    </tr>


                                                </tbody>
                                            </Table>
                                        </div>
                                        <div>
                                            <Table responsive className="table-centered table-nowrap mb-0 mt-1 ">
                                                <thead className="text-white">
                                                    <tr>
                                                        <th className="text-white"></th>
                                                        <th className="text-white">0-30</th>
                                                        <th className="text-white">31-60</th>
                                                        <th className="text-white">61-90</th>
                                                        <th className="text-white">91-120</th>
                                                        <th className="text-white">121+</th>
                                                        <th className="text-white">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tableData.map((row, rowIndex) => (
                                                        <tr key={rowIndex}>
                                                            <td>{row.type}</td>
                                                            {row.values.map((value, colIndex) => (
                                                                <td key={colIndex}>
                                                                    <Form.Group>
                                                                        <InputGroup>
                                                                            <Form.Control
                                                                                type="tel"
                                                                                placeholder={value}
                                                                            />
                                                                        </InputGroup>
                                                                    </Form.Group>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>

                                </div> */}
                                {/* <div className="col-6">
                                    <div className="row">
                                        <div className="mb-1 mt-1 responnsible-party-select position-relative">
                                            <Form.Label htmlFor="responsibleParty" className="mb-0">Responsible Party Name
                                                <span
                                                    onMouseEnter={() => setShowTooltip(true)}
                                                    onMouseLeave={() => setShowTooltip(false)}
                                                    onClick={() => {
                                                        setShowTooltip(false);
                                                        setActiveTab('responsible');
                                                    }}
                                                    className='fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer'>
                                                </span>
                                                <div className={`position-absolute border bg-white p-1 ${showTooltip ? '' : 'd-none'}`} style={{ zIndex: '2', top: '-50%', left: '29.5%', borderRadius: '8px 8px 8px 0px' }}>
                                                    Click to add new responsible parties.
                                                </div>
                                            </Form.Label>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                value={
                                                    id && patientDetails?.responsibleParty
                                                        ? selectedParty
                                                        : null // Ensure null when no match is found
                                                }
                                                isLoading={store?.getResponsiblePartyReducer?.loading}
                                                isClearable={true}
                                                isSearchable={true}
                                                onInputChange={handleInputChange}
                                                onChange={handleChange}
                                                name="responsiblePartyName"
                                                options={options}
                                                placeholder="Select Responsible Party"
                                            />
                                        </div>

                                        <div className="mb-1">
                                            <Form.Label htmlFor="chartNumber" className="mb-0">Chart Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Chart Number"
                                                {...register('chartNumber',
                                                    //  { required: "Chart number is required" }
                                                )}
                                                maxLength={7}
                                            />
                                        </div>
                                        <div className="" style={{ borderBottom: "1px solid #444141" }}>

                                            <Form.Group className="mb-1">
                                                <Form.Label className="mb-0">Address</Form.Label>
                                                <div style={{ position: 'relative' }}>
                                                    <Form.Control
                                                        type="text"
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
                                            <div className="mb-1">

                                                <Form.Group className="">
                                                    <Form.Label className='mb-0' >State</Form.Label>
                                                    <Form.Select
                                                        {...register('stateName')}
                                                        onChange={(e) => handleStateSelection(e)}>
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
                                                </Form.Group>
                                            </div>
                                            <div className="row">
                                                <Col sm={6}>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label className='mb-0'>City</Form.Label>
                                                        <Form.Select
                                                            disabled={store?.getCitiesReducer?.loading}
                                                            {...register('city')}
                                                            onChange={(e) => handleCitySelection(e)}
                                                        >
                                                            <option value='' >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                            {cities?.map((data) => (
                                                                <option data-key={JSON.stringify({ _id: data?._id })} key={data?._id} value={data?._id}>
                                                                    {data?.name}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={6}>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label className='mb-0'>Zip</Form.Label>
                                                        <Form.Control
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
                                                            // onKeyPress={handleFirstSpace}
                                                            placeholder="Zip"
                                                            maxLength={5}
                                                        />
                                                        {errors.zip && <span className="text-danger">{errors.zip.message}</span>}
                                                    </Form.Group>
                                                </Col>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="row pb-0 mt-1" >
                                                <div className="col-6 mb-1">
                                                    <Form.Label htmlFor="financial" className="mb-0">Financial Class</Form.Label>
                                                    <Form.Control
                                                        as="select"  // Use 'select' to create a dropdown
                                                        id="financial"
                                                        {...register('financialClass',
                                                            // { required: "Financial Class is required" }
                                                        )}
                                                    >
                                                        <option value="">Select Financial Class</option>
                                                        <option value="Self-Pay">Self-Pay</option>
                                                        <option value="Insurance">Insurance</option>
                                                        <option value="Medicaid">Medicaid</option>
                                                        <option value="Medicare">Medicare</option>
                                                        <option value="Other">Other</option>
                                                    </Form.Control>

                                                </div>

                                                <div className="col-6 mb-1">
                                                    <Form.Label htmlFor="provider" className="mb-0">Provider Profile</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Provider Profile"
                                                        {...register('providerProfile',
                                                            //  { required: "Provider Profile is required" }
                                                        )}
                                                    />
                                                </div>
                                                <div className="col-6 mb-1">
                                                    <Form.Label htmlFor="employer" className="mb-0">Employer</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Employer"
                                                        {...register('employer',
                                                            //  { required: "Employer is required" }
                                                        )}
                                                    />
                                                </div>
                                                <div className="col-6 mb-1">
                                                    <Form.Label htmlFor="relationship" className="mb-0">Relationship</Form.Label>
                                                    <Form.Control
                                                        as="select"  // Use 'select' to create a dropdown
                                                        id="relationship"
                                                        {...register('relationship',
                                                            // { required: "Relationship is required" }
                                                        )}
                                                    >
                                                        <option value="">Select Relationship</option>
                                                        <option value="Self">Self</option>
                                                        <option value="Spouse">Spouse</option>
                                                        <option value="Child">Child</option>
                                                        <option value="Other">Other</option>
                                                    </Form.Control>

                                                </div>

                                                <div className="col-6 mb-1">
                                                    <Form.Label htmlFor="preferred" className="mb-0">Preferred Language</Form.Label>
                                                    <Form.Control
                                                        as="select"  // Use 'select' to create a dropdown
                                                        id="preferred"
                                                        {...register('preferredLanguage',
                                                        )}
                                                    >
                                                        <option value="">Select Preferred Language</option>
                                                        <option value="English">English</option>
                                                        <option value="Spanish">Spanish</option>
                                                        <option value="Other">Other</option>
                                                    </Form.Control>

                                                </div>

                                                <div className="col-6 mb-1">
                                                    <Form.Label htmlFor="PCP" className="mb-0">PCP</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="PCP"
                                                        {...register('pcp',
                                                        )}
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <Form.Label htmlFor="race" className="mb-0">Race & Ethnicity</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Race & Ethnicity"
                                                        {...register('raceEthnicity',
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>

                            {/* Buttons */}
                            <div className="d-flex gap-2 justify-content-end mb-2">
                                <Button variant="secondary">Clear</Button>
                                <Button variant="primary" disabled={store?.createPatientsReducer?.loading || store?.updatePatientsReducer?.loading} className="custom-buttons" type="submit">
                                    {store?.createPatientsReducer?.loading || store?.updatePatientsReducer?.loading ?
                                        <Spinner color="white" className="spinner-border-sm" />
                                        :
                                        'Next'
                                    }
                                </Button>
                            </div>
                        </Form>)}
                        {activeTab === "responsible" && <Responsiblle />}
                    </div>
                </Card>
            </div>

            {/* Password Modal */}
            <Modal
                size="sm"
                show={smShow}
                centered
                onHide={() => setSmShow(false)}
                aria-labelledby="password-modal"
            >
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
        </div>
    );
};
export default NewPatient;
