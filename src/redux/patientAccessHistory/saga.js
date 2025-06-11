import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { PatientsAccessActionTypes } from './constants';
import { decryptMessage } from '../../cryptoUtils';
import { getPatientAccessLogsApi } from './api';


/**
 * Login the user
 * @param {*} payload - username and password
 */

function* getPatientsAccessLogsFunction(data) {
    try {
        yield put({
            type: PatientsAccessActionTypes.GET_PATIENTS_ACCESS_LOGS_LOADING,
            payload: {},
        });
        const response = yield call(getPatientAccessLogsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: PatientsAccessActionTypes.GET_PATIENTS_ACCESS_LOGS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsAccessActionTypes.GET_PATIENTS_ACCESS_LOGS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PatientsAccessActionTypes.GET_PATIENTS_ACCESS_LOGS_ERROR,
            payload: error,
        });
    }
}

export function* watchGetPatientsAccessLogs() {
    yield takeEvery(PatientsAccessActionTypes.GET_PATIENTS_ACCESS_LOGS, getPatientsAccessLogsFunction);
}

function* patientsAccessLogsSaga() {
    
    yield all([
        fork(watchGetPatientsAccessLogs),
    ]);
}
export default patientsAccessLogsSaga;