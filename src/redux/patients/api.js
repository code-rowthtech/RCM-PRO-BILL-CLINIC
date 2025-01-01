import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function getPatientsApi(params: any): any {
    const { data } = params;
    return api.create(URL.getPatients, data);
}

export function getPatientByIdApi(params: any): any {
    const { data } = params;
    return api.create(URL.getPatientById, data);
}

export function createPatientsApi(params: any): any {
    const { data } = params;
    return api.create(URL.createPatients, data);
}

export function createResponsiblePartyApi(params: any): any {
    const { data } = params;
    return api.create(URL.createResponsibleParty, data);
}
export function getResponsiblePartyApi(params: any): any {
    const { data } = params;
    return api.create(URL.getResponsibleParty, data);
}


export function updatePatientsApi(params: any): any {
    const { data } = params;
    return api.create(URL.updatePatients, data);

}

