import { DashboardActionTypes } from "./constants"


const GET_ANALYTICS_INITIAL_STATE = {
    data: [],
    loading: false
}

export const getAnalyticsReducer = (state = GET_ANALYTICS_INITIAL_STATE, action) => {
    switch (action.type) {
        case DashboardActionTypes.GET_ANALYTICS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case DashboardActionTypes.GET_ANALYTICS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case DashboardActionTypes.GET_ANALYTICS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case DashboardActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}


