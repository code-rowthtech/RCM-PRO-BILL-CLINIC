import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { getClinicTypeAction } from '../../../../redux/clinics/actions';
import TabNavigation from './components/TabNavigation';
import ClinicForm from './components/ClinicForm';
import BillingForm from './components/BillingForm';
import Contract from './components/Contract';

const TABS = {
  CLINIC: 'clinic',
  BILLING: 'billing',
  CONTRACT: 'contract'
};

const AddClinicV2 = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(TABS.CLINIC);
  const [clinicId, setClinicId] = useState(null);
  const [billingId, setBillingId] = useState(null);

  useEffect(() => {
    dispatch(getClinicTypeAction());
  }, [dispatch]);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case TABS.CLINIC:
        return (
          <ClinicForm
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            setClinicId={setClinicId}
            clinicId={clinicId}
            setBillingId={setBillingId}
          />
        );
      case TABS.BILLING:
        return (
          <BillingForm
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            clinicId={clinicId}
            billingId={billingId}
          />
        );
      case TABS.CONTRACT:
        return (
          <Contract
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            clinicId={clinicId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Row className="mt-2">
      <Col xs={12} className="px-0">
        <Card className="px-md-3 py-md-2 scroll-container page-height">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={TABS}
          />
          {renderActiveComponent()}
        </Card>
      </Col>
    </Row>
  );
};

export default AddClinicV2;