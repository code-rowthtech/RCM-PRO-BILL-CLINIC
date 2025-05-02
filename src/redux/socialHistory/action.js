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


