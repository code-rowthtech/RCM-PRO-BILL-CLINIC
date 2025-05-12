import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import {
    createSuggestionsApi,
} from './api';
import { SuggestionsListActionTypes } from './constants';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createSuggestionsFunction(data) {
    try {
        yield put({
            type: SuggestionsListActionTypes.CREATE_SUGGESTION_LOADING,
            payload: {},
        });
        const response = yield call(createSuggestionsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: SuggestionsListActionTypes.CREATE_SUGGESTION_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: SuggestionsListActionTypes.CREATE_SUGGESTION_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: SuggestionsListActionTypes.CREATE_SUGGESTION_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: SuggestionsListActionTypes.CREATE_SUGGESTION_ERROR,
            payload: error,
        });
    }
}



export function* watchSuggestionAllergy() {
    yield takeEvery(SuggestionsListActionTypes.CREATE_SUGGESTION, createSuggestionsFunction);
}

function* suggestionsListSaga() {
    yield all([
        fork(watchSuggestionAllergy),

    ]);
}
export default suggestionsListSaga;
