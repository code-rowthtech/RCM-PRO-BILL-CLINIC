// File: schedule.jsx

import React, { useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { FormInput } from '../../../components';
import classNames from 'classnames';
import DoctorHoliday from './doctorHoliday';
import Breaks from './breaks';
import ScheduleTab from './scheduleTab';
import { Link } from 'react-router-dom';

const Schedule = () => {
    // State to track the active tab
    const [activeTab, setActiveTab] = useState('DoctorHolidays');

    // Placeholder content for each tab
    const renderTabContent = () => {
        if (activeTab === 'DoctorHolidays') {
            return <> <DoctorHoliday /></>;
        } else if (activeTab === 'breaks') {
            return <><Breaks /></>;
        } else if (activeTab === 'schedules') {
            return <><ScheduleTab /></>;
        }
    };

    return (
        <div>
            <Row className="mt-2">
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                                {/* Navigation Tabs */}
                                <Col sm={4}>
                                    <ul className="nav nav-underline">
                                        <li className="nav-item">
                                            <a
                                                className={classNames("nav-link fw-bold text-black", { active: activeTab === 'DoctorHolidays' })}
                                                href="#"
                                                onClick={() => setActiveTab('DoctorHolidays')}
                                            >
                                                Doctor Holidays
                                            </a>
                                        </li>
                                        <li className="nav-item ms-3">
                                            <a
                                                className={classNames("nav-link fw-bold text-black", { active: activeTab === 'breaks' })}
                                                href="#"
                                                onClick={() => setActiveTab('breaks')}
                                            >
                                                Breaks
                                            </a>
                                        </li>
                                        <li className="nav-item ms-3">
                                            <a
                                                className={classNames("nav-link fw-bold text-black", { active: activeTab === 'schedules' })}
                                                href="#"
                                                onClick={() => setActiveTab('schedules')}
                                            >
                                                Schedules
                                            </a>
                                        </li>
                                    </ul>
                                </Col>

                                {/* Controls Section */}
                                <Col sm={8} className="text-end">
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col xs="auto" className="d-flex gap-2">
                                            {activeTab !== 'schedules' && (
                                                <FormInput
                                                    type="text"
                                                    placeholder="Search..."
                                                />
                                            )}
                                            {activeTab === 'DoctorHolidays' && (
                                                <>
                                                    {/* <Button className="custom-buttons">
                                                        <FiFilter className="fs-4" />
                                                    </Button> */}
                                                    <FormInput
                                                        type="date"
                                                    />
                                                    {/* <Button className="custom-buttons">
                                                        <FiFileText className="fs-4" />
                                                    </Button> */}
                                                    <Button className="custom-buttons" as={Link} to={'/apps/schedule/addHoliday'}>Add Holiday</Button>
                                                </>
                                            )}
                                            {activeTab === 'breaks' && (
                                                <>
                                                    <Button className="custom-buttons" as={Link} to={'/apps/schedule/addBreak'}>Add Break</Button>
                                                </>
                                            )}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            {/* Tab Content */}
                            <div className="mt-3">
                                {renderTabContent()}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Schedule;
