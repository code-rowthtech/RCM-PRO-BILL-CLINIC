import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Form, InputGroup, Modal, Row, Spinner } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiDownloadCloud, FiEdit, FiEye, FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
// import EmailToSubClinicModal from './EmailToSubClinicModal';
import { handleUpload } from '../../../helpers/HandleUpload';
import { encryptMessage } from '../../../cryptoUtils';
import us from '../../../assets/images/flags/us.jpg'
import { createSubClinicAction, getSubClinicCitiesAction, getSubClinicTypeAction, updateSubClinicAction } from '../../../redux/sub clinic/actions';
// import ResetPassword from './ResetPassword';
import { getCities2Action, getCitiesAction, getClinicAction, getClinicTypeAction, getDoctorsrolesAction, getRoleDataAction, getStatesByCountryAction } from '../../../redux/actions';
import ToastHandle from '../../../helpers/ToastMessage';
import { handleFirstSpace } from '../../../helpers/noSpace';
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from 'react-icons/md';
import { stateEmptydAction } from '../../../redux/clinics/actions';
const NewPractice = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [isModalRequest, setIsModalRequest] = useState(false);
    // const idUpdateDataSubClinics = searchParams.get('id');
    // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("personalDetails");
    const [show, setShow] = useState(false);
    const [passShow, setPassShow] = useState(false);
    const logoFileInputRef = useRef(null);
    const [logo, setLogo] = useState(null);
    const [logoName, setLogoName] = useState('');
    // const [smShow, setSmShow] = useState(false);
    const [btnShow, setBtnShow] = useState(true);
    const [showModalPic, setShowModalPic] = useState(false); // State to control modal visibility

    const [modalFileUrl, setModalFileUrl] = useState(""); // State to store file URL for modal

    const handleShowModal = (url) => {
        setModalFileUrl(url); // Set the URL of the file to display in modal
        setShowModalPic(true);   // Open the modal
    };

    const handleCloseModal = () => {
        setShowModalPic(false); // Close the modal
        setModalFileUrl(""); // Reset file URL
    };
    // const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const handleLogoClick = () => {
        logoFileInputRef.current.click();
    };

    const [logoUploading, setLogoUploading] = useState(false);
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setLogoUploading);
            setLogo(url);
            setLogoName(selectedFile?.name)
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };
    const [accreditationDetails, setAccreditationDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [stateDetails, setStateDetails] = useState([
        { name: '', number: "", url: null, fileName: "" }
    ]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accreditationFileInputRef = useRef([]);
    const [taxonomyCodes, setTaxonomyCodes] = useState([''])
    const [usePrimaryAsMailing, setUsePrimaryAsMailing] = useState(false);
    const store = useSelector((state) => state)
    const clinectypes = store?.getClinicTypeReducer?.data?.result
    const statesData = store?.getStatesReducer?.data;
    const citiesData = [store?.getSubClinicCityReducer];
    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId
    const clinic_MainId = JSON.parse(sessionStorage.getItem('hyper_user'))
    const clinicsDataGet = store?.getClinicsReducer?.data?.clinic;
    const cities = store?.getCitiesReducer?.cities1?.data?.cities;
    const cities2 = store?.getCitiesReducer?.cities2?.data?.cities;
    const statecode = statesData?.states?.state_code
    const createLoading = store?.createSubClinicsReducer?.loading;
    const createResponseOfSubClinics = store?.createSubClinicsReducer?.data?.status;
    const updateLoading = store?.updateSubClinicReducer?.loading;
    const [searchedLocations, setSearchedLocations] = useState([]);
    const [searchedLocations2, setSearchedLocations2] = useState(null)
    const [focused, setFocused] = useState(false);
    const [focused2, setFocused2] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [latitude1, setLatitude1] = useState(null);
    const [longitude, setLongitude] = useState('');
    const [longitude1, setLongitude1] = useState(null);
    const [stateToSelect, setStateToSelect] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    useEffect(() => {
        dispatch(getStatesByCountryAction());
    }, [dispatch]);

    useEffect(() => {
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
    const getGeolocation2 = (e) => {
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
                    setSearchedLocations2(data?.results)
                } else {
                    console.log("No data returned.");
                }
            });
    }
    useEffect(() => {
        if (stateToSelect) {
            dispatch(getCitiesAction({ state_code: stateToSelect, name: '', limit: 25, skip: '' }));
        }
    }, [stateToSelect]);


    const handleStateSelection = (e) => {
        const stateCode = e.target.value;
        if (stateCode) {
            setStateToSelect(stateCode);
            dispatch(getCitiesAction({ state_code: stateCode, name: '', limit: 25, skip: '' }));
        }
    };

    const handleCitySelection = (e) => {
        const city = e.target.value;
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
        clearErrors,
        setValue,
        getValues,
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
        setValue('')
    };
    const closepassModal = () => {
        setPassShow(false);
    }
    useEffect(() => {
        dispatch(getClinicTypeAction())
    }, [dispatch])
    useEffect(() => {
        dispatch(getClinicAction({ key: encryptMessage({ userId: clinic_MainId?._id }) }));
    }, [dispatch])
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
    const [newaccreditationLogo, setNewAccreditationLogo] = useState(false);
    const handleAccreditationChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setNewAccreditationLogo);
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
    const [formData, setFormData] = useState({
        clinicname: '',
        clinicType: '',
        email: '',
        contactPerson: '',
    });
    const setField = (key, value) => value && setValue(key, value);
    useEffect(() => {
        if (clinicsDataGet) {
            setFormData(clinicsDataGet);
            setValue('clinicname', clinicsDataGet?.name);
            setValue('clinicType', clinicsDataGet?.clinicType);
            setValue('email', clinicsDataGet?.userId?.email);
            setValue('taxId', clinicsDataGet?.taxIdOrEIN);
            setValue('practiceSpecialty', clinicsDataGet?.practiceSpecialty);
            // setValue('contactPerson', clinicsDataGet?.userId?.phone?.startsWith("+1")
            //     ? clinicsDataGet.userId.phone.substring(2)
            //     : clinicsDataGet?.userId?.phone);
                setValue('contactPerson', clinicsDataGet?.userId?.phone ? clinicsDataGet?.userId?.phone
                            .replace(/\+1/, '') // Remove all non-numeric characters
                            .replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) =>
                                p3 ? `(${p1})${p2}-${p3}` : `(${p1})${p2}` // Format dynamically as (XXX)XXX-XXXX
                            )
                            : '')
            setValue('npiNumber', clinicsDataGet?.npiNumber);
            setLogo(clinicsDataGet?.logo?.url);
            setValue('medicare', clinicsDataGet?.medicareNumber);
            setValue('medicaid', clinicsDataGet?.medicaidNumber);
            setValue('clia', clinicsDataGet?.CLIA_Number);
            setValue('address', clinicsDataGet?.userId?.primaryAddress?.address);
            setValue('street', clinicsDataGet?.userId?.primaryAddress?.street);
            setValue('zip', clinicsDataGet?.userId?.primaryAddress?.zip);
            setLatitude(clinicsDataGet?.userId?.primaryAddress?.latitude)
            setLongitude(clinicsDataGet?.userId?.primaryAddress?.longitude)
            setUsePrimaryAsMailing(clinicsDataGet?.userId?.isPrimaryAndMailingAddressSame)
            setValue('stateName', clinicsDataGet?.userId?.primaryAddress?.state?._id)
            if (clinicsDataGet?.userId?.primaryAddress?.city) {
                dispatch(getCitiesAction({ state_code: clinicsDataGet?.userId?.primaryAddress?.state?.id, name: clinicsDataGet?.userId?.primaryAddress?.city?.name, limit: '', skip: '' }))
            }
            setValue('mailingAddress', clinicsDataGet?.userId?.mailingAddress?.address);
            setValue('mailingStreet', clinicsDataGet?.userId?.mailingAddress?.street);
            setValue('mailingZip', clinicsDataGet?.userId?.mailingAddress?.zip);
            setLatitude1(clinicsDataGet?.userId?.mailingAddress?.latitude)
            setLongitude1(clinicsDataGet?.userId?.mailingAddress?.longitude)
            setValue('mailingStateName', clinicsDataGet?.userId?.mailingAddress?.state?._id)
            if (clinicsDataGet?.userId?.mailingAddress?.city) {
                dispatch(getCities2Action({ state_code: clinicsDataGet?.userId?.mailingAddress?.state?.id, name: clinicsDataGet?.userId?.mailingAddress?.city?.name, limit: '', skip: '' }))
            }
            if (clinicsDataGet?.accreditationDetails) {
                setAccreditationDetails(clinicsDataGet?.accreditationDetails)
            }
            if (clinicsDataGet?.taxonomyCodes?.length === 0) {
                setTaxonomyCodes([''])
            } else {
                setTaxonomyCodes(clinicsDataGet?.taxonomyCodes);
                clinicsDataGet?.taxonomyCodes?.forEach((code, index) => {
                    setValue(`taxonomyCode[${index}]`, code);
                });
            }
            if (clinicsDataGet?.pos) {
                setPosDetails(clinicsDataGet?.pos)
            }
            if (clinicsDataGet?.logo) {
                setLogoName(clinicsDataGet?.logo?.fileName)
            }
            if (clinicsDataGet?.stateOfLicensing) {
                setStateDetails(clinicsDataGet?.stateOfLicensing)
            }
        }
    }, [clinicsDataGet, statesData, setValue]);

    const formDataChange = (field, value) => {
        const updatedFormData = { ...formData, [field]: value };
        setFormData(updatedFormData);

        const areAllFieldsFilled =
            updatedFormData.clinicname &&
            updatedFormData.clinicType &&
            updatedFormData.email &&
            updatedFormData.contactPerson;

        // setIsButtonDisabled(!areAllFieldsFilled);
    };
    const handleAddAccreditation = () => {
        const isIncomplete = accreditationDetails.some(
            (clinicsDataGet) =>
                !clinicsDataGet.name || !clinicsDataGet.number || !clinicsDataGet.url
        );
        if (isIncomplete) {
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

    const handleAddTaxonomy = () => {
        const lastCode = taxonomyCodes[taxonomyCodes.length - 1];

        if (lastCode) {
            const validCodes = taxonomyCodes.filter((code) => code.trim() !== '');
            setTaxonomyCodes([...validCodes, '']);
        } else {
            ToastHandle('Please complete the current Taxonomy Code field before adding another.', 'danger')
        }
    };
    const handleRemoveTaxonomy = (index) => {
        setTaxonomyCodes((prev) => {
            const updatedCodes = prev.filter((_, i) => i !== index);
            return updatedCodes.length > 0 ? updatedCodes : [''];
        });

    };
    const handleTaxonomyChange = (index, value) => {
        const updatedCodes = [...taxonomyCodes];
        updatedCodes[index] = value;
        setTaxonomyCodes(updatedCodes);
    };
    const [posDetails, setPosDetails] = useState([
        { name: '', email: '', role: '', contact: '', fileName: '' }
    ])

    const handleAddPOS = () => {
        const isIncomplete = posDetails.some(
            (pos) =>
                !pos.name || !pos.role || !pos.contact || !pos.email
        );

        if (isIncomplete) {
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
    const getRoleId = store?.getRoleDataReducer?.data?.roles?.[0]?._id;
    useEffect(() => {
        dispatch(getRoleDataAction({ clinicId: clinic_id, createdById: '', limit: 10, search: '', page: 1, status: true }));
    }, [dispatch]);



    const submitSubData = (formData) => {
        const payload = {
            name: formData?.clinicname,
            email: formData?.email,
            role: getRoleId,
            phone: '+1' + formData?.contactPerson?.replace(/\D/g, ''),
            practiceSpecialty: formData?.practiceSpecialty,
            clinicType: formData?.clinicType,
            taxIdOrEIN: formData?.taxId,
            npiNumber: formData?.npiNumber,
            CLIA_Number: formData?.clia,
            medicareNumber: formData?.medicare,
            medicaidNumber: formData?.medicaid,
            taxonomyCodes: taxonomyCodes.filter(code => code),
            // medicalLicenses: medicalDetails,
            isPrimaryAndMailingAddressSame: usePrimaryAsMailing,
            flag: 'subClinic',
            ...stateDetails && { stateOfLicensing: stateDetails },
            ...accreditationDetails && { accreditationDetails: accreditationDetails },
            ...(logo ?
                {
                    logo: {
                        url: logo?.url?.split('?')[0],
                        fileName: logoName,
                    }
                }
                : ''),
            primaryAddress: {
                ...(formData?.address ? { address: formData?.address } : ''),
                ...(formData?.city ? { city: formData?.city } : ''),
                ...(formData?.stateName ? { state: formData?.stateName } : ''),
                street: formData?.street,
                zip: formData?.zip,
                ...(latitude ? { latitude: latitude, } : ''),
                ...(longitude ? { longitude: longitude, } : '')
            },
            mailingAddress:
                usePrimaryAsMailing ?
                    {
                        ...(formData?.address ? { address: formData?.address } : ''),
                        ...(formData?.city ? { city: formData?.city } : ''),
                        ...(formData?.stateName ? { state: formData?.stateName } : ''),
                        // state: stateToSelect?._id,
                        street: formData?.street,
                        zip: formData?.zip,
                        ...(latitude ? { latitude: latitude, } : ''),
                        ...(longitude ? { longitude: longitude, } : '')
                    }
                    :
                    {
                        ...(formData?.mailingAddress ? { address: formData?.mailingAddress } : ''),
                        ...(formData?.mailingCity ? { city: formData?.mailingCity } : ''),
                        ...(formData?.mailingStateName ? { state: formData?.mailingStateName } : ''),
                        street: formData?.mailingStreet,
                        zip: formData?.mailingZip,
                        ...(latitude1 ? { latitude: latitude1, } : ''),
                        ...(longitude1 ? { longitude: longitude1, } : '')
                    },
            ...posDetails && { pos: posDetails },
        }
        dispatch(createSubClinicAction({ key: encryptMessage(payload) }))
    };
    useEffect(() => {
        if (createResponseOfSubClinics === 200) {
            if (!isModalRequest) {
                navigate('/apps/crm/addclinic');
                dispatch(stateEmptydAction());
            }
        } else if (createResponseOfSubClinics === 400) {
            console.error('Error creating/updating the sub-clinic');
        }
    }, [createResponseOfSubClinics]);

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedLocation2, setSelectedLocation2] = useState(null);

    useEffect(() => {
        if (selectedLocation) {
            setLatitude(selectedLocation?.bounds?.southwest?.lat);
            setLongitude(selectedLocation?.bounds?.southwest?.lng);
            setValue('address', selectedLocation?.formatted)
            const stateId = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?.id;
            const selectedState = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?._id;
            setValue('stateName', selectedState)
            const countyName = selectedLocation?.components?.county;
            dispatch(getCitiesAction({ state_code: stateId, name: countyName, limit: '', skip: '' }))
        }
        if (selectedLocation2) {
            setLatitude1(selectedLocation2?.bounds?.southwest?.lat);
            setLongitude1(selectedLocation2?.bounds?.southwest?.lng);
            setValue('mailingAddress', selectedLocation2?.formatted)
            const stateId = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedLocation2?.components?.state_code)?.id;
            const selectedState = statesData?.states && statesData?.states.find((data) => data?.state_code === selectedLocation2?.components?.state_code)?._id;
            setValue('mailingStateName', selectedState)
            const countyName = selectedLocation2?.components?.county;
            dispatch(getCities2Action({ state_code: stateId, name: countyName, limit: '', skip: '' }))
        }
    }, [dispatch, selectedLocation, selectedLocation2, setValue, statesData])
    useEffect(() => {
        if (cities) {
            const selectedCounty = cities && cities.find((event) => event?.name === selectedLocation?.components?.county || clinicsDataGet?.userId?.primaryAddress?.city?.name)?._id;
            setValue('city', selectedCounty)
        }
        if (cities2) {
            const selectedCounty1 = cities2 && cities2.find((event) => event?.name === selectedLocation2?.components?.county || clinicsDataGet?.userId?.mailingAddress?.city?.name)?._id;
            setValue('mailingCity', selectedCounty1)
        }
    }, [cities, cities2, setValue])
    const [selectedStates, setSelectedStates] = useState([]);
    const [statesMenu, setStatesMenu] = useState(false);
    const handleCheckboxChange = (stateName) => {
        setSelectedStates((prev) => {
            const updatedStates = prev.includes(stateName)
                ? prev.filter((name) => name !== stateName)
                : [...prev, stateName]; // Add state if checked

            setStateDetails((prevDetails) => {
                const newDetails = updatedStates.map((state) =>
                    prevDetails.find((detail) => detail.name === state) || { name: state, number: '', url: null, fileName: '' }
                );
                return newDetails;
            });

            return updatedStates;
        });
    };

    const handleStateInputChange = (e, field, index) => {
        const value = e.target.value;
        setStateDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[index] = {
                ...updatedDetails[index],
                [field]: value,
            };
            return updatedDetails;
        });
    };
    const [stateLogoUpload, setStateLogoUpload] = useState(false);

    const handleStateChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setStateLogoUpload);
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

    const handleRemoveState = (index) => {
        setStateDetails((prevDetails) => {
            const updatedDetails = prevDetails.filter((_, i) => i !== index);
            setSelectedStates(updatedDetails.map((detail) => detail.name));
            return updatedDetails;
        });
    };
    const menuRef = useRef(null);
    const containerRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setStatesMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <>
            <div className='pt-1 pb-2'>
                <div className="container-fluid mt-2">
                    <Card className='px-md-3 py-md-2'>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-between align-items-center">
                                <div>
                                    <ul className="nav nav-underline">
                                        <li className="nav-item">
                                            <button
                                                className={`text-black nav-link font_active_tabs ${activeTab === "personalDetails" ? "active" : ""}`}
                                                onClick={() => handleTabChange("personalDetails")}
                                            >
                                                Practice Sub Information
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <div className='d-flex gap-2  d-none d-md-block'>
                                    {btnShow && (
                                        <>
                                            {/* 
                                                <Button onClick={() => setShow(true)} disabled={isButtonDisabled}>
                                                    Email to Sub Practice
                                                </Button>
                                           */}
                                            <Button className='custom-buttons' as={Link} to={'/apps/crm/addclinic'}>
                                                Back
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {activeTab === "personalDetails" && (
                                <>
                                    {store?.getClinicsReducer?.loading ?
                                        <div
                                            className="d-flex justify-content-center align-items-center"
                                            style={{ height: '82vh' }}
                                        >
                                            <Spinner />
                                        </div>
                                        :
                                        <Form className='mt-1' onSubmit={handleSubmit(submitSubData)} >
                                            <Row >
                                                <Col sm={3}>
                                                    <Form.Group className="mb-1">
                                                        <Form.Label className='mb-0'>Practice Name <span className='text-danger'>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            {...register('clinicname', { required: 'Practice Name is required' })}
                                                            onChange={(e) => formDataChange('clinicname', e.target.value)}
                                                            value={formData?.clinicname}
                                                            placeholder="Practice name"
                                                        />
                                                        {errors.clinicname && <p className="text-danger">{errors.clinicname.message}</p>}

                                                    </Form.Group>
                                                </Col>
                                                <Col sm={3}>
                                                    <Form.Group className="mb-1">
                                                        <Form.Label className="mb-0">
                                                            Practice type <span className="text-danger">*</span>
                                                        </Form.Label>
                                                        <Form.Select
                                                            {...register('clinicType', { required: 'Practice Type is required' })}
                                                            onChange={(e) => formDataChange('clinicType', e.target.value)}
                                                            className='form-control'
                                                            defaultValue=""
                                                        >
                                                            <option value="">Select Clinic type</option>
                                                            {clinectypes?.map((data) => (
                                                                <option key={data?._id} value={data?.name}>
                                                                    {data?.name}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                        {errors.clinicType && (
                                                            <p className="text-danger">{errors.clinicType.message}</p>
                                                        )}
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={3}>
                                                    <Form.Group className="mb-1">
                                                        <Form.Label className="mb-0">Email <span className='text-danger'>*</span></Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            placeholder="Email"
                                                            value={formData?.email}
                                                            {...register('email', {
                                                                required: 'Email is required',
                                                                pattern: {
                                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                                    message: 'Please enter a valid email address'
                                                                }
                                                            })}
                                                            onChange={(e) => formDataChange('email', e.target.value)}
                                                        />
                                                        {errors.email && <p className="text-danger">{errors.email.message}</p>}
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={3}>
                                                    <Form.Group className="mb-1">
                                                        <Form.Label className='mb-0'>Tax ID / EIN<span className='text-danger'>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            {...register('taxId', {
                                                                required: 'Tax ID / EIN is required',
                                                                pattern: {
                                                                    value: /^\d{2}-\d{7}$/,
                                                                    message: 'Tax ID / EIN must be in the format 12-3456789',
                                                                },
                                                            })}
                                                            maxLength={10} // Includes the hyphen
                                                            placeholder="Tax ID / EIN"
                                                        />
                                                        {errors.taxId && <span className="text-danger">{errors.taxId.message}</span>}
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={6}>
                                                    <Form.Group className="mb-1 position-relative">
                                                        <Form.Label className="mb-0">Contact Person <span className='text-danger'>*</span></Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className='ps-3 pe-1 fw-bold text-black'>&nbsp;&nbsp;+1</InputGroup.Text>
                                                            <Form.Control
                                                                type="tel"
                                                                // value={formData?.contactPerson}
                                                                {...register('contactPerson', {
                                                                    required: 'This field is required',
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
                                                                }
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
                                                                    clearErrors('phone'); // Clear validation errors
                                                                }}
                                                                placeholder="(###)###-####"
                                                                maxLength={14}
                                                                onKeyPress={(event) => {
                                                                    // Only allow numeric characters (0-9)
                                                                    if (!/[0-9]/.test(event.key)) {
                                                                        event.preventDefault();
                                                                    }
                                                                }}
                                                            />
                                                        </InputGroup>
                                                        {errors.contactPerson && <span className="text-danger">{errors.contactPerson.message}</span>}
                                                        <div className="position-absolute" style={{ top: '50%', left: '1%', transform: 'translateY(-10%)' }}>
                                                            <img src={us} alt="country code flag" width={20} />
                                                        </div>
                                                    </Form.Group>
                                                </Col>

                                                <Col sm={6}>
                                                    <Form.Group className="mb-1">
                                                        <Form.Label className='mb-0'>NPI Type 2 Number <span className='text-danger'>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="NPI Type 2 Number"
                                                            maxLength={9}

                                                            {...register('npiNumber', {
                                                                minLength: {
                                                                    value: 9,
                                                                    message: 'NPI must be at least 9 characters long',
                                                                },
                                                                maxLength: {
                                                                    value: 10,
                                                                    message: 'NPI cannot exceed 10 characters',
                                                                },
                                                                pattern: {
                                                                    value: /^[0-9]+$/,
                                                                    message: 'NPI must contain numbers only',
                                                                },
                                                                required: 'NPI Type 2 Number is required'
                                                            })}
                                                        />

                                                        {errors.npiNumber && <p className="text-danger">{errors.npiNumber.message}</p>}
                                                    </Form.Group>
                                                </Col>

                                                <Col sm={6} className="mb-1 d-flex flex-column position-relative">
                                                    <Form.Label className='mb-0'>Upload Logo</Form.Label>
                                                    <div
                                                        onClick={handleLogoClick}
                                                        className={`custom-file-upload justify-content-between cursor-pointer form-control ${logoName ? '' : 'custom-form-fields'}`}
                                                    >
                                                        {/* {
                                                            logoUploading
                                                                ? 'Uploading...'
                                                                : logoName && logoName
                                                                    ? logoName?.slice(0,30) + '...'
                                                                    : 'Upload Logo'
                                                        } */}
                                                        {
                                                            logoUploading
                                                                ? 'Uploading...'
                                                                : typeof logoName === 'string' && logoName
                                                                    ? logoName.split('/').pop().slice(0, 30) + "..."
                                                                    : 'Upload Logo'
                                                        }


                                                        <div className="d-flex align-items-center gap-2">
                                                            {/* Eye Icon for Preview */}
                                                            {logo && (
                                                                <FiEye
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // Prevent file input trigger
                                                                        handleShowModal(logo); // Open modal with logo URL
                                                                    }}
                                                                    className="text-dark cursor-pointer"
                                                                    style={{ zIndex: 1 }}
                                                                />
                                                            )}

                                                            {/* Download Icon */}
                                                            <p className="mb-0">
                                                                <FiDownloadCloud />
                                                            </p>
                                                        </div>
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
                                                <Col sm={6}>
                                                    <Form.Group className="mb-1">
                                                        <Form.Label className='mb-0'>Practice Specialty Description <span className='text-danger'>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            {...register('practiceSpecialty', {
                                                                required: 'This field is required',
                                                                validate: (value) =>
                                                                    !value.startsWith(' ') || 'First character cannot be a space',
                                                            })}
                                                            placeholder="Practice Specialty Description"
                                                        />
                                                        {errors.practiceSpecialty && <span className="text-danger">{errors.practiceSpecialty.message}</span>}
                                                    </Form.Group>
                                                </Col>
                                                {/* {taxonomyCodes && taxonomyCodes.map((code, index) => (
                                                    <Col sm={3} key={index}>
                                                        <Form.Group className="mb-1">
                                                            <Form.Label className="mb-0">
                                                                Taxonomy Code(s)
                                                                {index === taxonomyCodes.length - 1 && (
                                                                    <span
                                                                        className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                                                        onClick={handleAddTaxonomy}
                                                                    >
                                                                    </span>
                                                                )}
                                                                <span className="text-danger">*</span>
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                {...register(`taxonomyCode[${index}]`, {
                                                                    required: 'This field is required',
                                                                })}
                                                                placeholder="Taxonomy Code"
                                                                maxLength={10}
                                                                onKeyUp={(event) => handleFirstSpace(event, index)}
                                                                onChange={(e) => {
                                                                    handleTaxonomyChange(index, e.target.value)
                                                                }}
                                                            />
                                                            {errors.taxonomyCode?.[index] && (
                                                                <span className="text-danger">{errors.taxonomyCode[index].message}</span>
                                                            )}
                                                        </Form.Group>
                                                    </Col>
                                                ))} */}
                                                {taxonomyCodes.map((code, index) => (
                                                    <Col sm={3} key={index}>
                                                        <Form.Group className="mb-2 position-relative" style={{ minHeight: '80px' }}>
                                                            <Form.Label className="mb-1">
                                                                Taxonomy Code(s)
                                                                {index === taxonomyCodes.length - 1 && (
                                                                    <span
                                                                        className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                                                        onClick={handleAddTaxonomy}
                                                                    >
                                                                    </span>
                                                                )}
                                                                <span className="text-danger">*</span>
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                {...register(`taxonomyCode[${index}]`, {
                                                                    required: 'This field is required'
                                                                })}
                                                                value={code}
                                                                placeholder="Taxonomy Code"
                                                                maxLength={10}
                                                                onKeyPress={(event) => handleFirstSpace(event, index)}
                                                                onChange={(e) => {
                                                                    clearErrors(`taxonomyCode[${index}]`)
                                                                    handleTaxonomyChange(index, e.target.value)
                                                                }}
                                                            />
                                                            <span
                                                                style={{
                                                                    top: '50%', right: '1%', transform: 'translateY(-25%)', zIndex: '1111',
                                                                }}
                                                                onClick={() => handleRemoveTaxonomy(index)} className={`${taxonomyCodes?.length === 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}></span>

                                                            {errors.taxonomyCode?.[index] && (
                                                                <span className="text-danger" style={{ top: '100%' }}>{errors.taxonomyCode[index].message}</span>
                                                            )}
                                                        </Form.Group>
                                                    </Col>
                                                ))}
                                                <Col sm={3}>
                                                    <Form.Group className="mb-1">
                                                        <Form.Label className='mb-0'>CLIA Number </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            {...register('clia', {
                                                                // required: 'CLIA Number is required',
                                                                minLength: {
                                                                    value: 10,
                                                                    message: 'CLIA Number must be 10 characters long',
                                                                },
                                                                maxLength: {
                                                                    value: 10,
                                                                    message: 'CLIA Number must be 10 characters long',
                                                                },
                                                                pattern: {
                                                                    value: /^[A-Z0-9]{2}D[0-9]{7}$/, // Ensures the CLIA number matches the specific format
                                                                    message: 'CLIA number must be in the format XXDXXXXXXX, where X is alphanumeric and the rest are digits',
                                                                },
                                                            })}
                                                            placeholder="CLIA Number"
                                                            maxLength={10}
                                                        />
                                                        {errors.clia && <span className="text-danger">{errors.clia.message}</span>}
                                                    </Form.Group>
                                                </Col>

                                                <Col sm={3}>
                                                    <Form.Group className="mb-1">
                                                        <Form.Label className='mb-0'>Medicare Number </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            {...register('medicare', {
                                                                // required: 'Medicare Number is required',
                                                                minLength: {
                                                                    value: 10,
                                                                    message: 'Medicare number must be at least 10 characters long',
                                                                },
                                                                maxLength: {
                                                                    value: 10,
                                                                    message: 'Medicare number cannot exceed 10 characters',
                                                                },
                                                                pattern: {
                                                                    value: /^[0-9]+$/,
                                                                    message: 'Medicare number must contain numbers only',
                                                                },
                                                            })}
                                                            placeholder="Medicare Number"
                                                            maxLength={10}
                                                        />
                                                        {errors.medicare && <span className="text-danger">{errors.medicare.message}</span>}
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={3}>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label className='mb-0'>Medicaid Number </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            {...register('medicaid', {
                                                                // required: 'Medicaid Number is required',
                                                                minLength: {
                                                                    value: 10,
                                                                    message: 'Medicaid number must be at least 10 characters long',
                                                                },
                                                                maxLength: {
                                                                    value: 10,
                                                                    message: 'Medicaid number cannot exceed 10 characters',
                                                                },
                                                                pattern: {
                                                                    value: /^[0-9]+$/,
                                                                    message: 'Medicaid number must contain numbers only',
                                                                },
                                                            })}
                                                            placeholder="Medicaid Number"
                                                            maxLength={10}
                                                        />
                                                        {errors.medicaid && <span className="text-danger">{errors.medicaid.message}</span>}
                                                    </Form.Group>
                                                </Col>

                                                <hr className='mb-1' />
                                                <Col sm={12}>
                                                    <Form.Label className='mb-0'>
                                                        Accreditation Details&nbsp;
                                                        <span
                                                            onClick={handleAddAccreditation}
                                                            className='fs-5 uil-plus-circle plusicon fw-bold cursor-pointer'>
                                                        </span>
                                                    </Form.Label>
                                                </Col>
                                                {accreditationDetails.map((accreditation, index) => (
                                                    <React.Fragment key={index}>
                                                        <Col sm={4} className='mb-md-0 mb-2'>
                                                            <Form.Control
                                                                type="text"
                                                                value={accreditation.name}
                                                                placeholder="Name"
                                                                // onKeyPress={handleFirstSpace}

                                                                onChange={(e) => handleAccreditationInputChange(e, 'name', index)}
                                                            />
                                                        </Col>

                                                        <Col sm={4} className='mb-md-0 mb-2'>
                                                            <Form.Control
                                                                type="text"
                                                                value={accreditation.number}
                                                                // {...register('accDocno', {
                                                                //     pattern: {
                                                                //         value: /^[0-9]*$/,
                                                                //         message: 'Document no must be a number'
                                                                //     },
                                                                // })}
                                                                placeholder="Document Number"
                                                                onChange={(e) => handleAccreditationInputChange(e, 'number', index)}
                                                            // onKeyPress={(event) => handleFirstSpace(event, 0)}
                                                            />
                                                            {errors.accDocno && <span className="text-danger">{errors.accDocno.message}</span>}
                                                        </Col>
                                                        <Col sm={4} className="mb-2 position-relative">
                                                            <div
                                                                onClick={() => accreditationFileInputRef.current.click()}
                                                                className="custom-file-upload justify-content-between cursor-pointer form-control"
                                                                style={{ paddingTop: '7px', paddingBottom: '7px' }}
                                                            >
                                                                <span style={{ flex: 1 }} >
                                                                    {
                                                                        newaccreditationLogo
                                                                            ? 'Uploading...'
                                                                            : accreditation.url
                                                                                ? accreditation.fileName.split('/').pop().slice(0, 30) // Truncated file name
                                                                                : accreditation?.fileName || 'Upload Document'
                                                                    }
                                                                </span>

                                                                <div className="d-flex align-items-center gap-2">
                                                                    {/* Eye Icon for Preview */}
                                                                    {accreditation.url && (
                                                                        <FiEye
                                                                            onClick={(e) => {
                                                                                e.stopPropagation(); // Prevent file input trigger
                                                                                handleShowModal(accreditation.url); // Open modal with accreditation URL
                                                                            }}
                                                                            className="text-dark cursor-pointer"
                                                                            style={{ zIndex: 1 }}
                                                                        />
                                                                    )}

                                                                    {/* Download Icon */}
                                                                    <p className="mb-0"><FiDownloadCloud /></p>
                                                                </div>
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
                                                <hr className='mb-1' />

                                                <Col sm={12} className="position-relative">
                                                    <Form.Label ref={containerRef} className='mb-0'>
                                                        State of Licensure&nbsp;
                                                        <span
                                                            onClick={() => setStatesMenu(!statesMenu)}
                                                            className={`plusicon ms-1 fs-5 uil-plus-circle fw-bold cursor-pointer`}
                                                        ></span>
                                                        <div
                                                            ref={menuRef}
                                                            className={`scroll-container ${statesMenu ? '' : 'd-none'} bg-white border border-secondary position-absolute ps-1 py-1`}
                                                            style={{ height: '14rem', width: '12em', zIndex: '111' }}
                                                        >
                                                            {statesData?.states?.map((data, index) => (
                                                                <div className='d-flex align-items-center px-1' key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }} onClick={() => handleCheckboxChange(data?.name)}
                                                                >
                                                                    {selectedStates.includes(data?.name) ?
                                                                        <MdOutlineRadioButtonChecked />
                                                                        :
                                                                        <MdOutlineRadioButtonUnchecked />
                                                                    }
                                                                    <span className='ps-1'>
                                                                        {data?.name}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Form.Label>
                                                </Col>
                                                {stateDetails.map((data, index) => (
                                                    <React.Fragment key={index}>
                                                        <Col sm={4} className='mb-md-0 mb-2'>
                                                            <Form.Control
                                                                type="text"
                                                                value={data.name}
                                                                readOnly // Display selected state name
                                                                placeholder="State"
                                                            />
                                                        </Col>
                                                        <Col sm={4} className='mb-md-0 mb-2'>
                                                            <Form.Control
                                                                type="text"
                                                                value={data.number}
                                                                placeholder="Document Number"
                                                                onChange={(e) => handleStateInputChange(e, 'number', index)}
                                                            />
                                                        </Col>
                                                        <Col sm={4} className="mb-2 position-relative">
                                                            <div
                                                                onClick={() => document.getElementById(`fileInput-state=${index}`).click()}
                                                                className={`custom-file-upload justify-content-between cursor-pointer ${data.fileName || stateLogoUpload ? 'form-control' : 'custom-form-fields'}`}
                                                                style={{ paddingTop: '7px', paddingBottom: '7px' }}
                                                            >
                                                                {stateLogoUpload
                                                                    ? 'Uploading...'
                                                                    : (data.fileName
                                                                        ? (data.fileName.length > 30
                                                                            ? data.fileName.split('/').pop().slice(0, 25) + '...' // Extract and truncate file name
                                                                            : data.fileName.split('/').pop()) // Extract full file name
                                                                        : 'Upload Document')}

                                                                <div className="d-flex align-items-center gap-2">
                                                                    {data.url && (
                                                                        <FiEye
                                                                            onClick={(e) => {
                                                                                e.stopPropagation(); // Prevent file input trigger
                                                                                handleShowModal(data.url); // Pass the URL to open the modal
                                                                            }}
                                                                            className="text-dark cursor-pointer"
                                                                            style={{ zIndex: 1 }}
                                                                        />
                                                                    )}

                                                                    {/* Download Icon */}
                                                                    <p className="mb-0">
                                                                        <FiDownloadCloud />
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Form.Control
                                                                type="file"
                                                                id={`fileInput-state=${index}`}
                                                                style={{ display: 'none' }}
                                                                onChange={(e) => handleStateChange(e, index)}
                                                            />
                                                            <span
                                                                onClick={() => handleRemoveState(index)}
                                                                className={`${stateDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}
                                                                style={{ right: '-2%', top: '20%' }}
                                                            ></span>
                                                        </Col>
                                                    </React.Fragment>
                                                ))}
                                                <hr className='mb-1' />
                                                <Col sm={12}>
                                                    <Row>
                                                        <Col sm={12} className='mb-1'>
                                                            <span className='text-black fw-semibold form-label'>Address Details </span>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Row className='position-relative'>
                                                                <Col sm={12}>
                                                                    <Form.Group className="mb-1">
                                                                        <Form.Label className="mb-0">
                                                                            Address<span className='text-danger'>*</span>
                                                                        </Form.Label>
                                                                        <div style={{ position: 'relative' }}>
                                                                            <Form.Control
                                                                                type="text"
                                                                                defaultValue={clinicsDataGet?.address?.address || ''}
                                                                                {...register('address', {
                                                                                    required: 'Address is required',
                                                                                })}
                                                                                onChange={(e) => {
                                                                                    getGeolocation(e);
                                                                                    setFocused(true); // Open dropdown on input
                                                                                }}
                                                                                onFocus={() => setFocused(true)}
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
                                                                        {errors.address && (
                                                                            <span className="text-danger">{errors.address.message}</span>
                                                                        )}
                                                                    </Form.Group>
                                                                </Col>

                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-1">
                                                                        <Form.Label className='mb-0'>
                                                                            Latitude<span className='text-danger'>*</span>
                                                                        </Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            defaultValue={latitude}
                                                                            placeholder="Latitude"
                                                                        />
                                                                        {errors.latitude && (
                                                                            <span className="text-danger">{errors.latitude.message}</span>
                                                                        )}
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-1">
                                                                        <Form.Label className='mb-0'>
                                                                            Longitude <span className='text-danger'>*</span>
                                                                        </Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            defaultValue={longitude}
                                                                            placeholder="Longitude" />
                                                                        {errors.longitude && (
                                                                            <span className="text-danger">{errors.longitude.message}</span>
                                                                        )}
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Row>
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-1">
                                                                        <Form.Label className='mb-0'>
                                                                            State <span className='text-danger'>*</span>
                                                                        </Form.Label>
                                                                        <Form.Select
                                                                        className='form-control'
                                                                            {...register('stateName', {
                                                                                required: 'State is required',
                                                                            })}
                                                                            onChange={(e) => handleStateSelection(e)}
                                                                        >
                                                                            <option value={''}>State</option>
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
                                                                        {errors.stateName && (
                                                                            <span className="text-danger">{errors.stateName.message}</span>
                                                                        )}
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-1">
                                                                        <Form.Label className='mb-0'>
                                                                            City<span className='text-danger'>*</span>
                                                                        </Form.Label>
                                                                        <Form.Select
                                                                        className='form-control'
                                                                            disabled={store?.getCitiesReducer?.loading}
                                                                            {...register('city', {
                                                                                required: 'City is required',
                                                                            })}
                                                                            onChange={(e) => handleCitySelection(e)}
                                                                        >
                                                                            <option value='' >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                                            {cities?.map((data) => (
                                                                                <option data-key={JSON.stringify({ _id: data?._id, latitude: data?.latitude, longitude: data?.longitude })} key={data?._id} value={data?._id}>
                                                                                    {data?.name}
                                                                                </option>
                                                                            ))}
                                                                        </Form.Select>
                                                                        {errors.city && (
                                                                            <span className="text-danger">{errors.city.message}</span>
                                                                        )}
                                                                    </Form.Group>
                                                                </Col>

                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-1">
                                                                        <Form.Label className='mb-0'>
                                                                            Street <span className='text-danger'>*</span>
                                                                        </Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            {...register('street', {
                                                                                required: 'Street is required',
                                                                            })}
                                                                            onKeyPress={handleFirstSpace}
                                                                            placeholder="Street" />
                                                                        {errors.street && (
                                                                            <span className="text-danger">{errors.street.message}</span>
                                                                        )}
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-2">
                                                                        <Form.Label className='mb-0'>
                                                                            Zip<span className='text-danger'>*</span>
                                                                        </Form.Label>
                                                                        <Form.Control
                                                                            defaultValue={clinicsDataGet?.address?.zip || ''}
                                                                            type="text"
                                                                            {...register('zip', {
                                                                                required: 'ZIP is required',
                                                                                minLength: {
                                                                                    value: 5,
                                                                                    message: 'ZIP code must be at least 5 characters long',
                                                                                },
                                                                                pattern: {
                                                                                    value: /^[0-9]+$/,
                                                                                    message: 'ZIP code must contain numbers only',
                                                                                },
                                                                            })}
                                                                            onKeyPress={handleFirstSpace}
                                                                            placeholder="Zip"
                                                                            maxLength={5}
                                                                        />
                                                                        {errors.zip && <span className="text-danger">{errors.zip.message}</span>}
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>

                                                <hr className='mb-1' />
                                                <Col sm={12}>
                                                    <Row>
                                                        <Col sm={12} className="mb-0">
                                                            <span className="text-black fw-semibold form-label">Mailing Address Details</span>
                                                        </Col>
                                                        <Col sm={12} className="mb-1">
                                                            <Form.Check
                                                                type="checkbox"
                                                                style={{ cursor: "pointer", color: "#6c757d" }}
                                                                label="Same as Primary Address"
                                                                // disabled={!getValues('')}
                                                                checked={usePrimaryAsMailing}
                                                                onChange={(e) => {
                                                                    const isChecked = e.target.checked;
                                                                    setUsePrimaryAsMailing(isChecked);

                                                                    if (isChecked) {
                                                                        setValue('mailingAddress', getValues('address'));
                                                                        // setValue('mailingStateName', getValues('stateName'));
                                                                        setLatitude1(latitude);
                                                                        setLongitude1(longitude);
                                                                        // setValue('mailingCity', getValues('city'));
                                                                        setValue('mailingZip', getValues('zip'));
                                                                        setValue('mailingStreet', getValues('street'));
                                                                    }
                                                                    else {
                                                                        setValue('mailingAddress', '');
                                                                        setValue('mailingStateName', '');
                                                                        setLatitude1('');
                                                                        setLongitude1('');
                                                                        setValue('mailingCity', '');
                                                                        setValue('mailingZip', '');
                                                                        setValue('mailingStreet', '');
                                                                    }
                                                                }}
                                                            />
                                                        </Col>

                                                        <Col sm={6}>
                                                            <Row className="position-relative">
                                                                <Col sm={12}>
                                                                    <Form.Group className="mb-1">
                                                                        <Form.Label className="mb-0">Mailing Address <span className='text-danger'>*</span></Form.Label>
                                                                        <div style={{ position: 'relative' }}>
                                                                            <Form.Control
                                                                                type="text"
                                                                                value={watch('mailingAddress')}
                                                                                {...register('mailingAddress', {
                                                                                    required: 'Mailing Address is required',
                                                                                })}
                                                                                onChange={(e) => {
                                                                                    if (!usePrimaryAsMailing) {
                                                                                        setValue('mailingAddress', e.target.value);
                                                                                        getGeolocation2(e);
                                                                                        setFocused2(true);
                                                                                    }
                                                                                }}
                                                                                onFocus={() => setFocused2(true)}
                                                                                onBlur={() => setTimeout(() => setFocused2(false), 200)}
                                                                                placeholder="Search for mailing address"
                                                                                autoComplete="off"
                                                                                disabled={usePrimaryAsMailing}
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
                                                                                className={`scroll-container hover-bg-change ${searchedLocations2?.length === 0 || !focused2 ? 'd-none' : ''}`}
                                                                            >
                                                                                {searchedLocations2?.map((data, index) => (
                                                                                    <p
                                                                                        key={index}
                                                                                        onClick={() => {
                                                                                            setSelectedLocation2(data);
                                                                                            setValue('mailingAddress', data?.formatted);
                                                                                            setFocused2(false);
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
                                                                                {searchedLocations2?.length === 0 && <p className="text-muted px-2 py-1">No results found</p>}

                                                                            </div>
                                                                        </div>
                                                                        {errors.mailingAddress && (
                                                                            <span className="text-danger">{errors.mailingAddress.message}</span>
                                                                        )}
                                                                    </Form.Group>
                                                                </Col>

                                                                {/* Latitude and Longitude */}
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-1">
                                                                        <Form.Label className="mb-0">
                                                                            Latitude <span className="text-danger">*</span>
                                                                        </Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            value={latitude1}
                                                                            placeholder="Latitude"
                                                                            disabled={usePrimaryAsMailing}
                                                                        />
                                                                        {!usePrimaryAsMailing && errors.latitude1 && (
                                                                            <span className="text-danger">{errors.latitude1.message}</span>
                                                                        )}
                                                                    </Form.Group>
                                                                </Col>


                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-1">
                                                                        <Form.Label className="mb-0">
                                                                            Longitude <span className="text-danger">*</span>
                                                                        </Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            value={longitude1}
                                                                            placeholder="Longitude"
                                                                            disabled={usePrimaryAsMailing}
                                                                        />
                                                                        {!usePrimaryAsMailing && errors.longitude1 && (
                                                                            <span className="text-danger">{errors.longitude1.message}</span>
                                                                        )}
                                                                    </Form.Group>
                                                                </Col>

                                                            </Row>
                                                        </Col>

                                                        <Col sm={6}>
                                                            <Row>
                                                                {/* State */}
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-1">
                                                                        <Form.Label className="mb-0" value=''>State <span className='text-danger'>*</span></Form.Label>
                                                                        {usePrimaryAsMailing ? (
                                                                            <Form.Control
                                                                                readOnly
                                                                                value={
                                                                                    statesData?.states?.find(
                                                                                        (data) => data?._id === getValues('stateName')
                                                                                    )?.name || 'N/A'
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <Form.Select
                                                                                {...register('mailingStateName', {
                                                                                    required: 'State is required',
                                                                                })}
                                                                                onChange={(e) => handleStateSelection(e)}
                                                                                disabled={usePrimaryAsMailing}
                                                                            >
                                                                                <option value={''}>State</option>
                                                                                {statesData?.states?.map((data) => (
                                                                                    <option key={data?.id} value={data?._id}>
                                                                                        {data?.name}
                                                                                    </option>
                                                                                ))}
                                                                            </Form.Select>
                                                                        )}
                                                                        {errors.mailingStateName && (
                                                                            <span className="text-danger">{errors.mailingStateName.message}</span>
                                                                        )}
                                                                    </Form.Group>
                                                                </Col>

                                                                {/* City */}
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-1">
                                                                        <Form.Label className="mb-0">
                                                                            City <span className="text-danger">*</span>
                                                                        </Form.Label>
                                                                        {usePrimaryAsMailing ? (
                                                                            <Form.Control
                                                                                readOnly
                                                                                value={
                                                                                    cities &&
                                                                                    cities?.find((data) => data?._id === getValues('city'))?.name
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <Form.Select
                                                                                disabled={store?.getCitiesReducer?.loading || usePrimaryAsMailing}
                                                                                {...register('mailingCity', {
                                                                                    required: 'City is required',
                                                                                })}
                                                                                onChange={(e) => handleCitySelection(e)}
                                                                            >
                                                                                <option value="">
                                                                                    {store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}
                                                                                </option>
                                                                                {cities2?.map((data) => (
                                                                                    <option key={data?._id} value={data?._id}>
                                                                                        {data?.name}
                                                                                    </option>
                                                                                ))}
                                                                            </Form.Select>
                                                                        )}
                                                                        {errors.mailingCity && (
                                                                            <span className="text-danger">{errors.mailingCity.message}</span>
                                                                        )}
                                                                    </Form.Group>
                                                                </Col>


                                                                {/* Street */}
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-1">
                                                                        <Form.Label className="mb-0">Street <span className='text-danger'>*</span></Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            {...register('mailingStreet', {
                                                                                required: 'Street is required',
                                                                            })}
                                                                            placeholder="Street"
                                                                            disabled={usePrimaryAsMailing}
                                                                        />
                                                                        {errors.mailingStreet && <span className="text-danger">{errors.mailingStreet.message}</span>}
                                                                    </Form.Group>
                                                                </Col>

                                                                {/* ZIP */}
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-2">
                                                                        <Form.Label className="mb-0">Zip <span className='text-danger'>*</span></Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            {...register('mailingZip', {

                                                                                minLength: { value: 5, message: 'ZIP must be 5 characters long' },
                                                                                pattern: { value: /^[0-9]+$/, message: 'ZIP must contain numbers only' },
                                                                                required: "ZIP must required"
                                                                            })}
                                                                            maxLength={5}
                                                                            placeholder="Zip"
                                                                            disabled={usePrimaryAsMailing}
                                                                        />
                                                                        {errors.mailingZip && <span className="text-danger">{errors.mailingZip.message}</span>}
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>

                                                <hr className='mb-1' />
                                                <Col sm={12}>
                                                    <Row>
                                                        <Col sm={12} className="mb-1">
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
                                                                <Col sm={12} className='form-label mb-0'>
                                                                    {'POS ' + `${index + 1}`}
                                                                    <span
                                                                        onClick={() => handleRemovePOS(index)}
                                                                        className={`${posDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer  fs-5 fw-bold text-danger`}>
                                                                    </span>
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-1">
                                                                        <Form.Label className="mb-0">Full Name  {index === 0 && <span className='text-danger'>*</span>}</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            {...register(`name.${index}`, {
                                                                                required: index === 0 && (!posDetails?.[0]?.name || posDetails[0]?.name.trim() === "") ? 'Full Name is required' : false,
                                                                            })}
                                                                            value={data.name}
                                                                            onChange={(e) => {
                                                                                handlePOSInputChange(e, 'name', index);
                                                                                setValue(`name.${index}`, e.target.value);
                                                                                clearErrors(`name.${index}`);
                                                                            }}
                                                                            onKeyPress={(event) => handleFirstSpace(event, 'name', index)}
                                                                            placeholder="Full Name"
                                                                        />
                                                                        {errors?.name?.[index] && (
                                                                            <span className="text-danger">
                                                                                {errors.name[index]?.message}
                                                                            </span>
                                                                        )}
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-1">
                                                                        <Form.Label className="mb-0">Contact Email  {index === 0 && <span className='text-danger'>*</span>}</Form.Label>
                                                                        <Form.Control
                                                                            type="email"
                                                                            value={data?.email}
                                                                            {...register(`contactemail.${index}`, {
                                                                                pattern: {
                                                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                                                    message: 'Please enter a valid email address'
                                                                                },
                                                                                required: index === 0 && (!posDetails?.[0]?.email || posDetails[0]?.email.trim() === "") ? 'Contact Email is required' : false,
                                                                            })}
                                                                            onChange={(e) => {
                                                                                clearErrors(`contactemail.${index}`);
                                                                                handlePOSInputChange(e, 'email', index)
                                                                            }
                                                                            }
                                                                            placeholder="Contact Email"
                                                                        />
                                                                        {errors?.contactemail?.[index] && (
                                                                            <span className="text-danger">
                                                                                {errors.contactemail[index]?.message}
                                                                            </span>
                                                                        )}
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-1">
                                                                        <Form.Label className="mb-0">Job Title / Role {index === 0 && <span className='text-danger'>*</span>} </Form.Label>
                                                                        <Form.Control
                                                                            type='text'
                                                                            value={data?.role}
                                                                            {...register(`role.${index}`, {
                                                                                required: index === 0 && (!posDetails?.[0]?.role || posDetails[0]?.role.trim() === "") ? 'Job Title / Role is required' : false,
                                                                                onChange: (e) => {
                                                                                    clearErrors(`role.${index}`);
                                                                                    handlePOSInputChange(e, 'role', index);
                                                                                },
                                                                            })}
                                                                            placeholder='Job Title / Role'
                                                                        />
                                                                    </Form.Group>
                                                                    {errors?.role?.[index] && (
                                                                        <span className="text-danger">
                                                                            {errors.role[index]?.message}
                                                                        </span>
                                                                    )}
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-2 position-relative" style={{ minHeight: '100px' }}>
                                                                        <Form.Label className="mb-0">Contact Person {index === 0 && <span className="text-danger">*</span>}</Form.Label>
                                                                        <InputGroup>
                                                                            <InputGroup.Text className="ps-3 pe-1 fw-bold text-black">&nbsp;&nbsp;+1</InputGroup.Text>
                                                                            <Form.Control
                                                                                type="tel"
                                                                                value={data.contact}
                                                                                {...register(`poccontact.${index}`, {
                                                                                    required: index === 0 && (!posDetails?.[0]?.contact || posDetails[0]?.contact.trim() === "") ? 'Contact is required' : false,
                                                                                    pattern: {
                                                                                        value: /^(\d{3}-\d{3}-\d{4}|\d{9,10})$/,
                                                                                        message:
                                                                                            'Contact must be in the format XXX-XXX-XXXX or contain only 9–10 digits',
                                                                                    },
                                                                                    maxLength: {
                                                                                        value: 10,
                                                                                        message: 'Contact must not exceed 10 characters',
                                                                                    },
                                                                                    minLength: {
                                                                                        value: 10,
                                                                                        message: 'Contact must not be less than 10 digits',
                                                                                    },
                                                                                    onChange: (e) => {
                                                                                        const rawValue = e.target.value.replace(/\D/g, '');
                                                                                        const formattedValue = rawValue.replace(
                                                                                            /(\d{3})(\d{3})(\d{0,4})/,
                                                                                            (match, p1, p2, p3) =>
                                                                                                p3 ? `${p1}-${p2}-${p3}` : `${p1}-${p2}`
                                                                                        );
                                                                                        handlePOSInputChange(
                                                                                            { ...e, target: { ...e.target, value: rawValue } },
                                                                                            'contact',
                                                                                            index
                                                                                        );
                                                                                        e.target.value = formattedValue;
                                                                                        clearErrors(`poccontact.${index}`);
                                                                                    },
                                                                                })}
                                                                                placeholder="123-456-7890"
                                                                                maxLength={10}
                                                                                onKeyPress={(event) => {
                                                                                    if (!/[0-9]/.test(event.key)) {
                                                                                        event.preventDefault();
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </InputGroup>
                                                                        {errors?.poccontact?.[index] && (
                                                                            <span className="text-danger">
                                                                                {errors.poccontact[index]?.message}
                                                                            </span>
                                                                        )}
                                                                        <div className="position-absolute" style={{ top: '50%', left: '1%', transform: 'translateY(-100%)' }}>
                                                                            <img src={us} alt="country code flag" width={20} />
                                                                        </div>
                                                                    </Form.Group>
                                                                </Col>
                                                            </React.Fragment>
                                                        ))}
                                                    </Row>
                                                </Col>
                                                <Col md={12} className=' d-flex gap-2 justify-content-end'>
                                                    <Button
                                                        variant="primary"
                                                        type="submit"
                                                        className="custom-buttons"
                                                        disabled={createLoading}
                                                    >
                                                        {createLoading ? (
                                                            <Spinner color="white" className="spinner-border-sm" />
                                                        ) : (
                                                            'Next'
                                                        )}
                                                    </Button>
                                                </Col>
                                            </Row >
                                        </Form >
                                    }
                                </>
                            )}
                        </div>
                    </Card>
                </div>
                {/* <EmailToSubClinicModal setIsModalRequest={setIsModalRequest} closeModal={closeModal} show={show} formData={formData} /> */}
                {/* <ResetPassword closeModal={closepassModal} show={passShow} /> */}
            </div>
            <Modal show={showModalPic} onHide={handleCloseModal} centered>

                <Modal.Body>
                    <div className='d-flex justify-content-center'>
                        <p className='fw-bold' style={{ color: '#6169D0' }}> File Preview</p>

                    </div>
                    <div style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img
                            src={modalFileUrl} // Set the source of the image
                            alt="File Preview"
                            style={{
                                maxWidth: '100%', // Ensures the image fits within the modal width
                                maxHeight: '100vh', // Prevents the image from exceeding the viewport height
                                objectFit: 'contain', // Ensures the image maintains its aspect ratio
                                display: 'block'
                            }}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default NewPractice;
