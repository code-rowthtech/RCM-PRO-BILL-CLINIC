import { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Row, InputGroup, Spinner } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getStatesByCountryAction, getCitiesAction, addReferringDoctorAction } from '../../../redux/actions';
import us from '../../../assets/images/flags/us.jpg';
import { decryptMessage, encryptMessage } from '../../../cryptoUtils';
import AddressForm from '../Common Pages/AddressForm';
import { loggedInUser } from '../../../helpers/api/loggedInUser';
import { useSearchParams } from 'react-router-dom';
import ToastHandle from '../../../helpers/ToastMessage';
import ReactQuill from 'react-quill';
import useQuillWordLimit from '../../../helpers/quillWordLimit';

const MAX_WORDS = 1000;
const MAX_WORD_LENGTH = 45;
const ReferringDoctor = ({ setActiveTab }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('updateid');
    const quillRef = useRef(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        clearErrors,
        watch,
        control, setValue
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

    const clinicId = decryptMessage(localStorage?.getItem('subClinicLocation')) || '';

    const onSubmit = (data) => {
        if (!patientId) {
            setActiveTab('personalDetails');
            ToastHandle('Please create a patient record first before adding referring doctor.', 'danger');
            return;
        }
        const payload = {
            patientId: patientId,
            clinicId: clinicId || loggedInUser?.clinicId,
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

    const [refSource, setRefSource] = useState('');
    const handleLimitExceed = ({ type, message }) => {
        ToastHandle(message, 'danger');
    };

    useQuillWordLimit({
        quillRef,
        maxWords: MAX_WORDS,
        maxWordLength: MAX_WORD_LENGTH,
        onLimitExceed: handleLimitExceed,
        setValue,
        fieldName: 'note',
    });
    return (
        <Form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col sm={3}>
                    <Form.Group>
                        <Form.Label className="mb-0">{`Referring Source`}</Form.Label>
                        <Form.Select
                            {...register('referringSource')}
                            onChange={(e) => {
                                setRefSource(e.target.value);
                            }}
                            className="mb-3">
                            <option value="" hidden>
                                Select Referring Source
                            </option>
                            {['Referring Doctor', 'Referring Practice', 'Self', 'Other Healthcare Provider', 'Family/Friend',
                                'Online Search', 'Advertisement']?.sort((a, b) => a.localeCompare(b))?.map((source, index) => (
                                    <option key={index} value={source}>
                                        {source}
                                    </option>
                                ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            {refSource === 'Referring Doctor' || refSource === 'Referring Practice' ?
                <>
                    <Row className="pb-2">
                        <Col sm={12}>
                            <h5 className="text-black">{`Personal Details`}</h5>
                        </Col>
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Label className="mb-0">{`Prefix`}</Form.Label>
                                <Form.Control {...register('prefix')} placeholder="Prefix (Dr., Mr., Ms.)" type="text" />
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Label className="mb-0">{`First Name`}</Form.Label>
                                <Form.Control {...register('firstName')} placeholder="First Name" type="text" />
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Label className="mb-0">{`Middle Name`}</Form.Label>
                                <Form.Control {...register('middleName')} placeholder="Middle Name" type="text" />
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Label className="mb-0">{`Last Name`}</Form.Label>
                                <Form.Control {...register('lastName')} placeholder="Last Name" type="text" />
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Label className="mb-0">{`Suffix`}</Form.Label>
                                <Form.Control {...register('suffix')} placeholder="Suffix" type="text" />
                            </Form.Group>
                        </Col>
                        <Col sm={3} className="mb-0 position-relative" style={{ minHeight: '70px' }}>
                            <Form.Group>
                                <Form.Label className="mb-0">
                                    {`NPI Number`} <span className="text-danger">*</span>
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
                                )}{' '}
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group>
                                <Form.Label className="mb-0">{`Email`}</Form.Label>
                                <Form.Control {...register('email')} placeholder="Email" type="email" />
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group className="mb-0 position-relative" style={{ minHeight: '70px' }}>
                                <Form.Label className="mb-0">
                                    {`Phone`} <span className="text-danger">{`*`}</span>
                                </Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="ps-4 p-0 pe-1 fw-bold text-black">{`+1`}</InputGroup.Text>
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
                                            e.target.value = rawValue.replace(
                                                /(\d{1,3})(\d{0,3})(\d{0,4})/,
                                                (match, p1, p2, p3) => {
                                                    if (p3) return `(${p1})${p2}-${p3}`;
                                                    if (p2) return `(${p1})${p2}`;
                                                    return `(${p1}`;
                                                }
                                            );
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
                                        zIndex: 1,
                                    }}>
                                    <img src={us} alt="flag" width={20} />
                                </div>
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
                    <AddressForm addresses={referringDoctorAddress} setAddresses={setReferringDoctorAddress} />
                </>
                :
                <></>
            }
            <Row>
                <Form.Group>
                    <Form.Label className="fw-medium mb-1 d-flex justify-content-between align-items-center">
                        <div>
                            Notes{' '}
                            {/* <span
                                style={{ cursor: 'pointer' }}
                                title="Notes Suggestions"
                                onClick={handleEditorFocus}>
                                ✨
                            </span> */}
                        </div>
                        <small className="text-muted">
                            {(() => {
                                const content = watch('note') || '';
                                const plainText = quillRef?.current
                                    ?.getEditor()
                                    ?.getText()
                                    ?.trim();
                                const words = plainText?.split(/\s+/)?.filter(Boolean);
                                const wordCount = words?.length;
                                return (
                                    <div>
                                        <div>{`${wordCount} / ${MAX_WORDS} words`}</div>
                                    </div>
                                );
                            })()}
                        </small>
                    </Form.Label>
                    <Controller
                        name="note"
                        control={control}
                        defaultValue="<ul><li></li></ul>"
                        render={({ field: { onChange, value } }) => (
                            <ReactQuill
                                value={value}
                                ref={quillRef}
                                onChange={(content, delta, source) => {
                                    if (source === 'user') {
                                        onChange(content);
                                    }
                                }}
                                theme="snow"
                                placeholder="Enter detailed notes here..."
                                style={{ height: '24vh', backgroundColor: 'white' }}
                                modules={{
                                    toolbar: [
                                        [{ header: [1, 2, false] }],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ list: 'ordered' }, { list: 'bullet' }],
                                        ['clean'],
                                    ],
                                }}
                            />
                        )}
                    />
                </Form.Group>
            </Row>
            <Row className="mt-3">
                <div className="d-flex gap-2 justify-content-end mb-2 mt-md-4">
                    <Button className="cancel-button" onClick={() => reset()}>
                        {`Clear`}
                    </Button>
                    <Button
                        className="custom-buttons"
                        type="submit"
                        onClick={() => {
                            setSubmissionType('saveAndReset');
                        }}>
                        {`Save & Add Another`}
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
