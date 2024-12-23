import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import ProfileDummy from "../../../assets/images/profileDummy.png";
import { Button, Card, Col, Form, Modal, Row, InputGroup, Table } from "react-bootstrap";
import { FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import us from '../../../assets/images/flags/us.jpg';
import { encryptMessage } from "../../../cryptoUtils";
import { handleUpload } from '../../../helpers/HandleUpload';
import { createResponsiblePartyAction, getCitiesAction, getClinicById, getStatesByCountryAction, getSubClinicCitiesAction } from "../../../redux/actions";


const Responsiblle = () => {
    const store = useSelector((state) => state);
    const doctorRoleId = store?.getDoctorsRolesReducer?.data?.result?.[0]?._id;
    const createResponse = store?.createClinicsReducer?.data?.status;

    const statesData = store?.getStatesReducer?.data;
    const cities = store?.getCitiesReducer?.cities1?.data?.cities;
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
        dispatch(createResponsiblePartyAction({ key: encryptMessage(payload) }))

    };
    const tableData = [
        { type: 'Patient', values: Array(6).fill("0.00") },
        { type: 'Insurance', values: Array(6).fill("0.00") }, // Add more rows as needed
    ];

    return (
        <>



            {/* Form Section */}
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="row px-0 " >
                    <div className="row  pb-2 pt-1 pe-0" style={{ borderBottom: "1px solid #444141" }}>
                        <div className="col-3 ">
                            <Form.Label htmlFor="fileName" className="mb-0">Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Full Name"
                                {...register('fullName', { required: "Full name is required" })}
                            />
                        </div>
                        <div className="col-3 pe-1">
                            <Form.Label htmlFor="title" className="mb-0">Title</Form.Label>
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
                        <div className="col-3">
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
                        <div className="col-3 pe-0">
                            <Form.Label htmlFor="DOB" className="mb-0">Date of Birth</Form.Label>
                            <Form.Control
                                type="date"  // Change type to "date" for date input
                                placeholder="Date of Birth"
                                {...register('dateOfBirth', { required: "Date of Birth is required" })}
                            />
                        </div>
                    </div>
                    <div className="col-6" style={{ borderRight: "1px solid #444141" }}>
                        <div className="row pb-1" style={{ borderBottom: "1px solid #444141" }}>
                            <div className="py-1">
                                <Form.Label htmlFor="SSN" className="mb-0">SSN<span className='text-danger'>*</span></Form.Label>
                                <div className="d-flex gap-2">
                                    <Form.Select
                                        {...register('SSN', { required: "SSN is required" })}
                                        aria-label="Select SSN"
                                    >
                                        <option value="">Select SSN</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>

                                    </Form.Select>

                                </div>
                                {errors.SSN && <span className="text-danger">{errors.SSN.message}</span>}
                            </div>
                        </div>
                        <div className="row mb-1 mt-1 pb-1" style={{ borderBottom: "1px solid #444141" }}>
                            <div className="col-4 mb-1">
                                <Form.Label htmlFor="email" className="mb-0">Email ID</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Email ID"
                                    {...register('email', { required: "Email is required", pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: "Invalid email address" } })}
                                />
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
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                        </div>
                        <div className="row pb-1" style={{ borderBottom: "1px solid #444141" }}>
                            <div className="col-6 mb-1">
                                <div>
                                    <Form.Label htmlFor="employer" className="mb-0">Employer</Form.Label>
                                    <div className="d-flex gap-2">
                                        <Form.Select
                                            {...register('employer', { required: "employer is required" })}
                                            aria-label="Select employer"
                                        >
                                            <option value="">Select Employer</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>

                                        </Form.Select>

                                    </div>
                                    {errors.employer && <span className="text-danger">{errors.employer.message}</span>}

                                </div>
                            </div>
                            <div className="col-6 mb-1">
                                <div>
                                    <Form.Label htmlFor="status" className="mb-0">Status<span className='text-danger'>*</span></Form.Label>
                                    <div className="d-flex gap-2">
                                        <Form.Select
                                            {...register('status', { required: "status is required" })}
                                            aria-label="Select status"
                                        >
                                            <option value="">Select Status</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>

                                        </Form.Select>

                                    </div>
                                    {errors.status && <span className="text-danger">{errors.status.message}</span>}

                                </div>
                            </div>
                            <div className="col-6">
                                <div className=" mb-1">
                                    <Form.Label htmlFor="title" className="mb-0">Chart</Form.Label>
                                    <Form.Select
                                        {...register('title', { required: "Title is required" })}
                                        aria-label="Select Title"
                                    >
                                        <option value="">Select Chart</option>
                                        <option value="Mr.">1</option>
                                        <option value="Mrs.">2</option>
                                        <option value="Miss">3</option>
                                    </Form.Select>
                                </div>
                            </div>
                            <div className="col-6">
                                <Form.Label htmlFor="patientName" className="mb-0">Patient Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="patientName"
                                    {...register('patientName')}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="" >
                                <div>
                                    <Table responsive className="table-centered table-nowrap mb-0 mt-1">
                                        <thead className="text-white">
                                            <tr>
                                                <th className='text-white'>Seq</th>
                                                <th className='text-white'>Coverage</th>
                                                <th className='text-white'>Carrier</th>
                                                {/* <th className='text-white'>Email</th> */}
                                                {/* <th className='text-white'>Status</th> */}
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
                                                {/* <td>{data.email}</td> */}
                                                <td>Test</td>
                                                <td>2333</td>

                                                {/* <td>{data.status}</td> */}
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
                        </div>

                    </div>
                    <div className="col-6">
                        <div className="row pb-1  px-0" style={{ borderBottom: "1px solid #444141" }}>

                            <div className=" my-1">
                                <Form.Label htmlFor="fileName" className="mb-0">Account</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Account"
                                    {...register('account', { required: "Account is required" })}
                                />
                            </div>
                            <Col sm={12}>

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
                            </Col>

                            <Col sm={12}>

                                <Form.Group className="mb-1">
                                    <Form.Label className='mb-0' >State</Form.Label>
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
                            <div className=" ">
                                <div className="row">
                                    <Col sm={6}>
                                        <Form.Group className="mb-1">
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
                                        <Form.Group className="mb-1">
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
                        </div>
                        <div className="row mt-1">
                            <div className="col-6 mb-1">
                                <Form.Label htmlFor="Account" className="mb-0">Account type</Form.Label>
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
                            <div className="col-6 mb-1">
                                <Form.Label htmlFor="additional" className="mb-0">Statement formate</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Statement formate"
                                    {...register('stateMent', { required: "stateMent formate is required" })}
                                />
                            </div>
                            <div className="col-6 mb-1">
                                <Form.Label htmlFor="" className="mb-0">Hold patient billing</Form.Label>
                                <Form.Control
                                    as="select"  // Use 'select' to create a dropdown
                                    id="patientBilling"
                                    {...register('patientBilling', { required: "Patient Billing type is required" })}
                                >
                                    <option value="">Select billing type</option>  {/* Default option */}
                                    <option value="true">1</option>
                                    <option value="false">2</option>
                                </Form.Control>
                            </div>
                            <div className="col-6 mb-1">
                                <Form.Label htmlFor="holdReason" className="mb-0">Hold Reason</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Hold Reason"
                                    {...register('holdReason', { required: "holdReason formate is required" })}
                                />
                            </div>
                            <div className="col-6 mb-1">
                                <Form.Label htmlFor="" className="mb-0">Statement billing</Form.Label>
                                <Form.Control
                                    as="select"  // Use 'select' to create a dropdown
                                    id="statmentBilling"
                                    {...register('statmentBilling', { required: "Statment Billing type is required" })}
                                >
                                    <option value="">Select Statement billing type</option>  {/* Default option */}
                                    <option value="true">1</option>
                                    <option value="false">2</option>
                                </Form.Control>
                            </div>
                            <div className="col-6 mb-1">
                                <Form.Label htmlFor="" className="mb-0">Assess finance Charges</Form.Label>
                                <Form.Control
                                    as="select"  // Use 'select' to create a dropdown
                                    id="financeCharges"
                                    {...register('financeCharges', { required: "Assess finance Charges is required" })}
                                >
                                    <option value="">Select Assess finance Charges</option>  {/* Default option */}
                                    <option value="true">1</option>
                                    <option value="false">2</option>
                                </Form.Control>
                            </div>
                            <div className="col-3 mb-1">
                                <Form.Label htmlFor="" className="text-nowrap mb-0">Last patient payment</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Last patient payment"
                                    {...register('holdReason', { required: "Last patient payment is required" })}
                                />
                            </div>
                            <div className="col-3 mb-1 " style={{ marginTop: '21px' }}>
                                {/* <Form.Label htmlFor="holdReason">Hold Reason</Form.Label> */}
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                // {...register('holdReason', { required: "holdReason formate is required" })}
                                />
                            </div>
                            <div className="col-3 mb-1">
                                <Form.Label htmlFor="holdReason" className="mb-0">Last statement</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Last statement"
                                    {...register('lastStatement', { required: "Last statement is required" })}
                                />
                            </div>
                            <div className="col-3 mb-1" style={{ marginTop: '21px' }}>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                />
                            </div>
                            <div className="col-3 mt-3 pt-1">
                                <p className="text-nowrap " style={{ fontWeight: 600 }}>Legacy credit card on file</p>
                            </div>
                            <div className="col-3 mb-1">
                                <Form.Label htmlFor="holdReason" className="mb-0">Card</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Card"
                                    {...register('card', { required: "card is required" })}
                                />
                            </div>
                            <div className="col-3 mb-1">
                                <Form.Label htmlFor="holdReason" className="mb-0">Expiry</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Expiry"
                                    {...register('expiry', { required: "expiry is required" })}
                                />
                            </div>
                            <div className="col-3 mb-1" style={{ marginTop: '21px' }}>
                                <Form.Control
                                    type="text"
                                    placeholder=""
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="d-flex gap-2 justify-content-end mb-1 mt-1">
                    <Button className="custom-buttons" variant="primary" >Collections</Button>
                    <Button className="custom-buttons" variant="primary" >Statement</Button>
                    <Button
                        className="custom-buttons "
                        data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"
                        variant="primary"  >
                        Family history
                    </Button>
                    <div class="offcanvas offcanvas-end offcanvas-family-history" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                        <div class="offcanvas-header">
                            <h5 id="offcanvasRightLabel">Family Financial History</h5>
                            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body">
                            <Form>
                                <Row>
                                    <Col sm={12} className='mb-2'>
                                        <Form.Group>
                                            <Form.Label className='mb-0'>
                                                Date Type:
                                            </Form.Label>
                                            <Form.Select>
                                                <option value=''>Select</option>
                                                <option value='1'>1</option>
                                                <option value='2'>2</option>
                                                <option value='3'>3</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12} className='mb-2'>
                                        <Form.Group>
                                            <Form.Label className='mb-0'>
                                                Visit #:
                                            </Form.Label>
                                            <Form.Control type="text" placeholder="Enter visit number" />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6} className='mb-2'>
                                        <Form.Group>
                                            <Form.Label className='mb-0'>
                                                From Date:
                                            </Form.Label>
                                            <Form.Control type="date" />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6} className='mb-2'>
                                        <Form.Group>
                                            <Form.Label className='mb-0'>
                                                To:
                                            </Form.Label>
                                            <Form.Control type="date" />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12} className='mb-2'>
                                        <Form.Group>
                                            <Form.Label className='mb-0'>
                                                Provider:
                                            </Form.Label>
                                            <Form.Select>
                                                <option value=''>Select</option>
                                                <option value='1'>1</option>
                                                <option value='2'>2</option>
                                                <option value='3'>3</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12} className='mb-2'>
                                        <Form.Label>Sort By:</Form.Label>
                                        <div className="d-flex align-items-center gap-5">
                                            <Form.Group>
                                                <div className="">
                                                    <Form.Check
                                                        type="radio"
                                                        label="Newest First"
                                                        name="sortOrder"
                                                        value="newest"
                                                        id="newest"
                                                    />
                                                    <Form.Check
                                                        type="radio"
                                                        label="Oldest First"
                                                        name="sortOrder"
                                                        value="oldest"
                                                        id="oldest"
                                                    />
                                                </div>
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="">
                                                    <Form.Check
                                                        type="radio"
                                                        label="Summary"
                                                        name="Summary"
                                                        value="summary"
                                                    />
                                                    <Form.Check
                                                        type="radio"
                                                        label="Detail"
                                                        name="Detail"
                                                        value="detail"
                                                    />
                                                </div>
                                            </Form.Group>
                                        </div>
                                    </Col>
                                    <Col sm={12} className='mb-2 d-flex justify-content-end gap-2'>
                                        <Button className="custom-buttons">Reset</Button>
                                        <Button className="custom-buttons">Apply</Button>
                                    </Col>
                                </Row>

                            </Form>
                        </div>
                    </div>
                    <Button className="custom-buttons" variant="primary" >Credit cards</Button>
                    {/* <Button variant="danger">Delete</Button> */}
                    <Button className="custom-buttons" variant="secondary">Clear</Button>
                    <Button className="custom-buttons" variant="primary" > Previous </Button>
                </div>
            </Form>

        </>


    );
};

export default Responsiblle;
