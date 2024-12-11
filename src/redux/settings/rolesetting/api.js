import { APICore } from '../../../helpers/api/apiCore';
import * as URL from '../../../helpers/api/apiEndpoints';

const api = new APICore();

export function createRoleDataApi(params: any): any {
    const { data } = params;
    return api.create(URL.addRoleData, data);
}

export function getRoleDataApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getRoleData}?search=${data?.search}&clinicId=${data?.clinicId}&status=${data?.status}&page=${data?.page}&limit=${data?.limit}`);
}

export function updateRoleDataApi(params: any): any {
    const { data } = params;
    return api.update(URL.updateRoleData, data)
}
