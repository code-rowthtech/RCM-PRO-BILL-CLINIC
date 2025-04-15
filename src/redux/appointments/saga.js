import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { AppointmentActionTypes } from './constants';
import { createAppointmentApi, getAppointmentByIdApi, getAppointmentsApi, getPractitionerScheduleApi, getPractitionerSlotsApi, rescheduleAppointmentApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* createAppointmentFunction(data) {
    try {
        yield put({
            type: AppointmentActionTypes.CREATE_APPOINTMENT_LOADING,
            payload: {},
        });
        const response = yield call(createAppointmentApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success')
            yield put({
                type: AppointmentActionTypes.CREATE_APPOINTMENT_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: AppointmentActionTypes.CREATE_APPOINTMENT_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: AppointmentActionTypes.CREATE_APPOINTMENT_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: AppointmentActionTypes.CREATE_APPOINTMENT_ERROR,
            payload: error,
        });
    }
}

function* rescheduleAppointmentFunction(data) {
    try {
        yield put({
            type: AppointmentActionTypes.RESCHEDULE_APPOINTMENT_LOADING,
            payload: {},
        });
        const response = yield call(rescheduleAppointmentApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success')
            yield put({
                type: AppointmentActionTypes.RESCHEDULE_APPOINTMENT_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: AppointmentActionTypes.RESCHEDULE_APPOINTMENT_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: AppointmentActionTypes.RESCHEDULE_APPOINTMENT_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: AppointmentActionTypes.RESCHEDULE_APPOINTMENT_ERROR,
            payload: error,
        });
    }
}

function* getPractitionerScheduleFunction(data) {
    try {
        yield put({
            type: AppointmentActionTypes.GET_PRACTITIONER_SCHEDULE_LOADING,
            payload: {},
        });
        const response = yield call(getPractitionerScheduleApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success')
            yield put({
                type: AppointmentActionTypes.GET_PRACTITIONER_SCHEDULE_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: AppointmentActionTypes.GET_PRACTITIONER_SCHEDULE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: AppointmentActionTypes.GET_PRACTITIONER_SCHEDULE_ERROR,
            payload: error,
        });
    }
}

function* getPractitionerSlotsFunction(data) {
    try {
        yield put({
            type: AppointmentActionTypes.GET_PRACTITIONER_SLOTS_LOADING,
            payload: {},
        });
        const response = yield call(getPractitionerSlotsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success')
            yield put({
                type: AppointmentActionTypes.GET_PRACTITIONER_SLOTS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: AppointmentActionTypes.GET_PRACTITIONER_SLOTS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger')
        yield put({
            type: AppointmentActionTypes.GET_PRACTITIONER_SLOTS_ERROR,
            payload: error,
        });
    }
}
function* getAppointmentsFunction(data) {
    try {
        yield put({
            type: AppointmentActionTypes.GET_APPOINTMENT_LOADING,
            payload: {},
        });
        const response = yield call(getAppointmentsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success')
            yield put({
                type: AppointmentActionTypes.GET_APPOINTMENT_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: AppointmentActionTypes.GET_APPOINTMENT_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger')
        yield put({
            type: AppointmentActionTypes.GET_APPOINTMENT_ERROR,
            payload: error,
        });
    }
}

function* getAppointmentByIdFunction(data) {
    try {
        yield put({
            type: AppointmentActionTypes.GET_APPOINTMENT_BY_ID_LOADING,
            payload: {},
        });
        const response = yield call(getAppointmentByIdApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success')
            yield put({
                type: AppointmentActionTypes.GET_APPOINTMENT_BY_ID_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: AppointmentActionTypes.GET_APPOINTMENT_BY_ID_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: AppointmentActionTypes.GET_APPOINTMENT_BY_ID_ERROR,
            payload: error,
        });
    }
}


export function* callResetUpdate() {
    put({
        type: AppointmentActionTypes.RESET_UPDATE_STATUS,
        payload: {},
    });

}

export function* watchCreateAppointment() {
    yield takeEvery(AppointmentActionTypes.CREATE_APPOINTMENT, createAppointmentFunction);
}

export function* watchRescheduleAppointment() {
    yield takeEvery(AppointmentActionTypes.RESCHEDULE_APPOINTMENT, rescheduleAppointmentFunction);
}

export function* watchGetPractitionerScedule() {
    yield takeEvery(AppointmentActionTypes.GET_PRACTITIONER_SCHEDULE, getPractitionerScheduleFunction);
}

export function* watchGetPractitionerSlots() {
    yield takeEvery(AppointmentActionTypes.GET_PRACTITIONER_SLOTS, getPractitionerSlotsFunction);
}

export function* watchGetAppointments() {
    yield takeEvery(AppointmentActionTypes.GET_APPOINTMENT, getAppointmentsFunction);
}

export function* watchGetAppointmentById() {
    yield takeEvery(AppointmentActionTypes.GET_APPOINTMENT_BY_ID, getAppointmentByIdFunction);
}





function* appointentsSaga() {
    yield all([
        fork(watchCreateAppointment),
        fork(watchRescheduleAppointment),
        fork(watchGetPractitionerScedule),
        fork(watchGetPractitionerSlots),
        fork(watchGetAppointments),
        fork(watchGetAppointmentById),
    ]);
}
export default appointentsSaga;
