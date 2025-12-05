import React, { useEffect, useRef, useState, memo } from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import Select from 'react-select';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
import {
    createEncounterAction,
    getAppointmentsAction,
    getDoctorsAction,
    getEncounterAction,
    getEncounterByIdAction,
    getEncounterNotesFieldsAction,
    updateEncounterAction
} from '../../../../../../redux/actions';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { encounterClassCodes, encounterTypes } from '../../../../../../utils/DataSets/commonData';
import { encryptMessage } from '../../../../../../cryptoUtils';
import ToastHandle from '../../../../../../helpers/ToastMessage';
import Spinner from '../../../../../../constants/Spinner';
import { handleUpload } from '../../../../../../helpers/HandleUpload';
import EncounterSummaryV2 from './EncounterSummaryV2';
import EncounterTemplates from '../../Encounter/EncounterTemplates';
import PastEncounters from '../../Encounter/PastEncounters';
import ChangeNoteTypeModal from '../../Encounter/ChangeNoteTypeModal';
import { getVitalsByPatientIdAction } from '../../../../../../redux/actions';
import { defaultVitals } from '../../../../../../utils/DataSets/commonData2';
import { handlePrintAutopopulatedFields } from '../../../../../../helpers/printAutopopulatedFields';
import { useEncounterData } from '../hooks/useEncounterData';
import { useFieldPopulation } from '../hooks/useFieldPopulation';
import { useAppointmentIntegration } from '../hooks/useAppointmentIntegration';
import { NoteFormFields } from './NoteFormFields';
import { getConsentFormAction } from '../../../../../../redux/settings/action';

const ENCOUNTER_STATUSES = ['arrived', 'planned', 'triaged', 'in-progress', 'onleave', 'finished', 'cancelled', 'save', 'ready for billing'];
const DEFAULT_TABS = ['Summary', 'Templates', 'Past Encounters'];

