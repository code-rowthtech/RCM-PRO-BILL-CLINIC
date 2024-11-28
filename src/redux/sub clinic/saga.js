import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { SubClinicsActionTypes } from './constants';
import { createSubClinicApi, getSubClinicApi, getSubClinicTypeApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createSubClinicsFunction(data) {
    try {
        yield put({
            type: SubClinicsActionTypes.CREATE_SUBCLINIC_LOADING,
            payload: {},
        });
        const response = yield call(createSubClinicApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: SubClinicsActionTypes.CREATE_SUBCLINIC_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: SubClinicsActionTypes.CREATE_SUBCLINIC_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: SubClinicsActionTypes.CREATE_SUBCLINIC_ERROR,
            payload: error,
        });
    }
}
function* getSubClinicsFunction(data) {
    try {
        yield put({
            type: SubClinicsActionTypes.GET_SUBCLINIC_LOADING,
            payload: {},
        });
        const response = yield call(getSubClinicApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: SubClinicsActionTypes.GET_SUBCLINIC_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: SubClinicsActionTypes.GET_SUBCLINIC_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: SubClinicsActionTypes.GET_SUBCLINIC_ERROR,
            payload: error,
        });
    }
}

function* getSubClinicTypeFunction() {
    try {
        yield put({
            type: SubClinicsActionTypes.GET_SUBCLINICTYPE_LOADING,
        });

        const response = yield call(getSubClinicTypeApi);
        if (response.status === 200) {
            const decryptedData = JSON.parse(decryptMessage(response.data.data));
            yield put({
                type: SubClinicsActionTypes.GET_SUBCLINICTYPE_SUCCESS,
                payload: decryptedData,
            });
        } else {
            yield put({
                type: SubClinicsActionTypes.GET_SUBCLINICTYPE_ERROR,
                payload: response.data.message || 'Error fetching clinic types',
            });
        }
    } catch (error) {
        yield put({
            type: SubClinicsActionTypes.GET_SUBCLINICTYPE_ERROR,
            payload: error.message || 'Network error',
        });
    }
}


// function* updateClinicsFunction(data) {
//     try {
//         yield put({
//             type: SubClinicsActionTypes.UPDATE_CLINIC_LOADING,
//             payload: {},
//         });
//         const response = yield call(updateClinicApi, data);
//         const decryptedData = JSON.parse(decryptMessage(response.data.data));

//         if (response.status === 200) {
//             ToastHandle(decryptedData?.message, 'success');
//             yield put({
//                 type: SubClinicsActionTypes.UPDATE_CLINIC_SUCCESS,
//                 payload: { ...decryptedData },
//             });
//         } else {
//             yield put({
//                 type: SubClinicsActionTypes.UPDATE_CLINIC_ERROR,
//                 payload: { ...decryptedData },
//             });
//         }
//     } catch (error) {
//         yield put({
//             type: SubClinicsActionTypes.UPDATE_CLINIC_ERROR,
//             payload: error,
//         });
//     }
// }

// function* getSubClinicByIdFunction(data) {
//     try {
//         yield put({
//             type: SubClinicsActionTypes.GET_CLINIC_BY_ID_LOADING,
//             payload: {},
//         });
//         const response = yield call(getSubClinicApi, data);
//         const decryptedData = JSON.parse(decryptMessage(response.data.data));

//         if (response.status === 200) {
//             yield put({
//                 type: SubClinicsActionTypes.GET_CLINIC_BY_ID_SUCCESS,
//                 payload: { ...decryptedData },
//             });
//         } else {
//             yield put({
//                 type: SubClinicsActionTypes.GET_CLINIC_BY_ID_ERROR,
//                 payload: { ...decryptedData },
//             });
//         }
//     } catch (error) {
//         yield put({
//             type: SubClinicsActionTypes.GET_CLINIC_BY_ID_ERROR,
//             payload: error,
//         });
//     }
// }

