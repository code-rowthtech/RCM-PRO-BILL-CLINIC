import { SuggestionsListActionTypes } from "./constants";

const CREATE_SUGGESTIONS_INITIAL_STATE = {
    data: [],
    loading: false,
};

export const createSuggestionsReducer = (state = CREATE_SUGGESTIONS_INITIAL_STATE, action) => {
    switch (action.type) {
        case SuggestionsListActionTypes.CREATE_SUGGESTION_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case SuggestionsListActionTypes.CREATE_SUGGESTION_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case SuggestionsListActionTypes.CREATE_SUGGESTION_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

