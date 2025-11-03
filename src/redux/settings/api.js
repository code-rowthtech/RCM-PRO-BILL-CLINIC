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
export function getDepartmentDataApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getDepartmentData}?search=${data?.search}&category=${data?.category}&status=${data?.status}&page=${data?.skip}&limit=${data?.limit}`);
}

export function updateMastersDataApi(params: any): any {
    const { data } = params;
    return api.create(URL.updateMastersData, data)
}

export function createConsentFormApi(params: any): any {
    const { data } = params;
    return api.create(URL.consentFormEndpoints, data);
}

export function deleteConsentFormApi(params: any): any {
    const { data } = params;
    return api.delete(`${URL.consentFormEndpoints}/${data.id}`);
}

export function updateConsentFormApi(params: any): any {
    const { data } = params;
    return api.update(`${URL.consentFormEndpoints}/${data.id}`, data);
}

export function getConsentFormApi(params: any): any {
    const { data } = params;
    return api.get(URL.consentFormEndpoints, data);
}

