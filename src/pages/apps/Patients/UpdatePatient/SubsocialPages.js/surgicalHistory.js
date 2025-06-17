import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Row, Form, Button, Card, ListGroup, Accordion } from 'react-bootstrap';
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
const WAX_WORD_LENGTH = 45;
const SurgicalHistory = () => {
    const dispatch = useDispatch();
    const quillRef = useRef(null);

    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);
    const createSuccess = store?.createSurgicalHistoryReducer?.data?.status;
    const deleteSuccess = store?.deleteSurgicalHistoryReducer?.data?.status;
    const updateSuccess = store?.updateSurgicalHistoryReducer?.data?.status;
    const surgicalHistory = store?.getSurgicalHistoryReducer?.data?.result;
    const icdProcedureCodes = store?.getIcdProcedureReducer?.data?.pcsCodes;
    const [selectedIcdProcedure, setSelectedIcdProcedure] = useState(null);
    const [bodySiteSelected, setBodySiteSelected] = useState(null);
    const [search, setSearch] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);
    const [toDelete, setToDelete] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        getValues,
        control, watch,
        setValue,
        formState: { errors },
    } = useForm();
    const [toEdit, setToEdit] = useState(null);
    const closeDeleteModal = () => {
        setToDelete(null);
        setDeleteModal(false);
    };
    const deleteSurgicalHistory = () => {
        dispatch(deleteSurgicalHistoryAction({ id: toDelete }));
    };


    useEffect(() => {
        if (!surgicalHistory) {
            dispatch(getSurgicalHistoryAction({ patientId: patientId }));
        }
    }, [surgicalHistory, dispatch])

    useEffect(() => {
        if (toEdit) {
            setValue(
                'effectiveDateTime',
                toEdit?.performedDateTime ? new Date(toEdit?.performedDateTime)?.toISOString().split('T')[0] : ''
            );
            setValue('bodySite', toEdit?.bodySite?.[0]?.coding?.[0]?.code);
            setValue('note', toEdit?.note?.[0]?.text || '<ul><li></li></ul>'); // fallback to default if empty
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
        <Row className="py-0 m-auto">
            <Col md={6} className="d-flex  flex-column border-end px-0 pe-2 scroll-container">
                <Card.Body className="pt-2 p-0">
                    {/* <Card.Title className="border-bottom pb-2 pt-0 mb-1">
                            <h5 className="fw-semibold mb-0">Add Surgical History</h5>
                        </Card.Title> */}

                    <Form
                        onSubmit={handleSubmit(onSubmit)}
                        style={{
                            minHeight: 'calc(100vh - 330px)',
                            height: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'end',
                            justifyContent: 'space-between',
                        }}>
                        <Row className="g-3">
                            <Col sm={12}>
                                <Form.Group>
                                    <Form.Label className="fw-medium mb-0">Diagnosis</Form.Label>
                                    <Select
                                        options={procedureOptions} // Use the formatted array
                                        isSearchable
                                        className="basic-single"
                                        classNamePrefix="select"
                                        placeholder="&nbsp; Select "
                                        value={selectedIcdProcedure || null} // Show selected value
                                        onChange={handleIcdProcedure}
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
                            <Col md={6} className="mt-0">
                                <Form.Group controlId="effectiveDateTime">
                                    <Form.Label className="fw-medium mb-0">Date & Time</Form.Label>
                                    <Form.Control
                                        type="date"
                                        {...register('effectiveDateTime', {
                                            required: true,
                                        })}
                                        max={new Date().toISOString().slice(0, 10)}
                                        className="form-control-sm"
                                    />
                                    {errors.effectiveDateTime && (
                                        <span className="text-danger">{errors.effectiveDateTime.message}</span>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col md={6} className="mt-0">
                                <Form.Group>
                                    <Form.Label className="fw-medium mb-0">Body Site</Form.Label>
                                    <Form.Select
                                        {...register('bodySite', {
                                            required: true,
                                        })}
                                        onChange={(e) => {
                                            const selectedCode = e.target.value;
                                            const selectedBodySite = bodySite?.find(
                                                (site) => site?.code === selectedCode
                                            );
                                            setBodySiteSelected(selectedBodySite);
                                        }}>
                                        <option key="" value="" hidden>
                                            Select...
                                        </option>
                                        {bodySite?.map((data) => (
                                            <option key={data?.code} value={data?.code}>
                                                {data?.display}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {errors.bodySite && <span className="text-danger">{errors.bodySite.message}</span>}
                                </Form.Group>
                            </Col>

                            <Col xs={12} className="mt-0">
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
                                                style={{ height: '30vh', backgroundColor: 'white' }}
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
                        <div className="d-flex justify-content-end mt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                style={{width:'100px'}}
                                disabled={
                                    store?.createSurgicalHistoryReducer?.loading ||
                                    store?.updateSurgicalHistoryReducer?.loading
                                }
                                className="px-2 py-1 custom-buttons">
                                {store?.createSurgicalHistoryReducer?.loading ||
                                    store?.updateSurgicalHistoryReducer?.loading ? (
                                    <Spinner/>
                                ) : toEdit ? (
                                    'Update'
                                ) : (
                                    'Add Record'
                                )}
                            </Button>
                        </div>
                   
                    </Form>
                </Card.Body>
            </Col>

            <Col md={6} className="d-flex flex-column px-0 scroll-container">
                <Card.Body className="ps-2 py-1 p-0">
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
                        <Accordion alwaysOpen flush>
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
                                                        ? new Date(item.performedDateTime).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })
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
                                onConfirm={deleteSurgicalHistory}
                                item="surgical history"
                                isLoading={store?.deleteTobaccooReducer?.loading}
                            />
                        </Accordion>
                    )}
                </Card.Body>
            </Col>
        </Row>
    );
};

export default SurgicalHistory;
