import { AllergyListActionTypes } from "./constants";

export const createAllergyAction = (data): AuthAction => ({
    type: AllergyListActionTypes.CREATE_ALLERGY,
    data
});

export const getAllergyDetailsAction = (data): AuthAction => ({
    type: AllergyListActionTypes.GET_ALLERGY_DETAILS,
    data
});

export const getAllergiesOfPatientAction = (data): AuthAction => ({
    type: AllergyListActionTypes.GET_ALLERGIES_OF_A_PATIENT,
    data
});

export const updateAllergyAction = (data): AuthAction => ({
    type: AllergyListActionTypes.UPDATE_ALLERGY,
    data
});