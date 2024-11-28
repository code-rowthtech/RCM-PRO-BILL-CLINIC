import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch } from "react-redux";
import { encryptMessage } from "../../../cryptoUtils";
import { useForm } from "react-hook-form";

const ClinicDetails = () => {

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const onsubmit = (data) => {
    const payload = {
      ...data,

    }
    console.log('Form Submitted:', payload);
    reset(); // Reset form after submission
  }
  return (
    <>
      <Form className="mt-2" onSubmit={handleSubmit(onsubmit)}>
        <Row>
          <Col sm={6}>
            <Form.Group className="mb-2">
              <Form.Label className='mb-1'>Subscription Plan</Form.Label>
              <Form.Select
                {...register('subscription', { required: 'Subscription Plan field is required' })}

              >
                <option>Select</option>
                <option value='1'>Monthly</option>

              </Form.Select>
              {errors.subscription && <span className="text-danger">{errors.subscription.message}</span>}


            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group className="mb-2">
              <Form.Label className='mb-1'>Amount</Form.Label>
              <Form.Control
                type="text"
                {...register('amount', { required: 'Amount field is required' })}
                placeholder="Amount" />
              {errors.amount && <span className="text-danger">{errors.amount.message}</span>}
            </Form.Group>
          </Col>
        </Row>
        <Row className=''>
          <Col sm={12}>
            <Row>
              <Col sm={6} className=''>
                <Row className=''>

                  <Col sm={12}>
                    <Form.Group className="mb-2">
                      <Form.Label className='mb-1'>Plan Tenure</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('plantenure', { required: 'Plan Tenure field is required' })}
                        placeholder="Plan Tenure" />
                      {errors.plantenure && <span className="text-danger">{errors.plantenure.message}</span>}

                    </Form.Group>
                  </Col>
                  <Col sm={12}>
                    <Form.Group className="mb-2">
                      <Form.Label className='mb-1'>Doctor Count</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('doctorcount', { required: 'Doctor Count field is required' })}
                        placeholder="Doctor Count" />
                      {errors.doctorcount && <span className="text-danger">{errors.doctorcount.message}</span>}
                    </Form.Group>
                  </Col>
                  <Col sm={12} >
                    <Form.Group className="mb-2">
                      <Form.Label className='mb-1'>Date Of Joining</Form.Label>
                      <Form.Control
                        type="date"
                        {...register('date', { required: 'Date Of Joining field is required' })}
                        placeholder="Name on card" />
                      {errors.date && <span className="text-danger">{errors.date.message}</span>}
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col sm={6}>
                <Row className=''>

                  <Col sm={12}>
                    <Form.Group className="mb-2">
                      <Form.Label className='mb-1'>Implimented Date</Form.Label>
                      <Form.Control
                        type='date'
                        {...register('ImplimentedDate', { required: 'Implimented Date field is required' })}
                        placeholder='Implimented Date' />
                      {errors.ImplimentedDate && <span className="text-danger">{errors.ImplimentedDate.message}</span>}

                    </Form.Group>
                  </Col>
                  <Col sm={12}>
                    <Form.Group className="mb-2">
                      <Form.Label className='mb-1'>Patient Count</Form.Label>
                      <Form.Control
                        type='text'
                        {...register('patientcount', { required: 'Patient Count field is required' })}
                        placeholder='Patient Count' />
                      {errors.patientcount && <span className="text-danger">{errors.patientcount.message}</span>}

                    </Form.Group>
                  </Col>
                  <Col sm={12}>
                    <Form.Group className="mb-2">
                      <Form.Label className='mb-1'>Date of Leaving</Form.Label>
                      <Form.Control
                        type='date'
                        {...register('dateleaving', { required: 'Date of Leaving field is required' })}
                        placeholder='Date of Leaving' />
                      {errors.dateleaving && <span className="text-danger">{errors.dateleaving.message}</span>}

                    </Form.Group>
                  </Col>
                </Row>
              </Col>


            </Row>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col sm={6} className='border-top border-dark border-end'>
            <Row className="mt-2">
              <span>Payment Information</span>
              <Col sm={12}>
                <Form.Group className="mb-2">
                  <Form.Label className='mb-1'>Payment Method</Form.Label>
                  <Form.Select
                    {...register('paymentmethod', { required: 'Payment Method field is required' })}

                  >
                    <option>Select Payment Method</option>
                    <option value='1'>Monthly</option>

                  </Form.Select>
                  {errors.paymentmethod && <span className="text-danger">{errors.paymentmethod.message}</span>}

                </Form.Group>
              </Col>
              <Col sm={12}>
                <Form.Group className="mb-2">
                  <Form.Label className='mb-1'>Billing Address</Form.Label>
                  <Form.Control
                    type='text'
                    {...register('billingaddress', { required: 'Billing Address field is required' })}
                    placeholder='Billing Address' />
                  {errors.billingaddress && <span className="text-danger">{errors.billingaddress.message}</span>}

                </Form.Group>
              </Col>

              <Col sm={12}>
                <Form.Group className="mb-2">
                  <Form.Label className='mb-1'>Cardholder Name</Form.Label>
                  <Form.Control
                    type='text'
                    {...register('cardholdername', { required: 'Cardholder Name field is required' })}
                    placeholder='Cardholder Name' />
                  {errors.cardholdername && <span className="text-danger">{errors.cardholdername.message}</span>}

                </Form.Group>
              </Col>
              <Col sm={12}>
                <Form.Group className="mb-2">
                  <Form.Label className='mb-1'>Credit/Debit Card Number</Form.Label>
                  <Form.Control
                    type='text'
                    {...register('cardnumber', { required: 'Credit/Debit Card Number field is required' })}
                    placeholder='Credit/Debit Card Number' />
                  {errors.cardnumber && <span className="text-danger">{errors.cardnumber.message}</span>}

                </Form.Group>
              </Col>
              <Col sm={12}>
                <Form.Group className="mb-2">
                  <Form.Label className='mb-1'>CVV(Security Code)</Form.Label>
                  <Form.Control
                    type='text'
                    {...register('cvvcode', { required: 'CVV(Security Code) field is required' })}
                    placeholder='CVV(Security Code)' />
                  {errors.cvvcode && <span className="text-danger">{errors.cvvcode.message}</span>}

                </Form.Group>
              </Col>
              <Col sm={12}>
                <Form.Group className="mb-2">
                  <Form.Label className='mb-1'>Expiration Date</Form.Label>
                  <Form.Control
                    type='date'
                    {...register('expirationdate', { required: 'Expiration Date field is required' })}
                    placeholder='Expiration Date' />
                  {errors.expirationdate && <span className="text-danger">{errors.expirationdate.message}</span>}

                </Form.Group>
              </Col>
            </Row>
          </Col>
          <Col sm={6} className='border-top border-dark'>
            <Row className="mt-2">
              <span>Billing Contact Information</span>
              <Col sm={12}>
                <Form.Group className="mb-2">
                  <Form.Label className='mb-1'>Billing Contact Name</Form.Label>
                  <Form.Control
                    type='text'
                    {...register('billingcontact', { required: 'Billing Contact Name field is required' })}
                    placeholder='Billing Contact Name' />
                  {errors.billingcontact && <span className="text-danger">{errors.billingcontact.message}</span>}

                </Form.Group>
              </Col>
              <Col sm={12}>
                <Form.Group className="mb-2">
                  <Form.Label className='mb-1'>Billing Contact Email</Form.Label>
                  <Form.Control
                    type='email'
                    {...register('billingcontactemail', { required: 'Billing Contact Email field is required' })}
                    placeholder='Billing Contact Email' />
                  {errors.billingcontactemail && <span className="text-danger">{errors.billingcontactemail.message}</span>}

                </Form.Group>
              </Col>
              <Col sm={12}>
                <Form.Group className="mb-2">
                  <Form.Label className='mb-1'>Billing Contact phone Number</Form.Label>
                  <Form.Control
                    type='text'
                    {...register('billingcontactnumber', { required: 'Billing Contact phone Number field is required' })}
                    placeholder='Billing Contact phone Number' />
                  {errors.billingcontactnumber && <span className="text-danger">{errors.billingcontactnumber.message}</span>}

                </Form.Group>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className='mt-2'>
          <Col sm={12} className='text-end'>
            <Button type='submit' className='custom-button' >

              Generate Contract
            </Button>
          </Col>
        </Row>

      </Form>
    </>
  );
};

export default ClinicDetails;
