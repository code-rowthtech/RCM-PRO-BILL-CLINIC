import { SubscriptionsActionTypes } from "./constants"


const GET_SUBSCRIPTIONS_INITIAL_STATE = {
    data: [],
    loading: false
}

export const getSubscriptionsReducer = (state = GET_SUBSCRIPTIONS_INITIAL_STATE, action) => {
    switch (action.type) {
        case SubscriptionsActionTypes.GET_SUBSCRIPTIONS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case SubscriptionsActionTypes.GET_SUBSCRIPTIONS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case SubscriptionsActionTypes.GET_SUBSCRIPTIONS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case SubscriptionsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}


