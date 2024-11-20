import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createMastersDataApi(params: any): any {
    const { data } = params;
    return api.create(URL.addMastersData, data);
}

export function getMastersDataApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getMastersData}?search=${data?.search}&category=${data?.category}&status=${data?.status}&page=${data?.skip}&limit=${data?.limit}`);
}

export function updateMastersDataApi(params: any): any {
    const { data } = params;
    return api.update(URL.updateMastersData, data)
}