import React from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { IoSettings } from 'react-icons/io5';
import { FaStickyNote, FaAppleAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import { IoDocumentTextOutline } from 'react-icons/io5';

const NoteTypeCards = ({ noteTypes, handleDefaultChange, handleOpenTab }) => {
    const getIcon = (name) => {
        switch (name.toLowerCase()) {
            case 'case review':
                return <IoDocumentTextOutline size={20} />;
        }
    };
    const today = new Date();
    const date = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <Row className="mt-3">
            {noteTypes.map((note) => (
                <Col key={note.id} md={6} lg={3} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Body>
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <div  className='d-flex align-items-center justify-content-center' >
                                    <span>
                                        <IoDocumentTextOutline size={15} className="me-1" />
                                    </span>
                                    <strong className='mb-0'>{note.name}</strong>
                                    {note.isDefault && <span className="text-muted"> (Default)</span>}
                                </div>
                                <div>{date}</div>
                            </div>
                            <div className="text-muted mb-1">Format: {note.format}</div>
                            <div className="text-muted mb-1">
                                Confidential: {note.isPsychotherapyNote ? 'Yes' : 'No'}
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                                <div>
                                    <span className="me-2">Enabled</span>
                                    <Form.Check
                                        type="switch"
                                        id={`active-switch-${note.id}`}
                                        checked={note.isActive}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <Form.Check
                                        type="radio"
                                        name="defaultNote"
                                        checked={note.isDefault}
                                        onChange={() => handleDefaultChange(note.id)}
                                    />
                                </div>
                            </div>
                            <div className="mt-2">
                                <button className="btn btn-link p-0" onClick={() => handleOpenTab(note)}>
                                    <IoSettings /> Settings
                                </button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default NoteTypeCards;
