export function formatDate(dateString) {
  const date = new Date(dateString);

  // Extract the day, month, and year from the Date object
  const day = String(date.getDate()).padStart(2, '0'); // Pad single digits with leading zero
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based index, so add 1)
  const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year

  return `${month}/${day}/${year}`; // Return formatted date as DD/MM/YY
}
