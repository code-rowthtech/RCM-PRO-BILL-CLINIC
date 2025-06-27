import { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Row, Form, Button, Card, Accordion } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import {
    createTobaccooAction,
    deleteTobaccooAction,
    getTobaccooAction,
    updateTobaccooAction,
} from '../../../../../redux/actions';
import { encryptMessage } from '../../../../../cryptoUtils';
import { useSearchParams } from 'react-router-dom';
import { loggedInUser } from '../../../../../helpers/api/loggedInUser';
import 'react-quill/dist/quill.snow.css';
import Spinner from '../../../../../constants/Spinner';
import { createSuggestionAction } from '../../../../../redux/suggestions/action';
import SuggestionOffcanvas from '../SuggestionOffcanvas';
import DeletionModal from '../../../../../helpers/deletionModal';
import ToastHandle from '../../../../../helpers/ToastMessage';
import useQuillWordLimit from '../../../../../helpers/quillWordLimit';

const Tobacco = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);
    const createSuccess = store?.createTobaccooReducer?.data?.status;
    const tobaccoHistory = store?.getTobaccooReducer?.data?.tobaccoHistory;
    const isLoading = store?.getTobaccooReducer?.loading;
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { register, handleSubmit, reset, getValues, control, setValue, watch } = useForm();
    const [toEdit, setToEdit] = useState(null);
    const [toDelete, setToDelete] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const deleteSuccess = store?.deleteTobaccooReducer?.data?.status;
    const updateSuccess = store?.updateTobaccooReducer;
    const quillRef = useRef(null);
    const MAX_WORDS = 1000;
    const MAX_WORD_LENGTH = 45;

    useEffect(() => {
        if (toEdit) {
            setValue('tobaccoUse', toEdit?.tobaccoUse);
            setValue(
                'effectiveDateTime',
                toEdit?.effectiveDateTime ? new Date(toEdit?.effectiveDateTime).toISOString().split('T')[0] : ''
            );
            setValue('note', toEdit?.note?.[0]?.text || '<ul><li></li></ul>');
        } else {
            reset();
        }
    }, [toEdit]);

    useEffect(() => {
        dispatch(getTobaccooAction({ patientId: patientId }));
    }, [dispatch]);

    const closeDeleteModal = () => {
        setToDelete(null);
        setDeleteModal(false);
    };

    const deleteHistory = () => {
        dispatch(deleteTobaccooAction({ id: toDelete }));
    };

    useEffect(() => {
        if (deleteSuccess === 200) {
            dispatch(getTobaccooAction({ patientId: patientId }));
            setToDelete(null);
            setDeleteModal(false);
        }
    }, [deleteSuccess]);

    useEffect(() => {
        if (createSuccess === 201 || updateSuccess?.data?.status === 200) {
            dispatch(getTobaccooAction({ patientId: patientId }));
            setToEdit(null);
            reset();
        }
    }, [createSuccess, updateSuccess]);

    const onSubmit = (data) => {
        data.subject = patientId;
        data.note = [
            {
                text: data.note,
                time: new Date().toISOString(),
            },
        ];
        data.clinicId = loggedInUser?._id;
        if (toEdit) {
            dispatch(updateTobaccooAction({ key: encryptMessage(data), id: toEdit?._id }))
        } else {
            dispatch(createTobaccooAction({ key: encryptMessage(data) }));
        }
    };

    const handleEditorFocus = () => {
        dispatch(createSuggestionAction({ module: 'smoking' }));
        setShowSuggestions(true);
    };

    const handleSuggestionSelect = (suggestionText) => {
        const current = getValues('note');
        setValue('note', `${current}<p>${suggestionText}</p>`);
    };

    const handleReset = () => {
        reset();
        setToEdit(null);
        setToDelete(null);
        setDeleteModal(false);
        setShowSuggestions(false);
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
                                <Col md={6}>
                                    <Form.Group controlId="tobaccoUser">
                                        <Form.Label className="fw-medium mb-1">Current Tobacco Use</Form.Label>
                                        <Form.Select {...register('tobaccoUse')} required className="form-select-sm">
                                            <option value="">Select an option</option>
                                            <option value="Very heavy cigarette smoker (40+ cigs/day)">
                                                Very heavy cigarette smoker (40+ cigs/day)
                                            </option>
                                            <option value="Cigar smoker">Cigar smoker</option>
                                            <option value="Pipe smoker">Pipe smoker</option>
                                            <option value="Chews tobacco">Chews tobacco</option>
                                            <option value="Chews products containing tobacco">
                                                Chews products containing tobacco
                                            </option>
                                            <option value="Snuff user">Snuff user</option>
                                            <option value="Electronic cigarette user">Electronic cigarette user</option>
                                            <option value="Heavy tobacco smoker">Heavy tobacco smoker</option>
                                            <option value="Light tobacco smoker">Light tobacco smoker</option>
                                            <option value="Current some day smoker">Current some day smoker</option>
                                            <option value="Non-Smoker">Non-Smoker</option>
                                            <option value="Ex-Smoker">Ex-Smoker</option>
                                            <option value="Ex-user of moist powdered tobacco">
                                                Ex-user of moist powdered tobacco
                                            </option>
                                            <option value="Smoker">Smoker</option>
                                            <option value="Unknown if ever smoked">Unknown if ever smoked</option>
                                            <option value="Current non smoker but past smoking history unknown">
                                                Current non smoker but past smoking history unknown
                                            </option>
                                            <option value="Current every day smoker">Current every day smoker</option>
                                            <option value="Light cigarette smoker (1-9 cigs/day)">
                                                Light cigarette smoker (1-9 cigs/day)
                                            </option>
                                            <option value="Moderate cigarette smoker (10-19 cigs/day)">
                                                Moderate cigarette smoker (10-19 cigs/day)
                                            </option>
                                            <option value="Heavy cigarette smoker (20-39 cigs/day)">
                                                Heavy cigarette smoker (20-39 cigs/day)
                                            </option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="effectiveDateTime">
                                        <Form.Label className="fw-medium mb-1">Effective Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            {...register('effectiveDateTime')}
                                            required
                                            className="form-control-sm"
                                            max={new Date().toISOString().slice(0, 10)}
                                        />
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
                                                            <div>{`${wordCount || 0} / ${MAX_WORDS} words`}</div>
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

                            <div className="mt-5 d-flex align-itmes-center justify-content-end ">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isLoading}
                                    className="px-3 py-1 custom-buttons">
                                    {toEdit ? 'Update' : 'Add Record'}
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
                        {isLoading && !tobaccoHistory?.length ? (
                            <div className="text-center py-4">
                                <Spinner />
                            </div>
                        ) : tobaccoHistory?.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                <i className="bi bi-journal-x fs-1"></i>
                                <p className="mt-2 mb-0">No tobacco use records found</p>
                            </div>
                        ) : (
                            <Accordion alwaysOpen flush className="h-100">
                                {tobaccoHistory?.map((item, index) => (
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
                                                        {item.tobaccoUse || 'No description'}
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
                                                    <i
                                                        className="bi bi-trash-fill text-danger cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setToDelete(item?._id);
                                                            setDeleteModal(true);
                                                        }}
                                                        title="Delete"
                                                    />
                                                </div>
                                            </div>
                                        </Accordion.Header>

                                        <Accordion.Body className="pt-0 p-0">
                                            {item?.note?.[0]?.text ? (
                                                <div
                                                    className="ql-editor p-1 rounded"
                                                    dangerouslySetInnerHTML={{ __html: item.note[0].text }}
                                                    style={{ fontSize: '0.875rem', maxHeight: '150px', overflowY: 'auto' }}
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
                                    item="tobacco history"
                                    isLoading={store?.deleteTobaccooReducer?.loading}
                                />
                            </Accordion>
                        )}
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default Tobacco;