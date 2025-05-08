import { IcdCodesActionTypes } from "./constants";

export const getICDProcedureAction = (data): AuthAction => ({
    type: IcdCodesActionTypes.GET_ICD_PROCEDURE,
    data
});
