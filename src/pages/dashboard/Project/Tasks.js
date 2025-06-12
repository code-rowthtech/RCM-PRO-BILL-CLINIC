// @flow
import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// component
import CardTitle from '../../../components/CardTitle';

const Appointments = (): React$Element<any> => {
    // Sample appointment data
    const appointments = [
        {
            id: 'APT-2023-001',
            patient: 'John D. Smith',
            doctor: 'Dr. Sarah Johnson',
            date: 'Today, 10:30 AM',
            status: 'Confirmed',
            statusClass: 'success-lighten',
            duration: '30 min',
            condition: 'Routine Checkup'
        },
        {
            id: 'APT-2023-002',
            patient: 'Emily R. Wilson',
            doctor: 'Dr. Michael Chen',
            date: 'Tomorrow, 2:15 PM',
            status: 'Pending',
            statusClass: 'warning-lighten',
            duration: '45 min',
            condition: 'Follow-up'
        },
        {
            id: 'APT-2023-003',
            patient: 'Robert K. Davis',
            doctor: 'Dr. Lisa Wong',
            date: 'Jun 15, 9:00 AM',
            status: 'Completed',
            statusClass: 'primary-lighten',
            duration: '1h',
            condition: 'Consultation'
        },
        {
            id: 'APT-2023-004',
            patient: 'Maria G. Hernandez',
            doctor: 'Dr. James Wilson',
            date: 'Jun 16, 11:45 AM',
            status: 'Cancelled',
            statusClass: 'danger-lighten',
            duration: '30 min',
            condition: 'Vaccination'
        }
    ];

    return (
        <Card>
            <Card.Body className='pt-1 pb-2'>
                <CardTitle
                    containerClass="d-flex align-items-center justify-content-between mb-2"
                    title="Today's Appointments"
                    menuItems={[
                        { label: 'Today' },
                        { label: 'This Week' },
                        { label: 'This Month' },
                        { label: 'All Appointments' },
                    ]}
                />

                {/* <p>
                    <b>{appointments.filter(a => a.status === 'Completed').length}</b> Appointments completed out of {appointments.length}
                </p> */}

                <Table responsive hover className="table-centered table-nowrap mb-0">
                    {/* <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Date/Time</th>
                            <th>Status</th>
                            <th>Duration</th>
                            <th>Action</th>
                        </tr>
                    </thead> */}
                    <tbody>
                        {appointments.map((appointment, index) => (
                            <tr key={index}>
                                <td>
                                    <h5 className="font-14 my-1">
                                        <Link to="#" className="text-body">
                                            {appointment.patient}
                                        </Link>
                                    </h5>
                                    <span className="text-muted font-13">{appointment.condition}</span>
                                </td>
                                <td>
                                    <span className="text-muted font-13">Doctor</span>
                                    <h5 className="font-14 mt-1 fw-normal">{appointment.doctor}</h5>
                                </td>
                                <td>
                                    <span className="text-muted font-13">Scheduled</span>
                                    <h5 className="font-14 mt-1 fw-normal">{appointment.date}</h5>
                                </td>
                                <td>
                                    <span className="text-muted font-13">Status</span> <br />
                                    <span className={`badge badge-${appointment.statusClass}`}>
                                        {appointment.status}
                                    </span>
                                </td>
                                <td>
                                    <span className="text-muted font-13">Duration</span>
                                    <h5 className="font-14 mt-1 fw-normal">{appointment.duration}</h5>
                                </td>
                                <td className="table-action" style={{ width: '90px' }}>
                                    <Link to="#" className="action-icon">
                                        <i className="mdi mdi-calendar-check"></i>
                                    </Link>
                                    <Link to="#" className="action-icon">
                                        <i className="mdi mdi-pencil"></i>
                                    </Link>
                                    <Link to="#" className="action-icon">
                                        <i className="mdi mdi-delete"></i>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default Appointments;