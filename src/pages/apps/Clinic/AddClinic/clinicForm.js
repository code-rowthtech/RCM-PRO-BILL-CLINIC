import React, { useEffect, useState, useRef } from 'react'
import { Col, Form, Row, Button, Table, Modal, InputGroup, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Spinner from '../../../../constants/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import profileDummy from '../../../../assets/images/profileDummy.png'
import us from '../../../../assets/images/flags/us.jpg'
import { createClinicAction, getCities2Action, getCitiesAction, getClinicAction, getClinicById, getClinicByParentAction, getClinicTypeAction, getStatesByCountryAction, updateClinicAction } from '../../../../redux/clinics/actions';
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
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked, MdVerified } from 'react-icons/md';


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
    console.log(logo, 'logo')
    const [accreditationLogo, setAccreditationLogo] = useState(null);
    const [addType, setAddType] = useState('');
    const [logoName, setLogoName] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModalPic, setShowModalPic] = useState(false);
    const [modalFileUrl, setModalFileUrl] = useState("");

    const handleShowModal = (url) => {
        setModalFileUrl(url);
        setShowModalPic(true);
    };

    const handleCloseModal = () => {
        setShowModalPic(false); // Close the modal
        setModalFileUrl(""); // Reset file URL
    };
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
    const handleAddTaxonomy = () => {
        const lastCode = taxonomyCodes[taxonomyCodes.length - 1];

        if (lastCode) {
            const validCodes = taxonomyCodes.filter((code) => code.trim() !== '');
            setTaxonomyCodes([...validCodes, '']);
        } else {
            ToastHandle('Please complete the current Taxonomy Code field before adding another.', 'danger')
        }
    };
    const handleTaxonomyChange = (index, value) => {
        const updatedCodes = [...taxonomyCodes];
        updatedCodes[index] = value;
        setTaxonomyCodes(updatedCodes);
    };
    const handleRemoveTaxonomy = (index) => {
        setTaxonomyCodes((prev) => {
            const updatedCodes = prev.filter((_, i) => i !== index);
            return updatedCodes.length > 0 ? updatedCodes : [''];
        });

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
    console.log({ clinicsDataGet })

    const setField = (key, value) => value && setValue(key, value);
    useEffect(() => {
        setField('clinicType', clinicsDataGet?.clinicType);
        setLogo(clinicsDataGet?.logo?.url);
        // setField('contact', clinicsDataGet?.userId?.phone?.startsWith("+1")
        //     ? clinicsDataGet.userId.phone.substring(2)
        //     : clinicsDataGet?.userId?.phone);
        setValue('contact', clinicsDataGet?.userId?.phone ? clinicsDataGet?.userId?.phone
            .replace(/\+1/, '') // Remove all non-numeric characters
            .replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) =>
                p3 ? `(${p1})${p2}-${p3}` : `(${p1})${p2}`
            )
            : '')
        setField('clinicname', clinicsDataGet?.name);
        setField('practiceSpecialty', clinicsDataGet?.practiceSpecialty);
        setField('taxId', clinicsDataGet?.taxIdOrEIN);
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
        } else {
            setAccreditationDetails([
                ...accreditationDetails,
                { name: '', number: '', url: null }
            ]);
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
        sessionStorage.setItem('logo', logo?.url?.split('?')[0] || clinicsDataGet?.logo?.url);
        const newPayload = {
            ...(clinicsList && { parentClinic: clinicId }),
            ...(updateId && { id: updateId }),
            name: data?.clinicname || clinicsDataGet?.name,
            practiceSpecialty: data?.practiceSpecialty || clinicsDataGet?.practiceSpecialty,
            email: data?.email || clinicsDataGet?.userId?.email,
            phone: '+1' + data?.contact?.replace(/\D/g, '') || '+1' + clinicsDataGet?.userId?.phone,
            clinicType: data?.clinicType || clinicsDataGet?.clinicType,
            taxIdOrEIN: data?.taxId?.replace(/\D/g, ''),
            npiNumber: data?.npi,
            CLIA_Number: data?.clia,
            medicareNumber: data?.medicare,
            medicaidNumber: data?.medicaid,
            taxonomyCodes: taxonomyCodes.filter(code => code),
            isPrimaryAndMailingAddressSame: usePrimaryAsMailing,
            flag: 'Clinic',
            ...stateDetails && { stateOfLicensing: stateDetails },
            ...accreditationDetails && { accreditationDetails: accreditationDetails },
            ...posDetails && { pos: posDetails },
            // ...(logo ?
            //     {
            logo: {
                url: logo,
                fileName: logoName,
            },
            // }
            // : ''),
            primaryAddress: {
                address: data?.address,
                ...(data?.city ? { city: data?.city } : ''),
                ...(data?._id ? { state: data?._id } : ''),
                ...(data?.stateName ? { state: data?.stateName } : ''),
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
        dispatch(createClinicAction({ key: encryptMessage(newPayload) }));
        console.log({ newPayload })
    };
    const logoFileInputRef = useRef(null);
    const accreditationFileInputRef = useRef(null);
    const medicalFileInputRef = useRef(null);
    const stateFileInputRef = useRef(null);
    const handleLogoClick = () => {
        logoFileInputRef.current.click();
    };

    const [logoUploading, setLogoUploading] = useState(false);
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setLogoUploading);
            setLogo(url?.url?.split('?')[0]);
            setLogoName(selectedFile?.name)
        } catch (error) {
            console.error('Error during file upload:', error);
        }
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
            console.error('Error during file upload:', error);
        }
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
                return data;
            } catch (error) {
                console.error("Failed to fetch geocode data:", error);
                return null;
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
                return data;
            } catch (error) {
                console.error("Failed to fetch geocode data:", error);
                return null;
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
                : [...prev, stateName];
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
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: '82vh' }}
                >
                    <Spinner />
                </div>

            ) : (
                <>
                    <Form onSubmit={handleSubmit(SubmitData)}>

                        <Row>
                            <Col sm={12} className='mb-2'><b>{subClinic}</b></Col>
                            <Col sm={3}>
                                <Form.Group className="mb-1">
                                    <Form.Label className='mb-0'>Practice Name <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        data-has-value={!!watch('clinicname')}

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
                            <Col sm={3}>
                                <Form.Group className="mb-1">
                                    <Form.Label className='mb-0'>Practice type <span className='text-danger'>*</span></Form.Label>
                                    <Form.Select
                                        className='form-control'
                                        data-has-value={!!watch('clinicType')}
                                        // defaultValue={updatePage ? clinicDataToUpdate?.clinicType : ''}
                                        {...register('clinicType', { required: 'This field is required' })}
                                    >
                                        <option value="" hidden  >Select Practice type</option>
                                        {clinectypes?.map((data) => (
                                            <option key={data?._id} value={data?.name}>{data?.name}</option>
                                        ))}
                                    </Form.Select>
                                    {errors.clinicType && <span className="text-danger">{errors.clinicType.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col sm={3}>
                                <Form.Group className="mb-1 position-relative">
                                    <Form.Label className='mb-0'>Email ID <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        disabled={true}
                                        type="text"
                                        data-has-value={!!watch('email')}
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
                                    <span
                                        style={{ right: "2%", top: '43%' }}
                                        className={`${clinicsDataGet?.userId?.verified_email ? 'text-success position-absolute fs-4' : 'd-none'}`}>
                                        <MdVerified />
                                    </span>

                                    {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col sm={3}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">
                                        Tax ID / EIN<span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        maxLength={10} // Includes the hyphen
                                        placeholder="Tax ID / EIN"
                                        data-has-value={!!watch('taxId')}
                                        value={
                                            getValues('taxId')?.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2$3') || '' // Format the value if necessary
                                        }
                                        {...register('taxId', {
                                            required: 'Tax ID / EIN is required',
                                            validate: (value) => {
                                                const rawValue = value?.replace(/\D/g, ''); // Strip non-digit characters
                                                return rawValue.length === 9 || 'Tax ID / EIN must be in the format 12-3456789';
                                            },
                                        })}
                                        onChange={(e) => {
                                            const rawValue = e.target.value.replace(/\D/g, ''); // Remove non-digits for storage
                                            setValue('taxId', rawValue, { shouldValidate: true });
                                            clearErrors('taxId'); // Clear validation errors
                                        }}
                                        onBlur={() => {
                                            const rawValue = getValues('taxId')?.replace(/\D/g, ''); // Strip non-digit characters
                                            if (rawValue && rawValue.length === 9) {
                                                setValue(
                                                    'taxId',
                                                    rawValue.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2$3'), // Format the value on blur
                                                    { shouldValidate: true }
                                                );
                                            }
                                        }}
                                    />
                                    {errors.taxId && <span className="text-danger">{errors.taxId.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-0 position-relative"  >
                                    <Form.Label className="mb-0">
                                        Contact Person <span className="text-danger">*</span>
                                    </Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text className="ps-3 pe-1 fw-bold text-black">
                                            &nbsp;&nbsp;+1
                                        </InputGroup.Text> {/* Prefix */}
                                        <Form.Control
                                            type="tel"
                                            data-has-value={!!watch('contact')}
                                            {...register('contact', {
                                                required: 'This field is required',
                                                pattern: {
                                                    value: /^\(\d{3}\)\d{3}-\d{4}$/,
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
                                                let rawValue = e.target.value.replace(/\D/g, '');
                                                if (rawValue.length > 10) rawValue = rawValue.slice(0, 10);
                                                const formattedValue = rawValue.replace(
                                                    /(\d{1,3})(\d{0,3})(\d{0,4})/,
                                                    (match, p1, p2, p3) => {
                                                        if (p3) return `(${p1})${p2}-${p3}`;
                                                        if (p2) return `(${p1})${p2}`;
                                                        return `(${p1}`;
                                                    }
                                                );
                                                e.target.value = formattedValue;
                                                clearErrors('phone');
                                            }}
                                            placeholder="(123)456-7890"
                                            maxLength={14}
                                            onKeyPress={(event) => {
                                                // Only allow numeric characters (0-9)
                                                if (!/[0-9]/.test(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }}
                                        />
                                    </InputGroup>

                                    {/* Country code flag */}
                                    <div className="position-absolute" style={{ top: '50%', left: '1%', transform: 'translateY(-16%)' }}>
                                        <img src={us} alt="country code flag" width={20} />
                                    </div>

                                    {/* Error message */}
                                    {errors.contact && (
                                        <span className="text-danger">{errors.contact.message}</span>
                                    )}
                                </Form.Group>
                            </Col>


                            <Col sm={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label className='mb-0'>NPI Type 2 Number <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        data-has-value={!!watch('npi')}
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

                            <Col sm={6} className="mb-1 d-flex flex-column position-relative">
                                <Form.Label className='mb-0'>Upload Logo</Form.Label>
                                <div
                                    onClick={handleLogoClick}
                                    className={`custom-file-upload justify-content-between cursor-pointer form-control ${logoName ? '' : 'custom-form-fields'
                                        }`}
                                    data-has-value={!!logoName}
                                >
                                    {/* Ensure logoName is a string or fallback to 'Upload Logo' */}
                                    {/* {typeof logoName === 'string' && logoName
                                        ? logoName.split('/').pop()
                                        : 'Upload Logo'} */}
                                    {
                                        logoUploading
                                            ? 'Uploading...'
                                            : typeof logoName === 'string' && logoName
                                                ? logoName.split('/').pop().slice(0, 30) + "..."
                                                : 'Upload Logo'
                                    }
                                    {/* {logoName} */}

                                    <div className="d-flex align-items-center gap-2">
                                        {logo && (
                                            <FiEye
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShowModal(logo);
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
                                    <Form.Label className="mb-0">
                                        Practice Specialty Description <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        data-has-value={!!watch('practiceSpecialty')}

                                        {...register('practiceSpecialty', {
                                            required: 'This field is required',
                                            validate: (value) => {
                                                if (value && value.startsWith(' ')) {
                                                    return 'First character cannot be a space';
                                                }
                                                return true;
                                            },
                                        })}
                                        // defaultValue={apiValue || ''} // Set default value from API
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            clearErrors('practiceSpecialty'); // Clear errors on valid input
                                        }}
                                        placeholder="Practice Specialty Description"
                                    />
                                    {errors.practiceSpecialty && (
                                        <span className="text-danger">{errors.practiceSpecialty.message}</span>
                                    )}
                                </Form.Group>
                            </Col>

                            {taxonomyCodes &&
                                taxonomyCodes.map((code, index) => (
                                    <Col sm={3} key={index}>
                                        <Form.Group className="mb-1 position-relative" style={{ minHeight: "80px" }}>
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
                                                data-has-value={!!watch('taxonomyCode')}
                                                {...register(`taxonomyCode[${index}]`, {
                                                    required: 'This field is required',
                                                    validate: (value) =>
                                                        value?.trim().length === value.length || 'Field cannot start or end with spaces',
                                                })}
                                                defaultValue={code || ''}
                                                placeholder="Taxonomy Code"
                                                maxLength={10}
                                                onKeyUp={(event) => handleFirstSpace(event, index)}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value.trimStart();
                                                    handleTaxonomyChange(index, inputValue);
                                                    clearErrors(`taxonomyCode[${index}]`);
                                                }}
                                            />
                                            <span
                                                style={{ top: '50%', right: '1%', zIndex: '1111', transform: 'translateY(-50%)' }}
                                                onClick={() => handleRemoveTaxonomy(index)} className={`${taxonomyCodes?.length === 1 ? 'd-none' : ''} uil-minus-circle  cursor-pointer position-absolute fs-5 fw-bold text-danger`}></span>
                                            {errors.taxonomyCode?.[index] && (
                                                <span className="text-danger" style={{ top: '100%' }}>

                                                    {errors.taxonomyCode[index]?.message}
                                                </span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                ))}

                            <Col sm={3}>
                                <Form.Group className="mb-1">
                                    <Form.Label className='mb-0'>CLIA Number </Form.Label>
                                    <Form.Control
                                        type="text"
                                        data-has-value={!!watch('clia')}

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
                                                value: /^[A-Z0-9]{2}D[0-9]{7}$/,
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
                                        data-has-value={!!watch('medicare')}
                                        {...register('medicare', {
                                            // required: 'Medicare Number is required',
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


                            <Col sm={3}>
                                <Form.Group className="mb-2">
                                    <Form.Label className='mb-0'>Medicaid Number </Form.Label>
                                    <Form.Control
                                        type="text"
                                        data-has-value={!!watch('medicaid')}
                                        {...register('medicaid', {
                                            // required: 'Medicaid Number is required',
                                            minLength: {
                                                value: 8,
                                                message: 'Medicaid Number must be 8 characters long',
                                            },
                                            maxLength: {
                                                value: 12,
                                                message: 'Medicaid Number must be 12 characters long',
                                            },
                                            pattern: {
                                                value: /^[0-9]+$/,
                                                message: 'Medicaid Number must contain numbers only',
                                            },
                                        })}
                                        placeholder="Medicaid Number"
                                        maxLength={12}
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
                            {accreditationDetails && accreditationDetails?.map((accreditation, index) => (
                                <React.Fragment key={index}>
                                    <Col sm={4} className='mb-md-0 mb-2'>
                                        <Form.Control
                                            data-has-value={!!accreditation?.name}
                                            type="text"
                                            value={accreditation?.name || ''}
                                            placeholder="Name"
                                            onChange={(e) => handleAccreditationInputChange(e, 'name', index)}
                                        />
                                    </Col>
                                    <Col sm={4} className='mb-md-0 mb-2'>
                                        <Form.Control
                                            type="text"
                                            data-has-value={!!accreditation?.number}
                                            value={accreditation?.number}
                                            // {...register('accDocno', {
                                            //     pattern: {
                                            //         value: /^[0-9]*$/,
                                            //         message: 'Document no must be a number'
                                            //     },
                                            // })}
                                            placeholder="Document Number"
                                            onChange={(e) => handleAccreditationInputChange(e, 'number', index)}
                                            onKeyUp={(event) => handleFirstSpace(event, 0)}
                                        />
                                        {errors.accDocno && <span className="text-danger">{errors.accDocno.message}</span>}
                                    </Col>
                                    <Col sm={4} className="mb-2 position-relative">
                                        <div
                                            onClick={(e) => document.getElementById(`fileInput-accreditation=${index}`).click()}
                                            className="custom-file-upload justify-content-between cursor-pointer d-flex align-items-center form-control"
                                            style={{ paddingTop: '6px', paddingBottom: '6px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}
                                            data-has-value={!!accreditation?.fileName}
                                        >
                                            <span style={{ flex: 1 }} className=''>
                                                {
                                                    newaccreditationLogo
                                                        ? 'Uploading...'
                                                        : accreditation.url
                                                            ? accreditation.fileName.split('/').pop().slice(0, 30)
                                                            : accreditation?.fileName || 'Upload Document'
                                                }
                                            </span>

                                            <div className="d-flex align-items-center gap-2">
                                                {accreditation.url && (
                                                    <FiEye
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent the file input from opening
                                                            handleShowModal(accreditation?.url); // Open the modal with the file URL
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
                                    <Col sm={4} className='mb-md-0 mb-2'>
                                        <Form.Control
                                            data-has-value={!!data.name}
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
                                            data-has-value={!!data.number}
                                            placeholder="Document Number"
                                            onChange={(e) => handleStateInputChange(e, 'number', index)}
                                        />
                                    </Col>
                                    <Col sm={4} className="mb-2 position-relative ">
                                        <div
                                            onClick={() => document.getElementById(`fileInput-state=${index}`).click()}
                                            className={`custom-file-upload justify-content-between cursor-pointer ${data.fileName || stateLogoUpload ? 'form-control' : 'custom-form-fields'}`}
                                            style={{ paddingTop: '7px', paddingBottom: '7px' }}
                                            data-has-value={!!data.fileName}
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
                                        <span className='text-black fw-semibold form-label'>Address Details  </span>
                                    </Col>
                                    <Col sm={6}>
                                        <Row className='position-relative'>
                                            <Col sm={12}>
                                                <Form.Group className="mb-1">
                                                    <Form.Label className="mb-0">Primary Address  <span className="text-danger">*</span></Form.Label>
                                                    <div style={{ position: 'relative' }}>
                                                        <Form.Control
                                                            data-has-value={!!watch('address')}
                                                            type="text"
                                                            defaultValue={updatePage ? clinicDataToUpdate?.address?.address : ''}
                                                            {...register('address', { required: "Primary Address is required" })}
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
                                                    {errors.address && (
                                                        <span className="text-danger">{errors.address.message}</span>
                                                    )}
                                                </Form.Group>
                                            </Col>

                                            <Col sm={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label className='mb-0'>Latitude <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        data-has-value={!!latitude}
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
                                                    <Form.Label className='mb-0'>Longitude <span className='text-danger'>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        data-has-value={!!longitude}
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
                                                    <Form.Label className='mb-0' >State <span className="text-danger">*</span></Form.Label>
                                                    <Form.Select
                                                        className='form-control'
                                                        {...register("stateName", { required: "State is required" })}
                                                        onChange={(e) => handleStateSelection(e)}
                                                        data-has-value={!!watch('stateName')}

                                                    >
                                                        <option value='' hidden>State</option>
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
                                                    {errors.stateName && (
                                                        <span className="text-danger">{errors.stateName.message}</span>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            <Col sm={6}>
                                                <Form.Group className="mb-1">
                                                    <Form.Label className='mb-0'>City <span className="text-danger">*</span></Form.Label>
                                                    <Form.Select
                                                        className='form-control'
                                                        data-has-value={!!watch('city')}

                                                        disabled={store?.getCitiesReducer?.loading}
                                                        {...register("city", { required: "City is required" })}
                                                    >
                                                        <option value='' hidden >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                        {cities1?.map((data) => (
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
                                                    <Form.Label className='mb-0'>Street <span className='text-danger'>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        data-has-value={!!watch('street')}

                                                        {...register('street', {
                                                            required: "Street is required",
                                                        })}
                                                        onKeyPress={handleFirstSpace}
                                                        placeholder="Street" />

                                                    {errors.street && <span className="text-danger">{errors.street.message}</span>}
                                                </Form.Group>
                                            </Col>
                                            <Col sm={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label className='mb-0'>Zip <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        defaultValue={updatePage ? clinicDataToUpdate?.address?.zip : ''}
                                                        type="text"
                                                        data-has-value={!!watch('zip')}

                                                        {...register('zip', {
                                                            required: 'Zip is requried',
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
                                        <span className="text-black fw-semibold form-label">Mailing Address Details </span>
                                    </Col>
                                    {/* Checkbox for using primary address */}
                                    <Col sm={12} className="mb-1">
                                        <Form.Check
                                            type="checkbox"
                                            style={{ cursor: "pointer", color: "#6c757d" }}

                                            label="Same as Primary Address"
                                            // disabled={!getValues('zip')}
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
                                                    <Form.Label className="mb-0">Mailing Address <span className="text-danger">*</span></Form.Label>
                                                    <div style={{ position: 'relative' }}>
                                                        <Form.Control
                                                            data-has-value={!!watch('mailingAddress')}
                                                            type="text"
                                                            value={watch('mailingAddress')}
                                                            {...register('mailingAddress', {
                                                                required: 'Mailing Address is required',
                                                                maxLength: {
                                                                    value: 255,
                                                                    message: 'Mailing Address cannot exceed 255 characters',
                                                                },
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
                                                <Form.Group className="mb-2">
                                                    <Form.Label className="mb-0">Latitude <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={latitude1}
                                                        data-has-value={!!latitude1}
                                                        placeholder="Latitude"
                                                        readOnly
                                                        defaultValue={latitude1}
                                                    />
                                                    {errors.latitude && (
                                                        <span className="text-danger">{errors.latitude.message}</span>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            <Col sm={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label className="mb-0">Longitude <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        data-has-value={!!longitude1}
                                                        value={longitude1}
                                                        placeholder="Longitude"
                                                        readOnly
                                                        defaultValue={longitude1}
                                                    />
                                                    {errors.longitude && (
                                                        <span className="text-danger">{errors.longitude.message}</span>
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
                                                    <Form.Label className="mb-0">State <span className="text-danger">*</span></Form.Label>
                                                    {usePrimaryAsMailing ? (
                                                        <Form.Control
                                                        data-has-value={!!watch('mailingStateName')}
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
                                                            <option value="" hidden>State</option>
                                                            {statesData?.states?.map((data) => (
                                                                <option key={data?._id} value={data?._id}>
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
                                                    <Form.Label className="mb-0">City <span className="text-danger">*</span></Form.Label>
                                                    {usePrimaryAsMailing ? (
                                                        <Form.Control
                                                        data-has-value={!!watch('mailingCity')}
                                                            readOnly
                                                            value={cities1 && cities1?.find((data) => data?._id === getValues('city'))?.name || ''}
                                                        />
                                                    ) : (
                                                        <Form.Select
                                                            disabled={store?.getCitiesReducer?.loading || usePrimaryAsMailing}
                                                            {...register('mailingCity', {
                                                                required: 'City is required',
                                                            })}
                                                        >
                                                            <option value="" hidden>
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
                                                    <Form.Label className="mb-0">
                                                        Street <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        data-has-value={!!watch('mailingStreet')}
                                                        type="text"
                                                        {...register('mailingStreet', {
                                                            required: 'Street is required',
                                                        })}
                                                        placeholder="Street"
                                                        disabled={usePrimaryAsMailing}
                                                    />
                                                    {errors.mailingStreet && (
                                                        <span className="text-danger">{errors.mailingStreet.message}</span>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            {/* ZIP */}
                                            <Col sm={6}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label className="mb-0">Zip <span className='text-danger'>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        data-has-value={!!watch('mailingZip')}
                                                        {...register('mailingZip', {
                                                            required: !usePrimaryAsMailing && 'ZIP is required',
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
                                    {posDetails.map((data, index) => (
                                        <React.Fragment key={index}>
                                            <Col sm={12} className="form-label mb-0">
                                                {'POS ' + `${index + 1}`}
                                                <span
                                                    onClick={() => handleRemovePOS(index)}
                                                    className={`${posDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer fs-5 fw-bold text-danger`}>
                                                </span>
                                            </Col>

                                            {/* Full Name */}
                                            <Col sm={6}>
                                                <Form.Group className="mb-1">
                                                    <Form.Label className="mb-0">Full Name  {index === 0 && <span className='text-danger'>*</span>}</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={data?.name}
                                                        data-has-value={!!data?.name}
                                                        {...register(`name.${index}`, {
                                                            required: index === 0 && (!posDetails?.[0]?.name || posDetails[0]?.name.trim() === "") ? 'Full Name is required' : false,

                                                        })}
                                                        onChange={(e) => {
                                                            clearErrors(`name.${index}`);
                                                            handlePOSInputChange(e, 'name', index);
                                                        }}
                                                        placeholder="Full Name"
                                                    />
                                                    {errors?.name?.[index] && (
                                                        <span className="text-danger">
                                                            {errors.name[index]?.message}
                                                        </span>
                                                    )}
                                                </Form.Group>
                                            </Col>

                                            {/* Contact Email */}
                                            <Col sm={6}>
                                                <Form.Group className="mb-1">
                                                    <Form.Label className="mb-0">Contact Email  {index === 0 && <span className='text-danger'>*</span>}</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        value={data?.email}
                                                        data-has-value={!!data?.email}
                                                        {...register(`contactemail.${index}`, {
                                                            pattern: {
                                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                                message: 'Please enter a valid email address',
                                                            },
                                                            required: index !== 1 && (!posDetails?.[0]?.email || posDetails[0]?.email.trim() === "") ? 'Contact Email is required' : false,

                                                        })}
                                                        onChange={(e) => {
                                                            clearErrors(`contactemail.${index}`);
                                                            handlePOSInputChange(e, 'email', index);
                                                        }}
                                                        placeholder="Contact Email"
                                                    />
                                                    {errors?.contactemail?.[index] && (
                                                        <span className="text-danger">
                                                            {errors.contactemail[index]?.message}
                                                        </span>
                                                    )}
                                                </Form.Group>
                                            </Col>

                                            {/* Job Title / Role */}
                                            <Col sm={6}>
                                                <Form.Group className="mb-1">
                                                    <Form.Label className="mb-0">Job Title / Role {index === 0 && <span className='text-danger'>*</span>} </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={data?.role}
                                                        data-has-value={!!data?.role}
                                                        {...register(`role.${index}`, {
                                                            required: index !== 1 && (!posDetails?.[0]?.role || posDetails[0]?.role.trim() === "") ? 'Job Title / Role is required' : false,

                                                        })}
                                                        onChange={(e) => {
                                                            clearErrors(`role.${index}`);
                                                            handlePOSInputChange(e, 'role', index);
                                                        }}
                                                        placeholder="Job Title / Role"
                                                    />
                                                    {errors?.role?.[index] && (
                                                        <span className="text-danger">
                                                            {errors.role[index]?.message}
                                                        </span>
                                                    )}
                                                </Form.Group>
                                            </Col>

                                            {/* Contact Person */}
                                            <Col sm={6}>
                                                <Form.Group className="mb-2 position-relative" style={{ minHeight: '100px' }}>
                                                    <Form.Label className="mb-0">
                                                        Contact Person {index === 0 && <span className="text-danger">*</span>}
                                                    </Form.Label>
                                                    <InputGroup>
                                                        <InputGroup.Text className="ps-3 pe-1 fw-bold text-black">
                                                            &nbsp;&nbsp;+1
                                                        </InputGroup.Text>
                                                        <Form.Control
                                                            type="tel"
                                                            value={data.contact}
                                                            data-has-value={!!data?.contact}
                                                            {...register(`poccontact.${index}`, {
                                                                required: index !== 1 && (!posDetails?.[0]?.contact || posDetails[0]?.contact.trim() === "") ? 'Contact is required' : false,
                                                                pattern: {
                                                                    value: /^(\d{3}-\d{3}-\d{4}|\d{9,10})$/,
                                                                    message: 'Contact must be in the format XXX-XXX-XXXX or contain only 9–10 digits',
                                                                },
                                                                maxLength: {
                                                                    value: 10,
                                                                    message: 'Contact must not exceed 10 characters',
                                                                },
                                                                minLength: {
                                                                    value: 10,
                                                                    message: 'Contact must not be less than 10 digits',
                                                                },

                                                            })}
                                                            onChange={(e) => {
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
                                                            }}
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

                            <hr />
                            <Col md={12} className='mt-0 d-flex gap-2 justify-content-end'>
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
                                                    <th className="text-white">LOCATION</th>
                                                    <th className="text-white">PRACTICE TYPE</th>
                                                    <th className="text-white">SPECIALITY</th>
                                                    <th className="text-white">STATUS</th>
                                                    <th className="text-white">ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getTableData?.map((patient, index) => (
                                                    <tr key={patient?.id || `patient-${index}`}>
                                                        <td>{index + 1}</td>
                                                        <td>{patient.name}</td>
                                                        <td>{(patient?.userId?.primaryAddress?.city?.state_code || 'N/A') + ' / ' + (patient?.userId?.primaryAddress?.city?.name || 'N/A')}</td>
                                                        <td>{patient.clinicType}</td>
                                                        <td>{patient.practiceSpecialty || 'N/A'}</td>
                                                        <td>
                                                            <Form.Switch checked={patient.status === patient.status} />
                                                        </td>
                                                        <td>
                                                            <div className="text-center">
                                                                <Link to={`/apps/Practice/updateSubClinic?id=${patient?.userId?._id}&clinicId=${patient?._id}`} className='text-black cursor-pointer ps-2'>
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
                    <ChangePasswordModal show={showModal} closeModal={closeModal} />
                </>

            )

            }



        </>
    );
}

export default ClinicForm;