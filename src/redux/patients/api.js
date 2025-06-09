import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function getPatientsApi(params: any): any {
    const { data } = params;
    return api.get(URL.getPatients, data);

}

export function getPatientsByAppointmentApi(params: any): any {
    const { data } = params;
    return api.create(URL.getPatientsByAppointment, data);
}

export function getPatientByIdApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getPatientById}?id=${data?.id}`);
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

export function getResponsiblePartyByIdApi(params: any): any {
    const { data } = params;
    return api.create(URL.getResponsiblePartyById, data);
}

export function updateResponsiblePartyApi(params: any): any {
    const { data } = params;
    return api.update(URL.updateResponsibleParty, data);
}

export function updatePatientsApi(params: any): any {
    const { data } = params;
    return api.update(URL.updatePatients, data);
}

export function createInsuranceApi(params: any): any {
    const { data } = params;
    return api.create(URL.createInsurance, data);
}

export function getInsuranceByIdApi(params: any): any {
    const { data } = params;
    return api.create(URL.getInsuranceById, data);
}

export function updateInsuranceApi(params: any): any {
    const { data } = params;
    return api.create(URL.updateInsurance, data);
}

export function uploadDocumentsApi(params: any): any {
    const { data } = params;
    return api.create(URL.documents, data);
}

export function updateDocumentsApi(params: any): any {
    const { data } = params;
    return api.update(`${URL.documents}/${data?.patientDocId}`, data);
}

export function deleteDocumentsApi(params: any): any {
    const { data } = params;
    return api.delete(`${URL.documents}/${data?.patientDocId}`, data);
}

export function getDocumentsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.documents}?subject=${data?.subject}`);
}
export function getDocumentsByIdApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.documents}/${data?.docId}`);
}