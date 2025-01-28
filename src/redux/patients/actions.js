// @flow
import { PatientsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const getPatientsAction = (data): AuthAction => ({
    type: PatientsActionTypes.GET_PATIENTS,
    data
});

export const getPatientByIdAction = (data): AuthAction => ({
    type: PatientsActionTypes.GET_PATIENTS_BY_ID,
    data
});
export const createPatientsAction = (data): AuthAction => ({
    type: PatientsActionTypes.CREATE_PATIENTS,
    data
});

export const createResponsiblePartyAction = (data): AuthAction => ({
    type: PatientsActionTypes.CREATE_RESPONSIBLE_PARTY,
    data
});

export const updateResponsiblePartyAction = (data): AuthAction => ({
    type: PatientsActionTypes.UPDATE_RESPONSIBLE_PARTY,
    data
});

export const getResponsiblePartyAction = (data): AuthAction => ({
    type: PatientsActionTypes.GET_RESPONSIBLE_PARTY,
    data
});
export const getResponsiblePartyByIdAction = (data): AuthAction => ({
    type: PatientsActionTypes.GET_RESPONSIBLE_PARTY_BY_ID,
    data
});

export const updatePatientsAction = (data): AuthAction => ({
    type: PatientsActionTypes.UPDATE_PATIENTS,
    data
});

export const createInsuranceAction = (data): AuthAction => ({
    type: PatientsActionTypes.CREATE_INSURANCE,
    data
});

export const getInsuranceByPatientAction = (data): AuthAction => ({
    type: PatientsActionTypes.GET_INSURANCE_BY_ID,
    data
});

export const updateInsuranceAction = (data): AuthAction => ({
    type: PatientsActionTypes.UPDATE_INSURANCE,
    data
});
export const resetUpdateAction = (): LayoutAction => ({
    type: PatientsActionTypes.RESET_UPDATE_STATUS,
});