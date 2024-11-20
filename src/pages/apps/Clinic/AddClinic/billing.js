import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscriptionsAction } from '../../../../redux/subscriptions/actions'
import { encryptMessage } from '../../../../cryptoUtils';
import { addSubscriptionPlanAction, stateEmptydAction } from '../../../../redux/actions';
import ToastHandle from '../../../../helpers/ToastMessage';
import Spinner from '../../../../constants/Spinner';
const BillingForm = ({ activeTab, setActiveTab, clinicId, billingId }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setError,
        clearErrors
    } = useForm();
    const [paymentType, setPaymentType] = useState('');
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [amount, setAmount] = useState((null));
    const subscriptionsData = store?.getSubscriptionsReducer?.data?.plans;
    const createResponse = store?.createSubscriptionPlanReducer?.data?.status;
    useEffect(() => {
        if (activeTab === 'billing') {
            dispatch(getSubscriptionsAction());
        }
        if (createResponse === 200) {
            setActiveTab('contract');
        }
    }, [dispatch, activeTab]);
    const onSubmit = (data) => {
        const payload = {
            subscription: data?.subscription,
            userId: billingId,
            billingContactName: data?.name,
            billingContactPhone: data?.contact,
            billingContactemail: data?.email
        }
        dispatch(addSubscriptionPlanAction({ key: encryptMessage(payload) }));
    };

    const billingAddResponse = store?.createSubscriptionPlanReducer?.data?.status;
    useEffect(() => {
        if (billingAddResponse === 200) {
            reset();
            setActiveTab('contract');
            ToastHandle(store?.createSubscriptionPlanReducer?.data?.message, 'success');
            dispatch(stateEmptydAction());
        }
    }, [billingAddResponse]);
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col sm={6}>
                    <Form.Group className="mb-2">
                        <Form.Label className='mb-1'>Subscription Plan</Form.Label>
                        <Form.Select
                            {...register('subscription')}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const selectedSubscription = subscriptionsData?.find(data => data._id === selectedId);
                                setAmount(selectedSubscription?.amount || 0);
                            }}
                        >
                            <option>Select</option>
                            {subscriptionsData?.map((data) => (
                                <option value={data?._id} key={data?._id} className='text-capitalize'>
                                    {data?.name} {data?.billingFrequency} {data?.price}
                                </option>
                            ))}
                        </Form.Select>

                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-2">
                        <Form.Label className='mb-1'>Amount</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={amount}
                            readOnly
                            // {...register('amount', { required: 'This field is required' })}
                            placeholder="Amount" />
                        {/* {errors.amount && <span className="text-danger">{errors.amount.message}</span>} */}
                    </Form.Group>
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col sm={12}>
                    <Row>
                        <Col sm={6} className='border-end border-dark'>
                            <Row className='mt-2'>
                                <Col sm={12}>
                                    <span className='text-black fw-semibold'>Payment Information</span>
                                </Col>
                                <Col sm={12}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Payment Method</Form.Label>
                                        <Form.Select onChange={(e) => setPaymentType(e.target.value)}>
                                            <option>Select</option>
                                            <option value='card'>Card</option>
                                            <option value='online'>Online banking</option>
                                            <option value='cheque'>Cheque</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col sm={12}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Billing Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            // {...register('billingaddress', { required: 'This field is required' })}
                                            placeholder="Billing Address" />
                                        {/* {errors.billingaddress && <span className="text-danger">{errors.billingaddress.message}</span>} */}
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className={`${paymentType === 'card' ? '' : 'd-none'}`}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Cardholder Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            // {...register('cardholder', { required: 'This field is required' })}
                                            placeholder="Name on card" />
                                        {/* {errors.cardholder && <span className="text-danger">{errors.cardholder.message}</span>} */}
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className={`${paymentType === 'card' ? '' : 'd-none'}`}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Credit / Debit Card Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            // {...register('cardnumber', { required: 'This field is required' })}
                                            placeholder="xxxx-xxxx-xxxx" />
                                        {/* {errors.cardnumber && <span className="text-danger">{errors.cardnumber.message}</span>} */}
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className={`${paymentType === 'card' ? '' : 'd-none'}`}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>CVV (Security Code)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            // {...register('cvv', { required: 'This field is required' })}
                                            placeholder="---" />
                                        {/* {errors.cvv && <span className="text-danger">{errors.cvv.message}</span>} */}
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className={`${paymentType === 'card' ? '' : 'd-none'}`}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Expiration Date (Security Code)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            // {...register('expiration', { required: 'This field is required' })}
                                            placeholder="---" />
                                        {/* {errors.expiration && <span className="text-danger">{errors.expiration.message}</span>} */}
                                    </Form.Group>
                                </Col>
                            </Row>

                        </Col>
                        <Col sm={6}>
                            <Row className='mt-2'>
                                <Col sm={12}>
                                    <span className='text-black fw-semibold'>Billing Contact Information</span>
                                </Col>
                                <Col sm={12}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Billing Contact Name</Form.Label>
                                        <Form.Control
                                            type='text'
                                            {...register('name')}
                                            placeholder='Billing Contact Name' />
                                    </Form.Group>
                                </Col>
                                <Col sm={12}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Billing Contact Email</Form.Label>
                                        <Form.Control
                                            type='email'
                                            {...register('email')}
                                            placeholder='Billing Contact Email' />
                                    </Form.Group>
                                </Col>
                                <Col sm={12}>
                                    <Form.Group className="mb-2">
                                        <Form.Label className='mb-1'>Billing Contact Phone Number</Form.Label>
                                        <Form.Control
                                            type='text'
                                            {...register('contact')}
                                            placeholder='Billing Contact Phone Number' />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>


                    </Row>
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col sm={12} className='text-end'>
                    <Button type='submit' className='custom-button' disabled={store?.createSubscriptionPlanReducer?.loading}>
                        {store?.store?.createSubscriptionPlanReducer?.loading ?
                            <Spinner />
                            :
                            'Generate Contract'
                        }
                    </Button>
                </Col>
            </Row>

        </Form>
    )
}
export default BillingForm;