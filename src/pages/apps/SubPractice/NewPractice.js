import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Form, InputGroup, Modal, Row, Spinner } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiDownloadCloud, FiEdit, FiEye, FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import EmailToDoctorModal from './EmailToDoctorModal';
import DepartmentDetails from './PracticeDetails';
import Documents from './Documents';
import { handleUpload } from '../../../helpers/HandleUpload';
import { encryptMessage } from '../../../cryptoUtils';
import us from '../../../assets/images/flags/us.jpg'
import { createSubClinicAction, getSubClinicCitiesAction, getSubClinicTypeAction } from '../../../redux/sub clinic/actions';
import ResetPassword from './ResetPassword';
import { getCitiesAction, getClinicTypeAction, getStatesByCountryAction } from '../../../redux/actions';
import ToastHandle from '../../../helpers/ToastMessage';
// import { handleFirstSpace } from '../../../helpers/noSpace';



const NewPractice = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("personalDetails");
    const [show, setShow] = useState(false);
    const [passShow, setPassShow] = useState(false);
    const logoFileInputRef = useRef(null);
    const [logo, setLogo] = useState(null);
    console.log(logo, 'logo')
    const [logoName, setLogoName] = useState('');
    const [smShow, setSmShow] = useState(false);
    const [btnShow, setBtnShow] = useState(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
 
    const handleLogoClick = () => {
        logoFileInputRef.current.click();
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

    // const handleFileChange = async (e) => {
    //     const selectedFile = e.target.files[0];
    //     if (selectedFile) {
    //         try {
    //             const objectURL = URL.createObjectURL(selectedFile);
    //             setLogo(objectURL); 
    //             setLogoName(selectedFile.name); 
    //             console.log("Image URL set: ", objectURL); 
    //         } catch (error) {
    //             console.error("Error during file upload:", error);
    //         }
    //     }
    // };

    const handleViewImage = () => {
        if (logo) {
            console.log("Opening image at: ", logo);
            window.open(logo, "_blank");
        } else {
            console.error("No logo URL available.");
        }
    };


    const [accreditationDetails, setAccreditationDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [medicalDetails, setMedicalDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [stateDetails, setStateDetails] = useState([
        { name: [], number: "", url: null, fileName: "" }
    ]);
    const [stateName, setStateName] = useState()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accreditationFileInputRef = useRef([]);
    const medicalFileInputRef = useRef(null);
    const stateFileInputRef = useRef(null);
    const store = useSelector((state) => state)
    const clinectypes = store?.getClinicTypeReducer?.data?.result
    const statesData = store?.getStatesReducer?.data;
    const citiesData = [store?.getSubClinicCityReducer];
    console.log("Cities in Store:", citiesData);
    const statecode = statesData?.states?.state_code
    console.log(statecode, 'sttecode')
    const clinicDataToUpdate = store?.getClinicByIdReducer?.data?.clinic;
    const createLoading = store?.createSubClinicsReducer?.loading

    console.log(clinectypes, 'clinic')
    console.log(statesData, 'state')

    const [updatePage, setUpdatePage] = useState(false);

    const [searchedLocations, setSearchedLocations] = useState([]);
    const [focused, setFocused] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [street, setStreet] = useState('');
    const [stateToSelect, setStateToSelect] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [openSelect, setOpenSelect] = useState(false);

    console.log(selectedCity, 'getcity')
    useEffect(() => {
        // Dispatch the action to fetch states and cities initially
        dispatch(getStatesByCountryAction());
        dispatch(getSubClinicCitiesAction())
    }, [dispatch]);

    useEffect(() => {
        // Auto-close dropdown when latitude and longitude are set
        if (latitude && longitude) {
            setFocused(false);
        }
    }, [latitude, longitude]);

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
    console.log(stateCode, 'codecode')

    const handleAddressSelection = (location) => {
        console.log(location, 'getloc')
        setValue('address', location.formatted);
        setValue('zip', location.components.postcode || '');
        setValue('stateName', location.components.state || '');
        setValue('city', location.components.city || location.components.town || '');
        setValue('street', location.components.road || location.components.street || '');
        setStateCode(location?.components?.state_code)
        setLatitude(location.geometry.lat);
        setLongitude(location.geometry.lng);
        setStreet(location.components.road || location.components.street || '');
        dispatch(getSubClinicCitiesAction({ state_code: location?.components?.state_code, name: '', limit: 25, skip: '' }));

        // Update the selected state and city based on the address selection
        const stateCode = statesData?.states?.find(
            (state) => state.name === location.components.state
        )?.state_code;

        setSelectedCity(location.components.city)

        if (stateCode) {
            setStateToSelect(stateCode);
            dispatch(getSubClinicCitiesAction({ state_code: stateCode, name: '', limit: 25, skip: '' }));
        }

        setFocused(false); // Close dropdown
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



    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            accreditationDetails: [{ name: '', documentNumber: '' }],
            medicalLicenses: [{ name: '', documentNumber: '' }],
            stateLicensing: [{ state: '', documentNumber: '' }],
        },
    });

    const closeModal = () => {
        setShow(false);
        setFormData('')
        reset()
        setValue('')
    };
    const closepassModal = () => {
        setPassShow(false);
    }

    useEffect(() => {
        dispatch(getClinicTypeAction())
        dispatch(getStatesByCountryAction())

    }, [dispatch])

    const handleNewDoctor = () => {
        navigate('/apps/Practice/list');
    };

    const handleAccreditationInputChange = (e, field, index) => {
        const value = e.target.value;
        setAccreditationDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value
            };
            return updatedDetails;
        });
    };
    // const handleCitySelection = (e) => {
    //     const value = e.target.value;
    //     if (value) {
    //         try {
    //             const citySelected = JSON.parse(value);
    //             setSelectedCity(citySelected);
    //         } catch (error) {
    //             console.error('Invalid JSON:', value);
    //         }
    //     }
    // };
    const handleAccreditationChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setAccreditationDetails((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    url: url?.url?.split('?')[0],
                    fileName: selectedFile.name,
                };
                return updatedDetails;
            });
        } catch (error) {
        }
    };
    const handleAddMedical = () => {
        const isIncomplete = medicalDetails.some(
            (medical) =>
                !medical.name || !medical.number || !medical.url
        );
        if (isIncomplete) {
            // Show a toast message if any field is incomplete
            ToastHandle('Please fill all the fields before adding a new one', 'danger');
            return;
        }
        setMedicalDetails([
            ...medicalDetails,
            { name: '', number: '', url: null }
        ]);
    };

    const handleMedicalInputChange = (e, field, index) => {
        const value = e.target.value;
        setMedicalDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value
            };
            return updatedDetails;
        });
    };
    const handleRemoveMedical = (index) => {
        setMedicalDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            return updatedDetails;
        });
    };

    const handleAddState = () => {
        setOpenSelect(true);

    };


    const handleRemoveState = (index) => {
        setStateDetails((prevDetails) => prevDetails.filter((_, i) => i !== index));
    };

    const handleStateInputChange = (e, field) => {
        const { value, checked } = e.target;

        if (field === "name") {
            setStateDetails((prevDetails) => {
                const updatedDetails = [...prevDetails];

                if (checked) {
                    if (!updatedDetails.some(item => item.name === value)) {
                        updatedDetails.push({
                            name: value,
                            number: "",
                            url: null,
                            fileName: "",
                        });
                    }
                } else {
                    const filteredDetails = updatedDetails.filter(item => item.name !== value);
                    return filteredDetails;
                }
                return updatedDetails;
            });
        }
        setOpenSelect(false);
    };





    const handleMedicalChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setMedicalDetails((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    url: url?.url?.split('?')[0],
                    fileName: selectedFile.name,

                };
                return updatedDetails;
            });
        } catch (error) {
        }
    };


    const handleStateChange = (e, index) => {
        // Handle file upload change here, based on your logic
        const updatedDetails = [...stateDetails];
        updatedDetails[index].url = URL.createObjectURL(e.target.files[0]);
        updatedDetails[index].fileName = e.target.files[0].name;
        setStateDetails(updatedDetails);
    };

    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId
    const clinic_role = JSON.parse(sessionStorage.getItem('hyper_user'))?.role

    console.log(clinic_id, 'id')
    const [formData, setFormData] = useState({
        clinicname: '',
        clinicType: '',
        email: '',
        contactPerson: '',
    });
    const formDataChange = (field, value) => {
        const updatedFormData = { ...formData, [field]: value.trim() }; // Trim the value to remove extra spaces
        setFormData(updatedFormData);

        // Check if all fields are filled
        const areAllFieldsFilled =
            updatedFormData.clinicname &&
            updatedFormData.clinicType &&
            updatedFormData.email &&
            updatedFormData.contactPerson;

        // Enable or disable the button
        setIsButtonDisabled(!areAllFieldsFilled);
    };
  
    const handleFileUpload = (index, file) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setValue(`accreditations.${index}.fileName`, file.name);
                setValue(`accreditations.${index}.fileUrl`, reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleAddAccreditation = () => {
        const isIncomplete = accreditationDetails.some(
            (data) =>
                !data.name || !data.number || !data.url
        );
        if (isIncomplete) {
            // Show a toast message if any field is incomplete
            ToastHandle('Please fill all the fields before adding a new one', 'danger');
            return;
        }
        setAccreditationDetails([
            ...accreditationDetails,
            { name: '', number: '', url: null }
        ]);
    };

    const handleRemoveAccreditation = (index) => {
        setAccreditationDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            return updatedDetails;
        });
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === "personalDetails") {
            setBtnShow(true);
        } else {
            setBtnShow(false);
        }
    };
    const [posDetails, setPosDetails] = useState([
        { name: '', email: '', role: '', contact: '', fileName: '' }
    ])
    console.log(posDetails,'pppp')
    const handleAddPOS = () => {
        const isIncomplete = posDetails.some(
            (pos) =>
                !pos.name || !pos.role || !pos.contact || !pos.email
        );

        if (isIncomplete) {
            // Show a toast message if any field is incomplete
            ToastHandle('Please fill all the fields before adding a new one', 'danger');
            return;
        }
        setPosDetails([
            ...posDetails,
            { name: '', email: '', role: '', contact: '' }
        ]);
    };
    const handleRemovePOS = (index) => {
        setPosDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            return updatedDetails;
        });
    };

    const handlePOSInputChange = (e, field, index) => {
        const value = e.target.value;
        setPosDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value
            };
            return updatedDetails;
        });
    };

    const submitData = (data) => {

        const payload = {
            parentClinic: clinic_id,
            name: data?.clinicname,
            email: data?.email,
            role: clinic_role,
            phone: data?.contactPerson,
            clinicType: data?.clinicType,
            taxIdOrEIN: data?.taxId,
            npiNumber: data?.npiNumber,
            medicalLicenses: medicalDetails,
            stateOfLicensing: stateDetails,
            accreditationDetails: accreditationDetails,
            logo: logo?.url.split('?')[0],
            address: {
                address1: data?.address,
                city: '672d9989ebc7107ff1d3831a',
                state: '67299cc8d39489e58e672463',
                street: data?.street,
                zip: data?.zip,
                latitude: data?.latitude,
                longitude: data?.longitude,
            },
            pos:posDetails

        }
        console.log('Form Submitted:', payload);
        dispatch(createSubClinicAction({ key: encryptMessage(payload) }))
        if (activeTab === "departmentDetails") {
            setActiveTab('departmentDetails'); // Change to the next tab
        } else {
            // Logic for other tabs (if needed)
        }
        reset(); // Reset form after submission
    };
    return (
        <>
            <div className='pt-1 pb-2'>
                <div className="container-fluid mt-4">
                    <Card className='px-3 py-2'>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-between align-items-center">
                                <div>
                                    <ul className="nav nav-underline">
                                        <li className="nav-item">
                                            <button
                                                className={`text-black nav-link ${activeTab === "personalDetails" ? "active" : ""}`}
                                                onClick={() => handleTabChange("personalDetails")}
                                            >
                                                Practice Information
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`text-black nav-link ${activeTab === "departmentDetails" ? "active" : ""}`}
                                                onClick={() => handleTabChange("departmentDetails")}
                                            >
                                                Billing & Subscription
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`text-black nav-link ${activeTab === "documents" ? "active" : ""}`}
                                                onClick={() => handleTabChange("documents")}
                                            >
                                                Contract
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <div className='d-flex gap-2'>
                                    {btnShow && <>
                                        <Button onClick={() => setShow(true)} disabled={isButtonDisabled}>Email to Sub Practice</Button>
                                        <Button onClick={handleNewDoctor}>Back</Button>
                                    </>}
                                </div>
                            </div>

                            {activeTab === "personalDetails" && (
                                <Form className='mt-3' onSubmit={handleSubmit(submitData)} >
                                    <Row >
                                        <Col sm={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className='mb-1'>Practice Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    {...register('clinicname', { required: 'Practice Name is required' })}
                                                    onChange={(e) => formDataChange('clinicname', e.target.value)}
                                                    value={formData.clinicname}
                                                    placeholder="Practice name"
                                                // onKeyPress={handleFirstSpace}


                                                />
                                                {errors.clinicname && <p className="text-danger">{errors.clinicname.message}</p>}

                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className='mb-1'>Practice type</Form.Label>
                                                <Form.Select {...register('clinicType', { required: 'Practice Type is required' })}
                                                    value={formData.clinicType} onChange={(e) => formDataChange('clinicType', e.target.value)}
                                                >
                                                    <option>Select Clinic type</option>
                                                    {clinectypes?.map((data) => (
                                                        <option key={data?._id} value={data?.name}>{data?.name}</option>
                                                    ))}
                                                </Form.Select>
                                                {errors.clinicType && <p className="text-danger">{errors.clinicType.message}</p>}

                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className="mb-1">Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Email"
                                                    value={formData.email}
                                                    {...register('email', {
                                                        required: 'Email is required',
                                                        pattern: {
                                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                            message: 'Please enter a valid email address'
                                                        }
                                                    })}
                                                    onChange={(e) => formDataChange('email', e.target.value)}
                                                // onKeyPress={handleFirstSpace}

                                                />
                                                {errors.email && <p className="text-danger">{errors.email.message}</p>}

                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className='mb-1'>Tax ID / EIN</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    {...register('taxId', { required: 'Tax ID is required' })}
                                                    // onKeyPress={handleFirstSpace}

                                                    placeholder="Tax ID / EIN" />
                                                {/* {errors.taxId && <p className="text-danger">{errors.taxId.message}</p>} */}

                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-2 position-relative">
                                                <Form.Label className="mb-1">Contact Person</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="+1 1234-234-234"
                                                    value={formData.contactPerson}
                                                    {...register('contactPerson', { required: 'contactPerson is required' })}
                                                    onChange={(e) => formDataChange('contactPerson', e.target.value)}
                                                    style={{ paddingLeft: '5%' }}
                                                // onKeyPress={handleFirstSpace}

                                                />
                                                {errors.contactPerson && <p className="text-danger">{errors.contactPerson.message}</p>}

                                                <img
                                                    src={us}
                                                    alt="country code flag"
                                                    style={{ top: '60%', left: '1%' }}
                                                    className="position-absolute"
                                                    width={20}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className='mb-1'>NPI Type 2 Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="NPI Type 2 Number"
                                                    // onKeyPress={handleFirstSpace}

                                                    {...register('npiNumber', { required: 'NPI Type 2 Number is required' })}
                                                />
                                                {/* {errors.npiNumber && <p className="text-danger">{errors.npiNumber.message}</p>} */}
                                            </Form.Group>
                                        </Col>
                                        {/* <Col sm={6} className="mb-2 d-flex flex-column position-relative">
                                            <Form.Label>Upload Logo</Form.Label>
                                            <div
                                                onClick={handleLogoClick}
                                                className={`custom-file-upload justify-content-between cursor-pointer ${logoName ? "" : "custom-form-fields"}`}
                                                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                            >
                                                <span>
                                                    {typeof logoName === "string" && logoName
                                                        ? logoName.split("/").pop()
                                                        : "Upload Logo"}
                                                </span>
                                                <p className="mb-0 d-flex justify-content-around">
                                                    <FiDownloadCloud />
                                                    {logoName && (
                                                        <div className="d-flex ">
                                                            {logo && (
                                                                <FiEye
                                                                    className="mr-3 ms-2 text-danger cursor-pointer"
                                                                    onClick={handleViewImage}
                                                                />
                                                            )}
                                                            <FiEdit className="cursor-pointer ms-2" onClick={handleLogoClick} />
                                                        </div>
                                                    )}
                                                </p>
                                            </div>

                                            <Form.Control
                                                type="file"
                                                className="rounded-circle"
                                                style={{ display: "none" }}
                                                ref={logoFileInputRef}
                                                accept=".png, .jpg, .jpeg, .svg"
                                                onChange={handleFileChange}
                                            />


                                        </Col> */}
                                        <Col sm={6} className="mb-2 d-flex flex-column position-relative">
                                            <Form.Label>Upload Logo</Form.Label>
                                            <div
                                                onClick={handleLogoClick}
                                                className={`custom-file-upload justify-content-between cursor-pointer ${logoName ? '' : 'custom-form-fields'
                                                    }`}
                                            >
                                                {/* {/ Ensure logoName is a string or fallback to 'Upload Logo' /} */}
                                                {typeof logoName === 'string' && logoName
                                                    ? logoName.split('/').pop()
                                                    : 'Upload Logo'}
                                                <p className="mb-0">
                                                    <FiDownloadCloud />
                                                </p>
                                            </div>
                                            <Form.Control
                                                type="file"
                                                className="rounded-circle"
                                                style={{ display: 'none' }}
                                                ref={logoFileInputRef}
                                                accept=".png, .jpg, .jpeg, .svg"
                                                onChange={handleFileChange}
                                            />
                                        </Col>
                                        <hr />
                                        <Col sm={12}>
                                            <Form.Label>
                                                Accreditation Details&nbsp;
                                                <span
                                                    onClick={handleAddAccreditation}
                                                    className='text-black fs-5 uil-plus-circle fw-bold cursor-pointer'>
                                                </span>
                                            </Form.Label>
                                        </Col>
                                        {accreditationDetails.map((accreditation, index) => (
                                            <React.Fragment key={index}>
                                                <Col sm={4}>
                                                    <Form.Control
                                                        type="text"
                                                        value={accreditation.name}
                                                        placeholder="Name"
                                                        // onKeyPress={handleFirstSpace}

                                                        onChange={(e) => handleAccreditationInputChange(e, 'name', index)}
                                                    />
                                                </Col>

                                                <Col sm={4}>
                                                    <Form.Control
                                                        type="text"
                                                        value={accreditation.number}
                                                        {...register('accDocno', {
                                                            pattern: {
                                                                value: /^[0-9]*$/,
                                                                message: 'Document no must be a number'
                                                            },
                                                        })}
                                                        placeholder="Document Number"
                                                        onChange={(e) => handleAccreditationInputChange(e, 'number', index)}
                                                    // onKeyPress={(event) => handleFirstSpace(event, 0)}
                                                    />
                                                    {errors.accDocno && <span className="text-danger">{errors.accDocno.message}</span>}
                                                </Col>
                                                <Col sm={4} className="mb-2 position-relative">
                                                    <div
                                                        onClick={() => accreditationFileInputRef.current.click()}
                                                        className="custom-file-upload justify-content-between cursor-pointer"
                                                    >
                                                        {accreditation.loading ? 'Loading...'
                                                            : accreditation.url
                                                                ? accreditation.url.split('/').pop()
                                                                : accreditation?.fileName || 'Upload Document'}
                                                        <p className="mb-0"><FiDownloadCloud /></p>
                                                    </div>

                                                    <Form.Control
                                                        type="file"
                                                        className="rounded-circle"
                                                        style={{ display: 'none' }}
                                                        ref={accreditationFileInputRef}
                                                        onChange={(e) => handleAccreditationChange(e, index)}
                                                    />
                                                    <span
                                                        onClick={() => handleRemoveAccreditation(index)}
                                                        style={{ right: '-2%', top: '20%' }}
                                                        className={`${accreditationDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}
                                                    >
                                                    </span>
                                                </Col>
                                            </React.Fragment>
                                        ))}
                                        <hr />
                                        <Col sm={12}>
                                            <Form.Label>
                                                Medical Licenses&nbsp;
                                                <span
                                                    onClick={handleAddMedical}
                                                    className='plusicon fs-5 uil-plus-circle fw-bold cursor-pointer'>
                                                </span>
                                            </Form.Label>
                                        </Col>
                                        {medicalDetails.map((medical, index) => (
                                            <React.Fragment key={index}>
                                                <Col sm={4}>
                                                    <Form.Control
                                                        type="text"
                                                        value={medical.name}
                                                        placeholder="Name"
                                                        // onKeyPress={handleFirstSpace}

                                                        onChange={(e) => handleMedicalInputChange(e, 'name', index)}
                                                    />
                                                </Col>
                                                <Col sm={4}>
                                                    <Form.Control
                                                        type="text"
                                                        value={medical.number}
                                                        placeholder="Document Number"
                                                        {...register('medDocno', {
                                                            pattern: {
                                                                value: /^[0-9]*$/,
                                                                message: 'Document no must be a number'
                                                            },
                                                        })}
                                                        onChange={(e) => handleMedicalInputChange(e, 'number', index)}
                                                    // onKeyPress={(event) => handleFirstSpace(event, 0)}
                                                    />
                                                    {errors.medDocno && <span className="text-danger">{errors.medDocno.message}</span>}
                                                </Col>
                                                <Col sm={4} className="mb-2 position-relative">
                                                    <div
                                                        onClick={() => medicalFileInputRef.current.click()}
                                                        className="custom-file-upload justify-content-between cursor-pointer"
                                                    >
                                                        {medical.url
                                                            ? medical.url.split('/').pop()
                                                            : medical?.fileName || 'Upload Document'}
                                                        <p className="mb-0"><FiDownloadCloud /></p>
                                                    </div>

                                                    <Form.Control
                                                        type="file"
                                                        className="rounded-circle"
                                                        style={{ display: 'none' }}
                                                        ref={medicalFileInputRef}
                                                        onChange={(e) => handleMedicalChange(e, index)}
                                                    />

                                                    <span
                                                        onClick={() => handleRemoveMedical(index)}
                                                        style={{ right: '-2%', top: '20%' }}
                                                        className={`${medicalDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}
                                                    >
                                                    </span>
                                                </Col>
                                            </React.Fragment>
                                        ))}
                                        <hr />
                                        {/* <Col sm={12}>
                                            <Form.Label>
                                                State of Licensing&nbsp;
                                                <span
                                                    onClick={handleAddState}
                                                    className="text-black fs-5 uil-plus-circle fw-bold cursor-pointer"
                                                ></span>
                                            </Form.Label>
                                        </Col>

                                        {stateDetails && stateDetails?.map((data, index) => (
                                            <React.Fragment key={index}>
                                                {!openSelect && (
                                                    <Col sm={4}>
                                                        <Form.Control
                                                            type="text"
                                                            value={data.name}
                                                            placeholder="Name"

                                                        />
                                                    </Col>
                                                )}
                                                {openSelect && (
                                                    <Col sm={4}>
                                                        <div
                                                            style={{
                                                                maxHeight: "100px",
                                                                overflowY: "auto",
                                                                border: "1px solid #ccc",
                                                                padding: "10px",
                                                            }}
                                                        >
                                                            {statesData?.states?.map((state) => (
                                                                <Form.Check
                                                                    key={state?._id}
                                                                    type="checkbox"
                                                                    label={state?.name}
                                                                    value={state?.name}
                                                                    checked={stateDetails.some((item) => item.name === state.name)}
                                                                    onChange={(e) => handleStateInputChange(e, "name")}
                                                                />
                                                            ))}
                                                        </div>
                                                    </Col>
                                                )}

                                                <Col sm={4}>
                                                    <Form.Control
                                                        type="text"
                                                        value={data.number}
                                                        placeholder="Document Number"
                                                        {...register('stateDocno', {
                                                            pattern: {
                                                                value: /^[0-9]*$/,
                                                                message: 'Document no must be a number'
                                                            },
                                                        })}
                                                        onChange={(e) => handleStateInputChange(e, 'number', index)}
                                                    />
                                                    {errors.stateDocno && <span className="text-danger">{errors.stateDocno.message}</span>}
                                                </Col>

                                                <Col sm={4} className="mb-2 position-relative">
                                                    <div
                                                        onClick={() => document.getElementById(`state-file-input-${index}`).click()}
                                                        className="custom-file-upload justify-content-between cursor-pointer"
                                                    >
                                                        {data.url
                                                            ? data.url.split('/').pop()
                                                            : data?.fileName || 'Upload Document'}
                                                        <p className="mb-0"><FiDownloadCloud /></p>
                                                    </div>

                                                    <Form.Control
                                                        id={`state-file-input-${index}`}
                                                        type="file"
                                                        className="rounded-circle"
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => handleStateChange(e, index)}
                                                    />

                                                    <span
                                                        onClick={() => handleRemoveState(index)}
                                                        style={{ right: '-2%', top: '20%' }}
                                                        className={`${stateDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}
                                                    ></span>
                                                </Col>
                                            </React.Fragment>
                                        ))} */}



                                        <hr />
                                        <Col sm={12}>
                                            <Row>
                                                <Col sm={12} className="mb-2">
                                                    <span className="text-black fw-semibold form-label">Address Details</span>
                                                </Col>

                                                <Col sm={6}>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label className="mb-1">Address</Form.Label>
                                                        <div style={{ position: 'relative' }}>
                                                            <Form.Control
                                                                type="text"
                                                                {...register('address')}
                                                                onChange={getGeolocation}
                                                                onFocus={() => setFocused(true)}
                                                                placeholder="Search for address"
                                                                autoComplete="off"
                                                            // onKeyPress={handleFirstSpace}

                                                            />
                                                            {focused && searchedLocations.length > 0 && (
                                                                <div
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '100%',
                                                                        left: 0,
                                                                        width: '100%',
                                                                        maxHeight: '150px',
                                                                        overflowY: 'auto',
                                                                        backgroundColor: '#fff',
                                                                        border: '1px solid #ced4da',
                                                                        zIndex: 1111,
                                                                    }}
                                                                >
                                                                    {searchedLocations.map((location, index) => (
                                                                        <p
                                                                            key={index}
                                                                            style={{
                                                                                margin: 0,
                                                                                padding: '8px 12px',
                                                                                cursor: 'pointer',
                                                                            }}
                                                                            onClick={() => handleAddressSelection(location)}
                                                                        >
                                                                            {location.formatted}
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Form.Group>
                                                </Col>

                                                <Col sm={6}>
                                                    <Row>
                                                        <Col sm={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label>State</Form.Label>
                                                                <Form.Select
                                                                    {...register('stateName')}
                                                                    value={stateToSelect}
                                                                    onChange={handleStateSelection}
                                                                >
                                                                    <option value="">Select State</option>
                                                                    {statesData?.states?.map((data) => (
                                                                        <option key={data?.state_code} value={data?.state_code}>
                                                                            {data?.name}
                                                                        </option>
                                                                    ))}
                                                                </Form.Select>
                                                            </Form.Group>
                                                        </Col>

                                                        <Col sm={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label>City</Form.Label>
                                                                <Form.Select
                                                                    {...register('city')}
                                                                    value={selectedCity}
                                                                    onChange={handleCitySelection}
                                                                >
                                                                    <option value="">Select City</option>
                                                                    {citiesData?.map((data) => (
                                                                        <option
                                                                            key={data?._id}
                                                                            value={JSON.stringify({
                                                                                _id: data?._id,
                                                                                name: data?.name,
                                                                                latitude: data?.latitude,
                                                                                longitude: data?.longitude,
                                                                            })}
                                                                        >
                                                                            {data?.name}
                                                                        </option>
                                                                    ))}
                                                                </Form.Select>
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Col>

                                                <Col sm={6}>
                                                    <Row>
                                                        <Col sm={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label className="mb-1">Latitude</Form.Label>
                                                                <Form.Control type="text" value={latitude} placeholder="Latitude"
                                                                //  onKeyPress={handleFirstSpace}
                                                                />
                                                            </Form.Group>
                                                        </Col>

                                                        <Col sm={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label className="mb-1">Longitude</Form.Label>
                                                                <Form.Control type="text" value={longitude} placeholder="Longitude"
                                                                //  onKeyPress={handleFirstSpace}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Col>

                                                <Col sm={6}>
                                                    <Row>
                                                        <Col sm={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label className="mb-1">Zip</Form.Label>
                                                                <Form.Control type="text" {...register('zip')} placeholder="Zip"
                                                                // onKeyPress={handleFirstSpace}

                                                                />
                                                            </Form.Group>
                                                        </Col>

                                                        <Col sm={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label>Street</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    {...register('street')}
                                                                    value={street}
                                                                    onChange={(e) => setStreet(e.target.value)}
                                                                    placeholder="Street"
                                                                // onKeyPress={handleFirstSpace}

                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>


                                        <hr />
                                        <Col sm={12}>
                                            <Row>
                                                <Col sm={12} className="mb-2">
                                                    <span className="text-black fw-semibold form-label">
                                                        Primary contact
                                                        <span
                                                            onClick={handleAddPOS}
                                                            className="plusicon ms-1 fs-5 uil-plus-circle fw-bold cursor-pointer">
                                                        </span>
                                                    </span>
                                                </Col>
                                                {posDetails?.map((data, index) => (
                                                    <React.Fragment key={index}>
                                                        <Col sm={12} className='form-label'>
                                                            {'POS ' + `${index + 1}`}
                                                            <span
                                                                onClick={() => handleRemovePOS(index)}
                                                                className={`${posDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer  fs-5 fw-bold text-danger`}>
                                                            </span>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label className="mb-1">Full Name</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={data.name}
                                                                    onChange={(e) => handlePOSInputChange(e, 'name', index)}
                                                                    // onKeyPress={handleFirstSpace}
                                                                    placeholder="Full Name"
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label className="mb-1">Contact Email</Form.Label>
                                                                <Form.Control
                                                                    type="email"
                                                                    value={data.email}
                                                                    {...register('contactemail', {
                                                                        pattern: {
                                                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
                                                                            message: 'Please enter a valid email address'
                                                                        }
                                                                    })}
                                                                    onChange={(e) => handlePOSInputChange(e, 'email', index)}
                                                                    placeholder="Contact Email"
                                                                />
                                                                {errors.contactemail && <span className="text-danger">{errors.contactemail.message}</span>}
                                                            </Form.Group>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label className="mb-1">Job Title / Role</Form.Label>
                                                                <Form.Control
                                                                    type='text'
                                                                    value={data?.role}
                                                                    placeholder='Job Title / Role'
                                                                    // onKeyPress={handleFirstSpace}
                                                                    onChange={(e) => handlePOSInputChange(e, 'role', index)}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Form.Group className="mb-2 position-relative">
                                                                <Form.Label className="mb-1">Contact Person</Form.Label>
                                                                <InputGroup>
                                                                    <InputGroup.Text className="ps-3 pe-1 fw-bold text-black">&nbsp;&nbsp;+1</InputGroup.Text>
                                                                    <Form.Control
                                                                        type="tel"
                                                                        value={data.contact}
                                                                        onChange={(e) => handlePOSInputChange(e, 'contact', index)} // Retain original functionality
                                                                        placeholder="1234-234-234"
                                                                        maxLength={10}
                                                                        isInvalid={errors?.contact}
                                                                    />
                                                                </InputGroup>
                                                                {errors?.contact && <span className="text-danger">{errors.contact.message}</span>}
                                                                <img
                                                                    src={us}
                                                                    alt="country code flag"
                                                                    style={{ top: '60%', left: '1%' }}
                                                                    className="position-absolute"
                                                                    width={20}
                                                                />
                                                            </Form.Group>

                                                        </Col>
                                                    </React.Fragment>
                                                ))}
                                            </Row>
                                        </Col>
                                        <hr />
                                        <Col md={12} className='mt-2 d-flex gap-2 justify-content-end'>
                                            <Button variant="primary" className='custom-buttons' onClick={() => setPassShow(true)} >
                                                Reset Password
                                            </Button>

                                            <Button
                                                variant="primary"
                                                type="submit"
                                                className='custom-buttons'
                                                disabled={createLoading}  // Disable button when loading
                                            >
                                                {createLoading ? (
                                                    <Spinner animation="border" size="sm" />  // Show spinner when loading
                                                ) : (
                                                    'Next'
                                                )}
                                            </Button>
                                        </Col>

                                    </Row >
                                </Form >
                            )}
                            {activeTab === "departmentDetails" && <DepartmentDetails />}
                            {activeTab === "documents" && <Documents />}
                        </div>
                    </Card>
                </div>
                <EmailToDoctorModal closeModal={closeModal} show={show} formData={formData} />
                <ResetPassword closeModal={closepassModal} show={passShow} />
            </div>
        </>
    );
};

export default NewPractice;
