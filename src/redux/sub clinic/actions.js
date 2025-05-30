// @flow
import { SubClinicsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };

export const createSubClinicAction = (data): AuthAction => ({
    type: SubClinicsActionTypes.CREATE_SUBCLINIC,
    data
});
export const createUpgradeAction = (data): AuthAction => ({
    type: SubClinicsActionTypes.CREATE_UOGRADE,
    data
});
export const getSubClinicAction = (data): AuthAction => ({
    type: SubClinicsActionTypes.GET_SUBCLINIC,
    data
});
export const updateSubClinicAction = (data): AuthAction => ({
    type: SubClinicsActionTypes.UPDATE_SUBCLINIC,
    data
});
export const getSubClinicTypeAction = (data): AuthAction => ({
    type: SubClinicsActionTypes.GET_SUBCLINICTYPE,
    data
});

export const getSubscriptionAction = (data): AuthAction => ({
    type: SubClinicsActionTypes.GET_SUBSCRIPTION,
    data
});
export const getSubClinicCitiesAction = (data): AuthAction => ({
    type: SubClinicsActionTypes.GET_CITIES,
    data,
  
});
