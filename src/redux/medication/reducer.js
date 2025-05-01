import { MedicationActionTypes } from './constants';

const CREATE_MEDICATION_INITIAL_STATE = {
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

// export const GET_ALLERGIES_OF_A_PATIENT_INITIAL_STATE = {
//     data: [],
//     loading: false,
// };

// export const UPDATE_ALLERGY_INITIAL_STATE = {
//     data: [],
//     loading: false,
// };

// export const DELETE_ALLERGY_INITIAL_STATE = {
//     data: [],
//     loading: false,
// };

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

// export const getAllergiesOfAPatientReducer = (state = GET_ALLERGIES_OF_A_PATIENT_INITIAL_STATE, action) => {
//     switch (action.type) {
//         case MedicationActionTypes.GET_ALLERGIES_OF_A_PATIENT_LOADING:
//             return {
//                 data: state.data,
//                 loading: true,
//             };
//         case MedicationActionTypes.GET_ALLERGIES_OF_A_PATIENT_SUCCESS:
//             return {
//                 data: action.payload,
//                 loading: false,
//             };
//         case MedicationActionTypes.GET_ALLERGIES_OF_A_PATIENT_RESET:
//             return {
//                 data: [],
//                 loading: false,
//             };
//         case MedicationActionTypes.GET_ALLERGIES_OF_A_PATIENT_ERROR:
//             return {
//                 data: action.payload,
//                 loading: false,
//             };
//         default:
//             return state;
//     }
// };

// export const updateAllergyReducer = (state = UPDATE_ALLERGY_INITIAL_STATE, action) => {
//     switch (action.type) {
//         case MedicationActionTypes.UPDATE_ALLERGY_LOADING:
//             return {
//                 data: state.data,
//                 loading: true,
//             };
//         case MedicationActionTypes.UPDATE_ALLERGY_SUCCESS:
//             return {
//                 data: action.payload,
//                 loading: false,
//             };
//         case MedicationActionTypes.GET_ALLERGIES_OF_A_PATIENT_RESET:
//             return {
//                 data: [],
//                 loading: false,
//             };
//         case MedicationActionTypes.UPDATE_ALLERGY_ERROR:
//             return {
//                 data: action.payload,
//                 loading: false,
//             };
//         default:
//             return state;
//     }
// };

// export const deleteAllergyReducer = (state = DELETE_ALLERGY_INITIAL_STATE, action) => {
//     switch (action.type) {
//         case MedicationActionTypes.DELETE_ALLERGY_LOADING:
//             return {
//                 data: state.data,
//                 loading: true,
//             };
//         case MedicationActionTypes.DELETE_ALLERGY_SUCCESS:
//             return {
//                 data: action.payload,
//                 loading: false,
//             };
//         case MedicationActionTypes.DELETE_ALLERGY_RESET:
//             return {
//                 data: [],
//                 loading: false,
//             };
//         case MedicationActionTypes.DELETE_ALLERGY_ERROR:
//             return {
//                 data: action.payload,
//                 loading: false,
//             };
//         default:
//             return state;
//     }
// };
