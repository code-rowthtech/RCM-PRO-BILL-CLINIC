import { SettingsActionTypes } from './constants';

const CREATE_MASTERS_DATA_INITIAL_STATE = {
    data: [],
    loading: false,
};

const GET_MASTERS_DATA_INITIAL_STATE = {
    data1: {
        data: [],
        loading: false,
    },
    data2: {
        data: [],
        loading: false,
    },
};
const GET_DEPARTMENT_DATA_INITIAL_STATE = {
    data: [],
    loading: false,
};
const UPDATE_MASTERS_DATA_INITIAL_STATE = {
    data: [],
    loading: false,
};

export const createMastersDataReducer = (state = CREATE_MASTERS_DATA_INITIAL_STATE, action) => {
    switch (action.type) {
        case SettingsActionTypes.CREATE_MASTERS_DATA_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case SettingsActionTypes.CREATE_MASTERS_DATA_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case SettingsActionTypes.CREATE_MASTERS_DATA_RESET:
            return {
                data: [],
                loading: false,
            };
        case SettingsActionTypes.CREATE_MASTERS_DATA_ERROR:
            return {
                data: action?.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const getMastersDataReducer = (state = GET_MASTERS_DATA_INITIAL_STATE, action) => {
    switch (action.type) {
        case SettingsActionTypes.GET_MASTERS_DATA_LOADING:
            return {
                ...state,
                data1: {
                    ...state.data1,
                    loading: true,
                },
            };
        case SettingsActionTypes.GET_MASTERS_DATA_SUCCESS:
            return {
                ...state,
                data1: {
                    data: action.payload,
                    loading: false,
                },
            };
        case SettingsActionTypes.GET_MASTERS_DATA_ERROR:
            return {
                ...state,
                data1: {
                    data: [],
                    loading: false,
                },
            };
        case SettingsActionTypes.GET_MASTERS2_DATA_LOADING:
            return {
                ...state,
                data2: {
                    ...state.data2,
                    loading: false,
                },
            };
        case SettingsActionTypes.GET_MASTERS2_DATA_SUCCESS:
            return {
                ...state,
                data2: {
                    data: action.payload,
                    loading: false,
                },
            };
        case SettingsActionTypes.GET_MASTERS2_DATA_ERROR:
            return {
                ...state,
                data2: {
                    data: [],
                    loading: false,
                },
            };

        default:
            return state;
    }
};
export const getDepartmentDataReducer = (state = GET_DEPARTMENT_DATA_INITIAL_STATE, action) => {
    switch (action.type) {
        case SettingsActionTypes.GET_DEPARTMENT_DATA_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case SettingsActionTypes.GET_DEPARTMENT_DATA_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case SettingsActionTypes.GET_DEPARTMENT_DATA_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        case SettingsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false,
            };
        default:
            return state;
    }
};

export const updateMastersDataReducer = (state = UPDATE_MASTERS_DATA_INITIAL_STATE, action) => {
    switch (action.type) {
        case SettingsActionTypes.UPDATE_MASTERS_DATA_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case SettingsActionTypes.UPDATE_MASTERS_DATA_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case SettingsActionTypes.UPDATE_MASTERS_DATA_RESET:
            return {
                data: [],
                loading: false,
            };
        case SettingsActionTypes.UPDATE_MASTERS_DATA_ERROR:
            return {
                data: action?.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};