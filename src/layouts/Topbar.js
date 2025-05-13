// @flow
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

// actions
import { showRightSidebar, changeSidebarType } from '../redux/actions';

// components
import ProfileDropdown from '../components/ProfileDropdown';

// images
import profilePic from '../assets/images/users/avatar-1.jpg';
import logoSmDark from '../assets/images/logo_sm_dark.png';
import logoSmLight from '../assets/images/logo_sm.png';
import { FaUserCircle } from 'react-icons/fa';
import logo from '../assets/images/logo-light.png';

//constants
import * as layoutConstants from '../constants/layout';
import { Button } from 'react-bootstrap';

const ProfileMenus = [
    // {
    //     label: 'Lock Screen',
    //     icon: 'mdi mdi-lock-outline',
    //     redirectTo: '/account/lock-screen',
    // },
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
    const navigate = useNavigate()

    const location = useLocation(); // Get the current location object
    const { pathname, search } = location;
    // Define a mapping of paths to titles
    const pathToTitleMap = {
        '/dashboard': 'Dashboard',
        '/dashboard/project': 'Dashboard',
        '/apps/appointments/list': 'Appointments',
        '/apps/appointments/newAppointment': 'New Appointments',
        '/apps/doctors/list': 'Provider List',
        '/apps/Practice/list': 'Sub Practice',
        '/apps/Practice/new-practice': 'Add New Practice Location',
        '/apps/doctors/new-doctor': 'New Provider',
        '/apps/patients/list': 'Patients',
        '/apps/patients/new-patient': 'New Patient',
        '/apps/role-management/list': 'User Management',
        '/apps/crm/addclinic': 'Practice',
        '/apps/settings/department': 'Department',
        '/apps/settings/desigination': 'Desigination',
        '/apps/settings/consultationroom': 'Consultation Room',
        '/apps/settings/office': 'Office',
        '/apps/settings/role': 'Role',
        '/apps/schedule/list': 'Schedule',
        '/apps/schedule/addHoliday': 'Schedule',
        '/apps/schedule/addBreak': 'Schedule',
        '/apps/appointments/appointmentCalendar': 'Appointment Calendar',
        '/apps/appointments/newAppointment?updateid': 'Reschedule Appointment',
        '/apps/settings/purposeofvisit': 'Purpose Of Visit',
        '/apps/patients/update-patient': 'Patient Chart',
        '/apps/settings/templates': 'Templates',
        '/apps/settings/notesType': 'Notes Type',
        '/apps/notesandtemplates/notestemplates' : 'Notes Templates',
         '/apps/notesandtemplates/notescategories': 'Notes Categories',
    };

    const getPageTitle = (pathToTitleMap, pathname, search) => {
        const queryParams = new URLSearchParams(search);

        if (pathname === '/apps/doctors/new-doctor' && queryParams.has('id')) {
            return 'Update Doctors';
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
    const containerCssClasses = !hideLogo ? 'container-fluid' : '';

    const { layoutType, leftSideBarType } = useSelector((state) => ({
        layoutType: state.Layout.layoutType,
        leftSideBarType: state.Layout.leftSideBarType,
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
    return (
        <>
            <div className={classNames('navbar-custom', navbarCssClasses)}>
                <div className={containerCssClasses}>
                    {!hideLogo && (
                        <Link to="/" className="topnav-logo">
                            <span className="topnav-logo-lg">
                                {/* <img src={logo} alt="logo" height="16" /> */}
                                <FaUserCircle className="rounded-circle fs-1  text-dark" />
                            </span>
                            <span className="topnav-logo-sm">
                                {/* <img src={topbarDark ? logoSmLight : logoSmDark} alt="logo" height="16" /> */}
                                <FaUserCircle className="rounded-circle fs-1  text-dark" />
                            </span>
                        </Link>
                    )}

                    <ul className="list-unstyled topbar-menu float-end mb-0">
                        {location.pathname === '/apps/patients/update-patient' &&
                            <li className='notification-list'>
                                <button
                                    onClick={() => navigate('/apps/patients/list')}
                                    className='custom mt-2 text-muted border-0  px-2 bg-light fw-semibold'
                                >
                                    Back
                                </button>
                            </li>}
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
                            {/* Display the user-friendly page title */}
                            <h5 className="">

                                {pageTitle}
                            </h5>
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
