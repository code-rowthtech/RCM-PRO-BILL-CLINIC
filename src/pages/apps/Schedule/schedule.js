import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { FormInput } from '../../../components';
import classNames from 'classnames';
import DoctorHoliday from './doctorHoliday';
import Breaks from './breaks';
import ScheduleTab from './scheduleTab';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import { encryptMessage } from '../../../cryptoUtils';
import Select from 'react-select';
import { getScheduleAction } from '../../../redux/schedule/action';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorsAction } from '../../../redux/actions';
import Paginations from '../../../helpers/Paginations';

const Schedule = () => {
    const store = useSelector((state) => state);
    const [activeTab, setActiveTab] = useState('DoctorHolidays');
    const [searchQuery, setSearchQuery] = useState('');
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [status, setStatus] = useState(true);
    const dispatch = useDispatch();
    const [skip, setSkip] = useState(1);
    const [doctorSearch, setDoctorSearch] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const scheduleResponse = store?.getScheduleReducer?.data?.holidays;

    const navigate = useNavigate('');
    const doctorOptions = doctorDetails?.map((data) => ({
        value: data._id,
        label: data?.name[0]?.text + ' ',
    }));

    useEffect(() => {
        const payload = {
            search: doctorSearch,
            status: status,
            page: skip,
            limit: 10,
        };
        dispatch(getDoctorsAction(payload));
    }, [dispatch, doctorSearch, status, skip]);

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
    // useEffect(() => {
    //     const hasFilters = (startDate) !== null ||  (endDate) !== null || scheduleResponse === undefined  ;
    //     const payload = {
    //         clinicId: clinicId,
    //         fromDate: startDate || null,
    //         toDate: endDate || null,
    //         ...(selectedDoctor?.value ? { doctorId: selectedDoctor?.value } : {}),
    //     };
    //     if (hasFilters) {
    //         dispatch(getScheduleAction({ key: encryptMessage(payload) }));
    //     }
    // }, [dispatch, startDate , endDate ]);
    useEffect(() => {
        const payload = {
            clinicId: clinicId,
            fromDate: startDate || null,
            toDate: endDate || null,
            page: skip,
            ...(selectedDoctor?.value ? { doctorId: selectedDoctor?.value } : {}),
        };

        dispatch(getScheduleAction({ key: encryptMessage(payload) }));
    }, [startDate, endDate, clinicId, selectedDoctor, dispatch, skip]);

    const handleInputChange = (data, type) => {
        if (type === 'doctor') {
            setDoctorSearch(data);
        }
    };

    const handleSearchInputChange = (selectedOption, type) => {
        if (type === 'doctor') {
            setSelectedDoctor(selectedOption);
        }
    };
    const handleAddHoliday = () => {
        navigate('/apps/schedule/addHoliday');
    };
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
    return (
        <div className="schedule-container">
            <Row className="mt-2">
                <Col xs={12}>
                    <Card style={{ height: '90vh' }}>
                        <Card.Body>
                            <Row className="mb-2">
                                {/* Navigation Tabs */}
                                <Col sm={4} xs={12} className="mb-3 mb-sm-0">
                                    <ul className="nav nav-underline font_active_tabs">
                                        {['DoctorHolidays', 'breaks', 'schedules'].map((tab, index) => (
                                            <li className="nav-item" key={index}>
                                                <a
                                                    className={classNames('nav-link fw-bold text-black', {
                                                        active: activeTab === tab,
                                                    })}
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setActiveTab(tab);
                                                    }}>
                                                    {tab === 'DoctorHolidays' && 'Provider Time Off'}
                                                    {/* {tab === 'breaks' && 'Breaks'} */}
                                                    {tab === 'schedules' && 'Schedules'}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </Col>

                                {/* Controls Section */}
                                <Col sm={8} xs={12} className="text-md-end ">
                                    <Row className="gy-2 gx-2 align-items-center justify-content-between">
                                        {activeTab !== 'schedules' && (
                                            <div className="d-flex align-items-center gap-md-2 gap-1 justify-content-start justify-content-md-end flex-wrap">
                                                <div className="responnsible-party-select text-start">
                                                    <Select
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        isLoading={store?.getDoctorsReducer?.loading}
                                                        isClearable
                                                        isSearchable
                                                        onInputChange={(inputValue) =>
                                                            handleInputChange(inputValue, 'doctor')
                                                        }
                                                        onChange={(data) => handleSearchInputChange(data, 'doctor')}
                                                        name="doctorName"
                                                        options={doctorOptions}
                                                        placeholder="Select Provider"
                                                        getOptionLabel={(e) =>
                                                            e.label.replace(/\b\w/g, (char) => char.toUpperCase())
                                                        }
                                                        styles={{
                                                            control: (provided) => ({
                                                                ...provided,
                                                                minHeight: '30px',
                                                                width: '200px',
                                                                padding: '0px',
                                                                fontSize: '14px',
                                                                border: '0px',
                                                                backgroundColor: '#E8F0FE!important',
                                                                boxShadow: 'none',
                                                            }),
                                                            valueContainer: (provided) => ({
                                                                ...provided,
                                                                padding: '0px',
                                                            }),
                                                            input: (provided) => ({
                                                                ...provided,
                                                                marginLeft: '5px',
                                                            }),
                                                            indicatorsContainer: (provided) => ({
                                                                ...provided,
                                                                height: '30px',
                                                            }),
                                                            placeholder: (provided) => ({
                                                                ...provided,
                                                                fontWeight: 600,
                                                                color: '#0908084f',
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
                                                    className="date-picker-input border-0"
                                                />
                                                <Button
                                                    className="custom-buttons d-none d-md-block"
                                                    onClick={handleAddHoliday}>
                                                    Add Holiday
                                                </Button>
                                                <Button
                                                    className="custom-buttons d-md-none py-1"
                                                    onClick={handleAddHoliday}>
                                                    +
                                                </Button>
                                            </div>
                                        )}
                                        {activeTab === 'breaks' && (
                                            <Button className="custom-buttons" as={Link} to="/apps/schedule/addBreak">
                                                Add Break
                                            </Button>
                                        )}
                                    </Row>
                                </Col>
                            </Row>


                            {/* Tab Content */}
                            <div className="mt-1">{renderTabContent()}</div>
                            {activeTab === 'DoctorHolidays' &&
                                <Row>
                                    <Col className="mt-2 d-flex justify-content-end">
                                        <Paginations
                                            currentPage={skip}
                                            totalPages={store?.getScheduleReducer?.data?.totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </Col>
                                </Row>
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Schedule;
