import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { MedicationActionTypes } from './constants';
import {
    createMedicationApi,
    getMedicationApi,
    getMedicationDrugsApi,
    updateMedicationApi
} from './api';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createMedicationFunction(data) {
    try {
        yield put({
            type: MedicationActionTypes.CREATE_MEDICATION_LOADING,
            payload: {},
        });
        const response = yield call(createMedicationApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: MedicationActionTypes.CREATE_MEDICATION_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: MedicationActionTypes.CREATE_MEDICATION_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: MedicationActionTypes.CREATE_MEDICATION_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: MedicationActionTypes.CREATE_MEDICATION_ERROR,
            payload: error,
        });
    }
}

function* updateMedicationFunction(data) {
    try {
        yield put({
            type: MedicationActionTypes.UPDATE_MEDICATION_LOADING,
            payload: {},
        });
        const response = yield call(updateMedicationApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: MedicationActionTypes.UPDATE_MEDICATION_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: MedicationActionTypes.UPDATE_MEDICATION_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: MedicationActionTypes.UPDATE_MEDICATION_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: MedicationActionTypes.UPDATE_MEDICATION_ERROR,
            payload: error,
        });
    }
}

function* getDrugsFunction(data) {
    try {
        yield put({
            type: MedicationActionTypes.GET_MEDICATION_DRUGS_LOADING,
            payload: {},
        });
        const response = yield call(getMedicationDrugsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: MedicationActionTypes.GET_MEDICATION_DRUGS_SUCCESS,
                payload: { ...decryptedData },
            });
            // yield put({
            //     type: MedicationActionTypes.GET_MEDICATION_DRUGS_RESET,
            //     payload: {},
            // });
        } else {
            yield put({
                type: MedicationActionTypes.GET_MEDICATION_DRUGS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: MedicationActionTypes.GET_MEDICATION_DRUGS_ERROR,
            payload: error,
        });
    }
}

function* getMedicationFunction(data) {
    try {
        yield put({
            type: MedicationActionTypes.GET_MEDICATION_LOADING,
            payload: {},
        });
        const response = yield call(getMedicationApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            yield put({
                type: MedicationActionTypes.GET_MEDICATION_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: MedicationActionTypes.GET_MEDICATION_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: MedicationActionTypes.GET_MEDICATION_ERROR,
            payload: error,
        });
    }
}



export function* watchCreateMedication() {
    yield takeEvery(MedicationActionTypes.CREATE_MEDICATION, createMedicationFunction);
}

export function* watchUpdateMedication() {
    yield takeEvery(MedicationActionTypes.UPDATE_MEDICATION, updateMedicationFunction);
}

export function* watchGetMedicalDrugs() {
    yield takeEvery(MedicationActionTypes.GET_MEDICATION_DRUGS, getDrugsFunction);
}
export function* watchGetMedication() {
    yield takeEvery(MedicationActionTypes.GET_MEDICATION, getMedicationFunction);
}

function* medicationSaga() {
    yield all([
        fork(watchCreateMedication),
        fork(watchGetMedicalDrugs),
        fork(watchGetMedication),
        fork(watchUpdateMedication),
    ]);
}
export default medicationSaga;
