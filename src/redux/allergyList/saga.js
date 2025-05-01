import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { AllergyListActionTypes } from './constants';
import {
    createAllergyApi,
    deleteAllergyApi,
    getAllergiesOfAPatientApi,
    getAllergyDetailsApi,
    updateAllergyApi,
} from './api';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createAllergyFunction(data) {
    try {
        yield put({
            type: AllergyListActionTypes.CREATE_ALLERGY_LOADING,
            payload: {},
        });
        const response = yield call(createAllergyApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: AllergyListActionTypes.CREATE_ALLERGY_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: AllergyListActionTypes.CREATE_ALLERGY_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: AllergyListActionTypes.CREATE_ALLERGY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: AllergyListActionTypes.CREATE_ALLERGY_ERROR,
            payload: error,
        });
    }
}

function* getAllergyDetailsFunction(data) {
    try {
        yield put({
            type: AllergyListActionTypes.GET_ALLERGY_DETAILS_LOADING,
            payload: {},
        });
        const response = yield call(getAllergyDetailsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: AllergyListActionTypes.GET_ALLERGY_DETAILS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: AllergyListActionTypes.GET_ALLERGY_DETAILS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: AllergyListActionTypes.GET_ALLERGY_DETAILS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: AllergyListActionTypes.GET_ALLERGY_DETAILS_ERROR,
            payload: error,
        });
    }
}

function* getAllergiesOfAPatientFunction(data) {
    try {
        yield put({
            type: AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT_LOADING,
            payload: {},
        });
        const response = yield call(getAllergiesOfAPatientApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT_ERROR,
            payload: error,
        });
    }
}

function* updateAllergyFunction(data) {
    try {
        yield put({
            type: AllergyListActionTypes.UPDATE_ALLERGY_LOADING,
            payload: {},
        });
        const response = yield call(updateAllergyApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: AllergyListActionTypes.UPDATE_ALLERGY_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: AllergyListActionTypes.UPDATE_ALLERGY_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: AllergyListActionTypes.UPDATE_ALLERGY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: AllergyListActionTypes.UPDATE_ALLERGY_ERROR,
            payload: error,
        });
    }
}

function* deleteAllergyFunction(data) {
    try {
        yield put({
            type: AllergyListActionTypes.DELETE_ALLERGY_LOADING,
            payload: {},
        });
        const response = yield call(deleteAllergyApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response?.status === 200) {
            ToastHandle(decryptedData?.message, 'danger');
            yield put({
                type: AllergyListActionTypes.DELETE_ALLERGY_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: AllergyListActionTypes.DELETE_ALLERGY_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: AllergyListActionTypes.DELETE_ALLERGY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: AllergyListActionTypes.DELETE_ALLERGY_ERROR,
            payload: error,
        });
    }
}

export function* callResetUpdate() {
    put({
        type: AllergyListActionTypes.RESET_UPDATE_STATUS,
        payload: {},
    });
}

export function* watchCreateAllergy() {
    yield takeEvery(AllergyListActionTypes.CREATE_ALLERGY, createAllergyFunction);
}

export function* watchGetAllergyDetails() {
    yield takeEvery(AllergyListActionTypes.GET_ALLERGY_DETAILS, getAllergyDetailsFunction);
}

export function* watchGetAllergiesOfAPatient() {
    yield takeEvery(AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT, getAllergiesOfAPatientFunction);
}

export function* watchUpdateAllergy() {
    yield takeEvery(AllergyListActionTypes.UPDATE_ALLERGY, updateAllergyFunction);
}

export function* watchDeleteAllergy() {
    yield takeEvery(AllergyListActionTypes.DELETE_ALLERGY, deleteAllergyFunction);
}
function* alleryListSaga() {
    yield all([
        fork(watchCreateAllergy),
        fork(watchGetAllergyDetails),
        fork(watchGetAllergiesOfAPatient),
        fork(watchUpdateAllergy),
        fork(watchDeleteAllergy),
    ]);
}
export default alleryListSaga;
