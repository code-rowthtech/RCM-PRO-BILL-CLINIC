import { IcdCodesActionTypes } from "./constants";

const GET_ICD_PROCEDURES_INITIAL_STATE = {
    data: [],
    loading: false,
};

export const getIcdProcedureReducer = (state = GET_ICD_PROCEDURES_INITIAL_STATE, action) => {
    switch (action.type) {
        case IcdCodesActionTypes.GET_ICD_PROCEDURE_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case IcdCodesActionTypes.GET_ICD_PROCEDURE_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case IcdCodesActionTypes.GET_ICD_PROCEDURE_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

