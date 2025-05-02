import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Col, Row, Form, Button, Card, ListGroup } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import { createTobaccooAction, getTobaccooAction } from '../../../../../redux/actions';
import { encryptMessage } from '../../../../../cryptoUtils';
import { useSearchParams } from 'react-router-dom';
import { loggedInUser } from '../../../../../helpers/api/loggedInUser';
import 'react-quill/dist/quill.snow.css';
import Spinner from '../../../../../constants/Spinner'
// import './Tobacco.css'; // Create this CSS file for custom styles

const Tobacco = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);
    const createSuccess = store?.createTobaccooReducer?.data?.status;
    const tobaccooHistory = store?.getTobaccooReducer?.data?.data || [];
    const isLoading = store?.getTobaccooReducer?.loading;

    const { register, handleSubmit, reset, control } = useForm();

    useEffect(() => {
        dispatch(getTobaccooAction({ patientId: patientId }));
    }, [dispatch, patientId]);

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
                time: new Date().toISOString()
            }
        ];
        data.clinicId = loggedInUser?._id;
        dispatch(createTobaccooAction({ key: encryptMessage(data) }));
    };

    return (
        <Row className="mt-0 g-0">
            {/* Form Side */}
            <Col md={6} className='pe-0 border-end tobaccooCardContainer'>
                <Card className='shadow-sm tobaccooCard'>
                    <Card.Body>
                        <Card.Title className="border-bottom pb-2 mb-3">
                            <h5 className="fw-semibold mb-0">Add Tobacco Use</h5>
                        </Card.Title>


                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className="scroll-container mb-3" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group controlId="tobaccoUser">
                                            <Form.Label className="fw-medium mb-0">Current Tobacco Use</Form.Label>
                                            <Form.Select
                                                {...register('tobaccooUser')}
                                                required
                                                className="form-select-sm"
                                            >
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
                                        <Form.Group controlId="effectiveDate">
                                            <Form.Label className="fw-medium mb-0">Effective Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                {...register('effectiveDate')}
                                                required
                                                className="form-control-sm"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group controlId="notes">
                                            <Form.Label className="fw-medium mb-0">Notes</Form.Label>
                                            <Controller
                                                name="note"
                                                control={control}
                                                defaultValue="<ul><li></li></ul>"
                                                render={({ field: { onChange, value } }) => (
                                                    <ReactQuill
                                                        value={value}
                                                        onChange={onChange}
                                                        theme="snow"
                                                        placeholder="Enter detailed notes here..."
                                                        className=""
                                                        style={{ height: '200px', backgroundColor: 'white' }}
                                                        modules={{
                                                            toolbar: [
                                                                [{ 'header': [1, 2, false] }],
                                                                ['bold', 'italic', 'underline', 'strike'],
                                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                                ['link', 'image'],
                                                                ['clean']
                                                            ]
                                                        }}
                                                    />
                                                )}
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
                                    className="px-4 py-1 custom-buttons"
                                >
                                    {isLoading ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                            <span className="ms-2">Adding...</span>
                                        </>
                                    ) : 'Add Record'}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>

            {/* History Side */}
            <Col md={6} className='ps-0 tobaccooCardContainer'>
                <Card className='shadow-sm tobaccooCard'>
                    <Card.Body>
                        <Card.Title className="border-bottom pb-2 mb-3">
                            <h5 className="fw-semibold mb-0">Tobacco History</h5>
                        </Card.Title>

                        {isLoading && !tobaccooHistory.length ? (
                            <div className="text-center py-4">
                                <Spinner />
                            </div>
                        ) : tobaccooHistory.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                <i className="bi bi-journal-x fs-1"></i>
                                <p className="mt-2 mb-0">No tobacco use records found</p>
                            </div>
                        ) : (
                            <div className="history-container" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                <ListGroup variant="flush">
                                    {tobaccooHistory.map((item, index) => (
                                        <ListGroup.Item key={index} className="py-3 px-0 border-bottom">
                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                <strong className="text-primary">{item.tobaccooUser || 'Unknown user'}</strong>
                                                <small className="text-muted">
                                                    {item.effectiveDate ? new Date(item.effectiveDate).toLocaleDateString() : 'No date'}
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