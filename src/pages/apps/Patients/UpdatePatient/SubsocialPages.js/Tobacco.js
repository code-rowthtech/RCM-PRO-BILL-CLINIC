import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Row, Form, Button, Card, ListGroup } from 'react-bootstrap';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ReactQuill from 'react-quill';

const Tobacco = () => {
    const { register, handleSubmit, reset, control } = useForm();
    const [tobaccoList, setTobaccoList] = useState([]);

    const onSubmit = (data) => {
        setTobaccoList((prev) => [...prev, data]);
        reset(); // clear form after submit
    };

    return (
        <Row className="mt-2">
            {/* Form Side */}
            <Col md={6}>
                <Card>
                    <Card.Body className='px-1 py-0'>
                        <h5>Add Tobacco Use</h5>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group className="mb-1">
                                <Form.Label>Current Tobacco Use</Form.Label>
                                <Form.Select {...register('currentUse')} required>
                                    <option value="">Select</option>
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
                            <Form.Group className="mb-1">
                                <Form.Label>Effective Date</Form.Label>
                                <Form.Control type="date" {...register('effectiveDate')} required />
                            </Form.Group>
                            <Form.Group className="mb-1">
                                <Form.Label>Notes</Form.Label>
                                <Controller
                                    name="notes"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value } }) => (
                                        <ReactQuill
                                            value={value}
                                            onChange={onChange}
                                            theme="snow"
                                            placeholder="Enter notes here..."
                                        />
                                    )}
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-end align-items-center mb-1">
                                <Button type="submit" className="custom-buttons">
                                    Add
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>

            {/* Display Side */}
            <Col md={6}>
                <Card>
                    <Card.Body className='px-1 py-1'>
                        <h5>Tobacco History</h5>
                        {tobaccoList.length === 0 ? (
                            <p>No records added yet.</p>
                        ) : (
                            <ListGroup>
                                {tobaccoList.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <strong>Use:</strong> {item.currentUse} <br />
                                        <strong>Effective Date:</strong> {item.effectiveDate} <br />
                                        <strong>Notes:</strong>
                                        <div dangerouslySetInnerHTML={{ __html: item.notes || 'N/A' }} />
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Tobacco;
