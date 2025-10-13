// src/utils/pipes.js

import { decryptMessage } from "../cryptoUtils";

// Get user timezone from localStorage safely
const getUserTimeZone = () => {
    try {
        const encryptedData = localStorage.getItem('encryptedUserData');
        const storedUser = JSON.parse(decryptMessage(encryptedData));
        return storedUser?.timeZone || "UTC";
    } catch {
        return "UTC";
    }
};

// Format any date string or Date object to user's timezone
export const formatDateByUserTimeZone = (date, options = {}) => {
    if (!date) return "";

    const tz = getUserTimeZone();
    const d = new Date(date);

    // Default formatting options
    const defaultOptions = {
        timeZone: tz,
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        ...options
    };

    return d.toLocaleString("en-US", defaultOptions);
};

// Optional: Make it globally accessible (so no import needed)
window.formatDateByUserTimeZone = formatDateByUserTimeZone;
