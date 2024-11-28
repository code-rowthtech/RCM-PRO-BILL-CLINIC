import React from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';

const ResetPassword = ({show, closepassModal}) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = () => {

    }

  return (
    <div>
         <Modal centered show={show} onHide={closepassModal}>
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">Reset Password</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closepassModal} />
                        </Col>
                    </Row>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="my-2 mx-3">

                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        {...register('password', { required: 'Password is required' })}
                                    />
                                    {errors.password && <span className="text-danger">{errors.password.message}</span>}
                                </Form.Group>

                                <div className='text-center'>
                                    <p className='mb-0'>The clinic will receive a password reset email at </p>
                                    <span>'xyz@gmail.com.'</span>
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

export default ResetPassword