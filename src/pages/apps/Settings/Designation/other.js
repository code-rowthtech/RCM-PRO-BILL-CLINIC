import React, { useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { FormInput } from '../../../../components';
import { FiEdit, FiFileText, FiTrash, FiFilter } from "react-icons/fi";

const Designation = () => {
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [status, setStatus] = useState('Active');


    const patientsData = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            date: '2015-10-01',
            status: 'Active',
            description: 'Pollen',
            designationName: 'General Cardiology',
            departmentCode: 'CAR123'
        },
        {
            id: 1,
            firstName: 'John',
            lastName: 'last',
            date: '2015-10-01',
            status: 'Inactive',
            description: 'Pollen',
            designationName: 'Medical Dermatology',
            departmentCode: 'CAR123'
        },
    ];

    const handleModal = (data = null) => {
        setDetailsModal(true);
        if (data) {
            setSelectedDetails(data);
            setIsEditMode(true);
        } else {
            setSelectedDetails(null);
            setIsEditMode(false);
        }
    };

    const closeDetailsModal = () => {
        setDetailsModal(false);
        setSelectedDetails(null);
        setIsEditMode(false);
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
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col xs="auto" className='d-flex gap-2'>
                                            <FormInput type="text" placeholder="Search..." />
                                            <Button className="custom-buttons"><FiFilter className='fs-4' /></Button>
                                            <Button className="custom-buttons"><FiFileText className='fs-4' /></Button>
                                            <Button className="custom-buttons" onClick={() => handleModal()}>New Designation</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead className="text-white">
                                            <tr>
                                                <th className='text-white'>Sr.No.</th>
                                                <th className='text-white'>Designation Name</th>
                                                <th className='text-white'>Create Date</th>
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
                                                        <td>{index + 1}</td>
                                                        <td className='text-capitalize'>
                                                            {data.designationName}
                                                        </td>
                                                        <td>{data.date}</td>
                                                        <td><Form.Switch checked /></td>
                                                        <td>
                                                            <div className='d-flex gap-2'>
                                                                <FiEdit className='fs-5' onClick={() => handleModal(data)} />
                                                                <FiTrash className='fs-5' />
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

            <Modal show={detailsModal} onHide={closeDetailsModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="w-100 text-center">
                        {isEditMode ? "Edit Designation" : " New Designation"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <Row className="mb-3">
                            <Col>
                                <p className='mb-0'>Department Name*</p>
                                <FormInput
                                    type="text"
                                    placeholder="Department Name"
                                    defaultValue={selectedDetails?.designationName || ''}
                                />
                            </Col>
                            <Col>
                                <p className='mb-0'>Re-enter Name*</p>
                                <FormInput
                                    type="text"
                                    placeholder="Department Code"
                                    defaultValue={selectedDetails?.designationName || ''}
                                />
                            </Col>
                        </Row>
                     
                    </form>
                    <div className='d-flex gap-1 justify-content-end mt-3'>
                        <Button onClick={closeDetailsModal}>Cancel</Button>
                        <Button>{isEditMode ? "Update" : "Save"}</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Designation;
