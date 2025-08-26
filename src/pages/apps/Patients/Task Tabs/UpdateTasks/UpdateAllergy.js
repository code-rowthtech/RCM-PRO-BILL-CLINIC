import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { encryptMessage } from '../../../../../cryptoUtils';
import AsyncSelect from 'react-select/async';
import { allergyType } from '../../../../../utils/DataSets/Allergy/allergyType';
import { clinicalStatus } from '../../../../../utils/DataSets/Allergy/clinicalStatus';
import { category, criticality } from '../../../../../utils/DataSets/Allergy/category';
import { allergyCode } from '../../../../../utils/DataSets/Allergy/allergyCode';
import { useSearchParams } from 'react-router-dom';
import { getAllergiesOfPatientAction, updateAllergyAction } from '../../../../../redux/allergyList/action';
import { getPatientAppointmentAction } from '../../../../../redux/ProblemList/action';
import { createSuggestionAction } from '../../../../../redux/suggestions/action';
import ReactQuill from 'react-quill';
import SuggestionOffcanvas from '../../UpdatePatient/SuggestionOffcanvas';

const UpdateAllergy = ({ onCancel }) => {
    //INITIALIZING
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        reset,
        clearErrors,
        watch,
        getValues,
    } = useForm();

    // Variables
    const patientId = searchParams.get('id');
    const today = new Date().toISOString().split('T')[0];
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const userId = JSON.parse(sessionStorage.getItem('hyper_user'))?.userId;
    const appointments = store?.getPatientAppointmentReducer?.data?.appointments || [];
    const allergyDetails = store?.getAllergyDetailsReducer?.data?.allergy;
    const formattedCodeOption = useMemo(
        () =>
            allergyCode?.map((reason) => ({
                value: reason,
                label: reason.display,
            })),
        []
    );

    const [code, setCode] = useState(null);
    const selectedCodeOption =
        formattedCodeOption.find((option) => option?.value?.code === code?.code) ||
        formattedCodeOption.find((option) => option?.display === code);

    // State Vaariables
    const updateStatus = store?.updateAllergyReducer?.data?.status;
    const [selectMode, setSelectMode] = useState('appointment'); // 'appointment' or 'date'
    const [showSuggestions, setShowSuggestions] = useState(false);

    // USEEFFECTS
    useEffect(() => {
        const currentPatientId = store?.getPatientAppointmentReducer?.data?.patientId;
        const currentAppointments = store?.getPatientAppointmentReducer?.data?.appointments;

        if (currentPatientId !== patientId || !currentAppointments) {
            dispatch(getPatientAppointmentAction({ patientId }));
        }
    }, [dispatch, patientId, store?.getPatientAppointmentReducer?.data]);

    useEffect(() => {
        setValue('allergyType', allergyDetails?.type?.coding[0]?.code);
        setValue('category', allergyDetails?.category?.[0]?.code);
        setValue('criticality', allergyDetails?.criticality?.code);
        setValue('verificationStatus', allergyDetails?.verificationStatus?.coding[0]?.code);
        setValue('reaction', allergyDetails?.reaction[0]?.manifestation[0]?.concept?.coding[0]?.code);
        setValue('status', allergyDetails?.clinicalStatus?.coding[0]?.code);
        setValue('severity', allergyDetails?.reaction[0]?.severity?.coding[0]?.code);
        setValue('note', allergyDetails?.note[0]?.text);
        setCode(allergyDetails?.code?.coding[0]);
        if (allergyDetails?.appointmentId) {
            setSelectMode('appointment');
            const selected = appointments?.find(
                (appt) =>
                    appt?._id === allergyDetails?.appointmentId?._id || appt?.id === allergyDetails?.appointmentId?.id
            );
            if (selected) {
                setValue('appointment', JSON.stringify(selected));
            }
            setValue('appointmentDate', null);
        } else if (allergyDetails?.onset?.onsetDateTime) {
            setSelectMode('date');
            setValue('appointmentDate', new Date(allergyDetails.onset.onsetDateTime).toISOString().split('T')[0]);
            setValue('appointment', null);
        }
    }, [allergyDetails, setValue, appointments]);

    useEffect(() => {
        if (updateStatus === 200) {
            const data = {
                patientId: patientId,
            };
            dispatch(getAllergiesOfPatientAction(data));
            onCancel();
        }
    }, [updateStatus, dispatch, patientId, onCancel]);

    // Functions For Various Operations
    const onSubmit = (data) => {
        const selectedType = allergyType.find((type) => type?.code === data?.allergyType);
        const selectedStatus = clinicalStatus.find((item) => item?.code === data?.status);
        const selectedCategory = category.find((item) => item?.code === data?.category);
        const selectedCriticalityOption = criticality.find((option) => option?.code === data?.criticality);

        const payload = {
            id: allergyDetails?._id,
            patientId: patientId,
            clinicId: clinicId,
            recorderId: userId,
            resourceType: 'AllergyIntolerance',
            type: {
                coding: [
                    {
                        system: selectedType?.system,
                        code: selectedType?.code,
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
        dispatch(updateAllergyAction({ key: encryptMessage(payload) }));
    };

    const handleCodeChange = useCallback((selectedOption) => {
        setCode(selectedOption ? selectedOption.value : '');
    }, []);

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

    const handleEditorFocus = () => {
        dispatch(createSuggestionAction({ module: 'allergy' }));
        setShowSuggestions(true);
    };

    const handleSuggestionSelect = (suggestionText) => {
        const current = getValues('note');
        setValue('note', `${current}<p>${suggestionText}</p>`);
    };
    return (
        <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                {store?.getAllergyDetailsReducer?.loading ? (
                    <div className="text-center my-5 py-5">
                        <Spinner className=" " />
                    </div>
                ) : (
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="category" className="mb-0">
                                    Allergy Category
                                </Form.Label>
                                <Form.Select
                                    {...register('category', { required: 'Allergy Category is required' })}
                                    data-has-value={!!watch('category')}>
                                    <option value="" hidden>
                                        Select Allergy Category
                                    </option>
                                    {category?.map((item) => (
                                        <option key={item?.code} value={item?.code}>
                                            {item?.display}
                                        </option>
                                    ))}
                                </Form.Select>
                                {errors.category && (
                                    <Form.Text className="text-danger">{errors.category.message}</Form.Text>
                                )}
                            </Form.Group>
                        </Col>

                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="criticality" className="mb-0">
                                    Criticality
                                </Form.Label>
                                <Form.Select {...register('criticality', { required: 'Criticality is required' })}>
                                    {criticality?.map((item) => (
                                        <option key={item?.code} value={item?.code}>
                                            {item?.display}
                                        </option>
                                    ))}
                                </Form.Select>
                                {errors.criticality && (
                                    <Form.Text className="text-danger">{errors.criticality.message}</Form.Text>
                                )}
                            </Form.Group>
                        </Col>

                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="mb-0">Select Allergy </Form.Label>
                                <AsyncSelect
                                    loadOptions={loadCodeOptions}
                                    defaultOptions={formattedCodeOption.slice(0, 10)} // Show first 10 options initially
                                    isSearchable
                                    className="basic-single"
                                    classNamePrefix="select"
                                    placeholder="&nbsp; Select"
                                    value={selectedCodeOption}
                                    onChange={handleCodeChange}
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
                            </Form.Group>
                        </Col>

                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="status" className="mb-0">
                                    Clinical Status
                                </Form.Label>
                                <Form.Select
                                    {...register(
                                        'status'
                                        //  { required: 'Clinical Status is required' }
                                    )}>
                                    {clinicalStatus?.map((status) => (
                                        <option key={status?.code} value={status?.code}>
                                            {status?.display}
                                        </option>
                                    ))}
                                </Form.Select>
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
                                                    {item?.date
                                                        ? new Date(item.date).toISOString().split('T')[0]
                                                        : 'N/A'}
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
                                    Notes
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
                        <Col sm={12} className="d-flex justify-content-end gap-1 mt-1">
                            <Button
                                className="custom-buttons"
                                type="submit"
                                style={{ width: '65px' }}
                                disabled={store?.updateAllergyReducer?.loading}>
                                {store?.updateAllergyReducer?.loading ? (
                                    <Spinner animation="border" size="sm" className="text-white" />
                                ) : (
                                    'Update'
                                )}
                            </Button>
                        </Col>
                    </Row>
                )}
            </Form>
        </div>
    );
};

export default UpdateAllergy;
