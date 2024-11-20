import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { DashboardActionTypes } from './constants';
import { getAnalyticsApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* getAnalyticsFunction(data) {
    try {
        yield put({
            type: DashboardActionTypes.GET_ANALYTICS_LOADING,
            payload: {},
        });
        const response = yield call(getAnalyticsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: DashboardActionTypes.GET_ANALYTICS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: DashboardActionTypes.GET_ANALYTICS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: DashboardActionTypes.GET_ANALYTICS_ERROR,
            payload: error,
        });
    }
}

export function* callStateEmpty() {
    put({
        type: DashboardActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}


export function* watchGetAnalytics() {
    yield takeEvery(DashboardActionTypes.GET_ANALYTICS, getAnalyticsFunction);
}



export function* watchresetState() {
    yield takeEvery(DashboardActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

function* dashboardSaga() {
    yield all([
        fork(watchGetAnalytics),
        fork(watchresetState)
    ]);
}
export default dashboardSaga;
