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
import { FiFilter } from 'react-icons/fi';
import { IoCalendarOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { getAppointmentsAction } from '../../../redux/appointments/action';
import Spinner from '../../../constants/Spinner';
import { getDoctorsAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import Select from 'react-select';
import { useForm } from 'react-hook-form';

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
const AppointmentsList = ({ patientsData }: OrderListProps): React$Element<React$FragmentType> => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const appointmentsList = store?.getAppointmentsReducer?.data?.appointments;
    return (
        <Table responsive className="table-centered table-nowrap mb-0  rounded"
            style={{ height: appointmentsList?.length === 0 ? '75vh' : 'auto' }}>
            <thead className="text-white">
                <tr>
                    <th className='text-white'>Sr.No.</th>
                    <th className='text-white'>Patients Name</th>
                    <th className='text-white'>Doctor</th>
                    <th className='text-white'>Doctor Department</th>
                    <th className='text-white'>Purpose of Visit</th>
                    <th className='text-white'>Booked Slot</th>
                    <th className='text-white'>Date</th>
                    <th className='text-white'>Status</th>
                    <th className='text-white'>Action</th>
                </tr>
            </thead>
            <tbody>
                {store?.getAppointmentsReducer?.loading ?
                    <tr>
                        <td colSpan={9} className='text-center'>
                            <Spinner />
                        </td>
                    </tr>
                    :
                    appointmentsList && appointmentsList?.map((data, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td className='text-capitalize'>{data?.patient?.firstName}</td>
                            <td className='text-capitalize'>{data?.doctor?.userId?.firstName + ' ' + data?.doctor?.userId?.lastName}</td>
                            <td className='text-capitalize'>{data?.doctor?.departmentId?.name}</td>
                            <td className='text-capitalize'>{data?.reason || 'N/A'}</td>
                            <td>{data?.startTime} - {data?.endTime}</td>
                            <td>{new Date(data?.date).toLocaleDateString('en-GB')}</td>
                            <td><span className={`px-1 text-white ${data?.status === 'Scheduled' ? 'bg-success' : 'bg-secondary'} rounded-2`}>{data?.status}</span></td>
                            <td>
                                <Link to={`/apps/appointments/newAppointment?updateid=${data?._id}`} className="action-icon">
                                    <i className="mdi mdi-square-edit-outline cursor-pointer"></i>
                                </Link>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>

    );
};

// Component for Appointments Transaction Table
const AppointmentsTransactionList = ({ patientsData }: OrderListProps): React$Element<React$FragmentType> => {
    return (
        <Table responsive className="table-centered table-nowrap mb-0">
            <thead className="text-white">
                <tr>
                    <th className='text-white' style={{ fontSize: '13px' }}>Sr.No.</th>
                    <th className='text-white' style={{ fontSize: '13px' }}>Patient Name</th>
                    <th className='text-white' style={{ fontSize: '13px' }}>Doctor</th>
                    <th className='text-white' style={{ fontSize: '13px' }}>Doctor Department</th>
                    <th className='text-white' style={{ fontSize: '13px' }}>Appointment Date</th>
                    <th className='text-white' style={{ fontSize: '13px' }}>Payment Status</th>
                    <th className='text-white' style={{ fontSize: '13px' }}>Payment Mode</th>
                    <th className='text-white' style={{ fontSize: '13px' }}>Amount</th>
                    <th className='text-white' style={{ fontSize: '13px' }}>Status</th>
                </tr>
            </thead>
            <tbody>
                {[0, 1, 2, 3].map((index) => (
                    <tr key={index}>
                        <td className='' style={{ fontSize: '13px', fontWeight: '400' }}>{index + 1}</td>
                        <td className='' style={{ fontSize: '13px', fontWeight: '400' }}>John Doe</td>
                        <td className='' style={{ fontSize: '13px', fontWeight: '400' }}>Doctor Demo</td>
                        <td className='' style={{ fontSize: '13px', fontWeight: '400' }}>Nephrologists</td>
                        <td className='' style={{ fontSize: '13px', fontWeight: '400' }}>26th sep, 2024</td>
                        <td className='' style={{ fontSize: '13px', fontWeight: '400' }}><span className='px-1 text-white bg-success rounded-2'>Confirm</span></td>
                        <td className='' style={{ fontSize: '13px', fontWeight: '400' }}>Paystack</td>
                        <td className='' style={{ fontSize: '13px', fontWeight: '400' }}>AR$1,000,00</td>
                        <td className='' style={{ fontSize: '13px', fontWeight: '400' }}><span className='px-1 text-white bg-success rounded-2'>30th apr,2024</span></td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

// Main Appointments Component
const Appointments = ({ patientsData }: { patientsData: Array<OrderListItems> }): React$Element<React$FragmentType> => {
    const { register, handleSubmit, formState: { errors }, setValue, reset, clearErrors, getValues } = useForm();

    const [activeTab, setActiveTab] = useState('appointments');
    const navigate = useNavigate();
    const store = useSelector((state) => state);
    const dispatch = useDispatch()
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctorSearch, setDoctorSearch] = useState('');
    const doctorDetails = store?.getDoctorsReducer?.data?.response;
    const doctorOptions = doctorDetails?.map((data) => ({
        value: data?._id,
        label: data?.userDetails?.firstName + ' ' + data?.userDetails?.lastName,
    }));
    useEffect(() => {
        const doctorPayload = { status: true, search: doctorSearch }
        dispatch(getDoctorsAction({ key: encryptMessage(doctorPayload) }));
    }, [dispatch, doctorSearch])
    useEffect(() => {
        dispatch(getAppointmentsAction({ clinicId: clinicId, doctorId: selectedDoctor?.value }))
    }, [dispatch, selectedDoctor])
    const handleInputChange = (data, type) => {
        setDoctorSearch(data)
    }
    const handleSearchInputChange = (selectedOption, type) => {
        if (type === 'doctor') {
            setSelectedDoctor(selectedOption);
        }
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
                                            <a
                                                className={classNames("nav-link fw-bold text-black", { active: activeTab === 'appointments', 'fw-bold': activeTab === 'appointments' })}
                                                href="#"
                                                onClick={() => setActiveTab('appointments')}
                                            >
                                                Appointments
                                            </a>
                                        </li>
                                        <li className="nav-item ms-md-2">
                                            <a
                                                className={classNames("nav-link fw-bold text-black", { active: activeTab === 'transactions', 'fw-bold': activeTab === 'transactions' })}
                                                href="#"
                                                onClick={() => setActiveTab('transactions')}
                                            >
                                                Appointments transaction
                                            </a>
                                        </li>
                                    </ul>
                                </Col>

                                <Col sm={8} className="text-end mt-2 mt-md-0">
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col
                                            xs={12}
                                            sm="auto"
                                            className="d-flex flex-wrap gap-2 align-items-center text-start justify-content-between responnsible-party-select"
                                        >
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
                                                    <FormInput
                                                        type="date"
                                                        placeholder="Search..."
                                                        className="input_search_box"
                                                        style={{ minWidth: '150px' }} // Add a minimum width for better alignment
                                                    />
                                                    <Button className="custom-buttons py-0 " style={{ height: '30px' }} onClick={() => navigate("/apps/appointments/appointmentCalendar")}>
                                                        <IoCalendarOutline className="fs-5 " />
                                                    </Button>
                                                    <Button
                                                        as={Link}
                                                        to="/apps/appointments/newAppointment"
                                                        className="custom-buttons"
                                                    >
                                                        New Appointment
                                                    </Button>
                                                </>
                                            )}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            {/* Render table based on active tab */}
                            {activeTab === 'appointments' ? (
                                <AppointmentsList patientsData={patientsData} />
                            ) : (
                                <AppointmentsTransactionList patientsData={patientsData} />
                            )}
                        </Card.Body>
                    </Card>
                </Col >
            </Row >
        </>
    );
};

export default Appointments;
