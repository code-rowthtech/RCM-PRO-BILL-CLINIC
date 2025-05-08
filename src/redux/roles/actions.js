// @flow
import { RolesActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };

export const createRolesAction = (data): AuthAction => ({
    type: RolesActionTypes.CREATE_ROLES,
    data
});

export const updateRolesAction = (data): AuthAction => ({
    type: RolesActionTypes.UPDATE_ROLES,
    data
});

export const getRolesAction = (data): AuthAction => ({
    type: RolesActionTypes.GET_ROLES,
    data
});

export const viewPasswordAction = (data): AuthAction => ({
    type: RolesActionTypes.VIEW_PASSWORD,
    data
});
export const getUserAction = (id): AuthAction => ({
    type: RolesActionTypes.GET_USER,
    id
});
export const deleteRolesAction = (id): AuthAction => ({
    type: RolesActionTypes.DELETE_ROLES,
    id
});

export const stateEmptydActionRoles = (): AuthAction => ({
    type: RolesActionTypes.STATE_EMPTY_INTIAL_STATE,

});