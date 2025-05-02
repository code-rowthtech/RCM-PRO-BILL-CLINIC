import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { TobaccooActionTypes } from './constants';
import {
    createFamilyGeneticApi,
    createTobaccooApi,
    getFamilyGeneticApi,
    getTobaccooApi,
    updateFamilyGeneticApi,
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
        if (response.status === 201) {
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

export function* watchCreateTobaccoo() {
    yield takeEvery(TobaccooActionTypes.CREATE_TOBACCOO, createTobaccooFunction);
}

export function* watchUpdateTobaccoo() {
    yield takeEvery(TobaccooActionTypes.UPDATE_TOBACCOO, updateTobaccooFunction);
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

function* clinicalHistorySaga() {
    yield all([
        fork(watchCreateTobaccoo),
        fork(watchGetTobaccoo),
        fork(watchUpdateTobaccoo),
        fork(watchCreateFamilyGenetic),
        fork(watchUpdateFamilyGenetic),
        fork(watchGetFamilyGenetic),
    ]);
}
export default clinicalHistorySaga;
