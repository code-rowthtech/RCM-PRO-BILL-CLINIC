import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createScheduleApi(params: any): any {
    const { data } = params;
    return api.create(URL.createSchedule, data);
}
export function deleteScheduleApi(params: any): any {
    const { id } = params;
    return api.delete(`${URL.deleteSchedule}?id=${id}`);
}

export function getDoctorsListApi(params: any): any {
    const { data } = params;
    return api.get(URL.getDoctorsList, data);
}

export function getScheduleApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getSchedule}?type=${data?.type}&search=${data?.search}&startDate=${data?.startDate}&endDate=${data?.endDate}`);
}