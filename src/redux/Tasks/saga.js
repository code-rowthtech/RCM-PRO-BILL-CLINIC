import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { TaskConstantTypes } from './constants';
import {
    createTasksApi,
    deleteTasksApi,
    getTasksDetailsApi,
    updateTasksApi,
} from './api';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createTasksFunction(data) {
    try {
        yield put({
            type: TaskConstantTypes.CREATE_TASKS_LOADING,
            payload: {},
        });
        const response = yield call(createTasksApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TaskConstantTypes.CREATE_TASKS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TaskConstantTypes.CREATE_TASKS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TaskConstantTypes.CREATE_TASKS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: TaskConstantTypes.CREATE_TASKS_ERROR,
            payload: error,
        });
    }
}

function* getTasksDetailsFunction(data) {
    try {
        yield put({
            type: TaskConstantTypes.GET_TASKS_DETAILS_LOADING,
            payload: {},
        });
        const response = yield call(getTasksDetailsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TaskConstantTypes.GET_TASKS_DETAILS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TaskConstantTypes.GET_TASKS_DETAILS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TaskConstantTypes.GET_TASKS_DETAILS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        // ToastHandle(error, 'danger');
        yield put({
            type: TaskConstantTypes.GET_TASKS_DETAILS_ERROR,
            payload: error,
        });
    }
}


function* updateTasksFunction(data) {
    try {
        yield put({
            type: TaskConstantTypes.UPDATE_TASKS_LOADING,
            payload: {},
        });
        const response = yield call(updateTasksApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TaskConstantTypes.UPDATE_TASKS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TaskConstantTypes.UPDATE_TASKS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TaskConstantTypes.UPDATE_TASKS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: TaskConstantTypes.UPDATE_TASKS_ERROR,
            payload: error,
        });
    }
}

function* deleteTasksFunction(data) {
    try {
        yield put({
            type: TaskConstantTypes.DELETE_TASKS_LOADING,
            payload: {},
        });
        const response = yield call(deleteTasksApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response?.status === 200) {
            ToastHandle(decryptedData?.message, 'danger');
            yield put({
                type: TaskConstantTypes.DELETE_TASKS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TaskConstantTypes.DELETE_TASKS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TaskConstantTypes.DELETE_TASKS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: TaskConstantTypes.DELETE_TASKS_ERROR,
            payload: error,
        });
    }
}

export function* callResetUpdate() {
    put({
        type: TaskConstantTypes.RESET_UPDATE_STATUS,
        payload: {},
    });
}

export function* watchCreateTasks() {
    yield takeEvery(TaskConstantTypes.CREATE_TASKS, createTasksFunction);
}

export function* watchGetTasksDetails() {
    yield takeEvery(TaskConstantTypes.GET_TASKS_DETAILS, getTasksDetailsFunction);
}

export function* watchUpdateTasks() {
    yield takeEvery(TaskConstantTypes.UPDATE_TASKS, updateTasksFunction);
}

export function* watchDeleteTasks() {
    yield takeEvery(TaskConstantTypes.DELETE_TASKS, deleteTasksFunction);
}
function* tasksSaga() {
    yield all([
        fork(watchCreateTasks),
        fork(watchGetTasksDetails),
        fork(watchUpdateTasks),
        fork(watchDeleteTasks),
    ]);
}
export default tasksSaga;
