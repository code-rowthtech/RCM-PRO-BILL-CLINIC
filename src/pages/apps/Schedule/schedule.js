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
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from "react-datepicker";
import { encryptMessage } from '../../../cryptoUtils';
import Select from 'react-select';
import { getDoctorsAction } from '../../../redux/actions';

const Schedule = () => {
    const store = useSelector((state) => state)
    const [activeTab, setActiveTab] = useState('DoctorHolidays'); // Active tab state
    const [searchQuery, setSearchQuery] = useState(''); // State to hold search query
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const dispatch = useDispatch();
    const [doctorSearch, setDoctorSearch] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    // console.log({ selectedDoctor })
    const doctorDetails = store?.getDoctorsReducer?.data?.response;
    const doctorOptions = doctorDetails?.map((data) => ({
        value: data._id,
        label: data?.userDetails?.firstName + ' ' + data?.userDetails?.lastName,
    }));

    useEffect(() => {

        const payload = {
            search: doctorSearch,
            status: true,
        }
        dispatch(
            getDoctorsAction({ key: encryptMessage(payload) })
        );
    }, [dispatch, doctorSearch])
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
    const handleChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    useEffect(() => {
        const payload = {
            clinicId: clinicId,
            fromDate: startDate || null,
            toDate: endDate || null,
            ...(selectedDoctor?.value ? { doctorId: selectedDoctor?.value } : {})
        };

        dispatch(getScheduleAction({ key: encryptMessage(payload) }));
    }, [startDate, endDate, clinicId, selectedDoctor, dispatch]);
    const handleInputChange = (data, type) => {
        if (type === 'doctor') {
            setDoctorSearch(data)
        }
    }

    const handleSearchInputChange = (selectedOption, type) => {
        // setSelectedPatient(selectedOption, 'Selected Option');
        if (type === 'doctor') {
            setSelectedDoctor(selectedOption, 'Selected Option');
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
                                        {['DoctorHolidays', 'breaks', 'schedules'].map((tab, index) => (
                                            <li className="nav-item " key={index}>
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
                                                    {/* {tab === 'breaks' && 'Breaks'} */}
                                                    {tab === 'schedules' && 'Schedules'}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </Col>

                                {/* Controls Section */}
                                <Col sm={8} className="text-end">
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        {/* <Col xs="auto" className="d-flex gap-2"> */}
                                        {activeTab !== 'schedules' && (
                                            <div className="d-flex align-items-center gap-2 justify-content-end ">
                                                <div className='w-25 responnsible-party-select text-start' styles={{ height: '30px' }}>
                                                    <Select
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        isLoading={store?.getDoctorsReducer?.loading}
                                                        isClearable={true}
                                                        isSearchable={true}
                                                        onInputChange={(inputValue) => handleInputChange(inputValue, 'doctor')}
                                                        onChange={(data) => handleSearchInputChange(data, 'doctor')}
                                                        name="doctorName"
                                                        options={doctorOptions}
                                                        placeholder="Select Doctor"
                                                        styles={{
                                                            control: (base) => ({
                                                                ...base,
                                                                height: '30px', // Set control height
                                                                minHeight: '30px', // Ensure consistent height
                                                            }),
                                                            valueContainer: (base) => ({
                                                                ...base,
                                                                height: '30px', // Adjust internal container height
                                                                padding: '0 8px', // Adjust padding for text
                                                            }),
                                                            indicatorsContainer: (base) => ({
                                                                ...base,
                                                                height: '30px', // Adjust indicator height
                                                            }),
                                                        }}
                                                    />


                                                </div>
                                                <DatePicker
                                                    selected={startDate}
                                                    onChange={handleChange}
                                                    startDate={startDate}
                                                    endDate={endDate}
                                                    selectsRange
                                                    isClearable
                                                    placeholderText="Select a date range"
                                                    className="custom-datepicker"
                                                />

                                                <Button
                                                    className="custom-buttons py-1" style={{ fontSize: '13px', height: '30px', fontWeight: '400' }}
                                                    as={Link}
                                                    to="/apps/schedule/addHoliday"
                                                >
                                                    Add Holiday
                                                </Button>
                                                {/* </div> */}
                                            </div>
                                        )}
                                        {/* {activeTab === 'DoctorHolidays' && (
                                                <>
                                                    <DatePicker
                                                        style={{ background: 'red !important' }}
                                                        selected={startDate}
                                                        onChange={handleChange}
                                                        startDate={startDate}
                                                        endDate={endDate}
                                                        selectsRange
                                                        isClearable
                                                        placeholderText="Select a date range"
                                                    />
                                                    <Button
                                                        className="custom-buttons"
                                                        as={Link}
                                                        to="/apps/schedule/addHoliday"
                                                    >
                                                        Add Holiday
                                                    </Button>
                                                </>
                                            )} */}
                                        {activeTab === 'breaks' && (
                                            <Button
                                                className="custom-buttons"
                                                as={Link}
                                                to="/apps/schedule/addBreak"
                                            >
                                                Add Break
                                            </Button>
                                        )}
                                        {/* </Col> */}
                                    </Row>
                                </Col>
                            </Row>

                            {/* Tab Content */}
                            <div className="mt-1">{renderTabContent()}</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Schedule;
