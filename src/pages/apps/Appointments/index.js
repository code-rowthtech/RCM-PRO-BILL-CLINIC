// @flow
import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import PageTitle from '../../../components/PageTitle';
import { FormInput } from '../../../components';
import { patientsData } from './data';
import { GrDocumentText } from 'react-icons/gr';
import Dropdown from 'react-bootstrap/Dropdown';
import { FiFileText, FiFilter } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointmentsAction } from '../../../redux/appointments/action';
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
    useEffect(() => {
        dispatch(getAppointmentsAction({ clinicId: clinicId }))
    }, [dispatch])
    const appointmentsList = store?.getAppointmentsReducer?.data?.appointments;
    const isLoading = store?.getAppointmentsReducer?.loading;

    return (
        <Table responsive  className="table-centered table-nowrap mb-0  rounded"
        style={{ height: appointmentsList?.length === 0 ? '75vh' : 'auto' }}>
            <thead className="text-white">
                <tr>
                    <th className="text-white py-2" style={{ fontSize: '13px' }}>Sr.No.</th>
                    <th className="text-white py-2" style={{ fontSize: '13px' }}>Patients Name</th>
                    <th className="text-white py-2" style={{ fontSize: '13px' }}>Doctor</th>
                    <th className="text-white py-2" style={{ fontSize: '13px' }}>Doctor Department</th>
                    <th className="text-white py-2" style={{ fontSize: '13px' }}>Date</th>
                    <th className="text-white py-2" style={{ fontSize: '13px' }}>Status</th>
                </tr>
            </thead>
            <tbody>
                {/* Show a loading spinner if data is still loading */}
                {isLoading ? (
                    <tr>
                        <td colSpan="6" className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </td>
                    </tr>
                ) : appointmentsList && appointmentsList.length > 0 ? (
                    appointmentsList.map((data, index) => (
                        <tr key={index}>
                            <td className="py-1" style={{ fontSize: '13px', fontWeight: '400' }}>{index + 1}</td>
                            <td className="text-capitalize py-1" style={{ fontSize: '13px', fontWeight: '400' }}>{data?.patient?.fullName}</td>
                            <td className="text-capitalize py-1" style={{ fontSize: '13px', fontWeight: '400' }}>{data?.doctor?.userId?.firstName + ' ' + data?.doctor?.userId?.lastName}</td>
                            <td className="text-capitalize py-1" style={{ fontSize: '13px', fontWeight: '400' }}>{data?.doctor?.departmentId?.name}</td>
                            <td className="py-1" style={{ fontSize: '13px', fontWeight: '400' }}>{new Date(data?.date).toLocaleDateString('en-GB')}</td>
                            <td className="py-1" style={{ fontSize: '13px', fontWeight: '400' }}>
                                <span
                                    className={`px-1 text-white ${data?.status === 'Scheduled' ? 'bg-success' : 'bg-secondary'} rounded-2`}
                                >
                                    {data?.status}
                                </span>
                            </td>
                        </tr>
                    ))
                ) : (
                    // Show a "No data available" message if the array is empty
                    <tr>
                        <td colSpan="6" className="text-center py-4" style={{ fontSize: '14px', fontWeight: '500' }}>
                            No appointments found.
                        </td>
                    </tr>
                )}
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
                    <th className='text-white py-2' style={{ fontSize: '13px' }}>Sr.No.</th>
                    <th className='text-white py-2' style={{ fontSize: '13px' }}>Patient Name</th>
                    <th className='text-white py-2' style={{ fontSize: '13px' }}>Doctor</th>
                    <th className='text-white py-2' style={{ fontSize: '13px' }}>Doctor Department</th>
                    <th className='text-white py-2' style={{ fontSize: '13px' }}>Appointment Date</th>
                    <th className='text-white py-2' style={{ fontSize: '13px' }}>Payment Status</th>
                    <th className='text-white py-2' style={{ fontSize: '13px' }}>Payment Mode</th>
                    <th className='text-white py-2' style={{ fontSize: '13px' }}>Amount</th>
                    <th className='text-white py-2' style={{ fontSize: '13px' }}>Status</th>
                </tr>
            </thead>
            <tbody>
                {[0, 1, 2, 3].map((index) => (
                    <tr key={index}>
                        <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>{index + 1}</td>
                        <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>John Doe</td>
                        <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>Doctor Demo</td>
                        <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>Nephrologists</td>
                        <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>26th sep, 2024</td>
                        <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}><span className='px-1 text-white bg-success rounded-2'>Confirm</span></td>
                        <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>Paystack</td>
                        <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>AR$1,000,00</td>
                        <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}><span className='px-1 text-white bg-success rounded-2'>30th apr,2024</span></td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

// Main Appointments Component
const Appointments = ({ patientsData }: { patientsData: Array<OrderListItems> }): React$Element<React$FragmentType> => {
    const [activeTab, setActiveTab] = useState('appointments');

    const navigate = useNavigate();
    const goto = () => {
        alert('ads')
        navigate("/apps/appointments/appointmentCalendar");
    };

    return (
        <>
            <Row className="mt-2">
                <Col xs={12}>
                    <Card>
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
                                        <li className="nav-item ms-2">
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

                                <Col sm={8} className="text-end">
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col xs="auto" className="d-flex gap-2">
                                            {/* Search input shown in both tabs */}
                                            <FormInput
                                                type="text"
                                                placeholder="Search..."
                                                style={{ height: '30px' }}
                                            />

                                            {/* Additional controls shown only in the "Appointments" tab */}
                                            {activeTab === 'appointments' && (
                                                <>
                                                    <Button className="custom-buttons py-0" style={{ height: '30px' }}>
                                                        <FiFilter className="fs-5" style={{ fontSize: '13px', fontWeight: '400' }} />
                                                    </Button>
                                                    <FormInput
                                                        type="Date"
                                                        placeholder="Search..."
                                                        style={{ height: '30px' }}
                                                    />
                                                    <Button className="custom-buttons py-0" style={{ height: '30px' }}>
                                                        <FiFileText className="fs-5" style={{ fontSize: '13px', fontWeight: '400' }} onClick={goto} />
                                                    </Button>
                                                    <Button as={Link} to="/apps/appointments/newAppointment " className='py-1' style={{ fontSize: '13px', height: '30px', fontWeight: '400' }}>New Appointment</Button>
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
                </Col>
            </Row>
        </>
    );
};

export default Appointments;
