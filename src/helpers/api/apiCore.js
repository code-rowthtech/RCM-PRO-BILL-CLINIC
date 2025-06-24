import jwtDecode from 'jwt-decode';
import axios from 'axios';

// import config from '../../config';
import { decryptMessage, encryptMessage } from '../../cryptoUtils';

// content type
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = process?.env?.REACT_APP_API_URL;
axios.interceptors.response.use(
    (response) => {
        return response; // Directly return the response if successful
    },
    (error) => {
        // Decrypt and log the error message
        const decryptedData = error?.response?.data?.data
            ? JSON.parse(decryptMessage(error.response.data.data))
            : null;
        console.error('API Core Error:', decryptedData);

        // Default error message
        let message = 'An error occurred. Please try again later.';

        // Check for specific status codes
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    message = decryptedData?.message || 'Invalid credentials';
                    break;
                case 403:
                    message = decryptedData?.message || 'Access Forbidden';
                    break;
                case 404:
                    message = decryptedData?.message || 'Sorry! The data you are looking for could not be found';
                    break;
                default:
                    message = decryptedData?.message || error.message || 'Unexpected error occurred.';
            }
        }

        // Reject the promise with the specific message
        return Promise.reject(message);
    }
);

const AUTH_SESSION_KEY = 'hyper_user';

/**
 * Sets the default authorization
 * @param {*} token
//  */
// const setAuthorization = (token) => {
//     if (token) axios.defaults.headers.common['Authorization'] = `${encryptMessage(token)}`;
//     else delete axios.defaults.headers.common['Authorization'];
// };

const setAuthorization = (token) => {
    const userData = JSON.parse(sessionStorage.getItem(AUTH_SESSION_KEY));

    if (userData?._id) {
        axios.defaults.headers.common['x-user-id'] = `${encryptMessage(userData._id)}`; // Set new value for 'XUIXX'
    }
    if (token) {
        axios.defaults.headers.common['Authorization'] = `${encryptMessage(token)}`;
    } else {
        delete axios.defaults.headers.common['Authorization']; // Remove the header if token is null/undefined
    }
};


const getUserFromSession = () => {
    const user = sessionStorage.getItem(AUTH_SESSION_KEY);

    return user ? (typeof user == 'object' ? user : JSON.parse(user)) : null;

};
class APICore {
    /**
     * Fetches data from given url
     */
    get = (url, params) => {
        let response;
        if (params) {
            var queryString = params
                ? Object.keys(params)
                    .map((key) => key + '=' + params[key])
                    .join('&')
                : '';
            response = axios.get(`${url}?${queryString}`, params);
        } else {
            response = axios.get(`${url}`, params);
        }
        return response;
    };

    getFile = (url, params) => {
        let response;
        if (params) {
            var queryString = params
                ? Object.keys(params)
                    .map((key) => key + '=' + params[key])
                    .join('&')
                : '';
            response = axios.get(`${url}?${queryString}`, { responseType: 'blob' });
        } else {
            response = axios.get(`${url}`, { responseType: 'blob' });
        }
        return response;
    };

    getMultiple = (urls, params) => {
        const reqs = [];
        let queryString = '';
        if (params) {
            queryString = params
                ? Object.keys(params)
                    .map((key) => key + '=' + params[key])
                    .join('&')
                : '';
        }

        for (const url of urls) {
            reqs.push(axios.get(`${url}?${queryString}`));
        }
        return axios.all(reqs);
    };

    /**
     * post given data to url
     */
    create = (url, data) => {
        return axios.post(url, data);
    };

    /**
     * Updates patch data
     */
    updatePatch = (url, data) => {
        return axios.patch(url, data);
    };

    /**
     * Updates data
     */
    update = (url, data) => {
        return axios.put(url, data);
    };

    /**
     * Deletes data
     */
    delete = (url) => {
        return axios.delete(url);
    };

    /**
     * post given data to url with file
     */
    createWithFile = (url, data) => {
        const formData = new FormData();
        for (const k in data) {
            formData.append(k, data[k]);
        }

        const config = {
            headers: {
                ...axios.defaults.headers,
                'content-type': 'multipart/form-data',
            },
        };
        return axios.post(url, formData, config);
    };

    /**
     * post given data to url with file
     */
    updateWithFile = (url, data) => {
        const formData = new FormData();
        for (const k in data) {
            formData.append(k, data[k]);
        }

        const config = {
            headers: {
                ...axios.defaults.headers,
                'content-type': 'multipart/form-data',
            },
        };
        return axios.patch(url, formData, config);
    };

    isUserAuthenticated = () => {
        const user = this.getLoggedInUser();
        if (!user || (user && !user.token)) {
            return false;
        }
        const decoded = jwtDecode(user.token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            console.warn('access token expired');
            return false;
        } else {
            return true;
        }

    };


    setLoggedInUser = (session) => {
        if (session) sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
        else {
            sessionStorage.removeItem(AUTH_SESSION_KEY);
        }
    };

    /**
     * Returns the logged in user
     */
    getLoggedInUser = () => {
        return getUserFromSession();
    };

    setUserInSession = (modifiedUser) => {
        let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
        if (userInfo) {
            const { token, user } = JSON.parse(userInfo);
            this.setLoggedInUser({ token, ...user, ...modifiedUser });
        }
    };
}

/*
Check if token available in session
*/
let user = getUserFromSession();
if (user) {
    const { token } = user;
    if (token) {
        setAuthorization(token);
    }
}

export { APICore, setAuthorization };