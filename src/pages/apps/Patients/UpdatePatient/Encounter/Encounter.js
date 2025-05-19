import { useEffect, useState } from 'react';
import { Tab, Tabs, Card, Offcanvas } from 'react-bootstrap';
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
import { getEncounterNotesTypeAction, getEncounterSettingsAction } from '../../../../../redux/actions';
import { useSelector } from 'react-redux';

const Encounter = ({ encounterTabs, setEncounterTabs, setExpanded, expanded, isAccordionOpen }) => {
    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState(encounterTabs[0]?.id || '');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchNoteType, setSearchNoteType] = useState('');
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);
    const removeEncounterTab = (idToRemove, e) => {
        e.stopPropagation();
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
        dispatch(getEncounterNotesTypeAction({ skip: 1, search: searchNoteType }))
    }, [dispatch, searchNoteType])
    const [showSettings, setShowSettings] = useState(false)
    const closeSettings = () => {
        setShowSettings(false)
    }
    return (
        <Card className="border-0 shadow-sm mb-0 h-100">
            <Card.Body className="p-0 border-0">
                <div className="row">
                    {/* Tab headers */}
                    <div className="col-12 d-flex align-items-center justify-content-between px-2 ">
                        <div className="d-flex align-items-center ">
                            {encounterTabs?.length > 1 &&
                                <>
                                    <HiMiniBars3BottomLeft
                                        onClick={toggleCollapse}
                                        className='fw-bold fs-4 mx-1  cursor-pointer text-black' />
                                    <CiSettings
                                        onClick={() => setShowSettings(!showSettings)}
                                        className='fw-bold fs-4 mx-1  cursor-pointer text-black' />
                                    <EncounterSettingsForm
                                        showSettings={showSettings}
                                        closeSettings={closeSettings}
                                    />
                                </>}
                            {encounterTabs?.map((tab) => (
                                <div
                                    key={tab.id}
                                    className={`cursor-pointer p-1 fs-6  rounded-0  list-group-item  
                                    d-flex align-items-center flex-fill justify-content-center fw-bold 
                                     ${parseInt(activeTab) === tab?.id ? 'active-patient-chart-tab fw-medium border border-muted' : 'border border-muted'}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >

                                    <span className="text-nowrap">{tab.title}</span>
                                    {tab.type !== 'default' && (
                                        <span
                                            className="p-0 ms-2 m-0"
                                            onClick={(e) => removeEncounterTab(tab.id, e)}
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
                    <div className="col-12 ">
                        {encounterTabs?.map((tab) => (
                            <div key={tab.id} style={{ display: activeTab === tab.id ? 'block' : 'none' }}>
                                {tab?.type === 'default' ? (
                                    <EncounterList
                                        tab={tab}
                                        encounterTabs={encounterTabs}
                                        setEncounterTabs={setEncounterTabs}
                                        setActiveTab={setActiveTab}
                                    />
                                ) : tab?.type === 'date' ? (
                                    <DateEncounters searchNoteType={searchNoteType} setSearchNoteType={setSearchNoteType} isCollapsed={isCollapsed} />
                                ) : tab?.type === 'appointment' ? (
                                    <AppointmentEncounter />
                                ) : (
                                    <></>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Encounter;