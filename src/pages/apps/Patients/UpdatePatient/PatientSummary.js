import React from 'react';
import { Card, Col, Row, Badge, Table } from 'react-bootstrap';
import { MdOutlinePrint, MdAddCircleOutline } from 'react-icons/md';
import { FaHeartbeat, FaAllergies, FaProcedures, FaPills, FaUserMd, FaCalendarAlt } from 'react-icons/fa';
import { GiHealthNormal } from 'react-icons/gi';
import './patientSummary.css'; // Assuming you have a CSS file for styles
const PatientSummary = ({ isAccordionOpen }) => {
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
            { date: '2025-02-20', type: 'Emergency Room Visit', provider: 'Dr. Johnson', location: 'City General Hospital' },
            { date: '2025-01-10', type: 'Follow-up Appointment', provider: 'Dr. Williams', location: 'Cardiology Clinic' },
        ],
        appointments: [
            { date: '2025-04-30', time: '10:00 AM', provider: 'Dr. Smith', type: 'Routine Checkup', location: 'Main Clinic' },
            { date: '2025-05-15', time: '1:30 PM', provider: 'Dr. Johnson', type: 'Endocrinology Follow-up', location: 'Diabetes Center' },
        ],
    };

    const getSeverityBadge = (severity) => {
        const variantMap = {
            'Severe': 'danger',
            'Moderate': 'warning',
            'Mild': 'info'
        };
        return <span className={`ms-2 text-${variantMap[severity]}`}>{severity}</span>;
    };

    const getStatusBadge = (status) => {
        const variantMap = {
            'Active': 'primary',
            'Controlled': 'success',
            'PRN': 'secondary'
        };
        return <span className={`ms-2 text-${variantMap[status]}`}>{status}</span>;
    };

    return (
        <div className="patient-summary">

            <Row className={`scroll-container  g-2   ${isAccordionOpen ? 'summary-expanded' : 'summary-collapsed'}`}>
                {/* Vitals Card */}
                <Col sm={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className='p-1 d-flex justify-content-between align-items-center bg-light'>
                            <div className="d-flex align-items-center">
                                <FaHeartbeat className="me-2 text-secondary" />
                                <span className="fw-bold fs-6">Vitals</span>
                            </div>
                            <div>
                                <MdAddCircleOutline className="text-primary me-2 cursor-pointer" />
                                <MdOutlinePrint className="text-secondary cursor-pointer" />
                            </div>
                        </Card.Header>
                        <Card.Body className='p-2'>
                            <div className="vitals-grid fs-6">
                                <div className="vital-item">
                                    <span className="text-muted">Heart Rate</span>
                                    <div className="fw-bold">{patientSummary.vitals.heartRate} <span>bpm</span></div>
                                </div>
                                <div className="vital-item">
                                    <span className="text-muted">Blood Pressure</span>
                                    <div className="fw-bold">{patientSummary.vitals.bloodPressure}</div>
                                </div>
                                <div className="vital-item">
                                    <span className="text-muted">Temperature</span>
                                    <div className="fw-bold">{patientSummary.vitals.temperature}</div>
                                </div>
                                <div className="vital-item">
                                    <span className="text-muted">Respiratory Rate</span>
                                    <div className="fw-bold">{patientSummary.vitals.respiratoryRate} <span>breaths/min</span></div>
                                </div>
                                <div className="vital-item">
                                    <span className="text-muted">Oxygen Sat.</span>
                                    <div className="fw-bold">{patientSummary.vitals.oxygenSaturation}</div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Allergies Card */}
                <Col sm={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className='p-1 d-flex justify-content-between align-items-center bg-light'>
                            <div className="d-flex align-items-center">
                                <FaAllergies className="me-2 text-secondary" />
                                <span className="fw-bold fs-6">Allergies</span>
                            </div>
                            <div>
                                <MdAddCircleOutline className="text-primary me-2 cursor-pointer" />
                                <MdOutlinePrint className="text-secondary cursor-pointer" />
                            </div>
                        </Card.Header>
                        <Card.Body className='p-2'>
                            <ul className="list-unstyled">
                                {patientSummary.allergies.map((allergy, index) => (
                                    <li key={index} className="mb-2 d-flex justify-content-between align-items-center">
                                        <div className='fs-6'>
                                            <strong>{allergy.name}</strong>
                                            <div className="text-muted ">{allergy.reaction}</div>
                                        </div>
                                        <span className='fs-6 fw-semibold'>
                                            {getSeverityBadge(allergy.severity)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Problems Card */}
                <Col sm={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className='p-1 d-flex justify-content-between align-items-center bg-light'>
                            <div className="d-flex align-items-center">
                                <FaProcedures className="me-2 text-secondary" />
                                <span className="fw-bold fs-6">Problems</span>
                            </div>
                            <div>
                                <MdAddCircleOutline className="text-primary me-2 cursor-pointer" />
                                <MdOutlinePrint className="text-secondary cursor-pointer" />
                            </div>
                        </Card.Header>
                        <Card.Body className='p-2'>
                            <ul className="list-unstyled">
                                {patientSummary.problems.map((problem, index) => (
                                    <li key={index} className="mb-2 d-flex justify-content-between align-items-center">
                                        <div className='fs-6'>
                                            <strong>{problem.name}</strong>
                                            <div className="text-muted small">Since {problem.since}</div>
                                        </div>
                                        <span className='fs-6 fw-semibold'>
                                            {getStatusBadge(problem.status)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Medications Card */}
                <Col sm={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className='p-1 d-flex justify-content-between align-items-center bg-light'>
                            <div className="d-flex align-items-center">
                                <FaPills className="me-2 text-secondary" />
                                <span className="fw-bold fs-6">Medications</span>
                            </div>
                            <div>
                                <MdAddCircleOutline className="text-primary me-2 cursor-pointer" />
                                <MdOutlinePrint className="text-secondary cursor-pointer" />
                            </div>
                        </Card.Header>
                        <Card.Body className='p-2'>
                            <ul className="list-unstyled">
                                {patientSummary.medications.map((medication, index) => (
                                    <li key={index} className="mb-2 d-flex justify-content-between align-items-start">
                                        <div className='fs-6'>
                                            <strong className=''>{medication.name}</strong>
                                            <div className="text-muted ">
                                                {medication.dosage} • {medication.frequency}
                                            </div>
                                        </div>
                                        <span className='fw-semibold fs-6'>
                                            {getStatusBadge(medication.status)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Social History Card */}
                <Col sm={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className='p-1 d-flex justify-content-between align-items-center bg-light'>
                            <div className="d-flex align-items-center">
                                <FaUserMd className="me-2 text-secondary" />
                                <span className="fw-bold fs-6">Social History</span>
                            </div>
                            <div>
                                <MdAddCircleOutline className="text-primary me-2 cursor-pointer" />
                                <MdOutlinePrint className="text-secondary cursor-pointer" />
                            </div>
                        </Card.Header>
                        <Card.Body className='p-2'>
                            <div className="social-history-item mb-2">
                                <span className="text-muted fs-6">Smoking</span>
                                <div className='fs-6 fw-semibold'>{patientSummary.socialHistory.smoking}</div>
                            </div>
                            <div className="social-history-item mb-2">
                                <span className="text-muted fs-6">Alcohol</span>
                                <div className='fs-6 fw-semibold'>{patientSummary.socialHistory.alcohol}</div>
                            </div>
                            <div className="social-history-item mb-2">
                                <span className="text-muted fs-6">Exercise</span>
                                <div className='fs-6 fw-semibold'>{patientSummary.socialHistory.exercise}</div>
                            </div>
                            <div className="social-history-item">
                                <span className="text-muted fs-6">Diet</span>
                                <div className='fs-6 fw-semibold'>{patientSummary.socialHistory.diet}</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Encounters Card */}
                <Col sm={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className='p-1 d-flex justify-content-between align-items-center bg-light'>
                            <div className="d-flex align-items-center">
                                <FaCalendarAlt className="me-2 text-secondary" />
                                <span className="fw-bold fs-6">Recent Encounters</span>
                            </div>
                            <div>
                                <MdAddCircleOutline className="text-primary me-2 cursor-pointer" />
                                <MdOutlinePrint className="text-secondary cursor-pointer" />
                            </div>
                        </Card.Header>
                        <Card.Body className='p-2'>
                            <ul className="list-unstyled">
                                {patientSummary.encounters.map((encounter, index) => (
                                    <li key={index} className="mb-3">
                                        <div className="d-flex fs-6 justify-content-between">
                                            <strong >{encounter.type}</strong>
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
                        <Card.Header className='p-1 d-flex justify-content-between align-items-center bg-light'>
                            <div className="d-flex align-items-center">
                                <FaCalendarAlt className="me-2 text-secondary" />
                                <span className="fw-bold fs-6">Upcoming Appointments</span>
                            </div>
                            <div>
                                <MdAddCircleOutline className="text-primary me-2 cursor-pointer" />
                                <MdOutlinePrint className="text-secondary cursor-pointer" />
                            </div>
                        </Card.Header>
                        <Card.Body className='p-2'>
                            <div className="table-responsive">
                                <Table responsive className="table-centered fs-6 table-nowrap mb-0  rounded" >
                                    <thead >
                                        <tr>
                                            <th className='fs-6 text-white'>Date</th>
                                            <th className='fs-6 text-white'>Time</th>
                                            <th className='fs-6 text-white'>Provider</th>
                                            <th className='fs-6 text-white'>Type</th>
                                            <th className='fs-6 text-white'>Location</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patientSummary.appointments.map((appointment, index) => (
                                            <tr key={index}>
                                                <td className='fs-6'>{appointment.date}</td>
                                                <td className='fs-6'>{appointment.time}</td>
                                                <td className='fs-6'>{appointment.provider}</td>
                                                <td className='fs-6'>{appointment.type}</td>
                                                <td className='fs-6'>{appointment.location}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PatientSummary;