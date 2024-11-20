import React, { useEffect, useState } from 'react';
import PageTitle from '../../../../components/PageTitle';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getClinicById, updateClinicAction } from '../../../../redux/clinics/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';
import { useSearchParams } from 'react-router-dom';

const UpdateClinic = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const clinicData = useSelector((state) => state?.getClinicByIdReducer?.data?.clinic);
    const updateLoading = useSelector((state) => state?.updateClinicsReducer?.loading);
    const updateSuccess = useSelector((state) => state?.updateClinicsReducer?.data?.status);

    useEffect(() => {
        if (id || updateSuccess === 200) {
            dispatch(getClinicById({ key: encryptMessage({ id }) }));
        }
    }, [dispatch, id, updateSuccess]);

    useEffect(() => {
        if (clinicData) reset(clinicData);
    }, [clinicData, reset]);

    const onSubmit = (data) => {
        const updatedFields = { id: id };
        Object.keys(data).forEach((key) => {
            if (data[key] !== clinicData[key]) updatedFields[key] = data[key];
        });

        if (Object.keys(updatedFields).length > 0) {
            dispatch(updateClinicAction({ key: encryptMessage(updatedFields) }));
        }
    };

    return (
        <>
            <PageTitle
                breadCrumbItems={[
                    { label: 'Clinics', path: '/apps/crm/allclinic', active: true },
                    { label: 'Update Clinics', path: '/apps/crm/updateclinic', active: true },
                ]}
                title="Update Clinic"
            />
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>

                            {useSelector((state) => state?.getClinicByIdReducer?.loading) ?
                                <Row>
                                    <Col className='d-flex justify-content-center align-items-center'>
                                        <Spinner className="spinner-border-lg m-2" />
                                    </Col>
                                </Row>
                                :
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label>Clinic Name</Form.Label>
                                                <Form.Control
                                                    defaultValue={clinicData?.name}
                                                    type="text"
                                                    {...register('name', { required: 'Clinic name is required' })}
                                                    placeholder="Enter clinic name"
                                                />
                                                {errors.name && <span className="text-danger">{errors.name.message}</span>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    defaultValue={clinicData?.email}
                                                    {...register('email', {
                                                        required: 'Clinic email is required',
                                                        pattern: {
                                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                            message: 'Enter a valid email'
                                                        }
                                                    })}
                                                    type="email"
                                                    placeholder="Enter email"
                                                />
                                                {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-2">
                                                <Form.Label>Contact No.</Form.Label>
                                                <Form.Control
                                                    defaultValue={clinicData?.phone}
                                                    {...register('phone', {
                                                        required: 'Contact number is required',
                                                        minLength: {
                                                            value: 10,
                                                            message: 'Contact number must be 10 digits'
                                                        },
                                                        maxLength: {
                                                            value: 10,
                                                            message: 'Contact number must be 10 digits'
                                                        },
                                                    })}
                                                    type="tel"
                                                    placeholder="Enter contact number"
                                                    maxLength={10}
                                                    onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                                />
                                                {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group className="mb-2">
                                                <Form.Label>Permanent Address</Form.Label>
                                                <Form.Control
                                                    defaultValue={clinicData?.address}
                                                    {...register('address', { required: 'Address is required' })}
                                                    as="textarea" rows={3} placeholder="Enter address"
                                                />
                                                {errors.address && <span className="text-danger">{errors.address.message}</span>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={12} className="mt-2 text-end">
                                            <Button variant="primary" type="submit" disabled={updateLoading} className="custom-buttons">
                                                {updateLoading ? <Spinner className="spinner-border-sm" /> : 'Update'}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            }


                        </Card.Body>
                    </Card>
                </Col>
            </Row >
        </>
    );
};

export default UpdateClinic;
