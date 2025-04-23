import React, { useState, useEffect } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { Calendar, momentLocalizer, Views, Toolbar } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAppointmentsAction } from '../../../redux/appointments/action';
import { useDispatch, useSelector } from 'react-redux';
import { IoMdClose } from 'react-icons/io';
import Spinner from '../../../constants/Spinner'; // Assuming Spinner is a loading component
import AppointmentForm from './Tabs/AppointmentForm';
import ToastHandle from '../../../helpers/ToastMessage';

const localizer = momentLocalizer(moment);
const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

const AppointmentCalendar = ({ selectedDoctor }) => {
    const dispatch = useDispatch();
    const [events, setEvents] = useState([]);
    const store = useSelector((state) => state);
    const appointmentsList = store?.getAppointmentsReducer?.data?.appointments;
    const [monthYearFilter, setMonthYearFilter] = useState(() => {
        const today = new Date();
        return today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    });
    const [show, setShow] = useState(false); // This will manage modal visibility
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [calendarView, setCalendarView] = useState('month');
    const [loading, setLoading] = useState(true); // loading state to track calendar data fetching
    const createAppointmentResponse = store?.createAppointmentReducer?.data?.status;
    const updateSuccess = store?.rescheduleAppointmentReducer?.data?.status;
    const [appModal, setAppModal] = useState(false)
    const closeAppModal = () => {
        setShow(false);
        setSelectedEvent(null);
    }
    useEffect(() => {
        setLoading(true); // Set loading to true when data fetching begins
        dispatch(getAppointmentsAction({ clinicId: clinicId, status: '', doctorId: selectedDoctor || '', limit: '', skip: '', monthYear: monthYearFilter }));
    }, [dispatch, selectedDoctor, monthYearFilter]);

    useEffect(() => {
        if (createAppointmentResponse === 201) {
            dispatch(getAppointmentsAction({ clinicId: clinicId, status: '', doctorId: selectedDoctor || '', limit: '', skip: '', monthYear: monthYearFilter }));
            setShow(false); // Closing the modal after creating appointment
        }
    }, [createAppointmentResponse]);

    useEffect(() => {
        if (updateSuccess === 200) {
            dispatch(getAppointmentsAction({ clinicId: clinicId, status: '', doctorId: selectedDoctor || '', limit: '', skip: '', monthYear: monthYearFilter }));
            setShow(false); // Closing the modal after updating the appointment
        }
    }, [updateSuccess]);

    useEffect(() => {
        if (appointmentsList?.length > 0) {
            const transformedEvents = appointmentsList.map((data) => {
                const start = new Date(data.start);
                const end = new Date(data.end);

                if (isNaN(start) || isNaN(end)) return null;

                return {
                    event_id: data?._id,
                    title: data?.reason?.[0]?.coding?.[0]?.display,
                    status: data?.status,
                    start: start,
                    end: end,
                    slotStart: data?.start,
                    slotEnd: data?.end,
                    patientName: data?.subject?.name?.find((data) => data?.use === 'official')?.text,
                };
            }).filter(Boolean);

            setEvents(transformedEvents);
            setLoading(false); // Set loading to false once the data has been processed
        }
    }, [appointmentsList]);

    const CustomEvent = ({ event }) => (
        <div>
            <p className="text-capitalize mb-0">{event.patientName} {`(${event?.status})`}</p>
            <p className="mb-0">{event.title}</p>
        </div>
    );

    const handleEventClick = (event) => {
        setShow(true); // Open modal for event details
        setSelectedEvent(event);
    };

    const closeModal = () => {
        setShow(false);
        setSelectedEvent(null);
    };

    const CustomToolbar = (toolbar) => {
        const goToBack = () => {
            const prevMonth = new Date(toolbar?.date);
            prevMonth.setMonth(prevMonth.getMonth() - 1);
            formatMonthYear(prevMonth);
            toolbar.onNavigate('PREV');
        };

        const goToNext = () => {
            const nextMonth = new Date(toolbar?.date);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            formatMonthYear(nextMonth);
            toolbar.onNavigate('NEXT');
        };

        const goToToday = () => {
            const today = new Date();
            formatMonthYear(today);
            toolbar.onNavigate('TODAY');
        };

        const changeView = (view) => {
            toolbar.onView(view);
        };

        return (
            <div className="rbc-toolbar">
                <span className="rbc-btn-group">
                    <button type="button" onClick={goToBack}>Back</button>
                    <button type="button" onClick={goToToday}>Today</button>
                    <button type="button" onClick={goToNext}>Next</button>
                </span>

                <span className="rbc-toolbar-label">{toolbar.label}</span>

                <span className="rbc-btn-group">
                    <button
                        type="button"
                        className={toolbar.view === Views.MONTH ? 'rbc-active' : ''}
                        onClick={() => changeView(Views.MONTH)}
                    >
                        Month
                    </button>
                    <button
                        type="button"
                        className={toolbar.view === Views.WEEK ? 'rbc-active' : ''}
                        onClick={() => changeView(Views.WEEK)}
                    >
                        Week
                    </button>
                    <button
                        type="button"
                        className={toolbar.view === Views.DAY ? 'rbc-active' : ''}
                        onClick={() => changeView(Views.DAY)}
                    >
                        Day
                    </button>
                </span>
            </div>
        );
    };

    const formatMonthYear = (dateString) => {
        const date = new Date(dateString);
        const options = { month: 'long', year: 'numeric' };
        setMonthYearFilter(date.toLocaleDateString('en-US', options));
    };

    return (
        <div className='background_Color pt-1 pb-2'>
            <div className='container-fluid px-4'>
                <div className='row'>
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
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0); // set today's time to 00:00:00

                                    const slotDate = new Date(slotInfo.start);
                                    slotDate.setHours(0, 0, 0, 0); // set slot time to 00:00:00

                                    if (slotDate < today) {
                                        ToastHandle('Appointments cannot be created for past dates', 'danger');
                                    } else {
                                        setSelectedSlot(slotInfo);
                                        setShow(true);
                                    }
                                }}
                                components={{
                                    event: CustomEvent,
                                    toolbar: CustomToolbar,
                                }}
                                onView={(view) => setCalendarView(view)}
                                view={calendarView}
                            />
                            {/* Add the loader inside the calendar when loading */}
                            {store?.getAppointmentsReducer?.loading && (
                                <div className="loading-overlay">
                                    <Spinner />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* <Modal centered show={appModal} size='xl' onHide={closeAppModal}>
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
            </Modal> */}
            <Modal centered show={show} size='xl' onHide={closeAppModal}>
                <Modal.Body>
                    <Row className="border-bottom mb-1 pb-2">
                        <Col sm={11} className='text-center'>
                            <h4>{selectedEvent ? "Appointment Details" : "Create New Appointment"}</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeAppModal} />
                        </Col>
                    </Row>

                    <AppointmentForm selectedSlot={selectedSlot} appointmentId={selectedEvent?.event_id} calendarView={calendarView} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AppointmentCalendar;
