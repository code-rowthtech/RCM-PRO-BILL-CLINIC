import React, { useState, useRef, useEffect } from 'react';
import { Table, Row, Col, Button, Spinner } from 'react-bootstrap'; // Added Spinner
import { FiEdit } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { IoFilter } from 'react-icons/io5';
import { FormInput } from '../../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { getTaskAction, getTaskDetailsAction } from '../../../../redux/actions';
import UpdateAsignTask from './UpdateTasks/UpdateAssignTask';
import Paginations from '../../../../helpers/Paginations';

const AssignTask = () => {
    const [selectedStatus, setSelectedStatus] = useState('');
    const [taskId, setTaskId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const { data, loading } = store?.getTaskReducer || {}; // Extract loading state
    const taskData = data?.tasks || [];
    console.log(store?.getTaskReducer, 'taskkkkkk');
    const addTaskResponse = store?.createTaskReducer?.data?.status;
    const limit = 10;
    useEffect(() => {
        const data = {
            assignedToId: '',
            taskStatus: selectedStatus,
            priority: '',
            sortBy: '',
            page: page,
            limit: limit,
        };

        dispatch(getTaskAction(data));
    }, [dispatch, selectedStatus, page, limit]);

    useEffect(() => {
        if (addTaskResponse === 200) {
            const data = {
                assignedToId: '',
                taskStatus: selectedStatus,
                priority: '',
                sortBy: '',
                page: page,
                limit: limit,
            };
            dispatch(getTaskAction(data));
        }
    }, [addTaskResponse]);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'In Progress':
                return { backgroundColor: '#88D9EB', color: '#05668D' }; // Light Blue BG, Dark Blue Text
            case 'On Hold':
                return { backgroundColor: '#FDF88A', color: '#A68A00' }; // Light Yellow BG, Dark Yellow Text
            case 'Complete':
                return { backgroundColor: '#C0FF7F', color: '#3A7600' }; // Light Green BG, Dark Green Text
            case 'Open':
                return { backgroundColor: '#BEBDB7', color: '#4F4E4C' }; // Light Gray BG, Dark Gray Text
            default:
                return { backgroundColor: '#f8f9fa', color: '#000000' }; // Default Light Gray BG, Black Text
        }
    };

    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'Low':
                return { backgroundColor: '#88D9EB', color: '#05668D' }; // Light Blue BG, Dark Blue Text
            case 'Medium':
                return { backgroundColor: '#FDF88A', color: '#A68A00' }; // Light Yellow BG, Dark Yellow Text
            case 'High':
                return { backgroundColor: 'rgb(251 225 181)', color: 'orange' };
            default:
                return { backgroundColor: '#FFB8B8', color: 'red' }; // Default Light Gray BG, Black Text
        }
    };

    document.addEventListener('show.bs.offcanvas', (event) => {
        const button = event.relatedTarget; // Button that triggered the offcanvas
        const taskId = button?.getAttribute('data-task-id');
        console.log('Task ID:', taskId);
        setTaskId(taskId);
    });
    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    return (
        <div className="position-relative">
            <Row>
                <Col>
                    <Table responsive className="table-centered table-nowrap mb-0">
                        <thead className="text-white bg-dark">
                            <tr>
                                <th className="text-white">Associated Patient</th>
                                <th className="text-white">Title</th>
                                <th className="text-white">Assigned by</th>
                                <th className="text-white">Assigned to</th>
                                <th className="text-white">Status</th>
                                <th className="text-white">Category</th>
                                <th className="text-white">Priority</th>
                                <th className="text-white">Start Date</th>
                                <th className="text-white">Due Date</th>
                                <th className="text-white">Action</th>
                            </tr>
                        </thead>
                        {store?.getTaskReducer?.loading ? (
                            <tbody>
                                {/* ✅ Wrap the <tr> inside <tbody> */}
                                <tr>
                                    <td className="text-center" colSpan={10}>
                                        <Spinner className=" my-5 " />
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {taskData.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="text-center">
                                            <h3 className="my-5">No Tasks Found!</h3>
                                        </td>
                                    </tr>
                                ) : (
                                    taskData.map((task, index) => (
                                        <tr key={index}>
                                            <td className="text-capitalize">
                                                {task?.associatedPatientId?.firstName || 'N/A'}
                                                {task?.associatedPatientId?.lastName}
                                            </td>
                                            <td className="text-capitalize">{task?.taskTitle}</td>
                                            <td className="text-capitalize">
                                                {task?.assignedById?.firstName} {task?.assignedById?.lastName}
                                            </td>
                                            <td className="text-capitalize">
                                                {task?.assignedToId?.firstName} {task?.assignedToId?.lastName || ' '}
                                            </td>
                                            {/* <td>
                                                <span className="badge d-flex align-items-center justify-content-center" style={{ backgroundColor: getStatusColor(task?.taskStatus), color: "#fff", width: '5vw', height: '2vh' }}>
                                                    {task?.taskStatus}
                                                </span>
                                            </td> */}
                                            <td>
                                                <span
                                                    className="badge d-flex justify-content-center align-items-center"
                                                    style={{
                                                        ...getStatusStyles(task?.taskStatus), // Spreads existing styles
                                                        width: '5vw', // Sets width to 5% of viewport width
                                                        height: '2vh', // Sets height to 2% of viewport height
                                                    }}>
                                                    {task?.taskStatus}
                                                </span>
                                            </td>

                                            <td>{task?.category}</td>
                                            <td>
                                                <span
                                                    className="badge d-flex justify-content-center align-items-center"
                                                    style={{
                                                        ...getPriorityStyles(task?.priority), // Apply existing styles
                                                        width: '5vw', // Viewport width for responsiveness
                                                        height: '2vh', // Viewport height
                                                    }}>
                                                    {task?.priority}
                                                </span>
                                            </td>

                                            <td>
                                                {task?.startDate
                                                    ? new Date(task?.startDate).toLocaleDateString('en-GB')
                                                    : 'N/A'}
                                            </td>
                                            <td>
                                                {task?.dueDate
                                                    ? new Date(task?.dueDate).toLocaleDateString('en-GB')
                                                    : 'N/A'}
                                            </td>
                                            <td>
                                                <FiEdit
                                                    className="fs-4 ms-2 cursor-pointer text-black"
                                                    data-bs-toggle="offcanvas"
                                                    data-bs-target="#offcanvasRightUpdate"
                                                    aria-controls="offcanvasRight"
                                                    data-task-id={task?._id} // Passing task ID
                                                    onClick={() => {
                                                        const data = {
                                                            id: task?._id,
                                                        };
                                                        dispatch(getTaskDetailsAction(data));
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        )}
                    </Table>
                </Col>
            </Row>
            {/* Pagination Section */}
            <Row>
                <Col className="d-flex justify-content-end">
                    <Paginations
                        currentPage={page}
                        totalPages={store?.getTaskReducer?.data?.totalPages}
                        onPageChange={handlePageChange}
                    />
                </Col>
            </Row>
            <div
                className="offcanvas offcanvas-end"
                // style={{ width: '500px!important' }}
                tabIndex="-1"
                id="offcanvasRightUpdate"
                aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header py-1 " style={{ borderBottom: '2px solid grey' }}>
                    <h4 id="offcanvasRightLabel">Edit Assign Task</h4>
                    <button
                        type="button"
                        className="btn-close text-danger"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"></button>
                </div>

                <div className="offcanvas-body">
                    <UpdateAsignTask taskId={taskId} />
                </div>
            </div>
        </div>
    );
};

export default AssignTask;
