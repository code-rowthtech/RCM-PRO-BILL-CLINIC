import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
import { createSubClinicAction, getSubClinicCitiesAction, getSubClinicTypeAction, updateSubClinicAction } from '../../../redux/sub clinic/actions';
import ResetPassword from './ResetPassword';
import { getCities2Action, getCitiesAction, getClinicAction, getClinicTypeAction, getDoctorsrolesAction, getStatesByCountryAction } from '../../../redux/actions';
import ToastHandle from '../../../helpers/ToastMessage';
import { handleFirstSpace } from '../../../helpers/noSpace';
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from 'react-icons/md';
import { stateEmptydAction } from '../../../redux/clinics/actions';
const NewPractice = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [isModalRequest, setIsModalRequest] = useState(false);
    const idUpdateDataSubClinics = searchParams.get('id');
    // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("personalDetails");
    const [show, setShow] = useState(false);
    const [passShow, setPassShow] = useState(false);
    const logoFileInputRef = useRef(null);
    const [logo, setLogo] = useState(null);
    const [logoName, setLogoName] = useState('');
    // const [smShow, setSmShow] = useState(false);
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

    // const handleViewImage = () => {
    //     if (logo) {
    //         console.log("Opening image at: ", logo);
    //         window.open(logo, "_blank");
    //     } else {
    //         console.error("No logo URL available.");
    //     }
    // };


    const [accreditationDetails, setAccreditationDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    // const [medicalDetails, setMedicalDetails] = useState([
    //     { name: '', number: '', url: null, fileName: '' }
    // ]);
    const [stateDetails, setStateDetails] = useState([
        { name: '', number: "", url: null, fileName: "" }
    ]);
    // const [stateName, setStateName] = useState()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accreditationFileInputRef = useRef([]);
    // const medicalFileInputRef = useRef(null);
    // const stateFileInputRef = useRef(null);
    const [usePrimaryAsMailing, setUsePrimaryAsMailing] = useState(false);
    console.log(usePrimaryAsMailing, 'usePrimaryAsMailing')
    const store = useSelector((state) => state)
    const clinectypes = store?.getClinicTypeReducer?.data?.result
    const statesData = store?.getStatesReducer?.data;
    const citiesData = [store?.getSubClinicCityReducer];
    const subClinicsDetailsGet = store?.getClinicsReducer?.data?.clinic;
    console.log(subClinicsDetailsGet, 'subClinicsDetailsGet')
    const cities = store?.getCitiesReducer?.cities1?.data?.cities;
    const cities2 = store?.getCitiesReducer?.cities2?.data?.cities;
    const statecode = statesData?.states?.state_code
    // const clinicDataToUpdate = store?.getClinicByIdReducer?.data?.clinic;
    const createLoading = store?.createSubClinicsReducer?.loading;
    const createResponseOfSubClinics = store?.createSubClinicsReducer?.data?.status;
    const updateResponseOfSubClinics = store?.updateSubClinicReducer?.data?.status;
    console.log(updateResponseOfSubClinics, 'updateSubClinicReducer')

    // const [updatePage, setUpdatePage] = useState(false);
    const [searchedLocations, setSearchedLocations] = useState([]);
    const [searchedLocations2, setSearchedLocations2] = useState(null)
    const [focused, setFocused] = useState(false);
    const [focused2, setFocused2] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [latitude1, setLatitude1] = useState(null);
    const [longitude, setLongitude] = useState('');
    const [longitude1, setLongitude1] = useState(null);
    // const [street, setStreet] = useState('');
    const [stateToSelect, setStateToSelect] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    // const [openSelect, setOpenSelect] = useState(false);
    useEffect(() => {
        dispatch(getStatesByCountryAction());
        // dispatch(getCitiesAction())
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

    // const [stateCode, setStateCode] = useState()

    // const handleAddressSelection = (location) => {
    //     setValue('address', location.formatted);
    //     setValue('zip', location.components.postcode || '');
    //     setValue('stateName', location.components.state || '');
    //     setValue('city', location.components.city || location.components.town || '');
    //     setValue('street', location.components.road || location.components.street || '');
    //     setStateCode(location?.components?.state_code)
    //     setLatitude(location.geometry.lat);
    //     setLongitude(location.geometry.lng);
    //     setStreet(location.components.road || location.components.street || '');
    //     dispatch(getSubClinicCitiesAction({ state_code: location?.components?.state_code, name: '', limit: 25, skip: '' }));

    //     const stateCode = statesData?.states?.find(
    //         (state) => state.name === location.components.state
    //     )?.state_code;

    //     setSelectedCity(location.components.city)

    //     if (stateCode) {
    //         setStateToSelect(stateCode);
    //         dispatch(getSubClinicCitiesAction({ state_code: stateCode, name: '', limit: 25, skip: '' }));
    //     }

    //     setFocused(false);
    // };

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
        // dispatch(getStatesByCountryAction())
    }, [dispatch])
    useEffect(() => {
        if (idUpdateDataSubClinics) {
            dispatch(getClinicAction({ key: encryptMessage({ userId: idUpdateDataSubClinics }) }));
        }
    }, [idUpdateDataSubClinics])

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
    // const handleAddMedical = () => {
    //     const isIncomplete = medicalDetails.some(
    //         (medical) =>
    //             !medical.name || !medical.number || !medical.url
    //     );
    //     if (isIncomplete) {
    //         ToastHandle('Please fill all the fields before adding a new one', 'danger');
    //         return;
    //     }
    //     setMedicalDetails([
    //         ...medicalDetails,
    //         { name: '', number: '', url: null }
    //     ]);
    // };

    // const handleMedicalInputChange = (e, field, index) => {
    //     const value = e.target.value;
    //     setMedicalDetails((prevDetails) => {
    //         const updatedDetails = [...prevDetails];
    //         updatedDetails[index] = {
    //             ...updatedDetails[index],
    //             [field]: value
    //         };
    //         return updatedDetails;
    //     });
    // };
    // const handleRemoveMedical = (index) => {
    //     setMedicalDetails((prevDetails) => {
    //         const updatedDetails = prevDetails.filter((_, i) => i !== index);
    //         return updatedDetails;
    //     });
    // };

    // const handleAddState = () => {
    //     setOpenSelect(true);

    // };

    // const handleMedicalChange = async (e, index) => {
    //     const selectedFile = e.target.files[0];
    //     try {
    //         const url = await handleUpload(selectedFile);
    //         setMedicalDetails((prevDetails) => {
    //             const updatedDetails = [...prevDetails];
    //             updatedDetails[index] = {
    //                 ...updatedDetails[index],
    //                 url: url?.url?.split('?')[0],
    //                 fileName: selectedFile.name,

    //             };
    //             return updatedDetails;
    //         });
    //     } catch (error) {
    //     }
    // };


    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId
    // const clinic_role = JSON.parse(sessionStorage.getItem('hyper_user'))?.role

    const [formData, setFormData] = useState({
        clinicname: '',
        clinicType: '',
        email: '',
        contactPerson: '',
    });


    const setField = (key, value) => value && setValue(key, value);
    useEffect(() => {
        if (subClinicsDetailsGet && idUpdateDataSubClinics) {
            setFormData(subClinicsDetailsGet);
            setValue('clinicname', subClinicsDetailsGet?.name);
            setValue('clinicType', subClinicsDetailsGet?.clinicType);
            setValue('email', subClinicsDetailsGet?.userId?.email);
            setValue('taxId', subClinicsDetailsGet?.taxIdOrEIN);
            setValue('practiceSpecialty', subClinicsDetailsGet?.practiceSpecialty);
            setField('contactPerson', subClinicsDetailsGet?.userId?.phone?.startsWith("+1")
                ? subClinicsDetailsGet.userId.phone.substring(2)
                : subClinicsDetailsGet?.userId?.phone);
            setValue('npiNumber', subClinicsDetailsGet?.npiNumber);
            setValue('logo', subClinicsDetailsGet?.logo);
            setField('address', subClinicsDetailsGet?.userId?.primaryAddress?.address);
            setField('street', subClinicsDetailsGet?.userId?.primaryAddress?.street);
            setField('zip', subClinicsDetailsGet?.userId?.primaryAddress?.zip);
            setLatitude(subClinicsDetailsGet?.userId?.primaryAddress?.latitude)
            setLongitude(subClinicsDetailsGet?.userId?.primaryAddress?.longitude)
            setUsePrimaryAsMailing(subClinicsDetailsGet?.userId?.isPrimaryAndMailingAddressSame)
            setField('stateName', subClinicsDetailsGet?.userId?.primaryAddress?.state?._id)
            if (subClinicsDetailsGet?.userId?.primaryAddress?.city) {
                dispatch(getCitiesAction({ state_code: subClinicsDetailsGet?.userId?.primaryAddress?.state?.id, name: subClinicsDetailsGet?.userId?.primaryAddress?.city?.name, limit: '', skip: '' }))
            }
            setField('mailingAddress', subClinicsDetailsGet?.userId?.mailingAddress?.address);
            setField('mailingStreet', subClinicsDetailsGet?.userId?.mailingAddress?.street);
            setField('mailingZip', subClinicsDetailsGet?.userId?.mailingAddress?.zip);
            setLatitude1(subClinicsDetailsGet?.userId?.mailingAddress?.latitude)
            setLongitude1(subClinicsDetailsGet?.userId?.mailingAddress?.longitude)
            setField('mailingStateName', subClinicsDetailsGet?.userId?.mailingAddress?.state?._id)
            if (subClinicsDetailsGet?.userId?.mailingAddress?.city) {
                dispatch(getCities2Action({ state_code: subClinicsDetailsGet?.userId?.mailingAddress?.state?.id, name: subClinicsDetailsGet?.userId?.mailingAddress?.city?.name, limit: '', skip: '' }))
            }
            if (subClinicsDetailsGet?.accreditationDetails) {
                setAccreditationDetails(subClinicsDetailsGet?.accreditationDetails)
            }
            // if (data?.medicalLicenses) {
            //     setMedicalDetails(data?.medicalLicenses)
            // }
            if (subClinicsDetailsGet?.pos) {
                setPosDetails(subClinicsDetailsGet?.pos)
            }
            if (subClinicsDetailsGet?.logo) {
                setLogoName(subClinicsDetailsGet?.logo?.fileName)
            }
            if (subClinicsDetailsGet?.stateOfLicensing) {
                setStateDetails(subClinicsDetailsGet?.stateOfLicensing)
            }
        }
    }, [subClinicsDetailsGet, idUpdateDataSubClinics, statesData, setValue]);

    const formDataChange = (field, value) => {
        const updatedFormData = { ...formData, [field]: value };
        setFormData(updatedFormData);

        const areAllFieldsFilled =
            updatedFormData.clinicname &&
            updatedFormData.clinicType &&
            updatedFormData.email &&
            updatedFormData.contactPerson;

        setIsButtonDisabled(!areAllFieldsFilled);
    };

    // const handleFileUpload = (index, file) => {
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = () => {
    //             setValue(`accreditations.${index}.fileName`, file.name);
    //             setValue(`accreditations.${index}.fileUrl`, reader.result);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const handleAddAccreditation = () => {
        const isIncomplete = accreditationDetails.some(
            (subClinicsDetailsGet) =>
                !subClinicsDetailsGet.name || !subClinicsDetailsGet.number || !subClinicsDetailsGet.url
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
    useEffect(() => {
        dispatch(
            getDoctorsrolesAction({ search: 'clinic' })
        );
    }, [dispatch]);
    const getRoleId = store?.getDoctorsRolesReducer?.data?.result?.[0]?._id;

    const submitSubData = (formData) => {
        const payload = {
            name: formData?.clinicname,
            email: formData?.email,
            role: getRoleId,
            phone: formData?.contactPerson,
            practiceSpecialty: formData?.practiceSpecialty,
            clinicType: formData?.clinicType,
            taxIdOrEIN: formData?.taxId,
            npiNumber: formData?.npiNumber,
            CLIA_Number: '',
            medicareNumber: '',
            medicaidNumber: '',
            taxonomyCodes: [''],
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
                address: formData?.address,
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
                        address: formData?.address,
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
                        address: formData?.mailingAddress,
                        ...(formData?.mailingCity ? { city: formData?.mailingCity } : ''),
                        ...(formData?.mailingStateName ? { state: formData?.mailingStateName } : ''),
                        street: formData?.mailingStreet,
                        zip: formData?.mailingZip,
                        ...(latitude1 ? { latitude: latitude1, } : ''),
                        ...(longitude1 ? { longitude: longitude1, } : '')
                    },
            ...posDetails && { pos: posDetails },
        }
        if (idUpdateDataSubClinics) {
            dispatch(updateSubClinicAction({ key: encryptMessage(payload) }))
            console.log('updateData', payload)

        } else {
            dispatch(createSubClinicAction({ key: encryptMessage(payload) }))
            console.log('createData', payload)

        }
    };
    useEffect(() => {
        if (createResponseOfSubClinics === 200 || updateResponseOfSubClinics === 200) {
            if (!isModalRequest) {
                navigate('/apps/crm/addclinic');
                dispatch(stateEmptydAction());
            }
        } else if (createResponseOfSubClinics === 400 || updateResponseOfSubClinics === 400) {
            console.error('Error creating/updating the sub-clinic');
        }
    }, [createResponseOfSubClinics, updateResponseOfSubClinics]);

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
            const selectedCounty = cities && cities.find((event) => event?.name === selectedLocation?.components?.county || subClinicsDetailsGet?.userId?.primaryAddress?.city?.name)?._id;
            setValue('city', selectedCounty)
        }
        if (cities2) {
            const selectedCounty1 = cities2 && cities2.find((event) => event?.name === selectedLocation2?.components?.county || subClinicsDetailsGet?.userId?.mailingAddress?.city?.name)?._id;
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
                                                Practice Sub Information
                                            </button>
                                        </li>
                                        {/* <li className="nav-item">
                                         <button
                                             className={`text-black nav-link ${activeTab === "departmentDetails" ? "active" : ""}`}
                                             onClick={() => handleTabChange("departmentDetails")}
                                         >
                                             Billing & Subscription
                                         </button>
                                     </li> */}
                                        {/* <li className="nav-item">
                                         <button
                                             className={`text-black nav-link ${activeTab === "documents" ? "active" : ""}`}
                                             onClick={() => handleTabChange("documents")}
                                         >
                                             Contract
                                         </button>
                                     </li> */}
                                    </ul>
                                </div>
                                <div className='d-flex gap-2'>
                                    {btnShow && (
                                        <>
                                            {!idUpdateDataSubClinics && ( // Only show this button if not updating and no data
                                                <Button onClick={() => setShow(true)} disabled={isButtonDisabled}>
                                                    Email to Sub Practice
                                                </Button>
                                            )}
                                            <Button as={Link} to={'/apps/crm/addclinic'}>
                                                Back
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {activeTab === "personalDetails" && (
                                <>
                                    {store?.getClinicsReducer?.loading ?
                                        <div className="text-center my-3">
                                            <Spinner />
                                        </div>
                                        :
                                        <Form className='mt-3' onSubmit={handleSubmit(submitSubData)} >
                                            <Row >
                                                <Col sm={6}>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label className='mb-1'>Practice Name <span className='text-danger'>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            {...register('clinicname', { required: 'Practice Name is required' })}
                                                            onChange={(e) => formDataChange('clinicname', e.target.value)}
                                                            value={formData.clinicname}
                                                            placeholder="Practice name"
                                                        />
                                                        {errors.clinicname && <p className="text-danger">{errors.clinicname.message}</p>}

                                                    </Form.Group>
                                                </Col>
                                                <Col sm={6}>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label className="mb-1">
                                                            Practice type <span className="text-danger">*</span>
                                                        </Form.Label>
                                                        <Form.Select
                                                            {...register('clinicType', { required: 'Practice Type is required' })}
                                                            onChange={(e) => formDataChange('clinicType', e.target.value)}
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
                                                <Col sm={6}>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label className="mb-1">Email <span className='text-danger'>*</span></Form.Label>
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
                                                        />
                                                        {errors.email && <p className="text-danger">{errors.email.message}</p>}

                                                    </Form.Group>
                                                </Col>
                                                <Col sm={6}>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label className='mb-1'>Tax ID / EIN<span className='text-danger'>*</span></Form.Label>
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
                                                    <Form.Group className="mb-2 position-relative">
                                                        <Form.Label className="mb-1">Contact Person <span className='text-danger'>*</span></Form.Label>
                                                        <InputGroup>
                                                            <InputGroup.Text className='ps-3 pe-1 fw-bold text-black'>&nbsp;&nbsp;+1</InputGroup.Text>
                                                            <Form.Control
                                                                type="tel"
                                                                value={formData.contactPerson}
                                                                {...register('contactPerson', {
                                                                    required: 'This field is required',
                                                                    pattern: {
                                                                        value: /^[0-9]*$/,
                                                                        message: 'Contact must be a number'
                                                                    },
                                                                    maxLength: {
                                                                        value: 10,
                                                                        message: 'Contact must not exceed 10 digits'
                                                                    },
                                                                    minLength: {
                                                                        value: 9,
                                                                        message: 'Contact must not be less than 9 digits'
                                                                    }
                                                                })}
                                                                onChange={(e) => formDataChange('contactPerson', e.target.value)}
                                                                placeholder="+1 1234-234-234"
                                                                maxLength={10}
                                                            />
                                                        </InputGroup>
                                                        {errors.contactPerson && <span className="text-danger">{errors.contactPerson.message}</span>}
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
                                                        <Form.Label className='mb-1'>NPI Type 2 Number <span className='text-danger'>*</span></Form.Label>
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
                                                <Col sm={6}>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label className='mb-1'>Practice Speciality Description <span className='text-danger'>*</span></Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            {...register('practiceSpecialty', {
                                                                required: 'This field is required',
                                                                validate: (value) =>
                                                                    !value.startsWith(' ') || 'First character cannot be a space',
                                                            })}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                            }}
                                                            placeholder="Practice Specialty Description"
                                                        />
                                                        {errors.practiceSpecialty && <span className="text-danger">{errors.practiceSpecialty.message}</span>}

                                                    </Form.Group>
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
                                                {/* <Col sm={12}>
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
                                     ))} */}
                                                {/* <hr /> */}
                                                <Col sm={12} className="position-relative">
                                                    <Form.Label ref={containerRef}>
                                                        State of Licensure&nbsp;
                                                        <span
                                                            onClick={() => setStatesMenu(!statesMenu)}
                                                            className={`plusicon ms-1 fs-5 ${statesMenu ? 'uil-angle-down' : 'uil-angle-up'} fw-bold cursor-pointer`}
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
                                                        <Col sm={4}>
                                                            <Form.Control
                                                                type="text"
                                                                value={data.name}
                                                                readOnly // Display selected state name
                                                                placeholder="State"
                                                            />
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
                                                            <div
                                                                onClick={() => document.getElementById(`fileInput-state=${index}`).click()}
                                                                className={`custom-file-upload justify-content-between cursor-pointer ${data.fileName ? 'form-control' : 'custom-form-fields'
                                                                    }`}
                                                            >
                                                                {data.fileName
                                                                    ? data?.fileName?.length > 30
                                                                        ? data?.fileName?.slice(0, 25) + '...'
                                                                        : data?.fileName
                                                                    : 'Upload Document'}
                                                                <p className="mb-0">
                                                                    <FiDownloadCloud />
                                                                </p>
                                                            </div>
                                                            <Form.Control
                                                                type="file"
                                                                id={`fileInput-state=${index}`}
                                                                style={{ display: 'none' }}
                                                                onChange={(e) => handleStateChange(e, index)}
                                                            />
                                                            <span
                                                                onClick={() => handleRemoveState(index)}
                                                                className={`${stateDetails.length <= 1 ? 'd-none' : ''
                                                                    } uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}
                                                                style={{ right: '-2%', top: '20%' }}
                                                            ></span>
                                                        </Col>
                                                    </React.Fragment>
                                                ))}



                                                <hr />
                                                <Col sm={12}>
                                                    <Row>
                                                        <Col sm={12} className='mb-2'>
                                                            <span className='text-black fw-semibold form-label'>Address Details</span>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Row className='position-relative'>
                                                                <Col sm={12}>
                                                                    <Form.Group className="mb-2">
                                                                        <Form.Label className="mb-1">Address</Form.Label>
                                                                        <div style={{ position: 'relative' }}>
                                                                            <Form.Control
                                                                                type="text"
                                                                                defaultValue={subClinicsDetailsGet?.address?.address || ''}
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
                                                                        <Form.Label className='mb-1'>Latitude</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            defaultValue={latitude}
                                                                            placeholder="Latitude"
                                                                        />
                                                                        {/* {errors.street && <span className="text-danger">{errors.street.message}</span>} */}
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-2">
                                                                        <Form.Label className='mb-1'>Longitude</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            defaultValue={longitude}
                                                                            placeholder="Longitude" />
                                                                        {/* {errors.street && <span className="text-danger">{errors.street.message}</span>} */}
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Row>
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-2">
                                                                        <Form.Label className='mb-1' >State</Form.Label>
                                                                        <Form.Select
                                                                            {...register('stateName')}
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
                                                                    </Form.Group>

                                                                </Col>
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-2">
                                                                        <Form.Label className='mb-1'>City</Form.Label>
                                                                        {/* {
                                             store?.getCitiesReducer?.loading ?
                                                 <Row>
                                                     <Col sm={12}>
                                                         <Spinner className='fs-5' />
                                                     </Col>
                                                 </Row>
                                                 : */}
                                                                        <Form.Select
                                                                            disabled={store?.getCitiesReducer?.loading}
                                                                            {...register('city')}
                                                                            onChange={(e) => handleCitySelection(e)}
                                                                        >
                                                                            <option value='' >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                                            {cities?.map((data) => (
                                                                                <option data-key={JSON.stringify({ _id: data?._id, latitude: data?.latitude, longitude: data?.longitude })} key={data?._id} value={data?._id}>

                                                                                    {data?.name}
                                                                                </option>
                                                                            ))}
                                                                        </Form.Select>
                                                                        {/* } */}
                                                                    </Form.Group>
                                                                </Col>

                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-2">
                                                                        <Form.Label className='mb-1'>Street</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            {...register('street')}
                                                                            onKeyPress={handleFirstSpace}
                                                                            placeholder="Street" />

                                                                        {/* {errors.street && <span className="text-danger">{errors.street.message}</span>} */}
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-2">
                                                                        <Form.Label className='mb-1'>Zip</Form.Label>
                                                                        <Form.Control
                                                                            defaultValue={subClinicsDetailsGet?.address?.zip || ''}
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
                                                <hr />
                                                <Col sm={12}>
                                                    <Row>
                                                        <Col sm={12} className="mb-2">
                                                            <span className="text-black fw-semibold form-label">Mailing Address Details</span>
                                                        </Col>

                                                        {/* Checkbox for using primary address */}
                                                        <Col sm={12} className="mb-2">
                                                            <Form.Check
                                                                type="checkbox"
                                                                style={{ cursor: "pointer" }}
                                                                label="Use primary address as mailing address"
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
                                                                    <Form.Group className="mb-2">
                                                                        <Form.Label className="mb-1">Mailing Address</Form.Label>
                                                                        <div style={{ position: 'relative' }}>
                                                                            <Form.Control
                                                                                type="text"
                                                                                value={watch('mailingAddress')}
                                                                                {...register('mailingAddress')}
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
                                                                    </Form.Group>
                                                                </Col>

                                                                {/* Latitude and Longitude */}
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-2">
                                                                        <Form.Label className="mb-1">Latitude</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            value={latitude1}
                                                                            placeholder="Latitude"
                                                                            disabled={usePrimaryAsMailing}
                                                                        />
                                                                    </Form.Group>
                                                                </Col>

                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-2">
                                                                        <Form.Label className="mb-1">Longitude</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            value={longitude1}
                                                                            placeholder="Longitude"
                                                                            disabled={usePrimaryAsMailing}
                                                                        />
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                        </Col>

                                                        <Col sm={6}>
                                                            <Row>
                                                                {/* State */}
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-2">
                                                                        <Form.Label className="mb-1">State</Form.Label>
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
                                                                                {...register('mailingStateName')}
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
                                                                    </Form.Group>
                                                                </Col>


                                                                {/* City */}
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-2">
                                                                        <Form.Label className="mb-1">City</Form.Label>
                                                                        {usePrimaryAsMailing ?
                                                                            <Form.Control readOnly value={cities && cities?.find((data) => data?._id === getValues('city'))?.name} />
                                                                            :
                                                                            <Form.Select
                                                                                disabled={store?.getCitiesReducer?.loading || usePrimaryAsMailing}
                                                                                {...register('mailingCity')}
                                                                                onChange={(e) => handleCitySelection(e)}
                                                                            >
                                                                                <option value="">
                                                                                    {store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}
                                                                                </option>
                                                                                {cities2?.map((data) => (
                                                                                    <option key={data?._id} value={data?._id}
                                                                                        onChange={(e) => {
                                                                                            if (!usePrimaryAsMailing) {
                                                                                                setValue('mailingCity', e.target.value);
                                                                                            }
                                                                                        }}>
                                                                                        {data?.name}
                                                                                    </option>
                                                                                ))}
                                                                            </Form.Select>
                                                                        }

                                                                    </Form.Group>
                                                                </Col>

                                                                {/* Street */}
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-2">
                                                                        <Form.Label className="mb-1">Street</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            {...register('mailingStreet')}
                                                                            placeholder="Street"
                                                                            disabled={usePrimaryAsMailing}
                                                                        />
                                                                    </Form.Group>
                                                                </Col>

                                                                {/* ZIP */}
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-2">
                                                                        <Form.Label className="mb-1">Zip</Form.Label>
                                                                        <Form.Control
                                                                            type="text"
                                                                            {...register('mailingZip', {
                                                                                minLength: { value: 5, message: 'ZIP must be 5 characters long' },
                                                                                pattern: { value: /^[0-9]+$/, message: 'ZIP must contain numbers only' },
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
                                                    {/* <Button variant="primary" className='custom-buttons' onClick={() => setPassShow(true)} >
                                             Reset Password
                                         </Button> */}

                                                    <Button
                                                        variant="primary"
                                                        type="submit"
                                                        className='custom-buttons'
                                                        disabled={createLoading}  // Disable button when loading
                                                    >
                                                        {createLoading ? (
                                                            <Spinner color='white' className='spinner-border-sm' />
                                                        ) : (
                                                            subClinicsDetailsGet && idUpdateDataSubClinics ? 'Update' : 'Next'
                                                        )}
                                                    </Button>
                                                </Col>

                                            </Row >
                                        </Form >
                                    }
                                </>
                            )}
                            {activeTab === "departmentDetails" && <DepartmentDetails />}
                            {activeTab === "documents" && <Documents />}
                        </div>
                    </Card>
                </div>
                <EmailToDoctorModal setIsModalRequest={setIsModalRequest} closeModal={closeModal} show={show} formData={formData} />
                <ResetPassword closeModal={closepassModal} show={passShow} />
            </div>

        </>
        // <>

        // </>
    );
};

export default NewPractice;
