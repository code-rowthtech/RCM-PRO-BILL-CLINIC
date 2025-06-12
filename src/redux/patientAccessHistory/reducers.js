import { PatientsAccessActionTypes } from "./constants"


const GET_PATIENTS_ACCESS_LOGS_INITIAL_STATE = {
    data: [],
    loading: false,
}

export const getPatientsAccessLogsReducer = (state = GET_PATIENTS_ACCESS_LOGS_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsAccessActionTypes.GET_PATIENTS_ACCESS_LOGS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsAccessActionTypes.GET_PATIENTS_ACCESS_LOGS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsAccessActionTypes.GET_PATIENTS_ACCESS_LOGS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsAccessActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}