import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function getPatientsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getPatients}?clinicId=${data?.payload?.clinicId}&page=${data?.payload?.skip}&limit=${data?.payload?.limit}&search=${data?.payload?.search}`);
}

