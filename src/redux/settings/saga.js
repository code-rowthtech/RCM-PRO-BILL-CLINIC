import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SettingsActionTypes } from './constants';
import { createMastersDataApi, getDepartmentDataApi, getMastersDataApi, updateMastersDataApi } from './api';
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
            yield put({
                type: SettingsActionTypes.GET_DEPARTMENT_DATA_RESET,
                payload: {},
            });
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

function* settingsSaga() {
    yield all([
        fork(watchCreateMastersData),
        fork(watchGetMastersData),
        fork(watchGetDepartmentData),
        fork(watchUpdateMastersData),
        fork(watchresetState),
        fork(watchGetMasters2Data),
    ]);
}
export default settingsSaga;
