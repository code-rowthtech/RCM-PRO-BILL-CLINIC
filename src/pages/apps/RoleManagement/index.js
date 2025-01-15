import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Pagination, Row, Table } from 'react-bootstrap';
import Spinner from '../../../constants/Spinner';
import { FormInput } from '../../../components';
import { FiEdit, FiFileText, FiFilter, FiTrash } from 'react-icons/fi';
import { IoMdClose, IoMdEye } from 'react-icons/io';
import { FaEye, FaEyeSlash, FaStarOfLife } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ToastHandle from '../../../helpers/ToastMessage';
import { encryptMessage } from '../../../cryptoUtils';
import AddRole from './AddRole';
import { deleteRolesAction, getRolesAction, getUserAction, stateEmptydAction, updateRolesAction } from '../../../redux/actions';
import RoleUpdate from './RoleUpdate';
import Paginations from '../../../helpers/Paginations';

function formatDate(dateString) {
    const date = new Date(dateString);
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const day = date.getDate();
    const suffix = ["th", "st", "nd", "rd"][(day % 10 > 3 || Math.floor(day % 100 / 10) === 1) ? 0 : day % 10];
    return `${formattedTime} ${day}${suffix} ${formattedDate.split(' ')[1]} ${date.getFullYear()}`;
}

