import { ScheduleActionTypes } from "./constants";


type AuthAction = { type: string, payload: {} | string };

export const createScheduleAction = (data): AuthAction => ({
    type: ScheduleActionTypes.CREATE_SCHEDULE,
    data
});

export const getDoctorsListAction = (data): AuthAction => ({
    type: ScheduleActionTypes.GET_DOCTORS_LIST,
    data
});
export const getScheduleAction = (data): AuthAction => ({
    type: ScheduleActionTypes.GET_SCHEDULE,
    data
});