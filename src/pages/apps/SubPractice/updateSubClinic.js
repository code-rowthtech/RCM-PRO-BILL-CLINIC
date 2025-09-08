import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Form, InputGroup, Modal, Row, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiDownloadCloud, FiEye } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { handleUpload } from '../../../helpers/HandleUpload';
import { encryptMessage } from '../../../cryptoUtils';
import { updateSubClinicAction } from '../../../redux/sub clinic/actions';
import { CiCircleMinus } from 'react-icons/ci';
import us from '../../../assets/images/flags/us.jpg';
import {
    getCities2Action,
    getCities3Action,
    getCitiesAction,
    getClinicAction,
    getClinicTypeAction,
    getStatesByCountryAction,
} from '../../../redux/actions';
import ToastHandle from '../../../helpers/ToastMessage';
import { MdVerified } from 'react-icons/md';
import EmailToDoctorModal from './EmailToSubClinicModal';
import AddressForm from '../Common Pages/AddressForm';
import TelecomFrom from '../Common Pages/TelecomFrom';
const SubUpdateClinic = () => {
    const [searchParams] = useSearchParams();
    const idUpdateDataSubClinics = searchParams.get('id');
    const clinicId = searchParams.get('clinicId');
    const logoFileInputRef = useRef(null);
    const [logo, setLogo] = useState(null);
    const [logoName, setLogoName] = useState('');
    const [btnShow, setBtnShow] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const closeModal = () => setShowModal(false);
    const [showModalPic, setShowModalPic] = useState(false); // State to control modal visibility
    const [updatePracticeAddresses, setUpdatePracticeAddresses] = useState([
        { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: '' },
    ]);
    const [subUpdatePracticeTelecom, setSubUpdatePracticeTelecom] = useState([{ system: '', value: '', use: '' }]);
    const [modalFileUrl, setModalFileUrl] = useState(''); // State to store file URL for modal
    const handleShowModal = (url) => {
        setModalFileUrl(url); // Set the URL of the file to display in modal
        setShowModalPic(true); // Open the modal
    };

    const handleCloseModal = () => {
        setShowModalPic(false); // Close the modal
        setModalFileUrl(''); // Reset file URL
    };

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

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const store = useSelector((state) => state);
    const clinectypes = store?.getClinicTypeReducer?.data?.result;
    const subClinicsDetailsGet = store?.getClinicsReducer?.data?.clinic;
    const [identifierDocument, setIdentifierDocumnent] = useState(false);
    useEffect(() => {
        if (subClinicsDetailsGet?.orgLogo?.url) {
            setLogo({ url: subClinicsDetailsGet.orgLogo.url });
        }
    }, [subClinicsDetailsGet]);
    const updateLoading = store?.updateSubClinicReducer?.loading;
    const updateSuccess = store?.updateSubClinicReducer?.data?.status;
    const [stateToSelect, setStateToSelect] = useState('');
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        if (showModalPic && modalFileUrl) {
            setImageLoading(true);
        }
    }, [showModalPic, modalFileUrl]);
    useEffect(() => {
        dispatch(getStatesByCountryAction());
    }, [dispatch]);

    useEffect(() => {
        if (stateToSelect) {
            dispatch(getCitiesAction({ state_code: stateToSelect, name: '', limit: 25, skip: '' }));
        }
    }, [stateToSelect]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue,
        getValues,
        watch,
        clearErrors,
    } = useForm({
    });
    // const closepassModal = () => {
    //     setPassShow(false);
    // }
    useEffect(() => {
        dispatch(getClinicTypeAction());
    }, [dispatch]);
    useEffect(() => {
        dispatch(getClinicAction({ key: encryptMessage({ clinicId: clinicId }) }));
    }, [idUpdateDataSubClinics]);

    const [formData, setFormData] = useState({
        clinicname: '',
        clinicType: '',
        email: '',
        contactPerson: '',
    });
    useEffect(() => {
        if (subClinicsDetailsGet) {
            if (subClinicsDetailsGet?.orgType) {
                setValue('clinicType', subClinicsDetailsGet?.orgType);
            }
            setValue('clinicname', subClinicsDetailsGet?.name);
            setValue('email', subClinicsDetailsGet?.userId?.email);
            if (subClinicsDetailsGet?.orgLogo) {
                setLogoName(subClinicsDetailsGet.orgLogo.fileName);
            }

            // ✅ Ensure at least 'NPI', 'CLIA', 'NAIC' are set
            let identifiers =
                subClinicsDetailsGet?.identifier?.map((data) => ({
                    type: data.identifierType || '',
                    number: data?.value || '',
                    file: data?.documents?.[0]?.url
                        ? {
                            url: data?.documents?.[0]?.url,
                            name: data?.documents?.[0]?.fileName || data?.documents?.[0]?.url?.split('/').pop(),
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
                subClinicsDetailsGet.telecom?.map((contact) => ({
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

            setSubUpdatePracticeTelecom(contacts);

            // ✅ Set Addresses
            setUpdatePracticeAddresses(
                subClinicsDetailsGet?.address?.map((addr) => ({
                    use: addr.use || '',
                    type: addr.type || '',
                    line: addr.line && Array.isArray(addr.line) ? addr.line : [''], // Ensure array
                    city: addr.city || '',
                    state: addr.state || '',
                    postalCode: addr.postalCode || '',
                    country: addr.country || '',
                })) || [{ use: '', line: [''], city: '', state: '', postalCode: '', country: '' }]
            );
            // ✅ Set POCs (Point of Contacts)
            setPocs(
                subClinicsDetailsGet?.poc?.map((pocs) => ({
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
    }, [subClinicsDetailsGet, setValue, clinectypes]);

    const [posDetails, setPosDetails] = useState([{ name: '', email: '', role: '', contact: '', fileName: '' }]);

    const handleAddPOS = () => {
        const isIncomplete = posDetails.some((pos) => !pos.name || !pos.role || !pos.contact || !pos.email);

        if (isIncomplete) {
            ToastHandle('Please fill all the fields before adding a new one', 'danger');
            return;
        }
        setPosDetails([...posDetails, { name: '', email: '', role: '', contact: '' }]);
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
                [field]: value,
            };
            return updatedDetails;
        });
    };
    const submitUpdateSubData = (data) => {
        const payload = {
            clinicId: clinicId,
            userId: idUpdateDataSubClinics,
            name: data?.clinicname,
            email: data?.email,
            orgType: data?.clinicType,
            orgLogo: {
                url: logo?.url?.split('?')[0] || '',
                fileName: logoName || '',
            },
            identifier: constantIdentifiers.map((item) => ({
                identifierType: item.type,
                use: item.use,
                value: item.number,
                ...(item?.file &&
                    item.file.url && { documents: { url: item.file.url, fileName: item.file.name || '' } }),
                expirationDate: item.expiry,
                status: 'active',
                system: 'urn:oid:2.16.840.1.113883.4.7',
                sliceName: item.type,
                issuingAuthority: item.issuingAuthority,
            })),
            telecom: subUpdatePracticeTelecom,
            address: updatePracticeAddresses,
            poc: pocs,
            flag: 'subClinic',
            ...(posDetails && { pos: posDetails }),
        };
        dispatch(updateSubClinicAction({ key: encryptMessage(payload) }));
    };
    useEffect(() => {
        if (updateSuccess === 200) {
            navigate('/apps/crm/addPractice');
        }
    }, [updateSuccess]);

    // new Chnages
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
        'CLIA',
        'CCN',
        'Taxonomy',
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
        { use: '', line: [''], city: '', state: '', postalCode: '', country: '' }, // Default address
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
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        } finally {
            setSelectedIndex(null); // Always reset after upload (success or error)
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
                <div className="container-fluid mt-2 px-0">
                    <Card className="px-md-2 py-md-2 scroll-container" style={{ height: '90vh', overflow: 'scroll' }}>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-between align-items-center">
                                <div>
                                    <ul className="nav nav-underline">
                                        <li className="nav-item">
                                            <button className="text-black nav-link font_active_tabs active">
                                                Practice Sub Update Information
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="d-flex gap-2  d-none d-md-block">
                                    {btnShow && (
                                        <>
                                            <Button as={Link} className="cancel-button" to={'/apps/crm/addPractice'}>
                                                Back
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <>
                                {store?.getClinicsReducer?.loading ? (
                                    <div
                                        className="d-flex justify-content-center align-items-center"
                                        style={{ height: '82vh' }}>
                                        <Spinner />
                                    </div>
                                ) : (
                                    <Form className="mt-1" onSubmit={handleSubmit(submitUpdateSubData)}>
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
                                                        {...register('clinicType', {
                                                            required: 'Practice Type is required',
                                                        })}
                                                        defaultValue=""
                                                        className="form-control"
                                                        data-has-value={!!watch('clinicType')}>
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
                                                <Form.Group className="mb-1 position-relative">
                                                    <Form.Label className="mb-0">
                                                        Email <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        data-has-value={!!watch('email')}
                                                        placeholder="Email"
                                                        disabled={true}
                                                        {...register('email', {
                                                            required: 'Email is required',
                                                            pattern: {
                                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                                message: 'Please enter a valid email address',
                                                            },
                                                        })}
                                                    />
                                                    <span
                                                        style={{ right: '2%', top: '43%' }}
                                                        className={`${subClinicsDetailsGet?.userId?.email
                                                            ? 'text-success position-absolute fs-4'
                                                            : 'd-none'
                                                            }`}>
                                                        <MdVerified />
                                                    </span>
                                                    {errors.email && (
                                                        <p className="text-danger">{errors.email.message}</p>
                                                    )}
                                                </Form.Group>
                                            </Col>

                                            <Col sm={3}>
                                                <Form.Label className="mb-0">Upload Logo</Form.Label>
                                                <div
                                                    onClick={handleLogoClick}
                                                    className={`custom-file-upload justify-content-between cursor-pointer ${logoName || logoUploading
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
                                                                    logo?.url || subClinicsDetailsGet?.orgLogo?.url
                                                                );
                                                                // Show the logo preview
                                                            }}
                                                            className="text-dark cursor-pointer"
                                                            style={{ zIndex: 1 }}
                                                        />
                                                        <p
                                                            className="mb-0 cursor-pointer"
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                const fileUrl = logo?.url || subClinicsDetailsGet?.orgLogo?.url;
                                                                const fileName = logoName || 'logo';
                                                                if (fileUrl) {
                                                                    try {
                                                                        const response = await fetch(fileUrl);
                                                                        const blob = await response.blob();
                                                                        const url = window.URL.createObjectURL(blob);
                                                                        const link = document.createElement('a');
                                                                        link.href = url;
                                                                        link.download = fileName;
                                                                        document.body.appendChild(link);
                                                                        link.click();
                                                                        document.body.removeChild(link);
                                                                        window.URL.revokeObjectURL(url);
                                                                        setTimeout(() => window.open(fileUrl, '_blank'), 100);
                                                                    } catch (error) {
                                                                        const link = document.createElement('a');
                                                                        link.href = fileUrl;
                                                                        link.download = fileName;
                                                                        link.target = '_blank';
                                                                        document.body.appendChild(link);
                                                                        link.click();
                                                                        document.body.removeChild(link);
                                                                    }
                                                                }
                                                            }}>
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
                                                        <Col>
                                                            <Form.Label>Identifier Document</Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Label>Issuing Authority</Form.Label>
                                                        </Col>
                                                        <Col>
                                                            <Form.Label>
                                                                Identifier Expiry{' '}
                                                                <span className="text-secondary">(If Applicable)</span>
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
                                                                    disabled={defaultIdentifiers.includes(item.type)}>
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
                                                                                : undefined
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
                                                                                !/^[A-Z0-9]{2}D[0-9]{7}$/.test(value)
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
                                                                    className={`custom-file-upload justify-content-between cursor-pointer ${item.file
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
                                                                            subClinicsDetailsGet?.orgLogo?.url) && (
                                                                                <FiEye
                                                                                    className="cursor-pointer"
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        e.stopPropagation();
                                                                                        handleShowModal(
                                                                                            item?.file?.url ||
                                                                                            subClinicsDetailsGet
                                                                                                ?.orgLogo?.url
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        <p
                                                                            className="mb-0 cursor-pointer"
                                                                            onClick={async (e) => {
                                                                                e.stopPropagation();
                                                                                const fileUrl = item?.file?.url;
                                                                                const fileName = item?.file?.name || 'document';
                                                                                if (fileUrl) {
                                                                                    try {
                                                                                        const response = await fetch(fileUrl);
                                                                                        const blob = await response.blob();
                                                                                        const url = window.URL.createObjectURL(blob);
                                                                                        const link = document.createElement('a');
                                                                                        link.href = url;
                                                                                        link.download = fileName;
                                                                                        document.body.appendChild(link);
                                                                                        link.click();
                                                                                        document.body.removeChild(link);
                                                                                        window.URL.revokeObjectURL(url);
                                                                                        setTimeout(() => window.open(fileUrl, '_blank'), 100);
                                                                                    } catch (error) {
                                                                                        const link = document.createElement('a');
                                                                                        link.href = fileUrl;
                                                                                        link.download = fileName;
                                                                                        link.target = '_blank';
                                                                                        document.body.appendChild(link);
                                                                                        link.click();
                                                                                        document.body.removeChild(link);
                                                                                    }
                                                                                }
                                                                            }}>
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
                                                                    onChange={(e) =>
                                                                        handleChange(index, 'expiry', e.target.value)
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
                                                constantContact={subUpdatePracticeTelecom}
                                                setConstantContact={setSubUpdatePracticeTelecom}
                                            />
                                            <hr className="mb-1" />
                                            <AddressForm
                                                addresses={updatePracticeAddresses}
                                                setAddresses={setUpdatePracticeAddresses}
                                            />
                                            <hr className="mb-1" />
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
                                                                    className="text-danger cursor-pointer position-absolute fs-5 fw-bold"
                                                                    style={{ right: '-1%', top: '50%' }}
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
                                                                            value={formatDisplayValue(telecom.value)} // Apply formatting
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
                                            <Col md={12} className="mt-1 d-flex gap-2 justify-content-end">
                                                <Button
                                                    variant="primary"
                                                    className="custom-buttons"
                                                    onClick={() => setShowModal(true)}>
                                                    Change Password
                                                </Button>

                                                <Button
                                                    variant="primary"
                                                    type="submit"
                                                    className="custom-buttons"
                                                    style={{ width: '65px' }}
                                                    disabled={updateLoading}>
                                                    {updateLoading ? (
                                                        <Spinner color="white" className="spinner-border-sm" />
                                                    ) : idUpdateDataSubClinics ? (
                                                        'Update'
                                                    ) : (
                                                        'Submit'
                                                    )}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                )}
                            </>
                        </div>
                    </Card>
                </div>
                {/* <ResetPassword closeModal={closepassModal} show={passShow} /> */}
                <EmailToDoctorModal
                    show={showModal}
                    formData={formData}
                    setFormData={setFormData}
                    closeModal={closeModal}
                />
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
                            src={modalFileUrl}
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

export default SubUpdateClinic;
