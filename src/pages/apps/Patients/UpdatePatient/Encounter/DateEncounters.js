import React, { useCallback, useEffect, useRef, useState, createRef } from 'react';
import { Col, Button, Row, Form } from 'react-bootstrap';
import EncounterSummary from './EncounterSummary';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { createEncounterAction, getDoctorsAction, getEncounterAction, getEncounterByIdAction, getEncounterNotesFieldsAction, updateEncounterAction } from '../../../../../redux/actions';
import EncounterTemplates from './EncounterTemplates';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { encounterClassCodes, encounterTypes } from '../../../../../utils/DataSets/commonData';
import { useSearchParams } from 'react-router-dom';
import { encryptMessage } from '../../../../../cryptoUtils';
import Spinner from '../../../../../constants/Spinner';
import PastEncounters from './PastEncounters';
import { string } from 'prop-types';
import { Controller } from 'react-hook-form';
import { handlePrintEncounters } from './handlePrintEncounter';
import { loggedInUser } from '../../../../../helpers/api/loggedInUser';

const DateEncounters = ({ isCollapsed, searchNoteType, expanded, setSearchNoteType, isAccordionOpen, encounterAction, encounterId }) => {
    const [leftTab, setLeftTab] = useState('Summary');
    const [selectedFromList, setSelectedFromList] = useState({})
    const store = useSelector((state) => state);
    const { handleSubmit, register, setValue, formState: { errors }, getValues, reset, control } = useForm();
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [initialLoading, setInitialLoading] = useState(true);
    const [isSessionRunning, setIsSessionRunning] = useState(false);
    const [stopwatchTime, setStopwatchTime] = useState(0);
    const intervalRef = useRef(null);
    // Get data from store
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const providerOptions = doctorDetails?.map((data) => ({
        label: data?.name?.[0]?.text, value: data?._id
    }));

    const settingsDataMainItems = store?.getEncounterSettingsReducer?.data?.data?.items;
    const createEncounterData = store?.createEncounterReducer;

    const notesFields = store?.getEncounterNotesFieldsReducer?.data?.data?.displaySettings?.mainPanel?.[0]?.sections;
    const notesTypeOptions = store?.getEncounterNotesTypeReducer?.data?.data?.map((data) => ({
        label: data?.title, value: data?._id, isDefault: data?.default
    }));
    const encounterData = store?.getEncounterByIdReducer?.data?.encounter;
    const [noteType, setNoteType] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const defaultNoteTypeOption = notesTypeOptions?.find(opt => opt.isDefault);

    // Get update encounter data from store
    const updateEncounterData = store?.updateEncounterReducer;
    const encounterDataGet = store?.getEncounterByIdReducer?.data?.encounter;
    // useEffect(() => {
    //     if (!encounterDataGet || !encounterDataGet._id) return;

    //     setEncounterDataArr((prev) => {
    //         const exists = prev.some((data) => data._id === encounterDataGet._id);

    //         if (exists) {
    //             // Replace the existing item
    //             return prev.map((data) =>
    //                 data._id === encounterDataGet._id ? encounterDataGet : data
    //             );
    //         } else {
    //             // Add as new item
    //             return [...prev, encounterDataGet];
    //         }
    //     });
    // }, [encounterDataGet]);

    // Handle successful encounter creation or update
    useEffect(() => {
        if (createEncounterData?.data?.status === 201) {
            dispatch(getEncounterAction({ patientId: id }));
            clearInterval(intervalRef.current); // Stop the stopwatch interval
            setStopwatchTime(0);
            setIsSessionRunning(false);
            // reset();
        }
        else if (updateEncounterData?.data?.status === 200) {
            setInitialLoading(false);
            dispatch(getEncounterByIdAction({ encounterId: encounterId }))
            dispatch(getEncounterAction({ patientId: id }));
            // removeEncounterTab(encounterId)
            reset();
        }
    }, [
        createEncounterData?.data?.status,
        updateEncounterData?.data?.status,
    ]);

    // useEffect(() => {
    //     if (encounterAction === 'updateEncounter') {
    //         dispatch(getEncounterByIdAction({ encounterId: encounterId }))
    //     }
    // }, [encounterAction])
    // Set default note type and populate form for update

    useEffect(() => {
        if (!noteType && defaultNoteTypeOption) {
            setNoteType(defaultNoteTypeOption.value);
            dispatch(getEncounterNotesFieldsAction({ noteId: defaultNoteTypeOption?.value }));
        }

        // Populate form for update operation
        if (encounterAction === 'updateEncounter' && encounterData && notesFields) {
            // Set provider
            if (encounterData?.providerId) {
                setSelectedProvider(encounterData?.providerId);
            }

            // Set form values
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
    }, [noteType, defaultNoteTypeOption, encounterAction, encounterData, setValue, notesFields]);
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
            ['Subjective', 'Objective', 'Assessment', 'Plan', 'Care Plan', "Notes"].forEach((section) => {
                if (selectedFromList?.[section]) {
                    setValue(section === 'Care Plan' ? 'CarePlan' : section, selectedFromList[section]);
                }
            });
        }, 0);
    }, [selectedFromList, setValue]);

    const patientDetails = store?.getPatientByIdReducer?.data?.data;
    const NoteFormFields = ({ data = [], excludedFields = [], control }) => {
        // For SOAP sections, keep refs for each ReactQuill
        const quillRefs = useRef({
            Subjective: createRef(),
            Objective: createRef(),
            Assessment: createRef(),
            Plan: createRef(),
            CarePlan: createRef(),
            Notes: createRef(),
        });
        const MAX_LENGTH = 1000;

        useEffect(() => {
            const sections = ['Subjective', 'Objective', 'Assessment', 'Plan', 'CarePlan', 'Notes'];

            sections.forEach(section => {
                const editor = quillRefs.current[section]?.current?.getEditor?.();

                if (editor) {
                    editor.on('text-change', (delta, oldDelta, source) => {
                        if (source === 'user') {
                            const text = editor.getText(); // includes trailing '\n'
                            if (text.length > MAX_LENGTH + 1) {
                                editor.deleteText(MAX_LENGTH, text.length);
                            }
                        }
                    });
                }
            });
        }, []);

        const getFieldsToRender = () => {
            return (data || [])
                .filter(field => field.isShown && !excludedFields.includes(field.name))
                .sort((a, b) => a.order - b.order);
        };

        const renderField = (field) => {
            const { name, inputType = 'textarea' } = field;
            const countWords = (text) => {
                return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
            };

            // Handler for text change with word limit
            const handleTextChange = (onChange, value, maxWords) => (content) => {
                const wordCount = countWords(content.replace(/<[^>]*>/g, ' ')); // Strip HTML tags for counting
                if (wordCount <= maxWords) {
                    onChange(content);
                }
            };

            if (name === 'Notes (SOAP)') {
                return (
                    <div className="" key={name}>

                        <h5>{name}</h5>
                        {['Subjective', 'Objective', 'Assessment', 'Plan', 'CarePlan', 'Notes'].map(section => (
                            <Form.Group className="mb-2" key={section}>
                                <Form.Label className="mb-1 d-flex align-items-center gap-2">
                                    <span>{section === 'CarePlan' ? 'Care Plan' : section}</span>
                                    <Form.Select className="w-25 text-black"
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
                                        {['Address', 'Age', 'Date of Birth', 'Email', 'Patient Name', 'Phone'].map((label, index) => {
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
                                </Form.Label>
                                <Controller
                                    name={section}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <ReactQuill
                                            ref={quillRefs.current[section]}
                                            theme="snow"
                                            value={value || ''}
                                            // onChange={onChange}
                                            onChange={handleTextChange(onChange, value, 100)}

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

            // Handle regular fields
            return (
                <Form.Group key={name}>
                    <Form.Label className="mb-0">{name}</Form.Label>
                    {inputType === 'text-editor' ? (
                        <Controller
                            name={name}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <ReactQuill
                                    theme="snow"
                                    value={value || ''} // Use form state value
                                    onChange={onChange} // Update form state on change
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
                        // <Form.Control
                        //     {...register(name)}
                        //     as={inputType === 'text' ? 'input' : 'textarea'}
                        //     rows={inputType === 'text' ? undefined : 3}
                        // />
                        // <Controller
                        //     name={name}
                        //     control={control}
                        //     render={({ field: { value = '', onChange } }) => (
                        //         <Form.Control
                        //             as={inputType === 'text' ? 'input' : 'textarea'}
                        //             rows={inputType === 'text' ? undefined : 10}
                        //             value={value}
                        //             onChange={(e) => {
                        //                 const input = e.target.value;
                        //                 const words = input.trim().split(/\s+/).filter(Boolean);

                        //                 // Prevent updating if the last word exceeds 45 characters
                        //                 const lastWord = words[words.length - 1] || '';
                        //                 if (lastWord.length > 45) return;

                        //                 const limitedWords = words.slice(0, MAX_LENGTH);
                        //                 const limitedText = limitedWords.join(' ');
                        //                 onChange(limitedText);
                        //             }}
                        //         />
                        //     )}
                        // />
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

                                        const words = input.match(/\S+/g) || []; // words are non-space sequences
                                        const wordCount = words.length;

                                        const lastWordMatch = input.match(/(\S+)$/); // match last word
                                        const lastWord = lastWordMatch ? lastWordMatch[0] : '';

                                        if (wordCount < MAX_LENGTH) {
                                            onChange(input);
                                            return;
                                        }

                                        // Word count == MAX_LENGTH
                                        if (wordCount === MAX_LENGTH) {
                                            // Allow updating only if user is typing inside the last word and it's <= 45 characters
                                            if (lastWord.length <= 45 && /\S$/.test(input)) {
                                                onChange(input);
                                            }
                                            // Else block (including if trying to type space after last word)
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
    const [providerError, setProviderError] = useState(false);
    const onSubmit = (data) => {
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

        const fieldsData = [];

        // Process regular fields and SOAP notes
        const fieldsToRender = (notesFields || [])
            .filter(field => field.isShown)
            .sort((a, b) => a.order - b.order);

        fieldsToRender.forEach(field => {
            const { name, inputType = 'textarea' } = field;

            // Handle SOAP notes specially
            if (name === 'Notes (SOAP)') {
                ['Subjective', 'Objective', 'Assessment', 'Plan', 'CarePlan', 'Notes'].forEach(section => {
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
        if (!selectedProvider) {
            setProviderError(true)
            return;
        } else {
            const payload = {
                type,
                class: encounterClass,
                subject: id,
                status: data?.status,
                providerId: selectedProvider,
                data: fieldsData,
                sessionTime: formatTime(stopwatchTime),
                period: {
                    start: data?.startDate,
                }
            }
            if (encounterAction === 'updateEncounter') {
                const updateData = {
                    id: encounterId,
                    data: fieldsData
                }
                dispatch(updateEncounterAction({ key: encryptMessage(updateData) }));
            } else {
                dispatch(createEncounterAction({ key: encryptMessage(payload) }));
            }
        }

    }


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

    const Stopwatch = React.memo(({ isRunning, time, onToggle }) => {

        return (
            <div className="d-flex align-items-center gap-1">
                <span onClick={onToggle} className={`cursor-pointer fs-5 ${isRunning ? "text-danger" : "text-success"}`}>
                    {isRunning ? <i className="bi bi-pause-fill" title='Stop Session'></i> : <i title='Start Session' className="bi bi-play-fill"></i>}
                </span>
                <div className="fw-bold">
                    {formatTime(time)}
                </div>
            </div>
        );
    });


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
                        {leftTab === 'Past Encounters' && <PastEncounters />}
                        {/* {leftTab === 'PMH' && <>PMH</>} */}
                    </Col>
                </Row>
            </Col>

            {/* Main Content Column */}
            <Col className='px-0 border-start pb-2' sm={isCollapsed ? 12 : 8}>
                {/* Encounter Details */}
                <div className={`px-1 h-100 ${store?.getEncounterByIdReducer?.loading && initialLoading ? 'd-flex align-items-center justify-content-center p-5' : ''}`}>
                    {store?.getEncounterByIdReducer?.loading && initialLoading ?
                        <Spinner />
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
                                                className='border-primary' >
                                                <option key='' value='' hidden>Select...</option>
                                                {encounterTypes?.map((data, index) => (
                                                    <option key={index} value={data?.code}>{data?.code + '-' + data?.display}</option>
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
                                                        const encounterClassSelected = encounterClassCodes?.find((data) => data?.code === e.target.value)
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
                                                        }
                                                        dispatch(updateEncounterAction({ key: encryptMessage(payload), fieldUpdating: 'class' }));
                                                    }
                                                }}>
                                                <option key='' value='' hidden>Select...</option>
                                                {encounterClassCodes?.map((data, index) => (
                                                    <option key={index} value={data?.code}>{data?.code + ' (' + data?.display + ')'}</option>
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
                                                setNoteType(selected?.value);
                                                handleNotesTypeChange?.(selected);
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
                                                {['planned', 'arrived', 'triaged', 'in-progress', 'onleave', 'finished', 'cancelled']?.map((data, index) => (
                                                    <option selected={!encounterData && data === 'arrived'} value={data} className='text-capitalize' key={index}>{data}</option>
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
                                                setProviderError(false)
                                                if (encounterAction === 'updateEncounter') {
                                                    const payload = {
                                                        id: encounterId,
                                                        providerId: selectedValue?.value
                                                    }
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
                            <NoteFormFields
                                selectedFromList={selectedFromList}
                                data={notesFields}
                                control={control}
                            />
                            <div className="row position-relative ">
                                {/* <div
                                    style={{ top: '8%' }}
                                    className="position-absolute d-flex align-items-center gap-2 py-2">
                                    <Stopwatch
                                        isRunning={isSessionRunning}
                                        time={stopwatchTime}
                                        onToggle={toggleSession}
                                    />
                                </div> */}
                                <div className=" d-flex justify-content-end gap-2 py-2">
                                    <Button
                                        type='Submit'
                                        className='custom-buttons'
                                        disabled={store?.createEncounterReducer?.loading || store?.updateEncounterReducer?.loading}
                                    >
                                        {store?.createEncounterReducer?.loading || store?.updateEncounterReducer?.loading ?
                                            <Spinner className='spinner-border-sm' color='white' />
                                            :
                                            encounterAction === 'updateEncounter' ? 'Update' : 'Save'}
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