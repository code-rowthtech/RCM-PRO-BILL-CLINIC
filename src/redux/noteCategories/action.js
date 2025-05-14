import { NotesCategoriesActionTypes } from "./constants";

export const createNoteCategoriesAction = (data): AuthAction => ({
    type: NotesCategoriesActionTypes.CREATE_NOTE_CATEGORIES,
    data
});

export const getNoteCategoriesAction = (data): AuthAction => ({
    type: NotesCategoriesActionTypes.GET_NOTE_CATEGORIES,
    data
});

export const updateNoteCategoriesAction = (data): AuthAction => ({
    type: NotesCategoriesActionTypes.UPDATE_NOTE_CATEGORIES,
    data
});

