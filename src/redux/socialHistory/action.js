import { TobaccooActionTypes } from "./constants";

export const createTobaccooAction = (data): AuthAction => ({
    type: TobaccooActionTypes.CREATE_TOBACCOO,
    data
});
export const updateTobaccooAction = (data): AuthAction => ({
    type: TobaccooActionTypes.UPDATE_TOBACCOO,
    data
});

export const deleteTobaccooAction = (data): AuthAction => ({
    type: TobaccooActionTypes.DELETE_TOBACCOO,
    data
});

export const getTobaccooAction = (data): AuthAction => ({
    type: TobaccooActionTypes.GET_TOBACCOO,
    data
});


// Family/genetic
export const createFamilyGeneticAction = (data): AuthAction => ({
    type: TobaccooActionTypes.CREATE_FAMILY_GENETIC,
    data
});
export const updateFamilyGeneticction = (data): AuthAction => ({
    type: TobaccooActionTypes.UPDATE_FAMILY_GENETIC,
    data
});

export const getFamilyGeneticAction = (data): AuthAction => ({
    type: TobaccooActionTypes.GET_FAMILY_GENTIC_DATA,
    data
});

export const deleteFamilyGeneticAction = (data): AuthAction => ({
    type: TobaccooActionTypes.DELETE_FAMILY_GENTIC,
    data
})


// SURGICAL HISTORY
export const createSurgicalHistoryAction = (data): AuthAction => ({
    type: TobaccooActionTypes.CREATE_SURGICAL_HISTORY,
    data
});
export const updateSurgicalHistoryAction = (data): AuthAction => ({
    type: TobaccooActionTypes.UPDATE_SURGICAL_HISTORY,
    data
});

export const getSurgicalHistoryAction = (data): AuthAction => ({
    type: TobaccooActionTypes.GET_SURGICAL_HISTORY,
    data
});

export const deleteSurgicalHistoryAction = (data): AuthAction => ({
    type: TobaccooActionTypes.DELETE_SURGICAL_HISTORY,
    data
})

// Medical History
export const createMedicalHistoryAction = (data): AuthAction => ({
    type: TobaccooActionTypes.CREATE_MEDICAL_HISTORY,
    data
});
export const updateMedicalHistoryAction = (data): AuthAction => ({
    type: TobaccooActionTypes.UPDATE_MEDICAL_HISTORY,
    data
});

export const getMedicalHistoryAction = (data): AuthAction => ({
    type: TobaccooActionTypes.GET_MEDICAL_HISTORY,
    data
});

export const deleteMedicalHistoryAction = (data): AuthAction => ({
    type: TobaccooActionTypes.DELETE_MEDICAL_HISTORY,
    data
})