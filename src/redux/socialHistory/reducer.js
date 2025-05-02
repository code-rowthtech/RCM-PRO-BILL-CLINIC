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
