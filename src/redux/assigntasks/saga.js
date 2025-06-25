import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { createTaskApi, getClinicEmployeesApi, getTaskApi, getTaskDetailsApi, updateTaskApi, } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { ClinicNotesActionTypes } from './constants';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* getClinicEmployeesFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.GET_CLINIC_EMPLOYEES_LOADING,
            payload: {},
        });
        const response = yield call(getClinicEmployeesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: ClinicNotesActionTypes.GET_CLINIC_EMPLOYEES_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.GET_CLINIC_EMPLOYEES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: ClinicNotesActionTypes.GET_CLINIC_EMPLOYEES_ERROR,
            payload: error,
        });
    }
}

function* createTaskFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.CREATE_TASK_LOADING,
            payload: {},
        });
        const response = yield call(createTaskApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicNotesActionTypes.CREATE_TASK_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.CREATE_TASK_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ClinicNotesActionTypes.CREATE_TASK_ERROR,
            payload: error,
        });
    }
}

function* getTaskFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.GET_TASK_LOADING,
            payload: {},
        });
        const response = yield call(getTaskApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicNotesActionTypes.GET_TASK_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.GET_TASK_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ClinicNotesActionTypes.GET_TASK_ERROR,
            payload: error,
        });
    }
}

function* updateTaskFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.UPDATE_TASK_LOADING,
            payload: {},
        });
        const response = yield call(updateTaskApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicNotesActionTypes.UPDATE_TASK_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.UPDATE_TASK_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ClinicNotesActionTypes.UPDATE_TASK_ERROR,
            payload: error,
        });
    }
}

function* getTaskDetailsFunction(data) {
    try {
        yield put({
            type: ClinicNotesActionTypes.GET_TASK_DETAILS_LOADING,
            payload: {},
        });
        const response = yield call(getTaskDetailsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicNotesActionTypes.GET_TASK_DETAILS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicNotesActionTypes.GET_TASK_DETAILS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ClinicNotesActionTypes.GET_TASK_DETAILS_ERROR,
            payload: error,
        });
    }
}
export function* callResetUpdate() {
    put({
        type: ClinicNotesActionTypes.RESET_UPDATE_STATUS,
        payload: {},
    });

}


export function* watchClinicEmployees() {
    yield takeEvery(ClinicNotesActionTypes.GET_CLINIC_EMPLOYEES, getClinicEmployeesFunction);
}

export function* watchCreateTask() {
    yield takeEvery(ClinicNotesActionTypes.CREATE_TASK, createTaskFunction);
}

export function* watchGetTask() {
    yield takeEvery(ClinicNotesActionTypes.GET_TASK, getTaskFunction);
}

export function* watchUpdateTask() {
    yield takeEvery(ClinicNotesActionTypes.UPDATE_TASK, updateTaskFunction);
}
export function* watchGetTaskDetails() {
    yield takeEvery(ClinicNotesActionTypes.GET_TASK_DETAILS, getTaskDetailsFunction);
}
function* clinicNotesSaga() {
    yield all([
        fork(watchClinicEmployees),
        fork(watchCreateTask),
        fork(watchGetTask),
        fork(watchUpdateTask),
        fork(watchGetTaskDetails)

    ]);
}
export default clinicNotesSaga;