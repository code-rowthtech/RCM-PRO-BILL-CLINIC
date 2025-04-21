import { ProblemListActionTypes } from "./constants"




const CREATE_PROBLEM_LIST_INITIAL_STATE = {
    data: [],
    loading: false,
}

const GET_PROBLEM_LIST_INITIAL_STATE = {
    data: [],
    loading: false,
}

const UPDATE_PROBLEM_LIST_INITIAL_STATE = {
    data: [],
    loading: false,
}


const GET_ALL_CODES_INITIAL_STATE = {
    data: [],
    loading: false,
}

const GET_PATIENT_APPOINTMENT_INITIAL_STATE = {
    data: [],
    loading: false,
}

const GET_PROBLEM_DETAILS_INITIAL_STATE = {
    data: [],
    loading: false,
}




export const createProblemListReducer = (state = CREATE_PROBLEM_LIST_INITIAL_STATE, action) => {
    switch (action.type) {
        case ProblemListActionTypes.CREATE_PROBLEM_LIST_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ProblemListActionTypes.CREATE_PROBLEM_LIST_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ProblemListActionTypes.CREATE_PROBLEM_LIST_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ProblemListActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getProblemListReducer = (state = GET_PROBLEM_LIST_INITIAL_STATE, action) => {
    switch (action.type) {
        case ProblemListActionTypes.GET_PROBLEM_LIST_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ProblemListActionTypes.GET_PROBLEM_LIST_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ProblemListActionTypes.GET_PROBLEM_LIST_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ProblemListActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const updateProblemListReducer = (state = UPDATE_PROBLEM_LIST_INITIAL_STATE, action) => {
    switch (action.type) {
        case ProblemListActionTypes.UPDATE_PROBLEM_LIST_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ProblemListActionTypes.UPDATE_PROBLEM_LIST_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ProblemListActionTypes.UPDATE_PROBLEM_LIST_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ProblemListActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getALLCodesReducer = (state = GET_ALL_CODES_INITIAL_STATE, action) => {
    switch (action.type) {
        case ProblemListActionTypes.ALL_CODES_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ProblemListActionTypes.ALL_CODES_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ProblemListActionTypes.ALL_CODES_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ProblemListActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getPatientAppointmentReducer = (state = GET_PATIENT_APPOINTMENT_INITIAL_STATE, action) => {
    switch (action.type) {
        case ProblemListActionTypes.GET_PATIENTS_APPOINTMENT_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ProblemListActionTypes.GET_PATIENTS_APPOINTMENT_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ProblemListActionTypes.GET_PATIENTS_APPOINTMENT_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ProblemListActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getProblemDetailsReducer = (state = GET_PROBLEM_DETAILS_INITIAL_STATE, action) => {
    switch (action.type) {
        case ProblemListActionTypes.GET_PROBLEM_DETAILS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ProblemListActionTypes.GET_PROBLEM_DETAILS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ProblemListActionTypes.GET_PROBLEM_DETAILS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ProblemListActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}
