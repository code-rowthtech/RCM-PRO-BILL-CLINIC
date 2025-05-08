// File: Index.jsx
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
// import { getRolesAction } from '../../../../redux/actions';
import { getClinicTypeAction } from '../../../../redux/clinics/actions';
import ClinicForm from './clinicForm';
import BillingForm from './billing';
import Contract from './contract';
import { useNavigate } from 'react-router-dom';

const Index = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('clinic');
    const [clinicId, setClinicId] = useState(null);
    const [billingId, setBillingId] = useState(null);
    useEffect(() => {
        dispatch(getClinicTypeAction())
    }, [dispatch]);

    const handleActiveTab = (data) => {
        setActiveTab(data);
    };

    return (
        <>
            <Row className="mt-2">
                <Col xs={12} className='px-0'>
                    <Card className="px-md-3 py-md-2 scroll-container page-height">
                        <Row className="mb-0">
                            <Col className="d-flex justify-content-between align-items-center">
                                <div className="d-flex gap-4">
                                    {['clinic', 'billing', 'contract'].map((tab) => (
                                        <span
                                            key={tab}
                                            onClick={() => handleActiveTab(tab)}
                                            role="button"
                                            tabIndex="0"
                                            className={`fw-semibold cursor-pointer font_active_tabs ${activeTab === tab ? 'active_tabs_link fw-bold' : ''
                                                }`}>
                                            {tab === 'clinic'
                                                ? 'Practice Information'
                                                : tab === 'billing'
                                                    ? 'Billing and Subscription Information'
                                                    : 'Contract'}
                                        </span>
                                    ))}
                                </div>
                            </Col>
                        </Row>

                        {activeTab === 'clinic' ? (
                            <ClinicForm
                                setActiveTab={setActiveTab}
                                activeTab={activeTab}
                                setClinicId={setClinicId}
                                clinicId={clinicId}
                                setBillingId={setBillingId}
                            />
                        ) : activeTab === 'billing' ? (
                            <BillingForm
                                setActiveTab={setActiveTab}
                                activeTab={activeTab}
                                clinicId={clinicId}
                                billingId={billingId}
                            />
                        ) : (
                            <Contract setActiveTab={setActiveTab} activeTab={activeTab} clinicId={clinicId} />
                        )}
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Index;
