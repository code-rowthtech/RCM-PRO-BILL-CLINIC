// @flow
import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';

// components
import PageTitle from '../../../components/PageTitle';

import Statistics from './Statistics';
// import Status from './Status';
import Tasks from './Tasks';
// import TasksChart from './TasksChart';
import Activity from './Activity';
import Calendar from './Calendar';
import { useDispatch, useSelector } from 'react-redux';
import { getAnalyticsAction } from '../../../redux/dashboard/actions';

const ProjectDashboardPage = (): React$Element<React$FragmentType> => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    useEffect(() => {
        dispatch(getAnalyticsAction())
    }, [dispatch])
    const analyticsResponse = store?.getAnalyticsReducer;
    return (
        <>
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
        </>
    );
};

export default ProjectDashboardPage;
