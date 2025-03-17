// @flow
import React from 'react';
import { Row, Col } from 'react-bootstrap';

// components

import Statistics from './Statistics';
// import Status from './Status';
import Tasks from './Tasks';
// import TasksChart from './TasksChart';
import Activity from './Activity';
import {  useSelector } from 'react-redux';

const ProjectDashboardPage = (): React$Element<React$FragmentType> => {
    const store = useSelector((state) => state);
    // useEffect(() => {
    //     dispatch(getAnalyticsAction())
    // }, [dispatch])
    const analyticsResponse = store?.getAnalyticsReducer;
    return (
        <div className='scroll-container' style={{height: '82vh', overflow: 'scroll' }}>
            {/* <PageTitle
                breadCrumbItems={[
                    { label: 'Dashboard', path: '/', active: true },
                ]}
                title={'Dashboard'}
            /> */}

            <Statistics data={analyticsResponse} />

            <Row>
                {/* <Col lg={4}>
                    <Status />
                </Col> */}
                <Col lg={12}>
                    <Tasks />
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    {/* <TasksChart /> */}
                </Col>
                {/* <Col xl={4}>
                    <Activity />
                </Col> */}
            </Row>

            <Row>
                <Col>
                    <Activity />
                </Col>
                {/* <Col xl={7}>
                    <Calendar />
                </Col> */}
            </Row>
        </div>
    );
};

export default ProjectDashboardPage;
