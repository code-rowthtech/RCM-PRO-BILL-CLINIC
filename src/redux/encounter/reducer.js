import { EncounterActionTypes } from './constants';

const CREATE_ENCOUNTER_INITIAL_STATE = {
    data: [],
    loading: false,
};

const UPDATE_ENCOUNTER_INITIAL_STATE = {
    data: [],
    loading: false,
};

const GET_ENCOUNTER_INITIAL_STATE = {
    data: [],
    loading: false,
};


export const createEncounterReducer = (state = CREATE_ENCOUNTER_INITIAL_STATE, action) => {
    switch (action.type) {
        case EncounterActionTypes.CREATE_ENCOUNTER_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case EncounterActionTypes.CREATE_ENCOUNTER_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case EncounterActionTypes.CREATE_ENCOUNTER_RESET:
            return {
                data: [],
                loading: false,
            };
        case EncounterActionTypes.CREATE_ENCOUNTER_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const updateEncounterReducer = (state = UPDATE_ENCOUNTER_INITIAL_STATE, action) => {
    switch (action.type) {
        case EncounterActionTypes.UPDATE_ENCOUNTER_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case EncounterActionTypes.UPDATE_ENCOUNTER_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case EncounterActionTypes.UPDATE_ENCOUNTER_RESET:
            return {
                data: [],
                loading: false,
            };
        case EncounterActionTypes.UPDATE_ENCOUNTER_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const getEncounterReducer = (state = GET_ENCOUNTER_INITIAL_STATE, action) => {
    switch (action.type) {
        case EncounterActionTypes.GET_ENCOUNTER_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case EncounterActionTypes.GET_ENCOUNTER_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };

        case EncounterActionTypes.GET_ENCOUNTER_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};
