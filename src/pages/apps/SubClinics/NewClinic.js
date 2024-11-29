import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiDownloadCloud, FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import EmailToDoctorModal from './EmailToDoctorModal';
import DepartmentDetails from './ClinicDetails';
import Documents from './Documents';
import { handleUpload } from '../../../helpers/HandleUpload';
import { encryptMessage } from '../../../cryptoUtils';
import us from '../../../assets/images/flags/us.jpg'
import { createSubClinicAction, getSubClinicTypeAction } from '../../../redux/sub clinic/actions';
import ResetPassword from './ResetPassword';
import { getCitiesAction, getClinicTypeAction, getStatesByCountryAction } from '../../../redux/actions';



const NewClinic = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("personalDetails");
    const [show, setShow] = useState(false);
    const [passShow, setPassShow] = useState(false);
    const logoFileInputRef = useRef(null);
    const [logo, setLogo] = useState(null);
    const [logoName, setLogoName] = useState('');
    const [smShow, setSmShow] = useState(false);
    const [btnShow, setBtnShow] = useState(true);
    // const [focused, setFocused] = useState(false);

    const [accreditationDetails, setAccreditationDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [medicalDetails, setMedicalDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [stateDetails, setStateDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accreditationFileInputRef = useRef([]);
    const medicalFileInputRef = useRef(null);
    const stateFileInputRef = useRef(null);
    const store = useSelector((state) => state)
    const clinectypes = store?.getClinicTypeReducer?.data?.result
    const statesData = store?.getStatesReducer?.data;
    const cities = store?.getCitiesReducer?.data?.cities || [];
    console.log("Cities in Store:", cities);
        const clinicDataToUpdate = store?.getClinicByIdReducer?.data?.clinic;

    console.log(clinectypes, 'clinic')
    console.log(statesData, 'state')

    console.log(cities, 'city')
    const [updatePage, setUpdatePage] = useState(false);

    const [searchedLocations, setSearchedLocations] = useState([]);
    const [focused, setFocused] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [street, setStreet] = useState('');

    const [longitude, setLongitude] = useState('');
    const [stateToSelect, setStateToSelect] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    useEffect(() => {
        // Auto close dropdown when latitude and longitude are set
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
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          addressToSearch
        )}&key=${apiKey}&language=en&pretty=1&countrycode=us`;
    
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
          }
          const data = await response.json();
          console.log(data,'address data')
          setSearchedLocations(data.results || []);
        } catch (error) {
          console.error('Failed to fetch geocode data:', error);
        }
      };
    
      const handleAddressSelection = (location) => {
        setValue('address', location.formatted);
        setValue('zip', location.components.postcode || '');
        setValue('stateName', location.components.state || '');
        setValue('city', location.components.city || location.components.town || '');
        setValue('street', location.components.road || location.components.street || ''); // Set the street
    
        setLatitude(location.geometry.lat);
        setLongitude(location.geometry.lng);
    
        setStreet(location.components.road || location.components.street || '');
    
        const stateCode = statesData?.states?.find(
          (state) => state.name === location.components.state
        )?.state_code;

        const city = cities?.states?.find(
            (city) => city.name === location.components.city
          )?.state_code;
    
        if (stateCode) {
          setStateToSelect(stateCode);
          dispatch(getCitiesAction({ state_code: stateCode, name: '', limit: 25, skip: '' }));
        }
        if (city) {
            setSelectedCity(city);
            dispatch(getCitiesAction({ state_code: city, name: '', limit: 25, skip: '' }));
          }
        setSelectedCity(location.components.city || location.components.town || '');
        setFocused(false); // Close dropdown
      };
    

    useEffect(() => {
        if (stateToSelect) {
            dispatch(getCitiesAction({ state_code: stateToSelect?.id, name: '', limit: 25, skip: '' }));
        }
    }, [stateToSelect])

      const handleStateSelection = (e) => {
        const stateCode = e.target.value;
        if (stateCode) {
            setStateToSelect(stateCode);
            dispatch(getCitiesAction({ state_code: stateCode, name: '', limit: 25, skip: 1 }));
                    }
    };
    

    const handleCitySelection = (e) => {
        const value = e.target.value;
        if (value) {
            try {
                const citySelected = JSON.parse(value);
                setSelectedCity(citySelected);
            } catch (error) {

            }
        }
    };


    const stateGeoLocation = 'stateName';
    useEffect(() => {
        if (stateGeoLocation) {
            setStateToSelect(statesData?.states && statesData?.states.find((data) => data?.state_code === stateGeoLocation));
        }
    }, [stateGeoLocation])

    useEffect(() => {
        if (stateToSelect) {
            dispatch(getCitiesAction({ state_code: stateToSelect?.id, name: '', limit: 25, skip: '' }));
        }
    }, [stateToSelect])
    // const response = store?.getDoctorsRolesReducer?.data?.result?._id

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
    };
    const closepassModal = () => {
        setPassShow(false);
    }

    useEffect(() => {
        dispatch(getClinicTypeAction())
        dispatch(getStatesByCountryAction())

    }, [dispatch])

    const handleNewDoctor = () => {
        navigate('/apps/clinics/list');
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
        setStateDetails([
            ...stateDetails,
            { name: '', number: '', url: null }
        ]);
    };

    const handleRemoveState = (index) => {
        setStateDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            return updatedDetails;
        });
    };
    const handleStateInputChange = (e, field, index) => {
        const value = e.target.value;
        setStateDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value
            };
            return updatedDetails;
        });
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

    const handleStateChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setStateDetails((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    url: url?.url?.split('?')[0],
                    fileName: selectedFile.name,

                };
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

  
    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId
    const clinic_role = JSON.parse(sessionStorage.getItem('hyper_user'))?.role

    console.log(clinic_id, 'id')

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
            pos:
                [{
                    name: data?.fullName,
                    email: data?.contactEmail,
                    role: data?.jobTitle,
                    contact: data?.phone,
                },]

        }
        console.log('Form Submitted:', payload);
        dispatch(createSubClinicAction({ key: encryptMessage(payload) }))
        reset(); // Reset form after submission
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
                                                Clinic Information
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
                                        <Button onClick={() => setShow(true)}>Email to Sub Clinic</Button>
                                        <Button onClick={handleNewDoctor}>Back</Button>
                                    </>}
                                </div>
                            </div>

                            {activeTab === "personalDetails" && (
                                <Form className='mt-3' onSubmit={handleSubmit(submitData)} >
                                    <Row >
                                        <Col sm={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className='mb-1'>Clinic Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    {...register('clinicname', { required: 'Clinic Name is required' })}
                                                    placeholder="Clinic name" />
                                                {errors.clinicname && <p className="text-danger">{errors.clinicname.message}</p>}

                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className='mb-1'>Clinic type</Form.Label>
                                                <Form.Select {...register('clinicType', { required: 'Clinic Type is required' })}>
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
                                                <Form.Label className='mb-1'>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    {...register('email', {
                                                        required: 'Email is required',
                                                        pattern: {
                                                            value: /^\S+@\S+$/i,
                                                            message: 'Invalid email address'
                                                        }
                                                    })}
                                                    placeholder="Email" />
                                                {errors.email && <p className="text-danger">{errors.email.message}</p>}

                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className='mb-1'>Tax ID / EIN</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    // {...register('taxId', { required: 'Tax ID is required' })}
                                                    placeholder="Tax ID / EIN" />
                                                {/* {errors.taxId && <p className="text-danger">{errors.taxId.message}</p>} */}

                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-2 position-relative">
                                                <Form.Label className='mb-1'>Contact Person</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="+1 1234-234-234"
                                                    style={{ paddingLeft: '5%' }}
                                                    {...register('contactPerson', { required: 'Contact Person is required' })}
                                                />
                                                <img
                                                    src={us}
                                                    alt="country code flag"
                                                    style={{ top: '60%', left: '1%' }}
                                                    className='position-absolute'
                                                    width={20}
                                                />
                                                {errors.contactPerson && <p className="text-danger">{errors.contactPerson.message}</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label className='mb-1'>NPI Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="NPI Number"
                                                // {...register('npiNumber', { required: 'NPI Number is required' })}
                                                />
                                                {/* {errors.npiNumber && <p className="text-danger">{errors.npiNumber.message}</p>} */}
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6} className='mb-2 d-flex flex-column position-relative'>
                                            <div className="mb-3" style={{ position: "relative" }}>
                                                <label htmlFor="Phone" className="form-label">
                                                    Upload Logo*
                                                </label>
                                                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                                    <input
                                                        type="text"
                                                        className="w-100 input ps-2 py-1"
                                                        placeholder="Upload logo"
                                                        // {...register('profileImage', { required: 'Profile Image is required' })}
                                                        style={{
                                                            border: "1px solid #444141",
                                                            fontSize: "14px",
                                                            color: "#444141",
                                                            paddingTop: "10px",
                                                            paddingBottom: "10px",
                                                            paddingRight: "35px",
                                                        }}
                                                    />
                                                    <FiUploadCloud
                                                        style={{
                                                            position: "absolute",
                                                            right: "10px",
                                                            color: "#444141",
                                                            fontSize: "20px",
                                                            cursor: "pointer",
                                                        }}
                                                    />
                                                </div>
                                                {/* {errors.profileImage && <p className="text-danger">{errors.profileImage.message}</p>} */}
                                            </div>
                                        </Col>
                                        <hr />
                                        <Col sm={12}>
                                            <Form.Label>
                                                Accreditation Details&nbsp;
                                                <span
                                                    onClick={handleAddAccreditation}
                                                    className='text-black fs-5 uil-plus-circle fw-bold cursor-pointer'>
                                                    {/* <CiCirclePlus size={20} /> */}
                                                </span>
                                            </Form.Label>
                                        </Col>
                                        {accreditationDetails.map((accreditation, index) => (
                                            <React.Fragment key={index}>
                                                <Col sm={4}>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Name"
                                                        // {...register(`accreditations.${index}.name`, { required: "Name field is required" })}
                                                        onChange={(e) => handleAccreditationInputChange(e, "name", index)}
                                                    />
                                                    {/* {errors.accreditations && <span className="text-danger">{errors.accreditations.message}</span>} */}

                                                </Col>
                                                <Col sm={4}>
                                                    <Form.Control
                                                        type="text"
                                                        value={accreditation.number}
                                                        placeholder="Document Number"
                                                        // {...register(`accreditations.${index}.number`, { required: 'Name field is required' })}
                                                        onChange={(e) => handleAccreditationInputChange(e, 'number', index)}
                                                    />
                                                    {/* {errors.accreditations && <span className="text-danger">{errors.accreditations.message}</span>} */}

                                                </Col>
                                                <Col sm={4} key={index} className="mb-2 position-relative">
                                                    <div
                                                        onClick={() => accreditationFileInputRef.current[index]?.click()}
                                                        className="custom-file-upload justify-content-between cursor-pointer"
                                                    >
                                                        {watch(`accreditations.${index}.fileName`) || 'Upload Document'}
                                                        <p className="mb-0"><FiDownloadCloud /></p>
                                                    </div>
                                                    <Form.Control
                                                        type="file"
                                                        className="d-none"
                                                        ref={(el) => {
                                                            accreditationFileInputRef.current[index] = el; // Safely assign the ref
                                                        }}
                                                        onChange={(e) => handleFileUpload(index, e.target.files[0])}
                                                    />
                                                    <span onClick={() => handleRemoveAccreditation(index)}
                                                        style={{ right: '-2%', top: '20%' }}
                                                        className={`${accreditationDetails.length <= 1 ? 'd-none' : ''
                                                            } uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}>
                                                        {/* Icon */}
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
                                                    className='text-black fs-5 uil-plus-circle fw-bold cursor-pointer'>
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
                                                        onChange={(e) => handleMedicalInputChange(e, 'name', index)}
                                                    />
                                                </Col>
                                                <Col sm={4}>
                                                    <Form.Control
                                                        type="text"
                                                        value={medical.number}
                                                        placeholder="Document Number"
                                                        onChange={(e) => handleMedicalInputChange(e, 'number', index)}
                                                    />
                                                </Col>
                                                <Col sm={4} className="mb-2 position-relative">
                                                    <div onClick={() => medicalFileInputRef.current.click()}
                                                        className=' custom-file-upload justify-content-between cursor-pointer'>
                                                        {medical.fileName ? medical.fileName : 'Upload Document'}
                                                        <p className='mb-0'><FiDownloadCloud /></p>
                                                    </div>
                                                    <Form.Control
                                                        type="file"
                                                        className="rounded-circle "
                                                        style={{ display: 'none' }}
                                                        ref={medicalFileInputRef}
                                                        onChange={(e) => handleMedicalChange(e, index)}
                                                    />
                                                    <span
                                                        onClick={() => handleRemoveMedical(index)}
                                                        style={{ right: '-2%', top: '20%' }}
                                                        className={`${medicalDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}>
                                                    </span>
                                                </Col>

                                            </React.Fragment>
                                        ))}
                                        <hr />
                                        <Col sm={12}>
                                            <Form.Label>
                                                State of Licensing&nbsp;
                                                <span
                                                    onClick={handleAddState}
                                                    className='text-black fs-5 uil-plus-circle fw-bold cursor-pointer'>
                                                </span>
                                            </Form.Label>
                                        </Col>
                                        {stateDetails.map((data, index) => (
                                            <React.Fragment key={index}>
                                                <Col sm={4}>
                                                    <Form.Select
                                                        onChange={(e) => handleStateInputChange(e, 'name', index)}
                                                    >
                                                        <option>State</option>
                                                        {statesData?.states?.map((data) => (
                                                            <option
                                                                value={data?.name} key={data?._id}
                                                            >
                                                                {data?.name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Col>
                                                <Col sm={4}>
                                                    <Form.Control
                                                        type="text"
                                                        value={data.number}
                                                        placeholder="Document Number"
                                                        onChange={(e) => handleStateInputChange(e, 'number', index)}
                                                    />
                                                </Col>
                                                <Col sm={4} className="mb-2 position-relative">
                                                    <div onClick={() => stateFileInputRef.current.click()}
                                                        className=' custom-file-upload justify-content-between cursor-pointer'>
                                                        {data.fileName ? data.fileName : 'Upload Document'}
                                                        <p className='mb-0'><FiDownloadCloud /></p>
                                                    </div>
                                                    <Form.Control
                                                        type="file"
                                                        className="rounded-circle "
                                                        style={{ display: 'none' }}
                                                        ref={stateFileInputRef}
                                                        onChange={(e) => handleStateChange(e, index)}
                                                    />
                                                    <span
                                                        onClick={() => handleRemoveState(index)}
                                                        style={{ right: '-2%', top: '20%' }}
                                                        className={`${stateDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}>
                                                    </span>
                                                </Col>

                                            </React.Fragment>
                                        ))}

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
                                                                    onChange={(e) => handleStateSelection(e)}
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
                                                                    onChange={(e) => handleCitySelection(e)}
                                                                >
                                                                    <option value="">Select City</option>
                                                                    {cities?.map((data) => (
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
                                                                <Form.Control type="text" value={latitude} placeholder="Latitude"  />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label className="mb-1">Longitude</Form.Label>
                                                                <Form.Control type="text" value={longitude} placeholder="Longitude"  />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col sm={6}>
                                                    <Row>
                                                        <Col sm={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label className="mb-1">Zip</Form.Label>
                                                                <Form.Control type="text" {...register('zip')} placeholder="Zip" />
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
                                                    <span className="text-black fw-semibold">POC 1 (point of contact)*</span>
                                                </Col>

                                                <Col>
                                                    <Row>
                                                        <Col sm={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label className="mb-1">Full Name</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Full name"
                                                                    {...register('fullName', { required: 'Full Name is required' })}
                                                                />
                                                                {errors.fullName && (
                                                                    <span className="text-danger">{errors.fullName.message}</span>
                                                                )}
                                                            </Form.Group>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label className="mb-1">Contact Email</Form.Label>
                                                                <Form.Control
                                                                    type="email"
                                                                    placeholder="Contact Email"
                                                                    {...register('contactEmail', {
                                                                        required: 'Email is required',
                                                                        pattern: {
                                                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                                            message: 'Enter a valid email address',
                                                                        },
                                                                    })}
                                                                />
                                                                {errors.contactEmail && (
                                                                    <span className="text-danger">{errors.contactEmail.message}</span>
                                                                )}
                                                            </Form.Group>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label className="mb-1">Job Title/Role</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Job Title/Role"
                                                                    {...register('jobTitle', { required: 'Job Title/Role is required' })}
                                                                />
                                                                {errors.jobTitle && (
                                                                    <span className="text-danger">{errors.jobTitle.message}</span>
                                                                )}
                                                            </Form.Group>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label className="mb-1">Phone Number</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Phone Number"
                                                                    {...register('phone', {
                                                                        required: 'Phone Number is required',
                                                                        pattern: {
                                                                            value: /^[0-9]+$/,
                                                                            message: 'Enter a valid phone number',
                                                                        },
                                                                    })}
                                                                />
                                                                {errors.phone && (
                                                                    <span className="text-danger">{errors.phone.message}</span>
                                                                )}
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <hr />
                                        <Col md={12} className='mt-2 d-flex gap-2 justify-content-end'>
                                            <Button variant="primary" className='custom-buttons' onClick={() => setPassShow(true)} >
                                                Reset Password
                                            </Button>

                                            <Button variant="primary" type="submit" className='custom-buttons'>
                                                Next
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
                <EmailToDoctorModal closeModal={closeModal} show={show} />
                <ResetPassword closeModal={closepassModal} show={passShow} />
            </div>
        </>
    );
};

export default NewClinic;