const DateEncountersV2 = ({
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
    onPrintRef,
    scrollToAccordion,
    setScrollToAccordion,
    appointmentData
}) => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
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
    const [selectedConsentForms, setSelectedConsentForms] = useState([]);
    const [notesTypeModal, setNotesTypeModal] = useState(false);
    const [selectedNoteType, setSelectedNoteType] = useState(null);
    const [attachedRecords, setAttachedRecords] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [accordionState, setAccordionState] = useState({});
    const [vitals] = useState(defaultVitals);
    const scrollPositionRef = useRef(0);

    // Custom hooks
    const {
        store,
        patientDetails,
        encounterData,
        createEncounterData,
        updateEncounterData,
        patientVitals,
        notesFields,
        notesTypeOptions,
        defaultNoteTypeOption,
        settingsDataMainItems,
        providerOptions,
        appointmentsData,
        appointmentOptions
    } = useEncounterData(id, encounterId, encounterAction);

    const { processAppointmentSelection, getAppointmentBasedDefaults } = useAppointmentIntegration();

    const {
        populatedFields,
        populatedFieldIds,
        removePopulatedData,
        dataLoadedRef
    } = useFieldPopulation();

    // Scroll to accordion functionality
    useEffect(() => {
        if (scrollToAccordion && notesFields) {
            const soapSections = ['Subjective', 'Objective', 'Assessment', 'Plan'];
            const targetField = soapSections.includes(scrollToAccordion) ? 'Notes (SOAP)' : scrollToAccordion;

            const accordionIndex = notesFields.findIndex(field =>
                field.name.toLowerCase().includes(targetField.toLowerCase())
            );
            if (accordionIndex !== -1) {
                setAccordionState(prev => ({ ...prev, [accordionIndex]: true }));
                setTimeout(() => {
                    const accordionElement = document.querySelector(`[data-accordion-index="${accordionIndex}"]`);
                    if (accordionElement) {
                        accordionElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 300);
                setScrollToAccordion(null);
            }
        }
    }, [scrollToAccordion, notesFields, setScrollToAccordion]);

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
        }))
        const clinicId = store?.Auth?.user?.clinicId;
        if (clinicId) {
            dispatch(getConsentFormAction({ clinicId }));
        }
    }, [dispatch, id])

    // Load encounter data for update
    useEffect(() => {
        if (encounterAction === 'updateEncounter') {
            dataLoadedRef.current = false;
            dispatch(getEncounterByIdAction({ encounterId: encounterId }));
        }
    }, [encounterAction, dispatch, encounterId]);

    // Auto-populate from appointment data when creating new encounter (only once)
    useEffect(() => {
        if (encounterAction === 'createEncounter' && appointmentData && !dataLoadedRef.current) {
            dataLoadedRef.current = true;
            processAppointmentSelection(appointmentData);
            const defaults = getAppointmentBasedDefaults();
            if (appointmentData._id) {
                setSelectedAppointment(appointmentData?._id);
            }
            if (appointmentData.consentForms && appointmentData.consentForms.length > 0) {
                const appointmentConsentForms = appointmentData.consentForms.map(form => ({
                    value: form._id || form.id,
                    label: form.title || form.name || 'Consent Form',
                    data: form
                }));
                setSelectedConsentForms(appointmentConsentForms);
            }
            if (appointmentData.providerInfo) {
                const providerInfo = appointmentData.providerInfo;
                let providerId = null;

                // Extract provider ID from different possible formats
                if (providerInfo._id) {
                    providerId = providerInfo._id;
                } else if (providerInfo.reference) {
                    // Extract ID from reference like "Practitioner/123"
                    const refParts = providerInfo.reference.split('/');
                    if (refParts.length > 1) {
                        providerId = refParts[1];
                    }
                }

                if (providerId) {
                    // Check if provider exists in current options
                    const existingProvider = providerOptions?.find(option => option.value === providerId);

                    if (existingProvider) {
                        setSelectedProvider(providerId);
                    } else {
                        // Search for the provider if not in current list
                        const providerName = providerInfo.display || providerInfo.name?.[0]?.text || '';
                        if (providerName) {
                            dispatch(getDoctorsAction({
                                status: true,
                                search: providerName,
                                page: 1,
                                limit: 50
                            })).then(() => {
                                // Set provider after search completes
                                setTimeout(() => {
                                    setSelectedProvider(providerId);
                                }, 100);
                            });
                        } else {
                            // Fallback: set the provider ID directly
                            setSelectedProvider(providerId);
                        }
                    }
                }
            } else if (defaults.providerId) {
                setSelectedProvider(defaults.providerId);
            }
            if (defaults.startDate) {
                setValue('startDate', defaults.startDate);
            }
            if (defaults.status) {
                setValue('status', defaults.status);
            }
            // Auto-populate appointment reason in notes if available
            if (defaults.appointmentReason && notesFields) {
                const reasonField = notesFields.find(field =>
                    field.name.toLowerCase().includes('reason') ||
                    field.name.toLowerCase().includes('chief complaint')
                );
                if (reasonField) {
                    setValue(reasonField.name, defaults.appointmentReason);
                }
            }

            // Set default encounter type and class - only if valid
            if (encounterTypes?.length > 0) {
                const validEncounterType = defaults.encounterType && encounterTypes.find(t => t.code === defaults.encounterType);
                setValue('type', validEncounterType ? defaults.encounterType : encounterTypes[0]?.code);
            }
            if (encounterClassCodes?.length > 0) {
                setValue('class', encounterClassCodes[0]?.code);
            }
        } else if (encounterAction !== 'updateEncounter' && encounterTypes?.length > 0 && encounterClassCodes?.length > 0 && !dataLoadedRef.current) {
            dataLoadedRef.current = true;
            setValue('type', encounterTypes[0]?.code);
            setValue('class', encounterClassCodes[0]?.code);
            setValue('status', 'arrived');
            if (patientDetails?.doctorId?._id && !selectedProvider) {
                setSelectedProvider(patientDetails.doctorId._id);
            }
        }
    }, [encounterAction, appointmentData]);

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
                // Use the hook's setters
                Object.keys(newPopulatedFields).forEach(key => {
                    populatedFields[key] = newPopulatedFields[key];
                });
                Object.keys(newPopulatedFieldIds).forEach(key => {
                    populatedFieldIds[key] = newPopulatedFieldIds[key];
                });
            }
            if (encounterData?.attachedRecords) {
                setAttachedRecords(encounterData.attachedRecords);
            }
            if (encounterData?.appointmentId?._id) {
                setSelectedAppointment(encounterData.appointmentId._id);
            }
        }
    }, [encounterAction, encounterData, notesFields]);

    // Reset dataLoadedRef when switching encounters or encounter action changes
    useEffect(() => {
        dataLoadedRef.current = false;
    }, [encounterId, encounterAction]);

    // Visible tabs configuration
    const visibleTabs = settingsDataMainItems?.length > 0
        ? settingsDataMainItems?.filter((item) => item?.show === true)
        : DEFAULT_TABS.map((name, index) => ({
            _id: index.toString(),
            name,
        }));

    // File upload handler
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
        if (!selectedFromList || Object.keys(selectedFromList).length === 0) return;

        setTimeout(() => {
            ['Subjective', 'Objective', 'Assessment', 'Plan', 'Care Plan', 'Notes'].forEach((section) => {
                const fieldName = section === 'Care Plan' ? 'CarePlan' : section;
                if (selectedFromList?.[section]) {
                    document.getElementById(fieldName)?.scrollIntoView({ behavior: 'smooth' });
                    const currentValue = getValues(fieldName) || '';
                    const templateText = selectedFromList[section];
                    // Check if template text already exists in current content
                    if (currentValue.includes(templateText)) {
                        ToastHandle('This template content has already been added to this field.', 'danger');
                        return;
                    }
                    const newValue = currentValue ? `${currentValue}\n${templateText}` : templateText;
                    setValue(fieldName, newValue);
                }
            });
            // Clear selectedFromList after applying templates
            setTimeout(() => setSelectedFromList({}), 100);
        }, 0);
    }, [selectedFromList]);

    // Save scroll position before loading state changes
    useEffect(() => {
        const handleScroll = () => {
            scrollPositionRef.current = window.scrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Restore scroll position after loading completes
    useEffect(() => {
        if (!store?.getEncounterNotesFieldsReducer?.loading && scrollPositionRef.current) {
            window.scrollTo(0, scrollPositionRef.current);
        }
    }, [store?.getEncounterNotesFieldsReducer?.loading]);

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

    // Form submission
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
                ['Subjective', 'Objective', 'Assessment', 'Plan', 'Care Plan', 'Notes'].forEach(section => {
                    const value = getValues(section) || '';
                    const fieldName = section === 'Care Plan' ? 'CarePlan' : section;
                    const actualValue = getValues(fieldName) || '';
                    const fieldData = {
                        type: section,
                        content: {
                            type: inputType === 'text-editor' ? 'html' : 'text',
                            value: actualValue
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
            } else if (name === 'Consent Forms') {
                // Handle Consent Forms specially - get data from NoteFormFields component
                const consentFormsData = window.getSelectedConsentForms?.() || [];
                const fieldData = {
                    type: name,
                    content: {
                        type: 'text',
                        value: ''
                    },
                    populatedData: consentFormsData
                };
                fieldsData.push(fieldData);
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
            },
            ...(selectedAppointment && { appointmentId: selectedAppointment })
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
            dispatch(createEncounterAction({ key: encryptMessage(payload) }));
        }
    };

    return (
        <div className='px-0 mt-1 row border h-100 mx-1'>
            <Col className={`px-0 ${isCollapsed ? 'd-none' : ''}`} sm={4}>
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
                        {leftTab === 'Summary' && <EncounterSummaryV2 setScrollToAccordion={setScrollToAccordion} populatedFields={populatedFields} />}
                        {leftTab === 'Templates' && <EncounterTemplates selectedFromList={selectedFromList} setSelectedFromList={setSelectedFromList} setScrollToAccordion={setScrollToAccordion} getValues={getValues} />}
                        {leftTab === 'Past Encounters' && <PastEncounters encounterTabs={encounterTabs} setEncounterTabs={setEncounterTabs} setActiveTab={setActiveTab} setExpanded={setExpanded} />}
                    </Col>
                </Row>
            </Col>

            <Col className='px-0 border-start pb-2' sm={isCollapsed ? 12 : 8}>
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
                                        {errors.type && (<div className="text-danger small mt-0">{errors.type.message}</div>)}
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
                                        {errors.class && (<div className="text-danger small mt-0">{errors.class.message}</div>)}
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
                                                    zIndex: 9999,
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
                                        {errors.startDate && (<div className="text-danger small mt-0">{errors.startDate.message}</div>)}
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
                                                if (action === 'input-change' && value.length > 0) {
                                                    dispatch(getDoctorsAction({ status: true, search: value, page: 1, limit: 50 }));
                                                }
                                            }}
                                            filterOption={null}
                                            menuPortalTarget={document.body}
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
                                                    zIndex: 9999,
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
                                            value={appointmentOptions?.find(option => option?.value === selectedAppointment) ||
                                                (selectedAppointment && appointmentData?._id === selectedAppointment ? {
                                                    value: appointmentData?._id,
                                                    label: `${appointmentData?.appointmentType?.text || appointmentData?.appointmentType?.coding?.[0]?.display || 'Appointment'} - ${new Date(appointmentData?.start).toLocaleDateString()} - ${appointmentData?.status}`
                                                } : null)}
                                            onChange={(selectedValue) => {
                                                setSelectedAppointment(selectedValue?.value);
                                                setAppointmentError(false);
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
                                                    zIndex: 9999,
                                                }),
                                            }}
                                        />
                                        {appointmentError && (<div className="text-danger small mt-0">{`This field is required`}</div>)}
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
                                    removePopulatedData={removePopulatedData}
                                    patientDetails={patientDetails}
                                    attachedRecords={attachedRecords}
                                    setAttachedRecords={setAttachedRecords}
                                    handleFileUpload={handleFileUpload}
                                    uploadLoading={uploadLoading}
                                    accordionState={accordionState}
                                    setAccordionState={setAccordionState}
                                    expanded={expanded}
                                    isAccordionOpen={isAccordionOpen}
                                    getValues={getValues}
                                    encounterData={encounterData}
                                    patientVitals={patientVitals}
                                    externalConsentForms={selectedConsentForms}
                                />
                            }
                        </Form>
                    }
                </div>
            </Col>
        </div>
    );
};

export default DateEncountersV2;