import { PatientsActionTypes } from "./constants"


const GET_PATIENTS_INITIAL_STATE = {
    data: [],
    loading: false,
}

const GET_PATIENTS_BY_APPOINTMENT_INITIAL_STATE = {
    data: [],
    loading: false,
}
const GET_PATIENTS_BY_ID_INITIAL_STATE = {
    data: [],
    loading: false,
}
const CREATE_PATIENTS_INITIAL_STATE = {
    data: [],
    loading: false,
}

const CREATE_RESPONSIBLE_PARTY_INITIAL_STATE = {
    data: [],
    loading: false,
}

const UPDATE_RESPONSIBLE_PARTY_INITIAL_STATE = {
    data: [],
    loading: false,
}

const GET_RESPONSIBLE_PARTY_INITIAL_STATE = {
    data: [],
    loading: false,
}

const UPDATE_PATIENTS_INITIAL_STATE = {
    data: [],
    loading: false
}
const UPDATE_INSURANCE_INITIAL_STATE = {
    data: [],
    loading: false
}

const CREATE_INSURANCE_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_INSURANCE_BY_PATIENT_ID_INITIAL_STATE = {
    data: [],
    loading: false
}

const UPLOAD_DOCUMENTS_INITIAL_STATE = {
    data: [],
    loading: false
}

const UPDATE_DOCUMENTS_INITIAL_STATE = {
    data: [],
    loading: false
}

const DELETE_DOCUMENTS_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_DOCUMENTS_INITIAL_STATE = {
    data: [],
    loading: false
}

const GET_DOCUMENTS_BY_ID_INITIAL_STATE = {
    data: [],
    loading: false
}
export const getPatientsReducer = (state = GET_PATIENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.GET_PATIENTS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.GET_PATIENTS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.GET_PATIENTS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return state
    }
}
export const getPatientsByAppointmentReducer = (state = GET_PATIENTS_BY_APPOINTMENT_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.GET_PATIENTS_BY_APPOINTMENT_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.GET_PATIENTS_BY_APPOINTMENT_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.GET_PATIENTS_BY_APPOINTMENT_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return state
    }
}

export const getPatientByIdReducer = (state = GET_PATIENTS_BY_ID_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.GET_PATIENTS_BY_ID_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.GET_PATIENTS_BY_ID_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.GET_PATIENTS_BY_ID_ERROR:
            return {
                data: action.payload,
                loading: false
            }

        default: return state
    }
}

export const createPatientsReducer = (state = CREATE_PATIENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.CREATE_PATIENTS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.CREATE_PATIENTS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.CREATE_PATIENTS_RESET:
            return {
                data: [],
                loading: false
            }
        case PatientsActionTypes.CREATE_PATIENTS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return { ...state }
    }
}
export const createResponsiblePartyReducer = (state = CREATE_RESPONSIBLE_PARTY_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.CREATE_RESPONSIBLE_PARTY_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.CREATE_RESPONSIBLE_PARTY_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.CREATE_RESPONSIBLE_PARTY_RESET:
            return {
                data: [],
                loading: false
            }
        case PatientsActionTypes.CREATE_RESPONSIBLE_PARTY_ERROR:
            return {
                data: action.payload,
                loading: false
            }

        default: return { ...state }
    }
}

export const updateResponsiblePartyReducer = (state = UPDATE_RESPONSIBLE_PARTY_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.UPDATE_RESPONSIBLE_PARTY_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.UPDATE_RESPONSIBLE_PARTY_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.UPDATE_RESPONSIBLE_PARTY_RESET:
            return {
                data: [],
                loading: false
            }
        case PatientsActionTypes.UPDATE_RESPONSIBLE_PARTY_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return { ...state }
    }
}

export const getResponsiblePartyReducer = (state = GET_RESPONSIBLE_PARTY_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.GET_RESPONSIBLE_PARTY_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.GET_RESPONSIBLE_PARTY_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.GET_RESPONSIBLE_PARTY_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return state
    }
}

