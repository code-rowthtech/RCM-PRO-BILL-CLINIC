// @flow
import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import { getPermissionsDataReducer, createPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer } from './permissions/reducers';
import { createRolesReducer, getRolesDataReducer, updateRolesReducer } from './roles/reducers';
import { createMastersDataReducer,getMastersDataReducer,updateMastersDataReducer} from './settings/reducers';
import { createClinicsReducer, getClinicsReducer, getClinicByIdReducer, updateClinicsReducer,getStatesReducer,getCitiesReducer, createSubscriptionPlanReducer, getClinicTypeReducer, createContractReducer } from './clinics/reducers';
import { getDoctorsReducer, getDoctorsRolesReducer,createtDoctorsDetailReducer, createtDoctorsReducer, getDoctorDetailsReducer } from './doctors/reducers';
import { getAnalyticsReducer } from './dashboard/reducers';
import { createPatientsReducer, getPatientsReducer, updatePatientsReducer } from './patients/reducers';
import { getSubscriptionReducer,getSubSubscriptionReducer } from './subscriptions/reducers';
import { createSubClinicsReducer, getSubClinicsReducer, getSubClinicTypeReducer,getSubscriptionsReducer,createUpgradeReducer,getSubClinicCityReducer } from './sub clinic/reducers';
import { createScheduleReducer, getDoctorsListReducer,getScheduleReducer } from './schedule/reducers';
export default (combineReducers({
    Auth,
    Layout,
    createPermissionsDataReducer, getPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer,
    createRolesReducer, getRolesDataReducer, updateRolesReducer,
    createClinicsReducer, getClinicsReducer, getClinicByIdReducer,getStatesReducer,getCitiesReducer,
    getAnalyticsReducer,createMastersDataReducer,getMastersDataReducer,updateMastersDataReducer,createSubscriptionPlanReducer,createContractReducer,
    getDoctorsReducer,getClinicTypeReducer,
    createClinicsReducer, getClinicsReducer, getClinicByIdReducer,getStatesReducer,getCitiesReducer,
    getAnalyticsReducer,createMastersDataReducer,updateMastersDataReducer,createSubscriptionPlanReducer,
    getDoctorsReducer,createtDoctorsDetailReducer,createtDoctorsReducer,getDoctorDetailsReducer,
    createPatientsReducer,updatePatientsReducer,createtDoctorsReducer,getDoctorsListReducer,createScheduleReducer,getScheduleReducer,
    getDoctorsRolesReducer,
    getPatientsReducer,
    getSubscriptionReducer,getSubSubscriptionReducer,
    createSubClinicsReducer,getSubClinicsReducer,getSubClinicTypeReducer,getSubscriptionsReducer,createUpgradeReducer,getSubClinicCityReducer,
}): any);
