import { ClinicNotesActionTypes } from "./constants"


const GET_CLINIC_EMPLOYEES_INITIAL_STATE = {
    data: [],
    loading: false
}

const CREATE_TASK_INITIAL_STATE = {
    data: [],
    loading: false,
}

const GET_TASK_INITIAL_STATE = {
    data: [],
    loading: false,
}

const UPDATE_TASK_INITIAL_STATE = {
    data: [],
    loading: false,
}

const GET_TASK_DETAILS_INITIAL_STATE = {
    data: [],
    loading: false,
}


export const getClinicEmployeesReducer = (state = GET_CLINIC_EMPLOYEES_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.GET_CLINIC_EMPLOYEES_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.GET_CLINIC_EMPLOYEES_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.GET_CLINIC_EMPLOYEES_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const createTaskReducer = (state = CREATE_TASK_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.CREATE_TASK_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.CREATE_TASK_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.CREATE_TASK_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getTaskReducer = (state = GET_TASK_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.GET_TASK_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.GET_TASK_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.GET_TASK_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const updateTaskReducer = (state = UPDATE_TASK_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.UPDATE_TASK_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.UPDATE_TASK_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.UPDATE_TASK_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getTaskDetailsReducer = (state = GET_TASK_DETAILS_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicNotesActionTypes.GET_TASK_DETAILS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicNotesActionTypes.GET_TASK_DETAILS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.GET_TASK_DETAILS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicNotesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}