import { VitalsActionTypes } from "./constants"


const CREATE_VITALS_DATA_INITIAL_STATE = {
    data: [],
    loading: false
}

const UPDATE_VITALS_DATA_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_VITALS_DATA_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_VITALS_BY_PATIENT_ID_INITIAL_STATE = {
    data: [],
    loading: false
}
const GET_VITALS_BY_APPOINTMENT_ID_INITIAL_STATE = {
    data: [],
    loading: false
}


export const createVitalsReducer = (state = CREATE_VITALS_DATA_INITIAL_STATE, action) => {
    switch (action.type) {
        case VitalsActionTypes.CREATE_VITALS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case VitalsActionTypes.CREATE_VITALS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case VitalsActionTypes.CREATE_VITALS_RESET:
            return {
                data: [],
                loading: false,
            };
        case VitalsActionTypes.CREATE_VITALS_ERROR:
            return {
                data: action?.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};


export const updateVitalsReducer = (state = UPDATE_VITALS_DATA_INITIAL_STATE, action) => {
    switch (action.type) {
        case VitalsActionTypes.UPDATE_VITALS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case VitalsActionTypes.UPDATE_VITALS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case VitalsActionTypes.UPDATE_VITALS_ERROR:
            return {
                data: action.payload,
                loading: false,
            }
        default: return state
    }
}

export const getVitalsReducer = (state = GET_VITALS_DATA_INITIAL_STATE, action) => {
    switch (action.type) {
        case VitalsActionTypes.GET_VITALS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case VitalsActionTypes.GET_VITALS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case VitalsActionTypes.GET_VITALS_ERROR:
            return {
                data: action.payload,
                loading: false,
            }
        default: return state
    }
}

export const getVitalsByPatientIdReducer = (state = GET_VITALS_BY_PATIENT_ID_INITIAL_STATE, action) => {
    switch (action.type) {
        case VitalsActionTypes.GET_VITALS_BY_PATIENT_ID_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case VitalsActionTypes.GET_VITALS_BY_PATIENT_ID_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case VitalsActionTypes.GET_VITALS_BY_PATIENT_ID_ERROR:
            return {
                data: action.payload,
                loading: false,
            }
        default: return state
    }
}

export const getVitalsByAppointmentIdReducer = (state = GET_VITALS_BY_APPOINTMENT_ID_INITIAL_STATE, action) => {
    switch (action.type) {
        case VitalsActionTypes.GET_VITALS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case VitalsActionTypes.GET_VITALS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case VitalsActionTypes.GET_VITALS_ERROR:
            return {
                data: action.payload,
                loading: false,
            }
        default: return state
    }
}
