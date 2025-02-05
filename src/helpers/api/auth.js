// @flow
import { APICore } from './apiCore';

const api = new APICore();

// account
function login(params: any): any {
    const baseUrl = '/api/v1/clinic/sign-in';
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
    const baseUrl = '/api/v1/clinic/forgot-password';
    return api.create(`${baseUrl}`, params);
}

function forgotPasswordConfirm(params: any): any {
    const baseUrl = '/api/v1/clinic/reset-password';
    return api.create(`${baseUrl}`, params);
}

function verifyToken(params: any): any {
    const baseUrl = '/api/v1/clinic/email-verified';
    return api.create(`${baseUrl}`, params);
}

function setPasswordApi(params: any): any {
    const baseUrl = '/api/v1/clinic/set-password';
    return api.create(`${baseUrl}`, params);
}

function confirmPasswordApi(params: any): any {
    const baseUrl = 'api/v1/clinic/change-password';
    return api.create(`${baseUrl}`, params);
}

function verifyEmailApi(params: any): any {
    const baseUrl = `api/v1/clinic/verify-password?token=${params}`;
    return api.get(`${baseUrl}`);
}

export { login, logout, signup, forgotPassword, forgotPasswordConfirm, verifyToken, setPasswordApi, confirmPasswordApi, verifyEmailApi };
