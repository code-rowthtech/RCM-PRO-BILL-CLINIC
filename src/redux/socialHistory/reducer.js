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

// Family Genetic
const CREATE_FAMILY_GENETIC_INITIAL_STATE = {
    data: [],
    loading: false,
};

const UPDATE_FAMILY_GENETIC_INITIAL_STATE = {
    data: [],
    loading: false,
};

const GET_FAMILY_GENETIC_INITIAL_STATE = {
    data: [],
    loading: false,
};

// SURGICAL HISTORY
const CREATE_SURGICAL_HISTORY_INITIAL_STATE = {
    data: [],
    loading: false,
};
const GET_SURGICAL_HISTORY_INITIAL_STATE = {
    data: [],
    loading: false,
};
const UPDATE_SURGICAL_HISTORY_INITIAL_STATE = {
    data: [],
    loading: false,
};
const DELETE_SURGICAL_HISTORY_INITIAL_STATE = {
    data: [],
    loading: false,
};

// Medical history
const CREATE_MEDICAL_HISTORY_INITIAL_STATE = {
    data: [],
    loading: false,
};
const GET_MEDICAL_HISTORY_INITIAL_STATE = {
    data: [],
    loading: false,
};
const UPDATE_MEDICAL_HISTORY_INITIAL_STATE = {
    data: [],
    loading: false,
};
const DELETE_MEDICAL_HISTORY_INITIAL_STATE = {
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

// Family Genetic

export const createFamilyGeneticReducer = (state = CREATE_FAMILY_GENETIC_INITIAL_STATE, action) => {
    switch (action.type) {
        case TobaccooActionTypes.CREATE_FAMILY_GENETIC_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TobaccooActionTypes.CREATE_FAMILY_GENETIC_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TobaccooActionTypes.CREATE_FAMILY_GENETIC_RESET:
            return {
                data: [],
                loading: false,
            };
        case TobaccooActionTypes.CREATE_FAMILY_GENETIC_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const updateFamilyGeneticReducer = (state = UPDATE_FAMILY_GENETIC_INITIAL_STATE, action) => {
    switch (action.type) {
        case TobaccooActionTypes.UPDATE_FAMILY_GENETIC_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TobaccooActionTypes.UPDATE_FAMILY_GENETIC_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TobaccooActionTypes.UPDATE_FAMILY_GENETIC_RESET:
            return {
                data: [],
                loading: false,
            };
        case TobaccooActionTypes.UPDATE_FAMILY_GENETIC_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const getFamilyGeneticReducer = (state = GET_FAMILY_GENETIC_INITIAL_STATE, action) => {
    switch (action.type) {
        case TobaccooActionTypes.GET_FAMILY_GENTIC_DATA_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TobaccooActionTypes.GET_FAMILY_GENTIC_DATA_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        // case TobaccooActionTypes.GET_FAMILY_GENTIC_DATA_RESET:
        //     return {
        //         data: [],
        //         loading: false,
        //     };

        case TobaccooActionTypes.GET_FAMILY_GENTIC_DATA_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

// SURGICAL HISTORY
export const createSurgicalHistoryReducer = (state = CREATE_SURGICAL_HISTORY_INITIAL_STATE, action) => {
    switch (action.type) {
        case TobaccooActionTypes.CREATE_SURGICAL_HISTORY_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TobaccooActionTypes.CREATE_SURGICAL_HISTORY_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TobaccooActionTypes.CREATE_SURGICAL_HISTORY_RESET:
            return {
                data: [],
                loading: false,
            };
        case TobaccooActionTypes.CREATE_SURGICAL_HISTORY_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};
export const updateSurgicalHistoryReducer = (state = UPDATE_SURGICAL_HISTORY_INITIAL_STATE, action) => {
    switch (action.type) {
        case TobaccooActionTypes.UPDATE_SURGICAL_HISTORY_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TobaccooActionTypes.UPDATE_SURGICAL_HISTORY_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TobaccooActionTypes.UPDATE_SURGICAL_HISTORY_RESET:
            return {
                data: [],
                loading: false,
            };
        case TobaccooActionTypes.UPDATE_SURGICAL_HISTORY_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};
export const deleteSurgicalHistoryReducer = (state = DELETE_SURGICAL_HISTORY_INITIAL_STATE, action) => {
    switch (action.type) {
        case TobaccooActionTypes.DELETE_SURGICAL_HISTORY_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TobaccooActionTypes.DELETE_SURGICAL_HISTORY_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TobaccooActionTypes.DELETE_SURGICAL_HISTORY_RESET:
            return {
                data: [],
                loading: false,
            };
        case TobaccooActionTypes.DELETE_SURGICAL_HISTORY_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const getSurgicalHistoryReducer = (state = GET_SURGICAL_HISTORY_INITIAL_STATE, action) => {
    switch (action.type) {
        case TobaccooActionTypes.GET_SURGICAL_HISTORY_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TobaccooActionTypes.GET_SURGICAL_HISTORY_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TobaccooActionTypes.GET_SURGICAL_HISTORY_RESET:
            return {
                data: [],
                loading: false,
            };

        case TobaccooActionTypes.GET_SURGICAL_HISTORY_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};
// Medical HISTORY
export const createMedicalHistoryReducer = (state = CREATE_MEDICAL_HISTORY_INITIAL_STATE, action) => {
    switch (action.type) {
        case TobaccooActionTypes.CREATE_MEDICAL_HISTORY_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TobaccooActionTypes.CREATE_MEDICAL_HISTORY_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TobaccooActionTypes.CREATE_MEDICAL_HISTORY_RESET:
            return {
                data: [],
                loading: false,
            };
        case TobaccooActionTypes.CREATE_MEDICAL_HISTORY_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const getMedicalHistoryReducer = (state = GET_MEDICAL_HISTORY_INITIAL_STATE, action) => {
    switch (action.type) {
        case TobaccooActionTypes.GET_MEDICAL_HISTORY_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case TobaccooActionTypes.GET_MEDICAL_HISTORY_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case TobaccooActionTypes.GET_MEDICAL_HISTORY_RESET:
            return {
                data: [],
                loading: false,
            };

        case TobaccooActionTypes.GET_MEDICAL_HISTORY_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};
