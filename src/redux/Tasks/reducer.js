import { TaskConstantTypes } from './constants';

const CREATE_USER_TASKS_INITIAL_STATE = {
    data: [],
    loading: false,
};

const GET_USER_TASKS_INITIAL_STATE = {
    data: [],
    loading: false,
};



export const createUserTasksReducer = (state = CREATE_USER_TASKS_INITIAL_STATE, action) => {
    switch (action.type) {
        case TaskConstantTypes.CREATE_USER_TASKS_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TaskConstantTypes.CREATE_USER_TASKS_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TaskConstantTypes.CREATE_USER_TASKS_RESET:
            return {
                data: [],
                loading: false,
            };
        case TaskConstantTypes.CREATE_USER_TASKS_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export const getUserTasksReducer = (state = GET_USER_TASKS_INITIAL_STATE, action) => {
    switch (action.type) {
        case TaskConstantTypes.GET_USER_TASKS_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TaskConstantTypes.GET_USER_TASKS_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TaskConstantTypes.GET_USER_TASKS_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};
