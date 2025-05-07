import { SuggestionsListActionTypes } from "./constants";

export const createSuggestionAction = (data): AuthAction => ({
    type: SuggestionsListActionTypes.CREATE_SUGGESTION,
    data
});
