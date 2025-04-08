import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FormInput } from '../../../../components';
import profileDummy from '../../../../assets/images/profileDummy.png';
import { IoClose, IoFilter, IoPrintSharp } from 'react-icons/io5';
import Demographics from './Demographics';
import { TbCapture, TbHeartRateMonitor } from 'react-icons/tb';
import { LiaReceiptSolid } from 'react-icons/lia';
import PatientDetails from './PatientDetails';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientByIdAction, getStatesByCountryAction, resetUpdateAction, updatePatientsAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';
import ResponsibleParty from './ResponsibleParty';
import Insurance from './Insurance/Insurance';
import VitalStatus from './VitalStatus';
import { MdPhone } from 'react-icons/md';
import { MdOutlineMarkEmailUnread } from 'react-icons/md';
import { BiEdit, BiSolidLocationPlus } from 'react-icons/bi';
import { useForm } from 'react-hook-form';
import { handleUpload } from '../../../../helpers/HandleUpload';
import { MdMedicalInformation } from 'react-icons/md';
import { MdOutlinePreview } from 'react-icons/md';
import { AiOutlineInteraction } from 'react-icons/ai';
import { FaUserDoctor } from 'react-icons/fa6';
import { TbReportSearch } from 'react-icons/tb';
import { TbVaccine } from 'react-icons/tb';
import { SiPrivateinternetaccess } from 'react-icons/si';
import { GrContact } from 'react-icons/gr';
import { TbHistory } from 'react-icons/tb';
import { RiImageEditFill } from 'react-icons/ri';
import { GiGrowth } from 'react-icons/gi';
import { MdCorporateFare } from 'react-icons/md';
import { FiPlus } from 'react-icons/fi';
import Insurances from './Insurance/Insurance';
import ProblemList from '../Task Tabs/ProblemList';
import AssignTask from '../Task Tabs/AssignTask';
import AllergyList from '../Task Tabs/AllergyList';
import AddAssignTask from '../Task Tabs/AddAssignTask';
import FilterModal from './FilterModal';
import FilterDropdown from './FilterModal';
import Responsiblle from '../Responsible';

