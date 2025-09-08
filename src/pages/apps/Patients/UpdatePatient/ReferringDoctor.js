import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, InputGroup, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
    // getStatesByCountryAction,
    // getCitiesAction,
    addReferringDoctorAction,
    getPatientByIdAction,
} from '../../../../redux/actions';
import us from '../../../../assets/images/flags/us.jpg';
import { decryptMessage, encryptMessage } from '../../../../cryptoUtils';
import AddressForm from '../../Common Pages/AddressForm';
import { useSearchParams } from 'react-router-dom';

const ReferringDoctor = ({ setActiveTab, activeTab, isAccordionOpen }) => {
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    // const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const clinicId = decryptMessage(localStorage?.getItem('subClinicLocation')) || '';

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        clearErrors,
        watch,
    } = useForm();
    const [referringDoctorAddress, setReferringDoctorAddress] = useState([
        { type: '', line: [''], city: '', state: '', postalCode: '', country: 'USA' },
    ]);
    const [submissionType, setSubmissionType] = useState(null);
    const patientDetails = store?.getPatientByIdReducer?.data?.data;
    const createResponseReferring = store?.addReferringDoctorReducer?.data?.status;

    const primaryState = watch('primaryStateName');
    const primaryCitySearch = watch('primaryCity');
    useEffect(() => {
        if (patientDetails) {
            setValue('firstName', patientDetails?.referringDocId?.name?.[0]?.given?.[0]);
            setValue('middleName', patientDetails?.referringDocId?.name?.[0]?.given?.[1]);
            setValue('lastName', patientDetails?.referringDocId?.name?.[0]?.family);
            setValue('prefix', patientDetails?.referringDocId?.name?.[0]?.prefix);
            setValue('suffix', patientDetails?.referringDocId?.name?.[0]?.suffix);
            setValue('npiNumber', patientDetails?.referringDocId?.identifier?.[0]?.value);
            setValue('email', patientDetails?.referringDocId?.telecom?.[1]?.value);
            setValue(
                'phone',
                patientDetails?.referringDocId?.telecom?.[0]?.value
                    ? patientDetails?.referringDocId?.telecom?.[0]?.value
                        .replace(/\D/g, '')
                        .replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) =>
                            p3 ? `(${p1})${p2}-${p3}` : `(${p1})${p2}`
                        )
                    : ''
            );
            // setValue('phone', patientDetails?.referringDocId?.telecom?.[0]?.value);
            setReferringDoctorAddress(
                patientDetails?.referringDocId?.address?.map((address) => ({
                    type: address?.type,
                    use: address?.use,
                    line: address?.line,
                    city: address?.city,
                    state: address?.state,
                    postalCode: address?.postalCode,
                    country: address?.country,
                })) || [{ type: '', line: [''], city: '', state: '', postalCode: '', country: 'USA' }]
            );
        }
    }, []);

    const onSubmit = (data) => {
        const payload = {
            patientId: patientId,
            clinicId: clinicId,
            id: patientDetails?.referringDocId?._id, // ✅ This is the referring doctor ID you want
            identifier: [
                {
                    use: 'official',
                    system: 'http://hl7.org/fhir/sid/us-npi',
                    value: data?.npiNumber,
                    type: {
                        coding: [
                            {
                                system: 'http://hl7.org/fhir/sid/us-npi',
                                code: 'NPI',
                                display: 'National Provider Identifier (NPI)',
                            },
                        ],
                        text: 'National Provider Identifier (NPI)',
                    },
                },
            ],

            name: {
                prefix: data.prefix ? data.prefix : [],
                given: [data.firstName, data.middleName].filter(Boolean), // Removing empty values
                family: data.lastName,
                suffix: data.suffix ? data.suffix : [],
            },
            telecom: [
                ...(data.phone ? [{ system: 'phone', value: data.phone.replace(/\D/g, '') }] : []),
                ...(data.email ? [{ system: 'email', value: data.email }] : []),
                ...(data.fax ? [{ system: 'fax', value: data.fax }] : []),
            ],
            address: referringDoctorAddress,
        };
        dispatch(addReferringDoctorAction({ key: encryptMessage(payload) }));
    };
    useEffect(() => {
        if (createResponseReferring === 201) {
            dispatch(getPatientByIdAction({ patientId }));
        }
    }, [createResponseReferring]);
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div
                className="scroll-container mt-1"
                style={{ overflowX: 'hidden', height: isAccordionOpen ? '54.7vh' : '70vh' }}>
                <Row className="pb-2">
                    <Col sm={12}>
                        <span className="text-black fw-semibold form-label">Personal Details</span>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Prefix</Form.Label>
                            <Form.Control {...register('prefix')} placeholder="Prefix (Dr., Mr., Ms.)" type="text" />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">First Name</Form.Label>
                            <Form.Control {...register('firstName')} placeholder="First Name" type="text" />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Middle Name</Form.Label>
                            <Form.Control {...register('middleName')} placeholder="Middle Name" type="text" />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Last Name</Form.Label>
                            <Form.Control {...register('lastName')} placeholder="Last Name" type="text" />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Suffix</Form.Label>
                            <Form.Control {...register('suffix')} placeholder="Suffix" type="text" />
                        </Form.Group>
                    </Col>
                    <Col sm={3} className='mb-0 position-relative' style={{ minHeight: '70px' }}>
                        <Form.Group>
                            <Form.Label className="mb-0">
                                NPI Number <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                {...register('npiNumber', {
                                    required: 'This field is required',
                                    minLength: { value: 10, message: 'NPI must be exactly 10 digits' },
                                    maxLength: { value: 10, message: 'NPI must be exactly 10 digits' },
                                    pattern: { value: /^[0-9]+$/, message: 'NPI must be numeric' },
                                })}
                                maxLength={10}
                                placeholder="NPI Number"
                                type="text"
                            />
                            {errors.npiNumber && (
                                <span
                                    className="text-danger position-absolute"
                                    style={{ top: '74%', left: '15px', fontSize: '0.8rem' }}>
                                    {errors.npiNumber.message}
                                </span>
                            )}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Email</Form.Label>
                            <Form.Control {...register('email')} placeholder="Email" type="email" />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group className="mb-0 position-relative" style={{ minHeight: '70px' }}>
                            <Form.Label className="mb-0">
                                Phone <span className="text-danger">*</span>
                            </Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="p-0 px-1 d-flex align-items-center justify-content-center fs-6 gap-1 fw-bold text-black">
                                    <img src={us} alt="country code flag" width={16} />
                                    +1
                                </InputGroup.Text>
                                <Form.Control
                                    type="tel"
                                    {...register('phone', {
                                        required: 'This field is required',
                                        pattern: {
                                            value: /^\(\d{3}\)\d{3}-\d{4}$/,
                                            message: 'Format: (XXX)XXX-XXXX',
                                        },
                                    })}
                                    onChange={(e) => {
                                        const rawValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        e.target.value = rawValue.replace(/(\d{1,3})(\d{0,3})(\d{0,4})/, (match, p1, p2, p3) => {
                                            if (p3) return `(${p1})${p2}-${p3}`;
                                            if (p2) return `(${p1})${p2}`;
                                            return `(${p1}`;
                                        });
                                        clearErrors('phone');
                                    }}
                                    placeholder="(XXX)XXX-XXXX"
                                />
                            </InputGroup>
                            {errors.phone && (
                                <span
                                    className="text-danger position-absolute"
                                    style={{ top: '74%', left: '15px', fontSize: '0.8rem' }}>
                                    {errors.phone.message}
                                </span>
                            )}
                        </Form.Group>
                    </Col>
                </Row>
                <hr />
                <AddressForm addresses={referringDoctorAddress} setAddresses={setReferringDoctorAddress} />
            </div>
            <div className="d-flex gap-2 align-items-end justify-content-end my-1">
                <Button
                    disabled={store?.addReferringDoctorReducer?.loading}
                    className="custom-buttons"
                    style={{ width: '200px' }}
                    type="submit">
                    {store?.addReferringDoctorReducer?.loading ? (
                        <Spinner color="white" className="spinner-border-sm" />
                    ) : (
                        'Save & Continue Editing'
                    )}
                </Button>
            </div>
        </Form>
    );
};

export default ReferringDoctor;
