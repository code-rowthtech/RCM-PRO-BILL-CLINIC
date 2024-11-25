import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { PatientsActionTypes } from './constants';
import {  createPatientsApi, getPatientsApi, updatePatientsApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* getPatientsFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.GET_PATIENTS_LOADING,
            payload: {},
        });
        const response = yield call(getPatientsApi, data);
        console.log(response, 'getPatientsFunction');
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        console.log(decryptedData, 'decrypted');
        if (response.status === 200) {
            yield put({
                type: PatientsActionTypes.GET_PATIENTS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.GET_PATIENTS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PatientsActionTypes.GET_PATIENTS_ERROR,
            payload: error,
        });
    }
}

function* createPatientsFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.GET_PATIENTS_LOADING,
            payload: {},
        });
        const response = yield call(createPatientsApi, data);
        console.log(response, 'createPatientsFunction');
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        console.log(decryptedData, 'decrypted create');
        if (response.status === 200) {
            yield put({
                type: PatientsActionTypes.CREATE_PATIENTS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.CREATE_PATIENTS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PatientsActionTypes.CREATE_PATIENTS_ERROR,
            payload: error,
        });
    }
}

function* updatePatientsFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.CREATE_PATIENTS_LOADING,
            payload: {},
        });
        const response = yield call(updatePatientsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: PatientsActionTypes.CREATE_PATIENTS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.UPDATE_PATIENTS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PatientsActionTypes.UPDATE_PATIENTS_ERROR,
            payload: error,
        });
    }
}
export function* callStateEmpty() {
    put({
        type: PatientsActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}


export function* watchGetPatients() {
    yield takeEvery(PatientsActionTypes.GET_PATIENTS, getPatientsFunction);
}

export function* watchCreatePatients() {
    yield takeEvery(PatientsActionTypes.CREATE_PATIENTS, createPatientsFunction);
}

export function* watchUpdatePatients() {
    yield takeEvery(PatientsActionTypes.UPDATE_PATIENTS, updatePatientsFunction);
}

export function* watchresetState() {
    yield takeEvery(PatientsActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

function* patientsSaga() {
    yield all([
        fork(watchGetPatients),
        fork(watchresetState),
        fork(watchCreatePatients),
        fork(watchUpdatePatients),
    ]);
}
export default patientsSaga;
