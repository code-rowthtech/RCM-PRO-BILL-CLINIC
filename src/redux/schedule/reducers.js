import { ScheduleActionTypes } from "./constants";


const CREATE_SCHEDULE_INITIAL_STATE = {
    data: [],
    loading: false
}

export const createScheduleReducer = (state = CREATE_SCHEDULE_INITIAL_STATE, action) => {
    switch (action.type) {
        case ScheduleActionTypes.GET_SCHEDULE_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case ScheduleActionTypes.GET_SCHEDULE_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case ScheduleActionTypes.GET_SCHEDULE_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case ScheduleActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}