import { ScheduleActionTypes } from "./constants";


const CREATE_SCHEDULE_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_DOCTORS_LIST_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_SCHEDULE_INITIAL_STATE = {
    data: [],
    loading: false
}
const DELETE_SCHEDULE_INITIAL_STATE = {
    data: [],
    loading: false
}
export const createScheduleReducer = (state = CREATE_SCHEDULE_INITIAL_STATE, action) => {
    switch (action.type) {
        case ScheduleActionTypes.CREATE_SCHEDULE_LOADING:
            return {
                data: state.data,
                loading: true,
            }
        case ScheduleActionTypes.CREATE_SCHEDULE_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            }
        case ScheduleActionTypes.CREATE_SCHEDULE_ERROR:
            return {
                data: action.payload,
                loading: false,
            }
        case ScheduleActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false,

            }
        default: return state
    }
}

export const getDoctorsListReducer = (state = GET_DOCTORS_LIST_INITIAL_STATE, action) => {
    switch (action.type) {
        case ScheduleActionTypes.GET_DOCTORS_LIST_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ScheduleActionTypes.GET_DOCTORS_LIST_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ScheduleActionTypes.GET_DOCTORS_LIST_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ScheduleActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getScheduleReducer = (state = GET_SCHEDULE_INITIAL_STATE, action) => {
    switch (action.type) {
        case ScheduleActionTypes.GET_SCHEDULE_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ScheduleActionTypes.GET_SCHEDULE_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ScheduleActionTypes.GET_SCHEDULE_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ScheduleActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}


export const deleteScheduleReducer = (state = DELETE_SCHEDULE_INITIAL_STATE, action) => {
    switch (action.type) {
        case ScheduleActionTypes.DELETE_SCHEDULE_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ScheduleActionTypes.DELETE_SCHEDULE_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ScheduleActionTypes.DELETE_SCHEDULE_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ScheduleActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}