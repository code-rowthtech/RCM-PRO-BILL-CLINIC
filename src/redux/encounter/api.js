import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
const api = new APICore();

export function createEncounterApi(params: any): any {
    const { data } = params;
    return api.create(URL.encounter, data);
}

export function updateEncounterApi(params: any): any {
    const { data } = params;
    return api.update(`${URL.encounter}/${data?.medicationId}`, data);
}

export function getEncounterApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.encounter}/all?patientId=${data?.patientId}`);
}

// encounter settings

export function createEncounterSettingsApi(params: any): any {
    const { data } = params;
    return api.create(URL.encounterSettings, data);
}