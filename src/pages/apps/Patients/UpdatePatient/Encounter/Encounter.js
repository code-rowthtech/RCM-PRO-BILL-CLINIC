import React, { useState } from 'react';
import { Col, Row, Tab, Tabs, Button, Badge, Card, Table } from 'react-bootstrap';
import { IoClose, IoAdd } from 'react-icons/io5';
import { FaCalendarAlt, FaUserMd, FaNotesMedical } from 'react-icons/fa';
import { MdOutlineMedicalServices } from 'react-icons/md';
import './Encounter.css';
import EncounterList from './EncounterList';
import DateEncounters from './DateEncounters';
import AppointmentEncounter from './AppointmentEncounter';

const Encounter = ({ encounterTabs, setEncounterTabs }) => {
    const [activeTab, setActiveTab] = useState(encounterTabs[0]?.id || '');
    const removeEncounterTab = (idToRemove, e) => {
        e.stopPropagation();
        const newTabs = encounterTabs.filter(tab => tab.id !== idToRemove);
        setEncounterTabs(newTabs);

        if (activeTab === idToRemove) {
            setActiveTab(newTabs.length > 0 ? newTabs[0].id : '');
        }
    };

    const addNewEncounter = (type) => {
        const newTab = {
            id: `${type}-${Date.now()}`,
            title: type === 'date' ? 'New Encounter' : 'Follow-up',
            type,
            date: new Date().toLocaleDateString(),
            status: 'Pending',
            provider: 'Dr. Smith',
            notes: ''
        };
        setEncounterTabs([...encounterTabs, newTab]);
        setActiveTab(newTab.id);
    };

    return (
        <Card className="border-0 shadow-sm ">
            <Card.Body className="p-0 border-0">
                <Tabs
                    activeKey={activeTab}
                    onSelect={setActiveTab}
                    id="encounter-tabs"
                    className="px-0 pt-0  mb-0 border-0"
                >
                    {encounterTabs?.map((tab) => (
                        <Tab
                            key={tab.id}
                            eventKey={tab.id}
                            title={
                                <div className={`d-flex fs-6 align-items-center  ${parseInt(activeTab) === tab?.id ? 'border-primary fw-semibold text-primary' : 'text-secondary'}`}>
                                    {tab.type === 'date' ? (
                                        <FaCalendarAlt className="me-1" />
                                    ) : (
                                        <MdOutlineMedicalServices className="me-1" />
                                    )}
                                    <span className="text-nowrap">{tab.title}</span>
                                    {tab.type !== 'default' &&
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className={`p-0 ms-2 ${parseInt(activeTab) === tab?.id ? ' fw-semibold text-primary' : 'text-secondary'} hover-danger`}
                                            onClick={(e) => removeEncounterTab(tab.id, e)}
                                        >
                                            <IoClose />
                                        </Button>
                                    }
                                </div>
                            }
                        >
                            {tab?.type === 'default' ?
                                <EncounterList tab={tab} encounterTabs={encounterTabs} setEncounterTabs={setEncounterTabs} setActiveTab={setActiveTab} />
                                :
                                tab?.type === 'date' ?
                                    <DateEncounters />
                                    :
                                    tab?.type === 'appointment' ?
                                        <AppointmentEncounter />
                                        :
                                        <></>
                            }
                        </Tab>
                    ))}
                </Tabs>

                {/* <div className="p-2 d-flex gap-1">
                    <Button

                        className="me-2 custom-buttons"
                        onClick={() => addNewEncounter('date')}
                    >
                        <IoAdd /> New Encounter
                    </Button>
                    <Button
                        className="me-2 custom-buttons"
                        onClick={() => addNewEncounter('followup')}
                    >
                        <IoAdd /> Add Follow-up
                    </Button>
                </div> */}
            </Card.Body>
        </Card>
    );
};

export default Encounter;