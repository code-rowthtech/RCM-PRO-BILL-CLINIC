import { useEffect, useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import './EncountersV2.css';
import EncounterListV2 from './components/EncounterListV2';
import DateEncountersV2 from './components/DateEncountersV2';
import EncounterHeader from './components/EncounterHeader';
import EncounterSettingsForm from '../Encounter/EncounterSettings';
import AppointmentSelectionModal from './components/AppointmentSelectionModal';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorsAction, getEncounterByIdAction, getEncounterNotesTypeAction, getEncounterSettingsAction } from '../../../../../redux/actions';
import { decryptMessage } from '../../../../../cryptoUtils';
import { useSearchParams } from 'react-router-dom';
import { useAppointmentIntegration } from './hooks/useAppointmentIntegration';

let decryptedUser = null;

const encryptedData = localStorage.getItem('encryptedUserData');

if (encryptedData) {
    try {
        decryptedUser = JSON.parse(decryptMessage(encryptedData));
    } catch (err) {
        console.error("Failed to decrypt user data:", err);
    }
} else {
    console.warn("No encrypted user data found in localStorage.");
}

const EncountersV2 = ({
    encounterTabs,
    setEncounterTabs,
    setExpanded,
    expanded,
    createEncounter,
    setCreateEncounter,
    updateEncounter,
    setUpdateEncounter,
    isAccordionOpen,
    scrollToAccordion,
    setScrollToAccordion
}) => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(encounterTabs[0]?.id || '');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [newEncounterModal, setNewEncounterModal] = useState(false);
    const [searchNoteType, setSearchNoteType] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [expandAllAccordions, setExpandAllAccordions] = useState(false);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const store = useSelector((state) => state);
    const { processAppointmentSelection, selectedAppointmentData } = useAppointmentIntegration();
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const id = searchParams.get('id');
    const printRef = useRef();
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);
    const closeNewEncounterModal = () => setNewEncounterModal(false);
    const closeSettings = () => setShowSettings(false);

    useEffect(() => {
        if (createEncounter) {
            setShowAppointmentModal(true);
            setCreateEncounter(false);
        }
    }, [createEncounter, setCreateEncounter]);

    const handleAppointmentSelection = (appointmentData) => {
        processAppointmentSelection(appointmentData);
        const today = new Date().toISOString().split('T')[0];
        const existingTodayTab = encounterTabs.find(
            (tab) => tab.type === 'createEncounter' && tab.title === today
        );
        if (existingTodayTab) {
            setNewEncounterModal(true);
        } else {
            const newTab = {
                id: Date.now(),
                title: today,
                type: 'createEncounter',
                appointmentData: appointmentData
            };
            setEncounterTabs([...encounterTabs, newTab]);
            setActiveTab(newTab.id);
        }
        setShowAppointmentModal(false);
    };

    useEffect(() => {
        if (updateEncounter) {
            const newTab = {
                id: Date.now(),
                title: 'Update Encounter',
                type: 'updateEncounter',
                encounterId: updateEncounter?.id,
                encounterData: updateEncounter?.data
            };
            setEncounterTabs([...encounterTabs, newTab]);
            setActiveTab(newTab.id);
            setUpdateEncounter(null);
        }
    }, [updateEncounter, encounterTabs, setEncounterTabs, setUpdateEncounter]);

    const removeEncounterTab = (idToRemove, e) => {
        if (e) e.stopPropagation();
        const newTabs = encounterTabs.filter(tab => tab.id !== idToRemove);
        setEncounterTabs(newTabs);

        if (activeTab === idToRemove) {
            setActiveTab(newTabs.length > 0 ? newTabs[0].id : '');
        }
    };

    const handleEncounterTabClick = (tab) => {
        if (tab?.type !== 'default') {
            setExpanded(true);
        }
        if (tab?.type === 'updateEncounter') {
            dispatch(getEncounterByIdAction({ encounterId: tab?.id }));
        }
        setActiveTab(tab?.id);
    };

    useEffect(() => {
        dispatch(getEncounterSettingsAction());
        if (doctorDetails === undefined) {
            dispatch(getDoctorsAction({ status: true, search: '', page: 1, limit: 10 }));
        }
    }, [dispatch, doctorDetails]);

    const clinicId = decryptMessage(localStorage?.getItem('subClinicLocation')) || '';

    useEffect(() => {
        if (!store?.getEncounterNotesTypeReducer?.data?.data) {
            dispatch(getEncounterNotesTypeAction({
                skip: 1,
                search: searchNoteType,
                clinicId: clinicId,
                userId: decryptedUser?._id
            }));
        }
    }, [dispatch, searchNoteType, store?.getEncounterNotesTypeReducer?.data?.data, clinicId]);

    const handlePrint = () => {
        const activeTabData = encounterTabs.find(tab => tab.id === activeTab);

        if (activeTabData?.type === 'updateEncounter' || activeTabData?.type === 'createEncounter') {
            if (printRef.current) {
                printRef.current();
            } else {
                console.warn('Cannot print: Print function not available');
            }
        } else {
            console.warn('Cannot print: No active encounter selected');
        }
    };

    const handleReadyForBilling = () => {
        console.log('Ready for billing');
    };

    return (
        <div className="row">
            <EncounterHeader
                encounterTabs={encounterTabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                removeEncounterTab={removeEncounterTab}
                expanded={expanded}
                setExpanded={setExpanded}
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
                expandAllAccordions={expandAllAccordions}
                setExpandAllAccordions={setExpandAllAccordions}
                setIsCollapsed={setIsCollapsed}
                handlePrint={handlePrint}
                handleReadyForBilling={handleReadyForBilling}
                onEncounterTabClick={handleEncounterTabClick}
            />
            <EncounterSettingsForm
                showSettings={showSettings}
                closeSettings={closeSettings}
            />
            <div className="col-12">
                {encounterTabs?.map((tab) => (
                    <div key={tab.id} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
                        {tab?.type === 'default' ? (
                            <EncounterListV2
                                tab={tab}
                                isAccordionOpen={isAccordionOpen}
                                encounterTabs={encounterTabs}
                                setEncounterTabs={setEncounterTabs}
                                setActiveTab={setActiveTab}
                                setExpanded={setExpanded}
                                setCreateEncounter={setCreateEncounter}
                            />
                        ) : (
                            <DateEncountersV2
                                encounterAction={tab?.type}
                                encounterId={tab?.id}
                                expanded={expanded}
                                isAccordionOpen={isAccordionOpen}
                                removeEncounterTab={removeEncounterTab}
                                searchNoteType={searchNoteType}
                                setSearchNoteType={setSearchNoteType}
                                isCollapsed={isCollapsed}
                                setCreateEncounter={setCreateEncounter}
                                encounterTabs={encounterTabs}
                                setEncounterTabs={setEncounterTabs}
                                setActiveTab={setActiveTab}
                                setExpanded={setExpanded}
                                expandAllAccordions={expandAllAccordions}
                                onPrintRef={printRef}
                                scrollToAccordion={scrollToAccordion}
                                setScrollToAccordion={setScrollToAccordion}
                                appointmentData={tab?.appointmentData}
                            />
                        )}
                    </div>
                ))}
            </div>

            <Modal show={newEncounterModal} onHide={closeNewEncounterModal} size="md" centered>
                <Modal.Body className='p-4'>
                    <div className="text-center mb-4">
                        <i className="bi bi-exclamation-circle-fill text-warning fs-1"></i>
                        <h5 className="mt-2 fw-semibold">Duplicate Encounter Detected</h5>
                    </div>
                    <div className="text-muted mb-4 text-center">
                        An encounter for this patient already exists for today. Would you like to update the existing encounter or create a new one?
                    </div>
                    <div className="d-flex justify-content-center gap-3 pt-2">
                        <button
                            className="px-4 custom-buttons"
                            onClick={closeNewEncounterModal}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 custom-buttons"
                            onClick={() => {
                                const newTab = {
                                    id: Date.now(),
                                    title: new Date().toISOString().split('T')[0],
                                    type: 'createEncounter',
                                };
                                setEncounterTabs([...encounterTabs, newTab]);
                                setActiveTab(newTab.id);
                                setNewEncounterModal(false);
                            }}
                        >
                            Create New
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            <AppointmentSelectionModal
                show={showAppointmentModal}
                onHide={() => setShowAppointmentModal(false)}
                onAppointmentSelect={handleAppointmentSelection}
                patientId={id}
            />
        </div>
    );
};

export default EncountersV2;