// @flow
import { ClinicsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };

export const createClinicAction = (data): AuthAction => ({
    type: ClinicsActionTypes.CREATE_CLINIC,
    data
});

export const changeEmailAction = (data): AuthAction => ({
    type: ClinicsActionTypes.CHANGE_EMAIL,
    data
});

export const getClinicAction = (data): AuthAction => ({
    type: ClinicsActionTypes.GET_CLINIC,
    data
});

export const getClinicTypeAction = (data): AuthAction => ({
    type: ClinicsActionTypes.GET_CLINIC_TYPE,
    data
});

export const getStatesByCountryAction = (data): AuthAction => ({
    type: ClinicsActionTypes.GET_STATES,
    data
});

export const getCitiesAction = (data) => ({
    type: ClinicsActionTypes.GET_CITIES,
    data
});

export const getCities2Action = (data) => ({
    type: ClinicsActionTypes.GET_CITIES2,
    data
});

export const updateClinicAction = (data): AuthAction => ({
    type: ClinicsActionTypes.UPDATE_CLINIC,
    data
});

export const getClinicById = (data): AuthAction => ({
    type: ClinicsActionTypes.GET_CLINIC_BY_ID,
    data
});

export const addSubscriptionPlanAction = (data): LayoutAction => ({
    type: ClinicsActionTypes.CREATE_SUBSCRIPTION,
    data
});

export const createContractAction = (data): LayoutAction => ({
    type: ClinicsActionTypes.CREATE_CONTRACT,
    data
});


export const standardContractAction = (data): LayoutAction => ({
    type: ClinicsActionTypes.STANDARD_CONTRACT,
    data
});

export const getClinicByParentAction = (data): AuthAction => ({
    type: ClinicsActionTypes.GET_CLINIC_BY_PARENT,
    data
});

export const deleteClinicAction = (data): AuthAction => ({
    type: ClinicsActionTypes.DELETE_CLINIC,
    data
});

export const stateEmptydAction = (): LayoutAction => ({
    type: ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE,
});
