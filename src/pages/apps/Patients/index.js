import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FormInput } from '../../../components';
import { FiEdit, FiFileText, FiTrash } from "react-icons/fi";
import { FiFilter } from "react-icons/fi";
import { FaEye, FaEyeSlash, FaStarOfLife } from 'react-icons/fa';
import ToastHandle from '../../../helpers/ToastMessage';

const Patients = () => {
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [status, setStatus] = useState('Active');
    const [isVisible, setIsVisible] = useState(false);
    const [smShow, setSmShow] = useState(false);
    const [password, setPassword] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [timeoutId, setTimeoutId] = useState(null);
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

    const handleShowDetails = () => {
        setSmShow(true);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === '1234') {
            setIsPasswordCorrect(true);
            setSmShow(false);
            setIsVisible(true);
            ToastHandle("password success", "success");

            const id = setTimeout(() => {
                setIsPasswordCorrect(false);  
                setIsVisible(false);        
            }, 300000); 

            setTimeoutId(id);  
        } else {
            ToastHandle("password incorrect", "danger");
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);  // Clean up the timeout when component unmounts
            }
        };
    }, [timeoutId]);

    const toggleVisibility = () => {
        if (isPasswordCorrect) {
            setIsVisible(!isVisible);
        } else {
            handleShowDetails();
        }    };
    const patientsData = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            insuranceProvider: 'HealthCare Inc.',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
            status: 'Active',
            lastVisit: ' 26th sep, 2023',
            nextVisit: ' 26th sep, 2024',
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
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            insuranceProvider: 'HealthCare Inc.',
            email: 'jane.smith@example.com',
            phone: '987-654-3210',
            status: 'Inactive',
            lastVisit: ' 26th sep, 2023',
            nextVisit: ' 26th sep, 2024',
            address: {
                street: '456 Elm St',
                city: 'Shelbyville',
                state: 'IL',
                zipCode: '62702'
            },
            gender: 'Female',
            insurancePlan: 'Basic',
            insurancePolicyNumber: '987654321',
            allergies: 'None',
            emergencyContacts: [{ phone: '123-456-7890' }]
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
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                        <Col xs="auto" className='d-flex gap-2'>
                                            <FormInput type="text" placeholder="Search..." />
                                            {/* <Button className="custom-buttons">
                                                <FiFilter className='fs-4' />
                                            </Button> */}
                                            {/* <Button className="custom-buttons">
                                                <FiFileText className='fs-4' />
                                            </Button> */}
                                            <Button as={Link} to='/apps/patients/new-patient' className="custom-buttons">
                                                New Patient
                                            </Button>
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
                                                <th className='text-white'>Patients Name</th>
                                                <th className='text-white'>Phone</th>
                                                {/* <th className='text-white'>Email</th> */}
                                                {/* <th className='text-white'>Status</th> */}
                                                <th className='text-white'>Last Visit</th>
                                                <th className='text-white'>Next Visit</th>
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
                                                    <tr key={data.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{data.firstName} {data.lastName}</td>
                                                        <td className="">
                                                        {data.phone}
                                                        </td>
                                                        {/* <td>{data.email}</td> */}
                                                        <td>{data.lastVisit}</td>
                                                        <td>{data.nextVisit}</td>

                                                        {/* <td>{data.status}</td> */}
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
            <Modal
                size="sm"
                show={smShow}
                centered
                onHide={() => setSmShow(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Body className="rounded-4 p-3">
                    <Form onSubmit={handlePasswordSubmit}>
                        <Form.Group controlId="password" className="text-center my-2">
                            <Form.Label className='mb-2'>View Phone Number</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Row className="mt-2">
                            <Col sm={12} className="text-center mt-2">
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                                <p className='fw-bold mt-2'>Show the number for 5 min only</p>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
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

export default Patients;


