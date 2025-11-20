import React, { useState } from 'react';
import { Card, Row, Col, Button, Badge, Alert, Table } from 'react-bootstrap';
import { FiEdit, FiX, FiPrinter, FiClock } from 'react-icons/fi';
import { cancelServiceRequest } from '../../../../../utils/fhirUtils';

const LabRequestDetails = ({ request, patientDetails, onEdit, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getStatusBadge = (status) => {
        const variants = {
            draft: 'secondary',
            active: 'primary',
            completed: 'success',
            revoked: 'danger'
        };
        return <Badge bg={variants[status] || 'secondary'}>{status?.toUpperCase()}</Badge>;
    };

    const getPriorityBadge = (priority) => {
        const variants = {
            routine: 'success',
            urgent: 'warning',
            stat: 'danger'
        };
        return <Badge bg={variants[priority] || 'secondary'}>{priority?.toUpperCase()}</Badge>;
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this lab request?')) return;

        setLoading(true);
        setError('');

        try {
            await cancelServiceRequest(request.id);
            onBack();
        } catch (err) {
            setError(err.message || 'Failed to cancel lab request');
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return 'Not specified';
        return new Date(dateTime).toLocaleString();
    };

    const statusTimeline = [
        { status: 'draft', date: request.authoredOn, label: 'Order Created' },
        { status: 'active', date: request.status === 'active' ? request.authoredOn : null, label: 'Order Submitted' },
        { status: 'completed', date: request.status === 'completed' ? new Date().toISOString() : null, label: 'Specimen Collected' },
        { status: 'resulted', date: null, label: 'Results Available' }
    ];

    return (
        <div>
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Header */}
            <Card className="mb-3">
                <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="mb-0">Lab Request Details</h6>
                        <small className="text-muted">Order ID: {request.id}</small>
                    </div>
                    <div className="d-flex gap-2">
                        {getStatusBadge(request.status)}
                        {getPriorityBadge(request.priority)}
                    </div>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={3}>
                            <strong>Patient:</strong><br />
                            {patientDetails?.name?.[0]?.family}, {patientDetails?.name?.[0]?.given?.join(' ')}
                        </Col>
                        <Col md={3}>
                            <strong>Order Date:</strong><br />
                            {formatDateTime(request.authoredOn)}
                        </Col>
                        <Col md={3}>
                            <strong>Ordering Provider:</strong><br />
                            {request.requester?.display || 'Current Provider'}
                        </Col>
                        <Col md={3}>
                            <strong>MRN:</strong><br />
                            {patientDetails?.identifier?.[0]?.value}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Test Details */}
            <Card className="mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0">Requested Tests</h6>
                </Card.Header>
                <Card.Body>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Test Name</th>
                                <th>LOINC Code</th>
                                <th>Priority</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{request.code?.coding?.[0]?.display}</td>
                                <td>{request.code?.coding?.[0]?.code}</td>
                                <td>{getPriorityBadge(request.priority)}</td>
                                <td>{getStatusBadge(request.status)}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Clinical Information */}
            <Card className="mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0">Clinical Information</h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <strong>Reason for Test:</strong><br />
                            {request.reasonCode?.[0]?.text || 'Not specified'}
                        </Col>
                        <Col md={6}>
                            <strong>ICD-10 Code:</strong><br />
                            {request.reasonCode?.[0]?.coding?.[0]?.code || 'Not specified'}
                        </Col>
                    </Row>
                    {request.note?.[0]?.text && (
                        <Row className="mt-3">
                            <Col>
                                <strong>Additional Notes:</strong><br />
                                {request.note[0].text}
                            </Col>
                        </Row>
                    )}
                </Card.Body>
            </Card>

            {/* Specimen Requirements */}
            <Card className="mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0">Specimen Requirements</h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <strong>Specimen Type:</strong><br />
                            {request.specimen?.[0]?.type?.coding?.[0]?.display || 'Blood'}
                        </Col>
                        <Col md={4}>
                            <strong>Fasting Required:</strong><br />
                            {request.supportingInfo?.some(info => info.valueBoolean) ? 'Yes' : 'No'}
                        </Col>
                        <Col md={4}>
                            <strong>Collection Date/Time:</strong><br />
                            {formatDateTime(request.occurrenceDateTime)}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Status Timeline */}
            <Card className="mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0">Status Timeline</h6>
                </Card.Header>
                <Card.Body>
                    <div className="timeline">
                        {statusTimeline.map((item, index) => (
                            <div key={index} className={`timeline-item ${item.date ? 'completed' : 'pending'}`}>
                                <div className="timeline-marker">
                                    <FiClock />
                                </div>
                                <div className="timeline-content">
                                    <strong>{item.label}</strong>
                                    {item.date && <div className="text-muted small">{formatDateTime(item.date)}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card.Body>
            </Card>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-2">
                {(request.status === 'draft' || request.status === 'active') && (
                    <Button
                        // variant="outline-danger" 
                        className='cancel-button'
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel Order
                    </Button>
                )}
                <Button
                    // variant="outline-secondary"
                    className='custom-buttons'
                    onClick={handlePrint}
                >
                    {/* <FiPrinter className="me-1" /> */}
                    Print Requisition
                </Button>

                {request.status === 'draft' && (
                    <Button
                        // variant="outline-primary"
                        className='custom-buttons'
                        onClick={() => onEdit(request)}
                    >
                        {/* <FiEdit className="me-1" /> */}
                        Edit Order
                    </Button>
                )}
            </div>

            <style jsx>{`
                .timeline {
                    position: relative;
                    padding-left: 30px;
                }
                
                .timeline-item {
                    position: relative;
                    margin-bottom: 20px;
                }
                
                .timeline-item:before {
                    content: '';
                    position: absolute;
                    left: -22px;
                    top: 20px;
                    bottom: -20px;
                    width: 2px;
                    background: #dee2e6;
                }
                
                .timeline-item:last-child:before {
                    display: none;
                }
                
                .timeline-marker {
                    position: absolute;
                    left: -30px;
                    top: 0;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #6c757d;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 8px;
                    color: white;
                }
                
                .timeline-item.completed .timeline-marker {
                    background: #28a745;
                }
                
                .timeline-content {
                    padding-left: 10px;
                }
            `}</style>
        </div>
    );
};

export default LabRequestDetails;