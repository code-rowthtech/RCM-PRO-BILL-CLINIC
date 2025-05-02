import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
const api = new APICore();

export function createTobaccooApi(params: any): any {
    const { data } = params;
    return api.create(URL.createTobaccoo, data);
}

export function updateTobaccooApi(params: any): any {
    const { data } = params;
    return api.update(`${URL.updateMedication}/${data?.medicationId}`, data);
}

export function getTobaccooApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getTobaccoo}?subject=${data?.patientId}`);
}

// FAMILY/GENETIC
export function createFamilyGeneticApi(params: any): any {
    const { data } = params;
    return api.create(URL.createFamily, data);
}
export function updateFamilyGeneticApi(params: any): any {
    const { data } = params;
    return api.create(URL.updateFamily, data);
}
export function getFamilyGeneticApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getFamily}?subject=${data?.patientId}`);
}

export function deleteFamilyGeneticApi(params: any): any {
    const { data } = params;
    return api.delete(URL.deleteFamily, data);
}


