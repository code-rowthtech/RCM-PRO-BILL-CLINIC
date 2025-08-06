import { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
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
import AppointmentForm from '../../Appointments/Tabs/AppointmentForm';
import { IoMdClose } from 'react-icons/io';
import { getAppointmentsAction } from '../../../../redux/actions';
import { loggedInUser } from '../../../../helpers/api/loggedInUser';
import ToastHandle from '../../../../helpers/ToastMessage';
import useQuillWordLimit from '../../../../helpers/quillWordLimit';

const MAX_WORDS = 1000;
const WAX_WORD_LENGTH = 45;
const AddProblem = ({ onCancel }) => {
    const dispatch = useDispatch();
    const quillRef = useRef();
    const [searchParams] = useSearchParams();
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

    const patientId = searchParams.get('id');
    const [searchQuery, setSearchQuery] = useState('');

    const [submissionType, setSubmissionType] = useState(null);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);

    const store = useSelector((state) => state);
    const createAppointmentResponse = store?.createAppointmentReducer?.data?.status;
    const addProblemStatus = store?.createProblemListReducer?.data?.status;
    const allCodeICDs = store?.getALLCodesReducer?.data?.codes || [];
    const appointments = store?.getPatientAppointmentReducer?.data?.appointments || [];


    useEffect(() => {
        if (createAppointmentResponse === 201) {
            dispatch(
                getAppointmentsAction({
                    clinicId: loggedInUser?.clinicId,
                    status: '',
                    doctorId: '',
                    limit: '',
                    skip: '',
                    monthYear: '',
                })
            );
            setShowAppointmentModal(false); // Closing the modal after creating appointment
        }
    }, [createAppointmentResponse]);

    // Fetch dynamic ICD codes
    useEffect(() => {
        dispatch(getAllCodeAction({ search: searchQuery }));
    }, [dispatch, searchQuery]);

    // Fetch dynamic appointments
    useEffect(() => {
        const currentPatientId = store?.getPatientAppointmentReducer?.data?.patientId;
        const currentAppointments = store?.getPatientAppointmentReducer?.data?.appointments;

        if (currentPatientId !== patientId || !currentAppointments) {
            dispatch(getPatientAppointmentAction({ patientId }));
        }
    }, [dispatch, patientId, store?.getPatientAppointmentReducer?.data]);

    useEffect(() => {
        if (selectedProblem) {
            setValue('icdCode', selectedProblem.value || '');
        } else {
            setValue('icdCode', '');
        }
    }, [selectedProblem, setValue]);

    const closeAppointmentModal = () => {
        setShowAppointmentModal(false);
    }

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
            subject: patientId,
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
            ...(data.appointment && { appointment: data.appointment }),
            ...(data.diagnosisDate && { onsetDateTime: data.diagnosisDate }),
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
        dispatch(createProblemListAction(payload));
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

    // react quill word limit

    const handleLimitExceed = ({ type, message }) => {
        ToastHandle(message, 'danger');
    };

    useQuillWordLimit({
        quillRef,
        maxWords: MAX_WORDS,
        maxWordLength: WAX_WORD_LENGTH,
        onLimitExceed: handleLimitExceed,
        setValue,
        fieldName: 'note',
    });

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col sm={6}>
                    <Form.Group className="mb-1">
                        <Form.Label className="mb-0">Problem <span className='text-danger'>*</span></Form.Label>
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

                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">ICD 10 Code</Form.Label>
                        <Form.Control type="text" placeholder="Enter ICD 10 Code" {...register('icdCode')} readOnly />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-1">
                        <Form.Label htmlFor="status" className="mb-0">
                            Status <span className='text-danger'>*</span>
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
                        {errors.status && (
                            <Form.Text className="text-danger">{errors.status.message}</Form.Text>
                        )}
                    </Form.Group>
                </Col>

                {/* Appointment - dynamically loaded */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Appointment <i
                            onClick={() => setShowAppointmentModal(true)}
                            className="bi bi-plus-circle text-black cursor-pointer"></i></Form.Label>
                        <Form.Select {...register('appointment')}>
                            <option value="">Select Appointment</option>
                            {appointments?.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item?.date ? new Date(item?.date).toISOString().split('T')[0] : 'N/A'}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Modal centered show={showAppointmentModal} size="xl" onHide={closeAppointmentModal}>
                        <Modal.Body>
                            <Row className="border-bottom mb-1 pb-2">
                                <Col sm={11} className="text-center">
                                    <h4>Create New Appointment</h4>
                                </Col>
                                <Col sm={1}>
                                    <IoMdClose className="fs-4 cursor-pointer" onClick={closeAppointmentModal} />
                                </Col>
                            </Row>
                            <AppointmentForm
                            // selectedSlot={selectedSlot}
                            // appointmentId={selectedEvent?.event_id}
                            // calendarView={calendarView}
                            />
                        </Modal.Body>
                    </Modal>
                </Col>

                {/* Diagnosis Date */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Date Diagnosis</Form.Label>
                        <Form.Control type="date" {...register('diagnosisDate')} />
                    </Form.Group>
                </Col>

                {/* Note */}
                <Col xs={12}>
                    <Form.Group controlId="note">
                        <Form.Label className="fw-medium mb-1 d-flex justify-content-between align-items-center">
                            <div>
                                Notes{' '}
                                <span
                                    style={{ cursor: 'pointer' }}
                                    title="Notes Suggestions"
                                    onClick={handleEditorFocus}>
                                    ✨
                                </span>
                            </div>
                            <small className="text-muted">
                                {(() => {
                                    const content = watch('note') || '';
                                    const plainText = quillRef?.current?.getEditor()?.getText()?.trim();
                                    const words = plainText?.split(/\s+/)?.filter(Boolean);
                                    const wordCount = words?.length;
                                    return (
                                        <div>
                                            <div>{`${wordCount} / ${MAX_WORDS} words`}</div>
                                        </div>
                                    );
                                })()}
                            </small>
                        </Form.Label>

                        <Controller
                            name="note"
                            control={control}
                            defaultValue="<ul><li></li></ul>"
                            render={({ field: { onChange, value } }) => (
                                <ReactQuill
                                    ref={quillRef}
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
                            'Save & Exit'
                        )}
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default AddProblem;
