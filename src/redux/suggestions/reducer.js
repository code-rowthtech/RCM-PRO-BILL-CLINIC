import { SuggestionsListActionTypes } from "./constants";

const CREATE_SUGGESTIONS_INITIAL_STATE = {
    data: [],
    loading: false,
};

export const createSuggestionsReducer = (state = CREATE_SUGGESTIONS_INITIAL_STATE, action) => {
    switch (action.type) {
        case SuggestionsListActionTypes.CREATE_SUGGESTION_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case SuggestionsListActionTypes.CREATE_SUGGESTION_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case SuggestionsListActionTypes.CREATE_SUGGESTION_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

// export const getAllergyDetailsReducer = (state = GET_ALLERGY_DETAILS_INITIAL_STATE, action) => {
//     switch (action.type) {
//         case AllergyListActionTypes.GET_ALLERGY_DETAILS_LOADING:
//             return {
//                 data: state.data,
//                 loading: true,
//             };
//         case AllergyListActionTypes.GET_ALLERGY_DETAILS_SUCCESS:
//             return {
//                 data: action.payload,
//                 loading: false,
//             };
//         case AllergyListActionTypes.GET_ALLERGY_DETAILS_RESET:
//             return {
//                 data: [],
//                 loading: false,
//             };

//         case AllergyListActionTypes.GET_ALLERGY_DETAILS_ERROR:
//             return {
//                 data: action.payload,
//                 loading: false,
//             };
//         default:
//             return state;
//     }
// };

// export const getAllergiesOfAPatientReducer = (state = GET_ALLERGIES_OF_A_PATIENT_INITIAL_STATE, action) => {
//     switch (action.type) {
//         case AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT_LOADING:
//             return {
//                 data: state.data,
//                 loading: true,
//             };
//         case AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT_SUCCESS:
//             return {
//                 data: action.payload,
//                 loading: false,
//             };
//         case AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT_RESET:
//             return {
//                 data: [],
//                 loading: false,
//             };
//         case AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT_ERROR:
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
//         case AllergyListActionTypes.UPDATE_ALLERGY_LOADING:
//             return {
//                 data: state.data,
//                 loading: true,
//             };
//         case AllergyListActionTypes.UPDATE_ALLERGY_SUCCESS:
//             return {
//                 data: action.payload,
//                 loading: false,
//             };
//         case AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT_RESET:
//             return {
//                 data: [],
//                 loading: false,
//             };
//         case AllergyListActionTypes.UPDATE_ALLERGY_ERROR:
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
//         case AllergyListActionTypes.DELETE_ALLERGY_LOADING:
//             return {
//                 data: state.data,
//                 loading: true,
//             };
//         case AllergyListActionTypes.DELETE_ALLERGY_SUCCESS:
//             return {
//                 data: action.payload,
//                 loading: false,
//             };
//         case AllergyListActionTypes.DELETE_ALLERGY_RESET:
//             return {
//                 data: [],
//                 loading: false,
//             };
//         case AllergyListActionTypes.DELETE_ALLERGY_ERROR:
//             return {
//                 data: action.payload,
//                 loading: false,
//             };
//         default:
//             return state;
//     }
// };
