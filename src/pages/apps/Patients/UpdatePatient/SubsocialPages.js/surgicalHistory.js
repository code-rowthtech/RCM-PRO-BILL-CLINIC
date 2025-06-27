import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Row, Form, Button, Card, Accordion } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import {
    createSurgicalHistoryAction,
    deleteSurgicalHistoryAction,
    getICDProcedureAction,
    getSurgicalHistoryAction,
    updateSurgicalHistoryAction,
} from '../../../../../redux/actions';
import { encryptMessage } from '../../../../../cryptoUtils';
import { useSearchParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import Spinner from '../../../../../constants/Spinner';
import { createSuggestionAction } from '../../../../../redux/suggestions/action';
import SuggestionOffcanvas from '../SuggestionOffcanvas';
import Select from 'react-select';
import { bodySite } from '../../../../../utils/DataSets/surgicalHistoryDataset';
import DeletionModal from '../../../../../helpers/deletionModal';
import useQuillWordLimit from '../../../../../helpers/quillWordLimit';
import ToastHandle from '../../../../../helpers/ToastMessage';

const MAX_WORDS = 1000;
const MAX_WORD_LENGTH = 45;

const SurgicalHistory = () => {
    const dispatch = useDispatch();
    const quillRef = useRef(null);
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);

    // State declarations
    const [selectedIcdProcedure, setSelectedIcdProcedure] = useState(null);
    const [bodySiteSelected, setBodySiteSelected] = useState(null);
    const [search, setSearch] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [toEdit, setToEdit] = useState(null);

    // Selectors
    const createSuccess = store?.createSurgicalHistoryReducer?.data?.status;
    const deleteSuccess = store?.deleteSurgicalHistoryReducer?.data?.status;
    const updateSuccess = store?.updateSurgicalHistoryReducer?.data?.status;
    const surgicalHistory = store?.getSurgicalHistoryReducer?.data?.result;
    const icdProcedureCodes = store?.getIcdProcedureReducer?.data?.pcsCodes;

    // Form handling
    const {
        register,
        handleSubmit,
        reset,
        getValues,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (!surgicalHistory) {
            dispatch(getSurgicalHistoryAction({ patientId: patientId }));
        }
    }, [surgicalHistory, dispatch]);

    useEffect(() => {
        if (toEdit) {
            setValue(
                'effectiveDateTime',
                toEdit?.performedDateTime ? new Date(toEdit?.performedDateTime)?.toISOString().split('T')[0] : ''
            );
            setValue('bodySite', toEdit?.bodySite?.[0]?.coding?.[0]?.code);
            setValue('note', toEdit?.note?.[0]?.text || '<ul><li></li></ul>');
            setSelectedIcdProcedure({
                label: toEdit?.code?.coding?.[0]?.display,
                value: toEdit?.code?.coding?.[0]?.code,
            });
            setBodySiteSelected(toEdit?.bodySite?.[0]?.coding?.[0]);
        }
    }, [toEdit]);

    useEffect(() => {
        dispatch(getICDProcedureAction({ search: search }));
    }, [dispatch, search]);

    useEffect(() => {
        if (createSuccess === 201) {
            dispatch(getSurgicalHistoryAction({ patientId: patientId }));
            setSelectedIcdProcedure(null);
            reset();
        }
    }, [createSuccess, dispatch, patientId, reset]);

    useEffect(() => {
        if (deleteSuccess === 200) {
            dispatch(getSurgicalHistoryAction({ patientId: patientId }));
            setSelectedIcdProcedure(null);
            setToDelete(null);
            setDeleteModal(false);
            reset();
        }
    }, [deleteSuccess, patientId]);

    useEffect(() => {
        if (updateSuccess === 200) {
            dispatch(getSurgicalHistoryAction({ patientId: patientId }));
            setSelectedIcdProcedure(null);
            setToEdit(null);
            setBodySiteSelected(null);
            reset();
        }
    }, [updateSuccess, patientId]);

    const onSubmit = (data) => {
        const payload = {
            code: {
                coding: [
                    {
                        system: '',
                        code: selectedIcdProcedure?.value,
                        display: selectedIcdProcedure?.label,
                    },
                ],
                text: selectedIcdProcedure?.label,
            },
            bodySite: {
                coding: [
                    {
                        system: bodySiteSelected?.system,
                        code: bodySiteSelected?.code,
                        display: bodySiteSelected?.display,
                    },
                ],
                text: bodySiteSelected?.display,
            },
            note: [
                {
                    text: data.note,
                    time: new Date().toISOString(),
                },
            ],
            subject: patientId,
            performedDateTime: data?.effectiveDateTime,
        };
        if (toEdit) {
            payload.id = toEdit?._id;
            dispatch(updateSurgicalHistoryAction({ key: encryptMessage(payload) }));
        } else {
            dispatch(createSurgicalHistoryAction({ key: encryptMessage(payload) }));
        }
    };

    const handleEditorFocus = () => {
        dispatch(createSuggestionAction({ module: 'surgical' }));
        setShowSuggestions(true);
    };

    const handleSuggestionSelect = (suggestionText) => {
        const current = getValues('note');
        setValue('note', `${current}<p>${suggestionText}</p>`);
    };

    const procedureOptions = icdProcedureCodes?.map((data) => ({
        label: data?.title,
        value: data?.value,
    }));

    const handleIcdProcedure = (selectedOne) => {
        setSelectedIcdProcedure(selectedOne);
    };

    const handleReset = () => {
        reset();
        setShowSuggestions(false);
        setSelectedIcdProcedure(null);
        setToEdit(null);
    };

    const closeDeleteModal = () => {
        setToDelete(null);
        setDeleteModal(false);
    };

    const deleteSurgicalHistory = () => {
        dispatch(deleteSurgicalHistoryAction({ id: toDelete }));
    };

    const handleLimitExceed = ({ type, message }) => {
        ToastHandle(message, 'danger');
    };

    useQuillWordLimit({
        quillRef,
        maxWords: MAX_WORDS,
        maxWordLength: MAX_WORD_LENGTH,
        onLimitExceed: handleLimitExceed,
        setValue,
        fieldName: 'note',
    });

    return (
        <Row className="g-0 m-0" style={{ height: 'calc(100vh - 150px)' }}>
            {/* Left: Form Section */}
            <Col md={6} className="d-flex flex-column border-end px-0 pe-2" style={{ height: '100%' }}>
                <div className="h-100">
                    <div className="d-flex flex-column px-2 py-0" style={{ overflowY: 'auto' }}>
                        <Form onSubmit={handleSubmit(onSubmit)} className="flex-grow-1 d-flex flex-column">
                            <Row className="">
                                <Col sm={12}>
                                    <Form.Group>
                                        <Form.Label className="fw-medium mb-1">Diagnosis</Form.Label>
                                        <Select
                                            options={procedureOptions}
                                            isSearchable
                                            className="basic-single"
                                            classNamePrefix="select"
                                            placeholder="Select procedure"
                                            value={selectedIcdProcedure || null}
                                            onChange={handleIcdProcedure}
                                            onInputChange={(value) => setSearch(value)}
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    minHeight: '30px',
                                                    border: '0px',
                                                }),
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="effectiveDateTime">
                                        <Form.Label className="fw-medium mb-1">Date & Time</Form.Label>
                                        <Form.Control
                                            type="date"
                                            {...register('effectiveDateTime', { required: true })}
                                            max={new Date().toISOString().slice(0, 10)}
                                            className="form-control-sm"
                                        />
                                        {errors.effectiveDateTime && (
                                            <span className="text-danger">This field is required</span>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="fw-medium mb-1">Body Site</Form.Label>
                                        <Form.Select
                                            {...register('bodySite', { required: true })}
                                            onChange={(e) => {
                                                const selectedCode = e.target.value;
                                                const selectedBodySite = bodySite?.find(
                                                    (site) => site?.code === selectedCode
                                                );
                                                setBodySiteSelected(selectedBodySite);
                                            }}
                                            className="form-select-sm">
                                            <option key="" value="" hidden>
                                                Select...
                                            </option>
                                            {bodySite?.map((data) => (
                                                <option key={data?.code} value={data?.code}>
                                                    {data?.display}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        {errors.bodySite && <span className="text-danger">This field is required</span>}
                                    </Form.Group>
                                </Col>
                                <Col xs={12} className="flex-grow-1 d-flex flex-column">
                                    <Form.Group controlId="notes" className="flex-grow-1 d-flex flex-column">
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
                                        <div className="flex-grow-1 d-flex flex-column">
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
                                        </div>
                                        <SuggestionOffcanvas
                                            show={showSuggestions}
                                            onClose={() => setShowSuggestions(false)}
                                            onSelect={handleSuggestionSelect}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="mt-5 d-flex justify-content-end">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={
                                        store?.createSurgicalHistoryReducer?.loading ||
                                        store?.updateSurgicalHistoryReducer?.loading
                                    }
                                    className="px-3 py-1 custom-buttons">
                                    {store?.createSurgicalHistoryReducer?.loading ||
                                    store?.updateSurgicalHistoryReducer?.loading ? (
                                        <Spinner />
                                    ) : toEdit ? (
                                        'Update'
                                    ) : (
                                        'Add Record'
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </Col>

            {/* Right: History Section */}
            <Col md={6} className="d-flex flex-column px-0" style={{ height: '100%' }}>
                <div className="h-100">
                    <div className="p-0" style={{ overflowY: 'auto' }}>
                        {store?.getSurgicalHistoryReducer?.loading && !surgicalHistory?.length ? (
                            <div className="text-center py-4">
                                <Spinner />
                            </div>
                        ) : surgicalHistory?.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                <i className="bi bi-journal-x fs-1"></i>
                                <p className="mt-2 mb-0">No surgical records found</p>
                            </div>
                        ) : (
                            <Accordion alwaysOpen flush className="h-100">
                                {surgicalHistory?.map((item, index) => (
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
                                                        {item.code?.coding?.[0]?.display || 'No description'}
                                                    </span>
                                                    <small className="text-black" style={{ fontSize: '12px' }}>
                                                        (
                                                        {item?.performedDateTime
                                                            ? new Date(item.performedDateTime).toLocaleDateString(
                                                                  'en-US',
                                                                  {
                                                                      month: 'short',
                                                                      day: 'numeric',
                                                                      year: 'numeric',
                                                                  }
                                                              )
                                                            : 'No date'}
                                                        -{item.bodySite?.[0]?.coding?.[0]?.display || 'No site'})
                                                    </small>
                                                </div>

                                                <div className="d-flex gap-2 px-2" onClick={(e) => e.stopPropagation()}>
                                                    <i
                                                        className="bi bi-trash text-danger cursor-pointer"
                                                        onClick={() => {
                                                            setToDelete(item?._id);
                                                            setDeleteModal(true);
                                                        }}
                                                        title="Delete"
                                                    />
                                                    {toEdit && toEdit._id === item._id ? (
                                                        <i
                                                            className="bi bi-x-lg text-danger cursor-pointer"
                                                            onClick={() => handleReset()}
                                                            title="Cancel"
                                                        />
                                                    ) : (
                                                        <i
                                                            className="bi bi-pencil text-info cursor-pointer"
                                                            onClick={() => setToEdit(item)}
                                                            title="Edit"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </Accordion.Header>

                                        <Accordion.Body className="pt-0 p-0">
                                            {item?.note?.[0]?.text ? (
                                                <div
                                                    className="ql-editor p-1 rounded"
                                                    dangerouslySetInnerHTML={{ __html: item.note[0].text }}
                                                    style={{
                                                        fontSize: '0.875rem',
                                                        maxHeight: '150px',
                                                        overflowY: 'auto',
                                                    }}
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
                                    onConfirm={deleteSurgicalHistory}
                                    item="surgical history"
                                    isLoading={store?.deleteSurgicalHistoryReducer?.loading}
                                />
                            </Accordion>
                        )}
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default SurgicalHistory;
