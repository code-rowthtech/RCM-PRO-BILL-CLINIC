import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { EVENTS } from './event'
import { getAppointmentsAction } from '../../../redux/appointments/action';
import { useDispatch, useSelector } from 'react-redux';
import { IoMdClose } from 'react-icons/io';
import Spinner from '../../../constants/Spinner';

const localizer = momentLocalizer(moment);
const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

const AppointmentCalendar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [events, setEvents] = useState([]);
    const store = useSelector((state) => state);
    const appointmentsList = store?.getAppointmentsReducer?.data?.appointments;
    const [show, setShow] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null)
    console.log({ selectedEvent })

    useEffect(() => {
        dispatch(getAppointmentsAction({ clinicId: clinicId }));
    }, [dispatch, clinicId]);
    useEffect(() => {
        if (appointmentsList?.length > 0) {
            const transformedEvents = appointmentsList.map((data) => {
                console.log({ data })
                try {
                    // Parse the date string into a base Date object
                    const baseDate = new Date(data.date);
                    if (isNaN(baseDate)) {
                        console.error(`Invalid date format: ${data.date}`);
                        return null;
                    }

                    // Parse startTime and endTime strings
                    const startTimeParts = parseTimeString(data.startTime);
                    const endTimeParts = parseTimeString(data.endTime);
                    // Create the start and end Date objects
                    const start = new Date(baseDate);
                    start.setHours(startTimeParts.hours, startTimeParts.minutes);

                    const end = new Date(baseDate);
                    end.setHours(endTimeParts.hours, endTimeParts.minutes);

                    // Check for valid start and end dates
                    if (isNaN(start) || isNaN(end)) {
                        console.error("Invalid start or end date", start, end);
                        return null;
                    }

                    return {
                        event_id: data?._id,
                        title: data?.purposeOfVisit,
                        appointmentDate: new Date(data?.date).toLocaleDateString('en-GB'),
                        start: start,
                        end: end,
                        slotStart: data?.startTime,
                        slotEnd: data?.endTime,
                        doctorName: data?.doctor?.userId?.firstName + ' ' + data?.doctor?.userId?.lastName,
                        patientName: data?.patient?.title + ' ' + data?.patient?.firstName,
                        patientContact: data?.patient?.cellPhone,
                        appointmentDescription: data?.reason,
                        patientAddress: data?.patient?.address?.street,
                        clinicLogo: data?.clinic?.logo?.url,
                        patientGender: data?.patient?.sex,
                        patientEmail: data?.patient?.email,
                        doctorDepartment: data?.doctor?.departmentId?.name,
                        doctorContact: data?.doctor?.userId?.phone,
                        doctorEmail: data?.doctor?.userId?.email,
                        patientId: data?.patient?._id,
                    };
                } catch (error) {
                    console.error("Error processing appointment:", data, error);
                    return null;
                }
            }).filter(Boolean); // Remove null values caused by invalid data
            setEvents(transformedEvents); // Update the events state
        }
    }, [appointmentsList]);

    // Helper function to parse "9:30 AM" into hours and minutes
    const parseTimeString = (timeString) => {
        if (!timeString) {
            throw new Error(`Invalid time string: ${timeString}`);
        }
        const [time, modifier] = timeString.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) {
            hours += 12;
        } else if (modifier === "AM" && hours === 12) {
            hours = 0;
        }

        return { hours, minutes };
    };


    const handleEventClick = (event) => {
        // alert(`Event clicked: ${event.title}`);
        setShow(true);
        setSelectedEvent(event);
    };
    const closeModal = () => {
        setShow(false);
        setSelectedEvent(null);
    }
    return (
        <div className='background_Color pt-1 pb-2'>
            <div className='container-fluid px-4'>
                <div className='d-flex justify-content-between mt-3'>
                    <p className='fw-bold mt-1'>Appointment Calendar</p>
                    <Button
                        onClick={() => navigate("/apps/appointments/list")}
                        className='cancel-button'
                    >
                        Back
                    </Button>
                </div>
                <div className='row'>
                    {store?.getAppointmentsReducer?.loading ?
                        <div className="row h-100">
                            <div className="col-12 d-flex align-items-center justify-content-center">
                                <Spinner />
                            </div>
                        </div>
                        :
                        <div className='col'>
                            <div className='mt-3'>
                                <Calendar
                                    localizer={localizer}
                                    events={events}
                                    startAccessor="start"
                                    endAccessor="end"
                                    style={{ height: 500 }}
                                    onSelectEvent={handleEventClick}
                                />
                            </div>
                        </div>
                    }

                </div>
            </div>
            <Modal centered show={show} size='lg' onHide={closeModal}>
                <Modal.Body>
                    <Row className="border-bottom mb-1 pb-2">
                        <Col sm={11} className='text-center'><h4>Appointment Details</h4></Col>
                        <Col sm={1}><IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} /></Col>
                    </Row>
                    <Row>
                        {/* <Col sm={12} className="d-flex justify-content-start my-1">
                            <img
                                src={selectedEvent?.clinicLogo}
                                alt="clinic logo"
                                className="rounded-circle border border-muted" // Ensures the image is circular
                                style={{
                                    width: "3rem", // Set width and height explicitly for a perfect circle
                                    height: "3rem",
                                    objectFit: "cover", // Ensures the image fills the circle without distorting
                                }}
                            />
                        </Col> */}
                        {/* <hr className='my-1 text-black' /> */}
                        {/* <Col sm={12} className='my-1'> */}
                        <Row className='text-black my-2'>
                            <Col sm={12}>
                                <h4 className='my-0 mb-1 fw-bold'>Patient Details</h4>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6} className='fw-bold'>
                                        Patient name:
                                    </Col>
                                    <Col sm={6}>
                                        {selectedEvent?.patientName}
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6} className='fw-bold'>
                                        Gender:
                                    </Col>
                                    <Col sm={6}>
                                        {selectedEvent?.patientGender}
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6} className='fw-bold'>
                                        Contact no:
                                    </Col>
                                    <Col sm={6}>
                                        {selectedEvent?.patientContact}
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6} className='fw-bold'>
                                        Email:
                                    </Col>
                                    <Col sm={6}>
                                        {selectedEvent?.patientEmail}
                                    </Col>
                                </Row>
                            </Col>

                        </Row>
                        <hr className='my-1 text-black' />
                        <Row className='text-black my-2'>
                            <Col sm={12}>
                                <h4 className='my-0 mb-1 fw-bold'>Doctor Details</h4>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6} className='fw-bold'>
                                        Doctor name:
                                    </Col>
                                    <Col sm={6}>
                                        Dr. {selectedEvent?.doctorName}
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6} className='fw-bold'>
                                        Department:
                                    </Col>
                                    <Col sm={6}>
                                        {selectedEvent?.doctorDepartment}
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6} className='fw-bold'>
                                        Contact no:
                                    </Col>
                                    <Col sm={6}>
                                        {selectedEvent?.doctorContact}
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6} className='fw-bold'>
                                        Email:
                                    </Col>
                                    <Col sm={6}>
                                        {selectedEvent?.doctorEmail}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <hr className='my-1 text-black' />
                        <Row className='text-black my-2'>
                            <Col sm={12}>
                                <h4 className='my-0 mb-1 fw-bold'>Appointment Details</h4>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6} className='fw-bold'>
                                        Appointment Date:
                                    </Col>
                                    <Col sm={6}>
                                        {selectedEvent?.appointmentDate}
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6} className='fw-bold'>
                                        Purpose Of Visit:
                                    </Col>
                                    <Col sm={6}>
                                        {selectedEvent?.title}
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6} className='fw-bold'>
                                        Start Time:
                                    </Col>
                                    <Col sm={6}>
                                        {selectedEvent?.slotStart}
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6} className='fw-bold'>
                                        End Time:
                                    </Col>
                                    <Col sm={6}>
                                        {selectedEvent?.slotEnd}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <hr className='my-1 text-black' />
                        <Row className='my-2'>
                            <Col sm={12} className='text-center'>
                                <Button className='custom-buttons' onClick={() => navigate(`/apps/patients/new-patient?updateid=${selectedEvent?.patientId}`)}>
                                    View Patient Profile
                                </Button>
                            </Col>
                        </Row>
                    </Row>
                </Modal.Body>
            </Modal >
        </div >
    );
};

export default AppointmentCalendar;
