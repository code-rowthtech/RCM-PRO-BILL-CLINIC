// @flow
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getPatientsAction } from "../../../redux/patients/actions";
import { encryptMessage } from "../../../cryptoUtils";
import Select from 'react-select';
import { createAppointmentAction, getDoctorsAction, getPractitionerScheduleAction, getPractitionerSlotsAction } from "../../../redux/actions";
import { getMastersDataAction } from "../../../redux/settings/action";
import { useForm } from "react-hook-form";
import { getScheduleAction } from "../../../redux/schedule/action";

const NewAppointment = () => {
    const navigate = useNavigate();
    const today = new Date();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, setValue, reset, clearErrors } = useForm();
    const store = useSelector((state) => state);
    const [selectedDate, setSelectedDate] = useState(today);
    console.log({ selectedDate })
    const [currentStartDate, setCurrentStartDate] = useState(today);
    const [patientsSearch, setPatientsSearch] = useState('');
    const [departmentSearch, setDepartmentSearch] = useState('');
    const [doctorSearch, setDoctorSearch] = useState('');
    const [patientsSkip, setPatientsSkip] = useState(1);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const patientsData = store?.getPatientsReducer?.data?.patients;
    const doctorDetails = store?.getDoctorsReducer?.data?.response;
    const departments = store?.getMastersDataReducer?.data?.result;
    const doctorSchedule = store?.getScheduleReducer?.data;
    const availableWeekDays = doctorSchedule?.days;
    const doctorHolidays = doctorSchedule?.holidays;
    const availableSlots = store?.getPractitionerSlotsReducer?.data?.allSlots;

    console.log(availableSlots, 'doctorSchedule')
    const patientOptions = patientsData?.map((data) => ({
        value: data._id,
        label: data.fullName,
    }));

    const doctorOptions = doctorDetails?.map((data) => ({
        value: data._id,
        label: data?.userDetails?.firstName + ' ' + data?.userDetails?.lastName,
    }));

    const departmentOptions = departments?.map((data) => ({
        value: data._id,
        label: data?.name,
    }));

    useEffect(() => {
        const patientsPayload = {
            clinicId: clinicId,
            page: patientsSkip,
            limit: 10,
            search: patientsSearch,
        }
        const doctorPayload = { status: true, search: doctorSearch }
        dispatch(getDoctorsAction({ key: encryptMessage(doctorPayload) }));
        dispatch(getPatientsAction({ key: encryptMessage(patientsPayload) }));
    }, [dispatch, patientsSearch])

    useEffect(() => {
        const doctorPayload = { status: true, search: doctorSearch, department: 'Dental' }
        dispatch(getDoctorsAction({ key: encryptMessage(doctorPayload) }));
    }, [dispatch, doctorSearch])

    useEffect(() => {
        dispatch(getMastersDataAction({ status: true, category: 'Department', limit: 1, skip: 1, search: departmentSearch }));
    }, [dispatch, departmentSearch])
    useEffect(() => {
        if (selectedDoctor) {
            const payload = {
                doctorId: selectedDoctor?.value,
                forAppointment: true,
            }
            dispatch(getScheduleAction({ key: encryptMessage(payload) }))
        }
    }, [selectedDoctor])
    const generateWeekDates = (startDate) => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            return date;
        });
    };

    const weekDates = generateWeekDates(currentStartDate);

    const prevWeek = () => {
        const prevStart = new Date(currentStartDate);
        prevStart.setDate(currentStartDate.getDate() - 7);
        if (prevStart < today) {
            setCurrentStartDate(today);
        } else {
            setCurrentStartDate(prevStart);
        }
    };

    const nextWeek = () => {
        const nextStart = new Date(currentStartDate);
        nextStart.setDate(currentStartDate.getDate() + 7);
        setCurrentStartDate(nextStart);
    };

    const handleDayClick = (date) => {
        setSelectedDate(date);
        // navigate('/apps/appointments/appointmentCalendar')
        const data = {
            doctorId: selectedDoctor?.value,
            date: date
        }
        dispatch(getPractitionerSlotsAction({ key: encryptMessage(data) }));
    };

    const handleAppointment = () => {
        navigate("/apps/appointments/list");
    };

    const handleInputChange = (data, type) => {
        if (type === 'patient') {
            setPatientsSearch(data)
        } else if (type === 'doctor') {
            setDoctorSearch(data)
        } else if (type === 'department') {
            setDepartmentSearch(data)
        }
    }

    const handleChange = (selectedOption, type) => {
        // setSelectedPatient(selectedOption, 'Selected Option');
        if (type === 'patient') {
            setSelectedPatient(selectedOption, 'Selected Option');
        } else if (type === 'doctor') {
            setSelectedDoctor(selectedOption, 'Selected Option');
        } else if (type === 'department') {
            setSelectedDepartment(selectedOption, 'Selected Option');
        }
    };
    const onSubmit = (data) => {
        const payload = {
            patient: selectedPatient?.value,
            doctor: selectedDoctor?.value,
            department: selectedDepartment?.value,
            date: data?.date,
            description: data?.description,
            clinic: clinicId,
        }
        dispatch(createAppointmentAction({ key: encryptMessage(payload) }))
    }
    return (
        <Card className="mt-2" style={{ height: "87vh" }}>
            {/* Card Header */}
            <div className="d-flex justify-content-between align-items-center mx-3 mt-2">
                <h5 className="fw-bold mb-0">New Appointment</h5>
                <Button variant='secondary' onClick={handleAppointment}>Back</Button>
            </div>

            {/* Card Body */}
            <Card.Body className='py-1'>
                <div className="row">
                    {/* Left Column */}
                    <div className="col-12">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                                <div className="col-6">
                                    <div className="mb-1 responnsible-party-select">
                                        <label htmlFor="patient" className="form-label mb-0">
                                            Patient
                                        </label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            isLoading={store?.getPatientsReducer?.loading}
                                            isClearable={true}
                                            isSearchable={true}
                                            onInputChange={(inputValue) => handleInputChange(inputValue, 'patient')} // Pass inputValue and type
                                            onChange={(data) => handleChange(data, 'patient')}
                                            name="patientName"
                                            options={patientOptions}
                                            placeholder="Select Patient Name"
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="mb-1 responnsible-party-select">
                                        <label htmlFor="doctorDepartment" className="form-label mb-0">
                                            Doctor Department
                                        </label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            isLoading={store?.getMastersDataReducer?.loading}
                                            isClearable={true}
                                            isSearchable={true}
                                            onInputChange={(inputValue) => handleInputChange(inputValue, 'department')} // Pass inputValue and type
                                            onChange={(data) => handleChange(data, 'department')}
                                            name="departmentName"
                                            options={departmentOptions}
                                            placeholder="Select Department"
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="mb-1 responnsible-party-select">
                                        <label htmlFor="doctor" className="form-label mb-0">
                                            Doctor
                                        </label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            isLoading={store?.getDoctorsReducer?.loading}
                                            isClearable={true}
                                            isSearchable={true}
                                            onInputChange={(inputValue) => handleInputChange(inputValue, 'doctor')} // Pass inputValue and type
                                            onChange={(data) => handleChange(data, 'doctor')}
                                            name="doctorName"
                                            options={doctorOptions}
                                            placeholder="Select Doctor Name"
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="mb-1">
                                        <label htmlFor="date" className="form-label mb-0">
                                            Date:
                                        </label>
                                        <input
                                            type="date"
                                            className="w-100 input ps-2 py-1"
                                            id="date"
                                            {...register('date')}
                                            placeholder="Enter Date of birth"
                                            style={{ border: '1px solid #444141', fontSize: '14px' }}
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="mb-1">
                                        <label htmlFor="description" className="form-label mb-0">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            {...register('description')}
                                            className="w-100 input ps-2 py-1"
                                            style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141' }}
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="col-6">
                                    {/* Active Date Range */}
                                    <div className="mb-0 text-start fw-bold">
                                        <span>
                                            {currentStartDate.toDateString()} - {weekDates[6].toDateString()}
                                        </span>
                                    </div>

                                    {/* Date Carousel */}
                                    <div className="date-carousel d-flex align-items-center py-1 justify-content-around">
                                        <div
                                            className={`arrow color-black fw-bold fs-2 px-2 ${currentStartDate <= today ? "disabled" : ""
                                                }`}
                                            style={{
                                                cursor: currentStartDate <= today ? "not-allowed" : "pointer",
                                                opacity: currentStartDate <= today ? 0.5 : 1,
                                            }}
                                            onClick={prevWeek}
                                        >
                                            &#8249;
                                        </div>
                                        {weekDates && weekDates.map((date) => {
                                            // Get the day short format (e.g., 'Mon', 'Tue')
                                            const dayShort = date.toLocaleString("en-US", { weekday: "short" });

                                            // Check if the day is available and not a holiday
                                            const isAvailableDay = availableWeekDays && availableWeekDays?.includes(dayShort);
                                            const isHoliday = doctorHolidays && doctorHolidays?.some(holidayDate => new Date(holidayDate).toDateString() === date.toDateString());

                                            return (
                                                <div
                                                    key={date}
                                                    className={`day mx-2 d-flex justify-content-center align-items-center flex-column px-3 rounded-2 py-0 text-center ${date.toDateString() === selectedDate.toDateString() ? "selected" : ""}`}
                                                    style={{
                                                        cursor: isAvailableDay && !isHoliday ? "pointer" : "not-allowed", // Disable click if not available or a holiday
                                                        backgroundColor: date.toDateString() === selectedDate.toDateString()
                                                            ? "#444141"
                                                            : (isAvailableDay && !isHoliday ? "white" : "#f0f0f0"), // Change background based on availability
                                                        opacity: isAvailableDay && !isHoliday ? 1 : 0.5, // Disabled style for unavailable or holiday days
                                                    }}
                                                    onClick={() => isAvailableDay && !isHoliday && handleDayClick(date)} // Only allow clicks if available
                                                >
                                                    <span className="mb-0">{dayShort}</span>
                                                    <h5 className="my-0">{date.getDate()}</h5>
                                                </div>
                                            );
                                        })}

                                        <div
                                            className="arrow px-2 color-black fw-bold fs-2"
                                            style={{ cursor: "pointer" }}
                                            onClick={nextWeek}
                                        >
                                            &#8250;
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-2">
                                        <h5 className="mb-0">Available Slots</h5>
                                        <div className="row m-0">
                                            {availableSlots?.map((data, index) => (
                                                <div key={index} className="col-2 text-center slots m-1 m-0 d-flex gap-1 py-1 rounded-2">{data}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="d-flex justify-content-end gap-2 mt-3">
                                        <Button variant="secondary">Cancel</Button>
                                        <Button className="custom-buttons" type="submit">Save</Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default NewAppointment;
