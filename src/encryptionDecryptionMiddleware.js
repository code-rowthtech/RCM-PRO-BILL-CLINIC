import axios from "axios";
import NodeRSA from "node-rsa";

const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY?.replace(/\\n/g, "\n").trim();
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();

if (!PUBLIC_KEY || !PRIVATE_KEY) {
    throw new Error("Missing REACT_APP_PUBLIC_KEY or REACT_APP_PRIVATE_KEY in environment variables");
}

/**
 * Encrypts data using RSA encryption.
 * @param {Object} data - The data to encrypt.
 * @returns {string} The encrypted data as a base64 string.
 */
const encryptData = (data) => {
    try {
        const cipher = new NodeRSA(PUBLIC_KEY, "pkcs1-public");
        const stringifiedData = JSON.stringify(data);
        return cipher.encrypt(stringifiedData, "base64");
    } catch (error) {
        console.error("Error encrypting data:", error.message);
        throw error;
    }
};

/**
 * Decrypts RSA-encrypted data.
 * @param {string} encryptedData - The encrypted data as a base64 string.
 * @returns {Object} The decrypted data as a JavaScript object.
 */
const decryptData = (encryptedData) => {
    try {
        const decipher = new NodeRSA(PRIVATE_KEY, "pkcs1");
        const decryptedString = decipher.decrypt(encryptedData, "utf8");
        return JSON.parse(decryptedString);
    } catch (error) {
        console.error("Error decrypting data:", error.message);
        throw error;
    }
};

/**
 * Creates a preconfigured Axios instance with encryption and decryption interceptors.
 * @param {string} baseURL - The base URL for API requests.
 * @returns {AxiosInstance} A configured Axios instance.
 */
const createApiClient = (baseURL) => {
    const apiClient = axios.create({
        baseURL,
        headers: { "Content-Type": "application/json" },
    });

    // Request Interceptor: Encrypt data before sending
    apiClient.interceptors.request.use(
        (config) => {
            if (config.data) {
                config.data = { data: encryptData(config.data) };
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response Interceptor: Decrypt data after receiving
    apiClient.interceptors.response.use(
        (response) => {
            if (response.data && response.data.data) {
                response.data = decryptData(response.data.data);
            }
            return response;
        },
        (error) => {
            try {
                if (error.response && error.response.data && error.response.data.data) {
                    error.data = decryptData(error.response.data.data);
                }
            } catch (decryptError) {
                console.error("Error decrypting error response:", decryptError.message);
            }
            return Promise.reject(error);
        }
    );

    return apiClient;
};

export { encryptData, decryptData, createApiClient };
