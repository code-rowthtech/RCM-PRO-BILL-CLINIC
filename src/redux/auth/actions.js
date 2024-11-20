// @flow
import { AuthActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };

// common success
export const authApiResponseSuccess = (actionType: string, data: any): AuthAction => ({
    type: AuthActionTypes.API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});
// common error
export const authApiResponseError = (actionType: string, error: string): AuthAction => ({
    type: AuthActionTypes.API_RESPONSE_ERROR,
    payload: { actionType, error },
});

export const loginUser = (data): AuthAction => ({
    type: AuthActionTypes.LOGIN_USER,
    payload: data,
});

export const logoutUser = (): AuthAction => ({
    type: AuthActionTypes.LOGOUT_USER,
    payload: {},
});

export const signupUser = (fullname: string, email: string, password: string): AuthAction => ({
    type: AuthActionTypes.SIGNUP_USER,
    payload: { fullname, email, password },
});

export const forgotPassword = (data): AuthAction => ({
    type: AuthActionTypes.FORGOT_PASSWORD,
    payload: data,
});

export const forgotPasswordChange = (data): AuthAction => ({
    type: AuthActionTypes.FORGOT_PASSWORD_CHANGE,
    payload: data,
});

export const resetAuth = (): AuthAction => ({
    type: AuthActionTypes.RESET,
    payload: {},
});
export const verifyToken = (data): AuthAction => ({
    type: AuthActionTypes.VERIFY_TOKEN,
    payload: data,
});
export const setPassword = (data): AuthAction => ({
    type: AuthActionTypes.SET_PASSWORD,
    payload: data,
});

