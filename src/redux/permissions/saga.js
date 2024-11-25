import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { PermissionsActionTypes } from './constants';
import { createPermissionsApi, getPermissionsApi, deletePermissionsApi, updatePermissionsApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
/**
 * Login the user
 * @param {*} payload - username and password
 */




function* addPermissionsFunction(data) {
    try {
        yield put({
            type: PermissionsActionTypes.CREATE_PERMISSIONS_LOADING,
            payload: {},
        });
        const response = yield call(createPermissionsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            yield put({
                type: PermissionsActionTypes.CREATE_PERMISSIONS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PermissionsActionTypes.CREATE_PERMISSIONS_ERROR,
                payload: { ...decryptedData },
            });
        }

    } catch (error) {
        yield put({
            type: PermissionsActionTypes.CREATE_PERMISSIONS_ERROR,
            payload: error,
        });
    }
}
function* getPermissionsFunction(data) {
    try {
        yield put({
            type: PermissionsActionTypes.GET_PERMISSIONS_LOADING,
            payload: {},
        });
        const response = yield call(getPermissionsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {

            yield put({
                type: PermissionsActionTypes.GET_PERMISSIONS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PermissionsActionTypes.GET_PERMISSIONS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PermissionsActionTypes.GET_PERMISSIONS_ERROR,
            payload: error,
        });
    }
}

function* deletePermissionsFunction(data) {
    try {
        yield put({
            type: PermissionsActionTypes.DELETE_PERMISSIONS_LOADING,
            payload: {},
        });
        const response = yield call(deletePermissionsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: PermissionsActionTypes.DELETE_PERMISSIONS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PermissionsActionTypes.DELETE_PERMISSIONS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PermissionsActionTypes.DELETE_PERMISSIONS_ERROR,
            payload: error,
        });
    }
}

function* updatePermissionsFunction(data) {
    try {
        yield put({
            type: PermissionsActionTypes.UPDATE_PERMISSIONS_LOADING,
            payload: {},
        });
        const response = yield call(updatePermissionsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: PermissionsActionTypes.UPDATE_PERMISSIONS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PermissionsActionTypes.UPDATE_PERMISSIONS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PermissionsActionTypes.UPDATE_PERMISSIONS_ERROR,
            payload: error,
        });
    }
}

export function* callStateEmpty() {
    put({
        type: PermissionsActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}


export function* watchpermissionsDataCreate() {
    yield takeEvery(PermissionsActionTypes.CREATE_PERMISSIONS, addPermissionsFunction);
}
export function* watchpermissionsDataGet() {
    yield takeEvery(PermissionsActionTypes.GET_PERMISSIONS, getPermissionsFunction);
}
export function* watchpermissionsDataDelete() {
    yield takeEvery(PermissionsActionTypes.DELETE_PERMISSIONS, deletePermissionsFunction);
}
export function* watchpermissionsDataUpdate() {
    yield takeEvery(PermissionsActionTypes.UPDATE_PERMISSIONS, updatePermissionsFunction);
}
export function* watchresetState() {
    yield takeEvery(PermissionsActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

function* permissionsSaga() {
    yield all([
        fork(watchpermissionsDataCreate),
        fork(watchpermissionsDataGet),
        fork(watchpermissionsDataDelete),
        fork(watchpermissionsDataUpdate),
        fork(watchresetState),
    ]);
}
export default permissionsSaga;
