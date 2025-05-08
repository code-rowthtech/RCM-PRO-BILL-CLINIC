import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Row, Form, Button, Card, ListGroup } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import { createMedicalHistoryAction, getMedicalHistoryAction } from '../../../../../redux/actions';
import { encryptMessage } from '../../../../../cryptoUtils';
import { useSearchParams } from 'react-router-dom';
import { loggedInUser } from '../../../../../helpers/api/loggedInUser';
import 'react-quill/dist/quill.snow.css';
import Spinner from '../../../../../constants/Spinner';
import { createSuggestionAction } from '../../../../../redux/suggestions/action';
import SuggestionOffcanvas from '../SuggestionOffcanvas';
import Select from 'react-select';
import { getAllCodeAction } from '../../../../../redux/ProblemList/action';

const MedicalHistory = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const allCodeICDs = store?.getALLCodesReducer?.data?.codes || [];
    const createSuccess = store?.createMedicalHistoryReducer?.data?.status;
    const medicalHistory = store?.getMedicalHistoryReducer?.data?.medicalHistory;
    console.log(medicalHistory, 'MEDICAL');
    const isLoading = store?.getTobaccooReducer?.loading;
    const [showSuggestions, setShowSuggestions] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        getValues,
        control,
        setValue,
    } = useForm();
    useEffect(() => {
        dispatch(getMedicalHistoryAction({ patientId: patientId }));
    }, [dispatch, patientId]);
    useEffect(() => {
        if (createSuccess === 201) {
            dispatch(getMedicalHistoryAction({ patientId: patientId }));
            reset();
        }
    }, [createSuccess, dispatch, patientId, reset]);

    const onSubmit = (data) => {
        const selected = data.problem;

        const payload = {
            clinicId: loggedInUser?._id,
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
            effectivePeriod: {
                start: data.startDate,
                end: data.endDate,
            },
            note: [
                {
                    text: data.note,
                    time: new Date().toISOString(),
                },
            ],
            subject: patientId,
        };

        dispatch(createMedicalHistoryAction({ key: encryptMessage(payload) }));
        console.log(payload, 'medical data');
    };

    const handleEditorFocus = () => {
        dispatch(createSuggestionAction({ module: 'medicalHistory' }));
        setShowSuggestions(true);
    };
    const handleSuggestionSelect = (suggestionText) => {
        // Append suggestion to existing note
        const current = getValues('note'); // from useFormContext or pass as prop
        setValue('note', `${current}<p>${suggestionText}</p>`);
    };
    // const handleUserTyping = (content) => {};
    // Fetch dynamic ICD codes
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            dispatch(getAllCodeAction({ search: searchQuery }));
        }, 300); // 300ms debounce

        return () => clearTimeout(delayDebounce);
    }, [dispatch, searchQuery]);
    const formattedOptions = allCodeICDs.map((code) => ({
        value: code.value,
        label: `${code.title} - ${code.codeType}`,
        system: 'http://hl7.org/fhir/condition-code',
        display: code.title,
    }));
    return (
        <Row
            className="mt-0 g-0 pt-0 px-1 h-100 scroll-container"
            style={{ height: 'calc(100vh - 100px)', overflowY: 'scroll' }}>
            <Col md={6} className="d-flex flex-column border-end  pt-0 mt-0 pe-1 ">
                <div className=" h-100">
                    <Card.Body className="d-flex flex-column pt-0 px-2 pb-2 mt-0">
                        <Card.Title className="border-bottom pb-2 pt-0 mb-1">
                            <h5 className="fw-semibold mb-0">Add Medical History</h5>
                        </Card.Title>

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div
                                className="scroll-container mb-3 px-2"
                                style={{ maxHeight: 'calc(100vh - 56vh)', overflowY: 'auto' }}>
                                <Row className="g-3">
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
                                            {errors.problem && (
                                                <Form.Text className="text-danger">{errors.problem.message}</Form.Text>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="">
                                        <Form.Group controlId="startDate">
                                            <Form.Label className="fw-medium mb-0">Start Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                {...register('startDate')}
                                                required
                                                className="form-control-sm"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mt-0">
                                        <Form.Group controlId="endDate">
                                            <Form.Label className="fw-medium mb-0">End Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                {...register('endDate')}
                                                required
                                                className="form-control-sm"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12}>
                                        <Form.Group controlId="notes">
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
                                                        style={{ height: '200px', backgroundColor: 'white' }}
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
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                            <div className="d-flex justify-content-end pe mt-2">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isLoading}
                                    className="px-4 py-1 custom-buttons">
                                    Add Record
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </div>
            </Col>

            {/* History Side */}
            <Col md={6} className="d-flex flex-column pt-0 mt-0 ps-1">
                <Card className="h-100 shadow-sm rounded-3">
                    <Card.Body className="d-flex flex-column py-0">
                        <Card.Title className="border-bottom pb-2 mb-3">
                            <h5 className="fw-semibold mb-0">Medical History</h5>
                        </Card.Title>

                        {isLoading && !medicalHistory?.length ? (
                            <div className="text-center py-4">
                                <Spinner />
                            </div>
                        ) : medicalHistory?.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                <i className="bi bi-journal-x fs-1"></i>
                                <p className="mt-2 mb-0">No Medical History found</p>
                            </div>
                        ) : (
                            <div className="scroll-container" style={{ overflowY: 'auto', height: '50vh' }}>
                                <ListGroup variant="flush">
                                    {medicalHistory?.map((item, index) => (
                                        <ListGroup.Item
                                            key={index}
                                            className="px-3 py-3 border-bottom bg-light bg-opacity-50 rounded-2 mb-2">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div>
                                                    <strong className="fw-semibold text-dark">
                                                        {item?.code?.coding?.[0]?.display || '—'}
                                                    </strong>
                                                </div>
                                                <div>
                                                    <div className="d-flex justify-content-start text-muted small mb-1">
                                                        <div className="me-1">
                                                            <i className="bi bi-calendar-event me-1"></i>
                                                            <span>
                                                                Start:{' '}
                                                                {item?.effectivePeriod?.start
                                                                    ? new Date(
                                                                        item?.effectivePeriod.start
                                                                    ).toLocaleDateString('en-GB')
                                                                    : '—'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <i className="bi bi-calendar-check me-1"></i>
                                                            <span>
                                                                End:{' '}
                                                                {item?.effectivePeriod?.end
                                                                    ? new Date(
                                                                        item?.effectivePeriod.end
                                                                    ).toLocaleDateString('en-GB')
                                                                    : '—'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {item.note?.[0]?.text && (
                                                <div className="mt-2 small text-secondary">
                                                    <div
                                                        className="ql-editor p-0"
                                                        dangerouslySetInnerHTML={{ __html: item.note[0].text }}
                                                        style={{ fontSize: '0.875rem' }}
                                                    />
                                                </div>
                                            )}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default MedicalHistory;
