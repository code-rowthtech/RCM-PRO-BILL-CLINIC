import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../../constants/Spinner';
import Paginations from '../../../../helpers/Paginations';
import CreateRoleSetting from './CreateRoleSetting';
import UpdateRoleSetting from './UpdateRoleSetting';
import { encryptMessage } from '../../../../cryptoUtils';
import { FormInput } from '../../../../components';
import {
    getRoleDataAction,
    updateRoleDataAction,
} from '../../../../redux/actions';
import { IoSearchSharp, IoClose } from 'react-icons/io5';

const RoleSetting = () => {
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [skip, setSkip] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(true);
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const decryptedRolesData = store?.getRoleDataReducer?.data?.roles;
    const rolePagination = store?.getRoleDataReducer?.data;

    const updateSuccess = store?.updateRoleDataReducer?.data?.status;
    const createSuccess = store?.createRoleDataReducer?.data?.status;
    const handleClosemodal = () => {
        setShowModal(false);
    };
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    useEffect(() => {
        dispatch(
            getRoleDataAction({
                clinicId: clinicId,
                limit: 10,
                search: search,
                createdById: '',
                page: skip,
                status: status,
            })
        );
    }, [dispatch, skip, search, status, clinicId]);

    useEffect(() => {
        if (updateSuccess === 200) {
            handleClosemodal();
            closeUpdateModal();
            setShowUpdateModal(false);
            setShowModal(false);
            dispatch(
                getRoleDataAction({
                    clinicId: clinicId,
                    limit: 10,
                    search: search,
                    createdById: '',
                    page: skip,
                    status: status,
                })
            );
        }
    }, [updateSuccess]);

    const [dataToUpdate, setDataToUpdate] = useState(null);

    const closeUpdateModal = () => {
        setShowUpdateModal(false);
        setDataToUpdate(null);
    };

    const handleUpdateDoctorStatus = (data) => {
        const payload = {
            id: data?._id,
            status: !data?.status,
        };
        dispatch(updateRoleDataAction({ key: encryptMessage(payload) }));
        dispatch(
            getRoleDataAction({
                clinicId: clinicId,
                limit: 10,
                search: search,
                createdById: '',
                page: skip,
                status: status,
            })
        );
    };
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };
    const handleStatusChange = (data) => {
        setStatus(data);
        setSearch('');
    };

    const [expandedRowIndex, setExpandedRowIndex] = useState(null);

    const toggleRow = (index) => {
        setExpandedRowIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <div>
            <Row className="mt-2">
                <Col xs={12} className="px-0">
                    <Card className="scroll-container page-height">
                        <Card.Body>
                            <Row className="mb-2 d-flex justify-content-between">
                                <Col xs={6}>
                                    <Button
                                        variant={status === true ? 'outlined' : ''}
                                        onClick={() => handleStatusChange(true)}
                                        className={`active_inactive_buttons ${status === true ? 'text-white' : 'bg-white border-primary text-dark'
                                            } me-2 py-1`}>
                                        Active
                                    </Button>

                                    <Button
                                        variant={status === false ? 'outlined' : ''}
                                        onClick={() => handleStatusChange(false)}
                                        className={`active_inactive_buttons ${status === false ? 'text-white' : 'bg-white border-primary text-dark'
                                            } me-2 py-1`}>
                                        Inactive
                                    </Button>
                                </Col>
                                <Col xs={6}>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-end">
                                        <Col xs="auto" className="d-flex gap-2">
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
                                                    placeholder='Search...'
                                                    onChange={(e) => {
                                                        setSearch(e.target.value);
                                                        setSkip(1);
                                                        dispatch(getRoleDataAction({
                                                            clinicId: clinicId,
                                                            limit: 10,
                                                            search: e.target.value,
                                                            createdById: '',
                                                            page: 1,
                                                            status: status,
                                                        }));
                                                    }}
                                                    className="input_search_box pe-4"
                                                    style={{
                                                        border: 'none',
                                                        outline: 'none',
                                                        flex: 1,
                                                        backgroundColor: '#ccc',
                                                        paddingRight: 30,
                                                    }}
                                                />
                                                {search ? (
                                                    <IoClose
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
                                                            setSkip(1);
                                                            dispatch(getRoleDataAction({
                                                                clinicId: clinicId,
                                                                limit: 10,
                                                                search: '',
                                                                createdById: '',
                                                                page: 1,
                                                                status: status,
                                                            }));
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

                                            <Button
                                                className="custom-buttons py-1 d-none d-md-block"
                                                onClick={() => setShowModal(true)}>
                                                Add New Role
                                            </Button>
                                            <Button
                                                className="custom-buttons d-md-none py-1"
                                                onClick={() => setShowModal(true)}>
                                                <span className="uil-plus"></span>
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <CreateRoleSetting show={showModal} closeModal={handleClosemodal} />
                                <UpdateRoleSetting
                                    show={showUpdateModal}
                                    closeModal={closeUpdateModal}
                                    data={dataToUpdate}
                                />
                            </Row>
                            <Row>
                                <Col className="h-100">
                                    <Table
                                        responsive
                                        className="table-centered table-nowrap mb-0 rounded"
                                        style={{
                                            height: decryptedRolesData?.length === 0 ? '76vh' : 'auto',
                                        }}>
                                        <thead className="text-white">
                                            <tr key="">
                                                <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                                    S.no
                                                </th>
                                                <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                                    Name
                                                </th>
                                                <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                                    Description
                                                </th>
                                                <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                                    Status
                                                </th>
                                                <th className="text-white py-2" style={{ fontSize: '13px' }}>
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store?.getRoleDataReducer?.loading ? (
                                                <tr key="">
                                                    <td colSpan={7} className="py-5 text-center">
                                                        <Spinner />
                                                    </td>
                                                </tr>
                                            ) : decryptedRolesData?.length > 0 ? (
                                                decryptedRolesData?.map((data, index) => (
                                                    <React.Fragment key={index}>
                                                        <tr className="cursor-pointer">
                                                            <td
                                                                className="py-1"
                                                                style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                {index + 1}
                                                            </td>
                                                            <td
                                                                className="cursor-pointer py-1"
                                                                style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                <span
                                                                    data-bs-toggle="tooltip"
                                                                    title={
                                                                        'Permissions' +
                                                                        ' : ' +
                                                                        data?.permissions
                                                                            ?.map((permission) => permission?.name)
                                                                            .join(', ') || ''
                                                                    }
                                                                    className="d-inline-block mt-1 text-truncate text-capitalize">
                                                                    {data?.name?.charAt(0).toUpperCase() +
                                                                        data?.name?.slice(1)}
                                                                </span>
                                                            </td>
                                                            <td
                                                                className="py-1"
                                                                style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                <span
                                                                    className="text-truncate cursor-pointer"
                                                                    title={data?.description}>
                                                                    {data?.description
                                                                        ? data?.description.length > 50
                                                                            ? data?.description.slice(0, 49) + '...'
                                                                            : data?.description
                                                                        : 'N/A'}
                                                                </span>
                                                            </td>
                                                            <td
                                                                className="py-1"
                                                                style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                <Form.Switch
                                                                    className={
                                                                        data?.status === true ? 'custom-active' : ''
                                                                    }
                                                                    onClick={() => handleUpdateDoctorStatus(data)}
                                                                    checked={data?.status === true}
                                                                />
                                                            </td>
                                                            <td
                                                                className="py-1"
                                                                style={{ fontSize: '13px', fontWeight: '400' }}>
                                                                <Link
                                                                    to="#"
                                                                    className="action-icon"
                                                                    onClick={() => {
                                                                        setShowUpdateModal(true);
                                                                        setDataToUpdate(data);
                                                                    }}>
                                                                    <i className="mdi mdi-square-edit-outline"></i>
                                                                </Link>
                                                                <i
                                                                    onClick={() => toggleRow(index)}
                                                                    className="mdi mdi-eye fs-4"></i>
                                                            </td>
                                                        </tr>
                                                        {expandedRowIndex === index && (
                                                            <tr>
                                                                <td colSpan="7">
                                                                    <div className="expanded-content px-5">
                                                                        <div
                                                                            className={`permissions-header fs-4 d-flex align-items-center font-weight-bold ${data?.permissions?.length === 0
                                                                                ? 'd-none'
                                                                                : ''
                                                                                }`}>
                                                                            <div className="col-1"></div>
                                                                            <div className="permission-name text-black fw-bold col-2">
                                                                                Permission
                                                                            </div>
                                                                            <div className="action-name col-2 text-black fw-bold text-center">
                                                                                Add
                                                                            </div>
                                                                            <div className="action-name col-2 text-black fw-bold text-center">
                                                                                View
                                                                            </div>
                                                                            <div className="action-name col-2 text-black fw-bold text-center">
                                                                                Edit
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-3">
                                                        No Roles Available
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="mt-2 d-flex justify-content-end">
                                    <Paginations
                                        currentPage={skip}
                                        totalPages={rolePagination?.totalPages || 1}
                                        onPageChange={handlePageChange}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default RoleSetting;