const RoleManagement = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state)
    const roleData = store?.getRolesDataReducer?.data

    const roleDataLoading = store?.getRolesDataReducer?.loading
    const deleteSuccess = store?.deleteRolesDataReducer?.data?.status
    console.log({ deleteSuccess })
    const [smShow, setSmShow] = useState(false);
    const [detailModal, setDetailModal] = useState(false);

    const [password, setPassword] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [timeoutId, setTimeoutId] = useState(null);
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [addDepartmentModal, setAddDepartmentModal] = useState(false);
    const [updateDepartmentModal, setUpdateDepartmentModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [status, setStatus] = useState(true)

    const [skip, setSkip] = useState(1)
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId
    const [searchQuery, setSearchQuery] = useState('');
    const [userDetails, setUserDetails] = useState([])



    useEffect(() => {
        dispatch(
            getRolesAction({
                clinicId: clinicId,
                limit: 10,
                search: searchQuery,
                page: skip,
                status: status,
            })
        );
    }, [dispatch, status, searchQuery, skip]);


    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === '1234') {
            setIsPasswordCorrect(true);
            setSmShow(false);
            ToastHandle("Password success", "success");

            const id = setTimeout(() => {
                setIsPasswordCorrect(false);
            }, 300000);

            setTimeoutId(id);
        } else {
            ToastHandle("Password incorrect", "danger");
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);  // Clean up the timeout when component unmounts
            }
        };
    }, [timeoutId]);

    const openEditModal = (user) => {
        setCurrentUser(user);
        setUpdateDepartmentModal(true);
    };



    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setSkip(1);

    };
    const deleteHandle = (id) => {
        dispatch(deleteRolesAction(id))


    }
    useEffect(() => {
        if (deleteSuccess === 200) {
            dispatch(stateEmptydAction());

        }
    }, [deleteSuccess])

    const handleStatusChange = (isActive) => {
        setStatus(isActive);
        setSearchQuery('');
    };

    const handleUpdateDoctorStatus = (data) => {
        const payload = {
            id: data?._id,
            status: !data?.status,
        };
        dispatch(updateRolesAction({ key: encryptMessage(payload) }));
        console.log({ status })

    };

    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };


    return (
        <Row className='mt-2'>
            <Col xs={12}>
                <Card>
                    <Card.Body className='' style={{ height: '100vh' }}>
                        <Row className="mb-2">
                            <Col sm={6}>
                                <Button
                                    variant={status === false ? 'outlined' : ''}
                                    onClick={() => handleStatusChange(true)}
                                    className={`${status ? 'custom-buttons text-white ' : 'bg-none border-primary text-dark'} me-2 py-1`}
                                    style={{ fontSize: '13px', fontWeight: '400', height: '30px' }}
                                >
                                    Active
                                </Button>
                                <Button
                                    variant={status === true ? 'outlined' : ''}
                                    onClick={() => handleStatusChange(false)}
                                    className={`${!status ? 'custom-buttons text-white' : 'bg-none border-primary text-dark'} me-2 py-1`}
                                    style={{ fontSize: '13px', fontWeight: '400', height: '30px' }}
                                >
                                    Inactive
                                </Button>
                            </Col>
                            {/* <Col sm={6}>
                                <Button className="custom-buttons">
                                    Receptionist
                                </Button>
                            </Col> */}
                            <Col sm={6} className='text-end'>
                                <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between">
                                    <Col xs="auto" className='d-flex gap-2'>
                                        <FormInput
                                            type="text"
                                            placeholder="Search..."
                                            value={searchQuery}  // Bind the input to the searchQuery state
                                            onChange={handleSearchChange}
                                            style={{ height: '30px' }}
                                        />
                                        <Button onClick={() => setAddDepartmentModal(true)} className="custom-buttons py-1" style={{ fontSize: '13px', height: '30px', fontWeight: '400' }}>
                                            Add User
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table responsive className="table-centered table-nowrap mb-0  rounded"
                                    style={{ height: roleData?.length === 0 ? '100vh' : 'auto' }}>
                                    <thead className="text-white">
                                        <tr>
                                            <th className="text-white py-2" style={{ fontSize: '13px' }}>Sr. No.</th>
                                            <th className="text-white py-2" style={{ fontSize: '13px' }}>Name</th>
                                            <th className="text-white py-2" style={{ fontSize: '13px' }}>Phone</th>
                                            <th className="text-white py-2" style={{ fontSize: '13px' }}>Username</th>
                                            <th className="text-white py-2" style={{ fontSize: '13px' }}>Joining Date</th>

                                            <th className="text-white py-2" style={{ fontSize: '13px' }}>Status</th>
                                            <th className="text-white py-2" style={{ fontSize: '13px' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roleDataLoading ? (
                                            // Show a loading spinner or placeholder row while data is being fetched
                                            <tr>
                                                <td colSpan={6} className="text-center">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : Array.isArray(roleData?.users) && roleData?.users.length > 0 ? (
                                            // Render data rows when available
                                            roleData?.users.map((data, index) => (
                                                <tr key={index} className="border-bottom">
                                                    <td className='py-1 ' style={{ fontSize: '14px', fontWeight: '400' }}>{index + 1}</td>
                                                    <td className='py-1' style={{ fontSize: '14px', fontWeight: '400' }}>
                                                        {data?.firstName?.charAt(0).toUpperCase() + data?.firstName?.slice(1)}
                                                    </td>
                                                    <td className='py-1 ' style={{ fontSize: '14px', fontWeight: '400' }}>+1 {data?.phone}</td>
                                                    <td className='py-1 ' style={{ fontSize: '14px', fontWeight: '400' }}>{data?.email}</td>
                                                    <td className='py-1 ' style={{ fontSize: '14px', fontWeight: '400' }}>
                                                        {data?.joiningDate ? new Date(data.joiningDate).toLocaleDateString('en-GB') : ''}
                                                    </td>
                                                    <td className='py-1 ' style={{ fontSize: '14px', fontWeight: '400' }}>
                                                        <Form.Switch onClick={() => handleUpdateDoctorStatus(data)} checked={data?.status === true} />
                                                    </td>
                                                    <td className='py-1 ' style={{ fontSize: '14px', fontWeight: '400' }}>
                                                        <div className="d-flex gap-2">
                                                            <FiEdit
                                                                className="fs-4 cursor-pointer"
                                                                onClick={() => openEditModal(data)}
                                                            />
                                                            {/* Additional actions */}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            // Show "No Data Found" when no data is available
                                            <tr>
                                                <td colSpan={6} className="text-center">
                                                    <h3 className="my-5">No Data Found</h3>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </Table>





                            </Col>
                        </Row>
                        <Row>

                            <Col className='mt-2 d-flex justify-content-end'>
                                <Paginations
                                    currentPage={skip}
                                    totalPages={roleData?.pagination?.totalPages || 1}
                                    onPageChange={(pageNumber) => handlePageChange(pageNumber)}
                                />

                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
            <Modal
                show={detailModal}
                onHide={() => setDetailModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Table bordered>
                        <thead>
                            <tr>
                                <th>Field</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Name</td>
                                <td>{userDetails?.firstName} {userDetails?.lastName}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{userDetails?.email}</td>
                            </tr>
                            <tr>
                                <td>Phone</td>
                                <td>{userDetails?.phone}</td>
                            </tr>
                            <tr>
                                <td>Status</td>
                                <td>{userDetails?.status ? "Active" : "Inactive"}</td>
                            </tr>
                            {/* Add more fields as needed */}
                        </tbody>
                    </Table>

                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setDetailModal(false);
                            setCurrentUser('');
                        }}
                    >
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>
            <AddRole show={addDepartmentModal} setAddDepartmentModal={setAddDepartmentModal} setCurrentUser={setCurrentUser} setUpdateDepartmentModal={setUpdateDepartmentModal} />
            <RoleUpdate show={updateDepartmentModal} currentUser={currentUser} setUpdateDepartmentModal={setUpdateDepartmentModal} setAddDepartmentModal={setAddDepartmentModal} setCurrentUser={setCurrentUser} />
        </Row>
    );
};

export default RoleManagement;
