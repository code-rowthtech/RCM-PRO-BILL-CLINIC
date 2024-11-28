import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { ScheduleActionTypes } from './constants';

import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { createScheduleApi } from './api';
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


export function* watchSchedule() {
    yield takeEvery(ScheduleActionTypes.GET_SCHEDULE, createScheduleFunction);
}


function* scheduleSaga() {
    yield all([
        fork(watchSchedule), 
    ]);
}
export default scheduleSaga;