import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createScheduleApi(params: any): any {
    const { data } = params;
    return api.create(URL.createSchedule, data);
}