import { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Row, Form, Button, Card, ListGroup, Accordion } from 'react-bootstrap';
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
        if (quillRef) {
            const editor = quillRef?.current?.getEditor();

            editor?.on('text-change', (delta, oldDelta, source) => {
                if (source === 'user') {
                    const text = editor?.getText().trim();
                    const words = text ? text.split(/\s+/) : [];
                    const wordCount = words.length;

                    // Check if any word exceeds the maximum length
                    const hasLongWord = words.some(word => word.length > MAX_WORD_LENGTH);

                    if (wordCount > MAX_WORDS || hasLongWord) {
                        // Restore the previous content
                        editor.setContents(oldDelta);

                        // Show warning message based on the violation
                        if (hasLongWord) {
                            // You can replace this with your toast notification system
                            console.warn(`Words cannot be longer than ${MAX_WORD_LENGTH} characters`);
                        } else if (wordCount > MAX_WORDS) {
                            console.warn(`Cannot exceed ${MAX_WORDS} words`);
                        }
                    }
                }
            });
        }
    }, []);
    useEffect(() => {
        if (toEdit) {
            setValue('tobaccoUse', toEdit?.tobaccoUse);
            setValue(
                'effectiveDateTime',
                toEdit?.effectiveDateTime ? new Date(toEdit?.effectiveDateTime).toISOString().split('T')[0] : ''
            );
            setValue('note', toEdit?.note?.[0]?.text || '<ul><li></li></ul>'); // fallback to default if empty
        } else {
            reset();
        }
    }, [toEdit]);

    useEffect(() => {
        dispatch(getTobaccooAction({ patientId: patientId }));
    }, [dispatch])
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
        const current = getValues('note'); // from useFormContext or pass as prop
        setValue('note', `${current}<p>${suggestionText}</p>`);
    };
    // const handleUserTyping = (content) => {};
    const handleReset = () => {
        reset();
        setToEdit(null);
        setToDelete(null);
        setDeleteModal(false);
        setShowSuggestions(false);
    };
    return (
        <Row className=" py-0 m-auto">
            {/* Left: Form Section */}
            <Col md={6} className="d-flex flex-column border-end px-0 pe-2 scroll-container">
                <Card.Body className="p-0 pt-2">
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
                            <Col md={6} className='mb-0'>
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
                            <Col md={6} className='mb-0'>
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
                                                const plainText = content.replace(/<[^>]*>/g, '').trim();
                                                const words = plainText.split(/\s+/).filter(Boolean);
                                                const wordCount = words.length;
                                                const longestWord = words.reduce((max, word) =>
                                                    word.length > max.length ? word : max,
                                                    '');
                                                // const isLongWord = longestWord.length > MAX_WORD_LENGTH;

                                                return (
                                                    <div>
                                                        <div>{`${wordCount} / ${MAX_WORDS} words`}</div>
                                                        {/* {isLongWord && (
                                                        <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                                                            ({MAX_WORD_LENGTH}+ chars)
                                                        </div>
                                                    )} */}

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
                                                style={{ height: '35vh', backgroundColor: 'white' }}
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

                        <div className="d-flex justify-content-end mt-0">
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
                        <Accordion alwaysOpen flush>
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
                                                    // Prevent accordion from toggling
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

                                    <Accordion.Body className="pt-0 p-0 ">
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
                                item="tobacco history"
                                isLoading={store?.deleteTobaccooReducer?.loading}
                            />
                        </Accordion>
                    )}
                </Card.Body>
            </Col>
        </Row>
    );
};

export default Tobacco;
