import { PermissionsActionTypes } from "./constants"


const CREATE_PERMISSIONS_DATA_INITIAL_STATE = {
    data: [],
    loading: false
}
const GET_PERMISSIONS_DATA_INITIAL_STATE = {
    data: [],
    loading: false
}
const DELETE_PERMISSIONS_DATA_INITIAL_STATE = {
    data: [],
    loading: false
}
const UPDATE_PERMISSIONS_DATA_INITIAL_STATE = {
    data: [],
    loading: false
}

export const createPermissionsDataReducer = (state = CREATE_PERMISSIONS_DATA_INITIAL_STATE, action) => {
    switch (action.type) {
        case PermissionsActionTypes.CREATE_PERMISSIONS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PermissionsActionTypes.CREATE_PERMISSIONS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PermissionsActionTypes.CREATE_PERMISSIONS_ERROR:
            return {
                data: action.payload,
                loading: false,
            }
        case PermissionsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false,
            }
        default: return state
    }
}
export const getPermissionsDataReducer = (state = GET_PERMISSIONS_DATA_INITIAL_STATE, action) => {
    switch (action.type) {
        case PermissionsActionTypes.GET_PERMISSIONS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PermissionsActionTypes.GET_PERMISSIONS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PermissionsActionTypes.GET_PERMISSIONS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return state
    }
}
export const deletePermissionsDataReducer = (state = DELETE_PERMISSIONS_DATA_INITIAL_STATE, action) => {
    switch (action.type) {
        case PermissionsActionTypes.DELETE_PERMISSIONS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PermissionsActionTypes.DELETE_PERMISSIONS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PermissionsActionTypes.DELETE_PERMISSIONS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case PermissionsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: DELETE_PERMISSIONS_DATA_INITIAL_STATE,
                loading: false
            }
        default: return state
    }
}

export const updatePermissionsDataReducer = (state = UPDATE_PERMISSIONS_DATA_INITIAL_STATE, action) => {
    switch (action.type) {
        case PermissionsActionTypes.UPDATE_PERMISSIONS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PermissionsActionTypes.UPDATE_PERMISSIONS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PermissionsActionTypes.UPDATE_PERMISSIONS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case PermissionsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: UPDATE_PERMISSIONS_DATA_INITIAL_STATE,
                loading: false
            }
        default: return state
    }
}
