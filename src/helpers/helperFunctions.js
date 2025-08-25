export const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    if (isNaN(birthDate.getTime())) {
        return '0.0';
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    // Adjust if the current month/day is before the birth month/day
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
        years--;
        months += 12; // Add 12 months to the negative month difference
    }

    // Adjust the month difference for the day of the month
    if (today.getDate() < birthDate.getDate()) {
        months--;
    }

    // Ensure months is non-negative after adjustment
    if (months < 0) {
        months += 12;
    }

    return `${String(years).padStart(2, '0')}.${String(months).padStart(2, '0')}`;
};