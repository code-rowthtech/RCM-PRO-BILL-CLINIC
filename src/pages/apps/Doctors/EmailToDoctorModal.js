import React, { useEffect } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import { createDoctorAction } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { encryptMessage } from '../../../cryptoUtils';
import Spinner from '../../../constants/Spinner';

const EmailToDoctorModal = ({ show, closeModal, formData, setFormData }) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset, setValue
    } = useForm();
    const dispatch = useDispatch();
    const onSubmit = () => {
        // alert(JSON.stringify(formData))
        console.log(formData, 'formData')
        dispatch(createDoctorAction({ key: encryptMessage(formData) }));

    }
    const store = useSelector((state) => state);
    const createResponse = store?.createtDoctorsReducer?.data?.status
    const doctorRoleId = store?.getRoleDataReducer?.data?.roles?.[0]?._id;

    useEffect(() => {
        setValue('name', formData?.email)
    }, [formData])
    useEffect(() => {
        if (createResponse === 200) {
            closeModal();
            setFormData({
                role: doctorRoleId,
                email: '',
                name: {
                    use: 'official',
                    text: '',
                    family: '',
                    given: '',
                },
                phone: '',
                password: '',
                confirmPassword: '',
            });
            reset();
        }
    }, [createResponse])

    return (
        <div>
            <Modal centered show={show} onHide={closeModal}>
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">Email to Provider</h4>
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
                                        className='text-center'
                                        type="text"
                                        placeholder="Enter email address"
                                        {...register('name', { required: 'Name is required' })}
                                        readOnly
                                    // defaultValue={formData?.email}
                                    />
                                    {/* {errors.name && <span className="text-danger">{errors.name.message}</span>} */}
                                </Form.Group>

                                <div className='text-center'>
                                    <p className='mb-0'>The Provider will receive an onboarding email on</p>
                                    <strong> "{formData?.email}"</strong>
                                </div>
                            </Col>
                        </Row>
                        <Modal.Footer className='d-flex justify-content-center'>
                            <Button type="submit" className="custom-buttons" style={{ width: '55px' }} disabled={store?.createDoctorsReducer?.loading}>
                                {store?.createtDoctorsReducer?.loading ?
                                    <Spinner color='white' className='spinner-border-sm' />
                                    :
                                    'Send'
                                }
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default EmailToDoctorModal