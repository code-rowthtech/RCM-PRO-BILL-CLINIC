import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col } from 'react-bootstrap';
import AppointmentForm from './Tabs/AppointmentForm';
import Vitals from './Tabs/Vitals';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointmentByIdAction, resetUpdateAction } from '../../../redux/actions';
import Spinner from '../../../constants/Spinner';


const NewAppointment = ({ appointmentId }) => {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Appointments');
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const id = appointmentId ? appointmentId : searchParams.get('updateid');
    const store = useSelector((state) => state);
    const rescheduleResponse = store?.rescheduleAppointmentReducer?.data?.status;
    useEffect(() => {
        if (id) {
            dispatch(getAppointmentByIdAction({ id: id }))
        }
    }, [id])

    useEffect(() => {
        if (rescheduleResponse === 200) {
            dispatch(getAppointmentByIdAction({ id: id }));
            dispatch(resetUpdateAction());
        }
    }, [rescheduleResponse])

    const tabs = [
        'Appointments',
        'Billing',
        'Eligibility',
        'Vitals',
        'Growthcharts',
        'Log Comm.',
        'Revisions',
        'Mu Helper'
    ];

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleAppointment = () => {
        navigate("/apps/appointments/list");
    };

    return (
        <div>
            <Card className=" scroll-container px-2 py-2" style={{ height: '82vh', overflow: 'scroll' }}>
                <Row className="mb-2">
                    <Col sm={10}>
                        <ul className="nav nav-underline">
                            {tabs.map((tab) => (
                                <li className="nav-item" key={tab}>
                                    <a
                                        className={`nav-link text-black me-2 ${activeTab === tab ? 'active fw-bold' : ''}`}
                                        onClick={() => handleTabClick(tab)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {tab}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Col>
                    <Col sm={2} className="d-flex justify-content-end">
                        <Button
                            className='cancel-button'
                            onClick={handleAppointment}
                        >
                            Back
                        </Button>
                    </Col>
                </Row>
                {
                    store?.getPatientByIdReducer?.loading ?
                        <Spinner />
                        :
                        <div className=" ">
                            {activeTab === 'Appointments' && <AppointmentForm />}
                            {activeTab === 'Billing' && <p>Billing Content In Progress...</p>}
                            {activeTab === 'Eligibility' && <p>Eligibility Content In Progress...</p>}
                            {activeTab === 'Vitals' && <Vitals />}
                            {activeTab === 'Growthcharts' && <p>Growthcharts Content In Progress...</p>}
                            {activeTab === 'Log Comm.' && <p>Log Comm. Content In Progress...</p>}
                            {activeTab === 'Revisions' && <p>Revisions Content In Progress...</p>}
                            {activeTab === 'Mu Helper' && <p>Mu Helper Content In Progress...</p>}
                        </div>
                }

            </Card>
        </div>
    );
};

export default NewAppointment;