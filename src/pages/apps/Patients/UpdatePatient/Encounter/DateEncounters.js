import { useEffect, useState } from 'react';
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

const DateEncounters = ({ isCollapsed, searchNoteType, setSearchNoteType, removeEncounterTab, encounterAction, encounterId }) => {

    const [leftTab, setLeftTab] = useState('Summary');
    const [selectedFromList, setSelectedFromList] = useState({})
    const store = useSelector((state) => state);
    const { handleSubmit, register, setValue, formState: { errors }, getValues, reset } = useForm();
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [initialLoading, setInitialLoading] = useState(true);

    // Get data from store
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const providerOptions = doctorDetails?.map((data) => ({
        label: data?.name?.[0]?.text, value: data?._id
    }))
    const settingsDataMainItems = store?.getEncounterSettingsReducer?.data?.data?.items;
    const createEncounterData = store?.createEncounterReducer;
    // const encounterData=
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

    // Handle successful encounter creation or update
    useEffect(() => {
        if (createEncounterData?.data?.status === 201) {
            dispatch(getEncounterAction({ patientId: id }));
            reset();
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

    useEffect(() => {
        if (encounterAction === 'updateEncounter') {
            dispatch(getEncounterByIdAction({ encounterId: encounterId }))
        }
    }, [encounterAction])
    // Set default note type and populate form for update
    useEffect(() => {
        if (!noteType && defaultNoteTypeOption) {
            setNoteType(defaultNoteTypeOption.value);
            dispatch(getEncounterNotesFieldsAction({ noteId: defaultNoteTypeOption.value }))
        }

        // If this is an update operation, populate the form with existing data
        if (encounterAction === 'updateEncounter' && encounterData) {
            // Set provider
            if (encounterData?.providerId) {
                setSelectedProvider(encounterData.providerId);
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
    }, [noteType, defaultNoteTypeOption, encounterAction, encounterData, setValue]);

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
    const [providerError, setProviderError] = useState(false);
    const onSubmit = (data) => {
        const encounterTypeSelected = encounterTypes?.find((e) => e?.code === data?.type)
        const encounterClassSelected = encounterClassCodes?.find((e) => e?.code === data?.class)
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

    return (
        <div className='px-0 mt-1 row border mx-1 h-100'>
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
                        {leftTab === 'Past Encounters' && <PastEncounters />}
                        {leftTab === 'PMH' && <>PMH</>}
                    </Col>
                </Row>
            </Col>

            {/* Main Content Column */}
            <Col className='px-0 border-start pb-2 h-100' sm={isCollapsed ? 12 : 8}>
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
                                                className='border-primary'>
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
                                                    <option value={data} className='text-capitalize' key={index}>{data}</option>
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
                                            filterOption={null} // Important for server-side search
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
                            />
                            <div className="row">
                                <div className="col-12 d-flex justify-content-end py-2">
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