import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { NotesCategoriesActionTypes } from './constants';
import { createNoteCategoriesApi, getNoteCategoriesApi, updateNoteCategoriesApi } from './api';

/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createNoteCategoriesFunction(data) {
    try {
        yield put({
            type: NotesCategoriesActionTypes.CREATE_NOTE_CATEGORIES_LOADING,
            payload: {},
        });
        const response = yield call(createNoteCategoriesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: NotesCategoriesActionTypes.CREATE_NOTE_CATEGORIES_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: NotesCategoriesActionTypes.CREATE_NOTE_CATEGORIES_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: NotesCategoriesActionTypes.CREATE_NOTE_CATEGORIES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: NotesCategoriesActionTypes.CREATE_NOTE_CATEGORIES_ERROR,
            payload: error,
        });
    }
}

function* getNoteCategoriesFunction(data) {
    try {
        yield put({
            type: NotesCategoriesActionTypes.GET_NOTE_CATEGORIES_LOADING,
            payload: {},
        });
        const response = yield call(getNoteCategoriesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            // ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: NotesCategoriesActionTypes.GET_NOTE_CATEGORIES_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: NotesCategoriesActionTypes.GET_NOTE_CATEGORIES_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: NotesCategoriesActionTypes.GET_NOTE_CATEGORIES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        // ToastHandle(error, 'danger');
        yield put({
            type: NotesCategoriesActionTypes.GET_NOTE_CATEGORIES_ERROR,
            payload: error,
        });
    }
}

function* updateNoteCategoriesFunction(data) {
    try {
        yield put({
            type: NotesCategoriesActionTypes.UPDATE_NOTE_CATEGORIES_LOADING,
            payload: {},
        });
        const response = yield call(updateNoteCategoriesApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: NotesCategoriesActionTypes.UPDATE_NOTE_CATEGORIES_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: NotesCategoriesActionTypes.UPDATE_NOTE_CATEGORIES_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: NotesCategoriesActionTypes.UPDATE_NOTE_CATEGORIES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: NotesCategoriesActionTypes.UPDATE_NOTE_CATEGORIES_ERROR,
            payload: error,
        });
    }
}

export function* callResetUpdate() {
    put({
        type: NotesCategoriesActionTypes.RESET_UPDATE_STATUS,
        payload: {},
    });
}

export function* watchCreateNoteCategories() {
    yield takeEvery(NotesCategoriesActionTypes.CREATE_NOTE_CATEGORIES, createNoteCategoriesFunction);
}

export function* watchGetNoteCategories() {
    yield takeEvery(NotesCategoriesActionTypes.GET_NOTE_CATEGORIES, getNoteCategoriesFunction);
}

export function* watchUpdateNoteCategories() {
    yield takeEvery(NotesCategoriesActionTypes.UPDATE_NOTE_CATEGORIES, updateNoteCategoriesFunction);
}

function* noteCategoriesSaga() {
    yield all([
        fork(watchCreateNoteCategories),
        fork(watchGetNoteCategories),
        fork(watchUpdateNoteCategories),
    ]);
}
export default noteCategoriesSaga;
