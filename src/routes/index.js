import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PrivateRoute from './PrivateRoute';
import Root from './Root';
import * as layoutConstants from '../constants/layout';

// All layouts/containers
import DefaultLayout from '../layouts/Default';
import VerticalLayout from '../layouts/Vertical';
import DetachedLayout from '../layouts/Detached';
import HorizontalLayout from '../layouts/Horizontal';
import FullLayout from '../layouts/Full';
import schedule from '../pages/apps/Schedule/schedule';
import AddHoliday from '../pages/apps/Schedule/AddHoliday';
import AddBreak from '../pages/apps/Schedule/AddBreak';

// lazy load all the views

// auth
const Login = React.lazy(() => import('../pages/account/Login'));
const Logout = React.lazy(() => import('../pages/account/Logout'));
const Register = React.lazy(() => import('../pages/account/Register'));
const Confirm = React.lazy(() => import('../pages/account/Confirm'));
const ForgetPassword = React.lazy(() => import('../pages/account/ForgetPassword'));
// const SignUp = React.lazy(() => import('../pages/account/SignUp'));
const ResetPassword = React.lazy(() => import('../pages/account/ResetPassword'));
const LockScreen = React.lazy(() => import('../pages/account/LockScreen'));
const SetPassword = React.lazy(() => import('../pages/account/SetPassword'));
const VerifyPassword = React.lazy(() => import('../pages/account/VerifyEmail'));


const Login2 = React.lazy(() => import('../pages/account2/Login2'));
const Logout2 = React.lazy(() => import('../pages/account2/Logout2'));
const Register2 = React.lazy(() => import('../pages/account2/Register2'));
const Confirm2 = React.lazy(() => import('../pages/account2/Confirm2'));
const ForgetPassword2 = React.lazy(() => import('../pages/account2/ForgetPassword2'));
const LockScreen2 = React.lazy(() => import('../pages/account2/LockScreen2'));

// dashboard
const ProjectDashboard = React.lazy(() => import('../pages/dashboard/Project'));
// const AllClinics = React.lazy(() => import('../pages/apps/Clinic/AllClinics'));
const AddClinics = React.lazy(() => import('../pages/apps/Clinic/AddClinic/index'));
const AddClinicsV2 = React.lazy(() => import('../pages/apps/Clinic/AddClinicV2/index'));

// const UpdateClinic = React.lazy(() => import('../pages/apps/Clinic/AllClinics/updateClinic'));
const AppointmentsList = React.lazy(() => import('../pages/apps/Appointments/index'));
const NewAppointment = React.lazy(() => import('../pages/apps/Appointments/NewAppointment'));
const AppointmentCalendar = React.lazy(() => import('../pages/apps/Appointments/AppointmentCalendar'));
const Transaction = React.lazy(() => import('../pages/apps/Transaction/Transaction'));

const Subscriptions = React.lazy(() => import('../pages/apps/Subscriptions/index'));
// const AddSubscriptions = React.lazy(() => import('../pages/apps/Subscriptions/Addsubscriptions/index'));
const Doctors = React.lazy(() => import('../pages/apps/Doctors/index'));
const NewDoctor = React.lazy(() => import('../pages/apps/Doctors/NewDoctor'));
const DepartmentDetails = React.lazy(() => import('../pages/apps/Doctors/DepartmentDetails'));

// V2 Doctor Onboarding Components

const Patients = React.lazy(() => import('../pages/apps/Patients/index'));
const NewPatient = React.lazy(() => import('../pages/apps/Patients/NewPatient'));
const UpdatePatient = React.lazy(() => import('../pages/apps/Patients/UpdatePatient/index'));

