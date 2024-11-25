import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function getDoctorsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getDoctor}?status=${data?.status}&search=${data?.search}`);
}

export function getDoctorsRolesApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getDoctorRoles}`);
}

export function createDoctorApi(params: any): any {
    const { data } = params;
    return api.create(URL.createDoctor,data);
}

export function createDoctorDetailApi(params: any): any {
    const { data } = params;
    return api.create(URL.createDoctorDetail,data);
}

