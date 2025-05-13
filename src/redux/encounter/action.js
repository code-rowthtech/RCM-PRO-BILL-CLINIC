import { EncounterActionTypes } from "./constants";

export const createEncounterAction = (data): AuthAction => ({
    type: EncounterActionTypes.CREATE_ENCOUNTER,
    data
});
export const updateEncounterAction = (data): AuthAction => ({
    type: EncounterActionTypes.UPDATE_ENCOUNTER,
    data
});

export const getEncounterAction = (data): AuthAction => ({
    type: EncounterActionTypes.GET_ENCOUNTER,
    data
});
