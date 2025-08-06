import classNames from 'classnames';
import React, { useState, useEffect, useRef } from 'react';
import {
    Modal, Form, Button, Badge,
} from 'react-bootstrap';
import '../settingtabs.css';
import { practiceTypeOptions } from '../../../../utils/DataSets/commonData2';
import Select from 'react-select';
import { TiDelete } from "react-icons/ti";
import ToastHandle from '../../../../helpers/ToastMessage'
import ReactQuill from 'react-quill';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { createTemplateAction, getTemplateAction, updateTemplateAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { loggedInUser } from '../../../../helpers/api/loggedInUser';
import TemplateSection from './TemplateSection';
import useQuillWordLimit from '../../../../helpers/quillWordLimit';
import Spinner from '../../../../constants/Spinner';

const TemplateModal = ({ show, onHide, template, setSelectedTemplate }) => {
    const { control, register, handleSubmit, reset, setValue, watch } = useForm();
    const dispatch = useDispatch();
    const quillRef = useRef(null);
    const store = useSelector((state) => state);
    const createResponse = store?.createTemplateReducer?.data?.success;
    const updateResponse = store?.updateTemplateReducer?.data?.success;
    const practiceOptions = practiceTypeOptions?.map((data) => ({
        label: data?.type, value: data?.type, description: data?.description
    }));
    const MAX_WORDS = 300;
    const WAX_WORD_LENGTH = 45;

    const [tags, setTags] = useState([]);
    const [activeTab, setActiveTab] = useState('details');
    const [sectionsId, setSectionsId] = useState(null);

    useEffect(() => {
        if (createResponse) {
            setSectionsId(store?.createTemplateReducer?.data?.data?._id);
            setActiveTab('sections')
        }
    }, [createResponse])

    useEffect(() => {
        if (createResponse === true || updateResponse === true) {
            dispatch(getTemplateAction({ search: '', skip: 1, limit: 10, status: 'active' }))
        }
    }, [createResponse, updateResponse])

    useEffect(() => {
        if (template?._id) {
            // Populate form with template data
            reset({
                title: template.title || '',
                templateType: template.templateType || '',
                category: template.category || '',
                status: template.status || 'active',
                shortcut: template.shortcut || '',
                practiceType: practiceOptions.find(opt => opt.value === template.practiceType) || null,
                shareable: template.shareable || false,
                description: template.description || '',
            });
            setTags(template.tags || []);
            setSectionsId(template._id);
        }
    }, [template, reset]);

    const handleAddTag = (e) => {
        const inputValue = e.target.value.trim();

        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();

            // Check for empty input
            if (!inputValue) return;

            // Check for duplicates
            if (tags.includes(inputValue)) {
                ToastHandle('Tag already added.', 'danger');
                return;
            }

            // Check for max tag limit
            if (tags.length >= 5) {
                ToastHandle('You can only add up to 5 tags.', 'danger');
                return;
            }

            // Add new tag
            setTags(prevTags => [...prevTags, inputValue]);

            // Clear input
            e.target.value = '';
        }
    };

    const handleRemoveTag = (indexToRemove) => {
        setTags(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    const onSubmit = (data) => {
        data.practiceType = data.practiceType.value;
        data.tags = tags;
        data.practiceId = loggedInUser?.clinicId;
        data.userId = loggedInUser?._id;
        if (template?._id) {
            dispatch(updateTemplateAction({ key: encryptMessage(data), templateId: template?._id }))
        } else {
            dispatch(createTemplateAction({ key: encryptMessage(data) }))
        }
    };

    const handleLimitExceed = ({ type, message }) => {
        ToastHandle(message, 'danger');
    };

    useQuillWordLimit({
        quillRef,
        maxWords: MAX_WORDS,
        maxWordLength: WAX_WORD_LENGTH,
        onLimitExceed: handleLimitExceed,
        setValue,
        fieldName: 'note',
    });

    return (
        <Modal className='templateModal' show={show} onHide={() => {
            onHide();
            reset();
            setTags([]);
        }} size="xl" centered backdrop="static">
            <Modal.Header className="p-0 pb-0 d-flex justify-content-center">
                <Modal.Title className="fw-semibold py-1 ">
                    {template?._id ? 'Update' : "Create"} Template
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-0 scroll-container">
                <ul style={{ height: '6.1%' }} className=" nav nav-underline mb-2">
                    <li className="nav-item">
                        <span
                            className={classNames(
                                'nav-link fw-semibold text-secondary cursor-pointer pb-0 fs-5',
                                {
                                    active: activeTab === 'details',
                                    'fw-bold fs-5': activeTab === 'details',
                                }
                            )}
                            onClick={() => setActiveTab('details')}>
                            Details
                        </span>
                    </li>
                    <li className="nav-item">
                        <span
                            className={classNames(
                                'nav-link fw-semibold text-secondary cursor-pointer pb-0 fs-5',
                                {
                                    active: activeTab === 'sections',
                                    'fw-bold fs-5': activeTab === 'sections',
                                }
                            )}
                            onClick={() => setActiveTab('sections')}>
                            Section
                        </span>
                    </li>
                </ul>
                {activeTab === 'details' ?
                    <Form className='d-flex flex-column align-items-between' style={{ height: '93.9%' }} onSubmit={handleSubmit(onSubmit)}>
                        <div className="row mb-3 scroll-container">
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label className='mb-0'>Title <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        {...register('title')}
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
                                        {...register('templateType')}
                                        className="form-select-lg text-black"
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
                                        {...register('category')}
                                        placeholder="Enter category"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label className='mb-0'>Status</Form.Label>
                                    <Form.Select
                                        name="status"
                                        {...register('status')}
                                    >
                                        <option value="active" selected>Active</option>
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
                                        {...register('shortcut')}
                                        placeholder="e.g., 'soap'"
                                    />
                                </Form.Group>
                            </div>
                            <div className="row my-2">
                                <div className="col-md-4 pe-0">
                                    <Form.Group>
                                        <Form.Label className='mb-0'>Practice Type <span className='text-danger'>*</span></Form.Label>
                                        <Controller
                                            name="practiceType"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    options={practiceOptions}
                                                    isSearchable
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    placeholder="Select"
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
                                            )}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-4 mb-2 d-flex flex-wrap">
                                    <Form.Label className=''></Form.Label>
                                    <div className="row pt-3">
                                        <div className="col-md-6 ps-3">
                                            <Form.Check
                                                type="switch"
                                                id="shareable"
                                                label="Shareable"
                                                name="shareable"
                                                {...register('shareable')}
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
                                            placeholder="Type a tag, hit Enter or Space"
                                            onKeyDown={handleAddTag}
                                            maxLength={15}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-8 d-flex gap-2">
                                    {tags?.map((tag, index) => (
                                        <Badge key={index}
                                            bg="primary"
                                            text="white"
                                            // title={tag}
                                            style={{ height: '1.6rem', marginTop: '1.1rem' }}
                                            className="d-flex px-2 align-items-center mb-0">
                                            {/* {tag?.length > 35 ? tag?.slice(0, 34) + '...' : tag} */}
                                            {tag}
                                            <TiDelete className='text-white fs-4 ms-1 cursor-pointer' onClick={() => handleRemoveTag(index)} />
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="row mb-2 pe-0" style={{ height: 'calc(60vh - 120px)', display: 'flex', flexDirection: 'column' }}>
                                <div className="col-md-12 pe-0  flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
                                    <Form.Group controlId="description" className="flex-grow-1 d-flex flex-column mb-0">
                                        <Form.Label className="fw-medium mb-1 d-flex justify-content-between align-items-center">
                                            <div>
                                                Description{' '}

                                            </div>
                                            <small className="text-muted">
                                                {(() => {
                                                    const content = watch('description') || '';
                                                    const plainText = quillRef?.current?.getEditor()?.getText()?.trim();
                                                    const words = plainText?.split(/\s+/)?.filter(Boolean);
                                                    const wordCount = words?.length > MAX_WORDS ? MAX_WORDS : words?.length;
                                                    return (
                                                        <div>
                                                            <div>{`${wordCount} / ${MAX_WORDS} words`}</div>
                                                        </div>
                                                    );
                                                })()}
                                            </small>
                                        </Form.Label>
                                        <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: 0 }}>
                                            <Controller
                                                name="description"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <ReactQuill
                                                        ref={quillRef}
                                                        value={value}
                                                        onChange={(content, delta, source) => {
                                                            if (source === 'user') {
                                                                onChange(content);
                                                            }
                                                        }}
                                                        theme="snow"
                                                        placeholder="Enter detailed description here..."
                                                        style={{ flex: 1, minHeight: 0 }}
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
                                        </div>
                                    </Form.Group>
                                </div>
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-end pb-2 gap-1">
                                <Button onClick={() => {
                                    onHide();
                                    reset();
                                    setSelectedTemplate(null)
                                    setTags([])
                                }} className='custom-buttons'>
                                    Cancel
                                </Button>
                                <Button type='submit' className='custom-buttons' disabled={store?.createTemplateReducer?.loading || store?.updateTemplateReducer?.loading}>
                                    {store?.createTemplateReducer?.loading || store?.updateTemplateReducer?.loading ?
                                        <Spinner className='spinner-border-sm' color='white' />
                                        :
                                        `Save Template`
                                    }
                                </Button>
                            </div>
                        </div>
                    </Form> :
                    <TemplateSection template={template} setActiveTab={setActiveTab} sectionsId={sectionsId} show={show} onHide={onHide} reset={reset} setTags={setTags} />
                }
            </Modal.Body>

        </Modal >
    );
};

export default TemplateModal;