import React, { useEffect, useState } from 'react'
import PageTitle from '../../../components/PageTitle'
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
import { FormInput } from '../../../components'
import { Link } from 'react-router-dom'
import AddRoles from './Modal/createRole'
import { useDispatch, useSelector } from 'react-redux'
import { getRolesAction, updateRolesAction } from '../../../redux/actions'
import UpdateRole from './Modal/updateRole'
import { encryptMessage } from '../../../cryptoUtils'
import { stateEmptydAction } from '../../../redux/roles/actions'
import Spinner from '../../../constants/Spinner'
import Paginations from '../../../helpers/Paginations'

const Roles = () => {
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [skip, setSkip] = useState(1);
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const decryptedRolesData = store?.getRolesDataReducer?.data?.roles;
    const updateSuccess = store?.updateRolesReducer?.data?.status;

    const handleClosemodal = () => {
        setShowModal(false);
    };
    useEffect(() => {
        dispatch(getRolesAction({ limit: 10, skip: skip, search: search }));
        if (updateSuccess === 200) {
            dispatch(stateEmptydAction());
            dispatch(getRolesAction({ limit: 10, skip: skip, search: search }));
        }
    }, [dispatch, updateSuccess, skip, search])
    const [dataToUpdate, setDataToUpdate] = useState(null);

    const closeUpdateModal = () => {
        setShowUpdateModal(false);
        setDataToUpdate(null);
    }

    const handleUpdateDoctorStatus = (data) => {
        const payload = {
            id: data?._id,
            status: data?.status === 'active' ? 'inactive' : 'active'
        }
        dispatch(updateRolesAction({ key: encryptMessage(payload) }));

    }
    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber)
    }
    return (
        <div>
            {/* <PageTitle
                breadCrumbItems={[
                    { label: 'Roles', path: '/apps/Roles/list', active: true },
                ]}
                title={'Roles'}
            /> */}
            <Row className='mt-2'>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <Row className="mb-2 d-flex justify-content-between">
                                <Col xs="auto">
                                    <FormInput onChange={(e) => setSearch(e.target.value)} type="text" name="search" placeholder="Search..." />
                                </Col>
                                <Col xs='auto'>
                                    <Button className='custom-buttons' onClick={() => setShowModal(true)}><span className='uil-plus'></span> Add Roles</Button>
                                </Col>
                                <AddRoles show={showModal} closeModal={handleClosemodal} />
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead className="">
                                            <tr key={''}>
                                                <th>
                                                    S.no
                                                </th>
                                                <th>Name</th>
                                                <th>Description</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store?.getRolesDataReducer?.loading ?
                                                <tr>
                                                    <td colSpan={5} className='py-5 text-center'>
                                                        <Spinner />
                                                    </td>
                                                </tr>
                                                :
                                                store?.getRolesDataReducer?.data?.total === 0 ?
                                                    <tr>
                                                        <td colSpan={5} className='text-center'>
                                                            <h3 className='my-5'>No Data Found</h3>
                                                        </td>
                                                    </tr>
                                                    :
                                                    decryptedRolesData?.map((data, index) => (
                                                        <tr key={index}>
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
                                                                    {data?.description?.substring(0, 12) + '...'}
                                                                </span>
                                                            </td>
                                                            {/* <td>
                                                        {data?.permissions}
                                                    </td> */}
                                                            <td>
                                                                <Form.Switch onClick={() => handleUpdateDoctorStatus(data)} checked={data?.status === 'active'} />
                                                            </td>
                                                            <td>
                                                                <Link to="#" className="action-icon" onClick={() => {
                                                                    setShowUpdateModal(true);
                                                                    setDataToUpdate(data);
                                                                }}>
                                                                    <i className="mdi mdi-square-edit-outline"></i>
                                                                </Link>
                                                                <UpdateRole show={showUpdateModal} closeModal={closeUpdateModal} data={dataToUpdate} />
                                                            </td>
                                                        </tr>
                                                    ))
                                            }
                                        </tbody>
                                    </Table>
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

export default Roles