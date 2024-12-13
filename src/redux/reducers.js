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
import { createSubClinicsReducer, getSubClinicsReducer, getSubClinicTypeReducer,getSubscriptionsReducer,createUpgradeReducer,getSubClinicCityReducer, updateSubClinicReducer } from './sub clinic/reducers';
import { createScheduleReducer, getDoctorsListReducer,getScheduleReducer ,deleteScheduleReducer} from './schedule/reducers';
import { createRoleDataReducer,updateRoleDataReducer,getRoleDataReducer } from './settings/rolesetting/reducers';
export default (combineReducers({
    Auth,
    Layout,
    createPermissionsDataReducer, getPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer,
    createRolesReducer, getRolesDataReducer, updateRolesReducer,
    createClinicsReducer, getClinicsReducer, getClinicByIdReducer,getStatesReducer,getCitiesReducer,
    getAnalyticsReducer,createMastersDataReducer,getMastersDataReducer,updateMastersDataReducer,createSubscriptionPlanReducer,createContractReducer,
    getDoctorsReducer,getClinicTypeReducer,updateSubClinicReducer,
    createClinicsReducer, getClinicsReducer, getClinicByIdReducer,getStatesReducer,
    getAnalyticsReducer,createMastersDataReducer,updateMastersDataReducer,createSubscriptionPlanReducer,
    getDoctorsReducer,createtDoctorsDetailReducer,createtDoctorsReducer,getDoctorDetailsReducer,
    createPatientsReducer,updatePatientsReducer,createtDoctorsReducer,getDoctorsListReducer,createScheduleReducer,getScheduleReducer,deleteScheduleReducer,
    getDoctorsRolesReducer,
    getPatientsReducer,
    getSubscriptionReducer,getSubSubscriptionReducer,
    createRoleDataReducer,updateRoleDataReducer,getRoleDataReducer,
    createSubClinicsReducer,getSubClinicsReducer,getSubClinicTypeReducer,getSubscriptionsReducer,createUpgradeReducer,getSubClinicCityReducer,
}): any);
