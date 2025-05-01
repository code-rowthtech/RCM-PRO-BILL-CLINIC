import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
const api = new APICore();

export function createMedicationApi(params: any): any {
    const { data } = params;
    return api.create(URL.createMedication, data);
}

export function getMedicationDrugsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getMedicationDrugs}?page=${data?.skip}&query=${data?.search}`);
}

export function getMedicationApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getMedication}/all?patientId=${data?.patientId}`);
}

// export function updateAllergyApi(params: any): any {
//     const { data } = params;
//     return api.create(URL.updateAllergy, data);
// }

// export function deleteAllergyApi(params: any): any {
//     const { data } = params;
//     // return api.delete(URL.deleteAllergyList, data);
//     return api.delete(`${URL.deleteAllergyList}?id=${data?.id}`);
// }
