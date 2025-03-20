import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BiEdit } from 'react-icons/bi';
import { FiUploadCloud } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AddressForm from '../Common Pages/AddressForm';
import TelecomFrom from '../Common Pages/TelecomFrom';
import { useDispatch, useSelector } from 'react-redux';
import { encryptMessage } from '../../../cryptoUtils';
import { createResponsiblePartyAction, stateEmptydAction } from '../../../redux/actions';
import { dataList } from '../../../utils/DataSets/relations.data';
import Select from 'react-select';


const Responsiblle = ({ patientId, activeTab, setActiveTab }) => {
    const store = useSelector((state) => state);
    const [submissionType, setSubmissionType] = useState(null);
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const dispatch = useDispatch();
    const [responsibleAddresses, setResponsibleAddresses] = useState([
        { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: '' },
    ]);
    const createResponse = store?.createResponsiblePartyReducer?.data?.status;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        clearErrors,
    } = useForm();
    const onSubmit = (data) => {
        const payload = {
            patientId: patientId,
            name: [
                {
                    use: 'official', // You can set this dynamically if needed
                    text: data?.fullName,
                    family: data?.lastName || '', // Assuming you have a last name field
                    given: [data?.firstName || '', data?.middleName || ''], // Assuming first & middle name exist
                    prefix: [data?.title || ''], // Using title as prefix
                    suffix: [], // Add suffix if available
                    preferred: true,
                },
            ],
            account: data?.account,
            address: responsibleAddresses,
            gender: data?.gender,
            dateOfBirth: data?.dateOfBirth,
            ssn: data?.SSN,
            email: data?.email,
            contactNumber: data?.contactNumber,
            clinicId: clinicId,
            title: data?.title,
        };
        dispatch(createResponsiblePartyAction({ key: encryptMessage(payload) }));
    };
    useEffect(() => {
        if (createResponse === 201) {
            dispatch(stateEmptydAction());
            reset();
        }
    }, [createResponse]);
    useEffect(() => {
        if (createResponse === 201) {
            if (submissionType === 'saveAndNext') {
                reset(); // Reset the form
                setActiveTab('referringDoctor');
            } else if (submissionType === 'saveAndReset') {
                reset();
                setActiveTab('personalDetails');
            }
        }
    }, [createResponse]);
    const relationshipOption = dataList?.map((relation) => ({
        value: relation, // Code as the value
        label: relation.display, // Display text as the label
    }));
    const handleRelationChange = (selectedOption) => {
        setValue('ethnicity', selectedOption ? selectedOption.display : '');
    };
    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="row px-0 ">
                    <div className="row  pb-2 pt-1 pe-0">
                        <div className="col-md-3 col-12 pe-1">
                            <Form.Label className="mb-0">
                                Title <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select {...register('title', { required: 'This field is required' })}>
                                <option value="">Select Title</option>
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Miss">Miss</option>
                                <option value="Dr.">Dr.</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                            {errors.title && <span className="text-danger">{errors.title.message}</span>}
                        </div>
                        <div className="col-md-3 col-12">
                            <Form.Label htmlFor="fileName" className="mb-0">
                                Full Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Full Name"
                                {...register('fullName', { required: 'Full name is required' })}
                            />
                            {errors.fullName && <span className="text-danger">{errors.fullName.message}</span>}
                        </div>

                        <div className="col-md-3 col-12">
                            <Form.Label htmlFor="gender" className="mb-0">
                                Gender <span className="text-danger">*</span>
                            </Form.Label>
                            <div className="d-flex gap-2">
                                <Form.Select
                                    {...register('gender', { required: 'Gender is required' })}
                                    aria-label="Select Gender">
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Form.Select>
                            </div>
                            {errors.gender && <span className="text-danger">{errors.gender.message}</span>}
                        </div>
                        <div className="col-md-3 col-12 pe-0">
                            <Form.Label htmlFor="DOB" className="mb-0">
                                Date of Birth <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Date of Birth"
                                {...register('dateOfBirth', { required: 'This field is required' })}
                            />
                            {errors.dateOfBirth && <span className="text-danger">{errors.dateOfBirth.message}</span>}
                        </div>
                        <Col sm={3} className='mb-2'>
                            <Form.Group>
                                <Form.Label className="mb-0">Emergency Contact Relation</Form.Label>
                                <Select
                                    options={relationshipOption} // Use the formatted array
                                    isSearchable
                                    className="basic-single"
                                    classNamePrefix="select"
                                    placeholder="&nbsp; Select "
                                    onChange={handleRelationChange}
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            height: '30px',
                                            minHeight: '30px',
                                            border: '0px',
                                        }),
                                        placeholder: (provided) => ({
                                            ...provided,
                                            fontWeight: 'bold',
                                            fontSize: '12px',
                                            paddingBottom: '5px',
                                        }),
                                    }}
                                />
                            </Form.Group>
                        </Col>
                    </div>
                    <hr />
                    <AddressForm addresses={responsibleAddresses} setAddresses={setResponsibleAddresses} />
                    <hr />
                    <TelecomFrom />
                </div>
                <div className="d-flex gap-2 justify-content-end mb-2 mt-md-4">
                    <Button className="cancel-button" onClick={() => reset()}>
                        Clear
                    </Button>
                    <Button
                        onClick={() => {
                            setSubmissionType('saveAndReset');
                        }}
                        className="custom-buttons"
                        type="submit">
                        Save & Add Another
                    </Button>
                    <Button
                        onClick={() => {
                            setSubmissionType('saveAndNext');
                        }}
                        disabled={store?.updatePatientsReducer?.loading}
                        className="custom-buttons"
                        type="submit">
                        Save & Continue Editing
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default Responsiblle;

