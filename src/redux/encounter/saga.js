import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { EncounterActionTypes } from './constants';
import {
    createEncounterApi,
    getEncounterApi,
    updateEncounterApi,
} from './api';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createEncounterFunction(data) {
    try {
        yield put({
            type: EncounterActionTypes.CREATE_ENCOUNTER_LOADING,
            payload: {},
        });
        const response = yield call(createEncounterApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: EncounterActionTypes.CREATE_ENCOUNTER_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: EncounterActionTypes.CREATE_ENCOUNTER_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: EncounterActionTypes.CREATE_ENCOUNTER_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: EncounterActionTypes.CREATE_ENCOUNTER_ERROR,
            payload: error,
        });
    }
}

function* updateEncounterFunction(data) {
    try {
        yield put({
            type: EncounterActionTypes.UPDATE_ENCOUNTER_LOADING,
            payload: {},
        });
        const response = yield call(updateEncounterApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: EncounterActionTypes.UPDATE_ENCOUNTER_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: EncounterActionTypes.UPDATE_ENCOUNTER_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: EncounterActionTypes.UPDATE_ENCOUNTER_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: EncounterActionTypes.UPDATE_ENCOUNTER_ERROR,
            payload: error,
        });
    }
}

function* getEncounterFunction(data) {
    try {
        yield put({
            type: EncounterActionTypes.GET_ENCOUNTER_LOADING,
            payload: {},
        });
        const response = yield call(getEncounterApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            yield put({
                type: EncounterActionTypes.GET_ENCOUNTER_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: EncounterActionTypes.GET_ENCOUNTER_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: EncounterActionTypes.GET_ENCOUNTER_ERROR,
            payload: error,
        });
    }
}


export function* watchCreateEncounter() {
    yield takeEvery(EncounterActionTypes.CREATE_ENCOUNTER, createEncounterFunction);
}

export function* watchUpdateEncounter() {
    yield takeEvery(EncounterActionTypes.UPDATE_ENCOUNTER, updateEncounterFunction);
}

export function* watchGetEncounter() {
    yield takeEvery(EncounterActionTypes.GET_ENCOUNTER, getEncounterFunction);
}

function* encounterSaga() {
    yield all([
        fork(watchCreateEncounter),
        fork(watchUpdateEncounter),
        fork(watchGetEncounter),
    ]);
}
export default encounterSaga;
