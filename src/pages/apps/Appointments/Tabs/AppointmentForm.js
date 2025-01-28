import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AppointmentForm = () => {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState("");
    const handleSelectChange = (e) => {
        const value = e.target.value;

        if (value === "new-patient") {
            window.open(
                "/apps/patients/new-patient", // The URL to open
                "_blank", // Opens in a new tab or window
                "width=800,height=600,scrollbars=yes,resizable=yes" // Specifies the popup dimensions and options
            );
        } else {
            setSelectedOption(value);
        }
    };
    return (
        <div>
            <Row>
                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="patient">
                        <Form.Label className="mb-0">Patient</Form.Label>
                        <Form.Control as="select" value={selectedOption} onChange={handleSelectChange}>
                            <option>Select Patient</option>
                            <option value="new-patient">New Patient</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="office">
                        <Form.Label className="mb-0">Office</Form.Label>
                        <Form.Control as="select">
                            <option>Select Office</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="reason">
                        <Form.Label className="mb-0">Reason</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="profile">
                        <Form.Label className="mb-0">Profile</Form.Label>
                        <Form.Control as="select">
                            <option>Select Profile</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col sm={6} className="d-flex gap-2">
                    <Form.Group className="mb-1" style={{ width: '150px' }} controlId="scheduled">
                        <Form.Label className="mb-0">Scheduled</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                    <Form.Group className="mb-1" style={{ width: '100px' }} controlId="time">
                        <Form.Label className="mb-0">Time</Form.Label>
                        <Form.Control type="number" />
                    </Form.Group>
                    <div className="d-flex">
                        <Form.Group className="mb-1" style={{ width: '100px' }} controlId="duration">
                            <Form.Label className="mb-0">Duration</Form.Label>
                            <Form.Control type="number" />
                        </Form.Group>
                        <span className="text-secondary fs-6 fw-bold mt-3 pt-1 ps-2">minutes</span>
                    </div>
                </Col>

                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="consultationRoom">
                        <Form.Label className="mb-0">Consultation room</Form.Label>
                        <Form.Control as="select">
                            <option>Select Consultation room</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group className="mb-1" controlId="consentForms">
                        <Form.Label className="mb-0">Consent Forms</Form.Label>
                        <Form.Control as="select">
                            <option>Select Consent Forms</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group className="mb-1" >
                        <Form.Label className="mb-0">Status</Form.Label>
                        <Form.Control as="select">
                            <option>Select Status</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                        </Form.Control>
                    </Form.Group>

                </Col>
            </Row>

            <Row>
                <Col sm={12} className="d-flex justify-content-end my-2 gap-2">
                    <Button
                        variant="danger"
                        className="fs-6 d-flex align-items-center justify-content-center"
                        style={{ height: '30px', padding: '0 15px' }}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        className="fs-6 d-flex align-items-center justify-content-center"
                        style={{ height: '30px', padding: '0 15px' }}
                    >
                        Save and close
                    </Button>
                    <Button
                        variant="success"
                        type="submit"
                        className="fs-6 d-flex align-items-center justify-content-center"
                        style={{ height: '30px', padding: '0 15px' }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="secondary"
                        className="fs-6 d-flex align-items-center justify-content-center"
                        style={{ height: '30px', padding: '0 15px' }}
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default AppointmentForm;
