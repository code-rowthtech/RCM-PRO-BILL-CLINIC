import React, { useState } from 'react';
import { Col, Row, Form, Button, Card } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';

const Alcohol = () => {
    const { register, handleSubmit, reset, control } = useForm();
    const [entries, setEntries] = useState([]);

    const onSubmit = (data) => {
        setEntries([...entries, data]);
        reset();
    };

    return (
        <Row className="mt-2 scroll-container" style={{ overflowY: 'scroll', overflowX: 'hidden', height:"55vh"}} >
            {/* Left Side - Form */}
            <Col md={6}>
                <Card>
                    <Card.Body className="px-1 py-1">
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Check
                                type="checkbox"
                                label="Patient declined to specify on all questions"
                                {...register('declined')}
                            />

                            <Form.Group className="mb-3 mt-3">
                                <Form.Label>1. How often do you have a drink containing alcohol?</Form.Label>
                                {[
                                    'Never',
                                    'Monthly or less',
                                    '2-4 times a month',
                                    '2-3 times a week',
                                    '4 or more times a week',
                                ].map((option, idx) => (
                                    <Form.Check
                                        key={idx}
                                        type="radio"
                                        label={option}
                                        value={option}
                                        {...register('frequency', { required: true })}
                                        name="frequency"
                                    />
                                ))}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>2. How many standard drinks do you have on a typical day?</Form.Label>
                                {['0', '1 or 2', '3 or 4', '5 or 6', '7 to 9', '10 or more'].map((option, idx) => (
                                    <Form.Check
                                        key={idx}
                                        type="radio"
                                        label={option}
                                        value={option}
                                        {...register('standardDrinks', { required: true })}
                                        name="standardDrinks"
                                    />
                                ))}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>3. How often do you have 6 or more drinks on one occasion?</Form.Label>
                                {[
                                    'Never',
                                    'Less than monthly',
                                    'Monthly or less',
                                    'Weekly',
                                    'Daily or almost daily',
                                ].map((option, idx) => (
                                    <Form.Check
                                        key={idx}
                                        type="radio"
                                        label={option}
                                        value={option}
                                        {...register('bingeFrequency', { required: true })}
                                        name="bingeFrequency"
                                    />
                                ))}
                            </Form.Group>

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
                    <Card key={index} className="">
                        <Card.Body className="px-1 py-1">
                            <p className="mb-1">
                                <strong>Declined:</strong> {entry.declined ? 'Yes' : 'No'}
                            </p>
                            <p className="mb-1">
                                <strong>Drink Frequency:</strong> {entry.frequency}
                            </p>
                            <p className="mb-1">
                                <strong>Standard Drinks/Day:</strong> {entry.standardDrinks}
                            </p>
                            <p className="mb-1">
                                <strong>Binge Frequency:</strong> {entry.bingeFrequency}
                            </p>
                        </Card.Body>
                    </Card>
                ))}
            </Col>
        </Row>
    );
};

export default Alcohol;
