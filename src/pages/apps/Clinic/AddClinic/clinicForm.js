import React, { useEffect, useState, useRef } from 'react'
import { Col, Form, Row, Button, Table, Modal, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Spinner from '../../../../constants/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import profileDummy from '../../../../assets/images/profileDummy.png'
import us from '../../../../assets/images/flags/us.jpg'
import { createClinicAction, deleteClinicAction, getCitiesAction, getClinicAction, getClinicById, getClinicByParentAction, getClinicTypeAction, getStatesByCountryAction, stateEmptydAction, updateClinicAction } from '../../../../redux/clinics/actions';
import { VscLoading } from 'react-icons/vsc';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaDownload, FaPlus } from 'react-icons/fa';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import { FiDownloadCloud, FiMinus } from 'react-icons/fi';
import UploadToS3 from '../../../../helpers/uploads3';
import { handleUpload } from '../../../../helpers/HandleUpload';
import { encryptMessage } from '../../../../cryptoUtils';
import ToastHandle from '../../../../helpers/ToastMessage';
import { FiUploadCloud } from "react-icons/fi";
import ChangePasswordModal from '../../../../components/ChangePasswordModal';
import { handleFirstSpace } from '../../../../helpers/noSpace';


const ClinicForm = ({ setActiveTab, setClinicId, clinicId, setBillingId }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
        setError,
        clearErrors
    } = useForm();
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const updateId = searchParams.get('updateid');
    const [updatePage, setUpdatePage] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    console.log(selectedCity,'selectedCity')
    const [focused, setFocused] = useState(false);

    const [medicalLicenses, setMedicalLicenses] = useState(null);
    const [logo, setLogo] = useState(null);
    const [accreditationLogo, setAccreditationLogo] = useState(null);
    const [addType, setAddType] = useState('');
    const [logoName, setLogoName] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const closeModal = () => setShowModal(false);

    // const [clinicId, setClinicId] = useState(null);
    const [accreditationDetails, setAccreditationDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [medicalDetails, setMedicalDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [posDetails, setPosDetails] = useState([
        { name: '', email: '', role: '', contact: '', fileName: '' }
    ])

    const [stateDetails, setStateDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);

    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [stateToSelect, setStateToSelect] = useState(null);
    const [nextClicked, setNextClicked] = useState(false);
    const clinectypes = store?.getClinicTypeReducer?.data?.result
    console.log(clinectypes, 'clinic2')
    const createResponse = store?.createClinicsReducer?.data?.status;
    const clinicDataToUpdate = store?.getClinicByIdReducer?.data?.clinic;
    const clinicsList = store?.getClinicsByParentReducer?.data?.data;
    useEffect(() => {
        if (clinicId) {
            const payload = {
                parentClinic: clinicId,
            }
            dispatch(getClinicByParentAction({ key: encryptMessage(payload) }));
        }
        if (clinicDataToUpdate) {
            setAccreditationDetails(clinicDataToUpdate?.accreditationDetails)
            setMedicalDetails(clinicDataToUpdate?.medicalLicenses)
            setStateDetails(clinicDataToUpdate?.stateOfLicensing)
        }
    }, [clinicId, clinicDataToUpdate])
    const deleteClinicResponse = store?.deleteClinicOnboardingReducer?.data?.status;
    useEffect(() => {
        if (createResponse === 200) {
            if (clinicsList?.length > 0) {
                const payload = {
                    parentClinic: clinicId,
                }
                dispatch(getClinicByParentAction({ key: encryptMessage(payload) }));
            } else {
                setClinicId(store?.createClinicsReducer?.data?.data?._id);
                setBillingId(store?.createClinicsReducer?.data?.data?.clinicId)
            }
        }
        if (createResponse === 200 && nextClicked === true) {
            setActiveTab('billing');
        }
        if (deleteClinicResponse === 200) {
            const payload = {
                parentClinic: clinicId,
            }
            dispatch(getClinicByParentAction({ key: encryptMessage(payload) }));
        }
    }, [createResponse, deleteClinicResponse])
    useEffect(() => {
        dispatch(getClinicTypeAction())
    }, [dispatch]);


    useEffect(() => {
        if (updateId) {
            dispatch(getClinicById({ key: encryptMessage({ id: updateId }) }))
            setUpdatePage(true)
        }
        dispatch(getStatesByCountryAction());
    }, [dispatch, updateId, createResponse === 200]);
    const statesData = store?.getStatesReducer?.data;
    const cities = store?.getCitiesReducer?.data?.cities;
    const handleStateSelection = (e) => {
        setSelectedState(e.target.value)
        try {
            const selectedState = JSON.parse(e.target.value);
            if (selectedState?.state_code) {
                dispatch(getCitiesAction({ state_code: selectedState.id, name: '', limit: 25 }));
            }
        } catch (error) {
            console.error('Error parsing selected state:', error);
        }
    };

    const handleCitySelection = (e) => {
        const citySelected = JSON.parse(e.target.value);
        setSelectedCity(citySelected)
    }
    useEffect(() => {
        dispatch(getClinicAction());
    }, [dispatch])
    const clinicsDataGet = store?.getClinicsReducer?.data?.clinic;
    console.log(clinicsDataGet,'clinicsDataGet')
    const setField = (key, value) => value && setValue(key, value);
    useEffect(() => {
        setField('clinicType', clinicsDataGet?.clinicType);
        setField('contact', clinicsDataGet?.userId?.phone?.startsWith("+1")
            ? clinicsDataGet.userId.phone.substring(2)
            : clinicsDataGet?.userId?.phone);
        setField('clinicname', clinicsDataGet?.name);
        setField('taxId', clinicsDataGet?.taxIdOrEIN || '');
        setField('npi', clinicsDataGet?.npiNumber);
        setField('email', clinicsDataGet?.userId?.email);
        setField('address', clinicsDataGet?.userId?.address?.address1);
        setField('street', clinicsDataGet?.userId?.address?.street);
        setField('zip', clinicsDataGet?.userId?.address?.zip);
        setField('latitude', clinicsDataGet?.userId?.address?.latitude);
        setField('longitude', clinicsDataGet?.userId?.address?.longitude);
        setField('stateName', clinicsDataGet?.userId?.address?.state?.state_code);
        const selectedCity = cities && cities?.find((data) => data?._id === clinicsDataGet?.userId?.address?.city?._id)?._id
        const stateid = statesData?.states && statesData?.states?.find((data) => data?.state_code === clinicsDataGet?.userId?.address?.state?.state_code)?.id
        if (clinicsDataGet?.userId?.address?.state?.state_code) {
            dispatch(getCitiesAction({ state_code: stateid, name: clinicsDataGet?.userId?.address?.city?.name, limit: 25, skip: '' }));
        }
        setField('city', selectedCity);
        if (clinicsDataGet?.accreditationDetails) {
            setAccreditationDetails(clinicsDataGet?.accreditationDetails)
        }
        if (clinicsDataGet?.medicalLicenses) {
            setMedicalDetails(clinicsDataGet?.medicalLicenses)
        }
        if (clinicsDataGet?.pos) {
            setPosDetails(clinicsDataGet?.pos)
        }
        if (clinicsDataGet?.logo) {
            setLogoName(clinicsDataGet?.logo)
        }
        if (clinicsDataGet?.stateOfLicensing) {
            setStateDetails(clinicsDataGet?.stateOfLicensing)
        }
        const stateName = clinicsDataGet?.userId?.address?.state;

        if (stateName) {
            const matchingState = statesData?.states?.find(
                (state) => state.name === stateName
            );
            if (matchingState) {
                setValue('stateName', JSON.stringify({
                    name: matchingState?.name,
                    state_code: matchingState?.state_code,
                    id: matchingState?.id,
                    _id: matchingState?._id,
                }));
            }
        }
    }, [clinicsDataGet, statesData, setValue]);
    const SubmitData = (data) => {
        if (data.Password !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'Passwords do not match',
            });
            return;


        }
        const newPayload = {
            ...(clinicsList && { parentClinic: clinicId }),
            ...(updateId && { id: updateId }),
            name: data?.clinicname || clinicsDataGet?.name,
            email: data?.email || clinicsDataGet?.userId?.email,
            phone: '+1' + data?.contact || '+1' + clinicsDataGet?.userId?.phone,
            clinicType: data?.clinicType || clinicsDataGet?.clinicType,
            taxIdOrEIN: data?.taxId,
            npiNumber: data?.npi,
            medicalLicenses: medicalDetails,
            stateOfLicensing: stateDetails,
            accreditationDetails: accreditationDetails,
            pos: posDetails,
            logo: logo?.url?.split('?')[0],
            // logo: {
            //     url: logo?.url?.split('?')[0],
            //     fileName: logoName,
            // },
            address: {
                address1: data?.address,
                city: data?.city,
                state: stateToSelect?._id,
                street: data?.street,
                zip: data?.zip,
                latitude: latitude,
                longitude: longitude,
            }
        };
        dispatch(createClinicAction({ key: encryptMessage(newPayload) }));
    };

    console.log({ stateToSelect })

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

    const handleRemoveMedical = (index) => {
        setMedicalDetails((prevDetails) => {
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
            // Show a toast message if any field is incomplete
            ToastHandle('Please fill all the fields before adding a new one', 'danger');
            return;
        }
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
    useEffect(() => {
        if (clinicsDataGet?.clinicType) {
            setValue('clinicType', clinicsDataGet.clinicType); // Set the pre-selected value
        }
    }, [clinicsDataGet, setValue]);
    const [searchedLocations, setSearchedLocations] = useState(null)
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
                } else {
                    console.log("No data returned.");
                }
            });
    }

    // Example usage


    useEffect(() => {
        if (latitude && longitude) {
            setFocused(false);
        }
    }, [latitude, longitude])

    const stateGeoLocation = watch('stateName');

    useEffect(() => {
        if (stateGeoLocation) {
            setStateToSelect(statesData?.states && statesData?.states.find((data) => data?.state_code === stateGeoLocation));
        }
    }, [stateGeoLocation])

    const [citySearch, setCitySearch] = useState(null);
    useEffect(() => {
        if (citySearch) {
            setValue('city', cities && cities.find((data) => data?.name === citySearch)?._id)
        }
    }, [citySearch, cities])
    useEffect(() => {
        if (stateToSelect) {
            dispatch(getCitiesAction({ state_code: stateToSelect?.id, name: citySearch ? citySearch : '', limit: 25, skip: '' }));
        }
    }, [stateToSelect, citySearch])

    return (
        <>
            {/* <UploadToS3 /> */}
            <Form onSubmit={handleSubmit(SubmitData)}>
                <Row>
                    <Col sm={6}>
                    <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Clinic Name <span className='text-danger'>*</span></Form.Label>
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
                                placeholder="Clinic name"
                                onKeyPress={handleFirstSpace}
                            />

                            {errors.clinicname && <span className="text-danger">{errors.clinicname.message}</span>}

                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Clinic type <span className='text-danger'>*</span></Form.Label>
                            <Form.Select
                                // defaultValue={updatePage ? clinicDataToUpdate?.clinicType : ''}
                                {...register('clinicType', { required: 'This field is required' })}
                            >
                                <option value="">Select clinic type</option> 
                                {clinectypes?.map((data) => (
                                    <option key={data?._id} value={data?.name}>{data?.name}</option>
                                ))}
                            </Form.Select>
                            {errors.clinicType && <span className="text-danger">{errors.clinicType.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Email ID<span className='text-danger'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                // defaultValue={updatePage ? clinicDataToUpdate?.email : ''}
                                {...register('email', {
                                    required: 'This field is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                                        message: 'Please enter a valid email address'
                                    }
                                })}
                                onKeyPress={handleFirstSpace}
                                placeholder="Email ID"
                            />

                            {errors.email && <span className="text-danger">{errors.email.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>Tax ID / EIN</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('taxId')}
                                onKeyPress={(event) => handleFirstSpace(event, 0)}
                                maxLength={9}
                                placeholder="Tax ID / EIN" />
                            {errors.taxId && <span className="text-danger">{errors.taxId.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2 position-relative">
                            <Form.Label className="mb-1">Contact Person</Form.Label>
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
                                            value: 10,
                                            message: 'Contact must not be less than 10 digits'
                                        }
                                    })}

                                    placeholder="1234-234-234"
                                    maxLength={10}
                                    onKeyPress={(event) => handleFirstSpace(event, 0)}
                                />
                            </InputGroup>
                            {errors.contact1 && <span className="text-danger">{errors.contact1.message}</span>}
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
                            <Form.Label className='mb-1'>NPI Number</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('npi', {
                                    minLength: {
                                        value: 10,
                                        message: 'NPI must be at least 10 characters long', // Error message
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: 'NPI cannot exceed 10 characters', // Error message
                                    },
                                    pattern: {
                                        value: /^[0-9]+$/, // Pattern for numbers only
                                        message: 'NPI must contain numbers only', // Error message
                                    },
                                })}
                                placeholder="NPI Number"
                                maxLength={10}
                                onKeyPress={(event) => handleFirstSpace(event, 0)} />
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
                                    onKeyPress={(event) => handleFirstSpace(event, 0)}
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
                                    onKeyPress={(event) => handleFirstSpace(event, 0)}
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
                                    <option style={{ color: 'red !important' }}>State</option>
                                    {statesData?.states?.map((data, i) => (

                                        <option key={i} selected={data?.name === clinicsDataGet?.stateOfLicensing[index]?.name
                                        }
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
                                    {...register('stateDocno', {
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: 'Document no must be a number'
                                        },
                                    })}
                                    onChange={(e) => handleStateInputChange(e, 'number', index)}
                                    onKeyPress={(event) => handleFirstSpace(event, 0)}
                                />
                                {errors.stateDocno && <span className="text-danger">{errors.stateDocno.message}</span>}
                            </Col>
                            <Col sm={4} className="mb-2 position-relative">
                                <div
                                    onClick={() => stateFileInputRef.current.click()}
                                    className="custom-file-upload justify-content-between cursor-pointer"
                                >
                                    {data.url
                                        ? data.url.split('/').pop()
                                        : data?.fileName || 'Upload Document'}
                                    <p className="mb-0"><FiDownloadCloud /></p>
                                </div>

                                <Form.Control
                                    type="file"
                                    className="rounded-circle"
                                    style={{ display: 'none' }}
                                    ref={stateFileInputRef}
                                    onChange={(e) => handleStateChange(e, index)}
                                />

                                <span
                                    onClick={() => handleRemoveState(index)}
                                    style={{ right: '-2%', top: '20%' }}
                                    className={`${stateDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}
                                >
                                </span>
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
                                                    defaultValue={updatePage ? clinicDataToUpdate?.address?.address1 : ''}
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
                                                                setValue('zip', data?.components?.postcode)
                                                                setValue('stateName', data?.components?.state_code)
                                                                setLatitude(data?.bounds?.southwest?.lat);
                                                                setLongitude(data?.bounds?.southwest?.lng);
                                                                setCitySearch(data?.components?.county)
                                                                setValue('address', data?.formatted)
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
                                                <option>State</option>
                                                {statesData?.states?.map((data) => (
                                                    <option
                                                        key={data?.state_code} // Unique key for each option
                                                        // defau={JSON.stringify({ name: data?.name, state_code: data?.state_code, id: data?.id, _id: data?._id }) || data?.state_code}
                                                        value={data?.state_code}
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
                                                    <option key={data?._id} value={data?._id}>
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
                                <span className="text-black fw-semibold form-label">
                                    POC (Point of contact)
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
                                                onKeyPress={handleFirstSpace}
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
                        <Button variant="primary" className='custom-buttons' onClick={() => setShowModal(true)}>
                            Change Password
                        </Button>
                        {/* <Button variant="primary" type='submit' className='custom-buttons'>
                            Add Multiple
                        </Button> */}
                        <Button variant="primary" type="submit" disabled={store?.createClinicsReducer?.loading} onClick={() => setNextClicked(true)} className='custom-buttons'>
                            {store?.createClinicsReducer?.loading ?
                                <Spinner className="spinner-border-sm" />
                                :
                                'Save'
                            }
                        </Button>
                    </Col>
                    <Col>
                        <ChangePasswordModal show={showModal} closeModal={closeModal} />
                    </Col>
                </Row >
            </Form >
            {/* <Row className={`${clinicsList?.length > 0 ? '' : 'd-none'}`}>
                <Col>
                    <Table responsive className="mt-3 table-centered border border-muted table-nowrap mb-0 ">
                        <thead>
                            <tr>
                                <th className='text-white'>Clinic Name</th>
                                <th className='text-white'>Location</th>
                                <th className='text-white'>Specialist</th>
                                <th className='text-white'>Email</th>
                                <th className='text-white'>Contact</th>
                                <th className='text-white'>Tax / EIN Id</th>
                                <th className='text-white'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store?.getClinicsByParentReducer?.loading ?
                                <Spinner />
                                :

                                clinicsList?.map((multipleData, index) => (
                                    <tr key={multipleData?._id}>
                                        <td>{index}</td>
                                        <td className='text-capitalize'>{multipleData?.name}</td>
                                        <td>{multipleData?.address?.city?.state_code + ' / ' + multipleData?.address?.city?.name}</td>
                                        <td>{multipleData?.clinicType}</td>
                                        <td className='text-lowercase'>{multipleData?.email}</td>
                                        <td>{multipleData?.phone}</td>
                                        <td>{multipleData?.taxIdOrEIN}</td>
                                        <td className='fs-4 d-flex gap-1'>
                                            <i className="mdi mdi-square-edit-outline cursor-pointer"></i>
                                            <i
                                                className="mdi mdi-delete cursor-pointer"
                                                onClick={() => {
                                                    if (index === 0) {
                                                        ToastHandle('The parent clinic cannot be deleted before deleting the subclinics added under it.', 'danger')
                                                        return;
                                                    }
                                                    const payload = {
                                                        id: multipleData?._id,
                                                    };
                                                    dispatch(deleteClinicAction({ key: encryptMessage(payload) }));
                                                    dispatch(stateEmptydAction());
                                                }}
                                            ></i>
                                        </td>
                                    </tr>
                                )
                                )}
                        </tbody>
                    </Table>
                </Col>
            </Row> */}

        </>
    );
}

export default ClinicForm;