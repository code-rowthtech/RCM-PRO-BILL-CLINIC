import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
const api = new APICore();

export function createTasksApi(params: any): any {
    const { data } = params;
    return api.create(URL.tasks, data);
}
export function getTasksDetailsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.tasks}?id=${data?.id}`);
}
export function updateTasksApi(params: any): any {
    const { data } = params;
    return api.create(URL.tasks, data);
}
export function deleteTasksApi(params: any): any {
    const { data } = params;
    return api.delete(`${URL.tasks}?id=${data?.id}`);
}
