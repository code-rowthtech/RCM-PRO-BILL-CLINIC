import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Row, Form, Button, Card, ListGroup } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import { createTobaccooAction, deleteTobaccooAction, getTobaccooAction, updateTobaccooAction } from '../../../../../redux/actions';
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
    const { register, handleSubmit, reset, getValues, control, setValue } = useForm();
    const [toEdit, setToEdit] = useState(null);
    const [toDelete, setToDelete] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const deleteSuccess = store?.deleteTobaccooReducer?.data?.status
    const updateSuccess = store?.updateTobaccooReducer
    useEffect(() => {
        if (toEdit) {
            setValue('tobaccoUse', toEdit?.tobaccoUse)
            setValue('effectiveDateTime', toEdit?.effectiveDateTime ? new Date(toEdit?.effectiveDateTime).toISOString().split("T")[0] : '');
            setValue('note', toEdit?.note?.[0]?.text || "<ul><li></li></ul>"); // fallback to default if empty
        } else {
            reset();
        }
    }, [toEdit])

    const closeDeleteModal = () => {
        setToDelete(null);
        setDeleteModal(false);
    }
    const deleteHistory = () => {
        dispatch(deleteTobaccooAction({ id: toDelete }))
    }
    useEffect(() => {
        if (deleteSuccess === 200) {
            dispatch(getTobaccooAction({ patientId: patientId }));
            setToDelete(null);
            setDeleteModal(false);
        }
    }, [deleteSuccess])
    useEffect(() => {
        if (createSuccess === 201 || updateSuccess?.data?.status === 200) {
            dispatch(getTobaccooAction({ patientId: patientId }));
            setToEdit(null)
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
        // Append suggestion to existing note
        const current = getValues('note'); // from useFormContext or pass as prop
        setValue('note', `${current}<p>${suggestionText}</p>`);
    };
    // const handleUserTyping = (content) => {};

    return (
        <Row className="mt-0 g-0 pt-0 px-1 h-100 scroll-container" style={{ height: 'calc(100vh - 100px)', overflowY: "scroll" }}>
            <Col md={6} className="d-flex  flex-column border-end  pt-0 mt-0 pe-1 ">
                <div className=" border-danger  h-100">
                    <Card.Body className="d-flex flex-column pt-0 px-2 pb-2 mt-0">
                        <Card.Title className="border-bottom pb-2 pt-0 mb-1">
                            <h5 className="fw-semibold mb-0">Add Tobacco Use</h5>
                        </Card.Title>

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className="scroll-container mb-3 px-2" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group controlId="tobaccoUser">
                                            <Form.Label className="fw-medium mb-0">Current Tobacco Use</Form.Label>
                                            <Form.Select
                                                {...register('tobaccoUse')}
                                                required
                                                className="form-select-sm">
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
                                                <option value="Electronic cigarette user">
                                                    Electronic cigarette user
                                                </option>
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
                                                <option value="Current every day smoker">
                                                    Current every day smoker
                                                </option>
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
                                            <Form.Label className="fw-medium mb-0">Effective Date</Form.Label>
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
                                            <Form.Label className="fw-medium mb-0">
                                                Notes{' '}
                                                <span style={{ cursor: 'pointer' }} title='Notes Suggestions' onClick={handleEditorFocus}>
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
            {/* History Side */}
            <Col md={6} className="d-flex  flex-column pt-0 mt-0  ps-1 ">
                <div className=" border-danger  h-100">
                    <Card.Body className="d-flex flex-column pt-0 px-2 pb-2 mt-0">
                        <Card.Title className="border-bottom pt-0 pb-2 mb-0">
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
                            <div className="scroll-container" style={{ overflowY: 'auto', height: '50vh' }}>
                                <ListGroup variant="flush" className='striped-data'>
                                    {tobaccoHistory?.map((item, index) => (
                                        <ListGroup.Item key={index} className="pb-3 striped-data-item px-0 border-bottom">
                                            <div className="d-flex justify-content-between align-items-start px-1 mb-1">
                                                <strong className="fw-semibold">{item.tobaccoUse || ''}</strong>
                                                <small className="text-muted">
                                                    {item?.note?.[0]?.time
                                                        ? `${new Date(item.note[0].time).toLocaleDateString()} (${new Date(item.note[0].time).toLocaleTimeString()})`
                                                        : 'No date'}
                                                </small>

                                            </div>
                                            {item?.note?.[0]?.text && (
                                                <div className="mt-2">
                                                    <div
                                                        className="ql-editor p-0"
                                                        dangerouslySetInnerHTML={{ __html: item.note[0].text }}
                                                        style={{ fontSize: '0.875rem' }}
                                                    />
                                                </div>
                                            )}
                                            <div className="mt-0 d-flex justify-content-end pe-2 gap-1">
                                                <i className="bi bi-trash-fill text-danger cursor-pointer"
                                                    onClick={() => {
                                                        setToDelete(item?._id)
                                                        setDeleteModal(true)
                                                    }}></i>
                                                {toEdit && toEdit._id === item._id ? (
                                                    <i
                                                        onClick={() => {
                                                            setToEdit(null);
                                                            setToEdit(item);
                                                        }}
                                                        className="bi bi-x-circle-fill cursor-pointer text-danger"></i>
                                                ) : (
                                                    <i
                                                        onClick={() => setToEdit(item)}
                                                        className="bi bi-pencil text-info cursor-pointer"
                                                    ></i>
                                                )}

                                            </div>
                                            <DeletionModal show={deleteModal} onHide={closeDeleteModal} onConfirm={deleteHistory} item='tobaccoo history' isLoading={store?.deleteTobaccooReducer?.loading} />
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>
                        )}
                    </Card.Body>
                </div>
            </Col>
        </Row>
    );
};

export default Tobacco;