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

/**
 * Format a date or time based on user's timezone.
 * 
 * @param {string|Date} date - The date or timestamp to format
 * @param {Object} options - Optional Intl.DateTimeFormat options
 * @param {'datetime'|'date'|'time'} displayMode - What to display (default: 'datetime')
 * @returns {string} Formatted date/time string
 */
export const formatDateByUserTimeZone = (date, options = {}, displayMode = 'datetime') => {
    if (!date) return "";

    const tz = getUserTimeZone();
    const d = new Date(date);

    let modeOptions = {};

    switch (displayMode) {
        case 'date':
            modeOptions = {
                timeZone: tz,
                year: "numeric",
                month: "short",
                day: "2-digit",
            };
            break;
        case 'time':
            modeOptions = {
                timeZone: tz,
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            };
            break;
        case 'datetime':
        default:
            modeOptions = {
                timeZone: tz,
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            };
    }

    const formatOptions = { ...modeOptions, ...options };
    return d.toLocaleString("en-US", formatOptions);
};

// Optional: Make it globally accessible (so no import needed)
window.formatDateByUserTimeZone = formatDateByUserTimeZone;
