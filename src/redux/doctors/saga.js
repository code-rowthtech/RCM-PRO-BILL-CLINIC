import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { DoctorsActionTypes } from './constants';
import { addReferringDoctorApi, createDoctorApi, createDoctorDetailApi, getDoctorsApi, getDoctorsDetailApi, getDoctorsRolesApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* getDoctorsFunction(data) {
    try {
        yield put({
            type: DoctorsActionTypes.GET_DOCTORS_LOADING,
            payload: {},
        });
        const response = yield call(getDoctorsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: DoctorsActionTypes.GET_DOCTORS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: DoctorsActionTypes.GET_DOCTORS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: DoctorsActionTypes.GET_DOCTORS_ERROR,
            payload: error,
        });
    }
}

function* getDoctorsRoleFunction(data) {
    try {
        yield put({
            type: DoctorsActionTypes.GET_DOCTORS_ROLES_LOADING,
            payload: {},
        });
        const response = yield call(getDoctorsRolesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: DoctorsActionTypes.GET_DOCTORS_ROLES_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: DoctorsActionTypes.GET_DOCTORS_ROLES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: DoctorsActionTypes.GET_DOCTORS_ROLES_ERROR,
            payload: error,
        });
    }
}


function* createDoctorsFunction(data) {
    try {
        yield put({
            type: DoctorsActionTypes.CREATE_DOCTORS_LOADING,
            payload: {},
        });
        const response = yield call(createDoctorApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData.message, 'success')
            yield put({
                type: DoctorsActionTypes.CREATE_DOCTORS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: DoctorsActionTypes.CREATE_DOCTORS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: DoctorsActionTypes.CREATE_DOCTORS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger')
        yield put({
            type: DoctorsActionTypes.CREATE_DOCTORS_ERROR,
            payload: error,
        });
    }
}

function* createDoctorsDetailFunction(data) {
    try {
        yield put({
            type: DoctorsActionTypes.CREATE_DOCTORS_DETAIL_LOADING,
            payload: {},
        });
        const response = yield call(createDoctorDetailApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData.message, 'success')
            yield put({
                type: DoctorsActionTypes.CREATE_DOCTORS_DETAIL_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: DoctorsActionTypes.CREATE_DOCTORS_DETAIL_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: DoctorsActionTypes.CREATE_DOCTORS_DETAIL_ERROR,
                payload: { ...decryptedData },
            });
        }

    } catch (error) {
        ToastHandle(error, 'danger')
        yield put({
            type: DoctorsActionTypes.CREATE_DOCTORS_DETAIL_ERROR,
            payload: error,
        });
    }
}

function* getDoctorDetailsFunction(data) {
    try {
        yield put({
            type: DoctorsActionTypes.GET_DOCTORS_DETAILS_LOADING,
            payload: {},
        });
        const response = yield call(getDoctorsDetailApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: DoctorsActionTypes.GET_DOCTORS_DETAILS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: DoctorsActionTypes.GET_DOCTORS_DETAILS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: DoctorsActionTypes.GET_DOCTORS_DETAILS_ERROR,
            payload: error,
        });
    }
}

function* addReferringDoctorFunction(data) {
    try {
        yield put({
            type: DoctorsActionTypes.ADD_REFERRING_DOCTOR_LOADING,
            payload: {},
        });
        const response = yield call(addReferringDoctorApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData.message, 'success')
            yield put({
                type: DoctorsActionTypes.ADD_REFERRING_DOCTOR_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: DoctorsActionTypes.ADD_REFERRING_DOCTOR_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger')
        yield put({
            type: DoctorsActionTypes.ADD_REFERRING_DOCTOR_ERROR,
            payload: error,
        });
    }
}

export function* callStateEmpty() {
    put({
        type: DoctorsActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}


export function* watchGetDoctors() {
    yield takeEvery(DoctorsActionTypes.GET_DOCTORS, getDoctorsFunction);
}

export function* watchGetDoctorsRoles() {
    yield takeEvery(DoctorsActionTypes.GET_DOCTORS_ROLES, getDoctorsRoleFunction);
}

export function* watchCreateDoctors() {
    yield takeEvery(DoctorsActionTypes.CREATE_DOCTORS, createDoctorsFunction);
}

export function* watchCreateDoctorsDeatil() {
    yield takeEvery(DoctorsActionTypes.CREATE_DOCTORS_DETAIL, createDoctorsDetailFunction);
}

export function* watchGetDoctorDetails() {
    yield takeEvery(DoctorsActionTypes.GET_DOCTORS_DETAILS, getDoctorDetailsFunction);
}

export function* watchresetState() {
    yield takeEvery(DoctorsActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

export function* watchAddReferringDoctor() {
    yield takeEvery(DoctorsActionTypes.ADD_REFERRING_DOCTOR, addReferringDoctorFunction);
}

function* doctorsSaga() {
    yield all([
        fork(watchGetDoctors),
        fork(watchresetState),
        fork(watchCreateDoctors),
        fork(watchGetDoctorsRoles),
        fork(watchCreateDoctorsDeatil),
        fork(watchGetDoctorDetails),
        fork(watchAddReferringDoctor),
    ]);
}
export default doctorsSaga;
