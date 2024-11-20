import { SettingsActionTypes } from "./constants"


const CREATE_MASTERS_DATA_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_MASTERS_DATA_INITIAL_STATE = {
    data: [],
    loading: false
}
const UPDATE_MASTERS_DATA_INITIAL_STATE = {
    data: [],
    loading: false
}

export const createMastersDataReducer = (state = CREATE_MASTERS_DATA_INITIAL_STATE, action) => {
    switch (action.type) {
        case SettingsActionTypes.CREATE_MASTERS_DATA_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case SettingsActionTypes.CREATE_MASTERS_DATA_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case SettingsActionTypes.CREATE_MASTERS_DATA_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case SettingsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getMastersDataReducer = (state = GET_MASTERS_DATA_INITIAL_STATE, action) => {
    console.log(GET_MASTERS_DATA_INITIAL_STATE,"reducer")
    switch (action.type) {
        case SettingsActionTypes.GET_MASTERS_DATA_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case SettingsActionTypes.GET_MASTERS_DATA_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case SettingsActionTypes.GET_MASTERS_DATA_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case SettingsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const updateMastersDataReducer = (state = UPDATE_MASTERS_DATA_INITIAL_STATE, action) => {
    switch (action.type) {
        case SettingsActionTypes.UPDATE_MASTERS_DATA_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case SettingsActionTypes.UPDATE_MASTERS_DATA_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case SettingsActionTypes.UPDATE_MASTERS_DATA_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case SettingsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}


