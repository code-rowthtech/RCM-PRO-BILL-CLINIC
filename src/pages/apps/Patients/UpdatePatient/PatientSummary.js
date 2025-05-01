import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Badge, Table, Form, Modal } from 'react-bootstrap';
import { MdOutlinePrint, MdAddCircleOutline } from 'react-icons/md';
import { FaHeartbeat, FaAllergies, FaProcedures, FaPills, FaUserMd, FaCalendarAlt } from 'react-icons/fa';
import { GiHealthNormal } from 'react-icons/gi';
import './patientSummary.css'; // Assuming you have a CSS file for styles
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getAppointmentsAction, getVitalsByPatientIdAction } from '../../../../redux/actions';
import { handlePrintAllergies } from '../Task Tabs/PDFfiles/allergyPDF';
import { getAllergiesOfPatientAction } from '../../../../redux/allergyList/action';
import AddAllergy from '../Task Tabs/AddAllergy';
import AddProblem from '../Task Tabs/AddProblem';
import { getProblemListAction } from '../../../../redux/ProblemList/action';
import { handlePrintProblems } from '../Task Tabs/PDFfiles/problemPDF';
import Paginations from '../../../../helpers/Paginations';
import NewAppointment from '../../Appointments/NewAppointment';
const PatientSummary = ({ isAccordionOpen, setSelectedMainTab }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const patientVitals = store?.getVitalsByPatientIdReducer?.data?.data?.[0];
    const allergyData = store?.getAllergiesOfAPatientReducer?.data?.allergies;
    const patientDetails = store?.getPatientByIdReducer?.data?.data;
    const problemData = store?.getProblemListReducer?.data?.problems;
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const appointmentsList = store?.getAppointmentsReducer?.data?.appointments;
    console.log(appointmentsList, 'appiontmn');
    console.log(store?.getProblemListReducer, 'problemData');
    const [effectiveDateTime, setEffectiveDateTime] = useState('');
    const [skip, setSkip] = useState(1);

    useEffect(() => {
        dispatch(getVitalsByPatientIdAction({ patientId, effectiveDateTime: effectiveDateTime }));
    }, [dispatch, patientId, effectiveDateTime]);
    useEffect(() => {
        if (patientId) {
            dispatch(getProblemListAction({ patientId }));
        }
    }, [dispatch, patientId]);
    const patientSummary = {
        vitals: {
            heartRate: 72,
            bloodPressure: '120/80 mmHg',
            temperature: '98.6 °F',
            respiratoryRate: 16,
            oxygenSaturation: '98%',
        },
        allergies: [
            { name: 'Penicillin', reaction: 'Rash', severity: 'Moderate' },
            { name: 'Peanuts', reaction: 'Anaphylaxis', severity: 'Severe' },
            { name: 'Aspirin', reaction: 'Gastric irritation', severity: 'Mild' },
        ],
        problems: [
            { name: 'Hypertension', status: 'Active', since: '2018' },
            { name: 'Type 2 Diabetes', status: 'Controlled', since: '2020' },
            { name: 'Chronic Back Pain', status: 'Active', since: '2019' },
        ],
        medications: [
            { name: 'Lisinopril', dosage: '10mg', frequency: 'Once a day', status: 'Active' },
            { name: 'Metformin', dosage: '500mg', frequency: 'Twice a day', status: 'Active' },
            { name: 'Ibuprofen', dosage: '200mg', frequency: 'As needed for pain', status: 'PRN' },
        ],
        socialHistory: {
            smoking: 'Former smoker, quit 5 years ago',
            alcohol: 'Occasional, 2-3 times a week',
            exercise: 'Walks 3 times a week for 30 minutes',
            diet: 'Balanced diet, focusing on low-carb meals',
        },
        encounters: [
            { date: '2025-03-15', type: 'Routine Checkup', provider: 'Dr. Smith', location: 'Primary Care' },
            {
                date: '2025-02-20',
                type: 'Emergency Room Visit',
                provider: 'Dr. Johnson',
                location: 'City General Hospital',
            },
            {
                date: '2025-01-10',
                type: 'Follow-up Appointment',
                provider: 'Dr. Williams',
                location: 'Cardiology Clinic',
            },
        ],
        appointments: [
            {
                date: '2025-04-30',
                time: '10:00 AM',
                provider: 'Dr. Smith',
                type: 'Routine Checkup',
                location: 'Main Clinic',
            },
            {
                date: '2025-05-15',
                time: '1:30 PM',
                provider: 'Dr. Johnson',
                type: 'Endocrinology Follow-up',
                location: 'Diabetes Center',
            },
        ],
    };
    const getSeverityBadge = (severity) => {
        if (!severity || !severity.code || !severity.display) return null;

        const code = severity.code.toLowerCase();

        const variantMap = {
            high: 'danger',
            severe: 'danger',
            moderate: 'warning',
            low: 'info',
            mild: 'info',
        };

        const variant = variantMap[code] || 'secondary';

        return <span className={`ms-2 text-${variant}`}>{severity.display}</span>;
    };

    const getStatusBadge = (status) => {
        const variantMap = {
            Active: 'primary',
            Controlled: 'success',
            PRN: 'secondary',
        };
        return <span className={`ms-2 text-${variantMap[status]}`}>{status}</span>;
    };
    useEffect(() => {
        dispatch(
            getAppointmentsAction({
                clinicId: clinicId,
                patientId: patientId,
                status: 'upcoming',
                skip: skip,
                limit: 4,
            })
        );
    }, [dispatch, skip]);
    useEffect(() => {
        if (patientVitals) {
            setEffectiveDateTime(
                patientVitals?.effectiveDateTime
                    ? new Date(patientVitals?.effectiveDateTime)?.toISOString().split('T')[0]
                    : ''
            );
        }
    }, [patientVitals]);
    useEffect(() => {
        const data = {
            patientId: patientId,
        };

        dispatch(getAllergiesOfPatientAction(data));
    }, [dispatch, patientId]);
    const [showAddAllergyModal, setShowAddAllergyModal] = useState(false);
    const [showAddProblemModal, setShowAddProblemModal] = useState(false);
    const [showAppointmentModal , setShowAppointmentModal] = useState(false);

    const handleAddAllergyOpen = () => setShowAddAllergyModal(true);
    const handleAddProblemOpen = () => setShowAddProblemModal(true);
    const handleAddAppointmentOpen = () => setShowAppointmentModal(true);

    const handleAddAllergyClose = () => setShowAddAllergyModal(false);
    const handleAddProblemClose = () => setShowAddProblemModal(false);
    const handleAppointmentClose = ()=> setShowAppointmentModal(false);
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
    return (
        <div className="patient-summary">
            <Row className={`scroll-container  g-2   ${isAccordionOpen ? 'summary-expanded' : 'summary-collapsed'}`}>
                {/* Vitals Card */}
                <Col sm={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="p-1 d-flex justify-content-between align-items-center bg-light">
                            <div className="d-flex align-items-center">
                                <FaHeartbeat className="me-2 text-secondary" />
                                <span className="fw-bold fs-6">Vitals</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <Form.Control
                                    type="date"
                                    value={effectiveDateTime}
                                    onChange={(e) => setEffectiveDateTime(e.target.value)}
                                />
                                <MdAddCircleOutline className="text-primary me-2 cursor-pointer" />
                                <MdOutlinePrint className="text-secondary cursor-pointer" />
                            </div>
                        </Card.Header>
                        <Card.Body className="p-2 scroll-container" style={{ height: '22vh' }}>
                            <div className="vitals-grid fs-6">
                                {patientVitals?.vitals?.map((data) => (
                                    <div className="vital-item">
                                        <span className="text-muted">{data?.code?.coding?.[0]?.display}</span>
                                        {data?.valueString && (
                                            <div className="fw-bold">{data?.valueString || 'N/A'}</div>
                                        )}
                                        {data?.valueQuantity && (
                                            <div className="fw-bold">
                                                {data?.valueQuantity?.value || 'N/A'}{' '}
                                                <span>{data?.valueQuantity?.unit}</span>
                                            </div>
                                        )}
                                        {data?.component && !data?.valueString && !data?.valueQuantity && (
                                            <div className="fw-bold">
                                                {(() => {
                                                    const systolic = data.component.find(
                                                        (c) => c.code?.coding?.[0]?.code === '8480-6'
                                                    )?.valueQuantity?.value;

                                                    const diastolic = data.component.find(
                                                        (c) => c.code?.coding?.[0]?.code === '8462-4'
                                                    )?.valueQuantity?.value;

                                                    return `${systolic || 'N/A'} / ${diastolic || 'N/A'}`;
                                                })()}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Allergies Card */}
                <Col sm={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="p-1 d-flex justify-content-between align-items-center bg-light">
                            <div className="d-flex align-items-center">
                                <FaAllergies className="me-2 text-secondary" />
                                <span className="fw-bold fs-6">Allergies</span>
                            </div>
                            <div>
                                <MdAddCircleOutline
                                    className="text-primary me-2 cursor-pointer"
                                    onClick={handleAddAllergyOpen}
                                />
                                <MdOutlinePrint
                                    className="text-secondary cursor-pointer"
                                    title="Print all Allergies"
                                    onClick={() => handlePrintAllergies({ patientDetails, allergyData })}
                                />
                            </div>
                        </Card.Header>
                        <Card.Body className="p-2 pb-0">
                            {allergyData && allergyData.length > 0 ? (
                                <ul className="list-unstyled pb-0 mb-0">
                                    {allergyData.slice(0, 4).map((allergy, index) => (
                                        <li
                                            key={index}
                                            className="mb-2 d-flex justify-content-between align-items-center">
                                            <div className="fs-6">
                                                <strong>{allergy.code?.text || 'Unknown Allergy'}</strong>
                                                <div className="text-muted small">
                                                    {allergy.clinicalStatus?.text || 'Status not available'}
                                                </div>
                                            </div>
                                            <span className="fs-6 fw-semibold">
                                                {getSeverityBadge(allergy.criticality)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <ul className="list-unstyled">
                                    {(patientSummary?.allergies || []).map((allergy, index) => (
                                        <li
                                            key={index}
                                            className="mb-2 d-flex justify-content-between align-items-center">
                                            <div className="fs-6">
                                                <strong>{allergy.name || 'Unknown Allergy'}</strong>
                                                <div className="text-muted small">
                                                    Since {allergy.reaction || 'N/A'}
                                                </div>
                                            </div>
                                            <span className="fs-6 fw-semibold">
                                                {getSeverityBadge({
                                                    code: allergy.severity,
                                                    display: allergy.severity,
                                                    status: true,
                                                })}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card.Body>
                        <div
                            className="fs-6 text-end text-info d-flex align-items-end justify-content-end px-2 pb-1 cursor-pointer text-decoration-underline"
                            onClick={() => setSelectedMainTab('Allergy List')}>
                            Go To Allergies List
                        </div>
                    </Card>
                </Col>

                {/* Problems Card */}
                <Col sm={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="p-1 d-flex justify-content-between align-items-center bg-light">
                            <div className="d-flex align-items-center">
                                <FaProcedures className="me-2 text-secondary" />
                                <span className="fw-bold fs-6">Problems</span>
                            </div>
                            <div>
                                <MdAddCircleOutline
                                    className="text-primary me-2 cursor-pointer"
                                    onClick={handleAddProblemOpen}
                                />
                                <MdOutlinePrint
                                    className="text-secondary cursor-pointer"
                                    onClick={() => handlePrintProblems({ patientDetails, problemData })}
                                />
                            </div>
                        </Card.Header>
                        <Card.Body className="p-2">
                            {problemData && problemData.length > 0 ? (
                                <ul className="list-unstyled pb-0 mb-0">
                                    {problemData.slice(0, 4).map((problem, index) => (
                                        <li
                                            key={index}
                                            className="mb-2 d-flex justify-content-between align-items-center">
                                            <div className="fs-6">
                                                <strong title={problem?.code?.text}>
                                                    {problem?.code?.text?.length > 30
                                                        ? problem.code.text.slice(0, 30) + '...'
                                                        : problem?.code?.text || 'Unknown Allergy'}
                                                </strong>{' '}
                                                <div className="text-muted small">
                                                    {problem?.clinicalStatus?.text || 'Status not available'}
                                                </div>
                                            </div>
                                            <span className="fs-6 fw-semibold text-success">
                                                {new Date(problem?.onsetDateTime).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <ul className="list-unstyled">
                                    {patientSummary.problems.map((problem, index) => (
                                        <li
                                            key={index}
                                            className="mb-2 d-flex justify-content-between align-items-center">
                                            <div className="fs-6">
                                                <strong>{problem.name}</strong>
                                                <div className="text-muted small">Since {problem.since}</div>
                                            </div>
                                            <span className="fs-6 fw-semibold">{getStatusBadge(problem.status)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card.Body>
                        <div
                            className="fs-6 text-end text-info d-flex align-items-end justify-content-end px-2 pb-1 cursor-pointer text-decoration-underline"
                            onClick={() => setSelectedMainTab('Problem List')}>
                            Go To Problem List
                        </div>
                    </Card>
                </Col>

                {/* Medications Card */}
                <Col sm={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="p-1 d-flex justify-content-between align-items-center bg-light">
                            <div className="d-flex align-items-center">
                                <FaPills className="me-2 text-secondary" />
                                <span className="fw-bold fs-6">Medications</span>
                            </div>
                            <div>
                                <MdAddCircleOutline className="text-primary me-2 cursor-pointer" />
                                <MdOutlinePrint className="text-secondary cursor-pointer" />
                            </div>
                        </Card.Header>
                        <Card.Body className="p-2">
                            <ul className="list-unstyled">
                                {patientSummary.medications.map((medication, index) => (
                                    <li key={index} className="mb-2 d-flex justify-content-between align-items-start">
                                        <div className="fs-6">
                                            <strong className="">{medication.name}</strong>
                                            <div className="text-muted ">
                                                {medication.dosage} • {medication.frequency}
                                            </div>
                                        </div>
                                        <span className="fw-semibold fs-6">{getStatusBadge(medication.status)}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Social History Card */}
                <Col sm={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="p-1 d-flex justify-content-between align-items-center bg-light">
                            <div className="d-flex align-items-center">
                                <FaUserMd className="me-2 text-secondary" />
                                <span className="fw-bold fs-6">Social History</span>
                            </div>
                            <div>
                                <MdAddCircleOutline className="text-primary me-2 cursor-pointer" />
                                <MdOutlinePrint className="text-secondary cursor-pointer" />
                            </div>
                        </Card.Header>
                        <Card.Body className="p-2">
                            <div className="social-history-item mb-2">
                                <span className="text-muted fs-6">Smoking</span>
                                <div className="fs-6 fw-semibold">{patientSummary.socialHistory.smoking}</div>
                            </div>
                            <div className="social-history-item mb-2">
                                <span className="text-muted fs-6">Alcohol</span>
                                <div className="fs-6 fw-semibold">{patientSummary.socialHistory.alcohol}</div>
                            </div>
                            <div className="social-history-item mb-2">
                                <span className="text-muted fs-6">Exercise</span>
                                <div className="fs-6 fw-semibold">{patientSummary.socialHistory.exercise}</div>
                            </div>
                            <div className="social-history-item">
                                <span className="text-muted fs-6">Diet</span>
                                <div className="fs-6 fw-semibold">{patientSummary.socialHistory.diet}</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Encounters Card */}
                <Col sm={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="p-1 d-flex justify-content-between align-items-center bg-light">
                            <div className="d-flex align-items-center">
                                <FaCalendarAlt className="me-2 text-secondary" />
                                <span className="fw-bold fs-6">Recent Encounters</span>
                            </div>
                            <div>
                                <MdAddCircleOutline className="text-primary me-2 cursor-pointer" />
                                <MdOutlinePrint className="text-secondary cursor-pointer" />
                            </div>
                        </Card.Header>
                        <Card.Body className="p-2">
                            <ul className="list-unstyled">
                                {patientSummary.encounters.map((encounter, index) => (
                                    <li key={index} className="mb-3">
                                        <div className="d-flex fs-6 justify-content-between">
                                            <strong>{encounter.type}</strong>
                                            <span className="text-muted">{encounter.date}</span>
                                        </div>
                                        <div className="text-muted fs-6">{encounter.provider}</div>
                                        <div className="text-muted fs-6">{encounter.location}</div>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Appointments Card - Full Width */}
                <Col sm={12}>
                    <Card className="shadow-sm">
                        <Card.Header className="p-1 d-flex justify-content-between align-items-center bg-light">
                            <div className="d-flex align-items-center">
                                <FaCalendarAlt className="me-2 text-secondary" />
                                <span className="fw-bold fs-6">Upcoming Appointments</span>
                            </div>
                            <div>
                                <MdAddCircleOutline className="text-primary me-2 cursor-pointer" onClick={handleAddAppointmentOpen}/>
                                <MdOutlinePrint className="text-secondary cursor-pointer" />
                            </div>
                        </Card.Header>
                        <Card.Body className="p-2">
                            <div className="table-responsive">
                                <Table responsive className="table-centered fs-6 table-nowrap mb-0  rounded">
                                    <thead>
                                        <tr>
                                            <th className="fs-6 text-white">Date</th>
                                            <th className="fs-6 text-white">Time</th>
                                            <th className="fs-6 text-white">Provider</th>
                                            <th className="fs-6 text-white">Type</th>
                                            {/* <th className="fs-6 text-white">Location</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointmentsList?.map((appointment, index) => (
                                            <tr key={index}>
                                                <td className="fs-6">
                                                    {appointment?.date
                                                        ? new Date(appointment?.date).toLocaleDateString('en-GB', {
                                                              day: '2-digit',
                                                              month: 'short',
                                                              year: 'numeric',
                                                          })
                                                        : ''}
                                                </td>{' '}
                                                <td className="fs-6">
                                                    {appointment?.start
                                                        ? new Date(appointment?.start).toLocaleTimeString('en-US', {
                                                              hour: '2-digit',
                                                              minute: '2-digit',
                                                              hour12: true,
                                                          })
                                                        : ''}
                                                </td>{' '}
                                                <td className="fs-6">{appointment?.doctorId?.name?.[0]?.text}</td>
                                                <td className="fs-6">
                                                    {appointment?.appointmentType?.coding?.[0]?.display}
                                                </td>
                                                {/* <td className="fs-6">{appointment.location}</td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <Col className="mt-2 d-flex justify-content-end">
                                    <Paginations
                                        currentPage={skip}
                                        totalPages={store?.getAppointmentsReducer?.data?.pagination?.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </Col>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={showAddAllergyModal} onHide={handleAddAllergyClose} size="lg" centered>
                <Modal.Header closeButton className="px-2 py-0">
                    <Modal.Title className="">Add Allergy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddAllergy onCancel={handleAddAllergyClose} />
                </Modal.Body>
            </Modal>
            <Modal show={showAddProblemModal} onHide={handleAddProblemClose} size="lg" centered>
                <Modal.Header closeButton className="px-2 py-0">
                    <Modal.Title className="">Add Problem</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddProblem onCancel={handleAddProblemClose} />
                </Modal.Body>
            </Modal>
            <Modal show={showAppointmentModal} onHide={handleAppointmentClose} size="lg" centered>
                <Modal.Header closeButton className="px-2 py-0">
                    <Modal.Title className="">Add Appointment </Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-0'>
                    <NewAppointment onCancel={handleAppointmentClose} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PatientSummary;
