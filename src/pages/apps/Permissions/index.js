import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/PageTitle';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { FormInput } from '../../../components';
import { Link } from 'react-router-dom';
import AddPermissions from './Modal/addPermissions';
import { useDispatch, useSelector } from 'react-redux';
import { deletePermissionAction, getPermissionAction, stateEmptydAction, updatePermissionAction } from '../../../redux/actions';
import { decryptMessage, encryptMessage } from '../../../cryptoUtils';
import Loader from '../../../components/Loader';
import Spinner from '../../../constants/Spinner';
import Paginations from '../../../helpers/Paginations';
const Permissions = () => {
    const [showModal, setShowModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(1)
    const store = useSelector((state) => state);
    const decryptedPermissionsData = store?.getPermissionsDataReducer?.data?.data;
    const deleteSuccess = store?.deletePermissionsDataReducer?.data?.success;
    const updateSuccess = store?.updatePermissionsDataReducer?.data?.success;
    const handleClosemodal = () => {
        setShowModal(false);
    };
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getPermissionAction({ search: search, limit: 10, skip: skip }));
        if (store?.createPermissionsDataReducer?.data?.success === true) {
            dispatch(getPermissionAction({ search: search, limit: 10, skip: skip }));
            dispatch(stateEmptydAction())
        }
        if (deleteSuccess === true) {
            dispatch(getPermissionAction({ search: search, limit: 10, skip: skip }));
            closeDeleteModal();
            dispatch(stateEmptydAction())
        }
        if (updateSuccess === true) {
            dispatch(getPermissionAction({ search: search, limit: 10, skip: skip }));
            dispatch(stateEmptydAction())
        }
    }, [dispatch, store?.createPermissionsDataReducer?.data?.success, deleteSuccess, updateSuccess, search, skip])

    const closeDeleteModal = () => {
        setDeleteModal(false);
        setDeleteId(null);
    }
    const openDeleteModal = (data) => {
        setDeleteModal(true);
        setDeleteId(data?._id);
    }
    const handleDelete = () => {
        const payload = {
            id: deleteId
        }
        dispatch(deletePermissionAction({ key: encryptMessage(JSON.stringify(payload)) }));
    }

    const handleToggleUpdate = (data) => {
        if (!data) return;

        const payload = {
            id: data._id,
            status: data.status === 'active' ? 'inactive' : 'active',
        };

        dispatch(updatePermissionAction({ key: `${encryptMessage(payload)}` }));
    }

    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    }
    return (
        <div>
            {/* <PageTitle
                breadCrumbItems={[
                    { label: 'Permissions', path: '/apps/Permissions/list', active: true },
                ]}
                title={'Permissions'}
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
                                    <Button className='custom-buttons' onClick={() => setShowModal(true)}><span className='uil-plus'></span> Add Permissions</Button>
                                </Col>
                                <AddPermissions show={showModal} closeModal={handleClosemodal} />
                            </Row>
                            <Row>
                                <Col>
                                    <Table responsive className="table-centered table-nowrap mb-0">
                                        <thead>
                                            <tr key={''}>
                                                <th>Permission</th>
                                                <th>Description</th>
                                                <th>Created By</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {store?.getPermissionsDataReducer?.loading ?
                                                <tr className='fs-1 fw-bold'>
                                                    <td colSpan={5} className='text-center py-3 fs-4 fw-bold'>
                                                        <Spinner className="spinner-border-lg m-2" />

                                                    </td>
                                                </tr>
                                                :
                                                store?.getPermissionsDataReducer?.data?.totalPermissions === 0 ?
                                                    <tr>
                                                        <td colSpan={5} className='text-center'>
                                                            <h3 className='my-5'>No Data Found</h3>
                                                        </td>
                                                    </tr>
                                                    :
                                                    decryptedPermissionsData && decryptedPermissionsData.map((data, index) => (
                                                        <tr key={index}>
                                                            <td onClick={() => setSelected(data?._id)}>
                                                                <Link to="#" className="text-body fw-bold">
                                                                    {data?.name}
                                                                </Link>
                                                            </td>
                                                            <td>
                                                                {data?.description.slice(0, 20) + '...'}
                                                            </td>
                                                            <td>
                                                                {data?.createdById?.name}
                                                            </td>
                                                            <td>
                                                                <Form.Switch onClick={() => handleToggleUpdate(data)} checked={data?.status === 'active'} />
                                                            </td>
                                                            <td>
                                                                {/* <Link to="#" className="action-icon">
                                                                <i className="mdi mdi-square-edit-outline"></i>
                                                            </Link> */}
                                                                <Link to="#" className="action-icon" onClick={() => openDeleteModal(data)}>
                                                                    <i className="mdi mdi-delete"></i>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                        </tbody>
                                    </Table>
                                </Col>
                                <Row>
                                    <Col className='mt-2 d-flex justify-content-end'>
                                        <Paginations
                                            currentPage={skip}
                                            totalPages={store?.getPermissionsDataReducer?.data?.totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </Col>
                                </Row>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={deleteModal} onHide={closeDeleteModal}>
                <Modal.Header
                    onHide={closeDeleteModal}
                    closeButton
                    className={'modal-colored-header pb-0 border-0 text-center'}>
                </Modal.Header>
                <Modal.Body>
                    <h4 className="mt-0 text-center">Delete Permission</h4>
                    <p>
                        Are you sure you want to remove the selected permissions?
                        This action cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={closeDeleteModal} className='custom-buttons'>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} className='custom-buttons' disabled={store?.deletePermissionsDataReducer?.loading}>
                        {store?.deletePermissionsDataReducer?.loading ?
                            <Spinner className="spinner-border-sm " />
                            :
                            'Delete'
                        }
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Permissions