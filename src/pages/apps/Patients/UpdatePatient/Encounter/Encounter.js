
import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { IoClose } from 'react-icons/io5';
import './Encounter.css';
import EncounterList from './EncounterList';
import DateEncounters from './DateEncounters';
import { HiMiniBars3BottomLeft } from 'react-icons/hi2';
import { CiSettings } from "react-icons/ci";
import EncounterSettingsForm from './EncounterSettings';
import { BiCollapse, BiExpand } from 'react-icons/bi';
import { MdExpandMore, MdExpandLess, MdPrint, MdSave } from 'react-icons/md';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { getDoctorsAction, getEncounterByIdAction, getEncounterNotesTypeAction, getEncounterSettingsAction } from '../../../../../redux/actions';
import { useSelector } from 'react-redux';
import { decryptMessage } from '../../../../../cryptoUtils';
import { formatDate } from '../../../../../helpers/dateFormat';

let decryptedUser = null;

const encryptedData = localStorage.getItem('encryptedUserData');

if (encryptedData) {
    try {
        decryptedUser = JSON.parse(decryptMessage(encryptedData));
    } catch (err) {
        console.error("Failed to decrypt user data:", err);
        // Optionally: redirect to login or handle auth cleanup
    }
} else {
    console.warn("No encrypted user data found in localStorage.");
    // Optionally: redirect to login or show unauthorized message
}

