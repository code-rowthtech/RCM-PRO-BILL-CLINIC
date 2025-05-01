import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import {
    createSuggestionsApi,
} from './api';
import { SuggestionsListActionTypes } from './constants';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createSuggestionsFunction(data) {
    try {
        yield put({
            type: SuggestionsListActionTypes.CREATE_SUGGESTION_LOADING,
            payload: {},
        });
        const response = yield call(createSuggestionsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: SuggestionsListActionTypes.CREATE_SUGGESTION_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: SuggestionsListActionTypes.CREATE_SUGGESTION_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: SuggestionsListActionTypes.CREATE_SUGGESTION_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: SuggestionsListActionTypes.CREATE_SUGGESTION_ERROR,
            payload: error,
        });
    }
}

// function* getAllergyDetailsFunction(data) {
//     try {
//         yield put({
//             type: AllergyListActionTypes.GET_ALLERGY_DETAILS_LOADING,
//             payload: {},
//         });
//         const response = yield call(getAllergyDetailsApi, data);
//         const decryptedData = JSON.parse(decryptMessage(response.data.data));
//         if (response.status === 201) {
//             // ToastHandle(decryptedData?.message, 'success');
//             yield put({
//                 type: AllergyListActionTypes.GET_ALLERGY_DETAILS_SUCCESS,
//                 payload: { ...decryptedData },
//             });
//             yield put({
//                 type: AllergyListActionTypes.GET_ALLERGY_DETAILS_RESET,
//                 payload: {},
//             });
//         } else {
//             yield put({
//                 type: AllergyListActionTypes.GET_ALLERGY_DETAILS_ERROR,
//                 payload: { ...decryptedData },
//             });
//         }
//     } catch (error) {
//         ToastHandle(error, 'danger');
//         yield put({
//             type: AllergyListActionTypes.GET_ALLERGY_DETAILS_ERROR,
//             payload: error,
//         });
//     }
// }

// function* getAllergiesOfAPatientFunction(data) {
//     try {
//         yield put({
//             type: AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT_LOADING,
//             payload: {},
//         });
//         const response = yield call(getAllergiesOfAPatientApi, data);
//         const decryptedData = JSON.parse(decryptMessage(response.data.data));
//         if (response.status === 201) {
//             // ToastHandle(decryptedData?.message, 'success');
//             yield put({
//                 type: AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT_SUCCESS,
//                 payload: { ...decryptedData },
//             });
//             yield put({
//                 type: AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT_RESET,
//                 payload: {},
//             });
//         } else {
//             yield put({
//                 type: AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT_ERROR,
//                 payload: { ...decryptedData },
//             });
//         }
//     } catch (error) {
//         ToastHandle(error, 'danger');
//         yield put({
//             type: AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT_ERROR,
//             payload: error,
//         });
//     }
// }

// function* updateAllergyFunction(data) {
//     try {
//         yield put({
//             type: AllergyListActionTypes.UPDATE_ALLERGY_LOADING,
//             payload: {},
//         });
//         const response = yield call(updateAllergyApi, data);
//         const decryptedData = JSON.parse(decryptMessage(response.data.data));
//         if (response.status === 200) {
//             ToastHandle(decryptedData?.message, 'success');
//             yield put({
//                 type: AllergyListActionTypes.UPDATE_ALLERGY_SUCCESS,
//                 payload: { ...decryptedData },
//             });
//             yield put({
//                 type: AllergyListActionTypes.UPDATE_ALLERGY_RESET,
//                 payload: {},
//             });
//         } else {
//             yield put({
//                 type: AllergyListActionTypes.UPDATE_ALLERGY_ERROR,
//                 payload: { ...decryptedData },
//             });
//         }
//     } catch (error) {
//         ToastHandle(error, 'danger');
//         yield put({
//             type: AllergyListActionTypes.UPDATE_ALLERGY_ERROR,
//             payload: error,
//         });
//     }
// }

// function* deleteAllergyFunction(data) {
//     try {
//         yield put({
//             type: AllergyListActionTypes.DELETE_ALLERGY_LOADING,
//             payload: {},
//         });
//         const response = yield call(deleteAllergyApi, data);
//         const decryptedData = JSON.parse(decryptMessage(response.data.data));

//         if (response?.status === 200) {
//             ToastHandle(decryptedData?.message, 'danger');
//             yield put({
//                 type: AllergyListActionTypes.DELETE_ALLERGY_SUCCESS,
//                 payload: { ...decryptedData },
//             });
//             yield put({
//                 type: AllergyListActionTypes.DELETE_ALLERGY_RESET,
//                 payload: {},
//             });
//         } else {
//             yield put({
//                 type: AllergyListActionTypes.DELETE_ALLERGY_ERROR,
//                 payload: { ...decryptedData },
//             });
//         }
//     } catch (error) {
//         ToastHandle(error, 'danger');
//         yield put({
//             type: AllergyListActionTypes.DELETE_ALLERGY_ERROR,
//             payload: error,
//         });
//     }
// }

export function* callResetUpdate() {
    put({
        type: SuggestionsListActionTypes.RESET_UPDATE_STATUS,
        payload: {},
    });
}

export function* watchSuggestionAllergy() {
    yield takeEvery(SuggestionsListActionTypes.CREATE_SUGGESTION, createSuggestionsFunction);
}

// export function* watchGetAllergyDetails() {
//     yield takeEvery(AllergyListActionTypes.GET_ALLERGY_DETAILS, getAllergyDetailsFunction);
// }

// export function* watchGetAllergiesOfAPatient() {
//     yield takeEvery(AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT, getAllergiesOfAPatientFunction);
// }

// export function* watchUpdateAllergy() {
//     yield takeEvery(AllergyListActionTypes.UPDATE_ALLERGY, updateAllergyFunction);
// }

// export function* watchDeleteAllergy() {
//     yield takeEvery(AllergyListActionTypes.DELETE_ALLERGY, deleteAllergyFunction);
// }
function* suggestionsListSaga() {
    yield all([
        fork(watchSuggestionAllergy),
        // fork(watchGetAllergyDetails),
        // fork(watchGetAllergiesOfAPatient),
        // fork(watchUpdateAllergy),
        // fork(watchDeleteAllergy),
    ]);
}
export default suggestionsListSaga;
