// @flow
import React from 'react';
import { Row, Col } from 'react-bootstrap';

// components

import Statistics from './Statistics';
// import Status from './Status';
import Tasks from './Tasks';
// import TasksChart from './TasksChart';
import Activity from './Activity';
import { useSelector } from 'react-redux';

const ProjectDashboardPage = (): React$Element<React$FragmentType> => {
    const store = useSelector((state) => state);
    // useEffect(() => {
    //     dispatch(getAnalyticsAction())
    // }, [dispatch])
    const analyticsResponse = store?.getAnalyticsReducer;
    return (
        <div className='' >
            <h4 className=''>IN-PROGRESS</h4>



            {/* <Row>
                <Col lg={12} className='mt-1'>
                    <Tasks />
                </Col>
                <Col lg={6}>
                    <Activity />
                </Col>
                <Col lg={6} className=''>
                    <Statistics data={analyticsResponse} />
                </Col>

            </Row> */}
        </div>
    );
};

export default ProjectDashboardPage;
