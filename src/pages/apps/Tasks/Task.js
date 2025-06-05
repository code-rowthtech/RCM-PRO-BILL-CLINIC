import { FormInput } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import { FiFileText, FiFilter, FiUploadCloud } from 'react-icons/fi';
import { IoMdClose, IoMdRefresh } from 'react-icons/io';
import { IoSearchSharp } from 'react-icons/io5';
import { MdFileDownload } from 'react-icons/md';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { getMastersDataAction } from '../../../redux/settings/action';
import { useDispatch } from 'react-redux';
import ModalTask from './ModalTask';

const Task = () => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const CategoryData = store?.getMastersDataReducer?.data1?.data?.result;
    const [search, setSearch] = useState('');
    const [show, setShow] = useState(false);

    // Dummy patient options for select
    const patientOptions = [
        { value: '1', label: 'John Doe' },
        { value: '2', label: 'Jane Smith' },
        { value: '3', label: 'Alice Johnson' },
    ];

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
                                        variant=""
                                        className="d-flex align-items-center custom-buttons text-white gap-1">
                                        <IoMdRefresh className="fs-5" /> Reset Filter
                                    </Button>
                                </Col>
                                <Col sm={6} className="d-flex align-items-center gap-2 mt-2">
                                    <Button className="custom-buttons text-white">Active</Button>
                                    <Button className="custom-buttons text-white">Inactive</Button>
                                </Col>
                                <Col sm={6} className="text-end mt-md-0 mt-sm-0 ">
                                    <Row className="mt-2 align-items-center justify-content-end">
                                        <Col xs="auto" className="d-flex gap-2">
                                            <input type="text" className="border-0 rounded-3" />
                                            <Button className="custom-buttons py-0">
                                                <FiUploadCloud className="fs-5" title='Export All' />
                                            </Button>

                                            <Button className="custom-buttons py-1" onClick={handleShow}>
                                                New Task
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Table responsive className="table-centered table-nowrap mb-0 rounded mt-3">
                                <thead className="text-white">
                                    <tr>
                                        <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                            Associated Patient
                                        </th>
                                        <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                            Title
                                        </th>
                                        <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                            Assigned By
                                        </th>
                                        <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                            Assigned To
                                        </th>
                                        <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                            Status
                                        </th>
                                        <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                            Category
                                        </th>
                                        <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                            Priority
                                        </th>
                                        <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                            Start Date
                                        </th>
                                        <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                            Due Date
                                        </th>
                                        <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-bottom">
                                        <td className="py-1" style={{ fontSize: '13px', fontWeight: '400' }}>
                                            John Doe
                                        </td>
                                        <td className="py-1" style={{ fontSize: '13px', fontWeight: '400' }}>
                                            Follow-up Call
                                        </td>
                                        <td className="py-1" style={{ fontSize: '13px', fontWeight: '400' }}>
                                            Dr. Smith
                                        </td>
                                        <td className="py-1" style={{ fontSize: '13px', fontWeight: '400' }}>
                                            Nurse Joy
                                        </td>
                                        <td className="py-1" style={{ fontSize: '13px', fontWeight: '400' }}>
                                            Pending
                                        </td>
                                        <td className="py-1" style={{ fontSize: '13px', fontWeight: '400' }}>
                                            Communication
                                        </td>
                                        <td className="py-1" style={{ fontSize: '13px', fontWeight: '400' }}>
                                            High
                                        </td>
                                        <td className="py-1" style={{ fontSize: '13px', fontWeight: '400' }}>
                                            2025-06-04
                                        </td>
                                        <td className="py-1" style={{ fontSize: '13px', fontWeight: '400' }}>
                                            2025-06-10
                                        </td>
                                        <td className="py-1" style={{ fontSize: '13px', fontWeight: '400' }}>
                                            <i
                                                className="mdi mdi-square-edit-outline cursor-pointer fs-4 text-primary"
                                                // onClick={() => handleEdit(data)}
                                            ></i>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <ModalTask show={show} handleClose={handleClose} onSubmit={handleTaskSubmit} />
            </Row>
        </>
    );
};

export default Task;
