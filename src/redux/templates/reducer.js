import { TemplateActionTypes } from './constants';

const CREATE_TEMPLATE_INITIAL_STATE = {
    data: [],
    loading: false,
};

const UPDATE_TEMPLATE_INITIAL_STATE = {
    data: [],
    loading: false,
};

const DELETE_TEMPLATE_INITIAL_STATE = {
    data: [],
    loading: false,
};

const GET_TEMPLATE_INITIAL_STATE = {
    data: [],
    loading: false,
};


export const createTemplateReducer = (state = CREATE_TEMPLATE_INITIAL_STATE, action) => {
    switch (action.type) {
        case TemplateActionTypes.CREATE_TEMPLATE_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TemplateActionTypes.CREATE_TEMPLATE_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TemplateActionTypes.CREATE_TEMPLATE_RESET:
            return {
                data: [],
                loading: false,
            };
        case TemplateActionTypes.CREATE_TEMPLATE_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const updateTemplateReducer = (state = UPDATE_TEMPLATE_INITIAL_STATE, action) => {
    switch (action.type) {
        case TemplateActionTypes.UPDATE_TEMPLATE_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TemplateActionTypes.UPDATE_TEMPLATE_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TemplateActionTypes.UPDATE_TEMPLATE_RESET:
            return {
                data: [],
                loading: false,
            };
        case TemplateActionTypes.UPDATE_TEMPLATE_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const deleteTemplateReducer = (state = DELETE_TEMPLATE_INITIAL_STATE, action) => {
    switch (action.type) {
        case TemplateActionTypes.DELETE_TEMPLATE_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TemplateActionTypes.DELETE_TEMPLATE_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TemplateActionTypes.DELETE_TEMPLATE_RESET:
            return {
                data: [],
                loading: false,
            };
        case TemplateActionTypes.DELETE_TEMPLATE_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const getTemplateReducer = (state = GET_TEMPLATE_INITIAL_STATE, action) => {
    switch (action.type) {
        case TemplateActionTypes.GET_TEMPLATE_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TemplateActionTypes.GET_TEMPLATE_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };

        case TemplateActionTypes.GET_TEMPLATE_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};
