import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
const api = new APICore();

export function createNoteCategoriesApi(params: any): any {
    const { data } = params;
    return api.create(URL.createNoteCategories, data);
}

export function getNoteCategoriesApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getNoteCategories}`);
}

export function updateNoteCategoriesApi(params: any): any {
    const { data } = params;
    return api.create(URL.updateNoteCategories, data);
}