import { ClinicsActionTypes } from "./constants"

const CREATE_CLINICS_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_CLINICS_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_STATES_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_CITIES_INITIAL_STATE = {
    data: [],
    loading: false
}

const UPDATE_CLINICS_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_CLINIC_BY_ID_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_CLINIC_BY_PARENT_INITIAL_STATE = {
    data: [],
    loading: false
}

const CREATE_SUBSCRIPTION_PLAN_INITIAL_STATE = {
    data: [],
    loading: false
}

const DELETE_CLINIC_INITIAL_STATE = {
    data: [],
    loading: false
}

export const createClinicsReducer = (state = CREATE_CLINICS_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicsActionTypes.CREATE_CLINIC_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicsActionTypes.CREATE_CLINIC_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.CREATE_CLINIC_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getClinicByIdReducer = (state = GET_CLINIC_BY_ID_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicsActionTypes.GET_CLINIC_BY_ID_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicsActionTypes.GET_CLINIC_BY_ID_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.GET_CLINIC_BY_ID_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}
export const getClinicsReducer = (state = GET_CLINICS_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicsActionTypes.GET_CLINIC_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicsActionTypes.GET_CLINIC_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.GET_CLINIC_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getClinicsByParentReducer = (state = GET_CLINIC_BY_PARENT_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicsActionTypes.GET_CLINIC_BY_PARENT_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicsActionTypes.GET_CLINIC_BY_PARENT_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.GET_CLINIC_BY_PARENT_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}
export const getStatesReducer = (state = GET_STATES_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicsActionTypes.GET_STATES_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicsActionTypes.GET_STATES_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.GET_STATES_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getCitiesReducer = (state = GET_CITIES_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicsActionTypes.GET_CITIES_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicsActionTypes.GET_CITIES_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.GET_CITIES_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const updateClinicsReducer = (state = UPDATE_CLINICS_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicsActionTypes.UPDATE_CLINIC_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicsActionTypes.UPDATE_CLINIC_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.UPDATE_CLINIC_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const createSubscriptionPlanReducer = (state = CREATE_SUBSCRIPTION_PLAN_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicsActionTypes.CREATE_SUBSCRIPTION_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicsActionTypes.CREATE_SUBSCRIPTION_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.CREATE_SUBSCRIPTION_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}
export const deleteClinicOnboardingReducer = (state = DELETE_CLINIC_INITIAL_STATE, action) => {
    switch (action.type) {
        case ClinicsActionTypes.DELETE_CLINIC_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ClinicsActionTypes.DELETE_CLINIC_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.DELETE_CLINIC_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}