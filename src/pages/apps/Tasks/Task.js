import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { FiUploadCloud } from 'react-icons/fi';
import { IoMdRefresh } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { getMastersDataAction } from '../../../redux/settings/action';
import { useDispatch } from 'react-redux';
import ModalTask from './ModalTask';
import { getUserTasksAction } from '../../../redux/actions';
import Spinner from '../../../constants/Spinner';
import Paginations from '../../../helpers/Paginations';

const Task = () => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState(true);
    const [skip, setSkip] = useState(1)
    const createTaskResponse = store?.createUserTasksReducer?.data?.status;
    const userTasks = store?.getUserTasksReducer?.data;
    console.log('User Tasks:', userTasks);

    useEffect(() => {
        if (createTaskResponse === 201) {
            handleClose();
            dispatch(getUserTasksAction({ status: '', skip: skip }))
        }
    }, [createTaskResponse])

    const handleClose = () => {
        setShow(false);
    };
    const handleShow = () => setShow(true);

    useEffect(() => {
        dispatch(getUserTasksAction({ status: '', skip: skip }))
    }, [dispatch, skip]);

    const handleActiveTab = (isActive) => {
        setStatus(isActive);
    };
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
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
                                <Col xs={12} md={6} lg={6} className="mb-1 d-flex justify-content-end gap-2">
                                    <Form.Control placeholder='Search Task' className='w-25' onChange={(e) => setSearch(e.target.value)} type="text" />
                                    <Button className="custom-buttons py-0">
                                        <FiUploadCloud className="fs-5" title='Export All' />
                                    </Button>
                                    <Button className="custom-buttons text-nowrap py-1" onClick={handleShow}>
                                        New Task
                                    </Button>
                                </Col>
                            </Row>
                            <div className="scroll-container mt-2" style={{ height: '69vh', overflowY: 'auto' }}>
                                <Table responsive className="table-centered table-nowrap mb-0 rounded mt-2">
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
                                        {store?.getUserTasksReducer?.loading ?
                                            <tr>
                                                <td colSpan={9} className='text-center py-5'>
                                                    <Spinner />
                                                </td>
                                            </tr>
                                            :
                                            userTasks?.tasks?.length === 0 ?
                                                <tr>
                                                    <td colSpan={9} className='text-center py-5'>
                                                        No tasks found.
                                                    </td>
                                                </tr>
                                                :
                                                userTasks?.tasks?.map((task, index) => (
                                                    <tr className="border-bottom">
                                                        <td>
                                                            {index + 1}
                                                        </td>
                                                        <td>
                                                            {task?.description}
                                                        </td>
                                                        <td className='text-capitalize'>
                                                            {task?.assignedById?.name?.text}
                                                        </td>
                                                        <td className='text-capitalize'>
                                                            {task?.assignedToId?.name?.text || '-'}
                                                        </td>
                                                        <td className='text-capitalize'>
                                                            {task?.status}
                                                        </td>
                                                        <td className='text-capitalize'>
                                                            {task?.category || '-'}
                                                        </td>
                                                        <td className='text-capitalize'>
                                                            {task?.priority || '-'}
                                                        </td>
                                                        <td>
                                                            {task?.dueDate ? new Date(task?.dueDate).toISOString()?.split('T')?.[0] : '-'}
                                                        </td>
                                                        <td>
                                                            <i
                                                                className="mdi mdi-square-edit-outline cursor-pointer fs-4 text-primary"
                                                            ></i>
                                                        </td>
                                                    </tr>
                                                ))
                                        }

                                    </tbody>
                                </Table>
                            </div>

                            <div className="col-12">
                                <div className="mt-2 d-flex justify-content-end">
                                    <Paginations
                                        currentPage={skip}
                                        totalPages={userTasks?.pagination?.pages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <ModalTask show={show} handleClose={handleClose} />
            </Row>
        </>
    );
};

export default Task;
