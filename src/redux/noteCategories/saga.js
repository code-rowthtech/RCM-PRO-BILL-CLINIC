import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { NotesCategoriesActionTypes } from './constants';
import {
    createNoteCategoriesApi,
    createSettingsTabsApi,
    getNoteCategoriesApi,
    getSettingsTabsApi,
    updateNoteCategoriesApi,
    updateSettingsTabsApi,
} from './api';

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
        if (response.status === 201) {
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

// setting tabs saga
function* createSettingsTabsFunction(data) {
    try {
        yield put({
            type: NotesCategoriesActionTypes.CREATE_SETTINGS_TABS_LOADING,
            payload: {},
        });
        const response = yield call(createSettingsTabsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: NotesCategoriesActionTypes.CREATE_SETTINGS_TABS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: NotesCategoriesActionTypes.CREATE_SETTINGS_TABS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: NotesCategoriesActionTypes.CREATE_SETTINGS_TABS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: NotesCategoriesActionTypes.CREATE_SETTINGS_TABS_ERROR,
            payload: error,
        });
    }
}

function* getSettingsTabsFunction(data) {
    try {
        yield put({
            type: NotesCategoriesActionTypes.GET_SETTINGS_TABS_LOADING,
            payload: {},
        });
        const response = yield call(getSettingsTabsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: NotesCategoriesActionTypes.GET_SETTINGS_TABS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: NotesCategoriesActionTypes.GET_SETTINGS_TABS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        // ToastHandle(error, 'danger');
        yield put({
            type: NotesCategoriesActionTypes.GET_SETTINGS_TABS_ERROR,
            payload: error,
        });
    }
}

function* updateSettingsTabsFunction(data) {
    try {
        yield put({
            type: NotesCategoriesActionTypes.UPDATE_SETTINGS_TABS_LOADING,
            payload: {},
        });
        const response = yield call(updateSettingsTabsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: NotesCategoriesActionTypes.UPDATE_SETTINGS_TABS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: NotesCategoriesActionTypes.UPDATE_SETTINGS_TABS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: NotesCategoriesActionTypes.UPDATE_SETTINGS_TABS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: NotesCategoriesActionTypes.UPDATE_SETTINGS_TABS_ERROR,
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

export function* watchCreateSettingsTabs() {
    yield takeEvery(NotesCategoriesActionTypes.CREATE_SETTINGS_TABS, createSettingsTabsFunction);
}
export function* watchGetSettingsTabs() {
    yield takeEvery(NotesCategoriesActionTypes.GET_SETTINGS_TABS, getSettingsTabsFunction);
}
export function* watchUpdateSettingsTabs() {
    yield takeEvery(NotesCategoriesActionTypes.UPDATE_SETTINGS_TABS, updateSettingsTabsFunction);
}

function* noteCategoriesSaga() {
    yield all([
        fork(watchCreateNoteCategories),
        fork(watchGetNoteCategories),
        fork(watchUpdateNoteCategories),
        fork(watchCreateSettingsTabs),
        fork(watchGetSettingsTabs),
        fork(watchUpdateSettingsTabs),
    ]);
}
export default noteCategoriesSaga;
