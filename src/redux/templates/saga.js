import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { TemplateActionTypes } from './constants';
import {
    createTemplateApi,
    deleteTemplateApi,
    getTemplateApi,
    updateTemplateApi,
} from './api';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createTemplateFunction(data) {
    try {
        yield put({
            type: TemplateActionTypes.CREATE_TEMPLATE_LOADING,
            payload: {},
        });
        const response = yield call(createTemplateApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle('Template created successfully !', 'success');
            yield put({
                type: TemplateActionTypes.CREATE_TEMPLATE_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TemplateActionTypes.CREATE_TEMPLATE_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TemplateActionTypes.CREATE_TEMPLATE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: TemplateActionTypes.CREATE_TEMPLATE_ERROR,
            payload: error,
        });
    }
}

function* updateTemplateFunction(data) {
    try {
        yield put({
            type: TemplateActionTypes.UPDATE_TEMPLATE_LOADING,
            payload: {},
        });
        const response = yield call(updateTemplateApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response?.status === 200) {
            ToastHandle('Template updated successfully !', 'success');
            yield put({
                type: TemplateActionTypes.UPDATE_TEMPLATE_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TemplateActionTypes.UPDATE_TEMPLATE_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TemplateActionTypes.UPDATE_TEMPLATE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TemplateActionTypes.UPDATE_TEMPLATE_ERROR,
            payload: error,
        });
    }
}

function* deleteTemplateFunction(data) {
    try {
        yield put({
            type: TemplateActionTypes.DELETE_TEMPLATE_LOADING,
            payload: {},
        });
        const response = yield call(deleteTemplateApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response?.status === 200) {
            ToastHandle('Template updated successfully !', 'success');
            yield put({
                type: TemplateActionTypes.DELETE_TEMPLATE_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TemplateActionTypes.DELETE_TEMPLATE_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TemplateActionTypes.DELETE_TEMPLATE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TemplateActionTypes.DELETE_TEMPLATE_ERROR,
            payload: error,
        });
    }
}

function* getTemplateFunction(data) {
    try {
        yield put({
            type: TemplateActionTypes.GET_TEMPLATE_LOADING,
            payload: {},
        });
        const response = yield call(getTemplateApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            yield put({
                type: TemplateActionTypes.GET_TEMPLATE_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: TemplateActionTypes.GET_TEMPLATE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TemplateActionTypes.GET_TEMPLATE_ERROR,
            payload: error,
        });
    }
}


export function* watchCreateTemplate() {
    yield takeEvery(TemplateActionTypes.CREATE_TEMPLATE, createTemplateFunction);
}

export function* watchUpdateTemplate() {
    yield takeEvery(TemplateActionTypes.UPDATE_TEMPLATE, updateTemplateFunction);
}

export function* watchDeleteTemplate() {
    yield takeEvery(TemplateActionTypes.DELETE_TEMPLATE, deleteTemplateFunction);
}

export function* watchGetTemplate() {
    yield takeEvery(TemplateActionTypes.GET_TEMPLATE, getTemplateFunction);
}

function* templateSaga() {
    yield all([
        fork(watchCreateTemplate),
        fork(watchUpdateTemplate),
        fork(watchDeleteTemplate),
        fork(watchGetTemplate),
    ]);
}
export default templateSaga;
