import { all, fork, put, takeEvery, call, takeLatest } from 'redux-saga/effects';
import { PatientsActionTypes } from './constants';
import { createInsuranceApi, createPatientsApi, createResponsiblePartyApi, getInsuranceByIdApi, getPatientByIdApi, getPatientsApi, getPatientsByAppointmentApi, getResponsiblePartyApi, updateInsuranceApi, updatePatientsApi, updateResponsiblePartyApi } from './api';
import { decryptMessage } from '../../cryptoUtils';
import ToastHandle from '../../helpers/ToastMessage';
import { createResponsibleParty } from '../../helpers/api/apiEndpoints';
/**
 * Login the user
 * @param {*} payload - username and password
 */


function* getPatientsFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.GET_PATIENTS_LOADING,
            payload: {},
        });
        const response = yield call(getPatientsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: PatientsActionTypes.GET_PATIENTS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.GET_PATIENTS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PatientsActionTypes.GET_PATIENTS_ERROR,
            payload: error,
        });
    }
}

function* getPatientsByAppointmentFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.GET_PATIENTS_BY_APPOINTMENT_LOADING,
            payload: {},
        });
        const response = yield call(getPatientsByAppointmentApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: PatientsActionTypes.GET_PATIENTS_BY_APPOINTMENT_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.GET_PATIENTS_BY_APPOINTMENT_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PatientsActionTypes.GET_PATIENTS_BY_APPOINTMENT_ERROR,
            payload: error,
        });
    }
}

function* getPatientByIdFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.GET_PATIENTS_BY_ID_LOADING,
            payload: {},
        });
        const response = yield call(getPatientByIdApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {
            yield put({
                type: PatientsActionTypes.GET_PATIENTS_BY_ID_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.GET_PATIENTS_BY_ID_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PatientsActionTypes.GET_PATIENTS_BY_ID_ERROR,
            payload: error,
        });
    }
}

function* createPatientsFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.CREATE_PATIENTS_LOADING,
            payload: {},
        });
        const response = yield call(createPatientsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        console.log(decryptedData,"decryptedData ")
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: PatientsActionTypes.CREATE_PATIENTS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.CREATE_PATIENTS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: PatientsActionTypes.CREATE_PATIENTS_ERROR,
            payload: error,
        });
    }
}

function* createResponsiblePartyFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.CREATE_RESPONSIBLE_PARTY_LOADING,
            payload: {},
        });
        const response = yield call(createResponsiblePartyApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: PatientsActionTypes.CREATE_RESPONSIBLE_PARTY_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.CREATE_RESPONSIBLE_PARTY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: PatientsActionTypes.CREATE_RESPONSIBLE_PARTY_ERROR,
            payload: error,
        });
    }
}

function* updateResponsiblePartyFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.UPDATE_RESPONSIBLE_PARTY_LOADING,
            payload: {},
        });
        const response = yield call(updateResponsiblePartyApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 200) {

            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: PatientsActionTypes.UPDATE_RESPONSIBLE_PARTY_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.UPDATE_RESPONSIBLE_PARTY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: PatientsActionTypes.UPDATE_RESPONSIBLE_PARTY_ERROR,
            payload: error,
        });
    }
}
function* getResponsiblePartyFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.GET_RESPONSIBLE_PARTY_LOADING,
            payload: {},
        });
        const response = yield call(getResponsiblePartyApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        if (response.status === 201) {
            yield put({
                type: PatientsActionTypes.GET_RESPONSIBLE_PARTY_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.GET_RESPONSIBLE_PARTY_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PatientsActionTypes.GET_RESPONSIBLE_PARTY_ERROR,
            payload: error,
        });
    }
}

function* updatePatientsFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.UPDATE_PATIENTS_LOADING,
            payload: {},
        });
        const response = yield call(updatePatientsApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        console.log(decryptedData, 'decryptedData')
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: PatientsActionTypes.UPDATE_PATIENTS_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.UPDATE_PATIENTS_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: PatientsActionTypes.UPDATE_PATIENTS_ERROR,
            payload: error,
        });
    }
}

function* updateInsuranceFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.UPDATE_INSURANCE_LOADING,
            payload: {},
        });
        const response = yield call(updateInsuranceApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));
        console.log(decryptedData, 'decryptedData')
        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: PatientsActionTypes.UPDATE_INSURANCE_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.UPDATE_INSURANCE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: PatientsActionTypes.UPDATE_INSURANCE_ERROR,
            payload: error,
        });
    }
}

function* createInsuranceFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.CREATE_INSURANCE_LOADING,
            payload: {},
        });
        const response = yield call(createInsuranceApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            ToastHandle(decryptedData?.message, 'success');
            yield put({
                type: PatientsActionTypes.CREATE_INSURANCE_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.CREATE_INSURANCE_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        ToastHandle(error, 'danger');
        yield put({
            type: PatientsActionTypes.CREATE_INSURANCE_ERROR,
            payload: error,
        });
    }
}

function* getInsuranceByPatientIdFunction(data) {
    try {
        yield put({
            type: PatientsActionTypes.GET_INSURANCE_BY_ID_LOADING,
            payload: {},
        });
        const response = yield call(getInsuranceByIdApi, data);
        const decryptedData = JSON.parse(decryptMessage(response.data.data));

        if (response.status === 200) {
            yield put({
                type: PatientsActionTypes.GET_INSURANCE_BY_ID_SUCCESS,
                payload: { ...decryptedData },
            });
        } else {
            yield put({
                type: PatientsActionTypes.GET_INSURANCE_BY_ID_ERROR,
                payload: { ...decryptedData },
            });
        }
    } catch (error) {
        yield put({
            type: PatientsActionTypes.GET_INSURANCE_BY_ID_ERROR,
            payload: error,
        });
    }
}
export function* callResetUpdate() {
    put({
        type: PatientsActionTypes.RESET_UPDATE_STATUS,
        payload: {},
    });

}


export function* watchGetPatients() {
    yield takeEvery(PatientsActionTypes.GET_PATIENTS, getPatientsFunction);
}

export function* watchGetPatientsByAppointment() {
    yield takeEvery(PatientsActionTypes.GET_PATIENTS_BY_APPOINTMENT, getPatientsByAppointmentFunction);
}

export function* watchGetPatientById() {
    yield takeEvery(PatientsActionTypes.GET_PATIENTS_BY_ID, getPatientByIdFunction);
}

export function* watchCreatePatients() {
    yield takeEvery(PatientsActionTypes.CREATE_PATIENTS, createPatientsFunction);
}

export function* watchCreateResponsibleParty() {
    yield takeEvery(PatientsActionTypes.CREATE_RESPONSIBLE_PARTY, createResponsiblePartyFunction);
}

export function* watchUpdateResponsibleParty() {
    yield takeEvery(PatientsActionTypes.UPDATE_RESPONSIBLE_PARTY, updateResponsiblePartyFunction);
}

export function* watchGetResponsibleParty() {
    yield takeEvery(PatientsActionTypes.GET_RESPONSIBLE_PARTY, getResponsiblePartyFunction);
}

export function* watchUpdatePatients() {
    yield takeEvery(PatientsActionTypes.UPDATE_PATIENTS, updatePatientsFunction);
}
export function* watchCreateInsurance() {
    yield takeEvery(PatientsActionTypes.CREATE_INSURANCE, createInsuranceFunction);
}

export function* watchGetInsuranceByPatientId() {
    yield takeEvery(PatientsActionTypes.GET_INSURANCE_BY_ID, getInsuranceByPatientIdFunction);
}
export function* watchUpdateInsurance() {
    yield takeEvery(PatientsActionTypes.UPDATE_INSURANCE, updateInsuranceFunction);
}

export function* watchresetState() {
    yield takeEvery(PatientsActionTypes.RESET_UPDATE_STATUS, callResetUpdate);
}

function* patientsSaga() {
    yield all([
        fork(watchGetPatients),
        fork(watchGetPatientsByAppointment),
        fork(watchGetPatientById),
        fork(watchCreatePatients),
        fork(watchCreateResponsibleParty),
        fork(watchUpdateResponsibleParty),
        fork(watchGetResponsibleParty),
        fork(watchUpdatePatients), fork(watchCreateInsurance), fork(watchUpdateInsurance),
        fork(watchGetInsuranceByPatientId),
        fork(watchresetState),
    ]);
}
export default patientsSaga;
