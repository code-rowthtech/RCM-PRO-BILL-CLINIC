// @flow
import { SubClinicsActionTypes } from './constants';

type AuthAction = { type: string, payload: {} | string };

export const createSubClinicAction = (data): AuthAction => ({
    type: SubClinicsActionTypes.CREATE_SUBCLINIC,
    data
});
export const getSubClinicAction = (data): AuthAction => ({
    type: SubClinicsActionTypes.GET_SUBCLINIC,
    data
});
export const getSubClinicTypeAction = (data): AuthAction => ({
    type: SubClinicsActionTypes.GET_SUBCLINICTYPE,
    data
});

// export const getClinicAction = (data): AuthAction => ({
//     type: SubClinicsActionTypes.GET_SUBCLINIC,
//     data
// });

// export const getClinicTypeAction = (data): AuthAction => ({
//     type: SubClinicsActionTypes.GET_CLINIC_TYPE,
//     data
// });

// export const getStatesByCountryAction = (data): AuthAction => ({
//     type: SubClinicsActionTypes.GET_STATES,
//     data
// });

// export const getCitiesAction = (data): AuthAction => ({
//     type: SubClinicsActionTypes.GET_CITIES,
//     data
// });

// export const updateClinicAction = (data): AuthAction => ({
//     type: SubClinicsActionTypes.UPDATE_CLINIC,
//     data
// });

// export const getClinicById = (data): AuthAction => ({
//     type: SubClinicsActionTypes.GET_CLINIC_BY_ID,
//     data
// });

// export const addSubscriptionPlanAction = (data): LayoutAction => ({
//     type: SubClinicsActionTypes.CREATE_SUBSCRIPTION,
//     data
// });

// export const createContractAction = (data): LayoutAction => ({
//     type: SubClinicsActionTypes.CREATE_CONTRACT,
//     data
// });

// export const getClinicByParentAction = (data): AuthAction => ({
//     type: SubClinicsActionTypes.GET_CLINIC_BY_PARENT,
//     data
// });

// export const deleteClinicAction = (data): AuthAction => ({
//     type: SubClinicsActionTypes.DELETE_CLINIC,
//     data
// });

// export const stateEmptydAction = (): LayoutAction => ({
//     type: SubClinicsActionTypes.STATE_EMPTY_INTIAL_STATE,
// });
