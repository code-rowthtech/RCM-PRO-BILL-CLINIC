import { AppointmentActionTypes } from "./constants"


const CREATE_APPOINTMENTS_INITIAL_STATE = {
    data: [],
    loading: false
}

const PRACTITIONER_SCHEDULE_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_APPOINTMENTS_INITIAL_STATE = {
    data: [],
    loading: false
}

export const createAppointmentReducer = (state = CREATE_APPOINTMENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case AppointmentActionTypes.CREATE_APPOINTMENT_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case AppointmentActionTypes.CREATE_APPOINTMENT_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentActionTypes.CREATE_APPOINTMENT_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getPractitionerScheduleReducer = (state = PRACTITIONER_SCHEDULE_INITIAL_STATE, action) => {
    switch (action.type) {
        case AppointmentActionTypes.GET_PRACTITIONER_SCHEDULE_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case AppointmentActionTypes.GET_PRACTITIONER_SCHEDULE_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentActionTypes.GET_PRACTITIONER_SCHEDULE_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getAppointmentsReducer = (state = GET_APPOINTMENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case AppointmentActionTypes.GET_APPOINTMENT_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case AppointmentActionTypes.GET_APPOINTMENT_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentActionTypes.GET_APPOINTMENT_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}


