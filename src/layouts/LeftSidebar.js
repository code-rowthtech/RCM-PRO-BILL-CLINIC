// @flow
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import SimpleBar from 'simplebar-react';

import { getMenuItems } from '../helpers/menu';

// components
import AppMenu from './Menu';

// images
import dummyProfile from '../assets/images/dummyProfile.png';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorsAction, getPatientsByAppointmentAction, logoutUser } from '../redux/actions';
import { decryptMessage, encryptMessage } from '../cryptoUtils';
import Spinner from '../constants/Spinner';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { IoMdAdd } from 'react-icons/io';
import logo from '../assets/images/logo.png';
import logo_sm from '../assets/images/logo_sm.png';
import { FaChevronDown } from 'react-icons/fa6';
import metadata from '../metadata.json';

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
                        <img src={dummyProfile} alt="" height="42" className="rounded-circle shadow-sm" />
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
    hideLogo?: boolean,
    hideUserProfile?: boolean,
    isLight?: boolean,
    isCondensed?: boolean,
};

const LeftSidebar = ({
    isCondensed = false,
    isLight = false,
    hideUserProfile = false,
    hideLogo = false,
}: LeftSidebarProps = {}): React$Element<any> => {
    const menuNodeRef: any = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const appointmentsData = store?.getPatientsByAppointmentReducer?.data?.appointments;
    const statusColors = {
        pending: '#f1c40f', // Yellow
        proposed: '#3498db', // Blue
        booked: '#2ecc71', // Green
        arrived: '#27ae60', // Dark Green
        fulfilled: '#9b59b6', // Purple
        cancelled: '#e74c3c', // Red
        noshow: '#e67e22', // Oranges
        enteredinerror: '#95a5a6', // Grey
        checkedin: '#1abc9c', // Teal
        waitlist: '#8e44ad', // Dark Purple
    };
    const [search, setSearch] = useState('');
    // const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const clinicId = decryptMessage(localStorage?.getItem('subClinicLocation'));
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('Today');
    // const [filter, setFilter] = useState(false);
    const [doctorSearch, setDoctorSearch] = useState('');

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
    const [activeFilter, setActiveFilter] = useState('Doctors'); // Track active menu
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
        if (
            location?.pathname === '/apps/patients/update-patient' ||
            location?.pathname === '/apps/patients/new-patient' ||
            createPatientsResponse === 201
        ) {
            const payload = {
                doctorId: selectedDoctor || '',
                clinicId: clinicId,
                status: activeTab,
                search: search,
                todayStart: new Date(new Date().setHours(0, 0, 0, 0)),
                todayEnd: new Date(new Date().setHours(23, 59, 59, 999))
            };
            dispatch(getPatientsByAppointmentAction({ key: encryptMessage(payload) }));
            if (!doctorDetails) {
                dispatch(getDoctorsAction({ status: true, search: '', page: 1, limit: 20 }));
            }
        }
    }, [location.pathname, dispatch, search, createPatientsResponse, selectedDoctor, activeTab]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
                setShowFilterDropDown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const SideBarContentDown = ({ hideUserProfile }: SideBarContentProps) => {
        const MENU_ITEMS_END = [
            {
                key: 'logout',
                label: 'Logout',
                icon: 'mdi-logout',
            },
            {
                key: 'build',
                label: `${currentYear}-${metadata?.buildMajor || '0'}.${metadata?.buildMinor || '0'}.${metadata?.buildRevision || '0'}${metadata?.buildTag ? ' ' + metadata.buildTag : ''}`,
            },
        ];
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const [show, setShow] = useState(false);
        const handleCheckLogout = (data) => {
            if (data === 'Logout') {
                setShow(true);
            }
        };

        const handleLogout = () => {
            dispatch(logoutUser());
            navigate('account/logout');
        };
        const closeModal = () => {
            setShow(false); // just close the modal, no reload
        };
        return (
            <>
                {MENU_ITEMS_END.map((ele, index) => {
                    const isLogout = ele.label === 'Logout';
                    return (
                        <div className="" key={index}>
                            {isCondensed ? (
                                <button
                                    onClick={() => (isLogout ? handleCheckLogout(ele.label) : navigate(ele.redirectTo))}
                                    className="px-3 py-2 w-100 d-flex justify-content-center align-items-center bg-transparent border-0">
                                    <span
                                        className={`${ele.icon?.startsWith('mdi') ? 'mdi' : ''} ${ele.icon} mdi-18px textLeftSidebar mt-5`}></span>
                                </button>
                            ) : (
                                <div className="info-color px-2 py-1 align-items-center">
                                    <button
                                        onClick={() =>
                                            isLogout ? handleCheckLogout(ele.label) : navigate(ele.redirectTo)
                                        }
                                        className="px-2 textLeftSidebar bg-transparent border-0">
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
                                <div className="d-flex justify-content-center gap-3 mt-3">
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
        if (activeFilter === 'Doctors') {
            return (
                <>
                    <div className="position-relative mb-2">
                        <input
                            type="text"
                            placeholder="Search doctors..."
                            className="ps-4 form-control"
                            onChange={(e) => setDoctorSearch(e.target.value)}
                            style={{ borderRadius: '20px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div className="scroll-container" style={{ height: '15rem', overflow: 'scroll' }}>
                        {store?.getDoctorsReducer?.loading ? (
                            <div className="d-flex justify-content-center align-items-center">
                                <Spinner />
                            </div>
                        ) : (
                            <ul className="list-unstyled">
                                {doctorDetails?.length ? (
                                    doctorDetails.map((data) => (
                                        <li
                                            key={data?._id}
                                            className={`py-2  rounded ${selectedDoctor === data?._id ? 'bg-primary text-white' : 'hover-effect'
                                                }`}
                                            style={{ cursor: 'pointer', transition: '0.3s' }}
                                            onClick={() => handleSelectDoctor(data?._id)}>
                                            {data?.userDetails?.firstName} {data?.userDetails?.lastName}
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-muted">No doctors found</p>
                                )}
                            </ul>
                        )}
                    </div>
                </>
            );
        } else if (activeFilter === 'Appointments') {
            return (
                <div className="scroll-container" style={{ height: '15rem', overflow: 'scroll' }}>
                    <ul className="list-unstyled">
                        {appointmentDetails?.length ? (
                            appointmentDetails.map((data) => (
                                <li
                                    key={data?._id}
                                    className={`py-2 px-3 rounded ${selectedAppointment === data?._id ? 'bg-primary text-white' : 'hover-effect'
                                        }`}
                                    style={{ cursor: 'pointer', transition: '0.3s' }}
                                    onClick={() => handleSelectAppointment(data?._id)}>
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
                search: search,
            };
            dispatch(getPatientsByAppointmentAction({ key: encryptMessage(payload) }));
        }
    };

    const patientId = searchParams.get('id');
    const groupAppointmentsByPatient = (appointments) => {
        const grouped = {};
        appointments?.forEach((appointment) => {
            const patientId = appointment?.subject?._id;
            if (!grouped[patientId]) {
                grouped[patientId] = {
                    patientInfo: appointment?.subject,
                    appointments: [],
                };
            }
            grouped[patientId].appointments.push(appointment);
        });
        return Object.values(grouped);
    };
    const currentYear = new Date().getFullYear();

    return (
        <>
            <div
                className={`leftside-menu ${location?.pathname === '/apps/patients/update-patient' || location?.pathname === '/apps/patients/new-patient' ? 'px-0' : ''}`}
                ref={menuNodeRef}>
                {location?.pathname === '/apps/patients/update-patient' ||
                    location?.pathname === '/apps/patients/new-patient' ? (
                    <>
                        {!isCondensed ? (
                            <ul style={{ listStyle: 'none' }} className="px-0">
                                <li className="text-center  py-3 ">
                                    <img
                                        onClick={() => navigate('/apps/patients/list')}
                                        className="cursor-pointer"
                                        src={logo}
                                        alt=""
                                        height="25"
                                    />
                                </li>
                                <li className="px-1 mb-1 d-flex gap-1 align-items-center">
                                    <Form.Select
                                        className="text-capitalize"
                                        value={selectedDoctor || ""}
                                        onChange={(e) => setSelectedDoctor(e.target.value)}>
                                        <option value="" key="">
                                            All Providers
                                        </option>
                                        {doctorDetails?.map((data, index) => (
                                            <option className="text-capitalize" value={data?._id} key={index}>
                                                {data?.name?.[0]?.text}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </li>
                                <li
                                    className={`px-1 mb-1 ${location.pathname === '/apps/patients/new-patient' ? 'd-none' : ''}`}>
                                    <Link to="/apps/patients/new-patient">
                                        <Button
                                            className="border-0 w-100 d-flex align-items-center justify-content-center text-black"
                                            style={{
                                                height: '30px',
                                                backgroundColor: '#ffffff',
                                                boxShadow: 'none',
                                            }}>
                                            <IoMdAdd /> &nbsp; New Patient
                                        </Button>
                                    </Link>
                                </li>
                                <div
                                    className="px-1 mb-1 btn-group d-flex justify-content-center align-items-center custom-btn-group"
                                    style={{ height: '30px' }}>
                                    <button
                                        className={`btn  ${activeTab === 'Today' ? 'active btn-light text-black' : 'btn-transparent text-white'}`}
                                        onClick={() => setActiveTab('Today')}
                                        style={{ border: '1px solid white', boxShadow: 'none' }}>
                                        Today's
                                    </button>
                                    <button
                                        className={`btn ${activeTab === 'Upcoming' ? 'active text-black btn-light' : 'btn-transparent text-white'}`}
                                        onClick={() => setActiveTab('Upcoming')}
                                        style={{ border: '1px solid white', boxShadow: 'none' }}>
                                        Upcoming
                                    </button>
                                    <button
                                        className={`btn ${activeTab === 'History' ? 'active text-black btn-light' : 'btn-transparent text-white'}`}
                                        onClick={() => setActiveTab('History')}
                                        style={{ border: '1px solid white', boxShadow: 'none' }}>
                                        History
                                    </button>
                                </div>
                                <div className={`text-end text-white me-1 ${selectedDoctor ? '' : 'd-none'}`}>
                                    <u className="cursor-pointer" onClick={() => setSelectedDoctor(null)}>
                                        Clear filters
                                    </u>
                                </div>

                                <ul className="px-0 scroll-container" style={{ height: '76vh', overflow: 'scroll' }}>
                                    {store?.getPatientsByAppointmentReducer?.loading ? (
                                        <div className="text-center my-5">
                                            <Spinner color="white" />
                                        </div>
                                    ) : appointmentsData?.length === 0 ? (
                                        <li className="text-white text-center py-5">No Appointments Found</li>
                                    ) : activeTab === 'Upcoming' || activeTab === 'History' ? (
                                        groupAppointmentsByPatient(appointmentsData)?.map((patientGroup, index) => (
                                            <li key={index} className="mb-2">
                                                <div
                                                    className="py-1 cursor-pointer patient-item px-1 d-flex justify-content-between align-items-center bg-dark text-white"
                                                    style={{ borderBottom: '1px solid rgb(127 123 123 / 67%)' }}>
                                                    <div
                                                        onClick={() =>
                                                            navigate(
                                                                `/apps/patients/update-patient?id=${patientGroup?.patientInfo?._id}`
                                                            )
                                                        }
                                                        className="d-flex gap-2 align-items-center">
                                                        <img
                                                            height="35"
                                                            width="35"
                                                            src={
                                                                patientGroup.patientInfo?.photo?.[0]?.url ||
                                                                dummyProfile
                                                            }
                                                            className="rounded-circle border border-black object-fit-cover"
                                                            alt="profile image"
                                                        />
                                                        <p
                                                            className="mb-0 text-capitalize"
                                                            style={{ fontSize: '12px' }}>
                                                            {
                                                                patientGroup.patientInfo?.name?.find(
                                                                    (ele) => ele?.use === 'official'
                                                                )?.text
                                                            }
                                                        </p>
                                                    </div>
                                                    <span
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#collapse-${index}`}
                                                        aria-expanded="false"
                                                        aria-controls={`collapse-${index}`}
                                                        className="fs-6 pe-2">
                                                        <FaChevronDown />
                                                    </span>
                                                </div>

                                                <ul id={`collapse-${index}`} className="collapse px-2">
                                                    {patientGroup?.appointments?.map((appointment, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="py-1 cursor-pointer d-flex justify-content-between align-items-start text-white border-bottom"
                                                            style={{
                                                                fontSize: '12px',
                                                                borderColor: 'rgb(127 123 123 / 40%)',
                                                            }}
                                                            onClick={() =>
                                                                navigate(
                                                                    `/apps/appointments/newAppointment?updateid=${appointment?._id}`
                                                                )
                                                            }>
                                                            <div>
                                                                <p className="mb-0">
                                                                    {appointment?.start
                                                                        ? new Date(appointment?.start)
                                                                            ?.toISOString()
                                                                            ?.split('T')[0]
                                                                        : ''}
                                                                    <br />(
                                                                    {new Date(appointment?.start).toLocaleString(
                                                                        'en-US',
                                                                        {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                            hour12: true,
                                                                        }
                                                                    ) +
                                                                        '-' +
                                                                        new Date(appointment?.end).toLocaleString(
                                                                            'en-US',
                                                                            {
                                                                                hour: '2-digit',
                                                                                minute: '2-digit',
                                                                                hour12: true,
                                                                            }
                                                                        )}
                                                                    )
                                                                </p>{' '}
                                                                <p className="mb-0">
                                                                    {appointment?.reason?.[0]?.coding?.[0]?.display}
                                                                </p>
                                                            </div>{' '}
                                                            <h6
                                                                className="text-capitalize fw-semibold"
                                                                style={{ color: statusColors[appointment?.status] }}>
                                                                {appointment?.status}
                                                            </h6>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))
                                    ) : (
                                        appointmentsData?.map((data, index) => (
                                            <li
                                                key={index}
                                                className={`py-1 cursor-pointer patient-item px-1 d-flex justify-content-between ${data?.subject?._id === patientId ? 'bg-secondary text-white' : ''}`}
                                                style={{ borderBottom: '1px solid rgb(127 123 123 / 67%)' }}
                                                onClick={() =>
                                                    navigate(`/apps/patients/update-patient?id=${data?.subject?._id}`)
                                                }>
                                                <div className="d-flex gap-2 align-items-center">
                                                    <img
                                                        height="35"
                                                        width="35"
                                                        src={data?.subject?.photo?.[0]?.url || dummyProfile}
                                                        className="rounded-circle border border-black object-fit-cover"
                                                        alt="profile image"
                                                    />
                                                    <div>
                                                        <p
                                                            className="mb-0 text-capitalize"
                                                            style={{ fontSize: '12px' }}>
                                                            {/* {
                                                                data?.subject?.name?.find(
                                                                    (ele) => ele?.use === 'official'
                                                                )?.text
                                                            } */}
                                                            {(data?.subject?.name?.[0]?.family || '') +
                                                                (data?.subject?.name?.[0]?.given?.length > 0 ?
                                                                    ' ' + data?.subject?.name?.[0]?.given?.join(' ')
                                                                    : '') || 'N/A'}
                                                        </p>
                                                        <p className="mb-0 fw-semibold" style={{ fontSize: '10px' }}>
                                                            Dr.{' '}
                                                            {(data?.doctorId?.name?.[0]?.prefix?.[0]
                                                                ? data?.doctorId?.name?.[0]?.prefix?.[0] + ' '
                                                                : '') + (data?.doctorId?.name?.[0]?.text || '')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column">
                                                    <p className="mb-0 text-capitalize" style={{ fontSize: '12px' }}>
                                                        (
                                                        {new Date(data?.start).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        }) +
                                                            '-' +
                                                            new Date(data?.end).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        )
                                                    </p>{' '}
                                                    <p
                                                        className="mb-0 fw-semibold text-capitalize"
                                                        style={{ fontSize: '10px', color: statusColors[data?.status] }}>
                                                        {data?.status}
                                                    </p>
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>

                                {showFilterDropDown && (
                                    <div
                                        ref={filterDropdownRef}
                                        className="position-absolute bg-white border p-1 rounded shadow-sm"
                                        style={{ top: '15vh', left: '15vw', zIndex: 1002, width: '500px' }}>
                                        <Row className=" pb-2 ">
                                            <Col sm={12} className="text-end"></Col>
                                            <Col sm={12} className="">
                                                <h4 className="mb-0 text-center fw-bold">Filter Patients</h4>
                                            </Col>
                                        </Row>

                                        <Row className="">
                                            <Col md={4} className="">
                                                <ul className="list-unstyled ps-3">
                                                    <li
                                                        className={`py-2 fw-bold ${activeFilter === 'Doctors' ? 'text-primary' : 'text-dark'}`}
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => setActiveFilter('Doctors')}>
                                                        Doctors
                                                    </li>
                                                    <li
                                                        className={`py-2 fw-bold ${activeFilter === 'Appointments' ? 'text-primary' : 'text-dark'}`}
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => {
                                                            setActiveFilter('Appointments');
                                                            setDoctorSearch('');
                                                        }}>
                                                        Appointments
                                                    </li>
                                                </ul>
                                            </Col>

                                            <Col md={8} className="pt-2">
                                                {renderFilterList()}
                                            </Col>
                                        </Row>

                                        <Row className=" ">
                                            <Col className="d-flex mb-1 justify-content-end">
                                                <Button
                                                    variant="primary"
                                                    className="custom-buttons"
                                                    onClick={() => {
                                                        getAppointments();
                                                    }}>
                                                    Apply
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                )}
                            </ul>
                        ) : (
                            // small side bar
                            <ul style={{ listStyle: 'none' }} className="px-0 ">
                                <li className="text-center py-3 ">
                                    <img
                                        className="cursor-pointer"
                                        onClick={() => navigate('/apps/patients/list')}
                                        src={logo_sm}
                                        alt=""
                                        height="30"
                                    />
                                </li>
                                <div className={`text-end text-white me-1 ${selectedDoctor ? '' : 'd-none'}`}>
                                    <u className="cursor-pointer" onClick={() => setSelectedDoctor(null)}>
                                        Clear filters
                                    </u>
                                </div>
                                {store?.getPatientsByAppointmentReducer?.loading ? (
                                    <div className="text-center my-5">
                                        <Spinner color="white" />
                                    </div>
                                ) : appointmentsData?.length === 0 ? (
                                    <li className="text-white text-center fs-6">No Appointments Found</li>
                                ) : (
                                    <ul className="ps-0 scroll-container" style={{ height: '90vh' }}>
                                        {appointmentsData &&
                                            appointmentsData
                                                ?.filter((data, index, self) =>
                                                    index === self.findIndex(item => item?.subject?._id === data?.subject?._id)
                                                )
                                                ?.map((data, index) => (
                                                    <li
                                                        key={data?.subject?._id || index}
                                                        className={`py-1 cursor-pointer patient-item px-1 d-flex justify-content-between`}
                                                        style={{ borderBottom: '1px solid rgb(127 123 123 / 67%)' }}
                                                        onClick={() =>
                                                            navigate(
                                                                `/apps/patients/update-patient?id=${data?.subject?._id}`
                                                            )
                                                        }>
                                                        <div className="text-center">
                                                            <img
                                                                height="40"
                                                                width="40"
                                                                src={
                                                                    data?.subject?.photo?.[0]?.url
                                                                        ? data?.subject?.photo?.[0]?.url
                                                                        : dummyProfile
                                                                }
                                                                // style={{ height: '5vh' }}
                                                                className="rounded-circle border border-black object-fit-cover"
                                                                alt="profile image"
                                                            />
                                                            <div>
                                                                <p
                                                                    className="mb-0 mt-1 text-capitalize fw-semibold"
                                                                    style={{ fontSize: '9px' }}>
                                                                    {
                                                                        data?.subject?.name?.find(
                                                                            (ele) => ele?.use === 'official'
                                                                        )?.text
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                    </ul>
                                )}

                                {showFilterDropDown && (
                                    <div
                                        ref={filterDropdownRef}
                                        className="position-absolute bg-white border p-1 rounded shadow-sm"
                                        style={{ top: '15vh', left: '15vw', zIndex: 1002, width: '500px' }}>
                                        <Row className=" pb-2 ">
                                            <Col sm={12} className="text-end"></Col>
                                            <Col sm={12} className="">
                                                <h4 className="mb-0 text-center fw-bold">Filter Patients</h4>
                                            </Col>
                                        </Row>

                                        <Row className="">
                                            <Col md={4} className="">
                                                <ul className="list-unstyled ps-3">
                                                    <li
                                                        className={`py-2 fw-bold ${activeFilter === 'Doctors' ? 'text-primary' : 'text-dark'}`}
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => setActiveFilter('Doctors')}>
                                                        Doctors
                                                    </li>
                                                    <li
                                                        className={`py-2 fw-bold ${activeFilter === 'Appointments' ? 'text-primary' : 'text-dark'}`}
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => {
                                                            setActiveFilter('Appointments');
                                                            setDoctorSearch('');
                                                        }}>
                                                        Appointments
                                                    </li>
                                                </ul>
                                            </Col>

                                            <Col md={8} className="pt-2">
                                                {renderFilterList()}
                                            </Col>
                                        </Row>

                                        <Row className=" ">
                                            <Col className="d-flex mb-1 justify-content-end">
                                                <Button
                                                    variant="primary"
                                                    className="custom-buttons"
                                                    onClick={() => {
                                                        getAppointments();
                                                    }}>
                                                    Apply
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                )}
                            </ul>
                        )}
                    </>
                ) : (
                    <div className="parentLeftSidebar mb-3">
                        <div className="media_mob ">
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
                                    isCondensed={isCondensed}
                                />
                            )}
                        </div>
                        <div className="lowerMenu scroll-container pb-3">
                            {!isCondensed && (
                                <SimpleBar className="d" timeout={500} scrollbarMaxSize={320}>
                                    {!isCondensed && <div className="leftSideBarLine"></div>}
                                    <SideBarContentDown
                                        data-aos="fade-down"
                                        menuClickHandler={() => { }}
                                        isLight={isLight}
                                        hideUserProfile={hideUserProfile}
                                    />
                                </SimpleBar>
                            )}
                            {isCondensed && <SideBarContentDown isLight={isLight} hideUserProfile={hideUserProfile} />}
                        </div>
                    </div>
                )}
                <span
                    style={{
                        marginLeft: '33px',
                        fontFamily: 'Nunito',
                        fontWeight: 700,
                        color: 'white',
                    }}>
                </span>
            </div>
        </>
    );
};

export default LeftSidebar;