// import { useNavigate, useSearchParams } from "react-router-dom";
// import { BiEdit } from "react-icons/bi";
// import ProfileDummy from "../../../assets/images/profileDummy.png";
// import { Button, Card, Col, Form, Modal, Row, InputGroup, Table } from "react-bootstrap";
// import { FiUploadCloud } from "react-icons/fi";
// import { useDispatch, useSelector } from "react-redux";
// import { useForm } from "react-hook-form";
// import us from '../../../assets/images/flags/us.jpg';
// import { encryptMessage } from "../../../cryptoUtils";
// import { handleUpload } from '../../../helpers/HandleUpload';
// import { createResponsiblePartyAction, getCitiesAction, getClinicById, getStatesByCountryAction, getSubClinicCitiesAction, stateEmptydAction } from "../../../redux/actions";
// import Spinner from "../../../constants/Spinner";
// const Responsiblle = ({ patientId }) => {
//     const store = useSelector((state) => state);
//     const doctorRoleId = store?.getDoctorsRolesReducer?.data?.result?.[0]?._id;
//     const statesData = store?.getStatesReducer?.data;
//     const cities = store?.getCitiesReducer?.cities1?.data?.cities;
//     const dispatch = useDispatch();
//     const [focused, setFocused] = useState(false);
//     const [searchParams] = useSearchParams();
//     const id = searchParams.get('id');
//     const updateId = searchParams.get('updateid');
//     const [smShow, setSmShow] = useState(false);
//     const [password, setPassword] = useState("");
//     const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
//     const [isVisible, setIsVisible] = useState(false);
//     const [timeoutId, setTimeoutId] = useState(null);
//     const [formData, setFormData] = useState({
//         role: doctorRoleId,
//     });
//     const logoFileInputRef = useRef(null);
//     const [logoName, setLogoName] = useState('');
//     const [logo, setLogo] = useState(null);
//     const [searchedLocations, setSearchedLocations] = useState(null)
//     const [selectedLocation, setSelectedLocation] = useState(null);
//     const [selectedCity, setSelectedCity] = useState(null);
//     const [updatePage, setUpdatePage] = useState(false);
//     const [stateToSelect, setStateToSelect] = useState('');
//     const [inputValue, setInputValue] = useState('');
//     const navigate = useNavigate();
//     const { register, handleSubmit, formState: { errors }, setValue, reset, clearErrors } = useForm();
//     const createResponse = store?.createResponsiblePartyReducer?.data?.status;
//     useEffect(() => {
//         if (createResponse === 201) {
//             dispatch(stateEmptydAction())
//             reset();
//         }
//     }, [createResponse])
//     useEffect(() => {
//         if (selectedLocation) {
//             setValue('address', selectedLocation?.formatted)
//             const stateId = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?.id;
//             const selectedState = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?.name;
//             setValue('stateName', selectedState)
//             const countyName = selectedLocation?.components?.county;
//             dispatch(getCitiesAction({ state_code: stateId, name: countyName, limit: '', skip: '' }))
//         }
//     }, [selectedLocation, setValue, statesData, dispatch])
//     useEffect(() => {
//         if (cities) {
//             const selectedCounty = cities && cities.find((data) => data?.name === selectedLocation?.components?.county)?.name;
//             setValue('city', selectedCounty)
//         }
//     }, [cities])