// function* getClinicByParentFunction(data) {
//     try {
//         yield put({
//             type: SubClinicsActionTypes.GET_CLINIC_BY_PARENT_LOADING,
//             payload: {},
//         });
//         const response = yield call(getClinicsByParentIdApi, data);
//         const decryptedData = JSON.parse(decryptMessage(response.data.data));

//         if (response.status === 200) {
//             yield put({
//                 type: SubClinicsActionTypes.GET_CLINIC_BY_PARENT_SUCCESS,
//                 payload: { ...decryptedData },
//             });
//         } else {
//             yield put({
//                 type: SubClinicsActionTypes.GET_CLINIC_BY_PARENT_ERROR,
//                 payload: { ...decryptedData },
//             });
//         }
//     } catch (error) {
//         yield put({
//             type: SubClinicsActionTypes.GET_CLINIC_BY_PARENT_ERROR,
//             payload: error,
//         });
//     }
// }



// function* getStatesFunction(data) {
//     try {
//         yield put({
//             type: SubClinicsActionTypes.GET_STATES_LOADING,
//             payload: {},
//         });
//         const response = yield call(getStateByCountry, data);
//         const decryptedData = JSON.parse(decryptMessage(response.data.data));

//         if (response.status === 200) {
//             yield put({
//                 type: SubClinicsActionTypes.GET_STATES_SUCCESS,
//                 payload: { ...decryptedData },
//             });
//         } else {
//             yield put({
//                 type: SubClinicsActionTypes.GET_STATES_ERROR,
//                 payload: { ...decryptedData },
//             });
//         }
//     } catch (error) {
//         yield put({
//             type: SubClinicsActionTypes.GET_STATES_ERROR,
//             payload: error,
//         });
//     }
// }

// function* getCitiesFunction(data) {
//     try {
//         yield put({
//             type: SubClinicsActionTypes.GET_CITIES_LOADING,
//             payload: {},
//         });
//         const response = yield call(getCityByStateApi, data);
//         const decryptedData = JSON.parse(decryptMessage(response.data.data));
//         if (response.status === 200) {
//             yield put({
//                 type: SubClinicsActionTypes.GET_CITIES_SUCCESS,
//                 payload: { ...decryptedData },
//             });
//         } else {
//             yield put({
//                 type: SubClinicsActionTypes.GET_CITIES_ERROR,
//                 payload: { ...decryptedData },
//             });
//         }
//     } catch (error) {
//         yield put({
//             type: SubClinicsActionTypes.GET_CITIES_ERROR,
//             payload: error,
//         });
//     }
// }

// function* createSubscriptionPlanFunction(data) {
//     try {
//         yield put({
//             type: SubClinicsActionTypes.CREATE_SUBSCRIPTION_LOADING,
//             payload: {},
//         });
//         const response = yield call(addSubscriptionPlanApi, data);
//         const decryptedData = JSON.parse(decryptMessage(response.data.data));

//         if (response.status === 200) {
//             yield put({
//                 type: SubClinicsActionTypes.CREATE_SUBSCRIPTION_SUCCESS,
//                 payload: { ...decryptedData },
//             });
//         } else {
//             yield put({
//                 type: SubClinicsActionTypes.CREATE_SUBSCRIPTION_ERROR,
//                 payload: { ...decryptedData },
//             });
//         }
//     } catch (error) {
//         yield put({
//             type: SubClinicsActionTypes.CREATE_SUBSCRIPTION_ERROR,
//             payload: error,
//         });
//     }
// }

