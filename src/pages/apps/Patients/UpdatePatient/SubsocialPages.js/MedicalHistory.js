import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Row, Form, Button, Card, Accordion } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import {
    createMedicalHistoryAction,
    deleteMedicalHistoryAction,
    getMedicalHistoryAction,
    updateMedicalHistoryAction,
} from '../../../../../redux/actions';
import { encryptMessage } from '../../../../../cryptoUtils';
import { useSearchParams } from 'react-router-dom';
import { loggedInUser } from '../../../../../helpers/api/loggedInUser';
import 'react-quill/dist/quill.snow.css';
import Spinner from '../../../../../constants/Spinner';
import { createSuggestionAction } from '../../../../../redux/suggestions/action';
import SuggestionOffcanvas from '../SuggestionOffcanvas';
import Select from 'react-select';
import { getAllCodeAction } from '../../../../../redux/ProblemList/action';
import DeletionModal from '../../../../../helpers/deletionModal';
import useQuillWordLimit from '../../../../../helpers/quillWordLimit';
import ToastHandle from '../../../../../helpers/ToastMessage';

const MAX_WORDS = 1000;
const WAX_WORD_LENGTH = 45;
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
    const deleteResponse = store?.deleteMedicalHistoryReducer?.data?.status;
    const isLoading = store?.getMedicalHistoryReducer?.loading;
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [toEdit, setToEdit] = useState(null);
    const updateResponse = store?.updateMedicalHistoryReducer?.data?.status;
    const quillRef = useRef(null);



    const { register, handleSubmit, reset, getValues, control, setValue, watch } = useForm();

    useEffect(() => {
        dispatch(getMedicalHistoryAction({ patientId: patientId }));
        dispatch(getAllCodeAction({ search: '' }));
    }, [dispatch, patientId]);

    useEffect(() => {
        if (createSuccess === 201 || updateResponse === 200) {
            dispatch(getMedicalHistoryAction({ patientId: patientId }));
            setToEdit(null);
            setSelectedProblem(null);
            reset();
        }
    }, [createSuccess, updateResponse]);

    const deleteHistory = () => {
        dispatch(deleteMedicalHistoryAction({ id: toDelete }));
    };

    useEffect(() => {
        if (deleteResponse === 200) {
            dispatch(getMedicalHistoryAction({ patientId: patientId }));
            setToDelete(null);
            setDeleteModal(false);
        }
    }, [deleteResponse]);

    const closeDeleteModal = () => {
        setToDelete(null);
        setDeleteModal(false);
    };

    useEffect(() => {
        if (toEdit) {
            const conditionCode = toEdit?.code?.coding?.[0];
            const matchedProblem = formattedOptions.find(
                (opt) => opt.value === conditionCode?.code && opt.display === conditionCode?.display
            );
            setSelectedProblem(matchedProblem || null);
            setValue('problem', matchedProblem || null);
            setValue(
                'startDate',
                toEdit?.effectivePeriod?.start
                    ? new Date(toEdit?.effectivePeriod?.start)?.toISOString()?.split('T')[0]
                    : ''
            );
            setValue(
                'endDate',
                toEdit?.effectivePeriod?.end ? new Date(toEdit?.effectivePeriod?.end)?.toISOString()?.split('T')[0] : ''
            );
            setValue('note', toEdit?.note?.[0]?.text || '<ul><li></li></ul>');
        } else {
            reset();
        }
    }, [toEdit]);

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
        if (toEdit) {
            dispatch(updateMedicalHistoryAction({ key: encryptMessage(payload), id: toEdit?._id }));
        } else {
            dispatch(createMedicalHistoryAction({ key: encryptMessage(payload) }));
        }
    };

    const handleEditorFocus = () => {
        dispatch(createSuggestionAction({ module: 'medicalHistory' }));
        setShowSuggestions(true);
    };

    const handleSuggestionSelect = (suggestionText) => {
        const current = getValues('note');
        setValue('note', `${current}<p>${suggestionText}</p>`);
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            dispatch(getAllCodeAction({ search: searchQuery }));
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [dispatch, searchQuery]);

    const formattedOptions = allCodeICDs.map((code) => ({
        value: code.value,
        label: `${code.title} - ${code.codeType}`,
        system: 'http://hl7.org/fhir/condition-code',
        display: code.title,
    }));

    const startDate = watch('startDate');

    const handleReset = () => {
        setToEdit(null);
        setSelectedProblem(null);
        reset();
    };

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
        <Row className="py-0 m-auto">
            {/* Left: Form Section */}
            <Col md={6} className="d-flex flex-column border-end px-0 pe-2 scroll-container">
                <Card.Body className="p-0 pt-2">
                    <Form
                        onSubmit={handleSubmit(onSubmit)}
                        style={{
                            minHeight: 'calc(100vh - 340px)',
                            height: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'end',
                            // justifyContent: 'space-between',
                        }}>
                        <Row className="g-3">
                            <Col xs={12}>
                                <Form.Group controlId="problem">
                                    <Form.Label className="fw-medium mb-1">Medical Problem</Form.Label>
                                    <Controller
                                        name="problem"
                                        control={control}
                                        rules={{ required: 'Problem is required' }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                classNamePrefix="select"
                                                options={formattedOptions}
                                                value={selectedProblem || null}
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
                                                        // minHeight: '30px',
                                                    }),
                                                }}
                                            />
                                        )}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className='mt-0'>
                                <Form.Group controlId="startDate">
                                    <Form.Label className="fw-medium mb-1">Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        {...register('startDate')}
                                        required
                                        max={new Date().toISOString().slice(0, 10)}
                                        className="form-control-sm"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className='mt-0'>
                                <Form.Group controlId="endDate">
                                    <Form.Label className="fw-medium mb-1">End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        {...register('endDate')}
                                        required
                                        className="form-control-sm"
                                        min={startDate || undefined}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} className='mt-0'>
                                <Form.Group controlId="notes">
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
                                                style={{ height: '24vh', backgroundColor: 'white' }}
                                                modules={{
                                                    toolbar: [
                                                        [{ header: [1, 2, false] }],
                                                        ['bold', 'italic', 'underline', 'strike'],
                                                        [{ list: 'ordered' }, { list: 'bullet' }],
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

                        <div className="d-flex justify-content-end mt-5">
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isLoading}
                                className="px-2 py-1 custom-buttons">
                                {toEdit ? 'Update' : 'Add Record'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Col>

            {/* Right: History Section */}
            <Col md={6} className="d-flex flex-column px-0 scroll-container">
                <Card.Body className="ps-2 py-1 p-0">
                    {isLoading && !medicalHistory?.length ? (
                        <div className="text-center py-4">
                            <Spinner />
                        </div>
                    ) : medicalHistory?.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            <i className="bi bi-journal-x fs-1"></i>
                            <p className="mt-2 mb-0">No medical history records found</p>
                        </div>
                    ) : (
                        <Accordion alwaysOpen flush>
                            {medicalHistory?.map((item, index) => (
                                <Accordion.Item eventKey={index.toString()} key={index} className="rounded-1">
                                    <Accordion.Header>
                                        <div
                                            className="d-flex justify-content-between align-items-center w-100"
                                            style={{ marginRight: '-19px' }}>
                                            <div className="d-flex align-items-center gap-2 p-2 pe-0">
                                                <span className="text-black fs-6 tab-font-family fw-semibold">
                                                    {index + 1}.
                                                </span>
                                                <span className="fw-normal fs-6 tab-font-family text-black">
                                                    {item?.code?.coding?.[0]?.display || 'No description'}
                                                </span>
                                                <small className="text-black" style={{ fontSize: '12px' }}>
                                                    (
                                                    {item?.note?.[0]?.time
                                                        ? new Date(item.note[0].time).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })
                                                        : 'No date'}
                                                    -
                                                    {item?.note?.[0]?.time
                                                        ? new Date(item.note[0].time).toLocaleTimeString()
                                                        : 'No time'}
                                                    )
                                                </small>
                                            </div>
                                            {/* Action Icons */}
                                            <div
                                                className="d-flex gap-2 px-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}>
                                                <i
                                                    className="bi bi-trash text-danger cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setToDelete(item?._id);
                                                        setDeleteModal(true);
                                                    }}
                                                    title="Delete"
                                                />
                                                {toEdit && toEdit._id === item._id ? (
                                                    <i
                                                        className="bi bi-x-lg text-danger cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleReset();
                                                        }}
                                                        title="Cancel"
                                                    />
                                                ) : (
                                                    <i
                                                        className="mdi mdi-square-edit-outline cursor-pointer fs-5"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setToEdit(item);
                                                        }}
                                                        title="Edit"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </Accordion.Header>

                                    <Accordion.Body className="pt-0 p-0">
                                        {item?.note?.[0]?.text ? (
                                            <div
                                                className="ql-editor p-1 rounded scroll-container notes-scroll"
                                                dangerouslySetInnerHTML={{ __html: item.note[0].text }}
                                                style={{ fontSize: '0.875rem', overflowY: 'scroll', height: '150px' }}
                                            />
                                        ) : (
                                            <div className="text-muted fst-italic p-2">No notes available</div>
                                        )}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}

                            <DeletionModal
                                show={deleteModal}
                                onHide={closeDeleteModal}
                                onConfirm={deleteHistory}
                                item="medical history"
                                isLoading={store?.deleteMedicalHistoryReducer?.loading}
                            />
                        </Accordion>
                    )}
                </Card.Body>
            </Col>
        </Row>
    );
};

export default MedicalHistory;