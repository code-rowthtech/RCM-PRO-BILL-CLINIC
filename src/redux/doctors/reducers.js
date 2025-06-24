import { DoctorsActionTypes } from "./constants"


const GET_DOCTORS_INITIAL_STATE = {
    data: [],
    loading: false
}
const GET_DOCTORS_ROLES_INITIAL_STATE = {
    data: [],
    loading: false
}
const CREATE_DOCTORS_INITIAL_STATE = {
    data: [],
    loading: false
}
const GET_DOCTORS_DETAILS_INITIAL_STATE = {
    data: [],
    loading: false
}
const CREATE_DOCTOR_DETAILS_INITIAL_STATE = {
    data: [],
    loading: false
}

const ADD_REFERRING_DOCTOR_DETAILS_INITIAL_STATE = {
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
        // case DoctorsActionTypes.STATE_EMPTY_INTIAL_STATE:
        //     return {
        //         data: [],
        //         loading: false
        //     }
        default: return state
    }
}

export const getDoctorsRolesReducer = (state = GET_DOCTORS_ROLES_INITIAL_STATE, action) => {
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

export const createtDoctorsReducer = (state = CREATE_DOCTORS_INITIAL_STATE, action) => {
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
        case DoctorsActionTypes.CREATE_DOCTORS_RESET:
            return {
                data: [],
                loading: false,
            };
        case DoctorsActionTypes.CREATE_DOCTORS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return state
    }
}
export const getDoctorDetailsReducer = (state = GET_DOCTORS_DETAILS_INITIAL_STATE, action) => {
    switch (action.type) {
        case DoctorsActionTypes.GET_DOCTORS_DETAILS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case DoctorsActionTypes.GET_DOCTORS_DETAILS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case DoctorsActionTypes.GET_DOCTORS_DETAILS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        // case DoctorsActionTypes.STATE_EMPTY_INTIAL_STATE:
        //     return {
        //         data: [],
        //         loading: false
        //     }
        default: return state
    }
}

export const createtDoctorsDetailReducer = (state = CREATE_DOCTOR_DETAILS_INITIAL_STATE, action) => {
    switch (action.type) {
        case DoctorsActionTypes.CREATE_DOCTORS_DETAIL_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case DoctorsActionTypes.CREATE_DOCTORS_DETAIL_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case DoctorsActionTypes.CREATE_DOCTORS_DETAIL_RESET:
            return {
                data: [],
                loading: false,
            };
        case DoctorsActionTypes.CREATE_DOCTORS_DETAIL_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return state
    }
}

export const addReferringDoctorReducer = (state = ADD_REFERRING_DOCTOR_DETAILS_INITIAL_STATE, action) => {
    switch (action.type) {
        case DoctorsActionTypes.ADD_REFERRING_DOCTOR_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case DoctorsActionTypes.ADD_REFERRING_DOCTOR_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
            case DoctorsActionTypes.ADD_REFERRING_DOCTOR_RESET:
            return {
                data: [],
                loading: false,
            };
        case DoctorsActionTypes.ADD_REFERRING_DOCTOR_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return state
    }
}