// function* createContractFunction(data) {
//     try {
//         yield put({
//             type: SubClinicsActionTypes.CREATE_CONTRACT_LOADING,
//             payload: {},
//         });
//         const response = yield call(createContract, data);
//         const decryptedData = JSON.parse(decryptMessage(response.data.data));
//         if (response.status === 200) {
//             yield put({
//                 type: SubClinicsActionTypes.CREATE_CONTRACT_SUCCESS,
//                 payload: { ...decryptedData },
//             });
//         } else {
//             yield put({
//                 type: SubClinicsActionTypes.CREATE_CONTRACT_ERROR,
//                 payload: { ...decryptedData },
//             });
//         }
//     } catch (error) {
//         yield put({
//             type: SubClinicsActionTypes.CREATE_CONTRACT_ERROR,
//             payload: error,
//         });
//     }
// }
// function* deleteClinicFunction(data) {
//     try {
//         yield put({
//             type: SubClinicsActionTypes.DELETE_CLINIC_LOADING,
//             payload: {},
//         });
//         const response = yield call(deleteClinicOnboardingApi, data);
//         const decryptedData = JSON.parse(decryptMessage(response.data.data));

//         if (response.status === 200) {
//             yield put({
//                 type: SubClinicsActionTypes.DELETE_CLINIC_SUCCESS,
//                 payload: { ...decryptedData },
//             });
//         } else {
//             yield put({
//                 type: SubClinicsActionTypes.DELETE_CLINIC_ERROR,
//                 payload: { ...decryptedData },
//             });
//         }
//     } catch (error) {
//         yield put({
//             type: SubClinicsActionTypes.DELETE_CLINIC_ERROR,
//             payload: error,
//         });
//     }
// }

// export function* callStateEmpty() {
//     put({
//         type: SubClinicsActionTypes.STATE_EMPTY_INTIAL_STATE,
//         payload: {},
//     });

// }

export function* watchCreateClinics() {
    yield takeEvery(SubClinicsActionTypes.CREATE_SUBCLINIC, createSubClinicsFunction);
}
export function* watchGetClinics() {
    yield takeEvery(SubClinicsActionTypes.GET_SUBCLINIC, getSubClinicsFunction);
}
export function* watchgetClinicsTypeState() {
    yield takeEvery(SubClinicsActionTypes.GET_SUBCLINICTYPE, getSubClinicTypeFunction);
}
// export function* watchUpdateClinics() {
//     yield takeEvery(SubClinicsActionTypes.UPDATE_CLINIC, updateClinicsFunction);
// }

// export function* watchGetStates() {
//     yield takeEvery(SubClinicsActionTypes.GET_STATES, getStatesFunction);
// }
// export function* watchGetCities() {
//     yield takeEvery(SubClinicsActionTypes.GET_CITIES, getCitiesFunction);
// }

// export function* watchGetClinicById() {
//     yield takeEvery(SubClinicsActionTypes.GET_CLINIC_BY_ID, getSubClinicByIdFunction);
// }

// export function* watchGetClinicByParent() {
//     yield takeEvery(SubClinicsActionTypes.GET_CLINIC_BY_PARENT, getClinicByParentFunction);
// }

// export function* watchCreateSubscriptions() {
//     yield takeEvery(SubClinicsActionTypes.CREATE_SUBSCRIPTION, createSubscriptionPlanFunction);
// }


// export function* watchCreateContract() {
//     yield takeEvery(SubClinicsActionTypes.CREATE_CONTRACT, createContractFunction);
// }

// export function* watchDeleteClinicOnboarding() {
//     yield takeEvery(SubClinicsActionTypes.DELETE_CLINIC, deleteClinicFunction);
// }

// export function* watchresetState() {
//     yield takeEvery(SubClinicsActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
// }


function* subclinicsSaga() {
    yield all([
        // fork(watchCreateClinics), fork(watchGetClinicById), fork(watchGetClinics),
        // fork(watchresetState), fork(watchGetStates), fork(watchGetCities), fork(watchCreateSubscriptions),fork(watchDeleteClinicOnboarding), fork(watchCreateContract),
        // fork(watchGetClinicByParent),fork(watchgetClinicsTypeState)
         fork(watchCreateClinics),
         fork(watchGetClinics),
         fork(watchgetClinicsTypeState)
    ]);
}
export default subclinicsSaga;
