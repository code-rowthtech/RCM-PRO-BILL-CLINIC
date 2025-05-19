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

const GET_ENCOUNTER_NOTES_TYPE_INITIAL_STATE = {
    data: [],
    loading: false,
};

const GET_ENCOUNTER_NOTES_FIELDS_INITIAL_STATE = {
    data: [],
    loading: false,
};

const CREATE_ENCOUNTER_SETTINGS_INITIAL_STATE = {
    data: [],
    loading: false,
};

const UPDATE_ENCOUNTER_SETTINGS_INITIAL_STATE = {
    data: [],
    loading: false,
};

const GET_ENCOUNTER_SETTINGS_INITIAL_STATE = {
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

export const getEncounterNotesTypeReducer = (state = GET_ENCOUNTER_NOTES_TYPE_INITIAL_STATE, action) => {
    switch (action.type) {
        case EncounterActionTypes.GET_ENCOUNTER_NOTES_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case EncounterActionTypes.GET_ENCOUNTER_NOTES_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };

        case EncounterActionTypes.GET_ENCOUNTER_NOTES_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export const getEncounterNotesFieldsReducer = (state = GET_ENCOUNTER_NOTES_FIELDS_INITIAL_STATE, action) => {
    switch (action.type) {
        case EncounterActionTypes.GET_ENCOUNTER_NOTES_FIELDS_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case EncounterActionTypes.GET_ENCOUNTER_NOTES_FIELDS_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };

        case EncounterActionTypes.GET_ENCOUNTER_NOTES_FIELDS_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};


export const createEncounterSettingsReducer = (state = CREATE_ENCOUNTER_SETTINGS_INITIAL_STATE, action) => {
    switch (action.type) {
        case EncounterActionTypes.CREATE_ENCOUNTER_SETTINGS_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case EncounterActionTypes.CREATE_ENCOUNTER_SETTINGS_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case EncounterActionTypes.CREATE_ENCOUNTER_SETTINGS_RESET:
            return {
                data: [],
                loading: false,
            };
        case EncounterActionTypes.CREATE_ENCOUNTER_SETTINGS_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const updateEncounterSettingsReducer = (state = UPDATE_ENCOUNTER_SETTINGS_INITIAL_STATE, action) => {
    switch (action.type) {
        case EncounterActionTypes.UPDATE_ENCOUNTER_SETTINGS_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case EncounterActionTypes.UPDATE_ENCOUNTER_SETTINGS_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case EncounterActionTypes.UPDATE_ENCOUNTER_SETTINGS_RESET:
            return {
                data: [],
                loading: false,
            };
        case EncounterActionTypes.UPDATE_ENCOUNTER_SETTINGS_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};


export const getEncounterSettingsReducer = (state = GET_ENCOUNTER_SETTINGS_INITIAL_STATE, action) => {
    switch (action.type) {
        case EncounterActionTypes.GET_ENCOUNTER_SETTINGS_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case EncounterActionTypes.GET_ENCOUNTER_SETTINGS_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };

        case EncounterActionTypes.GET_ENCOUNTER_SETTINGS_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};
