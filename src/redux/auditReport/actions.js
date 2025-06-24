import { AuditReportActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const getAuditReportAction = (data): AuthAction => ({
    type: AuditReportActionTypes.GET_AUDIT_REPORT,
    data
});