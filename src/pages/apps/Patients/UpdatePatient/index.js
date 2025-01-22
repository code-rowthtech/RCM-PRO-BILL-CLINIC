import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { FormInput } from '../../../../components';
import profileDummy from '../../../../assets/images/profileDummy.png'
import { IoPrintSharp } from "react-icons/io5";
import Demographics from './Demographics';
import { TbHeartRateMonitor } from "react-icons/tb";
import { LiaReceiptSolid } from "react-icons/lia";
import PatientDetails from './PatientDetails';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientByIdAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';

const UpdatePatientIndex = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const patientDetails = store?.getPatientByIdReducer?.data?.patient;
    const updateSuccess = store?.updatePatientsReducer?.data?.status;
    useEffect(() => {
        const payload = {
            id: id,
        }
        if (id) {

            dispatch(getPatientByIdAction({ key: encryptMessage(payload) }));
        }
        if (updateSuccess === 200) {
            dispatch(getPatientByIdAction({ key: encryptMessage(payload) }));
        }

    }, [id, updateSuccess])
    const [activeTab, setActiveTab] = useState('Patient Details');

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <div className="pt-1 pb-2">
            <div className='container-fluid d-flex justify-content-center align-items-center px-0 mt-2'>
                {store?.getPatientByIdReducer?.loading ?
                    <Spinner />
                    :
                    <div className='row'>
                        <div className='col-10'>
                            <Card
                                className='mb-1'
                                style={{
                                    background: '#E6EBFF',
                                    width: 'auto',
                                    border: '1px solid #a4c5d5'
                                }}>
                                <Card.Body className="p-1">
                                    <Row>
                                        <Col sm={2} className='d-flex align-items-center justify-content-center'>
                                            <div>
                                                <img
                                                    src={patientDetails?.patientChartPhoto?.url ? patientDetails?.patientChartPhoto?.url : profileDummy}
                                                    alt="Patient Profile"
                                                    className="img-fluid rounded-circle"
                                                    style={{ width: '6rem', height: '6rem', objectFit: 'cover' }}
                                                />
                                            </div>
                                        </Col>
                                        <Col sm={8}>
                                            <Row className='pt-1'>
                                                <div className='d-flex gap-2 ps-1 lh-sm'>
                                                    <p style={{ borderRight: '1px solid black' }} className='pe-2 text-nowrap mb-0 fs-6'>
                                                        <span className='fw-bold text-capitalize' style={{ color: '#f9a004' }}>
                                                            {patientDetails?.firstName + ' ' + patientDetails?.middleName + ' ' + patientDetails?.lastName}
                                                        </span>
                                                    </p>
                                                    <p style={{ borderRight: '1px solid black' }} className='text-nowrap mb-0 fs-6 pe-2'>
                                                        <span className='fs-6'> {patientDetails?.sex}</span></p>
                                                    <p style={{ borderRight: '1px solid black' }} className='text-nowrap mb-0 fs-6 pe-2'><span>{new Date(patientDetails?.dateOfBirth)?.toLocaleDateString('en-GB')}</span></p>
                                                    <p className='text-nowrap mb-0 fs-6'><span>{patientDetails?.approxAge} years old</span></p>
                                                </div>
                                                <Col sm={6} className='p-0'>
                                                    <div>
                                                        <p className='fs-6 m-1'><span className='fw-bold'>Patients Chart ID:</span><span className='ps-2 text-primary'>CH-{patientDetails?.chartNumber}</span></p>
                                                        <p className='fs-6 m-1'><span className='fw-bold'>Phone:</span><span className='ps-2'>+1-{patientDetails?.cellPhone}</span></p>
                                                        <p className='fs-6 m-1'><span className='fw-bold'>Email:</span><span className='ps-2'>{patientDetails?.email}</span></p>
                                                        <p className='fs-6 m-1'><span className='fw-bold'>Address:</span><span className='ps-2'>{patientDetails?.address?.address?.length > 50 ? patientDetails?.address?.address?.slice(0, 49) + '...' : patientDetails?.address?.address}</span></p>
                                                    </div>
                                                </Col>
                                                <Col sm={6}>
                                                    <div>
                                                        <p className='fs-6 m-1'><span className='fw-bold'>Primary Provider:</span><span className='ps-2'>{patientDetails?.primaryProvider?.userId?.firstName} {patientDetails?.primaryProvider?.userId?.lastName || ''}</span></p>
                                                        <p className='fs-6 m-1'><span className='fw-bold'>Date Added:</span><span className='ps-2'>{new Date(patientDetails?.createdAt)?.toLocaleDateString('en-GB')}</span></p>
                                                        <p className='fs-6 m-1'><span className='fw-bold'>Last Scheduled appt:</span><span className='ps-2 text-primary'>01/01/2025</span></p>
                                                        <p className='fs-6 m-1'><span className='fw-bold'>Next Scheduled appt:</span><span className='ps-2'>None</span></p>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>

                                        <Col sm={2} className='d-flex justify-content-center align-items-center'>
                                            <div className='d-flex justify-content-center align-items-center flex-column'>
                                                <Button className=' text-nowrap custom-buttons' onClick={() => navigate('/apps/appointments/newAppointment')} style={{ width: '100%', fontSize: '12px', height: '30px' }}>New Appointment</Button>
                                                <Button className=' text-nowrap custom-buttons mt-2' style={{ width: '100%', fontSize: '12px', height: '30px' }}>New Referral</Button>
                                                <div className='mt-1 d-flex gap-2 ps-2 '>
                                                    <IoPrintSharp className='fs-3' />
                                                    <LiaReceiptSolid className='fs-3 text-black' />
                                                    <TbHeartRateMonitor className='fs-3' />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                            <div className='mt-2' >
                                <Card className='px-2'>
                                    <div className='d-flex justify-content-between align-items-center mt-1'>
                                        <ul className="nav nav-underline">
                                            {[
                                                'Patient Details',
                                                'Demographics',
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
                                        <Button className='custom-buttons' onClick={() => navigate(-1)}>Back</Button>
                                    </div>

                                    <div className="mt-2 scroll-container" style={{ height: '64vh', overflowY: 'scroll' }}>
                                        {activeTab === 'Patient Details' && <PatientDetails />}
                                        {activeTab === 'Demographics' && <Demographics />}
                                        {activeTab === 'Insurances' && <p>Insurances Content</p>}
                                        {activeTab === 'Eligibility' && <p>Eligibility Content</p>}
                                        {activeTab === 'Authorizations' && <p>Authorizations Content</p>}
                                        {activeTab === 'Vital Status' && <p>Vital Status Content</p>}
                                        {activeTab === 'Balance' && <p>Balance Content</p>}
                                        {activeTab === 'Payment' && <p> Payment Content</p>}
                                    </div>


                                </Card>
                            </div>
                        </div>
                        <div className='col-2'>
                            {/* <div style={{ height: '30px' }}> */}
                            <FormInput type="text" placeholder="Search..." />
                            {/* </div> */}
                            <div className='d-flex justify-content-center mt-2'>
                                <Button className="custom-buttons text-nowrap w-100" onClick={() => navigate('/apps/patients/new-patient')} style={{ height: '30px' }}>
                                    Add New Patient
                                </Button>
                            </div>
                            <div>
                                <div
                                    className="patient-menu-container rounded bg-white mt-2"
                                    style={{ border: '1px solid #ced4da' }}
                                >
                                    {[
                                        "Demographic", "Appointments", "Clinical Dashboard", "Documents", "Problem list",
                                        "Medication list", "Allergy list", "Drug Interactions", "CQMs", "Intake Data",
                                        "Lab Orders", "Immunizations", "Patient Cost Estimator", "Growth Charts",
                                        "Onpatient Access", "Education Resources", "Communication", "Family History",
                                        "Imaging orders", "Implantable devices"
                                    ].map((item, index) => (
                                        <p
                                            key={index}
                                            className="patient-menu-item text-black mb-0 ps-2 py-1"
                                        >
                                            {item}
                                        </p>
                                    ))}
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
