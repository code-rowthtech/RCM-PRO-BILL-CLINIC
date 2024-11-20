import React from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import Spinner from '../../../../constants/Spinner';

const SendEmailModal = ({ show, closeModal, mailId }) => {
    return (
        <Modal centered size='md' show={show} onHide={closeModal}>
            <Modal.Body>
                <Row className="mb-2 pb-2 d-flex align-items-center">
                    <Col sm={1}></Col>
                    <Col sm={10}>
                        <h4 className="mb-0 text-center">Email to clinic</h4>
                    </Col>
                    <Col sm={1}>
                      
                    </Col>
                </Row>
                <Form>
                    <Row>
                        <Col md={12} className='d-flex justify-content-center'>
                            <Form.Group className="mb-2 w-50">
                                <Form.Control
                                    type="email"
                                    readOnly
                                    value={mailId?.email || ''}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={12} className='text-center'>
                            The clinic will receive an onboarding email at {mailId?.email}.
                        </Col>
                        <Col sm={12} className='text-center mt-2'>
                            <Button className='custom-buttons' >
                                Save
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default SendEmailModal;
