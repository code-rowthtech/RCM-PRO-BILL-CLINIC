import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { EncounterActionTypes } from './constants';
import {
    createEncounterApi,
    getEncounterApi,
    updateEncounterApi, createEncounterSettingsApi,
    getEncounterSettingsApi,
    updateEncounterSettingsApi,
    getEncounterNotesTypeApi,
    getEncounterNoteFieldsApi,
    getEncounterByIdApi
} from './api';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createEncounterFunction(data) {
    try {
        yield put({
            type: EncounterActionTypes.CREATE_ENCOUNTER_LOADING,
            payload: {},
        });
        const response = yield call(createEncounterApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: EncounterActionTypes.CREATE_ENCOUNTER_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: EncounterActionTypes.CREATE_ENCOUNTER_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: EncounterActionTypes.CREATE_ENCOUNTER_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: EncounterActionTypes.CREATE_ENCOUNTER_ERROR,
            payload: error,
        });
    }
}

function* createEncounterSettingsFunction(data) {
    try {
        yield put({
            type: EncounterActionTypes.CREATE_ENCOUNTER_SETTINGS_LOADING,
            payload: {},
        });
        const response = yield call(createEncounterSettingsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: EncounterActionTypes.CREATE_ENCOUNTER_SETTINGS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: EncounterActionTypes.CREATE_ENCOUNTER_SETTINGS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: EncounterActionTypes.CREATE_ENCOUNTER_SETTINGS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: EncounterActionTypes.CREATE_ENCOUNTER_SETTINGS_ERROR,
            payload: error,
        });
    }
}

function* updateEncounterFunction(data) {
    try {
        yield put({
            type: EncounterActionTypes.UPDATE_ENCOUNTER_LOADING,
            payload: {},
        });
        const response = yield call(updateEncounterApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: EncounterActionTypes.UPDATE_ENCOUNTER_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: EncounterActionTypes.UPDATE_ENCOUNTER_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: EncounterActionTypes.UPDATE_ENCOUNTER_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: EncounterActionTypes.UPDATE_ENCOUNTER_ERROR,
            payload: error,
        });
    }
}

function* updateEncounterSettingsFunction(data) {
    try {
        yield put({
            type: EncounterActionTypes.UPDATE_ENCOUNTER_SETTINGS_LOADING,
            payload: {},
        });
        const response = yield call(updateEncounterSettingsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: EncounterActionTypes.UPDATE_ENCOUNTER_SETTINGS_SUCCESS,
                payload: { ...decryptedData },
            });
            yield put({
                type: EncounterActionTypes.UPDATE_ENCOUNTER_SETTINGS_RESET,
                payload: {},
            });
        } else {
            yield put({
                type: EncounterActionTypes.UPDATE_ENCOUNTER_SETTINGS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: EncounterActionTypes.UPDATE_ENCOUNTER_SETTINGS_ERROR,
            payload: error,
        });
    }
}

function* getEncounterFunction(data) {
    try {
        yield put({
            type: EncounterActionTypes.GET_ENCOUNTER_LOADING,
            payload: {},
        });
        const response = yield call(getEncounterApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            yield put({
                type: EncounterActionTypes.GET_ENCOUNTER_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: EncounterActionTypes.GET_ENCOUNTER_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: EncounterActionTypes.GET_ENCOUNTER_ERROR,
            payload: error,
        });
    }
}

function* getEncounterSettingsFunction(data) {
    try {
        yield put({
            type: EncounterActionTypes.GET_ENCOUNTER_SETTINGS_LOADING,
            payload: {},
        });
        const response = yield call(getEncounterSettingsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            yield put({
                type: EncounterActionTypes.GET_ENCOUNTER_SETTINGS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: EncounterActionTypes.GET_ENCOUNTER_SETTINGS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: EncounterActionTypes.GET_ENCOUNTER_SETTINGS_ERROR,
            payload: error,
        });
    }
}
function* getEncounterByIdFunction(data) {
    try {
        yield put({
            type: EncounterActionTypes.GET_ENCOUNTER_BY_ID_LOADING,
            payload: {},
        });
        const response = yield call(getEncounterByIdApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            yield put({
                type: EncounterActionTypes.GET_ENCOUNTER_BY_ID_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: EncounterActionTypes.GET_ENCOUNTER_BY_ID_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: EncounterActionTypes.GET_ENCOUNTER_BY_ID_ERROR,
            payload: error,
        });
    }
}

function* getEncounterNotesTypeFunction(data) {
    try {
        yield put({
            type: EncounterActionTypes.GET_ENCOUNTER_NOTES_LOADING,
            payload: {},
        });
        const response = yield call(getEncounterNotesTypeApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            yield put({
                type: EncounterActionTypes.GET_ENCOUNTER_NOTES_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: EncounterActionTypes.GET_ENCOUNTER_NOTES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: EncounterActionTypes.GET_ENCOUNTER_NOTES_ERROR,
            payload: error,
        });
    }
}

function* getEncounterNotesFieldsFunction(data) {
    try {
        yield put({
            type: EncounterActionTypes.GET_ENCOUNTER_NOTES_FIELDS_LOADING,
            payload: {},
        });
        const response = yield call(getEncounterNoteFieldsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            yield put({
                type: EncounterActionTypes.GET_ENCOUNTER_NOTES_FIELDS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: EncounterActionTypes.GET_ENCOUNTER_NOTES_FIELDS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: EncounterActionTypes.GET_ENCOUNTER_NOTES_FIELDS_ERROR,
            payload: error,
        });
    }
}


export function* watchCreateEncounter() {
    yield takeEvery(EncounterActionTypes.CREATE_ENCOUNTER, createEncounterFunction);
}

export function* watchUpdateEncounter() {
    yield takeEvery(EncounterActionTypes.UPDATE_ENCOUNTER, updateEncounterFunction);
}

export function* watchGetEncounter() {
    yield takeEvery(EncounterActionTypes.GET_ENCOUNTER, getEncounterFunction);
}

export function* watchCreateEncounterSettings() {
    yield takeEvery(EncounterActionTypes.CREATE_ENCOUNTER_SETTINGS, createEncounterSettingsFunction);
}

export function* watchUpdateEncounterSettings() {
    yield takeEvery(EncounterActionTypes.UPDATE_ENCOUNTER_SETTINGS, updateEncounterSettingsFunction);
}


export function* watchGetEncounterSettings() {
    yield takeEvery(EncounterActionTypes.GET_ENCOUNTER_SETTINGS, getEncounterSettingsFunction);
}

export function* watchGetEncounterById() {
    yield takeEvery(EncounterActionTypes.GET_ENCOUNTER_BY_ID, getEncounterByIdFunction);
}
export function* watchGetEncounterNotes() {
    yield takeEvery(EncounterActionTypes.GET_ENCOUNTER_NOTES, getEncounterNotesTypeFunction);
}

export function* watchGetEncounterNotesFields() {
    yield takeEvery(EncounterActionTypes.GET_ENCOUNTER_NOTES_FIELDS, getEncounterNotesFieldsFunction);
}

function* encounterSaga() {
    yield all([
        fork(watchCreateEncounter),
        fork(watchUpdateEncounter),
        fork(watchGetEncounter), fork(watchGetEncounterById),
        fork(watchCreateEncounterSettings), fork(watchUpdateEncounterSettings),
        fork(watchGetEncounterSettings), fork(watchGetEncounterNotes), fork(watchGetEncounterNotesFields)
    ]);
}
export default encounterSaga;
