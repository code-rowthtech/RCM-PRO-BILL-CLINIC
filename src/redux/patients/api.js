import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function getPatientsApi(params: any): any {
    const { data } = params;
    return api.create(`${URL.getPatients}?page=${data?.payload?.page}&limit=${data?.payload?.limit}`);
}

export function createPatientsApi(params: any): any {
    const { data } = params;
    console.log(data,'apidata')
    return api.create(URL.createPatients, data);
}


export function updatePatientsApi(params: any): any {
    const { data } = params;
    return api.update(URL.updatePatients, data);

}

