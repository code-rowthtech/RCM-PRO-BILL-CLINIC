import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Col, Form, Row, Button, Offcanvas } from 'react-bootstrap';
import { MdAddCircleOutline } from 'react-icons/md';
import './settingtabs.css';

const initialLeftSections = [
    { id: 'summary', label: 'Summary' },
    { id: 'templates', label: 'Templates' },
    { id: 'past', label: 'Past encounters' },
];

const initialOffcanvasSections = [
    { id: 'problems', label: 'Problems' },
    { id: 'notes', label: 'Notes' },
    { id: 'medical', label: 'Medical' },
    { id: 'notes2', label: 'Notes2' },
    { id: 'custom', label: 'Custom' },
];

const NOTE_TYPE_OPTIONS = {
    'Encounter-Based': [
        'Reason for Visit',
        'Health Status',
        'Monitoring Chart (Vitals)',
        'Prescriptions (Medications)',
        'Notes (SOAP)',
        'Notes (Simple)',
        'Attached Records',
        'Outcome Review',
        'Refer to another Provider',
        'Patient Education',
        'Social History',
        'Lab Results',
        'Provider Notes',
        'Consent Forms',
    ],
    'Nursing & Allied Health': [
        'Vital Signs Log',
        'Intake & Output',
        'Wound Care Notes',
        'Mobility Assessment',
        'Pain Assessment (e.g. scale 1–10)',
        'Fall Risk Assessment',
        'ADLs (Activities of Daily Living)',
        'Skin Integrity',
        'Nutritional Intake',
        'Patient Education / Teaching',
        'Shift Notes / Progress Notes',
        'IV / Catheter Management',
        'Care Plan Update',
    ],
    'Psychiatric & Behavioral Health': [
        'Patient Contact Logs',
        'Consent Forms (treatment, release of info)',
        'Appointment Scheduling / Rescheduling',
        'Insurance Verification',
        'Interpreter Use Log',
        'Communication Notes (calls, emails, etc.)',
        'No-show / Cancellation Record',
        'Patient Complaints / Feedback',
        'Billing Codes / Procedure Documentation',
        'Medical-Legal Documentation (if applicable)',
    ],
    'Administrative & Communication': [
        'Patient Contact Logs',
        'Consent Forms (treatment, release of info)',
        'Appointment Scheduling / Rescheduling',
        'Insurance Verification',
        'Interpreter Use Log',
        'Communication Notes (calls, emails, etc.)',
        'No-show / Cancellation Record',
        'Patient Complaints / Feedback',
        'Billing Codes / Procedure Documentation',
        'Medical-Legal Documentation (if applicable)',
    ],
    'Diagnostic & Monitoring': [
        'Lab Orders & Results',
        'Imaging Orders & Reports',
        'ECG / EEG / Spirometry Reports',
        'Glucose Monitoring Logs',
        'Weight/BMI Tracking',
        'Infection Screening (TB, COVID, etc.)',
        'Observation Notes',
        'Remote Monitoring Data',
        'Diagnostic Impressions',
        'Alerts/Flags (e.g. abnormal vitals)',
    ],
};

