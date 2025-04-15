import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { EVENTS } from './event'
import { getAppointmentsAction } from '../../../redux/appointments/action';
import { useDispatch, useSelector } from 'react-redux';
import { IoMdClose } from 'react-icons/io';
import Spinner from '../../../constants/Spinner';
import AppointmentForm from './Tabs/AppointmentForm';

const localizer = momentLocalizer(moment);
const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

const AppointmentCalendar = ({ selectedDoctor }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [events, setEvents] = useState([]);
    const store = useSelector((state) => state);
    const appointmentsList = store?.getAppointmentsReducer?.data?.appointments;
    const [show, setShow] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [selectedSlot, setSelectedSlot] = useState(null);

    const createAppointmentResponse = store?.createAppointmentReducer?.data?.status;
    const updateSuccess = store?.rescheduleAppointmentReducer?.data?.status;
    useEffect(() => {
        dispatch(getAppointmentsAction({ clinicId: clinicId, status: '', doctorId: selectedDoctor || '' }));
    }, [dispatch, selectedDoctor])
    useEffect(() => {
        if (createAppointmentResponse === 201) {
            dispatch(getAppointmentsAction({ clinicId: clinicId, status: '', doctorId: selectedDoctor || '' }));
            setAppModal(false)
        }
    }, [createAppointmentResponse]);
    useEffect(() => {
        if (updateSuccess === 200) {
            dispatch(getAppointmentsAction({ clinicId: clinicId, status: '', doctorId: selectedDoctor || '' }));
            setShow(false)
        }
    }, [updateSuccess]);

    const CustomEvent = ({ event }) => {
        return (
            <div>
                <p className="text-capitalize mb-0">{event.patientName} {`(${event?.status})`}</p>
                <p className="mb-0">{event.title}</p>
            </div>
        );
    };

    useEffect(() => {
        if (appointmentsList?.length > 0) {
            const transformedEvents = appointmentsList.map((data) => {
                try {
                    const start = new Date(data.start);
                    const end = new Date(data.end);

                    if (isNaN(start) || isNaN(end)) {
                        console.error("Invalid start or end date", start, end);
                        return null;
                    }

                    return {
                        event_id: data?._id,
                        title: data?.reason?.[0]?.coding?.[0]?.display,
                        status: data?.status,
                        appointmentDate: new Date(data?.date).toLocaleDateString('en-GB'),
                        start: start,
                        end: end,
                        slotStart: data?.start,
                        slotEnd: data?.end,
                        doctorName: data?.doctorId?.name?.[0]?.text,
                        patientName: data?.subject?.name?.find((data) => data?.use === 'official')?.text,
                        patientContact: data?.subject?.telecom?.[0]?.value,
                        appointmentDescription: data?.appointmentType?.text,
                        patientEmail: data?.subject?.telecom?.find((data) => data?.system === 'email' && data?.value)?.value,
                        patientId: data?.subject?._id,
                    };
                } catch (error) {
                    console.error("Error processing appointment:", data, error);
                    return null;
                }
            }).filter(Boolean);

            setEvents(transformedEvents);
        }
    }, [appointmentsList]);

    const handleEventClick = (event) => {
        setShow(true);
        setSelectedEvent(event);
    };
    const closeModal = () => {
        setShow(false);
        setSelectedEvent(null);
    }
    const [appModal, setAppModal] = useState(false)
    const closeAppModal = () => {
        setAppModal(false);
        setSelectedEvent(null);
    }
    return (
        <div className='background_Color pt-1 pb-2'>
            <div className='container-fluid px-4'>
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
                                    style={{ height: '68vh' }}
                                    selectable
                                    onSelectEvent={handleEventClick}
                                    onSelectSlot={(slotInfo) => {
                                        setSelectedSlot(slotInfo);
                                        setAppModal(true);
                                    }}
                                    components={{
                                        event: CustomEvent,
                                    }}
                                />

                            </div>
                        </div>
                    }

                </div>
            </div>
            <Modal centered show={appModal} size='lg' onHide={closeAppModal}>
                <Modal.Body>
                    <Row className="border-bottom mb-1 pb-2">
                        <Col sm={11} className='text-center'>
                            <h4>{selectedEvent ? "Appointment Details" : "Create New Appointment"}</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeAppModal} />
                        </Col>
                    </Row>

                    {selectedEvent ? (
                        <Row>
                        </Row>
                    ) : selectedSlot ? (
                        <AppointmentForm selectedSlot={selectedSlot} />
                    ) : null}
                </Modal.Body>
            </Modal>
            <Modal centered show={show} size='lg' onHide={closeModal}>
                <Modal.Body>
                    <Row className="border-bottom mb-1 pb-2">
                        <Col sm={11} className='text-center'>
                            <h4>{selectedEvent ? "Appointment Details" : "Create New Appointment"}</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeAppModal} />
                        </Col>
                    </Row>

                    <AppointmentForm appointmentId={selectedEvent?.event_id} />
                </Modal.Body>
            </Modal>

            {/* <Modal centered show={show} size='lg' onHide={closeModal}>
                <Modal.Body>
                    <Row className="border-bottom mb-1 pb-2">
                        <Col sm={11} className='text-center'><h4>Appointment Details</h4></Col>
                        <Col sm={1}><IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} /></Col>
                    </Row>
                    <Row>
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
            </Modal > */}
        </div >
    );
};

export default AppointmentCalendar;
