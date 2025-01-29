// @flow
import { VitalsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const createVitalsAction = (data): AuthAction => ({
    type: VitalsActionTypes.CREATE_VITALS,
    data
});

export const getVitalsAction = (data): AuthAction => ({
    type: VitalsActionTypes.GET_VITALS,
    data
});

export const getVitalsByPatientIdAction = (data): AuthAction => ({
    type: VitalsActionTypes.GET_VITALS_BY_PATIENT_ID,
    data
});

export const getVitalsByAppointmentIdAction = (data): AuthAction => ({
    type: VitalsActionTypes.GET_VITALS_BY_APPOINTMENT_ID,
    data
});

export const updateVitalsAction = (data): AuthAction => ({
    type: VitalsActionTypes.UPDATE_VITALS,
    data
});