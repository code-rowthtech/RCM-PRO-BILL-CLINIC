import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { FormInput } from '../../../components';
import classNames from 'classnames';
import DoctorHoliday from './doctorHoliday';
import Breaks from './breaks';
import ScheduleTab from './scheduleTab';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import DateRangePicker from './DateRangePicker';
import { getScheduleAction } from '../../../redux/schedule/action';
import { useDispatch } from 'react-redux';

const Schedule = () => {
    const [activeTab, setActiveTab] = useState('DoctorHolidays'); // Active tab state
    const [searchQuery, setSearchQuery] = useState(''); // State to hold search query

    const dispatch = useDispatch()
    // Dynamically render the content based on the active tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'DoctorHolidays':
                return <DoctorHoliday />;
            case 'breaks':
                return <Breaks />;
            case 'schedules':
                return <ScheduleTab />;
            default:
                return null;
        }
    };
    const searchHandle = (e) => {
        const payload = {
            startDate: '',  // Add actual startDate if needed
            endDate: '',    // Add actual endDate if needed
            type: "Holiday",
            search: searchQuery, // Pass the search query to the payload
        };
        dispatch(getScheduleAction(payload));

        const breakPayload = {
            startDate: '',
            endDate: '',
            type: "Break",
            search: searchQuery
        };
        dispatch(getScheduleAction(breakPayload));
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
                                        {['DoctorHolidays', 'breaks', 'schedules'].map((tab, index) => (
                                            <li className="nav-item ms-3" key={index}>
                                                <a
                                                    className={classNames('nav-link fw-bold text-black', {
                                                        active: activeTab === tab,
                                                    })}
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setActiveTab(tab);
                                                    }}
                                                >
                                                    {tab === 'DoctorHolidays' && 'Doctor Holidays'}
                                                    {tab === 'breaks' && 'Breaks'}
                                                    {tab === 'schedules' && 'Schedules'}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </Col>

                                {/* Controls Section */}
                                <Col sm={8} className="text-end">
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col xs="auto" className="d-flex gap-2">
                                            {activeTab !== 'schedules' && (
                                                <div className="d-flex align-items-center">
                                                    {/* Search Input with Icon */}
                                                    <div style={{ position: 'relative', width: '100%' }}>
                                                        <FormInput
                                                            type="text"
                                                            placeholder="Search..."
                                                            value={searchQuery} // Bind value to searchQuery state
                                                            style={{
                                                                paddingLeft: '30px', // Adjust for icon space
                                                                width: '100%',
                                                            }}
                                                            onChange={(e) => setSearchQuery(e.target.value)} // Update state on input change
                                                            onKeyUp={searchHandle} // Trigger search on key press
                                                        />
                                                        <FiSearch
                                                            style={{
                                                                position: 'absolute',
                                                                left: '10px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                color: '#aaa',
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {activeTab === 'DoctorHolidays' && (
                                                <>
                                                    <DateRangePicker />
                                                    <Button
                                                        className="custom-buttons"
                                                        as={Link}
                                                        to="/apps/schedule/addHoliday"
                                                    >
                                                        Add Holiday
                                                    </Button>
                                                </>
                                            )}
                                            {activeTab === 'breaks' && (
                                                <Button
                                                    className="custom-buttons"
                                                    as={Link}
                                                    to="/apps/schedule/addBreak"
                                                >
                                                    Add Break
                                                </Button>
                                            )}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            {/* Tab Content */}
                            <div className="mt-3">{renderTabContent()}</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Schedule;
