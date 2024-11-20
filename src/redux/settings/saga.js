import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { SettingsActionTypes } from './constants';
import { createMastersDataApi, getMastersDataApi, updateMastersDataApi } from './api';
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

        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success')
            yield put({
                type: SettingsActionTypes.CREATE_MASTERS_DATA_SUCCESS,
                payload: { ...decryptedData },
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

function* updateMastersDataFunction(data) {
    try {
        yield put({
            type: SettingsActionTypes.UPDATE_MASTERS_DATA_LOADING,
            payload: {},
        });
        const response = yield call(updateMastersDataApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: SettingsActionTypes.UPDATE_MASTERS_DATA_SUCCESS,
                payload: { ...decryptedData },
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
    put({
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
        fork(watchUpdateMastersData),
        fork(watchresetState)
    ]);
}
export default settingsSaga;
