import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createRolesApi(params: any): any {
    const { data } = params;
    return api.create(URL.createRoles, data);
}

export function updateRolesApi(params: any): any {
    const { data } = params;
    return api.update(URL.updateRoles, data);
}

export function getRolesApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getRoles}?limit=${data?.limit}&page=${data?.skip}&search=${data?.search}`);
}
