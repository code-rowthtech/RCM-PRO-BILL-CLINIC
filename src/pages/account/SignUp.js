// @flow
import React, { useEffect, useState } from 'react';
import { Button, Alert, Row, Col, Card, Container, InputGroup, Table, Form } from 'react-bootstrap';
import { Link, Navigate, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';


import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import ProfileDummy from "../../../src/assets/images/profileDummy.png";
import Logo from '../../assets/images/logo.png';
import { useForm, Controller } from 'react-hook-form';

//actions
import { resetAuth, loginUser } from '../../redux/actions';
// components
import { VerticalForm, FormInput } from '../../components/';
import AccountLayout from './AccountLayout';
import { decryptMessage, encryptMessage } from '../../cryptoUtils';
import Loader from '../../components/Loader';
import Spinner from '../../constants/Spinner';
import ToastHandle from '../../helpers/ToastMessage';
import { BiEdit } from 'react-icons/bi';
import { FiDownload, FiDownloadCloud, FiEdit, FiEye, FiTrash } from 'react-icons/fi';


const SignUp = (): React$Element<any> => {
    const [activeTab, setActiveTab] = useState("clinicInformation");
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const { control, register, handleSubmit, formState: { errors }, setValue } = useForm();

    // const [currentStep, setCurrentStep] = useState(1);
    const { loading, userLoggedIn, user, error } = useSelector((state) => ({
        loading: state.Auth.loading,
        user: state.Auth.user,
        error: state.Auth.error,
        userLoggedIn: state.Auth.userLoggedIn,
    }));
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
    useEffect(() => {
        if (error) {
            ToastHandle(error, 'danger')
        }
    }, [error]);
    // const handleNext = () => {
    //     if (currentStep < 3) {
    //         setCurrentStep(currentStep + 1);
    //         setActiveTab('billing')
    //     }
    // };

    // const handlePrevious = () => {
    //     if (currentStep > 1) {
    //         setCurrentStep(currentStep - 1);
    //     }
    // };
    const [status, setStatus] = useState('Active');

    const signUpData = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            insuranceProvider: 'HealthCare Inc.',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
            status: 'Active',
            clinicSign: 'Pending',
            probillSign: 'Pending',
            date: '26th sep 2024',
            address: {
                street: '123 Main St',
                city: 'Springfield',
                state: 'IL',
                zipCode: '62701'
            },
            gender: 'Male',
            insurancePlan: 'Premium',
            insurancePolicyNumber: '123456789',
            allergies: 'Pollen',
            emergencyContacts: [{ phone: '987-654-3210' }]
        },

    ];
    const filteredPatients = signUpData.filter((patient) =>
        status === 'Active' ? patient.status === 'Active' : patient.status === 'Inactive'
    );
    const onSubmit = (formData) => {
        dispatch(loginUser({ email: formData.username, password: formData.password }));
    };

    return (
        <>
            <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
                <Container>
                    <Row>
                        <Col md={12} className="m-auto">
                            <Card>
                                <Card.Header className="pt-4 pb-4 text-center headers">
                                    <Link to="/">
                                        <span>
                                            <img src={Logo} alt="" height="18" />
                                        </span>
                                    </Link>
                                </Card.Header>
                                <Card.Body className="p-4">
                                    <div className="text-center w-100 m-auto">
                                        <h4 className="text-dark-50 text-center mt-0 fw-bold">{t('Sign Up')}</h4>
                                        <p className="text-muted mb-4">
                                            {t('Enter your details address and password to access Login panel.')}
                                        </p>
                                    </div>
                                    <div >
                                        <ul className="nav nav-underline">
                                            <li className="nav-item">
                                                <button
                                                    className={`text-black nav-link ${activeTab === "clinicInformation" ? "active" : ""}`}
                                                    onClick={() => handleTabChange("clinicInformation")}
                                                >
                                                    Clinic Information
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button
                                                    className={` text-black nav-link ${activeTab === "billing" ? "active" : ""}`}
                                                    onClick={() => handleTabChange("billing")}
                                                >
                                                    Billing & Subscription
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button
                                                    className={` text-black nav-link ${activeTab === "contract" ? "active" : ""}`}
                                                    onClick={() => handleTabChange("contract")}
                                                >
                                                    Contract
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                    {activeTab === "clinicInformation" && (

                                        <Form onSubmit={handleSubmit(onSubmit)}>
                                            <Row style={{ borderBottom: '1px solid #444141' }} className='mt-3'>
                                                <Col xs={6}>
                                                    <FormInput
                                                        label={t('Clinic Name')}
                                                        type="text"
                                                        name="clinicName"
                                                        placeholder={t('Enter your Clinic Name')}
                                                        containerClass={'mb-3'}
                                                        control={control}
                                                        rules={{ required: 'Clinic Name is required' }}
                                                        error={errors.clinicName}
                                                    />
                                                    <FormInput
                                                        label={t('Email')}
                                                        type="email"
                                                        name="email"
                                                        placeholder={t('Enter your Email')}
                                                        containerClass={'mb-3'}
                                                        control={control}
                                                        rules={{
                                                            required: 'Email is required',
                                                            pattern: {
                                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                                message: 'Enter a valid email address'
                                                            }
                                                        }}
                                                        error={errors.email}
                                                    />
                                                    <FormInput
                                                        label={t('Contact Person 1')}
                                                        type="text"
                                                        name="contactPerson1"
                                                        placeholder={t('Enter your Contact Person 1')}
                                                        containerClass={'mb-3'}
                                                        control={control}
                                                        rules={{ required: 'Contact Person 1 is required' }}
                                                        error={errors.contactPerson1}
                                                    />
                                                    <div className="mb-3">
                                                        <p>{t('Logo')}</p>
                                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                                            <img
                                                                src={ProfileDummy}
                                                                alt="profile-img"
                                                                className="mt-2"
                                                                style={{ height: '100px', width: '100px' }}
                                                            />
                                                            <BiEdit
                                                                className="fs-5"
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '-3px',
                                                                    right: '2px',
                                                                    cursor: 'pointer',
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xs={6}>
                                                    <div className="mb-3">
                                                        <label htmlFor="doctorDepartment" className="form-label">
                                                            {t('Clinic type')}
                                                        </label>
                                                        <Controller
                                                            name="doctorDepartment"
                                                            control={control}
                                                            rules={{ required: 'Clinic Type is required' }}
                                                            render={({ field }) => (
                                                                <select
                                                                    {...field}
                                                                    id="doctorDepartment"
                                                                    className="w-100 input ps-2 py-1"
                                                                >
                                                                    <option value="" disabled>{t('Select Department')}</option>
                                                                    <option value="Cardiology">{t('Cardiology')}</option>
                                                                    <option value="Neurology">{t('Neurology')}</option>
                                                                    <option value="Pediatrics">{t('Pediatrics')}</option>
                                                                    <option value="Orthopedics">{t('Orthopedics')}</option>
                                                                </select>
                                                            )}
                                                        />
                                                        {errors.doctorDepartment && (
                                                            <span className="text-danger">{errors.doctorDepartment.message}</span>
                                                        )}
                                                    </div>

                                                    <FormInput
                                                        label={t('Tax ID / EIN')}
                                                        type="text"
                                                        name="taxID"
                                                        placeholder={t('Enter your Tax ID')}
                                                        containerClass={'mb-3'}
                                                        control={control}
                                                        rules={{ required: 'Tax ID / EIN is required' }}
                                                        error={errors.taxID}
                                                    />
                                                    <FormInput
                                                        label={t('NPI Number')}
                                                        type="text"
                                                        name="npiNumber"
                                                        placeholder={t('Enter your NPI Number')}
                                                        containerClass={'mb-3'}
                                                        control={control}
                                                        rules={{ required: 'NPI Number is required' }}
                                                        error={errors.npiNumber}
                                                    />
                                                </Col>
                                            </Row>

                                            <Row className="mt-3" style={{ borderBottom: '1px solid #444141' }}>
                                                <Col xs={12}>
                                                    <div>
                                                        <p className="fw-bold">{t('Accreditation Details')}</p>
                                                    </div>
                                                </Col>
                                                <Col xs={6}>
                                                    <FormInput
                                                        label={t('Name')}
                                                        type="text"
                                                        name="name"
                                                        placeholder={t('Enter your Name')}
                                                        containerClass="mb-3"
                                                        control={control}
                                                        rules={{ required: 'Name is required' }}
                                                        error={errors.name}
                                                    />
                                                </Col>
                                                <Col xs={6}>
                                                    <Row>
                                                        <Col xs={6} className="mb-2 position-relative">
                                                            <FormInput
                                                                label={t('Document Number')}
                                                                type="text"
                                                                name="documentNumber"
                                                                placeholder={t('Enter your Document Number')}
                                                                containerClass="mb-3"
                                                                control={control}
                                                                rules={{ required: 'Document Number is required' }}
                                                                error={errors.documentNumber}
                                                            />
                                                        </Col>

                                                        <Col xs={6} className="mb-2 position-relative">
                                                            <Form.Label>{t('Upload Document')}</Form.Label>
                                                            <div className='custom-file-upload d-flex align-items-center justify-content-between border rounded'>
                                                                <span className="text-muted ms-2">{t('Upload Document')}</span>
                                                                <FiDownloadCloud className="upload-icon me-2" />
                                                            </div>
                                                            <Controller
                                                                name="fileUpload"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Form.Control
                                                                        type="file"
                                                                        {...field}
                                                                        className="file-input"
                                                                        style={{ display: 'none' }}
                                                                    />
                                                                )}
                                                                rules={{ required: 'Document upload is required' }}
                                                            />
                                                            {errors.fileUpload && (
                                                                <span className="text-danger">{errors.fileUpload.message}</span>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>


                                            {/* Medical Licenses Section */}
                                            <Row className="mt-3" style={{ borderBottom: '1px solid #444141' }}>
                                                <Col xs={12}>
                                                    <div>
                                                        <p className="fw-bold">{t('Medical Licenses')}</p>
                                                    </div>
                                                </Col>
                                                <Col xs={6}>
                                                    <FormInput
                                                        label={t('Name')}
                                                        type="text"
                                                        name="name"
                                                        placeholder={t('Enter your Name')}
                                                        containerClass="mb-3"
                                                        control={control}
                                                        rules={{ required: 'Name is required' }}
                                                        error={errors.name}
                                                    />
                                                </Col>
                                                <Col xs={6}>
                                                    <Row>
                                                        <Col xs={6} className="mb-2 position-relative">
                                                            <FormInput
                                                                label={t('Document Number')}
                                                                type="text"
                                                                name="documentNumber"
                                                                placeholder={t('Enter your Document Number')}
                                                                containerClass="mb-3"
                                                                control={control}
                                                                rules={{ required: 'Document Number is required' }}
                                                                error={errors.documentNumber}
                                                            />
                                                        </Col>

                                                        <Col xs={6} className="mb-2 position-relative">
                                                            <Form.Label>{t('Upload Document')}</Form.Label>
                                                            <div className='custom-file-upload d-flex align-items-center justify-content-between border rounded'>
                                                                <span className="text-muted ms-2">{t('Upload Document')}</span>
                                                                <FiDownloadCloud className="upload-icon me-2" />
                                                            </div>
                                                            <Controller
                                                                name="fileUpload"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Form.Control
                                                                        type="file"
                                                                        {...field}
                                                                        className="file-input"
                                                                        style={{ display: 'none' }}
                                                                    />
                                                                )}
                                                                rules={{ required: 'Document upload is required' }}
                                                            />
                                                            {errors.fileUpload && (
                                                                <span className="text-danger">{errors.fileUpload.message}</span>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>

                                            {/* State of Licensing Section */}
                                            <Row className="mt-3" style={{ borderBottom: '1px solid #444141' }}>
                                                <Col xs={12}>
                                                    <div>
                                                        <p className="fw-bold">{t('State of Licensing')}</p>
                                                    </div>
                                                </Col>
                                                <Col xs={6}>
                                                    <FormInput
                                                        label={t('Name')}
                                                        type="text"
                                                        name="stateLicensingName"
                                                        placeholder={t('Enter your Name')}
                                                        containerClass="mb-3"
                                                        control={control}
                                                        rules={{ required: 'Name is required' }}
                                                        error={errors.stateLicensingName}
                                                    />
                                                </Col>
                                                <Col xs={6}>
                                                    <Row>
                                                        <Col xs={6} className="mb-2 position-relative">
                                                            <FormInput
                                                                label={t('Document Number')}
                                                                type="text"
                                                                name="stateLicensingDocumentNumber"
                                                                placeholder={t('Enter your Document Number')}
                                                                containerClass="mb-3"
                                                                control={control}
                                                                rules={{ required: 'Document Number is required' }}
                                                                error={errors.stateLicensingDocumentNumber}
                                                            />
                                                        </Col>

                                                        <Col xs={6} className="mb-2 position-relative">
                                                            <Form.Label>{t('Upload Document')}</Form.Label>
                                                            <div className='custom-file-upload d-flex align-items-center justify-content-between border rounded'>
                                                                <span className="text-muted ms-2">{t('Upload Document')}</span>
                                                                <FiDownloadCloud className="upload-icon me-2" />
                                                            </div>
                                                            <Controller
                                                                name="stateLicensingFileUpload"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Form.Control
                                                                        type="file"
                                                                        {...field}
                                                                        className="file-input"
                                                                        style={{ display: 'none' }}
                                                                    />
                                                                )}
                                                                rules={{ required: 'Document upload is required' }}
                                                            />
                                                            {errors.stateLicensingFileUpload && (
                                                                <span className="text-danger">{errors.stateLicensingFileUpload.message}</span>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            {/* Address Details Section */}
                                            <Row>
                                                <Col xs={12} className="mt-3">
                                                    <div>
                                                        <p className="fw-bold">{t('Address Details')}</p>
                                                    </div>
                                                </Col>

                                                {/* Address Description */}
                                                <Col xs={6}>
                                                    <div>
                                                        <label htmlFor="addressDescription" className="form-label">
                                                            {t('Description*')}
                                                        </label>
                                                        <Controller
                                                            name="addressDescription"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <textarea
                                                                    className="w-100 input rounded-0"
                                                                    style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141' }}
                                                                    id="addressDescription"
                                                                    rows="10"
                                                                    placeholder={t('Enter your address description')}
                                                                    {...field}
                                                                />
                                                            )}
                                                            rules={{ required: t('Description is required') }}
                                                        />
                                                        {errors.addressDescription && (
                                                            <span className="text-danger">{errors.addressDescription.message}</span>
                                                        )}
                                                    </div>
                                                </Col>

                                                {/* City, State, Street, Zip, Latitude, Longitude */}
                                                <Col xs={6}>
                                                    <Row>
                                                        {/* City */}
                                                        <Col xs={6}>
                                                            <div className="mb-3">
                                                                <label htmlFor="city" className="form-label">{t('City')}</label>
                                                                <Controller
                                                                    name="city"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <select
                                                                            id="city"
                                                                            className="w-100 input ps-2 py-1"
                                                                            {...field}
                                                                        >
                                                                            <option>{t('Select City')}</option>
                                                                            <option value="city1">{t('City 1')}</option>
                                                                            <option value="city2">{t('City 2')}</option>
                                                                        </select>
                                                                    )}
                                                                    rules={{ required: t('City is required') }}
                                                                />
                                                                {errors.city && (
                                                                    <span className="text-danger">{errors.city.message}</span>
                                                                )}
                                                            </div>
                                                        </Col>

                                                        {/* State */}
                                                        <Col xs={6}>
                                                            <div className="mb-3">
                                                                <label htmlFor="state" className="form-label">{t('State')}</label>
                                                                <Controller
                                                                    name="state"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <select
                                                                            id="state"
                                                                            className="w-100 input ps-2 py-1"
                                                                            {...field}
                                                                        >
                                                                            <option>{t('Select State')}</option>
                                                                            <option value="state1">{t('State 1')}</option>
                                                                            <option value="state2">{t('State 2')}</option>
                                                                        </select>
                                                                    )}
                                                                    rules={{ required: t('State is required') }}
                                                                />
                                                                {errors.state && (
                                                                    <span className="text-danger">{errors.state.message}</span>
                                                                )}
                                                            </div>
                                                        </Col>

                                                        {/* Street */}
                                                        <Col xs={6}>
                                                            <FormInput
                                                                label={t('Street')}
                                                                type="text"
                                                                name="street"
                                                                placeholder={t('Enter your street')}
                                                                containerClass="mb-3"
                                                                control={control}
                                                                rules={{ required: t('Street is required') }}
                                                                error={errors.street}
                                                            />
                                                        </Col>

                                                        {/* Zip */}
                                                        <Col xs={6}>
                                                            <FormInput
                                                                label={t('Zip')}
                                                                type="text"
                                                                name="zip"
                                                                placeholder={t('Enter your zip code')}
                                                                containerClass="mb-3"
                                                                control={control}
                                                                rules={{ required: t('Zip is required') }}
                                                                error={errors.zip}
                                                            />
                                                        </Col>

                                                        {/* Latitude */}
                                                        <Col xs={6}>
                                                            <FormInput
                                                                label={t('Latitude')}
                                                                type="text"
                                                                name="latitude"
                                                                placeholder={t('Enter latitude')}
                                                                containerClass="mb-3"
                                                                control={control}
                                                                rules={{ required: t('Latitude is required') }}
                                                                error={errors.latitude}
                                                            />
                                                            </Col>

                                                        {/* Longitude */}
                                                        <Col xs={6}>
                                                            <FormInput
                                                                label={t('Longitude')}
                                                                type="text"
                                                                name="longitude"
                                                                placeholder={t('Enter longitude')}
                                                                containerClass="mb-3"
                                                                control={control}
                                                                rules={{ required: t('Longitude is required') }}
                                                                error={errors.longitude}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>

                                            <div className="mb-0 text-end">
                                                <Button className='custom-buttons' type="submit" disabled={loading} >
                                                    {loading ?
                                                        <Spinner className="spinner-border-sm " />
                                                        :
                                                        `${t('Add Multiple Clinic')}`
                                                    }
                                                </Button>
                                                <Button className='custom-buttons ms-3 '
                                                    type="submit"
                                                    disabled={loading}
                                                >
                                                    {loading ?
                                                        <Spinner className="spinner-border-sm " />
                                                        :
                                                        `${t('Next')}`
                                                    }
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                    {activeTab === "billing" && (
                                        <Form onSubmit={handleSubmit(onSubmit)}>
                                            <Row className="mt-3">
                                                <Col xs={12}>
                                                    <Row>
                                                        <Col xs={6}>
                                                            <div className="mt-3">
                                                                <label htmlFor="subscriptionPlan" className="form-label">
                                                                    {t('Subscription plan')}
                                                                </label>
                                                                <select
                                                                    id="subscriptionPlan"
                                                                    name="subscriptionPlan"
                                                                    className="w-100 input ps-2 py-1"
                                                                    {...register('subscriptionPlan', { required: 'Subscription plan is required' })}
                                                                >
                                                                    <option value="" disabled>{t('Select plan')}</option>
                                                                    <option value="Cardiology">{t('Cardiology')}</option>
                                                                    <option value="Neurology">{t('Neurology')}</option>
                                                                    <option value="Pediatrics">{t('Pediatrics')}</option>
                                                                    <option value="Orthopedics">{t('Orthopedics')}</option>
                                                                </select>
                                                                {errors.subscriptionPlan && <span className="text-danger">{errors.subscriptionPlan.message}</span>}
                                                            </div>
                                                        </Col>

                                                        <Col xs={6}>
                                                            <FormInput
                                                                label={t('Amount')}
                                                                type="text"
                                                                name="amount"
                                                                placeholder={t('Amount')}
                                                                containerClass="mt-3"
                                                                {...register('amount', { required: 'Amount is required', pattern: { value: /^\d+$/, message: 'Amount must be a number' } })}
                                                            />
                                                            {errors.amount && <span className="text-danger">{errors.amount.message}</span>}
                                                        </Col>
                                                    </Row>

                                                    <Row>
                                                        <Col xs={6}>
                                                            <div>
                                                                <p className="fw-bold">{t('Payment Information')}</p>
                                                            </div>
                                                            <div className="mt-3">
                                                                <label htmlFor="paymentMethod" className="form-label">
                                                                    {t('Payment Method')}
                                                                </label>
                                                                <select
                                                                    id="paymentMethod"
                                                                    name="paymentMethod"
                                                                    className="w-100 input ps-2 py-1"
                                                                    {...register('paymentMethod', { required: 'Payment method is required' })}
                                                                >
                                                                    <option value="" disabled>{t('Select Payment Method')}</option>
                                                                    <option value="Visa">{t('Visa')}</option>
                                                                    <option value="Amex">{t('American Express')}</option>
                                                                    <option value="Discover">{t('Discover')}</option>
                                                                </select>
                                                                {errors.paymentMethod && <span className="text-danger">{errors.paymentMethod.message}</span>}
                                                            </div>

                                                            <FormInput
                                                                label={t('Billing Address')}
                                                                type="text"
                                                                name="billingAddress"
                                                                placeholder={t('Billing Address')}
                                                                containerClass="mt-3"
                                                                {...register('billingAddress', { required: 'Billing address is required' })}
                                                            />
                                                            {errors.billingAddress && <span className="text-danger">{errors.billingAddress.message}</span>}

                                                            <FormInput
                                                                label={t('Cardholder Name')}
                                                                type="text"
                                                                name="cardholderName"
                                                                placeholder={t('Cardholder Name')}
                                                                containerClass="mt-3"
                                                                {...register('cardholderName', { required: 'Cardholder name is required' })}
                                                            />
                                                            {errors.cardholderName && <span className="text-danger">{errors.cardholderName.message}</span>}

                                                            <FormInput
                                                                label={t('Credit/Debit Card Number')}
                                                                type="text"
                                                                name="cardNumber"
                                                                placeholder={t('Credit/Debit Card Number')}
                                                                containerClass="mt-3"
                                                                {...register('cardNumber', { required: 'Card number is required', pattern: { value: /^\d{16}$/, message: 'Card number must be 16 digits' } })}
                                                            />
                                                            {errors.cardNumber && <span className="text-danger">{errors.cardNumber.message}</span>}

                                                            <FormInput
                                                                label={t('CVV (Security Code)')}
                                                                type="text"
                                                                name="cvv"
                                                                placeholder={t('CVV (Security Code)')}
                                                                containerClass="mt-3"
                                                                {...register('cvv', { required: 'CVV is required', pattern: { value: /^[0-9]{3}$/, message: 'CVV must be 3 digits' } })}
                                                            />
                                                            {errors.cvv && <span className="text-danger">{errors.cvv.message}</span>}

                                                            <FormInput
                                                                label={t('Expiration Date')}
                                                                type="text"
                                                                name="expirationDate"
                                                                placeholder={t('MM/YY')}
                                                                containerClass="mt-3"
                                                                {...register('expirationDate', { required: 'Expiration date is required' })}
                                                            />
                                                            {errors.expirationDate && <span className="text-danger">{errors.expirationDate.message}</span>}
                                                        </Col>

                                                        <Col xs={6}>
                                                            <div>
                                                                <p className="fw-bold">{t('Billing Contact Information')}</p>
                                                            </div>
                                                            <FormInput
                                                                label={t('Billing Contact Name')}
                                                                type="text"
                                                                name="billingContactName"
                                                                placeholder={t('Billing Contact Name')}
                                                                containerClass="mt-3"
                                                                {...register('billingContactName', { required: 'Billing contact name is required' })}
                                                            />
                                                            {errors.billingContactName && <span className="text-danger">{errors.billingContactName.message}</span>}

                                                            <FormInput
                                                                label={t('Billing Contact Email')}
                                                                type="email"
                                                                name="billingContactEmail"
                                                                placeholder={t('Billing Contact Email')}
                                                                containerClass="mt-3"
                                                                {...register('billingContactEmail', { required: 'Billing contact email is required', pattern: { value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, message: 'Enter a valid email address' } })}
                                                            />
                                                            {errors.billingContactEmail && <span className="text-danger">{errors.billingContactEmail.message}</span>}

                                                            <FormInput
                                                                label={t('Billing Contact Phone Number')}
                                                                type="tel"
                                                                name="billingContactPhone"
                                                                placeholder={t('Billing Contact Phone Number')}
                                                                containerClass="mt-3"
                                                                {...register('billingContactPhone', { required: 'Billing contact phone number is required', pattern: { value: /^[0-9]{10}$/, message: 'Phone number must be 10 digits' } })}
                                                            />
                                                            {errors.billingContactPhone && <span className="text-danger">{errors.billingContactPhone.message}</span>}
                                                        </Col>
                                                    </Row>
                                                </Col>

                                                <div className="mb-3 mb-0 text-end">
                                                    <Button
                                                        className="custom-buttons me-3"
                                                        disabled={loading}
                                                        type="submit"
                                                    >
                                                        {loading ? (
                                                            <Spinner className="spinner-border-sm" />
                                                        ) : (
                                                            t('Generate Contract')
                                                        )}
                                                    </Button>
                                                </div>
                                            </Row>
                                        </Form>
                                    )}
                                    {activeTab === "contract" && (
                                        <>
                                            <Row className='mt-3'>
                                                <Col className='mb-3'>
                                                    <Table responsive className="table-centered table-nowrap mb-0">
                                                        <thead className="text-white">
                                                            <tr>
                                                                <th className='text-white'>Sr.No.</th>
                                                                <th className='text-white'>Contract Name</th>
                                                                <th className='text-white'>Clinic Sign</th>
                                                                <th className='text-white'>Probill Sign</th>
                                                                <th className='text-white'>Date</th>
                                                                <th className='text-white'>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredPatients.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan={6} className='text-center'>
                                                                        <h3 className='my-5'>No Data Found</h3>
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                filteredPatients.map((data, index) => (
                                                                    <tr key={data.id}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{data.firstName} {data.lastName}</td>
                                                                        <td>{data.clinicSign}</td>
                                                                        <td>{data.probillSign}</td>
                                                                        <td>{data.date}</td>
                                                                        <td>
                                                                            <div className='d-flex gap-2'>
                                                                                <div>
                                                                                    <FiEye className='fs-5' />
                                                                                </div>
                                                                                <div>
                                                                                    <FiDownload className='fs-5' />
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </Col>

                                                <div className="mb-3 mb-0 text-end">

                                                    <Button className='custom-buttons' type="submit" disabled={loading} >
                                                        {loading ? (
                                                            <Spinner className="spinner-border-sm" />
                                                        ) : (
                                                            filteredPatients.length > 0 ? `${t('Sign Up')}` : `${t('Next')}`
                                                        )}
                                                    </Button>
                                                </div>
                                            </Row>
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                    </Row>

                </Container>
            </div>
        </>
    );
};

export default SignUp;
