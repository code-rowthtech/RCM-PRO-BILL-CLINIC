import classNames from 'classnames';
import { Trash, ChevronUp, ChevronDown, Plus, Cross } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import {
    Modal, Form, Button, Badge, Accordion,
    Card, Stack, Tabs, Tab,
    ListGroup, FloatingLabel, InputGroup
} from 'react-bootstrap';
import '../settingtabs.css';
import { practiceTypeOptions } from '../../../../utils/DataSets/commonData2';
import Select from 'react-select';
import { TiDelete } from "react-icons/ti";
import ToastHandle from '../../../../helpers/ToastMessage'
import ReactQuill from 'react-quill';
import { Controller, useForm } from 'react-hook-form';
const TemplateModal = ({ show, template, onSave, onHide }) => {
    const { control } = useForm();
    const practiceOptions = practiceTypeOptions?.map((data) => ({
        label: data?.type, value: data?.type, description: data?.description
    }))
    const [currentTemplate, setCurrentTemplate] = useState({
        title: '',
        templateType: 'SOAP',
        category: '',
        status: 'active',
        description: '',
        shortcut: '',
        practiceType: '',
        tags: [],
        isEditable: true,
        default: false,
        shareable: false,
        items: []
    });
    console.log(currentTemplate, 'currentTemplate')
    const [activeTab, setActiveTab] = useState('details');
    const [newItem, setNewItem] = useState({
        text: '',
        order: 0,
        shortcut: '',
        archived: false
    });

    useEffect(() => {
        if (template) {
            setCurrentTemplate(template);
        } else {
            setCurrentTemplate({
                title: '',
                templateType: 'SOAP',
                category: '',
                status: 'active',
                description: '',
                shortcut: '',
                practiceType: '',
                tags: [],
                isEditable: true,
                default: false,
                shareable: false,
                items: []
            });
        }
    }, [template]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentTemplate(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCurrentTemplate(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleAddTag = (e) => {
        const inputValue = e.target.value.trim();
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const currentTags = currentTemplate.tags || [];
            // Check for empty value
            if (!inputValue) {
                return;
            }
            // Check for duplicate tag
            if (currentTags.includes(inputValue)) {
                ToastHandle('Tag already added.', 'danger')
                return;
            }
            // Check for max tag limit
            if (currentTags.length >= 5) {
                ToastHandle('You can only add up to 5 tags.', 'danger')
                return;
            }
            // Add tag
            setCurrentTemplate(prev => ({
                ...prev,
                tags: [...currentTags, inputValue]
            }));
            e.target.value = '';
        }
    };



    const handleRemoveTag = (index) => {
        setCurrentTemplate(prev => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index)
        }));
    };

    const handleAddSection = (sectionType) => {
        if (!currentTemplate.items.some(item => item.label === sectionType)) {
            setCurrentTemplate(prev => ({
                ...prev,
                items: [
                    ...(prev.items || []),
                    {
                        label: sectionType,
                        list: [],
                        order: prev.items?.length || 0
                    }
                ]
            }));
        }
    };

    const handleRemoveSection = (index) => {
        setCurrentTemplate(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleAddItem = (sectionIndex) => {
        if (newItem.text) {
            const updatedItems = [...currentTemplate.items];
            updatedItems[sectionIndex].list = [
                ...(updatedItems[sectionIndex].list || []),
                {
                    ...newItem,
                    order: updatedItems[sectionIndex].list?.length || 0
                }
            ];

            setCurrentTemplate(prev => ({
                ...prev,
                items: updatedItems
            }));

            setNewItem({
                text: '',
                order: 0,
                shortcut: '',
                archived: false
            });
        }
    };

    const handleRemoveItem = (sectionIndex, itemIndex) => {
        const updatedItems = [...currentTemplate.items];
        updatedItems[sectionIndex].list = updatedItems[sectionIndex].list.filter(
            (_, i) => i !== itemIndex
        );

        setCurrentTemplate(prev => ({
            ...prev,
            items: updatedItems
        }));
    };

    const handleMoveItem = (sectionIndex, itemIndex, direction) => {
        const updatedItems = [...currentTemplate.items];
        const section = updatedItems[sectionIndex];

        if (
            (direction === 'up' && itemIndex === 0) ||
            (direction === 'down' && itemIndex === section.list.length - 1)
        ) {
            return;
        }

        const newIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
        [section.list[itemIndex], section.list[newIndex]] =
            [section.list[newIndex], section.list[itemIndex]];

        setCurrentTemplate(prev => ({
            ...prev,
            items: updatedItems
        }));
    };

    const handleSave = () => {
        onSave(currentTemplate);
    };

    const sectionLabels = [
        'Subjective', 'Objective', 'Assessment', 'Plan', 'Care Plan', 'Notes'
    ];

    return (
        <Modal className='templateModal' show={show} onHide={onHide} size="xl" centered scrollable backdrop="static">
            <Modal.Header closeButton className="border-bottom-0 pb-0">
                <Modal.Title className="fw-bold">
                    {currentTemplate.uid ? 'Edit Template' : 'Create New Template'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-0">
                <ul className="nav nav-underline mb-2">
                    <li className="nav-item">
                        <span
                            className={classNames(
                                'nav-link fw-bold text-black cursor-pointer fs-6',
                                {
                                    active: activeTab === 'details',
                                    'fw-bold fs-6': activeTab === 'details',
                                }
                            )}
                            onClick={() => setActiveTab('details')}>
                            Details
                        </span>
                    </li>
                    <li className="nav-item">
                        <span
                            className={classNames(
                                'nav-link fw-bold text-black cursor-pointer fs-6',
                                {
                                    active: activeTab === 'sections',
                                    'fw-bold fs-6': activeTab === 'sections',
                                }
                            )}
                            onClick={() => setActiveTab('sections')}>
                            Section
                        </span>
                    </li>
                </ul>
                {activeTab === 'details' ?
                    <Form>
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label className='mb-0'>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={currentTemplate.title || ''}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter Template Title"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label className='mb-0'>Template Type</Form.Label>
                                    <Form.Select
                                        name="templateType"
                                        value={currentTemplate.templateType || 'SOAP'}
                                        onChange={handleInputChange}
                                        className="form-select-lg"
                                    >
                                        <option value="SOAP">SOAP</option>
                                        <option value="PlanOnly">Plan Only</option>
                                        <option value="AssessmentPlan">Assessment & Plan</option>
                                        <option value="HPI">HPI</option>
                                        <option value="Custom">Custom</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label className='mb-0'>Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="category"
                                        value={currentTemplate.category || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter category"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label className='mb-0'>Status</Form.Label>
                                    <Form.Select
                                        name="status"
                                        value={currentTemplate.status || 'active'}
                                        onChange={handleInputChange}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="archive">Archived</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label className='mb-0'>Template Shortcut</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="shortcut"
                                        value={currentTemplate.shortcut || ''}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 'soap'"
                                    />
                                </Form.Group>
                            </div>
                            <div className="row my-2">

                                <div className="col-md-4 pe-0">
                                    <Form.Group>
                                        <Form.Label className='mb-0'>Practice Type</Form.Label>
                                        <Select
                                            options={practiceOptions}
                                            isSearchable
                                            className="basic-single"
                                            classNamePrefix="select"
                                            placeholder="&nbsp; Select "
                                            // value={QualificationOptions.find(
                                            //     (option) =>
                                            //         option.value === qualification?.degreeName?.code
                                            // )}
                                            onChange={handleInputChange}
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    height: '30px',
                                                    minHeight: '30px',
                                                    border: '0px',
                                                }),
                                                placeholder: (provided) => ({
                                                    ...provided,
                                                    fontWeight: 'bold',
                                                    fontSize: '12px',
                                                    paddingBottom: '5px',
                                                }),
                                            }}
                                        />
                                        {/* <Form.Control
                                        type="text"
                                        name="practiceType"
                                        value={currentTemplate.practiceType || ''}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        /> */}
                                    </Form.Group>
                                </div>
                                <div className="col-md-4 mb-2 d-flex flex-wrap">
                                    <Form.Label className=''></Form.Label>
                                    <div className="row pt-3">
                                        {/* <div className="col-md-6">
                                        <Form.Check
                                            type="switch"
                                            id="isEditable"
                                            label="Editable"
                                            name="isEditable"
                                            checked={currentTemplate.isEditable || false}
                                            onChange={handleCheckboxChange}
                                        />
                                    </div> */}

                                        <div className="col-md-6 ps-3">
                                            <Form.Check
                                                type="switch"
                                                id="shareable"
                                                label="Shareable"
                                                name="shareable"
                                                checked={currentTemplate.shareable || false}
                                                onChange={handleCheckboxChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2 d-flex align-items-center">
                                <div className="col-md-4 pe-0">
                                    <Form.Group>
                                        <Form.Label className='mb-0'>Tags</Form.Label>
                                        <Form.Control
                                            rows={4}
                                            type="text"
                                            placeholder=" "
                                            onKeyDown={handleAddTag}
                                        />

                                    </Form.Group>
                                </div>
                                <div className="col-8 d-flex gap-2">
                                    {currentTemplate.tags?.map((tag, index) => (
                                        <Badge key={index}
                                            bg="primary"
                                            text="white"
                                            style={{ height: '1.6rem', marginTop: '1.1rem' }}
                                            className="d-flex px-2 align-items-center mb-0">
                                            {tag}
                                            <TiDelete className='text-white fs-4 ms-1' onClick={() => handleRemoveTag(index)} />
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="row mb-2">
                                {/* <div className="col-md-4 pe-0">
                                    <Form.Group>
                                        <Form.Label className='mb-0'>Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="description"
                                            value={currentTemplate.description || ''}
                                            onChange={handleInputChange}
                                            placeholder=" "
                                        />
                                    </Form.Group>
                                </div> */}
                                <div className='mt-0 col-md-12'>
                                    <Form.Group controlId="notes">
                                        <Form.Label className="fw-medium mb-1">
                                            Desription{' '}
                                        </Form.Label>
                                        <Controller
                                            name="note"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <ReactQuill
                                                    value={value}
                                                    onChange={(content, delta, source) => {
                                                        if (source === 'user') {
                                                            onChange(content);
                                                        }
                                                    }}
                                                    theme="snow"
                                                    placeholder="Enter detailed description here..."
                                                    style={{ height: '21vh', backgroundColor: 'white' }}
                                                    modules={{
                                                        toolbar: [
                                                            [{ header: [1, 2, false] }],
                                                            ['bold', 'italic', 'underline', 'strike'],
                                                            [{ list: 'ordered' }, { list: 'bullet' }],
                                                            ['clean'],
                                                        ],
                                                    }}
                                                />
                                            )}
                                        />
                                    </Form.Group>
                                </div>
                            </div>



                        </div>
                    </Form> :
                    <>
                        <div className="mb-4">
                            <h5 className="mb-1 fs-5">Add Section</h5>
                            <div className="d-flex flex-wrap gap-2">
                                {sectionLabels.map(label => (
                                    <Button
                                        key={label}
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleAddSection(label)}
                                        disabled={currentTemplate.items?.some(item => item.label === label)}
                                        className="d-flex align-items-center gap-1"
                                    >
                                        <Plus size={14} />
                                        {label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {!currentTemplate.items?.length ? (
                            <div className="alert alert-info mb-4">
                                <i className="dripicons-information me-2"></i>
                                No sections added to this template yet. Click the buttons above to add sections.
                            </div>
                        ) : (
                            <Accordion defaultActiveKey="0" className="mb-4">
                                {currentTemplate.items.map((section, sectionIndex) => (
                                    <Accordion.Item className='templateAccordionItem' key={sectionIndex} eventKey={sectionIndex.toString()}>
                                        <Accordion.Header className="d-flex align-items-center templatesAccordion">
                                            <div className="d-flex justify-content-between align-items-center w-100 me-2">
                                                <div className="d-flex align-items-center">
                                                    <span className="badge bg-primary me-2">{sectionIndex + 1}</span>
                                                    <strong>{section.label}</strong>
                                                </div>
                                                {/* <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                   
                                                    className="py-0 px-2"
                                                > */}
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
                                                                        {item.shortcut && (
                                                                            <Badge bg="light" text="dark" className="mt-1">
                                                                                Shortcut: {item.shortcut}
                                                                            </Badge>
                                                                        )}
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
                    </>}
            </Modal.Body>
            <Modal.Footer className="border-top-0 bg-light">
                <Button className='custom-buttons' onClick={onHide}>
                    Cancel
                </Button>
                <Button className='custom-buttons' onClick={handleSave}>
                    Save Template
                </Button>
            </Modal.Footer>
        </Modal >
    );
};

export default TemplateModal;