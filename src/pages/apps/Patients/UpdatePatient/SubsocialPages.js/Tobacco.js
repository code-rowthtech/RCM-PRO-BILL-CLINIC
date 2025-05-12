import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Row, Form, Button, Card, ListGroup } from 'react-bootstrap';
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
            // data.id = toEdit?._id;
            dispatch(updateTobaccooAction({ key: encryptMessage(data), id: toEdit?._id }));
        } else {
            dispatch(createTobaccooAction({ key: encryptMessage(data) }));
        }
    };

    const handleEditorFocus = () => {
        dispatch(createSuggestionAction({ module: 'smoking' }));
        setShowSuggestions(true);
    };
    const handleSuggestionSelect = (suggestionText) => {
        // Append suggestion to existing note
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
        <Row className="px-2 py-0 m-auto">
            {/* Left: Form Section */}
            <Col md={6} className="d-flex flex-column border-end px-0 pe-2">
                <Card.Body className="p-0 pt-2">
                    {/* <Card.Title className="border-bottom">
                        <h6 className="fw-bold">Add Tobacco Use</h6>
                    </Card.Title> */}

                    <Form onSubmit={handleSubmit(onSubmit)} style={{height:'calc(100vh - 100px)',display:'flex',flexDirection:'column',alignItems:'end',justifyContent:'space-between'}}>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group controlId="tobaccoUser">
                                    <Form.Label className="fw-medium mb-1">Current Tobacco Use</Form.Label>
                                    <Form.Select {...register('tobaccoUse')} required className="form-select-sm">
                                        <option value="">Select an option</option>
                                        {/* Keep your options here... */}
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
                            <Col xs={12}>
                                <Form.Group controlId="notes">
                                    <Form.Label className="fw-medium mb-1">
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
                                                style={{ height: '25vh', backgroundColor: 'white' }}
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

                        <div className="d-flex justify-content-end mt-3">
                            <Button type="submit" variant="primary" disabled={isLoading} className="px-4 py-1">
                                {toEdit ? 'Update' : 'Add'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Col>

            {/* Right: History Section */}
            {/* <Col md={6} className="d-flex flex-column px-0">
                <Card.Body className="p-0">
                    <Card.Title className="border-bottom">
                        <h5 className="fw-semibold mb-0">Tobacco History</h5>
                    </Card.Title>

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
                        <ListGroup variant="flush" className="striped-data">
                            {tobaccoHistory.map((item, index) => (
                                <ListGroup.Item key={index} className="py-2 px-2 border-bottom">
                                    <div className="d-flex justify-content-between align-items-start mb-1">
                                        <strong className="fw-semibold">{item.tobaccoUse || ''}</strong>
                                        <div className="d-flex gap-2">
                                            <i
                                                className="bi bi-trash-fill text-danger cursor-pointer"
                                                onClick={() => {
                                                    setToDelete(item?._id);
                                                    setDeleteModal(true);
                                                }}
                                            />
                                            {toEdit && toEdit._id === item._id ? (
                                                <i
                                                    className="bi bi-x-circle-fill cursor-pointer text-danger"
                                                    onClick={handleReset}
                                                />
                                            ) : (
                                                <i
                                                    className="bi bi-pencil text-info cursor-pointer"
                                                    onClick={() => setToEdit(item)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <small className="text-muted">
                                        {item?.note?.[0]?.time
                                            ? `${new Date(item.note[0].time).toLocaleDateString()} (${new Date(
                                                  item.note[0].time
                                              ).toLocaleTimeString()})`
                                            : 'No date'}
                                    </small>
                                    {item?.note?.[0]?.text && (
                                        <div
                                            className="mt-2 scroll-container"
                                            style={{ maxHeight: '6rem', overflowY: 'auto' }}>
                                            <div
                                                className="ql-editor p-0"
                                                dangerouslySetInnerHTML={{ __html: item.note[0].text }}
                                                style={{ fontSize: '0.875rem' }}
                                            />
                                        </div>
                                    )}
                                    <DeletionModal
                                        show={deleteModal}
                                        onHide={closeDeleteModal}
                                        onConfirm={deleteHistory}
                                        item="tobacco history"
                                        isLoading={store?.deleteTobaccooReducer?.loading}
                                    />
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Card.Body>
            </Col> */}
        </Row>
    );
};

export default Tobacco;
