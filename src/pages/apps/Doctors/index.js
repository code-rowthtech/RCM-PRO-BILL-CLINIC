import React, { useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FormInput } from '../../../components';
import { FiEdit, FiFileText, FiTrash } from "react-icons/fi";
import { FiFilter } from "react-icons/fi";

const Doctors = () => {
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [status, setStatus] = useState("Active");

    const handleStatusChange = (isActive) => {
        setStatus(isActive);
    };

    // Static patient data
    const patientsData = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            insuranceProvider: 'HealthCare Inc.',
            email: 'mailto:john.doe@example.com',
            departmentName: 'Cardiology',
            status: 'Active',
            specialist: 'Bones',
            phone: '123-456-7890',
            address: {
                street: '123 Main St',
                city: 'Springfield',
                state: 'IL',
                zipCode: '62701'
            },
            gender: 'Male',
            insurancePlan: 'Premium',
            insurancePolicyNumber: '123456789',
            allergies: 'Pollen',
            emergencyContacts: [{ phone: '987-654-3210' }]
        },
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            insuranceProvider: 'HealthCare Inc.',
            email: 'mailto:john.doe@example.com',
            phone: '123-456-7890',
            departmentName: 'Cardiology',
            status: 'Active',
            specialist: 'Bones',

            address: {
                street: '123 Main St',
                city: 'Springfield',
                state: 'IL',
                zipCode: '62701'
            },
            gender: 'Male',
            insurancePlan: 'Premium',
            insurancePolicyNumber: '123456789',
            allergies: 'Pollen',
            emergencyContacts: [{ phone: '987-654-3210' }]
        },
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            insuranceProvider: 'HealthCare Inc.',
            email: 'mailto:john.doe@example.com',
            departmentName: 'Cardiology',
            status: 'Active',
            specialist: 'Bones',

            phone: '123-456-7890',
            address: {
                street: '123 Main St',
                city: 'Springfield',
                state: 'IL',
                zipCode: '62701'
            },
            gender: 'Male',
            insurancePlan: 'Premium',
            insurancePolicyNumber: '123456789',
            allergies: 'Pollen',
            emergencyContacts: [{ phone: '987-654-3210' }]
        },
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            insuranceProvider: 'HealthCare Inc.',
            email: 'mailto:john.doe@example.com',
            phone: '123-456-7890',
            departmentName: 'Cardiology',
            status: 'Active',
            specialist: 'Bones',


            address: {
                street: '123 Main St',
                city: 'Springfield',
                state: 'IL',
                zipCode: '62701'
            },
            gender: 'Male',
            insurancePlan: 'Premium',
            insurancePolicyNumber: '123456789',
            allergies: 'Pollen',
            emergencyContacts: [{ phone: '987-654-3210' }]
        },
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            insuranceProvider: 'HealthCare Inc.',
            email: 'mailto:john.doe@example.com',
            phone: '123-456-7890',
            departmentName: 'Cardiology',
            status: 'Inactive',
            specialist: 'Bones',

            address: {
                street: '123 Main St',
                city: 'Springfield',
                state: 'IL',
                zipCode: '62701'
            },
            gender: 'Male',
            insurancePlan: 'Premium',
            insurancePolicyNumber: '123456789',
            allergies: 'Pollen',
            emergencyContacts: [{ phone: '987-654-3210' }]
        },
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            insuranceProvider: 'HealthCare Inc.',
            email: 'mailto:john.doe@example.com',
            phone: '123-456-7890',
            departmentName: 'Cardiology',
            status: 'Active',
            specialist: 'Bones',

            address: {
                street: '123 Main St',
                city: 'Springfield',
                state: 'IL',
                zipCode: '62701'
            },
            gender: 'Male',
            insurancePlan: 'Premium',
            insurancePolicyNumber: '123456789',
            allergies: 'Pollen',
            emergencyContacts: [{ phone: '987-654-3210' }]
        },
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            insuranceProvider: 'HealthCare Inc.',
            email: 'mailto:john.doe@example.com',
            phone: '123-456-7890',
            departmentName: 'Cardiology',
            status: 'Active',
            specialist: 'Bones',

            address: {
                street: '123 Main St',
                city: 'Springfield',
                state: 'IL',
                zipCode: '62701'
            },
            gender: 'Male',
            insurancePlan: 'Premium',
            insurancePolicyNumber: '123456789',
            allergies: 'Pollen',
            emergencyContacts: [{ phone: '987-654-3210' }]
        },
    ];

    const closeDetailsModal = () => {
        setDetailsModal(false);
        setSelectedDetails(null);
    };
     // Filter patients based on selected status
     const filteredPatients = patientsData.filter((patient) =>
        status === 'Active' ? patient.status === 'Active' : patient.status === 'Inactive'
    );


    return (
        <>
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2">
                            <Col sm={6}>
                                    <Button
                                        onClick={() => setStatus('Active')}
                                        className={`me-2 ${status === 'Active' ? 'custom-buttons text-white' : 'bg-white border-primary text-dark'}`}
                                    >
                                        Active
                                    </Button>

                                    <Button
                                        onClick={() => setStatus('Inactive')}
                                        className={`me-2 ${status === 'Inactive' ? 'custom-buttons text-white' : 'bg-white border-primary text-dark'}`}
                                    >
                                        Inactive
                                    </Button>
                                </Col>

                                <Col sm={6} className='text-end'>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between ">
                                        <Col xs="auto" className='d-flex gap-2'>
                                            <FormInput
                                                type="text"
                                                // onChange={(e) => setName(e.target.value)}
                                                placeholder="Search..." />
                                            {/* <Button className="custom-buttons ">
                                                <FiFilter className='fs-4' />
                                            </Button>
                                            <Button className="custom-buttons ">
                                                <FiFileText className='fs-4' />
                                            </Button> */}
                                            <Button as={Link} to='/apps/doctors/new-doctor' className="custom-buttons">
                                                New Doctor
                                            </Button>
                                        </Col>
                                    </Row>

                                </Col>
                            </Row>


                            <Row>

                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead className="text-white">
                                            <tr className=''>
                                            <th className='text-white'>S.No.</th>
                                                <th className='text-white'>Doctor Name</th>
                                                <th className='text-white'>Specialist</th>
                                                <th className='text-white'>Department Name</th>
                                                <th className='text-white'>Status</th>
                                                <th className='text-white'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPatients.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className='text-center'>
                                                        <h3 className='my-5'>No Data Found</h3>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredPatients.map((data, index) => (
                                                    <tr key={index}>
                                                        <td>{index+1}</td>
                                                        <td className=''>
                                                            {data.firstName}
                                                        </td>
                                                        <td>{data.specialist}</td>
                                                        <td>
                                                            <span className='text-truncate text-lowercase cursor-pointer'>
                                                                {data.departmentName}
                                                            </span>
                                                        </td>
                                                        <td><Form.Switch checked /></td>
                                                        <td>
                                                            <div className='d-flex gap-2'>
                                                                <div>
                                                                    <FiEdit className='fs-5' />
                                                                </div>
                                                                <div>
                                                                    <FiTrash className='fs-5' />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={detailsModal} onHide={closeDetailsModal}>
                <Modal.Header
                    onHide={closeDetailsModal}
                    closeButton
                    className={'modal-colored-header pb-0 border-0 text-center'}>
                </Modal.Header>
                <Modal.Body>
                    <h4 className="mt-0 text-center">Patient Details</h4>
                    <Row>
                        <Col className='light-border-bottom d-flex justify-content-between align-items-center'>
                            <Col sm={6}><h5>Name</h5></Col>
                            <Col sm={6}><p className='mb-0 text-start'>{selectedDetails?.firstName + ' ' + selectedDetails?.lastName}</p></Col>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Doctors;
