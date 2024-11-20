import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function getDoctorsApi(params: any): any {
    const { data } = params;
    return api.get(`${URL.getDoctor}?clinicId=${data?.clinicId}&page=${data?.skip}&limit=${data?.limit}&search=${data?.search}`);
}

