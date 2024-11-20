import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createClinicApi(params: any): any {
    const { data } = params;
    return api.create(URL.createClinic, data);
}

export function updateClinicApi(params: any): any {
    const { data } = params;
    return api.update(URL.updateClinic, data);
}

export function getClinicByIdApi(params: any): any {
    const { data } = params;
    return api.create(URL.getClinicById, data);
}

export function getStateByCountry(params: any): any {
    const { data } = params;
    return api.get(URL.getStatedByCountry, data);
}

export function getCityByStateApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getCityByState}${data?.state_code}?name=${data?.name}&page=${data?.skip}&limit=${data?.limit}`);
}

export function getClinicApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getClinic}?name=${data?.payload?.name}&page=${data?.payload?.skip}&limit=${data?.payload?.limit}&status=${data?.payload?.status}`);
}

export function addSubscriptionPlanApi(params: any): any {
    const { data } = params;
    return api.create(URL.addSubscriptionPlan, data);
}

export function getClinicsByParentIdApi(params: any): any {
    const { data } = params;
    return api.create(URL.getClinicsByParentId, data)
}

export function deleteClinicOnboardingApi(params: any): any {
    const { data } = params;
    return api.create(URL.deleteClinicOnboarding, data)
}