import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { ScheduleActionTypes } from './constants';

import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { createScheduleApi, getDoctorsListApi } from './api';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* createScheduleFunction(data) {
    try {
        yield put({
            type: ScheduleActionTypes.GET_SCHEDULE_LOADING,
            payload: {},
        });
        const response = yield call(createScheduleApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: ScheduleActionTypes.GET_SCHEDULE_SUCCESS,
                payload: { response },
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


export function* watchSchedule() {
    yield takeEvery(ScheduleActionTypes.GET_SCHEDULE, createScheduleFunction);
}
export function* watchGetDoctorsList() {
    yield takeEvery(ScheduleActionTypes.GET_DOCTORS_LIST, getDoctorListFunction);
}

function* scheduleSaga() {
    yield all([
        fork(watchSchedule), 
        fork(watchGetDoctorsList)
    ]);
}
export default scheduleSaga;