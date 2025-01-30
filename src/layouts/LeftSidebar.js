// @flow
import React, { useEffect, useRef, useState } from 'react';
import { Form, Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import classNames from 'classnames';

import { getMenuItems } from '../helpers/menu';
import { BiSearch } from "react-icons/bi";

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
import { getDoctorsAction, getPatientsAction, getPatientsByAppointmentAction } from '../redux/actions';
import { encryptMessage } from '../cryptoUtils';
import { FormInput } from '../components';
import Spinner from '../constants/Spinner';
import { Button, Col, Dropdown, Modal, Row } from 'react-bootstrap';
import { IoMdAdd, IoMdClose } from 'react-icons/io';

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
    const patientsData = store?.getPatientsByAppointmentReducer?.data?.appointments;
    console.log(store?.getPatientsByAppointmentReducer?.data?.appointments, 'store?.getPatientsByAppointmentReducer?.data')
    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(1);
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('Today')
    const [filter, setFilter] = useState(false);
    const [doctorSearch, setDoctorSearch] = useState('')

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
    const doctorDetails = store?.getDoctorsReducer?.data?.response;
    const appointmentDetails = [];
    const [activeFilter, setActiveFilter] = useState("Doctors"); // Track active menu
    const [selectedDoctor, setSelectedDoctor] = useState(null); // Store selected doctor ID
    const [selectedAppointment, setSelectedAppointment] = useState(null); // Store selected appointment ID

    // Handle selection (only one at a time)
    const handleSelectDoctor = (id) => setSelectedDoctor(id);
    const handleSelectAppointment = (id) => setSelectedAppointment(id);

    useEffect(() => {
        if (location?.pathname === '/apps/patients/update-patient' || location?.pathname === '/apps/patients/new-patient' || createPatientsResponse === 201) {
            const payload = {
                doctorId: selectedDoctor || '',
                clinicId: clinicId,
                status: activeTab,
                search: search
            }
            dispatch(getPatientsByAppointmentAction({ key: encryptMessage(payload) }))
            console.log({ payload })
        }
    }, [location.pathname, dispatch, search, createPatientsResponse, selectedDoctor, activeTab])
    useEffect(() => {
        const payload = { status: true, search: doctorSearch }
        dispatch(getDoctorsAction({ key: encryptMessage(payload) }));
    }, [dispatch, doctorSearch])

    const closeModal = () => {
        setFilter(false);
    }


    // Render the correct filter list based on active category
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
                                            className={`py-2 px-3 rounded ${selectedDoctor === data?._id ? "bg-primary text-white" : "hover-effect"
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
        closeModal();
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
    return (
        <>
            <div className={`leftside-menu ${location?.pathname === '/apps/patients/update-patient' || location?.pathname === '/apps/patients/new-patient' ? 'px-0' : ''}`} style={{ paddingTop: '60px' }} ref={menuNodeRef}>
                {location?.pathname === '/apps/patients/update-patient' || location?.pathname === '/apps/patients/new-patient' ?
                    <>
                        {!isCondensed && (
                            <ul style={{ listStyle: 'none' }} className='px-0'>
                                <li className='px-1 mb-1 d-flex gap-1 align-items-center'>
                                    <input type="text" className='form-control' onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
                                    <Button className='custom-buttons' onClick={() => setFilter(true)}><i class="bi bi-filter"></i></Button>
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
                                {store?.getPatientsReducer?.loading ?
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
                                        patientsData?.map((item, index) => (
                                            <li
                                                key={index}
                                                className={`py-1 cursor-pointer patient-item px-1 ${id === item?.patient?._id ? 'active-patient-item' : ''}`}
                                                style={{ borderBottom: '1px solid grey' }}
                                                onClick={() => navigate(`/apps/patients/update-patient?id=${item?.patient?._id}`)}
                                            >
                                                <div className="d-flex flex-row justify-content-start align-items-center">

                                                    <div className='col-8 d-flex flex-row'>
                                                        <div className='ms-1'> <img
                                                            height='40'
                                                            width='40'
                                                            src={item?.patient?.patientChartPhoto?.url ? item?.patient?.patientChartPhoto?.url : profileImg}
                                                            className="rounded-circle border border-black"
                                                            alt="profile image"
                                                        /></div>
                                                        <div className='ms-2'><p className="mb-0 text-capitalize" style={{ fontSize: "10px" }}>
                                                            {item?.title} {item?.patient?.firstName} {item?.patient?.middleName || ''} {item?.patient?.lastName}
                                                        </p>
                                                            <p className="mb-0 text-capitalize" style={{ fontSize: "10px" }}>
                                                                {item?.title} {item?.doctor?.userId?.firstName} {item?.doctor?.userId?.middleName || ''} {item?.doctor?.uerId?.lastName}
                                                            </p>
                                                            </div>

                                                    </div>
                                                    <div className=''>

                                                        <p className="mb-0" style={{ fontSize: '10px' }}>
                                                            {new Date(item?.date).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            })}
                                                        </p>
                                                        <p style={{ fontSize: '10px' }}>{item?.reason}</p>
                                                    </div>

                                                </div>
                                            </li>

                                        ))
                                }
                                <Modal centered size="lg" show={filter} onHide={closeModal}>
                                    <Modal.Body className="p-4">
                                        {/* Header */}

                                        <Row className="border-bottom pb-2 ">
                                            <Col sm={12} className="text-end">
                                                <IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} />
                                            </Col>
                                            <Col sm={12}>
                                                <h4 className="mb-0 text-center fw-bold">Filter Patients</h4>
                                            </Col>

                                        </Row>

                                        {/* Main Content */}
                                        <Row className="">
                                            {/* Sidebar: Filter Categories */}
                                            <Col md={4} className="border-end">
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

                                            {/* Filter Selection */}
                                            <Col md={8} className='pt-2' >{renderFilterList()}</Col>
                                        </Row>

                                        <Row className=" border-top">
                                            <Col className="d-flex mt-3 justify-content-end">
                                                <Button variant="primary" className='custom-buttons' onClick={() => {
                                                    getAppointments()
                                                }}>
                                                    Apply
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Modal.Body>
                                </Modal>
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
