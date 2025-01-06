// @flow
import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import { getPermissionsDataReducer, createPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer } from './permissions/reducers';
import { createRolesReducer, getRolesDataReducer, updateRolesReducer, getUserDataReducer, deleteRolesDataReducer } from './roles/reducers';
import { createMastersDataReducer, getMastersDataReducer, updateMastersDataReducer, getDepartmentDataReducer } from './settings/reducers';
import { createClinicsReducer, getClinicsReducer, getClinicByIdReducer, updateClinicsReducer, getStatesReducer, getCitiesReducer, createSubscriptionPlanReducer, getClinicTypeReducer, createContractReducer, standardContractReducer } from './clinics/reducers';
import { getDoctorsReducer, getDoctorsRolesReducer, createtDoctorsDetailReducer, createtDoctorsReducer, getDoctorDetailsReducer } from './doctors/reducers';
import { getAnalyticsReducer } from './dashboard/reducers';
import { createPatientsReducer, getPatientsReducer, updatePatientsReducer, getPatientByIdReducer, createResponsiblePartyReducer, getResponsiblePartyReducer } from './patients/reducers';
import { getSubscriptionReducer, getSubSubscriptionReducer } from './subscriptions/reducers';
import { createSubClinicsReducer, getSubClinicsReducer, getSubClinicTypeReducer, getSubscriptionsReducer, createUpgradeReducer, getSubClinicCityReducer, updateSubClinicReducer } from './sub clinic/reducers';
import { createScheduleReducer, getDoctorsListReducer, getScheduleReducer, deleteScheduleReducer, createTimingsReducer, getPractitionerTimingsReducer } from './schedule/reducers';
import { createRoleDataReducer, updateRoleDataReducer, getRoleDataReducer } from './settings/rolesetting/reducers';
import { createAppointmentReducer, getAppointmentsReducer, getPractitionerScheduleReducer } from './appointments/reducers';
export default (combineReducers({
    Auth,
    Layout,
    createPermissionsDataReducer, getPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer,
    createRolesReducer, getRolesDataReducer, updateRolesReducer, getUserDataReducer, deleteRolesDataReducer,
    createClinicsReducer, getClinicsReducer, getClinicByIdReducer, getStatesReducer, getCitiesReducer,
    getAnalyticsReducer, createMastersDataReducer, getMastersDataReducer, getDepartmentDataReducer, updateMastersDataReducer, createSubscriptionPlanReducer, createContractReducer, standardContractReducer,
    getDoctorsReducer, getClinicTypeReducer, updateSubClinicReducer,
    createClinicsReducer, getClinicsReducer, getClinicByIdReducer, getStatesReducer,
    getAnalyticsReducer, createSubscriptionPlanReducer,
    getDoctorsReducer, createtDoctorsDetailReducer, createtDoctorsReducer, getDoctorDetailsReducer,
    createPatientsReducer, updatePatientsReducer, getPatientByIdReducer, createResponsiblePartyReducer, getResponsiblePartyReducer, getDoctorsListReducer, createScheduleReducer, getScheduleReducer, deleteScheduleReducer,
    getDoctorsRolesReducer,
    getPatientsReducer,
    getSubscriptionReducer, getSubSubscriptionReducer,
    createRoleDataReducer, updateRoleDataReducer, getRoleDataReducer,
    createSubClinicsReducer, getSubClinicsReducer, getSubClinicTypeReducer, getSubscriptionsReducer, createUpgradeReducer, getSubClinicCityReducer,
    createAppointmentReducer, getPractitionerScheduleReducer, getAppointmentsReducer, createTimingsReducer, getPractitionerTimingsReducer
}): any);
