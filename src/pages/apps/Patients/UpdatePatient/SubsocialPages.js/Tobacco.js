import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Row, Form, Button, Card, ListGroup } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import { createTobaccooAction, getTobaccooAction } from '../../../../../redux/actions';
import { encryptMessage } from '../../../../../cryptoUtils';
import { useSearchParams } from 'react-router-dom';
import { loggedInUser } from '../../../../../helpers/api/loggedInUser';
import 'react-quill/dist/quill.snow.css';
import Spinner from '../../../../../constants/Spinner';
import { createSuggestionAction } from '../../../../../redux/suggestions/action';
import zIndex from '@mui/material/styles/zIndex';
import SuggestionOffcanvas from '../SuggestionOffcanvas';
// import './Tobacco.css'; // Create this CSS file for custom styles

const Tobacco = () => {
    const dispatch = useDispatch();
    // const quillRef = useRef(null);
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);
    const createSuccess = store?.createTobaccooReducer?.data?.status;
    const tobaccoHistory = store?.getTobaccooReducer?.data?.tobaccoHistory;
    const isLoading = store?.getTobaccooReducer?.loading;
    const suggestions = store?.createSuggestionsReducer?.data?.data;
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    // const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const { register, handleSubmit, reset, getValues, control, setValue } = useForm();

    useEffect(() => {
        dispatch(getTobaccooAction({ patientId: patientId }));
    }, [dispatch, patientId]);
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (quillRef.current && !quillRef.current.contains(event.target)) {
    //             setIsFocused(false);
    //         }
    //     };

    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, []);

    useEffect(() => {
        if (createSuccess === 201) {
            dispatch(getTobaccooAction({ patientId: patientId }));
            reset();
        }
    }, [createSuccess, dispatch, patientId, reset]);

    const onSubmit = (data) => {
        data.subject = patientId;
        data.note = [
            {
                text: data.note,
                time: new Date().toISOString(),
            },
        ];
        data.clinicId = loggedInUser?._id;
        dispatch(createTobaccooAction({ key: encryptMessage(data) }));
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

    // const TobaccoSkeleton = () => {
    //     const skeletonItems = Array.from({ length: 3 });

    //     return (
    //         <ListGroup variant="flush">
    //             {skeletonItems.map((_, idx) => (
    //                 <ListGroup.Item key={idx} className="pb-3 px-0 border-bottom">
    //                     <div className="skeleton-line w-50 mb-2"></div>
    //                     <div className="skeleton-line w-75 mb-1"></div>
    //                     <div className="skeleton-line w-100"></div>
    //                 </ListGroup.Item>
    //             ))}
    //         </ListGroup>
    //     );
    // };

    return (
        <Row className="mt-0 g-0">
            {/* Form Side */}
            <Col md={6} className="pe-0 border-end tobaccooCardContainer">
                <Card className="shadow-sm tobaccooCard">
                    <Card.Body className="mt-0 px-1 py-1">
                        <Card.Title className="border-bottom pb-2 pt-0 mb-1">
                            <h5 className="fw-semibold mb-0">Add Tobacco Use</h5>
                        </Card.Title>

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className="scroll-container mb-3" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
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
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                            <div className="d-flex justify-content-end mt-2">
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
                </Card>
            </Col>

            {/* History Side */}
            <Col md={6} className="ps-0 tobaccooCardContainer">
                <Card className="shadow-sm tobaccooCard">
                    <Card.Body className="mt-0 px-1 py-1">
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
                                <ListGroup variant="flush">
                                    {tobaccoHistory?.map((item, index) => (
                                        <ListGroup.Item key={index} className="pb-3 px-0 border-bottom">
                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                <strong className="fw-semibold">{item.tobaccoUse || ''}</strong>
                                                <small className="text-muted">
                                                    {item?.effectiveDateTime
                                                        ? new Date(item?.effectiveDateTime).toLocaleDateString()
                                                        : 'No date'}
                                                </small>
                                            </div>
                                            {item.note?.[0]?.text && (
                                                <div className="mt-2">
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

export default Tobacco;
