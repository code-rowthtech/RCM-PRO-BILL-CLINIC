import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
const api = new APICore();

export function createAllergyApi(params: any): any {
    const { data } = params;
    return api.create(URL.createAllergy, data);
}

export function getAllergyDetailsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getAllergyDetails}?id=${data?.id}`);
}

export function getAllergiesOfAPatientApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getAllergiesOfAPatient}?patientId=${data?.patientId}`);
}

export function updateAllergyApi(params: any): any {
    const { data } = params;
    return api.create(URL.updateAllergy, data);
}

export function deleteAllergyApi(params: any): any {
    const { data } = params;
    // return api.delete(URL.deleteAllergyList, data);
    return api.delete(`${URL.deleteAllergyList}?id=${data?.id}`);
}
