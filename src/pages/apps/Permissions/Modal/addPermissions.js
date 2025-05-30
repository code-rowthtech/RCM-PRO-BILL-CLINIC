import React, { useEffect } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createPermissionAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';
const AddPermissions = ({ show, closeModal }) => {
    const dispatch = useDispatch();

    // Using useForm hook for form handling and validation
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const store = useSelector((state) => state)
    const idFromStorage = JSON.parse(sessionStorage.getItem('hyper_user'));
    const onSubmit = (data) => {
        const payload = { name: data.name, description: data.description, status: 'active', createdById: idFromStorage?._id }
        dispatch(createPermissionAction({ key: `${encryptMessage(payload)}` }))
    };
    useEffect(() => {
        if (store?.createPermissionsDataReducer?.data?.success === true) {
            closeModal();
            reset();
        }
    }, [store?.createPermissionsDataReducer?.data?.success])
    return (
        <Modal show={show} onHide={closeModal}>
            <Modal.Header
                onHide={closeModal}
                closeButton
                className={'modal-colored-header pb-0 border-0 text-center'}>
            </Modal.Header>
            <Modal.Body>
                <h4 className="mt-0 text-center">Add Permissions</h4>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-2">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter permission name"
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
                                    placeholder="Enter permission description"
                                    {...register('description', { required: 'Description is required' })}
                                />
                                {errors.description && <span className="text-danger">{errors.description.message}</span>}
                            </Form.Group>
                        </Col>

                    </Row>
                    <Modal.Footer>
                        <Button type='submit' className='custom-buttons' disabled={store?.createPermissionsDataReducer?.loading}>
                            {store?.createPermissionsDataReducer?.loading ?
                                <Spinner className="spinner-border-sm" />
                                :
                                'Save changes'
                            }
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddPermissions;
