import { TobaccooActionTypes } from "./constants";

export const createTobaccooAction = (data): AuthAction => ({
    type: TobaccooActionTypes.CREATE_TOBACCOO,
    data
});
export const updateTobaccooAction = (data): AuthAction => ({
    type: TobaccooActionTypes.UPDATE_TOBACCOO,
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

export const deleteFamilyGeneticAction = (data): AuthAction =>({
    type: TobaccooActionTypes.DELETE_FAMILY_GENTIC,
    data
})
