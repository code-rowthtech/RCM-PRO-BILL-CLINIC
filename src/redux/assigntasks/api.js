import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
const api = new APICore();

export function getClinicEmployeesApi(params: any): any {
    const { data } = params;
    return api.get(URL.getClinicEmployees);
}

export function createTaskApi(params: any): any {
    const { data } = params;
    return api.create(URL.createTask, data);
}

export function getTaskApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getAllTasks}?assignedToId=${data?.assignedToId}&taskStatus=${data?.taskStatus}&priority=${data?.priority}&sortBy=${data?.sortBy}&page=${data?.page}&limit=${data?.limit}`);
}

export function updateTaskApi(params: any): any {
    const { data } = params;
    return api.create(URL.updateTask, data);
}

export function getTaskDetailsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getTaskDetails}?id=${data?.id}`);
}
