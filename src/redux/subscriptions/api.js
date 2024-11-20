import { APICore } from '../../helpers/api/apiCore';
import * as URL from '../../helpers/api/apiEndpoints';

const api = new APICore();

export function getSubscriptionsApi(params: any): any {
    const { data } = params;
    return api.get(URL.getSubscriptions, data);
}

