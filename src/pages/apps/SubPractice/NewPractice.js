import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Form, InputGroup, Modal, Row, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiDownloadCloud, FiEdit, FiEye, FiUploadCloud } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { FiInfo } from 'react-icons/fi';

// import EmailToSubClinicModal from './EmailToSubClinicModal';
import { handleUpload } from '../../../helpers/HandleUpload';
import { encryptMessage } from '../../../cryptoUtils';
import us from '../../../assets/images/flags/us.jpg';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import {
    createSubClinicAction,
    getSubClinicCitiesAction,
    getSubClinicTypeAction,
    updateSubClinicAction,
} from '../../../redux/sub clinic/actions';
// import ResetPassword from './ResetPassword';
import {
    getCitiesAction,
    getClinicAction,
    getClinicTypeAction,
    getRoleDataAction,
    getStatesByCountryAction,
} from '../../../redux/actions';
import AddressForm from '../Common Pages/AddressForm';
import TelecomFrom from '../Common Pages/TelecomFrom';
const NewPractice = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const [isModalRequest, setIsModalRequest] = useState(false);
    const [activeTab, setActiveTab] = useState('personalDetails');
    const [show, setShow] = useState(false);
    const [passShow, setPassShow] = useState(false);
    const logoFileInputRef = useRef(null);
    const [logo, setLogo] = useState(null);
    const [logoName, setLogoName] = useState('');
    const [subPracticeAddresses, setSubPracticeAddresses] = useState([
        { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: '' },
    ]);
    const [subPracticeTelecom, setSubPracticeTelecom] = useState([{ system: '', value: '', use: '' }]);
    const [btnShow, setBtnShow] = useState(true);
    const [showModalPic, setShowModalPic] = useState(false); // State to control modal visibility

    const [modalFileUrl, setModalFileUrl] = useState(''); // State to store file URL for modal
    const handleShowModal = (url) => {
        setModalFileUrl(url); // Set the URL of the file to display in modal
        setShowModalPic(true); // Open the modal
    };

    const handleCloseModal = () => {
        setShowModalPic(false); // Close the modal
        setModalFileUrl(''); // Reset file URL
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
            // setLogo(url?.url?.split('?')[0]);
            setLogo({ url: url?.url?.split('?')[0] });
            setLogoName(selectedFile?.name);
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };
    const [accreditationDetails, setAccreditationDetails] = useState([
        { name: '', number: '', url: null, fileName: '' },
    ]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const store = useSelector((state) => state);
    const clinectypes = store?.getClinicTypeReducer?.data?.result;
    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const clinic_MainId = JSON.parse(sessionStorage.getItem('hyper_user'));
    const clinicsDataGet = store?.getClinicsReducer?.data?.clinic;
    const createLoading = store?.createSubClinicsReducer?.loading;
    const createResponseOfSubClinics = store?.createSubClinicsReducer?.data?.status;
    const updateLoading = store?.updateSubClinicReducer?.loading;
    const [identifierDocument, setIdentifierDocumnent] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        dispatch(getStatesByCountryAction());
    }, [dispatch]);
    useEffect(() => {
        if (showModalPic && modalFileUrl) {
            setImageLoading(true);
        }
    }, [showModalPic, modalFileUrl]);


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
        setFormData('');
        setValue('');
    };
    const closepassModal = () => {
        setPassShow(false);
    };
    useEffect(() => {
        dispatch(getClinicTypeAction());
    }, [dispatch]);
    useEffect(() => {
        dispatch(getClinicAction({ key: encryptMessage({ clinicId: clinic_MainId?.clinicId }) }));
    }, [dispatch]);
 
    const [formData, setFormData] = useState({
        clinicname: '',
        clinicType: '',
        email: '',
        contactPerson: '',
    });
    // const setField = (key, value) => value && setValue(key, value);
    useEffect(() => {
        if (clinicsDataGet) {
            setValue('clinicType', clinicsDataGet?.orgType);
            setValue('clinicname', clinicsDataGet?.name);
            setValue('email', clinicsDataGet?.userId?.email);
            if (clinicsDataGet?.orgLogo) {
                setLogoName(clinicsDataGet.orgLogo.fileName);
            }

            // ✅ Ensure at least 'NPI', 'CLIA', 'NAIC' are set
            let identifiers =
                clinicsDataGet?.identifier?.map((data) => ({
                    type: data.identifierType || '',
                    number: data?.value || '',
                    // file: data?.file|| '',
                    file: data?.documents?.[0]?.fileName
                        ? {
                              url: data?.documents?.[0], // Store URL
                              name: data?.documents?.[0]?.fileName, // Extract filename from URL
                          }
                        : '',
                    expiry: data?.expirationDate || '',
                    issuingAuthority: data.issuingAuthority || '',
                    use: data.use || '',
                })) || [];
            // If no identifiers exist, default to 'NPI', 'CLIA', 'NAIC'
            if (identifiers.length === 0) {
                identifiers = defaultIdentifiers?.map((type) => ({
                    type,
                    number: '',
                    file: '',
                    expiry: '',
                    issuingAuthority: '',
                    use: '',
                }));
            }

            setConstantIdentifiers(identifiers);

            // ✅ Ensure at least 'phone' and 'email' are set
            let contacts =
                clinicsDataGet.telecom?.map((contact) => ({
                    system: contact.system || '',
                    value: contact.value || '',
                    use: contact.use || '',
                })) || [];

            if (contacts.length === 0) {
                contacts = contactDetails.map((system) => ({
                    system,
                    value: '',
                    use: '',
                }));
            }

            setSubPracticeTelecom(contacts);

            // ✅ Set Addresses
            setSubPracticeAddresses(
                clinicsDataGet?.address?.map((addr) => ({
                    use: addr.use || '',
                    type: addr.type || '',
                    line: addr.line && Array.isArray(addr.line) ? addr.line : [''], // Ensure array
                    city: addr.city || '',
                    state: addr.state || '',
                    postalCode: addr.postalCode || '',
                    country: addr.country || '',
                })) || [{ use: '', line: [''], city: '', state: '', postalCode: '', country: 'US' }]
            );

            // ✅ Set POCs (Point of Contacts)
            setPocs(
                clinicsDataGet?.poc?.map((pocs) => ({
                    name: {
                        use: pocs.name?.use || '',
                        text: pocs.name?.text || '',
                        family: pocs.name?.family || '',
                        given: pocs.name?.given || [''], // Ensure array
                        prefix: pocs.name?.prefix || [''], // Ensure array
                        suffix: pocs.name?.suffix || [], // Ensure array
                    },
                    email: pocs.email || '',
                    role: pocs.role || '',
                    telecom: pocs.telecom?.map((tele) => ({
                        system: tele.system || '',
                        value: tele.value || '',
                        use: tele.use || '',
                    })) || [{ system: '', value: '', use: '' }], // Default telecom
                })) || [
                    {
                        name: {
                            use: '',
                            text: '',
                            family: '',
                            given: [''],
                            prefix: [''],
                            suffix: [],
                        },
                        email: '',
                        role: '',
                        telecom: [{ system: '', value: '', use: '' }],
                    },
                ]
            );
        }
    }, [clinicsDataGet, setValue, clinectypes]);

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


    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'personalDetails') {
            setBtnShow(true);
        } else {
            setBtnShow(false);
        }
    };

    const [posDetails, setPosDetails] = useState([{ name: '', email: '', role: '', contact: '', fileName: '' }]);

    useEffect(() => {
        dispatch(
            getRoleDataAction({ clinicId: clinic_id, createdById: '', limit: 10, search: '', page: 1, status: true })
        );
    }, [dispatch]);

    const submitSubData = (formData) => {
        const newPayload = {
            clinicId: clinic_id,
            name: {
                text: formData?.clinicname,
            },
            email: formData?.email,
            orgType: formData?.clinicType,
            orgLogo: {
                url: logo?.url?.split('?')[0] || '',
                fileName: logoName || '',
            },
            identifier: constantIdentifiers.map((item) => ({
                identifierType: item.type,
                use: item.use,
                value: item.number,
                // documents: item.file
                //     ? { url: item.file.url?.url, fileName: item?.file.url?.name || '' }
                //     : { url: item.file?.url, fileName: item?.file?.name || '' },
                ...(item?.file && { documents: { url: item?.file?.url, fileName: item?.file?.name || '' } }),
                expirationDate: item.expiry,
                status: 'active',
                system: 'urn:oid:2.16.840.1.113883.4.7',
                sliceName: item.type,
                issuingAuthority: item.issuingAuthority,
            })),
            telecom: subPracticeTelecom,
            address: subPracticeAddresses,
            poc: pocs,
            flag: 'subClinic',
            // ...(posDetails && { pos: posDetails }),
        };

        dispatch(createSubClinicAction({ key: encryptMessage(newPayload) }));
        console.log(newPayload, 'newPayload');
    };

    useEffect(() => {
        if (createResponseOfSubClinics === 200 && !isModalRequest) {
            navigate('/apps/crm/addPractice');
        } else if (createResponseOfSubClinics === 400) {
            console.error('Error creating / updating the sub-clinic');
        }
    }, [createResponseOfSubClinics]);

    // new changes
    const defaultIdentifiers = ['NPI', 'CLIA', 'NAIC'];
    const defaultIssuingAuthority = [
        'NPPES',
        'CLIA',
        'State Licensing Authority',
        'IRS',
        'CMS',
        'The Joint Commission',
        'Dun & Bradstreet',
        'Other',
    ];
    const contactDetails = ['phone', 'email'];
    const uses = ['usual', 'old', 'temp', 'secondary', 'official'];
    const identifierOptions = [
        'NPI',
        'TIN',
        'NAIC',
        'Medicare',
        'Medicaid',
        'State License',
        'Accreditation',
        'CCN',
        'Taxonomy',
        'CLIA',
        'DUNS',
        'Facility ID',
    ];

    const [constantIdentifiers, setConstantIdentifiers] = useState([]);
    const [name, setName] = useState({
        use: '',
        text: '',
        family: '',
        given: [''],
        prefix: [''],
        suffix: [],
        period: { start: new Date().toISOString() },
    });
    const [addresses, setAddresses] = useState([
        { use: '', line: [''], city: '', state: '', postalCode: '', country: 'US' }, // Default address
    ]);
    // Load Default Identifiers & Contacts
    useEffect(() => {
        setConstantIdentifiers(
            defaultIdentifiers.map((type) => ({
                type,
                number: '',
                file: '',
                expiry: '',
                issuingAuthority: '',
                use: '',
            }))
        );
    }, []);

    // Function to Add New Fields
    const addIdentifier = () => {
        setConstantIdentifiers([
            ...constantIdentifiers,
            { type: '', number: '', file: '', expiry: '', issuingAuthority: '', use: '' },
        ]);
    };

    // Function to Remove Fields
    const removeIdentifier = (index) => {
        if (index < defaultIdentifiers.length) return;
        setConstantIdentifiers(constantIdentifiers.filter((_, i) => i !== index));
    };


    // Function to Handle Changes
    const handleChange = (index, field, value) => {
        const updatedIdentifiers = [...constantIdentifiers];
        updatedIdentifiers[index][field] = value;
        setConstantIdentifiers(updatedIdentifiers);
    };

    // State for POCs (at least one default POC)
    const [pocs, setPocs] = useState([
        {
            name: {
                use: '',
                text: '',
                family: '',
                given: [''],
                prefix: [''],
                suffix: [],
                // period: { start: '', end: '' },
            },
            email: '',
            role: '',
            telecom: [{ system: '', value: '', use: '' }],
        },
    ]);
    // Function to handle POC field changes
    const handlePocChange = (index, field, value) => {
        setPocs((prevPocs) => {
            const updatedPocs = [...prevPocs];
            const keys = field.split('.');
            let target = updatedPocs[index];
            for (let i = 0; i < keys.length - 1; i++) {
                target = target[keys[i]] = { ...target[keys[i]] };
            }
            target[keys[keys.length - 1]] = value;
            return updatedPocs;
        });
    };

    // Function to handle Telecom (Contact) field changes inside POCs
    const handleTelecomChange = (pocIndex, telecomIndex, field, value) => {
        const updatedPocs = [...pocs];
        updatedPocs[pocIndex].telecom[telecomIndex][field] = value;
        setPocs(updatedPocs);
    };

    // Function to add a new POC
    const addPoc = () => {
        setPocs([
            ...pocs,
            {
                name: {
                    use: 'official',
                    text: '',
                    family: '',
                    given: [''],
                    prefix: [''],
                    suffix: [],
                    // period: { start: '', end: '' },
                },
                email: '',
                role: '',
                telecom: [{ system: '', value: '', use: '' }],
            },
        ]);
    };

    // Function to remove a POC (at least one should remain)
    const removePoc = (index) => {
        if (pocs.length > 1) {
            setPocs(pocs.filter((_, i) => i !== index));
        }
    };

    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleIdentifierFileChange = async (e, index) => {
        setSelectedIndex(index); // Set the index of the selected identifier
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        try {
            const url = await handleUpload(selectedFile, setIdentifierDocumnent); // Upload file
            setConstantIdentifiers((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    file: {
                        url: url?.url?.split('?')[0],
                        name: selectedFile.name,
                    },
                };
                setSelectedIndex(null); // Reset selected index after upload
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };
    const formatDateForInput = (dateString) => {
        if (!dateString) return ''; // Return empty if no date
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
    };

    const formatDisplayValue = (value) => {
        if (!value) return '';
        const rawValue = value.replace(/\D/g, '');
        return rawValue.replace(/(\d{1,3})(\d{0,3})(\d{0,4})/, (match, p1, p2, p3) => {
            if (p3) return `(${p1})${p2}-${p3}`;
            if (p2) return `(${p1})${p2}`;
            return `(${p1}`;
        });
    };

    return (
        <>
            <div className="pt-1 pb-2">
                <div className="container-fluid mt- px-0">
                    <Card className="scroll-container px-md-2 py-md-2" style={{ height: '90vh', overflow: 'scroll' }}>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-between align-items-center">
                                <div>
                                    <ul className="nav nav-underline">
                                        <li className="nav-item">
                                            <button
                                                className={`text-black nav-link font_active_tabs ${
                                                    activeTab === 'personalDetails' ? 'active' : ''
                                                }`}
                                                onClick={() => handleTabChange('personalDetails')}>
                                                Practice Sub Information
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="d-flex gap-2  d-none d-md-block">
                                    {btnShow && (
                                        <>
                                            {/* 
                                                <Button onClick={() => setShow(true)} disabled={isButtonDisabled}>
                                                    Email to Sub Practice
                                                </Button>
                                           */}
                                            <Button className="cancel-button" as={Link} to={'/apps/crm/addPractice'}>
                                                Back
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {activeTab === 'personalDetails' && (
                                <>
                                    {store?.getClinicsReducer?.loading ? (
                                        <div
                                            className="d-flex justify-content-center align-items-center"
                                            style={{ height: '82vh' }}>
                                            <Spinner />
                                        </div>
                                    ) : (
                                        <Form className="mt-1" onSubmit={handleSubmit(submitSubData)}>
                                            <Row>
                                                <Col sm={3}>
                                                    <Form.Group className="mb-1">
                                                        <Form.Label className="mb-0">
                                                            Practice Name <span className="text-danger">*</span>
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            data-has-value={!!watch('clinicname')}
                                                            {...register('clinicname', {
                                                                required: 'Practice Name is required',
                                                            })}
                                                            onChange={(e) =>
                                                                formDataChange('clinicname', e.target.value)
                                                            }
                                                            placeholder="Practice name"
                                                        />
                                                        {errors.clinicname && (
                                                            <p className="text-danger">{errors.clinicname.message}</p>
                                                        )}
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={3}>
                                                    <Form.Group className="mb-1">
                                                        <Form.Label className="mb-0">
                                                            Practice type <span className="text-danger">*</span>
                                                        </Form.Label>
                                                        <Form.Select
                                                            data-has-value={!!watch('clinicType')}
                                                            {...register('clinicType', {
                                                                required: 'Practice Type is required',
                                                            })}
                                                            onChange={(e) =>
                                                                formDataChange('clinicType', e.target.value)
                                                            }
                                                            className="form-control"
                                                            defaultValue="">
                                                            <option value="" hidden>
                                                                Select Clinic type
                                                            </option>
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
                                                        <Form.Label className="mb-0">
                                                            Email <span className="text-danger">*</span>
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            data-has-value={!!watch('email')}
                                                            placeholder="Email"
                                                            {...register('email', {
                                                                required: 'Email is required',
                                                                pattern: {
                                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                                    message: 'Please enter a valid email address',
                                                                },
                                                            })}
                                                            onChange={(e) => formDataChange('email', e.target.value)}
                                                        />
                                                        {errors.email && (
                                                            <p className="text-danger">{errors.email.message}</p>
                                                        )}
                                                    </Form.Group>
                                                </Col>

                                                <Col sm={3}>
                                                    <Form.Label className="mb-0">Upload Logo</Form.Label>
                                                    <div
                                                        onClick={handleLogoClick}
                                                        className={`custom-file-upload justify-content-between cursor-pointer ${
                                                            logoName || logoUploading
                                                                ? 'form-control'
                                                                : 'custom-form-fields'
                                                        }`}>
                                                        {logoName
                                                            ? logoName.split('/').pop().slice(0, 30) + '...'
                                                            : logoUploading
                                                              ? 'Uploading...'
                                                              : 'Upload Logo'}
                                                        <div className="d-flex align-items-center gap-2">
                                                            <FiEye
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Prevent file input trigger
                                                                    handleShowModal(
                                                                        logo ? logo : clinicsDataGet?.orgLogo?.url
                                                                    );
                                                                    // Show the logo preview
                                                                }}
                                                                className="text-dark cursor-pointer"
                                                                style={{ zIndex: 1 }}
                                                            />
                                                            <p className="mb-0">
                                                                <FiDownloadCloud />
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Form.Control
                                                        type="file"
                                                        ref={logoFileInputRef}
                                                        style={{ display: 'none' }}
                                                        accept=".png, .jpg, .jpeg, .svg"
                                                        onChange={handleFileChange}
                                                    />
                                                </Col>
                                                <hr className="mb-1" />
                                                <Row>
                                                    <Col sm={12}>
                                                        <Row>
                                                            <Col sm={12}>
                                                                <h5>
                                                                    Identifiers
                                                                    <span
                                                                        className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                                                        onClick={addIdentifier}></span>
                                                                </h5>
                                                            </Col>
                                                        </Row>

                                                        {/* Table Header */}
                                                        <Row className="fw-bold">
                                                            <Col>
                                                                <Form.Label>Identifier Type</Form.Label>
                                                            </Col>
                                                            <Col>
                                                                <Form.Label>Identifier Number</Form.Label>
                                                            </Col>
                                                            <Col className="d-flex align-items-center gap-2">
                                                                <Form.Label>Identifier Document</Form.Label>

                                                                {/* Tooltip Icon */}
                                                                <OverlayTrigger
                                                                    placement="top"
                                                                    overlay={
                                                                        <Tooltip id="tooltip-identifier">
                                                                            File size should be less than 2MB. Supported
                                                                            formats: JPG, PNG, JPEG, PDF.
                                                                        </Tooltip>
                                                                    }>
                                                                    <span className="text-secondary cursor-pointer mb-2">
                                                                        <FiInfo size={15} />
                                                                    </span>
                                                                </OverlayTrigger>
                                                            </Col>
                                                            <Col>
                                                                <Form.Label>Issuing Authority</Form.Label>
                                                            </Col>
                                                            <Col>
                                                                <Form.Label>
                                                                    Identifier Expiry{' '}
                                                                    <span className="text-secondary">
                                                                        (If Applicable)
                                                                    </span>
                                                                </Form.Label>
                                                            </Col>
                                                        </Row>

                                                        {/* Dynamic Identifier Fields */}
                                                        {constantIdentifiers.map((item, index) => (
                                                            <Row key={index} className="mb-2">
                                                                {/* Identifier Type */}
                                                                <Col>
                                                                    <Form.Select
                                                                        value={item.type}
                                                                        data-has-value={
                                                                            !!watch(`identifiers[${index}].type`)
                                                                        }
                                                                        {...register(
                                                                            `identifiers[${index}].type`
                                                                            //  { required: 'Identifier Type is required' }
                                                                        )}
                                                                        onChange={(e) =>
                                                                            handleChange(index, 'type', e.target.value)
                                                                        }
                                                                        disabled={defaultIdentifiers.includes(
                                                                            item.type
                                                                        )}>
                                                                        <option value="" disabled>
                                                                            Select Identifier Type
                                                                        </option>
                                                                        {identifierOptions.map((option) => (
                                                                            <option
                                                                                key={option}
                                                                                className=""
                                                                                value={option}>
                                                                                {option}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Select>
                                                                    {errors?.[index]?.type && (
                                                                        <span className="text-danger">
                                                                            This field is required
                                                                        </span>
                                                                    )}
                                                                </Col>

                                                                {/* Identifier Number */}
                                                                <Col>
                                                                    <Form.Control
                                                                        type="text"
                                                                        placeholder="Document Number"
                                                                        value={item.number}
                                                                        maxLength={
                                                                            item.type === 'NPI' || item.type === 'CLIA'
                                                                                ? 10
                                                                                : item.type === 'NAIC'
                                                                                  ? 5
                                                                                  : 10
                                                                        }
                                                                        {...register(`identifiers[${index}].number`, {
                                                                            // required: defaultIdentifiers.includes(item.type)
                                                                            //     ? 'Document Number is required'
                                                                            //     : false,
                                                                            validate: (value) => {
                                                                                if (!value) return true; // Skip validation if field is empty (for dynamic fields)

                                                                                if (
                                                                                    item.type === 'NPI' &&
                                                                                    !/^[0-9]{10}$/.test(value)
                                                                                ) {
                                                                                    return 'NPI number must be exactly 10 digits long';
                                                                                }
                                                                                if (
                                                                                    item.type === 'CLIA' &&
                                                                                    !/^[A-Z0-9]{2}D[0-9]{7}$/.test(
                                                                                        value
                                                                                    )
                                                                                ) {
                                                                                    return 'CLIA number must be in the format XXDXXXXXXX, where X is alphanumeric and the rest are digits';
                                                                                }
                                                                                if (
                                                                                    item.type === 'NAIC' &&
                                                                                    !/^[0-9]{5}$/.test(value)
                                                                                ) {
                                                                                    return 'NAIC number must be exactly 5 digits long';
                                                                                }
                                                                                return true; // No validation for other types (like DUNS, etc.)
                                                                            },
                                                                        })}
                                                                        onChange={(e) => {
                                                                            let value = e.target.value;

                                                                            // Enforce length limit only for NPI, CLIA, and NAIC
                                                                            if (
                                                                                item.type === 'NPI' ||
                                                                                item.type === 'CLIA'
                                                                            ) {
                                                                                value = value.slice(0, 10);
                                                                            } else if (item.type === 'NAIC') {
                                                                                value = value.slice(0, 10);
                                                                            }

                                                                            handleChange(index, 'number', value);
                                                                        }}
                                                                    />
                                                                    {errors.identifiers?.[index]?.number && (
                                                                        <span className="text-danger">
                                                                            {errors.identifiers[index].number.message}
                                                                        </span>
                                                                    )}
                                                                </Col>

                                                                {/* File Upload */}
                                                                <Col className="mb-2 position-relative">
                                                                    <div
                                                                        onClick={() =>
                                                                            document
                                                                                .getElementById(
                                                                                    `fileInput-identifier-${index}`
                                                                                )
                                                                                .click()
                                                                        }
                                                                        className={`custom-file-upload justify-content-between cursor-pointer ${
                                                                            item.file
                                                                                ? 'form-control'
                                                                                : 'custom-form-fields'
                                                                        }`}>
                                                                        {index === selectedIndex
                                                                            ? 'Uploading...'
                                                                            : item.file?.name
                                                                              ? item.file.name.length > 30
                                                                                  ? item.file.name.slice(0, 25) + '...'
                                                                                  : item.file.name
                                                                              : 'Upload Document'}

                                                                        <div className="d-flex align-items-center gap-2">
                                                                            {(item?.file?.url ||
                                                                                clinicsDataGet?.orgLogo?.url) && (
                                                                                <FiEye
                                                                                    className="cursor-pointer"
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        e.stopPropagation();
                                                                                        handleShowModal(
                                                                                            item?.file?.url ||
                                                                                                clinicsDataGet?.orgLogo
                                                                                                    ?.url
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            )}
                                                                            <p className="mb-0">
                                                                                <FiDownloadCloud />
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <Form.Control
                                                                        type="file"
                                                                        id={`fileInput-identifier-${index}`}
                                                                        style={{ display: 'none' }}
                                                                        accept=".png, .jpg, .jpeg, .pdf"
                                                                        onChange={(e) =>
                                                                            handleIdentifierFileChange(e, index)
                                                                        }
                                                                    />
                                                                    {errors?.[index]?.file && (
                                                                        <span className="text-danger">
                                                                            Please upload a document
                                                                        </span>
                                                                    )}
                                                                </Col>

                                                                {/* Issuing Authority */}
                                                                <Col>
                                                                    <Form.Select
                                                                        value={item.issuingAuthority}
                                                                        data-has-value={
                                                                            !!watch(
                                                                                `identifiers[${index}].issuingAuthority`
                                                                            )
                                                                        }
                                                                        {...register(
                                                                            `identifiers[${index}].issuingAuthority`
                                                                        )}
                                                                        onChange={(e) =>
                                                                            handleChange(
                                                                                index,
                                                                                'issuingAuthority',
                                                                                e.target.value
                                                                            )
                                                                        }>
                                                                        <option value="" disabled>
                                                                            Select Issuing Authority
                                                                        </option>
                                                                        {defaultIssuingAuthority.map((option) => (
                                                                            <option key={option} value={option}>
                                                                                {option}
                                                                            </option>
                                                                        ))}
                                                                    </Form.Select>
                                                                    {errors?.[index]?.issuingAuthority && (
                                                                        <span className="text-danger">
                                                                            This field is required
                                                                        </span>
                                                                    )}
                                                                </Col>
                                                                {/* Expiry Date */}
                                                                <Col className="position-relative">
                                                                    <Form.Control
                                                                        type="date"
                                                                        value={
                                                                            item?.expiry
                                                                                ? formatDateForInput(item.expiry)
                                                                                : ''
                                                                        }
                                                                        min={new Date().toISOString().split('T')[0]} // Sets min date to today
                                                                        onChange={(e) =>
                                                                            handleChange(
                                                                                index,
                                                                                'expiry',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                    {index >= defaultIdentifiers?.length && (
                                                                        <span
                                                                            className="text-danger cursor-pointer position-absolute fs-5 fw-bold"
                                                                            style={{ right: '-2%', top: '12%' }}
                                                                            onClick={() => removeIdentifier(index)}>
                                                                            <CiCircleMinus />
                                                                        </span>
                                                                    )}
                                                                </Col>
                                                            </Row>
                                                        ))}
                                                    </Col>
                                                </Row>
                                                <hr className="mb-1" />
                                                <TelecomFrom
                                                    constantContact={subPracticeTelecom}
                                                    setConstantContact={setSubPracticeTelecom}
                                                />
                                                <hr className="mb-1" />
                                                <AddressForm
                                                    addresses={subPracticeAddresses}
                                                    setAddresses={setSubPracticeAddresses}
                                                />
                                                <hr className="mb-1" />
                                                <Row>
                                                    <Col sm={12}>
                                                        <h5>
                                                            Points of Contact (POC)
                                                            <span
                                                                className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                                                onClick={addPoc}></span>
                                                        </h5>
                                                    </Col>
                                                </Row>
                                                {pocs.map((poc, pocIndex) => (
                                                    <div key={pocIndex} className="p-2">
                                                        <Row>
                                                            <Col sm={6}>
                                                                <Form.Group className="mb-2">
                                                                    <Form.Label>Full Name</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={poc.name.text}
                                                                        onChange={(e) =>
                                                                            handlePocChange(
                                                                                pocIndex,
                                                                                'name.text',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        placeholder="Enter full name"
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            <Col sm={6} className="position-relative">
                                                                <Form.Group>
                                                                    <Form.Label>Role</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        placeholder="Enter Role"
                                                                        value={poc.role}
                                                                        onChange={(e) =>
                                                                            handlePocChange(
                                                                                pocIndex,
                                                                                'role',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                </Form.Group>
                                                                {pocs.length > 1 && (
                                                                    <span
                                                                        className="text-danger cursor-pointer position-absolute fs-5 fw-bolder"
                                                                        style={{ right: '-1%', top: '45%' }}
                                                                        onClick={() => removePoc(pocIndex)}>
                                                                        <CiCircleMinus />
                                                                    </span>
                                                                )}
                                                            </Col>

                                                            <Col sm={6}>
                                                                <Form.Group>
                                                                    <Form.Label>Email</Form.Label>
                                                                    <Form.Control
                                                                        type="email"
                                                                        placeholder="Enter Email"
                                                                        value={poc.email}
                                                                        onChange={(e) =>
                                                                            handlePocChange(
                                                                                pocIndex,
                                                                                'email',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                            {poc.telecom.map((telecom, telecomIndex) => (
                                                                <Col sm={6} key={telecomIndex}>
                                                                    <Form.Group className="mb-2 position-relative">
                                                                        <Form.Label className="mb-1">
                                                                            Phone Number
                                                                        </Form.Label>
                                                                        <InputGroup>
                                                                            {/* Country Code Prefix */}
                                                                            <InputGroup.Text className="ps-3 pe-1 p-0 fw-bold text-black">
                                                                                &nbsp;&nbsp;+1
                                                                            </InputGroup.Text>

                                                                            {/* Phone Input Field */}
                                                                            <Form.Control
                                                                                type="text"
                                                                                placeholder="Phone Number"
                                                                                value={formatDisplayValue(
                                                                                    telecom.value
                                                                                )} // Apply formatting
                                                                                onChange={(e) =>
                                                                                    handleTelecomChange(
                                                                                        pocIndex,
                                                                                        telecomIndex,
                                                                                        'value',
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                                maxLength={14} // To accommodate formatted (XXX)XXXXXXX
                                                                                onKeyPress={(event) => {
                                                                                    if (!/[0-9]/.test(event.key)) {
                                                                                        event.preventDefault(); // Prevent non-numeric input
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </InputGroup>

                                                                        {/* Flag Icon */}
                                                                        <div
                                                                            className="position-absolute"
                                                                            style={{ top: '52%', left: '1%' }}>
                                                                            <img
                                                                                src={us}
                                                                                alt="country code flag"
                                                                                width={20}
                                                                            />
                                                                        </div>
                                                                    </Form.Group>
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                    </div>
                                                ))}
                                                <hr className="mb-1" />

                                                <Col md={12} className=" d-flex gap-2 justify-content-end">
                                                    <Button
                                                        variant="primary"
                                                        type="submit"
                                                        className="custom-buttons"
                                                        style={{ width: '55px' }}
                                                        disabled={createLoading}>
                                                        {createLoading ? (
                                                            <Spinner color="white" className="spinner-border-sm" />
                                                        ) : (
                                                            'Next'
                                                        )}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    )}
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
                    <div className="d-flex justify-content-center">
                        <p className="fw-bold" style={{ color: '#6169D0' }}>
                            File Preview
                        </p>
                    </div>
                    <div
                        style={{
                            overflow: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '300px', // minimum height to keep space for loader
                        }}>
                        {imageLoading && (
                            <div className="d-flex justify-content-center align-items-center">
                                <Spinner />
                            </div>
                        )}
                        <img
                            src={modalFileUrl?.url || modalFileUrl}
                            alt="File Preview"
                            onLoad={() => setImageLoading(false)}
                            onError={() => setImageLoading(false)} // hide spinner on error too
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100vh',
                                objectFit: 'contain',
                                display: imageLoading ? 'none' : 'block', // hide while loading
                            }}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default NewPractice;
