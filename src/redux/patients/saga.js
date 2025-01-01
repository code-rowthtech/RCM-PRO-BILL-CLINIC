import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { PatientsActionTypes } from './constants';
import { createPatientsApi, createResponsiblePartyApi, getPatientByIdApi, getPatientsApi, getResponsiblePartyApi, updatePatientsApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { createResponsibleParty } from '../../helpers/api/apiEndpoints';
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
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
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

function* getPatientByIdFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.GET_PATIENTS_BY_ID_LOADING,
            payload: {},
        });
        const response = yield call(getPatientByIdApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: PatientsActionTypes.GET_PATIENTS_BY_ID_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.GET_PATIENTS_BY_ID_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PatientsActionTypes.GET_PATIENTS_BY_ID_ERROR,
            payload: error,
        });
    }
}

function* createPatientsFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.CREATE_PATIENTS_LOADING,
            payload: {},
        });
        const response = yield call(createPatientsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
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
        ToastHandle(error, 'danger');
        yield put({
            type: PatientsActionTypes.CREATE_PATIENTS_ERROR,
            payload: error,
        });
    }
}

function* createResponsiblePartyFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.CREATE_RESPONSIBLE_PARTY_LOADING,
            payload: {},
        });
        const response = yield call(createResponsiblePartyApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: PatientsActionTypes.CREATE_RESPONSIBLE_PARTY_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.CREATE_RESPONSIBLE_PARTY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: PatientsActionTypes.CREATE_RESPONSIBLE_PARTY_ERROR,
            payload: error,
        });
    }
}
function* getResponsiblePartyFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.GET_RESPONSIBLE_PARTY_LOADING,
            payload: {},
        });
        const response = yield call(getResponsiblePartyApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: PatientsActionTypes.GET_RESPONSIBLE_PARTY_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.GET_RESPONSIBLE_PARTY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: PatientsActionTypes.GET_RESPONSIBLE_PARTY_ERROR,
            payload: error,
        });
    }
}

function* updatePatientsFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.UPDATE_PATIENTS_LOADING,
            payload: {},
        });
        const response = yield call(updatePatientsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: PatientsActionTypes.UPDATE_PATIENTS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.UPDATE_PATIENTS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
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

export function* watchGetPatientById() {
    yield takeEvery(PatientsActionTypes.GET_PATIENTS_BY_ID, getPatientByIdFunction);
}

export function* watchCreatePatients() {
    yield takeEvery(PatientsActionTypes.CREATE_PATIENTS, createPatientsFunction);
}

export function* watchCreateResponsibleParty() {
    yield takeEvery(PatientsActionTypes.CREATE_RESPONSIBLE_PARTY, createResponsiblePartyFunction);
}

export function* watchGetResponsibleParty() {
    yield takeEvery(PatientsActionTypes.GET_RESPONSIBLE_PARTY, getResponsiblePartyFunction);
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
        fork(watchGetPatientById),
        fork(watchCreatePatients),
        fork(watchCreateResponsibleParty),
        fork(watchGetResponsibleParty),
        fork(watchUpdatePatients),
        fork(watchresetState),
    ]);
}
export default patientsSaga;
