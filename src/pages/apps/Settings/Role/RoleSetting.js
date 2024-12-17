import React, { useEffect, useState } from 'react'
// import PageTitle from '../../../components/PageTitle'
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
// import { getRolesAction, updateRolesAction } from '../../../redux/actions'
// import { stateEmptydAction } from '../../../redux/roles/actions'
import Spinner from '../../../../constants/Spinner'
import Paginations from '../../../../helpers/Paginations'
import CreateRoleSetting from './CreateRoleSetting'
import UpdateRoleSetting from './UpdateRoleSetting'
import { encryptMessage } from '../../../../cryptoUtils'
import { FormInput } from '../../../../components'
import {  getRoleDataAction, stateEmptydAction, updateRoleDataAction } from '../../../../redux/actions'

const RoleSetting = () => {
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [skip, setSkip] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(true)
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const decryptedRolesData = store?.getRoleDataReducer?.data?.roles;
    const updateSuccess = store?.updateRoleDataReducer?.data?.status;
    const createSuccess = store?.createRoleDataReducer?.data?.status;
    const handleClosemodal = () => {
        setShowModal(false);
    };
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId

    useEffect(() => {
        dispatch(getRoleDataAction({ clinicId:clinicId,limit: 10, search: search,page:skip, status: status }));
        if (updateSuccess === 200 || createSuccess === 200) {
            dispatch(stateEmptydAction());
            setShowUpdateModal(false)
            setShowModal(false);
            dispatch(getRoleDataAction({clinicId:clinicId, limit: 10, search: search,page:skip, status: status }));
        }
    }, [dispatch, updateSuccess, skip, search, createSuccess, status])
    const [dataToUpdate, setDataToUpdate] = useState(null);

    const closeUpdateModal = () => {
        setShowUpdateModal(false);
        setDataToUpdate(null);
    }

    const handleUpdateDoctorStatus = (data) => {
        const payload = {
            id: data?._id,
            status: !data?.status
        }
        dispatch(updateRoleDataAction({ key: encryptMessage(payload) }));

    }
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber)
    }
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
            {/* <PageTitle
                breadCrumbItems={[
                    { label: 'Roles', path:'/apps/Roles/list', active: true },
                ]}
                title={'Roles'}
            /> */}
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body className='scroll-container' style={{ height: '88vh' }}>
                            <Row className="mb-2 d-flex justify-content-between">
                                <Col sm={6}>
                                    <Button
                                        variant={status === true ? 'outlined' : ''}
                                        onClick={() => handleStatusChange(true)}
                                        className={`${status === true ? 'custom-buttons' : 'bg-none border-primary'} me-2`}
                                    >
                                        Active
                                    </Button>

                                    <Button
                                        variant={status === false ? 'outlined' : ''}
                                        onClick={() => handleStatusChange(false)}
                                        className={`${status === false ? 'custom-buttons' : 'bg-none border-primary'} me-2`}
                                    >
                                        Inactive
                                    </Button>
                                </Col>
                                <Col xs='auto'>
                                    <Row className="gy-2 gx-2 align-items-center justify-content-xl-end justify-content-between ">
                                        <Col xs="auto" className='d-flex gap-2'>
                                            <FormInput
                                                type="text"
                                                onChange={(e) => {
                                                    setSearch(e.target.value);
                                                    setSkip(1);
                                                }}
                                                placeholder="Search..." />
                                            <Button className='custom-buttons' onClick={() => setShowModal(true)}><span className='uil-plus'></span> Add New Role</Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <CreateRoleSetting  show={showModal} closeModal={handleClosemodal}/>
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead className=" text-white">
                                            <tr key={''}>
                                                <th className='text-white'>
                                                    S.no
                                                </th>
                                                <th className='text-white'>Name</th>
                                                <th className='text-white'>Description</th>
                                                <th className='text-white'>Status</th>
                                                <th className='text-white'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store?.getRolesDataReducer?.loading ?
                                                <tr key={''}>
                                                    <td colSpan={7} className='py-5 text-center'>
                                                        <Spinner />
                                                    </td>
                                                </tr>
                                                :
                                                store?.getRolesDataReducer?.data?.total === 0 ?
                                                    <tr key={''}>
                                                        <td colSpan={7} className='text-center'>
                                                            <h3 className='my-5'>No Data Found</h3>
                                                        </td>
                                                    </tr>
                                                    :
                                                    decryptedRolesData?.map((data, index) => (
                                                        <>
                                                            <tr
                                                                className='cursor-pointer'
                                                                key={index}>
                                                                <td>
                                                                    {index + 1}
                                                                </td>
                                                                <td className='cursor-pointer'>
                                                                    <span
                                                                        data-bs-toggle="tooltip"
                                                                        title={'Permissions' + ' : ' + data?.permissions?.map(permission => permission?.name).join(', ') || ''}
                                                                        className="d-inline-block text-truncate text-capitalize">
                                                                        {data?.name}
                                                                    </span>
                                                                </td>


                                                                <td>
                                                                    <span className='text-truncate cursor-pointer' title={data?.description}>
                                                                        {data?.description
                                                                            ? (data?.description?.length > 50
                                                                                ? data?.description.slice(0, 49) + '...'
                                                                                : data?.description)
                                                                            : 'N/A'}
                                                                    </span>
                                                                </td>

                                                                <td>
                                                                    <Form.Switch onClick={() => handleUpdateDoctorStatus(data)} checked={data?.status === true} />
                                                                </td>
                                                                <td>
                                                                    <Link to="#" className="action-icon" onClick={() => {
                                                                        setShowUpdateModal(true);
                                                                        setDataToUpdate(data);
                                                                    }}>
                                                                        <i className="mdi  mdi-square-edit-outline"></i>
                                                                    </Link>
                                                                    <i onClick={() => toggleRow(index)} className="mdi mdi-eye fs-4"></i>
                                                                    <UpdateRoleSetting show={showUpdateModal} closeModal={closeUpdateModal} data={dataToUpdate} />
                                                                </td>
                                                            </tr>
                                                            {expandedRowIndex === index && (
                                                                <tr>
                                                                    <td colSpan="7">
                                                                        <div className="expanded-content px-5">
                                                                            <div className={`permissions-header fs-4 d-flex align-items-center font-weight-bold ${data?.permissions?.length === 0 ? 'd-none' : ''}`}>
                                                                                <div className="col-1"></div>
                                                                                <div className="permission-name text-black fw-bold col-2">Permission</div>
                                                                                <div className="action-name col-2 text-black fw-bold  text-center">Add</div>
                                                                                <div className="action-name col-2 text-black fw-bold  text-center">View</div>
                                                                                <div className="action-name col-2 text-black fw-bold  text-center">Delete</div>
                                                                                <div className="action-name col-2 text-black fw-bold  text-center">Update</div>
                                                                                <div className="col-1"></div>
                                                                            </div>
                                                                            <div className="permissions-body scroll-container">
                                                                                {data?.permissions?.length === 0 ? (
                                                                                    <div className="no-permissions-message text-center py-2">
                                                                                        No permissions are available for this role
                                                                                    </div>
                                                                                ) : (
                                                                                    data?.permissions?.map((permission, idx) => (
                                                                                        <div key={idx} className="permissions-row py-2 d-flex align-items-center">
                                                                                            <div className="col-1"></div>
                                                                                            <div className="permission-name text-black fw-bold col-2 text-capitalize">{permission?.name}</div>
                                                                                            <div className="action-name col-2 text-center">
                                                                                                {/(add|create)/i.test(permission?.name) ? '✅' : '❌'}
                                                                                            </div>
                                                                                            <div className="action-name col-2 text-center">
                                                                                                {/view/i.test(permission?.name) ? '✅' : '❌'}
                                                                                            </div>
                                                                                            <div className="action-name col-2 text-center">
                                                                                                {/(delete|remove)/i.test(permission?.name) ? '✅' : '❌'}
                                                                                            </div>
                                                                                            <div className="action-name col-2 text-center">
                                                                                                {/(update|edit)/i.test(permission?.name) ? '✅' : '❌'}
                                                                                            </div>
                                                                                            <div className="col-1"></div>
                                                                                        </div>
                                                                                    ))
                                                                                )}

                                                                            </div>
                                                                        </div>

                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </>
                                                    ))
                                            }
                                        </tbody>
                                    </Table >
                                </Col>
                                <Row>
                                    <Col className='mt-2 d-flex justify-content-end'>
                                        <Paginations
                                            currentPage={skip}
                                            totalPages={store?.getRolesDataReducer?.data?.totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </Col>
                                </Row>

                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default RoleSetting;