const UpdatePatientIndex = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        clearErrors,
        watch,
        getValues,
    } = useForm();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const patientDetails = store?.getPatientByIdReducer?.data?.data;
    console.log('patientDetails', patientDetails);
    const updateSuccess = store?.updatePatientsReducer?.data?.status;
    const updateResponsibleParty = store?.updateResponsiblePartyReducer?.data?.status;
    const [profilePhoto, setProfilePhoto] = useState(profileDummy);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Patient Details');
    const [selectedMainTab, setSelectedMainTab] = useState('Patient Details');
    const [selectedSubTab, setSelectedSubTab] = useState('Assign Task');
    const [visibleSection, setVisibleSection] = useState('patient'); // Default section
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [isClinicalReviewExpandedData, setIsClinicalReviewExpandedData] = useState(false);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isClinicalReviewExpanded, setIsClinicalReviewExpanded] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    useEffect(() => {
        const payload = {
            id: id,
        };
        if (id) {
            dispatch(getPatientByIdAction(payload));
        }
        if (
            updateSuccess === 200 ||
            updateResponsibleParty === 200 ||
            store?.createResponsiblePartyReducer?.data?.status === 201
        ) {
            dispatch(getPatientByIdAction(payload));
            dispatch(resetUpdateAction());
            setLogo(null);
            setLogoName('');
            setProfilePhoto(null);
        }
    }, [id, updateSuccess, updateResponsibleParty, store?.createResponsiblePartyReducer?.data?.status]);
    useEffect(() => {
        dispatch(getStatesByCountryAction())
    }, [dispatch])
    const handleTabClick = (tab) => {
        setSelectedSubTab(tab);
    };

    const handleMainTabChange = (tab) => {
        setSelectedMainTab(tab);
        setVisibleSection('patient'); // Show Patient Section, Hide Task Section
    };
    const handleSubTabChange = (subTab) => {
        setSelectedSubTab(subTab);
        setVisibleSection('task'); // Show Task Section, Hide Patient Section
    };

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    const handleToggle = () => {
        setIsClinicalReviewExpandedData(!isClinicalReviewExpandedData);
    };
    const patientMenuItems = [
        { label: 'Patient Info', icon: <MdMedicalInformation /> },
        {
            label: 'Clinical Review',
            icon: <MdOutlinePreview />,
            subItems: [
                { label: 'Assign Task', icon: <FiPlus /> },
                { label: 'Problem List', icon: <FiPlus /> },
                { label: 'Allergy List', icon: <FiPlus /> },
                { label: 'Drug Medication', icon: <FiPlus /> },
                { label: 'Medication List', icon: <FiPlus /> },
            ],
        },
        { label: 'Drug Interactions', icon: <AiOutlineInteraction /> },
        { label: 'CQIs', icon: <FaUserDoctor /> },
        { label: 'Lab Request', icon: <TbReportSearch /> },
        { label: 'Vaccinations', icon: <TbVaccine /> },
        { label: 'Patient Access', icon: <SiPrivateinternetaccess /> },
        { label: 'Patient Communication', icon: <GrContact /> },
        { label: 'Genetic History', icon: <TbHistory /> },
        { label: 'Imaging Requests', icon: <RiImageEditFill /> },
        { label: 'Growth Tracker', icon: <GiGrowth /> },
        { label: 'Estimates', icon: <MdCorporateFare /> },
    ];
    const handleClinicalReviewToggle = () => {
        setIsClinicalReviewExpanded(!isClinicalReviewExpanded);
        setVisibleSection('task');
    };

    const openCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }, // Open front camera
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };
    const [uploading, setUploading] = useState(false);
    const capturePhoto = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas && video) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas image to Blob
            canvas.toBlob(async (blob) => {
                if (blob) {
                    const file = new File([blob], `profile-photo-${Date.now()}.png`, { type: 'image/png' });

                    try {
                        const url = await handleUpload(file, setUploading);
                        setLogo(url);
                        setLogoName(file?.name);
                    } catch (error) {
                        console.error('Error uploading photo:', error);
                    }
                }
            }, 'image/png');

            stopCamera();
        }
    };

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        setIsCameraOpen(false);
    };
    const onSubmit = (data) => {
        const payload = {
            id: id,
            ...(logo?.url === null
                ? []
                : {
                    photo: [{
                        url: logo?.url?.split('?')[0] || patientDetails?.photo?.url,
                        title: logoName,
                    }],
                }),
        };
        dispatch(updatePatientsAction({ key: encryptMessage(payload) }));
    };

    return (
        <>
            <div className="">
                <div className="container-fluid d-flex justify-content-center align-items-center px-0 mt-2">
                    {store?.getPatientByIdReducer?.loading ? (
                        <Spinner />
                    ) : (
                        <div className="row">
                            <div className={`${isSidebarCollapsed ? 'col-11' : 'col-10'} pe-0`}>
                                <div
                                    className="mb-1"
                                    style={{
                                        background: 'transparent',
                                        width: 'auto',
                                        border: '0px!important',
                                        boxShadow: 0,
                                    }}>
                                    <Card.Body className="p-1">
                                        <Row>
                                            <Col sm={2} className="ps-2 pt-1">
                                                <Form
                                                    onSubmit={handleSubmit(onSubmit)}
                                                    className="d-flex flex-column align-items-center">
                                                    <div
                                                        className="position-relative d-flex align-items-center flex-column justify-content-center"
                                                        style={{ display: 'inline-block' }}>
                                                        {isCameraOpen ? (
                                                            <video
                                                                ref={videoRef}
                                                                autoPlay
                                                                playsInline
                                                                className="rounded"
                                                                style={{
                                                                    width: '126px',
                                                                    height: '129px',
                                                                    objectFit: 'cover',
                                                                }}
                                                            />
                                                        ) : uploading ? (
                                                            <Spinner />
                                                        ) : (
                                                            <img
                                                                src={
                                                                    logo?.url
                                                                        ? logo.url.split('?')[0]
                                                                        :
                                                                        patientDetails?.photo[0]?.url
                                                                            ? patientDetails.photo[0]?.url
                                                                            : profilePhoto
                                                                }
                                                                alt="Patient Profile"
                                                                className="img-fluid rounded"
                                                                style={{
                                                                    width: '126px',
                                                                    height: '129px',
                                                                    objectFit: 'cover',
                                                                }}
                                                            />
                                                        )}

                                                        {!isCameraOpen && (
                                                            <BiEdit
                                                                className={`position-absolute fs-4 text-black ${uploading ? 'd-none' : ''
                                                                    }`}
                                                                style={{
                                                                    bottom: '-5px',
                                                                    right: '-9px',
                                                                    cursor: 'pointer',
                                                                }}
                                                                onClick={openCamera}
                                                            />
                                                        )}

                                                        {isCameraOpen && (
                                                            <div className="camera-controls d-flex justify-content-center gap-1">
                                                                <Button
                                                                    onClick={capturePhoto}
                                                                    type="button"
                                                                    className="custom-buttons">
                                                                    <TbCapture className="text-white fs-5" />{' '}
                                                                </Button>
                                                                <Button onClick={stopCamera} className="custom-buttons">
                                                                    <IoClose className="text-white fs-5" />
                                                                </Button>
                                                            </div>
                                                        )}

                                                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                                                    </div>

                                                    {/* Submit button that sends the form after upload */}
                                                    <Button
                                                        type="submit"
                                                        className={`${!logo ? 'd-none' : 'mt-1 custom-buttons'}`}
                                                        disabled={!logo}>
                                                        Submit
                                                    </Button>
                                                </Form>
                                            </Col>
                                            <Col sm={8}>
                                                <Row className="pt-1">
                                                    <div className="d-flex gap-2 ps-1 lh-sm">
                                                        <p
                                                            style={{ borderRight: '1px solid black' }}
                                                            className="pe-2 text-nowrap  fs-6">
                                                            <span
                                                                className="fw-bold text-capitalize"
                                                                style={{ color: '#f9a004' }}>
                                                                {patientDetails?.name[0]?.given[0]
                                                                    ? patientDetails?.name[0]?.given[0]
                                                                    : ''}
                                                                {patientDetails?.name[0]?.given[1]
                                                                    ? ' ' + patientDetails.name[0]?.given[1]
                                                                    : ''}
                                                                {patientDetails?.lastName
                                                                    ? ' ' + patientDetails.lastName
                                                                    : ''}
                                                            </span>
                                                        </p>
                                                        <p
                                                            style={{ borderRight: '1px solid black' }}
                                                            className="text-nowrap  fs-6 pe-2 fw-bold">
                                                            <span className="fs-6 text-capitalize">
                                                                {patientDetails?.gender || 'N/A'}
                                                            </span>
                                                        </p>
                                                        <p
                                                            style={{ borderRight: '1px solid black' }}
                                                            className="text-nowrap fs-6 pe-2 fw-bold">
                                                            <span>
                                                                {patientDetails?.birthDate
                                                                    ? new Date(
                                                                        patientDetails?.birthDate
                                                                    )?.toLocaleDateString('en-GB')
                                                                    : 'N/A'}
                                                            </span>
                                                        </p>
                                                        <p className="text-nowrap mb-0 fs-6 fw-bold">
                                                            <span>
                                                                {patientDetails?.approxAge
                                                                    ? patientDetails?.approxAge + ' ' + 'years old'
                                                                    : 'N/A'}
                                                            </span>
                                                        </p>
                                                    </div>

                                                    <Col sm={6} className="p-0">
                                                        <div className="row">
                                                            <div className="col-12 mx-1 ">
                                                                <div className="row">
                                                                    <div className="col-3 pe-0">
                                                                        <span className="fw-bold fs-6">
                                                                            Patients Chart ID:
                                                                        </span>
                                                                    </div>
                                                                    <div className="col-9">
                                                                        <span
                                                                            className="ps-2 text-primary fs-6"
                                                                            style={{ fontWeight: 600 }}>
                                                                            CH-{patientDetails?.chartNumber}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 mx-1 ">
                                                                <div className="row">
                                                                    <div className="col-3">
                                                                        <span>
                                                                            <MdPhone className="fs-5 text-primary" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="col-9">
                                                                        <span
                                                                            className="ps-2 fs-6"
                                                                            style={{ fontWeight: 600 }}>
                                                                            +1-{patientDetails?.telecom[1]?.value}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 mx-1 ">
                                                                <div className="row">
                                                                    <div className="col-3">
                                                                        <span>
                                                                            <MdOutlineMarkEmailUnread className="fs-5 text-primary" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="col-9">
                                                                        <span
                                                                            className="ps-2 fs-6"
                                                                            style={{ fontWeight: 600 }}>
                                                                            {patientDetails?.telecom[3]?.value}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 mx-1 ">
                                                                <div className="row">
                                                                    <div className="col-3">
                                                                        <span>
                                                                            <BiSolidLocationPlus className="fs-5 text-primary" />
                                                                        </span>
                                                                    </div>
                                                                    <div className="col-9">
                                                                        <span
                                                                            className="ps-2 fs-6"
                                                                            style={{ fontWeight: 600 }}>
                                                                            {patientDetails?.address?.[0]?.city || ''}{patientDetails?.address?.[0]?.city && ','} {patientDetails?.address?.[0]?.state || ''}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    {/* <Col sm={6}>
                                                    <div>
                                                        <p className='fs-6 m-1'><span className='fw-bold'>Primary Provider:</span><span className='ps-2'>{patientDetails?.primaryProvider?.userId?.firstName} {patientDetails?.primaryProvider?.userId?.lastName || ''}</span></p>
                                                        <p className='fs-6 m-1'><span className='fw-bold'>Date Added:</span><span className='ps-2'>{new Date(patientDetails?.createdAt)?.toLocaleDateString('en-GB')}</span></p>
                                                        <p className='fs-6 m-1'><span className='fw-bold'>Last Scheduled appt:</span><span className='ps-2 text-primary'>01/01/2025</span></p>
                                                        <p className='fs-6 m-1'><span className='fw-bold'>Next Scheduled appt:</span><span className='ps-2'>None</span></p>
                                                    </div>
                                                </Col> */}
                                                    <Col sm={6}>
                                                        <div className="row">
                                                            <div className="col-12 mx-1 ">
                                                                <div className="row">
                                                                    <div className="col-5">
                                                                        <span className="fw-bold fs-6">
                                                                            Primary Provider:
                                                                        </span>
                                                                    </div>
                                                                    <div className="col-7">
                                                                        <span
                                                                            className="ps-2 text-primary fs-6"
                                                                            style={{ fontWeight: 600 }}>
                                                                            {
                                                                                patientDetails?.primaryProvider?.userId
                                                                                    ?.firstName
                                                                            }{' '}
                                                                            {patientDetails?.primaryProvider?.userId
                                                                                ?.lastName || ''}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 mx-1 ">
                                                                <div className="row">
                                                                    <div className="col-5">
                                                                        <span className="fw-bold fs-6">
                                                                            Date Added:
                                                                        </span>
                                                                    </div>
                                                                    <div className="col-7">
                                                                        <span
                                                                            className="ps-2 fs-6"
                                                                            style={{ fontWeight: 600 }}>
                                                                            {new Date(
                                                                                patientDetails?.createdAt
                                                                            )?.toLocaleDateString('en-GB')}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 mx-1 ">
                                                                <div className="row">
                                                                    <div className="col-5">
                                                                        <span className="fw-bold fs-6">
                                                                            Last Appointment Date:
                                                                        </span>
                                                                    </div>
                                                                    <div className="col-7">
                                                                        <span
                                                                            className="ps-2 fs-6"
                                                                            style={{ fontWeight: 600 }}>
                                                                            {/* 01/01/2025 */}
                                                                            -
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 mx-1 ">
                                                                <div className="row">
                                                                    <div className="col-5">
                                                                        <span className="fw-bold fs-6">
                                                                            Next Appointment Date:
                                                                        </span>
                                                                    </div>
                                                                    <div className="col-7">
                                                                        <span
                                                                            className="ps-2 fs-6"
                                                                            style={{ fontWeight: 600 }}>
                                                                            None
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col sm={2} className="d-flex justify-content-end pe-3">
                                                <div className="text-center">
                                                    <Button
                                                        className=" text-nowrap text-black d-flex justify-content-center align-items-center"
                                                        onClick={() => navigate('/apps/appointments/newAppointment')}
                                                        style={{
                                                            width: '100%',
                                                            fontSize: '12px',
                                                            height: '30px',
                                                            backgroundColor: '#ffffff',
                                                            borderRadius: '10px',
                                                        }}>
                                                        New Appointment
                                                    </Button>
                                                    <Button
                                                        className=" text-nowrap mt-2 text-black d-flex justify-content-center align-items-center"
                                                        style={{
                                                            width: '100%',
                                                            fontSize: '12px',
                                                            height: '30px',
                                                            backgroundColor: '#ffffff',
                                                            borderRadius: '10px',
                                                        }}>
                                                        New Referral
                                                    </Button>

                                                    <div className="mt-2 d-flex justify-content-end gap-2 ps-2 ">
                                                        <IoPrintSharp className="fs-3 text-black" />
                                                        <LiaReceiptSolid className="fs-3 text-black" />
                                                        {/* <TbHeartRateMonitor className='fs-4' /> */}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </div>
                                {/* Patient Details Section */}
                                {visibleSection === 'patient' && (
                                    <div className="mt-2">
                                        <Card className="px-2">
                                            <div className="d-flex justify-content-between pt-2 px-2">
                                                <div style={{ borderBottom: '2px solid grey' }}>
                                                    <ul className="nav nav-underline">
                                                        {[
                                                            'Patient Details',
                                                            'Demographics',
                                                            'Responsible Party',
                                                            'Reffering Doctor',
                                                            'Insurances',
                                                            'Eligibility',
                                                            'Authorizations',
                                                            'Vital Status',
                                                            'Balance',
                                                            'Payment',
                                                        ].map((tab) => (
                                                            <li className="nav-item" key={tab}>
                                                                <a
                                                                    className={`nav-link me-3 pb-0 tab-font-family ${selectedMainTab === tab
                                                                        ? 'active text-primary'
                                                                        : 'text-black'
                                                                        }`}
                                                                    onClick={() => handleMainTabChange(tab)}
                                                                    style={{ cursor: 'pointer', fontWeight: 600 }}>
                                                                    {tab}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="d-flex gap-1">
                                                    <Button
                                                        type="button"
                                                        className="custom-buttons"
                                                        onClick={() => setVisibleSection('task')}>
                                                        <FiPlus className="fs-5 text-white" />
                                                        &nbsp;Task
                                                    </Button>

                                                    <Button
                                                        className="custom-buttons"
                                                        as={Link}
                                                        to={'/apps/patients/list'}>
                                                        Back
                                                    </Button>
                                                </div>
                                            </div>

                                            <div
                                                className="mt-2 px-2 scroll-container"
                                                style={{ height: '65vh', overflow: 'auto' }}>
                                                {selectedMainTab === 'Patient Details' && <PatientDetails />}
                                                {selectedMainTab === 'Demographics' && <Demographics />}
                                                {selectedMainTab === 'Responsible Party' && <Responsiblle />}
                                                {selectedMainTab === 'Insurances' && <Insurances />}
                                                {selectedMainTab === 'Eligibility' && <p>In Progress...</p>}
                                                {selectedMainTab === 'Authorizations' && <p>In Progress...</p>}
                                                {selectedMainTab === 'Vital Status' && (
                                                    <VitalStatus patientId={patientDetails?._id} />
                                                )}
                                                {selectedMainTab === 'Balance' && <p>In Progress...</p>}
                                                {selectedMainTab === 'Payment' && <p>In Progress...</p>}
                                            </div>
                                        </Card>
                                    </div>
                                )}

                                {/* Task Section */}
                                {visibleSection === 'task' && (
                                    <div className="mt-2">
                                        <Card className="px-2">
                                            <div className="d-flex justify-content-between pt-2 px-2 ">
                                                <h4>Clinic Review</h4>
                                                <div className="d-flex gap-1">
                                                    <Button
                                                        className="custom-buttons"
                                                        data-bs-toggle="offcanvas"
                                                        data-bs-target="#offcanvasRight"
                                                        aria-controls="offcanvasRight">
                                                        <FiPlus className="fs-5 text-white" />
                                                        &nbsp;Task
                                                    </Button>
                                                    <Button
                                                        className="custom-buttons"
                                                        onClick={() => setVisibleSection('patient')}>
                                                        Back
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between ">
                                                <div className="ms-2" style={{ borderBottom: '2px solid grey' }}>
                                                    <ul className="nav nav-underline">
                                                        {[
                                                            'Assign Task',
                                                            'Problem List',
                                                            'Allergy List',
                                                            'Drug Medication',
                                                            'Medication List',
                                                        ].map((subTab) => (
                                                            <li className="nav-item" key={subTab}>
                                                                <a
                                                                    className={`nav-link me-2 pb-0 tab-font-family ${selectedSubTab === subTab
                                                                        ? 'active text-primary'
                                                                        : 'text-black'
                                                                        }`}
                                                                    onClick={() => handleSubTabChange(subTab)}
                                                                    style={{ cursor: 'pointer', fontWeight: 600 }}>
                                                                    {subTab}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div>
                                                    <div
                                                        className="offcanvas offcanvas-end"
                                                        style={{ width: '500px!important' }}
                                                        tabIndex="-1"
                                                        id="offcanvasRight"
                                                        aria-labelledby="offcanvasRightLabel">
                                                        <div
                                                            className="offcanvas-header py-1 "
                                                            style={{ borderBottom: '2px solid grey' }}>
                                                            <h4 id="offcanvasRightLabel">Add Assign Task</h4>
                                                            <button
                                                                type="button"
                                                                className="btn-close text-danger"
                                                                data-bs-dismiss="offcanvas"
                                                                aria-label="Close"></button>
                                                        </div>

                                                        <div className="offcanvas-body">
                                                            <AddAssignTask />
                                                        </div>
                                                    </div>
                                                </div>
                                                {selectedSubTab === 'Assign Task' && (
                                                    <FilterDropdown
                                                        showFilterDropdown={showFilterDropdown}
                                                        setShowFilterDropdown={setShowFilterDropdown}
                                                    />
                                                )}
                                            </div>

                                            <div
                                                className="mt-2 px-2 scroll-container"
                                                style={{ height: '65vh', overflow: 'auto' }}>
                                                {selectedSubTab === 'Assign Task' && <AssignTask />}
                                                {selectedSubTab === 'Problem List' && (
                                                    <ProblemList patientId={patientDetails?._id} />
                                                )}
                                                {selectedSubTab === 'Allergy List' && <AllergyList />}
                                                {selectedSubTab === 'Drug Medication' && (
                                                    <p>Drug Medication In Progress...</p>
                                                )}
                                                {selectedSubTab === 'Medication List' && (
                                                    <p>Medication List In Progress...</p>
                                                )}
                                            </div>
                                        </Card>
                                    </div>
                                )}
                            </div>
                            <div className={isSidebarCollapsed ? 'col-1 ' : 'col-2'}>
                                <div
                                    className="patient-menu-container bg-white mt-0"
                                    style={{
                                        border: '1px solid #ced4da',
                                        borderRadius: '10px',
                                    }}>
                                    <div className="card m-0 overflow-hidden" style={{ borderRadius: '5px' }}>
                                        <div
                                            className="card-header d-flex justify-content-between align-items-center text-white px-2 py-1"
                                            style={{ backgroundColor: '#313A46' }}>
                                            <button
                                                className="btn p-0 shadow-none outline-none"
                                                onClick={handleSidebarToggle}>
                                                <i className="bi bi-list text-white" style={{ fontSize: '18px' }}></i>
                                            </button>
                                            {!isSidebarCollapsed && <h5 className="m-0">Patient Chart</h5>}
                                            <button
                                                className="btn p-0 shadow-none outline-none"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#patientChartData"
                                                aria-expanded={isClinicalReviewExpandedData}
                                                aria-controls="patientChartData"
                                                onClick={handleToggle}>
                                                <i
                                                    className={`bi ${isClinicalReviewExpandedData
                                                        ? 'bi-chevron-up'
                                                        : 'bi-chevron-down'
                                                        }`}
                                                    style={{ fontSize: '14px', color: 'white' }}></i>
                                            </button>
                                        </div>
                                        <div id="patientChartData" className="collapse">
                                            <div
                                                className={`card-body p-0 scroll-container ${isSidebarCollapsed ? 'collapsed-sidebar' : ''
                                                    }`}
                                                style={{ height: '76.8vh', overflow: 'auto' }}>
                                                {patientMenuItems.map((item, index) =>
                                                    item.subItems ? (
                                                        <div key={index} className="ms-0 w-100">
                                                            <p
                                                                className={`patient-menu-item text-black mb-0 ps-2 pe-2  border-bottom py-1 ${isSidebarCollapsed
                                                                    ? 'text-center fw-bold'
                                                                    : 'd-flex justify-content-between align-items-center'
                                                                    }`}
                                                                onClick={handleClinicalReviewToggle}
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    backgroundColor: isClinicalReviewExpanded
                                                                        ? '#f8f9fa'
                                                                        : 'transparent',
                                                                }}
                                                                title={isSidebarCollapsed ? item.label : ''}>
                                                                <span className="d-flex align-items-center justify-content-center">
                                                                    {item?.icon}
                                                                    {!isSidebarCollapsed && (
                                                                        <span className="ms-2">{item.label}</span>
                                                                    )}
                                                                </span>
                                                                {!isSidebarCollapsed && (
                                                                    <i
                                                                        className={`bi ${isClinicalReviewExpanded
                                                                            ? 'bi-chevron-up'
                                                                            : 'bi-chevron-down'
                                                                            }`}></i>
                                                                )}
                                                            </p>
                                                            {isClinicalReviewExpanded && (
                                                                <div className="ms-0">
                                                                    {item.subItems.map((subItem, subIndex) => (
                                                                        <div
                                                                            key={subIndex}
                                                                            className={`d-flex  align-items-center ${isSidebarCollapsed
                                                                                ? 'text-center justify-content-center'
                                                                                : 'ps-4 justify-content-between pe-2'
                                                                                } border-bottom py-1 `}
                                                                            title={
                                                                                isSidebarCollapsed ? subItem.label : ''
                                                                            } // Show tooltip in collapsed mode
                                                                        >
                                                                            {isSidebarCollapsed ? (
                                                                                <p
                                                                                    className="mb-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                                                                    style={{
                                                                                        width: '20px',
                                                                                        height: '20px',
                                                                                        fontSize: '10px',
                                                                                        lineHeight: '20px',
                                                                                    }}>
                                                                                    {subIndex + 1}{' '}
                                                                                    {/* Display subitem number */}
                                                                                </p>
                                                                            ) : (
                                                                                <>
                                                                                    <p
                                                                                        key={subIndex}
                                                                                        className="text-black mb-0 d-flex"
                                                                                        onClick={() =>
                                                                                            handleTabClick(
                                                                                                subItem.label
                                                                                            )
                                                                                        }
                                                                                        style={{
                                                                                            cursor: 'pointer',
                                                                                            // backgroundColor:
                                                                                            //     selectedSubTab === subItem.label ? '#e9ecef' : 'transparent',
                                                                                            fontWeight:
                                                                                                selectedSubTab ===
                                                                                                    subItem.label
                                                                                                    ? 'bold'
                                                                                                    : 'normal',
                                                                                        }}>
                                                                                        <span
                                                                                            className="mb-0 bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                                                                                            style={{
                                                                                                width: '20px',
                                                                                                height: '20px',
                                                                                                fontSize: '10px',
                                                                                                lineHeight: '20px',
                                                                                            }}>
                                                                                            0
                                                                                        </span>
                                                                                        {subItem.label}
                                                                                    </p>
                                                                                    <p
                                                                                        className="mb-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                                                                        style={{
                                                                                            width: '20px',
                                                                                            height: '20px',
                                                                                            fontSize: '10px',
                                                                                            lineHeight: '20px',
                                                                                        }}>
                                                                                        {subItem.icon}
                                                                                    </p>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p
                                                            key={index}
                                                            className={`patient-menu-item text-black mb-0 d-flex align-items-center w-100  ${isSidebarCollapsed
                                                                ? 'fw-bold text-center justify-content-center'
                                                                : ' '
                                                                }`}
                                                            onClick={() => handleTabClick(item.label)}
                                                            style={{
                                                                cursor: 'pointer',
                                                                backgroundColor:
                                                                    activeTab === item.label
                                                                        ? '#f8f9fa'
                                                                        : 'transparent',
                                                                fontWeight:
                                                                    activeTab === item.label ? 'bold' : 'normal',
                                                            }}
                                                            title={isSidebarCollapsed ? item.label : ''}>
                                                            <span className="d-flex align-items-center">
                                                                {item?.icon}
                                                                {!isSidebarCollapsed && (
                                                                    <span className="ms-2">{item.label}</span>
                                                                )}
                                                            </span>
                                                        </p>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UpdatePatientIndex;
