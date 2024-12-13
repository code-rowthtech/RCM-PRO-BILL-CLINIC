import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createSubClinicApi(params: any): any {
    const { data } = params;
    return api.create(URL.createSubClinic, data);
}
export function createUpgradeApi(params: any): any {
    const { data } = params;
    return api.create(URL.createUpgrade, data);
}

export function getSubClinicApi(params: any): any {
    const { data } = params;
    return api.create(URL.getSubClinic,data);
}
export function updateSubClinicApi(params: any): any {
    const { data } = params;
    return api.create(URL.updateSubClinic,data);
}
export function getCityByStateApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getSubClinicCityByState}${data?.state_code}?name=${data?.name}&page=${data?.skip}&limit=${data?.limit}`);
}

export function getSubClinicTypeApi(params: any): any {
    const { data } = params;
    return api.get(URL.getSubClinicType, data);
}
export function getSubscriptionApi(params: any): any {
    const { data } = params;
    return api.get(URL.getSubscription, data);
}
