import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { DoctorsActionTypes } from './constants';
import { createDoctorApi, createDoctorDetailApi, getDoctorsApi, getDoctorsRolesApi } from './api';
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
    console.log(data)
    try {
        yield put({
            type: DoctorsActionTypes.GET_DOCTORS_LOADING,
            payload: {},
        });
        const response = yield call(createDoctorApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: DoctorsActionTypes.CREATE_DOCTORS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: DoctorsActionTypes.CREATE_DOCTORS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: DoctorsActionTypes.CREATE_DOCTORS_ERROR,
            payload: error,
        });
    }
}

function* createDoctorsDetailFunction(data) {
    console.log(data)
    try {
        yield put({
            type: DoctorsActionTypes.CREATE_DOCTORS_DETAIL_LOADING,
            payload: {},
        });
        const response = yield call(createDoctorDetailApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: DoctorsActionTypes.CREATE_DOCTORS_DETAIL_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: DoctorsActionTypes.CREATE_DOCTORS_DETAIL_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: DoctorsActionTypes.CREATE_DOCTORS_DETAIL_ERROR,
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



export function* watchresetState() {
    yield takeEvery(DoctorsActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

function* doctorsSaga() {
    yield all([
        fork(watchGetDoctors),
        fork(watchresetState),
        fork(watchCreateDoctors),
        fork(watchGetDoctorsRoles),
        fork(watchCreateDoctorsDeatil),
    ]);
}
export default doctorsSaga;
