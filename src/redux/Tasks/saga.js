import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { TaskConstantTypes } from './constants';
import {
    createUserTasksApi,
    getUserTaskByIdApi,
    getUserTasksApi,
    updateUserTasksApi,
} from './api';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createUserTasksFunction(data) {
    try {
        yield put({
            type: TaskConstantTypes.CREATE_USER_TASKS_LOADING,
            payload: {},
        });
        const response = yield call(createUserTasksApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TaskConstantTypes.CREATE_USER_TASKS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TaskConstantTypes.CREATE_USER_TASKS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TaskConstantTypes.CREATE_USER_TASKS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: TaskConstantTypes.CREATE_USER_TASKS_ERROR,
            payload: error,
        });
    }
}

function* updateUserTasksFunction(data) {
    try {
        yield put({
            type: TaskConstantTypes.UPDATE_USER_TASKS_LOADING,
            payload: {},
        });
        const response = yield call(updateUserTasksApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: TaskConstantTypes.UPDATE_USER_TASKS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: TaskConstantTypes.UPDATE_USER_TASKS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: TaskConstantTypes.UPDATE_USER_TASKS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: TaskConstantTypes.UPDATE_USER_TASKS_ERROR,
            payload: error,
        });
    }
}

function* getUserTasksFunction(data) {
    try {
        yield put({
            type: TaskConstantTypes.GET_USER_TASKS_LOADING,
            payload: {},
        });
        const response = yield call(getUserTasksApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: TaskConstantTypes.GET_USER_TASKS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: TaskConstantTypes.GET_USER_TASKS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TaskConstantTypes.GET_USER_TASKS_ERROR,
            payload: error,
        });
    }
}

function* getTaskByIdFunction(data) {
    try {
        yield put({
            type: TaskConstantTypes.GET_TASK_BY_ID_LOADING,
            payload: {},
        });
        const response = yield call(getUserTaskByIdApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: TaskConstantTypes.GET_TASK_BY_ID_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: TaskConstantTypes.GET_TASK_BY_ID_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: TaskConstantTypes.GET_TASK_BY_ID_ERROR,
            payload: error,
        });
    }
}


export function* watchCreateUserTasks() {
    yield takeEvery(TaskConstantTypes.CREATE_USER_TASKS, createUserTasksFunction);
}

export function* watchUpdateUserTasks() {
    yield takeEvery(TaskConstantTypes.UPDATE_USER_TASKS, updateUserTasksFunction);
}

export function* watchGetUserTasks() {
    yield takeEvery(TaskConstantTypes.GET_USER_TASKS, getUserTasksFunction);
}

export function* watchGetUserTaskById() {
    yield takeEvery(TaskConstantTypes.GET_TASK_BY_ID, getTaskByIdFunction);
}


function* userTasksSaga() {
    yield all([
        fork(watchCreateUserTasks),
        fork(watchUpdateUserTasks),
        fork(watchGetUserTasks),
        fork(watchGetUserTaskById),
    ]);
}
export default userTasksSaga;
