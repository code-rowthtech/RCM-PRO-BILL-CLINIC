import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Multiselect from "multiselect-react-dropdown";
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';
import { IoMdClose } from 'react-icons/io';
import { getPermissionAction, updateRoleDataAction } from '../../../../redux/actions';

const UpdateRoleSetting = ({ show, closeModal, data }) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    console.log({selectedPermissions})
    const [initialPermissions, setInitialPermissions] = useState(data?.permissions || []);
    const updateSuccess = store?.updateRoleDataReducer?.data?.status;

    const decryptedPermissionsData = store?.getPermissionsDataReducer?.data?.data?.map((item) => ({
        ...item,
        name: `${item?.permission}`,
    }));

    useEffect(() => {
        if (show) {
            const permissions = {
                interface: 'Clinic',
                module: '',
                skip: '',
                limit: 50,
                search: '',
                status: true,
            };
            dispatch(getPermissionAction(permissions));
        }
    }, [show]);

    useEffect(() => {
        if (data) {
            setValue('name', data.name ? data.name.charAt(0).toUpperCase() + data.name.slice(1) : ''); // Capitalize first letter
            setValue('description', data.description || '');
            setInitialPermissions(data?.permissions || []);
    
            // Map permissions to match the Multiselect options structure
            const mappedPermissions = data?.permissions?.map(permission => ({
                _id: permission?._id,
                name: permission?.name || permission?.permission,
                permission: permission?.permission,
            })) || [];
    
            setSelectedPermissions(mappedPermissions);
        }
    
        if (updateSuccess === 200) {
            closeModal();
        }
    }, [data, setValue, updateSuccess]);
    

    const onSelect = (selectedList) => setSelectedPermissions(selectedList);
    const onRemove = (selectedList) => setSelectedPermissions(selectedList);

    const onSubmit = (formData) => {
        const changedPermissions = selectedPermissions.filter(
            (permission) => !initialPermissions.some((p) => p.permission === permission.permission)
        );

        // Map selected permissions to only include the permission ids
        const permissionIds = changedPermissions.length > 0
            ? changedPermissions.map(permission => permission._id)
            : initialPermissions.map(permission => permission._id);

        const payload = {
            id: data?._id,
            name: formData.name,
            description: formData.description,
            permissions: permissionIds,  // Only send permission ids
            status: true
        };

        console.log(payload, 'editrole');
        dispatch(updateRoleDataAction({ key: encryptMessage(payload) }));

        if (updateSuccess === 200) {
            closeModal();
        }
    };

    // Filter out already selected permissions from the available list
    const availablePermissions = decryptedPermissionsData?.filter(permission =>
        !selectedPermissions.some(selectedPerm => selectedPerm._id === permission._id)
    );
    

    return (
        <Modal centered show={show}>
            <Modal.Body>
                <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                    <Col sm={1}></Col>
                    <Col sm={10}>
                        <h4 className="mb-0 text-center">Edit Role</h4>
                    </Col>
                    <Col sm={1}>
                        <IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} />
                    </Col>
                </Row>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-2">
                                <Form.Label>Name <span className="text-danger">*</span></Form.Label>
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
                                <Form.Label>Description <span className="text-danger">*</span></Form.Label>
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
                                <Form.Label>Permissions <span className="text-danger">*</span></Form.Label>
                                <Multiselect
                                    options={availablePermissions} // Filtered permissions
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
                          <Button type="button" className="custom-buttons" onClick={closeModal}>
                                                        Cancel
                                                    </Button>
                        <Button type="submit" className="custom-buttons" disabled={store?.updateRoleDataReducer?.loading}>
                            {store?.updateRoleDataReducer?.loading ?
                                <Spinner className="spinner-border-sm" color="white" /> :
                                'Update'
                            }
                        </Button>
                    </Modal.Footer>

                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateRoleSetting;
