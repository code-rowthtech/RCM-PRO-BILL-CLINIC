import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createClinicApi(params: any): any {
    const { data } = params;
    return api.create(URL.createClinic, data);
}

export function changeEmailApi(params: any): any {
    const { data } = params;
    return api.create(URL.changeEmail, data);
}

export function getClinicTypeApi(params: any): any {
    return api.get(URL.getClinicType);
}

export function getClinicByIdApi(params: any): any {
    const { data } = params;
    return api.create(URL.getClinicById, data);
}

export function getStateByCountry(params: any): any {
    return api.get(URL.getStatedByCountry);
}

export function getCityByStateApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getCityByState}${data?.state_code}?name=${data?.name}&page=${data?.skip}&limit=${data?.limit}`);
}
export function getClinicApi(params: any): any {
    const { data } = params;
    return api.create(URL.getClinic, data);
}

export function addSubscriptionPlanApi(params: any): any {
    const { data } = params;
    return api.create(URL.addSubscriptionPlan, data);
};

export function createContract(params: any): any {
    const { data } = params;
    return api.create(URL.createContract, data);
}
export function standardContract(params: any): any {
    const { data } = params;
    return api.get(URL.standardContract, data);
}

export function getClinicsByParentIdApi(params: any): any {
    const { data } = params;
    return api.create(URL.getClinicsByParentId, data)
}
export function deleteClinicOnboardingApi(params: any): any {
    const { data } = params;
    return api.create(URL.deleteClinicOnboarding, data)
}