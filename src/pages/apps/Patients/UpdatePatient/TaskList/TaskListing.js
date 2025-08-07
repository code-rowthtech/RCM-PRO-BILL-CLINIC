import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, OverlayTrigger, Row, Spinner, Table } from 'react-bootstrap';
import { FiFileText, FiUploadCloud } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { IoMdClose } from 'react-icons/io';
import { IoSearchSharp } from 'react-icons/io5';
import { getUserTasksAction } from '../../../../../redux/actions';
import Paginations from '../../../../../helpers/Paginations';
import { FormInput } from '../../../../../components';
import ModalTask from '../../../Tasks/ModalTask';

const TaskListing = () => {
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
           
            <div className="scroll-container" style={{ height: '69vh', overflowY: 'auto' }}>
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
                                    <td title={task?.description} className="cursor-pointer">
                                        {task?.description?.length > 30
                                            ? task?.description?.slice(0, 29) + '...'
                                            : task?.description}
                                    </td>
                                    <td className="text-capitalize">{task?.assignedById?.name?.text}</td>
                                    <td className="text-capitalize">{task?.assignedToId?.name?.text || '-'}</td>
                                    <td className="text-capitalize">{task?.status}</td>
                                    <td className="text-capitalize">{task?.category || '-'}</td>
                                    <td className={`text-capitalize fw-semibold ${getPriorityClass(task?.priority)}`}>
                                        {task?.priority || '-'}
                                    </td>
                                    <td>
                                        {task?.dueDate ? new Date(task?.dueDate).toISOString()?.split('T')?.[0] : '-'}
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
            <ModalTask taskId={taskData?._id} show={show} handleClose={handleClose} />
        </>
    );
};

export default TaskListing;
