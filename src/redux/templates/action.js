import { TemplateActionTypes } from "./constants";

export const createTemplateAction = (data): AuthAction => ({
    type: TemplateActionTypes.CREATE_TEMPLATE,
    data
});
export const updateTemplateAction = (data): AuthAction => ({
    type: TemplateActionTypes.UPDATE_TEMPLATE,
    data
});

export const deleteTemplateAction = (data): AuthAction => ({
    type: TemplateActionTypes.DELETE_TEMPLATE,
    data
});

export const getTemplateAction = (data): AuthAction => ({
    type: TemplateActionTypes.GET_TEMPLATE,
    data
});
