import React, { useState } from 'react';

const CustomDatePicker = ({ onDateSelect }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 3, 1)); // April 2025 (months are 0-indexed)
    const [selectedDate, setSelectedDate] = useState(null);

    // Generate the calendar grid
    const generateCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        // Get the first day of the month and how many days in the month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Get days from previous month to display
        const prevMonthDays = new Date(year, month, 0).getDate();

        // Get days from next month to display
        const daysInNextMonth = 42 - (daysInMonth + firstDay); // 6 rows x 7 days

        const days = [];

        // Previous month's days
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: prevMonthDays - i,
                month: 'prev',
                date: new Date(year, month - 1, prevMonthDays - i)
            });
        }

        // Current month's days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                month: 'current',
                date: new Date(year, month, i)
            });
        }

        // Next month's days
        for (let i = 1; i <= daysInNextMonth; i++) {
            days.push({
                day: i,
                month: 'next',
                date: new Date(year, month + 1, i)
            });
        }

        return days;
    };

    const handleDateClick = (day) => {
        if (day.month !== 'current') return;
        setSelectedDate(day.date);
    };

    const handleConfirm = () => {
        if (selectedDate && onDateSelect) {
            onDateSelect(selectedDate);
        }
    };

    const days = generateCalendar();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    return (
        <div className="card shadow-sm" style={{ width: '300px' }}>
            <div className="card-header bg-white text-center">
                <h5 className="mb-0">{monthNames[currentMonth.getMonth()]}, {currentMonth.getFullYear()}</h5>
            </div>
            <div className="card-body p-2">
                <table className="table table-bordered text-center">
                    <thead>
                        <tr>
                            <th scope="col" className="text-muted" style={{ width: '14.28%' }}>Su</th>
                            <th scope="col" className="text-muted" style={{ width: '14.28%' }}>Mo</th>
                            <th scope="col" className="text-muted" style={{ width: '14.28%' }}>Tu</th>
                            <th scope="col" className="text-muted" style={{ width: '14.28%' }}>We</th>
                            <th scope="col" className="text-muted" style={{ width: '14.28%' }}>Th</th>
                            <th scope="col" className="text-muted" style={{ width: '14.28%' }}>Fr</th>
                            <th scope="col" className="text-muted" style={{ width: '14.28%' }}>Sa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(6)].map((_, row) => (
                            <tr key={row}>
                                {[...Array(7)].map((_, col) => {
                                    const index = row * 7 + col;
                                    const day = days[index];
                                    const isSelected = selectedDate &&
                                        day.date.getDate() === selectedDate.getDate() &&
                                        day.date.getMonth() === selectedDate.getMonth() &&
                                        day.date.getFullYear() === selectedDate.getFullYear();
                                    return (
                                        <td
                                            key={col}
                                            onClick={() => handleDateClick(day)}
                                            style={{
                                                cursor: day.month === 'current' ? 'pointer' : 'default',
                                                color: day.month !== 'current' ? '#aaa' : '#000',
                                                backgroundColor: isSelected ? '#007bff' : 'transparent',
                                                color: isSelected ? 'white' : (day.month !== 'current' ? '#aaa' : '#000'),
                                                borderRadius: '4px'
                                            }}
                                        >
                                            {day.day}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="card-footer bg-white text-center">
                <button
                    className="btn btn-primary"
                    onClick={handleConfirm}
                    disabled={!selectedDate}
                >
                    Confirm
                </button>
            </div>
        </div>
    );
};

export default CustomDatePicker;
