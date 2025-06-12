import { MedicationActionTypes } from './constants';

const CREATE_MEDICATION_INITIAL_STATE = {
    data: [],
    loading: false,
};

const UPDATE_MEDICATION_INITIAL_STATE = {
    data: [],
    loading: false,
};

const GET_DRUGS_INITIAL_STATE = {
    data: [],
    loading: false,
};
const GET_MEDICATION_INITIAL_STATE = {
    data: [],
    loading: false,
};

export const createMedicationReducer = (state = CREATE_MEDICATION_INITIAL_STATE, action) => {
    switch (action.type) {
        case MedicationActionTypes.CREATE_MEDICATION_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case MedicationActionTypes.CREATE_MEDICATION_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case MedicationActionTypes.CREATE_MEDICATION_RESET:
            return {
                data: [],
                loading: false,
            };
        case MedicationActionTypes.CREATE_MEDICATION_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const updateMedicationReducer = (state = UPDATE_MEDICATION_INITIAL_STATE, action) => {
    switch (action.type) {
        case MedicationActionTypes.UPDATE_MEDICATION_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case MedicationActionTypes.UPDATE_MEDICATION_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case MedicationActionTypes.UPDATE_MEDICATION_RESET:
            return {
                data: [],
                loading: false,
            };
        case MedicationActionTypes.UPDATE_MEDICATION_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const getDrugsReducer = (state = GET_DRUGS_INITIAL_STATE, action) => {
    switch (action.type) {
        case MedicationActionTypes.GET_MEDICATION_DRUGS_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case MedicationActionTypes.GET_MEDICATION_DRUGS_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case MedicationActionTypes.GET_MEDICATION_DRUGS_RESET:
            return {
                data: [],
                loading: false,
            };

        case MedicationActionTypes.GET_MEDICATION_DRUGS_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export const getMedicationReducer = (state = GET_MEDICATION_INITIAL_STATE, action) => {
    switch (action.type) {
        case MedicationActionTypes.GET_MEDICATION_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case MedicationActionTypes.GET_MEDICATION_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };

        case MedicationActionTypes.GET_MEDICATION_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

