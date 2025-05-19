import React, { useState } from 'react';
import { Accordion, Button, Col, Dropdown, Form, Offcanvas, Row, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './Encounter.css'
import Spinner from '../../../../../constants/Spinner';
import { FiFilter } from 'react-icons/fi';
import { defaultVitals } from '../../../../../utils/DataSets/commonData2';

const convertFromImperial = (value, vitalName) => {
    if (vitalName === 'Height') return (value * 2.54).toFixed(2); // in to cm
    if (vitalName === 'Weight') return (value / 2.20462).toFixed(2); // lbs to kg
    if (vitalName === 'Temperature') return (((value - 32) * 5) / 9).toFixed(2); // F to C
    if (vitalName === 'Head Circumference') return (value * 2.54).toFixed(2)
    return value;
};
const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
};

const imperialUnits = {
    Temperature: '°F',
    Height: 'in',
    Weight: 'lbs',
    'Head Circumference': 'in',
};

const metricUnits = {
    Temperature: '°C',
    Height: 'cm',
    Weight: 'kg',
    'Head Circumference': 'cm',
};

const EncounterSummary = () => {
    const now = new Date();
    const formatTwoDigits = (n) => n.toString().padStart(2, '0');

    const [unitSystem, setUnitSystem] = useState('imperial')
    const [vitals, setVitals] = useState(defaultVitals);

    const [visitDateTime, setVisitDateTime] = useState({
        date: now.toISOString().split('T')[0], // "YYYY-MM-DD"
        time: `${formatTwoDigits(now.getHours())}:${formatTwoDigits(now.getMinutes())}`, // "HH:mm"
    });
    const store = useSelector((state) => state);
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
    const patientVitals = store?.getVitalsByPatientIdReducer?.data?.data || [];

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

    const isDateDisabled = (dateString) => disabledDates.includes(dateString);
    const disabledDates = patientVitals?.map(vital => vital.effectiveDateTime) || [];
    const getDisplayUnit = (vital) => {
        if (vital.unitKey) {
            return unitSystem === 'imperial' ? imperialUnits[vital.unitKey] : metricUnits[vital.unitKey];
        }
        return vital.unit || '';
    };
    const handleDateChange = (e) => {
        const newDate = e.target.value;

        if (isDateDisabled(newDate)) {
            alert("This date already has recorded vitals. Please choose another date.");
            return;
        }

        setVisitDateTime(prev => ({
            ...prev,
            date: newDate,
        }));
    };

    // Handle time change (unchanged)
    const handleTimeChange = (e) => {
        setVisitDateTime(prev => ({
            ...prev,
            time: e.target.value,
        }));
    };

    const groupedVitals = patientVitals && patientVitals?.reduce((acc, vitalGroup) => {
        const date = vitalGroup.effectiveDateTime;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(...vitalGroup.vitals);
        return acc;
    }, {});
    const findVitalValue = (vitalName, date) => {
        if (!groupedVitals[date]) return null;

        const vital = groupedVitals[date].find(v =>
            v.code?.coding?.[0]?.display === vitalName ||
            v.code?.text === vitalName
        );

        if (!vital) return null;

        if (vital.component && vital.component.length > 0) {
            // Handle blood pressure case (no conversion needed)
            const systolic = vital.component.find(c =>
                c.code?.coding?.[0]?.code === "8480-6"
            )?.valueQuantity?.value;

            const diastolic = vital.component.find(c =>
                c.code?.coding?.[0]?.code === "8462-4"
            )?.valueQuantity?.value;

            return { systolic: systolic || '', diastolic: diastolic || '' };
        }

        // Get the stored value (always in imperial units)
        let value = vital.valueQuantity?.value || vital.valueString || '';

        // Convert to metric if needed for display
        if (unitSystem === 'metric') {
            if (vitalName === 'Height') {
                value = convertFromImperial(value, 'Height');
            }
            else if (vitalName === 'Weight') {
                value = convertFromImperial(value, 'Weight');
            }
            else if (vitalName === 'Temperature') {
                value = convertFromImperial(value, 'Temperature');
            }
        }

        return value;
    };

    // Get sorted dates (newest first)
    const sortedDates = Object.keys(groupedVitals).sort((a, b) =>
        new Date(b) - new Date(a)
    );
    const renderVitalCell = (vital, date) => {
        const value = findVitalValue(vital.name, date);

        if (vital.type === 'bp') {
            const bpValue = value || { systolic: '', diastolic: '' };
            return (
                <div className="d-flex">
                    <span>{bpValue.systolic || '-'}</span>
                    <span>/</span>
                    <span>{bpValue.diastolic || '-'}</span>
                </div>
            );
        }

        return value || '-';
    };
    const [activeKey, setActiveKey] = useState("1");

    const handleToggle = (key) => {
        setActiveKey(prev => (prev === key ? null : key)); // toggle open/close
    };

    return (
        <Row className='gy-2  position-relative'>
            {/* <Col sm={12} className='d-flex justify-content-end '>
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
            </Col> */}
            <Col sm={12} className='mt-0 scroll-container mt-0 scroll-container' style={{ height: '69vh' }}>

                <Accordion activeKey={activeKey} onSelect={handleToggle}>
                    {visibleSections.allergies && (
                        <Accordion.Item eventKey="1" className="border-0 mb-2">
                            <Accordion.Header className="p-0 bg-light rounded encounterSummary">
                                <span className="fw-semibold fs-6">Allergies</span>
                            </Accordion.Header>
                            <Accordion.Body className="p-2">
                                {allergyData?.length > 0 ? (
                                    <div style={{ height: '30vh' }} className="scroll-container">
                                        {store?.getAllergiesOfAPatientReducer?.loading ? (
                                            <div className="d-flex justify-content-center align-items-center w-100 p-5" style={{ height: '100%' }}>
                                                <Spinner className="spinner-border-sm" />
                                            </div>
                                        ) : (
                                            <ul className="list-unstyled pb-0 mb-0">
                                                {allergyData.slice(0, 4).map((allergy, index) => (
                                                    <li key={index} className="mb-2 d-flex justify-content-between align-items-start">
                                                        <div className="fs-6">
                                                            <strong title={allergy.code?.text}>
                                                                {allergy.code?.text?.length > 30
                                                                    ? allergy.code?.text.slice(0, 29) + '...'
                                                                    : allergy.code?.text || 'Unknown Allergy'}
                                                            </strong>
                                                            <div className="text-muted small">
                                                                {allergy.clinicalStatus?.text || 'Status not available'}
                                                            </div>
                                                        </div>
                                                        <span className="fs-6 fw-semibold text-nowrap">
                                                            {getSeverityBadge(allergy.criticality)}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-muted">No allergies recorded</div>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    )}
                </Accordion>

                <Accordion>
                    {visibleSections.problems && (
                        <Accordion.Item eventKey="2" className='border-0 mb-2'>
                            <Accordion.Header className='p-0 bg-light rounded encounterSummary'>
                                <span className='fw-semibold fs-6'>Problems</span>
                            </Accordion.Header>
                            <Accordion.Body className='p-2'>
                                {problemData?.length > 0 ? (
                                    <div style={{ height: '30vh' }} className='scroll-container'>
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
                </Accordion>
                <Accordion>
                    {visibleSections.medications && (
                        <Accordion.Item eventKey="3" className='border-0 mb-2'>
                            <Accordion.Header className='p-0 bg-light rounded encounterSummary'>
                                <span className='fw-semibold fs-6'>Medications</span>
                            </Accordion.Header>
                            <Accordion.Body className='p-2'>
                                {medicationList?.length > 0 ? (
                                    <div style={{ height: '30vh' }} className='scroll-container'>
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
                </Accordion>
                <Accordion>
                    {visibleSections.vitals && (
                        <Accordion.Item eventKey="0" className='border-0 mb-2'>
                            <Accordion.Header className='p-0 bg-light rounded encounterSummary'>
                                <span className='fw-semibold fs-6'>Vitals</span>
                            </Accordion.Header>
                            <Accordion.Body className='p-2 ' style={{ height: '100%' }}>
                                <Table bordered className={`mb-0 position-relative box-shadow-none vitalsTable ${store?.getVitalsByPatientIdReducer?.loading ? 'opacity-50' : ''}`} >
                                    <thead>
                                        <tr className='border'>
                                            <th className='text-white'>
                                                Vital Name
                                            </th>
                                            {sortedDates?.map(date => (
                                                <th className='text-white' key={date}>
                                                    {formatDate(date)}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vitals.map((vital, index) => (
                                            <tr className='' key={vital.name}>
                                                <td className='p-0 vitalsTableBorder'>
                                                    {vital.name} {getDisplayUnit(vital) && (
                                                        <small className="text-muted">({getDisplayUnit(vital)})</small>
                                                    )}
                                                </td>

                                                {sortedDates.map(date => (
                                                    <td className='vitalsTableBorder p-0' key={`${vital.name}-${date}`}>
                                                        {renderVitalCell(vital, date)}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                    {store?.getVitalsByPatientIdReducer?.loading &&
                                        <div className='position-absolute' style={{ top: '35%', left: '50%' }}>
                                            <Spinner />
                                        </div>
                                    }
                                </Table>
                            </Accordion.Body>

                        </Accordion.Item>
                    )}
                </Accordion>
                <Accordion>
                    {visibleSections.socialHistory && (
                        <Accordion.Item eventKey="4" className='border-0 mb-2'>
                            <Accordion.Header className='p-0 bg-light rounded encounterSummary'>
                                <span className='fw-semibold fs-6'>Social History</span>
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