import { unavailable } from '../../../helpers/showcase';
import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Form, Modal, Row, InputGroup, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getStatesByCountryAction, getCitiesAction, getCities2Action, getCities3Action, updatePatientsAction, addReferringDoctorAction } from "../../../redux/actions";
import us from '../../../assets/images/flags/us.jpg'
import { encryptMessage } from "../../../cryptoUtils";

const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    // Adjust if the current month/day is before the birth month/day
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
        years--;
        months += 12; // Add 12 months to the negative month difference
    }

    // Adjust the month difference for the day of the month
    if (today.getDate() < birthDate.getDate()) {
        months--;
    }

    // Ensure months is non-negative after adjustment
    if (months < 0) {
        months += 12;
    }

    return `${years}.${months}`;
};


const ReferringDoctor = ({ patientId }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, setValue, reset, clearErrors, watch, getValues } = useForm();
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [focused, setFocused] = useState(false);
    const [searchedLocations, setSearchedLocations] = useState(null);
    const [primaryCitySearch, setPrimaryCitySearch] = useState(null);
    const statesData = store?.getStatesReducer?.data;
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;

    const primaryState = watch('primaryStateName');
    useEffect(() => {
        dispatch(getStatesByCountryAction());
    }, [dispatch])
    useEffect(() => {
        if (primaryState) {
            const stateCity = statesData?.states?.find((data) => data?.state_code === primaryState)?.id
            dispatch(getCitiesAction({ state_code: stateCity, name: primaryCitySearch, limit: 25, skip: '' }))
        }
    }, [primaryState])
    useEffect(() => {
        if (primaryCitySearch) {
            setValue('primaryCity', cities1 && cities1.find((data) => data?.name === primaryCitySearch)?._id)
        }
    }, [primaryCitySearch, cities1])
    const onSubmit = (data) => {
        const payload = {
            patientId: patientId,
            type: 'Referring',
            ...(data?.firstName ? { firstName: data?.firstName } : {}),
            ...(data?.middleName ? { middleName: data?.middleName } : {}),
            ...(data?.lastName ? { lastName: data?.lastName } : {}),
            ...(data?.suffix ? { suffix: data?.suffix } : {}),
            ...(data?.npiNumber ? { npiNumber: data?.npiNumber } : {}),
            ...(data?.qualifier ? { qualifier: data?.qualifier } : {}),
            ...(data?.providerNumber ? { providerNumber: data?.providerNumber } : {}),
            ...(data?.specialty ? { specialty: data?.specialty } : {}),
            ...(data?.email ? { email: data?.email } : {}),
            ...(data?.phone ? { phone: data?.phone?.replace(/\D/g, '') } : {}),
            ...(data?.source ? { source: data?.source } : {}),
            ...(data?.primaryCarePhysician ? { primaryCarePhysician: data?.primaryCarePhysician } : {}),
            ...(data?.referralNumber ? { referralNumber: data?.referralNumber } : {}),
            address: {
                address: data?.primaryAddress,
                street: data?.primaryStreet,
                city: data?.primaryCity,
                state: data?.primaryStateName,
                zip: data?.primaryZip,
                latitude: latitude,
                longitude: longitude,
                timezone: data?.primaryTimeZone,

            }
        }
        dispatch(addReferringDoctorAction({ key: encryptMessage(payload) }))
    };

    const getGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed';
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await unavailable(url);
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error("Failed to fetch geocode data:", error);
                return null;
            }
        }
        fetchGeocodeData(addressToSearch)
            .then((data) => {
                if (data) {
                    setSearchedLocations(data?.results);
                } else {
                    console.log("No data returned.");
                }
            });
    }

    return (
        <>
            <Form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
                <Row style={{borderBottom:'1px solid #444141'}} className="pb-2">
                    <Col sm={12}>
                        <span className='text-black fw-semibold form-label'>Personal Details</span>
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
                            <Form.Label className="mb-0">NPI Number <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                {...register('npiNumber', {
                                    required: 'This field is required',
                                    minLength: {
                                        value: 10,
                                        message: 'NPI must be at least 10 characters long', // Error message
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: 'NPI cannot exceed 10 characters', // Error message
                                    },
                                    pattern: {
                                        value: /^[0-9]+$/, // Pattern for numbers only
                                        message: 'NPI must contain numbers only', // Error message
                                    },
                                })}
                                maxLength={10}
                                placeholder="NPI Number" type="text" />
                            {errors.npiNumber && <span className="text-danger">{errors.npiNumber.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Qualifier</Form.Label>
                            <Form.Control {...register('qualifier')} placeholder="Qualifier" type="text" />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Provider Number</Form.Label>
                            <Form.Control {...register('providerNumber')} placeholder="Provider Number" type="text" />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Speciality</Form.Label>
                            <Form.Control {...register('speciality')} placeholder="Speciality" type="text" />
                        </Form.Group>
                    </Col>


                </Row>
                <Row style={{borderBottom:'1px solid #444141'}} className="mt-1 pb-2">
                    <Col sm={12}>
                        <span className='text-black fw-semibold form-label'>Address Details</span>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="">
                            <Form.Label className="mb-0">Address</Form.Label>
                            <div style={{ position: 'relative' }}>
                                <Form.Control
                                    type="text"
                                    {...register('primaryAddress', {
                                    })}
                                    // value={searchedLocations}
                                    onChange={(e) => {
                                        getGeolocation(e);
                                        setFocused(true);
                                        clearErrors('primaryAddress');
                                    }}

                                    onFocus={() => setFocused(true)}
                                    onBlur={() => {
                                        setTimeout(() => setFocused(false), 200);
                                    }}
                                    placeholder="Search for address"
                                    autoComplete="off"
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        width: '100%',
                                        maxHeight: '150px',
                                        zIndex: 111,
                                        backgroundColor: '#fff',
                                        border: '1px solid #ced4da',
                                        borderTop: 'none',
                                    }}
                                    className={`scroll-container hover-bg-change ${searchedLocations?.length === 0 || !focused ? 'd-none' : ''}`}
                                >
                                    {searchedLocations?.map((data, index) => (
                                        <p
                                            key={index}
                                            onClick={() => {
                                                setValue('primaryZip', data?.components?.postcode)
                                                setValue('primaryStateName', data?.components?.state_code)
                                                setValue('primaryStreet', data?.components?.road)
                                                setLatitude(data?.bounds?.southwest?.lat);
                                                setPrimaryCitySearch(data?.components?.county)
                                                setLongitude(data?.bounds?.southwest?.lng);
                                                setValue('primaryAddress', data?.formatted)
                                                setFocused(false);
                                                setValue('primaryTimeZone', data?.annotations?.timezone?.name)
                                            }}
                                            style={{
                                                margin: 0,
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                            }}
                                            className="hover-bg-change text-black"
                                        >
                                            {data?.formatted}
                                        </p>
                                    ))}
                                    {searchedLocations?.length === 0 && <p className="text-muted px-2 py-1">No results found</p>}
                                </div>
                            </div>
                            {errors.address && <span className="text-danger">{errors.address.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group className="">
                            <Form.Label className='mb-0' >State</Form.Label>
                            <Form.Select
                                {...register('primaryStateName')}
                            >
                                <option value='' hidden>State</option>
                                {statesData?.states?.map((data) => (
                                    <option
                                        key={data?.name}
                                        data-key={data?.id}
                                        value={data?.state_code}
                                    >
                                        {data?.name}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.stateName && <span className="text-danger">{errors.stateName.message}</span>}
                        </Form.Group>

                    </Col>
                    <Col sm={3}>
                        <Form.Group className="">
                            <Form.Label className='mb-0'>City</Form.Label>
                            <Form.Select
                                disabled={store?.getCitiesReducer?.loading}
                                {...register('primaryCity')}
                            >
                                <option value='' hidden>{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                {cities1?.map((data) => (
                                    <option key={data?.name} value={data?._id}>
                                        {data?.name}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.city && <span className="text-danger">{errors.city.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group className="">
                            <Form.Label className='mb-0'>Latitude</Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={latitude}
                                placeholder="Latitude"
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group className="">
                            <Form.Label className='mb-0'>Longitude</Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={longitude}
                                placeholder="Longitude" />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group className="">
                            <Form.Label className='mb-0'>Street</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('primaryStreet')}
                                placeholder="Street" />
                            {errors.primaryStreet && <span className="text-danger">{errors.primaryStreet.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group className="">
                            <Form.Label className='mb-0'>Zip</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('primaryZip', {
                                    minLength: {
                                        value: 5,
                                        message: 'ZIP code must be at least 5 characters long',
                                    },
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: 'ZIP code must contain numbers only',
                                    },
                                })}
                                placeholder="Zip"
                                maxLength={5}
                            />
                            {errors.primaryZip && <span className="text-danger">{errors.primaryZip.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group className="">
                            <Form.Label className='mb-0'>Time Zone</Form.Label>
                            <Form.Control
                                type="text"
                                {...register('primaryTimeZone')}
                                placeholder="Time Zone"
                            />
                            {errors.primaryTimeZone && <span className="text-danger">{errors.primaryTimeZone.message}</span>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mt-1">
                    <Col sm={12}>
                        <span className='text-black fw-semibold form-label'>Additional Information</span>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Email</Form.Label>
                            <Form.Control {...register('email')} placeholder="Email" type="email" />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group className="mb-0 position-relative"  >
                            <Form.Label className="mb-0">
                                Phone <span className="text-danger">*</span>
                            </Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="ps-3 pe-1 fw-bold text-black" style={{height:'33px'}}>
                                    &nbsp;+1
                                </InputGroup.Text> {/* Prefix */}
                                <Form.Control
                                    type="tel"
                                    height='33px'
                                    {...register('phone', {
                                        required: 'This field is required',
                                        pattern: {
                                            value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                            message: 'Contact must be in the format (XXX)XXX-XXXX',
                                        },
                                        maxLength: {
                                            value: 13,
                                            message: 'Contact must not exceed 13 digits'
                                        },
                                        minLength: {
                                            value: 13,
                                            message: 'Contact must not be less than 13 digits'
                                        }
                                    }
                                    )}
                                    onChange={(e) => {
                                        let rawValue = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters
                                        if (rawValue.length > 10) rawValue = rawValue.slice(0, 10); // Limit to 10 digits
                                        const formattedValue = rawValue.replace(
                                            /(\d{1,3})(\d{0,3})(\d{0,4})/,
                                            (match, p1, p2, p3) => {
                                                if (p3) return `(${p1})${p2}-${p3}`;
                                                if (p2) return `(${p1})${p2}`;
                                                return `(${p1}`;
                                            }
                                        ); // Format dynamically as (XXX)XXX-XXXX
                                        e.target.value = formattedValue; // Update input value
                                        clearErrors('phone'); // Clear validation errors
                                    }}
                                    placeholder="(XXX)XXX-XXXX"
                                    maxLength={14}
                                    onKeyPress={(event) => {
                                        // Only allow numeric characters (0-9)
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                />
                            </InputGroup>

                            {/* Country code flag */}
                            <div className="position-absolute" style={{ top: '54%', left: '1%', transform: 'translateY(-16%)' }}>
                                <img src={us} alt="country code flag" width={20} />
                            </div>

                            {/* Error message */}
                            {errors.phone && (
                                <span className="text-danger">{errors.phone.message}</span>
                            )}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Fax</Form.Label>
                            <Form.Control {...register('fax')} placeholder="Fax" type="text" />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Source</Form.Label>
                            <Form.Control {...register('source')} placeholder="Source" type="text" />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Primary Care Physician</Form.Label>
                            <Form.Control {...register('primaryCarePhysician')} placeholder="Primary Care Physician" type="text" />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Referral Number</Form.Label>
                            <Form.Control {...register('referralNumber')} placeholder="Referral Number" type="text" />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col sm={12} className="d-flex justify-content-end">
                        <Button className="custom-buttons btn-height" type="submit">Save</Button>
                    </Col>
                </Row>
            </Form >

        </>


    );
};

export default ReferringDoctor;
