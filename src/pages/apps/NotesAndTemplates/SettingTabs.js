import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Col, Form, Row } from 'react-bootstrap';
import './settingtabs.css';

const initialLeftSections = [
    { id: 'summary', label: 'Summary' },
    { id: 'templates', label: 'Templates' },
    { id: 'past', label: 'Past encounters' },
    { id: 'pmh', label: 'PMH' },
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
            <Col xs={12} className="px-0">
                <div className="d-flex px-1">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        {/* Left Panel */}
                        <Droppable droppableId="left">
                            {(provided) => (
                                <div
                                    className="left-panel border-end px-2"
                                    style={{ width: '40%' }}
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}>
                                    <h5>Left panel display settings</h5>
                                    <Form.Check type="checkbox" label="Minimize by default" className="mb-2" />
                                    {leftSections.map((section, index) => (
                                        <Draggable key={section.id} draggableId={section.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    className="draggable-card"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}>
                                                    <span className="drag-icon">☰</span> {section.label}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                        {/* Right Panel */}
                        <Droppable droppableId="right">
                            {(provided) => (
                                <div
                                    className="right-panel px-2"
                                    style={{ width: '60%' }}
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}>
                                    <h5>Test display settings</h5>
                                    <p>
                                        Customize your chart note view for all patients by modifying the display
                                        settings below.
                                    </p>
                                    {rightSections.map((section, index) => (
                                        <Draggable key={section.id} draggableId={section.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    className="draggable-card"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <strong className='d-flex align-items-center'>
                                                            <span className="drag-icon">☰</span>
                                                            {section.label}
                                                        </strong>
                                                        <div className="section-controls">
                                                            {[
                                                                'meds',
                                                                'note',
                                                                'plan',
                                                                'labOrders',
                                                                'imagingOrders',
                                                            ].includes(section.id) && (
                                                                <Form.Check
                                                                    type="checkbox"
                                                                    label="Minimize by default"
                                                                    checked={section.minimized || false}
                                                                    onChange={() => toggleMinimize(section.id)}
                                                                />
                                                            )}
                                                            <Form.Check
                                                                type="checkbox"
                                                                label="Show section"
                                                                checked={section.visible}
                                                                onChange={() => toggleVisibility(section.id)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </Col>
        </Row>
    );
};

export default SettingTabs;
