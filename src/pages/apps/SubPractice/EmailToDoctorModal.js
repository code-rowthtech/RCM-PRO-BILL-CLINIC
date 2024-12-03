import React from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import { encryptMessage } from '../../../cryptoUtils';
import { createSubClinicAction } from '../../../redux/actions';
import { useDispatch } from 'react-redux';

const EmailToDoctorModal = ({show, closeModal,formData}) => {
  const dispatch = useDispatch()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm();

    const onSubmit = () => {
        const payload = {
            name: formData?.clinicname,
            email: formData?.email,
            phone: formData?.contactPerson,
            clinicType: formData?.clinicType,
        }
        console.log('Form Submitted:', payload);
        dispatch(createSubClinicAction({ key: encryptMessage(payload) }))
        closeModal(false)
        setValue('')
        reset();
        formData('')

    }

  return (
    <div>
         <Modal centered show={show} onHide={closeModal}>
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">Email to Doctor</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} />
                        </Col>
                    </Row>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="my-2 mx-3">

                                    <Form.Control
                                        type="text"
                                        placeholder="Enter email address"
                                        {...register('name', { required: 'Name is required' })}
                                        defaultValue={formData?.email}
                                    />
                                    {errors.name && <span className="text-danger">{errors.name.message}</span>}
                                </Form.Group>

                                <div className='text-center'>
                                    <p className='mb-0'>The Doctor will receive an onboarding email on</p>
                                    <p > "xyz.com"</p>
                                </div>
                            </Col>

                        </Row>
                        <Modal.Footer className='d-flex justify-content-center'>
                            <Button type="submit" className="custom-buttons">
                                Send
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
    </div>
  )
}

export default EmailToDoctorModal