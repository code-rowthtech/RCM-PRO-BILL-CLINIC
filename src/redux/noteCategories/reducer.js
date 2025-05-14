import { NotesCategoriesActionTypes } from './constants';

const CREATE_NOTE_CATEGORIES_INITIAL_STATE = {
    data: [],
    loading: false,
};

const GET_NOTE_CATEGORIES_INITIAL_STATE = {
    data: [],
    loading: false,
};

export const UPDATE_NOTE_CATEGORIES_INITIAL_STATE = {
    data: [],
    loading: false,
};

export const createNoteCategoriesReducer = (state = CREATE_NOTE_CATEGORIES_INITIAL_STATE, action) => {
    switch (action.type) {
        case NotesCategoriesActionTypes.CREATE_NOTE_CATEGORIES_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case NotesCategoriesActionTypes.CREATE_NOTE_CATEGORIES_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case NotesCategoriesActionTypes.CREATE_NOTE_CATEGORIES_RESET:
            return {
                data: [],
                loading: false,
            };
        case NotesCategoriesActionTypes.CREATE_NOTE_CATEGORIES_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export const getNoteCategoriesReducer = (state = GET_NOTE_CATEGORIES_INITIAL_STATE, action) => {
    switch (action.type) {
        case NotesCategoriesActionTypes.GET_NOTE_CATEGORIES_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case NotesCategoriesActionTypes.GET_NOTE_CATEGORIES_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case NotesCategoriesActionTypes.GET_NOTE_CATEGORIES_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export const updateNoteCategoriesReducer = (state = UPDATE_NOTE_CATEGORIES_INITIAL_STATE, action) => {
    switch (action.type) {
        case NotesCategoriesActionTypes.UPDATE_NOTE_CATEGORIES_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case NotesCategoriesActionTypes.UPDATE_NOTE_CATEGORIES_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case NotesCategoriesActionTypes.UPDATE_NOTE_CATEGORIES_RESET:
            return {
                data: [],
                loading: false,
            };
        case NotesCategoriesActionTypes.UPDATE_NOTE_CATEGORIES_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};