// export const getResponsiblePartyByIdReducer = (state = GET_RESPONSIBLE_PARTY_INITIAL_STATE, action) => {
//     switch (action.type) {
//         case PatientsActionTypes.GET_RESPONSIBLE_PARTY_LOADING:
//             return {
//                 data: state.data,
//                 loading: true
//             }
//         case PatientsActionTypes.GET_RESPONSIBLE_PARTY_SUCCESS:
//             return {
//                 data: action.payload,
//                 loading: false
//             }
//         case PatientsActionTypes.GET_RESPONSIBLE_PARTY_ERROR:
//             return {
//                 data: action.payload,
//                 loading: false
//             }
//         case PatientsActionTypes.STATE_EMPTY_INTIAL_STATE:
//             return {
//                 data: [],
//                 loading: false
//             }
//         default: return state
//     }
// }

export const updatePatientsReducer = (state = UPDATE_PATIENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.UPDATE_PATIENTS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.UPDATE_PATIENTS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.UPDATE_PATIENTS_RESET:
            return {
                data: [],
                loading: false
            }
        case PatientsActionTypes.UPDATE_PATIENTS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return state
    }
}

export const createInsuranceReducer = (state = CREATE_INSURANCE_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.CREATE_INSURANCE_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.CREATE_INSURANCE_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.CREATE_INSURANCE_RESET:
            return {
                data: [],
                loading: false
            }
        case PatientsActionTypes.CREATE_INSURANCE_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return { ...state }
    }
}

export const getInsuranceByIdReducer = (state = GET_INSURANCE_BY_PATIENT_ID_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.GET_INSURANCE_BY_ID_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.GET_INSURANCE_BY_ID_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.GET_INSURANCE_BY_ID_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return state
    }
}

export const updateInsuranceReducer = (state = UPDATE_INSURANCE_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.UPDATE_INSURANCE_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PatientsActionTypes.UPDATE_INSURANCE_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PatientsActionTypes.UPDATE_INSURANCE_RESET:
            return {
                data: [],
                loading: false
            }
        case PatientsActionTypes.UPDATE_INSURANCE_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return { ...state }
    }
}



export const uploadDocumentsReducer = (state = UPLOAD_DOCUMENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.UPLOAD_DOCUMENTS_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case PatientsActionTypes.UPLOAD_DOCUMENTS_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case PatientsActionTypes.UPLOAD_DOCUMENTS_RESET:
            return {
                data: [],
                loading: false,
            };
        case PatientsActionTypes.UPLOAD_DOCUMENTS_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const updateDocumentsReducer = (state = UPDATE_DOCUMENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.UPDATE_DOCUMENTS_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case PatientsActionTypes.UPDATE_DOCUMENTS_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case PatientsActionTypes.UPDATE_DOCUMENTS_RESET:
            return {
                data: [],
                loading: false,
            };
        case PatientsActionTypes.UPDATE_DOCUMENTS_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const deleteDocumentsReducer = (state = DELETE_DOCUMENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.DELETE_DOCUMENTS_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case PatientsActionTypes.DELETE_DOCUMENTS_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };
        case PatientsActionTypes.DELETE_DOCUMENTS_RESET:
            return {
                data: [],
                loading: false,
            };
        case PatientsActionTypes.DELETE_DOCUMENTS_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return { ...state };
    }
};

export const getDocumentsReducer = (state = GET_DOCUMENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.GET_DOCUMENTS_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case PatientsActionTypes.GET_DOCUMENTS_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };

        case PatientsActionTypes.GET_DOCUMENTS_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};

export const getDocumentsByIdReducer = (state = GET_DOCUMENTS_BY_ID_INITIAL_STATE, action) => {
    switch (action.type) {
        case PatientsActionTypes.GET_DOCUMENTS_BY_ID_LOADING:
            return {
                data: state.data,
                loading: true,
            };
        case PatientsActionTypes.GET_DOCUMENTS_BY_ID_SUCCESS:
            return {
                data: action.payload,
                loading: false,
            };

        case PatientsActionTypes.GET_DOCUMENTS_BY_ID_ERROR:
            return {
                data: action.payload,
                loading: false,
            };
        default:
            return state;
    }
};