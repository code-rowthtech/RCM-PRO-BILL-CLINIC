import React, { useEffect, useState, useRef } from 'react'
import { Col, Form, Row, Button, Table, Modal, InputGroup, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Spinner from '../../../../constants/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import profileDummy from '../../../../assets/images/profileDummy.png'
import us from '../../../../assets/images/flags/us.jpg'
import { createClinicAction, getCities2Action, getCitiesAction, getClinicAction, getClinicById, getClinicByParentAction, getClinicTypeAction, getStatesByCountryAction, stateEmptydAction, updateClinicAction } from '../../../../redux/clinics/actions';
import { VscLoading } from 'react-icons/vsc';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaDownload, FaPlus } from 'react-icons/fa';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import { FiDownloadCloud, FiEdit, FiEye, FiMinus, FiTrash } from 'react-icons/fi';
import UploadToS3 from '../../../../helpers/uploads3';
import { handleUpload } from '../../../../helpers/HandleUpload';
import { encryptMessage } from '../../../../cryptoUtils';
import ToastHandle from '../../../../helpers/ToastMessage';
import { FiUploadCloud } from "react-icons/fi";
import ChangePasswordModal from '../../../../components/ChangePasswordModal';
import { handleFirstSpace } from '../../../../helpers/noSpace';
import { getDoctorsAction, getSubClinicAction } from '../../../../redux/actions';
import { FormInput } from '../../../../components';
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from 'react-icons/md';


