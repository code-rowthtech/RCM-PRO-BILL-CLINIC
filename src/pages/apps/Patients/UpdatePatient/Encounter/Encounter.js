import { useState } from 'react';
import { Tab, Tabs, Card } from 'react-bootstrap';
import { IoClose } from 'react-icons/io5';
import { FaCalendarAlt } from 'react-icons/fa';
import { MdOutlineMedicalServices } from 'react-icons/md';
import './Encounter.css';
import EncounterList from './EncounterList';
import DateEncounters from './DateEncounters';
import AppointmentEncounter from './AppointmentEncounter';
import { HiMiniBars3BottomLeft } from 'react-icons/hi2';

const Encounter = ({ encounterTabs, setEncounterTabs }) => {
    const [activeTab, setActiveTab] = useState(encounterTabs[0]?.id || '');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    const removeEncounterTab = (idToRemove, e) => {
        e.stopPropagation();
        const newTabs = encounterTabs.filter(tab => tab.id !== idToRemove);
        setEncounterTabs(newTabs);

        if (activeTab === idToRemove) {
            setActiveTab(newTabs.length > 0 ? newTabs[0].id : '');
        }
    };

    return (
        <Card className="border-0 shadow-sm ">
            <Card.Body className="p-0 border-0">
                <div className="position-ralative">
                    {encounterTabs?.length > 1 && (
                        <HiMiniBars3BottomLeft
                            onClick={toggleCollapse}
                            style={{ top: '1.9%', left: '1.3%' }}
                            className='fw-bold fs-4 mb-1 cursor-pointer text-black position-absolute' />

                    )}

                    <Tabs
                        activeKey={activeTab}
                        onSelect={setActiveTab}
                        id="encounter-tabs"
                        className={` ${encounterTabs?.length > 1 ? 'ms-4' : 'px-0 pt-0 '} mb-0 border-0 flex-grow-1`}
                    >
                        {encounterTabs?.map((tab) => (
                            <Tab
                                key={tab.id}
                                eventKey={tab.id}
                                title={
                                    <div
                                        className={`d-flex fs-6 align-items-center  ${parseInt(activeTab) === tab?.id ? ' text-primary ' : 'text-secondary'}`}>
                                        {tab.type === 'date' ? (
                                            <FaCalendarAlt className="me-1" />
                                        ) : (
                                            <MdOutlineMedicalServices className="me-1" />
                                        )}
                                        <span className="text-nowrap">{tab.title}</span>
                                        {tab.type !== 'default' &&
                                            <span className={`p-0 ms-2 m-0  ${parseInt(activeTab) === tab?.id ? 'fw- text-primary' : 'text-secondary'} `}
                                                onClick={(e) => removeEncounterTab(tab.id, e)}>
                                                <IoClose />
                                            </span>
                                        }
                                    </div>
                                }
                            >
                                <div>
                                    {tab?.type === 'default' ?
                                        <EncounterList tab={tab} encounterTabs={encounterTabs} setEncounterTabs={setEncounterTabs} setActiveTab={setActiveTab} />
                                        :
                                        tab?.type === 'date' ?
                                            <DateEncounters isCollapsed={isCollapsed} />
                                            :
                                            tab?.type === 'appointment' ?
                                                <AppointmentEncounter />
                                                :
                                                <></>
                                    }
                                </div>
                            </Tab>
                        ))}
                    </Tabs>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Encounter;