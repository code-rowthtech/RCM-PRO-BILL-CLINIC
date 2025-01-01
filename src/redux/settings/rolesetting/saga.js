import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { RoleActionTypes } from './constants';
import { decryptMessage } from '../../../cryptoUtils';
import ToastHandle from '../../../helpers/ToastMessage';
import { createRoleDataApi, getRoleDataApi, updateRoleDataApi } from './api';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* createRoleDataFunction(data) {
    try {
        yield put({
            type: RoleActionTypes.CREATE_ROLE_DATA_LOADING,
            payload: {},
        });
        const response = yield call(createRoleDataApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success')
            yield put({
                type: RoleActionTypes.CREATE_ROLE_DATA_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: RoleActionTypes.CREATE_ROLE_DATA_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: RoleActionTypes.CREATE_ROLE_DATA_ERROR,
            payload: error,
        });
    }
}

function* getRoleDataFunction(data) {
    try {
        yield put({
            type: RoleActionTypes.GET_ROLE_DATA_LOADING,
            payload: {},
        });
        const response = yield call(getRoleDataApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        console.log(decryptedData,'decryptedData')

        if (response.status === 200) {
            yield put({
                type: RoleActionTypes.GET_ROLE_DATA_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: RoleActionTypes.GET_ROLE_DATA_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: RoleActionTypes.GET_ROLE_DATA_ERROR,
            payload: error,
        });
    }
}


function* updateRoleDataFunction(data) {
    try {
        yield put({
            type: RoleActionTypes.UPDATE_ROLE_DATA_LOADING,
            payload: {},
        });
        const response = yield call(updateRoleDataApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success')
            yield put({
                type: RoleActionTypes.UPDATE_ROLE_DATA_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: RoleActionTypes.UPDATE_ROLE_DATA_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: RoleActionTypes.UPDATE_ROLE_DATA_ERROR,
            payload: error,
        });
    }
}

export function* callStateEmpty() {
    put({
        type: RoleActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}


export function* watchCreateRoleData() {
    yield takeEvery(RoleActionTypes.CREATE_ROLE_DATA, createRoleDataFunction);
}
export function* watchGetRoleData() {
    yield takeEvery(RoleActionTypes.GET_ROLE_DATA, getRoleDataFunction);
}

export function* watchUpdateRoleData() {
    yield takeEvery(RoleActionTypes.UPDATE_ROLE_DATA, updateRoleDataFunction);
}



export function* watchresetState() {
    yield takeEvery(RoleActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

function* settingsRoleSaga() {
    yield all([
        fork(watchCreateRoleData),
        fork(watchGetRoleData),
        fork(watchUpdateRoleData),
        fork(watchresetState),
    ]);
}
export default settingsRoleSaga;
