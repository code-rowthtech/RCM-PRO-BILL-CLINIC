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
    const analyticsResponse = store?.getAnalyticsReducer;
    return (
        <div className='' >
            <h4 className=''>IN-PROGRESS</h4>
        </div>
    );
};

export default ProjectDashboardPage;
