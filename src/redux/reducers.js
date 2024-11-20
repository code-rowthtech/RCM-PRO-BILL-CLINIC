// @flow
import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import { getPermissionsDataReducer, createPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer } from './permissions/reducers';
import { createRolesReducer, getRolesDataReducer, updateRolesReducer } from './roles/reducers';
import { createMastersDataReducer,getMastersDataReducer,updateMastersDataReducer} from './settings/reducers';
import { createClinicsReducer, getClinicsReducer, getClinicByIdReducer, updateClinicsReducer,getStatesReducer,getCitiesReducer } from './clinics/reducers';
import { getDoctorsReducer } from './doctors/reducers';
import { getAnalyticsReducer } from './dashboard/reducers';
import { getPatientsReducer } from './patients/reducers';
import { getSubscriptionsReducer } from './subscriptions/reducers';
export default (combineReducers({
    Auth,
    Layout,
    createPermissionsDataReducer, getPermissionsDataReducer, deletePermissionsDataReducer, updatePermissionsDataReducer,
    createRolesReducer, getRolesDataReducer, updateRolesReducer,
    createClinicsReducer, getClinicsReducer, getClinicByIdReducer, updateClinicsReducer,getStatesReducer,getCitiesReducer,
    getAnalyticsReducer,createMastersDataReducer,getMastersDataReducer,updateMastersDataReducer,
    getDoctorsReducer,
    getPatientsReducer,
    getSubscriptionsReducer,
}): any);
