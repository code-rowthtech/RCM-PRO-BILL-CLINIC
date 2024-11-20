import { PatientsActionTypes } from "./constants"


const GET_PATIENTS_INITIAL_STATE = {
    data: [],
    loading: false
}

export const getPatientsReducer = (state = GET_PATIENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.GET_PATIENTS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.GET_PATIENTS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.GET_PATIENTS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}


