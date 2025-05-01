import { SuggestionsListActionTypes } from "./constants";

export const createSuggestionAction = (data): AuthAction => ({
    type: SuggestionsListActionTypes.CREATE_SUGGESTION,
    data
});

// export const getAllergyDetailsAction = (data): AuthAction => ({
//     type: AllergyListActionTypes.GET_ALLERGY_DETAILS,
//     data
// });

// export const getAllergiesOfPatientAction = (data): AuthAction => ({
//     type: AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT,
//     data
// });

// export const updateAllergyAction = (data): AuthAction => ({
//     type: AllergyListActionTypes.UPDATE_ALLERGY,
//     data
// });

// export const deleteAllergyAction = (data): AuthAction => ({
//     type: AllergyListActionTypes.DELETE_ALLERGY,
//     data
// });