import { RoleActionTypes } from "./constants"


const CREATE_ROLE_DATA_INITIAL_STATE = {
    data: [],
    loading: false
}


const GET_ROLE_DATA_INITIAL_STATE = {
    data: [],
    loading: false
}
const UPDATE_ROLE_DATA_INITIAL_STATE = {
    data: [],
    loading: false
}

export const createRoleDataReducer = (state = CREATE_ROLE_DATA_INITIAL_STATE, action) => {
    switch (action.type) {
        case RoleActionTypes.CREATE_ROLE_DATA_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case RoleActionTypes.CREATE_ROLE_DATA_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case RoleActionTypes.CREATE_ROLE_DATA_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case RoleActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getRoleDataReducer = (state = GET_ROLE_DATA_INITIAL_STATE, action) => {
    switch (action.type) {
        case RoleActionTypes.GET_ROLE_DATA_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case RoleActionTypes.GET_ROLE_DATA_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case RoleActionTypes.GET_ROLE_DATA_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case RoleActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}


export const updateRoleDataReducer = (state = UPDATE_ROLE_DATA_INITIAL_STATE, action) => {
    switch (action.type) {
        case RoleActionTypes.UPDATE_ROLE_DATA_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case RoleActionTypes.UPDATE_ROLE_DATA_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case RoleActionTypes.UPDATE_ROLE_DATA_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case RoleActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}


