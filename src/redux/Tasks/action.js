import { TaskConstantTypes } from "./constants";

export const createUserTasksAction = (data): AuthAction => ({
    type: TaskConstantTypes.CREATE_USER_TASKS,
    data
});

