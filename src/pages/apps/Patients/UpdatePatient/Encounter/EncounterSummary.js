import React, { useState } from 'react';
import { Accordion, Button, Col, Dropdown, Form, Offcanvas, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './Encounter.css'
import Spinner from '../../../../../constants/Spinner';
import { FiFilter } from 'react-icons/fi';
const EncounterSummary = () => {
    const store = useSelector((state) => state);
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
    const [showFilter, setShowFilter] = useState(false);
    const [visibleSections, setVisibleSections] = useState({
        vitals: true,
        allergies: true,
        problems: true,
        medications: true,
        socialHistory: true,
    });

    const toggleSection = (section) => {
        setVisibleSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const allergyData = store?.getAllergiesOfAPatientReducer?.data?.allergies;
    const patientDetails = store?.getPatientByIdReducer?.data?.data;
    const problemData = store?.getProblemListReducer?.data?.problems;
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const appointmentsList = store?.getAppointmentsReducer?.data?.appointments;
    const medicationList = store?.getMedicationReducer?.data?.medicationRequests;
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
    return (
        <Row className='gy-2 position-relative'>
            <Col sm={12} className='d-flex justify-content-end '>
                <Dropdown className="position-absolute " style={{ top: '-1.5%', left: '86%' }} drop="down" >
                    <Dropdown.Toggle variant="primary" className="text-white px-1 fs-5 p-0 border-0 shadow-none">
                        <FiFilter />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="p-3" style={{ minWidth: '250px' }}>
                        <h6 className="dropdown-header">Filter Summary Sections</h6>
                        {['vitals', 'allergies', 'problems', 'medications', 'socialHistory'].map((key) => (
                            <Form.Check
                                key={key}
                                type="checkbox"
                                id={`filter-${key}`}
                                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                checked={visibleSections[key]}
                                onChange={() => toggleSection(key)}
                                className="mb-2"
                            />
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
            <Col sm={12} className='mt-0'>
                <Accordion flush>
                    {visibleSections.vitals && (
                        <Accordion.Item eventKey="0" className='border-0 mb-2'>
                            <Accordion.Header className='p-0 bg-light rounded encounterSummary'>
                                <span className='fw-semibold'>Vitals</span>
                            </Accordion.Header>
                            <Accordion.Body className='p-2'>
                                {patientVitals ? (
                                    <div style={{ height: '20vh' }} className='scroll-container'>
                                        {store?.getVitalsByPatientIdReducer?.loading ? (
                                            <div className='d-flex justify-content-center align-items-center w-100 p-5'>
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
                                    </div>
                                ) : (
                                    <div className='text-muted'>No vitals recorded</div>
                                )}
                            </Accordion.Body>

                        </Accordion.Item>
                    )}
                    {visibleSections.allergies && (
                        <Accordion.Item eventKey="1" className='border-0 mb-2'>
                            <Accordion.Header className='p-0 bg-light rounded encounterSummary'>
                                <span className='fw-semibold'>Allergies</span>
                            </Accordion.Header>
                            <Accordion.Body className='p-2'>
                                {allergyData?.length > 0 ? (
                                    <div style={{ height: '20vh' }} className='scroll-container'>
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
                                                            <strong title={allergy.code?.text}>{allergy.code?.text?.length > 30 ? allergy.code?.text?.slice(0, 29) + '...' : allergy.code?.text || 'Unknown Allergy'}</strong>
                                                            <div className="text-muted  small">
                                                                {allergy.clinicalStatus?.text || 'Status not available'}
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
                                    </div>
                                ) : (
                                    <div className='text-muted'>No allergies recorded</div>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    )}
                    {visibleSections.problems && (
                        <Accordion.Item eventKey="2" className='border-0 mb-2'>
                            <Accordion.Header className='p-0 bg-light rounded encounterSummary'>
                                <span className='fw-semibold'>Problems</span>
                            </Accordion.Header>
                            <Accordion.Body className='p-2'>
                                {problemData?.length > 0 ? (
                                    <div style={{ height: '20vh' }} className='scroll-container'>
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
                                    </div>
                                ) : (
                                    <div className='text-muted'>No problems recorded</div>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    )}
                    {visibleSections.medications && (
                        <Accordion.Item eventKey="3" className='border-0 mb-2'>
                            <Accordion.Header className='p-0 bg-light rounded encounterSummary'>
                                <span className='fw-semibold'>Medications</span>
                            </Accordion.Header>
                            <Accordion.Body className='p-2'>
                                {medicationList?.length > 0 ? (
                                    <div style={{ height: '20vh' }} className='scroll-container'>
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
                                    </div>
                                ) : (
                                    <div className='text-muted'>No medications recorded</div>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    )}
                    {visibleSections.socialHistory && (
                        <Accordion.Item eventKey="4" className='border-0 mb-2'>
                            <Accordion.Header className='p-0 bg-light rounded encounterSummary'>
                                <span className='fw-semibold'>Social History</span>
                            </Accordion.Header>
                            <Accordion.Body className='p-2'>
                                {socialHistoryData?.length > 0 ? (
                                    <div>
                                        {/* Render social history data here */}
                                    </div>
                                ) : (
                                    <div className='text-muted'>No social history recorded</div>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    )}
                </Accordion>
            </Col>
        </Row>
    );
};

export default EncounterSummary;