import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { FiFileText, FiUploadCloud } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import ModalTask from './ModalTask';
import { getUserTasksAction } from '../../../redux/actions';
import Spinner from '../../../constants/Spinner';
import Paginations from '../../../helpers/Paginations';
import { FormInput } from '../../../components';
import { IoMdClose } from 'react-icons/io';
import { IoSearchSharp } from 'react-icons/io5';

const Task = () => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [show, setShow] = useState(false);
    const [priority, setPriority] = useState('');
    const [status, setStatus] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [skip, setSkip] = useState(1);
    const [taskData, setTaskData] = useState(null);
    const createTaskResponse = store?.createUserTasksReducer?.data?.status;
    const updateTaskResponse = store?.updateUserTasksReducer?.data?.status;
    const userTasks = store?.getUserTasksReducer?.data;

    useEffect(() => {
        if (createTaskResponse === 201 || updateTaskResponse === 200) {
            handleClose();
            dispatch(getUserTasksAction({ status: '', skip: skip }));
        }
    }, [createTaskResponse, updateTaskResponse]);

    const handleClose = () => {
        setShow(false);
        setTaskData(null);
    };
    const handleShow = () => setShow(true);

    useEffect(() => {
        dispatch(
            getUserTasksAction({ status: status, skip: skip, priority: priority, dueDate: dueDate, search: search })
        );
    }, [dispatch, skip, priority, status, search]);

    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };

    const getPriorityClass = (priority) => {
        switch ((priority || '').toLowerCase()) {
            case 'routine':
                return 'text-secondary'; // Gray
            case 'urgent':
                return 'text-warning'; // Orange/Yellow
            case 'asap':
                return 'text-primary'; // Blue
            case 'stat':
                return 'text-danger'; // Red
            default:
                return 'text-muted'; // Default muted/gray
        }
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
                                        <Form.Select
                                            className="text-capitalize"
                                            onChange={(e) => setStatus(e.target.value)}>
                                            <option value="">All Statuses</option>
                                            {[
                                                'draft',
                                                'requested',
                                                'received',
                                                'accepted',
                                                'rejected',
                                                'ready',
                                                'cancelled',
                                                'in-progress',
                                                'on-hold',
                                                'failed',
                                                'completed',
                                                'entered-in-error',
                                            ]?.map((status, index) => (
                                                <option className="text-capitalize" value={status} key={index}>
                                                    {status}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="me-2" style={{ minWidth: 140 }}>
                                        <Form.Select
                                            onChange={(e) => setPriority(e.target.value)}
                                            className="text-capitalize">
                                            <option value="">All Priorities</option>
                                            {['routine', 'urgent', 'asap', 'stat']?.map((priority, index) => (
                                                <option className="text-capitalize" value={priority} key={index}>
                                                    {priority === 'stat'
                                                        ? 'Stat (Immediate action required)'
                                                        : priority}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={6} lg={6} className="mb-1 d-flex justify-content-end gap-2">
                                    <div
                                        className="input_search_box position-relative"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            borderRadius: '4px',
                                            backgroundColor: '#e8f0fe',
                                            padding: '0px 5px',
                                            minWidth: 180,
                                        }}>
                                        <FormInput
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search..."
                                            className="pe-4"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                flex: 1,
                                                backgroundColor: '#ccc',
                                                paddingRight: 30,
                                            }}
                                        />
                                        {search ? (
                                            <IoMdClose
                                                style={{
                                                    fontSize: '1.2rem',
                                                    color: 'lightgray',
                                                    position: 'absolute',
                                                    right: 10,
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => {
                                                    setSearch('');
                                                }}
                                            />
                                        ) : (
                                            <IoSearchSharp
                                                style={{
                                                    fontSize: '1.2rem',
                                                    color: 'lightgray',
                                                    position: 'absolute',
                                                    right: 10,
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                }}
                                            />
                                        )}
                                    </div>
                                    <Button className="custom-buttons py-0">
                                        <FiUploadCloud className="fs-5" title="Export All" />
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
                                            {[
                                                '#',
                                                'Title',
                                                'Assigned By',
                                                'Assigned To',
                                                'Status',
                                                'Category',
                                                'Priority',
                                                'Due Date',
                                                'Action',
                                            ].map((header, index) => (
                                                <th className="text-white" key={index}>
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {store?.getUserTasksReducer?.loading ? (
                                            <tr>
                                                <td colSpan={9} className="text-center py-5">
                                                    <Spinner />
                                                </td>
                                            </tr>
                                        ) : userTasks?.tasks?.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="text-center py-5">
                                                    <div className="d-flex flex-column align-items-center">
                                                        <FiFileText size={44} className="text-muted mb-0 mt-2" />
                                                        <h5>No tasks found</h5>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            userTasks?.tasks?.map((task, index) => (
                                                <tr className="border-bottom">
                                                    <td>{index + 1}</td>
                                                    <td>{task?.description}</td>
                                                    <td className="text-capitalize">
                                                        {task?.assignedById?.name?.text}
                                                    </td>
                                                    <td className="text-capitalize">
                                                        {task?.assignedToId?.name?.text || '-'}
                                                    </td>
                                                    <td className="text-capitalize">{task?.status}</td>
                                                    <td className="text-capitalize">{task?.category || '-'}</td>
                                                    <td
                                                        className={`text-capitalize fw-semibold ${getPriorityClass(task?.priority)}`}>
                                                        {task?.priority || '-'}
                                                    </td>
                                                    <td>
                                                        {task?.dueDate
                                                            ? new Date(task?.dueDate).toISOString()?.split('T')?.[0]
                                                            : '-'}
                                                    </td>
                                                    <td>
                                                        <i
                                                            onClick={() => {
                                                                setShow(true);
                                                                setTaskData(task);
                                                            }}
                                                            className="mdi mdi-square-edit-outline cursor-pointer fs-4 text-primary"></i>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
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
                <ModalTask taskId={taskData?._id} show={show} handleClose={handleClose} />
            </Row>
        </>
    );
};

export default Task;
