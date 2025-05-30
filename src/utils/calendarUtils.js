import { debounce } from 'lodash';
import moment from 'moment';
import { getAppointmentsAction } from '../redux/actions';

// Constants for status colors
export const STATUS_COLORS = {
    pending: '#f1c40f',         // Yellow
    proposed: '#3498db',        // Blue
    booked: '#2ecc71',          // Light Green
    arrived: '#27ae60',         // Green
    fulfilled: '#9b59b6',       // Purple
    cancelled: '#e74c3c',       // Red
    noshow: '#e67e22',          // Orange
    enteredinerror: '#95a5a6',  // Gray
    checkedin: '#1abc9c',       // Teal
    waitlist: '#8e44ad',        // Dark Purple
};

// Transform appointment data to calendar events
export const transformAppointments = (appointments = []) => {
    return appointments
        .map(data => {
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
        })
        .filter(Boolean);
};

// Format month and year
export const formatMonthYear = (date) => {
    const options = { month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};

// Debounced function for filter changes
export const debouncedFetchAppointments = debounce((dispatch, clinicId, filters) => {
    dispatch(
        getAppointmentsAction({
            clinicId,
            ...filters
        })
    );
}, 300);

// Validate date range
export const validateDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
};

// Get event style based on status
export const getEventStyle = (status) => {
    const bgColor = STATUS_COLORS[status?.toLowerCase()] || '#ccc';
    return {
        style: {
            backgroundColor: bgColor,
            color: 'white',
            borderRadius: '0px',
            padding: '2px 4px',
        },
    };
};
