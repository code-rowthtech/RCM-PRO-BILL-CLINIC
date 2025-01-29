// @flow
import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import { getPermissionsDataReducer, createPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer } from './permissions/reducers';
import { createRolesReducer, getRolesDataReducer, updateRolesReducer, getUserDataReducer, deleteRolesDataReducer, viewPasswordReducer } from './roles/reducers';
import { createMastersDataReducer, getMastersDataReducer, updateMastersDataReducer, getDepartmentDataReducer } from './settings/reducers';
import {
    createClinicsReducer, getClinicsReducer, getClinicByIdReducer, updateClinicsReducer, getStatesReducer,
    getCitiesReducer, createSubscriptionPlanReducer, getClinicTypeReducer, createContractReducer, standardContractReducer, changeEmailReducer
} from './clinics/reducers';
import { getDoctorsReducer, getDoctorsRolesReducer, createtDoctorsDetailReducer, createtDoctorsReducer, getDoctorDetailsReducer, addReferringDoctorReducer } from './doctors/reducers';
import { getAnalyticsReducer } from './dashboard/reducers';
import {
    createPatientsReducer, getPatientsReducer, updatePatientsReducer, getPatientByIdReducer, createResponsiblePartyReducer, getResponsiblePartyReducer,
    updateResponsiblePartyReducer, updateInsuranceReducer, createInsuranceReducer, getInsuranceByIdReducer,
    getPatientsByAppointmentReducer
} from './patients/reducers';
import { getSubscriptionReducer, getSubSubscriptionReducer } from './subscriptions/reducers';
import { createSubClinicsReducer, getSubClinicsReducer, getSubClinicTypeReducer, getSubscriptionsReducer, createUpgradeReducer, getSubClinicCityReducer, updateSubClinicReducer } from './sub clinic/reducers';
import { createScheduleReducer, getDoctorsListReducer, getScheduleReducer, deleteScheduleReducer, createTimingsReducer, getPractitionerTimingsReducer, updateTimingsReducer } from './schedule/reducers';
import { createRoleDataReducer, updateRoleDataReducer, getRoleDataReducer } from './settings/rolesetting/reducers';
import { createAppointmentReducer, getAppointmentByIdReducer, getAppointmentsReducer, getPractitionerScheduleReducer, getPractitionerSlotsReducer, rescheduleAppointmentReducer } from './appointments/reducers';
import { createVitalsReducer, getVitalsByAppointmentIdReducer, getVitalsByPatientIdReducer, getVitalsReducer, updateVitalsReducer } from './vitals/reducers';
export default (combineReducers({
    Auth,
    Layout,
    createPermissionsDataReducer, getPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer,
    createRolesReducer, getRolesDataReducer, updateRolesReducer, getUserDataReducer, deleteRolesDataReducer,
    getAnalyticsReducer, createMastersDataReducer, getMastersDataReducer, getDepartmentDataReducer, updateMastersDataReducer, createSubscriptionPlanReducer, createContractReducer, standardContractReducer,
    getDoctorsReducer, getClinicTypeReducer, updateSubClinicReducer,
    createClinicsReducer, changeEmailReducer, getClinicsReducer, getClinicByIdReducer, getStatesReducer,
    createSubscriptionPlanReducer,
    getDoctorsReducer, createtDoctorsDetailReducer, createtDoctorsReducer, getDoctorDetailsReducer, addReferringDoctorReducer,
    createPatientsReducer, updatePatientsReducer, getPatientByIdReducer, createResponsiblePartyReducer, updateResponsiblePartyReducer, updateInsuranceReducer, createInsuranceReducer, getResponsiblePartyReducer, getDoctorsListReducer, createScheduleReducer, getScheduleReducer, deleteScheduleReducer,
    getDoctorsRolesReducer,
    getPatientsReducer,
    getSubscriptionReducer, getSubSubscriptionReducer,
    createRoleDataReducer, updateRoleDataReducer, getRoleDataReducer,
    createSubClinicsReducer, getSubClinicsReducer, getSubClinicTypeReducer, getSubscriptionsReducer, createUpgradeReducer, getSubClinicCityReducer,
    createAppointmentReducer, getPractitionerScheduleReducer, getAppointmentsReducer, getAppointmentByIdReducer, createTimingsReducer, getPractitionerTimingsReducer, updateTimingsReducer, getPractitionerSlotsReducer,
    rescheduleAppointmentReducer, viewPasswordReducer, getCitiesReducer, getInsuranceByIdReducer,
    // vitals
    createVitalsReducer, updateVitalsReducer, getVitalsReducer, getVitalsByPatientIdReducer, getVitalsByAppointmentIdReducer,
    getPatientsByAppointmentReducer
}): any);
