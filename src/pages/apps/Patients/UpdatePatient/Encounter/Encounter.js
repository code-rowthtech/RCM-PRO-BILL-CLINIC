import { useEffect, useState } from 'react';
import { Tab, Tabs, Card, Offcanvas, Dropdown, Button, Modal } from 'react-bootstrap';
import { IoClose } from 'react-icons/io5';
import { FaCalendarAlt } from 'react-icons/fa';
import { MdOutlineMedicalServices } from 'react-icons/md';
import './Encounter.css';
import EncounterList from './EncounterList';
import DateEncounters from './DateEncounters';
import AppointmentEncounter from './AppointmentEncounter';
import { HiMiniBars3BottomLeft } from 'react-icons/hi2';
import { CiSettings } from "react-icons/ci";
import EncounterSettingsForm from './EncounterSettings';
import { BiCollapse, BiExpand } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { getDoctorsAction, getEncounterNotesTypeAction, getEncounterSettingsAction } from '../../../../../redux/actions';
import { useSelector } from 'react-redux';

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

    // Handle new encounter creation
    // useEffect(() => {
    //     if (createEncounter) {
    //         const newTab = {
    //             id: Date.now(), // Use timestamp for unique ID
    //             title: new Date().toISOString().split('T')[0], // Use current date as title
    //             type: 'createEncounter',
    //         };
    //         setEncounterTabs([...encounterTabs, newTab]);
    //         setActiveTab(newTab?.id); // Automatically switch to new tab
    //         setCreateEncounter(false); // Reset the flag
    //     }
    // }, [createEncounter]);

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
            setActiveTab(newTab.id); // Automatically switch to new tab
            setUpdateEncounter(null); // Reset the flag
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

    useEffect(() => {
        dispatch(getEncounterNotesTypeAction({ skip: 1, search: searchNoteType }))
    }, [dispatch, searchNoteType])

    const [showSettings, setShowSettings] = useState(false)
    const closeSettings = () => {
        setShowSettings(false)
    }

    // `The story of hiroshima and nagasaki goes like :
    // Once there was a time during the World War II when 
    // the United States dropped atomic bombs on the Japanese
    // cities of Hiroshima and Nagasaki in August 1945. This
    // event marked a significant moment in history, leading
    // to Japan's surrender and the end of the war. The bombings
    // resulted in immense destruction and loss of life, with long-lasting
    // effects on the survivors and the environment. The events of Hiroshima
    // and Nagasaki continue to serve as a powerful reminder of the
    // devastating consequences of nuclear warfare and the importance
    // of peace and diplomacy. The story of Hiroshima and Nagasaki is 
    // a poignant chapter in the history of human conflict, highlighting
    // the need for global efforts towards disarmament and reconciliation.
    // The name of the bombs used for the nuclear attacks are as follows:
    // Fat boy and Little man.`;
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
                            className={`cursor-pointer p-1 fs-6 rounded-0 list-group-item  
                                    d-flex align-items-center flex-fill justify-content-center fw-bold 
                                     ${activeTab === tab?.id ? 'active-patient-chart-tab fw-medium border border-muted' : 'border border-muted'}`}
                            onClick={() => setActiveTab(tab?.id)}
                        >
                            <span className="text-nowrap">{tab?.title}</span>
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
                {expanded ?
                    <BiCollapse className='text-primary fw-bold fs-4 cursor-pointer me-2' onClick={() => setExpanded(!expanded)} />
                    :
                    <BiExpand className='text-primary fw-bold fs-4 cursor-pointer me-2' onClick={() => setExpanded(!expanded)} />
                }
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
                        {/* <Button 
                variant="warning" 
                className="px-4 rounded-pill text-white"
                onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    const existingTodayTab = encounterTabs.find(
                        (tab) => tab.type === 'createEncounter' && tab.title === today
                    );
                    if (existingTodayTab) {
                        setActiveTab(existingTodayTab.id);
                    }
                    setNewEncounterModal(false);
                }}
            >
                Update Existing
            </Button> */}

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