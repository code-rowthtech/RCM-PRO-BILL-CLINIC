import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { ClinicsActionTypes } from './constants';
import {
    createClinicApi, getClinicApi, getClinicByIdApi,
    updateClinicApi, getStateByCountry, getCityByStateApi,
    addSubscriptionPlanApi, getClinicsByParentIdApi, deleteClinicOnboardingApi
} from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createClinicsFunction(data) {
    try {
        yield put({
            type: ClinicsActionTypes.CREATE_CLINIC_LOADING,
            payload: {},
        });
        const response = yield call(createClinicApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: ClinicsActionTypes.CREATE_CLINIC_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicsActionTypes.CREATE_CLINIC_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        // console.log({ error })
        yield put({
            type: ClinicsActionTypes.CREATE_CLINIC_ERROR,
            payload: error,
        });
    }
}

function* updateClinicsFunction(data) {
    try {
        yield put({
            type: ClinicsActionTypes.UPDATE_CLINIC_LOADING,
            payload: {},
        });
        const response = yield call(updateClinicApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: ClinicsActionTypes.UPDATE_CLINIC_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicsActionTypes.UPDATE_CLINIC_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: ClinicsActionTypes.UPDATE_CLINIC_ERROR,
            payload: error,
        });
    }
}

function* getClinicByIdFunction(data) {
    try {
        yield put({
            type: ClinicsActionTypes.GET_CLINIC_BY_ID_LOADING,
            payload: {},
        });
        const response = yield call(getClinicByIdApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: ClinicsActionTypes.GET_CLINIC_BY_ID_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicsActionTypes.GET_CLINIC_BY_ID_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        // console.log({ error })
        yield put({
            type: ClinicsActionTypes.GET_CLINIC_BY_ID_ERROR,
            payload: error,
        });
    }
}

function* getClinicByParentFunction(data) {
    try {
        yield put({
            type: ClinicsActionTypes.GET_CLINIC_BY_PARENT_LOADING,
            payload: {},
        });
        const response = yield call(getClinicsByParentIdApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: ClinicsActionTypes.GET_CLINIC_BY_PARENT_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicsActionTypes.GET_CLINIC_BY_PARENT_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        // console.log({ error })
        yield put({
            type: ClinicsActionTypes.GET_CLINIC_BY_PARENT_ERROR,
            payload: error,
        });
    }
}

function* getClinicsFunction(data) {
    try {
        yield put({
            type: ClinicsActionTypes.GET_CLINIC_LOADING,
            payload: {},
        });
        const response = yield call(getClinicApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: ClinicsActionTypes.GET_CLINIC_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicsActionTypes.GET_CLINIC_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: ClinicsActionTypes.GET_CLINIC_ERROR,
            payload: error,
        });
    }
}

function* getStatesFunction(data) {
    try {
        yield put({
            type: ClinicsActionTypes.GET_STATES_LOADING,
            payload: {},
        });
        const response = yield call(getStateByCountry, data);
        console.log(response ,' new state api');
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        console.log(decryptedData,' decrypted data state');

        if (response.status === 200) {
            yield put({
                type: ClinicsActionTypes.GET_STATES_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicsActionTypes.GET_STATES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: ClinicsActionTypes.GET_STATES_ERROR,
            payload: error,
        });
    }
}

function* getCitiesFunction(data) {
    try {
        yield put({
            type: ClinicsActionTypes.GET_CITIES_LOADING,
            payload: {},
        });
        const response = yield call(getCityByStateApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: ClinicsActionTypes.GET_CITIES_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicsActionTypes.GET_CITIES_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: ClinicsActionTypes.GET_CITIES_ERROR,
            payload: error,
        });
    }
}

function* createSubscriptionPlanFunction(data) {
    try {
        yield put({
            type: ClinicsActionTypes.CREATE_SUBSCRIPTION_LOADING,
            payload: {},
        });
        const response = yield call(addSubscriptionPlanApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: ClinicsActionTypes.CREATE_SUBSCRIPTION_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicsActionTypes.CREATE_SUBSCRIPTION_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        // console.log({ error })
        yield put({
            type: ClinicsActionTypes.CREATE_SUBSCRIPTION_ERROR,
            payload: error,
        });
    }
}
function* deleteClinicFunction(data) {
    try {
        yield put({
            type: ClinicsActionTypes.DELETE_CLINIC_LOADING,
            payload: {},
        });
        const response = yield call(deleteClinicOnboardingApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: ClinicsActionTypes.DELETE_CLINIC_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: ClinicsActionTypes.DELETE_CLINIC_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        // console.log({ error })
        yield put({
            type: ClinicsActionTypes.DELETE_CLINIC_ERROR,
            payload: error,
        });
    }
}

export function* callStateEmpty() {
    put({
        type: ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE,
        payload: {},
    });

}

export function* watchCreateClinics() {
    yield takeEvery(ClinicsActionTypes.CREATE_CLINIC, createClinicsFunction);
}

export function* watchUpdateClinics() {
    yield takeEvery(ClinicsActionTypes.UPDATE_CLINIC, updateClinicsFunction);
}
export function* watchGetClinics() {
    yield takeEvery(ClinicsActionTypes.GET_CLINIC, getClinicsFunction);
}
export function* watchGetStates() {
    yield takeEvery(ClinicsActionTypes.GET_STATES, getStatesFunction);
}
export function* watchGetCities() {
    yield takeEvery(ClinicsActionTypes.GET_CITIES, getCitiesFunction);
}

export function* watchGetClinicById() {
    yield takeEvery(ClinicsActionTypes.GET_CLINIC_BY_ID, getClinicByIdFunction);
}

export function* watchGetClinicByParent() {
    yield takeEvery(ClinicsActionTypes.GET_CLINIC_BY_PARENT, getClinicByParentFunction);
}

export function* watchCreateSubscriptions() {
    yield takeEvery(ClinicsActionTypes.CREATE_SUBSCRIPTION, createSubscriptionPlanFunction);
}

export function* watchDeleteClinicOnboarding() {
    yield takeEvery(ClinicsActionTypes.DELETE_CLINIC, deleteClinicFunction);
}

export function* watchresetState() {
    yield takeEvery(ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE, callStateEmpty);
}

function* clinicsSaga() {
    yield all([
        fork(watchCreateClinics), fork(watchGetClinicById), fork(watchGetClinics), fork(watchUpdateClinics),
        fork(watchresetState), fork(watchGetStates), fork(watchGetCities), fork(watchCreateSubscriptions),
        fork(watchGetClinicByParent), fork(watchDeleteClinicOnboarding)
    ]);
}
export default clinicsSaga;
