import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createPermissionAction, createRolesAction, getPermissionAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Multiselect from "multiselect-react-dropdown";

const AddSubscriptions = ({ show, closeModal }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const onSubmit = () => {
        console.log('submitted')
    }
    return (
        <Modal show={show} size='md' centered onHide={closeModal}>
            <Modal.Header
                onHide={closeModal}
                closeButton
                className={'modal-colored-header pb-0 border-0 text-center'}>
                <Row>
                    <Col>
                        New Plan
                    </Col>
                </Row>
            </Modal.Header>
            <Modal.Body>
                {/* <h4 className="mt-0 text-center">New Plan</h4> */}
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Plan Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter plan name"
                                    {...register('name', { required: 'Name is required' })}
                                />
                                {errors.name && <span className="text-danger">{errors.name.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter amount"
                                    {...register('amount', { required: 'Amount is required' })}
                                />
                                {errors.amount && <span className="text-danger">{errors.amount.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Plan Tenure</Form.Label>
                                <Form.Select
                                    {...register('tenure', { required: 'Tenure is required' })}
                                >
                                    <option value='' >Select tenure</option>
                                    <option value='monthly'>Monthly</option>
                                    <option value='half-yearly'>Half yearly</option>
                                    <option value='yearly'>Yearly</option>
                                </Form.Select>
                                {errors.tenure && <span className="text-danger">{errors.tenure.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Doctor Count</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter doctor count"
                                    {...register('doctorcount', { required: 'Doctor count is required' })}
                                />
                                {errors.doctorcount && <span className="text-danger">{errors.doctorcount.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Date Count</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder="Select date"
                                    {...register('date', { required: 'Date is required' })}
                                />
                                {errors.date && <span className="text-danger">{errors.date.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Patient Count</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter patient count"
                                    {...register('patientcount', { required: 'Patient count is required' })}
                                />
                                {errors.patientcount && <span className="text-danger">{errors.patientcount.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={12}>
                            <Form.Group className="mb-2">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as={'textarea'}
                                    placeholder="Enter description"
                                    {...register('description', { required: 'Description is required' })}
                                />
                                {errors.description && <span className="text-danger">{errors.description.message}</span>}
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

export default AddSubscriptions;
