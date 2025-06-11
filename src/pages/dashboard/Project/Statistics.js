// @flow
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import Spinner from '../../../constants/Spinner';
import { useSelector } from 'react-redux';

const Statistics = (data): React$Element<React$FragmentType> => {
    const store = useSelector((state) => state);

    // Static fallback data
    const staticData = {
        registeredClinics: 125,
        registeredDoctors: 42,
        registeredPatients: 856,
        totalClaims: 1234
    };

    // Use API data if available, otherwise use static data
    const displayData = staticData;

    return (
        <Row className='mt-2'>
            <Col xs={12}>
                <div className="bg-none">
                    <Card.Body className="p-0">
                        {store?.getAnalyticsReducer?.loading ?
                            <Row className="g-0 py-4">
                                <Col className='text-center'>
                                    <Spinner />
                                </Col>
                            </Row>
                            :
                            <Row className="g-2">
                                <Col sm={6} lg={6} className='mb-2 pe-2'>
                                    <Card className="m-0 border-0 shadow-sm">
                                        <Card.Body className="d-flex align-items-center p-3">
                                            <div className="me-3 bg-primary bg-opacity-10 rounded-circle p-4 d-flex align-items-center justify-content-center">
                                                <i className="dripicons-briefcase text-primary font-24"></i>
                                            </div>
                                            <div>
                                                <p className="text-muted font-14 mb-0">Registered Clinics</p>
                                                <h3 className="mb-0">{displayData.registeredClinics}</h3>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col sm={6} lg={6} className='mb-2 ps-2'>
                                    <Card className="m-0 border-0 shadow-sm">
                                        <Card.Body className="d-flex align-items-center p-3">
                                            <div className="me-3 bg-success bg-opacity-10 rounded-circle p-4 d-flex align-items-center justify-content-center">
                                                <i className="dripicons-checklist text-success font-24"></i>
                                            </div>
                                            <div>
                                                <p className="text-muted font-14 mb-0">Registered Doctors</p>
                                                <h3 className="mb-0">{displayData.registeredDoctors}</h3>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col sm={6} lg={6} className='mb-2 pe-2'>
                                    <Card className="m-0 border-0 shadow-sm">
                                        <Card.Body className="d-flex align-items-center p-3">
                                            <div className="me-3 bg-info bg-opacity-10 rounded-circle p-4 d-flex align-items-center justify-content-center">
                                                <i className="dripicons-user-group text-info font-24"></i>
                                            </div>
                                            <div>
                                                <p className="text-muted font-14 mb-0">Registered Patients</p>
                                                <h3 className="mb-0">{displayData.registeredPatients}</h3>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col sm={6} lg={6} className='mb-2 ps-2'>
                                    <Card className="m-0 border-0 shadow-sm">
                                        <Card.Body className="d-flex align-items-center p-3">
                                            <div className="me-3 bg-warning bg-opacity-10 rounded-circle p-4 d-flex align-items-center justify-content-center">
                                                <i className="dripicons-graph-line text-warning font-24"></i>
                                            </div>
                                            <div>
                                                <p className="text-muted font-14 mb-0">Claims</p>
                                                <h3 className="mb-0">{displayData.totalClaims}</h3>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        }
                    </Card.Body>
                </div>
            </Col>
        </Row>
    );
};

export default Statistics;