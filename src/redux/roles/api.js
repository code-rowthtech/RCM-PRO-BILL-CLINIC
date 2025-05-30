import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
const api = new APICore();

export function createRolesApi(params: any): any {
    const { data } = params;
    return api.create(URL.createRoles, data);
}

export function viewPasswordApi(params: any): any {
    const { data } = params;
    return api.create(URL.viewPassword, data);
}

export function updateRolesApi(params: any): any {
    const { data } = params;
    return api.create(URL.updateRoles, data);
}
export function getUser(params: any): any {
    const { id } = params;
    return api.get(`${URL.getUserId}?id=${id}`);
}
export function deleteRoles(params: any): any {
    const { id } = params;
    return api.delete(`${URL.deleterRoles}?id=${id}`);
}
export function getRolesApi(params: any): any {
    const { data } = params;
    return api.create(`${URL.getRoles}?clinicId=${data?.clinicId}&search=${data?.search}&status=${data?.status}&page=${data?.page}&limit=${data?.limit}`);
}
