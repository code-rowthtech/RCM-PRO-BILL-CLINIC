import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FormInput } from '../../../../components';
import profileDummy from '../../../../assets/images/profileDummy.png'
import { IoClose, IoPrintSharp } from "react-icons/io5";
import Demographics from './Demographics';
import { TbCapture, TbHeartRateMonitor } from "react-icons/tb";
import { LiaReceiptSolid } from "react-icons/lia";
import PatientDetails from './PatientDetails';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientByIdAction, resetUpdateAction, updatePatientsAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';
import ResponsibleParty from './ResponsibleParty';
import Insurance from './Insurance/Insurance';
import VitalStatus from './VitalStatus';
import { MdPhone } from "react-icons/md";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { BiEdit, BiSolidLocationPlus } from "react-icons/bi";
import { useForm } from 'react-hook-form';
import { handleUpload } from '../../../../helpers/HandleUpload';

const UpdatePatientIndex = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const { register, handleSubmit, formState: { errors }, setValue, reset, clearErrors, watch, getValues } = useForm();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const patientDetails = store?.getPatientByIdReducer?.data?.patient;
    const updateSuccess = store?.updatePatientsReducer?.data?.status;
    const updateResponsibleParty = store?.updateResponsiblePartyReducer?.data?.status;
    const [profilePhoto, setProfilePhoto] = useState(
        profileDummy
    );
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    console.log(logo)
    useEffect(() => {
        const payload = {
            id: id,
        }
        if (id) {
            dispatch(getPatientByIdAction({ key: encryptMessage(payload) }));
        }
        if (updateSuccess === 200 || updateResponsibleParty === 200 || store?.createResponsiblePartyReducer?.data?.status === 201) {
            dispatch(getPatientByIdAction({ key: encryptMessage(payload) }));
            dispatch(resetUpdateAction());
            setLogo(null);
            setLogoName('')
            setProfilePhoto(null)
        }

    }, [id, updateSuccess, updateResponsibleParty, store?.createResponsiblePartyReducer?.data?.status])
    const [activeTab, setActiveTab] = useState('Patient Details');
    const [isClinicalReviewExpandedData, setIsClinicalReviewExpandedData] = useState(false);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isClinicalReviewExpanded, setIsClinicalReviewExpanded] = useState(false);
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };
    const handleSidebarToggle = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    const handleToggle = () => {
        setIsClinicalReviewExpandedData(!isClinicalReviewExpandedData);
    };
    const patientMenuItems = [
        { label: "Demographic", icon: "bi bi-person" },
        { label: "Appointments", icon: "bi bi-person" },
        { label: "Clinical Dashboard", icon: "bi bi-person" },
        { label: "Documents", icon: "bi bi-person" },
        {
            label: 'Clinical Review',
            icon: "bi bi-person",
            subItems: [
                { label: 'Problem List', icon: 'bi bi-person' },
                { label: 'Allergy List', icon: 'bi bi-person' },
                { label: 'Drug Medication', icon: 'bi bi-person' },
                { label: 'Medication List', icon: 'bi bi-person' },
                { label: 'Drug Interactions', icon: 'bi bi-person' },
                { label: 'Care Quality Indicators (CQIs)', icon: 'bi bi-person' },
            ],
        },
        { label: 'Intake Data', icon: 'bi bi-person' },
        { label: 'Lab Orders', icon: 'bi bi-person' },
        { label: 'Immunizations', icon: 'bi bi-person' },
        { label: 'Patient Cost Estimator', icon: 'bi bi-person' },
        { label: 'Growth Charts', icon: 'bi bi-person' },
        { label: 'Onpatient Access', icon: 'bi bi-person' },
        { label: 'Education Resources', icon: 'bi bi-person' },
        { label: 'Communication', icon: 'bi bi-person' },
        { label: 'Family History', icon: 'bi bi-person' },
        { label: 'Imaging Orders', icon: 'bi bi-person' },
        { label: 'Implantable Devices', icon: 'bi bi-person' },
    ];
    const handleClinicalReviewToggle = () => {
        setIsClinicalReviewExpanded(!isClinicalReviewExpanded);
    };


    const openCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" }, // Open front camera
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    };

    const [uploading, setUploading] = useState(false);
    const capturePhoto = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas && video) {
            const context = canvas.getContext("2d");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas image to Blob
            canvas.toBlob(async (blob) => {
                if (blob) {
                    const file = new File([blob], `profile-photo-${Date.now()}.png`, { type: "image/png" });

                    try {
                        const url = await handleUpload(file, setUploading);
                        setLogo(url);
                        setLogoName(file?.name);
                    } catch (error) {
                        console.error("Error uploading photo:", error);
                    }
                }
            }, "image/png");

            stopCamera();
        }
    };

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setIsCameraOpen(false);
    };
    const onSubmit = (data) => {
        const payload = {
            id: id,
            ...(logo?.url === null
                ? {}
                : {
                    patientChartPhoto: {
                        url: logo?.url?.split('?')[0] || patientDetails?.patientChartPhoto?.url,
                        fileName: logoName
                    }
                }),
        }
        dispatch(updatePatientsAction({ key: encryptMessage(payload) }))
        console.log(payload, 'payloadpayload')
    }
    return (
        <div className="">
            <div className='container-fluid d-flex justify-content-center align-items-center px-0 mt-2'>
                {store?.getPatientByIdReducer?.loading ?
                    <Spinner />
                    :
                    <div className='row'>
                        <div className={`${isSidebarCollapsed ? 'col-11' : 'col-10'} pe-0`}>
                            <div
                                className='mb-1'
                                style={{
                                    background: 'transparent',
                                    width: 'auto',
                                    border: '0px!important',
                                    boxShadow: 0,
                                }}
                            >
                                <Card.Body className="p-1">
                                    <Row>
                                        <Col sm={2} className='ps-2 pt-1'>
                                            <Form onSubmit={handleSubmit(onSubmit)} className='d-flex flex-column align-items-center'>
                                                <div className="position-relative d-flex align-items-center flex-column justify-content-center" style={{ display: "inline-block" }}>
                                                    {isCameraOpen ? (
                                                        <video ref={videoRef} autoPlay playsInline className='rounded' style={{ width: "126px", height: "129px", objectFit: "cover" }} />
                                                    ) : (
                                                        uploading ?
                                                            <Spinner />
                                                            :
                                                            <img
                                                                src={
                                                                    logo?.url
                                                                        ? logo.url.split('?')[0]
                                                                        : patientDetails?.patientChartPhoto?.url
                                                                            ? patientDetails.patientChartPhoto.url
                                                                            : profilePhoto
                                                                }
                                                                alt="Patient Profile"
                                                                className="img-fluid rounded"
                                                                style={{ width: "126px", height: "129px", objectFit: "cover" }}
                                                            />

                                                    )}

                                                    {!isCameraOpen && (
                                                        <BiEdit
                                                            className={`position-absolute fs-4 text-black ${uploading ? 'd-none' : ''}`}
                                                            style={{ bottom: "-5px", right: "-9px", cursor: "pointer" }}
                                                            onClick={openCamera}
                                                        />
                                                    )}

                                                    {isCameraOpen && (
                                                        <div className="camera-controls d-flex justify-content-center gap-1">
                                                            <Button onClick={capturePhoto} type='button' className='custom-buttons'><TbCapture className='text-white fs-5' /> </Button>
                                                            <Button onClick={stopCamera} className='custom-buttons'><IoClose className='text-white fs-5' /></Button>
                                                        </div>
                                                    )}

                                                    <canvas ref={canvasRef} style={{ display: "none" }} />
                                                </div>

                                                {/* Submit button that sends the form after upload */}
                                                <Button type="submit" className={`${!logo ? 'd-none' : 'mt-1 custom-buttons'}`} disabled={!logo} >Submit</Button>
                                            </Form>


                                        </Col>
                                        <Col sm={8}>
                                            <Row className='pt-1'>
                                                <div className='d-flex gap-2 ps-1 lh-sm'>
                                                    <p style={{ borderRight: '1px solid black' }} className='pe-2 text-nowrap  fs-6'>
                                                        <span className='fw-bold text-capitalize' style={{ color: '#f9a004' }}>
                                                            {patientDetails?.firstName ? patientDetails.firstName : ''}
                                                            {patientDetails?.middleName ? ' ' + patientDetails.middleName : ''}
                                                            {patientDetails?.lastName ? ' ' + patientDetails.lastName : ''}
                                                        </span>
                                                    </p>
                                                    <p style={{ borderRight: '1px solid black' }} className='text-nowrap  fs-6 pe-2 fw-bold'>
                                                        <span className='fs-6'> {patientDetails?.sex || 'N/A'}</span></p>
                                                    <p style={{ borderRight: '1px solid black' }} className='text-nowrap fs-6 pe-2 fw-bold'><span>{patientDetails?.dateOfBirth ? new Date(patientDetails?.dateOfBirth)?.toLocaleDateString('en-GB') : 'N/A'}</span></p>
                                                    <p className='text-nowrap mb-0 fs-6 fw-bold'><span>{patientDetails?.approxAge ? patientDetails?.approxAge + ' ' + "years old" : 'N/A'}</span></p>
                                                </div>

                                                <Col sm={6} className='p-0'>
                                                    <div className='row'>
                                                        <div className='col-12 mx-1 '>
                                                            <div className='row'>
                                                                <div className='col-3 pe-0'>
                                                                    <span className='fw-bold fs-6'>Patients Chart ID:</span>
                                                                </div>
                                                                <div className='col-9'>
                                                                    <span className='ps-2 text-primary fs-6' style={{ fontWeight: 600 }}>CH-{patientDetails?.chartNumber}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-12 mx-1 '>
                                                            <div className='row'>
                                                                <div className='col-3'>
                                                                    <span><MdPhone className='fs-5 text-primary' /></span>
                                                                </div>
                                                                <div className='col-9'>
                                                                    <span className='ps-2 fs-6' style={{ fontWeight: 600 }}>+1-{patientDetails?.cellPhone}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-12 mx-1 '>
                                                            <div className='row'>
                                                                <div className='col-3'>
                                                                    <span ><MdOutlineMarkEmailUnread className='fs-5 text-primary' /></span>
                                                                </div>
                                                                <div className='col-9'>
                                                                    <span className='ps-2 fs-6' style={{ fontWeight: 600 }}>{patientDetails?.email}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-12 mx-1 '>
                                                            <div className='row'>
                                                                <div className='col-3'>
                                                                    <span ><BiSolidLocationPlus className='fs-5 text-primary' /></span>
                                                                </div>
                                                                <div className='col-9'>
                                                                    <span className='ps-2 fs-6' style={{ fontWeight: 600 }}>{patientDetails?.address?.address ? patientDetails?.address?.address?.length > 30 ? patientDetails?.address?.address?.slice(0, 29) + '...' : patientDetails?.address?.address : 'N/A'}</span>
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
                                                    <div className='row'>
                                                        <div className='col-12 mx-1 '>
                                                            <div className='row'>
                                                                <div className='col-5'>
                                                                    <span className='fw-bold fs-6'>Primary Provider:</span>
                                                                </div>
                                                                <div className='col-7'>
                                                                    <span className='ps-2 text-primary fs-6' style={{ fontWeight: 600 }}>{patientDetails?.primaryProvider?.userId?.firstName} {patientDetails?.primaryProvider?.userId?.lastName || ''}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-12 mx-1 '>
                                                            <div className='row'>
                                                                <div className='col-5'>
                                                                    <span className='fw-bold fs-6'>Date Added:</span>
                                                                </div>
                                                                <div className='col-7'>
                                                                    <span className='ps-2 fs-6' style={{ fontWeight: 600 }}>{new Date(patientDetails?.createdAt)?.toLocaleDateString('en-GB')}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-12 mx-1 '>
                                                            <div className='row'>
                                                                <div className='col-5'>
                                                                    <span className='fw-bold fs-6'>Last Appointment Date:</span>
                                                                </div>
                                                                <div className='col-7'>
                                                                    <span className='ps-2 fs-6' style={{ fontWeight: 600 }}>01/01/2025</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-12 mx-1 '>
                                                            <div className='row'>
                                                                <div className='col-5'>
                                                                    <span className='fw-bold fs-6'>Next Appointment Date:</span>
                                                                </div>
                                                                <div className='col-7'>
                                                                    <span className='ps-2 fs-6' style={{ fontWeight: 600 }}>None</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </Col>
                                            </Row>
                                        </Col>

                                        <Col sm={2} className='d-flex justify-content-end pe-3'>
                                            <div className='text-center'>
                                                <Button className=' text-nowrap text-black d-flex justify-content-center align-items-center' onClick={() => navigate('/apps/appointments/newAppointment')} style={{ width: '100%', fontSize: '12px', height: '30px', backgroundColor: '#ffffff', borderRadius: '10px' }}>New Appointment</Button>
                                                <Button className=' text-nowrap mt-2 text-black d-flex justify-content-center align-items-center' style={{ width: '100%', fontSize: '12px', height: '30px', backgroundColor: '#ffffff', borderRadius: '10px' }}>New Referral</Button>

                                                <div className='mt-2 d-flex justify-content-end gap-2 ps-2 '>
                                                    <IoPrintSharp className='fs-3 text-black' />
                                                    <LiaReceiptSolid className='fs-3 text-black' />
                                                    {/* <TbHeartRateMonitor className='fs-4' /> */}
                                                </div>

                                            </div>

                                        </Col>

                                    </Row>
                                </Card.Body>
                            </div>
                            <div className='mt-2' >
                                <Card className='px-3'>
                                    <div className='d-flex justify-content-between align-items-center mt-1'>
                                        <ul className="nav nav-underline">
                                            {[
                                                'Patient Details',
                                                'Demographics',
                                                'Responsible Party',
                                                'Insurances',
                                                'Eligibility',
                                                'Authorizations',
                                                'Vital Status',
                                                'Balance',
                                                'Payment'
                                            ].map((tab) => (
                                                <li className="nav-item" key={tab}>
                                                    <a
                                                        className={`nav-link fw-medium  text-black ${activeTab === tab ? 'active' : ''}`}
                                                        onClick={() => handleTabClick(tab)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {tab}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button className='custom-buttons btn-height' onClick={() => navigate(-1)}>Back</Button>
                                    </div>

                                    <div className="mt-2 px-2 scroll-container" style={{ height: '58vh', overflowY: 'scroll' }}>
                                        {activeTab === 'Patient Details' && <PatientDetails />}
                                        {activeTab === 'Demographics' && <Demographics />}
                                        {activeTab === 'Insurances' && <Insurance patientId={patientDetails?._id} />}
                                        {activeTab === 'Vital Status' && <VitalStatus patientId={patientDetails?._id} />}
                                        {activeTab === 'Eligibility' && <p>Eligibility Content</p>}
                                        {activeTab === 'Authorizations' && <p>Authorizations Content</p>}
                                        {activeTab === 'Balance' && <p>Balance Content</p>}
                                        {activeTab === 'Payment' && <p> Payment Content</p>}
                                        {activeTab === 'Responsible Party' && <p><ResponsibleParty patientId={patientDetails?._id} /></p>}
                                    </div>


                                </Card>
                            </div>
                        </div>
                        <div className={isSidebarCollapsed ? 'col-1 ' : 'col-2'}>
                            <div
                                className="patient-menu-container bg-white mt-0"
                                style={{
                                    border: '1px solid #ced4da',
                                    borderRadius: '10px',
                                }}
                            >
                                <div
                                    className="card m-0 overflow-hidden"
                                    style={{ borderRadius: '5px' }}
                                >
                                    <div
                                        className="card-header d-flex justify-content-between align-items-center text-white px-2 py-1"
                                        style={{ backgroundColor: '#313A46' }}
                                    >
                                        <button
                                            className="btn p-0 shadow-none outline-none"
                                            onClick={handleSidebarToggle}
                                        >
                                            <i
                                                className="bi bi-list text-white"
                                                style={{ fontSize: '18px' }}
                                            ></i>
                                        </button>
                                        {!isSidebarCollapsed && <h5 className="m-0">Patient Chart</h5>}
                                        <button
                                            className="btn p-0 shadow-none outline-none"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#patientChartData"
                                            aria-expanded={isClinicalReviewExpandedData}
                                            aria-controls="patientChartData"
                                            onClick={handleToggle}
                                        >
                                            <i
                                                className={`bi ${isClinicalReviewExpandedData ? 'bi-chevron-up' : 'bi-chevron-down'
                                                    }`}
                                                style={{ fontSize: '14px', color: "white" }}
                                            ></i>
                                        </button>
                                    </div>
                                    <div id="patientChartData" className="collapse">
                                        <div className="card-body p-0 scroll-container" style={{ height: '77.7vh', overflow: 'auto' }}>
                                            {patientMenuItems.map((item, index) => (
                                                item.subItems ? (
                                                    <div key={index} className='ms-0'>
                                                        <p
                                                            className={`patient-menu-item text-black mb-0 ps-2 pe-2 border-bottom py-1 ${isSidebarCollapsed ? 'text-center fw-bold' : 'd-flex justify-content-between align-items-center'}`}
                                                            onClick={handleClinicalReviewToggle}
                                                            style={{
                                                                cursor: 'pointer',
                                                                backgroundColor: isClinicalReviewExpanded ? '#f8f9fa' : 'transparent',
                                                            }}
                                                        >
                                                            <span className='text-center'>
                                                                <i className={`${item.icon}`}></i>
                                                                <span className={`${isSidebarCollapsed ? 'd-none' : ''}`}>
                                                                    {" " + item.label}
                                                                </span>
                                                            </span>
                                                            <i
                                                                className={`bi ${isClinicalReviewExpanded
                                                                    ? 'bi-chevron-up'
                                                                    : 'bi-chevron-down'
                                                                    }
                                                           ${isSidebarCollapsed ? 'd-none' : ''}     
                                                                `}
                                                            ></i>
                                                        </p>
                                                        {isClinicalReviewExpanded && (
                                                            <div className="ms-0">
                                                                {item.subItems.map((subItem, subIndex) => (
                                                                    <p
                                                                        key={subIndex}
                                                                        className="text-black mb-0 ps-4 border-bottom py-1"
                                                                        // onClick={() => handleTabClick(subItem.label)}
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                            backgroundColor:
                                                                                activeTab === subItem.label ? '#e9ecef' : 'transparent',
                                                                            fontWeight: activeTab === subItem.label ? 'bold' : 'normal',
                                                                        }}
                                                                    >
                                                                        {subItem.label}
                                                                    </p>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p
                                                        key={index}
                                                        className={`patient-menu-item text-black mb-0 ps-2 py-1 ${isSidebarCollapsed ? 'text-center fw-bold' : ''}`}
                                                        // onClick={() => handleTabClick(item.label)}
                                                        style={{
                                                            cursor: 'pointer',
                                                            backgroundColor: activeTab === item.label ? '#f8f9fa' : 'transparent',
                                                            fontWeight: activeTab === item.label ? 'bold' : 'normal',
                                                        }}
                                                    >
                                                        <i className={`${item.icon}`}></i> <span className={`${isSidebarCollapsed ? 'd-none' : ''}`}>{item.label}</span>
                                                    </p>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default UpdatePatientIndex;
