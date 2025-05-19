import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Col, Form, Row } from 'react-bootstrap';
import './settingtabs.css';

const initialLeftSections = [
    { id: 'summary', label: 'Summary' },
    { id: 'templates', label: 'Templates' },
    { id: 'past', label: 'Past encounters' },
];

const initialRightSections = [
    { id: 'chief', label: 'Chief complaint', visible: false },
    { id: 'health', label: 'Health concerns', visible: false },
    { id: 'flowsheets', label: 'Flowsheets', visible: false },
    { id: 'meds', label: 'Medications/Prescription orders', visible: true, minimized: false },
    { id: 'note', label: 'Plan note', visible: true },
    { id: 'assessmentNote', label: 'Assessment note', visible: false },
    { id: 'screenings', label: 'Screenings/Interventions/Assessments', visible: false },
    { id: 'diagnoses', label: 'Diagnoses attached to encounter', visible: false },
    { id: 'labOrders', label: 'Lab orders', visible: true },
    { id: 'imagingOrders', label: 'Imaging orders', visible: true },
    { id: 'carePlan', label: 'Care plan', visible: true },
    { id: 'attachedDocs', label: 'Documents attached to encounter', visible: true },
    { id: 'quality', label: 'Quality of care', visible: false },
    { id: 'referral', label: 'Referral', visible: false },
    { id: 'superbill', label: 'Superbill', visible: false },
];

const SettingTabs = () => {
    const [leftSections, setLeftSections] = useState(initialLeftSections);
    const [rightSections, setRightSections] = useState(initialRightSections);

    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const isLeft = source.droppableId === 'left';
        const list = isLeft ? [...leftSections] : [...rightSections];
        const moved = list.splice(source.index, 1)[0];
        list.splice(destination.index, 0, moved);

        if (isLeft) setLeftSections(list);
        else setRightSections(list);
    };

    const toggleVisibility = (id) => {
        setRightSections((prev) =>
            prev.map((section) => (section.id === id ? { ...section, visible: !section.visible } : section))
        );
    };

    const toggleMinimize = (id) => {
        setRightSections((prev) =>
            prev.map((section) => (section.id === id ? { ...section, minimized: !section.minimized } : section))
        );
    };

    return (
        <Row className="mt-0">
            <div className="p-3">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Row>
                        {/* Left Column */}
                        <Col md={12}>
                            <div className="d-flex align-items-center mb-1">
                                <h5 className="">Left Panel Display Settings</h5>
                                <Form.Check type="checkbox" label="Minimize by default" className="ms-4" />
                            </div>

                            <Droppable droppableId="left" direction="horizontal">
                                {(provided) => (
                                    <Row className="g-3" ref={provided.innerRef} {...provided.droppableProps}>
                                        {leftSections.map((section, index) => (
                                            <Draggable key={section.id} draggableId={section.id} index={index}>
                                                {(provided) => (
                                                    <Col
                                                        md={4}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}>
                                                        <div className="draggable-card d-flex align-items-center justify-content-between">
                                                            {section.label}
                                                            <span className="drag-icon">≡</span>
                                                        </div>
                                                    </Col>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Row>
                                )}
                            </Droppable>
                        </Col>

                        {/* Right Column */}
                        <Col md={12}>
                            <h5 className="mb-2">Clinical Form & Display Settings</h5>
                            <p className="text-muted mb-4">
                                Customize your chart note view for all patients by modifying the display settings below.
                            </p>

                            <Droppable droppableId="right" direction="horizontal">
                                {(provided) => (
                                    <Row className="g-3" ref={provided.innerRef} {...provided.droppableProps}>
                                        {rightSections.map((section, index) => (
                                            <Draggable key={section.id} draggableId={section.id} index={index}>
                                                {(provided) => (
                                                    <Col
                                                        md={6}
                                                        className="mt-0"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}>
                                                        <div className="draggable-card">
                                                            <div className="w-100 d-flex justify-content-between align-items-center">
                                                                <div className="d-flex align-items-center">
                                                                    <span className="me-2 fw-bold">{index + 1}</span>
                                                                    <strong>{section.label}</strong>
                                                                </div>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    {[
                                                                        'meds',
                                                                        'note',
                                                                        'plan',
                                                                        'labOrders',
                                                                        'imagingOrders',
                                                                    ].includes(section.id) && (
                                                                            <Form.Check
                                                                                type="switch"
                                                                                id={`minimize-${section.id}`}
                                                                                checked={section.minimized || false}
                                                                                onChange={() => toggleMinimize(section.id)}
                                                                                label="Minimize By Default"
                                                                            />
                                                                        )}
                                                                    <Form.Check
                                                                        type="switch"
                                                                        id={`visible-${section.id}`}
                                                                        checked={section.visible}
                                                                        onChange={() => toggleVisibility(section.id)}
                                                                    />
                                                                    <span className="drag-icon">≡</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Row>
                                )}
                            </Droppable>
                        </Col>
                    </Row>
                </DragDropContext>
            </div>
        </Row>
    );
};

export default SettingTabs;
