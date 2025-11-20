import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Card, Badge, Alert } from 'react-bootstrap';
import { FiSave, FiSend, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { createServiceRequest, updateServiceRequest } from '../../../../../utils/fhirUtils';

const LabRequestForm = ({ patientId, patientDetails, selectedRequest, onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: selectedRequest ? {
            testCode: selectedRequest.code?.coding?.[0]?.code || '',
            testName: selectedRequest.code?.coding?.[0]?.display || '',
            priority: selectedRequest.priority || 'routine',
            reasonCode: selectedRequest.reasonCode?.[0]?.coding?.[0]?.code || '',
            reasonText: selectedRequest.reasonCode?.[0]?.text || '',
            specimenType: selectedRequest.specimen?.[0]?.type?.coding?.[0]?.code || 'blood',
            fastingRequired: selectedRequest.supportingInfo?.some(info => info.valueBoolean) || false,
            clinicalInfo: selectedRequest.note?.[0]?.text || '',
            collectionDate: selectedRequest.occurrenceDateTime?.split('T')[0] || '',
            collectionTime: selectedRequest.occurrenceDateTime?.split('T')[1]?.split('.')[0] || ''
        } : {
            priority: 'routine',
            specimenType: 'blood',
            fastingRequired: false
        }
    });

    const commonTests = [
        { code: '33747-0', display: 'Complete Blood Count (CBC)' },
        { code: '24323-8', display: 'Comprehensive Metabolic Panel (CMP)' },
        { code: '24362-6', display: 'Basic Metabolic Panel (BMP)' },
        { code: '57698-3', display: 'Lipid Panel' },
        { code: '33743-4', display: 'Thyroid Function Panel' },
        { code: '5902-2', display: 'Prothrombin Time (PT)' },
        { code: '6301-6', display: 'Partial Thromboplastin Time (PTT)' },
        { code: '33747-0', display: 'Hemoglobin A1C' }
    ];

    const specimenTypes = [
        { code: 'blood', display: 'Blood' },
        { code: 'urine', display: 'Urine' },
        { code: 'stool', display: 'Stool' },
        { code: 'swab', display: 'Swab' },
        { code: 'tissue', display: 'Tissue' }
    ];

    const onSubmit = async (data, isDraft = false) => {
        setLoading(true);
        setError('');

        try {
            const serviceRequest = {
                resourceType: 'ServiceRequest',
                id: selectedRequest?.id,
                status: isDraft ? 'draft' : 'active',
                intent: 'order',
                code: {
                    coding: [{
                        system: 'http://loinc.org',
                        code: data.testCode,
                        display: data.testName
                    }]
                },
                subject: {
                    reference: `Patient/${patientId}`,
                    display: `${patientDetails?.name?.[0]?.family}, ${patientDetails?.name?.[0]?.given?.join(' ')}`
                },
                priority: data.priority,
                reasonCode: data.reasonCode ? [{
                    coding: [{
                        system: 'http://hl7.org/fhir/sid/icd-10-cm',
                        code: data.reasonCode,
                        display: data.reasonText
                    }],
                    text: data.reasonText
                }] : undefined,
                specimen: [{
                    type: {
                        coding: [{
                            system: 'http://snomed.info/sct',
                            code: data.specimenType,
                            display: specimenTypes.find(s => s.code === data.specimenType)?.display
                        }]
                    }
                }],
                supportingInfo: data.fastingRequired ? [{
                    valueBoolean: true,
                    text: 'Fasting required'
                }] : undefined,
                note: data.clinicalInfo ? [{
                    text: data.clinicalInfo
                }] : undefined,
                occurrenceDateTime: data.collectionDate && data.collectionTime ?
                    `${data.collectionDate}T${data.collectionTime}:00.000Z` : undefined,
                authoredOn: new Date().toISOString(),
                requester: {
                    reference: 'Practitioner/current-user',
                    display: 'Current Provider'
                }
            };

            if (selectedRequest) {
                await updateServiceRequest(selectedRequest.id, serviceRequest);
            } else {
                await createServiceRequest(serviceRequest);
            }

            onSuccess();
        } catch (err) {
            setError(err.message || 'Failed to save lab request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit((data) => onSubmit(data, false))}>
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Patient Info */}
            {/* <Card className="mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0">Patient Information</h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <strong>Name:</strong> {patientDetails?.name?.[0]?.family}, {patientDetails?.name?.[0]?.given?.join(' ')}
                        </Col>
                        <Col md={4}>
                            <strong>DOB:</strong> {patientDetails?.birthDate}
                        </Col>
                        <Col md={4}>
                            <strong>MRN:</strong> {patientDetails?.identifier?.[0]?.value}
                        </Col>
                    </Row>
                </Card.Body>
            </Card> */}

            {/* Order Details */}
            <Card className="mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0">Order Details</h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Test/Panel <span className="text-danger">*</span></Form.Label>
                                <Form.Select
                                    {...register('testCode', { required: 'Test selection is required' })}
                                    onChange={(e) => {
                                        const selected = commonTests.find(t => t.code === e.target.value);
                                        setValue('testName', selected?.display || '');
                                    }}
                                    isInvalid={!!errors.testCode}
                                >
                                    <option value="">Select a test...</option>
                                    {commonTests.map(test => (
                                        <option key={test.code} value={test.code}>{test.display}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.testCode?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Priority <span className="text-danger">*</span></Form.Label>
                                <Form.Select {...register('priority', { required: true })}>
                                    <option value="routine">Routine</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="stat">STAT</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>ICD-10 Code</Form.Label>
                                <Form.Control
                                    {...register('reasonCode')}
                                    placeholder="e.g., Z00.00"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Reason for Test</Form.Label>
                                <Form.Control
                                    {...register('reasonText')}
                                    placeholder="e.g., Annual physical, Follow-up"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Additional Clinical Information</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    {...register('clinicalInfo')}
                                    placeholder="Enter any relevant clinical notes..."
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Specimen Instructions */}
            <Card className="mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0">Specimen Instructions</h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Specimen Type <span className="text-danger">*</span></Form.Label>
                                <Form.Select {...register('specimenType', { required: true })}>
                                    {specimenTypes.map(type => (
                                        <option key={type.code} value={type.code}>{type.display}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Fasting Required"
                                    {...register('fastingRequired')}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Collection Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    {...register('collectionDate')}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Collection Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    {...register('collectionTime')}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-2">
                <Button
                    className='cancel-button'
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>

                {/* <Button
                    variant="outline-primary"
                    onClick={handleSubmit((data) => onSubmit(data, true))}
                    disabled={loading}
                >
                    Save as Draft
                </Button> */}

                <Button
                    className='custom-buttons'
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit Order'}
                </Button>
            </div>
        </Form>
    );
};

export default LabRequestForm;