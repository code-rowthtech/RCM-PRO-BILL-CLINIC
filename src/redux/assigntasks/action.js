// @flow

import { ClinicNotesActionTypes } from "./constants";

type AuthAction = { type: string, payload: {} | string };

export const getClinicEmployeesAction = (data): AuthAction => ({
    type: ClinicNotesActionTypes.GET_CLINIC_EMPLOYEES,
    data
});

export const createTaskAction = (data): AuthAction => ({
    type: ClinicNotesActionTypes.CREATE_TASK,
    data
});

export const getTaskAction = (data): AuthAction => ({
    type: ClinicNotesActionTypes.GET_TASK,
    data
});

export const updateTaskAction = (data): AuthAction => ({
    type: ClinicNotesActionTypes.UPDATE_TASK,
    data
});

export const getTaskDetailsAction = (data): AuthAction => ({
    type: ClinicNotesActionTypes.GET_TASK_DETAILS,
    data
});