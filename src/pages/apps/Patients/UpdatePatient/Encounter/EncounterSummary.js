import React, { useEffect, useState } from 'react';
import { Accordion, Button, Col, Dropdown, Form, Modal, Offcanvas, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './Encounter.css'
import Spinner from '../../../../../constants/Spinner';
import { FiFilter } from 'react-icons/fi';
import { defaultVitals } from '../../../../../utils/DataSets/commonData2';
import AddAllergy from '../../Task Tabs/AddAllergy';
import AddProblem from '../../Task Tabs/AddProblem';
import AddMedication from '../AddMedication';
import { AiOutlineSortDescending } from 'react-icons/ai';
import { getVitalsByPatientIdAction } from '../../../../../redux/actions';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import VitalStatus from '../VitalStatus';

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
    const store = useSelector((state) => state);
    const formatTwoDigits = (n) => n.toString().padStart(2, '0');
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch()

    const [unitSystem, setUnitSystem] = useState('imperial')
    const [vitals, setVitals] = useState(defaultVitals);

    const [effectiveDateTime, setEffectiveDateTime] = useState('');

    const patienteffectiveVitals = store?.getVitalsByPatientIdReducer?.data?.data?.[0];
    useEffect(() => {
        if (patienteffectiveVitals) {
            setEffectiveDateTime(
                patienteffectiveVitals?.effectiveDateTime
                    ? new Date(patienteffectiveVitals?.effectiveDateTime)?.toISOString().split('T')[0]
                    : ''
            );
        }
    }, [patienteffectiveVitals]);
    const patientId = searchParams.get('id');

    // MODAL FUNCTIONALITIES
    const [showAddAllergyModal, setShowAddAllergyModal] = useState(false);
    const [showAddProblemModal, setShowAddProblemModal] = useState(false);
    const [medicationModal, setMedicationModal] = useState(false);
    const [vitalsModal, setVitalsModal] = useState(false);

    const closeVitalsModal = () => {
        setVitalsModal(false);
        // dispatch(getVitalsByPatientIdAction({ patientId, effectiveDateTime: effectiveDateTime, limit: 7 }));
    };


    const handleAddProblemClose = () => setShowAddProblemModal(false);
    const handleAddAllergyClose = () => setShowAddAllergyModal(false);
    const closeMedicationModal = () => {
        setMedicationModal(false);
    };

    const [visitDateTime, setVisitDateTime] = useState({
        date: now.toISOString().split('T')[0], // "YYYY-MM-DD"
        time: `${formatTwoDigits(now.getHours())}:${formatTwoDigits(now.getMinutes())}`, // "HH:mm"
    });
    const settingsDataItems = store?.getEncounterSettingsReducer?.data?.data?.items?.find((data) => data?.name === 'Summary');
    const defaultMenuItems = [
        { _id: '1', name: 'Vitals', order: 0, hide: true },
        { _id: '2', name: 'Allergy', order: 1, hide: true },
        { _id: '3', name: 'Problems', order: 2, hide: true },
        { _id: '4', name: 'Medications', order: 3, hide: true },
        { _id: '5', name: 'Social History', order: 4, hide: true }
    ];
    const sortedSubMenuItems = settingsDataItems?.subMenu?.length > 0 ? settingsDataItems?.subMenu?.sort((a, b) => a.order - b.order) : defaultMenuItems;
    const tobaccoHistory = Array.isArray(store?.getTobaccooReducer?.data?.tobaccoHistory)
        ? store.getTobaccooReducer.data.tobaccoHistory
        : [];

    const familyGeneticHistory = Array.isArray(store?.getFamilyGeneticReducer?.data?.familyMedicalHistory)
        ? store.getFamilyGeneticReducer.data.familyMedicalHistory
        : [];

    // const socialHistoryData = [
    //     ...tobaccoHistory.slice(0, 2),
    //     ...familyGeneticHistory.slice(0, 2)
    // ];
    const socialHistoryData = {
        tobaccoHistory: tobaccoHistory.slice(0, 2),
        familyGeneticHistory: familyGeneticHistory.slice(0, 2)
    }
    const [showFilter, setShowFilter] = useState(false);

    const [visibleSections, setVisibleSections] = useState({
        allergy: true,
        socialhistory: true,
        vitals: true,
        problems: true,
        medications: true,
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
        <Row className='position-relative'>
            <Col sm={12} className='mt-0 mt-0' >

                <Accordion activeKey={activeKey} onSelect={handleToggle}>
                    {sortedSubMenuItems.map((menuItem) => {
                        if (!menuItem?.hide) return null; // Skip hidden items
                        const sectionKey = menuItem?.name.toLowerCase().replace(/\s+/g, '');
                        const isVisible = visibleSections[sectionKey];
                        if (!isVisible) return null;

                        let content;
                        switch (menuItem.name) {
                            case 'Vitals':
                                content = (
                                    <Accordion.Body className='p-2 ' style={{ height: '100%' }}>
                                        <Table bordered className={`mb-0 position-relative box-shadow-none vitalsTable ${store?.getVitalsByPatientIdReducer?.loading ? 'opacity-50' : ''}`} >                                            <thead>
                                            <tr className='border'>
                                                <th className='text-white'>
                                                    Vital Name
                                                </th>
                                                {sortedDates?.slice(0, 3)?.map(date => (
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

                                                        {sortedDates.slice(0, 3).map(date => (
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
                                        <div className="row">
                                            <div className="col-12 text-end">
                                                <small onClick={() => setVitalsModal(true)} className='text-info cursor-pointer'>Add vitals</small>
                                            </div>
                                        </div>
                                        <Modal show={vitalsModal} onHide={closeVitalsModal} size="lg" centered>
                                            <Modal.Header closeButton className="px-2 py-0">
                                                <Modal.Title className="">Add Vitals</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <VitalStatus />
                                            </Modal.Body>
                                        </Modal>
                                    </Accordion.Body>
                                );
                                break;

                            case 'Allergy':
                                content = (
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
                                        <div className="row">
                                            <div className="col-12 text-end">
                                                <small onClick={() => setShowAddAllergyModal(true)} className='text-info cursor-pointer'>Add new allergy</small>
                                            </div>
                                        </div>
                                        <Modal show={showAddAllergyModal} onHide={handleAddAllergyClose} size="lg" centered>
                                            <Modal.Header closeButton className="px-2 py-0">
                                                <Modal.Title className="">Add Allergy</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <AddAllergy onCancel={handleAddAllergyClose} />
                                            </Modal.Body>
                                        </Modal>
                                    </Accordion.Body>

                                );
                                break;

                            case 'Problems':
                                content = (
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
                                        <div className="row">
                                            <div className="col-12 text-end">
                                                <small onClick={() => setShowAddProblemModal(true)} className='text-info cursor-pointer'>Add new problem</small>
                                            </div>
                                        </div>
                                        <Modal show={showAddProblemModal} onHide={handleAddProblemClose} size="lg" centered>
                                            <Modal.Header closeButton className="px-2 py-0">
                                                <Modal.Title className="">Add Problem</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <AddProblem onCancel={handleAddProblemClose} />
                                            </Modal.Body>
                                        </Modal>
                                    </Accordion.Body>
                                );
                                break;

                            case 'Medications':
                                content = (
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
                                                                <div className={`fw-semibold fs-6 text-capitalize ${statusColorMap[medication.status] || 'text-body'}`}>
                                                                    <p>{medication?.status}</p>
                                                                    {/* <OverlayTrigger
                                                                        placement="top"
                                                                        overlay={<Tooltip id="copyTooltip">Copy to clipboard</Tooltip>}
                                                                    >
                                                                        <i
                                                                            className="bi bi-copy fs-5 text-secondary"
                                                                            style={{ cursor: 'pointer' }}
                                                                            onClick={(e) => {
                                                                                navigator.clipboard.writeText('Text to copy');
                                                                                const icon = e.currentTarget;
                                                                                icon.classList.remove('bi-copy', 'text-secondary');
                                                                                icon.classList.add('bi-check', 'text-secondary');

                                                                                setTimeout(() => {
                                                                                    icon.classList.remove('bi-check', 'text-success');
                                                                                    icon.classList.add('bi-copy', 'text-secondary');
                                                                                }, 2000);
                                                                            }}
                                                                        />
                                                                    </OverlayTrigger> */}

                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                }
                                            </div>
                                        ) : (
                                            <div className='text-muted'>No medications recorded</div>
                                        )}
                                        <div className="row">
                                            <div className="col-12 text-end">
                                                <small onClick={() => setMedicationModal(true)} className='text-info cursor-pointer'>Add new medication</small>
                                            </div>
                                        </div>
                                        <AddMedication show={medicationModal} onCancel={closeMedicationModal} />
                                    </Accordion.Body>
                                );
                                break;

                            case 'Social History':
                                content = (
                                    <Accordion.Body className='p-2'>
                                        <div>
                                            <ul className="list-unstyled h-100">
                                                {socialHistoryData?.tobaccoHistory?.length === 0 && socialHistoryData?.familyGeneticHistory?.length === 0 ? (
                                                    <li className="list-unstyled d-flex align-items-center justify-content-center" style={{ height: '100%', width: '100%' }}>
                                                        <div className="fs-6  d-flex justify-content-between align-items-center">
                                                            <strong>No Social History Found</strong>
                                                        </div>
                                                    </li>
                                                ) : (
                                                    <>
                                                        {socialHistoryData?.tobaccoHistory?.length > 0 && (
                                                            socialHistoryData?.tobaccoHistory?.map((data, index) => (
                                                                <li key={index} className="mb-2 d-flex justify-content-between align-items-start">
                                                                    <div className="fs-6">
                                                                        <strong className="text-capitalize" title={data?.tobaccoUse}>{data?.tobaccoUse?.length > 40 ? data?.tobaccoUse?.slice(0, 39) + '...' : data?.tobaccoUse}</strong>
                                                                        <div className="text-muted fs-6" >
                                                                            {data?.effectiveDateTime ? new Date(data?.effectiveDateTime)?.toISOString().split('T')[0] : ''}
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            ))
                                                        )}
                                                        {socialHistoryData?.familyGeneticHistory?.length > 0 && (
                                                            socialHistoryData?.familyGeneticHistory?.map((data, index) => (
                                                                <li title='Family Genetics' key={index} className="mb-2 d-flex justify-content-between align-items-start">
                                                                    <div className="fs-6">
                                                                        <strong className="text-capitalize" title={data?.name}>{data?.name?.length > 40 ? data?.name?.slice(0, 39) + '...' : data?.name}
                                                                            <span className='ms-1'>
                                                                                {data?.relationship?.coding?.[0]?.display && '(' + data?.relationship?.coding?.[0]?.display + ')'}
                                                                            </span>
                                                                        </strong>
                                                                        <div className="text-muted fs-6" title={data?.condition?.[0]?.code?.text} >
                                                                            {data?.condition?.[0]?.code?.text?.length > 30 ? data?.condition?.[0]?.code?.text?.slice(0, 29) + '...' : data?.condition?.[0]?.code?.text}
                                                                        </div>
                                                                    </div>
                                                                    <span className={`fw-semibold fs-6 text-capitalize ${statusColorMap[data.status] || 'text-body'}`}>
                                                                        {data?.status}
                                                                    </span>
                                                                </li>
                                                            ))
                                                        )}
                                                    </>
                                                )}
                                            </ul>
                                        </div>
                                    </Accordion.Body>
                                );
                                break;

                            default:
                                return null;
                        }

                        return (
                            <Accordion.Item
                                key={menuItem._id}
                                eventKey={menuItem.order.toString()}
                                className="border-0 mb-2"
                            >
                                <Accordion.Header className='p-0 bg-light rounded encounterSummary'>
                                    <span className='fw-semibold fs-6'>{menuItem.name}</span>
                                </Accordion.Header>
                                {content}
                            </Accordion.Item>
                        );
                    })}
                </Accordion>

            </Col>
        </Row>
    );
};

export default EncounterSummary;