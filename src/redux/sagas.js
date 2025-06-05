// @flow
import { all } from 'redux-saga/effects';

import authSaga from './auth/saga';
import layoutSaga from './layout/saga';
import permissionsSaga from './permissions/saga';
import rolesSaga from './roles/saga';
import clinicsSaga from './clinics/saga';
import doctorsSaga from './doctors/saga';
import patientsSaga from './patients/saga';
import dashboardSaga from './dashboard/saga';
import subscriptionsSaga from './subscriptions/saga';
import settingsSaga from './settings/saga';
import subclinicsSaga from './sub clinic/saga';
import scheduleSaga from './schedule/saga';
import settingsRoleSaga from './settings/rolesetting/saga';
import appointentsSaga from './appointments/saga';
import vitalsSaga from './vitals/saga';
import clinicNotesSaga from './assigntasks/saga';
import ProblemListSaga from './ProblemList/saga';
import alleryListSaga from './allergyList/saga';
import suggestionsListSaga from './suggestions/saga';
import medicationSaga from './medication/saga';
import clinicalHistorySaga from './socialHistory/saga'
import icdCodesSaga from './icdCodes/saga';
import encounterSaga from './encounter/saga';
import noteCategoriesSaga from './noteCategories/saga';
import templateSaga from './templates/saga';
import tasksSaga from './Tasks/saga';

export default function* rootSaga(): any {
    yield all([authSaga(), layoutSaga(), settingsRoleSaga(), permissionsSaga(), rolesSaga(), subclinicsSaga(), clinicsSaga(), doctorsSaga(), patientsSaga(), medicationSaga(), clinicalHistorySaga(),
    dashboardSaga(), subscriptionsSaga(), settingsSaga(), scheduleSaga(), appointentsSaga(), vitalsSaga(), clinicNotesSaga(), ProblemListSaga(), alleryListSaga(), suggestionsListSaga(),
    icdCodesSaga(), encounterSaga(), noteCategoriesSaga(), templateSaga(), tasksSaga()]);
}
// export default function* rootSaga(): any {
//     yield all([authSaga(), layoutSaga(), permissionsSaga(), rolesSaga(), clinicsSaga(), doctorsSaga(), patientsSaga(), dashboardSaga(), subscriptionsSaga(),settingsSaga(),scheduleSaga() ]);
// }
