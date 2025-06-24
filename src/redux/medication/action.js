import { MedicationActionTypes } from "./constants";

export const createMedicationAction = (data): AuthAction => ({
    type: MedicationActionTypes.CREATE_MEDICATION,
    data
});
export const updateMedicationAction = (data): AuthAction => ({
    type: MedicationActionTypes.UPDATE_MEDICATION,
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
