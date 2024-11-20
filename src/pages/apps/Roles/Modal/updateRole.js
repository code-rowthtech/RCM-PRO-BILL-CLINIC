import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Multiselect from "multiselect-react-dropdown";
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getPermissionAction, updateRolesAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';

const UpdateRole = ({ show, closeModal, data }) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [initialPermissions, setInitialPermissions] = useState([]);
    const updateSuccess = store?.updateRolesReducer?.data?.status

    useEffect(() => {
        if (show) {
            dispatch(getPermissionAction({ search: '', limit: '', skip: '' }));
        }
    }, [show]);

    const decryptedPermissionsData = store?.getPermissionsDataReducer?.data?.data?.map((item) => ({
        ...item,
        name: `${item?.name}`,
    }));
    useEffect(() => {
        if (data) {
            setValue('name', data.name || '');
            setValue('description', data.description || '');
            setInitialPermissions(data?.permissions || []);
            setSelectedPermissions(data?.permissions?.map(permission => ({ name: permission?.name })) || []);
        }
        if (updateSuccess === 200) {
            closeModal()
        }
    }, [data, setValue, updateSuccess]);

    const onSelect = (selectedList) => setSelectedPermissions(selectedList);
    const onRemove = (selectedList) => setSelectedPermissions(selectedList);

    const onSubmit = (formData) => {
        const changedPermissions = selectedPermissions.filter(
            (permission) => !initialPermissions.some((p) => p.name === permission.name)
        );
        const payload = {
            id: data?._id,
            name: formData.name,
            description: formData.description,
            permissions: changedPermissions,
        };
        dispatch(updateRolesAction({ key: encryptMessage(payload) }));
    };

    return (
        <Modal show={show} onHide={closeModal}>
            <Modal.Header
                onHide={closeModal}
                closeButton
                className={'modal-colored-header pb-0 border-0 text-center'}>
            </Modal.Header>
            <Modal.Body>
                <h4 className="mt-0 text-center">Update Role</h4>
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
                                    selectedValues={selectedPermissions}
                                    onSelect={onSelect}
                                    onRemove={onRemove}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Modal.Footer>
                        <Button type='submit' className='custom-buttons' disabled={store?.updateRolesReducer?.loading}>
                            {store?.updateRolesReducer?.loading ?
                                <Spinner className="spinner-border-sm" />
                                :
                                'Update'
                            }
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default UpdateRole;
