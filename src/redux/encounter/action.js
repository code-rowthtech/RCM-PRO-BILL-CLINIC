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

export const getPastEncounterAction = (data): AuthAction => ({
    type: EncounterActionTypes.GET_PAST_ENCOUNTER,
    data
});

export const getEncounterNotesTypeAction = (data): AuthAction => ({
    type: EncounterActionTypes.GET_ENCOUNTER_NOTES,
    data
});

export const getEncounterNotesFieldsAction = (data): AuthAction => ({
    type: EncounterActionTypes.GET_ENCOUNTER_NOTES_FIELDS,
    data
});

// encounter settings
export const createEncounterSettingsAction = (data): AuthAction => ({
    type: EncounterActionTypes.CREATE_ENCOUNTER_SETTINGS,
    data
});

export const updateEncounterSettingsAction = (data): AuthAction => ({
    type: EncounterActionTypes.UPDATE_ENCOUNTER_SETTINGS,
    data
});

export const getEncounterSettingsAction = (data): AuthAction => ({
    type: EncounterActionTypes.GET_ENCOUNTER_SETTINGS,
    data
});

export const getEncounterByIdAction = (data): AuthAction => ({
    type: EncounterActionTypes.GET_ENCOUNTER_BY_ID,
    data
});