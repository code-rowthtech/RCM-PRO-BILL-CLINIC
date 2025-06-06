import { TaskConstantTypes } from "./constants";

export const createUserTasksAction = (data): AuthAction => ({
    type: TaskConstantTypes.CREATE_USER_TASKS,
    data
});

export const getUserTasksAction = (data): AuthAction => ({
    type: TaskConstantTypes.GET_USER_TASKS,
    data
});

