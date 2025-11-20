import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
const api = new APICore();

export function createNoteCategoriesApi(params: any): any {
    const { data } = params;
    return api.create(URL.createNoteCategories, data);
}

export function getNoteCategoriesApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getNoteCategories}`, {
        page: data?.page || 1,
        limit: data?.limit,
        search: data?.search,
        active: data?.active,
        noteType: data?.noteType
    });
}

export function updateNoteCategoriesApi(params: any): any {
    const { data } = params;
    return api.update(`${URL.updateNoteCategories}${data?.id}`, data);
}

export function createNoteTypeSettingsApi(params: any): any {
    const { data } = params;
    return api.create(URL.createNoteCategories, data);
}

export function getNoteTypeSettingsApi(params: any): any {
    return api.get(`${URL.getNoteCategories}`);
}

export function updateNoteTypeSettingsApi(params: any): any {
    const { data } = params;
    return api.update(`${URL.updateNoteCategories}${data?.id}`, data);
}

// settings tabs
export function createSettingsTabsApi(params: any): any {
    const { data } = params;
    return api.create(URL.createnoteTypeSettings, data);
}

export function getSettingsTabsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.createnoteTypeSettings}?noteId=${data?.noteId}`);
}
export function updateSettingsTabsApi(params: any): any {
    const { data } = params;
    return api.update(`${URL.createnoteTypeSettings}`, data);
}