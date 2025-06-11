import { PatientsAccessActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const getPatientsAccessLogsAction = (data): AuthAction => ({
    type: PatientsAccessActionTypes.GET_PATIENTS_ACCESS_LOGS,
    data
});