const ClinicForm = ({ setActiveTab, setClinicId, clinicId, setBillingId }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
        getValues,
        setError,
        clearErrors
    } = useForm();
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))
    const [usePrimaryAsMailing, setUsePrimaryAsMailing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [citySearch, setCitySearch] = useState('');
    const updateId = searchParams.get('updateid');
    const [updatePage, setUpdatePage] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [focused, setFocused] = useState(false);
    const [focused2, setFocused2] = useState(false);
    const [subClinic, setSubClinic] = useState('');
    const [taxonomyCodes, setTaxonomyCodes] = useState([''])
    const [medicalLicenses, setMedicalLicenses] = useState(null);
    const [logo, setLogo] = useState(null);
    const [accreditationLogo, setAccreditationLogo] = useState(null);
    const [addType, setAddType] = useState('');
    const [logoName, setLogoName] = useState(null);
    const [showModal, setShowModal] = useState(false);
    // table data
    // const [detailsModal, setDetailsModal] = useState(false);
    // const [selectedDetails, setSelectedDetails] = useState(null);
    // const [status, setStatus] = useState(true);
    // const [search, setSearch] = useState('');

    // const handleStatusChange = (isActive) => {
    //     setStatus(isActive);
    // };

    const closeModal = () => setShowModal(false);
    // const handleMultipleAdd = () => {
    //     navigate('/apps/Practice/new-practice')
    // }
    // const [clinicId, setClinicId] = useState(null);
    const [accreditationDetails, setAccreditationDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    console.log(accreditationDetails, 'accreditationDetails')
    // const [medicalDetails, setMedicalDetails] = useState([
    //     { name: '', number: '', url: null, fileName: '' }
    // ]);
    const [posDetails, setPosDetails] = useState([
        { name: '', email: '', role: '', contact: '', fileName: '' }
    ])

    const [stateDetails, setStateDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);

    const [longitude, setLongitude] = useState(null);
    const [longitude1, setLongitude1] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [latitude1, setLatitude1] = useState(null);
    const [stateToSelect, setStateToSelect] = useState(null);
    const [nextClicked, setNextClicked] = useState(false);
    const clinectypes = store?.getClinicTypeReducer?.data?.result
    const createResponse = store?.createClinicsReducer?.data?.status;
    const clinicDataToUpdate = store?.getClinicByIdReducer?.data?.clinic;
    const clinicsList = store?.getClinicsByParentReducer?.data?.data;
    const statesData = store?.getStatesReducer?.data;
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;
    const cities2 = store?.getCitiesReducer?.cities2?.data?.cities;
    // useEffect(() => {
    //     if (clinicId) {
    //         const payload = {
    //             parentClinic: clinicId,
    //         }
    //         dispatch(getClinicByParentAction({ key: encryptMessage(payload) }));
    //     }
    //     if (clinicDataToUpdate) {
    //         setAccreditationDetails(clinicDataToUpdate?.accreditationDetails)
    //         // setMedicalDetails(clinicDataToUpdate?.medicalLicenses)
    //         setStateDetails(clinicDataToUpdate?.stateOfLicensing)
    //     }
    // }, [clinicId, clinicDataToUpdate])
    // const deleteClinicResponse = store?.deleteClinicOnboardingReducer?.data?.status;
    // useEffect(() => {
    //     if (createResponse === 200) {

    //         if (clinicsList?.length > 0) {
    //             const payload = {
    //                 parentClinic: clinicId,
    //             }
    //             dispatch(getClinicByParentAction({ key: encryptMessage(payload) }));
    //         } else {
    //             setClinicId(store?.createClinicsReducer?.data?.data?._id);
    //             setBillingId(store?.createClinicsReducer?.data?.data?.clinicId)
    //         }
    //     }
    //     if (createResponse === 200 && nextClicked === true) {
    //         setActiveTab('billing');
    //     }
    //     if (deleteClinicResponse === 200) {
    //         const payload = {
    //             parentClinic: clinicId,
    //         }
    //         dispatch(getClinicByParentAction({ key: encryptMessage(payload) }));
    //     }
    // }, [createResponse, deleteClinicResponse])


    const handleAddTaxonomy = () => {
        const lastCode = taxonomyCodes[taxonomyCodes.length - 1];

        if (lastCode) {
            const validCodes = taxonomyCodes.filter((code) => code.trim() !== '');
            setTaxonomyCodes([...validCodes, '']);
        } else {
            ToastHandle('Please complete the current Taxonomy Code field before adding another.', 'danger')
        }
    };
    // Function to handle field changes
    const handleTaxonomyChange = (index, value) => {
        const updatedCodes = [...taxonomyCodes];
        updatedCodes[index] = value;
        setTaxonomyCodes(updatedCodes);
    };
    const handleStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        dispatch(getCitiesAction({ state_code: key?.id, name: '', limit: 25, skip: '' }))
    };

    useEffect(() => {
        dispatch(getClinicAction({ key: encryptMessage({ userId: clinic_id?._id }) }));
        dispatch(getSubClinicAction());
        dispatch(getStatesByCountryAction())
    }, [dispatch])
    const clinicsDataGet = store?.getClinicsReducer?.data?.clinic;
    console.log(clinicsDataGet, 'clinicDataGet')
    const setField = (key, value) => value && setValue(key, value);
    useEffect(() => {
        setField('clinicType', clinicsDataGet?.clinicType);
        setField('contact', clinicsDataGet?.userId?.phone?.startsWith("+1")
            ? clinicsDataGet.userId.phone.substring(2)
            : clinicsDataGet?.userId?.phone);
        setField('clinicname', clinicsDataGet?.name);
        setField('practiceSpecialty', clinicsDataGet?.practiceSpecialty);
        setField('taxId', clinicsDataGet?.taxIdOrEIN || '');
        setField('npi', clinicsDataGet?.npiNumber);
        setField('email', clinicsDataGet?.userId?.email);
        setField('medicare', clinicsDataGet?.medicareNumber);
        setField('medicaid', clinicsDataGet?.medicaidNumber);
        setField('clia', clinicsDataGet?.CLIA_Number);
        setField('address', clinicsDataGet?.userId?.primaryAddress?.address);
        setField('street', clinicsDataGet?.userId?.primaryAddress?.street);
        setField('zip', clinicsDataGet?.userId?.primaryAddress?.zip);
        setLatitude(clinicsDataGet?.userId?.primaryAddress?.latitude)
        setLongitude(clinicsDataGet?.userId?.primaryAddress?.longitude)
        setField('stateName', clinicsDataGet?.userId?.primaryAddress?.state?._id)
        if (clinicsDataGet?.userId?.primaryAddress?.city) {
            dispatch(getCitiesAction({ state_code: clinicsDataGet?.userId?.primaryAddress?.state?.id, name: clinicsDataGet?.userId?.primaryAddress?.city?.name, limit: '', skip: '' }))
        }
        setField('mailingAddress', clinicsDataGet?.userId?.mailingAddress?.address);
        setField('mailingStreet', clinicsDataGet?.userId?.mailingAddress?.street);
        setField('mailingZip', clinicsDataGet?.userId?.mailingAddress?.zip);
        setLatitude1(clinicsDataGet?.userId?.mailingAddress?.latitude)
        setLongitude1(clinicsDataGet?.userId?.mailingAddress?.longitude)
        setField('mailingStateName', clinicsDataGet?.userId?.mailingAddress?.state?._id)
        setUsePrimaryAsMailing(clinicsDataGet?.userId?.isPrimaryAndMailingAddressSame)
        if (clinicsDataGet?.userId?.mailingAddress?.city) {
            dispatch(getCities2Action({ state_code: clinicsDataGet?.userId?.mailingAddress?.state?.id, name: clinicsDataGet?.userId?.mailingAddress?.city?.name, limit: '', skip: '' }))
        }
        if (clinicsDataGet?.accreditationDetails) {
            setAccreditationDetails(clinicsDataGet?.accreditationDetails)
        }

        // if (clinicsDataGet?.taxonomyCodes) {
        //     setTaxonomyCodes(clinicsDataGet?.taxonomyCodes);
        //     clinicsDataGet?.taxonomyCodes?.forEach((code, index) => {
        //         setValue(`taxonomyCode[${index}]`, code);
        //     });
        // }
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

    }, [dispatch, clinicsDataGet, statesData, setValue]);

    const SubmitData = (data) => {
        if (data.Password !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'Passwords do not match',
            });
            return;
        }
        if (logo) {
            sessionStorage.setItem('logo', logo?.url?.split('?')[0]);
        }
        const newPayload = {
            ...(clinicsList && { parentClinic: clinicId }),
            ...(updateId && { id: updateId }),
            name: data?.clinicname || clinicsDataGet?.name,
            practiceSpecialty: data?.practiceSpecialty || clinicsDataGet?.practiceSpecialty,
            email: data?.email || clinicsDataGet?.userId?.email,
            phone: '+1' + data?.contact || '+1' + clinicsDataGet?.userId?.phone,
            clinicType: data?.clinicType || clinicsDataGet?.clinicType,
            taxIdOrEIN: data?.taxId,
            npiNumber: data?.npi,
            CLIA_Number: data?.clia,
            medicareNumber: data?.medicare,
            medicaidNumber: data?.medicaid,
            // taxonomyCodes: taxonomyCodes,
            taxonomyCodes: taxonomyCodes.filter(code => code), // Filter out empty taxonomy codes
            isPrimaryAndMailingAddressSame: usePrimaryAsMailing,
            flag: 'Clinic',
            // medicalLicenses: medicalDetails,
            // stateOfLicensing: stateDetails,
            // accreditationDetails: accreditationDetails,
            // pos: posDetails,
            // logo: logo?.url?.split('?')[0],
            ...stateDetails && { stateOfLicensing: stateDetails },
            ...accreditationDetails && { accreditationDetails: accreditationDetails },
            ...posDetails && { pos: posDetails },
            ...(logo ?
                {
                    logo: {
                        url: logo?.url?.split('?')[0],
                        fileName: logoName,
                    }
                }
                : ''),
            primaryAddress: {
                address: data?.address,
                ...(data?.city ? { city: data?.city } : ''),
                ...(data?.stateName ? { state: data?.stateName } : ''),
                ...(stateToSelect?._id ? { state: stateToSelect?._id } : ''),
                street: data?.street,
                zip: data?.zip,
                ...(latitude ? { latitude: latitude, } : ''),
                ...(longitude ? { longitude: longitude, } : '')
            },
            mailingAddress:
                usePrimaryAsMailing ?
                    {
                        address: data?.address,
                        ...(data?.city ? { city: data?.city } : ''),
                        ...(data?.stateName ? { state: data?.stateName } : ''),
                        ...(stateToSelect?._id ? { state: stateToSelect?._id } : ''),
                        street: data?.street,
                        zip: data?.zip,
                        ...(latitude ? { latitude: latitude, } : ''),
                        ...(longitude ? { longitude: longitude, } : '')
                    }
                    :
                    {
                        address: data?.mailingAddress,
                        ...(data?.mailingCity ? { city: data?.mailingCity } : ''),
                        ...(data?.mailingStateName ? { state: data?.mailingStateName } : ''),
                        street: data?.mailingStreet,
                        zip: data?.mailingZip,
                        ...(latitude1 ? { latitude: latitude1, } : ''),
                        ...(longitude1 ? { longitude: longitude1, } : '')
                    }
        };
        console.log(newPayload, 'new payload')
        dispatch(createClinicAction({ key: encryptMessage(newPayload) }));
    };
    const logoFileInputRef = useRef(null);
    const accreditationFileInputRef = useRef(null);
    const medicalFileInputRef = useRef(null);
    const stateFileInputRef = useRef(null);
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
            console.error('Error during file upload:', error);
        }
    };

    // Handle accreditation input changes
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

    const handleAddAccreditation = () => {
        const isIncomplete = accreditationDetails.some(
            (data) =>
                !data.name || !data.number || !data.url
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

    const handleAddState = () => {
        const isIncomplete = stateDetails.some(
            (state) =>
                !state.name || !state.number || !state.url
        );
        if (isIncomplete) {
            ToastHandle('Please fill all the fields before adding a new one', 'danger');
            return;
        }
        setStateDetails([
            ...stateDetails,
            { name: '', number: '', url: null }
        ]);
    };

    useEffect(() => {
        if (clinicsDataGet?.clinicType) {
            setValue('clinicType', clinicsDataGet.clinicType);
        }
    }, [clinicsDataGet, setValue]);
    const [searchedLocations, setSearchedLocations] = useState(null)
    const [searchedLocations2, setSearchedLocations2] = useState(null)

    const getGeolocation = (e) => {
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
                    setSearchedLocations(data?.results)
                }
            });
    }

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
    }, [selectedLocation, selectedLocation2, setValue, statesData, dispatch])
    useEffect(() => {
        if (cities1) {
            const selectedCounty = cities1 && cities1.find((data) => data?.name === selectedLocation?.components?.county || clinicsDataGet?.userId?.primaryAddress?.city?.name)?._id;
            setValue('city', selectedCounty)
        }
        if (cities2) {
            const selectedCounty1 = cities2 && cities2.find((data) => data?.name === selectedLocation2?.components?.county || clinicsDataGet?.userId?.mailingAddress?.city?.name)?._id;
            setValue('mailingCity', selectedCounty1)
        }
    }, [cities1, cities2]);
    const getTableData = store.getSubClinicsReducer?.data?.clinics
    const [selectedStates, setSelectedStates] = useState([]);
    const [statesMenu, setStatesMenu] = useState(false);
    const handleCheckboxChange = (stateName) => {
        setSelectedStates((prev) => {
            const updatedStates = prev.includes(stateName)
                ? prev.filter((name) => name !== stateName)
                : [...prev, stateName]; // Add state if checked

            // Sync stateDetails with selected states
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
            setSelectedStates(updatedDetails.map((detail) => detail.name)); // Update selectedStates as well
            return updatedDetails;
        });
    };
    const menuRef = useRef(null); // Reference for the menu
    const containerRef = useRef(null); // Reference for the container
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
            {/* <UploadToS3 /> */}
            {store.getClinicsReducer?.loading ? (
                <div className="text-center my-3">
                    <Spinner />
                </div>
            ) : (
                <>
                    <Form onSubmit={handleSubmit(SubmitData)}>

                        <Row>
                            <Col sm={12} className='mb-3'><b>{subClinic}</b></Col>
                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className='mb-1'>Practice Name <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register('clinicname', {
                                            required: 'This field is required',
                                            validate: (value) =>
                                                !value.startsWith(' ') || 'First character cannot be a space',
                                        })}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                        }}
                                        placeholder="Practice name"
                                        onKeyPress={handleFirstSpace}
                                    />
                                    {errors.clinicname && <span className="text-danger">{errors.clinicname.message}</span>}

                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className='mb-1'>Practice type <span className='text-danger'>*</span></Form.Label>
                                    <Form.Select
                                        // defaultValue={updatePage ? clinicDataToUpdate?.clinicType : ''}
                                        {...register('clinicType', { required: 'This field is required' })}
                                    >
                                        <option value="">Select Practice type</option>
                                        {clinectypes?.map((data) => (
                                            <option key={data?._id} value={data?.name}>{data?.name}</option>
                                        ))}
                                    </Form.Select>
                                    {errors.clinicType && <span className="text-danger">{errors.clinicType.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className='mb-1'>Email ID <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        disabled={true}
                                        type="text"
                                        // defaultValue={updatePage ? clinicDataToUpdate?.email : ''}
                                        {...register('email', {
                                            required: 'This field is required',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Please enter a valid email address'
                                            }
                                        })}
                                        placeholder="Email ID"
                                    />

                                    {errors.email && <span className="text-danger">{errors.email.message}</span>}
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
                                            {...register('contact', {
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

                                            placeholder="1234-234-234"
                                            maxLength={10}
                                        />
                                    </InputGroup>
                                    {errors.contact && <span className="text-danger">{errors.contact.message}</span>}
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
                                        {...register('npi', {
                                            minLength: {
                                                value: 10,
                                                message: 'NPI must be at least 10 characters long',
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
                                        placeholder="NPI Type 2 Number"
                                        maxLength={10}
                                    />
                                    {errors.npi && <span className="text-danger">{errors.npi.message}</span>}
                                </Form.Group>
                            </Col>

                            <Col sm={6} className="mb-2 d-flex flex-column position-relative">
                                <Form.Label>Upload Logo</Form.Label>
                                <div
                                    onClick={handleLogoClick}
                                    className={`custom-file-upload justify-content-between cursor-pointer ${logoName ? '' : 'custom-form-fields'
                                        }`}
                                >
                                    {/* Ensure logoName is a string or fallback to 'Upload Logo' */}
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
                            {taxonomyCodes && taxonomyCodes.map((code, index) => (
                                <Col sm={6} key={index}>
                                    <Form.Group className="mb-2">
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
                            ))}
                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className='mb-1'>CLIA Number <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register('clia', {
                                            required: 'CLIA Number is required',
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


                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className='mb-1'>Medicare Number <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register('medicare', {
                                            required: 'Medicare Number is required',
                                            minLength: {
                                                value: 10,
                                                message: 'Medicare Number must be 10 characters long',
                                            },
                                            maxLength: {
                                                value: 10,
                                                message: 'Medicare Number must be 10 characters long',
                                            },
                                            pattern: {
                                                value: /^[0-9]+$/,
                                                message: 'Medicare Number must contain numbers only',
                                            },
                                        })}
                                        placeholder="Medicare Number"
                                        maxLength={10}
                                    />
                                    {errors.medicare && <span className="text-danger">{errors.medicare.message}</span>}
                                </Form.Group>
                            </Col>


                            <Col sm={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className='mb-1'>Medicaid Number <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        {...register('medicaid', {
                                            required: 'Medicaid Number is required',
                                            minLength: {
                                                value: 10,
                                                message: 'Medicaid Number must be 10 characters long',
                                            },
                                            maxLength: {
                                                value: 10,
                                                message: 'Medicaid Number must be 10 characters long',
                                            },
                                            pattern: {
                                                value: /^[0-9]+$/,
                                                message: 'Medicaid Number must contain numbers only',
                                            },
                                        })}
                                        placeholder="Medicaid Number"
                                        maxLength={10}
                                    />
                                    {errors.medicaid && <span className="text-danger">{errors.medicaid.message}</span>}
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
                            {accreditationDetails && accreditationDetails?.map((accreditation, index) => (
                                <React.Fragment key={index}>
                                    <Col sm={4}>
                                        <Form.Control
                                            type="text"
                                            value={accreditation?.name || ''}
                                            placeholder="Name"
                                            onChange={(e) => handleAccreditationInputChange(e, 'name', index)}
                                        />
                                    </Col>
                                    <Col sm={4}>
                                        <Form.Control
                                            type="text"
                                            value={accreditation?.number}
                                            {...register('accDocno', {
                                                pattern: {
                                                    value: /^[0-9]*$/,
                                                    message: 'Document no must be a number'
                                                },
                                            })}
                                            placeholder="Document Number"
                                            onChange={(e) => handleAccreditationInputChange(e, 'number', index)}
                                            onKeyUp={(event) => handleFirstSpace(event, 0)}
                                        />
                                        {errors.accDocno && <span className="text-danger">{errors.accDocno.message}</span>}
                                    </Col>
                                    <Col sm={4} className="mb-2 position-relative">
                                        <div
                                            onClick={() => document.getElementById(`fileInput-accreditation=${index}`).click()}
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
                                            id={`fileInput-accreditation=${index}`}
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
                                        style={{ height: '14rem', width: '12em', zIndex: '111', overflow: 'scroll' }}
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
                                                    <Form.Label className="mb-1">Primary Address</Form.Label>
                                                    <div style={{ position: 'relative' }}>
                                                        <Form.Control
                                                            type="text"
                                                            defaultValue={updatePage ? clinicDataToUpdate?.address?.address : ''}
                                                            {...register('address')}
                                                            onChange={(e) => {
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
                                                            {searchedLocations?.map((data, index) => (
                                                                <p
                                                                    key={index}
                                                                    onClick={() => {
                                                                        setSelectedLocation(data)
                                                                        setFocused(false);
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
                                                        <option>State</option>
                                                        {statesData?.states?.map((data) => (
                                                            <option
                                                                key={data?.id}
                                                                data-key={JSON.stringify({ id: data?.id, _id: data?._id })}
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
                                                    <Form.Select
                                                        disabled={store?.getCitiesReducer?.loading}
                                                        {...register('city')}
                                                    >
                                                        <option value='' >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                        {cities1?.map((data) => (
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
                                                        defaultValue={updatePage ? clinicDataToUpdate?.address?.zip : ''}
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
                                                        readOnly
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
                                                        readOnly
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
                                                        <Form.Control readOnly value={cities1 && cities1?.find((data) => data?._id === getValues('city'))?.name} />
                                                        :
                                                        <Form.Select
                                                            disabled={store?.getCitiesReducer?.loading || usePrimaryAsMailing}
                                                            {...register('mailingCity')}
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
                                    {posDetails.map((data, index) => (
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
                                                        onKeyPress={(event) => handleFirstSpace(event, 1)}
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
                                                        onKeyPress={handleFirstSpace}
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
                                                            onChange={(e) => handlePOSInputChange(e, 'contact', index)}
                                                            placeholder="1234-234-234"
                                                            onKeyPress={handleFirstSpace}
                                                            maxLength={10} // Corrected maxLength
                                                            minLength={9}  // Corrected minLength
                                                            isInvalid={!!errors?.contact} // Corrected validation for error display
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
                                <Button as={Link} to={'/apps/Practice/new-practice'} variant="primary" className='custom-buttons'>
                                    Add Multiple
                                </Button>
                                <Button variant="primary" className='custom-buttons' onClick={() => setShowModal(true)}>
                                    Change Password
                                </Button>

                                <Button variant="primary" type="submit" disabled={store?.createClinicsReducer?.loading} onClick={() => setNextClicked(true)} className='custom-buttons'>
                                    {store?.createClinicsReducer?.loading ?
                                        <Spinner color='white' className='spinner-border-sm' /> :
                                        'Save'
                                    }
                                </Button>
                            </Col>
                            <Col>
                                <ChangePasswordModal show={showModal} closeModal={closeModal} />
                            </Col>
                        </Row >
                    </Form >
                    <Row className='mt-2'>
                        <Col xs={12}>
                            <Row>
                                <Col>
                                    {store?.getSubClinicsReducer?.loading ? (
                                        <div className="text-center my-3">
                                            <Spinner />
                                        </div>
                                    ) : getTableData && getTableData.length === 0 ? (
                                        <div className="text-center my-3">
                                            {''}
                                        </div>
                                    ) : (
                                        <Table responsive className="table-centered table-nowrap mb-0">
                                            <thead className="text-white">
                                                <tr>
                                                    <th className="text-white">S.No.</th>
                                                    <th className="text-white">PRACTICE NAME</th>
                                                    <th className="text-white">PRACTICE TYPE</th>
                                                    <th className="text-white">STATUS</th>
                                                    <th className="text-white">ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getTableData?.map((patient, index) => (
                                                    <tr key={patient.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{patient.name}</td>
                                                        <td>{patient.clinicType}</td>
                                                        <td>
                                                            <Form.Switch checked={patient.status === patient.status} />
                                                        </td>
                                                        <td>
                                                            <div className="text-center">
                                                                <Link to={`/apps/Practice/new-practice?id=${patient?.userId?._id}`} className='text-black cursor-pointer ps-2'>
                                                                    <FiEdit className="fs-4 cursor-pointer" />
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </>

            )

            }



        </>
    );
}

export default ClinicForm;