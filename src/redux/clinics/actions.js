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
    type: ClinicsActionTypes.GET_CITIES1,
    data
});

export const getCities2Action = (data) => ({
    type: ClinicsActionTypes.GET_CITIES2,
    data
});
export const getCities3Action = (data) => ({
    type: ClinicsActionTypes.GET_CITIES3,
    data
});
export const getCities4Action = (data) => ({
    type: ClinicsActionTypes.GET_CITIES4,
    data
});
export const getCities5Action = (data) => ({
    type: ClinicsActionTypes.GET_CITIES5,
    data
});
export const getCities6Action = (data) => ({
    type: ClinicsActionTypes.GET_CITIES6,
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

export const stateEmptydActionAuth = (): LayoutAction => ({
    type: ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE,
});
