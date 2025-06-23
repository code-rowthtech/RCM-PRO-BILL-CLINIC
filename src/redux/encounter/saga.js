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
    getEncounterByIdApi,
    getPastEncounterApi
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
        if (response.status === 200) {
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

function* getPastEncounterFunction(data) {
    try {
        yield put({
            type: EncounterActionTypes.GET_PAST_ENCOUNTER_LOADING,
            payload: {},
        });
        const response = yield call(getPastEncounterApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: EncounterActionTypes.GET_PAST_ENCOUNTER_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: EncounterActionTypes.GET_PAST_ENCOUNTER_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: EncounterActionTypes.GET_PAST_ENCOUNTER_ERROR,
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
        if (response.status === 200) {
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
        if (response.status === 200) {
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
        if (response.status === 200) {
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
        if (response.status === 200) {
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

export function* watchGetPastEncounter() {
    yield takeEvery(EncounterActionTypes.GET_PAST_ENCOUNTER, getPastEncounterFunction);
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
        fork(watchGetEncounter), fork(watchGetEncounterById), fork(watchGetPastEncounter),
        fork(watchCreateEncounterSettings), fork(watchUpdateEncounterSettings),
        fork(watchGetEncounterSettings), fork(watchGetEncounterNotes), fork(watchGetEncounterNotesFields)
    ]);
}
export default encounterSaga;


// import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
// import { decryptMessage } from '../../cryptoUtils';
// import ToastHandle from '../../helpers/ToastMessage';
// import { EncounterActionTypes } from './constants';
// import {
//     createEncounterApi,
//     getEncounterApi,
//     updateEncounterApi,
//     createEncounterSettingsApi,
//     getEncounterSettingsApi,
//     updateEncounterSettingsApi,
//     getEncounterNotesTypeApi,
//     getEncounterNoteFieldsApi,
//     getEncounterByIdApi
// } from './api';

// // Generic saga handler to reduce code duplication
// function* createApiSaga(apiCall, actionTypes, data, showSuccessToast = true) {
//     try {
//         yield put({
//             type: actionTypes.LOADING,
//             payload: {},
//         });

//         const response = yield call(apiCall, data);

//         // Decrypt asynchronously (non-blocking if using Web Workers)
//         const decryptedData = JSON.parse(yield call(decryptMessage, response.data.data));

//         if (response.status === 200 || response.status === 201) {
//             if (showSuccessToast) {
//                 ToastHandle(decryptedData?.message, 'success');
//             }

//             yield put({
//                 type: actionTypes.SUCCESS,
//                 payload: { ...decryptedData },
//             });

//             if (actionTypes.RESET) {
//                 yield put({
//                     type: actionTypes.RESET,
//                     payload: {},
//                 });
//             }
//         } else {
//             yield put({
//                 type: actionTypes.ERROR,
//                 payload: { ...decryptedData },
//             });
//         }
//     } catch (error) {
//         ToastHandle(error, 'danger');
//         yield put({
//             type: actionTypes.ERROR,
//             payload: error,
//         });
//     }
// }

// // Optimized saga functions using the generic handler
// function* createEncounterFunction(data) {
//     yield call(createApiSaga, createEncounterApi, {
//         LOADING: EncounterActionTypes.CREATE_ENCOUNTER_LOADING,
//         SUCCESS: EncounterActionTypes.CREATE_ENCOUNTER_SUCCESS,
//         ERROR: EncounterActionTypes.CREATE_ENCOUNTER_ERROR,
//         RESET: EncounterActionTypes.CREATE_ENCOUNTER_RESET,
//     }, data);
// }

// function* updateEncounterFunction(data) {
//     yield call(createApiSaga, updateEncounterApi, {
//         LOADING: EncounterActionTypes.UPDATE_ENCOUNTER_LOADING,
//         SUCCESS: EncounterActionTypes.UPDATE_ENCOUNTER_SUCCESS,
//         ERROR: EncounterActionTypes.UPDATE_ENCOUNTER_ERROR,
//         RESET: EncounterActionTypes.UPDATE_ENCOUNTER_RESET,
//     }, data);
// }

// function* getEncounterFunction(data) {
//     yield call(createApiSaga, getEncounterApi, {
//         LOADING: EncounterActionTypes.GET_ENCOUNTER_LOADING,
//         SUCCESS: EncounterActionTypes.GET_ENCOUNTER_SUCCESS,
//         ERROR: EncounterActionTypes.GET_ENCOUNTER_ERROR,
//     }, data, false); // No success toast for GET operations
// }

// function* createEncounterSettingsFunction(data) {
//     yield call(createApiSaga, createEncounterSettingsApi, {
//         LOADING: EncounterActionTypes.CREATE_ENCOUNTER_SETTINGS_LOADING,
//         SUCCESS: EncounterActionTypes.CREATE_ENCOUNTER_SETTINGS_SUCCESS,
//         ERROR: EncounterActionTypes.CREATE_ENCOUNTER_SETTINGS_ERROR,
//         RESET: EncounterActionTypes.CREATE_ENCOUNTER_SETTINGS_RESET,
//     }, data);
// }

// function* updateEncounterSettingsFunction(data) {
//     yield call(createApiSaga, updateEncounterSettingsApi, {
//         LOADING: EncounterActionTypes.UPDATE_ENCOUNTER_SETTINGS_LOADING,
//         SUCCESS: EncounterActionTypes.UPDATE_ENCOUNTER_SETTINGS_SUCCESS,
//         ERROR: EncounterActionTypes.UPDATE_ENCOUNTER_SETTINGS_ERROR,
//         RESET: EncounterActionTypes.UPDATE_ENCOUNTER_SETTINGS_RESET,
//     }, data);
// }

// function* getEncounterSettingsFunction(data) {
//     yield call(createApiSaga, getEncounterSettingsApi, {
//         LOADING: EncounterActionTypes.GET_ENCOUNTER_SETTINGS_LOADING,
//         SUCCESS: EncounterActionTypes.GET_ENCOUNTER_SETTINGS_SUCCESS,
//         ERROR: EncounterActionTypes.GET_ENCOUNTER_SETTINGS_ERROR,
//     }, data, false);
// }

// function* getEncounterByIdFunction(data) {
//     yield call(createApiSaga, getEncounterByIdApi, {
//         LOADING: EncounterActionTypes.GET_ENCOUNTER_BY_ID_LOADING,
//         SUCCESS: EncounterActionTypes.GET_ENCOUNTER_BY_ID_SUCCESS,
//         ERROR: EncounterActionTypes.GET_ENCOUNTER_BY_ID_ERROR,
//     }, data, false);
// }

// function* getEncounterNotesTypeFunction(data) {
//     yield call(createApiSaga, getEncounterNotesTypeApi, {
//         LOADING: EncounterActionTypes.GET_ENCOUNTER_NOTES_LOADING,
//         SUCCESS: EncounterActionTypes.GET_ENCOUNTER_NOTES_SUCCESS,
//         ERROR: EncounterActionTypes.GET_ENCOUNTER_NOTES_ERROR,
//     }, data, false);
// }

// function* getEncounterNotesFieldsFunction(data) {
//     yield call(createApiSaga, getEncounterNoteFieldsApi, {
//         LOADING: EncounterActionTypes.GET_ENCOUNTER_NOTES_FIELDS_LOADING,
//         SUCCESS: EncounterActionTypes.GET_ENCOUNTER_NOTES_FIELDS_SUCCESS,
//         ERROR: EncounterActionTypes.GET_ENCOUNTER_NOTES_FIELDS_ERROR,
//     }, data, false);
// }

// // Watchers remain the same but more concise
// const watchers = [
//     [EncounterActionTypes.CREATE_ENCOUNTER, createEncounterFunction],
//     [EncounterActionTypes.UPDATE_ENCOUNTER, updateEncounterFunction],
//     [EncounterActionTypes.GET_ENCOUNTER, getEncounterFunction],
//     [EncounterActionTypes.GET_ENCOUNTER_BY_ID, getEncounterByIdFunction],
//     [EncounterActionTypes.CREATE_ENCOUNTER_SETTINGS, createEncounterSettingsFunction],
//     [EncounterActionTypes.UPDATE_ENCOUNTER_SETTINGS, updateEncounterSettingsFunction],
//     [EncounterActionTypes.GET_ENCOUNTER_SETTINGS, getEncounterSettingsFunction],
//     [EncounterActionTypes.GET_ENCOUNTER_NOTES, getEncounterNotesTypeFunction],
//     [EncounterActionTypes.GET_ENCOUNTER_NOTES_FIELDS, getEncounterNotesFieldsFunction],
// ];

// function* encounterSaga() {
//     yield all(
//         watchers.map(([actionType, handler]) =>
//             fork(function* () {
//                 yield takeEvery(actionType, handler);
//             })
//         )
//     );
// }

// export default encounterSaga;