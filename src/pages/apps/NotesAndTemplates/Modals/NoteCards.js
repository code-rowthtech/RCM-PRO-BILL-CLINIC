import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { IoSettings, IoDocumentTextOutline } from 'react-icons/io5';
import '../settingtabs.css';
import { useSelector } from 'react-redux';
const NoteTypeCards = ({ handleDefaultChange, handleOpenTab }) => {
    const store = useSelector((state) => state);
    const NotesCategoriesData = store?.getNoteCategoriesReducer?.data?.data;
    console.log(NotesCategoriesData,'Notesssss')
    const today = new Date();
    const date = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <Row className="mt-3">
            {NotesCategoriesData?.map((note) => (
                <Col key={note?.id} md={6} lg={4} xl={3} className="mb-4">
                    <Card
                        className="border-0 shadow-sm rounded-3 note-type-card"
                        style={{
                            height: '190px',
                            // background: 'linear-gradient(to right, #f8f9fa, #e9f0ff)',
                        }}>
                        <Card.Body className="p-2">
                            <Row className="h-100">
                                {/* LEFT */}
                                <Col md={8} className="d-flex flex-column justify-content-between">
                                    {/* Icon + Name */}
                                    <div className="d-flex align-items-center mb-2">
                                        <div
                                            className="d-flex align-items-center justify-content-center me-2"
                                            style={{
                                                width: 32,
                                                height: 32,
                                                backgroundColor: '#e0f0ff',
                                                borderRadius: '50%',
                                                color: '#0d6efd',
                                            }}>
                                            <IoDocumentTextOutline size={16} />
                                        </div>
                                        <div>
                                            <div className="fw-bold text-dark">{note?.noteType}</div>
                                            {note.isDefault && (
                                                <div className="text-muted" style={{ fontSize: '10px' }}>
                                                    (Default)
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Labels */}
                                    <div className="text-muted small">
                                        <div className="fw-semibold">Format</div>
                                        <div className="fw-semibold">Confidential</div>
                                        <div className="fw-semibold">Enabled</div>
                                    </div>

                                    {/* Radio */}
                                    <div className="d-flex align-items-center mt-1">
                                        <Form.Check
                                            type="radio"
                                            name="defaultNote"
                                            className="me-1"
                                            checked={note?.default}
                                            onChange={() => handleDefaultChange(note?.id)}
                                        />
                                        <span className="small fw-medium">Default</span>
                                    </div>
                                </Col>

                                {/* RIGHT */}
                                <Col md={4} className=" d-flex flex-column justify-content-between">
                                    {/* Date */}
                                    <div>
                                        <div className="text-muted small mb-0">Created on</div>
                                        <div className="fw-bold" style={{ fontSize: '10px', color: '#6c757d' }}>
                                            {date}
                                        </div>
                                    </div>

                                    {/* Values */}
                                    <div className="small text-muted mt-2">
                                        <div>{note?.format}</div>
                                        <div>{note?.probillDefaults ? 'Yes' : 'No'}</div>
                                    </div>

                                    {/* Toggle */}
                                    <div>
                                        <Form.Check
                                            type="switch"
                                            id={`active-switch-${note?.id}`}
                                            checked={note?.active}
                                            readOnly
                                        />
                                    </div>

                                    {/* Settings */}
                                    <div className="mt-2">
                                        <button
                                            className="btn btn-sm text-primary d-flex align-items-center p-0"
                                            onClick={() => handleOpenTab(note)}
                                            style={{ gap: '4px' }}>
                                            <IoSettings size={16} /> Settings
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default NoteTypeCards;
