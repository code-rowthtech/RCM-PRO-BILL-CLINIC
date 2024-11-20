// File: Index.jsx
import React, { useEffect, useState } from 'react';
import PageTitle from '../../../../components/PageTitle';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getRolesAction } from '../../../../redux/actions';
import { stateEmptydAction } from '../../../../redux/clinics/actions';
import ToastHandle from '../../../../helpers/ToastMessage';
import ClinicForm from './clinicForm';
import BillingForm from './billing';
import Contract from './contract';
import { useNavigate } from 'react-router-dom';
import SendEmailModal from './SendEmailModal';

const Index = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('clinic');
    const [clinicId, setClinicId] = useState(null);
    const [billingId, setBillingId] = useState(null);
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const [mailId, setMailId] = useState({ email: 'clinic@example.com' }); // Mock email for demo
    const store = useSelector((state) => state);

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getRolesAction({ limit: '', skip: '', search: '' }));
    }, [dispatch]);

    const handleActiveTab = (data) => {
        setActiveTab(data);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <Row className="mt-4">
                <Col xs={12}>
                    <Card className="px-3 py-2">
                        <Row className="mb-3">
                            <Col className="d-flex justify-content-between align-items-center">
                                <div className="d-flex gap-3">
                                    {['clinic', 'billing', 'contract'].map((tab) => (
                                        <span
                                            key={tab}
                                            onClick={() => handleActiveTab(tab)}
                                            role="button"
                                            tabIndex="0"
                                            className={`fw-semibold cursor-pointer ${
                                                activeTab === tab ? 'border-bottom border-2 border-dark text-black fw-bold' : ''
                                            }`}>
                                            {tab === 'clinic'
                                                ? 'Clinic Information'
                                                : tab === 'billing'
                                                ? 'Billing and Subscription Information'
                                                : 'Contract'}
                                        </span>
                                    ))}
                                </div>
                                <div className="d-flex gap-2">
                                    <Button className="custom-buttons" onClick={handleOpenModal}>
                                        Email to Clinic
                                    </Button>
                                    <Button className="custom-buttons">View</Button>
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

            {/* Include Modal */}
            <SendEmailModal show={showModal} closeModal={handleCloseModal} mailId={mailId} />
        </>
    );
};

export default Index;