//     const handlePasswordSubmit = (e) => {
//         e.preventDefault();
//         if (password === "1234") {
//             setIsPasswordCorrect(true);
//             setSmShow(false);
//             setIsVisible(true);

//             const id = setTimeout(() => {
//                 setIsPasswordCorrect(false);
//                 setIsVisible(false);
//             }, 300000);

//             setTimeoutId(id);
//         }
//     };
//     const handleFileChange = async (e) => {
//         const selectedFile = e.target.files[0];
//         try {
//             const url = await handleUpload(selectedFile);
//             setLogo(url);
//             setLogoName(selectedFile?.name)
//         } catch (error) {
//             // console.error('Error during file upload:', error);
//         }
//     };
//     useEffect(() => {
//         dispatch(getStatesByCountryAction());
//         dispatch(getSubClinicCitiesAction())
//     }, [dispatch]);
//     const getGeolocation = async (e) => {
//         const addressToSearch = e.target.value;

//         if (!addressToSearch) {
//             setSearchedLocations([]);
//             return;
//         }

//         const apiKey = '2a77840d874f4c35848e37042ce7c8ed'; // Replace with your API key
//         const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(addressToSearch)}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

//         try {
//             const response = await fetch(url);
//             if (!response.ok) {
//                 throw new Error(`Error fetching data: ${response.status}`);
//             }
//             const data = await response.json();
//             setSearchedLocations(data.results || []);
//         } catch (error) {
//             console.error('Failed to fetch geocode data:', error);
//         }
//     };

//     const [stateCode, setStateCode] = useState()

//     const handleAddressSelection = (location) => {
//         setValue('address', location.formatted);
//         setValue('zip', location.components.postcode || '');
//         setValue('stateName', location.components.state || '');
//         setValue('city', location.components.city || location.components.town || '');
//         setValue('street', location.components.road || location.components.street || '');
//         setStateCode(location?.components?.state_code)
//         dispatch(getSubClinicCitiesAction({ state_code: location?.components?.state_code, name: '', limit: 25, skip: '' }));

//         const stateCode = statesData?.states?.find(
//             (state) => state.name === location.components.state
//         )?.state_code;
//         setSelectedCity(location.components.city)
//         if (stateCode) {
//             setStateToSelect(stateCode);
//             dispatch(getSubClinicCitiesAction({ state_code: stateCode, name: '', limit: 25, skip: '' }));
//         }
//         setFocused(false);
//     };

//     useEffect(() => {
//         if (stateToSelect) {
//             dispatch(getSubClinicCitiesAction({ state_code: stateToSelect, name: '', limit: 25, skip: '' }));
//         }
//     }, [stateToSelect]);

//     const handleStateSelection = (e) => {
//         const stateCode = e.target.value;
//         if (stateCode) {
//             setStateToSelect(stateCode);
//             dispatch(getSubClinicCitiesAction({ state_code: stateCode, name: '', limit: 25, skip: '' }));
//         }
//     };

//     const handleCitySelection = (e) => {
//         const city = JSON.parse(e.target.value);
//         if (city) {
//             setSelectedCity(city);
//         }
//     };

//     const stateGeoLocation = 'stateName';
//     useEffect(() => {
//         if (stateGeoLocation) {
//             setStateToSelect(statesData?.states && statesData?.states.find((data) => data?.state_code === stateGeoLocation));
//         }
//     }, [stateGeoLocation])

