// @flow
import { DoctorsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const getDoctorsAction = (data): AuthAction => ({
    type: DoctorsActionTypes.GET_DOCTORS,
    data
});

export const getDoctorsrolesAction = (data): AuthAction => ({
    type: DoctorsActionTypes.GET_DOCTORS_ROLES,
    data
});

export const stateEmptydAction = (): LayoutAction => ({
    type: DoctorsActionTypes.STATE_EMPTY_INTIAL_STATE,

});

export const createDoctorAction = (data): LayoutAction => ({
    type: DoctorsActionTypes.CREATE_DOCTORS,
    data
});

export const createDoctorDetailAction = (data): LayoutAction => ({
    type: DoctorsActionTypes.CREATE_DOCTORS_DETAIL,
    data
});

export const getDoctorDetailsAction = (data): AuthAction => ({
    type: DoctorsActionTypes.GET_DOCTORS_DETAILS,
    data
});