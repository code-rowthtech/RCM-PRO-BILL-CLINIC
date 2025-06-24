import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
const api = new APICore();

export function createTemplateApi(params: any): any {
    const { data } = params;
    return api.create(URL.templates, data);
}

export function deleteTemplateApi(params: any): any {
    const { data } = params;
    return api.delete(URL.templates, data);
}

export function updateTemplateApi(params: any): any {
    const { data } = params;
    return api.update(`${URL.templates}/${data?.templateId}`, data);
}

export function getTemplateApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.templates}?page=${data?.skip}&search=${data?.search}&status=${data?.status}&limit=${data?.limit || 10}`);
}
