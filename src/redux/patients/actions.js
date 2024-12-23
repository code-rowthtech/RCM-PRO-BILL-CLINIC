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

export const updatePatientsAction = (data): AuthAction => ({
    type: PatientsActionTypes.UPDATE_PATIENTS,
    data
});

export const stateEmptydAction = (): LayoutAction => ({
    type: PatientsActionTypes.STATE_EMPTY_INTIAL_STATE,

});