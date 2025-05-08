// @flow
import { RoleActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const createRoleDataAction = (data): AuthAction => ({
    type: RoleActionTypes.CREATE_ROLE_DATA,
    data
});

export const getRoleDataAction = (data): AuthAction => ({
    type: RoleActionTypes.GET_ROLE_DATA,
    data
});
export const updateRoleDataAction = (data): AuthAction => ({
    type: RoleActionTypes.UPDATE_ROLE_DATA,
    data
});

export const stateEmptydActionRoleTypes = (): LayoutAction => ({
    type: RoleActionTypes.STATE_EMPTY_INTIAL_STATE,

});