const Encounter = ({ encounterTabs, setEncounterTabs, setExpanded, expanded, createEncounter, setCreateEncounter, updateEncounter, setUpdateEncounter, isAccordionOpen }) => {
    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState(encounterTabs[0]?.id || '');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [newEncounterModal, setNewEncounterModal] = useState(false);
    const [searchNoteType, setSearchNoteType] = useState('');
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);
    const store = useSelector((state) => state);
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const closeNewEncounterModal = () => {
        setNewEncounterModal(false);
    }

    useEffect(() => {
        if (createEncounter) {
            const today = new Date().toISOString().split('T')[0];

            // Check if there's already a createEncounter tab for today
            const existingTodayTab = encounterTabs.find(
                (tab) => tab.type === 'createEncounter' && tab.title === today
            );

            if (existingTodayTab) {
                // Show modal instead of creating new tab
                setNewEncounterModal(true);
            } else {
                // Proceed to create new tab
                const newTab = {
                    id: Date.now(),
                    title: today,
                    type: 'createEncounter',
                };
                setEncounterTabs([...encounterTabs, newTab]);
                setActiveTab(newTab.id);
            }

            // Always reset the flag
            setCreateEncounter(false);
        }
    }, [createEncounter]);


    // Handle encounter update
    useEffect(() => {
        if (updateEncounter) {
            const newTab = {
                id: Date.now(), // Use timestamp for unique ID
                title: 'Update Encounter',
                type: 'updateEncounter',
                encounterId: updateEncounter?.id,
                encounterData: updateEncounter?.data
            };
            setEncounterTabs([...encounterTabs, newTab]);
            setActiveTab(newTab.id);
            setUpdateEncounter(null);
        }
    }, [updateEncounter]);

    const removeEncounterTab = (idToRemove, e) => {
        if (e) e.stopPropagation();
        const newTabs = encounterTabs.filter(tab => tab.id !== idToRemove);
        setEncounterTabs(newTabs);

        if (activeTab === idToRemove) {
            setActiveTab(newTabs.length > 0 ? newTabs[0].id : '');
        }
    };

    useEffect(() => {
        dispatch(getEncounterSettingsAction());
    }, [dispatch])

    useEffect(() => {
        if (doctorDetails === undefined) {
            dispatch(getDoctorsAction({ status: true, search: '', page: 1, limit: 10 }));
        }
    }, [dispatch])

    const clinicId = decryptMessage(localStorage?.getItem('subClinicLocation')) || '';

    useEffect(() => {
        if (!store?.getEncounterNotesTypeReducer?.data?.data) {
            dispatch(getEncounterNotesTypeAction({ skip: 1, search: searchNoteType, clinicId: clinicId, userId: decryptedUser?._id }))
        }
    }, [dispatch, searchNoteType, store?.getEncounterNotesTypeReducer?.data?.data])

    const [showSettings, setShowSettings] = useState(false)
    const [expandAllAccordions, setExpandAllAccordions] = useState(false);
    const closeSettings = () => {
        setShowSettings(false)
    }

    const handlePrint = () => {
        window.print();
    };

    const handleReadyForBilling = () => {
        // Implement billing logic
        console.log('Ready for billing');
    };

    const activeTabData = encounterTabs.find(tab => tab.id === activeTab);
    const isFormTab = activeTabData?.type !== 'default';

    return (
        <div className="row">
            {/* Tab headers */}
            <div className="col-12 d-flex align-items-center justify-content-between px-2 " style={{ height: 'fit-content' }}>
                <div className="d-flex align-items-center ">
                    {encounterTabs?.length > 1 &&
                        <>
                            <HiMiniBars3BottomLeft
                                onClick={toggleCollapse}
                                className='fw-bold fs-4 mx-1 cursor-pointer text-black' />
                            <CiSettings
                                onClick={() => setShowSettings(!showSettings)}
                                className='fw-bold fs-4 mx-1 cursor-pointer text-black' />
                            <EncounterSettingsForm
                                showSettings={showSettings}
                                closeSettings={closeSettings}
                            />
                        </>}
                    {encounterTabs?.map((tab) => (
                        <div
                            key={tab?.id}
                            className={`${encounterTabs?.length > 1 ? 'cursor-pointer' : ''}  p-1 fs-6 rounded-0 list-group-item  
                                    d-flex align-items-center flex-fill justify-content-center fw-bold 
                                     ${activeTab === tab?.id ? 'active-patient-chart-tab fw-medium border border-muted' : 'border border-muted'}`}
                            onClick={() => {
                                if (tab?.type !== 'default') {
                                    setExpanded(true);
                                }
                                if (tab?.type === 'updateEncounter') {
                                    dispatch(getEncounterByIdAction({ encounterId: tab?.id }))
                                }
                                setActiveTab(tab?.id)
                            }}
                        >
                            <span className="text-nowrap">{tab?.title === 'Encounter list' ? tab?.title : formatDate(tab?.title)}</span>
                            {tab.type !== 'default' && (
                                <span
                                    className="p-0 ms-2 m-0"
                                    onClick={(e) => removeEncounterTab(tab?.id, e)}
                                >
                                    <IoClose />
                                </span>
                            )}
                        </div>
                    ))}
                </div>
                <div className="d-flex align-items-center gap-2">
                    {isFormTab && (
                        <>
                            <Button
                                size="sm"
                                variant="outline-secondary"
                                className="d-flex align-items-center gap-1 px-2 py-1"
                                onClick={() => {
                                    setExpandAllAccordions(!expandAllAccordions)
                                    if (expandAllAccordions) {
                                        setExpanded(true);
                                        setIsCollapsed(true);
                                    } else {
                                        // setExpanded(false);
                                        setIsCollapsed(false);
                                    }
                                }}
                                title={expandAllAccordions ? 'Minimize All' : 'Expand All'}
                            >
                                <span className="small">{expandAllAccordions ? 'Minimize All' : 'Expand All'}</span>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline-primary"
                                className="d-flex align-items-center gap-1 px-2 py-1"
                                onClick={handlePrint}
                                title="Print"
                            >
                                <MdPrint size={18} />
                                <span className="small">Print</span>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline-success"
                                className="d-flex align-items-center gap-1 px-2 py-1"
                                form="encounter-form"
                                type="submit"
                                title="Save"
                            >
                                <MdSave size={18} />
                                <span className="small">Save</span>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline-info"
                                className="d-flex align-items-center gap-1 px-2 py-1"
                                onClick={handleReadyForBilling}
                                title="Ready for Billing"
                            >
                                <FaFileInvoiceDollar size={16} />
                                <span className="small">Billing</span>
                            </Button>
                        </>
                    )}
                    {expanded ?
                        <BiCollapse className='text-primary fw-bold fs-4 cursor-pointer' onClick={() => setExpanded(!expanded)} />
                        :
                        <BiExpand className='text-primary fw-bold fs-4 cursor-pointer' onClick={() => setExpanded(!expanded)} />
                    }
                </div>
            </div>

            {/* Tab content */}
            <div className="col-12">
                {encounterTabs?.map((tab) => (
                    <div key={tab.id} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
                        {tab?.type === 'default' ? (
                            <EncounterList
                                tab={tab}
                                isAccordionOpen={isAccordionOpen}
                                encounterTabs={encounterTabs}
                                setEncounterTabs={setEncounterTabs}
                                setActiveTab={setActiveTab}
                                setExpanded={setExpanded}
                                setCreateEncounter={setCreateEncounter}
                            />
                        ) : (
                            <DateEncounters
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
                        <Button
                            className="px-4 custom-buttons"
                            onClick={closeNewEncounterModal}
                        >
                            Cancel
                        </Button>
                        <Button
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
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Encounter;
