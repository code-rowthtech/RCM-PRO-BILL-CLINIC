import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

const SubscriptionSection = ({
  register,
  errors,
  subscriptionsData,
  amount,
  selectedDate,
  endDate,
  onSubscriptionChange,
  onDateChange,
  multiple = 0
}) => {
  return (
    <Row>
      <Col sm={6} className="mb-2">
        <Form.Group>
          <Form.Label className="mb-1">
            Subscription Plan <span className="text-danger">*</span>
          </Form.Label>
          <Form.Select
            {...register('subscription', {
              required: 'This field is required'
            })}
            onChange={(e) => onSubscriptionChange(e.target.value)}
          >
            <option value="">Select plan type</option>
            {subscriptionsData?.map((data) => (
              <option value={data?._id} key={data?._id} className="text-capitalize">
                {data?.name} {data?.billingFrequency} {data?.price}
              </option>
            ))}
          </Form.Select>
          {errors?.subscription && (
            <span className="text-danger">{errors?.subscription?.message}</span>
          )}
        </Form.Group>
      </Col>

      <Col sm={6}>
        <Form.Group className="mb-2">
          <Form.Label className="mb-1">
            Amount&nbsp;
            <span className="uil-info-circle billing-info mb-0 cursor-pointer" />
          </Form.Label>
          <Form.Control
            type="text"
            value={multiple > 0 ? amount?.totalAmount * multiple : amount?.totalAmount}
            readOnly
            placeholder="Amount"
          />
        </Form.Group>
      </Col>

      <Col sm={6}>
        <Form.Group className="mb-2">
          <Form.Label className="mb-1">Plan Tenure</Form.Label>
          <Form.Control
            type="text"
            placeholder="Plan Tenure"
            defaultValue={amount?.billingFrequency}
            readOnly
          />
        </Form.Group>
      </Col>

      <Col sm={6}>
        <Form.Group className="mb-2">
          <Form.Label className="mb-1">Implemented Date</Form.Label>
          <Form.Control
            type="date"
            placeholder="Implemented Date"
            value={selectedDate}
            onChange={onDateChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </Form.Group>
      </Col>

      <Col sm={6}>
        <Form.Group className="mb-2">
          <Form.Label className="mb-1">End Date</Form.Label>
          <Form.Control
            type="date"
            placeholder="End Date"
            defaultValue={amount ? endDate : ''}
            readOnly
          />
        </Form.Group>
      </Col>

      <Col sm={6}>
        <Form.Group className="mb-2">
          <Form.Label className="mb-1">Doctor Count</Form.Label>
          <Form.Control
            type="text"
            placeholder="Doctor Count"
            defaultValue={amount?.doctorLimit}
            readOnly
          />
        </Form.Group>
      </Col>

      <Col sm={6}>
        <Form.Group className="mb-2">
          <Form.Label className="mb-1">Patient Count</Form.Label>
          <Form.Control
            type="text"
            placeholder="Patient Count"
            defaultValue={amount?.patientLimit}
            readOnly
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

export default SubscriptionSection;