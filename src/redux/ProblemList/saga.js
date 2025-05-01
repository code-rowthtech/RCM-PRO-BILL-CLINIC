import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { ProblemListActionTypes } from './constants';
import {
    createProblemListApi,
    deleteProblemListApi,
    getAllCodeApi,
    getPatientAppointmentsApi,
    getProblemDetailsApi,
    getProblemListApi,
    updateProblemListApi,
} from './api';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* getProblemListFunction(data) {
    try {
        yield put({
            type: ProblemListActionTypes.GET_PROBLEM_LIST_LOADING,
            payload: {},
        });
        const response = yield call(getProblemListApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: ProblemListActionTypes.GET_PROBLEM_LIST_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ProblemListActionTypes.GET_PROBLEM_LIST_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: ProblemListActionTypes.GET_PROBLEM_LIST_ERROR,
            payload: error,
        });
    }
}

function* createProblemListFunction(data) {
    try {
        yield put({
            type: ProblemListActionTypes.CREATE_PROBLEM_LIST_LOADING,
            payload: {},
        });
        const response = yield call(createProblemListApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ProblemListActionTypes.CREATE_PROBLEM_LIST_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: ProblemListActionTypes.CREATE_PROBLEM_LIST_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: ProblemListActionTypes.CREATE_PROBLEM_LIST_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ProblemListActionTypes.CREATE_PROBLEM_LIST_ERROR,
            payload: error,
        });
    }
}

function* deleteProblemFunction(data) {
    try {
        yield put({
            type: ProblemListActionTypes.DELETE_PROBLEM_LIST_LOADING,
            payload: {},
        });
        const response = yield call(deleteProblemListApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response?.status === 200) {
            ToastHandle(decryptedData?.message, 'danger');
            yield put({
                type: ProblemListActionTypes.DELETE_PROBLEM_LIST_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: ProblemListActionTypes.DELETE_PROBLEM_LIST_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: ProblemListActionTypes.DELETE_PROBLEM_LIST_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ProblemListActionTypes.DELETE_PROBLEM_LIST_ERROR,
            payload: error,
        });
    }
}
function* updateProblemListFunction(data) {
    try {
        yield put({
            type: ProblemListActionTypes.UPDATE_PROBLEM_LIST_LOADING,
            payload: {},
        });
        const response = yield call(updateProblemListApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ProblemListActionTypes.UPDATE_PROBLEM_LIST_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: ProblemListActionTypes.UPDATE_PROBLEM_LIST_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: ProblemListActionTypes.UPDATE_PROBLEM_LIST_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ProblemListActionTypes.UPDATE_PROBLEM_LIST_ERROR,
            payload: error,
        });
    }
}

function* getAllCodesFunction(data) {
    try {
        yield put({
            type: ProblemListActionTypes.ALL_CODES_LOADING,
            payload: {},
        });
        const response = yield call(getAllCodeApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: ProblemListActionTypes.ALL_CODES_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ProblemListActionTypes.ALL_CODES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: ProblemListActionTypes.ALL_CODES_ERROR,
            payload: error,
        });
    }
}

function* getPatientAppointmentFunction(data) {
    try {
        yield put({
            type: ProblemListActionTypes.GET_PATIENTS_APPOINTMENT_LOADING,
            payload: {},
        });
        const response = yield call(getPatientAppointmentsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: ProblemListActionTypes.GET_PATIENTS_APPOINTMENT_SUCCESS,
                payload: decryptedData, // ✅ FIXED
            });
        } else {
            yield put({
                type: ProblemListActionTypes.GET_PATIENTS_APPOINTMENT_ERROR,
                payload: decryptedData,
            });
        }
    } catch (error) {
        yield put({
            type: ProblemListActionTypes.GET_PATIENTS_APPOINTMENT_ERROR,
            payload: error,
        });
    }
}

function* getProblemDetailsFunction(data) {
    try {
        yield put({
            type: ProblemListActionTypes.GET_PROBLEM_DETAILS_LOADING,
            payload: {},
        });
        const response = yield call(getProblemDetailsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ProblemListActionTypes.GET_PROBLEM_DETAILS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ProblemListActionTypes.GET_PROBLEM_DETAILS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ProblemListActionTypes.GET_PROBLEM_DETAILS_ERROR,
            payload: error,
        });
    }
}

export function* callResetUpdate() {
    put({
        type: ProblemListActionTypes.RESET_UPDATE_STATUS,
        payload: {},
    });
}

export function* watchGetProblemList() {
    yield takeEvery(ProblemListActionTypes.GET_PROBLEM_LIST, getProblemListFunction);
}

export function* watchCreateProblemListTask() {
    yield takeEvery(ProblemListActionTypes.CREATE_PROBLEM_LIST, createProblemListFunction);
}

export function* watchDeleteProblemList() {
    yield takeEvery(ProblemListActionTypes.DELETE_PROBLEM_LIST, deleteProblemFunction);
}

export function* watchUpdateProblemList() {
    yield takeEvery(ProblemListActionTypes.UPDATE_PROBLEM_LIST, updateProblemListFunction);
}

export function* watchAllCode() {
    yield takeEvery(ProblemListActionTypes.ALL_CODES, getAllCodesFunction);
}

export function* watchPatientAppointment() {
    yield takeEvery(ProblemListActionTypes.GET_PATIENTS_APPOINTMENT, getPatientAppointmentFunction);
}

export function* watchProblemDetailsAppointment() {
    yield takeEvery(ProblemListActionTypes.GET_PROBLEM_DETAILS, getProblemDetailsFunction);
}
function* ProblemListSaga() {
    yield all([
        fork(watchGetProblemList),
        fork(watchCreateProblemListTask),
        fork(watchDeleteProblemList),
        fork(watchUpdateProblemList),
        fork(watchAllCode),
        fork(watchPatientAppointment),
        fork(watchProblemDetailsAppointment),
    ]);
}
export default ProblemListSaga;
