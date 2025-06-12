import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
const api = new APICore();

export function createUserTasksApi(params: any): any {
    const { data } = params;
    return api.create(URL.tasks, data);
}

export function updateUserTasksApi(params: any): any {
    const { data } = params;
    return api.update(`${URL.tasks}/${data?.taskId}`, data);
}

export function getUserTasksApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.tasks}?status=${data?.status}&priority=${data?.priority || ''}&assignedToId=${data?.assignedToId || ''}&page=${data?.skip}&search=${data?.search}`);
}

export function getUserTaskByIdApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.tasks}/${data?.taskId}`);
}
