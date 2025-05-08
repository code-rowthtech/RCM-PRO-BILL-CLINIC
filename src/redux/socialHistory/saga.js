import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { TobaccooActionTypes } from './constants';
import {
    createAlcoholHistoryApi,
    createFamilyGeneticApi,
    createMedicalHistoryApi,
    createSurgicalHistoryApi,
    createTobaccooApi,
    deleteAlcoholHistoryApi,
    deleteMedicalHistoryApi,
    deleteSurgicalHistoryApi,
    deleteTobaccooApi,
    getAlcoholHistoryApi,
    getFamilyGeneticApi,
    getMedicalHistoryApi,
    getSurgicalHistoryApi,
    getTobaccooApi,
    updateAlcoholHistoryApi,
    updateFamilyGeneticApi,
    updateMedicalHistoryApi,
    updateSurgicalHistoryApi,
    updateTobaccooApi
} from './api';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createTobaccooFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.CREATE_TOBACCOO_LOADING,
            payload: {},
        });
        const response = yield call(createTobaccooApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TobaccooActionTypes.CREATE_TOBACCOO_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccooActionTypes.CREATE_TOBACCOO_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccooActionTypes.CREATE_TOBACCOO_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: TobaccooActionTypes.CREATE_TOBACCOO_ERROR,
            payload: error,
        });
    }
}

function* updateTobaccooFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.UPDATE_TOBACCOO_LOADING,
            payload: {},
        });
        const response = yield call(updateTobaccooApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TobaccooActionTypes.UPDATE_TOBACCOO_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccooActionTypes.UPDATE_TOBACCOO_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccooActionTypes.UPDATE_TOBACCOO_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TobaccooActionTypes.UPDATE_TOBACCOO_ERROR,
            payload: error,
        });
    }
}

function* deleteTobaccooFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.DELETE_TOBACCOO_LOADING,
            payload: {},
        });
        const response = yield call(deleteTobaccooApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TobaccooActionTypes.DELETE_TOBACCOO_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccooActionTypes.DELETE_TOBACCOO_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccooActionTypes.DELETE_TOBACCOO_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TobaccooActionTypes.DELETE_TOBACCOO_ERROR,
            payload: error,
        });
    }
}

function* getTobaccooFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.GET_TOBACCOO_LOADING,
            payload: {},
        });
        const response = yield call(getTobaccooApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            yield put({
                type: TobaccooActionTypes.GET_TOBACCOO_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccooActionTypes.GET_TOBACCOO_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccooActionTypes.GET_TOBACCOO_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TobaccooActionTypes.GET_TOBACCOO_ERROR,
            payload: error,
        });
    }
}

// Family/Genetic
function* createFamilyGeneticFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.CREATE_FAMILY_GENETIC_LOADING,
            payload: {},
        });
        const response = yield call(createFamilyGeneticApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TobaccooActionTypes.CREATE_FAMILY_GENETIC_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccooActionTypes.CREATE_FAMILY_GENETIC_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccooActionTypes.CREATE_FAMILY_GENETIC_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: TobaccooActionTypes.CREATE_FAMILY_GENETIC_ERROR,
            payload: error,
        });
    }
}

function* updateFamilyGeneticFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.UPDATE_FAMILY_GENETIC_LOADING,
            payload: {},
        });
        const response = yield call(updateFamilyGeneticApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TobaccooActionTypes.UPDATE_FAMILY_GENETIC_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccooActionTypes.UPDATE_FAMILY_GENETIC_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccooActionTypes.UPDATE_FAMILY_GENETIC_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TobaccooActionTypes.UPDATE_FAMILY_GENETIC_ERROR,
            payload: error,
        });
    }
}

function* getFamilyGeneticFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.GET_FAMILY_GENTIC_DATA_LOADING,
            payload: {},
        });
        const response = yield call(getFamilyGeneticApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            yield put({
                type: TobaccooActionTypes.GET_FAMILY_GENTIC_DATA_SUCCESS,
                payload: { ...decryptedData },
            });
            // yield put({
            //     type: TobaccooActionTypes.GET_FAMILY_GENTIC_DATA_RESET,
            //     payload: {},
            // });
        } else {
            yield put({
                type: TobaccooActionTypes.GET_FAMILY_GENTIC_DATA_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TobaccooActionTypes.GET_FAMILY_GENTIC_DATA_ERROR,
            payload: error,
        });
    }
}

// SURGICAL HISTORY

function* createSurgicalHistoryFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.CREATE_SURGICAL_HISTORY_LOADING,
            payload: {},
        });
        const response = yield call(createSurgicalHistoryApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TobaccooActionTypes.CREATE_SURGICAL_HISTORY_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccooActionTypes.CREATE_SURGICAL_HISTORY_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccooActionTypes.CREATE_SURGICAL_HISTORY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: TobaccooActionTypes.CREATE_SURGICAL_HISTORY_ERROR,
            payload: error,
        });
    }
}

function* updateSurgicalHistoryFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.UPDATE_SURGICAL_HISTORY_LOADING,
            payload: {},
        });
        const response = yield call(updateSurgicalHistoryApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TobaccooActionTypes.UPDATE_SURGICAL_HISTORY_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccooActionTypes.UPDATE_SURGICAL_HISTORY_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccooActionTypes.UPDATE_SURGICAL_HISTORY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TobaccooActionTypes.UPDATE_SURGICAL_HISTORY_ERROR,
            payload: error,
        });
    }
}

function* deleteSurgicalHistoryFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.DELETE_SURGICAL_HISTORY_LOADING,
            payload: {},
        });
        const response = yield call(deleteSurgicalHistoryApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TobaccooActionTypes.DELETE_SURGICAL_HISTORY_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccooActionTypes.DELETE_SURGICAL_HISTORY_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccooActionTypes.DELETE_SURGICAL_HISTORY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TobaccooActionTypes.DELETE_SURGICAL_HISTORY_ERROR,
            payload: error,
        });
    }
}

function* getSurgicalHistoryFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.GET_SURGICAL_HISTORY_LOADING,
            payload: {},
        });
        const response = yield call(getSurgicalHistoryApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            yield put({
                type: TobaccooActionTypes.GET_SURGICAL_HISTORY_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccooActionTypes.GET_SURGICAL_HISTORY_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccooActionTypes.GET_SURGICAL_HISTORY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TobaccooActionTypes.GET_SURGICAL_HISTORY_ERROR,
            payload: error,
        });
    }
}

// Medical HISTORY

function* createMedicalHistoryFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.CREATE_MEDICAL_HISTORY_LOADING,
            payload: {},
        });
        const response = yield call(createMedicalHistoryApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TobaccooActionTypes.CREATE_MEDICAL_HISTORY_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccooActionTypes.CREATE_MEDICAL_HISTORY_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccooActionTypes.CREATE_MEDICAL_HISTORY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: TobaccooActionTypes.CREATE_MEDICAL_HISTORY_ERROR,
            payload: error,
        });
    }
}

function* updateMedicalHistoryFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.UPDATE_MEDICAL_HISTORY_LOADING,
            payload: {},
        });
        const response = yield call(updateMedicalHistoryApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TobaccooActionTypes.UPDATE_MEDICAL_HISTORY_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccooActionTypes.UPDATE_MEDICAL_HISTORY_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccooActionTypes.UPDATE_MEDICAL_HISTORY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TobaccooActionTypes.UPDATE_MEDICAL_HISTORY_ERROR,
            payload: error,
        });
    }
}

function* deleteMedicalHistoryFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.DELETE_MEDICAL_HISTORY_LOADING,
            payload: {},
        });
        const response = yield call(deleteMedicalHistoryApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TobaccooActionTypes.DELETE_MEDICAL_HISTORY_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccooActionTypes.DELETE_MEDICAL_HISTORY_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccooActionTypes.DELETE_MEDICAL_HISTORY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TobaccooActionTypes.DELETE_MEDICAL_HISTORY_ERROR,
            payload: error,
        });
    }
}

function* getMedicalHistoryFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.GET_MEDICAL_HISTORY_LOADING,
            payload: {},
        });
        const response = yield call(getMedicalHistoryApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            yield put({
                type: TobaccooActionTypes.GET_MEDICAL_HISTORY_SUCCESS,
                payload: { ...decryptedData },
            });
            // yield put({
            //     type: TobaccooActionTypes.GET_MEDICAL_HISTORY_RESET,
            //     payload: {},
            // });
        } else {
            yield put({
                type: TobaccooActionTypes.GET_MEDICAL_HISTORY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TobaccooActionTypes.GET_MEDICAL_HISTORY_ERROR,
            payload: error,
        });
    }
}

// SURGICAL HISTORY
function* getAlcoholHistoryFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.GET_ALCOHOL_HISTORY_LOADING,
            payload: {},
        });
        const response = yield call(getAlcoholHistoryApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            yield put({
                type: TobaccooActionTypes.GET_ALCOHOL_HISTORY_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccooActionTypes.GET_ALCOHOL_HISTORY_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccooActionTypes.GET_ALCOHOL_HISTORY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TobaccooActionTypes.GET_ALCOHOL_HISTORY_ERROR,
            payload: error,
        });
    }
}
function* createAlcoholHistoryFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.CREATE_ALCOHOL_HISTORY_LOADING,
            payload: {},
        });
        const response = yield call(createAlcoholHistoryApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TobaccooActionTypes.CREATE_ALCOHOL_HISTORY_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccooActionTypes.CREATE_ALCOHOL_HISTORY_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccooActionTypes.CREATE_ALCOHOL_HISTORY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: TobaccooActionTypes.CREATE_ALCOHOL_HISTORY_ERROR,
            payload: error,
        });
    }
}

function* updateAlcoholHistoryFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.UPDATE_ALCOHOL_HISTORY_LOADING,
            payload: {},
        });
        const response = yield call(updateAlcoholHistoryApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TobaccooActionTypes.UPDATE_ALCOHOL_HISTORY_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccooActionTypes.UPDATE_ALCOHOL_HISTORY_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccooActionTypes.UPDATE_ALCOHOL_HISTORY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TobaccooActionTypes.UPDATE_ALCOHOL_HISTORY_ERROR,
            payload: error,
        });
    }
}

