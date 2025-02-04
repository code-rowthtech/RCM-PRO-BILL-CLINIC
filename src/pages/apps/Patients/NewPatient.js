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
import { getCitiesAction, getDoctorsAction, getStatesByCountryAction, getSubClinicCitiesAction, stateEmptydAction } from "../../../redux/actions";
import Responsiblle from "./Responsible";
import { getResponsibleParty } from "../../../helpers/api/apiEndpoints";
import Select from 'react-select';
import Insurance from "./Insurance/Insurance";
import Demographicdetails from "./Demographic";
import ReferringDoctor from "./referringDoctor";

const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

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

    return `${years}.${months}`;
};


const NewPatient = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('updateid');
    const store = useSelector((state) => state);
    const doctorRoleId = store?.getDoctorsRolesReducer?.data?.result?.[0]?._id;
    const createResponse = store?.createPatientsReducer?.data?.status;
    const createPatientResponse = store?.createPatientsReducer?.data?.patient;
    const statesData = store?.getStatesReducer?.data;
    const cities = store?.getCitiesReducer?.cities1?.data?.cities;
    const patientDetails = store?.getPatientByIdReducer?.data?.patient;
    const responsibleParties = store?.getResponsiblePartyReducer?.data?.responsibleParties;
    const doctorDetails = store?.getDoctorsReducer?.data?.response;
    const [focused, setFocused] = useState(false);
    const [submissionType, setSubmissionType] = useState(null);
    const [smShow, setSmShow] = useState(false);
    const [password, setPassword] = useState("");
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [patientId, setPatientId] = useState(null);
    const [age, setAge] = useState(null);
    const [formData, setFormData] = useState({
        role: doctorRoleId,
    });
    const [partySearch, setPartySearch] = useState('')
    const [selectedParty, setSelectedParty] = useState(null)
    const [doctorSearch, setDoctorSearch] = useState('');
    const logoFileInputRef = useRef(null);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    const [searchedLocations, setSearchedLocations] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState(null);

    const [activeTab, setActiveTab] = useState("personalDetails");
    const [btnShow, setBtnShow] = useState(true);
    const [stateToSelect, setStateToSelect] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const options = responsibleParties?.map((party) => ({
        value: party._id,
        label: party.fullName,
    }));

    const doctorOptions = doctorDetails?.map((data) => ({
        value: data?._id,
        label: data?.userDetails?.firstName + ' ' + data?.userDetails?.lastName,
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
    const { register, handleSubmit, formState: { errors }, setValue, reset, clearErrors, watch } = useForm();
    useEffect(() => {
        if (age) {
            setValue('approxAge', age);
        }
    }, [age]);
    useEffect(() => {
        if (createResponse === 201 && submissionType === 'saveAndNext') {
            reset();
            setActiveTab('demographicDetails');
            setPatientId(createPatientResponse?._id);
            dispatch(stateEmptydAction());
        } else if (createResponse === 201 && submissionType === 'saveAndReset') {
            reset();
            setSelectedDoctor(null);
            setLogo(null);
            setLogoName(null);
            setPatientId(null);
            dispatch(stateEmptydAction());
        } else if (createResponse === 201 && submissionType === 'save') {
            setPatientId(createPatientResponse?._id)
        }
    }, [createResponse, submissionType])
    useEffect(() => {

        const payload = {
            clinicId: clinicId,
            search: doctorSearch,
            limit: 20
        }
        if (activeTab === 'personalDetails') {
            dispatch(getResponsiblePartyAction({ key: encryptMessage(payload) }))
        }
        const doctorPayload = { status: true, search: doctorSearch, departmentId: '' }
        dispatch(getDoctorsAction({ key: encryptMessage(doctorPayload) }));
    }, [dispatch, doctorSearch, activeTab])
    useEffect(() => {
        if (createResponse === 201) {
            setPatientId(createPatientResponse?._id)
        }
    }, [createResponse])
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
        }
    };
    useEffect(() => {
        dispatch(getStatesByCountryAction());
    }, [dispatch]);

    const [stateCode, setStateCode] = useState()


    useEffect(() => {
        if (stateToSelect) {
            dispatch(getSubClinicCitiesAction({ state_code: stateToSelect, name: '', limit: 25, skip: '' }));
        }
    }, [stateToSelect]);


    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId
    const onSubmit = (data) => {
        const payload = {
            clinicId: clinicId,
            ...(selectedDoctor ? { primaryProvider: selectedDoctor?.value } : {}),
            ...(data?.patientStatus ? { status: data?.patientStatus } : {}),
            ...(data?.title ? { title: data?.title } : {}),
            ...(data?.firstName ? { firstName: data?.firstName } : {}),
            ...(data?.middleName ? { middleName: data?.middleName } : {}),
            ...(data?.lastName ? { lastName: data?.lastName } : {}),
            ...(data?.birthName ? { birthName: data?.birthName } : {}),
            ...(data?.suffix ? { suffix: data?.suffix } : {}),
            ...(data?.approxAge ? { approxAge: data?.approxAge } : {}),
            ...(data?.dateOfBirth ? { dateOfBirth: data?.dateOfBirth } : {}),
            ...(logo?.url === null
                ? {}
                : {
                    patientChartPhoto: {
                        url: logo?.url?.split('?')[0],
                        fileName: logoName
                    }
                }),
            ...(data?.homePhone ? { homePhone: data?.homePhone?.replace(/\D/g, '') } : {}),
            ...(data?.cellPhone ? { cellPhone: data?.cellPhone?.replace(/\D/g, '') } : {}),
            ...(data?.officePhone ? { officePhone: data?.officePhone?.replace(/\D/g, '') } : {}),
            ...(data?.email ? { email: data?.email } : {}),
            ...(data?.alternateEmail ? { alternativeEmail: data?.alternateEmail } : {}),
            ...(data?.preferredCommunication ? { preferredCommunication: data?.preferredCommunication } : {}),
            ...(data?.reminderLanguage ? { reminderLanguage: data?.reminderLanguage } : {}),
            ...(data?.medicationHistoryConsent ? { medicationHistoryConsent: data?.medicationHistoryConsent === 'true' ? true : false } : {}),
            ...(data?.paymentProfile ? { paymentProfile: data?.paymentProfile } : {}),
            ...(data?.patientCopayAmount ? { patientCopayAmount: data?.patientCopayAmount } : {}),
            ...(data?.followupDate ? { followupDate: data?.followupDate } : {}),
            ...(data?.followupReason ? { followupReason: data?.followupReason } : {}),
        }

        dispatch(createPatientsAction({ key: encryptMessage(payload) }))
    };
    const tableData = [
        { type: 'Patient', values: Array(6).fill("0.00") },
        { type: 'Insurance', values: Array(6).fill("0.00") }, // Add more rows as needed
    ];

    const handleInputChange = (data) => {
        setDoctorSearch(data)
    }
    const handleChange = (selectedOption) => {
        setSelectedDoctor(selectedOption);
    };

    return (
        <div className="background_Color ">
            <div className="container-fluid mt-2 px-0">
                <Card className="px-md-3 py-md-2 scroll-container" style={{ height: '82vh', overflow: 'scroll' }}>
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
                                        className={`text-black nav-link fw-medium ${activeTab === "demographicDetails" ? "active fw-bold" : ""}`}
                                        onClick={() => handleTabChange("demographicDetails")}
                                    >
                                        Demographic
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${activeTab === "referringDoctor" ? "active fw-bold" : ""}`}
                                        onClick={() => handleTabChange("referringDoctor")}
                                    >
                                        Referring Doctor
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
                                <li className="nav-item">
                                    <button
                                        className={`text-black nav-link fw-medium ${activeTab === "insurance" ? "active fw-bold" : ""}`}
                                        onClick={() => handleTabChange("insurance")}
                                    >
                                        Insurance
                                    </button>
                                </li>
                            </ul>

                        </div>
                        <div className="d-flex">
                            {activeTab === "responsible" && (
                                <Button
                                    className="me-2 custom-buttons "
                                    onClick={() => handleTabChange("responsible")}
                                >
                                    Payment
                                </Button>
                            )}

                            {/* <Button className="me-2">
                                Clear
                            </Button>
                            <Button className="me-2">
                                Set Password
                            </Button> */}
                            <Button className="cancel-button" onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </div>

                    <div className="px-2">
                        {/* Form Section */}
                        {activeTab === "personalDetails" && (<Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                            <div className="row my-1" style={{ borderBottom: '1px solid #444141' }}>



                                <div className="col-3">
                                    <Form.Group>
                                        <Form.Label htmlFor="firstName" className="mb-0">First Name <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            id="firstName"
                                            type="text"
                                            placeholder="First Name"
                                            {...register('firstName', { required: "First name is required" })}
                                        />
                                        {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
                                    </Form.Group>
                                </div>



                                <div className="col-3">
                                    <Form.Group>
                                        <Form.Label htmlFor="lastName" className="mb-0">Last Name <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            id="lastName"
                                            type="text"
                                            placeholder="Last Name"
                                            {...register('lastName', { required: 'Last Name is required' })}
                                        />
                                        {errors.lastName && <span className="text-danger">{errors.lastName.message}</span>}
                                    </Form.Group>
                                </div>
                                <Col sm={3}>
                                    <Form.Group>
                                        <Form.Label className="mb-0">Patient Date of Birth</Form.Label>
                                        <Form.Control
                                            type="date"
                                            {...register('dateOfBirth')}
                                            onChange={(e) => {
                                                const calculatedAge = calculateAge(e.target.value);
                                                setAge(calculatedAge);
                                            }}
                                            max={new Date().toISOString().split("T")[0]} // Restricts future dates
                                        />
                                    </Form.Group>
                                </Col>
                                <div className="col-3">
                                    <Form.Group className="mb-1 position-relative">
                                        <Form.Label className='mb-0'>Cell Phone</Form.Label>
                                        <Form.Group>
                                            <InputGroup>
                                                <InputGroup.Text className='ps-3 pe-1 fw-bold text-black' style={{ height: '33px' }}>&nbsp;&nbsp;+1</InputGroup.Text>
                                                <Form.Control
                                                    type="tel"
                                                    style={{ height: '30px!important' }}
                                                    {...register('cellPhone', !id ? {
                                                        pattern: {
                                                            value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                                            message: 'Contact must be in the format (XXX)XXX-XXXX',
                                                        },
                                                        maxLength: {
                                                            value: 13,
                                                            message: 'Contact must not exceed 13 digits'
                                                        },
                                                        minLength: {
                                                            value: 13,
                                                            message: 'Contact must not be less than 13 digits'
                                                        }
                                                    } : {}
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

                                        <div
                                            className='position-absolute ' style={{ top: '48%', left: '1%' }}
                                        >
                                            <img
                                                src={us}
                                                alt="country code flag"
                                                width={20} />
                                        </div>


                                    </Form.Group>
                                </div>

                            </div>
                            <div className="row">



                                <div className="col-3">
                                    <Form.Group className="responnsible-party-select">
                                        <Form.Label className="mb-0">
                                            Primary Provider
                                        </Form.Label>
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
                                                clearErrors('selectedDoctor')
                                            }}
                                            name="doctorName"
                                            options={doctorOptions}
                                            placeholder="Select Doctor Name"
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    height: '30px',
                                                    minHeight: '30px',
                                                }),
                                                placeholder: (provided) => ({
                                                    ...provided,
                                                    fontWeight: 'bold',
                                                    fontSize: '12px',
                                                    paddingBottom: '5px'
                                                }),
                                            }}
                                        />
                                    </Form.Group>
                                </div>
                                <Col sm={3}>
                                    <Form.Group>
                                        <Form.Label className="mb-0">Approx age (if DOB is unknown)</Form.Label>
                                        <Form.Control type="text" placeholder="Approx. age" {...register('approxAge')} />
                                    </Form.Group>
                                </Col>
                                <div className="col-3">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Previous Birth Name </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Previous Birth Name"
                                            {...register('birthName')}
                                        />
                                        {errors.birthName && <span className="text-danger">{errors.birthName.message}</span>}
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Suffix </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Suffix"
                                            {...register('suffix')}
                                        />
                                        {errors.suffix && <span className="text-danger">{errors.suffix.message}</span>}
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <div className="mb-2 d-flex flex-column position-relative">
                                        <Form.Label className="mb-0">Patient Photo</Form.Label>
                                        <div
                                            onClick={() => logoFileInputRef.current.click()}
                                            style={{ height: '33px' }}
                                            className={`custom-file-upload justify-content-between cursor-pointer ${logoName || profileUploading ? '' : 'custom-form-fields'}`}
                                        >
                                            {logoName ? logoName : profileUploading ? 'Uploading...' : 'Upload Patient Chart Photo'}
                                            <p className="mb-0">
                                                <FiUploadCloud />
                                            </p>
                                        </div>
                                        <Form.Control
                                            type="file"
                                            className="d-none "
                                            style={{ height: '30px!important' }}
                                            {...register('profileImage', {
                                            })}
                                            accept=".png, .jpg, .jpeg, .svg" // Allow only specific file types
                                            ref={logoFileInputRef}
                                            onChange={handleFileChange}

                                        />
                                        {errors.profileImage && (<span className="text-danger">{errors.profileImage.message}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-3">
                                    <Form.Group>
                                        <Form.Label htmlFor="patientstatus" className="mb-0">Status</Form.Label>
                                        <Form.Select
                                            as="select"  // Use 'select' to make it a dropdown
                                            id="patientstatus"
                                            {...register('patientStatus')}
                                            data-has-value={!!watch('patientStatus')}
                                        >
                                            <option value="" hidden>Select status</option>  {/* Default option */}
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="Inactive-Deceased">Inactive-Deceased</option>
                                            <option value="Other">Other</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group>
                                        <Form.Label htmlFor="title" className="mb-0">Title</Form.Label>
                                        <Form.Select
                                            {...register('title')}
                                            data-has-value={!!watch('title')}
                                            aria-label="Select Title"
                                        >
                                            <option value="" hidden>Select Title</option>
                                            <option value="Mr.">Mr.</option>
                                            <option value="Mrs.">Mrs.</option>
                                            <option value="Miss">Miss</option>
                                            <option value="Dr.">Dr.</option>
                                            <option value="Other">Other</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group>
                                        <Form.Label htmlFor="middleName" className="mb-0">Middle Name</Form.Label>
                                        <Form.Control
                                            id="middleName"
                                            type="text"
                                            placeholder="Middle Name"
                                            {...register('middleName')}
                                        />
                                        {errors.middleName && <span className="text-danger">{errors.middleName.message}</span>}
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group className="mb-1 position-relative">
                                        <Form.Label className='mb-0'>Home Phone</Form.Label>
                                        <Form.Group>
                                            <InputGroup>
                                                <InputGroup.Text className='ps-3 pe-1 fw-bold text-black' style={{ height: '33px' }}>&nbsp;&nbsp;+1</InputGroup.Text>
                                                <Form.Control
                                                    type="tel"
                                                    style={{ height: '30px!important' }}
                                                    {...register('homePhone', !id ? {
                                                        pattern: {
                                                            value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                                            message: 'Contact must be in the format (XXX)XXX-XXXX',
                                                        },
                                                        maxLength: {
                                                            value: 13,
                                                            message: 'Contact must not exceed 13 digits'
                                                        },
                                                        minLength: {
                                                            value: 13,
                                                            message: 'Contact must not be less than 13 digits'
                                                        }
                                                    } : {}
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
                                        <div className='position-absolute' style={{ top: '48%', left: '1%' }}>
                                            <img
                                                src={us}
                                                alt="country code flag"
                                                width={20} />
                                        </div>
                                    </Form.Group>
                                </div>

                                <div className="col-3">
                                    <Form.Group className="mb-1 position-relative">
                                        <Form.Label className='mb-0'>Office Phone</Form.Label>
                                        <Form.Group>
                                            <InputGroup>
                                                <InputGroup.Text className='ps-3 pe-1 fw-bold text-black' style={{ height: '33px' }}>&nbsp;&nbsp;+1</InputGroup.Text>
                                                <Form.Control
                                                    type="tel"
                                                    style={{ height: '30px!important' }}
                                                    {...register('officePhone', !id ? {
                                                        pattern: {
                                                            value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                                            message: 'Contact must be in the format (XXX)XXX-XXXX',
                                                        },
                                                        maxLength: {
                                                            value: 13,
                                                            message: 'Contact must not exceed 13 digits'
                                                        },
                                                        minLength: {
                                                            value: 13,
                                                            message: 'Contact must not be less than 13 digits'
                                                        }
                                                    } : {}
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

                                        <div
                                            className='position-absolute ' style={{ top: '48%', left: '1%' }}
                                        >
                                            <img
                                                src={us}
                                                alt="country code flag"
                                                width={20} />
                                        </div>


                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group>
                                        <Form.Label htmlFor="email" className="mb-0">Email ID</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Email ID"
                                            {...register('email', { pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: "Invalid email address" } })}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Alternate Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Alternate Email ID"
                                            {...register('alternateEmail', {
                                                pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: "Invalid email address" }
                                            })}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Preferred Communication</Form.Label>
                                        <Form.Select
                                            {...register('preferredCommunication')}
                                            data-has-value={!!watch('preferredCommunication')}
                                            aria-label="Select Title"
                                        >
                                            <option value="" hidden>Select Preferred Communication</option>
                                            <option value="Home Phone">Home Phone</option>
                                            <option value="Work Phone">Work Phone</option>
                                            <option value="Cell Phone">Cell Phone</option>
                                            <option value="Email">Email</option>
                                            <option value="Text Message">Text Message</option>
                                            <option value="Declined">Declined</option>
                                            <option value="Snail Mail">Snail Mail</option>
                                            <option value="Other">Other</option>
                                        </Form.Select>
                                        {errors.preferredCommunication && <span className="text-danger">{errors.preferredCommunication.message}</span>}
                                    </Form.Group>
                                </div>

                                <div className="col-3">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Reminder Language</Form.Label>
                                        <Form.Select
                                            {...register('reminderLanguage',
                                            )}
                                            data-has-value={!!watch('reminderLanguage')}
                                        >
                                            <option value="" hidden>Select Reminder Language</option>
                                            <option value="English">English</option>
                                            <option value="Spanish">Spanish</option>
                                            <option value="French">French</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>

                                <div className="col-3">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Medication History Concent</Form.Label>
                                        <Form.Select
                                            {...register('medicationHistoryConsent',
                                            )}
                                            data-has-value={!!watch('medicationHistoryConsent')}
                                        >
                                            <option value="" hidden>Select Medication History Concent</option>
                                            <option value={'true'}>Yes</option>
                                            <option value={'false'}>No</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>

                                <div className="col-3">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Payment Profile</Form.Label>
                                        <Form.Select
                                            {...register('paymentProfile')}
                                            aria-label="Payment Profile"
                                            data-has-value={!!watch('paymentProfile')}
                                        >
                                            <option value="" hidden>Select Payment Profile</option>
                                            <option value="Cash">Cash</option>
                                            <option value="Insurance">Insurance</option>
                                            <option value="Insurance Out of Network">Insurance Out of Network</option>
                                            <option value="Auto Accident">Auto Accident</option>
                                            <option value="Worker's Comp">Worker's Comp</option>
                                            <option value="Other">Other</option>
                                        </Form.Select>
                                        {errors.paymentProfile && <span className="text-danger">{errors.paymentProfile.message}</span>}
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group>
                                        <Form.Label className="mb-0">Patient's Copay (in $)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Patient's Copay"
                                            {...register('patientCopayAmount', {
                                                pattern: {
                                                    value: /^[0-9]+(\.[0-9]+)?$/,
                                                    message: 'Only numbers or decimals are allowed'
                                                }
                                            })}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-3">
                                    <Form.Group>
                                        <Form.Label htmlFor="DOB" className="mb-0">Follow Up Date</Form.Label>
                                        <Form.Control
                                            type="date"  // Change type to "date" for date input
                                            placeholder="Follow Up Date"
                                            {...register('followupDate')}
                                        />
                                        {errors.followupDate && <span className="text-danger">{errors.followupDate.message}</span>}
                                    </Form.Group>
                                </div>
                                <div className="col-3">
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
                            <div className="d-flex gap-2 justify-content-end my-2">
                                <Button className="cancel-button" onClick={() => {
                                    reset();
                                    setSelectedDoctor(null);
                                    setLogo(null);
                                    setLogoName(null);
                                }}>Clear</Button>
                                <Button onClick={() => setSubmissionType('saveAndReset')} disabled={store?.createPatientsReducer?.loading || store?.updatePatientsReducer?.loading} className="custom-buttons " type="submit">
                                    Save & Add Another
                                </Button>
                                <Button onClick={() => setSubmissionType('saveAndNext')} disabled={store?.createPatientsReducer?.loading || store?.updatePatientsReducer?.loading} className="custom-buttons " type="submit">
                                    Save & Continue Editing
                                </Button>
                                <Button onClick={() => setSubmissionType('saveOnly')} disabled={store?.createPatientsReducer?.loading || store?.updatePatientsReducer?.loading} className="custom-buttons " type="submit">
                                    Save
                                </Button>
                            </div>
                        </Form>)}
                        {activeTab === "responsible" && <Responsiblle patientId={patientId} />}
                        {activeTab === "insurance" && <Insurance patientId={patientId} />}
                        {activeTab === "demographicDetails" && <Demographicdetails patientId={patientId} />}
                        {activeTab === "referringDoctor" && <ReferringDoctor patientId={patientId} />}
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
