// @flow
import { SettingsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const createMastersDataAction = (data): AuthAction => ({
    type: SettingsActionTypes.CREATE_MASTERS_DATA,
    data
});

export const getMastersDataAction = (data): AuthAction => ({
    type: SettingsActionTypes.GET_MASTERS_DATA,
    data
});
export const getMastersDataAction2 = (data): AuthAction => ({
    type: SettingsActionTypes.GET_MASTERS2_DATA,
    data
});
export const getDepartmentDataAction = (data): AuthAction => ({
    type: SettingsActionTypes.GET_DEPARTMENT_DATA,
    data
});
export const updateMastersDataAction = (data): AuthAction => ({
    type: SettingsActionTypes.UPDATE_MASTERS_DATA,
    data
});

export const stateEmptydActionSettings = (): LayoutAction => ({
    type: SettingsActionTypes.STATE_EMPTY_INTIAL_STATE,

});


// CONSENT FORM ACTIONS
export const createConsentFormAction = (data): AuthAction => ({
    type: SettingsActionTypes.CREATE_CONSENT_FORM,
    data
});

export const updateConsentFormAction = (data): AuthAction => ({
    type: SettingsActionTypes.UPDATE_CONSENT_FORM,
    data
});

export const deleteConsentFormAction = (data): AuthAction => ({
    type: SettingsActionTypes.DELETE_CONSENT_FORM,
    data
});

export const getConsentFormAction = (data): AuthAction => ({
    type: SettingsActionTypes.GET_CONSENT_FORM,
    data
});