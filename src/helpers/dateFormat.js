import React from 'react'


export function formatDate(dateString) {
    const date = new Date(dateString);

    // Define options for custom formatting
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };

    // Format time and date separately
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);

    // Customize day suffix (st, nd, rd, th)
    const day = date.getDate();
    const suffix = ["th", "st", "nd", "rd"][(day % 10 > 3 || Math.floor(day % 100 / 10) === 1) ? 0 : day % 10];

    // Extract month from formatted date and construct the final string
    const month = formattedDate.split(' ')[1];

    return `${formattedTime} ${day}${suffix} ${month} ${date.getFullYear()}`;
}
