// import React from 'react'


// export function formatDate(dateString) {
//     const date = new Date(dateString);
//     const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
//     const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };

//     const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
//     const formattedDate = date.toLocaleDateString('en-US', dateOptions);

//     const day = date.getDate();
//     const suffix = ["th", "st", "nd", "rd"][(day % 10 > 3 || Math.floor(day % 100 / 10) === 1) ? 0 : day % 10];

//     const month = formattedDate.split(' ')[1];

//     return `${formattedTime} ${day}${suffix} ${month} ${date.getFullYear()}`;

// }

export function formatDate(dateString) {
  const date = new Date(dateString);

  // Extract the day, month, and year from the Date object
  const day = String(date.getDate()).padStart(2, '0'); // Pad single digits with leading zero
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based index, so add 1)
  const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year

  return `${month}/${day}/${year}`; // Return formatted date as DD/MM/YY
}
