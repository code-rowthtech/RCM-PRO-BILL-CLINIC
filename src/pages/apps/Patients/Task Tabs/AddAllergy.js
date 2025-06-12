import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { encryptMessage } from '../../../../cryptoUtils';
import { clinicalStatus } from '../../../../utils/DataSets/Allergy/clinicalStatus';
import { allergyType } from '../../../../utils/DataSets/Allergy/allergyType';
import { category, criticality } from '../../../../utils/DataSets/Allergy/category';
import { allergyCode } from '../../../../utils/DataSets/Allergy/allergyCode';
import AsyncSelect from 'react-select/async';
import { createAllergyAction, getAllergiesOfPatientAction } from '../../../../redux/allergyList/action';
import { getPatientAppointmentAction } from '../../../../redux/ProblemList/action';
import { createSuggestionAction } from '../../../../redux/suggestions/action';
import ReactQuill from 'react-quill';
import SuggestionOffcanvas from '../UpdatePatient/SuggestionOffcanvas';

const AddAllergy = ({ onCancel }) => {
    const dispatch = useDispatch();
    const quillRef = useRef(null);
    const [searchParams] = useSearchParams();
    const {
        register, handleSubmit, formState: { errors }, setValue, control, reset, watch, getValues
    } = useForm({
        defaultValues: {
            category: 'medication',
        },
    });

    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);
    const appointments = store?.getPatientAppointmentReducer?.data?.appointments;
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const userId = JSON.parse(sessionStorage.getItem('hyper_user'))?.userId;
    const createStatus = store?.createAllergyReducer?.data?.status;

    const [code, setCode] = useState(null);
    const [selectMode, setSelectMode] = useState('appointment'); // 'appointment' or 'date'
    const [submissionType, setSubmissionType] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);



    // Fetch dynamic appointments
    useEffect(() => {
        const currentPatientId = store?.getPatientAppointmentReducer?.data?.patientId;
        const currentAppointments = store?.getPatientAppointmentReducer?.data?.appointments;

        if (currentPatientId !== patientId || !currentAppointments) {
            dispatch(getPatientAppointmentAction({ patientId }));
        }
    }, [dispatch, patientId, store?.getPatientAppointmentReducer?.data]);


    useEffect(() => {
        if (createStatus === 200) {
            if (submissionType === 'saveAndNext') {
                const data = {
                    patientId: patientId,
                    skip: 1,
                };
                dispatch(getAllergiesOfPatientAction(data));
                reset(); // Reset the form fields
                setCode(null); // Reset the code state
                onCancel();
            } else if (submissionType === 'saveAndReset') {
                reset();
                setCode(null);
                setSelectMode('appointment');
            }
        }
    }, [createStatus, patientId, reset, dispatch, onCancel, submissionType]);
    const onSubmit = (data) => {
        const selectedType = allergyType.find((type) => type?.code === data?.allergyType);
        const selectedStatus = clinicalStatus.find((item) => item?.code === data?.status);
        const selectedCategory = category.find((item) => item?.code === data?.category);
        const selectedCriticalityOption = criticality.find((option) => option?.code === data?.criticality);

        const payload = {
            patientId: patientId,
            clinicId: clinicId,
            recorderId: userId,
            resourceType: 'AllergyIntolerance',
            type: {
                coding: [
                    {
                        system: selectedType?.system,
                        code: 'Allergy',
                        display: selectedType?.display,
                    },
                ],
                text: selectedType?.display,
            },
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
            category: [
                {
                    system: selectedCategory?.system,
                    code: selectedCategory?.code,
                    display: selectedCategory?.display,
                },
            ],
            criticality: {
                system: selectedCriticalityOption?.system,
                code: selectedCriticalityOption?.code,
                display: selectedCriticalityOption?.display,
            },
            code: {
                coding: code,
                text: code?.display, // use display text
            },
            note: [
                {
                    text: data?.note,
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
        };
        if (selectMode === 'appointment' && data.appointment) {
            let appData = JSON.parse(data.appointment);
            payload.appointmentId = appData?._id;
            payload.onset = {
                onsetDateTime: appData?.date, // optionally use actual date
            };
        } else if (selectMode === 'date' && data.appointmentDate) {
            payload.onset = {
                onsetDateTime: data.appointmentDate,
            };
        }
        dispatch(createAllergyAction({ key: encryptMessage(payload) }));
    };
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (quillRef.current && !quillRef.current.contains(event.target)) {
    //             setIsFocused(false);
    //         }
    //     };

    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, []);
    const formattedCodeOption = useMemo(
        () =>
            allergyCode?.map((reason) => ({
                value: reason,
                label: reason.display,
            })),
        []
    );

    const loadCodeOptions = useCallback(
        (inputValue, callback) => {
            if (!inputValue) {
                callback(formattedCodeOption.slice(0, 10));
                return;
            }

            const filteredOptions = formattedCodeOption.filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );

            callback(filteredOptions.slice(0, 20));
        },
        [formattedCodeOption]
    );

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD


    const handleEditorFocus = () => {
        dispatch(createSuggestionAction({ module: 'allergy' }));
        setShowSuggestions(true);
    };
    const handleSuggestionSelect = (suggestionText) => {
        // Append suggestion to existing note
        const current = getValues('note'); // from useFormContext or pass as prop
        setValue('note', `${current}<p>${suggestionText}</p>`);
    };
    return (
        <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="">
                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label htmlFor="category" className="mb-0">
                                Allergy Category
                            </Form.Label>
                            <Form.Select
                                {...register('category', { required: 'Allergy Category is required' })}
                                value={watch('category') || 'medication'}
                                onChange={(e) => setValue('category', e.target.value)}
                            >
                                {category?.map((item) => (
                                    <option key={item?.code} value={item?.code}>
                                        {item?.display}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.category && (
                                <Form.Text className="text-danger fs-6 fs-6">{errors.category.message}</Form.Text>
                            )}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group>
                            <Form.Label className="mb-0">Select Allergy <span className="text-danger">*</span></Form.Label>
                            <Controller
                                name="allergyCode"
                                control={control}
                                rules={{ required: 'Allergy selection is required' }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <AsyncSelect
                                            // ref={selectRef}
                                            loadOptions={loadCodeOptions}
                                            defaultOptions={formattedCodeOption.slice(0, 10)}
                                            isSearchable
                                            className="basic-single"
                                            classNamePrefix="select"
                                            placeholder="Select"
                                            value={
                                                formattedCodeOption.find(option => option.value.code === field.value?.code) || null
                                            }
                                            onChange={option => {
                                                field.onChange(option ? option.value : null);
                                                setCode(option ? option.value : null);
                                            }}
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
                                            }}
                                        />
                                        {fieldState.error && (
                                            <Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
                                        )}
                                    </>
                                )}
                            />
                        </Form.Group>
                    </Col>

                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label htmlFor="criticality" className="mb-0">
                                Criticality
                            </Form.Label>
                            <Form.Select
                                {...register('criticality', { required: 'Criticality is required' })}
                                data-has-value={!!watch('criticality')}>
                                <option value="" hidden>
                                    Select Criticality
                                </option>
                                {criticality?.map((item) => (
                                    <option key={item?.code} value={item?.code}>
                                        {item?.display}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.criticality && (
                                <Form.Text className="text-danger fs-6">{errors.criticality.message}</Form.Text>
                            )}
                        </Form.Group>
                    </Col>

                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label htmlFor="status" className="mb-0">
                                Clinical Status
                            </Form.Label>
                            <Form.Select
                                {...register('status', { required: 'Clinical Status is required' })}
                                data-has-value={!!watch('status')}>
                                {clinicalStatus?.map((status) => (
                                    <option key={status?.code} value={status?.code}>
                                        {status?.display}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.status && (
                                <Form.Text className="text-danger">{errors.status.message}</Form.Text>
                            )}
                        </Form.Group>
                    </Col>

                    <Col sm={6}>
                        <Form.Group>
                            <Form.Label className="mb-0">Select Mode</Form.Label>
                            <div className="d-flex gap-3 mb-0">
                                <Form.Check
                                    type="radio"
                                    label="By Appointment"
                                    name="selectionMode"
                                    value="appointment"
                                    checked={selectMode === 'appointment'}
                                    onChange={() => setSelectMode('appointment')}
                                />
                                <Form.Check
                                    type="radio"
                                    label="By Date"
                                    name="selectionMode"
                                    value="date"
                                    checked={selectMode === 'date'}
                                    onChange={() => setSelectMode('date')}
                                />
                            </div>

                            {selectMode === 'appointment' ? (
                                <>
                                    <Form.Label className="mb-0">Appointment</Form.Label>
                                    <Form.Select {...register('appointment')}>
                                        <option>Select Appointment Date </option>
                                        {appointments?.map((item) => (
                                            <option key={item?._id} value={JSON.stringify(item)}>
                                                {item?.date ? new Date(item.date).toISOString().split('T')[0] : 'N/A'}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </>
                            ) : (
                                <>
                                    <Form.Label className="mb-0">Select Date (till today)</Form.Label>
                                    <Form.Control type="date" max={today} {...register('appointmentDate')} />
                                </>
                            )}
                        </Form.Group>
                    </Col>

                    <Col xs={12}>
                        <Form.Group controlId="note">
                            <Form.Label className="fw-medium mb-0">
                                Notes{' '}
                                <span
                                    style={{ cursor: 'pointer' }}
                                    title="Notes Suggestions"
                                    onClick={handleEditorFocus}>
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
                                                // ['link', 'image'],
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

                    <Col sm={12} className="d-flex justify-content-end gap-1 mt-2">
                        <Button
                            className="custom-buttons"
                            type="submit"
                            onClick={() => setSubmissionType('saveAndReset')}
                            disabled={store?.createAllergyReducer?.loading}
                            style={{ width: '150px' }}>
                            {store?.createAllergyReducer?.loading && submissionType === 'saveAndReset' ? (
                                <Spinner animation="border" size="sm" className="text-white" />
                            ) : (
                                'Save & Add Another'
                            )}
                        </Button>
                        <Button
                            className="custom-buttons"
                            type="submit"
                            onClick={() => setSubmissionType('saveAndNext')}
                            style={{ width: '100px' }}
                            disabled={store?.createAllergyReducer?.loading}>
                            {store?.createAllergyReducer?.loading && submissionType === 'saveAndNext' ? (
                                <Spinner animation="border" size="sm" className="text-white" />
                            ) : (
                                'Save & Exit'
                            )}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default AddAllergy;
