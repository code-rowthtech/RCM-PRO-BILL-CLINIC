import { RolesActionTypes } from "./constants"

const CREATE_ROLES_INITIAL_STATE = {
    data: [],
    loading: false
}

const UPDATE_ROLES_INITIAL_STATE = {
    data: [],
    loading: false
}
const GET_ROLES_INITIAL_STATE = {
    data: [],
    loading: false
}


export const createRolesReducer = (state = CREATE_ROLES_INITIAL_STATE, action) => {
    switch (action.type) {
        case RolesActionTypes.CREATE_ROLES_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case RolesActionTypes.CREATE_ROLES_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case RolesActionTypes.CREATE_ROLES_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return state
    }
}

export const updateRolesReducer = (state = UPDATE_ROLES_INITIAL_STATE, action) => {
    switch (action.type) {
        case RolesActionTypes.UPDATE_ROLES_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case RolesActionTypes.UPDATE_ROLES_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case RolesActionTypes.UPDATE_ROLES_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case RolesActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: UPDATE_ROLES_INITIAL_STATE,
                loading: false
            }
        default: return state
    }
}

export const getRolesDataReducer = (state = GET_ROLES_INITIAL_STATE, action) => {
    switch (action.type) {
        case RolesActionTypes.GET_ROLES_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case RolesActionTypes.GET_ROLES_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case RolesActionTypes.GET_ROLES_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case RolesActionTypes.GET_ROLES_RESET:
            return {
                data: GET_ROLES_INITIAL_STATE,
                loading: false
            }
        default: return state
    }
}