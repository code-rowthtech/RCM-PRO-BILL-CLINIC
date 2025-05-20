import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Col, Form, Row, Button, Offcanvas, Modal, Spinner } from 'react-bootstrap';
import { MdAddCircleOutline } from 'react-icons/md';
import './settingtabs.css';
import { FiInfo } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import {
    createSettingsTabAction,
    getSettingsTabAction,
    updateSettingsTabAction,
} from '../../../redux/noteCategories/action';
import { loggedInUser } from '../../../helpers/api/loggedInUser';
import { encryptMessage } from '../../../cryptoUtils';

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
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const ClinicId = loggedInUser?.clinicId;
    const settingData = store?.getSettingsTabsReducer?.data?.data?.displaySettings?.mainPanel;
    const createResponse = store?.createSettingsTabsReducer?.data?.status;
    const updateSettingsStatus = store?.updateSettingsTabsReducer?.data?.status;

    // Local state for sections
    const [activeSectionsByType, setActiveSectionsByType] = useState({});
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [offcanvasSections, setOffcanvasSections] = useState([]);
    const [showCanvas, setShowCanvas] = useState(false);
    const [showCustomFields, setShowCustomFields] = useState(false);
    const [customFieldData, setCustomFieldData] = useState({ fieldName: '', inputType: '' });
    const hasSettings = !!store?.getSettingsTabsReducer?.data?.data?._id;

    // Helper to get current sections for the note type
    const getCurrentSections = () => activeSectionsByType[noteType?.noteType] || [];
    const updateCurrentSections = (newSections) => {
        setActiveSectionsByType((prev) => ({
            ...prev,
            [noteType?.noteType]: newSections,
        }));
    };

    // Helper to transform local sections to API format
    const getTransformedSections = (sections) =>
        sections.map((s, idx) => ({
            name: s.label || s.name,
            isShown: s.visible ?? s.isShown,
            isMinimized: s.minimized ?? s.isMinimized,
            isRequired: false,
            order: idx + 1,
            inputType: s.inputType || 'text',
        }));

    // Call update API
    const saveSectionsAPI = (sections) => {
        const payload = {
            userId: loggedInUser?._id,
            noteTypeId: noteType._id,
            displaySettings: {
                mainPanel: [
                    {
                        categoryName: 'Default',
                        sections: getTransformedSections(sections),
                    },
                ],
            },
        };
        if (hasSettings) {
            // Update
            dispatch(
                updateSettingsTabAction({
                    key: encryptMessage({ ...payload, id: store?.getSettingsTabsReducer?.data?.data?._id }),
                })
            );
        } else {
            // Create
            dispatch(createSettingsTabAction({ key: encryptMessage(payload) }));
        }
    };

    // Toggle handler
    const toggleSectionProperty = (id, prop) => {
        const updated = getCurrentSections().map((sec) =>
            (sec.id || sec._id) === id ? { ...sec, [prop]: !sec[prop] } : sec
        );
        updateCurrentSections(updated);
        saveSectionsAPI(updated); // Use new function
    };

    // Drag handler
    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination || source.index === destination.index) return;
        const reordered = Array.from(getCurrentSections());
        const [moved] = reordered.splice(source.index, 1);
        reordered.splice(destination.index, 0, moved);
        updateCurrentSections(reordered);
        saveSectionsAPI(reordered); // Use new function
    };

    // When Redux data changes, sync local state
    useEffect(() => {
        if (Array.isArray(settingData) && settingData.length > 0) {
            const sections =
                settingData[0]?.sections?.map((s, idx) => ({
                    id: s._id || s.id || `${noteType.noteType}-${idx}`,
                    label: s.name,
                    visible: s.isShown,
                    minimized: s.isMinimized,
                    name: s.name,
                })) || [];
            setActiveSectionsByType((prev) => ({
                ...prev,
                [noteType?.noteType]: sections,
            }));
        }
    }, [settingData, noteType]);

    // Offcanvas options
    useEffect(() => {
        if (noteType?.noteType && NOTE_TYPE_OPTIONS[noteType.noteType]) {
            const options = NOTE_TYPE_OPTIONS[noteType.noteType].map((label, index) => ({
                id: `${noteType.noteType}-${index}`,
                label,
            }));
            options.push({ id: 'custom', label: 'Custom' });
            setOffcanvasSections(options);

            if (!activeSectionsByType[noteType.noteType]) {
                setActiveSectionsByType((prev) => ({
                    ...prev,
                    [noteType.noteType]: [],
                }));
            }
        } else {
            setOffcanvasSections([{ id: 'custom', label: 'Custom' }]);
        }
        // eslint-disable-next-line
    }, [noteType]);

    // Fetch settings on mount and after create/update
    useEffect(() => {
        dispatch(getSettingsTabAction({ noteId: noteType?._id }));
    }, [dispatch, noteType]);

    useEffect(() => {
        if (createResponse === 201 || updateSettingsStatus === 200) {
            dispatch(getSettingsTabAction({ noteId: noteType?._id }));
        }
    }, [createResponse, updateSettingsStatus, dispatch, noteType]);

    // Custom field input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomFieldData((prev) => ({ ...prev, [name]: value }));
    };

    // Add custom field
    const handleAddCustomField = () => {
        const { fieldName, inputType } = customFieldData;
        if (!fieldName || !inputType) return;

        const newSection = {
            id: `custom-${Date.now()}`,
            label: fieldName,
            inputType,
            visible: true,
            minimized: false,
        };
        const updatedSections = [...getCurrentSections(), newSection];
        updateCurrentSections(updatedSections);
        saveSectionsAPI(updatedSections);
        setCustomFieldData({ fieldName: '', inputType: '' });
        setShowCustomFields(false);
        setShowCanvas(false);
    };

    // Add section from offcanvas
    const handleOffcanvasCardClick = (section) => {
        if (section.id === 'custom') {
            setShowCustomFields((prev) => !prev);
            return;
        }

        const currentSections = getCurrentSections();
        const isAlreadyAdded = currentSections.some((s) => s.id === section.id);

        if (!isAlreadyAdded) {
            const newSection = {
                id: section.id,
                label: section.label,
                visible: true,
                minimized: false,
            };

            const updatedSections = [...currentSections, newSection];
            updateCurrentSections(updatedSections);
            setOffcanvasSections((prev) => prev.filter((s) => s.id !== section.id));
            saveSectionsAPI(updatedSections);
        }
    };

    return (
        <Row className="scroll-container mt-0 " style={{ height: '85vh', overflowY: 'scroll' }}>
            <div className="p-2 w-100">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Row>
                        <Col md={12} className="d-flex align-items-center">
                            <h5>Clinical Form Sections</h5>
                            <span
                                className="text-secondary cursor-pointer ms-2"
                                title="Info of Drag Section"
                                onClick={() => setShowInfoModal(true)}>
                                <FiInfo size={20} />
                            </span>
                            <MdAddCircleOutline
                                size={24}
                                className="text-primary cursor-pointer ms-2"
                                onClick={() => setShowCanvas(true)}
                            />
                        </Col>
                    </Row>
                    <Row className="mt-1">
                        {store?.getSettingsTabsReducer?.loading ? (
                            <div
                                className="text-center my-4 d-flex justify-content-center align-items-center"
                                style={{ height: '200px' }}>
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : (
                            <Col md={8}>
                                <Droppable droppableId="active-sections">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {getCurrentSections().length === 0 && (
                                                <div className="text-center">
                                                    <p className="text-secondary">No sections available</p>
                                                </div>
                                            )}
                                            {getCurrentSections().map((section, index) => (
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
                                                                        <span className="me-2 fw-bold">
                                                                            {index + 1}
                                                                        </span>
                                                                        <strong>{section.label}</strong>
                                                                    </div>
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <Form.Check
                                                                            type="switch"
                                                                            id={`minimize-${section.id}`}
                                                                            checked={!!section.minimized}
                                                                            label="Minimize"
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
                                                                            checked={
                                                                                section.visible !== undefined
                                                                                    ? section.visible
                                                                                    : true
                                                                            }
                                                                            label="Visible"
                                                                            onChange={() =>
                                                                                toggleSectionProperty(
                                                                                    section.id,
                                                                                    'visible'
                                                                                )
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
                        )}
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
                    {offcanvasSections
                        .filter((section) => {
                            if (section.id === 'custom') return true;
                            // Hide if any section in Col-8 has the same id or label
                            return !getCurrentSections().some(
                                (s) => s.id === section.id || s.label === section.label || s.name === section.label // for API data
                            );
                        })
                        .map((section) => (
                            <Card
                                key={section.id}
                                className="draggable-card p-2 mb-2"
                                onClick={() => handleOffcanvasCardClick(section)}
                                style={{ cursor: 'pointer' }}>
                                <div className="w-100 d-flex justify-content-between align-items-center">
                                    <strong>{section.label}</strong>
                                </div>
                            </Card>
                        ))}

                    {showCustomFields && (
                        <Form className="mt-3">
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Field Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="fieldName"
                                            value={customFieldData?.fieldName}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Input Type</Form.Label>
                                        <Form.Select
                                            name="inputType"
                                            value={customFieldData?.inputType}
                                            onChange={handleInputChange}>
                                            <option value="">Select Type</option>
                                            <option value="text">Text</option>
                                            <option value="text-editor">Text Editor</option>
                                            <option value="text-area">Text Area</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={12} className="d-flex justify-content-end">
                                    <Button variant="primary" className="custom-buttons" onClick={handleAddCustomField}>
                                        Add
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Offcanvas.Body>
            </Offcanvas>

            <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)} centered>
                <Modal.Header className="px-2 py-0" closeButton>
                    <Modal.Title>Info</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        You can drag and reorder form sections to control the order in which they appear in the clinical
                        form. Use the toggle switches to set whether a section is visible by default and whether it
                        should be minimized. Use the "+" icon to add predefined or custom sections to your form.
                    </p>
                </Modal.Body>
            </Modal>
        </Row>
    );
};

export default SettingTabs;
