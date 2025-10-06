import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

const PaymentSection = ({
  register,
  errors,
  paymentType,
  setPaymentType,
  clearErrors,
  watch
}) => {
  return (
    <Col sm={6}>
      <Row className="mt-1">
        <Col sm={12}>
          <span className="text-black fw-semibold">Payment Information</span>
        </Col>
        
        <Col sm={12}>
          <Form.Group className="mb-2">
            <Form.Label className="mb-1">
              Payment Method <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              {...register('method', {
                required: 'This field is required'
              })}
              className={`${!!watch('method') ? 'emptyField' : 'selectedField'}`}
              onChange={(e) => {
                setPaymentType(e.target.value);
                clearErrors('method');
              }}
            >
              <option value="">Select payment method</option>
              <option value="card">Card</option>
              <option value="online">Online banking</option>
              <option value="cheque">Cheque</option>
            </Form.Select>
            {errors?.method && (
              <span className="text-danger">{errors?.method?.message}</span>
            )}
          </Form.Group>
        </Col>

        <Col sm={12}>
          <Form.Group className="mb-2">
            <Form.Label className="mb-1">
              Billing Address <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              {...register('billingaddress', {
                required: 'This field is required'
              })}
              placeholder="Billing Address"
            />
            {errors.billingaddress && (
              <span className="text-danger">{errors.billingaddress.message}</span>
            )}
          </Form.Group>
        </Col>

        {paymentType === 'card' && (
          <>
            <Col sm={12}>
              <Form.Group className="mb-2">
                <Form.Label className="mb-1">
                  Cardholder Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name on card"
                />
              </Form.Group>
            </Col>

            <Col sm={12}>
              <Form.Group className="mb-2">
                <Form.Label className="mb-1">Credit / Debit Card Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="xxxx-xxxx-xxxx"
                  maxLength={12}
                />
              </Form.Group>
            </Col>

            <Col sm={12}>
              <Form.Group className="mb-2">
                <Form.Label className="mb-1">CVV (Security Code)</Form.Label>
                <Form.Control
                  type="text"
                  maxLength={3}
                  placeholder="---"
                />
              </Form.Group>
            </Col>

            <Col sm={12}>
              <Form.Group className="mb-2">
                <Form.Label className="mb-1">Expiration Date (Security Code)</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="---"
                />
              </Form.Group>
            </Col>
          </>
        )}
      </Row>
    </Col>
  );
};

export default PaymentSection;