import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getStatesByCountryAction, getCitiesAction, addReferringDoctorAction, stateEmptydAction } from '../../../redux/actions';
import us from '../../../assets/images/flags/us.jpg';
import { encryptMessage } from '../../../cryptoUtils';
import AddressForm from '../Common Pages/AddressForm';

const ReferringDoctor = ({ patientId, activeTab, setActiveTab }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
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
        { line: [''], city: '', state: '', postalCode: '', country: 'USA' },
    ]);
    const [submissionType, setSubmissionType] = useState(null);
    const createResponseReferring = store?.addReferringDoctorReducer?.data?.status;


    useEffect(() => {
        if (createResponseReferring === 200) {
            if (submissionType === 'saveAndNext') {
                reset();
                setActiveTab('insurance');
            } else if (submissionType === 'saveAndReset') {
                setActiveTab('personelDetails');
            }
        }
    }, [createResponseReferring, submissionType]);
    const primaryState = watch('primaryStateName');
    const primaryCitySearch = watch('primaryCity');

    useEffect(() => {
        dispatch(getStatesByCountryAction());
    }, [dispatch]);

    useEffect(() => {
        if (primaryState) {
            const stateCity = store?.getStatesReducer?.data?.states?.find(
                (data) => data?.state_code === primaryState
            )?.id;
            dispatch(getCitiesAction({ state_code: stateCity, name: primaryCitySearch, limit: 25 }));
        }
    }, [primaryState, primaryCitySearch, dispatch]);

    const onSubmit = (data) => {
        const payload = {
            patientId: patientId,
            type: 'Referring',
            identifier: [
                {
                    system: 'http://hl7.org/fhir/sid/us-npi',
                    value: data.npiNumber,
                    type: 'NPI',
                },
            ],
            name: {
                prefix: data.prefix ? [data.prefix] : [],
                given: [data.firstName, data.middleName].filter(Boolean), // Removing empty values
                family: data.lastName,
                suffix: data.suffix ? [data.suffix] : [],
            },
            telecom: [
                ...(data.phone ? [{ system: 'phone', value: data.phone.replace(/\D/g, '') }] : []),
                ...(data.email ? [{ system: 'email', value: data.email }] : []),
                ...(data.fax ? [{ system: 'fax', value: data.fax }] : []),
            ],
            address: referringDoctorAddress,
            practitionerRole: [
                {
                    role: {
                        coding: [
                            {
                                system: 'http://terminology.hl7.org/CodeSystem/practitioner-role',
                                code: data.speciality,
                                display: data.speciality,
                            },
                        ],
                    },
                    organization: data.source
                        ? {
                              reference: `Organization/${data.source.replace(/\s/g, '-').toLowerCase()}`,
                              display: data.source,
                          }
                        : undefined,
                },
            ],
        };
        dispatch(addReferringDoctorAction({ key: encryptMessage(payload) }));
    };

    return (
        <Form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
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
                <Col sm={3}>
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
                        {errors.npiNumber && <span className="text-danger">{errors.npiNumber.message}</span>}
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group>
                        <Form.Label className="mb-0">Email</Form.Label>
                        <Form.Control {...register('email')} placeholder="Email" type="email" />
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group className="mb-0 position-relative">
                        <Form.Label className="mb-0">
                            Phone <span className="text-danger">*</span>
                        </Form.Label>
                        <InputGroup>
                            <InputGroup.Text className="ps-3 pe-1 fw-bold text-black" style={{ height: '33px' }}>
                                &nbsp;+1
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
                                    let rawValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    e.target.value = rawValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1)$2-$3');
                                    clearErrors('phone');
                                }}
                                placeholder="(XXX)XXX-XXXX"
                            />
                        </InputGroup>
                        <div
                            className="position-absolute"
                            style={{ top: '54%', left: '1%', transform: 'translateY(-16%)' }}>
                            <img src={us} alt="country code flag" width={20} />
                        </div>
                        {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
                    </Form.Group>
                </Col>
            </Row>
            <hr />
            <AddressForm addresses={referringDoctorAddress} setAddresses={setReferringDoctorAddress} />
            <Row className="mt-2">
                <div className="d-flex gap-2 justify-content-end mb-2 mt-md-4">
                    <Button
                        className="cancel-button"
                        onClick={() => reset()}
                    >
                        Clear
                    </Button>
                    <Button className="custom-buttons" type="submit"
                     onClick={() => {
                        setSubmissionType('saveAndReset');
                    }}>
                        
                        Save & Add Another
                    </Button>
                    <Button
                        onClick={() => {
                            setSubmissionType('saveAndNext');
                        }}
                        // disabled={store?.updatePatientsReducer?.loading
                        className="custom-buttons"
                        type="submit">
                        Save & Continue Editing
                    </Button>
                </div>
            </Row>
        </Form>
    );
};

export default ReferringDoctor;
