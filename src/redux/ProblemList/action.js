// @flow

import { ProblemListActionTypes } from "./constants";


type AuthAction = { type: string, payload: {} | string };

export const getProblemListAction = (data): AuthAction => ({
    type: ProblemListActionTypes.GET_PROBLEM_LIST,
    data
});

export const createProblemListAction = (data): AuthAction => ({
    type: ProblemListActionTypes.CREATE_PROBLEM_LIST,
    data
});

export const deleteProblemListAction = (data): AuthAction => ({
    type: ProblemListActionTypes.DELETE_PROBLEM_LIST,
    data
});

export const updateProblemListAction = (data): AuthAction => ({
    type: ProblemListActionTypes.UPDATE_PROBLEM_LIST,
    data
});

export const getAllCodeAction = (data): AuthAction => ({
    type: ProblemListActionTypes.ALL_CODES,
    data
});

export const getPatientAppointmentAction = (data): AuthAction => ({
    type: ProblemListActionTypes.GET_PATIENTS_APPOINTMENT,
    data
});

export const getProblemDetailsAction = (data): AuthAction => ({
    type: ProblemListActionTypes.GET_PROBLEM_DETAILS,
    data
});
