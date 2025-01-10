// @flow
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getPatientsAction } from "../../../redux/patients/actions";
import { encryptMessage } from "../../../cryptoUtils";
import Select from 'react-select';
import { createAppointmentAction, getAppointmentByIdAction, getDoctorsAction, getPractitionerScheduleAction, getPractitionerSlotsAction, rescheduleAppointmentAction } from "../../../redux/actions";
import { getMastersDataAction } from "../../../redux/settings/action";
import { useForm } from "react-hook-form";
import { getScheduleAction } from "../../../redux/schedule/action";
import Spinner from '../../../constants/Spinner';
import { GoDotFill } from "react-icons/go";
import ToastHandle from "../../../helpers/ToastMessage";

const NewAppointment = () => {
    const navigate = useNavigate();
    const today = new Date();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('updateid');
    const { register, handleSubmit, formState: { errors }, setValue, reset, clearErrors, getValues } = useForm();
    const store = useSelector((state) => state);
    const [selectedDate, setSelectedDate] = useState(today);
    const [currentStartDate, setCurrentStartDate] = useState(today);
    const [patientsSearch, setPatientsSearch] = useState('');
    const [departmentSearch, setDepartmentSearch] = useState('');
    const [doctorSearch, setDoctorSearch] = useState('');
    const [patientsSkip, setPatientsSkip] = useState(1);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const patientsData = store?.getPatientsReducer?.data?.patients;
    const doctorDetails = store?.getDoctorsReducer?.data?.response;
    const departments = store?.getMastersDataReducer?.data?.result;
    const doctorSchedule = store?.getScheduleReducer?.data;
    const availableWeekDays = doctorSchedule?.days;
    const doctorHolidays = doctorSchedule?.holidays;
    const availableSlots = store?.getPractitionerSlotsReducer?.data?.allSlots;
    const bookedSlots = store?.getPractitionerSlotsReducer?.data?.bookedSlots;
    const perPatientTime = store?.getPractitionerSlotsReducer?.data?.perPatientTime;
    const updateData = store?.getAppointmentByIdReducer?.data?.data;
    const updateSuccess = store?.rescheduleAppointmentReducer?.data?.status;
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
        if (id && updateData && patientsData && doctorDetails && departments) {
            const doctor = doctorOptions && doctorOptions?.find((data) => data?.value === updateData?.doctor?._id);
            const patient = patientOptions && patientOptions?.find((data) => data?.value === updateData?.patient?._id);
            const department = departmentOptions && departmentOptions?.find((data) => data?.value === updateData?.doctor?.departmentId?._id);
            const formattedDate = new Date(updateData?.date);
            setSelectedDoctor(doctor)
            setSelectedPatient(patient)
            setSelectedDepartment(department)
            setSelectedDate(formattedDate);
            setValue('reason', updateData?.reason)
            if (doctor && patient && department && formattedDate) {
                const data = {
                    doctorId: doctor?.value,
                    date: updateData?.date
                }
                dispatch(getPractitionerSlotsAction({ key: encryptMessage(data) }));
            }
        }
    }, [id, updateData && patientsData && doctorDetails && departments])


    useEffect(() => {
        if (updateSuccess === 200) {
            const data = {
                doctorId: selectedDoctor?.value,
                date: updateData?.date
            }
            dispatch(getPractitionerSlotsAction({ key: encryptMessage(data) }));
        }
    }, [updateSuccess])

    useEffect(() => {
        if (id) {
            dispatch(getAppointmentByIdAction({ id: id }))
        }
    }, [id])
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
        if (type === 'patient') {
            setSelectedPatient(selectedOption, 'Selected Option');
        } else if (type === 'doctor') {
            setSelectedDoctor(selectedOption, 'Selected Option');
        } else if (type === 'department') {
            setSelectedDepartment(selectedOption, 'Selected Option');
        }
    };
    function calculateEndTime(startTime, perPatientTime) {
        const [time, meridian] = startTime && startTime?.split(" ");
        let [hours, minutes] = time && time?.split(":")?.map(Number);

        // Convert hours to 24-hour format if needed
        if (meridian === "PM" && hours !== 12) {
            hours += 12;
        } else if (meridian === "AM" && hours === 12) {
            hours = 0;
        }

        // Add perPatientTime to the start time
        minutes += perPatientTime;
        hours += Math.floor(minutes / 60);
        minutes = minutes % 60;

        // Handle wrapping of hours
        hours = hours % 24;

        // Convert hours back to 12-hour format
        const newMeridian = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // If 0, set to 12

        // Format minutes as two digits
        minutes = minutes.toString().padStart(2, "0");

        // Return the formatted time
        return `${hours}:${minutes} ${newMeridian}`;
    }
    const onSubmit = (data) => {
        const payload = {
            patient: selectedPatient?.value,
            doctor: selectedDoctor?.value,
            department: selectedDepartment?.value,
            date: selectedDate,
            reason: data?.reason,
            clinic: clinicId,
            slot: selectedSlot,
            startTime: selectedSlot,
            endTime: selectedSlot ? calculateEndTime(selectedSlot, perPatientTime) : '',
        }
        const updatePayload = {
            date: selectedDate,
            reason: data?.reason,
            clinic: clinicId,
            slot: selectedSlot,
            startTime: selectedSlot,
            endTime: selectedSlot ? calculateEndTime(selectedSlot, perPatientTime) : '',
        }
        if (selectedSlot) {
            if (id) {
                console.log(updatePayload, 'payload');
                dispatch(rescheduleAppointmentAction({ key: encryptMessage(updatePayload), id }))
            } else {
                dispatch(createAppointmentAction({ key: encryptMessage(payload) }))
            }
        } else {
            ToastHandle('Please select a slot before proceeding.', 'danger')
        }
    }
    return (
        <Card className="mt-2" style={{ height: "87vh" }}>
            <div className="d-flex justify-content-between align-items-center mx-3 my-2">
                <h5 className="fw-bold mb-0">
                    {id ?
                        'Re-Schedule Appointment'
                        :
                        'New Appointment'
                    }
                </h5>
                <Button variant='secondary' onClick={handleAppointment}>Back</Button>
            </div>
            <Card.Body className='py-1'>
                {store?.getAppointmentByIdReducer?.loading ?
                    <div className="row h-100">
                        <div className="col-12 d-flex align-items-center justify-content-center">
                            <Spinner />
                        </div>
                    </div>
                    :
                    <div className="row">
                        {/* Left Column */}
                        <div className="col-12">
                            <form className="" onSubmit={handleSubmit(onSubmit)}>
                                <div className="row" style={{ minHeight: '70vh' }}>
                                    <div className="col-6">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="mb-1 responnsible-party-select">
                                                    <label htmlFor="patient" className="form-label mb-0">
                                                        Patient <span className="text-danger">*</span>
                                                    </label>
                                                    <Select
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        isLoading={store?.getPatientsReducer?.loading}
                                                        isClearable={true}
                                                        isDisabled={id ? true : false}
                                                        isSearchable={true}
                                                        value={selectedPatient}
                                                        {...register('selectedPatient', {
                                                            required: !id ? 'This field is required.' : false
                                                        })}
                                                        onChange={(data) => {
                                                            setValue('selectedPatient', data);
                                                            clearErrors('selectedPatient');
                                                            handleChange(data, 'patient');
                                                        }}
                                                        onInputChange={(inputValue) => handleInputChange(inputValue, 'patient')}
                                                        options={patientOptions}
                                                        placeholder="Select Patient Name"
                                                    />
                                                    {errors.selectedPatient && (
                                                        <span className="text-danger">{errors.selectedPatient.message}</span>
                                                    )}

                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="mb-1 responnsible-party-select">
                                                    <label htmlFor="doctorDepartment" className="form-label mb-0">
                                                        Doctor Department
                                                    </label>
                                                    <Select
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        isLoading={store?.getMastersDataReducer?.loading}
                                                        isClearable={true}
                                                        value={selectedDepartment}
                                                        isSearchable={true}
                                                        isDisabled={id ? true : false}
                                                        onInputChange={(inputValue) => handleInputChange(inputValue, 'department')}
                                                        onChange={(data) => handleChange(data, 'department')}
                                                        name="departmentName"
                                                        options={departmentOptions}
                                                        placeholder="Select Department"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="mb-1 responnsible-party-select">
                                                    <label htmlFor="doctor" className="form-label mb-0">
                                                        Doctor <span className="text-danger">*</span>
                                                    </label>
                                                    <Select
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        isLoading={store?.getDoctorsReducer?.loading}
                                                        isClearable={true}
                                                        value={selectedDoctor}
                                                        isDisabled={id ? true : false}
                                                        isSearchable={true}
                                                        {...register('selectedDoctor', {
                                                            required: !id ? 'This field is required.' : false
                                                        })}
                                                        onInputChange={(inputValue) => handleInputChange(inputValue, 'doctor')}
                                                        onChange={(data) => {
                                                            setValue('selectedDoctor', data);
                                                            handleChange(data, 'doctor');
                                                            clearErrors('selectedDoctor')
                                                        }}
                                                        name="doctorName"
                                                        options={doctorOptions}
                                                        placeholder="Select Doctor Name"
                                                    />
                                                    {errors?.selectedDoctor && <span className="text-danger">{errors?.selectedDoctor?.message}</span>}
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="mb-1">
                                                    <label htmlFor="reason" className="form-label mb-0">
                                                        Reason
                                                    </label>
                                                    <textarea
                                                        id="reason"
                                                        {...register('reason')}
                                                        className="w-100 input ps-2 py-1"
                                                        style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141' }}
                                                        rows="3"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="col-12">
                                            <div className="mb-0 fw-bold ">
                                                <span className="fs-5 ">
                                                    <div className="text-center">
                                                        Select Date And Time
                                                    </div>
                                                    {/* <div className={`${selectedSlot && selectedDate ? '' : 'd-none'}`}>
                                                        <p className="mb-0 fs-6">Selected Slot:  {selectedDate.toDateString()} ({selectedSlot})</p>
                                                    </div> */}
                                                    <div className="d-flex gap-1 justify-content-end">
                                                        <p className="d-flex align-items-center mb-0 fs-6">
                                                            <GoDotFill className="fs-5 text-muted" />
                                                            <span>Available</span></p>
                                                        <p className="d-flex align-items-center mb-0 fs-6">
                                                            <GoDotFill className="fs-5 text-success" />
                                                            <span>Selected</span></p>
                                                        <p className="d-flex align-items-center mb-0 fs-6">
                                                            <GoDotFill className="fs-5 text-warning" />
                                                            <span>Not Available</span></p>
                                                    </div>
                                                </span>
                                            </div>
                                            <div className="date-carousel d-flex align-items-center py-2 justify-content-around">
                                                <div
                                                    className={`arrow color-black fw-bold fs-2 px-2 ${currentStartDate <= today ? "disabled" : ""}`}
                                                    style={{
                                                        cursor: currentStartDate <= today ? "not-allowed" : "pointer",
                                                        opacity: currentStartDate <= today ? 0.5 : 1,
                                                    }}
                                                    onClick={prevWeek}
                                                >
                                                    &#8249;
                                                </div>
                                                {weekDates && weekDates.map((date) => {
                                                    const dayShort = date?.toLocaleString("en-US", { weekday: "short" });
                                                    const isAvailableDay = availableWeekDays && availableWeekDays?.includes(dayShort);
                                                    const isHoliday = doctorHolidays && doctorHolidays?.some(holidayDate => new Date(holidayDate).toDateString() === date.toDateString());

                                                    return (
                                                        <div
                                                            key={date}
                                                            className={`day mx-2 d-flex justify-content-center align-items-center flex-column px-3 rounded-2 py-0 text-center ${date.toDateString() === selectedDate.toDateString() ? "selected" : ""}`}
                                                            style={{
                                                                cursor: isAvailableDay && !isHoliday ? "pointer" : "not-allowed",
                                                                backgroundColor: date.toDateString() === selectedDate.toDateString()
                                                                    ? "#444141"
                                                                    : (isAvailableDay && !isHoliday ? "white" : "#f0f0f0"),
                                                                opacity: isAvailableDay && !isHoliday ? 1 : 0.5,
                                                            }}
                                                            onClick={() => isAvailableDay && !isHoliday && handleDayClick(date)}
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
                                            <div className="rounded-2 ">
                                                {
                                                    store?.getPractitionerSlotsReducer?.loading ?
                                                        <div className="text-center mt-1 mb-0">
                                                            <Spinner className="spinner-border-sm" />
                                                        </div>
                                                        :
                                                        <div style={{ cursor: 'pointer' }}>
                                                            <div className="row mx-3 d-flex justify-content-center align-items-center">
                                                                {availableSlots?.map((data, index) => (
                                                                    <div
                                                                        key={index}
                                                                        onClick={() => !bookedSlots?.includes(data) && setSelectedSlot(data)}
                                                                        style={{
                                                                            cursor: bookedSlots?.includes(data) ? 'not-allowed' : 'pointer',
                                                                            opacity: bookedSlots?.includes(data) ? '0.7' : '1'
                                                                        }}
                                                                        className={`slots col-2 text-center m-0 gap-2 py-1 rounded-2 ${selectedSlot === data
                                                                            ? 'border border-success bg-success text-white fw-bolder'
                                                                            : bookedSlots?.includes(data)
                                                                                ? 'bg-warning text-white fw-bolder'
                                                                                : ''
                                                                            }`}
                                                                    >
                                                                        {data}
                                                                    </div>
                                                                ))}

                                                            </div>
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="d-flex justify-content-end gap-2 mt-3">
                                            <Button variant="secondary">Cancel</Button>
                                            <Button className="custom-buttons" type="submit" disabled={store?.createAppointmentReducer?.loading || store?.rescheduleAppointmentReducer?.loading}>
                                                {store?.createAppointmentReducer?.loading || store?.rescheduleAppointmentReducer?.loading ?
                                                    <Spinner className="spinner-border-sm" color="white" />
                                                    :
                                                    id ?
                                                        'Re-Schedule'
                                                        :
                                                        'Save'
                                                }
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                }

            </Card.Body>
        </Card>
    );
};

export default NewAppointment;
