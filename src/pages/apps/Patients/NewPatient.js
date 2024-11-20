import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import ProfileDummy from "../../../assets/images/profileDummy.png";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { FiUploadCloud } from "react-icons/fi";

const NewPatient = () => {
    const [smShow, setSmShow] = useState(false);
    const [password, setPassword] = useState("");
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);

    const navigate = useNavigate();

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === "1234") {
            setIsPasswordCorrect(true);
            setSmShow(false);
            setIsVisible(true);
            //   ToastHandle("Password correct", "success");

            const id = setTimeout(() => {
                setIsPasswordCorrect(false);
                setIsVisible(false);
            }, 300000); // 5 minutes

            setTimeoutId(id);
        } else {
            //   ToastHandle("Password incorrect", "danger");
        }
    };

    return (
        <div className="background_Color pt-1 pb-2">
            <div className="container-fluid mt-4">
                <Card className="px-3 py-2">
                    <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: 600 }}>NEW PATIENT</p>
                        <div>
                            <Button className="me-3" onClick={() => setSmShow(true)}>
                                View Info
                            </Button>
                            <Button onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </div>

                    <div className="px-2">
                        {/* Navigation Tabs */}
                        <ul className="nav nav-underline">
                            <li className="nav-item">
                                <a className="nav-link active fw-medium" href="#">
                                    Personal Details
                                </a>
                            </li>
                        </ul>

                        {/* Form Section */}
                        <div className="row pb-4 mt-3" style={{ borderBottom: "1px solid #444141" }}>
                            <div className="col-6">
                                <div>
                                    <p>First Name*</p>
                                    <input
                                        placeholder="First Name"
                                        className="w-100 input ps-2 py-1"
                                    />
                                </div>
                                <div className="mt-3">
                                    <p>Email*</p>
                                    <input
                                        placeholder="Email"
                                        className="w-100 input ps-2 py-1"
                                    />
                                </div>
                                <div className="mt-3">
                                    <p>Phone*</p>
                                    <input
                                        placeholder="0987654321"
                                        className="w-100 input ps-2 py-1"
                                    />
                                </div>
                                <div className="mt-3" style={{ position: "relative" }}>
                                    <label htmlFor="profileImage" className="form-label ">
                                        Profile Image*
                                    </label>
                                    <div
                                        style={{
                                            position: "relative",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <input
                                            type="text"
                                            className="w-100 input ps-2 py-1"
                                            placeholder="Upload Image"
                                            style={{
                                                border: "1px solid #444141",
                                                fontSize: "14px",
                                                color: "#444141",
                                                paddingTop: "10px",
                                                paddingBottom: "10px",
                                                paddingRight: "35px",
                                            }}
                                        />
                                        <FiUploadCloud
                                            style={{
                                                position: "absolute",
                                                right: "10px",
                                                color: "#444141",
                                                fontSize: "20px",
                                                cursor: "pointer",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div>
                                    <p>Last Name*</p>
                                    <input
                                        placeholder="Last Name"
                                        className="w-100 input ps-2 py-1"
                                    />
                                </div>
                                <div className="mt-3">
                                    <p>Date Of Birth*</p>
                                    <input
                                        placeholder="Date Of Birth"
                                        className="w-100 input ps-2 py-1"
                                    />
                                </div>
                                <div className="mt-3">
                                    <p>Gender*</p>
                                    <div className="d-flex gap-2">
                                        <Form.Check type="radio" name="gender" label="Male" />
                                        <Form.Check type="radio" name="gender" label="Female" />
                                        <Form.Check type="radio" name="gender" label="Others" />
                                    </div>
                                </div>
                                <div className="row mt-3 pt-1">
                                    <div className="col-6">
                                        <p>Password*</p>
                                        <input
                                            placeholder="Password"
                                            className="w-100 input ps-2 py-1"
                                        />
                                    </div>
                                    <div className="col-6">
                                        <p>Confirm Password*</p>
                                        <input
                                            placeholder="Confirm Password"
                                            className="w-100 input ps-2 py-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="row pb-4">
                            <p className="my-3">Address Details</p>
                            <div className="col-6">
                                <p>Address 1*</p>
                                <input
                                    placeholder="Address 1"
                                    className="w-100 input ps-2 py-1"
                                />
                                <div className="row mt-3">
                                    <div className="col-6">
                                        <p>City*</p>
                                        <input
                                            placeholder="City"
                                            className="w-100 input ps-2 py-1"
                                        />
                                    </div>
                                    <div className="col-6">
                                        <p>Zip*</p>
                                        <input
                                            placeholder="Zip"
                                            className="w-100 input ps-2 py-1"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <p>Address 2*</p>
                                <input
                                    placeholder="Address 2"
                                    className="w-100 input ps-2 py-1"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="d-flex gap-2 justify-content-end mb-2">
                            <Button variant="secondary">Cancel</Button>
                            <Button variant="primary">Save</Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Password Modal */}
            <Modal
                size="sm"
                show={smShow}
                centered
                onHide={() => setSmShow(false)}
                aria-labelledby="password-modal"
            >
                <Modal.Body className="rounded-4 p-4">
                    <Form onSubmit={handlePasswordSubmit}>
                        <Form.Group controlId="password" className="text-center my-2">
                            <Form.Label className="mb-2">View Details</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Row className="mt-2">
                            <Col sm={12} className="text-center">
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                                <p className="fw-bold mt-2">Show the number for 5 min only</p>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default NewPatient;
