import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
import { loggedInUser } from '../../helpers/api/loggedInUser';
const api = new APICore();

export function createEncounterApi(params: any): any {
    const { data } = params;
    return api.create(URL.encounter, data);
}

export function updateEncounterApi(params: any): any {
    const { data } = params;
    return api.update(`${URL.encounter}`, data);
}

export function getEncounterApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.encounter}/patient/${data?.patientId}?limit=10&page=${data?.skip || 1}`);
}

export function getEncounterNotesTypeApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.encounterNotesType}?clinicId=${data?.clinicId || loggedInUser?.clinicId}&userId=${data?.userId || loggedInUser?._id}&page=${data?.skip}&search=${data?.search || ''}`);
}

export function getEncounterNoteFieldsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.encounterNoteFields}?noteId=${data?.noteId}`);
}

// encounter settings

export function createEncounterSettingsApi(params: any): any {
    const { data } = params;
    return api.create(URL.encounterSettings, data);
}

export function updateEncounterSettingsApi(params: any): any {
    const { data } = params;
    return api.update(URL.encounterSettings, data);
}

export function getEncounterSettingsApi(params: any): any {
    const { data } = params;
    return api.get(URL.encounterSettings, data);
}

export function getEncounterByIdApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.encounter}/${data?.encounterId}`);
}