import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { SubscriptionsActionTypes } from './constants';
import { getSubscriptionsApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* getSubscriptionsFunction(data) {
    try {
        yield put({
            type: SubscriptionsActionTypes.GET_SUBSCRIPTIONS_LOADING,
            payload: {},
        });
        const response = yield call(getSubscriptionsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: SubscriptionsActionTypes.GET_SUBSCRIPTIONS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: SubscriptionsActionTypes.GET_DOCTORS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: SubscriptionsActionTypes.GET_SUBSCRIPTIONS_ERROR,
            payload: error,
        });
    }
}

export function* callStateEmpty() {
    put({
        type: SubscriptionsActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}


export function* watchGetSubscriptions() {
    yield takeEvery(SubscriptionsActionTypes.GET_SUBSCRIPTIONS, getSubscriptionsFunction);
}



export function* watchresetState() {
    yield takeEvery(SubscriptionsActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

function* subscriptionsSaga() {
    yield all([
        fork(watchGetSubscriptions),
        fork(watchresetState)
    ]);
}
export default subscriptionsSaga;
