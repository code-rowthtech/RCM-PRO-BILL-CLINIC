import React, { useEffect, useState } from 'react';
import AllergyList from '../Task Tabs/AllergyList';
import ProblemList from '../Task Tabs/ProblemList';
import Medication from './Medication';
import VitalStatus from './VitalStatus';
import { MdAddCircleOutline } from 'react-icons/md';
import { Modal } from 'react-bootstrap';
import UpdateAllergy from '../Task Tabs/UpdateTasks/UpdateAllergy';
import AddAllergy from '../Task Tabs/AddAllergy';
import AddProblem from '../Task Tabs/AddProblem';
import UpdateProblem from '../Task Tabs/UpdateTasks/UpdateProblem';
import AddMedication from './AddMedication';

const tabList = [
    { key: 'Allergy List', label: 'Allergy List' },
    { key: 'Problem List', label: 'Problem List' },
    { key: 'Medication List', label: 'Medication List' },
    { key: 'Vitals', label: 'Vitals' },
];

const SubAllergytabs = ({ isAccordionOpen, defaultTab }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [allergyModal, setAllergyModal] = useState(false);
    const [problemModal, setProblemModal] = useState(false);
    const [medicationModal, setMedicationModal] = useState(false);
    const [showUpdateAllergy, setShowUpdateAllergy] = useState(false);

    // Dummy state for edit mode and selected data
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [selectedMedication, setSelectedMedication] = useState(null);
    useEffect(() => {
        if (defaultTab) {
            setActiveTab(defaultTab);
        }
    }, [defaultTab]);
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
            case 'Vitals':
                // Optional: Handle vital add modal if needed
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <div
                className="d-flex align-items-center justify-content-between border-bottom pe-2"
                style={{ overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none' }}>
                <div className="nav nav-underline flex-nowrap">
                    {tabList.map(({ key, label }) => (
                        <a
                            key={key}
                            className={`nav-link fs-6 fw-bold py-1 px-2 tab-font-family ${
                                activeTab === key
                                    ? 'active text-primary border-bottom border-2 border-primary'
                                    : 'text-muted'
                            }`}
                            style={{ cursor: 'pointer', fontWeight: 600 }}
                            onClick={() => setActiveTab(key)}>
                            {label}
                        </a>
                    ))}
                </div>

                {activeTab !== 'Vitals List' && (
                    <MdAddCircleOutline
                        size={22}
                        className="text-primary cursor-pointer"
                        onClick={handleAddIconClick}
                        style={{ flexShrink: 0 }}
                    />
                )}
            </div>

            <div className="pt-1">
                {activeTab === 'Allergy List' && <AllergyList />}
                {activeTab === 'Problem List' && <ProblemList />}
                {activeTab === 'Medication List' && <Medication isAccordionOpen={isAccordionOpen} />}
                {activeTab === 'Vitals List' && <VitalStatus isAccordionOpen={isAccordionOpen} />}
            </div>

            {/* Modals */}
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

            <AddMedication
                show={medicationModal}
                onCancel={closeMedicationModal}
                selectedMedication={selectedMedication}
            />
        </div>
    );
};

export default SubAllergytabs;
