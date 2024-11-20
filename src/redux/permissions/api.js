import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createPermissionsApi(params: any): any {
    const { data } = params;
    return api.create(URL.addPermissions, data);
}
export function getPermissionsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getPermissions}?name=${data?.search}&limit=${data?.limit}&page=${data?.skip}`);
}
export function deletePermissionsApi(params: any): any {
    const { data } = params;
    return api.create(URL.deletePermissions, data);
}

export function updatePermissionsApi(params: any): any {
    const { data } = params;
    return api.update(URL.updatePermissions, data);
}
