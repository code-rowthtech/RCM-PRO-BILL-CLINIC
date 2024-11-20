import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { DoctorsActionTypes } from './constants';
import { getDoctorsApi } from './api';
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

export function* callStateEmpty() {
    put({
        type: DoctorsActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}


export function* watchGetDoctors() {
    yield takeEvery(DoctorsActionTypes.GET_DOCTORS, getDoctorsFunction);
}



export function* watchresetState() {
    yield takeEvery(DoctorsActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

function* doctorsSaga() {
    yield all([
        fork(watchGetDoctors),
        fork(watchresetState)
    ]);
}
export default doctorsSaga;
