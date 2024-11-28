import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createSubClinicApi(params: any): any {
    const { data } = params;
    return api.create(URL.createSubClinic, data);
}

export function getSubClinicApi(params: any): any {
    const { data } = params;
    return api.get(URL.getSubClinic, data);
}

export function getSubClinicTypeApi(params: any): any {
    const { data } = params;
    console.log(data,'clinic api')
    return api.get(URL.getSubClinicType, data);
}
