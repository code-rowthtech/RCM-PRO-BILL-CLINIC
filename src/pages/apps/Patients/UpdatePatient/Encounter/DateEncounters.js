import React, { useEffect, useState } from 'react';
import { Col, Button, Row, Form, Table, Alert } from 'react-bootstrap';
import EncounterSummary from './EncounterSummary';
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { createEncounterAction, getDoctorsAction, getEncounterAction, getEncounterNotesFieldsAction } from '../../../../../redux/actions';
import { NOTE_TYPE_OPTIONS } from '../../../../../utils/DataSets/commonData2';
import EncounterTemplates from './EncounterTemplates';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { encounterClassCodes, encounterTypes } from '../../../../../utils/DataSets/commonData';
import { useSearchParams } from 'react-router-dom';
import { encryptMessage } from '../../../../../cryptoUtils';

const DateEncounters = ({ isCollapsed, searchNoteType, setSearchNoteType, removeEncounterTab, setCreateEncounter }) => {
    const [leftTab, setLeftTab] = useState('Summary');
    const [selectedFromList, setSelectedFromList] = useState({})
    const store = useSelector((state) => state);
    const { handleSubmit, register, setValue, formState: { errors }, getValues, reset } = useForm();
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(false);

    // Get data from store
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const providerOptions = doctorDetails?.map((data) => ({
        label: data?.name?.[0]?.text, value: data?._id
    }))
    const settingsDataMainItems = store?.getEncounterSettingsReducer?.data?.data?.items;
    const createEncounterData = store?.createEncounterReducer;
    const notesFields = store?.getEncounterNotesFieldsReducer?.data?.data?.displaySettings?.mainPanel?.[0]?.sections;
    const notesTypeOptions = store?.getEncounterNotesTypeReducer?.data?.data?.map((data) => ({
        label: data?.title, value: data?._id, isDefault: data?.default
    }));

    const [noteType, setNoteType] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const defaultNoteTypeOption = notesTypeOptions?.find(opt => opt.isDefault);

    // Handle successful encounter creation
    useEffect(() => {
        if (createEncounterData?.data?.status === 201) {
            setSubmitSuccess(true);
            dispatch(getEncounterAction({ patientId: id }));

            // Auto-close the success message after 3 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
                if (removeEncounterTab) {
                    removeEncounterTab(parseInt(window.location.hash.split('=')[1]));
                }
            }, 3000);

            // Reset form
            reset();
        } else if (createEncounterData?.error) {
            setSubmitError(true);
            setTimeout(() => setSubmitError(false), 3000);
        }
    }, [createEncounterData?.data?.status, createEncounterData?.error]);

    // Set default note type
    useEffect(() => {
        if (!noteType && defaultNoteTypeOption) {
            setNoteType(defaultNoteTypeOption.value);
            dispatch(getEncounterNotesFieldsAction({ noteId: defaultNoteTypeOption.value }))
        }
    }, [noteType, defaultNoteTypeOption]);

    const defaultTabs = ['Summary', 'Templates', 'Past Encounters'];
    const visibleTabs =
        settingsDataMainItems?.length > 0
            ? settingsDataMainItems?.filter((item) => item?.show === true)
            : defaultTabs.map((name, index) => ({
                _id: index.toString(),
                name,
            }));

    const handleNotesTypeChange = (selectedOption) => {
        dispatch(getEncounterNotesFieldsAction({ noteId: selectedOption?.value }))
        setNoteType(selectedOption ? selectedOption.value : '');
    };

    // Apply template values to form
    useEffect(() => {
        if (!selectedFromList) return;

        setTimeout(() => {
            ['Subjective', 'Objective', 'Assessment', 'Plan'].forEach((section) => {
                if (selectedFromList?.[section]) {
                    setValue(section, selectedFromList[section]);
                }
            });
        }, 0);
    }, [selectedFromList, setValue]);

    const NoteFormFields = ({ data = [], excludedFields = [], selectedFromList }) => {
        const getFieldsToRender = () => {
            return (data || [])
                .filter(field => field.isShown && !excludedFields.includes(field.name))
                .sort((a, b) => a.order - b.order);
        };

        const renderField = (field) => {
            const { name, inputType = 'textarea' } = field;
            if (name === 'Notes (SOAP)') {
                return (
                    <div className="mb-3" key={name}>
                        <h5>{name}</h5>
                        {['Subjective', 'Objective', 'Assessment', 'Plan'].map(section => (
                            <Form.Group className="mb-2" key={section}>
                                <Form.Label>{section}</Form.Label>
                                {inputType === 'text-editor' ? (
                                    <ReactQuill
                                        theme="snow"
                                        value={selectedFromList?.[section] || ''}
                                        onChange={(value) => setValue(section, value)}
                                        modules={{
                                            toolbar: [
                                                ['bold', 'italic', 'underline'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['link'],
                                                ['clean'],
                                            ]
                                        }}
                                    />
                                ) : (
                                    <Form.Control
                                        {...register(section)}
                                        as={inputType === 'text' ? 'input' : 'textarea'}
                                        rows={inputType === 'text' ? undefined : 3}
                                        defaultValue={selectedFromList?.[section] || ''}
                                    />
                                )}
                            </Form.Group>
                        ))}
                    </div>
                );
            }

            // Handle regular fields based on inputType
            return (
                <Form.Group className="mb-3" key={name}>
                    <Form.Label>{name}</Form.Label>
                    {inputType === 'text-editor' ? (
                        <ReactQuill
                            theme="snow"
                            value={selectedFromList?.[name] || ''}
                            onChange={(value) => setValue(name, value)}
                            modules={{
                                toolbar: [
                                    ['bold', 'italic', 'underline'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    ['link'],
                                    ['clean'],
                                    ['undo', 'redo']
                                ]
                            }}
                        />
                    ) : (
                        <Form.Control
                            {...register(name)}
                            as={inputType === 'text' ? 'input' : 'textarea'}
                            rows={inputType === 'text' ? undefined : 3}
                            defaultValue={selectedFromList?.[name] || ''}
                        />
                    )}
                </Form.Group>
            );
        };

        return (
            <Row className="g-2 px-2 mt-1 scroll-container" style={{ height: '57.5vh', overflowY: 'auto' }}>
                {getFieldsToRender().map(field => renderField(field))}
            </Row>
        );
    };

    const onSubmit = (data) => {
        // Validate required fields
        if (!selectedProvider) {
            setSubmitError("Provider is required");
            return;
        }

        const encounterTypeSelected = encounterTypes?.find((e) => e?.code === data?.type)
        const encounterClassSelected = encounterClassCodes?.find((e) => e?.code === data?.class)

        if (!encounterTypeSelected || !encounterClassSelected) {
            setSubmitError("Encounter type and class are required");
            return;
        }

        const type = {
            coding: [{
                system: encounterTypeSelected.system,
                code: encounterTypeSelected.code,
                display: encounterTypeSelected.display,
            }],
            text: encounterTypeSelected.display,
        };

        const encounterClass = {
            coding: [{
                system: '',
                code: encounterClassSelected.code,
                display: encounterClassSelected.display,
            }],
            text: encounterClassSelected.display,
        };

        const fieldsData = [];

        // Process regular fields and SOAP notes
        const fieldsToRender = (notesFields || [])
            .filter(field => field.isShown)
            .sort((a, b) => a.order - b.order);

        fieldsToRender.forEach(field => {
            const { name, inputType = 'textarea' } = field;

            // Handle SOAP notes specially
            if (name === 'Notes (SOAP)') {
                ['Subjective', 'Objective', 'Assessment', 'Plan'].forEach(section => {
                    const value = getValues(section) || '';
                    fieldsData.push({
                        type: section,
                        content: {
                            type: inputType === 'text-editor' ? 'html' : 'text',
                            value: value
                        }
                    });
                });
            } else {
                // Handle regular fields
                const value = getValues(name) || '';
                fieldsData.push({
                    type: name,
                    content: {
                        type: inputType === 'text-editor' ? 'html' : 'text',
                        value: value
                    }
                });
            }
        });

        const payload = {
            type,
            class: encounterClass,
            subject: id,
            status: data?.status,
            providerId: selectedProvider,
            data: fieldsData,
            period: {
                start: data?.startDate,
            }
        }

        dispatch(createEncounterAction({ key: encryptMessage(payload) }))
    }

    return (
        <div className='px-0 mt-1 row border mx-1 h-100'>
            {/* {submitSuccess && (
                <Alert variant="success" className="mb-2">
                    Encounter created successfully! Redirecting to encounter list...
                </Alert>
            )}
            
            {submitError && (
                <Alert variant="danger" className="mb-2">
                    {typeof submitError === 'string' ? submitError : 'Error creating encounter. Please try again.'}
                </Alert>
            )} */}

            <Col className={`px-0 ${isCollapsed ? 'd-none' : ''}`} sm={4}>
                <ul className='d-flex list-unstyled mt-0'>
                    {visibleTabs?.map((item) => (
                        <li
                            key={item?._id}
                            onClick={() => setLeftTab(item?.name)}
                            className={`cursor-pointer p-1 fs-6 rounded-0 list-group-item  
                  d-flex align-items-center flex-fill justify-content-center fw-bold 
                  ${item.name === leftTab ? 'active-patient-chart-tab fw-medium' : 'border border-muted'}`}>
                            {item?.name}
                        </li>
                    ))}
                </ul>

                <Row className='mx-auto'>
                    <Col sm={12} className='px-md-1'>
                        {leftTab === 'Summary' && <EncounterSummary />}
                        {leftTab === 'Templates' && <EncounterTemplates selectedFromList={selectedFromList} setSelectedFromList={setSelectedFromList} />}
                        {leftTab === 'Past Encounters' && <>Past Encounters</>}
                        {leftTab === 'PMH' && <>PMH</>}
                    </Col>
                </Row>
            </Col>

            {/* Main Content Column */}
            <Col className='px-0 border-start pb-2 h-100' sm={isCollapsed ? 12 : 8}>
                {/* Encounter Details */}
                <div className="px-1 h-100">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row
                            style={{ height: '16.5vh' }}
                            className="g-2 mt-0 bg-light rounded-top p-1">
                            <Col sm={4} className='mt-0'>
                                <Form.Group className='encounterHeaderGroup'>
                                    <Form.Label className='mb-0 fw-bold small'>Encounter Type <span className='text-danger'>*</span></Form.Label>
                                    <Form.Select {...register('type', { required: 'This field is required' })} className='border-primary'>
                                        <option key='' value='' hidden>Select...</option>
                                        {encounterTypes?.map((data, index) => (
                                            <option key={index} value={data?.code}>{data?.code + '-' + data?.display}</option>
                                        ))}
                                    </Form.Select>
                                    {errors.type && (
                                        <div className="text-danger small mt-0">{errors.type.message}</div>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={4} className='mt-0'>
                                <Form.Group className='encounterHeaderGroup'>
                                    <Form.Label className='mb-0 fw-bold small'>Encounter Class <span className='text-danger'>*</span></Form.Label>
                                    <Form.Select {...register('class', { required: 'This field is required.' })} className='border-primary'>
                                        <option key='' value='' hidden>Select...</option>
                                        {encounterClassCodes?.map((data, index) => (
                                            <option key={index} value={data?.code}>{data?.code + ' (' + data?.display + ')'}</option>
                                        ))}
                                    </Form.Select>
                                    {errors.class && (
                                        <div className="text-danger small mt-0">{errors.class.message}</div>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={4} className='mt-0'>
                                <Form.Group className='encounterHeaderGroup'>
                                    <Form.Label className='mb-0 fw-bold small'>Note Type <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        options={notesTypeOptions}
                                        isSearchable
                                        isLoading={store?.getEncounterNotesTypeReducer?.loading}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        placeholder="Select"
                                        value={notesTypeOptions?.find(option => option?.value === noteType) || null}
                                        onChange={(selected) => {
                                            setNoteType(selected?.value);
                                            handleNotesTypeChange?.(selected);
                                        }}
                                        inputValue={searchNoteType}
                                        onInputChange={(value) => setSearchNoteType(value)}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                height: '30px',
                                                minHeight: '30px',
                                                border: '1px solid rgba(186, 185, 185, 0.762)',
                                                background: "white !important"
                                            }),
                                            placeholder: (provided) => ({
                                                ...provided,
                                                fontWeight: 'bold',
                                                fontSize: '12px',
                                                paddingBottom: '5px',
                                            }),
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={4} className='mt-0'>
                                <Form.Group className='encounterHeaderGroup'>
                                    <Form.Label className='mb-0 fw-bold small'>Start Date <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type="date"
                                        {...register('startDate', { required: 'This field is required' })}
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                        className='border-primary'
                                    />
                                    {errors.startDate && (
                                        <div className="text-danger small mt-0">{errors.startDate.message}</div>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={4} className='mt-0'>
                                <Form.Group className='encounterHeaderGroup'>
                                    <Form.Label className='mb-0 fw-bold small'>Status <span className='text-danger'>*</span></Form.Label>
                                    <Form.Select {...register('status', { required: 'This field is required' })} className='text-capitalize'>
                                        <option key='' value=''>Select Status</option>
                                        {['planned', 'arrived', 'triaged', 'in-progress', 'onleave', 'finished', 'cancelled']?.map((data, index) => (
                                            <option value={data} className='text-capitalize' key={index}>{data}</option>
                                        ))}
                                    </Form.Select>
                                    {errors.status && (
                                        <div className="text-danger small mt-0">{errors.status.message}</div>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col sm={4} className='mt-0'>
                                <Form.Group className='encounterHeaderGroup'>
                                    <Form.Label className='mb-0 fw-bold small'>Provider <span className='text-danger'>*</span></Form.Label>
                                    <Select
                                        options={providerOptions}
                                        isSearchable
                                        isClearable
                                        isLoading={store?.getDoctorsReducer?.loading}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        placeholder="Select"
                                        onChange={(selectedValue) => {
                                            setSelectedProvider(selectedValue?.value)
                                        }}
                                        onInputChange={(value, { action }) => {
                                            if (action === 'input-change') {
                                                dispatch(getDoctorsAction({ status: true, search: value, page: 1, limit: 10 }));
                                            }
                                        }}
                                        filterOption={null} // Important for server-side search
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                height: '30px',
                                                minHeight: '30px',
                                                border: '1px solid rgba(186, 185, 185, 0.762)',
                                                backgroundColor: "white",
                                                textTransform: 'capitalize'
                                            }),
                                            placeholder: (provided) => ({
                                                ...provided,
                                                fontWeight: 'bold',
                                                fontSize: '12px',
                                                paddingBottom: '5px',
                                            }),
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <NoteFormFields
                            selectedFromList={selectedFromList}
                            data={notesFields}
                        />
                        <div className="row">
                            <div className="col-12 text-end">
                                <Button
                                    type='Submit'
                                    className='custom-buttons'
                                    disabled={store?.createEncounterReducer?.loading}
                                >
                                    {store?.createEncounterReducer?.loading ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </div>
                    </Form>
                </div>
            </Col>
        </div>
    );
};

export default DateEncounters;