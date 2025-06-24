import { FormInput } from 'lucide-react';
import React, { useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { FiFileText, FiFilter } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { IoSearchSharp } from 'react-icons/io5';

const Templates = () => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(true);
    const [skip, setSkip] = useState(1);
    const handleStatusChange = (data) => {
        setStatus(data);
        setSearch('');

    };
    return (
        <Row className='mt-2'>
            <Col xs={12} className='px-0'>
                <Card className="scroll-container page-height">
                    <Card.Body>
                        <Row className="mb-2">
                            <Col sm={6}>
                                <Button
                                    variant={status === true ? 'outlined' : ''}
                                    onClick={() => handleStatusChange(true)}
                                    className={`active_inactive_buttons ${status === true ? 'text-white' : 'bg-white border-primary text-dark'} me-2`}
                                >
                                    Active
                                </Button>
                                <Button
                                    variant={status === false ? 'outlined' : ''}
                                    onClick={() => handleStatusChange(false)}
                                    className={` active_inactive_buttons ${status === false ? 'text-white' : 'bg-white border-primary text-dark'} me-2`}
                                >
                                    Inactive
                                </Button>
                            </Col>
                            <Col sm={6} className='text-end mt-md-0 mt-2 mt-sm-0'>
                                <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                    <Col xs="auto" className='d-flex gap-2'>
                                        <Button className="custom-buttons py-0"  ><FiFilter className='fs-5' /></Button>
                                        <Button className="custom-buttons py-0"><FiFileText className='fs-5' /></Button>
                                        <Button className="custom-buttons py-1">
                                            New Template
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Table responsive className="table-centered table-nowrap mb-0 rounded">
                            <thead className="text-white">
                                <tr>
                                    <th className='text-white py-2'>S.No.</th>
                                    <th className='text-white py-2'>Department Name</th>
                                    <th className='text-white py-2'>Description</th>
                                    <th className='text-white py-2'>Created Date</th>
                                    <th className='text-white py-2'>Status</th>
                                    <th className='text-white py-2'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-bottom">
                                    <td>1</td>
                                    <td>Sample Department</td>
                                    <td>Sample description...</td>
                                    <td>2023-01-01</td>
                                    <td>
                                        <Form.Switch checked />
                                    </td>
                                    <td>
                                        <i className="mdi mdi-square-edit-outline cursor-pointer fs-4 text-primary"></i>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>

                        <Row>
                            <Col className='mt-2 d-flex justify-content-end'>
                                {/* Pagination would go here */}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>

            <Modal centered show={false}>
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2">
                        <Col sm={11} className='text-center'><h4>New Department</h4></Col>
                        <Col sm={1}><IoMdClose className="fs-4 cursor-pointer" /></Col>
                    </Row>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Department Name <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Department Name"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Re-Enter Name <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Re-enter Department Name"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter description"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Modal.Footer>
                            <Button className="custom-buttons">
                                Submit
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </Row>
    );
};

export default Templates;