//     const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId

//     const onSubmit = (data) => {
//         const calculateAge = (dob) => {
//             const birthDate = new Date(dob);
//             const today = new Date();
//             let age = today.getFullYear() - birthDate.getFullYear();
//             const monthDifference = today.getMonth() - birthDate.getMonth();

//             // Adjust age if the birth month/day hasn't occurred yet in the current year
//             if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
//                 age--;
//             }
//             return age;
//         };
//         const payload = {
//             patientId: patientId,
//             fullName: data?.fullName,
//             account: data?.account,
//             address: {
//                 ...(data?.address ? { street: data?.address } : {}),
//                 ...(data?.city ? { city: data?.city } : {}),
//                 ...(data?.stateName ? { state: data?.stateName } : {}),
//                 ...(data?.zip ? { zip: data?.zip } : {}),
//             },
//             gender: data?.gender,
//             dateOfBirth: data?.dateOfBirth,
//             age: data?.dateOfBirth ? calculateAge(data?.dateOfBirth) : '', // Calculate age if dateOfBirth exists
//             ssn: data?.SSN,
//             email: data?.email,
//             contactNumber: data?.contactNumber,
//             clinicId: clinicId,
//             title: data?.title,
//         }
//         dispatch(createResponsiblePartyAction({ key: encryptMessage(payload) }))

//     };
//     const tableData = [
//         { type: 'Patient', values: Array(6).fill("0.00") },
//         { type: 'Insurance', values: Array(6).fill("0.00") }, // Add more rows as needed
//     ];
//     return (
//         <>
//             <Form onSubmit={handleSubmit(onSubmit)}>
//                 <div className="row px-0 " >
//                     <div className="row  pb-2 pt-1 pe-0" >
//                         <div className="col-md-3 col-12">
//                             <Form.Label htmlFor="fileName" className="mb-0">Full Name <span className="text-danger">*</span></Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 placeholder="Full Name"
//                                 {...register('fullName', { required: "Full name is required" })}
//                             />
//                             {errors.fullName && <span className="text-danger">{errors.fullName.message}</span>}
//                         </div>
//                         <div className="col-md-3 col-12 pe-1">
//                             <Form.Label className="mb-0">Title <span className="text-danger">*</span></Form.Label>
//                             <Form.Select
//                                 {...register('title', { required: "This field is required" })}
//                             >
//                                 <option value="">Select Title</option>
//                                 <option value="Mr.">Mr.</option>
//                                 <option value="Mrs.">Mrs.</option>
//                                 <option value="Miss">Miss</option>
//                                 <option value="Dr.">Dr.</option>
//                                 <option value="Other">Other</option>
//                             </Form.Select>
//                             {errors.title && <span className="text-danger">{errors.title.message}</span>}
//                         </div>
//                         <div className="col-md-3 col-12">
//                             <Form.Label htmlFor="gender" className="mb-0">Gender <span className='text-danger'>*</span></Form.Label>
//                             <div className="d-flex gap-2">
//                                 <Form.Select
//                                     {...register('gender', { required: "Gender is required" })}
//                                     aria-label="Select Gender"
//                                 >
//                                     <option value="">Select Gender</option>
//                                     <option value="Male">Male</option>
//                                     <option value="Female">Female</option>
//                                     <option value="Other">Other</option>

//                                 </Form.Select>

//                             </div>
//                             {errors.gender && <span className="text-danger">{errors.gender.message}</span>}

