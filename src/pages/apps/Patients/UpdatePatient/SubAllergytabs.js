import React, { useEffect, useState } from 'react';
import AllergyList from '../Task Tabs/AllergyList';
import ProblemList from '../Task Tabs/ProblemList';
import Medication from './Medication';
import VitalStatus from './VitalStatus';
import { MdAddCircleOutline } from 'react-icons/md';
import { Form, Modal } from 'react-bootstrap';
import UpdateAllergy from '../Task Tabs/UpdateTasks/UpdateAllergy';
import AddAllergy from '../Task Tabs/AddAllergy';
import AddProblem from '../Task Tabs/AddProblem';
import UpdateProblem from '../Task Tabs/UpdateTasks/UpdateProblem';
import AddMedication from './AddMedication';
import { getVitalsByPatientIdAction } from '../../../../redux/actions';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handlePrintVitals } from '../../../../helpers/printVitals';
import { useSelector } from 'react-redux';
import { defaultVitals } from '../../../../utils/DataSets/commonData2';

const convertToImperial = (value, vitalName) => {
    if (vitalName === 'Height') return (value / 2.54).toFixed(2); // cm to in
    if (vitalName === 'Weight') return (value * 2.20462).toFixed(2); // kg to lbs
    if (vitalName === 'Temperature') return ((value * 9) / 5 + 32).toFixed(2); // C to F
    if (vitalName === 'Head Circumference') return (value / 2.54).toFixed(2)
    return value;
};

const convertFromImperial = (value, vitalName) => {
    if (vitalName === 'Height') return (value * 2.54).toFixed(2); // in to cm
    if (vitalName === 'Weight') return (value / 2.20462).toFixed(2); // lbs to kg
    if (vitalName === 'Temperature') return (((value - 32) * 5) / 9).toFixed(2); // F to C
    if (vitalName === 'Head Circumference') return (value * 2.54).toFixed(2)
    return value;
};
const tabList = [
    { key: 'Allergy List', label: 'Allergy List' },
    { key: 'Problem List', label: 'Problem List' },
    { key: 'Medication List', label: 'Medication List' },
    { key: 'Vitals List', label: 'Vitals List' },
];

