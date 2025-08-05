import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, InputGroup, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getStatesByCountryAction, getCitiesAction, addReferringDoctorAction } from '../../../redux/actions';
import us from '../../../assets/images/flags/us.jpg';
import { encryptMessage } from '../../../cryptoUtils';
import AddressForm from '../Common Pages/AddressForm';
import { loggedInUser } from '../../../helpers/api/loggedInUser';

const ReferringDoctor = ({ patientId, setActiveTab }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const clinicId = JSON.parse(localStorage.getItem('hyper_user'))?.data?._id;
    const {
        register,
        handleSubmit,
        formState: { errors },
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
        if (createResponseReferring === 201) {
            if (submissionType === 'saveAndNext') {
                setActiveTab('insurance');
            } else if (submissionType === 'saveAndReset') {
                reset();
                setActiveTab('personalDetails');
            }
        }
    }, [createResponseReferring]);
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
            clinicId: loggedInUser?.clinicId,
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
        };
        dispatch(addReferringDoctorAction({ key: encryptMessage(payload) }));
    };

    return (
        <Form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
            <Row className="pb-2">
                <Col sm={12}>
                    <h5 className="text-black">Personal Details</h5>
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
                            <InputGroup.Text className="ps-4 p-0 pe-1 fw-bold text-black">+1</InputGroup.Text>
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
                            style={{
                                left: '10px',
                                top: '35px',
                                transform: 'translateY(-50%)',
                                zIndex: 1
                            }}>
                            <img src={us} alt="flag" width={20} />
                        </div>
                        {errors.phone && <span className="text-danger d-block">{errors.phone.message}</span>}
                    </Form.Group>
                </Col>
            </Row>
            {/* <hr /> */}
            <AddressForm addresses={referringDoctorAddress} setAddresses={setReferringDoctorAddress} />
            <Row className="mt-2">
                <div className="d-flex gap-2 justify-content-end mb-2 mt-md-4">
                    <Button className="cancel-button" onClick={() => reset()}>
                        Clear
                    </Button>
                    <Button
                        className="custom-buttons"
                        type="submit"
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
                        disabled={store?.addReferringDoctorReducer?.loading}
                        style={{ width: '200px' }}
                        type="submit">
                        {store?.addReferringDoctorReducer?.loading ? (
                            <Spinner animation="border" variant="light" size="sm" className="me-1" />
                        ) : (
                            'Save & Continue'
                        )}
                    </Button>
                </div>
            </Row>
        </Form>
    );
};

export default ReferringDoctor;
