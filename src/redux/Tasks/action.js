import { TaskConstantTypes } from "./constants";

export const createUserTasksAction = (data): AuthAction => ({
    type: TaskConstantTypes.CREATE_USER_TASKS,
    data
});

export const updateUserTasksAction = (data): AuthAction => ({
    type: TaskConstantTypes.UPDATE_USER_TASKS,
    data
});

export const getUserTasksAction = (data): AuthAction => ({
    type: TaskConstantTypes.GET_USER_TASKS,
    data
});

export const getTaskByIdAction = (data): AuthAction => ({
    type: TaskConstantTypes.GET_TASK_BY_ID,
    data
});

