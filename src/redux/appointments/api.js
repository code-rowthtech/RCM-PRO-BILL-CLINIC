import { decryptMessage } from '../../cryptoUtils';
import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createAppointmentApi(params: any): any {
    const { data } = params;
    return api.create(URL.createAppointment, data);
}

export function rescheduleAppointmentApi(params: any): any {
    const { data } = params;
    return api.update(`${URL.rescheduleAppointment}${data?.id}`, data);
}

export function getPractitionerScheduleApi(params: any): any {
    const { data } = params;
    return api.create(URL.getPractitionerSchedule, data);
}

export function getAppointmentsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getAppointments}${data?.clinicId}?status=${data?.status}&doctorId=${data?.doctorId}`);
}

export function getAppointmentByIdApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getAppointmentById}${data?.id}`);
}

export function getPractitionerSlotsApi(params: any): any {
    const { data } = params;
    return api.create(URL.getPractitionerSlots, data);
}

