import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import ProfileDummy from "../../../assets/images/profileDummy.png";
import { Button, Card, Col, Form, Modal, Row, InputGroup } from "react-bootstrap";
import { FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import us from '../../../assets/images/flags/us.jpg';
import { encryptMessage } from "../../../cryptoUtils";
import { handleUpload } from '../../../helpers/HandleUpload';
import { getCitiesAction, getClinicById, getStatesByCountryAction, getSubClinicCitiesAction } from "../../../redux/actions";


const Responsiblle = () => {
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
    const [stateToSelect, setStateToSelect] = useState('');

    const [inputValue, setInputValue] = useState('');
    console.log({ selectedCity })




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
    useEffect(() => {
        dispatch(getStatesByCountryAction());
        dispatch(getSubClinicCitiesAction())
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
            clinicId: clinicId,
            profile: {
                url: logo?.url?.split('?')[0],
                fileName: logoName
            },
            gender: data?.gender,
            title: data?.title,
            fullName: data?.fullName,
            chartNumber: data?.chartNumber,
            account: data?.account,
            address: {
                street: data?.address,
                city: data?.city,
                state: data?.stateName,
                zipCode: data?.zip,
            },
            email: data?.email,
            contactNumber: data?.contactNumber,
            note: data?.note,
            status: data?.status,
            ssn: data?.ssn,
            stateMent: data?.stateMent,
            accountType: data?.accountType,
            employer: data?.employer,
            patientName: data?.patientName,

        }
        console.log({ payload });
        reset();
        // dispatch(createPatientsAction({ key: encryptMessage(payload) }))
    };

    return (
        <>



            {/* Form Section */}
            <Form onSubmit={handleSubmit(onSubmit)}>
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
                        <Form.Label htmlFor="fileName">Account</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Account"
                            {...register('account', { required: "Account is required" })}
                        />
                    </div>
                    <Col sm={6}>

                        <Form.Group className="mb-2">
                            <Form.Label className="mb-1">Address</Form.Label>
                            <div >
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
                    </Col>

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
                    <div className="col-6 ">
                        <div className="row">
                            <Col sm={6}>
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
                                    {/* } */}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className='mb-1'>Zip</Form.Label>
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

                </div>

                {/* Address Section */}
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
                    <div className="col-6">
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
                    <div className="col-6 ">
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
                        <Form.Label htmlFor="employer">Employer</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Employer"
                            {...register('employer', { required: "Employer is required" })}
                        />
                    </div>

                    <div className="col-6 mb-3">
                        <Form.Label htmlFor="status">Status</Form.Label>
                        <Form.Control
                            as="select"  // Use 'select' to make it a dropdown
                            {...register('status', { required: " status is required" })}
                        >
                            <option value="">Select  status</option>  {/* Default option */}
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Other">Other</option>
                        </Form.Control>

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
                        <Form.Label htmlFor="responsibleParty">Patient Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Patient Name"
                            {...register('patientName', { required: "Patient Name is required" })}
                        />
                    </div>


                </div>
                <div className="row pb-3 mt-3" >
                 

                    <div className="col-6 mb-3">
                        <Form.Label htmlFor="Account">Account type</Form.Label>
                        <Form.Control
                            as="select"  // Use 'select' to create a dropdown
                            id="Account"
                            {...register('accountType', { required: "Account type is required" })}
                        >
                            <option value="">Select Account type</option>  {/* Default option */}
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </Form.Control>

                    </div>



                    <div className="col-6 ">
                        <Form.Label htmlFor="additional">Statement formate</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Statement formate"
                            {...register('stateMent', { required: "stateMent formate is required" })}
                        />
                    </div>
                 

                  

                 

                

              
                </div>

                {/* Buttons */}
                <div className="d-flex gap-2 justify-content-end mb-2">
                    <Button variant="secondary">Cancel</Button>
                    <Button variant="primary" type="submit">Save</Button>
                </div>
            </Form>

        </>


    );
};

export default Responsiblle;
