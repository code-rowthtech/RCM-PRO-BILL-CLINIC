// @flow
import { AppointmentActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const createAppointmentAction = (data): AuthAction => ({
    type: AppointmentActionTypes.CREATE_APPOINTMENT,
    data
});

export const getPractitionerScheduleAction = (data): AuthAction => ({
    type: AppointmentActionTypes.GET_PRACTITIONER_SCHEDULE,
    data
});

export const getPractitionerSlotsAction = (data): AuthAction => ({
    type: AppointmentActionTypes.GET_PRACTITIONER_SLOTS,
    data
});

export const getAppointmentsAction = (data): AuthAction => ({
    type: AppointmentActionTypes.GET_APPOINTMENT,
    data
});

export const getAppointmentByIdAction = (data): AuthAction => ({
    type: AppointmentActionTypes.GET_APPOINTMENT_BY_ID,
    data
});

