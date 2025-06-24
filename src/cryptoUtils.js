import nodeRSA from "node-rsa";

// Define the public and private keys

const privateKey = process?.env?.REACT_APP_PRIVATE_KEY;
const pubKey = process?.env?.REACT_APP_PUBLIC_KEY;

// Function to encrypt a message
export function encryptMessage(text) {
    const cipher = new nodeRSA({ b: 512 });
    cipher.importKey(pubKey, "pkcs1-public");
    const encrypted = cipher.encrypt(text, "base64");
    return encrypted;
}

// Function to decrypt a message
export function decryptMessage(encryptedText) {

    const decipher = new nodeRSA(privateKey, "pkcs1");
    const decrypted = decipher.decrypt(encryptedText, "utf8");
    return decrypted;
}