//                         </div>
//                         <div className="col-md-3 col-12 pe-0">
//                             <Form.Label htmlFor="DOB" className="mb-0">Date of Birth <span className="text-danger">*</span></Form.Label>
//                             <Form.Control
//                                 type="date"  // Change type to "date" for date input
//                                 placeholder="Date of Birth"
//                                 {...register('dateOfBirth', { required: "This field is required" })}
//                             />
//                             {errors.dateOfBirth && <span className="text-danger">{errors.dateOfBirth.message}</span>}
//                         </div>
//                     </div>
//                     <hr />
//                       <Row>
//                                         <Col sm={12}>
//                                             <h5>
//                                                 Address Details
//                                                 <span
//                                                     className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
//                                                     onClick={addAddress}></span>
//                                             </h5>
//                                         </Col>
//                                     </Row>
//                                     {addresses.map((item, index) => (
//                                         <Row key={index} className="mb-2">
//                                             <Col sm={4} className="mb-2">
//                                                 <Form.Label className="mb-1">Type</Form.Label>
//                                                 <Form.Select
//                                                     value={item.use}
//                                                     className="text-capitalize"
//                                                     data-has-value={!!watch(`address[${index}].use`)}
//                                                     {...register(`address[${index}].use`)}
//                                                     onChange={(e) => handleAddressChange(index, 'use', e.target.value)}>
//                                                     <option value="" hidden>
//                                                         Select
//                                                     </option>
//                                                     {addressUses.map((use) => (
//                                                         <option key={use} className="text-capitalize" value={use}>
//                                                             {use}
//                                                         </option>
//                                                     ))}
//                                                 </Form.Select>
//                                             </Col>
//                                             <Col sm={4} className="mb-2 position-relative">
//                                                 <Form.Label className="mb-1">Address</Form.Label>
//                                                 <Form.Control
//                                                     type="text"
//                                                     placeholder="Street Address"
//                                                     value={item.line[0]}
//                                                     onChange={(e) => {
//                                                         handleAddressChange(index, 'line', e.target.value);
//                                                         // Set active index so suggestions appear for this address
//                                                         setActiveAddressIndex(index);
//                                                         setAddressFocused(true);
//                                                         // Call your geolocation API with the current input value
//                                                         getGeolocation(e)?.then((data) => {
//                                                             // Expecting your getGeolocation to return an object with results
//                                                             if (data && data.results) {
//                                                                 setSearchedLocations(data.results);
//                                                             }
//                                                         });
//                                                     }}
//                                                     onFocus={() => {
//                                                         setActiveAddressIndex(index);
//                                                         setAddressFocused(true);
//                                                     }}
//                                                     onBlur={() => {
//                                                         setTimeout(() => setAddressFocused(false), 200);
//                                                     }}
//                                                 />
//                                                 {activeAddressIndex === index && addressFocused && searchedLocations?.length > 0 && (
//                                                     <div
//                                                         style={{
//                                                             position: 'absolute',
//                                                             top: '100%',
//                                                             left: 0,
//                                                             width: '100%',
//                                                             maxHeight: '150px',
//                                                             overflowY: 'auto',
//                                                             zIndex: 111,
//                                                             backgroundColor: '#fff',
//                                                             border: '1px solid #ced4da',
//                                                             borderTop: 'none',
//                                                         }}>
//                                                         {searchedLocations.map((data, suggestionIndex) => (
//                                                             <p
//                                                                 key={suggestionIndex}
//                                                                 onClick={() => {
//                                                                     // Extract the necessary fields from the API response
//                                                                     // const formatted = data.formatted || '';
//                                                                     // const components = data.components || {};
//                                                                     // Build the new address object with auto-populated fields
//                                                                     const newAddress = {
//                                                                         use: item.use, // preserve existing use
//                                                                         line: [data?.formatted ? data?.formatted : ''],
//                                                                         city:
//                                                                             data?.components.city ||
//                                                                             data?.components.town ||
//                                                                             data?.components.village ||
//                                                                             '',
//                                                                         state: data?.components.state
//                                                                             ? data?.components.state
//                                                                             : data?.components.state_code,
//                                                                         postalCode: data?.components.postcode || item.postalCode || '', // Auto-fill or keep user input
//                                                                         country: data?.components?.country || '',
//                                                                     };
//                                                                     // Update the specific address entry
//                                                                     const updatedAddresses = [...addresses];
//                                                                     updatedAddresses[index] = newAddress;
//                                                                     setAddresses(updatedAddresses);
//                                                                     // Clear suggestions and remove focus
//                                                                     setSearchedLocations([]);
//                                                                     setAddressFocused(false);
//                                                                 }}
//                                                                 style={{
//                                                                     margin: 0,
//                                                                     padding: '8px 12px',
//                                                                     cursor: 'pointer',
//                                                                 }}
//                                                                 className="hover-bg-change text-black">
//                                                                 {data.formatted}
//                                                             </p>
//                                                         ))}
//                                                     </div>
//                                                 )}
//                                             </Col>

