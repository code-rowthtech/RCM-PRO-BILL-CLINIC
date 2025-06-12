import { AuditReportActionTypes } from "./constants"


const GET_AUDIT_REPORT_INITIAL_STATE = {
    data: [],
    loading: false,
}

export const getAuditReportReducer = (state = GET_AUDIT_REPORT_INITIAL_STATE, action) => {
    switch (action.type) {
        case AuditReportActionTypes.GET_AUDIT_REPORT_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case AuditReportActionTypes.GET_AUDIT_REPORT_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case AuditReportActionTypes.GET_AUDIT_REPORT_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case AuditReportActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}