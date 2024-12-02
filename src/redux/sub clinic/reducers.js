import { SubClinicsActionTypes } from "./constants"

const CREATE_SUBCLINICS_INITIAL_STATE = {
    data: [],
    loading: false
}

const CREATE_UPGRADE_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_SUBCLINICS_INITIAL_STATE = {
    data: [],
    loading: false
}
const GET_SUBCLINIC_TYPE_INITIAL_STATE = {
    data: [],
    loading: false
}
const GET_SUBSCIPTION_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_CITIES_INITIAL_STATE = {
    data: [], // Make data an object
    loading: false,
};


// const GET_STATES_INITIAL_STATE = {
//     data: [],
//     loading: false
// }

// const GET_CITIES_INITIAL_STATE = {
//     data: [],
//     loading: false
// }



// const UPDATE_CLINICS_INITIAL_STATE = {
//     data: [],
//     loading: false
// }

// const GET_CLINIC_BY_ID_INITIAL_STATE = {
//     data: [],
//     loading: false
// }

// const GET_CLINIC_BY_PARENT_INITIAL_STATE = {
//     data: [],
//     loading: false
// }

// const CREATE_SUBSCRIPTION_PLAN_INITIAL_STATE = {
//     data: [],
//     loading: false
// }

// const CREATE_CONTRACT_INITIAL_STATE = {
//     data: [],
//     loading: false
// }

// const DELETE_CLINIC_INITIAL_STATE = {
//     data: [],
//     loading: false
// }

