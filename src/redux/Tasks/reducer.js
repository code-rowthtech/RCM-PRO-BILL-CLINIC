import { TaskConstantTypes } from './constants';

const CREATE_TASKS_INITIAL_STATE = {
    data: [],
    loading: false,
};

const GET_TASKS_DETAILS_INITIAL_STATE = {
    data: [],
    loading: false,
};

export const UPDATE_TASKS_INITIAL_STATE = {
    data: [],
    loading: false,
};

export const DELETE_TASKS_INITIAL_STATE = {
    data: [],
    loading: false,
};

export const createTasksReducer = (state = CREATE_TASKS_INITIAL_STATE, action) => {
    switch (action.type) {
        case TaskConstantTypes.CREATE_TASKS_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TaskConstantTypes.CREATE_TASKS_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TaskConstantTypes.CREATE_TASKS_RESET:
            return {
                data: [],
                loading: false,
            };
        case TaskConstantTypes.CREATE_TASKS_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export const getTasksDetailsReducer = (state = GET_TASKS_DETAILS_INITIAL_STATE, action) => {
    switch (action.type) {
        case TaskConstantTypes.GET_TASKS_DETAILS_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TaskConstantTypes.GET_TASKS_DETAILS_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TaskConstantTypes.GET_TASKS_DETAILS_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};
export const updateTasksReducer = (state = UPDATE_TASKS_INITIAL_STATE, action) => {
    switch (action.type) {
        case TaskConstantTypes.UPDATE_TASKS_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TaskConstantTypes.UPDATE_TASKS_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TaskConstantTypes.UPDATE_TASKS_RESET:
            return {
                data: [],
                loading: false,
            };
        case TaskConstantTypes.UPDATE_TASKS_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export const deleteTasksReducer = (state = DELETE_TASKS_INITIAL_STATE, action) => {
    switch (action.type) {
        case TaskConstantTypes.DELETE_TASKS_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TaskConstantTypes.DELETE_TASKS_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TaskConstantTypes.DELETE_TASKS_RESET:
            return {
                data: [],
                loading: false,
            };
        case TaskConstantTypes.DELETE_TASKS_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};
