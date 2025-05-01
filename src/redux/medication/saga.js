import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { MedicationActionTypes } from './constants';
import {
    createMedicationApi,
    getMedicationApi,
    getMedicationDrugsApi
    // deleteAllergyApi,
    // getAllergiesOfAPatientApi,
    // getAllergyDetailsApi,
    // updateAllergyApi,
} from './api';
import { GetDrugsAction } from './action';
import { getMedication } from '../../helpers/api/apiEndpoints';
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
        yield put({
            type: MedicationActionTypes.CREATE_MEDICATION_ERROR,
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
        if (response.status === 201) {
            yield put({
                type: MedicationActionTypes.GET_MEDICATION_DRUGS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: MedicationActionTypes.GET_MEDICATION_DRUGS_RESET,
                payload: {},
            });
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
            // yield put({
            //     type: MedicationActionTypes.GET_MEDICATION_RESET,
            //     payload: {},
            // });
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

// function* updateAllergyFunction(data) {
//     try {
//         yield put({
//             type: MedicationActionTypes.UPDATE_ALLERGY_LOADING,
//             payload: {},
//         });
//         const response = yield call(updateAllergyApi, data);
//         const decryptedData = JSON.parse(decryptMessage(response.data.data));
//         if (response.status === 200) {
//             ToastHandle(decryptedData?.message, 'success');
//             yield put({
//                 type: MedicationActionTypes.UPDATE_ALLERGY_SUCCESS,
//                 payload: { ...decryptedData },
//             });
//             yield put({
//                 type: MedicationActionTypes.UPDATE_ALLERGY_RESET,
//                 payload: {},
//             });
//         } else {
//             yield put({
//                 type: MedicationActionTypes.UPDATE_ALLERGY_ERROR,
//                 payload: { ...decryptedData },
//             });
//         }
//     } catch (error) {
//         ToastHandle(error, 'danger');
//         yield put({
//             type: MedicationActionTypes.UPDATE_ALLERGY_ERROR,
//             payload: error,
//         });
//     }
// }

// function* deleteAllergyFunction(data) {
//     try {
//         yield put({
//             type: MedicationActionTypes.DELETE_ALLERGY_LOADING,
//             payload: {},
//         });
//         const response = yield call(deleteAllergyApi, data);
//         const decryptedData = JSON.parse(decryptMessage(response.data.data));

//         if (response?.status === 200) {
//             ToastHandle(response?.message, 'danger');
//             yield put({
//                 type: MedicationActionTypes.DELETE_ALLERGY_SUCCESS,
//                 payload: { ...decryptedData },
//             });
//             yield put({
//                 type: MedicationActionTypes.DELETE_ALLERGY_RESET,
//                 payload: {},
//             });
//         } else {
//             yield put({
//                 type: MedicationActionTypes.DELETE_ALLERGY_ERROR,
//                 payload: { ...decryptedData },
//             });
//         }
//     } catch (error) {
//         ToastHandle(error, 'danger');

//         yield put({
//             type: MedicationActionTypes.DELETE_ALLERGY_ERROR,
//             payload: error,
//         });
//     }
// }

// export function* callResetUpdate() {
//     put({
//         type: MedicationActionTypes.RESET_UPDATE_STATUS,
//         payload: {},
//     });
// }

export function* watchCreateMedication() {
    yield takeEvery(MedicationActionTypes.CREATE_MEDICATION, createMedicationFunction);
}

export function* watchGetMedicalDrugs() {
    yield takeEvery(MedicationActionTypes.GET_MEDICATION_DRUGS, getDrugsFunction);
}
export function* watchGetMedication() {
    yield takeEvery(MedicationActionTypes.GET_MEDICATION, getMedicationFunction);
}

// export function* watchGetAllergiesOfAPatient() {
//     yield takeEvery(MedicationActionTypes.GET_ALLERGIES_OF_A_PATIENT, getAllergiesOfAPatientFunction);
// }

// export function* watchUpdateAllergy() {
//     yield takeEvery(MedicationActionTypes.UPDATE_ALLERGY, updateAllergyFunction);
// }

// export function* watchDeleteAllergy() {
//     yield takeEvery(MedicationActionTypes.DELETE_ALLERGY, deleteAllergyFunction);
// }
function* medicationSaga() {
    yield all([
        fork(watchCreateMedication),
        fork(watchGetMedicalDrugs),
        fork(watchGetMedication),
    ]);
}
export default medicationSaga;
