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


