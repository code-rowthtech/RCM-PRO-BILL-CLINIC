// @flow
import React, { useEffect, useState } from 'react';
import { Form, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

// actions
import { showRightSidebar, changeSidebarType, getSubClinicAction } from '../redux/actions';

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
import ModalTask from '../pages/apps/Tasks/ModalTask';
import { MdAddCircleOutline } from 'react-icons/md';
import { decryptMessage, encryptMessage } from '../cryptoUtils';

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
    const navigate = useNavigate();
    const store = useSelector((state) => state);
    const subClinicLocations = store?.getSubClinicsReducer?.data?.clinics;
    const location = useLocation(); // Get the current location object
    const { pathname, search } = location;
    const [taskModal, setTaskModal] = useState(false);
    const [selectedSubClinic, setSelectedSubClinic] = useState(decryptMessage(localStorage.getItem('subClinicLocation')) || '');
    // Define a mapping of paths to titles
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

    useEffect(() => {
        dispatch(getSubClinicAction())
    }, [dispatch]);

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
                        {location.pathname === '/apps/patients/update-patient' && (
                            <li className="notification-list ">
                                <button
                                    onClick={() => navigate('/apps/patients/list')}
                                    className="custom mt-2 text-muted border-0 mx-2 px-2 bg-light fw-semibold">
                                    Back
                                </button>
                            </li>
                        )}
                        <li className="notification-list">
                            <select
                                className="form-select mt-1 text-capitalize"
                                style={{
                                    minWidth: '15rem',
                                    maxWidth: '20rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                                onChange={(e) => {
                                    localStorage.setItem('subClinicLocation', encryptMessage(e.target.value));
                                    setSelectedSubClinic(e.target.value);
                                    window.location.reload();
                                }}
                                value={selectedSubClinic}
                            >
                                <option value={store?.Auth?.user?.clinicId} selected>{store?.getSubClinicsReducer?.loading ? 'Loading...' : store?.Auth?.user?.name}</option>
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
                            <button
                                onClick={() => setTaskModal(true)}
                                className="custom mt-2 mx-2 text-muted border-0  px-2 bg-light fw-semibold">
                                Add Task
                            </button>
                        </li>
                        {/* <li
                            onClick={() => setTaskModal(true)}
                            className="custom-buttons fw-bolder fs-3 cursor-pointer ms-2"
                            title="Add New Task">
                            <MdAddCircleOutline /> Add Task
                        </li> */}
                        {/* <li className="notification-list">
                            <Button className="custom-buttons mt-1" onClick={() => setTaskModal(true)}>
                                Add Task
                            </Button>
                        </li> */}
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
                            {/* Display the user-friendly page title */}
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
