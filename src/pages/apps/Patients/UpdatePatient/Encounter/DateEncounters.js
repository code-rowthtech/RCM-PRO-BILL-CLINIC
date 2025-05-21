import React, { useEffect, useState } from 'react';
import { Col, Button, Row, Form, Table } from 'react-bootstrap';
import EncounterSummary from './EncounterSummary';
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { getEncounterNotesFieldsAction } from '../../../../../redux/actions';
import { NOTE_TYPE_OPTIONS } from '../../../../../utils/DataSets/commonData2';
import EncounterTemplates from './EncounterTemplates';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const DateEncounters = ({ isCollapsed, searchNoteType, setSearchNoteType }) => {
    const [leftTab, setLeftTab] = useState('Summary');
    const [selectedFromList, setSelectedFromList] = useState({})
    console.log(selectedFromList, 'selectedFromListselectedFromList')
    const store = useSelector((state) => state);
    const { handleSubmit, register, setValue } = useForm();
    const dispatch = useDispatch()
    const settingsDataMainItems = store?.getEncounterSettingsReducer?.data?.data?.items;
    const notesFields = store?.getEncounterNotesFieldsReducer?.data?.data?.displaySettings?.mainPanel?.[0]?.sections;
    console.log(notesFields, '345tfiujed')
    const notesTypeOptions = store?.getEncounterNotesTypeReducer?.data?.data?.map((data) => ({
        label: data?.title, value: data?._id, isDefault: data?.default

    }));
    const [noteType, setNoteType] = useState(null);

    const defaultNoteTypeOption = notesTypeOptions?.find(opt => opt.isDefault);
    useEffect(() => {
        if (!noteType && defaultNoteTypeOption) {
            setNoteType(defaultNoteTypeOption.value);
            dispatch(getEncounterNotesFieldsAction({ noteId: defaultNoteTypeOption.value }))
        }
    }, [noteType, defaultNoteTypeOption]);

    console.log(defaultNoteTypeOption, 'notesTypeOptions')
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
        console.log('data12324', data)
    }

    return (
        <div className='px-0 mt-1 row border  mx-1 h-100' >
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
                <div className="px-1 h-100" >
                    <Row
                        style={{ height: '16.5vh' }}
                        className="g-2 mt-0 bg-light rounded-top p-1 ">
                        <Col sm={4} className='mt-0'>
                            <Form.Group className='encounterHeaderGroup'>
                                <Form.Label className='mb-0 fw-bold small'>Encounter Type <span className='text-danger'>*</span></Form.Label>
                                <Form.Select className='border-primary'>
                                    <option>185349003 (SNOMED-CT) - Office Visit</option>
                                </Form.Select>
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
                                    placeholder=" Select"
                                    value={notesTypeOptions?.find(option => option?.value === noteType) || null}
                                    onChange={(selected) => {
                                        setNoteType(selected?.value);
                                        handleNotesTypeChange?.(selected); // if this is needed
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
                                <Form.Label className='mb-0 fw-bold small'>Date <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="date"
                                    defaultValue="2025-05-13"
                                    className='border-primary'
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={2} className='mt-0'>
                            <Form.Group className='encounterHeaderGroup'>
                                <Form.Label className='mb-0 fw-bold small'>Age at Encounter</Form.Label>
                                <Form.Control readOnly defaultValue="48 yrs" className='bg-white' />
                            </Form.Group>
                        </Col>
                        <Col sm={2} className='mt-0'>
                            <Form.Group className='encounterHeaderGroup'>
                                <Form.Label className='mb-0 fw-bold small'>Seen By <span className='text-danger'>*</span></Form.Label>
                                <Form.Select className='border-primary'>
                                    <option>Mohit Rawat</option>
                                    <option>Other Provider</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={2} className='mt-0'>
                            <Form.Group className='encounterHeaderGroup'>
                                <Form.Label className='mb-0 fw-bold small'>Facility <span className='text-danger'>*</span></Form.Label>
                                <Form.Select className='border-primary'>
                                    <option>Main Clinic</option>
                                    <option>Satellite Office</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={2} className='mt-0'>
                            <Form.Group className='encounterHeaderGroup'>
                                <Form.Label className='mb-0 fw-bold small'>Status</Form.Label>
                                <Form.Select className='border-primary'>
                                    <option>Signed</option>
                                    <option selected>Unsigned</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={4} className='mt-0'>
                            <Form.Group className='encounterHeaderGroup'>
                                <Form.Label className='mb-0 fw-bold small'>Self-pay Restriction</Form.Label>
                                <Form.Select>
                                    <option>No restriction</option>
                                    <option>Partial restriction</option>
                                    <option>Full restriction</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>


                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <NoteFormFields
                            selectedFromList={selectedFromList}
                            // excludedFields={['Consent Forms', 'Provider Notes']}
                            data={notesFields}
                        />
                        <div className="row">
                            <div className="col-12 text-end">
                                <Button type='Submit' className='custom-buttons'>Save</Button>
                            </div>
                        </div>
                    </Form>

                </div>
            </Col>
        </div>
    );
};

export default DateEncounters;
