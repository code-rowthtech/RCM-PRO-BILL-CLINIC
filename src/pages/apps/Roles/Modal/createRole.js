import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createPermissionAction, createRolesAction, getPermissionAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Multiselect from "multiselect-react-dropdown";

const AddRoles = ({ show, closeModal }) => {
    const dispatch = useDispatch();
    const idFromStorage = JSON.parse(sessionStorage.getItem('hyper_user'));
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
    const store = useSelector((state) => state);
    const decryptedPermissionsData = store?.getPermissionsDataReducer?.data?.data?.map((item) => ({
        ...item,
        name: `${item?.name}`,
    }));

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (show) {
            dispatch(getPermissionAction({ search: '', limit: '', skip: '' }))
        }
    }, [show])

    const onSubmit = (data) => {
        const payload = {
            name: data.name,
            description: data.description,
            permissions: selectedPermissionIds,
            createdById: idFromStorage

        }
        dispatch(createRolesAction({ key: `${encryptMessage(payload)}` }));
    };

    const handleSelect = (selectedList) => {
        const selectedIds = selectedList.map((item) => item._id);
        setSelectedPermissionIds(selectedIds);
    };

    const handleRemove = (selectedList) => {
        const selectedIds = selectedList.map((item) => item._id);
        setSelectedPermissionIds(selectedIds);
    };

    return (
        <Modal show={show} onHide={closeModal}>
            <Modal.Header
                onHide={closeModal}
                closeButton
                className={'modal-colored-header pb-0 border-0 text-center'}>
            </Modal.Header>
            <Modal.Body>
                <h4 className="mt-0 text-center">Add Roles</h4>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-2">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter role name"
                                    {...register('name', { required: 'Name is required' })}
                                />
                                {errors.name && <span className="text-danger">{errors.name.message}</span>}
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group className="mb-2">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter role description"
                                    {...register('description', { required: 'Description is required' })}
                                />
                                {errors.description && <span className="text-danger">{errors.description.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group className="mb-2">
                                <Form.Label>Permissions</Form.Label>

                                <Multiselect
                                    options={decryptedPermissionsData}
                                    displayValue="name"
                                    className="form-control p-0"
                                    placeholder="Select Permissions"
                                    onSelect={handleSelect}
                                    onRemove={handleRemove}
                                />

                            </Form.Group>
                        </Col>

                    </Row>
                    <Modal.Footer>
                        <Button type='submit' className='custom-buttons'>
                            Create role
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddRoles;
