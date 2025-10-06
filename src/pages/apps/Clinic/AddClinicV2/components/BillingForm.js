import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import Spinner from '../../../../../constants/Spinner';
import { getSubscriptionsAction } from '../../../../../redux/subscriptions/actions';
import { addSubscriptionPlanAction } from '../../../../../redux/actions';
import { encryptMessage } from '../../../../../cryptoUtils';
import ToastHandle from '../../../../../helpers/ToastMessage';
import us from '../../../../../assets/images/flags/us.jpg';

import SubscriptionSection from './sections/SubscriptionSection';
import PaymentSection from './sections/PaymentSection';
import BillingContactSection from './sections/BillingContactSection';

const BillingForm = ({ activeTab, setActiveTab, clinicId, billingId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
    watch
  } = useForm();

  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  
  const [paymentType, setPaymentType] = useState('');
  const [amount, setAmount] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const subscriptionsData = store?.getSubscriptionReducer?.data?.result;
  const billingData = store?.getClinicsReducer?.data?.clinic?.userId?.subscriptionId;
  const billingAddResponse = store?.createSubscriptionPlanReducer?.data?.status;

  useEffect(() => {
    if (activeTab === 'billing') {
      dispatch(getSubscriptionsAction());
    }
  }, [dispatch, activeTab]);

  useEffect(() => {
    if (billingData?.subscriptionId) {
      initializeBillingData();
    }
  }, [billingData, subscriptionsData]);

  useEffect(() => {
    if (billingAddResponse === 200) {
      reset();
      setActiveTab('contract');
      ToastHandle(store?.createSubscriptionPlanReducer?.data?.message, 'success');
    }
  }, [billingAddResponse]);

  useEffect(() => {
    calculateEndDate();
  }, [amount?.months, selectedDate]);

  const initializeBillingData = () => {
    setValue('subscription', billingData?.subscriptionId);
    setSelectedDate(
      billingData?.implimentFrom
        ? new Date(billingData?.implimentFrom).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
    );
    const selectedSubscription = subscriptionsData?.find((data) => data?._id === billingData?.subscriptionId);
    setAmount(selectedSubscription || 0);
  };

  const calculateEndDate = () => {
    if (amount?.months && selectedDate) {
      const currentDate = new Date(selectedDate);
      let newDate = new Date(currentDate);
      newDate.setMonth(currentDate.getMonth() + amount.months);
      setEndDate(newDate.toISOString().split('T')[0]);
    }
  };

  const onSubmit = (data) => {
    const payload = {
      subscription: data?.subscription,
      billingContactName: data?.name,
      billingContactPhone: data?.contact,
      billingContactemail: data?.email
    };
    dispatch(addSubscriptionPlanAction({ key: encryptMessage(payload) }));
  };

  const handleSubscriptionChange = (selectedId) => {
    const selectedSubscription = subscriptionsData?.find((data) => data?._id === selectedId);
    setAmount(selectedSubscription || 0);
    clearErrors('subscription');
  };

  const formatDisplayValue = (value) => {
    if (!value) return '';
    const rawValue = value.replace(/\D/g, '');
    return rawValue.replace(/(\d{1,3})(\d{0,3})(\d{0,4})/, (match, p1, p2, p3) => {
      if (p3) return `(${p1})${p2}-${p3}`;
      if (p2) return `(${p1})${p2}`;
      return `(${p1}`;
    });
  };

  if (store?.getSubscriptionReducer?.loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner />
      </div>
    );
  }

  return (
    <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <SubscriptionSection
        register={register}
        errors={errors}
        subscriptionsData={subscriptionsData}
        amount={amount}
        selectedDate={selectedDate}
        endDate={endDate}
        onSubscriptionChange={handleSubscriptionChange}
        onDateChange={(e) => setSelectedDate(e.target.value)}
      />

      {!billingData && (
        <>
          <hr />
          <Row className="mt-2">
            <Col sm={12}>
              <Row>
                <PaymentSection
                  register={register}
                  errors={errors}
                  paymentType={paymentType}
                  setPaymentType={setPaymentType}
                  clearErrors={clearErrors}
                  watch={watch}
                />
                
                <BillingContactSection
                  register={register}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  formatDisplayValue={formatDisplayValue}
                />
              </Row>
            </Col>
          </Row>
        </>
      )}

      <Row className="mt-2">
        <Col sm={12} className="text-end d-flex justify-content-end gap-2">
          <Button
            onClick={() => setActiveTab('contract')}
            className="custom-buttons"
            style={{ width: '55px' }}
          >
            Next
          </Button>
          <Button
            type="submit"
            className="custom-buttons"
            style={{ width: '55px' }}
            disabled={store?.createSubscriptionPlanReducer?.loading}
          >
            {store?.createSubscriptionPlanReducer?.loading ? (
              <Spinner className="spinner-border-sm" color="white" />
            ) : (
              'Update'
            )}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default BillingForm;