const SubAllergytabs = ({ isAccordionOpen, defaultTab }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [allergyModal, setAllergyModal] = useState(false);
    const [problemModal, setProblemModal] = useState(false);
    const [medicationModal, setMedicationModal] = useState(false);
    const [showUpdateAllergy, setShowUpdateAllergy] = useState(false);
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch()
    const store = useSelector((state) => state);
    const patientId = searchParams.get('id');
    const [unitSystem, setUnitSystem] = useState('imperial');
    const [vitals, setVitals] = useState(defaultVitals);
    // const [newVital, setNewVital] = useState('');
    const visitTime = new Date().toLocaleString();
    const patientVitals = store?.getVitalsByPatientIdReducer?.data?.data || [];
    const patientDetails = store?.getPatientByIdReducer?.data?.data;

    useEffect(() => {
        if (defaultTab) {
            setActiveTab(defaultTab)
        }
    }, [defaultTab])
    const handleUnitChange = (newSystem) => {
        // Convert all displayed values when unit system changes
        setVitals(prevVitals => {
            return prevVitals.map(vital => {
                if (!vital.unitKey) return vital; // Skip vitals that don't need conversion

                // For BP, we don't convert the values (mmHg is standard)
                if (vital.type === 'bp') return vital;

                // For BMI, we don't convert (it's unitless)
                if (vital.name === 'BMI') return vital;

                // Convert the displayed value
                let newValue = vital.value;

                if (unitSystem === 'imperial' && newSystem === 'metric') {
                    // Convert from imperial to metric
                    newValue = convertFromImperial(parseFloat(vital.value), vital.name);
                } else if (unitSystem === 'metric' && newSystem === 'imperial') {
                    // Convert from metric to imperial
                    newValue = convertToImperial(parseFloat(vital.value), vital.name);
                }

                return {
                    ...vital,
                    value: newValue.toString()
                };
            });
        });

        setUnitSystem(newSystem);
    };
    // Dummy state for edit mode and selected data
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [selectedMedication, setSelectedMedication] = useState(null);

    const closeMedicationModal = () => {
        setMedicationModal(false);
        setSelectedMedication(null);
    };

    const handleAddIconClick = () => {
        switch (activeTab) {
            case 'Allergy List':
                setShowUpdateAllergy(false);
                setAllergyModal(true);
                break;
            case 'Problem List':
                setIsEditMode(false);
                setProblemModal(true);
                break;
            case 'Medication List':
                setMedicationModal(true);
                break;
            case 'Vitals List':
                // Optional: Handle vital add modal if needed
                break;
            default:
                break;
        }
    };

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(getVitalsByPatientIdAction({ patientId, page: currentPage }));
    }, [currentPage]);

    const paginationData = store?.getVitalsByPatientIdReducer?.data?.pagination;

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (paginationData && currentPage < paginationData?.totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div>
            <div
                className="d-flex align-items-center justify-content-between border-bottom pe-2"
                style={{
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch',
                }}>
                {/* Tabs */}
                <div className="nav nav-underline flex-nowrap">
                    {tabList.map(({ key, label, disabled }) => (
                        <a
                            key={key}
                            className={`nav-link fs-6 fw-bold py-1 px-2 tab-font-family ${activeTab === key
                                ? 'active text-primary border-bottom border-2 fw-bold border-primary'
                                : 'text-muted'
                                } ${disabled ? 'disabled' : ''}`}
                            style={{
                                cursor: disabled ? 'not-allowed' : 'pointer',
                                fontWeight: 600,
                                opacity: disabled ? 0.5 : 1,
                            }}
                            onClick={() => {
                                if (!disabled && activeTab === 'Vitals List' && key !== 'Vitals List') {
                                    dispatch(getVitalsByPatientIdAction({ patientId }));
                                }
                                if (!disabled) {
                                    setActiveTab(key);
                                }
                            }}
                        >
                            {label}
                        </a>
                    ))}
                </div>

                {/* Add Icon */}
                {activeTab !== 'Vitals List' &&
                    <MdAddCircleOutline
                        size={22}
                        className="text-primary cursor-pointer"
                        onClick={handleAddIconClick}
                        style={{ flexShrink: 0 }}
                    />
                }
                {activeTab === 'Vitals List' &&
                    <div className="col-md-3 d-flex gap-2 align-items-center">
                        <i
                            title='Previous'
                            className={`bi cursor-pointer  ${currentPage === paginationData?.totalPages ? 'text-muted' : 'text-primary'} fw-bold fs-4 bi-skip-backward-circle`}
                            onClick={handleNextPage}
                            disabled={currentPage === paginationData?.totalPages}
                        />
                        <i
                            title='Next'
                            className={`bi cursor-pointer  ${currentPage === 1 ? 'text-muted' : 'text-primary'} fw-bold fs-4 bi-skip-forward-circle`}
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}

                        />

                        <span
                            title='Print all vitals'
                            onClick={() => handlePrintVitals({ vitals: patientVitals, patientDetails: patientDetails })}
                            className='uil-print text-primary fs-4 cursor-pointer '
                        />
                        <div className="d-flex gap-1  border-start  ps-2 align-items-center w-100" >
                            <span className='fw-semibold fs-6'>Units:</span>
                            <Form.Select
                                onChange={(e) => handleUnitChange(e.target.value)}
                                value={unitSystem}
                                className="w-100"
                            >
                                <option value='imperial'>Imperial</option>
                                <option value='metric'>Metric</option>
                            </Form.Select>
                        </div>
                    </div>
                }

            </div>

            <div className="pt-1">
                {activeTab === 'Allergy List' && <AllergyList />}
                {activeTab === 'Problem List' && <ProblemList />}
                {activeTab === 'Medication List' && <Medication isAccordionOpen={isAccordionOpen} />}
                {activeTab === 'Vitals List' && <VitalStatus isAccordionOpen={isAccordionOpen} unitSystem={unitSystem} setUnitSystem={setUnitSystem} />}
            </div>

            {/* Allergy Modal */}
            <Modal show={allergyModal} onHide={() => setAllergyModal(false)} size="lg" centered>
                <Modal.Header closeButton className="px-2 py-0">
                    <Modal.Title>{showUpdateAllergy ? 'Update Allergy' : 'Add Allergy'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddAllergy
                        onCancel={() => {
                            setShowUpdateAllergy(false);
                            setAllergyModal(false);
                        }}
                    />
                </Modal.Body>
            </Modal>

            {/* Problem Modal */}
            <Modal show={problemModal} onHide={() => setProblemModal(false)} size="lg" centered>
                <Modal.Header closeButton className="px-2 py-0">
                    <Modal.Title>{isEditMode ? 'Update Problem' : 'Add Problem'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isEditMode ? (
                        <UpdateProblem problem={selectedProblem} onCancel={() => setProblemModal(false)} />
                    ) : (
                        <AddProblem onCancel={() => setProblemModal(false)} />
                    )}
                </Modal.Body>
            </Modal>
            {/* Medication Modal */}
            <AddMedication
                show={medicationModal}
                onCancel={closeMedicationModal}
                selectedMedication={selectedMedication}
            />
        </div>
    );
};

export default SubAllergytabs;
