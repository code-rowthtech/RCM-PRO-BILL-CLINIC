// @flow
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import classNames from 'classnames';

import { getMenuItems } from '../helpers/menu';

// components
import AppMenu from './Menu';

// images
import logoSm from '../assets/images/logo_sm.png';
import logoDark from '../assets/images/logo-dark.png';
import logoDarkSm from '../assets/images/logo_sm_dark.png';
import logo from '../assets/images/logo.png';
import helpBoxImage from '../assets/images/help-icon.svg';
import profileImg from '../assets/images/users/avatar-1.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientsAction } from '../redux/actions';
import { encryptMessage } from '../cryptoUtils';
import { FormInput } from '../components';
import Spinner from '../constants/Spinner';
import { Button } from 'react-bootstrap';
import { IoMdAdd } from 'react-icons/io';

type SideBarContentProps = {
    hideUserProfile: boolean,
};

/* sidebar content */
const SideBarContent = ({ hideUserProfile }: SideBarContentProps) => {
    return (
        <>
            {!hideUserProfile && (
                <div className="leftbar-user">
                    <Link to="/">
                        <img src={profileImg} alt="" height="42" className="rounded-circle shadow-sm" />
                        <span className="leftbar-user-name">Dominic Keller</span>
                    </Link>
                </div>
            )}
            <AppMenu menuItems={getMenuItems()} />


            <div className="clearfix" />
        </>
    );
};

type LeftSidebarProps = {
    hideLogo: boolean,
    hideUserProfile: boolean,
    isLight: boolean,
    isCondensed: boolean,
};

const LeftSidebar = ({ isCondensed, isLight, hideLogo, hideUserProfile }: LeftSidebarProps): React$Element<any> => {
    const menuNodeRef: any = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const patientsData = store?.getPatientsReducer?.data?.patients;
    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(1);
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('Today')
    const id = searchParams.get('id');
    /**
     * Handle the click anywhere in doc
     */
    const handleOtherClick = (e: any) => {
        if (menuNodeRef && menuNodeRef.current && menuNodeRef.current.contains(e.target)) return;
        // else hide the menubar
        if (document.body) {
            document.body.classList.remove('sidebar-enable');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOtherClick, false);

        return () => {
            document.removeEventListener('mousedown', handleOtherClick, false);
        };
    }, []);

    const createPatientsResponse = store?.createPatientsReducer?.data?.status;

    useEffect(() => {
        if (location?.pathname === '/apps/patients/update-patient' || location?.pathname === '/apps/patients/new-patient' || createPatientsResponse === 201) {
            const data = {
                clinicId: clinicId,
                page: skip,
                limit: 10,
                search: search,
            }
            dispatch(getPatientsAction({ key: encryptMessage(data) }));
        }
    }, [location.pathname, dispatch, skip, search, createPatientsResponse])

    return (
        <>
            <div className={`leftside-menu ${location?.pathname === '/apps/patients/update-patient' || location?.pathname === '/apps/patients/new-patient' ? 'px-0' : ''}`} style={{ paddingTop: '53px' }} ref={menuNodeRef}>
                {/* {!hideLogo && (
                    <>
                        <Link to="/" className="logo text-center logo-light">
                            <span className="logo-lg">
                                <img src={isLight ? logoDark : logo} alt="logo" height="16" />
                            </span>
                            <span className="logo-sm">
                                <img src={isLight ? logoSm : logo} alt="logo" height="12" />
                            </span>
                        </Link>

                        <Link to="/" className="logo text-center logo-dark">
                            <span className="logo-lg">
                                <img src={isLight ? logoDark : logo} alt="logo" height="16" />
                            </span>
                            <span className="logo-sm">
                                <img src={isLight ? logoSm : logoDarkSm} alt="logo" height="16" />
                            </span>
                        </Link>
                    </>
                )} */}
                {location?.pathname === '/apps/patients/update-patient' || location?.pathname === '/apps/patients/new-patient' ?
                    <>
                        {!isCondensed && (
                            <ul style={{ listStyle: 'none' }} className='px-0'>
                                <li className='px-1 mb-1'>
                                    <FormInput type="text" onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
                                </li>
                                <li className={`px-1 mb-1 ${location.pathname === '/apps/patients/new-patient' ? 'd-none' : ''}`}>
                                    <Link to='/apps/patients/new-patient'>
                                        <Button
                                            className='border-0 w-100 d-flex align-items-center justify-content-center text-black'
                                            style={{
                                                height: '30px',
                                                backgroundColor: '#ffffff',
                                                boxShadow: 'none',
                                            }}
                                        >
                                            <IoMdAdd /> &nbsp; New Patient
                                        </Button>
                                    </Link>
                                </li>
                                <div className="btn-group px-1 d-flex justify-content-center align-items-center custom-btn-group" style={{ height: '30px' }}>
                                    <button
                                        className={`btn btn-primary ${activeTab === "Today" ? "active" : ""}`}
                                        onClick={() => setActiveTab("Today")}
                                    >
                                        Today's
                                    </button>
                                    <button
                                        className={`btn btn-primary ${activeTab === "Upcoming" ? "active" : ""}`}
                                        onClick={() => setActiveTab("Upcoming")}
                                    >
                                        Upcoming
                                    </button>
                                    <button
                                        className={`btn btn-primary ${activeTab === "History" ? "active" : ""}`}
                                        onClick={() => setActiveTab("History")}
                                    >
                                        History
                                    </button>
                                </div>
                                {store?.getPatientsReducer?.loading ?
                                    <div className='text-center my-5'>
                                        <Spinner color='white' />
                                    </div>
                                    :
                                    patientsData &&
                                    patientsData.map((data, index) => (
                                        <li
                                            key={index}
                                            className={`py-1 cursor-pointer patient-item px-1 ${id === data?._id ? 'active-patient-item' : ''}`}
                                            style={{ borderBottom: '1px solid grey' }}
                                            onClick={() => navigate(`/apps/patients/update-patient?id=${data?._id}`)}
                                        >
                                            <div className="d-flex gap-2 align-items-center">
                                                <img
                                                    height='40'
                                                    width='40'
                                                    src={data?.patientChartPhoto?.url ? data?.patientChartPhoto?.url : profileImg}
                                                    className="rounded-circle border border-black"
                                                    alt="profile image"
                                                />
                                                <div>
                                                    <p className="mb-0 text-capitalize">
                                                        {data?.title} {data?.firstName} {data?.middleName || ''} {data?.lastName}
                                                    </p>
                                                    <p className="mb-0">{data?.sex}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ul>
                        )}
                    </>
                    :
                    <>
                        {!isCondensed && (
                            <SimpleBar style={{ maxHeight: '100%' }} timeout={500} scrollbarMaxSize={320}>
                                <SideBarContent
                                    menuClickHandler={() => { }}
                                    isLight={isLight}
                                    hideUserProfile={hideUserProfile}
                                />
                            </SimpleBar>
                        )}
                        {isCondensed && <SideBarContent isLight={isLight} hideUserProfile={hideUserProfile} />}
                    </>
                }

            </div>
        </>
    );
};

LeftSidebar.defaultProps = {
    hideLogo: false,
    hideUserProfile: false,
    isLight: false,
    isCondensed: false,
};

export default LeftSidebar;
