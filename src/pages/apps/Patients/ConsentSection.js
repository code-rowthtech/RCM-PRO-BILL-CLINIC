import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import { Form, Card, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { consentSchema, consentDefaultValues } from '../../../schemas/consentSchema';
import { useSearchParams } from 'react-router-dom';
import { updatePatientsAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';

const ConsentSection = ({ initialData = null, isLoading = false }) => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const patientId = searchParams.get('updateid');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch
    } = useForm({
        resolver: yupResolver(consentSchema),
        defaultValues: initialData || consentDefaultValues
    });

    const handleFormSubmit = (data) => {
        data.id = patientId;
        dispatch(updatePatientsAction({ key: encryptMessage(data) }));
    };

    const handleReset = () => {
        reset(consentDefaultValues);
        setSubmitError('');
        setSubmitSuccess(false);
    };

    return (
        <>
            <Form onSubmit={handleSubmit(handleFormSubmit)} className="consent-section" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {submitError && (
                    <Alert variant="danger" dismissible onClose={() => setSubmitError('')}>
                        {submitError}
                    </Alert>
                )}

                {submitSuccess && (
                    <Alert variant="success" dismissible onClose={() => setSubmitSuccess(false)}>
                        Consent information saved successfully!
                    </Alert>
                )}

                {/* Immunization Registry */}
                <Card className="mb-3 box-shadow-none">
                    <Card.Header>
                        <h5>Immunization Registry</h5>
                        <small >
                            These settings indicate the current status of this patient in relation to your practice and how this patient's information will be protected.
                        </small>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="mb-0" >Immunization Registry Status *</Form.Label>
                                    <Form.Select {...register('immunizationRegistryStatus')} isInvalid={!!errors?.immunizationRegistryStatus} style={{ fontSize: '12px', fontWeight: '400', padding: '6px', backgroundColor: '#e8f0fe', border: '0px' }}>
                                        <option value="">Select status...</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="opt-out">Opt Out</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors?.immunizationRegistryStatus?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="mb-0" >Effective Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        {...register('immunizationEffectiveDate')}
                                        isInvalid={!!errors?.immunizationEffectiveDate}
                                        style={{ fontSize: '12px', fontWeight: '400', padding: '6px', backgroundColor: '#e8f0fe', border: '0px', color: 'black' }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors?.immunizationEffectiveDate?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="mb-0" >Notification Preferences</Form.Label>
                                    <Form.Select {...register('immunizationNotificationPreference')} style={{ fontSize: '12px', fontWeight: '400', padding: '6px', backgroundColor: '#e8f0fe', border: '0px' }}>
                                        <option value="">Select preference...</option>
                                        <option value="email">Email</option>
                                        <option value="phone">Phone</option>
                                        <option value="mail">Mail</option>
                                        <option value="none">No Notifications</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group>
                            <Form.Label className="mb-0" >Stop Immunization Registry Uploads? *</Form.Label>
                            <div>
                                <Form.Check
                                    type="radio"
                                    id="immunization-stop-yes"
                                    label="Yes, protect the data. Client (or guardian) has requested that the information be protected."
                                    value="yes"
                                    {...register('stopImmunizationUploads')}
                                    style={{ fontSize: '12px' }}
                                />
                                <Form.Check
                                    type="radio"
                                    id="immunization-stop-no"
                                    label="No, data may be shared with other clinicians."
                                    value="no"
                                    {...register('stopImmunizationUploads')}
                                    style={{ fontSize: '12px' }}
                                />
                                <Form.Check
                                    type="radio"
                                    id="immunization-stop-unspecified"
                                    label="No determination made regarding information sharing."
                                    value="unspecified"
                                    {...register('stopImmunizationUploads')}
                                    style={{ fontSize: '12px' }}
                                />
                            </div>
                            {errors?.stopImmunizationUploads && (
                                <div className="text-danger small mt-1">
                                    {errors.stopImmunizationUploads.message}
                                </div>
                            )}
                        </Form.Group>
                    </Card.Body>
                </Card>

                {/* Prescription History */}
                <Card className="mb-3 box-shadow-none">
                    <Card.Header>
                        <h6 className="mb-0" style={{ fontSize: '15px', fontWeight: '500' }}>Prescription History</h6>
                        <small className="text-muted" style={{ fontSize: '12px' }}>
                            With patient consent, you can view and reconcile prescription history whenever medications are ordered or appointments are scheduled.
                        </small>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group>
                            <Form.Label className="mb-0" >Prescription History Consent *</Form.Label>
                            <div>
                                <Form.Check
                                    type="radio"
                                    id="prescription-consent-yes"
                                    label="Patient gives consent to retrieve prescription history when requested"
                                    value="yes"
                                    {...register('prescriptionHistoryConsent')}
                                    style={{ fontSize: '12px' }}
                                />
                                <Form.Check
                                    type="radio"
                                    id="prescription-consent-no"
                                    label="Patient does not give consent to retrieve prescription history"
                                    value="no"
                                    {...register('prescriptionHistoryConsent')}
                                    style={{ fontSize: '12px' }}
                                />
                            </div>
                            {errors?.prescriptionHistoryConsent && (
                                <div className="text-danger small mt-1">
                                    {errors.prescriptionHistoryConsent.message}
                                </div>
                            )}
                        </Form.Group>
                    </Card.Body>
                </Card>

                {/* Appointment Reminders and Messaging */}
                <Card className="mb-3 box-shadow-none">
                    <Card.Header>
                        <h6 className="mb-0" style={{ fontSize: '15px', fontWeight: '500' }}>Appointment Reminders & Messaging</h6>
                        <small className="text-muted" style={{ fontSize: '12px' }}>Practice setting is OFF. Reminders will not send.</small>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="switch"
                                id="email-reminders"
                                label="Email reminders and messaging"
                                {...register('emailReminders')}
                                style={{ fontSize: '12px' }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="mb-0" >Text or Call Patients with Reminders</Form.Label>
                            <Form.Text className="d-block text-muted mb-2" style={{ fontSize: '12px' }}>
                                Record patient consent to turn on text and voice reminders.
                            </Form.Text>
                            <Row>
                                <Col md={6}>
                                    <Form.Label className="small mb-0" >Text/SMS Reminders</Form.Label>
                                    <div>
                                        <Form.Check
                                            type="radio"
                                            id="text-sms-off"
                                            label="OFF — Text / SMS reminders"
                                            value="off"
                                            {...register('textSmsReminders')}
                                            style={{ fontSize: '12px' }}
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="text-sms-on"
                                            label="ON — Text / SMS reminders"
                                            value="on"
                                            {...register('textSmsReminders')}
                                            style={{ fontSize: '12px' }}
                                        />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <Form.Label className="small mb-0" >Voice Reminders</Form.Label>
                                    <div>
                                        <Form.Check
                                            type="radio"
                                            id="voice-off"
                                            label="OFF — Voice reminders"
                                            value="off"
                                            {...register('voiceReminders')}
                                            style={{ fontSize: '12px' }}
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="voice-on"
                                            label="ON — Voice reminders"
                                            value="on"
                                            {...register('voiceReminders')}
                                            style={{ fontSize: '12px' }}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Card.Body>
                </Card>

                {/* Form Actions */}
                <div className="d-flex gap-2 justify-content-end">
                    <Button
                        onClick={handleReset}
                        className='custom-buttons'
                        disabled={isSubmitting || isLoading}
                    >
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className='custom-buttons'
                    >
                        {isSubmitting || isLoading ? (
                            <>
                                <Spinner size="sm" className="me-2" />
                                Saving...
                            </>
                        ) : (
                            'Save Consent Information'
                        )}
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default ConsentSection;
export { consentSchema, consentDefaultValues };