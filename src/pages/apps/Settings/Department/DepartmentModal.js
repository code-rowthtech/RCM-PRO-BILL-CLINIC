import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { createMastersDataAction, updateMastersDataAction } from '../../../../redux/settings/action';
import { encryptMessage } from '../../../../cryptoUtils';
import { Button, Col, Modal, Row, Form } from 'react-bootstrap';

const DepartmentModal = ({ addDepartmentModal, closeAddModal, edit }) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm();
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

    useEffect(() => {
        if (edit) {
            setValue('name', edit.name || '');
            setValue('reEnterName', edit.name || '');
            setValue('description', edit.description || '');
        } else {
            reset();
        }
    }, [edit, setValue, reset]);

    // Reset form when modal opens
    useEffect(() => {
        if (addDepartmentModal && !edit) {
            reset();
        }
    }, [addDepartmentModal, edit, reset]);
    
    const addDepartment = (data) => {
        const payload = {
            //   id: edit?._id,
            ...(edit ? { id: edit?._id } : {}),
            name: data?.name,
            description: data?.description || 'N/A',
            category: 'Department',
            clinicId: clinic_id,
            showTo: 'clinic',
        };
        if (edit) {
            dispatch(updateMastersDataAction({ key: encryptMessage(payload) }));
        } else {
            dispatch(createMastersDataAction({ key: encryptMessage(payload) }));
        }
    };

    return (
        <>
            <Modal centered show={addDepartmentModal} onHide={closeAddModal}>
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2">
                        <Col sm={11} className="text-center">
                            <h4>{edit ? 'Edit Department' : 'New Department'}</h4>
                        </Col>
                        {/* <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeAddModal} />
                        </Col> */}
                    </Row>
                    <Form onSubmit={handleSubmit(addDepartment)}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>
                                        Department Name <span className="text-danger">*</span>
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
                                        placeholder="Enter Department Name"
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            if (value.trim() === '') {
                                                e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
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
                                            required: 'Re-enter department name',
                                            validate: {
                                                noEmpty: (value) =>
                                                    value.trim() !== '' || 'Name cannot be empty or only spaces',
                                                noSpacesBeforeText: (value) =>
                                                    !/^\s/.test(value) || 'First character cannot be a space',
                                                matchName: (value) => value === watch('name') || 'Name do not match', // Match with 'name' field value
                                            },
                                        })}
                                        placeholder="Re-enter Department Name"
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            if (value.trim() === '') {
                                                e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
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
                                                e.target.value = value.replace(/\s/g, ''); // Remove all spaces if empty
                                            }
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Modal.Footer>
                            <Button onClick={closeAddModal} className="custom-buttons">
                                Close
                            </Button>
                            <Button type="submit" className="custom-buttons" style={{ width: '65px' }}>
                                {store?.createMastersDataReducer?.loading ||
                                store?.updateMastersDataReducer?.loading ? (
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
        </>
    );
};

export default DepartmentModal;
