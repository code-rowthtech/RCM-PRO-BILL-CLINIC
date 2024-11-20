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


const Login2 = React.lazy(() => import('../pages/account2/Login2'));
const Logout2 = React.lazy(() => import('../pages/account2/Logout2'));
const Register2 = React.lazy(() => import('../pages/account2/Register2'));
const Confirm2 = React.lazy(() => import('../pages/account2/Confirm2'));
const ForgetPassword2 = React.lazy(() => import('../pages/account2/ForgetPassword2'));
const LockScreen2 = React.lazy(() => import('../pages/account2/LockScreen2'));

// dashboard
const ProjectDashboard = React.lazy(() => import('../pages/dashboard/Project'));
const AllClinics = React.lazy(() => import('../pages/apps/Clinic/AllClinics'));
const AddClinics = React.lazy(() => import('../pages/apps/Clinic/AddClinic/index'));
const ClinicForm = React.lazy(() => import('../pages/apps/Clinic/AddClinic/clinicForm'));
const Billing = React.lazy(() => import('../pages/apps/Clinic/AddClinic/billing'));
const Contract = React.lazy(() => import('../pages/apps/Clinic/AddClinic/contract'));

const UpdateClinic = React.lazy(() => import('../pages/apps/Clinic/AllClinics/updateClinic'));
const AppointmentsList = React.lazy(() => import('../pages/apps/Appointments/index'));
const NewAppointment = React.lazy(() => import('../pages/apps/Appointments/NewAppointment'));
const AppointmentCalendar = React.lazy(() => import('../pages/apps/Appointments/AppointmentCalendar'));
const Transaction = React.lazy(() => import('../pages/apps/Transaction/Transaction'));





const Subscriptions = React.lazy(() => import('../pages/apps/Subscriptions/index'));
// const AddSubscriptions = React.lazy(() => import('../pages/apps/Subscriptions/Addsubscriptions/index'));
const Doctors = React.lazy(() => import('../pages/apps/Doctors/index'));
const NewDoctor = React.lazy(() => import('../pages/apps/Doctors/NewDoctor'));
const DepartmentDetails = React.lazy(() => import('../pages/apps/Doctors/DepartmentDetails'));


const Patients = React.lazy(() => import('../pages/apps/Patients/index'));
const NewPatient = React.lazy(() => import('../pages/apps/Patients/NewPatient'));
const Setting = React.lazy(() => import('../pages/apps/Settings/index'));
const Department = React.lazy(() => import('../pages/apps/Settings/Department/Department'));
const Desigination = React.lazy(() => import('../pages/apps/Settings/Designation/Desigination'));


const RoleManagement = React.lazy(() => import('../pages/apps/RoleManagement/index'));



const Permissions = React.lazy(() => import('../pages/apps/Permissions/index'))
const Roles = React.lazy(() => import('../pages/apps/Roles/index'))

// pages

const ErrorPageNotFound = React.lazy(() => import('../pages/error/PageNotFound'));
const ErrorPageNotFoundAlt = React.lazy(() => import('../pages/error/PageNotFoundAlt'));
const ServerError = React.lazy(() => import('../pages/error/ServerError'));

// - other
const Invoice = React.lazy(() => import('../pages/other/Invoice'));
const Pricing = React.lazy(() => import('../pages/other/Pricing'));
const Maintenance = React.lazy(() => import('../pages/other/Maintenance'));
const Starter = React.lazy(() => import('../pages/other/Starter'));
const PreLoader = React.lazy(() => import('../pages/other/PreLoader'));
const Timeline = React.lazy(() => import('../pages/other/Timeline'));
const LogoutModel = React.lazy(() => import('../components/LogoutModel'));


// const Landing = React.lazy(() => import('../pages/landing'));

// // uikit
// const Accordions = React.lazy(() => import('../pages/uikit/Accordions'));
// const Alerts = React.lazy(() => import('../pages/uikit/Alerts'));
// const Avatars = React.lazy(() => import('../pages/uikit/Avatars'));
// const Badges = React.lazy(() => import('../pages/uikit/Badges'));
// const Breadcrumbs = React.lazy(() => import('../pages/uikit/Breadcrumb'));
// const Buttons = React.lazy(() => import('../pages/uikit/Buttons'));
// const Cards = React.lazy(() => import('../pages/uikit/Cards'));
// const Carousels = React.lazy(() => import('../pages/uikit/Carousel'));
// const Dropdowns = React.lazy(() => import('../pages/uikit/Dropdowns'));
// const EmbedVideo = React.lazy(() => import('../pages/uikit/EmbedVideo'));
// const Grid = React.lazy(() => import('../pages/uikit/Grid'));
// const ListGroups = React.lazy(() => import('../pages/uikit/ListGroups'));
// const Modals = React.lazy(() => import('../pages/uikit/Modals'));
// const Notifications = React.lazy(() => import('../pages/uikit/Notifications'));
// const Offcanvases = React.lazy(() => import('../pages/uikit/Offcanvas'));
// const Paginations = React.lazy(() => import('../helpers/Paginations'));
// const Popovers = React.lazy(() => import('../pages/uikit/Popovers'));
// const Progress = React.lazy(() => import('../pages/uikit/Progress'));
// const Ribbons = React.lazy(() => import('../pages/uikit/Ribbons'));
// const Spinners = React.lazy(() => import('../pages/uikit/Spinners'));
// const Tabs = React.lazy(() => import('../pages/uikit/Tabs'));
// const Tooltips = React.lazy(() => import('../pages/uikit/Tooltips'));
// const Typography = React.lazy(() => import('../pages/uikit/Typography'));
// const DragDrop = React.lazy(() => import('../pages/uikit/DragDrop'));
// const RangeSliders = React.lazy(() => import('../pages/uikit/RangeSliders'));
// const Ratings = React.lazy(() => import('../pages/uikit/Ratings'));

