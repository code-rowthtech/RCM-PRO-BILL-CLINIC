import React, { useEffect, useState, useRef } from 'react'
import { Col, Form, Row, Button, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Spinner from '../../../../constants/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import us from '../../../../assets/images/flags/us.jpg'
import {
    createClinicAction, deleteClinicAction, getCitiesAction, getClinicById,
    getClinicByParentAction, getStatesByCountryAction,
    stateEmptydAction, updateClinicAction
} from '../../../../redux/clinics/actions';
import { FiDownloadCloud, FiMinus } from 'react-icons/fi';
import { handleUpload } from '../../../../helpers/HandleUpload';
import { encryptMessage } from '../../../../cryptoUtils';
import ToastHandle from '../../../../helpers/ToastMessage';
import { handleFirstSpace } from '../../../../helpers/noBeginningSpace';

const ClinicForm = ({ setActiveTab, setClinicId, clinicId, setBillingId, setMultiple, setContractId, setResetEmail, setIsModalRequest, isModalRequest, resetEmail }) => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setError,
        setValue,
        clearErrors
    } = useForm();
    const [updatePage, setUpdatePage] = useState(false);
    const [counter, setCounter] = useState(0);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [logo, setLogo] = useState(null);
    const [parentClinic, setParentclinic] = useState(null);
    const [logoName, setLogoName] = useState(null);
    const [focused, setFocused] = useState(false);
    const [singleOrMultiple, setSingleOrMultiple] = useState(false);
    const [accreditationDetails, setAccreditationDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [medicalDetails, setMedicalDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [stateDetails, setStateDetails] = useState([
        { name: '', number: '', url: null, fileName: '' }
    ]);
    const [posDetails, setPosDetails] = useState([
        { name: '', email: '', role: '', contact: '' }
    ])

    // Get store Data 
    const store = useSelector((state) => state);
    const clinicTypeData = store?.getMastersDataReducer?.data?.clinicTypes;
    const createResponse = store?.createClinicsReducer?.data?.status;
    const clinicDataToUpdate = store?.getClinicByIdReducer?.data?.clinic;
    const clinicsList = store?.getClinicsByParentReducer?.data?.data;
    const decryptedRolesData = store?.getRolesDataReducer?.data?.roles;
    const statesData = store?.getStatesReducer?.data;
    // const state = statesData?.states && statesData?.states.find((data) => data?.state_code === 'NY')
    // console.log(state)
    const cities = store?.getCitiesReducer?.data?.cities;
    // ref init
    const logoFileInputRef = useRef(null);
    const accreditationFileInputRef = useRef(null);
    const medicalFileInputRef = useRef(null);
    const stateFileInputRef = useRef(null);

    useEffect(() => {
        if (decryptedRolesData) {
            const clinicRoleId = decryptedRolesData && decryptedRolesData.find(role => role?.name === "clinic")?._id;
            setResetEmail({ ...resetEmail, role: clinicRoleId })
        }
    }, [decryptedRolesData])
    // data consoles 
    // console.log(store?.createClinicsReducer?.data?.data, "store?.createClinicsReducer?.data")


    // handle Inputs
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
            (accreditation) =>
                !accreditation.name || !accreditation.number || !accreditation.url
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
            { name: '', email: '', role: null, contact: '' }
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
    const handleStateSelection = (e) => {
        setSelectedState(e.target.value)
        alert('ljhbvcbn')
        try {
            const selectedState = JSON.parse(e.target.value);
            if (selectedState?.state_code) {
                setSelectedState(selectedState);
                dispatch(getCitiesAction({ state_code: selectedState.id, name: '', limit: 25 }));
            }
        } catch (error) {
            console.error('Error parsing selected state:', error);
        }
    };

    const handleCitySelection = (e) => {
        const value = e.target.value;
        if (value) {
            try {
                const citySelected = JSON.parse(value);
                setSelectedCity(citySelected);
            } catch (error) {
                console.error('Invalid JSON:', value);
            }
        }
    };
    const deleteResponse = store?.deleteClinicOnboardingReducer?.data?.status;
    // create Response
    useEffect(() => {
        if (createResponse === 200) {
            // reset Data
            reset();
            setAccreditationDetails([{ name: '', number: '', url: null, fileName: '' }]);
            setPosDetails([{ name: '', number: '', url: null, fileName: '' }]);
            setStateDetails([{ name: '', number: '', url: null, fileName: '' }]);
            setMedicalDetails([{ name: '', number: '', url: null, fileName: '' }]);
            setSelectedCity(null);
            setSelectedState(null);

            if (!singleOrMultiple && !isModalRequest) {
                setBillingId(store?.createClinicsReducer?.data?.data?._id);
                setContractId(store?.createClinicsReducer?.data?.data?.clinicId?._id);
                setActiveTab('billing');
            } else {
                if (counter === 1) {
                    setParentclinic(store?.createClinicsReducer?.data?.data?.clinicId?._id);
                    setBillingId(store?.createClinicsReducer?.data?.data?._id);
                } else if (counter > 1 && clinicsList) {
                    setParentclinic(clinicsList[0]?.parentClinic)
                    setBillingId(clinicsList[0]?.parentClinic);
                }

            }

        }
        if (parentClinic || deleteResponse === 200) {
            const payload = {
                parentClinic: parentClinic,
            }
            dispatch(getClinicByParentAction({ key: encryptMessage(payload) }));
        }

    }, [createResponse, parentClinic, deleteResponse, counter]);
    // Submit Button 

    const [formValid, setFormValid] = useState(false)
    const clinicname = watch('clinicname');
    const email = watch('email');
    const contact = watch('contact');
    const clinicType = watch('clinicType');
    // console.log(clinicname, email, contact, clinicType)
    // Determine form validity
    const isFormValid = clinicname && email && contact && clinicType;
    useEffect(() => {
        if (resetEmail?.name && resetEmail?.email && resetEmail?.phone && resetEmail?.clinicType) {
            setFormValid(true)
        }
    }, [resetEmail])
    const onSubmit = (data) => {
        setIsModalRequest(false);
        const newPayload = {
            isParent: counter === 1 ? true : false, // Conditional property assignment using a ternary operator
            parentClinic: parentClinic,
            name: data?.clinicname,
            email: data?.email,
            role: decryptedRolesData && decryptedRolesData.find(role => role?.name === "clinic")?._id,
            phone: data?.contact,
            clinicType: data?.clinicType,
            taxIdOrEIN: data?.taxId,
            npiNumber: data?.npi,
            medicalLicenses: medicalDetails,
            stateOfLicensing: stateDetails,
            accreditationDetails: accreditationDetails,
            logo: logo?.url.split('?')[0],
            pos: posDetails,
            address: {
                address1: data?.address,
                city: selectedCity?._id,
                state: selectedState?._id,
                street: data?.street,
                zip: data?.zip,
                latitude: latitude,
                longitude: longitude,
            }
        };
        // console.log(newPayload, 'newPayloadnewPayloadnewPayload')
        dispatch(createClinicAction({ key: encryptMessage(newPayload) }));
    };

    const createData = store?.createClinicsReducer?.data?.data;
    const [createTableData, setCreateTableData] = useState(null);
    useEffect(() => {
        if (createData) {
            setCreateTableData(createData)
        }
    }, [createData]);

    const handleDeleteClinic = (data) => {
        const payload = {
            id: data
        }
        dispatch(deleteClinicAction({ key: encryptMessage(payload) }))
    }

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

    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [stateToSelect, setStateToSelect] = useState(null);
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

    useEffect(() => {
        if (stateToSelect) {
            console.log('called')
            dispatch(getCitiesAction({ state_code: stateToSelect?.id, name: '', limit: 25, skip: '' }));
        }
    }, [stateToSelect])
    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
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
                                    if (value.startsWith(' ')) {
                                        e.target.value = value.trimStart(); // Prevent spaces at the start
                                    }
                                    setResetEmail({ ...resetEmail, name: e.target.value });
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
                                onChange={(e) => setResetEmail({ ...resetEmail, clinicType: e.target.value })}
                            >
                                <option value="">Select clinic type</option> {/* Ensure this has a value to represent unselected */}
                                {clinicTypeData?.map((data) => (
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
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
                                        message: 'Please enter a valid email address'
                                    }
                                })}
                                onChange={(e) => setResetEmail({ ...resetEmail, email: e.target.value })}
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
                                // defaultValue={updatePage ? clinicDataToUpdate?.taxIdOrEIN : ''}
                                onKeyPress={(event) => handleFirstSpace(event, 0)}
                                placeholder="Tax ID / EIN" />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-0 position-relative">
                            <Form.Label className='mb-1'>Contact Person <span className='text-danger'>*</span></Form.Label>
                            <Form.Control
                                type="text"
                                style={{ paddingLeft: '5%' }}
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
                                        message: 'Contact must not be less than 10 digits '
                                    }
                                })}
                                onChange={(e) => {
                                    setResetEmail({ ...resetEmail, phone: e.target.value });
                                }}
                                defaultValue={updatePage ? clinicDataToUpdate?.phone : ''}
                                placeholder="1234-234-234"
                                maxLength={10}
                                onKeyPress={(event) => handleFirstSpace(event, 0)}
                            />
                            <div
                                className='position-absolute ' style={{ top: '52%', left: '1%' }}
                            >
                                <img
                                    src={us}
                                    alt="country code flag"
                                    width={20} />
                            </div>


                        </Form.Group>
                        {errors.contact && <span className="text-danger">{errors.contact.message}</span>}
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-2">
                            <Form.Label className='mb-1'>NPI Number</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('npi')}
                                defaultValue={updatePage ? clinicDataToUpdate?.npiNumber : ''}
                                placeholder="NPI Number"
                                onKeyPress={(event) => handleFirstSpace(event, 0)} />
                            {/* {errors.npi && <span className="text-danger">{errors.npi.message}</span>} */}
                        </Form.Group>
                    </Col>
                    <Col sm={6} className='mb-2 d-flex flex-column position-relative'>
                        <Form.Label>Upload Logo</Form.Label>
                        <div onClick={handleLogoClick}
                            className={`custom-file-upload justify-content-between cursor-pointer ${logoName ? '' : 'custom-form-fields'}`}>
                            {logoName ? logoName : 'Upload Logo'}
                            <p className='mb-0'><FiDownloadCloud /></p>
                        </div>
                        <Form.Control
                            type="file"
                            className="rounded-circle"
                            style={{ display: 'none' }}
                            // {...register('logoimage', { required: 'This field is required' })}
                            ref={logoFileInputRef}
                            accept=".png, .jpg, .jpeg, .svg" // Allow only specific file types
                            onChange={handleFileChange}
                        />
                        {/* {errors.logoimage && <span className="text-danger">{errors.logoimage.message}</span>} */}
                    </Col>
                    <hr />
                    <Col sm={12}>
                        <Form.Label>
                            Accreditation Details&nbsp;
                            <span
                                onClick={handleAddAccreditation}
                                className=' fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer'>
                                {/* <CiCirclePlus size={20} /> */}
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
                                    onKeyPress={handleFirstSpace}
                                />
                            </Col>
                            <Col sm={4}>
                                <Form.Control
                                    type="text"
                                    value={accreditation.number}
                                    placeholder="Document Number"
                                    onChange={(e) => handleAccreditationInputChange(e, 'number', index)}
                                    onKeyPress={(event) => handleFirstSpace(event, 0)}
                                />
                            </Col>
                            <Col sm={4} className="mb-2 position-relative">
                                <div
                                    onClick={() => document.getElementById(`fileInput-accreditation=${index}`).click()}
                                    //  onClick={() => accreditationFileInputRef.current.click()}
                                    className={`custom-file-upload justify-content-between cursor-pointer ${accreditation.fileName ? 'form-control' : 'custom-form-fields'}`}>
                                    {accreditation.fileName ? accreditation.fileName : 'Upload Document'}
                                    <p className='mb-0'><FiDownloadCloud /></p>
                                </div>
                                {/* <img className={`${accreditation ? "" : "d-none"}`} src={accreditation?.url} alt='...' /> */}
                                <Form.Control
                                    type="file"
                                    id={`fileInput-accreditation=${index}`}
                                    className="rounded-circle "
                                    style={{ display: 'none' }}
                                    ref={accreditationFileInputRef}
                                    onChange={(e) => handleAccreditationChange(e, index)}
                                />
                                <span
                                    onClick={() => handleRemoveAccreditation(index)}
                                    style={{ right: '-2%', top: '20%' }}
                                    className={`${accreditationDetails.length <= 1 ? 'd-none' : ''} uil-minus-circle cursor-pointer position-absolute fs-5 fw-bold text-danger`}>
                                    {/* <CiCircleMinus size={16} fontWeight={900} /> */}
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
                                className='plusicon ms-1 fs-5 uil-plus-circle fw-bold cursor-pointer'>
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
                                    onKeyPress={handleFirstSpace}
                                />
                            </Col>
                            <Col sm={4}>
                                <Form.Control
                                    type="text"
                                    value={medical.number}
                                    placeholder="Document Number"
                                    onChange={(e) => handleMedicalInputChange(e, 'number', index)}
                                    onKeyPress={(event) => handleFirstSpace(event, 0)}
                                />
                            </Col>
                            <Col sm={4} className="mb-2 position-relative ">
                                <div
                                    onClick={() => document.getElementById(`fileInput-medical=${index}`).click()}
                                    // onClick={() => medicalFileInputRef.current.click()}
                                    className={`custom-file-upload justify-content-between cursor-pointer ${medical.fileName ? 'form-control' : 'custom-form-fields'}`}>
                                    {medical.fileName ? medical.fileName : 'Upload Document'}
                                    <p className='mb-0'><FiDownloadCloud /></p>
                                </div>
                                <Form.Control
                                    type="file"
                                    className="rounded-circle "
                                    id={`fileInput-medical=${index}`}
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
                                className='plusicon ms-1 fs-5 uil-plus-circle fw-bold cursor-pointer'>
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
                                    onKeyPress={(event) => handleFirstSpace(event, 0)}
                                />
                            </Col>
                            <Col sm={4} className="mb-2 position-relative">
                                <div
                                    onClick={() => document.getElementById(`fileInput-state=${index}`).click()}
                                    // onClick={() => stateFileInputRef.current.click()}
                                    className={`custom-file-upload justify-content-between cursor-pointer ${data.fileName ? 'form-control' : 'custom-form-fields'}`}>
                                    {data.fileName ? data.fileName : 'Upload Document'}
                                    <p className='mb-0'><FiDownloadCloud /></p>
                                </div>
                                <Form.Control
                                    type="file"
                                    id={`fileInput-state=${index}`}
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
                                                                console.log(data)
                                                                setValue('zip', data?.components?.postcode)
                                                                setValue('stateName', data?.components?.state_code)
                                                                setLatitude(data?.bounds?.southwest?.lat);
                                                                setLongitude(data?.bounds?.southwest?.lng);
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
                                            <Form.Label className='mb-1'>State</Form.Label>
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
                                                    <option key={data?._id} value={JSON.stringify({ _id: data?._id, name: data?.name, latitude: data?.latitude, longitude: data?.longitude })}>
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
                                                defaultValue={updatePage ? clinicDataToUpdate?.address?.street : ''}
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
                                                {...register('zip')}
                                                onKeyPress={handleFirstSpace}
                                                placeholder="Zip" />
                                            {/* {errors.zip && <span className="text-danger">{errors.zip.message}</span>} */}
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
                                                onChange={(e) => handlePOSInputChange(e, 'email', index)}
                                                onKeyPress={handleFirstSpace}
                                                placeholder="Contact Email"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Job Title / Role</Form.Label>
                                            <Form.Control
                                                type='text'
                                                placeholder='Job Title / Role'
                                                onKeyPress={handleFirstSpace}
                                                onChange={(e) => handlePOSInputChange(e, 'role', index)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Phone Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={data.contact}
                                                onChange={(e) => handlePOSInputChange(e, 'contact', index)}
                                                onKeyPress={handleFirstSpace}
                                                placeholder="Phone Number"
                                                maxLength={10}
                                            />
                                        </Form.Group>
                                    </Col>
                                </React.Fragment>
                            ))}
                        </Row>

                    </Col>
                    <hr />
                    <Col md={12} className='mt-2 d-flex gap-2 justify-content-end'>

                        <Button variant="primary" type='submit' className='custom-buttons' disabled={!formValid || store?.createClinicsReducer?.loading} onClick={() => { setSingleOrMultiple(true); setCounter(counter + 1) }} >
                            {store?.createClinicsReducer?.loading && counter > 1 ?
                                <Spinner color='white' className='spinner-border-sm' />
                                :
                                'Add Multiple Clinics'
                            }
                        </Button>
                        <Button
                            variant="primary"
                            type={counter > 0 ? 'button' : 'submit'}
                            className='custom-buttons'
                            disabled={!formValid || store?.createClinicsReducer?.loading}
                            onClick={() => {
                                setSingleOrMultiple(false);
                                if (counter > 0 && !isModalRequest) {
                                    setMultiple(counter)
                                    setActiveTab('billing');
                                    setSingleOrMultiple(false);
                                    setCounter(0);
                                }
                            }}
                        >
                            {store?.createClinicsReducer?.loading && counter === 0 ?
                                <Spinner color='white' className='spinner-border-sm' />
                                :
                                'Next'
                            }
                        </Button>
                    </Col>
                </Row >
            </Form >
            <Row className={`${clinicsList?.length > 0 || counter === 1 ? '' : 'd-none'}`}>
                <Col>
                    <Table responsive className="mt-3 table-centered border border-muted table-nowrap mb-0 ">
                        <thead>
                            <tr>
                                <th>Clinic Name</th>
                                <th>Location</th>
                                <th>Clinic Type</th>
                                <th>Email</th>
                                <th>Contact</th>
                                {/* <th>Tax / EIN Id</th> */}
                                {/* <th></th> */}
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className={`${counter === 1 ? 'd-none' : ''}`}>
                            {store?.getClinicsByParentReducer?.loading ?
                                <tr>
                                    <td colSpan={5} className='text-center'>
                                        <Spinner />
                                    </td>
                                </tr>
                                :
                                clinicsList?.map((multipleData, index) => (
                                    <tr key={multipleData?._id}>
                                        <td className='text-capitalize'>{multipleData?.name}</td>
                                        <td>{(multipleData?.userId?.address?.city?.state_code || 'N/A') + ' / ' + (multipleData?.userId?.address?.city?.name || 'N/A')}</td>
                                        <td>{multipleData?.clinicType}</td>
                                        <td className='text-lowercase'>{multipleData?.userId?.email}</td>
                                        <td>{multipleData?.userId?.phone}</td>
                                        {/* <td>{multipleData?.taxIdOrEIN}</td> */}
                                        <td className='fs-4 d-flex gap-1'>
                                            {/* <i className="mdi mdi-square-edit-outline cursor-pointer"></i> */}
                                            <i
                                                className="mdi mdi-delete cursor-pointer"
                                                onClick={() => {
                                                    // if (index === 0) {
                                                    //     ToastHandle('The parent clinic cannot be deleted before deleting the subclinics added under it.', 'danger')
                                                    //     return;
                                                    // }
                                                    const payload = {
                                                        id: index === 0 ? multipleData?.clinicId : multipleData?._id,
                                                    };
                                                    dispatch(deleteClinicAction({ key: encryptMessage(payload) }));

                                                    // dispatch(stateEmptydAction());
                                                }}
                                            ></i>
                                        </td>
                                    </tr>
                                )
                                )}
                        </tbody>
                        <tbody className={`${counter === 1 ? '' : 'd-none'}`}>
                            <tr key={createTableData?._id}>
                                <td className='text-capitalize'>{createTableData?.clinicId?.name}</td>
                                <td>{(createTableData?.address?.state?.state_code || "N/A") + " / " + (createTableData?.address?.city?.name || "N/A")}</td>
                                <td>{createTableData?.clinicId?.clinicType}</td>
                                <td>{createTableData?.email}</td>
                                <td>{createTableData?.phone}</td>
                                <td>
                                    {/* <i className="mdi mdi-square-edit-outline cursor-pointer"></i> */}
                                    <i onClick={() => handleDeleteClinic(createTableData?._id)} className="mdi mdi-delete cursor-pointer"></i>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );
}

export default ClinicForm;