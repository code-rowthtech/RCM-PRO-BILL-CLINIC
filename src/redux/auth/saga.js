// @flow
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';

import {
    login as loginApi,
    logout as logoutApi,
    signup as signupApi,
    forgotPassword as forgotPasswordApi,
    forgotPasswordConfirm, verifyToken
} from '../../helpers/';

import { APICore, setAuthorization } from '../../helpers/api/apiCore';
import { authApiResponseSuccess, authApiResponseError } from './actions';
import { AuthActionTypes } from './constants';
import { decryptMessage, encryptMessage } from '../../cryptoUtils';
import {  confirmPasswordApi, setPasswordApi } from '../../helpers/api/auth';
import ToastHandle from '../../helpers/ToastMessage';
const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
function* login({ payload }) {
    try {
        const encryptedPayload = {
            key: encryptMessage(payload)
        }
        const response = yield call(loginApi, encryptedPayload);

        const user = JSON.parse(decryptMessage(response?.data?.data));
        console.log(user,'"6746c249525680b5e3733e0a"')
        const userData = {
            name: user?.name,
            email: user?.email,
            token: user?.accessToken,
            role: user?.role,
            _id: user?.userId,
            clinicId: user?.clinicId
        }

        // NOTE - You can change this according to response format from your api
        api.setLoggedInUser(userData);
        // setAuthorization(user['token']);
        setAuthorization(userData?.token); // Corrected to use userData.token

        yield put(authApiResponseSuccess(AuthActionTypes.LOGIN_USER, userData));
    } catch (error) {
        yield put(authApiResponseError(AuthActionTypes.LOGIN_USER, error));
        api.setLoggedInUser(null);
        setAuthorization(null);
    }
}

/**
 * Logout the user
 */
function* logout() {
    try {
        yield call(logoutApi);
        api.setLoggedInUser(null);
        setAuthorization(null);
        yield put(authApiResponseSuccess(AuthActionTypes.LOGOUT_USER, {}));
    } catch (error) {
        yield put(authApiResponseError(AuthActionTypes.LOGOUT_USER, error));
    }
}

function* signup({ payload: { fullname, email, password } }) {
    try {
        const response = yield call(signupApi, { fullname, email, password });
        const user = response.data;
        // api.setLoggedInUser(user);
        // setAuthorization(user['token']);
        yield put(authApiResponseSuccess(AuthActionTypes.SIGNUP_USER, user));
    } catch (error) {
        yield put(authApiResponseError(AuthActionTypes.SIGNUP_USER, error));
        api.setLoggedInUser(null);
        setAuthorization(null);
    }
}

function* forgotPassword({ payload }) {
    try {
        const encryptedPayload = {
            key: encryptMessage(payload)
        }
        const response = yield call(forgotPasswordApi, encryptedPayload);
        yield put(authApiResponseSuccess(AuthActionTypes.FORGOT_PASSWORD, decryptMessage(response?.data?.data)));
    } catch (error) {
        yield put(authApiResponseError(AuthActionTypes.FORGOT_PASSWORD, error));
    }
}

function* forgotPasswordChange({ payload }) {
    const { token, newPassword } = payload;

    const passwordPayload = {
        newPassword: newPassword
    }
    const encryptedNewPassword = {
        key: encryptMessage(passwordPayload)
    }

    try {
        setAuthorization(token)
        const response = yield call(forgotPasswordConfirm, encryptedNewPassword);
        yield put(authApiResponseSuccess(AuthActionTypes.FORGOT_PASSWORD_CHANGE, response.data));
    } catch (error) {
        yield put(authApiResponseError(AuthActionTypes.FORGOT_PASSWORD_CHANGE, error));
    }
}
function* verifyTokenFunction({ payload }) {
    const { token } = payload;
    try {
        setAuthorization(token)
        const response = yield call(verifyToken);
        yield put(authApiResponseSuccess(AuthActionTypes.VERIFY_TOKEN, response.data));
    } catch (error) {
        yield put(authApiResponseError(AuthActionTypes.VERIFY_TOKEN, error));
    }
}

function* setPasswordChange({ payload }) {
    const { token, newPassword } = payload;
    const passwordPayload = {
        newPassword: newPassword,
    }
    const encryptedNewPassword = {
        key: encryptMessage(passwordPayload)
    }

    try {
        setAuthorization(token)
        const response = yield call(setPasswordApi, encryptedNewPassword);
        yield put(authApiResponseSuccess(AuthActionTypes.SET_PASSWORD, response.data));
    } catch (error) {
        ToastHandle(error,'danger')
        yield put(authApiResponseError(AuthActionTypes.SET_PASSWORD, error));
    }
}

function* setChangePasswordChange({ payload }) {
    const { oldPassword,token, newPassword } = payload;
    const confirmpasswordPayload = {
        newPassword: newPassword,
        oldPassword: oldPassword,
    }
    // const encryptedNewPassword = {
    //     key: encryptMessage(confirmpasswordPayload)
    // }

    try {
        const response = yield call(confirmPasswordApi, payload);
        yield put(authApiResponseSuccess(AuthActionTypes.CONFIRMPASSWORD, response.data));
    } catch (error) {
        yield put(authApiResponseError(AuthActionTypes.CONFIRMPASSWORD, error));
    }
}
export function* watchLoginUser(): any {
    yield takeEvery(AuthActionTypes.LOGIN_USER, login);
}

export function* watchLogout(): any {
    yield takeEvery(AuthActionTypes.LOGOUT_USER, logout);
}

export function* watchSignup(): any {
    yield takeEvery(AuthActionTypes.SIGNUP_USER, signup);
}

export function* watchForgotPassword(): any {
    yield takeEvery(AuthActionTypes.FORGOT_PASSWORD, forgotPassword);
}

export function* watchForgotPasswordChange(): any {
    yield takeEvery(AuthActionTypes.FORGOT_PASSWORD_CHANGE, forgotPasswordChange);
}
export function* watchVerifyToken(): any {
    yield takeEvery(AuthActionTypes.VERIFY_TOKEN, verifyTokenFunction);
}
export function* watchSetPassword(): any {
    yield takeEvery(AuthActionTypes.SET_PASSWORD, setPasswordChange);
}


export function* watchChangePassword(): any {
    yield takeEvery(AuthActionTypes.CONFIRMPASSWORD, setChangePasswordChange);
}


function* authSaga(): any {
    yield all([
        fork(watchLoginUser),
        fork(watchLogout),
        fork(watchSignup),
        fork(watchForgotPassword),
        fork(watchForgotPasswordChange),
        fork(watchVerifyToken),
        fork(watchSetPassword),
        fork(watchChangePassword),

    ]);
}

export default authSaga;