// icons
const Dripicons = React.lazy(() => import('../pages/icons/Dripicons'));
const MDIIcons = React.lazy(() => import('../pages/icons/MDIIcons'));
const Unicons = React.lazy(() => import('../pages/icons/Unicons'));

// forms
// const BasicForms = React.lazy(() => import('../pages/forms/Basic'));
// const FormValidation = React.lazy(() => import('../pages/forms/Validation'));
// const FormWizard = React.lazy(() => import('../pages/forms/Wizard'));
// const FileUpload = React.lazy(() => import('../pages/forms/FileUpload'));
// const Editors = React.lazy(() => import('../pages/forms/Editors'));

// charts
// const ApexChart = React.lazy(() => import('../pages/charts/Apex'));
// const BriteChart = React.lazy(() => import('../pages/charts/Brite'));
// const ChartJs = React.lazy(() => import('../pages/charts/ChartJs'));

// tables
// const BasicTables = React.lazy(() => import('../pages/tables/Basic'));
// const AdvancedTables = React.lazy(() => import('../pages/tables/Advanced'));

// widgets
// const Widgets = React.lazy(() => import('../pages/uikit/Widgets'));

// maps
// const GoogleMaps = React.lazy(() => import('../pages/maps/GoogleMaps'));
// const VectorMaps = React.lazy(() => import('../pages/maps/VectorMaps'));

const loading = () => <div className=""></div>;

type LoadComponentProps = {
    component: React.LazyExoticComponent<() => JSX.Element>,
};

const LoadComponent = ({ component: Component }: LoadComponentProps) => (
    <Suspense fallback={loading()}>
        <Component />
    </Suspense>
);

const AllRoutes = () => {
    const { layout } = useSelector((state) => ({
        layout: state.Layout,
    }));

    const getLayout = () => {
        let layoutCls = VerticalLayout  ;

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
                        // { path: 'sign-Up', element: <LoadComponent component={SignUp} /> },
                        {path : 'set-password/:token', element: <LoadComponent component={SetPassword}/>},
                        { path: 'lock-screen', element: <LoadComponent component={LockScreen} /> },
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
            ],
        },
        {
            // auth protected routes
            path: '/',
            element: <PrivateRoute component={Layout} />,
            children: [
                {
                    path: 'dashboard',
                    children: [
                        {
                            path: 'project',
                            element: <LoadComponent component={ProjectDashboard} />,
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
                                    path: 'orders',
                                    element: <LoadComponent component={AllClinics} />,
                                },
                                {
                                    path: 'addclinic',
                                    element: <LoadComponent component={AddClinics} />,
                                },
                                {
                                    path: 'updateclinic',
                                    element: <LoadComponent component={UpdateClinic} />,
                                },
                            ],
                        },
                        {
                            path: 'transaction',
                            children: [
                                {
                                    path: 'transaction-list',
                                    element: <LoadComponent component={Transaction} />,
                                },
                              
                              
                            ],
                        },
                        {
                            path: 'appointments',
                            children: [
                                {
                                    path: 'list',
                                    element: <LoadComponent component={AppointmentsList} />,
                                },
                                {
                                    path: 'newAppointment',
                                    element: <LoadComponent component={NewAppointment} />,
                                },
                                {
                                    path: 'appointmentCalendar',
                                    element: (
                                        <LoadComponent component={AppointmentCalendar} />
                                    )
                                 }
                              
                            ],
                        },
                        {
                            path: 'doctors',
                            children: [
                                {
                                    path: 'list',
                                    element: <LoadComponent component={Doctors} />,
                                },
                                {
                                    path: 'new-doctor',
                                    element: <LoadComponent component={NewDoctor} />,
                                },
                                {
                                    path: 'departmentDetails',
                                    element: <LoadComponent component={DepartmentDetails} />,
                                },
                            ],
                        },
                        {
                            path: 'role-management',
                            children: [
                                {
                                    path: 'list',
                                    element: <LoadComponent component={RoleManagement} />,
                                },
                            ],
                        },
                        {
                            path: 'settings',
                            children: [
                                {
                                    path: 'list',
                                    element: <LoadComponent component={Setting} />,
                                },
                                {
                                    path: 'department',
                                    element: <LoadComponent component={Department} />,
                                },
                                {
                                    path: 'desigination',
                                    element: <LoadComponent component={Desigination} />,
                                },
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
                                    element: <LoadComponent component={Patients} />,
                                },
                                {
                                    path: 'new-patient',
                                    element: <LoadComponent component={NewPatient} />,
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
