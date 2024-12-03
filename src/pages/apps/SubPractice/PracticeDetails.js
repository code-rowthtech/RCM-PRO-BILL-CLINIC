import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { encryptMessage } from "../../../cryptoUtils";
import { useForm } from "react-hook-form";
import { createUpgradeAction, getSubscriptionAction } from "../../../redux/sub clinic/actions";
import { getSubclinicSubscriptionsAction } from "../../../redux/actions";
import { FiEdit, FiTrash } from "react-icons/fi";

const PracticeDetails = () => {
  const store = useSelector((state) => state)
  const subscriptions = [store?.getSubSubscriptionReducer?.data?.subscriptionDetails] || [];
  const createLoading = store?.createUpgradeReducer?.loading

  console.log(subscriptions, 'subs')
  const dispatch = useDispatch();
  const [totalAmount, setTotalAmount] = useState()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))


  useEffect(() => {
    const payload = {
      userId: clinic_id?._id
    }
    dispatch(getSubclinicSubscriptionsAction({ key: encryptMessage(payload) }))
  }, [getSubclinicSubscriptionsAction])

  const onsubmit = (data) => {
    const payload = {
      userId: clinic_id?._id,
      amount: totalAmount,
      billingContactName: data.billingcontact,
      billingContactemail: data.billingcontactemail,
      billingContactPhone: data.billingContactPhone
    }
    console.log('Form Submitted:', payload);
    dispatch(createUpgradeAction({ key: encryptMessage(payload) }))
    reset();
  }
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US');
  };
  const calculateDiscountedAmount = (totalAmount, discount) => {
    return discount === 1 ? totalAmount - (totalAmount * (discount / 100)) : totalAmount;
  };
  useEffect(() => {
    const calculateTotalAmount = () => {
      let sum = 0;
      subscriptions.forEach((subscription) => {
        if (subscription?.totalAmount && subscription?.subscriptionId?.discount) {
          const discountedAmount = calculateDiscountedAmount(subscription.totalAmount, subscription.subscriptionId.discount);
          sum += discountedAmount;
        }
      });
      setTotalAmount(sum);
    };

    calculateTotalAmount();
  }, [subscriptions]);
  return (
    <>

      <Row>

        <Col>
          <h5>Current Plan</h5>
          <Table responsive className="table-centered table-nowrap mb-0">
            <thead className="text-white">
              <tr className=''>
                <th className='text-white'>Subscription Name</th>
                <th className='text-white'>Start Date</th>
                <th className='text-white'>Renewal Date</th>
                <th className="text-white">Clinic Count</th>
                <th className='text-white'>Amount </th>

                <th className='text-white'>Status</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions && subscriptions?.length > 0 ? (
                subscriptions?.map((item, index) => (

                  <tr key={index}>
                    <td>{item?.name}</td>
                    <td>{formatDate(item?.subscriptionStartDate)}</td> {/* Format Start Date */}
                    <td>{formatDate(item?.subscriptionRenewalDate)}</td> {/* Format Renewal Date */}
                    <td className="">{item?.clinicCount}</td>
                    <td>{item?.totalAmount}</td>
                    <td>{item?.isActive ? "Active" : "Inactive"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No subscriptions found</td>
                </tr>
              )}
            </tbody>


          </Table>
        </Col>
      </Row>
      <Form className="mt-2" onSubmit={handleSubmit(onsubmit)}>
        {/* <Row>
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
        </Row> */}
        <Row>
          <Col sm={12}>
            <h5>Upgrade</h5>
            <p>Amount to be paid: {totalAmount ? totalAmount.toFixed(2) : 'N/A'}</p>
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
                  // {...register('paymentmethod', { required: 'Payment Method field is required' })}

                  >
                    <option>Select Payment Method</option>
                    <option value='1'>Monthly</option>

                  </Form.Select>
                  {/* {errors.paymentmethod && <span className="text-danger">{errors.paymentmethod.message}</span>} */}

                </Form.Group>
              </Col>
              <Col sm={12}>
                <Form.Group className="mb-2">
                  <Form.Label className='mb-1'>Billing Address</Form.Label>
                  <Form.Control
                    type='text'
                    // {...register('billingaddress', { required: 'Billing Address field is required' })}
                    placeholder='Billing Address' />
                  {/* {errors.billingaddress && <span className="text-danger">{errors.billingaddress.message}</span>} */}

                </Form.Group>
              </Col>

              <Col sm={12}>
                <Form.Group className="mb-2">
                  <Form.Label className='mb-1'>Cardholder Name</Form.Label>
                  <Form.Control
                    type='text'
                    // {...register('cardholdername', { required: 'Cardholder Name field is required' })}
                    placeholder='Cardholder Name' />
                  {/* {errors.cardholdername && <span className="text-danger">{errors.cardholdername.message}</span>} */}

                </Form.Group>
              </Col>
              <Col sm={12}>
                <Form.Group className="mb-2">
                  <Form.Label className='mb-1'>Credit/Debit Card Number</Form.Label>
                  <Form.Control
                    type='text'
                    // {...register('cardnumber', { required: 'Credit/Debit Card Number field is required' })}
                    placeholder='Credit/Debit Card Number' />
                  {/* {errors.cardnumber && <span className="text-danger">{errors.cardnumber.message}</span>} */}

                </Form.Group>
              </Col>
              <Col sm={12}>
                <Form.Group className="mb-2">
                  <Form.Label className='mb-1'>CVV(Security Code)</Form.Label>
                  <Form.Control
                    type='text'
                    // {...register('cvvcode', { required: 'CVV(Security Code) field is required' })}
                    placeholder='CVV(Security Code)' />
                  {/* {errors.cvvcode && <span className="text-danger">{errors.cvvcode.message}</span>} */}

                </Form.Group>
              </Col>
              <Col sm={12}>
                <Form.Group className="mb-2">
                  <Form.Label className='mb-1'>Expiration Date</Form.Label>
                  <Form.Control
                    type='date'
                    // {...register('expirationdate', { required: 'Expiration Date field is required' })}
                    placeholder='Expiration Date' />
                  {/* {errors.expirationdate && <span className="text-danger">{errors.expirationdate.message}</span>} */}

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
            <Button
              variant="primary"
              type="submit"
              className='custom-buttons'
              disabled={createLoading}  // Disable button when loading
            >
              {createLoading ? (
                <Spinner animation="border" size="sm" />  // Show spinner when loading
              ) : (
                'Next'
              )}
            </Button>
          </Col>
        </Row>

      </Form>
    </>
  );
};

export default PracticeDetails;
