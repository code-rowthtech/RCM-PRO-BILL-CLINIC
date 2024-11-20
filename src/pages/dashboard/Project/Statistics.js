// @flow
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import Spinner from '../../../constants/Spinner';
import { useSelector } from 'react-redux';

const Statistics = (data): React$Element<React$FragmentType> => {
    const statisticsData = data?.data?.data;
    const store = useSelector((state) => state);
    return (
        <Row className='mt-2'>
            <Col xs={12}>
                <Card className="widget-inline ">
                    <Card.Body className="p-0">
                        {store?.getAnalyticsReducer?.loading ?
                            <Row className="g-0 py-4">
                                <Col className='text-center'>
                                    <Spinner />
                                </Col>
                            </Row>
                            :
                            <Row className="g-0">
                                <Col sm={6} lg={3}>
                                    <Card className="shadow-none box-shadow-none m-0">
                                        <Card.Body className="text-center">
                                            <i className="dripicons-briefcase text-muted font-24"></i>
                                            <h3>
                                                <span>{statisticsData?.registeredClinics}</span>
                                            </h3>
                                            <p className="text-muted font-15 mb-0">Registered Clinics</p>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col sm={6} lg={3}>
                                    <Card className="shadow-none box-shadow-none m-0 border-start">
                                        <Card.Body className="text-center">
                                            <i className="dripicons-checklist text-muted font-24"></i>
                                            <h3>
                                                <span>{statisticsData?.registeredDoctors}</span>
                                            </h3>
                                            <p className="text-muted font-15 mb-0">Registered Doctors</p>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col sm={6} lg={3}>
                                    <Card className="shadow-none box-shadow-none m-0 border-start">
                                        <Card.Body className="text-center">
                                            <i className="dripicons-user-group text-muted font-24"></i>
                                            <h3>
                                                <span>{statisticsData?.registeredPatients}</span>
                                            </h3>
                                            <p className="text-muted font-15 mb-0">Registered Patients</p>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col sm={6} lg={3}>
                                    <Card className="shadow-none box-shadow-none m-0 border-start">
                                        <Card.Body className="text-center">
                                            <i className="dripicons-graph-line text-muted font-24"></i>
                                            <h3>
                                                <span>{statisticsData?.totalclaims}</span>
                                                {/* <i className="mdi mdi-arrow-up text-success"></i> */}
                                            </h3>
                                            <p className="text-muted font-15 mb-0">Claims</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        }
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Statistics;
