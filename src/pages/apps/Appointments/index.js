// @flow
import React, { useState } from 'react';
import { Badge, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import PageTitle from '../../../components/PageTitle';
import { FormInput } from '../../../components';
import { patientsData } from './data';
import { GrDocumentText } from 'react-icons/gr';
import Dropdown from 'react-bootstrap/Dropdown';
import { FiFileText, FiFilter } from 'react-icons/fi';

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
    return (
        <Table responsive className="table-centered table-nowrap mb-0">
            <thead className="text-white">
                <tr>
                    <th className='text-white'>Sr.No.</th>
                    <th className='text-white'>Patients Name</th>
                    <th className='text-white'>Doctor</th>
                    <th className='text-white'>Doctor Department</th>
                    <th className='text-white'>Date</th>
                    <th className='text-white'>Status</th>
                </tr>
            </thead>
            <tbody>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>Patient Name</td>
                        <td>Doctor Demo</td>
                        <td>Allergists</td>
                        <td>DD/MM/YYYY</td>
                        <td><span className='px-1 text-white bg-secondary rounded-2'>Confirm</span></td>
                    </tr>
                ))}
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
                    <th className='text-white'>Sr.No.</th>
                    <th className='text-white'>Patient Name</th>
                    <th className='text-white'>Doctor</th>
                    <th className='text-white'>Doctor Department</th>
                    <th className='text-white'>Appointment Date</th>                                                                          
                    <th className='text-white'>Payment Status</th>
                    <th className='text-white'>Payment Mode</th>
                    <th className='text-white'>Amount</th>
                    <th className='text-white'>Status</th>
                </tr>
            </thead>
            <tbody>
                {[0, 1, 2, 3].map((index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>John Doe</td>
                        <td>Doctor Demo</td>
                        <td>Nephrologists</td>
                        <td>26th sep, 2024</td>
                        <td><span className='px-1 text-white bg-success rounded-2'>Confirm</span></td>
                        <td>Paystack</td>
                        <td>AR$1,000,00</td>
                        <td><span className='px-1 text-white bg-success rounded-2'>30th apr,2024</span></td>
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
                                        <li className="nav-item ms-3">
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
                                            />

                                            {/* Additional controls shown only in the "Appointments" tab */}
                                            {activeTab === 'appointments' && (
                                                <>
                                                    <Button className="custom-buttons">
                                                        <FiFilter className="fs-4" />
                                                    </Button>
                                                    <FormInput
                                                        type="Date"
                                                        placeholder="Search..."
                                                    />
                                                    <Button className="custom-buttons">
                                                        <FiFileText className="fs-4" onClick={goto} />
                                                    </Button>
                                                    <Button as={Link} to="/apps/appointments/newAppointment">New Appointment</Button>
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
