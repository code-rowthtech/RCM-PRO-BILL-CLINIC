// ============================================================================
// IMPORTS
// ============================================================================

// React and Hooks
import React, { useCallback, useEffect, useRef, useState, createRef } from 'react';

// UI Components
import { Col, Button, Row, Form } from 'react-bootstrap';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import {
    createEncounterAction,
    getDoctorsAction,
    getEncounterAction,
    getEncounterByIdAction,
    getEncounterNotesFieldsAction,
    updateEncounterAction
} from '../../../../../redux/actions';

// Form Handling
import { useForm, Controller } from 'react-hook-form';

// Router
import { useSearchParams } from 'react-router-dom';

// Utils and Constants
import { encounterClassCodes, encounterTypes } from '../../../../../utils/DataSets/commonData';
import { encryptMessage } from '../../../../../cryptoUtils';
import ToastHandle from '../../../../../helpers/ToastMessage';
import Spinner from '../../../../../constants/Spinner';

// Local Components
import EncounterSummary from './EncounterSummary';
import EncounterTemplates from './EncounterTemplates';
import PastEncounters from './PastEncounters';
import ChangeNoteTypeModal from './ChangeNoteTypeModal';

// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_WORDS = 700;
const MAX_WORD_LENGTH = 45;
const SOAP_SECTIONS = ['Subjective', 'Objective', 'Assessment', 'Plan', 'CarePlan', 'Notes'];
const PATIENT_INFO_FIELDS = ['Address', 'Age', 'Date of Birth', 'Email', 'Patient Name', 'Phone'];
const ENCOUNTER_STATUSES = ['planned', 'arrived', 'triaged', 'in-progress', 'onleave', 'finished', 'cancelled'];
const DEFAULT_TABS = ['Summary', 'Templates', 'Past Encounters'];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DateEncounters = ({
    isCollapsed,
    searchNoteType,
    expanded,
    setSearchNoteType,
    isAccordionOpen,
    encounterAction,
    encounterId,
    encounterTabs,
    setEncounterTabs,
    setActiveTab,
    setExpanded
}) => {
    // ========================================================================
    // HOOKS AND STATE
    // ========================================================================

    // Redux hooks
    const store = useSelector((state) => state);
    const dispatch = useDispatch();

    // Router hooks
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    // Form hooks
    const { handleSubmit, register, setValue, formState: { errors }, getValues, reset, control } = useForm();

    // Component state
    const [leftTab, setLeftTab] = useState('Summary');
    const [selectedFromList, setSelectedFromList] = useState({});
    const [initialLoading, setInitialLoading] = useState(true);
    const [noteType, setNoteType] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [updateClicked, setUpdateClicked] = useState(false);
    const [providerError, setProviderError] = useState(false);

    // Modal state
    const [notesTypeModal, setNotesTypeModal] = useState(false);
    const [selectedNoteType, setSelectedNoteType] = useState(null);

    // Stopwatch state
    const [isSessionRunning, setIsSessionRunning] = useState(false);
    const [stopwatchTime, setStopwatchTime] = useState(0);
    const intervalRef = useRef(null);

    // ========================================================================
    // DERIVED STATE FROM STORE
    // ========================================================================

    // Patient data
    const patientDetails = store?.getPatientByIdReducer?.data?.data;

    // Doctor/Provider data
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const providerOptions = doctorDetails?.map((data) => ({
        label: `${data?.name?.[0]?.text + ' ' + data?.userId?.email}`,
        value: data?._id
    }));

    // Encounter data
    const encounterData = store?.getEncounterByIdReducer?.data?.encounter;
    const createEncounterData = store?.createEncounterReducer;
    const updateEncounterData = store?.updateEncounterReducer;

    // Notes and settings data
    const notesFields = store?.getEncounterNotesFieldsReducer?.data?.data?.displaySettings?.mainPanel?.[0]?.sections;
    const notesTypeOptions = store?.getEncounterNotesTypeReducer?.data?.data?.map((data) => ({
        label: data?.title,
        value: data?._id,
        isDefault: data?.default
    }));
    const defaultNoteTypeOption = notesTypeOptions?.find(opt => opt.isDefault);
    const settingsDataMainItems = store?.getEncounterSettingsReducer?.data?.data?.items;

    // ========================================================================
    // EFFECTS
    // ========================================================================

    // Handle successful encounter creation or update
    useEffect(() => {
        if (createEncounterData?.data?.status === 201) {
            dispatch(getEncounterAction({ patientId: id, status: '' }));
            const newEncounterId = createEncounterData?.data?.encounterId;
            const newTitle = createEncounterData?.data?.encounterStart
                ? new Date(createEncounterData?.data?.encounterStart).toISOString().split('T')[0]
                : '';

            const updatedTabs = encounterTabs.map(tab =>
                tab.id === encounterId
                    ? { ...tab, id: newEncounterId, title: newTitle, type: 'updateEncounter' }
                    : tab
            );
            setEncounterTabs(updatedTabs);
            setActiveTab(newEncounterId);
        }
        else if (updateEncounterData?.data?.status === 200 && updateClicked) {
            setUpdateClicked(false);
            setInitialLoading(false);
            dispatch(getEncounterByIdAction({ encounterId: encounterId }));
            dispatch(getEncounterAction({ patientId: id, status: '' }));
            reset();
        }
    }, [
        createEncounterData?.data?.status,
        updateEncounterData?.data?.status,
        updateClicked,
        dispatch,
        id,
        encounterId,
        reset
    ]);

    // Load encounter data for update
    useEffect(() => {
        if (encounterAction === 'updateEncounter') {
            dispatch(getEncounterByIdAction({ encounterId: encounterId }));
        }
    }, [encounterAction, dispatch, encounterId]);
    // Set default note type and populate form for update 
    useEffect(() => {
        // Set default note type
        if (!noteType && defaultNoteTypeOption) {
            setNoteType(defaultNoteTypeOption.value);
            dispatch(getEncounterNotesFieldsAction({ noteId: defaultNoteTypeOption.value }));
        }

        // Populate form for update operation
        if (encounterAction === 'updateEncounter' && encounterData && notesFields) {
            // Set provider and note type
            if (encounterData?.providerId) {
                setSelectedProvider(encounterData?.providerId?._id);
            }
            if (encounterData?.noteType) {
                setNoteType(encounterData?.noteType);
            }

            // Set basic form values
            if (encounterData?.type?.[0]?.coding?.[0]) {
                setValue('type', encounterData?.type?.[0]?.coding?.[0]?.code);
            }
            if (encounterData?.class?.coding?.[0]) {
                setValue('class', encounterData?.class?.coding?.[0]?.code);
            }
            if (encounterData?.status) {
                setValue('status', encounterData?.status);
            }
            if (encounterData?.period?.start) {
                setValue('startDate', encounterData?.period?.start?.split('T')[0]);
            }

            // Set note fields
            if (encounterData?.data && Array.isArray(encounterData?.data)) {
                encounterData?.data?.forEach(field => {
                    if (field?.type && field?.content?.value) {
                        setValue(field?.type, field?.content?.value);
                    }
                });
            }
        }
    }, [encounterAction, encounterData, setValue, notesFields, noteType, defaultNoteTypeOption, dispatch]);


    // Visible tabs configuration
    const visibleTabs = settingsDataMainItems?.length > 0
        ? settingsDataMainItems?.filter((item) => item?.show === true)
        : DEFAULT_TABS.map((name, index) => ({
            _id: index.toString(),
            name,
        }));

    // ========================================================================
    // UTILITY FUNCTIONS
    // ========================================================================

    const handleNotesTypeChange = (selectedOption) => {
        dispatch(getEncounterNotesFieldsAction({ noteId: selectedOption?.value }));
        setNoteType(selectedOption ? selectedOption.value : '');
    };

    const closeNoteTypeModal = () => {
        setNotesTypeModal(false);
    };

    const confirmSelection = () => {
        setNoteType(selectedNoteType?.value);
        handleNotesTypeChange?.(selectedNoteType);
    };

    const toggleSession = useCallback(() => {
        if (isSessionRunning) {
            clearInterval(intervalRef.current);
        } else {
            const startTime = Date.now() - stopwatchTime * 1000;
            intervalRef.current = setInterval(() => {
                setStopwatchTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        setIsSessionRunning(!isSessionRunning);
    }, [isSessionRunning, stopwatchTime]);

    // Apply template values to form
    useEffect(() => {
        if (!selectedFromList) return;

        setTimeout(() => {
            ['Subjective', 'Objective', 'Assessment', 'Plan', 'Care Plan', 'Notes'].forEach((section) => {
                const fieldName = section === 'Care Plan' ? 'CarePlan' : section;
                if (selectedFromList?.[section]) {
                    document.getElementById(fieldName)?.scrollIntoView({ behavior: 'smooth' });
                    setValue(fieldName, selectedFromList[section]);
                }
            });
        }, 0);
    }, [selectedFromList, setValue]);



    // ========================================================================
    // COMPONENTS
    // ========================================================================

    // Note Form Fields Component
    const NoteFormFields = ({ data = [], excludedFields = [], control }) => {
        // Refs for ReactQuill editors
        const quillRefs = useRef({
            Subjective: createRef(),
            Objective: createRef(),
            Assessment: createRef(),
            Plan: createRef(),
            CarePlan: createRef(),
            Notes: createRef(),
        });


        // Word limit validation for ReactQuill editors
        useEffect(() => {
            SOAP_SECTIONS.forEach(section => {
                const editor = quillRefs.current[section]?.current?.getEditor?.();
                if (!editor) return;

                let lastValidDelta = editor.getContents();

                editor.on('text-change', (delta, oldDelta, source) => {
                    if (source !== 'user') return;

                    setTimeout(() => {
                        const contents = editor.getContents();
                        const text = editor.getText().trim();
                        const words = text.split(/\s+/).filter(Boolean);
                        const longWord = words.find(word => word.length > MAX_WORD_LENGTH);

                        if (longWord || words.length > MAX_WORDS) {
                            editor.setContents(lastValidDelta);
                            ToastHandle(
                                longWord
                                    ? `Word "${longWord}" exceeds max ${MAX_WORD_LENGTH} characters`
                                    : `Maximum word limit of ${MAX_WORDS} exceeded`,
                                'danger'
                            );
                        } else {
                            lastValidDelta = contents;
                        }
                    }, 0);
                });
            });
        }, []);

        // Get fields to render based on visibility and exclusions
        const getFieldsToRender = () => {
            return (data || [])
                .filter(field => field.isShown && !excludedFields.includes(field.name))
                .sort((a, b) => a.order - b.order);
        };

        // Render individual field based on type
        const renderField = (field) => {
            const { name, inputType = 'textarea' } = field;

            // Utility functions
            const countWords = (text) => {
                return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
            };

            const handleTextChange = (onChange, value, maxWords) => (content) => {
                const wordCount = countWords(content.replace(/<[^>]*>/g, ' '));
                if (wordCount <= maxWords) {
                    onChange(content);
                }
            };

            // Render SOAP Notes section
            if (name === 'Notes (SOAP)') {
                return (
                    <div className="" key={name}>
                        <h5>{name}</h5>
                        {SOAP_SECTIONS.map(section => (
                            <Form.Group className="mb-2" key={section} id={section}>
                                <Form.Label className="mb-1 d-flex justify-content-between align-items-center gap-2">
                                    <div className='col-10 d-flex align-items-center gap-1'>
                                        <span>{section === 'CarePlan' ? 'Care Plan' : section}</span>
                                        <Form.Select
                                            className="w-25 text-black"
                                            onChange={e => {
                                                const value = e.target.value;
                                                if (value && quillRefs.current[section]?.current) {
                                                    const editor = quillRefs.current[section].current.getEditor();
                                                    const range = editor.getSelection(true);
                                                    editor.insertText(range ? range.index : 0, value);
                                                    e.target.value = '';
                                                }
                                            }}
                                        >
                                            <option value="">Add Patient Info</option>
                                            {PATIENT_INFO_FIELDS.map((label, index) => {
                                                const getValue = () => {
                                                    switch (label) {
                                                        case 'Address':
                                                            return patientDetails?.address?.[0]?.line?.[0] || '';
                                                        case 'Age':
                                                            return patientDetails?.approxAge ? `${patientDetails.approxAge} years old` : '';
                                                        case 'Date of Birth':
                                                            return patientDetails?.birthDate
                                                                ? new Date(patientDetails.birthDate).toISOString().split('T')[0]
                                                                : '';
                                                        case 'Email':
                                                            return patientDetails?.telecom?.find(t => t.system === 'email')?.value || '';
                                                        case 'Patient Name':
                                                            return patientDetails?.name?.find(n => n.use === 'official')?.text || '';
                                                        case 'Phone':
                                                            return patientDetails?.telecom?.find(t => t.system === 'phone')?.value || '';
                                                        default:
                                                            return '';
                                                    }
                                                };

                                                return (
                                                    <option key={index} value={getValue()}>
                                                        {label}
                                                    </option>
                                                );
                                            })}
                                        </Form.Select>
                                    </div>
                                    <div className="col-2 text-end pe-2">
                                        {MAX_WORDS + ' words'}
                                    </div>
                                </Form.Label>
                                <Controller
                                    name={section}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <ReactQuill
                                            ref={quillRefs.current[section]}
                                            theme="snow"
                                            value={value || '<p><br></p>'}
                                            onChange={handleTextChange(onChange, value, MAX_WORDS)}
                                            modules={{
                                                toolbar: [
                                                    ['bold', 'italic', 'underline'],
                                                    [{ list: 'ordered' }, { list: 'bullet' }],
                                                    ['link'],
                                                    ['clean'],
                                                ],
                                            }}
                                        />
                                    )}
                                />
                            </Form.Group>
                        ))}
                    </div>
                );
            }

            // Render regular fields
            return (
                <Form.Group key={name}>
                    <Form.Label className="mb-0 d-flex align-items-center justify-content-between">
                        <p className='mb-0'>{name}</p>
                        <p className='mb-0'>{MAX_WORDS + ' words'}</p>
                    </Form.Label>
                    {inputType === 'text-editor' ? (
                        <Controller
                            name={name}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <ReactQuill
                                    theme="snow"
                                    value={value || ''}
                                    onChange={onChange}
                                    modules={{
                                        toolbar: [
                                            ['bold', 'italic', 'underline'],
                                            [{ list: 'ordered' }, { list: 'bullet' }],
                                            ['link'],
                                            ['clean'],
                                            ['undo', 'redo'],
                                        ],
                                    }}
                                />
                            )}
                        />
                    ) : (
                        <Controller
                            name={name}
                            control={control}
                            render={({ field: { value = '', onChange } }) => (
                                <Form.Control
                                    as={inputType === 'text' ? 'input' : 'textarea'}
                                    rows={inputType === 'text' ? undefined : 10}
                                    value={value}
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        const words = input.match(/\S+/g) || [];
                                        const wordCount = words.length;
                                        const lastWordMatch = input.match(/(\S+)$/);
                                        const lastWord = lastWordMatch ? lastWordMatch[0] : '';

                                        if (wordCount < MAX_WORDS) {
                                            onChange(input);
                                            return;
                                        }

                                        if (wordCount === MAX_WORDS) {
                                            if (lastWord.length <= MAX_WORD_LENGTH && /\S$/.test(input)) {
                                                onChange(input);
                                            }
                                        }
                                    }}
                                />
                            )}
                        />
                    )}
                </Form.Group>
            );
        };

        return (
            <Row
                className="g-2 px-1 mt-1 scroll-container"
                style={{
                    height: !expanded ? (isAccordionOpen ? '36vh' : '50vh') : '59.5vh',
                    overflowY: 'auto',
                }}
            >
                {getFieldsToRender().map(field => renderField(field))}
            </Row>
        );
    };
    // Stopwatch Component
    const Stopwatch = React.memo(({ isRunning, time, onToggle }) => {
        const formatTime = (timeInSeconds) => {
            const hours = Math.floor(timeInSeconds / 3600);
            const minutes = Math.floor((timeInSeconds % 3600) / 60);
            const seconds = timeInSeconds % 60;

            return [
                hours.toString().padStart(2, '0'),
                minutes.toString().padStart(2, '0'),
                seconds.toString().padStart(2, '0')
            ].join(':');
        };

        return (
            <div className="d-flex align-items-center gap-3">
                <div className="text-nowrap">
                    {!isRunning ? "Session Stopped" : "Session Running"}
                </div>
                <div className="fw-bold">
                    {formatTime(time)}
                </div>
                <Button
                    variant={isRunning ? "outline-danger" : "outline-success"}
                    size="sm"
                    className={`${isRunning ? "btn-danger" : "btn-success"} timer-button text-white d-flex align-items-center justify-content-center`}
                    onClick={onToggle}
                >
                    {isRunning ? "Stop Session" : "Start Session"}
                </Button>
            </div>
        );
    });

    // ========================================================================
    // FORM SUBMISSION
    // ========================================================================

    const onSubmit = (data) => {
        // Validate provider selection
        if (!selectedProvider) {
            setProviderError(true);
            return;
        }

        // Build encounter type and class objects
        const encounterTypeSelected = encounterTypes?.find((e) => e?.code === data?.type);
        const encounterClassSelected = encounterClassCodes?.find((e) => e?.code === data?.class);

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

        // Process form fields data
        const fieldsData = [];
        const fieldsToRender = (notesFields || [])
            .filter(field => field.isShown)
            .sort((a, b) => a.order - b.order);

        fieldsToRender.forEach(field => {
            const { name, inputType = 'textarea' } = field;

            if (name === 'Notes (SOAP)') {
                // Handle SOAP notes specially
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
        // Create or update encounter
        const payload = {
            type,
            class: encounterClass,
            subject: id,
            status: data?.status,
            providerId: selectedProvider,
            noteType,
            data: fieldsData,
            period: {
                start: data?.startDate,
            }
        };

        if (encounterAction === 'updateEncounter') {
            const updateData = {
                id: encounterId,
                data: fieldsData
            };
            setUpdateClicked(true);
            dispatch(updateEncounterAction({ key: encryptMessage(updateData) }));
        } else {
            dispatch(createEncounterAction({ key: encryptMessage(payload) }));
        }

    };

    // ========================================================================
    // RENDER
    // ========================================================================
    return (
        <div className='px-0 mt-1  row border h-100  mx-1'>
            <Col className={` px-0 ${isCollapsed ? 'd-none' : ''}`} sm={4}>
                <ul className='d-flex list-unstyled mt-0 mb-0' style={{ height: 'fit-content' }}>
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
                    <Col sm={12} className='px-md-1 scroll-container ' style={{ height: !expanded ? (isAccordionOpen ? '55vh' : '70vh') : '78vh', overflowX: 'hidden' }}>
                        {leftTab === 'Summary' && <EncounterSummary />}
                        {leftTab === 'Templates' && <EncounterTemplates selectedFromList={selectedFromList} setSelectedFromList={setSelectedFromList} />}
                        {leftTab === 'Past Encounters' && <PastEncounters encounterTabs={encounterTabs} setEncounterTabs={setEncounterTabs} setActiveTab={setActiveTab} setExpanded={setExpanded} />}
                        {/* {leftTab === 'PMH' && <>PMH</>} */}
                    </Col>
                </Row>
            </Col>

            {/* Main Content Column */}
            <Col className='px-0 border-start pb-2' sm={isCollapsed ? 12 : 8}>
                {/* Encounter Details */}
                <div className={`px-1 h-100 ${store?.getEncounterByIdReducer?.loading ? 'd-flex align-items-center justify-content-center p-5' : ''}`}>
                    {store?.getEncounterByIdReducer?.loading ?
                        <Row style={{ height: '15vh' }}>
                            <Col sm={12} className='d-flex align-items-center justify-content-center py-4'>
                                <Spinner />
                            </Col>
                        </Row>
                        :
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row
                                style={{ height: '16.5vh' }}
                                className="g-2 mt-0 bg-light rounded-top p-1">
                                <Col sm={4} className='mt-0'>
                                    <Form.Group className='encounterHeaderGroup'>
                                        <Form.Label className='mb-0 fw-bold small'>Encounter Type <span className='text-danger'>*</span></Form.Label>
                                        <div className="position-relative">
                                            <Form.Select
                                                {...register('type', { required: 'This field is required' })}
                                                onChange={(e) => {
                                                    if (encounterAction === 'updateEncounter') {
                                                        const encounterTypeSelected = encounterTypes?.find((data) => data?.code === e.target.value)
                                                        const type = {
                                                            coding: [{
                                                                system: encounterTypeSelected.system,
                                                                code: encounterTypeSelected.code,
                                                                display: encounterTypeSelected.display,
                                                            }],
                                                            text: encounterTypeSelected.display,
                                                        };
                                                        const payload = {
                                                            id: encounterId,
                                                            type: type,
                                                        }
                                                        dispatch(updateEncounterAction({ key: encryptMessage(payload) }));
                                                    }
                                                }}
                                                className='border-primary'>
                                                <option key='' value='' hidden>Select...</option>
                                                {encounterTypes?.map((data, index) => (
                                                    <option key={index} value={data?.code}>
                                                        {data?.code + '-' + data?.display}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                        {errors.type && (
                                            <div className="text-danger small mt-0">{errors.type.message}</div>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col sm={4} className='mt-0'>
                                    <Form.Group className='encounterHeaderGroup'>
                                        <Form.Label className='mb-0 fw-bold small'>Encounter Class <span className='text-danger'>*</span></Form.Label>
                                        <div className="position-relative">
                                            <Form.Select
                                                {...register('class', { required: 'This field is required.' })}
                                                className='border-primary'
                                                onChange={(e) => {
                                                    if (encounterAction === 'updateEncounter') {
                                                        const encounterClassSelected = encounterClassCodes?.find((data) => data?.code === e.target.value);
                                                        const encounterClass = {
                                                            coding: [{
                                                                system: '',
                                                                code: encounterClassSelected.code,
                                                                display: encounterClassSelected.display,
                                                            }],
                                                            text: encounterClassSelected.display,
                                                        };
                                                        const payload = {
                                                            id: encounterId,
                                                            class: encounterClass,
                                                        };
                                                        dispatch(updateEncounterAction({ key: encryptMessage(payload), fieldUpdating: 'class' }));
                                                    }
                                                }}>
                                                <option key='' value='' hidden>Select...</option>
                                                {encounterClassCodes?.map((data, index) => (
                                                    <option key={index} value={data?.code}>
                                                        {data?.code + ' (' + data?.display + ')'}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </div>
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
                                                if (selected) {
                                                    setNotesTypeModal(true);
                                                    setSelectedNoteType(selected);
                                                }
                                                // setNoteType(selected?.value);
                                                // handleNotesTypeChange?.(selected);
                                            }}
                                            inputValue={searchNoteType}
                                            onInputChange={(value) => setSearchNoteType(value)}
                                            isDisabled={store?.updateEncounterReducer?.loading && store?.updateEncounterReducer?.fieldUpdating === 'noteType'}
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    height: '30px',
                                                    minHeight: '30px',
                                                    border: '1px solid rgba(186, 185, 185, 0.762)',
                                                    background: "white !important",
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
                                    <ChangeNoteTypeModal showModal={notesTypeModal} closeModal={closeNoteTypeModal} onConfirm={confirmSelection} />
                                </Col>
                                <Col sm={4} className='mt-0'>
                                    <Form.Group className='encounterHeaderGroup'>
                                        <Form.Label className='mb-0 fw-bold small'>Start Date <span className='text-danger'>*</span></Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                type="date"
                                                {...register('startDate', { required: 'This field is required' })}
                                                defaultValue={new Date().toISOString().split('T')[0]}
                                                className='border-primary'
                                                onChange={(e) => {
                                                    if (encounterAction === 'updateEncounter') {
                                                        const payload = {
                                                            id: encounterId,
                                                            period: {
                                                                start: e.target.value,
                                                                ...(encounterData?.period?.end && { end: encounterData.period.end })
                                                            },
                                                        }
                                                        dispatch(updateEncounterAction({ key: encryptMessage(payload), fieldUpdating: 'startDate' }));
                                                    }
                                                }}
                                            />
                                        </div>
                                        {errors.startDate && (
                                            <div className="text-danger small mt-0">{errors.startDate.message}</div>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col sm={4} className='mt-0'>
                                    <Form.Group className='encounterHeaderGroup'>
                                        <Form.Label className='mb-0 fw-bold small'>Status <span className='text-danger'>*</span></Form.Label>
                                        <div className="position-relative">
                                            <Form.Select
                                                {...register('status', { required: 'This field is required' })}
                                                onChange={(e) => {
                                                    if (encounterAction === 'updateEncounter') {
                                                        const payload = {
                                                            id: encounterId,
                                                            status: e.target.value,
                                                            ...(e.target.value === 'finished' && {
                                                                period: {
                                                                    start: encounterData?.period?.start,
                                                                    end: new Date().toISOString(),
                                                                }
                                                            })
                                                        }
                                                        dispatch(updateEncounterAction({ key: encryptMessage(payload), fieldUpdating: 'status' }));
                                                    }
                                                }}
                                                className='text-capitalize'>
                                                <option key='' value=''>Select Status</option>
                                                {ENCOUNTER_STATUSES?.map((data, index) => (
                                                    <option value={data} className='text-capitalize' key={index}>
                                                        {data}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </div>
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
                                            placeholder="Select Provider"
                                            value={providerOptions?.find(option => option?.value === selectedProvider) || null}
                                            onChange={(selectedValue) => {
                                                setSelectedProvider(selectedValue?.value);
                                                setProviderError(false);
                                                if (encounterAction === 'updateEncounter') {
                                                    const payload = {
                                                        id: encounterId,
                                                        providerId: selectedValue?.value
                                                    };
                                                    dispatch(updateEncounterAction({ key: encryptMessage(payload), fieldUpdating: 'provider' }));
                                                }
                                            }}
                                            onInputChange={(value, { action }) => {
                                                if (action === 'input-change') {
                                                    dispatch(getDoctorsAction({ status: true, search: value, page: 1, limit: 10 }));
                                                }
                                            }}
                                            filterOption={null}
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    height: '30px',
                                                    minHeight: '30px',
                                                    border: '1px solid rgba(186, 185, 185, 0.762)',
                                                    background: "white !important",
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
                                        {providerError && (
                                            <div className="text-danger small mt-0">This field is required</div>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>
                            {store?.getEncounterNotesFieldsReducer?.loading ?
                                <div className="row">
                                    <div style={{ height: '35vh' }} className="col-12 d-flex align-items-center justify-content-center">
                                        <Spinner />
                                    </div>
                                </div>
                                :
                                <NoteFormFields
                                    selectedFromList={selectedFromList}
                                    data={notesFields}
                                    control={control}
                                />
                            }
                            {/* Form Actions */}
                            <div className="row">
                                <div className="col-12 d-flex justify-content-end gap-2 py-2">
                                    <Button
                                        type='Submit'
                                        className='custom-buttons'
                                        disabled={store?.createEncounterReducer?.loading || store?.updateEncounterReducer?.loading}
                                    >
                                        {encounterAction === 'updateEncounter' ? 'Update' : 'Save'}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    }
                </div>
            </Col>
        </div>
    );
};

export default DateEncounters;