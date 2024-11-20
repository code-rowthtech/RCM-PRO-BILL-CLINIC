// @flow
import { ClinicsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };

export const createClinicAction = (data): AuthAction => ({
    type: ClinicsActionTypes.CREATE_CLINIC,
    data
});
export const getClinicAction = (data): AuthAction => ({
    type: ClinicsActionTypes.GET_CLINIC,
    data
});


export const getStatesByCountryAction = (data): AuthAction => ({
    type: ClinicsActionTypes.GET_STATES,
    data
});

export const getCitiesAction = (data): AuthAction => ({
    type: ClinicsActionTypes.GET_CITIES,
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
})

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