const NewPractice = React.lazy(() => import('../pages/apps/SubPractice/NewPractice'));
const UpdateSubClinic = React.lazy(() => import('../pages/apps/SubPractice/updateSubClinic'));
// tasks
const Tasks = React.lazy(() => import('../pages/apps/Tasks/Task'));
// settings
const Setting = React.lazy(() => import('../pages/apps/Settings/index'));
const Department = React.lazy(() => import('../pages/apps/Settings/Department/Department'));
const Desigination = React.lazy(() => import('../pages/apps/Settings/Designation/Desigination'));
const PurposeOfVisit = React.lazy(() => import('../pages/apps/Settings/Purpose/PurposeOfVisit'));
const ConsultationRoom = React.lazy(() => import('../pages/apps/Settings/Consultation Room/ConsultationRoom'));
const Consent = React.lazy(() => import('../pages/apps/Settings/Consent/Consent'));
const Office = React.lazy(() => import('../pages/apps/Settings/Office/Office'));
const NotesType = React.lazy(() => import('../pages/apps/Settings/NotesType/notesType'))
const Templates = React.lazy(() => import('../pages/apps/Settings/Templates/templates'))
const TaskCategory = React.lazy(() => import('../pages/apps/Settings/Task Category/TaskCategory'));
// Notes Templates
const ClinicalNotesType = React.lazy(() => import('../pages/apps/NotesAndTemplates/NotesTypes'));
const NotesTemplates = React.lazy(() => import('../pages/apps/NotesAndTemplates/NotesTemplates'));
const RoleManagement = React.lazy(() => import('../pages/apps/RoleManagement/index'));
const RoleSetting = React.lazy(() => import('../pages/apps/Settings/Role/RoleSetting'));
const AuditReport = React.lazy(() => import('../pages/apps/AuditReport/index'));
const Permissions = React.lazy(() => import('../pages/apps/Permissions/index'));
const Roles = React.lazy(() => import('../pages/apps/Roles/index'));
// pages
const ErrorPageNotFound = React.lazy(() => import('../pages/error/PageNotFound'));
const ErrorPageNotFoundAlt = React.lazy(() => import('../pages/error/PageNotFoundAlt'));
const ServerError = React.lazy(() => import('../pages/error/ServerError'));
const NotAuthorized = React.lazy(() => import('../pages/error/NotAuthorized'));

// - other
const Invoice = React.lazy(() => import('../pages/other/Invoice'));
const Pricing = React.lazy(() => import('../pages/other/Pricing'));
const Maintenance = React.lazy(() => import('../pages/other/Maintenance'));
const Starter = React.lazy(() => import('../pages/other/Starter'));
const PreLoader = React.lazy(() => import('../pages/other/PreLoader'));
const Timeline = React.lazy(() => import('../pages/other/Timeline'));
const LogoutModel = React.lazy(() => import('../components/LogoutModel'));

const loading = () => <div className=""></div>;

const LoadComponent = ({ component: Component }) => (
    <Suspense fallback={loading()}>
        <Component />
    </Suspense>
);

