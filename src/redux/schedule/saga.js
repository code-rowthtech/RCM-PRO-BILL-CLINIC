import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { ScheduleActionTypes } from './constants';

import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import {
    createScheduleApi,
    createTimingsApi,
    deleteScheduleApi,
    getDoctorsListApi,
    getPractitionerTimingsApi,
    getScheduleApi,
    updateTimingsApi,
} from './api';
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
            yield put({
                type: ScheduleActionTypes.CREATE_SCHEDULE_RESET,
                payload: {},
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
function* createTimingsFunction(data) {
    try {
        yield put({
            type: ScheduleActionTypes.CREATE_TIMINGS_LOADING,
            payload: {},
        });
        const response = yield call(createTimingsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response?.data?.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ScheduleActionTypes.CREATE_TIMINGS_SUCCESS,
                payload: { response },
            });
            yield put({
                type: ScheduleActionTypes.CREATE_TIMINGS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: ScheduleActionTypes.CREATE_TIMINGS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ScheduleActionTypes.CREATE_TIMINGS_ERROR,
            payload: error,
        });
    }
}
function* updateTimingsFunction(data) {
    try {
        yield put({
            type: ScheduleActionTypes.UPDATE_TIMINGS_LOADING,
            payload: {},
        });
        const response = yield call(updateTimingsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response?.data?.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ScheduleActionTypes.UPDATE_TIMINGS_SUCCESS,
                payload: { response },
            });
            yield put({
                type: ScheduleActionTypes.UPDATE_TIMINGS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: ScheduleActionTypes.UPDATE_TIMINGS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ScheduleActionTypes.UPDATE_TIMINGS_ERROR,
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
            // yield put({
            //     type: ScheduleActionTypes.GET_DOCTORS_LIST_RESET,
            //     payload: {},
            // });
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
            // yield put({
            //     type: ScheduleActionTypes.GET_SCHEDULE_RESET,
            //     payload: {},
            // });
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

function* getPractitionerTimingsFunction(data) {
    try {
        yield put({
            type: ScheduleActionTypes.GET_PRACTITIONER_TIMINGS_LOADING,
            payload: {},
        });
        const response = yield call(getPractitionerTimingsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: ScheduleActionTypes.GET_PRACTITIONER_TIMINGS_SUCCESS,
                payload: { ...decryptedData },
            });
            // yield put({
            //     type: ScheduleActionTypes.GET_PRACTITIONER_TIMINGS_RESET,
            //     payload: {},
            // });
        } else {
            yield put({
                type: ScheduleActionTypes.GET_PRACTITIONER_TIMINGS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: ScheduleActionTypes.GET_PRACTITIONER_TIMINGS_ERROR,
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
            yield put({
                type: ScheduleActionTypes.DELETE_SCHEDULE_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: ScheduleActionTypes.DELETE_SCHEDULE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: ScheduleActionTypes.DELETE_SCHEDULE_ERROR,
            payload: error,
        });
    }
}
export function* watchSchedule() {
    yield takeEvery(ScheduleActionTypes.CREATE_SCHEDULE, createScheduleFunction);
}
export function* watchCreateTimings() {
    yield takeEvery(ScheduleActionTypes.CREATE_TIMINGS, createTimingsFunction);
}
export function* watchUpdateTimings() {
    yield takeEvery(ScheduleActionTypes.UPDATE_TIMINGS, updateTimingsFunction);
}
export function* watchGetDoctorsList() {
    yield takeEvery(ScheduleActionTypes.GET_DOCTORS_LIST, getDoctorListFunction);
}

export function* watchGetSchedule() {
    yield takeEvery(ScheduleActionTypes.GET_SCHEDULE, getScheduleFunction);
}

export function* watchGetPractitionerTimings() {
    yield takeEvery(ScheduleActionTypes.GET_PRACTITIONER_TIMINGS, getPractitionerTimingsFunction);
}

export function* watchdeleteSchedule() {
    yield takeEvery(ScheduleActionTypes.DELETE_SCHEDULE, deleteScheduleFunction);
}

function* scheduleSaga() {
    yield all([
        fork(watchSchedule),
        fork(watchCreateTimings),
        fork(watchUpdateTimings),
        fork(watchGetDoctorsList),
        fork(watchGetSchedule),
        fork(watchGetPractitionerTimings),
        fork(watchdeleteSchedule),
    ]);
}
export default scheduleSaga;
