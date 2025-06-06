import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';
import { loggedInUser } from '../../helpers/api/loggedInUser';
const api = new APICore();

export function createUserTasksApi(params: any): any {
    const { data } = params;
    return api.create(URL.tasks, data);
}

export function getUserTasksApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.tasks}?status=${data?.status}&priority=${data?.priority || ''}&assignedToId=${data?.assignedToId || ''}&page=${data?.skip}`);
}
