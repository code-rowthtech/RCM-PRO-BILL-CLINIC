import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Col, Form, Row, Button, Table, Modal, InputGroup, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Spinner from '../../../../constants/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import profileDummy from '../../../../assets/images/profileDummy.png';
import us from '../../../../assets/images/flags/us.jpg';
import {
    createClinicAction,
    getCities2Action,
    getCities3Action,
    getCities4Action,
    getCities5Action,
    getCities6Action,
    getCitiesAction,
    getClinicAction,
    getClinicById,
    getClinicByParentAction,
    getClinicTypeAction,
    getStatesByCountryAction,
    updateClinicAction,
} from '../../../../redux/clinics/actions';
import { VscLoading } from 'react-icons/vsc';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaDownload, FaPlus } from 'react-icons/fa';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import { FiDownloadCloud, FiEdit, FiEye, FiInfo, FiMinus, FiTrash } from 'react-icons/fi';
import UploadToS3 from '../../../../helpers/uploads3';
import { handleUpload } from '../../../../helpers/HandleUpload';
import { encryptMessage } from '../../../../cryptoUtils';
import ToastHandle from '../../../../helpers/ToastMessage';
import { FiUploadCloud } from 'react-icons/fi';
import ChangePasswordModal from '../../../../components/ChangePasswordModal';
import { handleFirstSpace } from '../../../../helpers/noSpace';
import { getDoctorsAction, getSubClinicAction, updateSubClinicAction } from '../../../../redux/actions';
import { FormInput } from '../../../../components';
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked, MdVerified } from 'react-icons/md';
import { components } from 'react-select';
import AddressForm from '../../Common Pages/AddressForm';
import TelecomFrom from '../../Common Pages/TelecomFrom';