const SettingTabs = ({ noteType }) => {
    const noteTypeId = noteType;
    console.log(noteTypeId, 'noteTypeId');
    const [leftSections] = useState(initialLeftSections);
    const [activeSections, setActiveSections] = useState([]); // unified active sections (including custom)
    const [offcanvasSections, setOffcanvasSections] = useState(
        NOTE_TYPE_OPTIONS[noteType]?.map((label, index) => ({
            id: `${noteType}-${index}`,
            label,
        })) || []
    );
    const [showCanvas, setShowCanvas] = useState(false);
    const [showCustomFields, setShowCustomFields] = useState(false);
    const [customFieldData, setCustomFieldData] = useState({
        fieldName: '',
        inputType: '',
    });

    // Drag and drop reorder for activeSections
    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        // Only reorder if dragged within the same droppable
        if (source.droppableId === destination.droppableId) {
            const reordered = Array.from(activeSections);
            const [moved] = reordered.splice(source.index, 1);
            reordered.splice(destination.index, 0, moved);
            setActiveSections(reordered);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomFieldData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddCustomField = () => {
        if (!customFieldData.fieldName || !customFieldData.inputType) return;

        const newSection = {
            id: `custom-${Date.now()}`,
            label: customFieldData.fieldName,
            inputType: customFieldData.inputType,
            visible: true,
            minimized: false,
        };
        setActiveSections([...activeSections, newSection]);
        setCustomFieldData({ fieldName: '', inputType: '' });
        setShowCustomFields(false);
        setShowCanvas(false);
    };

    // When user clicks a card in Offcanvas to move it to activeSections
    const handleOffcanvasCardClick = (section) => {
        if (section.id === 'custom') {
            setShowCustomFields((prev) => !prev);
            return;
        }

        // Add clicked section to activeSections only if not already present
        if (!activeSections.find((s) => s.id === section.id)) {
            setActiveSections([...activeSections, { ...section, visible: true, minimized: false }]);
        }

        // Remove clicked section from offcanvasSections
        setOffcanvasSections(offcanvasSections.filter((s) => s.id !== section.id));
    };

    // Toggle visible or minimized states of a section
    const toggleSectionProperty = (id, prop) => {
        setActiveSections((prev) => prev.map((sec) => (sec.id === id ? { ...sec, [prop]: !sec[prop] } : sec)));
    };
useEffect(() => {
    if (NOTE_TYPE_OPTIONS[noteType]) {
        const sections = NOTE_TYPE_OPTIONS[noteType].map((label, index) => ({
            id: `${noteType}-${index}`,
            label,
        }));
        // Always append the "Custom" section at the end
        sections.push({ id: 'custom', label: 'Custom' });
        setOffcanvasSections(sections);
    } else {
        setOffcanvasSections([{ id: 'custom', label: 'Custom' }]);
    }
}, [noteType]);

    return (
        <Row className="mt-0">
            <div className="p-1" style={{ width: '100%' }}>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Row>
                        <Col md={12} className="d-flex align-items-center">
                            <h5>Clinical Form Sections</h5>
                            <MdAddCircleOutline
                                size={24}
                                className="text-primary cursor-pointer ms-2"
                                onClick={() => setShowCanvas(true)}
                            />
                        </Col>
                    </Row>

                    <Row className="mt-1">
                        <Col md={8}>
                            {/* Droppable area for all active sections (including custom) */}
                            <Droppable droppableId="active-sections">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {activeSections.map((section, index) => (
                                            <Draggable key={section.id} draggableId={section.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="mb-2">
                                                        <Card className="draggable-card p-2">
                                                            <div className="w-100 d-flex justify-content-between align-items-center">
                                                                <div className="d-flex align-items-center">
                                                                    <span className="me-2 fw-bold">{index + 1}</span>
                                                                    <strong>{section.label}</strong>
                                                                </div>

                                                                <div className="d-flex align-items-center gap-2">
                                                                    <Form.Check
                                                                        type="switch"
                                                                        id={`minimize-${section.id}`}
                                                                        checked={section.minimized || false}
                                                                        label="Minimize By Default"
                                                                        onChange={() =>
                                                                            toggleSectionProperty(
                                                                                section.id,
                                                                                'minimized'
                                                                            )
                                                                        }
                                                                    />
                                                                    <Form.Check
                                                                        type="switch"
                                                                        id={`visible-${section.id}`}
                                                                        checked={section.visible ?? true}
                                                                        label="Visible"
                                                                        onChange={() =>
                                                                            toggleSectionProperty(section.id, 'visible')
                                                                        }
                                                                    />

                                                                    <span
                                                                        className="drag-icon"
                                                                        style={{ cursor: 'grab' }}>
                                                                        ≡
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </Col>
                    </Row>
                </DragDropContext>
            </div>

            <Offcanvas
                show={showCanvas}
                onHide={() => {
                    setShowCanvas(false);
                    setShowCustomFields(false);
                }}
                placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Add New Section</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {offcanvasSections?.map((section) => (
                        <Card
                            key={section.id}
                            className="draggable-card p-2 mb-2"
                            onClick={() => handleOffcanvasCardClick(section)}
                            style={section.id === 'custom' ? { cursor: 'pointer' } : {}}>
                            <div className="w-100 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <strong>{section.label}</strong>
                                </div>
                            </div>
                        </Card>
                    ))}

                    <Form className="mt-3">
                        {showCustomFields && (
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Field Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="fieldName"
                                            value={customFieldData.fieldName}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Input Type</Form.Label>
                                        <Form.Select
                                            name="inputType"
                                            value={customFieldData.inputType}
                                            onChange={handleInputChange}>
                                            <option value="">Select Type</option>
                                            <option value="text">Text</option>
                                            <option value="text-editor">Text Editor</option>
                                            <option value="text-area">Text Area</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={12} className="d-flex align-items-center justify-content-end">
                                    <Button
                                        variant="primary"
                                        className="custom-buttons text-white"
                                        onClick={handleAddCustomField}>
                                        Add
                                    </Button>
                                </Col>
                            </Row>
                        )}
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </Row>
    );
};

export default SettingTabs;
