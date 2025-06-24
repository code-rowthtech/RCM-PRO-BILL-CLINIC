import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { AuditReportActionTypes } from './constants';
import { decryptMessage } from '../../cryptoUtils';
import { getAuditReportApi } from './api';


/**
 * Login the user
 * @param {*} payload - username and password
 */

function* getAuditReportFunction(data) {
    try {
        yield put({
            type: AuditReportActionTypes.GET_AUDIT_REPORT_LOADING,
            payload: {},
        });
        const response = yield call(getAuditReportApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: AuditReportActionTypes.GET_AUDIT_REPORT_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: AuditReportActionTypes.GET_AUDIT_REPORT_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: AuditReportActionTypes.GET_AUDIT_REPORT_ERROR,
            payload: error,
        });
    }
}

export function* watchGetAuditReport() {
    yield takeEvery(AuditReportActionTypes.GET_AUDIT_REPORT, getAuditReportFunction);
}

function* auditReportSaga() {
    
    yield all([
        fork(watchGetAuditReport),
    ]);
}
export default auditReportSaga;