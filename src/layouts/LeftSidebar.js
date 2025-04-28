// @flow
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import SimpleBar from 'simplebar-react';

import { getMenuItems } from '../helpers/menu';

// components
import AppMenu from './Menu';

// images
import profileImg from '../assets/images/users/avatar-1.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorsAction, getPatientsByAppointmentAction, logoutUser } from '../redux/actions';
import { encryptMessage } from '../cryptoUtils';
import Spinner from '../constants/Spinner';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { IoMdAdd } from 'react-icons/io';
import logo from '../assets/images/logo.png';
import logo_sm from '../assets/images/logo_sm.png';

type SideBarContentProps = {
    hideUserProfile: boolean,
};

/* sidebar content */
const SideBarContent = ({ hideUserProfile, isCondensed }: SideBarContentProps) => {
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
            <AppMenu menuItems={getMenuItems()} isCondensed={isCondensed} />


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

const LeftSidebar = ({ isCondensed, isLight, hideUserProfile }: LeftSidebarProps): React$Element<any> => {
    const menuNodeRef: any = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const patientsData = store?.getPatientsByAppointmentReducer?.data?.appointments;
    console.log(patientsData, 'patientsDatapatientsDatapatientsData')
    const [search, setSearch] = useState('');
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('Today')
    // const [filter, setFilter] = useState(false);
    const [doctorSearch, setDoctorSearch] = useState('')

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
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const appointmentDetails = [];
    const [activeFilter, setActiveFilter] = useState("Doctors"); // Track active menu
    const [selectedDoctor, setSelectedDoctor] = useState(null); // Store selected doctor ID
    const [selectedAppointment, setSelectedAppointment] = useState(null); // Store selected appointment ID
    const filterDropdownRef = useRef(null);
    // Handle selection (only one at a time)
    const handleSelectDoctor = (id) => setSelectedDoctor(id);
    const handleSelectAppointment = (id) => setSelectedAppointment(id);

    const [showFilterDropDown, setShowFilterDropDown] = useState(false);

    const togglePriorityDropdown = () => {
        setShowFilterDropDown(!showFilterDropDown);
    };

    useEffect(() => {
        if (location?.pathname === '/apps/patients/update-patient' || location?.pathname === '/apps/patients/new-patient' || createPatientsResponse === 201) {
            const payload = {
                doctorId: selectedDoctor || '',
                clinicId: clinicId,
                status: activeTab,
                search: search
            }
            dispatch(getPatientsByAppointmentAction({ key: encryptMessage(payload) }))
        }
    }, [location.pathname, dispatch, search, createPatientsResponse, selectedDoctor, activeTab])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target))
            ) {
                setShowFilterDropDown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const SideBarContentDown = ({ hideUserProfile }: SideBarContentProps) => {

        const MENU_ITEMS_END = [
            {
                label: 'Tasks',
                icon: "mdi-sticker-plus-outline",
                redirectTo: "#",
                url: "/dashboard/account",
            },
            {
                label: 'Help & Support',
                icon: "mdi-help-circle-outline",
                redirectTo: "#",
            },
            {
                label: 'Billing',
                icon: "mdi-cash-fast",
                redirectTo: "#",
            },
            {
                key: 'logout',
                label: 'Logout',
                icon: 'mdi-logout',
                // url: '/apps/logout/logout-model',
            },
        ];
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const [show, setShow] = useState(false)
        const handleCheckLogout = (data) => {
            if (data === 'Logout') {
                setShow(true);
            }
        }

        const handleLogout = () => {
            dispatch(logoutUser())
            navigate('account/logout')
            // api.setLoggedInUser(null);
            // setAuthorization(null);
        }
        const closeModal = () => {
            setShow(false); // just close the modal, no reload
        };
        return (
            <>
                {MENU_ITEMS_END.map((ele, index) => {
                    const isLogout = ele.label === 'Logout';

                    return (
                        <div className='' key={index}>
                            {isCondensed ? (
                                <button
                                    onClick={() => isLogout ? handleCheckLogout(ele.label) : navigate(ele.redirectTo)}
                                    className="px-3 py-2 w-100 d-flex justify-content-center align-items-center bg-transparent border-0"
                                >
                                    <span
                                        className={`${ele.icon?.startsWith('mdi') ? 'mdi' : ''} ${ele.icon} mdi-18px textLeftSidebar`}
                                    ></span>
                                </button>
                            ) : (
                                <div className="info-color px-2 py-1 align-items-center">
                                    <button
                                        data-toggle={ele.label === 'Tasks' || ele.label === 'Billing' || ele.label === 'Help & Support' ? "tooltip" : ''} data-placement="top" title={ele.label === 'Tasks' || ele.label === 'Billing' || ele.label === 'Help & Support' ? "In Progress" : ''}
                                        onClick={() => isLogout ? handleCheckLogout(ele.label) : navigate(ele.redirectTo)}
                                        className="px-2 textLeftSidebar bg-transparent border-0"
                                    >
                                        <span className={`mdi ${ele.icon} mdi-18px px-1 iconsLeftSidebar`}></span>
                                        <span className="px-2 sidebar_listItems notranslate">{ele.label}</span>
                                    </button>

                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Modal should be outside the loop */}
                <Modal centered show={show} onHide={closeModal}>
                    <Modal.Body>
                        <div className="p-4" style={{ maxWidth: '500px', width: '100%' }}>
                            <div className="card-body text-center">
                                <h4 className="card-title">Are you sure you want to logout!</h4>
                                <div className="d-flex justify-content-center gap-3">
                                    <Button className="cancel-button" onClick={closeModal}>
                                        Cancel
                                    </Button>
                                    <Button type="button" className="custom-buttons" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        );

    };
    const renderFilterList = () => {
        if (activeFilter === "Doctors") {
            return (
                <>
                    <div className="position-relative mb-2">

                        {/* <BiSearch className="position-absolute top-50 start-0 translate-middle-y ms-2 text-secondary" /> */}
                        <input
                            type="text"
                            placeholder="Search doctors..."
                            className="ps-4 form-control"
                            onChange={(e) => setDoctorSearch(e.target.value)}
                            style={{ borderRadius: "20px", border: "1px solid #ccc" }}
                        />
                    </div>
                    <div className='scroll-container' style={{ height: "15rem", overflow: 'scroll' }}>
                        {store?.getDoctorsReducer?.loading ?
                            <div className='d-flex justify-content-center align-items-center'>
                                <Spinner />
                            </div>
                            :
                            <ul className="list-unstyled">
                                {doctorDetails?.length ? (
                                    doctorDetails.map((data) => (
                                        <li
                                            key={data?._id}
                                            className={`py-2  rounded ${selectedDoctor === data?._id ? "bg-primary text-white" : "hover-effect"
                                                }`}
                                            style={{ cursor: "pointer", transition: "0.3s" }}
                                            onClick={() => handleSelectDoctor(data?._id)}
                                        >
                                            {data?.userDetails?.firstName} {data?.userDetails?.lastName}
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-muted">No doctors found</p>
                                )}
                            </ul>
                        }
                    </div>


                </>
            );
        } else if (activeFilter === "Appointments") {
            return (
                <div className='scroll-container' style={{ height: "15rem", overflow: 'scroll' }}>
                    <ul className="list-unstyled">
                        {appointmentDetails?.length ? (
                            appointmentDetails.map((data) => (
                                <li
                                    key={data?._id}
                                    className={`py-2 px-3 rounded ${selectedAppointment === data?._id ? "bg-primary text-white" : "hover-effect"
                                        }`}
                                    style={{ cursor: "pointer", transition: "0.3s" }}
                                    onClick={() => handleSelectAppointment(data?._id)}
                                >
                                    {data?.appointmentType}
                                </li>
                            ))
                        ) : (
                            <p className="text-muted">No appointments found</p>
                        )}
                    </ul>
                </div>
            );
        }
    };

    const getAppointments = () => {
        if (selectedDoctor) {
            const payload = {
                doctorId: selectedDoctor,
                clinicId: clinicId,
                status: activeTab,
                search: search
            }
            dispatch(getPatientsByAppointmentAction({ key: encryptMessage(payload) }))
        }
    }
    const currentYear = new Date().getFullYear();

    return (
        <>
            <div className={`leftside-menu ${location?.pathname === '/apps/patients/update-patient' || location?.pathname === '/apps/patients/new-patient' ? 'px-0' : ''}`} ref={menuNodeRef}>
                {location?.pathname === '/apps/patients/update-patient' || location?.pathname === '/apps/patients/new-patient' ?
                    <>
                        {!isCondensed ?
                            <ul style={{ listStyle: 'none' }} className='px-0'>
                                <li className='text-center py-3' >
                                    <img src={logo} alt="" height="25" />
                                </li>
                                <li className='px-1 mb-1 d-flex gap-1 align-items-center'>
                                    <input type="text" className='form-control' onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
                                    <Button className='custom-buttons' onClick={togglePriorityDropdown} ><i className="bi bi-filter"></i></Button>
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
                                <div className="px-1 mb-1 btn-group d-flex justify-content-center align-items-center custom-btn-group" style={{ height: '30px' }}>
                                    <button
                                        className={`btn  ${activeTab === "Today" ? "active btn-light text-black" : "btn-transparent text-white"}`}
                                        onClick={() => setActiveTab("Today")}
                                        style={{ border: '1px solid white', boxShadow: 'none' }}
                                    >
                                        Today's
                                    </button>
                                    <button
                                        className={`btn ${activeTab === "Upcoming" ? "active text-black btn-light" : "btn-transparent text-white"}`}
                                        onClick={() => setActiveTab("Upcoming")}
                                        style={{ border: '1px solid white', boxShadow: 'none' }}
                                    >
                                        Upcoming
                                    </button>
                                    <button
                                        className={`btn ${activeTab === "History" ? "active text-black btn-light" : "btn-transparent text-white"}`}
                                        onClick={() => setActiveTab("History")}
                                        style={{ border: '1px solid white', boxShadow: 'none' }}
                                    >
                                        History
                                    </button>
                                </div>
                                <div className={`text-end text-white me-1 ${selectedDoctor ? '' : 'd-none'}`}>
                                    <u className='cursor-pointer' onClick={() => setSelectedDoctor(null)}>Clear filters</u>
                                </div>
                                {store?.getPatientsByAppointmentReducer?.loading ?
                                    <div className='text-center my-5'>
                                        <Spinner color='white' />
                                    </div>
                                    :
                                    patientsData?.length === 0 ?
                                        <li className='text-white text-center py-5'>
                                            No Appointments Found
                                        </li>
                                        :
                                        patientsData &&
                                        patientsData?.map((data, index) => (
                                            <li
                                                key={index}
                                                className={`py-1 cursor-pointer patient-item px-1 d-flex justify-content-between`}
                                                style={{ borderBottom: '1px solid rgb(127 123 123 / 67%)' }}
                                                onClick={() => navigate(`/apps/patients/update-patient?id=${data?.patient?._id}`)}
                                            >
                                                <div className="d-flex gap-2 align-items-center">
                                                    <img
                                                        height='40'
                                                        width='40'
                                                        src={data?.photo?.[0]?.url ? data?.photo?.[0]?.url : profileImg}
                                                        // style={{ height: '5vh' }}
                                                        className="rounded-circle border border-black"
                                                        alt="profile image"
                                                    />
                                                    <div>
                                                        <p className="mb-0 text-capitalize" style={{ fontSize: '12px' }}>
                                                            {data?.patient?.firstName} {data?.patient?.lastName}

                                                        </p>
                                                        <p className="mb-0 " style={{ fontSize: '10px' }}>{data?.doctor?.userId?.firstName}{data?.doctor?.userId?.lastName}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div>
                                                        <p className='mb-0' style={{ fontSize: '10px' }}><span>{new Date(data?.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}</span>&nbsp;&nbsp;
                                                            <span>{new Date(`1970-01-01T${data?.startTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className='mb-0 text-end pt-1' style={{ fontSize: '10px' }}>{data?.profile}</p>
                                                    </div>

                                                </div>
                                            </li>
                                        ))
                                }

                                {showFilterDropDown && (
                                    <div
                                        ref={filterDropdownRef}
                                        className="position-absolute bg-white border p-1 rounded shadow-sm"
                                        style={{ top: "15vh", left: "15vw", zIndex: 1002, width: '500px' }}
                                    >
                                        <Row className=" pb-2 ">
                                            <Col sm={12} className="text-end">
                                            </Col>
                                            <Col sm={12} className=''>
                                                <h4 className="mb-0 text-center fw-bold">Filter Patients</h4>
                                            </Col>

                                        </Row>

                                        <Row className="">
                                            <Col md={4} className="">
                                                <ul className="list-unstyled ps-3">
                                                    <li
                                                        className={`py-2 fw-bold ${activeFilter === "Doctors" ? "text-primary" : "text-dark"}`}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => setActiveFilter("Doctors")}
                                                    >
                                                        Doctors
                                                    </li>
                                                    <li
                                                        className={`py-2 fw-bold ${activeFilter === "Appointments" ? "text-primary" : "text-dark"}`}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => {
                                                            setActiveFilter("Appointments");
                                                            setDoctorSearch('')
                                                        }}
                                                    >
                                                        Appointments
                                                    </li>
                                                </ul>
                                            </Col>

                                            <Col md={8} className='pt-2' >{renderFilterList()}</Col>
                                        </Row>

                                        <Row className=" ">
                                            <Col className="d-flex mb-1 justify-content-end">
                                                <Button variant="primary" className='custom-buttons' onClick={() => {
                                                    getAppointments()
                                                }}>
                                                    Apply
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                )}
                            </ul>
                            :
                            // small side bar
                            <ul style={{ listStyle: 'none' }} className='px-0 '>
                                <li className='text-center py-3' >
                                    <img src={logo_sm} alt="" height="30" />
                                </li>
                                <div className={`text-end text-white me-1 ${selectedDoctor ? '' : 'd-none'}`}>
                                    <u className='cursor-pointer' onClick={() => setSelectedDoctor(null)}>Clear filters</u>
                                </div>
                                {store?.getPatientsByAppointmentReducer?.loading ?
                                    <div className='text-center my-5'>
                                        <Spinner color='white' />
                                    </div>
                                    :
                                    patientsData?.length === 0 ?
                                        <li className='text-white text-center py-5'>
                                            No Appointments Found
                                        </li>
                                        :
                                        patientsData &&
                                        patientsData?.map((data, index) => (
                                            <li
                                                key={index}
                                                className={`py-1 cursor-pointer patient-item px-1 d-flex justify-content-between`}
                                                style={{ borderBottom: '1px solid rgb(127 123 123 / 67%)' }}
                                                onClick={() => navigate(`/apps/patients/update-patient?id=${data?.patient?._id}`)}
                                            >
                                                <div className="text-center">
                                                    <img
                                                        height='40'
                                                        width='40'
                                                        src={data?.patient?.patientChartPhoto?.url ? data?.patient?.patientChartPhoto?.url : profileImg}
                                                        // style={{ height: '5vh' }}
                                                        className="rounded-circle border border-black"
                                                        alt="profile image"
                                                    />
                                                    <div>
                                                        <p className="mb-0 mt-1 text-capitalize" style={{ fontSize: '12px' }}>
                                                            {data?.patient?.firstName}

                                                        </p>
                                                        <p className="mb-0 " style={{ fontSize: '10px' }}>Dr.{data?.doctor?.userId?.firstName} </p>
                                                    </div>
                                                </div>

                                            </li>
                                        ))
                                }

                                {showFilterDropDown && (
                                    <div
                                        ref={filterDropdownRef}
                                        className="position-absolute bg-white border p-1 rounded shadow-sm"
                                        style={{ top: "15vh", left: "15vw", zIndex: 1002, width: '500px' }}
                                    >
                                        <Row className=" pb-2 ">
                                            <Col sm={12} className="text-end">
                                            </Col>
                                            <Col sm={12} className=''>
                                                <h4 className="mb-0 text-center fw-bold">Filter Patients</h4>
                                            </Col>

                                        </Row>

                                        <Row className="">
                                            <Col md={4} className="">
                                                <ul className="list-unstyled ps-3">
                                                    <li
                                                        className={`py-2 fw-bold ${activeFilter === "Doctors" ? "text-primary" : "text-dark"}`}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => setActiveFilter("Doctors")}
                                                    >
                                                        Doctors
                                                    </li>
                                                    <li
                                                        className={`py-2 fw-bold ${activeFilter === "Appointments" ? "text-primary" : "text-dark"}`}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => {
                                                            setActiveFilter("Appointments");
                                                            setDoctorSearch('')
                                                        }}
                                                    >
                                                        Appointments
                                                    </li>
                                                </ul>
                                            </Col>

                                            <Col md={8} className='pt-2' >{renderFilterList()}</Col>
                                        </Row>

                                        <Row className=" ">
                                            <Col className="d-flex mb-1 justify-content-end">
                                                <Button variant="primary" className='custom-buttons' onClick={() => {
                                                    getAppointments()
                                                }}>
                                                    Apply
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                )}
                            </ul>
                        }
                    </>
                    :
                    // <>
                    //     {!isCondensed && (
                    //         <SimpleBar style={{ maxHeight: '100%' }} timeout={500} scrollbarMaxSize={320}>
                    //             <SideBarContent
                    //                 menuClickHandler={() => { }}
                    //                 isLight={isLight}
                    //                 hideUserProfile={hideUserProfile}
                    //                 isCondensed={isCondensed}
                    //             />
                    //         </SimpleBar>
                    //     )}
                    //     {isCondensed && <SideBarContent isLight={isLight} hideUserProfile={hideUserProfile} />}
                    // </>
                    <div className="parentLeftSidebar mb-3">
                        <div className="media_mob scroll-container">
                            {!isCondensed && (
                                <SimpleBar timeout={500} scrollbarMaxSize={320}>
                                    <SideBarContent
                                        data-aos="fade-down"
                                        menuClickHandler={() => { }}
                                        isLight={isLight}
                                        hideUserProfile={hideUserProfile}
                                    />
                                </SimpleBar>
                            )}
                            {isCondensed && (
                                <SideBarContent
                                    isLight={isLight}
                                    hideUserProfile={hideUserProfile}
                                />
                            )}
                        </div>
                        <div className='lowerMenu scroll-container pb-3'>
                            {!isCondensed && (
                                <SimpleBar className='d' timeout={500} scrollbarMaxSize={320}>
                                    {!isCondensed && <div className="leftSideBarLine"></div>}
                                    <SideBarContentDown
                                        data-aos="fade-down"
                                        menuClickHandler={() => { }}
                                        isLight={isLight}
                                        hideUserProfile={hideUserProfile}
                                    />
                                    {/* <span style={{ marginLeft: "33px", fontFamily: "Nunito", fontWeight: 700 }}>
                                        {!isCondensed && (
                                            <div className="sf-footer ms-3">
                                                &copy; {currentYear} - {metadata.buildMajor}.{metadata.buildMinor}
                                                .{metadata.buildRevision} {metadata.buildTag}asdkmasd
                                            </div>
                                        )}
                                    </span> */}
                                </SimpleBar>
                            )}
                            {isCondensed && (
                                <SideBarContentDown
                                    isLight={isLight}
                                    hideUserProfile={hideUserProfile}
                                />
                            )}
                        </div>
                    </div>

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
