import { TaskConstantTypes } from "./constants";

export const createTasksAction = (data): AuthAction => ({
    type: TaskConstantTypes.CREATE_TASKS,
    data
});

export const getTasksAction = (data): AuthAction => ({
    type: TaskConstantTypes.GET_TASKS_DETAILS,
    data
});

export const updateTasksAction = (data): AuthAction => ({
    type: TaskConstantTypes.UPDATE_TASKS,
    data
});

export const deleteTasksAction = (data): AuthAction => ({
    type: TaskConstantTypes.DELETE_TASKS,
    data
});