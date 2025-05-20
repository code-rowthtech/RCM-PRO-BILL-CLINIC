import React, { useState } from 'react';
import { Col, Button, Row, Form, Table } from 'react-bootstrap';
import EncounterSummary from './EncounterSummary';
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { getEncounterNotesFieldsAction } from '../../../../../redux/actions';
import { NOTE_TYPE_OPTIONS } from '../../../../../utils/DataSets/commonData2';
import EncounterTemplates from './EncounterTemplates';

const DateEncounters = ({ isCollapsed, searchNoteType, setSearchNoteType }) => {
    const [leftTab, setLeftTab] = useState('Summary');
    const store = useSelector((state) => state);
    const dispatch = useDispatch()
    const settingsDataMainItems = store?.getEncounterSettingsReducer?.data?.data?.items;
    const notesFields = store?.getEncounterNotesFieldsReducer?.data?.data?.displaySettings?.mainPanel;
    const notesTypeOptions = store?.getEncounterNotesTypeReducer?.data?.data?.map((data) => ({
        label: data?.title, value: data?._id
    }));
    const [noteType, setNoteType] = useState(null);
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


    const NoteFormFields = ({ excludedFields = [], fieldConfig = {} }) => {
        // Merge all fields from all categories into one array
        const getAllFields = () => {
            return Object.values(NOTE_TYPE_OPTIONS).flat();
        };

        // Get fields to display (filter out excluded)
        const getFieldsToRender = () => {
            return getAllFields().filter(field => !excludedFields.includes(field));
        };

        // Field component mapper
        const renderField = (fieldName) => {
            const config = fieldConfig[fieldName] || {};
            const fieldType = config.type || 'textarea'; // default to textarea

            switch (fieldType) {
                case 'textarea':
                    return (
                        <Form.Group className="mb-3" key={fieldName}>
                            <Form.Label>{fieldName}</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={config.rows || 3}
                                placeholder={config.placeholder || ''}
                            />
                        </Form.Group>
                    );

                case 'select':
                    return (
                        <Form.Group className="mb-3" key={fieldName}>
                            <Form.Label>{fieldName}</Form.Label>
                            <Form.Select>
                                {config.options?.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    );

                case 'table':
                    return (
                        <div className="mb-3" key={fieldName}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5>{fieldName}</h5>
                                {config.actions && (
                                    <div>
                                        {config.actions.map(action => (
                                            <Button
                                                variant="link"
                                                size="sm"
                                                key={action.label}
                                                onClick={action.handler}
                                            >
                                                {action.label}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Table
                                responsive
                                className="table-centered table-nowrap mb-0  rounded">
                                <thead>
                                    <tr>
                                        {config.columns?.map(col => (
                                            <th className='text-white' key={col}>{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={config?.columns?.length} className='text-center'>
                                            No Data Found
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    );

                case 'complex':
                    // Handle complex field types like SOAP notes
                    if (fieldName === 'Notes (SOAP)') {
                        return (
                            <div className="mb-3" key={fieldName}>
                                <h5>{fieldName}</h5>
                                {['Subjective', 'Objective', 'Assessment', 'Plan'].map(section => (
                                    <Form.Group className="mb-2" key={section}>
                                        <Form.Label>{section}</Form.Label>
                                        <Form.Control as="textarea" rows={2} />
                                    </Form.Group>
                                ))}
                            </div>
                        );
                    }
                    return null;

                default:
                    return (
                        <Form.Group className="mb-3" key={fieldName}>
                            <Form.Label>{fieldName}</Form.Label>
                            <Form.Control type="text" />
                        </Form.Group>
                    );
            }
        };

        return (
            <Row className="g-2 px-2 mt-1 scroll-container" style={{ height: '57.5vh' }}>
                {getFieldsToRender().map(field => renderField(field))}
            </Row>
        );
    };

    // Example usage with configuration:
    const fieldConfig = {
        'Reason for Visit': {
            type: 'textarea',
            rows: 2,
            placeholder: 'Enter chief complaint'
        },
        'Prescriptions (Medications)': {
            type: 'table',
            columns: ['Medication', 'Dosage', 'Frequency', 'Instructions'],
            actions: [
                { label: 'Add', handler: () => console.log('Add medication') },
                { label: 'Print', handler: () => console.log('Print medications') }
            ]
        },
        'Notes (SOAP)': {
            type: 'complex'
        },
        'Pain Assessment (e.g. scale 1–10)': {
            type: 'select',
            options: [
                { value: '0', label: '0 - No pain' },
                { value: '1-3', label: '1-3 - Mild pain' },
                // ... more options
            ]
        }
    };


    return (
        <div className='px-0 mt-1 row border  mx-1 h-100' >
            {/* Collapsible Left Column */}
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
                        {leftTab === 'Templates' && <EncounterTemplates />}
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
                                    options={notesTypeOptions} // Use the formatted array
                                    isSearchable
                                    isLoading={store?.getEncounterNotesTypeReducer?.loading}
                                    className="basic-single"
                                    classNamePrefix="select"
                                    placeholder="&nbsp; Select "
                                    value={
                                        notesTypeOptions?.find(
                                            (option) => option?.value === noteType
                                        ) || null
                                    }
                                    onChange={handleNotesTypeChange}
                                    inputValue={searchNoteType}
                                    onInputChange={(value) => setSearchNoteType(value)} // Keep it in sync
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

                    {/* Secondary Header Row */}
                    {/* <Row className="g-2 bg-light p-1 " >
                     
                    </Row> */}
                    <NoteFormFields
                        excludedFields={['Consent Forms', 'Provider Notes']}
                        fieldConfig={fieldConfig}
                    />
                </div>
            </Col>
        </div>
    );
};

export default DateEncounters;
