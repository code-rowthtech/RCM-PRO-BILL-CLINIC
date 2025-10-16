import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { Calendar, momentLocalizer, Views, Toolbar } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { IoMdClose } from 'react-icons/io';
import Spinner from '../../../constants/Spinner';
import AppointmentForm from './Tabs/AppointmentForm';
import {
    formatMonthYear,
    getEventStyle
} from '../../../utils/calendarUtils';
import { getAppointmentsAction } from '../../../redux/actions';
import { decryptMessage } from '../../../cryptoUtils';

const localizer = momentLocalizer(moment);
// const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
const clinicId = decryptMessage(localStorage?.getItem('subClinicLocation')) || '';

const AppointmentCalendar = ({ selectedDoctor }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const appointmentsList = store?.getAppointmentsReducer?.data?.appointments;
    const createAppointmentResponse = store?.createAppointmentReducer?.data?.status;
    const updateSuccess = store?.rescheduleAppointmentReducer?.data?.status;

    // State management
    const [events, setEvents] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [calendarView, setCalendarView] = useState('month');
    const [loading, setLoading] = useState(true);
    const [showPastDateModal, setShowPastDateModal] = useState(false);
    const [pendingSlot, setPendingSlot] = useState(null);
    const [monthYearFilter, setMonthYearFilter] = useState(() => {
        const today = new Date();
        return today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    });
    // Initial data fetch
    useEffect(() => {
        dispatch(
            getAppointmentsAction({
                clinicId: clinicId,
                status: '',
                doctorId: selectedDoctor || '',
                limit: '',
                skip: '',
                monthYear: monthYearFilter,
            })
        );
    }, [dispatch, clinicId, selectedDoctor, monthYearFilter]);

    useEffect(() => {
        if (store?.getAppointmentsReducer?.loading) {
            setLoading(true)
        } else {
            setLoading(false)
        }
    }, [store?.getAppointmentsReducer])
    // Memoized event style getter
    const memoizedEventStyle = useCallback((event) => getEventStyle(event?.status), []);

    // Custom Event Component
    const CustomEvent = useMemo(() => {
        return ({ event }) => (
            <>
                <p className="text-capitalize mb-0 ps-1" style={{ fontSize: '10px' }}>
                    {new Date(event?.slotStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} |{' '}
                    {event?.patientName}
                </p>
            </>
        );
    }, []);

    useEffect(() => {
        if (createAppointmentResponse === 201) {
            dispatch(
                getAppointmentsAction({
                    clinicId: clinicId,
                    status: '',
                    doctorId: selectedDoctor || '',
                    limit: '',
                    skip: '',
                    monthYear: monthYearFilter,
                })
            );
            setShow(false); // Closing the modal after creating appointment
        }
    }, [createAppointmentResponse]);

    useEffect(() => {
        if (updateSuccess === 200) {
            dispatch(
                getAppointmentsAction({
                    clinicId: clinicId,
                    status: '',
                    doctorId: selectedDoctor || '',
                    limit: '',
                    skip: '',
                    monthYear: monthYearFilter,
                })
            );
            setShow(false); // Closing the modal after updating the appointment
        }
    }, [updateSuccess]);

    const getUserTimeZone = () => {
        try {
            const encryptedData = localStorage.getItem('encryptedUserData');
            const storedUser = JSON.parse(decryptMessage(encryptedData));
            return storedUser?.timeZone || "UTC";
        } catch {
            return "UTC";
        }
    };

    useEffect(() => {
        if (appointmentsList?.length > 0) {
            const transformedEvents = appointmentsList
                .map((data) => {
                    const start = new Date(data.start);
                    const end = new Date(data.end);

                    if (isNaN(start) || isNaN(end)) return null;

                    return {
                        event_id: data?._id,
                        title: data?.reason?.[0]?.coding?.[0]?.display,
                        status: data?.status,
                        start: start,
                        end: end,
                        slotStart: start.toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                            timeZone: getUserTimeZone()
                        }),
                        slotEnd: end.toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                            timeZone: getUserTimeZone()
                        }),
                        // patientName: data?.subject?.name?.find((d) => d?.use === 'official')?.text,
                        patientName: ((name = data?.subject?.name?.find((d) => d?.use === 'official')) =>
                            name ? (name?.prefix?.[0] ? name?.prefix?.[0] + ' ' : '') +
                                (name?.family || '') +
                                (name?.given?.length > 0 ? ' ' + name?.given?.join(' ') : '') || 'N/A'
                                : 'N/A')(),

                    };
                })
                .filter(Boolean);

            setEvents(transformedEvents);
        }
    }, [appointmentsList]);

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
                    <button type="button" className="fs-6" onClick={goToBack}>
                        Back
                    </button>
                    <button type="button" className="fs-6" onClick={goToToday}>
                        Today
                    </button>
                    <button type="button" className="fs-6" onClick={goToNext}>
                        Next
                    </button>
                </span>

                <span className="rbc-toolbar-label">{toolbar.label}</span>

                <span className="rbc-btn-group">
                    <button
                        type="button"
                        className={toolbar.view === Views.MONTH ? 'rbc-active fs-6' : 'fs-6'}
                        onClick={() => changeView(Views.MONTH)}>
                        Month
                    </button>
                    <button
                        type="button"
                        className={toolbar.view === Views.WEEK ? 'rbc-active fs-6' : 'fs-6'}
                        onClick={() => changeView(Views.WEEK)}>
                        Week
                    </button>
                    <button
                        type="button"
                        className={toolbar.view === Views.DAY ? 'rbc-active fs-6' : 'fs-6'}
                        onClick={() => changeView(Views.DAY)}>
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

    const handleSlotSelect = useCallback((slotInfo) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const slotDate = new Date(slotInfo.start);
        slotDate.setHours(0, 0, 0, 0);

        if (slotDate < today) {
            setPendingSlot(slotInfo);
            setShowPastDateModal(true);
        } else {
            setSelectedSlot(slotInfo);
            setShow(true);
        }
    }, []);

    const handleViewChange = useCallback((view) => {
        setCalendarView(view);
    }, []);

    const dayPropGetter = useCallback((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentDate = new Date(date);
        currentDate.setHours(0, 0, 0, 0);

        const currentMonth = new Date();
        const filterDate = new Date(monthYearFilter + ' 1');

        if (currentDate < today && currentDate.getMonth() === filterDate.getMonth() && currentDate.getFullYear() === filterDate.getFullYear()) {
            return {
                style: {
                    backgroundColor: '#e6e6e67b',
                }
            };
        }
        return {};
    }, [monthYearFilter]);

    return (
        <div className="background_Color">
            <div className="container-fluid px-2 mx-0">
                <div className="row">
                    <div className="col px-0 mx-0">
                        <div className="mt-2">
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: '82vh' }}
                                selectable
                                onSelectEvent={handleEventClick}
                                onSelectSlot={handleSlotSelect}
                                components={{
                                    event: CustomEvent,
                                    toolbar: CustomToolbar,
                                }}
                                eventPropGetter={memoizedEventStyle}
                                dayPropGetter={dayPropGetter}
                                onView={handleViewChange}
                                view={calendarView}
                            />
                            {loading && (
                                <div className="loading-overlay">
                                    <Spinner />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Modal centered show={show} size="xl" onHide={closeModal}>
                <Modal.Body>
                    <Row className="border-bottom mb-1 ">
                        <Col sm={11} className="text-start">
                            <h5>{selectedEvent ? 'Appointment Details' : 'Create Appointment'}</h5>
                        </Col>
                        <Col sm={1} className='text-end'>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} />
                        </Col>
                    </Row>
                    <AppointmentForm
                        selectedSlot={selectedSlot}
                        appointmentId={selectedEvent?.event_id}
                        calendarView={calendarView}
                    />
                </Modal.Body>
            </Modal>
            <Modal show={showPastDateModal} onHide={() => setShowPastDateModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Past Date Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You are scheduling an appointment for a past date. Do you want to continue?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='cancel-button' onClick={() => setShowPastDateModal(false)}>
                        Cancel
                    </Button>
                    <Button className="custom-buttons" onClick={() => {
                        setSelectedSlot(pendingSlot);
                        setShow(true);
                        setShowPastDateModal(false);
                    }}>
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default React.memo(AppointmentCalendar);