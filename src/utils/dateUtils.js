// Date utility functions
const DateUtils = {
    // Validate date string
    validateDate(dateString) {
        if (!dateString) return false;
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    },

    // Get start of day
    getStartOfDay(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    },

    // Get end of day
    getEndOfDay(date) {
        const d = new Date(date);
        d.setHours(23, 59, 59, 999);
        return d;
    },

    // Format date to YYYY-MM-DD
    formatDate(date) {
        if (!this.validateDate(date)) return '';
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },

    // Get days between two dates
    getDaysBetween(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    },

    // Calculate daily appointments
    calculateDailyAppointments({ daysNumber, startDate, endDate }) {
        if (!daysNumber || daysNumber < 1) return [];
        if (!this.validateDate(startDate) || !this.validateDate(endDate)) return [];

        const dates = [];
        const maxIterations = 365 * 5; // 5 years max
        let currentDate = this.getStartOfDay(startDate);
        const endOfDay = this.getEndOfDay(endDate);
        let iterationCount = 0;

        while (currentDate <= endOfDay && iterationCount < maxIterations) {
            dates.push(this.formatDate(currentDate));
            currentDate = new Date(currentDate);
            currentDate.setDate(currentDate.getDate() + daysNumber);
            iterationCount++;
        }

        return dates;
    },

    // Calculate weekly appointments
    calculateWeeklyAppointments({ selectedDays, weekInterval, startDate, endDate }) {
        if (!weekInterval || weekInterval < 1) return [];
        if (!this.validateDate(startDate) || !this.validateDate(endDate)) return [];
        if (!selectedDays || selectedDays.length === 0) return [];

        const dates = [];
        const maxIterations = 365 * 5; // 5 years max
        let currentDate = this.getStartOfDay(startDate);
        const endOfDay = this.getEndOfDay(endDate);
        let iterationCount = 0;

        while (currentDate <= endOfDay && iterationCount < maxIterations) {
            selectedDays.forEach(dayIndex => {
                if (dayIndex < 0 || dayIndex > 6) return;

                const appointmentDate = new Date(currentDate);
                const daysToAdd = (dayIndex - currentDate.getDay() + 7) % 7;
                appointmentDate.setDate(currentDate.getDate() + daysToAdd);

                if (appointmentDate <= endOfDay) {
                    dates.push(this.formatDate(appointmentDate));
                }
            });

            currentDate = new Date(currentDate);
            currentDate.setDate(currentDate.getDate() + (7 * weekInterval));
            iterationCount++;
        }

        return dates;
    },

    // Calculate monthly appointments
    calculateMonthlyAppointments({ dayOfMonth, nthWeekOfMonth, dayOfWeek, monthInterval, startDate, endDate }) {
        if (!monthInterval || monthInterval < 1) return [];
        if (!this.validateDate(startDate) || !this.validateDate(endDate)) return [];
        if (dayOfMonth && (dayOfMonth < 1 || dayOfMonth > 31)) return [];
        if (nthWeekOfMonth && (nthWeekOfMonth < 1 || nthWeekOfMonth > 5)) return [];
        if (dayOfWeek && (dayOfWeek < 0 || dayOfWeek > 6)) return [];

        const dates = [];
        const maxIterations = 365 * 5; // 5 years max
        let currentDate = this.getStartOfDay(startDate);
        const endOfDay = this.getEndOfDay(endDate);
        let iterationCount = 0;

        while (currentDate <= endOfDay && iterationCount < maxIterations) {
            let appointmentDate = null;
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

            if (dayOfMonth) {
                appointmentDate = new Date(currentDate);
                appointmentDate.setDate(dayOfMonth);
            } else if (nthWeekOfMonth && dayOfWeek) {
                const firstDayOfWeek = firstDayOfMonth.getDay();
                const daysOffset = (dayOfWeek - firstDayOfWeek + 7) % 7;
                const weekNumber = nthWeekOfMonth;
                
                appointmentDate = new Date(firstDayOfMonth);
                appointmentDate.setDate(1 + daysOffset + ((weekNumber - 1) * 7));
            }

            if (appointmentDate && appointmentDate <= endOfDay) {
                dates.push(this.formatDate(appointmentDate));
            }

            currentDate = new Date(currentDate);
            currentDate.setMonth(currentDate.getMonth() + monthInterval);
            iterationCount++;
        }

        return dates;
    }
};

export default DateUtils;