const ClinicForm = ({ setActiveTab, setClinicId, clinicId, setBillingId }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
    } = useForm();
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    // const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'));
    const updateId = searchParams.get('updateid');
    // const [selectedState, setSelectedState] = useState(null);
    const [logo, setLogo] = useState(null);
    // const [accreditationLogo, setAccreditationLogo] = useState(null);
    // const [addType, setAddType] = useState('');
    const [logoName, setLogoName] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showModalPic, setShowModalPic] = useState(false);
    const [modalFileUrl, setModalFileUrl] = useState('');
    const [imageLoading, setImageLoading] = useState(true);

    const handleShowModal = (url) => {
        setModalFileUrl(url);
        setShowModalPic(true);
    };
    const handleCloseModal = () => {
        setShowModalPic(false); // Close the modal
        setModalFileUrl(''); // Reset file URL
    };
    useEffect(() => {
        if (showModalPic && modalFileUrl) {
            setImageLoading(true);
        }
    }, [showModalPic, modalFileUrl]);
    const closeModal = () => setShowModal(false);
    // const [longitude, setLongitude] = useState(null);
    // const [longitude1, setLongitude1] = useState(null);
    // const [latitude, setLatitude] = useState(null);
    // const [latitude1, setLatitude1] = useState(null);
    // const [stateToSelect, setStateToSelect] = useState(null);
    const [nextClicked, setNextClicked] = useState(false);
    const clinectypes = store?.getClinicTypeReducer?.data?.result;
    const createResponse = store?.createClinicsReducer?.data?.status;
    const clinicDataToUpdate = store?.getClinicByIdReducer?.data?.clinic;
    const clinicsList = store?.getClinicsByParentReducer?.data?.data;
    const statesData = store?.getStatesReducer?.data;
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;
    const cities2 = store?.getCitiesReducer?.cities2?.data?.cities;
    const cities3 = store?.getCitiesReducer?.cities3?.data?.cities;
    // const [identifierDocument, setIdentifierDocumnent] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    // const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const [practiceAddresses, setPracticeAddresses] = useState([
        { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: '' },
    ]);
    const [practiceTelecom, setPracticeTelecom] = useState([{ system: '', value: '', use: '' }]);

    useEffect(() => {
        dispatch(getClinicAction({ key: encryptMessage({ clinicId: clinic_id?.clinicId }) }));
        dispatch(getSubClinicAction());
        // dispatch(getStatesByCountryAction());
    }, [dispatch]);
    const clinicsDataGet = store?.getClinicsReducer?.data?.clinic;
    const setField = (key, value) => value && setValue(key, value);
    useEffect(() => {
        if (clinicsDataGet) {
            setValue('clinicType', clinicsDataGet?.orgType);
            setField('clinicname', clinicsDataGet?.name);
            setField('email', clinicsDataGet?.userId?.email);
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
                              url: data?.documents?.[0]?.url, // Store URL
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

            setPracticeTelecom(contacts);

            // ✅ Set Addresses
            const newAddresses = clinicsDataGet?.address?.map((addr) => ({
                type: addr.type || '', // Make sure type is included
                use: addr.use || '',
                line: addr.line && Array.isArray(addr.line) ? addr.line : [''],
                city: addr?.city || '',
                state: addr.state || '',
                postalCode: addr.postalCode || '',
                country: addr.country || 'US',
            })) || [{ type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: 'US' }];
            setPracticeAddresses(newAddresses);
            if (statesData?.states) {
                newAddresses.forEach((address) => {
                    const state = statesData.states.find((s) => s.name === address.state);
                    if (!state) return;

                    if (address.type === 'physical') {
                        dispatch(
                            getCitiesAction({
                                state_code: state.id,
                                name: address.city,
                                limit: 25,
                                skip: '',
                            })
                        );
                    } else if (address.type === 'postal') {
                        dispatch(
                            getCities2Action({
                                state_code: state.id,
                                name: address.city,
                                limit: 25,
                                skip: '',
                            })
                        );
                    } else {
                        dispatch(
                            getCities3Action({
                                state_code: state.id,
                                name: address.city,
                                limit: 25,
                                skip: '',
                            })
                        );
                    }
                });
            }
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
    }, [clinicsDataGet, setValue, statesData, clinectypes]);

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
            clinicId: clinic_id?.clinicId,
            userId: clinic_id?._id,
            ...(clinicsList && { parentClinic: clinicId }),
            ...(updateId && { id: updateId }),
            name: data?.clinicname,
            // active: true,
            email: data?.email,
            orgType: data?.clinicType,
            // orgSpecialty: [],
            orgLogo: {
                url: logo?.url ? logo?.url?.split('?')[0] : '', // Check if url exists first
                fileName: logoName || '',
            },
            identifier: constantIdentifiers.map((item) => ({
                identifierType: item.type,
                use: item.use,
                value: item.number,
                documents: item.file ? { url: item.file.url, fileName: item.file.name || '' } : null,
                // documents: [item?.file?.url],
                expirationDate: item.expiry,
                status: 'active',
                system: 'urn:oid:2.16.840.1.113883.4.7',
                sliceName: item.type,
                issuingAuthority: item.issuingAuthority,
            })),
            telecom: practiceTelecom,
            address: practiceAddresses,
            poc: pocs,
        };
        dispatch(createClinicAction({ key: encryptMessage(newPayload) }));
    };
    const logoFileInputRef = useRef(null);
    const handleLogoClick = () => {
        logoFileInputRef.current.click();
    };

    const [logoUploading, setLogoUploading] = useState(false);
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setLogoUploading);
            setLogo({ url: url?.url?.split('?')[0] });
            setLogoName(selectedFile?.name);
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };

    useEffect(() => {
        if (clinicsDataGet?.clinicType) {
            setValue('clinicType', clinicsDataGet.clinicType);
        }
    }, [clinicsDataGet, setValue]);

    const getTableData = store.getSubClinicsReducer?.data?.clinics;
    console.log('getTableData', getTableData);
    const [statesMenu, setStatesMenu] = useState(false);
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
    const addressUses = ['work', 'temp', 'old', 'billing'];
    const addressTypes = ['physical', 'postal', 'both'];
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
        'DUNS',
        'CCN',
        'Taxonomy',
        'Facility ID',
    ];

    const contactOptions = ['phone', 'fax', 'email', 'pager', 'url', 'sms', 'other'];
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
        { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: 'US' }, // Default address
    ]);

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

    const addIdentifier = () => {
        setConstantIdentifiers([
            ...constantIdentifiers,
            { type: '', number: '', file: '', expiry: '', issuingAuthority: '', use: '' },
        ]);
    };

    const removeIdentifier = (index) => {
        if (index < defaultIdentifiers.length) return;
        setConstantIdentifiers(constantIdentifiers.filter((_, i) => i !== index));
    };

    const removeAddress = (index) => {
        if (addresses.length > 1) {
            setAddresses(addresses.filter((_, i) => i !== index));
        }
    };

    const handleChange = (index, field, value) => {
        const updatedIdentifiers = [...constantIdentifiers];
        updatedIdentifiers[index][field] = value;
        setConstantIdentifiers(updatedIdentifiers);
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
        const updatedPoc = [...pocs]; // Assuming pocList is your state
        let rawValue = value.replace(/\D/g, ''); // Remove non-numeric characters

        // Limit to 10 digits
        if (rawValue.length > 10) rawValue = rawValue.slice(0, 10);

        // Format as (XXX)XXXXXXX
        const formattedValue = rawValue.replace(/(\d{1,3})(\d{0,7})/, (match, p1, p2) => {
            if (p2) return `(${p1})${p2}`;
            return `(${p1}`;
        });

        updatedPoc[pocIndex].telecom[telecomIndex][field] = formattedValue; // Store formatted number
        setPocs(updatedPoc);
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

    const handleIdentifierFileChange = async (e, index) => {
        setSelectedIndex(index);

        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        try {
            const url = await handleUpload(selectedFile, setImageLoading); // Upload file
            setConstantIdentifiers((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    file: {
                        url: url?.url?.split('?')[0],
                        name: selectedFile.name,
                    },
                };
                setSelectedIndex(null);

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
//  const handleUpdate = (patient) => {
//         const payload = { id: patient?._id, active: !patient?.active, category: 'Department' };
//         dispatch(updateSubClinicAction({ key: encryptMessage(payload) }));
//     };
    return (
        <>
            {store.getClinicsReducer?.loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '82vh' }}>
                    <Spinner />
                </div>
            ) : (
                <>
                    <Form onSubmit={handleSubmit(SubmitData)}>
                        <Row>
                            <Col sm={3}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">
                                        Practice Name <span className="text-danger">*</span>
                                    </Form.Label>
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
                                    {errors.clinicname && (
                                        <span className="text-danger">{errors.clinicname.message}</span>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={3}>
                                <Form.Group className="mb-1">
                                    <Form.Label className="mb-0">
                                        Practice type <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select
                                        className="form-control"
                                        {...register('clinicType', { required: 'This field is required' })}>
                                        <option value="" hidden>
                                            Select Practice type
                                        </option>
                                        {clinectypes?.map((data) => (
                                            <option key={data?._id} value={data?.name}>
                                                {data?.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.clinicType && (
                                        <span className="text-danger">{errors.clinicType.message}</span>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={3}>
                                <Form.Group className="mb-1 position-relative">
                                    <Form.Label className="mb-0">
                                        Email ID <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        disabled={true}
                                        type="text"
                                        {...register('email', {
                                            required: 'This field is required',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Please enter a valid email address',
                                            },
                                        })}
                                        placeholder="Email ID"
                                    />
                                    <span
                                        style={{ right: '2%', top: '43%' }}
                                        className={`${
                                            clinicsDataGet?.userId?.verified_email
                                                ? 'text-success position-absolute fs-4'
                                                : 'd-none'
                                        }`}>
                                        <MdVerified />
                                    </span>

                                    {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                </Form.Group>
                            </Col>

                            <Col sm={3}>
                                <Form.Label className="mb-0">Upload Logo</Form.Label>
                                <div
                                    onClick={handleLogoClick}
                                    className={`custom-file-upload justify-content-between cursor-pointer ${
                                        logoName || logoUploading ? 'form-control' : 'custom-form-fields'
                                    }`}>
                                    {logoName
                                        ? logoName.split('/').pop().slice(0, 30) + '...'
                                        : logoUploading
                                          ? 'Uploading...'
                                          : 'Upload Logo'}
                                    <div className="d-flex align-items-center gap-2">
                                        <FiEye
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleShowModal(logo || clinicsDataGet?.orgLogo?.url);
                                            }}
                                            className="text-dark cursor-pointer"
                                        />
                                        <p
                                            className="mb-0 cursor-pointer"
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                const fileUrl = logo?.url || clinicsDataGet?.orgLogo?.url;
                                                const fileName = logoName || 'logo';
                                                if (fileUrl) {
                                                    try {
                                                        // Try fetch method first
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
                                                    } catch (error) {
                                                        console.error(
                                                            'Fetch download failed, trying direct download:',
                                                            error
                                                        );
                                                        // Fallback to direct download
                                                        const link = document.createElement('a');
                                                        link.href = fileUrl;
                                                        link.download = fileName;
                                                        link.target = '_blank';
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                    }

                                                    // Also open in new tab
                                                    window.open(fileUrl, '_blank');
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
                                        <Col className="d-flex align-items-center gap-2">
                                            <Form.Label>Identifier Document</Form.Label>

                                            {/* Tooltip Icon */}
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip-identifier">
                                                        File size should be less than 2MB. Supported formats: JPG, PNG,
                                                        JPEG, PDF.
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
                                                <span className="text-secondary">(If Applicable)</span>{' '}
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
                                                    {...register(
                                                        `identifiers[${index}].type`
                                                        //  { required: 'Identifier Type is required' }
                                                    )}
                                                    onChange={(e) => handleChange(index, 'type', e.target.value)}
                                                    disabled={defaultIdentifiers.includes(item.type)}>
                                                    <option value="" disabled>
                                                        Select Identifier Type
                                                    </option>
                                                    {identifierOptions.map((option) => (
                                                        <option key={option} className="" value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                {errors?.[index]?.type && (
                                                    <span className="text-danger">This field is required</span>
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
                                                              ? 10
                                                              : item.type === 'Medicare'
                                                                ? 11
                                                                : item.type === 'Medicaid'
                                                                  ? 12
                                                                  : item.type === 'State License'
                                                                    ? 15
                                                                    : item.type === 'Accreditation'
                                                                      ? 10
                                                                      : item.type === 'CCN'
                                                                        ? 6
                                                                        : item.type === 'Taxonomy Code'
                                                                          ? 10
                                                                          : item.type === 'DUNS'
                                                                            ? 9
                                                                            : item.type === 'Facility ID'
                                                                              ? 12
                                                                              : 20
                                                    }
                                                    {...register(`identifiers[${index}].number`, {
                                                        // required: defaultIdentifiers.includes(item.type)
                                                        //     ? 'Document Number is required'
                                                        //     : false,
                                                        validate: (value) => {
                                                            if (!value) return true;

                                                            switch (item.type) {
                                                                case 'NPI':
                                                                    return (
                                                                        /^\d{10}$/.test(value) ||
                                                                        'NPI must be exactly 10 digits'
                                                                    );
                                                                case 'CLIA':
                                                                    return (
                                                                        /^[A-Z0-9]{2}D\d{7}$/.test(value) ||
                                                                        'CLIA must be in format XXDXXXXXXX'
                                                                    );
                                                                case 'NAIC':
                                                                    return (
                                                                        /^\d{5,10}$/.test(value) ||
                                                                        'NAIC must be 5 to 10 digits'
                                                                    );
                                                                case 'Medicare':
                                                                    return (
                                                                        /^[A-Z0-9]{11}$/.test(value) ||
                                                                        'Medicare ID must be 11 alphanumeric characters'
                                                                    );
                                                                case 'Medicaid':
                                                                    return (
                                                                        /^[A-Z0-9]{9,12}$/.test(value) ||
                                                                        'Medicaid ID must be 9–12 alphanumeric characters'
                                                                    );
                                                                case 'State License':
                                                                    return (
                                                                        /^[A-Z0-9]{5,15}$/.test(value) ||
                                                                        'State License must be 5–15 alphanumeric characters'
                                                                    );
                                                                case 'Accreditation':
                                                                    return (
                                                                        /^[A-Z0-9]{6,10}$/.test(value) ||
                                                                        'Accreditation ID must be 6–10 alphanumeric characters'
                                                                    );
                                                                case 'CCN':
                                                                    return (
                                                                        /^\d{6}$/.test(value) ||
                                                                        'CCN must be exactly 6 digits'
                                                                    );
                                                                case 'Taxonomy Code':
                                                                    return (
                                                                        /^\d{9}[A-Z]$/.test(value) ||
                                                                        'Taxonomy Code must be 9 digits + 1 uppercase letter'
                                                                    );
                                                                case 'DUNS':
                                                                    return (
                                                                        /^\d{9}$/.test(value) ||
                                                                        'DUNS must be exactly 9 digits'
                                                                    );
                                                                case 'Facility ID':
                                                                    return (
                                                                        /^[A-Z0-9]{6,12}$/.test(value) ||
                                                                        'Facility ID must be 6–12 alphanumeric characters'
                                                                    );
                                                                default:
                                                                    return true;
                                                            }
                                                        },
                                                    })}
                                                    onChange={(e) => {
                                                        let value = e.target.value;

                                                        // Enforce length limit only for NPI, CLIA, and NAIC
                                                        if (item.type === 'NPI' || item.type === 'CLIA') {
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
                                                        document.getElementById(`fileInput-identifier-${index}`).click()
                                                    }
                                                    className={`custom-file-upload justify-content-between cursor-pointer ${
                                                        item.file ? 'form-control' : 'custom-form-fields'
                                                    }`}>
                                                    {index === selectedIndex
                                                        ? 'Uploading...'
                                                        : item.file?.name
                                                          ? item.file.name.length > 30
                                                              ? item.file.name.slice(0, 25) + '...'
                                                              : item.file.name
                                                          : 'Upload Document'}
                                                    <div className="d-flex align-items-center gap-2">
                                                        {item?.file?.url && (
                                                            <FiEye
                                                                className="cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleShowModal(item?.file?.url);
                                                                }}
                                                            />
                                                        )}
                                                        <p
                                                            className="mb-0 cursor-pointer"
                                                            onClick={async (e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                if (item?.file?.url) {
                                                                    try {
                                                                        // Try fetch method first
                                                                        const response = await fetch(item.file.url);
                                                                        const blob = await response.blob();
                                                                        const url = window.URL.createObjectURL(blob);
                                                                        const link = document.createElement('a');
                                                                        link.href = url;
                                                                        link.download = item.file.name || 'document';
                                                                        document.body.appendChild(link);
                                                                        link.click();
                                                                        document.body.removeChild(link);
                                                                        window.URL.revokeObjectURL(url);
                                                                    } catch (error) {
                                                                        console.error(
                                                                            'Fetch download failed, trying direct download:',
                                                                            error
                                                                        );
                                                                        // Fallback to direct download
                                                                        const link = document.createElement('a');
                                                                        link.href = item.file.url;
                                                                        link.download = item.file.name || 'document';
                                                                        link.target = '_blank';
                                                                        document.body.appendChild(link);
                                                                        link.click();
                                                                        document.body.removeChild(link);
                                                                    }
                                                                    // Also open in new tab
                                                                    window.open(item.file.url, '_blank');
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
                                                    onChange={(e) => handleIdentifierFileChange(e, index)}
                                                />
                                                {errors?.[index]?.file && (
                                                    <span className="text-danger">Please upload a document</span>
                                                )}
                                            </Col>

                                            {/* Issuing Authority */}
                                            <Col>
                                                <Form.Select
                                                    value={item.issuingAuthority}
                                                    {...register(`identifiers[${index}].issuingAuthority`)}
                                                    onChange={(e) =>
                                                        handleChange(index, 'issuingAuthority', e.target.value)
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
                                                    <span className="text-danger">This field is required</span>
                                                )}
                                            </Col>
                                            {/* Expiry Date */}
                                            <Col className="position-relative">
                                                <Form.Control
                                                    type="date"
                                                    value={item?.expiry ? formatDateForInput(item.expiry) : ''}
                                                    min={new Date().toISOString().split('T')[0]} // Sets min date to today
                                                    onChange={(e) => handleChange(index, 'expiry', e.target.value)}
                                                />
                                                {index >= defaultIdentifiers?.length && (
                                                    <span
                                                        className="minusIcons cursor-pointer position-absolute fs-5 fw-bold"
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
                            <TelecomFrom constantContact={practiceTelecom} setConstantContact={setPracticeTelecom} />
                            <hr className="mb-1" />
                            <AddressForm addresses={practiceAddresses} setAddresses={setPracticeAddresses} />
                            <hr className="mb-1" />
                            <Row>
                                <Col sm={12} className='mt-2'>
                                    <h5>
                                        Points of Contact (POC)
                                        <span
                                            className="fs-5 uil-plus-circle plusicon fw-bold cursor-pointer"
                                            onClick={addPoc}></span>
                                    </h5>
                                </Col>
                            </Row>
                            {pocs.map((poc, pocIndex) => (
                                <div key={pocIndex} className="mb-2">
                                    <Row>
                                        <Col sm={6}>
                                            <Form.Group>
                                                <Form.Label  className="mb-0">Full Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={poc.name.text}
                                                    onChange={(e) =>
                                                        handlePocChange(pocIndex, 'name.text', e.target.value)
                                                    }
                                                    placeholder="Enter full name"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6} className="position-relative">
                                            <Form.Group>
                                                <Form.Label className='mb-0'>Role</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Role"
                                                    value={poc.role}
                                                    onChange={(e) => handlePocChange(pocIndex, 'role', e.target.value)}
                                                />
                                            </Form.Group>
                                            {pocs.length > 1 && (
                                                <span
                                                    className="minusIcons cursor-pointer position-absolute fs-5 fw-bold fw-bolder"
                                                    style={{ right: '-1%', top: '45%' }}
                                                    onClick={() => removePoc(pocIndex)}>
                                                    <CiCircleMinus />
                                                </span>
                                            )}
                                        </Col>

                                        <Col sm={6}>
                                            <Form.Group>
                                                <Form.Label className='mb-0'>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Enter Email"
                                                    value={poc.email}
                                                    onChange={(e) => handlePocChange(pocIndex, 'email', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        {poc?.telecom?.map((telecom, telecomIndex) => (
                                            <Col sm={6} key={telecomIndex}>
                                                <Form.Group className="mb-2 position-relative">
                                                    <Form.Label className="mb-0">Phone Number</Form.Label>
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
                                                        <img src={us} alt="country code flag" width={20} />
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            ))}

                            <Col md={12} className="mt-0 d-flex gap-2 justify-content-end">
                                <Button
                                    as={Link}
                                    to={'/apps/Practice/new-practice'}
                                    variant="primary"
                                    className="custom-buttons">
                                    Add Multiple
                                </Button>
                                <Button variant="primary" className="custom-buttons" onClick={() => setShowModal(true)}>
                                    Change Password
                                </Button>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={store?.createClinicsReducer?.loading}
                                    onClick={() => setNextClicked(true)}
                                    style={{ width: '55px' }}
                                    className="custom-buttons">
                                    {store?.createClinicsReducer?.loading ? (
                                        <Spinner color="white" className="spinner-border-sm" />
                                    ) : (
                                        'Save'
                                    )}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    <Row className="mt-2">
                        <Col xs={12}>
                            <Row>
                                <Col>
                                    {store?.getSubClinicsReducer?.loading ? (
                                        <div className="text-center my-3">
                                            <Spinner />
                                        </div>
                                    ) : getTableData && getTableData.length === 0 ? (
                                        <div className="text-center my-3">{''}</div>
                                    ) : (
                                        <Table responsive className="table-centered table-nowrap mb-0">
                                            <thead className="text-white">
                                                <tr>
                                                    <th className="text-white">S.No.</th>
                                                    <th className="text-white">PRACTICE NAME</th>
                                                    <th className="text-white">LOCATION</th>
                                                    <th className="text-white">PRACTICE TYPE</th>
                                                    {/* <th className="text-white">SPECIALITY</th> */}
                                                    <th className="text-white">STATUS</th>
                                                    <th className="text-white">ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getTableData?.map((patient, index) => (
                                                    <tr key={patient?.id || `patient-${index}`}>
                                                        <td>{index + 1}</td>
                                                        <td>{patient?.name}</td>
                                                        <td
                                                            className="cursor-pointer"
                                                            data-toggle="tooltip"
                                                            data-placement="top"
                                                            title={patient?.address?.[0]?.line?.[0]}>
                                                            {patient?.address?.[0]?.line?.[0]?.length > 27
                                                                ? patient?.address?.[0]?.line?.[0]?.slice(0, 26) + '...'
                                                                : patient?.address?.[0]?.line?.[0] || 'N/A'}
                                                        </td>
                                                        <td>{patient.orgType}</td>
                                                        {/* <td>{patient.practiceSpecialty || 'N/A'}</td> */}
                                                        {/* <td>
                                                            <Form.Switch
                                                                className={patient.active ? 'custom-active' : ''}
                                                                checked={patient.active === patient.status}
                                                            />
                                                        </td> */}
                                                        <td
                                                            className="py-1"
                                                            style={{ fontSize: '13px', fontWeight: '400' }}>
                                                            <Form.Switch
                                                                className={patient.active ? 'custom-active' : ''}
                                                                checked={patient.active}
                                                                // onChange={() => handleUpdate(patient)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div className="text-center">
                                                                <Link
                                                                    to={`/apps/Practice/updateSubClinic?id=${patient?.userId?._id}&clinicId=${patient?._id}`}
                                                                    className="text-black cursor-pointer ps-2">
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

                    <ChangePasswordModal show={showModal} closeModal={closeModal} />
                </>
            )}
        </>
    );
};

export default ClinicForm;
