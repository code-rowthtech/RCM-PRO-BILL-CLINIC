// @flow
import { SubscriptionsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };


export const getSubscriptionsAction = (data): AuthAction => ({
    type: SubscriptionsActionTypes.GET_SUBSCRIPTIONS,
    data
});
export const getSubclinicSubscriptionsAction = (data): AuthAction => ({
    type: SubscriptionsActionTypes.GET_SUB_SUBSCRIPTIONS,
    data
});

export const stateEmptydActionSubscription = (): LayoutAction => ({
    type: SubscriptionsActionTypes.STATE_EMPTY_INTIAL_STATE,

});