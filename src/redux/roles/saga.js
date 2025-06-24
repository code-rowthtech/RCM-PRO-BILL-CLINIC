import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { RolesActionTypes } from './constants';
import { createRolesApi, deleteRoles, getRolesApi, getUser, updateRolesApi, viewPasswordApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createRolesFunction(data) {
    try {
        yield put({
            type: RolesActionTypes.CREATE_ROLES_LOADING,
            payload: {},
        });
        const response = yield call(createRolesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success')


            yield put({
                type: RolesActionTypes.CREATE_ROLES_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: RolesActionTypes.CREATE_ROLES_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: RolesActionTypes.CREATE_ROLES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger')

        yield put({
            type: RolesActionTypes.CREATE_ROLES_ERROR,
            payload: error,
        });
    }
}

function* viewPasswordFunction(data) {
    try {
        yield put({
            type: RolesActionTypes.VIEW_PASSWORD_LOADING,
            payload: {},
        });
        const response = yield call(viewPasswordApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success')


            yield put({
                type: RolesActionTypes.VIEW_PASSWORD_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: RolesActionTypes.VIEW_PASSWORD_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger')
        yield put({
            type: RolesActionTypes.VIEW_PASSWORD_ERROR,
            payload: error,
        });
    }
}

function* updateRolesFunction(data) {
    try {
        yield put({
            type: RolesActionTypes.UPDATE_ROLES_LOADING,
            payload: {},
        });
        const response = yield call(updateRolesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success')
            yield put({
                type: RolesActionTypes.UPDATE_ROLES_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: RolesActionTypes.UPDATE_ROLES_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: RolesActionTypes.UPDATE_ROLES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger')
        yield put({
            type: RolesActionTypes.UPDATE_ROLES_ERROR,
            payload: error,
        });
    }
}

function* getRolesFunction(data) {
    try {
        yield put({
            type: RolesActionTypes.GET_ROLES_LOADING,
            payload: {},
        });
        const response = yield call(getRolesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {

            yield put({
                type: RolesActionTypes.GET_ROLES_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: RolesActionTypes.GET_ROLES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: RolesActionTypes.GET_ROLES_ERROR,
            payload: error,
        });
    }
}

function* deleteRolesFunction(data) {
    try {
        yield put({
            type: RolesActionTypes.DELETE_ROLES_LOADING,
            payload: {},
        });
        const response = yield call(deleteRoles, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {

            yield put({
                type: RolesActionTypes.DELETE_ROLES_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: RolesActionTypes.DELETE_ROLES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: RolesActionTypes.DELETE_ROLES_ERROR,
            payload: error,
        });
    }
}

function* getUserFunction(data) {
    try {
        yield put({
            type: RolesActionTypes.GET_USER_LOADING,
            payload: {},
        });
        const response = yield call(getUser, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {

            yield put({
                type: RolesActionTypes.GET_USER_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: RolesActionTypes.GET_USER_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: RolesActionTypes.GET_USER_ERROR,
            payload: error,
        });
    }
}

export function* callStateEmpty() {
    put({
        type: RolesActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}

export function* watchCreateRoles() {
    yield takeEvery(RolesActionTypes.CREATE_ROLES, createRolesFunction);
}

export function* watchViewPassword() {
    yield takeEvery(RolesActionTypes.VIEW_PASSWORD, viewPasswordFunction);
}

export function* watchUpdateRoles() {
    yield takeEvery(RolesActionTypes.UPDATE_ROLES, updateRolesFunction);
}
export function* watchGetRoles() {
    yield takeEvery(RolesActionTypes.GET_ROLES, getRolesFunction);
}
export function* watchDeleteRoles() {
    yield takeEvery(RolesActionTypes.DELETE_ROLES, deleteRolesFunction);
}
export function* watchresetState() {
    yield takeEvery(RolesActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}
export function* watchGetUser() {
    yield takeEvery(RolesActionTypes.GET_USER, getUserFunction);
}

function* rolesSaga() {
    yield all([
        fork(watchCreateRoles), fork(watchUpdateRoles), fork(watchGetRoles), fork(watchresetState), fork(watchGetUser), fork(watchDeleteRoles), fork(watchViewPassword)
    ]);
}
export default rolesSaga;
