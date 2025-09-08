import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { VitalsActionTypes } from './constants';
import { createVitalsApi, getVitalsApi, getVitalsByAppointmentApi, getVitalsByPatientApi, updateVitalsApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createVitalsFunction(data) {
    try {
        yield put({
            type: VitalsActionTypes.CREATE_VITALS_LOADING,
            payload: {},
        });
        const response = yield call(createVitalsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            yield put({
                type: VitalsActionTypes.CREATE_VITALS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: VitalsActionTypes.CREATE_VITALS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: VitalsActionTypes.CREATE_VITALS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger')
        yield put({
            type: VitalsActionTypes.CREATE_VITALS_ERROR,
            payload: error,
        });
    }
}


function* getVitalsFunction(data) {
    try {
        yield put({
            type: VitalsActionTypes.GET_VITALS_LOADING,
            payload: {},
        });
        const response = yield call(getVitalsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: VitalsActionTypes.GET_VITALS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: VitalsActionTypes.GET_VITALS_ERROR,
                payload: { ...decryptedData },
            });
        }

    } catch (error) {
        yield put({
            type: VitalsActionTypes.GET_VITALS_ERROR,
            payload: error,
        });
    }
}

function* getVitalsByPatientIdFunction(data) {
    try {
        yield put({
            type: VitalsActionTypes.GET_VITALS_BY_PATIENT_ID_LOADING,
            payload: {},
        });
        const response = yield call(getVitalsByPatientApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: VitalsActionTypes.GET_VITALS_BY_PATIENT_ID_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: VitalsActionTypes.GET_VITALS_BY_PATIENT_ID_ERROR,
                payload: { ...decryptedData },
            });
        }

    } catch (error) {
        yield put({
            type: VitalsActionTypes.GET_VITALS_BY_PATIENT_ID_ERROR,
            payload: error,
        });
    }
}
function* getVitalsByAppointmentIdFunction(data) {
    try {
        yield put({
            type: VitalsActionTypes.GET_VITALS_BY_APPOINTMENT_ID_LOADING,
            payload: {},
        });
        const response = yield call(getVitalsByAppointmentApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: VitalsActionTypes.GET_VITALS_BY_APPOINTMENT_ID_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: VitalsActionTypes.GET_VITALS_BY_APPOINTMENT_ID_ERROR,
                payload: { ...decryptedData },
            });
        }

    } catch (error) {
        yield put({
            type: VitalsActionTypes.GET_VITALS_ERROR,
            payload: error,
        });
    }
}

function* updateVitalsFunction(data) {
    try {
        yield put({
            type: VitalsActionTypes.UPDATE_VITALS_LOADING,
            payload: {},
        });
        const response = yield call(updateVitalsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: VitalsActionTypes.UPDATE_VITALS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: VitalsActionTypes.UPDATE_VITALS_ERROR,
                payload: { ...decryptedData },
            });
        }

    } catch (error) {
        yield put({
            type: VitalsActionTypes.UPDATE_VITALS_ERROR,
            payload: error,
        });
    }
}

export function* watchVitalsCreate() {
    yield takeEvery(VitalsActionTypes.CREATE_VITALS, createVitalsFunction);
}

export function* watchVitalsGet() {
    yield takeEvery(VitalsActionTypes.GET_VITALS, getVitalsFunction);
}

export function* watchVitalsGetByPatientId() {
    yield takeEvery(VitalsActionTypes.GET_VITALS_BY_PATIENT_ID, getVitalsByPatientIdFunction);
}
export function* watchVitalsGetByAppointmentId() {
    yield takeEvery(VitalsActionTypes.GET_VITALS_BY_APPOINTMENT_ID, getVitalsByAppointmentIdFunction);
}

export function* watchVitalsUpdate() {
    yield takeEvery(VitalsActionTypes.UPDATE_VITALS, updateVitalsFunction);
}

function* vitalsSaga() {
    yield all([
        fork(watchVitalsCreate),
        fork(watchVitalsGet),
        fork(watchVitalsGetByPatientId),
        fork(watchVitalsGetByAppointmentId),
        fork(watchVitalsUpdate),

    ]);
}
export default vitalsSaga;
