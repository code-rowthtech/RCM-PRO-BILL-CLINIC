import { decryptMessage } from "../../cryptoUtils";

let decryptedUser = null;

const encryptedData = localStorage.getItem('encryptedUserData');

if (encryptedData) {
    try {
        decryptedUser = JSON.parse(decryptMessage(encryptedData));
    } catch (err) {
        console.error("Failed to decrypt user data:", err);
        // Optionally: redirect to login or handle auth cleanup
    }
} else {
    console.warn("No encrypted user data found in localStorage.");
    // Optionally: redirect to login or show unauthorized message
}
const clinicId = localStorage?.getItem('subClinicLocation') ? decryptMessage(localStorage?.getItem('subClinicLocation')) : '';

// export const loggedInUser = decryptedUser;
export const loggedInUser = clinicId;
