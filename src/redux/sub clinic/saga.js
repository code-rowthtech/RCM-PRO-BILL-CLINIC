import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SubClinicsActionTypes } from './constants';
import { createSubClinicApi, createUpgradeApi, getSubClinicApi, getSubClinicTypeApi, getSubscriptionApi, updateSubClinicApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
/**
 * Login the user
 * @param {*} payload - username and password
 */

function* createSubClinicsFunction(data) {
    try {
        yield put({
            type: SubClinicsActionTypes.CREATE_SUBCLINIC_LOADING,
            payload: {},
        });
        const response = yield call(createSubClinicApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            ToastHandle(decryptedData.message,'success')
            yield put({
                type: SubClinicsActionTypes.CREATE_SUBCLINIC_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: SubClinicsActionTypes.CREATE_SUBCLINIC_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error,'danger')
        yield put({
            type: SubClinicsActionTypes.CREATE_SUBCLINIC_ERROR,
            payload: error,
        });
    }
}


function* createUpgradeFunction(data) {
    try {
        yield put({
            type: SubClinicsActionTypes.CREATE_UOGRADE_LOADING,
            payload: {},
        });
        const response = yield call(createUpgradeApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: SubClinicsActionTypes.CREATE_UOGRADE_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: SubClinicsActionTypes.CREATE_UOGRADE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: SubClinicsActionTypes.CREATE_UOGRADE_ERROR,
            payload: error,
        });
    }
}
function* getSubClinicsFunction(data) {
    try {
        yield put({
            type: SubClinicsActionTypes.GET_SUBCLINIC_LOADING,
            payload: {},
        });
        const response = yield call(getSubClinicApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: SubClinicsActionTypes.GET_SUBCLINIC_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: SubClinicsActionTypes.GET_SUBCLINIC_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: SubClinicsActionTypes.GET_SUBCLINIC_ERROR,
            payload: error,
        });
    }
}
function* updateSubClinicFunction(data) {
    try {
        yield put({
            type: SubClinicsActionTypes.UPDATE_SUBCLINIC_LOADING,
            payload: {},
        });
        const response = yield call(updateSubClinicApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            ToastHandle(decryptedData.message,'success')
            yield put({
                type: SubClinicsActionTypes.UPDATE_SUBCLINIC_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: SubClinicsActionTypes.UPDATE_SUBCLINIC_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error,'danger')
        yield put({
            type: SubClinicsActionTypes.UPDATE_SUBCLINIC_ERROR,
            payload: error,
        });
    }
}

function* getSubClinicTypeFunction() {
    try {
        yield put({
            type: SubClinicsActionTypes.GET_SUBCLINICTYPE_LOADING,
        });

        const response = yield call(getSubClinicTypeApi);
        if (response.status === 200) {
            const decryptedData = JSON.parse(decryptMessage(response.data.data));
            yield put({
                type: SubClinicsActionTypes.GET_SUBCLINICTYPE_SUCCESS,
                payload: decryptedData,
            });
        } else {
            yield put({
                type: SubClinicsActionTypes.GET_SUBCLINICTYPE_ERROR,
                payload: response.data.message || 'Error fetching clinic types',
            });
        }
    } catch (error) {
        yield put({
            type: SubClinicsActionTypes.GET_SUBCLINICTYPE_ERROR,
            payload: error.message || 'Network error',
        });
    }
}

function* getSubClinicCityFunction() {
    try {
        yield put({
            type: SubClinicsActionTypes.GET_CITIES_LOADING,
        });

        const response = yield call(getSubClinicTypeApi);
        if (response.status === 200) {
            const decryptedData = JSON.parse(decryptMessage(response.data.data));
            yield put({
                type: SubClinicsActionTypes.GET_CITIES_SUCCESS,
                payload: decryptedData,
            });
        } else {
            yield put({
                type: SubClinicsActionTypes.GET_CITIES_ERROR,
                payload: response.data.message || 'Error fetching clinic types',
            });
        }
    } catch (error) {
        yield put({
            type: SubClinicsActionTypes.GET_CITIES_ERROR,
            payload: error.message || 'Network error',
        });
    }
}

function* getSubscriptionFunction() {
    try {
        yield put({
            type: SubClinicsActionTypes.GET_SUBSCRIPTION_LOADING,
        });

        const response = yield call(getSubscriptionApi);
        if (response.status === 200) {
            const decryptedData = JSON.parse(decryptMessage(response.data.data));
            yield put({
                type: SubClinicsActionTypes.GET_SUBSCRIPTION_SUCCESS,
                payload: decryptedData,
            });
        } else {
            yield put({
                type: SubClinicsActionTypes.GET_SUBSCRIPTION_ERROR,
                payload: response.data.message || 'Error fetching clinic types',
            });
        }
    } catch (error) {
        yield put({
            type: SubClinicsActionTypes.GET_SUBSCRIPTION_ERROR,
            payload: error.message || 'Network error',
        });
    }
}

export function* watchCreateClinics() {
    yield takeEvery(SubClinicsActionTypes.CREATE_SUBCLINIC, createSubClinicsFunction);
}

export function* watchUpgrade() {
    yield takeEvery(SubClinicsActionTypes.CREATE_UOGRADE, createUpgradeFunction);
}
export function* watchGetClinics() {
    yield takeEvery(SubClinicsActionTypes.GET_SUBCLINIC, getSubClinicsFunction);
}

export function* watchupdateSubClinic() {
    yield takeEvery(SubClinicsActionTypes.UPDATE_SUBCLINIC, updateSubClinicFunction);
}
export function* watchgetClinicsTypeState() {
    yield takeEvery(SubClinicsActionTypes.GET_SUBCLINICTYPE, getSubClinicTypeFunction);
}

export function* watchgetCityState() {
    yield takeEvery(SubClinicsActionTypes.GET_CITIES, getSubClinicCityFunction);
}
export function* watchgetSubscription() {
    yield takeEvery(SubClinicsActionTypes.GET_SUBSCRIPTION, getSubscriptionFunction);
}

function* subclinicsSaga() {
    yield all([
       
         fork(watchCreateClinics),
         fork(watchGetClinics),
         fork(watchgetClinicsTypeState),
         fork(watchgetCityState),
         fork(watchUpgrade),
         fork(watchupdateSubClinic)
    ]);
}
export default subclinicsSaga;
