// @flow
import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import PageTitle from '../../../components/PageTitle';
import { FormInput } from '../../../components';
import { patientsData } from './data';
import { GrDocumentText } from 'react-icons/gr';
import Dropdown from 'react-bootstrap/Dropdown';
import { FiArchive, FiClock, FiFilter, FiSun } from 'react-icons/fi';
import { IoCalendarOutline, IoCloseCircleOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointmentsAction, rescheduleAppointmentAction } from '../../../redux/appointments/action';
import Spinner from '../../../constants/Spinner';
import { getDoctorsAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { appointmentStatus } from '../../../utils/DataSets/commonData';
import AppointmentCalendar from './AppointmentCalendar'
import { FaCalendar, FaCalendarWeek, FaRegListAlt } from 'react-icons/fa';
import { LucideCalendarDays } from 'lucide-react';
import { CiCalendar } from 'react-icons/ci';
import Paginations from '../../../helpers/Paginations';
const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

// Define the types for each order item
type OrderListItems = {
    orderId: string,
    avatar: string,
    name: string,
    projectName: string,
    country: string,
    city: string,
    date: string,
    orderStatus: string,
};

type OrderListProps = {
    patientsData: Array<OrderListItems>,
};

// Component for Appointments List Table
const AppointmentsList = ({ patientsData, appointmentPeriod, setSkip, skip }: OrderListProps): React$Element<React$FragmentType> => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const appointmentsList = store?.getAppointmentsReducer?.data?.appointments;
    console.log(store?.getAppointmentsReducer, 'store?.getAppointmentsReducer?.data')
    const [cancelationPopupRow, setCancelationPopupRow] = useState(null);
    const [cancelationReason, setCancelationReason] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('')
    const updateSuccess = store?.rescheduleAppointmentReducer?.data?.status;
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
        reset,
    } = useForm();
    useEffect(() => {
        if (updateSuccess === 200) {
            dispatch(getAppointmentsAction({ clinicId: clinicId, status: appointmentPeriod }));
            setCancelationPopupRow(null);
            setCancelationReason('')
        }
    }, [updateSuccess]);
    const formatTimeWithAmPm = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            // Check if the click target is NOT inside the popup
            if (!e.target.closest('.cancellation-popup') && cancelationPopupRow !== null) {
                setCancelationPopupRow(null); // Close popup
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [cancelationPopupRow]);

    const submitWithReason = (data) => {
        const payload = {
            cancellationReason: [{
                coding: [{
                    system: "", code: "", display: cancelationReason
                }],
                text: cancelationReason, // use display text
            }],
            status: 'cancelled'
        }
        dispatch(rescheduleAppointmentAction({
            id: cancelationPopupRow,
            key: encryptMessage(payload)
        }));
    }
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
    return (
        <>
            <Table
                responsive
                className="table-centered mb-0  rounded"
                style={{ height: appointmentsList?.length === 0 ? '75vh' : '' }}>
                <thead className="text-white">
                    <tr>
                        <th className="text-white">Sr.No.</th>
                        <th className="text-white">Status</th>
                        <th className="text-white">Patient</th>
                        <th className="text-white">Booked Slot</th>
                        <th className="text-white">Date</th>
                        <th className="text-white">Provider</th>
                        {/* <th className='text-white'>Doctor Department</th> */}
                        <th className="text-white">Type</th>
                        <th className="text-white">Reason</th>
                        <th className="text-white">Action</th>
                    </tr>
                </thead>
                <tbody className=''>
                    {store?.getAppointmentsReducer?.loading ? (
                        <tr>
                            <td colSpan={9} className="text-center">
                                <Spinner />
                            </td>
                        </tr>
                    ) : (
                        appointmentsList?.length === 0 ?
                            <tr>
                                <td colSpan={9} className="text-center">
                                    <h5>No Appointments Found</h5>
                                </td>
                            </tr> :
                            appointmentsList &&
                            appointmentsList?.map((data, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td className="text-capitalize position-relative">
                                        <Form.Select
                                            defaultValue={data?.status}
                                            onChange={(e) => {
                                                setSelectedStatus(e.target.value)
                                                if (e.target.value === 'cancelled') {
                                                    setCancelationPopupRow(data?._id); // or use data?._id if preferred
                                                } else {
                                                    dispatch(rescheduleAppointmentAction({
                                                        id: data?._id,
                                                        key: encryptMessage({ status: e.target.value })
                                                    }));
                                                    setCancelationPopupRow(null); // close popup if status changes again
                                                }
                                            }}

                                            className={`schedule-status-select
                                         ${data?.status === 'pending' && 'pendingColor'}
                                         ${data?.status === 'proposed' && 'proposedColor'}
                                         ${data?.status === 'booked' && 'bookedColor'}
                                         ${data?.status === 'arrived' && 'arrivedColor'}
                                         ${data?.status === 'fulfilled' && 'fulfilledColor'}
                                         ${data?.status === 'cancelled' && 'cancelledColor'}
                                         ${data?.status === 'noshow' && 'noshowColor'}
                                         ${data?.status === 'entered-in-error' && 'enteredinerrorColor'}
                                         ${data?.status === 'checked-in' && 'checkedinColor'}
                                         ${data?.status === 'waitlist' && 'waitlistColor'}
                                         `}>
                                            {appointmentStatus?.map((data, index) => (
                                                <option value={data?.code} key={index}> {data?.display}</option>
                                            ))}
                                        </Form.Select>
                                        {cancelationPopupRow === data?._id && (
                                            <div
                                                className='position-absolute cancellation-popup border   bg-white'
                                                style={{ left: '84%', top: '0%', width: "14vw", boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)" }}

                                            >
                                                <p className="fs-4 px-2 mb-0 text-end ">
                                                    <IoCloseCircleOutline onClick={() => {
                                                        setCancelationPopupRow(null);
                                                    }} />
                                                </p>
                                                <div
                                                    className=' p-2 pt-0'
                                                >
                                                    <Form onSubmit={handleSubmit(submitWithReason)}>
                                                        <Form.Group>
                                                            <Form.Label>Cancelation Reason</Form.Label>
                                                            <Form.Control className='mb-2' onChange={(e) => setCancelationReason(e.target.value)} type='text' placeholder='Enter the cancellation reason' />
                                                        </Form.Group>
                                                        <div className='text-end'>
                                                            <Button disabled={!cancelationReason} className='custom-buttons' type='submit'>Submit</Button>
                                                        </div>
                                                    </Form>
                                                </div>
                                            </div>

                                        )}

                                    </td>
                                    <td className="text-capitalize">
                                        {data?.subject?.name?.[0]?.text}
                                        <div className="d-flex gap-2">
                                            <span>
                                                {data?.subject?.birthDate
                                                    ? new Date(data.subject.birthDate).toISOString().split('T')[0]
                                                    : 'N/A'}
                                            </span>
                                            <span>
                                                {
                                                    data?.subject?.telecom?.find(
                                                        (item) => item.system === 'phone' && item.value
                                                    )?.value || 'No phone number'
                                                }
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        {formatTimeWithAmPm(data?.start)} - {formatTimeWithAmPm(data?.end)}
                                    </td>
                                    <td>{new Date(data?.date).toLocaleDateString('en-GB')}</td>
                                    <td className="text-capitalize">{data?.doctorId?.name?.[0]?.text + ' '}</td>
                                    <td className="text-capitalize cursor-pointer" data-toggle="tooltip" data-placement="top" title={data?.appointmentType?.coding?.[0]?.display}>
                                        {data?.appointmentType?.coding?.[0]?.display?.length > 20
                                            ? data?.appointmentType?.coding?.[0]?.display?.slice(0, 19) + '...'
                                            : data?.appointmentType?.coding?.[0]?.display}
                                    </td>
                                    <td className="text-capitalize cursor-pointer" data-toggle="tooltip" data-placement="top" title={data?.reason?.[0]?.coding?.[0]?.display}>
                                        {data?.reason?.[0]?.coding?.[0]?.display?.length > 20 ? data?.reason?.[0]?.coding?.[0]?.display?.slice(0, 19) + '...' : data?.reason?.[0]?.coding?.[0]?.display}
                                    </td>
                                    <td>
                                        <Link
                                            to={`/apps/appointments/newAppointment?updateid=${data?._id}`}
                                            className="action-icon">
                                            <i className="mdi mdi-square-edit-outline cursor-pointer"></i>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                    )}
                </tbody>
            </Table>
            <div className='mt-2 d-flex justify-content-end'>
                <Paginations
                    currentPage={skip}
                    totalPages={store?.getAppointmentsReducer?.data?.appointments?.length}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
};



// Main Appointments Component
const Appointments = ({ patientsData }: { patientsData: Array<OrderListItems> }): React$Element<React$FragmentType> => {
    const {
        register,
        formState: { errors },
        setValue,
        clearErrors,
    } = useForm();

    const [activeTab, setActiveTab] = useState('appointments');
    const [appointmentPeriod, setAppointmentPeriod] = useState('today');
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctorSearch, setDoctorSearch] = useState('');
    const [skip, setSkip] = useState(1)
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const doctorOptions = doctorDetails?.map((data) => ({
        value: data?._id,
        label: data?.name[0]?.text + ' ',
    }));
    useEffect(() => {
        const doctorPayload = { status: true, search: doctorSearch };
        dispatch(getDoctorsAction(doctorPayload));
    }, [dispatch, doctorSearch]);
    useEffect(() => {
        if (activeTab === 'appointments') {
            dispatch(getAppointmentsAction({ clinicId: clinicId, doctorId: selectedDoctor?.value || '', status: appointmentPeriod }));
        }
    }, [dispatch, selectedDoctor, appointmentPeriod, activeTab, skip]);
    const handleInputChange = (data, type) => {
        setDoctorSearch(data);
    };

    const handleChange = (selectedOption, type) => {
        setSelectedDoctor(selectedOption, 'Selected Option');
    };
    return (
        <>
            <Row className="mt-2">
                <Col xs={12}>
                    <Card className="scroll-container" style={{ height: '82vh', overflow: 'scroll' }}>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col sm={4}>
                                    <ul className="nav nav-underline">
                                        <li className="nav-item">
                                            <span
                                                className={classNames('nav-link fw-bold text-black cursor-pointer', {
                                                    active: activeTab === 'appointments',
                                                    'fw-bold': activeTab === 'appointments',
                                                })}
                                                onClick={() => setActiveTab('appointments')}>
                                                <FaRegListAlt /> Appointment List
                                            </span>
                                        </li>
                                        <li className="nav-item ms-md-2">
                                            <span
                                                className={classNames('nav-link fw-bold text-black cursor-pointer', {
                                                    active: activeTab === 'appointmentCalendar',
                                                    'fw-bold': activeTab === 'appointmentCalendar',
                                                })}
                                                onClick={() => setActiveTab('appointmentCalendar')}>
                                                <CiCalendar /> Appointment Calendar
                                            </span>
                                        </li>
                                    </ul>
                                </Col>
                                <Col sm={8} className="text-end mt-2 mt-md-0">
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col
                                            xs={12}
                                            sm="auto"
                                            className="d-flex flex-wrap gap-2 align-items-center text-start justify-content-between responnsible-party-select">
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isLoading={store?.getDoctorsReducer?.loading}
                                                isClearable={true}
                                                value={selectedDoctor}
                                                isSearchable={true}
                                                {...register('selectedDoctor')}
                                                onInputChange={(inputValue) => handleInputChange(inputValue, 'doctor')}
                                                onChange={(data) => {
                                                    setValue('selectedDoctor', data);
                                                    handleChange(data, 'doctor');
                                                    clearErrors('selectedDoctor');
                                                }}
                                                name="doctorName"
                                                options={doctorOptions}
                                                placeholder="Select Doctor"
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        minHeight: '30px',
                                                        height: '30px',
                                                        width: '200px',
                                                        padding: '0px',
                                                        fontSize: '14px',
                                                        border: '0px',
                                                        backgroundColor: '#E8F0FE!important',
                                                        boxShadow: 'none',
                                                    }),
                                                    valueContainer: (provided) => ({
                                                        ...provided,
                                                        padding: '0px',
                                                    }),
                                                    input: (provided) => ({
                                                        ...provided,
                                                        margin: '0px',
                                                    }),
                                                    indicatorsContainer: (provided) => ({
                                                        ...provided,
                                                        height: '30px',
                                                    }),
                                                    placeholder: (provided) => ({
                                                        ...provided,
                                                        fontWeight: 600,
                                                        color: '#0908084f',
                                                    }),
                                                }}
                                            />

                                            {/* Additional controls shown only in the "Appointments" tab */}
                                            {activeTab === 'appointments' && (
                                                <>
                                                    <Button className="custom-buttons">
                                                        <FiFilter className="fs-5" />
                                                    </Button>
                                                    <Button
                                                        as={Link}
                                                        to="/apps/appointments/newAppointment"
                                                        className="custom-buttons">
                                                        New Appointment
                                                    </Button>
                                                </>
                                            )}
                                        </Col>
                                    </Row>
                                </Col>
                                {activeTab === 'appointments' &&
                                    <Col md={12} className='mt-2'>
                                        <div className="time-period-tabs">
                                            <ul className="nav nav-pills">
                                                <li className="nav-item">
                                                    <button
                                                        className={`nav-link ${appointmentPeriod === 'today' ? 'active' : 'text-black'}`}
                                                        onClick={() => setAppointmentPeriod('today')}
                                                    >
                                                        <FiSun className="me-1" />
                                                        Today
                                                    </button>
                                                </li>
                                                <li className="nav-item ms-2">
                                                    <button
                                                        className={`nav-link ${appointmentPeriod === 'upcoming' ? 'active' : 'text-black'}`}
                                                        onClick={() => setAppointmentPeriod('upcoming')}
                                                    >
                                                        <FiClock className="me-1" />
                                                        Upcoming
                                                    </button>
                                                </li>
                                                <li className="nav-item ms-2">
                                                    <button
                                                        className={`nav-link ${appointmentPeriod === 'history' ? 'active' : 'text-black'}`}
                                                        onClick={() => setAppointmentPeriod('history')}
                                                    >
                                                        <FiArchive className="me-1" />
                                                        History
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </Col>
                                }
                            </Row>

                            {/* Render table based on active tab */}
                            {activeTab === 'appointments' ? (
                                <AppointmentsList setSkip={setSkip} patientsData={patientsData} appointmentPeriod={appointmentPeriod} />
                            ) : (
                                <AppointmentCalendar appointmentPeriod={appointmentPeriod} selectedDoctor={selectedDoctor?.value} />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Appointments;
