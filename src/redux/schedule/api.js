import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createScheduleApi(params: any): any {
    const { data } = params;
    console.log(data,'datatime')
    return api.create(URL.createSchedule, data);
}

export function getDoctorsListApi(params: any): any {
    const { data } = params;
    return api.get(URL.getDoctorsList,data);
}

export function getScheduleApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getSchedule}?flag=${data?.flag}&search=${data?.search}&startDate=${data?.startDate}&endDate=${data?.endDate}` );
}