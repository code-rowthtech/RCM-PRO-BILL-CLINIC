import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { FiUploadCloud } from 'react-icons/fi';
import { IoMdRefresh } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { getMastersDataAction } from '../../../redux/settings/action';
import { useDispatch } from 'react-redux';
import ModalTask from './ModalTask';

const Task = () => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState(true);

    const handleClose = () => {
        setShow(false);
    };
    const handleShow = () => setShow(true);

    useEffect(() => {
        dispatch(getMastersDataAction({ status: '', category: 'task-category', limit: 10, skip: '', search: '' }));
    }, [dispatch]);

    // Form submit handler for ModalTask
    const handleTaskSubmit = (data) => {
        console.log('Task Modal Data:', data);
        // Here you can add logic to update the task list, call API, etc.
        setShow(false);
    };
    const handleActiveTab = (isActive) => {
        setStatus(isActive);
    };
    return (
        <>
            <Row className="mt-2">
                <Col xs={12} className="px-0">
                    <Card className="scroll-container page-height">
                        <Card.Body className="px-2 py-2">
                            <Row>
                                <Col xs={12} md={6} lg={6} className="mb-1 d-flex gap-2">
                                    <Form.Group className="me-2" style={{ minWidth: 140 }}>
                                        <Form.Select>
                                            <option value="all">Assigned</option>
                                            <option value="all">All</option>
                                            <option value="me">Me</option>
                                            <option value="others">Others</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="me-2" style={{ minWidth: 140 }}>
                                        <Form.Select>
                                            <option value="all">Priority</option>
                                            <option value="all">All</option>
                                            <option value="high">High</option>
                                            <option value="medium">Medium</option>
                                            <option value="low">Low</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="me-2" style={{ minWidth: 140 }}>
                                        <Form.Select>
                                            <option value="all">Due Date</option>
                                            <option value="all">All</option>
                                            <option value="today">Today</option>
                                            <option value="this_week">This Week</option>
                                            <option value="overdue">Overdue</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={6} lg={6} className="mb-1 d-flex justify-content-end">
                                    <Button
                                        className="d-flex align-items-center custom-buttons text-white gap-1">
                                        <IoMdRefresh className="fs-5" /> Reset Filter
                                    </Button>
                                </Col>
                                <Col sm={6} className="d-flex align-items-center mt-2">
                                    {/* <Button className="custom-buttons text-white">Active</Button>
                                    <Button className="custom-buttons text-white">Inactive</Button> */}
                                    <Button
                                        onClick={() => handleActiveTab(true)}
                                        className={`me-md-1 active_inactive_buttons ${status ? ' text-white py-' : 'bg-white border-primary text-dark py-'
                                            }`}>
                                        Active
                                    </Button>
                                    <Button
                                        onClick={() => handleActiveTab(false)}
                                        className={`me-md-1 ms-sm-1 active_inactive_buttons text-nowrap ${!status ? ' text-white py-' : 'bg-white border-primary text-dark py-'
                                            }`}>
                                        Inactive
                                    </Button>
                                </Col>
                                <Col sm={6} className="text-end mt-md-0 mt-sm-0 ">
                                    <Row className="mt-2 align-items-center justify-content-end">
                                        <Col xs="auto" className="d-flex gap-2">
                                            <Form.Control placeholder='Search Task' onChange={(e) => setSearch(e.target.value)} type="text" />
                                            <Button className="custom-buttons py-0">
                                                <FiUploadCloud className="fs-5" title='Export All' />
                                            </Button>
                                            <Button className="custom-buttons text-nowrap py-1" onClick={handleShow}>
                                                New Task
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Table responsive className="table-centered table-nowrap mb-0 rounded mt-3">
                                <thead className="text-white">
                                    <tr>
                                        {['#', 'Title', 'Assigned By', 'Assigned To', 'Status', 'Category', 'Priority', 'Due Date', 'Action'].map((header, index) => (

                                            <th className="text-white" key={index}>
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-bottom">
                                        <td>
                                            1
                                        </td>
                                        <td>
                                            Follow-up Call
                                        </td>
                                        <td>
                                            Dr. Smith
                                        </td>
                                        <td>
                                            Nurse Joy
                                        </td>
                                        <td>
                                            Pending
                                        </td>
                                        <td>
                                            Communication
                                        </td>
                                        <td>
                                            High
                                        </td>
                                        <td>
                                            2025-06-10
                                        </td>
                                        <td>
                                            <i
                                                className="mdi mdi-square-edit-outline cursor-pointer fs-4 text-primary"
                                            ></i>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <ModalTask show={show} handleClose={handleClose} />
            </Row>
        </>
    );
};

export default Task;
