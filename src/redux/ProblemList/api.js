import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
const api = new APICore();

export function getProblemListApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getProblemList}?patientId=${data?.patientId}`);
}

export function createProblemListApi(params: any): any {
    const { data } = params;
    return api.create(URL.createProblemList, data);
}
export function updateProblemListApi(params: any): any {
    const { data } = params;
    return api.create(URL.updateProblemList, data);
}

export function deleteProblemListApi(params: any): any {
    const { data } = params;
    return api.delete(`${URL.deleteProblemList}?id=${data?.id}`);
}

export function getAllCodeApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.allCodes}?query=${data.search}`);
}
export function getPatientAppointmentsApi(params: any): any {
    const { data } = params;
    return api.create(URL.getPatientAppointment, data);
}
export function getProblemDetailsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getProblemDetails}?id=${data?.id}`);
}
