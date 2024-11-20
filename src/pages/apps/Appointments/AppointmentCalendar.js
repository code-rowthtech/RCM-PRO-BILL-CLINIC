import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { EVENTS } from '../Appointments/event';

const localizer = momentLocalizer(moment);

const AppointmentCalendar = () => {
    const navigate = useNavigate();

    // Event handlers for scheduling
    const handleEventClick = (event) => {
        alert(`Event clicked: ${event.title}`);
    };

    return (
        <div className='background_Color pt-1 pb-2'>
            <div className='container-fluid px-4'>
                <div className='d-flex justify-content-between mt-3'>
                    <p className='fw-bold mt-1'>Appointment Calendar</p>
                    <Button
                        onClick={() => navigate("/apps/appointments/list")}
                    >
                        Back
                    </Button>
                </div>
                <div className='row'>
                    <div className='col'>
                        <div className='mt-3'>
                            <Calendar
                                localizer={localizer}
                                events={EVENTS}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: 500 }}
                                onSelectEvent={handleEventClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentCalendar;
