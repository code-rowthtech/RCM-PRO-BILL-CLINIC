import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { TaskConstantTypes } from './constants';
import {
    createUserTasksApi,
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


export function* watchCreateUserTasks() {
    yield takeEvery(TaskConstantTypes.CREATE_USER_TASKS, createUserTasksFunction);
}


function* userTasksSaga() {
    yield all([
        fork(watchCreateUserTasks),
    ]);
}
export default userTasksSaga;
