import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Card, Button } from "react-bootstrap";
import Logo from "../../assets/images/logo.png";

const ErrorPageNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="container">
                <Row className="justify-content-center">
                    <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                        <Card className="shadow border-0 rounded-3">
                            <Card.Header className="bg-primary text-white text-center py-3 border-0">
                                <Link to="/" className="text-white text-decoration-none">
                                    <img src={Logo} alt="Clinic Logo" height="32" className="mb-2" />
                                    <div className="fw-bold">RCM Pro Bill Clinic</div>
                                </Link>
                            </Card.Header>

                            <Card.Body className="text-center p-4 p-md-5">
                                <div className="mb-4">
                                    <i className="mdi mdi-alert-circle-outline text-warning" style={{ fontSize: "4rem" }}></i>
                                </div>
                                <h1 className="display-4 fw-bold text-primary mb-3">404</h1>
                                <h4 className="text-dark mb-3">Page Not Found</h4>
                                <p className="text-muted mb-4">The page you're looking for doesn't exist or has been moved.</p>
                                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                    <Button
                                        variant="primary"
                                        onClick={() => navigate("/dashboard/project")}
                                        className="px-4"
                                    >
                                        <i className="mdi mdi-home me-2"></i>Dashboard
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => window.history.back()}
                                        className="px-4"
                                    >
                                        <i className="mdi mdi-arrow-left me-2"></i>Go Back
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ErrorPageNotFound;
