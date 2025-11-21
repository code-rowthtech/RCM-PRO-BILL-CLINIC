import { useCallback, useEffect, useRef, useState, createRef, useMemo, memo } from 'react';

// UI Components
import { Col, Button, Table, Row, Form, Accordion, Modal } from 'react-bootstrap';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import {
    createEncounterAction,
    getAppointmentsAction,
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
import { handleUpload } from '../../../../../helpers/HandleUpload';

// Local Components
import EncounterSummary from './EncounterSummary';
import EncounterTemplates from './EncounterTemplates';
import PastEncounters from './PastEncounters';
import ChangeNoteTypeModal from './ChangeNoteTypeModal';
import VitalsChart from './VitalsChart';
import { getVitalsByPatientIdAction } from '../../../../../redux/actions';
import { defaultVitals } from '../../../../../utils/DataSets/commonData2';
import { formatDateByUserTimeZone } from '../../../../../components/timeZonePipe';
import { MdPrint } from 'react-icons/md';
import { handlePrintVitals } from '../../../../../helpers/printVitals';
import { handlePrintAutopopulatedFields } from '../../../../../helpers/printAutopopulatedFields';
import { Trash } from 'lucide-react';
import { FaCloudUploadAlt, FaEye } from 'react-icons/fa';
import { IoMdTrash } from 'react-icons/io';

// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_WORDS = 700;
const MAX_WORD_LENGTH = 45;
const SOAP_SECTIONS = ['Subjective', 'Objective', 'Assessment', 'Plan', 'CarePlan', 'Notes'];
const PATIENT_INFO_FIELDS = ['Address', 'Age', 'Date of Birth', 'Email', 'Patient Name', 'Phone'];
const ENCOUNTER_STATUSES = ['arrived', 'planned', 'triaged', 'in-progress', 'onleave', 'finished', 'cancelled', 'save', 'ready for billing'];
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
    setExpanded,
    expandAllAccordions,
    onPrintRef
}) => {

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
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [appointmentError, setAppointmentError] = useState(false);
    const [consentDocuments, setConsentDocuments] = useState([]);

    // Modal state
    const [notesTypeModal, setNotesTypeModal] = useState(false);
    const [selectedNoteType, setSelectedNoteType] = useState(null);

    // File upload state
    const [attachedRecords, setAttachedRecords] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);

    // Accordion state for individual sections
    const [accordionState, setAccordionState] = useState({});

    // Vitals state
    const [vitals] = useState(defaultVitals);

    // Scroll position preservation
    const scrollPositionRef = useRef(0);

    // Patient data
    const patientDetails = store?.getPatientByIdReducer?.data?.data;

    // Encounter data
    const encounterData = store?.getEncounterByIdReducer?.data?.encounter;
    const createEncounterData = store?.createEncounterReducer;
    const updateEncounterData = store?.updateEncounterReducer;

    // ENCOUNTER SUMMARY DATA
    const allergyData = store?.getAllergiesOfAPatientReducer?.data?.allergies;
    const problemData = store?.getProblemListReducer?.data?.problems;
    const medicationList = store?.getMedicationReducer?.data?.medicationRequests;
    const patientVitals = store?.getVitalsByPatientIdReducer?.data?.data || [];

    const groupedVitals = useMemo(() => {
        return patientVitals?.reduce((acc, vitalGroup) => {
            const date = vitalGroup.effectiveDateTime;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(...vitalGroup.vitals);
            return acc;
        }, {}) || {};
    }, [patientVitals]);

    // Notes and settings data
    const notesFields = store?.getEncounterNotesFieldsReducer?.data?.data?.displaySettings?.mainPanel?.[0]?.sections;
    const notesTypeOptions = store?.getEncounterNotesTypeReducer?.data?.data?.map((data) => ({
        label: data?.title,
        value: data?._id,
        isDefault: data?.default
    }));
    const defaultNoteTypeOption = notesTypeOptions?.find(opt => opt.isDefault);
    const settingsDataMainItems = store?.getEncounterSettingsReducer?.data?.data?.items;

    // Store populated field data with remove functionality
    const [populatedFields, setPopulatedFields] = useState({});
    const [populatedFieldIds, setPopulatedFieldIds] = useState({});
    const dataLoadedRef = useRef(false);

    // Expose print function to parent
    useEffect(() => {
        if (onPrintRef) {
            onPrintRef.current = () => {
                const allFieldsData = {};
                const allFieldContent = {};
                const allFieldLabels = {};
                const fieldsToRender = (notesFields || [])
                    .filter(field => field.isShown)
                    .sort((a, b) => a.order - b.order);
                fieldsToRender.forEach(field => {
                    const { name } = field;
                    if (name === 'Notes (SOAP)') {
                        ['Subjective', 'Objective', 'Assessment', 'Plan'].forEach(section => {
                            allFieldsData[section] = populatedFields[section] || [];
                            allFieldContent[section] = getValues(section) || '';
                            allFieldLabels[section] = section;
                        });
                    } else if (name !== 'Attached Records' && name !== 'Vitals' && !name.toLowerCase().includes('vital')) {
                        allFieldsData[name] = populatedFields[name] || [];
                        allFieldContent[name] = getValues(name) || '';
                        allFieldLabels[name] = name;
                    }
                });
                handlePrintAutopopulatedFields({
                    populatedFields: allFieldsData,
                    patientDetails,
                    encounterData: null,
                    fieldLabels: allFieldLabels,
                    fieldContent: allFieldContent,
                    vitals: patientVitals
                });
            };
        }
    }, [onPrintRef, notesFields, populatedFields, getValues, patientDetails, patientVitals]);

    // ========================================================================
    // DERIVED STATE FROM STORE
    // ========================================================================

    // Doctor/Provider data
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const providerOptions = doctorDetails?.map((data) => ({
        value: data?._id,
        label: (data?.name?.[0]?.prefix?.[0]
            ? data?.name?.[0]?.prefix?.[0] + ' '
            : '') +
            (data?.name?.[0]?.family || '') +
            (data?.name?.[0]?.given?.length > 0
                ? ' ' + data?.name?.[0]?.given?.join(' ')
                : '') + ' ' +
            (data?.identifier?.find((tel) => tel?.type?.coding?.[0]?.code === 'NPI')?.value ?
                `(******${data?.identifier?.find((tel) => tel?.type?.coding?.[0]?.code === 'NPI')?.value.slice(-4)})`
                : '') || ''
    }));


    // APPOINTMENTS DATA
    const appointmentsData = store?.getAppointmentsReducer?.data?.appointments;
    const appointmentOptions = appointmentsData?.map((data) => ({
        value: data?._id,
        label: `${data?.appointmentType?.text || data?.appointmentType?.coding?.[0]?.display || 'Appointment'} - ${data?.start ? formatDateByUserTimeZone(data.start) : ''}`,
        consentDocument: data?.consentDocument || []
    }));

    // ========================================================================
    // FIELD POPULATION SYSTEM
    // ========================================================================

    // Global function to populate encounter fields from EncounterSummary
    useEffect(() => {
        window.populateEncounterField = (fieldName, data, itemId) => {
            // Check for duplicates
            const existingData = populatedFields[fieldName] || [];
            if (existingData.includes(data)) {
                ToastHandle('This data has already been added to the related field.', 'danger');
                return;
            }

            // Track populated data for removal functionality (only in side panel)
            setPopulatedFields(prev => ({
                ...prev,
                [fieldName]: [...(prev[fieldName] || []), data]
            }));

            // Track IDs if provided
            if (itemId) {
                setPopulatedFieldIds(prev => ({
                    ...prev,
                    [fieldName]: [...(prev[fieldName] || []), itemId]
                }));
            }
        };

        return () => {
            delete window.populateEncounterField;
        };
    }, [populatedFields]);

    // Function to remove populated data from field
    const removePopulatedData = (fieldName, dataToRemove) => {
        const indexToRemove = (populatedFields[fieldName] || []).indexOf(dataToRemove);

        setPopulatedFields(prev => ({
            ...prev,
            [fieldName]: (prev[fieldName] || []).filter(item => item !== dataToRemove)
        }));

        // Remove corresponding ID
        if (indexToRemove !== -1) {
            setPopulatedFieldIds(prev => ({
                ...prev,
                [fieldName]: (prev[fieldName] || []).filter((_, index) => index !== indexToRemove)
            }));
        }
    };

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
    }, [createEncounterData?.data?.status, updateEncounterData?.data?.status,
        updateClicked, dispatch, id, encounterId, reset]);

    useEffect(() => {
        dispatch(getVitalsByPatientIdAction({ limit: 4, patientId: id }))
        dispatch(getAppointmentsAction({
            patientId: id,
            status: '',
            limit: 10,
            skip: 1,
        }));
    }, [dispatch]);

    // Load encounter data for update
    useEffect(() => {
        if (encounterAction === 'updateEncounter') {
            dataLoadedRef.current = false;
            dispatch(getEncounterByIdAction({ encounterId: encounterId }));
        }
    }, [encounterAction, dispatch, encounterId]);

    // Set default values for new encounters
    useEffect(() => {
        if (encounterAction !== 'updateEncounter' && encounterTypes?.length > 0 && encounterClassCodes?.length > 0) {
            setValue('type', encounterTypes[0]?.code);
            setValue('class', encounterClassCodes[0]?.code);
            setValue('status', 'arrived');
            if (patientDetails?.doctorId?._id && !selectedProvider) {
                setSelectedProvider(patientDetails.doctorId._id);
            }
        }
    }, [encounterAction, encounterTypes, encounterClassCodes, setValue, patientDetails?.doctorId?._id, selectedProvider]);

    // Set default note type
    useEffect(() => {
        if (!noteType && defaultNoteTypeOption) {
            setNoteType(defaultNoteTypeOption.value);
            dispatch(getEncounterNotesFieldsAction({ noteId: defaultNoteTypeOption.value }));
        }
    }, [noteType, defaultNoteTypeOption, dispatch]);

    // Populate form for update operation
    useEffect(() => {
        if (encounterAction === 'updateEncounter' && encounterData && notesFields && !dataLoadedRef.current) {
            dataLoadedRef.current = true;

            if (encounterData?.providerId) {
                setSelectedProvider(encounterData?.providerId?._id);
            }
            if (encounterData?.noteType) {
                setNoteType(encounterData?.noteType);
            }
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
            if (encounterData?.data && Array.isArray(encounterData?.data)) {
                const newPopulatedFields = {};
                const newPopulatedFieldIds = {};

                encounterData?.data?.forEach(field => {
                    if (field?.type && field?.content?.value) {
                        setValue(field?.type, field?.content?.value);
                    }
                    if (field?.populatedData?.length > 0) {
                        newPopulatedFields[field.type] = field.populatedData;
                    }
                    if (field?.populatedIds?.length > 0) {
                        newPopulatedFieldIds[field.type] = field.populatedIds;
                    }
                });

                setPopulatedFields(newPopulatedFields);
                setPopulatedFieldIds(newPopulatedFieldIds);
            }
            if (encounterData?.attachedRecords) {
                setAttachedRecords(encounterData.attachedRecords);
            }
        }
    }, [encounterAction, encounterData, notesFields, setValue]);

    // Reset dataLoadedRef when switching encounters
    useEffect(() => {
        dataLoadedRef.current = false;
    }, [encounterId]);

    // Visible tabs configuration
    const visibleTabs = settingsDataMainItems?.length > 0
        ? settingsDataMainItems?.filter((item) => item?.show === true)
        : DEFAULT_TABS.map((name, index) => ({
            _id: index.toString(),
            name,
        }));

    // Vitals utility functions
    const handleFileUpload = async (files) => {
        const fileArray = Array.from(files);
        const uploadedFiles = [];

        for (const file of fileArray) {
            const uploadResult = await handleUpload(file, setUploadLoading);
            if (uploadResult) {
                uploadedFiles.push({
                    url: uploadResult?.url ? uploadResult.url.split('?')[0] : '',
                    fileName: uploadResult?.fileName || file.name
                });
            }
        }

        setAttachedRecords(prev => [...prev, ...uploadedFiles]);
    };


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

    // Save scroll position before loading state changes
    useEffect(() => {
        const handleScroll = () => {
            scrollPositionRef.current = window.scrollY;
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Restore scroll position after loading completes
    useEffect(() => {
        if (!store?.getEncounterNotesFieldsReducer?.loading && scrollPositionRef.current) {
            window.scrollTo(0, scrollPositionRef.current);
        }
    }, [store?.getEncounterNotesFieldsReducer?.loading]);

    // ========================================================================
    // COMPONENTS
    // ========================================================================

    // Initialize accordion state when fields load
    useEffect(() => {
        if (notesFields) {
            const initialState = {};
            notesFields.forEach((field, index) => {
                initialState[index] = expandAllAccordions;
            });
            setAccordionState(initialState);
        }
    }, [notesFields, expandAllAccordions]);

    // Memoize removePopulatedData to prevent re-renders
    const removePopulatedDataMemo = useCallback((fieldName, dataToRemove) => {
        removePopulatedData(fieldName, dataToRemove);
    }, []);

    // Note Form Fields Component
    const NoteFormFields = memo(({ data = [], excludedFields = [], control, populatedFields, removePopulatedData, patientDetails, attachedRecords, setAttachedRecords, handleFileUpload, uploadLoading, accordionState, setAccordionState, expanded, isAccordionOpen }) => {
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
        const getFieldsToRender = useMemo(() => {
            return (data || [])
                .filter(field => field.isShown && !excludedFields.includes(field.name))
                .sort((a, b) => a.order - b.order);
        }, [data, excludedFields]);

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
                } else {
                    ToastHandle(`Maximum word limit of ${maxWords} exceeded`, 'warning');
                }
            };

            const getWordCount = (text) => {
                return countWords(text?.replace(/<[^>]*>/g, ' ') || '');
            };

            const getWordCountColor = (count, max) => {
                const percentage = (count / max) * 100;
                if (percentage >= 90) return 'text-danger';
                if (percentage >= 75) return 'text-warning';
                return 'text-muted';
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
                                            <option value="">{`Add Patient Info`}</option>
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
                                    <Controller
                                        name={section}
                                        control={control}
                                        render={({ field: { value } }) => {
                                            const wordCount = getWordCount(value);
                                            return (
                                                <div className={`col-2 text-end pe-2 ${getWordCountColor(wordCount, MAX_WORDS)}`}>
                                                    {wordCount}/{MAX_WORDS} words
                                                </div>
                                            );
                                        }}
                                    />
                                </Form.Label>
                                {/* Show populated data with remove options for SOAP sections */}
                                {populatedFields[section] && populatedFields[section].length > 0 && (
                                    <div className="mb-2">
                                        <small className="text-muted">{`Auto-populated data:`}</small>
                                        <div style={{ maxHeight: '15vh', overflowY: 'hidden' }}>
                                            <Table responsive className="table-centered table-nowrap mb-0 rounded">
                                                <thead className="text-white" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                                    <tr>
                                                        <th className="text-white py-2" style={{ fontSize: '13px', width: '8%' }}>Sr.</th>
                                                        <th className="text-white py-2" style={{ fontSize: '13px', width: '82%' }}>Data</th>
                                                        <th className="text-white py-2" style={{ fontSize: '13px', width: '10%' }}>Action</th>
                                                    </tr>
                                                </thead>
                                            </Table>
                                            <div style={{ maxHeight: 'calc(15vh - 40px)', overflowY: 'auto', scrollbarWidth: 'thin' }}>
                                                <Table responsive className="table-centered table-nowrap mb-0">
                                                    <tbody>
                                                        {populatedFields[section].map((data, index) => (
                                                            <tr key={index} className="border-bottom">
                                                                <td className="py-1" style={{ fontSize: '13px', fontWeight: '400', width: '8%' }}>{index + 1}</td>
                                                                <td className="py-1 text-truncate" style={{ fontSize: '13px', fontWeight: '400', width: '82%' }} title={data}>{data}</td>
                                                                <td className="py-1 text-center" style={{ fontSize: '13px', fontWeight: '400', width: '10%' }}>
                                                                    <Trash
                                                                        size={14}
                                                                        className="text-danger cursor-pointer"
                                                                        onClick={() => removePopulatedData(section, data)}
                                                                        title="Remove this data"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                )}
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

            // Render Vitals field with chart/table
            if (name === 'Vitals' || name.toLowerCase().includes('vital')) {
                return (
                    <div key={name}>
                        <VitalsChart />
                    </div>
                );
            }

            // Render Attached Records field with file upload
            if (name === 'Attached Records') {
                return (
                    <Form.Group key={name} className='row'>
                        <div className="col-12">
                            <Form.Label className="mb-0 d-flex align-items-center">{name}
                                <input
                                    type="file"
                                    id="file-upload"
                                    multiple
                                    onChange={(e) => handleFileUpload(e.target.files)}
                                    className="d-none"
                                    accept='.pdf, .doc, .docx, .jpg, .jpeg, .png, .xls, .xlsx, .csv'
                                    disabled={uploadLoading}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className={` ${uploadLoading ? 'disabled' : ''} text-primary ms-2 cursor-pointer rounded-circle`}
                                    title="Allowed file types: PDF, DOC, DOCX, JPG, JPEG, PNG, XLS, XLSX, CSV"
                                >
                                    <FaCloudUploadAlt size={14} />
                                </label>
                            </Form.Label>
                            {uploadLoading && (
                                <div className="d-flex align-items-center">
                                    <small className="text-muted">Uploading files...</small>
                                </div>
                            )}
                        </div>
                        {attachedRecords?.length > 0 && (
                            attachedRecords?.map((file, index) => (
                                <div key={index} className=" col-4 mt-1  p-1">
                                    <div className='d-flex align-items-center justify-content-between  p-1 px-2 rounded bg-light'>
                                        <small className="text-truncate" title={file?.fileName}>{file?.fileName}</small>
                                        <div className="d-flex align-items-center gap-1">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="p-0"
                                                style={{ width: '20px', height: '20px', fontSize: '10px' }}
                                                onClick={() => window.open(file.url, '_blank')}
                                                title="Preview file"
                                            >
                                                <FaEye size={12} />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="p-0"
                                                style={{ width: '20px', height: '20px', fontSize: '10px' }}
                                                onClick={() => setAttachedRecords(prev => prev.filter((_, i) => i !== index))}
                                                title="Remove file"
                                            >
                                                <Trash size={12} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </Form.Group>
                );
            }

            // Render regular fields
            return (
                <Form.Group key={name}>
                    <Form.Label className="mb-0 d-flex align-items-center justify-content-between">
                        <p className='mb-0'></p>
                        <Controller
                            name={name}
                            control={control}
                            render={({ field: { value } }) => {
                                const wordCount = inputType === 'text-editor' ? getWordCount(value) : countWords(value || '');
                                return (
                                    <p className={`mb-0 ${getWordCountColor(wordCount, MAX_WORDS)}`}>
                                        {wordCount}/{MAX_WORDS} words
                                    </p>
                                );
                            }}
                        />
                    </Form.Label>
                    <Row>
                        <Col sm={12} className='mb-2'>
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
                                            rows={4}
                                            // rows={inputType === 'text' ? undefined : populatedFields[name]?.length > 3 ? 8 : 3}
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
                                                    } else if (lastWord.length > MAX_WORD_LENGTH) {
                                                        ToastHandle(`Word "${lastWord}" exceeds max ${MAX_WORD_LENGTH} characters`, 'warning');
                                                    }
                                                } else {
                                                    ToastHandle(`Maximum word limit of ${MAX_WORDS} exceeded`, 'warning');
                                                }
                                            }}
                                        />
                                    )}
                                />
                            )}
                        </Col>
                        {populatedFields[name] && populatedFields[name].length > 0 && (
                            <Col sm={12}>
                                <div className="mb-2">
                                    {populatedFields[name].some(data => data.includes(':') && data.includes('\n')) ? (
                                        (() => {
                                            // Group data by type
                                            const groupedData = {};
                                            populatedFields[name].forEach(data => {
                                                if (data.includes(':') && data.includes('\n')) {
                                                    const type = data.split('\n')[0].split(': ')[1];
                                                    if (!groupedData[type]) groupedData[type] = [];
                                                    groupedData[type].push(data);
                                                }
                                            });

                                            return Object.entries(groupedData).map(([type, items]) => {
                                                const firstItem = items[0];
                                                const lines = firstItem.split('\n');
                                                const headers = lines.map(line => line.split(': ')[0]).filter(Boolean).slice(1);

                                                let widths = [];
                                                if (type === 'Tobacco') {
                                                    widths = ['15%', '50%', '25%'];
                                                } else if (type === 'Family History') {
                                                    widths = ['20%', '20%', '30%', '20%'];
                                                } else if (type === 'Medical History') {
                                                    widths = ['30%', '40%', '20%'];
                                                } else if (type === 'Alcohol History') {
                                                    widths = ['20%', '20%', '20%', '30%'];
                                                } else if (type === 'Surgical History') {
                                                    widths = ['25%', '20%', '25%', '20%'];
                                                }

                                                return (
                                                    <div key={type} className="mb-3">
                                                        <strong className="text-muted" style={{ fontSize: '11px' }}>{type}</strong>
                                                        <div style={{ maxHeight: '15vh', overflowY: 'hidden' }}>
                                                            <Table responsive className="table-centered table-nowrap mb-0 rounded">
                                                                <thead className="text-white" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                                                    <tr>
                                                                        <th className="text-white py-2" style={{ fontSize: '13px', width: '8%' }}>Sr.</th>
                                                                        {headers.map((header, i) => (
                                                                            <th key={i} className="text-white py-2" style={{ fontSize: '13px', width: widths[i] || '20%' }}>{header}</th>
                                                                        ))}
                                                                        <th className="text-white py-2" style={{ fontSize: '13px', width: '5%' }}>Remove</th>
                                                                    </tr>
                                                                </thead>
                                                            </Table>
                                                            <div style={{ maxHeight: 'calc(15vh - 40px)', overflowY: 'auto', scrollbarWidth: 'thin' }}>
                                                                <Table responsive className="table-centered table-nowrap mb-0">
                                                                    <tbody>
                                                                        {items.map((data, index) => {
                                                                            const lines = data.split('\n');
                                                                            const parsedData = {};
                                                                            lines.forEach(line => {
                                                                                const [label, value] = line.split(': ');
                                                                                if (label && value) parsedData[label] = value;
                                                                            });
                                                                            const values = Object.entries(parsedData).slice(1).map(([_, v]) => v);

                                                                            return (
                                                                                <tr key={index} className="border-bottom">
                                                                                    <td className="py-1" style={{ fontSize: '13px', fontWeight: '400', width: '8%' }}>{index + 1}</td>
                                                                                    {values.map((val, i) => (
                                                                                        <td key={i} className="py-1 text-truncate" style={{ fontSize: '13px', fontWeight: '400', width: widths[i] || '20%' }} title={val}>{val}</td>
                                                                                    ))}
                                                                                    <td className="py-1 text-center" style={{ fontSize: '13px', fontWeight: '400', width: '5%' }}>
                                                                                        <Trash
                                                                                            size={14}
                                                                                            className="text-danger cursor-pointer"
                                                                                            onClick={() => removePopulatedData(name, data)}
                                                                                            title="Remove"
                                                                                        />
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                    </tbody>
                                                                </Table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })()
                                    ) : (
                                        <div style={{ maxHeight: '15vh', overflowY: 'hidden' }}>
                                            <Table responsive className="table-centered table-nowrap mb-0 rounded">
                                                <thead className="text-white" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                                    <tr>
                                                        <th className="text-white py-2" style={{ fontSize: '13px', width: '8%' }}>Sr.</th>
                                                        <th className="text-white py-2" style={{ fontSize: '13px', width: '82%' }}>Data</th>
                                                        <th className="text-white py-2" style={{ fontSize: '13px', width: '10%' }}>Action</th>
                                                    </tr>
                                                </thead>
                                            </Table>
                                            <div style={{ maxHeight: 'calc(15vh - 40px)', overflowY: 'auto', scrollbarWidth: 'thin' }}>
                                                <Table responsive className="table-centered table-nowrap mb-0">
                                                    <tbody>
                                                        {populatedFields[name].map((data, index) => (
                                                            <tr key={index} className="border-bottom">
                                                                <td className="py-1" style={{ fontSize: '13px', fontWeight: '400', width: '8%' }}>{index + 1}</td>
                                                                <td className="py-1 text-truncate" style={{ fontSize: '13px', fontWeight: '400', width: '82%' }} title={data}>{data}</td>
                                                                <td className="py-1 text-center" style={{ fontSize: '13px', fontWeight: '400', width: '10%' }}>
                                                                    <Trash
                                                                        size={14}
                                                                        className="text-danger cursor-pointer"
                                                                        onClick={() => removePopulatedData(name, data)}
                                                                        title="Remove this data"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Col>
                        )}
                    </Row>
                </Form.Group>
            );
        };
        const handlePrintEncounterItems = (fieldName, event) => {
            event.stopPropagation();
            if (fieldName?.name === 'Monitoring Chart (Vitals)' || fieldName?.name?.toLowerCase().includes('vital')) {
                handlePrintVitals({ vitals: patientVitals, patientDetails: patientDetails });
            } else {
                const fieldSpecificData = populatedFields[fieldName?.name] || [];
                const fieldContent = getValues(fieldName?.name) || '';

                handlePrintAutopopulatedFields({
                    populatedFields: { [fieldName?.name]: fieldSpecificData },
                    patientDetails,
                    encounterData,
                    fieldLabels: { [fieldName?.name]: fieldName?.name },
                    fieldContent: { [fieldName?.name]: fieldContent }
                });
            }
        }
        return (
            <Row
                className="g-2 px-1 mt-1 scroll-container"
                style={{
                    height: !expanded ? (isAccordionOpen ? '36vh' : '50vh') : '59.5vh',
                    overflowY: 'auto',
                }}
            >
                <Accordion activeKey={Object.keys(accordionState).filter(key => accordionState[key])} alwaysOpen>
                    {getFieldsToRender.map((field, index) => (
                        <Accordion.Item className='mb-3' eventKey={index.toString()} key={index}>
                            <Accordion.Header
                                className='encounter-accordion-header  d-flex justify-content-between w-100'
                                onClick={(e) => {
                                    e.preventDefault();
                                    setAccordionState(prev => ({ ...prev, [index]: !prev[index] }))
                                }}
                            >
                                <div className='d-flex justify-content-between align-items-center w-100'>
                                    <span className='text-capitalize p-2'>
                                        {field.name}
                                    </span>
                                    <MdPrint onClick={(e) => handlePrintEncounterItems(field, e)} size={18} className='text-dark' />
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                {renderField(field)}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Row>
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
                    const fieldData = {
                        type: section,
                        content: {
                            type: inputType === 'text-editor' ? 'html' : 'text',
                            value: value
                        }
                    };
                    if (populatedFieldIds[section]?.length > 0) {
                        fieldData.populatedIds = populatedFieldIds[section];
                    }
                    if (populatedFields[section]?.length > 0) {
                        fieldData.populatedData = populatedFields[section];
                    }
                    fieldsData.push(fieldData);
                });
            } else if (name !== 'Attached Records') {
                // Handle regular fields, exclude Attached Records
                const value = getValues(name) || '';
                const fieldData = {
                    type: name,
                    content: {
                        type: inputType === 'text-editor' ? 'html' : 'text',
                        value: value
                    }
                };
                if (populatedFieldIds[name]?.length > 0) {
                    fieldData.populatedIds = populatedFieldIds[name];
                }
                if (populatedFields[name]?.length > 0) {
                    fieldData.populatedData = populatedFields[name];
                }
                fieldsData.push(fieldData);
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
            attachedRecords,
            period: {
                start: data?.startDate,
            }
            // clinicId: loggedInUser
        };
        if (encounterAction === 'updateEncounter') {
            const updateData = {
                id: encounterId,
                data: fieldsData,
                attachedRecords
            };

            setUpdateClicked(true);
            dispatch(updateEncounterAction({ key: encryptMessage(updateData) }));
        } else {
            console.log(payload, 'payloadpayloadpayload')
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
                        <Form id="encounter-form" onSubmit={handleSubmit(onSubmit)}>
                            <Row
                                style={{ height: '16.5vh' }}
                                className="g-2 mt-0 bg-light rounded-top p-1">
                                <Col sm={3} className='mt-0'>
                                    <Form.Group className='encounterHeaderGroup'>
                                        <Form.Label className='mb-0 fw-bold small'>{`Encounter Type`} <span className='text-danger'>{`*`}</span></Form.Label>
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
                                                <option key='' value='' hidden>{`Select...`}</option>
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
                                <Col sm={3} className='mt-0'>
                                    <Form.Group className='encounterHeaderGroup'>
                                        <Form.Label className='mb-0 fw-bold small'>{`Encounter Class`} <span className='text-danger'>{`*`}</span></Form.Label>
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
                                                <option key='' value='' hidden>{`Select...`}</option>
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
                                <Col sm={3} className='mt-0'>
                                    <Form.Group className='encounterHeaderGroup'>
                                        <Form.Label className='mb-0 fw-bold small'>{`Note Type`} <span className='text-danger'>{`*`}</span></Form.Label>
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
                                                menuPortal: (base) => ({
                                                    ...base,
                                                    zIndex: 9999,  // 👈 ensure it's above sticky headers
                                                }),
                                            }}
                                        />
                                    </Form.Group>
                                    <ChangeNoteTypeModal showModal={notesTypeModal} closeModal={closeNoteTypeModal} onConfirm={confirmSelection} />
                                </Col>
                                <Col sm={3} className='mt-0'>
                                    <Form.Group className='encounterHeaderGroup'>
                                        <Form.Label className='mb-0 fw-bold small'>{`Start Date`} <span className='text-danger'>{`*`}</span></Form.Label>
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
                                <Col sm={3} className='mt-0'>
                                    <Form.Group className='encounterHeaderGroup'>
                                        <Form.Label className='mb-0 fw-bold small'>{`Status`} <span className='text-danger'>{`*`}</span></Form.Label>
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
                                                <option key='' value=''>{`Select Status`}</option>
                                                {ENCOUNTER_STATUSES?.sort((a, b) => a.localeCompare(b))?.map((data, index) => (
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
                                <Col sm={3} className='mt-0'>
                                    <Form.Group className='encounterHeaderGroup'>
                                        <Form.Label className='mb-0 fw-bold small'>{`Seen By`} <span className='text-danger'>{`*`}</span></Form.Label>
                                        <Select
                                            options={providerOptions}
                                            isSearchable
                                            isClearable
                                            isLoading={store?.getDoctorsReducer?.loading}
                                            className="basic-single"
                                            classNamePrefix="select"
                                            placeholder="Select Provider"
                                            value={providerOptions?.find(option => option?.value === selectedProvider) || providerOptions?.find((option) => option?.value === patientDetails?.doctorId?._id || null)}
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
                                                menuPortal: (base) => ({
                                                    ...base,
                                                    zIndex: 9999,  // 👈 ensure it's above sticky headers
                                                }),
                                            }}
                                        />
                                        {providerError && (
                                            <div className="text-danger small mt-0">{`This field is required`}</div>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col sm={3} className='mt-0'>
                                    <Form.Group className='encounterHeaderGroup'>
                                        <Form.Label className='mb-0 fw-bold small'>{`Related Appointment`}</Form.Label>
                                        <Select
                                            options={appointmentOptions}
                                            isSearchable
                                            isClearable
                                            isLoading={store?.getAppointmentsReducer?.loading}
                                            className="basic-single"
                                            classNamePrefix="select"
                                            placeholder="Select Appointment"
                                            value={appointmentOptions?.find(option => option?.value === selectedAppointment) || null}
                                            onChange={(selectedValue) => {
                                                setSelectedAppointment(selectedValue?.value);
                                                setAppointmentError(false);
                                                if (selectedValue?.consentDocument) {
                                                    setConsentDocuments(selectedValue.consentDocument);
                                                } else {
                                                    setConsentDocuments([]);
                                                }
                                                if (encounterAction === 'updateEncounter') {
                                                    const payload = {
                                                        id: encounterId,
                                                        appointmentId: selectedValue?.value
                                                    };
                                                    dispatch(updateEncounterAction({ key: encryptMessage(payload), fieldUpdating: 'appointment' }));
                                                }
                                            }}
                                            onInputChange={(value, { action }) => {
                                                if (action === 'input-change') {
                                                    dispatch(getAppointmentsAction({ status: true, search: value, page: 1, limit: 10 }));
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
                                                menuPortal: (base) => ({
                                                    ...base,
                                                    zIndex: 9999,  // 👈 ensure it's above sticky headers
                                                }),
                                            }}
                                        />
                                        {appointmentError && (
                                            <div className="text-danger small mt-0">{`This field is required`}</div>
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
                                    populatedFields={populatedFields}
                                    removePopulatedData={removePopulatedDataMemo}
                                    patientDetails={patientDetails}
                                    attachedRecords={attachedRecords}
                                    setAttachedRecords={setAttachedRecords}
                                    handleFileUpload={handleFileUpload}
                                    uploadLoading={uploadLoading}
                                    accordionState={accordionState}
                                    setAccordionState={setAccordionState}
                                    expanded={expanded}
                                    isAccordionOpen={isAccordionOpen}
                                />
                            }
                        </Form>
                    }
                </div>
            </Col>
        </div>
    );
};

export default DateEncounters;