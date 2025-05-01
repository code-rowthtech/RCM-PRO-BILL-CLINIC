import { MedicationActionTypes } from "./constants";

export const createMedicationAction = (data): AuthAction => ({
    type: MedicationActionTypes.CREATE_MEDICATION,
    data
});

export const getDrugsAction = (data): AuthAction => ({
    type: MedicationActionTypes.GET_MEDICATION_DRUGS,
    data
});

export const getMedicationAction = (data): AuthAction => ({
    type: MedicationActionTypes.GET_MEDICATION,
    data
});

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