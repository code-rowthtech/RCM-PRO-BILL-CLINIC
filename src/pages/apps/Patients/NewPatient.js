import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import ProfileDummy from "../../../assets/images/profileDummy.png";
import { Button, Card, Col, Form, Modal, Row, InputGroup } from "react-bootstrap";
import { FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { createPatientsAction, updatePatientsAction } from "../../../redux/patients/actions";
import { useForm } from "react-hook-form";
import us from '../../../assets/images/flags/us.jpg';
import { encryptMessage } from "../../../cryptoUtils";
import { handleUpload } from '../../../helpers/HandleUpload';
import { getCitiesAction, getClinicById, getStatesByCountryAction } from "../../../redux/actions";
import Responsiblle from "./Responsible";


const NewPatient = () => {
    const store = useSelector((state) => state);
    const doctorRoleId = store?.getDoctorsRolesReducer?.data?.result?.[0]?._id;
    const createResponse = store?.createClinicsReducer?.data?.status;

    const statesData = store?.getStatesReducer?.data;
    const cities = store?.getCitiesReducer?.cities1?.data?.cities;
    console.log({ cities })
    const dispatch = useDispatch();
    const [focused, setFocused] = useState(false);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const updateId = searchParams.get('updateid');

    const [smShow, setSmShow] = useState(false);
    const [password, setPassword] = useState("");
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [formData, setFormData] = useState({
        role: doctorRoleId,
    });
    const logoFileInputRef = useRef(null);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    const [searchedLocations, setSearchedLocations] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [updatePage, setUpdatePage] = useState(false);
    const [activeTab, setActiveTab] = useState("personalDetails");
    const [btnShow, setBtnShow] = useState(true);

    const [inputValue, setInputValue] = useState('');
    console.log({ inputValue })


    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === "personalDetails") {
            setBtnShow(true);
        } else {
            setBtnShow(false);
        }
    };

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
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
            const selectedCounty = cities && cities.find((data) => data?.name === selectedLocation?.components?.county);
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
    const getGeolocation = (e) => {
        const addressToSearch = e.target.value;
        setInputValue(addressToSearch); // Update input value
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed';
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                setSearchedLocations(data.results || []); // Update search results
            } catch (error) {
                console.error("Failed to fetch geocode data:", error);
                setSearchedLocations([]); // Clear results on error
            }
        }

        if (addressToSearch) {
            fetchGeocodeData(addressToSearch);
        } else {
            setSearchedLocations([]); // Clear results when input is empty
        }
    };

    const handleCitySelection = (e) => {
        setSelectedCity(e.target.value)
    }
    useEffect(() => {
        if (updateId) {
            dispatch(getClinicById({ key: encryptMessage({ id: updateId }) }))
            setUpdatePage(true)
        }
        dispatch(getStatesByCountryAction());
    }, [dispatch, updateId, createResponse === 200]);
    const handleStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0]; // Get the selected <option>
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        dispatch(getCitiesAction({ state_code: key?.id, name: '', limit: 25, skip: '' }))
    };

    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId

    const onSubmit = (data) => {
        const payload = {
            clinicId: clinicId,
            profile: {
                url: logo?.url?.split('?')[0],
                fileName: logoName
            },
            gender: data?.gender,
            title: data?.title,
            fullName: data?.fullName,
            chartNumber: data?.chartNumber,
            responsiblePartyName: data?.responsiblePartyName,
            address: {
                street: inputValue,
                city: data?.city,
                state: data?.state,
                zipCode: data?.zipCode,
            },
            email: data?.email,
            contactNumber: data?.contactNumber,
            note: data?.note,
            maritalStatus: data?.maritalStatus,
            dateOfBirth: data?.dateOfBirth,
            deceased: data?.deceased,
            ssn: data?.ssn,
            additionalMRN: data?.additionalMRN,
            financialClass: data?.financialClass,
            providerProfile: '67568bcf922eec0848016d5a',
            employer: data?.employer,
            relationship: data?.relationship,
            preferredLanguage: data?.preferredLanguage,
            pcp: '67568bcf922eec0848016d5a',
            raceEthnicity: data?.raceEthnicity,

        }
        console.log({ payload });
        reset();
        dispatch(createPatientsAction({ key: encryptMessage(payload) }))
    };

    return (
        <div className="background_Color pt-1 pb-2">
            <div className="container-fluid mt-4">
                <Card className="px-3 py-2">
                    <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: 600 }}>NEW PATIENT</p>
                        <div>
                            <Button className="me-3" onClick={() => setSmShow(true)}>
                                View Info
                            </Button>
                            <Button onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </div>

                    <div className="px-2">
                        {/* Navigation Tabs */}
                        <ul className="nav nav-underline">
                            <li className="nav-item">

                                <button
                                    className={`text-black  fw-medium nav-link ${activeTab === "personalDetails" ? "active" : ""}`}
                                    onClick={() => handleTabChange("personalDetails")}
                                >
                                    Personal Details
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`text-black fw-medium nav-link ${activeTab === "responsible" ? "active" : ""}`}
                                    onClick={() => handleTabChange("responsible")}
                                >
                                    Responsible party
                                </button>
                            </li>
                        </ul>

                        {/* Form Section */}
                        
                        {activeTab === "personalDetails" && (     <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row pb-3 mt-3" style={{ borderBottom: "1px solid #444141" }}>
                                <div className="col-6">
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
                                            })}
                                            ref={logoFileInputRef}
                                            onChange={handleFileChange}

                                        />
                                        {errors.profileImage && (<span className="text-danger">{errors.profileImage.message}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div>
                                        <Form.Label htmlFor="gender">Gender<span className='text-danger'>*</span></Form.Label>
                                        <div className="d-flex gap-2">
                                            <Form.Check
                                                type="radio"
                                                label="Male"
                                                value="Male"
                                                {...register('gender', { required: "Gender is required" })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Female"
                                                value="Female"
                                                {...register('gender', { required: "Gender is required" })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Others"
                                                value="Other"
                                                {...register('gender', { required: "Gender is required" })}
                                            />

                                        </div>
                                        {errors.gender && <span className="text-danger">{errors.gender.message}</span>}

                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className=" mb-3">
                                        <Form.Label htmlFor="title">Title</Form.Label>
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
                                    </div>

                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="row pb-3 mt-3" style={{ borderBottom: "1px solid #444141" }}>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="fileName">Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Full Name"
                                        {...register('fullName', { required: "Full name is required" })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="chartNumber">Chart Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Chart Number"
                                        {...register('chartNumber', { required: "Chart number is required" })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="responsibleParty">Responsible Party Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Responsible party name"
                                        {...register('responsiblePartyName', { required: "Responsible party name is required" })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <Form.Group className="mb-2">
                                        <Form.Label className="mb-1">Address</Form.Label>
                                        <div style={{ position: 'relative' }}>
                                            <Form.Control
                                                type="text"
                                                {...register('street')}
                                                value={selectedLocation || inputValue} // Use selected location or input value
                                                onChange={(e) => {
                                                    setSelectedLocation(null); // Clear selected location on typing
                                                    getGeolocation(e);
                                                    setFocused(true);
                                                }}
                                                onFocus={() => setFocused(true)}
                                                onBlur={() => {
                                                    setTimeout(() => setFocused(false), 200);
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
                                                {searchedLocations && searchedLocations.map((data, index) => (
                                                    <p
                                                        key={index}
                                                        onClick={() => {
                                                            console.log("Selected Address:", data?.formatted);
                                                            setSelectedLocation(data?.formatted); // Set selected location
                                                            setInputValue(data?.formatted); // Update input value with selected address
                                                            setFocused(false);
                                                        }}
                                                        style={{
                                                            margin: 0,
                                                            padding: '8px 12px',
                                                            cursor: 'pointer',
                                                        }}
                                                        className="hover-bg-change text-black"
                                                    >
                                                        {data?.formatted || "No Address Available"}
                                                    </p>
                                                ))}

                                                {searchedLocations?.length === 0 && <p className="text-muted px-2 py-1">No results found</p>}
                                            </div>
                                        </div>
                                    </Form.Group>
                                </div>
                                <div className="col-6 ">
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1' >State</Form.Label>
                                        <Form.Select
                                            {...register('state')}
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
                                </div>
                                <div className="col-6 ">
                                    <div className="row">
                                        <div className="col-6">
                                            <Form.Group className="mb-2">
                                                <Form.Label className='mb-1'>City</Form.Label>
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
                                        </div>
                                        <div className="col-6">
                                            <Form.Label htmlFor="zipCode">Zip Code</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Zip Code"
                                                {...register('zipCode', { required: "Zip code is required" })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Email and Phone Section */}
                            <div className="row pb-3 mt-3" style={{ borderBottom: "1px solid #444141" }}>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="email">Email ID</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Email ID"
                                        {...register('email', { required: "Email is required", pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: "Invalid email address" } })}
                                    />
                                </div>
                                <div className='mb-3 col-6'>
                                    <Form.Group className="mb-0 position-relative">
                                        <Form.Label className='mb-1'>Phone{!id && <span className='text-danger'>*</span>}</Form.Label>
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
                                <div className="col-12 ">
                                    <Form.Label htmlFor="note">Note (Text)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Note"
                                        {...register('note')}
                                    />
                                </div>
                            </div>
                            <div className="row pb-3 mt-3" style={{ borderBottom: "1px solid #444141" }}>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="marital">Marital Status</Form.Label>
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

                                </div>

                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="DOB">Date of Birth</Form.Label>
                                    <Form.Control
                                        type="date"  // Change type to "date" for date input
                                        placeholder="Date of Birth"
                                        {...register('dateOfBirth', { required: "Date of Birth is required" })}
                                    />
                                </div>

                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="deceased">Deceased</Form.Label>
                                    <Form.Control
                                        as="select"  // Use 'select' to create a dropdown
                                        id="deceased"
                                        {...register('deceased', { required: "Deceased is required" })}
                                    >
                                        <option value="">Select Deceased</option>  {/* Default option */}
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </Form.Control>

                                </div>

                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="SSN">SSN#</Form.Label>
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
                                    />
                                    {/* Display error message */}
                                    {errors.ssn && <span className="text-danger">{errors.ssn.message}</span>}
                                </div>

                                <div className="col-6 ">
                                    <Form.Label htmlFor="additional">Additional MRN</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Additional MRN"
                                        {...register('additionalMRN', { required: "Additional MRN is required" })}
                                    />
                                </div>
                            </div>
                            <div className="row pb-3 mt-3" >
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="financial">Financial Class</Form.Label>
                                    <Form.Control
                                        as="select"  // Use 'select' to create a dropdown
                                        id="financial"
                                        {...register('financialClass', { required: "Financial Class is required" })}
                                    >
                                        <option value="">Select Financial Class</option>  {/* Default option */}
                                        <option value="Self-Pay">Self-Pay</option>
                                        <option value="Insurance">Insurance</option>
                                        <option value="Medicaid">Medicaid</option>
                                        <option value="Medicare">Medicare</option>
                                        <option value="Other">Other</option>
                                    </Form.Control>

                                </div>

                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="provider">Provider Profile</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Provider Profile"
                                        {...register('providerProfile', { required: "Provider Profile is required" })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="employer">Employer</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Employer"
                                        {...register('employer', { required: "Employer is required" })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="relationship">Relationship</Form.Label>
                                    <Form.Control
                                        as="select"  // Use 'select' to create a dropdown
                                        id="relationship"
                                        {...register('relationship', { required: "Relationship is required" })}
                                    >
                                        <option value="">Select Relationship</option>  {/* Default option */}
                                        <option value="Self">Self</option>
                                        <option value="Spouse">Spouse</option>
                                        <option value="Child">Child</option>
                                        <option value="Other">Other</option>
                                    </Form.Control>

                                </div>

                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="preferred">Preferred Language</Form.Label>
                                    <Form.Control
                                        as="select"  // Use 'select' to create a dropdown
                                        id="preferred"
                                        {...register('preferredLanguage', { required: "Preferred Language is required" })}
                                    >
                                        <option value="">Select Preferred Language</option>  {/* Default option */}
                                        <option value="English">English</option>
                                        <option value="Spanish">Spanish</option>
                                        <option value="Other">Other</option>
                                    </Form.Control>

                                </div>

                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="PCP">PCP</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="PCP"
                                        {...register('pcp', { required: "PCP is required" })}
                                    />
                                </div>
                                <div className="col-12">
                                    <Form.Label htmlFor="race">Race & Ethnicity</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Race & Ethnicity"
                                        {...register('raceEthnicity', { required: "Race & Ethnicity is required" })}
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="d-flex gap-2 justify-content-end mb-2">
                                <Button variant="secondary">Cancel</Button>
                                <Button variant="primary" type="submit">Save</Button>
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
