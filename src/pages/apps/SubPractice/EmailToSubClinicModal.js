import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import { encryptMessage } from '../../../cryptoUtils';
import { createSubClinicAction } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';

const EmailToDoctorModal = ({ show, closeModal,setFormData, formData }) => {
        const store = useSelector((state) => state)
    
    const getRoleId = store?.getDoctorsRolesReducer?.data?.result?.[0]?._id;
    const createResponse = store?.createSubClinicsReducer?.data?.status;

   const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
const dispatch=useDispatch();

    const onSend = () => {
        const payload = {
            role:getRoleId,
            name: formData?.name,
            clinicType: formData?.clinicType,
            email: formData?.userId?.email,
            phone: formData?.userId?.phone,

        }
console.log(payload,'pankaj')
        dispatch(createSubClinicAction({ key: encryptMessage(payload) }));
    };

useEffect(()=>{
if(createResponse===200){
    closeModal();
    setFormData();
    reset();
}
},[createResponse])

    return (
        <div>
            <Modal centered size='md' show={show} onHide={closeModal}>
                <Modal.Body>
                    <Row className="mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">Email to Practice</h4>
                        </Col>
                        <Col sm={1}></Col>
                    </Row>
                    <Form onSubmit={handleSubmit(onSend)}>
                        <Row>
                            <Col md={12} className='d-flex justify-content-center'>
                                <Form.Group className="mb-2 w-50">
                                    <Form.Control
                                        type="email"
                                        readOnly
                                        value={formData?.userId?.email}
                                        {...register('email', { required: 'Email is required' })}
                                    />
                                    {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col sm={12} className='text-center'>
                                The Sub Practice will receive a Change and Set Password on this {formData?.userId?.email}.
                            </Col>
                            <Col sm={12} className='d-flex justify-content-center mt-2'>
                                <Button type='submit' className='custom-buttons' disabled={store?.createSubClinicsReducer?.loading}>
                                    {store?.createSubClinicsReducer?.loading ? (
                                        <Spinner color='white' className='spinner-border-sm' />
                                    ) : (
                                        'Send'
                                    )}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EmailToDoctorModal;
