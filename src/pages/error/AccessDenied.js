import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AccessDenied = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userRole = userData?.user?.role?.name || 'Unknown';

    return (
        <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6} xl={5} xxl={4}>
                        <Card className="shadow-none">
                            <Card.Body className="p-4">
                                <div className="text-center">
                                    <div className="mb-4">
                                        <i className="uil uil-lock-access text-danger" style={{ fontSize: '4rem' }}></i>
                                    </div>
                                    <h1 className="text-error">403</h1>
                                    <h4 className="text-uppercase text-danger mt-3">Access Denied</h4>
                                    <p className="text-muted mt-3">
                                        You don't have permission to access this page.
                                    </p>
                                    <p className="text-muted">
                                        Your current role: <strong>{userRole}</strong>
                                    </p>
                                    <p className="text-muted mb-4">
                                        Please contact your administrator if you believe this is an error.
                                    </p>
                                    <Link className="btn btn-info mt-3" to="/dashboard/project">
                                        <i className="mdi mdi-reply"></i> Return to Dashboard
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AccessDenied;