//                                             <Col sm={4} className="mb-2">
//                                                 <Form.Label className="mb-1">State</Form.Label>
//                                                 <Form.Select
//                                                     {...register(`address[${index}].state`)}
//                                                     data-has-value={!!getValues(`address[${index}].state`)}
//                                                     onChange={handleStateSelection}>
//                                                     <option value="">Select State</option>
//                                                     {statesData?.states?.map((data) => (
//                                                         <option
//                                                             selected={data?.name == addresses[0]?.state}
//                                                             key={data?.name}
//                                                             data-key={data?.id}
//                                                             value={addresses[0]?.state}>
//                                                             {data?.name}
//                                                         </option>
//                                                     ))}
//                                                 </Form.Select>
//                                             </Col>
//                                             <Col sm={4} className="mb-2">
//                                                 <Form.Label className="mb-1">City</Form.Label>
//                                                 <Form.Select
//                                                     data-has-value={!!getValues(`address[${index}].city`)}
//                                                     {...register(`address[${index}].city`)}
//                                                     // disabled={!selectedState || store?.getCitiesReducer?.loading}
//                                                 >
//                                                     <option value="">
//                                                         {store?.getCitiesReducer?.loading ? 'Loading...' : 'Select City'}
//                                                     </option>
//                                                     {cities1?.map((data) => (
//                                                         <option
//                                                             selected={data?.name == addresses[0]?.city}
//                                                             key={data?.name}
//                                                             value={data?._id}>
//                                                             {data?.name}
//                                                         </option>
//                                                     ))}
//                                                 </Form.Select>
//                                             </Col>
//                                             <Col sm={4}>
//                                                 <Form.Group className="mb-2">
//                                                     <Form.Label className="mb-1">Postal Code</Form.Label>
//                                                     <Form.Control
//                                                         type="text"
//                                                         value={item.postalCode || ''} // Ensure empty string if undefined
//                                                         placeholder="Postal Code"
//                                                         {...register(`address[${index}].postalCode`, {
//                                                             minLength: {
//                                                                 value: 5,
//                                                                 message: 'Postal code must be at least 5 characters long',
//                                                             },
//                                                             pattern: {
//                                                                 value: /^[0-9]+$/,
//                                                                 message: 'Postal code must contain numbers only',
//                                                             },
//                                                         })}
//                                                         maxLength={5}
//                                                         onChange={(e) => {
//                                                             handleAddressChange(index, 'postalCode', e.target.value);
//                                                         }}
//                                                     />
//                                                     {errors.postalCode && <span className="text-danger">{errors.postalCode.message}</span>}
//                                                 </Form.Group>
//                                             </Col>

//                                             <Col sm={4} className="position-relative">
//                                                 <Form.Label className="mb-1">Country</Form.Label>

//                                                 <Form.Control
//                                                     type="text"
//                                                     placeholder="Country"
//                                                     value={item.country}
//                                                     onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
//                                                 />
//                                                 {addresses.length > 1 && index !== 0 && (
//                                                     <span
//                                                         className="text-danger cursor-pointer position-absolute fs-5 fw-bold"
//                                                         style={{ right: '-2%', top: '50%' }}
//                                                         onClick={() => removeAddress(index)}>
//                                                         <CiCircleMinus />
//                                                     </span>
//                                                 )}
//                                             </Col>
//                                         </Row>
//                                     ))}

//                 </div>

//                 <div className="d-flex gap-2 justify-content-end mb-1 mt-1">
//                     <Button className="custom-buttons btn-height" disabled={store?.createResponsiblePartyReducer?.loading} type="submit">
//                         {store?.createResponsiblePartyReducer?.loading ?
//                             <Spinner color="white" className="spinner-border-sm" />
//                             :
//                             'Save'
//                         }
//                     </Button>
//                 </div>
//             </Form>

//         </>

//     );
// };
