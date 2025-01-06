import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { AppointmentActionTypes } from './constants';
import { createAppointmentApi, getAppointmentsApi, getPractitionerScheduleApi } from './api';
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
        yield put({
            type: AppointmentActionTypes.GET_APPOINTMENT_ERROR,
            payload: error,
        });
    }
}




export function* watchCreateAppointment() {
    yield takeEvery(AppointmentActionTypes.CREATE_APPOINTMENT, createAppointmentFunction);
}

export function* watchGetPractitionerScedule() {
    yield takeEvery(AppointmentActionTypes.GET_PRACTITIONER_SCHEDULE, getPractitionerScheduleFunction);
}

export function* watchGetAppointments() {
    yield takeEvery(AppointmentActionTypes.GET_APPOINTMENT, getAppointmentsFunction);
}





function* appointentsSaga() {
    yield all([
        fork(watchCreateAppointment),
        fork(watchGetPractitionerScedule),
        fork(watchGetAppointments),
    ]);
}
export default appointentsSaga;
