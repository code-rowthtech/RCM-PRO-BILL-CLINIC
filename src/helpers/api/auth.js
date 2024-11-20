// @flow
import { APICore } from './apiCore';

const api = new APICore();

// account
function login(params: any): any {
    const baseUrl = '/api/v1/clinic/signIn';
    return api.create(`${baseUrl}`, params);
}

function logout(): any {
    const baseUrl = '/logout/';
    return api.create(`${baseUrl}`, {});
}

function signup(params: any): any {
    const baseUrl = '/register/';
    return api.create(`${baseUrl}`, params);
}

function forgotPassword(params: any): any {
    const baseUrl = '/api/v1/clinic/forgotPassword';
    return api.create(`${baseUrl}`, params);
}

function forgotPasswordConfirm(params: any): any {
    const baseUrl = '/api/v1/clinic/resetPassword';
    return api.create(`${baseUrl}`, params);
}

function verifyToken(params: any): any {
    const baseUrl = '/api/v1/clinic/emailVerified';
    return api.create(`${baseUrl}`, params);
}

function setPasswordApi(params: any): any {
    const baseUrl = '/api/v1/clinic/setPassword';
    return api.create(`${baseUrl}`, params);
}
export { login, logout, signup, forgotPassword, forgotPasswordConfirm, verifyToken, setPasswordApi };
