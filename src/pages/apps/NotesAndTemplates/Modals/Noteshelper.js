import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { IoSettings, IoDocumentTextOutline } from 'react-icons/io5';
import '../settingtabs.css';
const NoteTypeCards = ({ noteTypes, handleDefaultChange, handleOpenTab }) => {
    const today = new Date();
    const date = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <Row className="mt-3">
            {noteTypes.map((note) => (
                <Col key={note.id} md={6} lg={4} xl={3} className="mb-4">
                    <Card className="h-100 border-0 shadow-sm rounded-1 folded-corner">
                        <Card.Body className="d-flex flex-column justify-content-between p-2 ">
                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-1">
                                        <IoDocumentTextOutline size={18} />
                                    </div>
                                    <div>
                                        <div className="fw-semibold p-0 m-0">{note.name}</div>
                                        <div className="text-muted p-0 m-0" style={{ fontSize: '9px' }}>
                                            {note.isDefault ? <> (Default)</> : ''}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-0 p-0" style={{ fontSize: '10px' }}>
                                        Created on
                                    </div>
                                    <div className="text-muted fw-bold mt-0 p-0" style={{ fontSize: '10px' }}>
                                        {date}
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="mb-1">
                                <div className="text-muted d-flex align-items-center justify-content-between small mb-1">
                                    <div className="fw-bold">Format:</div>
                                    <div>{note.format}</div>
                                </div>
                                <div className="text-muted d-flex align-items-center justify-content-between small mb-1">
                                    <div className="fw-bold">Confidential:</div>
                                    <div>{note.isPsychotherapyNote ? 'Yes' : 'No'}</div>
                                </div>
                            </div>

                            {/* Toggles and radio */}
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="small">Enabled</div>

                                <div>
                                    <Form.Check
                                        type="switch"
                                        id={`active-switch-${note.id}`}
                                        checked={note.isActive}
                                        readOnly
                                        className="me-"
                                    />
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        type="radio"
                                        name="defaultNote"
                                        className="me-1"
                                        checked={note.isDefault}
                                        onChange={() => handleDefaultChange(note.id)}
                                    />
                                    <span className="small">Default</span>
                                </div>
                                <div>
                                    <button
                                        className="btn btn-sm text-primary d-flex align-items-center p-0"
                                        onClick={() => handleOpenTab(note)}
                                        style={{ gap: '4px' }}>
                                        <IoSettings size={16} /> Settings
                                    </button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default NoteTypeCards;
