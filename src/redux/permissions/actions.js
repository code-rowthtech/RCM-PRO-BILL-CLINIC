// @flow
import { PermissionsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const createPermissionAction = (data): AuthAction => ({
    type: PermissionsActionTypes.CREATE_PERMISSIONS,
    data
});
export const getPermissionAction = (data): AuthAction => ({
    type: PermissionsActionTypes.GET_PERMISSIONS,
    data
});
export const deletePermissionAction = (data): AuthAction => ({
    type: PermissionsActionTypes.DELETE_PERMISSIONS,
    data
});
export const updatePermissionAction = (data): AuthAction => ({
    type: PermissionsActionTypes.UPDATE_PERMISSIONS,
    data
});

export const stateEmptydAction = (): LayoutAction => ({
    type: PermissionsActionTypes.STATE_EMPTY_INTIAL_STATE,

});