// @flow
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

// actions
import { changeSidebarType, getSubClinicAction } from '../redux/actions';
import { getPatientsAction } from '../redux/patients/actions';

// components
import ProfileDropdown from '../components/ProfileDropdown';

// images
import profilePic from '../assets/images/users/avatar-1.jpg';
import { FaUserCircle, FaChartLine } from 'react-icons/fa';

//constants
import * as layoutConstants from '../constants/layout';
import ModalTask from '../pages/apps/Tasks/ModalTask';
import { decryptMessage, encryptMessage } from '../cryptoUtils';
import { Button } from 'react-bootstrap';

const ProfileMenus = [
    {
        label: 'Logout',
        icon: 'mdi mdi-logout',
        redirectTo: '/account/logout',
    },
];

type TopbarProps = {
    hideLogo?: boolean,
    navCssClasses?: string,
    openLeftMenuCallBack?: () => void,
    topbarDark?: boolean,
};

const Topbar = ({ hideLogo, navCssClasses, openLeftMenuCallBack, topbarDark }: TopbarProps): React$Element<any> => {
    const dispatch = useDispatch();
    const [isopen, setIsopen] = useState(false);
    const navigate = useNavigate();
    const store = useSelector((state) => state);
    const subClinicLocations = store?.getSubClinicsReducer?.data?.clinics;
    const location = useLocation();
    const { pathname, search } = location;
    const [taskModal, setTaskModal] = useState(false);
    const [selectedSubClinic, setSelectedSubClinic] = useState(decryptMessage(localStorage.getItem('subClinicLocation')) || '');

    const pathToTitleMap = {
        '/dashboard': 'Dashboard',
        '/dashboard/project': 'Dashboard',
        '/apps/appointments/list': 'Appointments',
        '/apps/appointments/newAppointment': 'New Appointments',
        '/apps/providers/list': 'Provider List',
        '/apps/Practice/list': 'Sub Practice',
        '/apps/Practice/new-practice': 'Add New Practice Location',
        '/apps/providers/new-doctor': 'New Provider',
        '/apps/patients/list': 'Patients',
        '/apps/patients/new-patient': 'New Patient',
        '/apps/role-management/list': 'User Management',
        '/apps/crm/addPractice': 'Practice',
        '/apps/settings/department': 'Department',
        '/apps/settings/desigination': 'Desigination',
        '/apps/settings/consultationroom': 'Consultation Room',
        '/apps/settings/consent': 'Consent',
        '/apps/settings/office': 'Office',
        '/apps/settings/role': 'Role',
        '/apps/settings/taskcategory': 'Task Category',
        '/apps/schedule/list': 'Schedule',
        '/apps/schedule/addHoliday': 'Schedule',
        '/apps/schedule/addBreak': 'Schedule',
        '/apps/tasks': 'Tasks',
        '/apps/appointments/appointmentCalendar': 'Appointment Calendar',
        '/apps/appointments/newAppointment?updateid': 'Reschedule Appointment',
        '/apps/settings/purposeofvisit': 'Purpose Of Visit',
        '/apps/patients/update-patient': 'Patient Chart',
        '/apps/settings/templates': 'Templates',
        '/apps/settings/notesType': 'Notes Type',
        '/apps/notes-and-templates/note-templates': 'Note Templates',
        '/apps/notes-and-templates/note-categories': 'Note Categories',
        '/apps/audit-report/list': 'Audit Report'
    };

    const getPageTitle = (pathToTitleMap, pathname, search) => {
        const queryParams = new URLSearchParams(search);

        if (pathname === '/apps/providers/new-doctor' && queryParams.has('id')) {
            return 'Update Provider';
        }
        if (pathname === '/apps/Practice/updateSubClinic' && queryParams.has('id')) {
            return 'Update Sub Practice';
        }

        for (const [key, value] of Object.entries(pathToTitleMap)) {
            if (pathname.startsWith(key)) {
                return value;
            }
        }

        return 'Page Not Found';
    };

    const pageTitle = getPageTitle(pathToTitleMap, pathname, search);

    const navbarCssClasses = navCssClasses || '';
    const containerCssClasses = !hideLogo ? 'container-fluid ' : 'h-100';

    const { layoutType, leftSideBarType, patients, patientsLoading } = useSelector((state) => ({
        layoutType: state.Layout.layoutType,
        leftSideBarType: state.Layout.leftSideBarType,
        patients: state?.getPatientsReducer?.data?.data,
        patientsLoading: state?.getPatientsReducer?.loading,
    }));
    const handleLeftMenuCallBack = () => {
        setIsopen((prevState) => !prevState);
        if (openLeftMenuCallBack) openLeftMenuCallBack();
        switch (layoutType) {
            case layoutConstants.LAYOUT_VERTICAL:
                if (window.innerWidth >= 768) {
                    if (leftSideBarType === 'fixed' || leftSideBarType === 'scrollable')
                        dispatch(changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED));
                    if (leftSideBarType === 'condensed')
                        dispatch(changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_FIXED));
                }
                break;

            case layoutConstants.LAYOUT_FULL:
                if (document.body) {
                    document.body.classList.toggle('hide-menu');
                }
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        dispatch(getSubClinicAction());
    }, [dispatch]);

    useEffect(() => {
        if (window.location.pathname !== '/apps/patients/list' && !patients?.length) {
            dispatch(getPatientsAction({ limit: 1, page: 1 }));
        }
    }, [window.location.pathname, patients, dispatch])

    const handleCloseTaskModal = () => {
        setTaskModal(false);
    };

    return (
        <>
            <div className={classNames('navbar-custom', navbarCssClasses)}>
                <div className={containerCssClasses}>
                    {!hideLogo && (
                        <Link to="/" className="topnav-logo">
                            <span className="topnav-logo-lg">
                                <FaUserCircle className="rounded-circle fs-1  text-dark" />
                            </span>
                            <span className="topnav-logo-sm">
                                <FaUserCircle className="rounded-circle fs-1  text-dark" />
                            </span>
                        </Link>
                    )}
                    <ul className="list-unstyled h-100 d-flex align-items-center topbar-menu float-end mb-0">
                        <li className="notification-list">
                            <select
                                className="form-select text-capitalize"
                                style={{
                                    minWidth: '15rem',
                                    maxWidth: '20rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    height: '28px'
                                }}
                                onChange={(e) => {
                                    localStorage.setItem('subClinicLocation', encryptMessage(e.target.value));
                                    setSelectedSubClinic(e.target.value);
                                    window.location.reload();
                                }}
                                value={selectedSubClinic}
                            >
                                <option value={store?.Auth?.user?.clinicId}>{store?.getSubClinicsReducer?.loading ? 'Loading...' : store?.Auth?.user?.name}</option>
                                {subClinicLocations?.map((subClinics) => {
                                    const address = subClinics?.address?.[0]?.line?.[0];
                                    const displayText = `${subClinics?.name}${address ? ` - (${address})` : ''}`;
                                    const truncatedText = displayText.length > 35 ? displayText.substring(0, 35) + '...' : displayText;
                                    return (
                                        <option
                                            key={subClinics?._id}
                                            value={subClinics?._id}
                                            className="text-capitalize"
                                            title={displayText}
                                        >
                                            {truncatedText}
                                        </option>
                                    );
                                })}
                            </select>
                        </li>
                        <li className="notification-list">
                            <Button
                                onClick={() => {
                                    const firstPatientId = patients?.[0]?._id;
                                    navigate(`/apps/patients/update-patient?id=${firstPatientId}`);
                                }}
                                disabled={patientsLoading || patients?.length === 0}
                                className="custom topbar-action-buttons text-muted border-0 ms-2 px-2 bg-light fw-semibold d-flex align-items-center gap-1"
                                style={{ height: '28px' }}>
                                <FaChartLine size={12} />
                                Patient Chart
                            </Button>
                        </li>
                        <li className="notification-list">
                            <button
                                onClick={() => setTaskModal(true)}
                                className="custom topbar-action-buttons text-muted border-0 ms-2 mx-1 px-2 bg-light fw-semibold"
                                style={{ height: '28px' }}>
                                Add Task
                            </button>
                        </li>
                        {location.pathname === '/apps/patients/update-patient' && (
                            <li className="notification-list">
                                <button
                                    onClick={() => navigate('/apps/patients/list')}
                                    className="custom topbar-action-buttons text-muted border-0 mx-1 px-2 bg-light fw-semibold"
                                    style={{ height: '28px' }}>
                                    Back
                                </button>
                            </li>
                        )}
                        <ModalTask show={taskModal} handleClose={handleCloseTaskModal} />
                        <li className="dropdown notification-list">
                            <ProfileDropdown
                                profilePic={profilePic}
                                menuItems={ProfileMenus}
                                username={'Dominic Keller'}
                                userTitle={'Founder'}
                            />
                        </li>
                    </ul>
                    {(layoutType === layoutConstants.LAYOUT_VERTICAL || layoutType === layoutConstants.LAYOUT_FULL) && (
                        <div className="d-flex align-items-center">
                            <button className="button-menu-mobile open-left" onClick={handleLeftMenuCallBack}>
                                <i className="mdi mdi-menu fs-3 " />
                            </button>
                            <h5 className="mt-2">{pageTitle}</h5>
                        </div>
                    )}
                    {layoutType === layoutConstants.LAYOUT_HORIZONTAL && (
                        <Link
                            to="#"
                            className={classNames('navbar-toggle', { open: isopen })}
                            onClick={handleLeftMenuCallBack}>
                            <div className="lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </Link>
                    )}
                    {layoutType === layoutConstants.LAYOUT_DETACHED && (
                        <Link to="#" className="button-menu-mobile disable-btn" onClick={handleLeftMenuCallBack}>
                            <div className="lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
};

export default Topbar;
