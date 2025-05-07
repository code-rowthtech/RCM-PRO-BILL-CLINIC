import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    createProblemListAction,
    getAllCodeAction,
    getPatientAppointmentAction,
    getProblemListAction,
} from '../../../../redux/ProblemList/action';
import { clinicalStatus } from '../../../../utils/DataSets/Allergy/clinicalStatus';
import SuggestionOffcanvas from '../UpdatePatient/SuggestionOffcanvas';
import { createSuggestionAction } from '../../../../redux/suggestions/action';
import ReactQuill from 'react-quill';

const AddProblem = ({ onCancel }) => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const [searchQuery, setSearchQuery] = useState('');
    const store = useSelector((state) => state);
    const allCodeICDs = store?.getALLCodesReducer?.data?.codes || [];
    const appointments = store?.getPatientAppointmentReducer?.data || [];
    const [submissionType, setSubmissionType] = useState(null);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const addProblemStatus = store?.createProblemListReducer?.data?.status;

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        getValues,
        setValue,
        watch,
    } = useForm();

    // Fetch dynamic ICD codes
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            dispatch(getAllCodeAction({ search: searchQuery }));
        }, 300); // 300ms debounce

        return () => clearTimeout(delayDebounce);
    }, [dispatch, searchQuery]);

    // Fetch dynamic appointments
    useEffect(() => {
        dispatch(getPatientAppointmentAction({ patientId }));
    }, [dispatch, patientId]);

    // Set ICD code from selected problem
    useEffect(() => {
        if (selectedProblem) {
            setValue('icdCode', selectedProblem.value || '');
        } else {
            setValue('icdCode', '');
        }
    }, [selectedProblem, setValue]);

    const formattedOptions = allCodeICDs.map((code) => ({
        value: code.value,
        label: `${code.title} - ${code.codeType}`,
        system: 'http://hl7.org/fhir/condition-code',
        display: code.title,
    }));

    const onSubmit = (data) => {
        const selected = data.problem;
        const selectedStatus = clinicalStatus.find((item) => item?.code === data?.status);
        const payload = {
            code: {
                coding: [
                    {
                        system: selected?.system,
                        code: selected?.value,
                        display: selected?.display,
                    },
                ],
                text: selected?.display,
            },
            // recorder: '',
            // asserter: '',
            // encounter: '',
            subject: patientId,
            // problem: data.problem,
            // icdVersion: data.icdVersion,
            icdCode: data.icdCode,
            clinicalStatus: {
                coding: [
                    {
                        system: selectedStatus?.system,
                        code: selectedStatus?.code,
                        display: selectedStatus?.display,
                    },
                ],
                text: selectedStatus?.display,
            },
            appointment: data.appointment,
            onsetDateTime: data.diagnosisDate,
            // onsetDate: data.onsetDate,
            note: [
                {
                    authorReference: {
                        reference: '',
                        type: '',
                        display: '',
                    },
                    authorString: ' ',
                    time: '',
                    text: data?.note,
                },
            ],
        };
        console.log('Form Data:', payload);
        dispatch(createProblemListAction(payload)); // Uncomment to dispatch the action
    };

    useEffect(() => {
        if (addProblemStatus === 201) {
            if (submissionType === 'saveAndNext') {
                const data = {
                    patientId: patientId,
                };
                dispatch(getProblemListAction(data));
                onCancel();
            } else if (submissionType === 'saveAndReset') {
                reset({
                    problem: null,
                    note: '',
                    status: '',
                    appointment: '',
                    diagnosisDate: '', // Resetting other fields like diagnosisDate
                });
                setSelectedProblem(null);
            }
        }
    }, [addProblemStatus, submissionType]);
    const handleEditorFocus = () => {
        dispatch(createSuggestionAction({ module: 'problem' }));
        setShowSuggestions(true);
    };
    const handleSuggestionSelect = (suggestionText) => {
        // Append suggestion to existing note
        const current = getValues('note'); // from useFormContext or pass as prop
        setValue('note', `${current}<p>${suggestionText}</p>`);
    };
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                {/* <Col sm={12} className="d-flex justify-content-between">
                    <h4>Add Problem</h4>
                    <Button className="custom-buttons" type="button">
                        Back
                    </Button>
                </Col> */}

                {/* Problem selection with dynamic ICD lookup */}
                <Col sm={6}>
                    <Form.Group className="mb-1">
                        <Form.Label className="mb-0">Problem</Form.Label>
                        <Controller
                            name="problem"
                            control={control}
                            rules={{ required: 'Problem is required' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    classNamePrefix="select"
                                    options={formattedOptions}
                                    onChange={(selected) => {
                                        field.onChange(selected);
                                        setSelectedProblem(selected); // 🔁 update local state
                                    }}
                                    onInputChange={(value, { action }) => {
                                        if (action === 'input-change') {
                                            setSearchQuery(value);
                                        }
                                    }}
                                    placeholder="Search Problem"
                                    isClearable
                                    isSearchable
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
                                        valueContainer: (provided) => ({
                                            ...provided,
                                            padding: '0px 6px',
                                        }),
                                    }}
                                />
                            )}
                        />
                        {errors.problem && <Form.Text className="text-danger">{errors.problem.message}</Form.Text>}
                    </Form.Group>
                </Col>

                {/* ICD Version - fixed to ICD-10 */}
                {/* <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">ICD Version</Form.Label>
                        <Form.Select disabled {...register('icdVersion')} style={{ cursor: 'not-allowed' }}>
                            <option value="ICD-10">ICD-10</option>
                        </Form.Select>
                    </Form.Group>
                </Col> */}

                {/* ICD 10 Code - auto-filled */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">ICD 10 Code</Form.Label>
                        <Form.Control type="text" placeholder="Enter ICD 10 Code" {...register('icdCode')} readOnly />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1">
                        <Form.Label htmlFor="status" className="mb-0">
                            Status
                        </Form.Label>
                        <Form.Select
                            {...register('status', { required: 'Clinical Status is required' })}
                            data-has-value={!!watch('status')}>
                            <option value="" hidden>
                                Select Clinical Status
                            </option>
                            {clinicalStatus?.map((status) => (
                                <option key={status?.code} value={status?.code}>
                                    {status?.display}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Appointment - dynamically loaded */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Appointment</Form.Label>
                        <Form.Select {...register('appointment')}>
                            <option value="">Select Appointment</option>
                            {appointments?.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item?.date ? new Date(item?.date).toISOString().split('T')[0] : 'N/A'}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Diagnosis Date */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Date Diagnosis</Form.Label>
                        <Form.Control type="date" {...register('diagnosisDate')} />
                    </Form.Group>
                </Col>

                {/* Onset Date */}
                {/* <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Datetime Onset</Form.Label>
                        <Form.Control type="date" {...register('onsetDate')} />
                    </Form.Group>
                </Col> */}

                {/* Note */}
                <Col xs={12}>
                    <Form.Group controlId="note">
                        <Form.Label className="fw-medium mb-0">
                            Notes{' '}
                            <span style={{ cursor: 'pointer' }} title="Notes Suggestions" onClick={handleEditorFocus}>
                                ✨
                            </span>
                        </Form.Label>

                        <Controller
                            name="note"
                            control={control}
                            defaultValue="<ul><li></li></ul>"
                            render={({ field: { onChange, value } }) => (
                                <ReactQuill
                                    value={value}
                                    onChange={(content, delta, source) => {
                                        if (source === 'user') {
                                            onChange(content);
                                        }
                                    }}
                                    theme="snow"
                                    placeholder="Enter detailed notes here..."
                                    style={{ backgroundColor: 'white' }}
                                    modules={{
                                        toolbar: [
                                            [{ header: [1, 2, false] }],
                                            ['bold', 'italic', 'underline', 'strike'],
                                            [{ list: 'ordered' }, { list: 'bullet' }],
                                            ['link', 'image'],
                                            ['clean'],
                                        ],
                                    }}
                                />
                            )}
                        />

                        <SuggestionOffcanvas
                            show={showSuggestions}
                            onClose={() => setShowSuggestions(false)}
                            onSelect={handleSuggestionSelect}
                            className="custom-suggestion-offcanvas"
                        />
                    </Form.Group>
                </Col>

                {/* Action Buttons */}
                <Col sm={12} className="d-flex justify-content-end gap-1 mt-3">
                    <Button
                        className="custom-buttons"
                        style={{ width: '150px' }}
                        type="submit"
                        disabled={store?.createProblemListReducer?.loading}
                        onClick={() => setSubmissionType('saveAndReset')}>
                        {store?.createProblemListReducer?.loading && submissionType === 'saveAndReset' ? (
                            <Spinner animation="border" size="sm" className="text-white" />
                        ) : (
                            'Save & Add Another'
                        )}
                    </Button>
                    <Button
                        className="custom-buttons"
                        type="submit"
                        style={{ width: '120px' }}
                        disabled={store?.createProblemListReducer?.loading}
                        onClick={() => setSubmissionType('saveAndNext')}>
                        {store?.createProblemListReducer?.loading && submissionType === 'saveAndNext' ? (
                            <Spinner animation="border" size="sm" className="text-white" />
                        ) : (
                            'Save & Next'
                        )}
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default AddProblem;
