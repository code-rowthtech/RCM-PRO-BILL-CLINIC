import { Badge, ChevronDown, ChevronUp, Plus, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Accordion, Button, Card, Form, ListGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateTemplateAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';

const TemplateSection = ({ sectionsId, template, onHide, reset, setTags }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const updateResponse = store?.updateTemplateReducer?.data?.success;
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({
        text: '',
        order: 0,
        shortcut: '',
        archived: false
    });
    useEffect(() => {
        if (template?._id) {
            setItems(template?.items)
        }
    }, [template])
    const sectionLabels = [
        'Subjective', 'Objective', 'Assessment', 'Plan', 'Care Plan', 'Notes'
    ];
    useEffect(() => {
        if (updateResponse == true && sectionsId || updateResponse == true && template?._id) {
            onHide();
            reset();
            setTags([]);
            setItems([])
        }
    }, [updateResponse, sectionsId, template])
    const handleAddSection = (sectionType) => {
        if (!items.some(item => item.label === sectionType)) {
            setItems(prev => [
                ...prev,
                {
                    label: sectionType,
                    list: [],
                    order: prev.length
                }
            ]);
        }
    };


    const handleRemoveSection = (index) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };


    const handleAddItem = (sectionIndex) => {
        if (newItem.text) {
            const updatedItems = [...items];
            updatedItems[sectionIndex].list = [
                ...(updatedItems[sectionIndex].list || []),
                {
                    ...newItem,
                    order: updatedItems[sectionIndex].list?.length || 0
                }
            ];

            setItems(updatedItems);

            setNewItem({
                text: '',
                order: 0,
                shortcut: '',
                archived: false
            });
        }
    };

    const handleRemoveItem = (sectionIndex, itemIndex) => {
        const updatedItems = [...items];
        updatedItems[sectionIndex].list = updatedItems[sectionIndex].list.filter(
            (_, i) => i !== itemIndex
        );

        setItems(prev => ({
            ...prev,
            updatedItems
        }));
    };

    const handleMoveItem = (sectionIndex, itemIndex, direction) => {
        const updatedItems = [...items];
        const section = updatedItems[sectionIndex];

        if (
            (direction === 'up' && itemIndex === 0) ||
            (direction === 'down' && itemIndex === section.list.length - 1)
        ) {
            return;
        }

        const newIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;

        // Swap items
        [section.list[itemIndex], section.list[newIndex]] =
            [section.list[newIndex], section.list[itemIndex]];

        setItems(updatedItems); // ✅ Correctly update state
    };

    const updateTemplateSection = () => {
        const data = {
            items: items
        }
        dispatch(updateTemplateAction({ key: encryptMessage(data), templateId: sectionsId }))
    }
    return (
        <div className='d-flex flex-column align-items-between'>
            <div>
                <div className="mb-4">
                    <h5 className="mb-1 fs-5">Add Section</h5>
                    <div className="d-flex flex-wrap gap-2">
                        {sectionLabels.map(label => (
                            <Button
                                key={label}
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleAddSection(label)}
                                disabled={items?.some(item => item.label === label)}
                                className="d-flex align-items-center gap-1"
                            >
                                <Plus size={14} />
                                {label}
                            </Button>
                        ))}
                    </div>
                </div>

                {!items?.length ? (
                    <div className="alert alert-info mb-4">
                        <i className="dripicons-information me-2"></i>
                        No sections added to this template yet. Click the buttons above to add sections.
                    </div>
                ) : (
                    <Accordion defaultActiveKey="0" className="mb-4">
                        {items.map((section, sectionIndex) => (
                            <Accordion.Item className='templateAccordionItem' key={sectionIndex} eventKey={sectionIndex.toString()}>
                                <Accordion.Header className="d-flex align-items-center templatesAccordion">
                                    <div className="d-flex justify-content-between align-items-center w-100 me-2">
                                        <div className="d-flex align-items-center">
                                            <span className="badge bg-primary me-2">{sectionIndex + 1}</span>
                                            <strong>{section.label}</strong>
                                        </div>
                                        <Trash
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveSection(sectionIndex);
                                            }}
                                            className='cursor-pointer text-danger'
                                            size={14} />
                                        {/* </Button> */}
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    {!section.list?.length ? (
                                        <div className="alert alert-warning m-1 p-1">
                                            No items in this section
                                        </div>
                                    ) : (
                                        <ListGroup className="mb-0">
                                            {section.list.map((item, itemIndex) => (
                                                <ListGroup.Item key={itemIndex} className="py-1 px-3">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="d-flex align-items-center">
                                                            <span className="text-muted fs-6 me-2" style={{ width: '30px' }}>#{itemIndex + 1}</span>
                                                            <div>
                                                                <div className='fs-6 text-black'>{item.text}</div>
                                                                {/* {item.shortcut && (
                                                                <Badge bg="light" text="dark" className="mt-1">
                                                                    Shortcut: {item.shortcut}
                                                                </Badge>
                                                            )} */}
                                                            </div>
                                                        </div>
                                                        <div className="d-flex gap-1">
                                                            {/* <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    className="p-1"
                                                    disabled={itemIndex === 0}
                                                > */}
                                                            <ChevronUp
                                                                className='cursor-pointer'
                                                                onClick={() => handleMoveItem(sectionIndex, itemIndex, 'up')}
                                                                size={16} />
                                                            {/* </Button> */}
                                                            {/* <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    className="p-1"
                                                    disabled={itemIndex === section.list.length - 1}
                                                > */}
                                                            <ChevronDown
                                                                onClick={() => handleMoveItem(sectionIndex, itemIndex, 'down')}
                                                                className='cursor-pointer'
                                                                size={16} />
                                                            {/* <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    className="p-1"

                                                > */}
                                                            <Trash
                                                                onClick={() => handleRemoveItem(sectionIndex, itemIndex)}
                                                                className='cursor-pointer text-danger'
                                                                size={16} />
                                                            {/* </Button> */}
                                                        </div>
                                                    </div>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    )}

                                    <Card className="border">
                                        <Card.Header className="bg-light">
                                            <h6 className="mb-0">Add New Item to {section.label}</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <Form.Group>
                                                        <Form.Label className='mb-0'>Item Text <span className='text-danger'>*</span></Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            style={{ height: '80px' }}
                                                            name="text"
                                                            value={newItem.text}
                                                            onChange={(e) => setNewItem({
                                                                ...newItem,
                                                                text: e.target.value
                                                            })}
                                                            placeholder=" "
                                                            required
                                                        />
                                                    </Form.Group>
                                                </div>
                                                <div className="col-md-6 d-flex flex-column">
                                                    <Form.Group>
                                                        <Form.Label className='mb-0'>Shortcut</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="shortcut"
                                                            value={newItem.shortcut}
                                                            onChange={(e) => setNewItem({
                                                                ...newItem,
                                                                shortcut: e.target.value
                                                            })}
                                                            placeholder=" "
                                                        />
                                                    </Form.Group>

                                                    <Form.Check
                                                        type="switch"
                                                        id="itemArchived"
                                                        label="Archived"
                                                        name="archived"
                                                        checked={newItem.archived}
                                                        onChange={(e) => setNewItem({
                                                            ...newItem,
                                                            archived: e.target.checked
                                                        })}
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-end mt-1">
                                                <Button
                                                    onClick={() => handleAddItem(sectionIndex)}
                                                    disabled={!newItem.text}
                                                    className="d-flex align-items-center gap-1 custom-buttons"
                                                >
                                                    <Plus size={16} />
                                                    Add Item
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                )}
            </div>
            <div className='d-flex gap-1 justify-content-end'>
                <Button className='custom-buttons'>Cancel</Button>
                <Button disabled={items?.length < 1} onClick={updateTemplateSection} className='custom-buttons'>Save Template</Button>
            </div>
        </div>
    )
}

export default TemplateSection