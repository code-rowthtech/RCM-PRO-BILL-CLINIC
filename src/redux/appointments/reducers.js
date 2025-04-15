import { AppointmentActionTypes } from "./constants"


const CREATE_APPOINTMENTS_INITIAL_STATE = {
    data: [],
    loading: false
}

const RESCHEDULE_APPOINTMENTS_INITIAL_STATE = {
    data: [],
    loading: false
}

const PRACTITIONER_SCHEDULE_INITIAL_STATE = {
    data: [],
    loading: false
}
const PRACTITIONER_SLOTS_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_APPOINTMENTS_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_APPOINTMENT_BY_ID_INITIAL_STATE = {
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
        case AppointmentActionTypes.CREATE_APPOINTMENT_RESET:
            return {
                data: [],
                loading: false,
            };
        case AppointmentActionTypes.CREATE_APPOINTMENT_ERROR:
            return {
                data: action?.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const rescheduleAppointmentReducer = (state = RESCHEDULE_APPOINTMENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case AppointmentActionTypes.RESCHEDULE_APPOINTMENT_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case AppointmentActionTypes.RESCHEDULE_APPOINTMENT_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentActionTypes.RESCHEDULE_APPOINTMENT_RESET:
            return {
                data: [],
                loading: false,
            };
        case AppointmentActionTypes.RESCHEDULE_APPOINTMENT_ERROR:
            return {
                data: action?.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

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

export const getPractitionerSlotsReducer = (state = PRACTITIONER_SLOTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case AppointmentActionTypes.GET_PRACTITIONER_SLOTS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case AppointmentActionTypes.GET_PRACTITIONER_SLOTS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentActionTypes.GET_PRACTITIONER_SLOTS_ERROR:
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

export const getAppointmentByIdReducer = (state = GET_APPOINTMENT_BY_ID_INITIAL_STATE, action) => {
    switch (action.type) {
        case AppointmentActionTypes.GET_APPOINTMENT_BY_ID_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case AppointmentActionTypes.GET_APPOINTMENT_BY_ID_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case AppointmentActionTypes.GET_APPOINTMENT_BY_ID_ERROR:
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


