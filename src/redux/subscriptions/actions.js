// @flow
import { SubscriptionsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const getSubscriptionsAction = (data): AuthAction => ({
    type: SubscriptionsActionTypes.GET_SUBSCRIPTIONS,
    data
});

export const stateEmptydAction = (): LayoutAction => ({
    type: SubscriptionsActionTypes.STATE_EMPTY_INTIAL_STATE,

});