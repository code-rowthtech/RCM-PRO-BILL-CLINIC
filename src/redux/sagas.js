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

export default function* rootSaga(): any {
    yield all([authSaga(), layoutSaga(),settingsRoleSaga(), permissionsSaga(), rolesSaga(),subclinicsSaga(), clinicsSaga(), doctorsSaga(), patientsSaga(), dashboardSaga(), subscriptionsSaga(),settingsSaga(),scheduleSaga()]);
}
// export default function* rootSaga(): any {
//     yield all([authSaga(), layoutSaga(), permissionsSaga(), rolesSaga(), clinicsSaga(), doctorsSaga(), patientsSaga(), dashboardSaga(), subscriptionsSaga(),settingsSaga(),scheduleSaga() ]);
// }
