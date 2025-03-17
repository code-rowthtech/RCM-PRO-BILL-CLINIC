import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function createVitalsApi(params: any): any {
    const { data } = params;
    return api.create(URL.createVitals, data);
}

export function getVitalsApi(params: any): any {
    const { data } = params;
    return api.get(URL.getVitals, data);
}
export function getVitalsByPatientApi(params: any): any {
    const { data } = params;
    return api.create(URL.getVitalsByPatientId, data);
}
export function getVitalsByAppointmentApi(params: any): any {
    const { data } = params;
    return api.create(URL.getVitalsByAppointmentId, data);
}

export function updateVitalsApi(params: any): any {
    const { data } = params;
    return api.update(URL.updateVitals, data);
}