import React from 'react';
import { Col, Row } from 'react-bootstrap';

const TAB_LABELS = {
  clinic: 'Practice Information',
  billing: 'Billing and Subscription Information',
  contract: 'Contract'
};

const TabNavigation = ({ activeTab, onTabChange, tabs }) => {
  const tabOrder = [tabs.CLINIC, tabs.BILLING, tabs.CONTRACT];

  return (
    <Row className="mb-0">
      <Col className="d-flex justify-content-between align-items-center">
        <div className="d-flex gap-4">
          {tabOrder.map((tab) => (
            <span
              key={tab}
              onClick={() => onTabChange(tab)}
              role="button"
              tabIndex="0"
              className={`fw-semibold cursor-pointer font_active_tabs ${
                activeTab === tab ? 'active_tabs_link fw-bold' : ''
              }`}
            >
              {TAB_LABELS[tab]}
            </span>
          ))}
        </div>
      </Col>
    </Row>
  );
};

export default TabNavigation;