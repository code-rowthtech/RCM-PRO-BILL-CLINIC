import { DoctorsActionTypes } from "./constants"


const GET_DOCTORS_INITIAL_STATE = {
    data: [],
    loading: false
}

export const getDoctorsReducer = (state = GET_DOCTORS_INITIAL_STATE, action) => {
    switch (action.type) {
        case DoctorsActionTypes.GET_DOCTORS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case DoctorsActionTypes.GET_DOCTORS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case DoctorsActionTypes.GET_DOCTORS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case DoctorsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getDoctorsRolesReducer = (state = GET_DOCTORS_INITIAL_STATE, action) => {
    switch (action.type) {
        case DoctorsActionTypes.GET_DOCTORS_ROLES_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case DoctorsActionTypes.GET_DOCTORS_ROLES_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case DoctorsActionTypes.GET_DOCTORS_ROLES_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case DoctorsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const createtDoctorsReducer = (state = GET_DOCTORS_INITIAL_STATE, action) => {
    switch (action.type) {
        case DoctorsActionTypes.CREATE_DOCTORS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case DoctorsActionTypes.CREATE_DOCTORS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case DoctorsActionTypes.CREATE_DOCTORS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case DoctorsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}


