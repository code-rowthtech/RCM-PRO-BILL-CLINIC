import React, { useState } from 'react';
import { Col, Row, Form, Button, Card } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { createSuggestionAction } from '../../../../../redux/suggestions/action';
import SuggestionOffcanvas from '../SuggestionOffcanvas';
import { useDispatch } from 'react-redux';

const Alcohol = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit, reset, control, watch, getValues, setValue } = useForm();
    const [entries, setEntries] = useState([]);
    const watchUseStatus = watch("alcoholUseStatus");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const onSubmit = (data) => {
        setEntries([...entries, data]);
        console.log(data, 'lmoji98huib')
    };

    const handleEditorFocus = () => {
        dispatch(createSuggestionAction({ module: 'drinking' }));
        setShowSuggestions(true);
    };

    const handleSuggestionSelect = (suggestionText) => {
        const current = getValues('note'); // from useFormContext or pass as prop
        setValue('note', `${current}<p>${suggestionText}</p>`);
    };
    return (
        <Row className="mt-2 scroll-container" style={{ overflowY: 'scroll', overflowX: 'hidden', height: "55vh" }}>
            {/* Left Side - Form */}
            <Col md={6}>
                <Card>
                    <Card.Body className="px-1 py-1">
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col sm={12}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Patient declined to specify on all questions"
                                        {...register('declined')}
                                    />
                                </Col>
                                <Col sm={12}>
                                    <Form.Group className="mb-3 mt-3">
                                        <Form.Label className='mb-0'>Alcohol Use Status</Form.Label>
                                        <Form.Select {...register('alcoholUseStatus', { required: true })}>
                                            <option value="">Select status</option>
                                            <option value="Current User">Current User</option>
                                            <option value="Former User">Former User</option>
                                            <option value="Never Used">Never Used</option>
                                            <option value="Unknown">Unknown</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>



                            {watchUseStatus === 'Current User' && (
                                <Row>
                                    <Col sm={6}></Col>
                                    <Form.Group className="mb-1">
                                        <Form.Label className='mb-0'>Alcohol use frequency</Form.Label>
                                        {['Never', 'Monthly or less', '2-4 times a month', '2-3 times a week', '4 or more times a week'].map((option, idx) => (
                                            <Form.Check key={idx} type="radio" label={option} value={option} {...register('frequency')} name="frequency" />
                                        ))}
                                    </Form.Group>

                                    <Col sm={6}>
                                        <Form.Group className="mb-1">
                                            <Form.Label className='mb-0'>Standard drinks per day</Form.Label>
                                            {['0', '1 or 2', '3 or 4', '5 or 6', '7 to 9', '10 or more'].map((option, idx) => (
                                                <Form.Check key={idx} type="radio" label={option} value={option} {...register('standardDrinks')} name="standardDrinks" />
                                            ))}
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="mb-1">
                                            <Form.Label className='mb-0'>Heavy intake frequency</Form.Label>
                                            {['Never', 'Less than monthly', 'Monthly', 'Weekly', 'Daily or almost daily'].map((option, idx) => (
                                                <Form.Check key={idx} type="radio" label={option} value={option} {...register('bingeFrequency')} name="bingeFrequency" />
                                            ))}
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="mb-1">
                                            <Form.Label className='mb-0'>What types of alcohol do you usually consume?</Form.Label>
                                            <Form.Control type="text" {...register('typeOfAlcohol')} placeholder="e.g., Beer, Wine, Spirits" />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-1">
                                            <Form.Label className='mb-0'>Has alcohol impacted daily life or work?</Form.Label>
                                            <Form.Check type="checkbox" label="Yes" {...register('impactOnDailyLife')} />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-1">
                                            <Form.Label className='mb-0'>Do you experience dependence symptoms (e.g., craving, withdrawal)?</Form.Label>
                                            <Form.Check type="checkbox" label="Yes" {...register('hasDependenceSymptoms')} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}

                            {watchUseStatus === 'Former User' && (
                                <>
                                    <Form.Group className="mb-1">
                                        <Form.Label className='mb-0'>Age when you started using alcohol</Form.Label>
                                        <Form.Control type="number" {...register('ageOfFirstUse')} />
                                    </Form.Group>

                                    <Form.Group className="mb-1">
                                        <Form.Label className='mb-0'>Date of last alcohol use</Form.Label>
                                        <Form.Control type="date" {...register('lastUseDate')} />
                                    </Form.Group>

                                    <Form.Group className="mb-1">
                                        <Form.Label className='mb-0'>Reason for stopping alcohol use</Form.Label>
                                        <Form.Control as="textarea" rows={2} {...register('reasonForStopping')} />
                                    </Form.Group>
                                </>
                            )}

                            <Row>
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

                            <div className="d-flex justify-content-end align-items-center">
                                <Button variant="primary" type="submit" className="custom-buttons">
                                    Add Record
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>

            {/* Right Side - Display Data */}
            <Col md={6}>
                {entries.map((entry, index) => (
                    <Card key={index} className="mb-2">
                        <Card.Body className="px-1 py-1">
                            {Object.entries(entry).map(([key, value]) => (
                                <p key={key} className="mb-1">
                                    <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {value?.toString() || 'N/A'}
                                </p>
                            ))}
                        </Card.Body>
                    </Card>
                ))}
            </Col>
        </Row>
    );
};

export default Alcohol;