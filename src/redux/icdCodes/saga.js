import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import {
    getIcdProcedureCodesApi,
} from './api';
import { IcdCodesActionTypes } from './constants';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* getICDProcedures(data) {
    try {
        yield put({
            type: IcdCodesActionTypes.GET_ICD_PROCEDURE_LOADING,
            payload: {},
        });
        const response = yield call(getIcdProcedureCodesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: IcdCodesActionTypes.GET_ICD_PROCEDURE_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: IcdCodesActionTypes.GET_ICD_PROCEDURE_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: IcdCodesActionTypes.GET_ICD_PROCEDURE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: IcdCodesActionTypes.GET_ICD_PROCEDURE_ERROR,
            payload: error,
        });
    }
}



export function* watchgetIcdProcedures() {
    yield takeEvery(IcdCodesActionTypes.GET_ICD_PROCEDURE, getICDProcedures);
}

function* icdCodesSaga() {
    yield all([
        fork(watchgetIcdProcedures),

    ]);
}
export default icdCodesSaga;
