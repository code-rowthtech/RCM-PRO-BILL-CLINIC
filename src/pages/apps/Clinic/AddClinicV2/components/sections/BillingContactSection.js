import React from 'react';
import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import us from '../../../../../../assets/images/flags/us.jpg';

const BillingContactSection = ({
  register,
  errors,
  watch,
  setValue,
  formatDisplayValue
}) => {
  return (
    <Col sm={6}>
      <Row className="mt-1">
        <Col sm={12}>
          <span className="text-black fw-semibold">Billing Contact Information</span>
        </Col>
        
        <Col sm={12} className="mb-2">
          <Form.Group>
            <Form.Label className="mb-1">
              Billing Contact Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              {...register('name', {
                required: 'This field is required.'
              })}
              placeholder="Billing Contact Name"
            />
            {errors.name && (
              <span className="text-danger">{errors.name.message}</span>
            )}
          </Form.Group>
        </Col>

        <Col sm={12} className="mb-2">
          <Form.Group>
            <Form.Label className="mb-1">
              Billing Contact Email <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="email"
              {...register('email', {
                required: 'This field is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address'
                }
              })}
              placeholder="Billing Contact Email"
            />
            {errors.email && (
              <span className="text-danger">{errors.email.message}</span>
            )}
          </Form.Group>
        </Col>

        <Col sm={12} className="mb-2">
          <Form.Group className="mb-0 position-relative">
            <Form.Label className="mb-1">
              Billing Contact Phone Number <span className="text-danger">*</span>
            </Form.Label>
            <InputGroup>
              <InputGroup.Text className="ps-3 pe-1 fw-bold text-black">
                &nbsp;&nbsp;+1
              </InputGroup.Text>
              <Form.Control
                type="tel"
                value={formatDisplayValue(watch('contact'))}
                onChange={(e) => {
                  let rawValue = e.target.value.replace(/\D/g, '');
                  if (rawValue.length > 10) rawValue = rawValue.slice(0, 10);
                  
                  const formattedValue = rawValue.replace(
                    /(\d{1,3})(\d{0,3})(\d{0,4})/,
                    (match, p1, p2, p3) => {
                      if (p3) return `(${p1})${p2}-${p3}`;
                      if (p2) return `(${p1})${p2}`;
                      return `(${p1}`;
                    }
                  );
                  setValue('contact', formattedValue);
                }}
                maxLength={13}
                placeholder="(123)456-7890"
                {...register('contact', {
                  required: 'This field is required',
                  validate: (value) => {
                    const raw = value.replace(/\D/g, '');
                    if (raw.length < 10) return 'Contact must be 10 digits';
                    return true;
                  }
                })}
              />
            </InputGroup>
            <div
              className="position-absolute"
              style={{ top: '52%', left: '1%' }}
            >
              <img src={us} alt="country code flag" width={20} />
            </div>
            {errors.contact && (
              <span className="text-danger">{errors.contact.message}</span>
            )}
          </Form.Group>
        </Col>
      </Row>
    </Col>
  );
};

export default BillingContactSection;