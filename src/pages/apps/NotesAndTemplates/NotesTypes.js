import React, { useState } from 'react';
import { Card, Col, Row, Table, Form, Button } from 'react-bootstrap';
import { IoSettings } from 'react-icons/io5';

const noteTypeData = [
    { id: 1, name: 'Case Review', isActive: false, format: 'Simple', isPsychotherapyNote: false, isDefault: false },
    { id: 2, name: 'Nutrition Notes', isActive: false, format: 'Simple', isPsychotherapyNote: false, isDefault: false },
    { id: 3, name: 'Other', isActive: false, format: 'Simple', isPsychotherapyNote: false, isDefault: false },
    {
        id: 4,
        name: 'Patient Email Message',
        isActive: false,
        format: 'Simple',
        isPsychotherapyNote: false,
        isDefault: false,
    },
    {
        id: 5,
        name: 'Patient Phone Message',
        isActive: true,
        format: 'Simple',
        isPsychotherapyNote: false,
        isDefault: false,
    },
    { id: 6, name: 'SOAP Note', isActive: true, format: 'SOAP', isPsychotherapyNote: false, isDefault: true },
];

const NotesTypes = () => {
    const [noteTypes, setNoteTypes] = useState(noteTypeData);
    const [openTabs, setOpenTabs] = useState([]);
    const [activeTabId, setActiveTabId] = useState('clinical-notes-type'); // Default tab

    const handleDefaultChange = (id) => {
        const updated = noteTypes.map((note) => ({
            ...note,
            isDefault: note.id === id,
        }));
        setNoteTypes(updated);
    };

    const handleOpenTab = (note) => {
        const exists = openTabs.find((tab) => tab.id === note.id);
        if (!exists) {
            setOpenTabs((prev) => [...prev, note]);
        }
        setActiveTabId(note.id);
    };

    const handleCloseTab = (id) => {
        const updatedTabs = openTabs.filter((tab) => tab.id !== id);
        setOpenTabs(updatedTabs);

        if (activeTabId === id) {
            setActiveTabId(updatedTabs.length > 0 ? updatedTabs[0].id : 'clinical-notes-type');
        }
    };

    const activeNote = openTabs.find((tab) => tab.id === activeTabId);

    return (
        <Row className="mt-2">
            <Col xs={12} className="px-0">
                <Card className="scroll-container" style={{ height: '90vh', overflowY: 'scroll' }}>
                    <Card.Body className="px-3">
                        <Row>
                            <Col>
                                {openTabs.length > 0 && (
                                    <div
                                        className="d-flex gap-3"
                                        style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}
                                    >
                                        <span
                                            onClick={() => setActiveTabId('clinical-notes-type')}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') setActiveTabId('clinical-notes-type');
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            className={`fw-semibold cursor-pointer font_active_tabs ${
                                                activeTabId === 'clinical-notes-type' ? 'active_tabs_link fw-bold' : ''
                                            }`}
                                        >
                                            Clinical Notes Type
                                        </span>

                                        {openTabs.map((tab, index) => (
                                            <span
                                                key={tab.id}
                                                onClick={() => setActiveTabId(tab.id)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') setActiveTabId(tab.id);
                                                }}
                                                role="button"
                                                tabIndex={0}
                                                className={`fw-semibold cursor-pointer font_active_tabs ${
                                                    activeTabId === tab.id ? 'active_tabs_link fw-bold' : ''
                                                }`}
                                            >
                                                Setting {index + 1}
                                                <span
                                                    style={{
                                                        marginLeft: 8,
                                                        color: '#dc3545',
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold',
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCloseTab(tab.id);
                                                    }}
                                                    title="Close tab"
                                                >
                                                    ×
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </Col>
                        </Row>

                        <hr />

                        {activeTabId === 'clinical-notes-type' ? (
                            <Table responsive className="table-centered table-nowrap mb-0 rounded mt-1">
                                <thead>
                                    <tr>
                                        <th className="text-white">Default</th>
                                        <th className="text-white">Clinical Note Type</th>
                                        <th className="text-white">Active</th>
                                        <th className="text-white">Format</th>
                                        <th className="text-white">Psychotherapy Note</th>
                                        <th className="text-white">Customization</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {noteTypes.map((note) => (
                                        <tr key={note.id}>
                                            <td className="text-center align-middle">
                                                <Form.Check
                                                    type="radio"
                                                    name="defaultNote"
                                                    checked={note.isDefault}
                                                    onChange={() => handleDefaultChange(note.id)}
                                                />
                                            </td>
                                            <td className="align-middle">
                                                {note.name}
                                                {note.isDefault && (
                                                    <strong className="text-muted"> (Default)</strong>
                                                )}
                                            </td>
                                            <td className="text-center align-middle">
                                                <Form.Check type="checkbox" checked={note.isActive} disabled />
                                            </td>
                                            <td className="align-middle">{note.format}</td>
                                            <td className="align-middle">
                                                {note.isPsychotherapyNote ? 'Yes' : 'No'}
                                            </td>
                                            <td className="align-middle">
                                                <Button variant="link" size="sm" onClick={() => handleOpenTab(note)}>
                                                    <IoSettings /> Settings
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : activeNote ? (
                            <Card className="mt-3">
                                <Card.Body>
                                    <h6>Settings for: {activeNote.name}</h6>
                                    <p>
                                        <strong>Format:</strong> {activeNote.format}
                                    </p>
                                    <p>
                                        <strong>Active:</strong> {activeNote.isActive ? 'Yes' : 'No'}
                                    </p>
                                    <p>
                                        <strong>Psychotherapy Note:</strong>{' '}
                                        {activeNote.isPsychotherapyNote ? 'Yes' : 'No'}
                                    </p>
                                    {/* Add editable fields here if needed */}
                                </Card.Body>
                            </Card>
                        ) : (
                            <p>No settings available.</p>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default NotesTypes;
