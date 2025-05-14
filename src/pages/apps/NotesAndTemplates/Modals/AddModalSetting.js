import React, { useEffect } from 'react';
import { Col, Form, Modal, Row, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { createNoteCategoriesAction, getNoteCategoriesAction } from '../../../../redux/noteCategories/action';
import { useDispatch } from 'react-redux';
import { encryptMessage } from '../../../../cryptoUtils';
import { useSelector } from 'react-redux';

const AddModalSetting = ({ setAddModal, addModal }) => {
    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'));
    const store = useSelector((state)=> state);
    const createResponse = store?.createNoteCategoriesReducer?.data?.status
  const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        const payload = {
            clinicId: clinic_id?.clinicId,
            noteType: data.name,
            isActive: data.isActive === 'true', // convert to boolean
            format: data.format,
            confidential: data.confidential,
            // isDefault: !!data.isDefault, // convert to boolean
        };
        dispatch(createNoteCategoriesAction({ key: encryptMessage(payload) }));
        console.log(payload,'payload')
        // setAddModal(false);
        // reset();
    };
    
    useEffect(()=>{
    if(createResponse === 201){
        dispatch(getNoteCategoriesAction());
        setAddModal(false);
        reset();
    }
    },[createResponse])

    return (
        <Modal show={addModal} onHide={() => setAddModal(false)} size="lg" centered>
            <Modal.Header closeButton className="px-2 py-0">
                <Modal.Title>Add Note Type</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="name">
                                <Form.Label>Note Type Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter name"
                                    {...register('name', { required: 'Name is required' })}
                                />
                                {errors.name && <span className="text-danger">{errors.name.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="isActive">
                                <Form.Label>Active/Inactive</Form.Label>
                                <Form.Select {...register('isActive')}>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-1">
                        <Col md={6}>
                            <Form.Group controlId="format">
                                <Form.Label>Format</Form.Label>
                                <Form.Select {...register('format', { required: 'Format is required' })}>
                                    <option value="">Select format</option>
                                    <option value="Simple">Simple</option>
                                    <option value="SOAP">SOAP</option>
                                    <option value="Narrative">Custom</option>
                                </Form.Select>
                                {errors.format && <span className="text-danger">{errors.format.message}</span>}
                            </Form.Group>
                        </Col>
                         <Col md={6}>
                            <Form.Group controlId="confidential">
                                <Form.Label>Is this template Private</Form.Label>
                                <Form.Select {...register('confidential', { required: 'confidential is required' })}>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </Form.Select>
                                {errors.confidential && <span className="text-danger">{errors.confidential.message}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* <Row className="mb-1">
                        <Col md={6}>
                            <Form.Group controlId="isDefault">
                                <Form.Check type="checkbox" label="Make Default" {...register('isDefault')} />
                            </Form.Group>
                        </Col>
                    </Row> */}

                    <div className="d-flex justify-content-end">
                        <Button variant="primary" type="submit" className="custom-buttons">
                            Save
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddModalSetting;
