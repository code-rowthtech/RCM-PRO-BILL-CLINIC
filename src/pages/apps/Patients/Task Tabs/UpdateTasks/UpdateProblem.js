// Replace with your existing imports
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import {
    getAllCodeAction,
    getPatientAppointmentAction,
    getProblemListAction,
    updateProblemListAction,
} from '../../../../../redux/ProblemList/action';
import { encryptMessage } from '../../../../../cryptoUtils';
import { clinicalStatus } from '../../../../../utils/DataSets/Allergy/clinicalStatus';
import SuggestionOffcanvas from '../../UpdatePatient/SuggestionOffcanvas';
import ReactQuill from 'react-quill';
import { createSuggestionAction } from '../../../../../redux/suggestions/action';
import Spinner from '../../../../../constants/Spinner';

const UpdateProblem = ({ onCancel, problem }) => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const {
        register,
        handleSubmit,
        control,
        setValue,
        getValues,
        formState: { errors },
    } = useForm();

    // STATE VARIABLES
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // CONSTANT VARIABLES
    const patientId = searchParams.get('id');
    const allCodeICDs = store?.getALLCodesReducer?.data?.codes || [];
    const appointments = store?.getPatientAppointmentReducer?.data?.appointments || [];
    const updateProblemListResponse = store?.updateProblemListReducer?.data?.status;
    const formattedOptions = allCodeICDs.map((code) => ({
        value: code.value,
        label: `${code.title} - ${code.codeType}`,
        system: 'http://hl7.org/fhir/condition-code',
        display: code.title,
    }));

    // USEEFFECTS
    useEffect(() => {
        if (updateProblemListResponse === 200) {
            onCancel();
            const data = {
                patientId: patientId,
            };
            dispatch(getProblemListAction(data));
        }
    }, [updateProblemListResponse]);

    useEffect(() => {
        const currentPatientId = store?.getPatientAppointmentReducer?.data?.patientId;
        const currentAppointments = store?.getPatientAppointmentReducer?.data?.appointments;

        if (currentPatientId !== patientId || !currentAppointments) {
            dispatch(getPatientAppointmentAction({ patientId }));
        }
    }, [dispatch, patientId, store?.getPatientAppointmentReducer?.data]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            dispatch(getAllCodeAction({ search: searchQuery }));
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [dispatch, searchQuery]);

    useEffect(() => {
        if (selectedProblem) {
            setValue('icdCode', selectedProblem.value);
        }
    }, [selectedProblem, setValue]);

    useEffect(() => {
        if (problem) {
            const selected = {
                value: problem?.code?.coding?.[0]?.code,
                label: problem?.code?.coding?.[0]?.display,
                display: problem?.code?.coding?.[0]?.display,
                system: 'http://hl7.org/fhir/condition-code',
            };
            setSelectedProblem(selected); // if you need it
            setValue('problem', selected); // 👈 this is critical
            setValue('icdCode', problem?.code?.coding?.[0]?.code);
            setValue('status', problem?.clinicalStatus?.coding?.[0]?.code);
            setValue('appointment', problem?.appointment);
            setValue('datetimeDiagnosis', problem?.onsetDateTime?.split('T')[0]);
            setValue('note', problem?.note?.[0]?.text);
        }
    }, [problem, appointments, setValue]);

    // FUNCTIONALITY FUNCTIONS
    const handleEditorFocus = () => {
        dispatch(createSuggestionAction({ module: 'problem' }));
        setShowSuggestions(true);
    };

    const handleSuggestionSelect = (suggestionText) => {
        const current = getValues('note'); // from useFormContext or pass as prop
        setValue('note', `${current}<p>${suggestionText}</p>`);
    };

    const onSubmit = (data) => {
        const selected = data.problem;
        const selectedStatus = clinicalStatus.find((item) => item?.code === data?.status);
        const payload = {
            id: problem?._id,
            subject: patientId,
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
            problem: data.problem,
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
            onsetDateTime: data.datetimeDiagnosis,
            ...(data?.note
                ? {
                    note: [
                        {
                            text: data.note,
                            time: '',
                            authorReference: {
                                reference: '',
                                type: '',
                                identifier: {
                                    use: '',
                                    system: '',
                                    value: '',
                                },
                                display: '',
                            },
                        },
                    ],
                }
                : {}),
        };
        dispatch(updateProblemListAction({ key: encryptMessage(payload) }));
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
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
                                    value={field.value}
                                    classNamePrefix="select"
                                    options={formattedOptions}
                                    onChange={(selected) => {
                                        field.onChange(selected);
                                        setSelectedProblem(selected);
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

                <Col sm={6}>
                    <Form.Group>
                        <Form.Label>ICD 10 Code</Form.Label>
                        <Form.Control type="text" readOnly {...register('icdCode')} />
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group className="mb-1">
                        <Form.Label>Status</Form.Label>
                        <Form.Select {...register('status', { required: 'Status is required' })}>
                            <option value="" hidden>
                                Select Clinical Status
                            </option>
                            {clinicalStatus?.map((status) => (
                                <option key={status.code} value={status.code}>
                                    {status.display}
                                </option>
                            ))}
                        </Form.Select>
                        {errors.status && <Form.Text className="text-danger">{errors.status.message}</Form.Text>}
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group>
                        <Form.Label>Appointment</Form.Label>
                        <Form.Select {...register('appointment')}>
                            <option value="">Select Appointment</option>
                            {appointments?.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : 'N/A'}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group>
                        <Form.Label>Date Diagnosis</Form.Label>
                        <Form.Control type="date" {...register('datetimeDiagnosis')} />
                    </Form.Group>
                </Col>
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

                <Col sm={12} className="d-flex justify-content-end gap-2 mt-3">
                    <Button
                        type="submit"
                        className="custom-buttons"
                        disabled={store?.updateProblemListReducer?.loading}
                        style={{ width: '65px' }}>
                        {store?.updateProblemListReducer?.loading ? (
                            <Spinner className="spinner-border-sm" color="white" />
                        ) : (
                            `Update`
                        )}
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default UpdateProblem;
