import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function getPatientsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getPatients}?page=${data?.payload?.page}&limit=${data?.payload?.limit}`);
}

 