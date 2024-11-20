// @flow
import { PatientsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const getPatientsAction = (data): AuthAction => ({
    type: PatientsActionTypes.GET_PATIENTS,
    data
});

export const stateEmptydAction = (): LayoutAction => ({
    type: PatientsActionTypes.STATE_EMPTY_INTIAL_STATE,

});