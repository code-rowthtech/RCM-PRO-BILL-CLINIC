import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SettingsActionTypes } from './constants';
import { createConsentFormApi, createMastersDataApi, deleteConsentFormApi, getConsentFormApi, getDepartmentDataApi, getMastersDataApi, updateConsentFormApi, updateMastersDataApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createMastersDataFunction(data) {
    try {
        yield put({
            type: SettingsActionTypes.CREATE_MASTERS_DATA_LOADING,
            payload: {},
        });
        const response = yield call(createMastersDataApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: SettingsActionTypes.CREATE_MASTERS_DATA_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: SettingsActionTypes.CREATE_MASTERS_DATA_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: SettingsActionTypes.CREATE_MASTERS_DATA_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: SettingsActionTypes.CREATE_MASTERS_DATA_ERROR,
            payload: error,
        });
    }
}

function* getMastersDataFunction(data) {
    try {
        yield put({
            type: SettingsActionTypes.GET_MASTERS_DATA_LOADING,
            payload: {},
        });
        const response = yield call(getMastersDataApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: SettingsActionTypes.GET_MASTERS_DATA_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: SettingsActionTypes.GET_MASTERS_DATA_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: SettingsActionTypes.GET_MASTERS_DATA_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: SettingsActionTypes.GET_MASTERS_DATA_ERROR,
            payload: error,
        });
    }
}

function* getMastersData2Function(data) {
    try {
        yield put({
            type: SettingsActionTypes.GET_MASTERS2_DATA_LOADING,
            payload: {},
        });
        const response = yield call(getMastersDataApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: SettingsActionTypes.GET_MASTERS2_DATA_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: SettingsActionTypes.GET_MASTERS2_DATA_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: SettingsActionTypes.GET_MASTERS2_DATA_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: SettingsActionTypes.GET_MASTERS2_DATA_ERROR,
            payload: error,
        });
    }
}

function* getDepartmentDataFunction(data) {
    try {
        yield put({
            type: SettingsActionTypes.GET_DEPARTMENT_DATA_LOADING,
            payload: {},
        });
        const response = yield call(getDepartmentDataApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: SettingsActionTypes.GET_DEPARTMENT_DATA_SUCCESS,
                payload: { ...decryptedData },
            });
            // yield put({
            //     type: SettingsActionTypes.GET_DEPARTMENT_DATA_RESET,
            //     payload: {},
            // });
        } else {
            yield put({
                type: SettingsActionTypes.GET_DEPARTMENT_DATA_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: SettingsActionTypes.GET_DEPARTMENT_DATA_ERROR,
            payload: error,
        });
    }
}

function* updateMastersDataFunction(data) {
    try {
        yield put({
            type: SettingsActionTypes.UPDATE_MASTERS_DATA_LOADING,
            payload: {},
        });
        const response = yield call(updateMastersDataApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: SettingsActionTypes.UPDATE_MASTERS_DATA_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: SettingsActionTypes.UPDATE_MASTERS_DATA_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: SettingsActionTypes.UPDATE_MASTERS_DATA_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: SettingsActionTypes.UPDATE_MASTERS_DATA_ERROR,
            payload: error,
        });
    }
}

// CONSENT FORM SAGAS
function* createConsentFormFunction(data) {
    try {
        yield put({
            type: SettingsActionTypes.CREATE_CONSENT_FORM_LOADING,
            payload: {},
        });
        const response = yield call(createConsentFormApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: SettingsActionTypes.CREATE_CONSENT_FORM_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: SettingsActionTypes.CREATE_CONSENT_FORM_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: SettingsActionTypes.CREATE_CONSENT_FORM_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: SettingsActionTypes.CREATE_CONSENT_FORM_ERROR,
            payload: error,
        });
    }
}

function* updateConsentFormFunction(data) {
    try {
        yield put({
            type: SettingsActionTypes.UPDATE_CONSENT_FORM_LOADING,
            payload: {},
        });
        const response = yield call(updateConsentFormApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: SettingsActionTypes.UPDATE_CONSENT_FORM_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: SettingsActionTypes.UPDATE_CONSENT_FORM_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: SettingsActionTypes.UPDATE_CONSENT_FORM_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: SettingsActionTypes.UPDATE_CONSENT_FORM_ERROR,
            payload: error,
        });
    }
}
function* deleteConsentFormFunction(data) {
    try {
        yield put({
            type: SettingsActionTypes.DELETE_CONSENT_FORM_LOADING,
            payload: {},
        });
        const response = yield call(deleteConsentFormApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: SettingsActionTypes.DELETE_CONSENT_FORM_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: SettingsActionTypes.DELETE_CONSENT_FORM_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: SettingsActionTypes.DELETE_CONSENT_FORM_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: SettingsActionTypes.DELETE_CONSENT_FORM_ERROR,
            payload: error,
        });
    }
}
function* getConsentFormFunction(data) {
    try {
        yield put({
            type: SettingsActionTypes.GET_CONSENT_FORM_LOADING,
            payload: {},
        });
        const response = yield call(getConsentFormApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: SettingsActionTypes.GET_CONSENT_FORM_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: SettingsActionTypes.GET_CONSENT_FORM_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: SettingsActionTypes.GET_CONSENT_FORM_ERROR,
            payload: error,
        });
    }
}



export function* callStateEmpty() {
    yield put({
        type: SettingsActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });
}

export function* watchCreateMastersData() {
    yield takeEvery(SettingsActionTypes.CREATE_MASTERS_DATA, createMastersDataFunction);
}
export function* watchGetMastersData() {
    yield takeEvery(SettingsActionTypes.GET_MASTERS_DATA, getMastersDataFunction);
}

export function* watchGetMasters2Data() {
    yield takeEvery(SettingsActionTypes.GET_MASTERS2_DATA, getMastersData2Function);
}
export function* watchGetDepartmentData() {
    yield takeEvery(SettingsActionTypes.GET_DEPARTMENT_DATA, getDepartmentDataFunction);
}
export function* watchUpdateMastersData() {
    yield takeEvery(SettingsActionTypes.UPDATE_MASTERS_DATA, updateMastersDataFunction);
}

export function* watchresetState() {
    yield takeEvery(SettingsActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

// CONSENT FORM WATCHERS
export function* watchCreateConsentForm() {
    yield takeEvery(SettingsActionTypes.CREATE_CONSENT_FORM, createConsentFormFunction);
}
export function* watchUpdateConsentForm() {
    yield takeEvery(SettingsActionTypes.UPDATE_CONSENT_FORM, updateConsentFormFunction);
}
export function* watchDeleteConsentForm() {
    yield takeEvery(SettingsActionTypes.DELETE_CONSENT_FORM, deleteConsentFormFunction);
}
export function* watchGetConsentForm() {
    yield takeEvery(SettingsActionTypes.GET_CONSENT_FORM, getConsentFormFunction);
}

function* settingsSaga() {
    yield all([
        fork(watchCreateMastersData), fork(watchGetMastersData), fork(watchGetDepartmentData),
        fork(watchUpdateMastersData), fork(watchresetState), fork(watchGetMasters2Data),
        fork(watchCreateConsentForm), fork(watchUpdateConsentForm), fork(watchDeleteConsentForm), fork(watchGetConsentForm),
    ]);
}
export default settingsSaga;
