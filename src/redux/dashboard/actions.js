// @flow
import { DashboardActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const getAnalyticsAction = (data): AuthAction => ({
    type: DashboardActionTypes.GET_ANALYTICS,
    data
});

export const stateEmptydAction = (): LayoutAction => ({
    type: DashboardActionTypes.STATE_EMPTY_INTIAL_STATE,

});