const AllRoutes = () => {
    const { layout } = useSelector((state) => ({
        layout: state.Layout,
    }));
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userPermissions = userData?.user?.role?.permissions?.map(permission => permission.permission) || [];
    const hasPermission = (permission) => {
        // If userPermissions is empty, allow all permissions
        if (userPermissions.length === 0) {
            return true;
        }
        return userPermissions.some((perm) => perm === permission);
    };

    const getLayout = () => {
        let layoutCls = VerticalLayout;

        switch (layout.layoutType) {
            case layoutConstants.LAYOUT_HORIZONTAL:
                layoutCls = HorizontalLayout;
                break;
            case layoutConstants.LAYOUT_DETACHED:
                layoutCls = DetachedLayout;
                break;
            case layoutConstants.LAYOUT_FULL:
                layoutCls = FullLayout;
                break;
            default:
                layoutCls = VerticalLayout;
                break;
        }
        return layoutCls;
    };
    let Layout = getLayout();

    return useRoutes([
        { path: '/', element: <Root /> },
        {
            // public routes
            path: '/',
            element: <DefaultLayout />,
            children: [
                {
                    path: 'account',
                    children: [
                        { path: 'login', element: <LoadComponent component={Login} /> },
                        { path: 'register', element: <LoadComponent component={Register} /> },
                        { path: 'confirm', element: <LoadComponent component={Confirm} /> },
                        { path: 'forget-password', element: <LoadComponent component={ForgetPassword} /> },
                        { path: 'reset-password/:token', element: <LoadComponent component={ResetPassword} /> },
                        // {path: 'sign-Up', element: <LoadComponent component={SignUp} /> },
                        { path: 'lock-screen', element: <LoadComponent component={LockScreen} /> },
                        { path: 'set-password/:token', element: <LoadComponent component={SetPassword} /> },
                        { path: 'verify-password/:token', element: <LoadComponent component={VerifyPassword} /> },
                        { path: 'logout', element: <LoadComponent component={Logout} /> },
                        { path: 'login2', element: <LoadComponent component={Login2} /> },
                        { path: 'register2', element: <LoadComponent component={Register2} /> },
                        { path: 'confirm2', element: <LoadComponent component={Confirm2} /> },
                        { path: 'forget-password2', element: <LoadComponent component={ForgetPassword2} /> },
                        { path: 'lock-screen2', element: <LoadComponent component={LockScreen2} /> },
                        { path: 'logout2', element: <LoadComponent component={Logout2} /> },
                    ],
                },
                {
                    path: 'error-404',
                    element: <LoadComponent component={ErrorPageNotFound} />,
                },
                {
                    path: 'error-500',
                    element: <LoadComponent component={ServerError} />,
                },
                {
                    path: 'maintenance',
                    element: <LoadComponent component={Maintenance} />,
                },
                {
                    path: 'not-authorized',
                    element: <LoadComponent component={NotAuthorized} />,
                },
            ],
        },
        {
            path: '/',
            element: <PrivateRoute component={Layout} />,
            children: [
                {
                    path: 'dashboard',
                    children: hasPermission('view dashboard')
                        ? [
                            {
                                path: 'project',
                                element: <LoadComponent component={ProjectDashboard} />,
                            }
                        ]
                        : [
                            {
                                path: 'project',
                                element: <div className="disabled-content">You don't have permission to view this page.</div>,
                            },
                        ],

                },
                {
                    path: 'apps',
                    children: [
                        {
                            path: 'crm',
                            children: [
                                {
                                    path: 'addPractice',
                                    element: hasPermission('view crm')
                                        ? <LoadComponent component={AddClinics} />
                                        : <div className="disabled-content">You don't have permission to view this page.</div>,
                                },
                                {
                                    path: 'addPracticeV2',
                                    element: hasPermission('view crm')
                                        ? <LoadComponent component={AddClinicsV2} />
                                        : <div className="disabled-content">You don't have permission to view this page.</div>,
                                },
                            ],
                        },
                        {
                            path: 'transaction',
                            children: [
                                {
                                    path: 'transaction-list',
                                    element: hasPermission('view transaction')
                                        ? <LoadComponent component={Transaction} />
                                        : <div className="disabled-content">You don't have permission to view this page.</div>,
                                },
                            ],
                        },
                        {
                            path: 'appointments',
                            children: [
                                {
                                    path: 'list',
                                    element: hasPermission('view appointments list') ? (
                                        <LoadComponent component={AppointmentsList} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                                {
                                    path: 'newAppointment',
                                    element: hasPermission('create new appointment') ? (
                                        <LoadComponent component={NewAppointment} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                                {
                                    path: 'appointmentCalendar',
                                    element: hasPermission('view appointment calendar') ? (
                                        <LoadComponent component={AppointmentCalendar} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                            ],

                        },
                        {
                            path: 'schedule',
                            children: hasPermission('view schedule')
                                ? [
                                    {
                                        path: 'list',
                                        element: <LoadComponent component={schedule} />,
                                    },
                                    {
                                        path: 'addHoliday',
                                        element: <LoadComponent component={AddHoliday} />,
                                    },
                                    {
                                        path: 'addBreak',
                                        element: <LoadComponent component={AddBreak} />,
                                    },
                                ]
                                : [
                                    {
                                        path: 'list',
                                        element: <>
                                            <div className="disabled-content">You don't have permission to view this page.</div>
                                        </>
                                    }
                                ],

                        },
                        {
                            path: 'providers',
                            children: [
                                {
                                    path: 'list',
                                    element: hasPermission("LIST_ALL_DOCTORS") ? (
                                        <LoadComponent component={Doctors} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                                {
                                    path: 'new-doctor',
                                    element: hasPermission("ADD_A_DOCTOR") ? (
                                        <LoadComponent component={NewDoctor} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                                {
                                    path: 'departmentDetails',
                                    element: hasPermission('view department details') ? (
                                        <LoadComponent component={DepartmentDetails} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                            ],
                        },
                        {
                            path: 'role-management',
                            children: [
                                {
                                    path: 'list',
                                    element: hasPermission('view role management') ? (
                                        <LoadComponent component={RoleManagement} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                            ],
                        },
                        {
                            path: 'audit-report',
                            children: [
                                {
                                    path: 'list',
                                    element: hasPermission('view audit report') ? (
                                        <LoadComponent component={AuditReport} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                            ],
                        },
                        {
                            path: 'Practice',
                            children: [
                                {
                                    path: 'new-practice',
                                    element: hasPermission('view practice') ? (
                                        <LoadComponent component={NewPractice} />
                                    ) : null,
                                },
                                {
                                    path: 'updateSubClinic',
                                    element: hasPermission('edit subclinic') ? (
                                        <LoadComponent component={UpdateSubClinic} />
                                    ) : null,
                                },
                            ],
                        },
                        {
                            path: 'tasks',
                            element: hasPermission('view Tasks') ? (
                                <LoadComponent component={Tasks} />
                            ) : null,
                        },

                        {
                            path: 'notes-and-templates',
                            children: [
                                {
                                    path: 'list',
                                    element: hasPermission('view notes and templates') ? (
                                        <LoadComponent component={NotesTemplates} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    )
                                },
                                {
                                    path: 'note-categories',
                                    element: hasPermission('view notes') ? (
                                        <LoadComponent component={ClinicalNotesType} />
                                    ) : null,
                                },
                                {
                                    path: 'note-templates',
                                    element: hasPermission('view templates') ? (
                                        <LoadComponent component={NotesTemplates} />
                                    ) : null,
                                },
                            ],
                        },
                        {
                            path: 'settings',
                            children: [
                                {
                                    path: 'list',
                                    element: hasPermission('view settings') ? (
                                        <LoadComponent component={Setting} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                                {
                                    path: 'department',
                                    element: hasPermission('view department settings') ? (
                                        <LoadComponent component={Department} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                                {
                                    path: 'desigination',
                                    element: hasPermission('view desigination settings') ? (
                                        <LoadComponent component={Desigination} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                                {
                                    path: 'purposeofvisit',
                                    element: hasPermission('view desigination settings') ? (
                                        <LoadComponent component={PurposeOfVisit} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                                {
                                    path: 'consultationroom',
                                    element: hasPermission('view consultationroom settings') ? (
                                        <LoadComponent component={ConsultationRoom} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                                {
                                    path: 'consent',
                                    element: hasPermission('view consent settings') ? (
                                        <LoadComponent component={Consent} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                                {
                                    path: 'notesType',
                                    element: hasPermission('view notestype settings') ? (
                                        <LoadComponent component={NotesType} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                                {
                                    path: 'templates',
                                    element: hasPermission('view templates settings') ? (
                                        <LoadComponent component={Templates} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                                {
                                    path: 'office',
                                    element: hasPermission('view office settings') ? (
                                        <LoadComponent component={Office} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                                {
                                    path: 'role',
                                    element: hasPermission('view role settings') ? (
                                        <LoadComponent component={RoleSetting} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                                {
                                    path: 'taskcategory',
                                    element: hasPermission('view taskcategory settings') ? (
                                        <LoadComponent component={TaskCategory} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                }
                            ],
                        },
                        {
                            path: 'subscriptions',
                            children: [
                                {
                                    path: 'list',
                                    element: <LoadComponent component={Subscriptions} />,
                                },
                            ],
                        },
                        {
                            path: 'patients',
                            children: [
                                {
                                    path: 'list',
                                    element: hasPermission("LIST_ALL_PATIENTS") ? (
                                        <LoadComponent component={Patients} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to view this page.</div>
                                    ),
                                },
                                {
                                    path: 'new-patient',
                                    element: hasPermission("ADD_A_PATIENT") ? (
                                        <LoadComponent component={NewPatient} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to create a new patient.</div>
                                    ),
                                },

                                {
                                    path: 'update-patient',
                                    element: hasPermission("UPDATE_A_PATIENT") ? (
                                        <LoadComponent component={UpdatePatient} />
                                    ) : (
                                        <div className="disabled-content">You don't have permission to update a patient.</div>
                                    ),
                                },
                            ],

                        },
                        {
                            path: 'permissions',
                            children: [
                                {
                                    path: 'list',
                                    element: <LoadComponent component={Permissions} />,
                                },
                            ],
                        },
                        {
                            path: 'roles',
                            children: [
                                {
                                    path: 'list',
                                    element: <LoadComponent component={Roles} />,
                                },
                            ],
                        },
                        {
                            path: 'logout',
                            children: [
                                {
                                    path: 'logout-model',
                                    element: <LoadComponent component={LogoutModel} />,
                                },


                            ],
                        },
                    ],
                },
                {
                    path: 'pages',
                    children: [
                        {
                            path: 'starter',
                            element: <LoadComponent component={Starter} />,
                        },

                        {
                            path: 'pricing',
                            element: <LoadComponent component={Pricing} />,
                        },
                        {
                            path: 'error-404-alt',
                            element: <LoadComponent component={ErrorPageNotFoundAlt} />,
                        },
                        {
                            path: 'timeline',
                            element: <LoadComponent component={Timeline} />,
                        },
                        {
                            path: 'invoice',
                            element: <LoadComponent component={Invoice} />,
                        },

                        {
                            path: 'preloader',
                            element: <LoadComponent component={PreLoader} />,
                        },
                    ],
                },


            ],

        },
    ]);
};

export { AllRoutes };