function* deleteAlcoholHistoryFunction(data) {
    try {
        yield put({
            type: TobaccooActionTypes.DELETE_ALCOHOL_HISTORY_LOADING,
            payload: {},
        });
        const response = yield call(deleteAlcoholHistoryApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TobaccooActionTypes.DELETE_ALCOHOL_HISTORY_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TobaccooActionTypes.DELETE_ALCOHOL_HISTORY_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TobaccooActionTypes.DELETE_ALCOHOL_HISTORY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TobaccooActionTypes.DELETE_ALCOHOL_HISTORY_ERROR,
            payload: error,
        });
    }
}



export function* watchCreateTobaccoo() {
    yield takeEvery(TobaccooActionTypes.CREATE_TOBACCOO, createTobaccooFunction);
}

export function* watchUpdateTobaccoo() {
    yield takeEvery(TobaccooActionTypes.UPDATE_TOBACCOO, updateTobaccooFunction);
}

export function* watchDeleteTobaccoo() {
    yield takeEvery(TobaccooActionTypes.DELETE_TOBACCOO, deleteTobaccooFunction);
}

export function* watchGetTobaccoo() {
    yield takeEvery(TobaccooActionTypes.GET_TOBACCOO, getTobaccooFunction);
}

// Family/Genetic
export function* watchCreateFamilyGenetic() {
    yield takeEvery(TobaccooActionTypes.CREATE_FAMILY_GENETIC, createFamilyGeneticFunction);
}

export function* watchUpdateFamilyGenetic() {
    yield takeEvery(TobaccooActionTypes.UPDATE_FAMILY_GENETIC, updateFamilyGeneticFunction);
}

export function* watchGetFamilyGenetic() {
    yield takeEvery(TobaccooActionTypes.GET_FAMILY_GENTIC_DATA, getFamilyGeneticFunction);
}

// SURGICAL HISTORY
export function* watchCreateSurgicalHistory() {
    yield takeEvery(TobaccooActionTypes.CREATE_SURGICAL_HISTORY, createSurgicalHistoryFunction);
}

export function* watchUpdateSurgicalHistory() {
    yield takeEvery(TobaccooActionTypes.UPDATE_SURGICAL_HISTORY, updateSurgicalHistoryFunction);
}

export function* watchGetSurgicalHistory() {
    yield takeEvery(TobaccooActionTypes.GET_SURGICAL_HISTORY, getSurgicalHistoryFunction);
}

export function* watchDeleteSurgicalHistory() {
    yield takeEvery(TobaccooActionTypes.DELETE_SURGICAL_HISTORY, deleteSurgicalHistoryFunction);
}


// MEDICAL HISTORY
export function* watchCreateMedicalHistory() {
    yield takeEvery(TobaccooActionTypes.CREATE_MEDICAL_HISTORY, createMedicalHistoryFunction);
}

export function* watchUpdateMedicalHistory() {
    yield takeEvery(TobaccooActionTypes.UPDATE_MEDICAL_HISTORY, updateMedicalHistoryFunction);
}

export function* watchGetMedicalHistory() {
    yield takeEvery(TobaccooActionTypes.GET_MEDICAL_HISTORY, getMedicalHistoryFunction);
}

export function* watchDeleteMedicalHistory() {
    yield takeEvery(TobaccooActionTypes.DELETE_MEDICAL_HISTORY, deleteMedicalHistoryFunction);
}
// SURGICAL HISTORY
export function* watchCreateAlcoholHistory() {
    yield takeEvery(TobaccooActionTypes.CREATE_ALCOHOL_HISTORY, createAlcoholHistoryFunction);
}

export function* watchUpdateAlcoholHistory() {
    yield takeEvery(TobaccooActionTypes.UPDATE_ALCOHOL_HISTORY, updateAlcoholHistoryFunction);
}

export function* watchGetAlcoholHistory() {
    yield takeEvery(TobaccooActionTypes.GET_ALCOHOL_HISTORY, getAlcoholHistoryFunction);
}

export function* watchDeleteAlcoholHistory() {
    yield takeEvery(TobaccooActionTypes.DELETE_ALCOHOL_HISTORY, deleteAlcoholHistoryFunction);
}

function* clinicalHistorySaga() {
    yield all([
        fork(watchCreateTobaccoo), fork(watchGetTobaccoo), fork(watchDeleteTobaccoo), fork(watchUpdateTobaccoo),
        fork(watchCreateFamilyGenetic), fork(watchUpdateFamilyGenetic), fork(watchGetFamilyGenetic),
        fork(watchCreateSurgicalHistory), fork(watchUpdateSurgicalHistory), fork(watchGetSurgicalHistory), fork(watchDeleteSurgicalHistory),
        fork(watchCreateMedicalHistory), fork(watchUpdateMedicalHistory), fork(watchGetMedicalHistory), fork(watchDeleteMedicalHistory),
        fork(watchCreateAlcoholHistory), fork(watchUpdateAlcoholHistory), fork(watchGetAlcoholHistory), fork(watchDeleteAlcoholHistory)
    ]);
}
export default clinicalHistorySaga;