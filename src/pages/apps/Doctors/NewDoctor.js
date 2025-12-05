import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Form, InputGroup, Modal, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
    createDoctorAction,
    createDoctorDetailAction,
    getCitiesAction,
    getDoctorDetailsAction,
    getDoctorsAction,
    getRoleDataAction,
    getStatesByCountryAction,
} from '../../../redux/actions';
import EmailToDoctorModal from './EmailToDoctorModal';
import DepartmentDetails from './DepartmentDetails';
import Documents from './Documents';
import { handleUpload } from '../../../helpers/HandleUpload';
import { decryptMessage, encryptMessage } from '../../../cryptoUtils';
import us from '../../../assets/images/flags/us.jpg';
import { handleFirstSpace } from '../../../helpers/noSpace';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for eye visibility toggle
import { getDepartmentDataAction } from '../../../redux/settings/action';
// import AddressForm from '../Common Pages/AddressForm';
import { FiDownloadCloud } from 'react-icons/fi';
import DoctorAddress from './DoctorAddressForm';
import DoctorQualifications from './Qualifications';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import DepartmentModal from '../Settings/Department/DepartmentModal';
import { specialitiesData } from '../../../utils/DataSets/specialitiesData';

const NewDoctor = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        getValues,
        setValue,
        clearErrors,
    } = useForm();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [activeTab, setActiveTab] = useState('personalDetails');
    const logoFileInputRef = useRef(null);
    const [show, setShow] = useState(false);
    const [logo, setLogo] = useState(null);
    const [logoName, setLogoName] = useState('');
    const [logoUploading, setLogoUploading] = useState(false);
    const [docId, setDocId] = useState(null);
    const store = useSelector((state) => state);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const password = watch('password');
    const [showModalPic, setShowModalPic] = useState(false);
    const [modalFileUrl, setModalFileUrl] = useState('');
    const [imageLoading, setImageLoading] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [addDepartmentModal, setAddDepartmentModal] = useState(false);
    const [switchTabs, setSwitchTabs] = useState(false);

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
    const [demographicAddresses, setDemographicAddresses] = useState([
        {
            type: 'primary',
            line: [''],
            city: '',
            state: '',
            postalCode: '',
            country: '',
            telecom: [
                { system: 'phone', value: '', use: 'work' },
                { system: 'fax', value: '', use: 'work' },
            ],
        },
    ]);
    const statesData = store?.getStatesReducer?.data;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // If you want to remove any prefix (like "check")
    const updateId = id?.replace(/^check/, '');

    useEffect(() => {
        const fetchInitialData = async () => {
            dispatch(
                getRoleDataAction({
                    search: 'Doctor',
                    clinicId: clinicId,
                    status: true,
                    page: 1,
                    limit: 10,
                    createdById: '',
                })
            );

            if (updateId) {
                dispatch(getDoctorDetailsAction({ id: updateId }));
            }
            dispatch(getStatesByCountryAction());
        };

        fetchInitialData();
    }, [dispatch, updateId]);

    const doctorDetails = store?.getDoctorDetailsReducer?.data?.result;
    const createResponse = store?.createtDoctorsReducer?.data?.status;
    const updateResponse = store?.createtDoctorsDetailReducer?.data?.status;
    const newDoctorId = store?.createtDoctorsReducer?.data?.doctor?._id;
    const doctorRoleId = store?.getRoleDataReducer?.data?.roles?.[0]?._id;
    // const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const clinicId = decryptMessage(localStorage?.getItem('subClinicLocation')) || '';

    const createDepartmentResponse = store?.createMastersDataReducer?.data?.status;
    const departmentOptions = React.useMemo(() =>
        store?.getDepartmentDataReducer?.data?.result?.map((department) => ({
            value: department?.name,
            label: department?.name,
        })) || [],
        [store?.getDepartmentDataReducer?.data?.result]
    );
    useEffect(() => {
        dispatch(getDepartmentDataAction({ status: true, category: 'Department', limit: 50, skip: 1, search: '' }));
    }, []);

    useEffect(() => {
        if (createResponse === 200) {
            setDocId(newDoctorId);
            navigate(`/apps/providers/new-doctor?id=${newDoctorId}`);
            if (switchTabs && activeTab === 'personalDetails') {
                setActiveTab('departmentDetails');
                setSwitchTabs(false);
            }
        }
    }, [createResponse, switchTabs, activeTab, newDoctorId, navigate]);

    useEffect(() => {
        if (updateResponse === 200) {
            const payload = {
                id: updateId,
            };
            setSelectedDepartment(null);
            dispatch(getDoctorDetailsAction(payload));
            if (switchTabs) {
                if (activeTab === 'personalDetails') {
                    setActiveTab('departmentDetails');
                    dispatch(getDoctorsAction({ status: true, search: '', page: 1, limit: 10 }));
                } else if (activeTab === 'departmentDetails') {
                    setActiveTab('qualifications');
                } else if (activeTab === 'qualifications') {
                    navigate('/apps/providers/list');
                }
                setSwitchTabs(false);
            }
        }
    }, [updateResponse, switchTabs, activeTab, updateId, dispatch, navigate]);

    const closeModal = () => {
        setShow(false);
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        setLogoUploading(true);
        try {
            const url = await handleUpload(selectedFile, setLogoUploading);
            setLogo(url);
            setLogoName(selectedFile?.name);
        } catch (error) {
        } finally {
            setLogoUploading(false);
        }
    };

    const handleDownload = async (file) => {
        if (!file) return;
        const fileUrl = file?.url?.split('?')[0] || file;
        try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = logoName || 'profile-image';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            window.open(fileUrl, '_blank');
        } catch (error) {
            window.open(fileUrl, '_blank');
        }
    };

    useEffect(() => {
        if (doctorDetails && updateId) {
            const formData = {
                firstName: doctorDetails?.name?.[0]?.given || '',
                lastName: doctorDetails?.name?.[0]?.family || '',
                email: doctorDetails?.userId?.email || '',
                phone: doctorDetails?.telecom?.[0]?.value || '',
                gender: doctorDetails?.userId?.gender || '',
                specialist: doctorDetails?.specialties?.[0] || '',
                dateOfBirth: doctorDetails?.userId?.dob
                    ? new Date(doctorDetails.userId.dob).toISOString().split('T')[0]
                    : ''
            };
            Object.entries(formData).forEach(([key, value]) => {
                if (value) setValue(key, value);
            });
            if (doctorDetails?.department && departmentOptions.length > 0) {
                setSelectedDepartment(departmentOptions.find(data => data?.value === doctorDetails.department) || null);
            }
            if (doctorDetails?.address) {
                setDemographicAddresses(doctorDetails.address);
            }
            if (doctorDetails?.photo?.[0]?.title) {
                setLogoName(doctorDetails.photo[0].title);
            }
        }
    }, [doctorDetails, updateId, setValue, departmentOptions]);

    useEffect(() => {
        if (doctorDetails && updateId && statesData?.states) {
            const state = statesData.states.find((data) => data?.name === doctorDetails?.address?.[0]?.state)?.id;
            if (state && doctorDetails?.address?.[0]?.city) {
                dispatch(
                    getCitiesAction({ state_code: state, name: doctorDetails.address[0].city, limit: 10, skip: 1 })
                );
            }
        }
    }, [statesData, doctorDetails, updateId, dispatch]);

    const handleNewDoctor = () => {
        navigate('/apps/providers/list');
        reset();
        setSelectedDepartment(null);
    };

    const submitData = (data) => {
        const payload = {
            ...(updateId ? { doctorId: store?.getDoctorDetailsReducer?.data?.result?._id } : {}), // Conditionally add id if updateId exists
            clinicId: clinicId,
            email: data?.email,
            ...(!updateId ? { password: data?.password } : {}),
            dob: data?.dateOfBirth,
            gender: data?.gender,
            name: {
                use: 'official',
                text: `${data?.firstName || ''} ${data?.lastName || ''}`.trim(),
                family: data?.lastName,
                given: data?.firstName,
            },
            photo: [
                {
                    contentType: logo?.type || 'image/jpeg',
                    url: logo?.url?.split('?')[0] || logo,
                    data: logo?.data || null,
                    hash: logo?.hash || null,
                    title: logoName || null,
                    creation: new Date(),
                },
            ],
            telecom: [
                {
                    system: 'phone',
                    value: data?.phone,
                    use: 'work',
                },
                {
                    system: 'email',
                    value: data?.email,
                    use: 'work',
                },
            ],
            address: demographicAddresses,
            specialties: [data?.specialist],
            department: selectedDepartment?.value,
        };

        if (updateId) {
            dispatch(createDoctorDetailAction({ key: encryptMessage(payload) }));
        } else {
            dispatch(createDoctorAction({ key: encryptMessage(payload) }));
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const [formData, setFormData] = useState({
        role: doctorRoleId,
        email: '',
        name: {
            use: 'official',
            text: '',
            family: '',
            given: '',
        },
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'firstName' || name === 'lastName') {
            setFormData((prev) => {
                const firstName = name === 'firstName' ? value : prev.name.given;
                const lastName = name === 'lastName' ? value : prev.name.family;
                return {
                    ...prev,
                    name: {
                        use: 'official',
                        text: `${firstName} ${lastName}`.trim(),
                        family: lastName,
                        given: firstName,
                    },
                };
            });
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    useEffect(() => {
        if (logo?.url) {
            setFormData(prev => ({ ...prev, profileImage: logo.url.split('?')[0] }));
        }
    }, [logo?.url]);
    const passwordValue = watch('password', '');

    React.useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            password: passwordValue,
            ...(doctorRoleId && { role: doctorRoleId })
        }));

        if (id) {
            setValue('password', '********');
            setValue('confirmPassword', '********');
        }
    }, [passwordValue, doctorRoleId, id, setValue]);

    const validateForm = React.useCallback(() => {
        const isFirstNameValid = formData.name.given?.trim()?.length >= 3 && /^[a-zA-Z]{3,}$/.test(formData.name.given);
        const isLastNameValid = formData.name.family?.trim()?.length >= 3 && /^[a-zA-Z]{3,}$/.test(formData.name.family);
        const isPhoneValid = formData?.phone?.trim()?.length === 13 && /^\(\d{3}\)\d{3}-\d{4}$/.test(formData.phone);
        const isDOBValid = formData?.dateOfBirth && new Date(formData.dateOfBirth) <= new Date(new Date().setFullYear(new Date().getFullYear() - 18));
        const isEmailValid = formData?.email?.trim()?.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
        const isGenderValid = !!formData?.gender;
        const isPasswordValid = updateId || (formData?.password?.trim()?.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(formData.password) && formData?.confirmPassword === formData?.password);
        return isFirstNameValid && isLastNameValid && isDOBValid && isEmailValid && isGenderValid && isPasswordValid && isPhoneValid;
    }, [formData, updateId]);

    useEffect(() => {
        setIsButtonDisabled(!validateForm());
    }, [validateForm]);

    const requiredFieldTooltip = <Tooltip id="button-tooltip">Please fill all required fields.</Tooltip>;
    useEffect(() => {
        if (createDepartmentResponse === 201) {
            setAddDepartmentModal(false);
            dispatch(getDepartmentDataAction({ status: true, category: 'Department', limit: 50, skip: 1, search: '' }));
        }
    }, [createDepartmentResponse, dispatch]);
    return (
        <>
            <div className="pt-1 pb-2 px-0">
                <div className="container-fluid px-0" style={{ overflowX: 'hidden' }}>
                    <Card className="px-md-3 py-md-2 " style={{ height: '90vh' }}>
                        <Card.Body className="py-0 px-0">
                            <div className="row">
                                <div className="col-12">
                                    <div className="row d-flex justify-content-between align-items-center">
                                        <div className="col-9 col-md-8 mb-md-1 mb-1 mb-md-0">
                                            <ul className="nav nav-underline">
                                                <li className="nav-item">
                                                    <button
                                                        className={` font_active_tabs text-black nav-link ${activeTab === 'personalDetails' ? 'active' : ''
                                                            }`}
                                                        onClick={() => handleTabChange('personalDetails')}>
                                                        {`Personal Details`}
                                                    </button>
                                                </li>
                                                <li className="nav-item">
                                                    <button
                                                        className={` font_active_tabs text-black nav-link ${activeTab === 'departmentDetails' ? 'active' : ''
                                                            }`}
                                                        onClick={() => handleTabChange('departmentDetails')}>
                                                        {`Professional Information`}
                                                    </button>
                                                </li>
                                                <li className="nav-item">
                                                    <button
                                                        className={` font_active_tabs text-black nav-link ${activeTab === 'qualifications' ? 'active' : ''
                                                            }`}
                                                        onClick={() => handleTabChange('qualifications')}>
                                                        {`Qualifications`}
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-3 col-md-4 d-flex justify-content-end align-items-center gap-md-2 gap-0 px-0">
                                            {activeTab === 'personalDetails' && (
                                                <>
                                                    {!id && (
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={isButtonDisabled ? requiredFieldTooltip : <></>}>
                                                            <span className="d-inline-block">
                                                                <Button
                                                                    onClick={() => setShow(true)}
                                                                    disabled={isButtonDisabled}
                                                                    style={
                                                                        isButtonDisabled
                                                                            ? {
                                                                                pointerEvents: 'none',
                                                                                opacity: 0.6,
                                                                                cursor: 'not-allowed',
                                                                            }
                                                                            : {}
                                                                    }
                                                                    className="custom-buttons text-nowrap">
                                                                    {`Email to Provider`}
                                                                </Button>
                                                            </span>
                                                        </OverlayTrigger>
                                                    )}
                                                </>
                                            )}
                                            <div className="d-none d-md-block me-2">
                                                <Button className="cancel-button" onClick={handleNewDoctor}>
                                                    {`Back`}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="" style={{ height: '82vh' }}>
                                    {activeTab === 'personalDetails' && (
                                        <Form onSubmit={handleSubmit(submitData)}>
                                            {store?.getDoctorDetailsReducer?.loading ? (
                                                <div
                                                    className="d-flex justify-content-center align-items-center"
                                                    style={{ height: '75vh' }}>
                                                    <Spinner />
                                                </div>
                                            ) : (
                                                <>
                                                    <div
                                                        className="col-12 mt-1 scroll-container"
                                                        style={{
                                                            height: '75vh',
                                                            overflow: 'scroll',
                                                            overflowX: 'hidden',
                                                        }}>
                                                        <div className="row  px-0" style={{ overflowX: 'hidden' }}>
                                                            <div className="col-md-6 col-lg-3 col-sm-6  col-12">
                                                                <Form.Group className="mb-1">
                                                                    <Form.Label className="mb-0">
                                                                        {`First Name`}{' '}
                                                                        <span className="text-danger">*</span>
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        onKeyDown={(event) =>
                                                                            handleFirstSpace(event, 0)
                                                                        }
                                                                        {...register('firstName', {
                                                                            required: 'First name is required',
                                                                            pattern: {
                                                                                value: /^[a-zA-Z]{3,}$/,
                                                                                message:
                                                                                    'First name must contain only letters and be at least 3 characters long',
                                                                            },
                                                                        })}
                                                                        onInput={(e) => {
                                                                            e.target.value = e.target.value.replace(
                                                                                /[^a-zA-Z]/g,
                                                                                ''
                                                                            );
                                                                        }}
                                                                        onChange={(e) => {
                                                                            clearErrors('firstName');
                                                                            handleInputChange(e);
                                                                        }}
                                                                        placeholder="Enter first name"
                                                                    />
                                                                    {errors.firstName && (
                                                                        <span className="text-danger err_font">
                                                                            {errors.firstName.message}
                                                                        </span>
                                                                    )}
                                                                </Form.Group>
                                                            </div>
                                                            <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                                                <Form.Group className="mb-1">
                                                                    <Form.Label className="mb-0">
                                                                        {`Last Name`}{' '}
                                                                        <span className="text-danger">*</span>
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        onKeyDown={(event) =>
                                                                            handleFirstSpace(event, 0)
                                                                        }
                                                                        {...register('lastName', {
                                                                            required: 'Last name is required',
                                                                            pattern: {
                                                                                value: /^[a-zA-Z]{3,}$/,
                                                                                message:
                                                                                    'Last name must contain only letters and be at least 3 characters long',
                                                                            },
                                                                        })}
                                                                        onInput={(e) => {
                                                                            e.target.value = e.target.value.replace(
                                                                                /[^a-zA-Z]/g,
                                                                                ''
                                                                            );
                                                                        }}
                                                                        onChange={(e) => {
                                                                            clearErrors('lastName');
                                                                            handleInputChange(e);
                                                                        }}
                                                                        placeholder="Enter last name"
                                                                    />
                                                                    {errors.lastName && (
                                                                        <span className="text-danger err_font">
                                                                            {errors.lastName.message}
                                                                        </span>
                                                                    )}
                                                                </Form.Group>
                                                            </div>
                                                            <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                                                <div className="mb-1">
                                                                    <Form.Group className="mb-0 position-relative">
                                                                        <Form.Label className="mb-0">
                                                                            {`Phone`}{' '}
                                                                            <span className="text-danger">*</span>
                                                                        </Form.Label>
                                                                        <Form.Group>
                                                                            <InputGroup>
                                                                                <InputGroup.Text className="px-1 p-0 d-flex justify-content-center align-items-center fs-5 fw-semibold text-black">
                                                                                    <img
                                                                                        src={us}
                                                                                        alt="flag"
                                                                                        width={20}
                                                                                    />
                                                                                    +1
                                                                                </InputGroup.Text>
                                                                                <Form.Control
                                                                                    type="tel"
                                                                                    {...register('phone', {
                                                                                        required:
                                                                                            'Phone number is required',
                                                                                        pattern: {
                                                                                            value: /^\(\d{3}\)\d{3}-\d{4}$/,
                                                                                            message:
                                                                                                'Contact must be in the format (XXX)XXX-XXXX',
                                                                                        },
                                                                                        maxLength: {
                                                                                            value: 13,
                                                                                            message:
                                                                                                'Contact must not exceed 10 digits',
                                                                                        },
                                                                                        minLength: {
                                                                                            value: 13,
                                                                                            message:
                                                                                                'Contact must not be less than 10 digits',
                                                                                        },
                                                                                    })}
                                                                                    onChange={(e) => {
                                                                                        clearErrors('phone');
                                                                                        let rawValue =
                                                                                            e.target.value.replace(
                                                                                                /\D/g,
                                                                                                ''
                                                                                            );
                                                                                        if (rawValue.length > 10)
                                                                                            rawValue = rawValue.slice(
                                                                                                0,
                                                                                                10
                                                                                            );
                                                                                        const formattedValue =
                                                                                            rawValue.replace(
                                                                                                /(\d{1,3})(\d{0,3})(\d{0,4})/,
                                                                                                (match, p1, p2, p3) => {
                                                                                                    if (p3)
                                                                                                        return `(${p1})${p2}-${p3}`;
                                                                                                    if (p2)
                                                                                                        return `(${p1})${p2}`;
                                                                                                    return `(${p1}`;
                                                                                                }
                                                                                            );
                                                                                        e.target.value = formattedValue;
                                                                                        setFormData({
                                                                                            ...formData,
                                                                                            phone: e.target.value,
                                                                                        });
                                                                                    }}
                                                                                    placeholder="(XXX)XXX-XXXX"
                                                                                    maxLength={14}
                                                                                />
                                                                            </InputGroup>
                                                                            {errors.phone && (
                                                                                <span className="text-danger err_font">
                                                                                    {errors.phone.message}
                                                                                </span>
                                                                            )}
                                                                        </Form.Group>
                                                                    </Form.Group>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                                                <Form.Group className="mb-1">
                                                                    <Form.Label className="mb-0">
                                                                        {`Date of Birth`}{' '}
                                                                        <span className="text-danger">{`*`}</span>
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="date"
                                                                        className="form-control"
                                                                        max={
                                                                            new Date(
                                                                                new Date().setFullYear(
                                                                                    new Date().getFullYear() - 18
                                                                                )
                                                                            )
                                                                                .toISOString()
                                                                                .split('T')[0]
                                                                        }
                                                                        {...register('dateOfBirth', {
                                                                            required: 'Date of birth is required',
                                                                            validate: (value) => {
                                                                                const selectedDate = new Date(value);
                                                                                const minAllowedDate = new Date();
                                                                                minAllowedDate.setFullYear(
                                                                                    minAllowedDate.getFullYear() - 18
                                                                                );
                                                                                return (
                                                                                    selectedDate <= minAllowedDate ||
                                                                                    'You must be at least 18 years old'
                                                                                );
                                                                            },
                                                                        })}
                                                                        onChange={(e) => {
                                                                            clearErrors('dateOfBirth');
                                                                            setFormData({
                                                                                ...formData,
                                                                                dateOfBirth: e.target.value,
                                                                            });
                                                                        }}
                                                                    />

                                                                    {errors.dateOfBirth && (
                                                                        <span className="text-danger err_font">
                                                                            {errors.dateOfBirth.message}
                                                                        </span>
                                                                    )}
                                                                </Form.Group>
                                                            </div>
                                                            <div className="col-md-6 col-lg-3 col-sm-6 col-12 ">
                                                                <Form.Group className="mb-1">
                                                                    <Form.Label className="mb-0">
                                                                        {`Email`}{' '}
                                                                        <span className="text-danger">{`*`}</span>
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="email"
                                                                        {...register('email', {
                                                                            required: 'Email is required',
                                                                            pattern: {
                                                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                                                message: 'Enter a valid email address',
                                                                            },
                                                                        })}
                                                                        onChange={(e) => {
                                                                            clearErrors('email');
                                                                            setFormData({
                                                                                ...formData,
                                                                                email: e.target.value,
                                                                            });
                                                                        }}
                                                                        placeholder="Enter email"
                                                                    />
                                                                    {errors.email && (
                                                                        <span className="text-danger err_font">
                                                                            {errors.email.message}
                                                                        </span>
                                                                    )}
                                                                </Form.Group>
                                                            </div>
                                                            <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                                                <Form.Group className="mb-1">
                                                                    <Form.Label className="mb-0">
                                                                        Gender <span className="text-danger">*</span>
                                                                    </Form.Label>
                                                                    <Form.Select
                                                                        as="select"
                                                                        data-has-value={!!watch('gender')}
                                                                        {...register('gender', {
                                                                            required: 'Gender is required',
                                                                        })}
                                                                        onChange={(e) => {
                                                                            clearErrors('gender');
                                                                            setFormData((prev) => ({
                                                                                ...prev,
                                                                                gender: e.target.value,
                                                                            }));
                                                                        }}
                                                                        className="custom-select form-control">
                                                                        <option value="" hidden>
                                                                            {`Select Gender`}
                                                                        </option>
                                                                        <option value="Female">{`Female`}</option>
                                                                        <option value="Male">{`Male`}</option>
                                                                        <option value="Other">{`Other`}</option>
                                                                    </Form.Select>
                                                                    {errors.gender && (
                                                                        <span className="text-danger err_font">
                                                                            {errors.gender.message}
                                                                        </span>
                                                                    )}
                                                                </Form.Group>
                                                            </div>
                                                            {!updateId && (
                                                                <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                                                    <Form.Group className="mb-1">
                                                                        <Form.Label className="mb-0">
                                                                            {`Password`}{' '}
                                                                            <span className="text-danger">{`*`}</span>
                                                                        </Form.Label>
                                                                        <div className="position-relative">
                                                                            <Form.Control
                                                                                type={showPassword ? 'text' : 'password'}
                                                                                autoComplete='new-password'
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === ' ') {
                                                                                        e.preventDefault();
                                                                                    }
                                                                                }}
                                                                                value={formData.password}
                                                                                onCopy={(e) => e.preventDefault()}
                                                                                onCut={(e) => e.preventDefault()}
                                                                                placeholder="Password"
                                                                                onChange={(e) => {
                                                                                    clearErrors('password');
                                                                                    setFormData({
                                                                                        ...formData,
                                                                                        password: e.target.value,
                                                                                    });
                                                                                }}
                                                                                {...register('password', {
                                                                                    required: 'Password is required',
                                                                                    pattern: {
                                                                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                                                                                        message: 'At least 8 characters required, including 1 uppercase letter, 1 number, and 1 special character. Spaces are not allowed.',
                                                                                    },
                                                                                })}
                                                                            />
                                                                            <span
                                                                                className="position-absolute end-0 top-0 me-2 cursor-pointer"
                                                                                style={{ marginTop: '3px' }}
                                                                                onClick={() =>
                                                                                    setShowPassword(!showPassword)
                                                                                }>
                                                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                                            </span>
                                                                            {errors.password && (
                                                                                <span className="text-danger err_font">
                                                                                    {errors.password.message}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </Form.Group>
                                                                </div>
                                                            )}
                                                            {!updateId && (
                                                                <div className="col-md-6 col-lg-3 col-sm-6 col-12">
                                                                    <Form.Group className="mb-1 ">
                                                                        <Form.Label className="mb-0">
                                                                            {`Confirm Password`}{' '}
                                                                            <span className="text-danger">{`*`}</span>
                                                                        </Form.Label>
                                                                        <div className="position-relative">
                                                                            <Form.Control
                                                                                type={showConfirmPassword ? 'text' : 'password'}
                                                                                value={formData.confirmPassword || ''}
                                                                                placeholder="Confirm Password"
                                                                                {...register('confirmPassword', {
                                                                                    required: 'Please confirm your password',
                                                                                    validate: (value) => value === watch('password') || 'Passwords do not match',
                                                                                })}
                                                                                onChange={(e) => {
                                                                                    clearErrors('confirmPassword');
                                                                                    setFormData((prev) => ({
                                                                                        ...prev,
                                                                                        confirmPassword: e.target.value,
                                                                                    }));
                                                                                }}
                                                                            />
                                                                            <span
                                                                                className="position-absolute end-0 top-0 me-2 cursor-pointer"
                                                                                style={{ marginTop: '3px' }}
                                                                                onClick={() =>
                                                                                    setShowConfirmPassword(
                                                                                        !showConfirmPassword
                                                                                    )
                                                                                }>
                                                                                {showConfirmPassword ? (
                                                                                    <FaEyeSlash />
                                                                                ) : (
                                                                                    <FaEye />
                                                                                )}
                                                                            </span>
                                                                            {errors.confirmPassword && (
                                                                                <span className="text-danger err_font">
                                                                                    {errors.confirmPassword.message}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </Form.Group>
                                                                </div>
                                                            )}
                                                            <div className="col-md-3 col-12 ">
                                                                <Form.Group className="mb-1 d-flex flex-column position-relative">
                                                                    <Form.Label className="mb-0">
                                                                        {`Profile Image`}
                                                                    </Form.Label>
                                                                    <div
                                                                        onClick={() => logoFileInputRef.current.click()}
                                                                        className={`custom-file-upload justify-content-between position-relative cursor-pointer form-control ${logoName || logoUploading
                                                                            ? ''
                                                                            : 'custom-form-fields'
                                                                            }`}>
                                                                        <span>
                                                                            {logoUploading === true
                                                                                ? 'Uploading...'
                                                                                : logoName
                                                                                    ? logoName.length > 30
                                                                                        ? logoName.slice(0, 25) + '...'
                                                                                        : logoName
                                                                                    : 'Upload Profile Image'}
                                                                        </span>
                                                                        {!logoName && <i className="bi bi-cloud-arrow-up position-absolute fs-5" style={{ right: '2.5%' }} />}
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            {(logo?.url?.split('?')[0] ||
                                                                                doctorDetails?.photo?.[0]?.url) && (
                                                                                    <FaEye
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleShowModal(
                                                                                                logo?.url?.split('?')[0] ||
                                                                                                doctorDetails
                                                                                                    ?.photo?.[0]?.url
                                                                                            );
                                                                                        }}
                                                                                        className="text-dark cursor-pointer"
                                                                                        title="Preview"
                                                                                    />
                                                                                )}
                                                                            {(logo?.url?.split('?')[0] ||
                                                                                doctorDetails?.photo?.[0]?.url) && (
                                                                                    <FiDownloadCloud
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleDownload(
                                                                                                logo ||
                                                                                                doctorDetails
                                                                                                    ?.photo?.[0]
                                                                                            );
                                                                                        }}
                                                                                        className="text-dark cursor-pointer"
                                                                                        title="Download"
                                                                                    />
                                                                                )}
                                                                        </div>
                                                                    </div>
                                                                    <Form.Control
                                                                        type="file"
                                                                        className="d-none "
                                                                        {...register('profileImage', {})}
                                                                        accept=".png, .jpg, .jpeg, .svg"
                                                                        ref={logoFileInputRef}
                                                                        onChange={handleFileChange}
                                                                    />
                                                                    {errors.profileImage && (
                                                                        <p className="text-danger">
                                                                            {errors.profileImage.message}
                                                                        </p>
                                                                    )}
                                                                </Form.Group>
                                                            </div>
                                                            <div className="col-md-3 col-12">
                                                                <Form.Group className="mb-1">
                                                                    <Form.Label className="mb-0">
                                                                        {`Speciality`}{' '}
                                                                    </Form.Label>
                                                                    <AsyncSelect
                                                                        cacheOptions
                                                                        defaultOptions
                                                                        loadOptions={(inputValue) => {
                                                                            return new Promise((resolve) => {
                                                                                const filteredOptions = specialitiesData
                                                                                    .filter(specialty =>
                                                                                        specialty.display.toLowerCase().includes(inputValue.toLowerCase())
                                                                                    )
                                                                                    .map(specialty => ({
                                                                                        value: specialty.display,
                                                                                        label: specialty.display
                                                                                    }))
                                                                                    .slice(0, 50);
                                                                                resolve(filteredOptions);
                                                                            });
                                                                        }}
                                                                        className="basic-single"
                                                                        classNamePrefix="select"
                                                                        placeholder="Search and select speciality"
                                                                        isClearable
                                                                        menuPlacement="auto"
                                                                        menuPosition="fixed"
                                                                        onChange={(selectedOption) => {
                                                                            setValue('specialist', selectedOption?.value || '');
                                                                            clearErrors('specialist');
                                                                        }}
                                                                        defaultValue={doctorDetails?.specialties?.[0] ? {
                                                                            value: doctorDetails.specialties[0],
                                                                            label: doctorDetails.specialties[0]
                                                                        } : null}
                                                                        styles={{
                                                                            control: (provided) => ({
                                                                                ...provided,
                                                                                height: '30px',
                                                                                minHeight: '30px',
                                                                                border: '0px',
                                                                            }),
                                                                            placeholder: (provided) => ({
                                                                                ...provided,
                                                                                fontWeight: 'bold',
                                                                                fontSize: '12px',
                                                                                paddingBottom: '5px',
                                                                            }),
                                                                        }}
                                                                    />
                                                                </Form.Group>
                                                            </div>
                                                            <div className="col-md-3 col-12">
                                                                <Form.Group className="mb-1">
                                                                    <Form.Label className="mb-0">
                                                                        {`Department`}{' '}
                                                                        <span>
                                                                            <i
                                                                                className="bi bi-plus-circle text-primary ms-1 cursor-pointer"
                                                                                style={{ fontSize: '0.7rem' }}
                                                                                title="Add Department"
                                                                                onClick={() => {
                                                                                    setAddDepartmentModal(true);
                                                                                }}></i>
                                                                        </span>
                                                                        <span className="text-danger">{' *'}</span>
                                                                    </Form.Label>
                                                                    <Select
                                                                        options={departmentOptions}
                                                                        isSearchable
                                                                        className="basic-single"
                                                                        classNamePrefix="select"
                                                                        placeholder="Select"
                                                                        required
                                                                        value={
                                                                            selectedDepartment ||
                                                                            departmentOptions?.find(
                                                                                (data) =>
                                                                                    data?.value ===
                                                                                    selectedDepartment?.value
                                                                            )
                                                                        }
                                                                        styles={{
                                                                            control: (provided) => ({
                                                                                ...provided,
                                                                                height: '30px',
                                                                                minHeight: '30px',
                                                                                border: '0px',
                                                                            }),
                                                                            placeholder: (provided) => ({
                                                                                ...provided,
                                                                                fontWeight: 'bold',
                                                                                fontSize: '12px',
                                                                                paddingBottom: '5px',
                                                                            }),
                                                                        }}
                                                                        onInputChange={(data) => {
                                                                            dispatch(
                                                                                getDepartmentDataAction({
                                                                                    status: true,
                                                                                    category: 'Department',
                                                                                    limit: 50,
                                                                                    skip: 1,
                                                                                    search: data,
                                                                                })
                                                                            );
                                                                        }}
                                                                        onChange={(data) => {
                                                                            setSelectedDepartment(data);
                                                                        }}
                                                                        menuPlacement="auto"
                                                                        menuPosition="fixed"
                                                                    />
                                                                </Form.Group>
                                                            </div>
                                                            <hr className="my-1" />
                                                        </div>
                                                        <DoctorAddress
                                                            addresses={demographicAddresses}
                                                            setAddresses={setDemographicAddresses}
                                                        />
                                                    </div>
                                                    <div
                                                        className="col-12 d-flex justify-content-end gap-2 mt-1"
                                                        style={{ height: '6vh', overflow: 'hidden' }}>
                                                        <Button className='custom-buttons' disabled={store?.createtDoctorsReducer?.loading ||
                                                            store?.createtDoctorsDetailReducer?.loading} type='submit' onClick={() => setSwitchTabs(false)}>
                                                            {id ? 'Update' : 'Save'}
                                                        </Button>
                                                        <Button
                                                            variant="primary"
                                                            type="submit"
                                                            className="custom-buttons"
                                                            onClick={() => setSwitchTabs(true)}
                                                            disabled={store?.createtDoctorsReducer?.loading ||
                                                                store?.createtDoctorsDetailReducer?.loading}
                                                            style={{ width: '120px' }}>
                                                            {id ? (
                                                                'Update & Next'
                                                            ) : (
                                                                'Save & Next'
                                                            )}
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </Form>
                                    )}
                                    {activeTab === 'departmentDetails' && (
                                        <DepartmentDetails docId={docId} setActiveTab={setActiveTab} setSwitchTabs={setSwitchTabs} />
                                    )}
                                    {activeTab === 'qualifications' && (
                                        <DoctorQualifications docId={docId} setActiveTab={setActiveTab} setSwitchTabs={setSwitchTabs} />
                                    )}
                                    {activeTab === 'documents' && <Documents />}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <EmailToDoctorModal closeModal={closeModal} show={show} formData={formData} setFormData={setFormData} />
                <DepartmentModal
                    addDepartmentModal={addDepartmentModal}
                    closeAddModal={() => setAddDepartmentModal(false)}
                // edit={edit}
                />
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
            </div>
        </>
    );
};

export default NewDoctor;