export const createSubClinicsReducer = (state = CREATE_SUBCLINICS_INITIAL_STATE, action) => {
    switch (action.type) {
        case SubClinicsActionTypes.CREATE_SUBCLINIC_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case SubClinicsActionTypes.CREATE_SUBCLINIC_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case SubClinicsActionTypes.CREATE_SUBCLINIC_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case SubClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const createUpgradeReducer = (state = CREATE_UPGRADE_INITIAL_STATE, action) => {
    switch (action.type) {
        case SubClinicsActionTypes.CREATE_UOGRADE_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case SubClinicsActionTypes.CREATE_UOGRADE_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case SubClinicsActionTypes.CREATE_UOGRADE_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case SubClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getSubClinicsReducer = (state = GET_SUBCLINICS_INITIAL_STATE, action) => {
    switch (action.type) {
        case SubClinicsActionTypes.GET_SUBCLINIC_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case SubClinicsActionTypes.GET_SUBCLINIC_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case SubClinicsActionTypes.GET_SUBCLINIC_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        case SubClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
            return {
                data: [],
                loading: false
            }
        default: return state
    }
}

export const getSubClinicTypeReducer = (state = GET_SUBCLINIC_TYPE_INITIAL_STATE, action) => {
    console.log(GET_SUBCLINIC_TYPE_INITIAL_STATE,'GET_SUBCLINIC_TYPE_INITIAL_STATE')
    switch (action.type) {
        case SubClinicsActionTypes.GET_SUBCLINICTYPE_LOADING:
            return {
                ...state,
                loading: true,
            };
        case SubClinicsActionTypes.GET_SUBCLINICTYPE_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case SubClinicsActionTypes.GET_SUBCLINICTYPE_ERROR:
            return {
                ...state,
                loading: false,
            };
        case SubClinicsActionTypes.GET_SUBCLINICTYPE_RESET:
            return GET_SUBCLINIC_TYPE_INITIAL_STATE;
        default:
            return state;
    }
};

export const getSubClinicCityReducer = (state = GET_CITIES_INITIAL_STATE, action) => {
    console.log(GET_CITIES_INITIAL_STATE,'GET_CITIES_INITIAL_STATE')
    switch (action.type) {
        case SubClinicsActionTypes.GET_CITIES_LOADING:
            return {
                ...state,
                loading: true,
            };
        case SubClinicsActionTypes.GET_CITIES_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case SubClinicsActionTypes.GET_CITIES_ERROR:
            return {
                ...state,
                loading: false,
            };
        case SubClinicsActionTypes.GET_CITIES_RESET:
            return GET_CITIES_INITIAL_STATE;
        default:
            return state;
    }
};

export const getSubscriptionsReducer = (state = GET_SUBSCIPTION_INITIAL_STATE, action) => {
    switch (action.type) {
        case SubClinicsActionTypes.GET_SUBSCRIPTION_LOADING:
            return {
                ...state,
                loading: true,
            };
        case SubClinicsActionTypes.GET_SUBSCRIPTION_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case SubClinicsActionTypes.GET_SUBSCRIPTION_ERROR:
            return {
                ...state,
                loading: false,
            };
        case SubClinicsActionTypes.GET_SUBSCRIPTION_RESET:
            return GET_SUBSCIPTION_INITIAL_STATE;
        default:
            return state;
    }
};

// export const getClinicByIdReducer = (state = GET_CLINIC_BY_ID_INITIAL_STATE, action) => {
//     switch (action.type) {
//         case SubClinicsActionTypes.GET_CLINIC_BY_ID_LOADING:
//             return {
//                 data: state.data,
//                 loading: true
//             }
//         case SubClinicsActionTypes.GET_CLINIC_BY_ID_SUCCESS:
//             return {
//                 data: action.payload,
//                 loading: false
//             }
//         case SubClinicsActionTypes.GET_CLINIC_BY_ID_ERROR:
//             return {
//                 data: action.payload,
//                 loading: false
//             }
//         case SubClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
//             return {
//                 data: [],
//                 loading: false
//             }
//         default: return state
//     }
// }


// export const getClinicsByParentReducer = (state = GET_CLINIC_BY_PARENT_INITIAL_STATE, action) => {
//     switch (action.type) {
//         case SubClinicsActionTypes.GET_CLINIC_BY_PARENT_LOADING:
//             return {
//                 data: state.data,
//                 loading: true
//             }
//         case SubClinicsActionTypes.GET_CLINIC_BY_PARENT_SUCCESS:
//             return {
//                 data: action.payload,
//                 loading: false
//             }
//         case SubClinicsActionTypes.GET_CLINIC_BY_PARENT_ERROR:
//             return {
//                 data: action.payload,
//                 loading: false
//             }
//         case SubClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
//             return {
//                 data: [],
//                 loading: false
//             }
//         default: return state
//     }
// }
// export const getStatesReducer = (state = GET_STATES_INITIAL_STATE, action) => {
//     switch (action.type) {
//         case SubClinicsActionTypes.GET_STATES_LOADING:
//             return {
//                 data: state.data,
//                 loading: true
//             }
//         case SubClinicsActionTypes.GET_STATES_SUCCESS:
//             return {
//                 data: action.payload,
//                 loading: false
//             }
//         case SubClinicsActionTypes.GET_STATES_ERROR:
//             return {
//                 data: action.payload,
//                 loading: false
//             }
//         case SubClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
//             return {
//                 data: [],
//                 loading: false
//             }
//         default: return state
//     }
// }

// export const getCitiesReducer = (state = GET_CITIES_INITIAL_STATE, action) => {
//     switch (action.type) {
//         case SubClinicsActionTypes.GET_CITIES_LOADING:
//             return {
//                 data: state.data,
//                 loading: true
//             }
//         case SubClinicsActionTypes.GET_CITIES_SUCCESS:
//             return {
//                 data: action.payload,
//                 loading: false
//             }
//         case SubClinicsActionTypes.GET_CITIES_ERROR:
//             return {
//                 data: action.payload,
//                 loading: false
//             }
//         case SubClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
//             return {
//                 data: [],
//                 loading: false
//             }
//         default: return state
//     }
// }



// export const updateClinicsReducer = (state = UPDATE_CLINICS_INITIAL_STATE, action) => {
//     switch (action.type) {
//         case SubClinicsActionTypes.UPDATE_CLINIC_LOADING:
//             return {
//                 data: state.data,
//                 loading: true
//             }
//         case SubClinicsActionTypes.UPDATE_CLINIC_SUCCESS:
//             return {
//                 data: action.payload,
//                 loading: false
//             }
//         case SubClinicsActionTypes.UPDATE_CLINIC_ERROR:
//             return {
//                 data: action.payload,
//                 loading: false
//             }
//         case SubClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
//             return {
//                 data: [],
//                 loading: false
//             }
//         default: return state
//     }
// }

// export const createSubscriptionPlanReducer = (state = CREATE_SUBSCRIPTION_PLAN_INITIAL_STATE, action) => {
//     switch (action.type) {
//         case SubClinicsActionTypes.CREATE_SUBSCRIPTION_LOADING:
//             return {
//                 data: state.data,
//                 loading: true
//             }
//         case SubClinicsActionTypes.CREATE_SUBSCRIPTION_SUCCESS:
//             return {
//                 data: action.payload,
//                 loading: false
//             }
//         case SubClinicsActionTypes.CREATE_SUBSCRIPTION_ERROR:
//             return {
//                 data: action.payload,
//                 loading: false
//             }
//         case SubClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
//             return {
//                 data: [],
//                 loading: false
//             }
//         default: return state
//     }
// }

// export const createContractReducer = (state = CREATE_CONTRACT_INITIAL_STATE, action) => {
//     switch (action.type) {
//         case SubClinicsActionTypes.CREATE_CONTRACT_LOADING:
//             return {
//                 data: state.data,
//                 loading: true
//             }
//         case SubClinicsActionTypes.CREATE_CONTRACT_SUCCESS:
//             return {
//                 data: action.payload,
//                 loading: false
//             }
//         case SubClinicsActionTypes.CREATE_CONTRACT_ERROR:
//             return {
//                 data: action.payload,
//                 loading: false
//             }
//         case SubClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
//             return {
//                 data: [],
//                 loading: false
//             }
//         default: return state
//     }
// }
// export const deleteClinicOnboardingReducer = (state = DELETE_CLINIC_INITIAL_STATE, action) => {
//     switch (action.type) {
//         case SubClinicsActionTypes.DELETE_CLINIC_LOADING:
//             return {
//                 data: state.data,
//                 loading: true
//             }
//         case SubClinicsActionTypes.DELETE_CLINIC_SUCCESS:
//             return {
//                 data: action.payload,
//                 loading: false
//             }
//         case SubClinicsActionTypes.DELETE_CLINIC_ERROR:
//             return {
//                 data: action.payload,
//                 loading: false
//             }
//         case SubClinicsActionTypes.STATE_EMPTY_INTIAL_STATE:
//             return {
//                 data: [],
//                 loading: false
//             }
//         default: return state
//     }
// }