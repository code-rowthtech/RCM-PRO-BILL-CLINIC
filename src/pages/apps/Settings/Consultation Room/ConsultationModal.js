import React, { useEffect } from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { createMastersDataAction, getMastersDataAction, updateMastersDataAction } from '../../../../redux/settings/action';
import { encryptMessage } from '../../../../cryptoUtils';

const ConsultationModal = ({ show, onClose, defaultValues, isEdit }) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: defaultValues || {},
    });

    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const updateResponse = store?.updateMastersDataReducer?.data?.status;
    const createResponse = store?.createMastersDataReducer?.data?.status;

    // Reset form when defaultValues change (for edit)
    React.useEffect(() => {
        reset(defaultValues || {});
    }, [defaultValues, reset]);

    const addDepartment = (data) => {
        const payload = {
            ...(isEdit ? { id: defaultValues?._id } : {}),
            name: data?.name,
            description: data?.description || 'N/A',
            category: 'Consultation Room',
            clinicId: clinic_id,
            showTo: 'clinic',
        };
        
        if (isEdit) {
            dispatch(updateMastersDataAction({ key: encryptMessage(payload) }));
        } else {
            dispatch(createMastersDataAction({ key: encryptMessage(payload) }));
        }
    };
    
        useEffect(() => {
            if (createResponse === 200 || updateResponse === 200) {
                onClose();
                reset();
                dispatch(
                    getMastersDataAction({
                        status: true,
                        category: 'Consultation Room',
                        search: '',
                        limit: 10,
                        skip: 1,
                    })
                );
            }
        }, [createResponse, updateResponse]);

    return (
        <Modal centered show={show} onHide={onClose}>
            <Modal.Body className=''>
                <Row className="border-bottom mb-2">
                    <Col sm={12} className="text-center">
                        <h4>{isEdit ? 'Edit Consultation Room' : 'New Consultation Room'}</h4>
                    </Col>
                </Row>
                <Form onSubmit={handleSubmit(addDepartment)}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>
                                    Consultation Room Name <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register('name', {
                                        required: 'Name is required',
                                        validate: {
                                            noEmpty: (value) =>
                                                value.trim() !== '' || 'Name cannot be empty or only spaces',
                                            noSpacesBeforeText: (value) =>
                                                !/^\s/.test(value) || 'First character cannot be a space',
                                        },
                                    })}
                                    placeholder="Enter Consultation Room Name"
                                    onInput={(e) => {
                                        const value = e.target.value;
                                        if (value.trim() === '') {
                                            e.target.value = value.replace(/\s/g, '');
                                        }
                                    }}
                                />
                                {errors.name && <p className="text-danger">{errors.name.message}</p>}
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>
                                    Re-Enter Name <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    {...register('reEnterName', {
                                        required: 'Re-enter Consultation Room name',
                                        validate: {
                                            noEmpty: (value) =>
                                                value.trim() !== '' || 'Name cannot be empty or only spaces',
                                            noSpacesBeforeText: (value) =>
                                                !/^\s/.test(value) || 'First character cannot be a space',
                                            matchName: (value) => value === watch('name') || 'Name do not match',
                                        },
                                    })}
                                    placeholder="Re-enter Consultation Room Name"
                                    onInput={(e) => {
                                        const value = e.target.value;
                                        if (value.trim() === '') {
                                            e.target.value = value.replace(/\s/g, '');
                                        }
                                    }}
                                />
                                {errors.reEnterName && <p className="text-danger">{errors.reEnterName.message}</p>}
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group className="mb-2">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    {...register('description')}
                                    placeholder="Enter description"
                                    onInput={(e) => {
                                        const value = e.target.value;
                                        if (value.trim() === '') {
                                            e.target.value = value.replace(/\s/g, '');
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Modal.Footer>
                      
                            <Button onClick={onClose} className="custom-buttons">
                            Close
                        </Button>
                        <Button type="submit" className="custom-buttons">
                            {store?.createMastersDataReducer?.loading || store?.updateMastersDataReducer?.loading ? (
                                <div class="spinner-border spinner-border-sm" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ConsultationModal;