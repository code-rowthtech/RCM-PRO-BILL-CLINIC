import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { ScheduleActionTypes } from './constants';

import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { createScheduleApi, deleteScheduleApi, getDoctorsListApi, getScheduleApi } from './api';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* createScheduleFunction(data) {
    try {
        yield put({
            type: ScheduleActionTypes.CREATE_SCHEDULE_LOADING,
            payload: {},
        });
        const response = yield call(createScheduleApi, data);
        const decryptedData = JSON.parse(decryptMessage(response?.data?.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ScheduleActionTypes.CREATE_SCHEDULE_SUCCESS,
                payload: { response },
            });
        } else {
            yield put({
                type: ScheduleActionTypes.CREATE_SCHEDULE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ScheduleActionTypes.CREATE_SCHEDULE_ERROR,
            payload: error,
        });
    }
}

function* getDoctorListFunction(data) {
    try {
        yield put({
            type: ScheduleActionTypes.GET_DOCTORS_LIST_LOADING,
            payload: {},

        });
        const response = yield call(getDoctorsListApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: ScheduleActionTypes.GET_DOCTORS_LIST_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ScheduleActionTypes.GET_DOCTORS_LIST_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: ScheduleActionTypes.GET_DOCTORS_LIST_ERROR,
            payload: error,
        });
    }
}

function* getScheduleFunction(data) {
    try {
        yield put({
            type: ScheduleActionTypes.GET_SCHEDULE_LOADING,
            payload: {},

        });
        const response = yield call(getScheduleApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: ScheduleActionTypes.GET_SCHEDULE_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ScheduleActionTypes.GET_SCHEDULE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: ScheduleActionTypes.GET_SCHEDULE_ERROR,
            payload: error,
        });
    }
}


function* deleteScheduleFunction(data) {
    try {
        yield put({
            type: ScheduleActionTypes.DELETE_SCHEDULE_LOADING,
            payload: {},
        });
        const response = yield call(deleteScheduleApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ScheduleActionTypes.DELETE_SCHEDULE_SUCCESS,
                payload: { response },
            });
        } else {
            yield put({
                type: ScheduleActionTypes.DELETE_SCHEDULE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error?.message, 'danger');
        yield put({
            type: ScheduleActionTypes.DELETE_SCHEDULE_ERROR,
            payload: error,
        });
    }
}
export function* watchSchedule() {
    yield takeEvery(ScheduleActionTypes.CREATE_SCHEDULE, createScheduleFunction);
}
export function* watchGetDoctorsList() {
    yield takeEvery(ScheduleActionTypes.GET_DOCTORS_LIST, getDoctorListFunction);
}

export function* watchGetSchedule() {
    yield takeEvery(ScheduleActionTypes.GET_SCHEDULE, getScheduleFunction);
}

export function* watchdeleteSchedule() {
    yield takeEvery(ScheduleActionTypes.DELETE_SCHEDULE, deleteScheduleFunction);
}

function* scheduleSaga() {
    yield all([
        fork(watchSchedule),
        fork(watchGetDoctorsList),
        fork(watchGetSchedule),
        fork(watchdeleteSchedule),
    ]);
}
export default scheduleSaga;