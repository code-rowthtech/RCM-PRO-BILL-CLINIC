import { decryptMessage } from "../../cryptoUtils";

export const loggedInUser = JSON.parse(decryptMessage(localStorage.getItem('encryptedUserData')))