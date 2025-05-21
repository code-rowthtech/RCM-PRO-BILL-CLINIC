import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Badge, Table, Form, Modal } from 'react-bootstrap';
import { MdOutlinePrint, MdAddCircleOutline } from 'react-icons/md';
import { FaHeartbeat, FaAllergies, FaProcedures, FaPills, FaUserMd, FaCalendarAlt } from 'react-icons/fa';
import './patientSummary.css'; // Assuming you have a CSS file for styles
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getAppointmentsAction, getFamilyGeneticAction, getTobaccooAction, getVitalsByPatientIdAction } from '../../../../redux/actions';
import { handlePrintAllergies } from '../Task Tabs/PDFfiles/allergyPDF';
import { getAllergiesOfPatientAction } from '../../../../redux/allergyList/action';
import AddAllergy from '../Task Tabs/AddAllergy';
import { handlePrintVitals } from '../../../../helpers/printVitals';
import VitalStatus from './VitalStatus';
import Spinner from '../../../../constants/Spinner';
import AddProblem from '../Task Tabs/AddProblem';
import { handlePrintProblems } from '../Task Tabs/PDFfiles/problemPDF';
import Paginations from '../../../../helpers/Paginations';
import NewAppointment from '../../Appointments/NewAppointment';
import AddMedication from './AddMedication';
import { handlePrintMedication } from '../../../../helpers/printMedication';
import { loggedInUser } from '../../../../helpers/api/loggedInUser';
const PatientSummary = ({ isAccordionOpen, setSelectedMainTab }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const patientVitals = store?.getVitalsByPatientIdReducer?.data?.data?.[0];
    const tobaccoHistory = Array.isArray(store?.getTobaccooReducer?.data?.tobaccoHistory)
        ? store.getTobaccooReducer.data.tobaccoHistory
        : [];

    const familyGeneticHistory = Array.isArray(store?.getFamilyGeneticReducer?.data?.familyMedicalHistory)
        ? store.getFamilyGeneticReducer.data.familyMedicalHistory
        : [];

    const socialHistoryData = [
        ...tobaccoHistory.slice(0, 2),
        ...familyGeneticHistory.slice(0, 2)
    ];
    const allergyData = store?.getAllergiesOfAPatientReducer?.data?.allergies;
    const patientDetails = store?.getPatientByIdReducer?.data?.data;
    const problemData = store?.getProblemListReducer?.data?.problems;
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const appointmentsList = store?.getAppointmentsReducer?.data?.appointments;
    const medicationList = store?.getMedicationReducer?.data?.medicationRequests;
    const [effectiveDateTime, setEffectiveDateTime] = useState('');
    const [skip, setSkip] = useState(1);
    const [medicationModal, setMedicationModal] = useState(false)
    useEffect(() => {
        dispatch(getVitalsByPatientIdAction({ patientId, effectiveDateTime: effectiveDateTime, limit: 7 }));

    }, [dispatch]);

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

    useEffect(() => {
        dispatch(
            getAppointmentsAction({
                clinicId: loggedInUser?.clinicId,
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
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);

    const handleAddAllergyOpen = () => setShowAddAllergyModal(true);
    const handleAddProblemOpen = () => setShowAddProblemModal(true);
    const handleAddAppointmentOpen = () => setShowAppointmentModal(true);

    const handleAddAllergyClose = () => setShowAddAllergyModal(false);
    const [vitalsModal, setVitalsModal] = useState(false);

    const closeVitalsModal = () => {
        setVitalsModal(false);
        dispatch(getVitalsByPatientIdAction({ patientId, effectiveDateTime: effectiveDateTime, limit: 7 }));
    };
    const handleAddProblemClose = () => setShowAddProblemModal(false);
    const handleAppointmentClose = () => setShowAppointmentModal(false);
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };

    const statusColorMap = {
        active: 'text-success',
        'on-hold': 'text-warning',
        cancelled: 'text-danger',
        completed: 'text-primary',
        'entered-in-error': 'text-danger',
        stopped: 'text-secondary',
        draft: 'text-muted',
        unknown: 'text-dark'
    };

    const closeMedicationModal = () => {
        setMedicationModal(false)
    }

    return (
        <div className="patient-summary ">
            <Row className={`mb-2  h-100  g-2   ${isAccordionOpen ? 'summary-expanded' : 'summary-collapsed'}`}>
                {/* Vitals Card */}
                <Col sm={4} className='patient-summary-card'>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="p-1 d-flex justify-content-between align-items-center bg-light">
                            <div className="d-flex align-items-center">
                                <FaHeartbeat className="me-2 text-secondary" />
                                <span className="fw-bold fs-6">Vitals</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <input
                                    className='fs-6 fw-semibold bg-white px-1 me-1 border border-1 border-muted'
                                    type="date"
                                    value={effectiveDateTime}
                                    onChange={(e) => setEffectiveDateTime(e.target.value)}
                                />
                                <MdAddCircleOutline
                                    onClick={() => setVitalsModal(true)}
                                    className="text-primary me-2 cursor-pointer"
                                />
                                <MdOutlinePrint
                                    onClick={() =>
                                        handlePrintVitals({
                                            vitals: store?.getVitalsByPatientIdReducer?.data?.data,
                                            patientDetails: patientDetails,
                                        })
                                    }
                                    className="text-secondary cursor-pointer"
                                />
                            </div>
                        </Card.Header>
                        <Card.Body className='p-2 scroll-container' style={{ height: '22vh' }}>
                            {store?.getVitalsByPatientIdReducer?.loading ? (
                                <div className='d-flex justify-content-center align-items-center w-100 p-5' style={{ height: '100%' }}>
                                    <Spinner className='spinner-border-sm' />
                                </div>
                            ) : (
                                <div className={`${!patientVitals?.vitals || patientVitals.vitals.length === 0 ? 'h-100 d-flex align-items-center justify-content-center bg-white' : 'vitals-grid'} fs-6`}>
                                    {(!patientVitals?.vitals || patientVitals.vitals.length === 0) ? (
                                        <div className='fw-bold  w-100 h-100 text-nowrap d-flex align-items-center justify-content-center fs-6' style={{ height: '100%', width: '100%' }}>No Vitals Found</div>
                                    ) : (
                                        patientVitals.vitals.map((data) => {
                                            const codeDisplay = data?.code?.coding?.[0]?.display || 'Unknown Vital';

                                            const value =
                                                data?.valueString ??
                                                (data?.valueQuantity?.value ? `${data.valueQuantity.value} ${data.valueQuantity.unit || ''}` : null) ??
                                                (data?.valueBoolean !== undefined ? (data.valueBoolean ? 'Yes' : 'No') : null);

                                            let bpReading = null;
                                            if (data.component && !value) {
                                                const systolic = data.component.find(c => c.code?.coding?.[0]?.code === '8480-6')?.valueQuantity?.value;
                                                const diastolic = data.component.find(c => c.code?.coding?.[0]?.code === '8462-4')?.valueQuantity?.value;
                                                bpReading = `${systolic || 'N/A'} / ${diastolic || 'N/A'}`;
                                            }

                                            return (
                                                <div key={data?._id} className="vital-item">
                                                    <span className="text-muted">{codeDisplay}</span>
                                                    <div className="fw-bold">{value || bpReading || 'N/A'}</div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </Card.Body>

                    </Card>
                </Col>

                {/* Allergies Card */}
                <Col sm={4} className='patient-summary-card'>
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
                            {store?.getAllergiesOfAPatientReducer?.loading ? (
                                <div
                                    className="d-flex justify-content-center align-items-center w-100 p-5"
                                    style={{ height: '100%' }}>
                                    <Spinner className="spinner-border-sm" />
                                </div>
                            ) : allergyData && allergyData.length > 0 ? (
                                <ul className="list-unstyled pb-0 mb-0">
                                    {allergyData.slice(0, 4).map((allergy, index) => (
                                        <li
                                            key={index}
                                            className="mb-2 d-flex justify-content-between align-items-start">
                                            <div className="fs-6">
                                                <strong title={allergy?.code?.text}>{allergy?.code?.text?.length > 30 ? allergy?.code?.text?.slice(0, 29) + '...' : allergy?.code?.text || 'Unknown Allergy'}</strong>
                                                <div className="text-muted  small">
                                                    {allergy?.clinicalStatus?.text || 'Status not available'}
                                                </div>
                                            </div>
                                            <span className="fs-6 fw-semibold text-nowrap">
                                                {getSeverityBadge(allergy.criticality)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <ul className="list-unstyled d-flex align-items-center justify-content-center" style={{ height: '100%', width: '100%' }}>
                                    <li className="mb-2">
                                        <div className="fs-6  d-flex justify-content-between align-items-center">
                                            <strong>No Allergies Found</strong>
                                        </div>
                                    </li>
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
                <Col sm={4} className='patient-summary-card'>
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
                            {store?.getProblemListReducer?.loading ? (
                                <div
                                    className="d-flex justify-content-center align-items-center w-100 p-5"
                                    style={{ height: '100%' }}>
                                    <Spinner className="spinner-border-sm" />
                                </div>
                            ) : problemData && problemData.length > 0 ? (
                                <ul className="list-unstyled pb-0 mb-0">
                                    {problemData?.slice(0, 4)?.map((problem, index) => (
                                        <li
                                            key={index}
                                            className="mb-2 d-flex justify-content-between align-items-start">
                                            <div className="fs-6">
                                                <strong title={problem?.code?.text}>
                                                    {problem?.code?.text?.length > 30
                                                        ? problem.code.text.slice(0, 30) + '...'
                                                        : problem?.code?.text || 'Unknown Problem'}
                                                </strong>
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
                                <ul className="list-unstyled d-flex align-items-center justify-content-center" style={{ height: '100%', width: '100%' }}>
                                    <li className="mb-2">
                                        <div className="fs-6  d-flex justify-content-between align-items-center">
                                            <strong>No Problems Found</strong>
                                        </div>
                                    </li>
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
                <Col sm={4} className='patient-summary-card'>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="p-1 d-flex justify-content-between align-items-center bg-light">
                            <div className="d-flex align-items-center">
                                <FaPills className="me-2 text-secondary" />
                                <span className="fw-bold fs-6">Medications</span>
                            </div>
                            <div>
                                <MdAddCircleOutline onClick={() => setMedicationModal(true)} className="text-primary me-2 cursor-pointer" />
                                <AddMedication show={medicationModal} onCancel={closeMedicationModal} />
                                <MdOutlinePrint onClick={() => handlePrintMedication({ medicationList: medicationList, patientDetails: patientDetails })} className="text-secondary cursor-pointer" />
                            </div>
                        </Card.Header>
                        <Card.Body className='p-2 scroll-container' style={{ height: '22vh' }}>
                            {store?.getMedicationReducer?.loading ?
                                <div className='d-flex justify-content-center align-items-center w-100 p-5' style={{ height: '100%' }}>
                                    <Spinner className='spinner-border-sm' />
                                </div>
                                :
                                <ul className="list-unstyled h-100">
                                    {medicationList?.length === 0 || !medicationList ? (
                                        <li className="list-unstyled d-flex align-items-center justify-content-center" style={{ height: '100%', width: '100%' }}>
                                            <div className="fs-6  d-flex justify-content-between align-items-center">
                                                <strong>No Medications Found</strong>
                                            </div>
                                        </li>
                                    ) : medicationList?.slice(0, 4)?.map((medication, index) => (
                                        <li key={index} className="mb-2 d-flex justify-content-between align-items-start">
                                            <div className="fs-6">
                                                <strong className="text-capitalize" title={medication?.drugId?.proprietaryName}>{medication?.drugId?.proprietaryName?.length > 30 ? medication?.drugId?.proprietaryName?.slice(0, 29) + '...' : medication?.drugId?.proprietaryName}</strong>
                                                <div className="text-muted" title={medication?.drugId?.nonProprietaryName}>
                                                    {medication?.drugId?.nonProprietaryName?.length > 40 ? medication?.drugId?.nonProprietaryName?.slice(0, 39) + '...' : medication?.drugId?.nonProprietaryName}
                                                </div>
                                                <div className="text-muted " title={medication?.dosageInstruction?.[0]?.text}>
                                                    {medication?.dosageInstruction?.[0]?.text?.length > 40 ? medication?.dosageInstruction?.[0]?.text?.slice(0, 39) + '...' : medication?.dosageInstruction?.[0]?.text || ''}
                                                </div>
                                            </div>
                                            <span className={`fw-semibold fs-6 text-capitalize ${statusColorMap[medication.status] || 'text-body'}`}>
                                                {medication?.status}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            }
                        </Card.Body>
                        <div
                            className="fs-6 text-end text-info d-flex align-items-end justify-content-end px-2 pb-1 cursor-pointer text-decoration-underline"
                            onClick={() => setSelectedMainTab('Medication List')}>
                            Go To Medication List
                        </div>
                    </Card>
                </Col>

                {/* Social History Card */}
                <Col sm={4} className='patient-summary-card'>
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
                            {store?.getFamilyGeneticReducer?.loading && store?.getTobaccooReducer?.loading ?
                                <div className="d-flex align-items-center justify-content-center w-100 h-100">
                                    <Spinner className='spinner-border-sm' />
                                </div>
                                : socialHistoryData?.length > 0 ?
                                    socialHistoryData?.map((data, index) => (
                                        <div className="social-history-item  py-2 d-flex align-items-center justify-content-between" key={index}>
                                            <span className="text-muted fs-6">{data?.tobaccoUse || data?.condition?.[0]?.code?.coding?.[0]?.display}</span>
                                            <div className="fs-6 fw-semibold">{data?.effectiveDateTime ? new Date(data?.effectiveDateTime)?.toLocaleDateString('en-GB') : '' ||
                                                data?.deceasedDate ? new Date(data?.deceasedDate)?.toLocaleDateString('en-GB') : '' || 'N/A'}</div>
                                        </div>
                                    )) :
                                    <div className="d-flex align-items-center justify-content-center w-100 h-100">
                                        No Social Histoy Found
                                    </div>
                            }
                        </Card.Body>
                        <div
                            className="fs-6 text-end text-info d-flex align-items-end justify-content-end px-2 pb-1 cursor-pointer text-decoration-underline"
                            onClick={() => setSelectedMainTab('Tobacco')}>
                            Go To Social History
                        </div>
                    </Card>
                </Col>

                {/* Encounters Card */}
                <Col sm={4} className='patient-summary-card'>
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
                <Col sm={12} className='patient-summary-card'>
                    <Card className="shadow-sm mb-0">
                        <Card.Header className="p-1 d-flex justify-content-between align-items-center bg-light">
                            <div className="d-flex align-items-center">
                                <FaCalendarAlt className="me-2 text-secondary" />
                                <span className="fw-bold fs-6">Upcoming Appointments</span>
                            </div>
                            <div>
                                <MdAddCircleOutline
                                    className="text-primary me-2 cursor-pointer"
                                    onClick={handleAddAppointmentOpen}
                                />
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
                                            <th className="fs-6 text-white">Reason</th>
                                            <th className="fs-6 text-white">Type</th>
                                            {/* <th className="fs-6 text-white">Location</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {store?.getAppointmentsReducer?.loading ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-5">
                                                    <Spinner className="spinner-border-sm" />
                                                </td>
                                            </tr>
                                        ) : appointmentsList && appointmentsList.length > 0 ? (
                                            appointmentsList.map((appointment, index) => (
                                                <tr key={index}>
                                                    <td className="fs-6">
                                                        {appointment?.date
                                                            ? new Date(appointment.date).toLocaleDateString('en-GB', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })
                                                            : ''}
                                                    </td>
                                                    <td className="fs-6">
                                                        {appointment?.start
                                                            ? new Date(appointment.start).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: true,
                                                            })
                                                            : ''}
                                                    </td>
                                                    <td className="fs-6">
                                                        {appointment?.doctorId?.name?.[0]?.text || 'Unknown'}
                                                    </td>
                                                    <td className='fs-6'>
                                                        {appointment?.reason?.[0]?.coding?.[0]?.display}
                                                    </td>
                                                    <td className="fs-6">
                                                        {appointment?.appointmentType?.coding?.[0]?.display ||
                                                            'Not Specified'}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-muted">
                                                    No upcoming appointments found
                                                </td>
                                            </tr>
                                        )}
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
            <Modal show={vitalsModal} onHide={closeVitalsModal} size="lg" centered>
                <Modal.Header closeButton className="px-2 py-0">
                    <Modal.Title className="">Add Vitals</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <VitalStatus />
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
            <Modal show={showAppointmentModal} onHide={handleAppointmentClose} size="xl" centered>
                <Modal.Header closeButton className="px-2 py-0">
                    <Modal.Title className="">Add Appointment </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    <NewAppointment isModal={true} onCancel={handleAppointmentClose} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PatientSummary;