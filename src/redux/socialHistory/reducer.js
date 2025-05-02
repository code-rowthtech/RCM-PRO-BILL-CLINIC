import { TobaccooActionTypes } from './constants';

const CREATE_TOBACCOO_INITIAL_STATE = {
    data: [],
    loading: false,
};

const UPDATE_MEDICATION_INITIAL_STATE = {
    data: [],
    loading: false,
};

const GET_TOBACCOO_INITIAL_STATE = {
    data: [],
    loading: false,
};
const GET_MEDICATION_INITIAL_STATE = {
    data: [],
    loading: false,
};



export const createTobaccooReducer = (state = CREATE_TOBACCOO_INITIAL_STATE, action) => {
    switch (action.type) {
        case TobaccooActionTypes.CREATE_TOBACCOO_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TobaccooActionTypes.CREATE_TOBACCOO_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TobaccooActionTypes.CREATE_TOBACCOO_RESET:
            return {
                data: [],
                loading: false,
            };
        case TobaccooActionTypes.CREATE_TOBACCOO_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const updateTobaccooReducer = (state = UPDATE_MEDICATION_INITIAL_STATE, action) => {
    switch (action.type) {
        case TobaccooActionTypes.UPDATE_TOBACCOO_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TobaccooActionTypes.UPDATE_TOBACCOO_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TobaccooActionTypes.UPDATE_TOBACCOO_RESET:
            return {
                data: [],
                loading: false,
            };
        case TobaccooActionTypes.UPDATE_TOBACCOO_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const getTobaccooReducer = (state = GET_TOBACCOO_INITIAL_STATE, action) => {
    switch (action.type) {
        case TobaccooActionTypes.GET_TOBACCOO_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TobaccooActionTypes.GET_TOBACCOO_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TobaccooActionTypes.GET_TOBACCOO_RESET:
            return {
                data: [],
                loading: false,
            };

        case TobaccooActionTypes.GET_TOBACCOO_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};



