import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { TobaccooActionTypes } from './constants';
import {
    createTobaccooApi,
    getTobaccooApi,
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




export function* watchCreateTobaccoo() {
    yield takeEvery(TobaccooActionTypes.CREATE_TOBACCOO, createTobaccooFunction);
}

export function* watchUpdateTobaccoo() {
    yield takeEvery(TobaccooActionTypes.UPDATE_TOBACCOO, updateTobaccooFunction);
}

export function* watchGetTobaccoo() {
    yield takeEvery(TobaccooActionTypes.GET_TOBACCOO, getTobaccooFunction);
}



function* clinicalHistorySaga() {
    yield all([
        fork(watchCreateTobaccoo),
        fork(watchGetTobaccoo),
        fork(watchUpdateTobaccoo),
    ]);
}
export default clinicalHistorySaga;
