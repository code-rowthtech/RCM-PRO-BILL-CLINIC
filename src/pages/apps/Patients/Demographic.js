import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Form, Modal, Row, InputGroup, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getStatesByCountryAction, getCitiesAction, getCities2Action, getCities3Action, updatePatientsAction } from "../../../redux/actions";
import us from '../../../assets/images/flags/us.jpg'
import { encryptMessage } from "../../../cryptoUtils";



const Demographicdetails = ({ patientId }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue, reset, clearErrors, watch, getValues } = useForm();
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [mailingLongitude, setMailingLongitude] = useState(null);
    const [mailingLatitude, setMailingLatitude] = useState(null);
    const [employerLongitude, setEmployerLongitude] = useState(null);
    const [employerLatitude, setEmployerLatitude] = useState(null);
    const [focused, setFocused] = useState(false);
    const [mailingFocused, setMailingFocused] = useState(false);
    const [employerFocused, setEmployerFocused] = useState(false);
    const [searchedLocations, setSearchedLocations] = useState(null);
    const [primaryCitySearch, setPrimaryCitySearch] = useState(null);
    const [mailingCitySearch, setMailingCitySearch] = useState(null);
    const [employerCitySearch, setEmployerCitySearch] = useState(null);
    const [searchedMailingLocations, setSearchedMailingLocations] = useState(null);
    const [searchedEmployerLocations, setSearchedEmployerLocations] = useState(null);
    const [sameAsPrimary, setSameAsPrimary] = useState(false);
    const statesData = store?.getStatesReducer?.data;
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;
    const cities2 = store?.getCitiesReducer?.cities2?.data?.cities;

    const cities3 = store?.getCitiesReducer?.cities3?.data?.cities;
    const primaryState = watch('primaryStateName');
    const mailingState = watch('mailingStateName');
    const employerState = watch('employerStateName');
    useEffect(() => {
        dispatch(getStatesByCountryAction());
    }, [dispatch])

    useEffect(() => {
        if (primaryState) {
            const stateCity = statesData?.states?.find((data) => data?.state_code === primaryState)?.id
            dispatch(getCitiesAction({ state_code: stateCity, name: primaryCitySearch, limit: 25, skip: '' }))
        }
        if (mailingState) {
            const stateCity = statesData?.states?.find((data) => data?.state_code === mailingState)?.id
            dispatch(getCities2Action({ state_code: stateCity, name: mailingCitySearch, limit: 25, skip: '' }))
        }
        if (employerState) {
            const stateCity = statesData?.states?.find((data) => data?.state_code === employerState)?.id
            dispatch(getCities3Action({ state_code: stateCity, name: employerCitySearch, limit: 25, skip: '' }))
        }
    }, [primaryState, mailingState, employerState])
    useEffect(() => {
        if (primaryCitySearch) {
            setValue('primaryCity', primaryCitySearch)
        }
        if (mailingCitySearch) {
            setValue('mailingCity', mailingCitySearch)
        }
        if (employerCitySearch) {
            setValue('employerCity', employerCitySearch)
        }
    }, [primaryCitySearch, cities1, mailingCitySearch, cities2, employerCitySearch, cities3])
    const onSubmit = (data) => {
        const payload = {
            id: patientId,
            ...(data?.nationalIdNumber ? { nationalIdNumber: data?.nationalIdNumber } : {}),
            ...(data?.dateOfBirth ? { dateOfBirth: data?.dateOfBirth } : {}),
            ...(data?.approxAge ? { approxAge: data?.approxAge } : {}),
            ...(data?.sex ? { sex: data?.sex } : {}),
            ...(data?.genderIdentity ? { genderIdentity: data?.genderIdentity } : {}),
            ...(data?.sexualOrientation ? { sexualOrientation: data?.sexualOrientation } : {}),
            ...(data?.race ? { race: data?.race } : {}),
            ...(data?.raceSubcategories ? { raceSubcategories: data?.raceSubcategories } : {}),
            ...(data?.ethnicity ? { ethnicity: data?.ethnicity } : {}),
            ...(data?.preferredLanguage ? { preferredLanguage: data?.preferredLanguage } : {}),
            ...(data?.patientStudentStatus ? { patientStudentStatus: data?.patientStudentStatus } : {}),
            ...(data?.notes ? { notes: data?.notes } : {}),
            ...(data?.maritalStatus ? { maritalStatus: data?.maritalStatus } : {}),
            ...(data?.epsdtServices ? { epsdtServices: data?.epsdtServices } : {}),
            ...(data?.epsdtReferralCondition ? { epsdtReferralCondition: data?.epsdtReferralCondition } : {}),
            ...(data?.emergencyContactName ? { emergencyContactName: data?.emergencyContactName } : {}),
            ...(data?.emergencyContactPhone ? { emergencyContactPhone: data?.emergencyContactPhone?.replace(/\D/g, '') } : {}),
            ...(data?.emergencyContactRelation ? { emergencyContactRelation: data?.emergencyContactRelation } : {}),
            ...(data?.employerName ? { employerName: data?.employerName } : {}),
            ...(data?.employerPhone ? { employerPhone: data?.employerPhone?.replace(/\D/g, '') } : {}),
            employerAddress: {
                address: data?.employerAddress,
                street: data?.employerStreet,
                city: data?.employerCity,
                state: data?.employerStateName,
                zip: data?.employerZip,
                latitude: employerLatitude,
                longitude: employerLongitude,
                timeZone: data?.employerTimeZone
            },
            address: {
                address: data?.primaryAddress,
                street: data?.primaryStreet,
                city: data?.primaryCity,
                state: data?.primaryStateName,
                zip: data?.primaryZip,
                latitude: latitude,
                longitude: longitude,
                timeZone: data?.primaryTimeZone
            },
            mailingAddress: {
                address: data?.mailingAddress,
                street: data?.mailingStreet,
                city: data?.mailingCity,
                state: data?.mailingStateName,
                zip: data?.mailingZip,
                latitude: mailingLatitude,
                longitude: mailingLongitude,
                timeZone: data?.mailingTimeZone
            },
        }
        dispatch(updatePatientsAction({ key: encryptMessage(payload) }))
    };

    const getGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed';
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await fetch(url);
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
    const getMailingGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed';
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await fetch(url);
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
                    setSearchedMailingLocations(data?.results);
                } else {
                    console.log("No data returned.");
                }
            });
    }

    const getEmployerGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed';
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await fetch(url);
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
                    setSearchedEmployerLocations(data?.results);
                } else {
                    console.log("No data returned.");
                }
            });
    }
    return (
        <>
            <Form className="mt-1" onSubmit={handleSubmit(onSubmit)}>
                <Row style={{ borderBottom: '1px solid #444141' }} className="pb-2">
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Patient National ID Number</Form.Label>
                            <Form.Control placeholder="Patient National ID Number" type="text" {...register('nationalIdNumber')} />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Sex<span className='text-danger'>*</span></Form.Label>
                            <Form.Select
                                {...register('sex', { required: "Sex is required" })} >
                                <option value="">Select Sex</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>

                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Gender Identity<span className='text-danger'>*</span></Form.Label>
                            <Form.Select
                                {...register('genderIdentity', { required: "Gender identity is required" })} >
                                <option value="">Select Gender Identity</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Male-to-Female (MTF)/Transgender Female/Trans Woman">
                                    Male-to-Female (MTF)/Transgender Female/Trans Woman
                                </option>
                                <option value="Female-to-Male (FTM)/Transgender Male/Trans Man">
                                    Female-to-Male (FTM)/Transgender Male/Trans Man
                                </option>
                                <option value="Genderqueer">Genderqueer</option>
                                <option value="Other">Other</option>
                                <option value="Unknown">Unknown</option>
                                <option value="Choose not to disclose">Choose not to disclose</option>

                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Sexual Orientation<span className='text-danger'>*</span></Form.Label>
                            <Form.Select
                                {...register('sexualOrientation', { required: "Sexual Orientation is required" })} >
                                <option value="">Select Sexual Orientation</option>
                                <option value="Heterosexual">Heterosexual</option>
                                <option value="Lesbian or gay">Lesbian or gay</option>
                                <option value="Bisexual">Bisexual</option>
                                <option value="Other">Other</option>
                                <option value="Unknown">Unknown</option>
                                <option value="Choose not to disclose">Choose not to disclose</option>

                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Race<span className='text-danger'>*</span></Form.Label>
                            <Form.Select
                                {...register('race', { required: "Race is required" })} >
                                <option value="">Select Race</option>
                                <option value="American Indian or Alaska Native'">American Indian or Alaska Native'</option>
                                <option value="Asian">Asian</option>
                                <option value="Black or African American">Black or African American</option>
                                <option value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</option>
                                <option value="White">White</option>
                                <option value="Other Race">Other Race</option>
                                <option value="Declined To Specify">Declined To Specify</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Race SubCategories</Form.Label>
                            <Form.Control type="text" placeholder="Enter Race SubCategories" {...register('raceSubcategories')} />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Ethnicity</Form.Label>
                            <Form.Control type="text" placeholder="Enter Ethnicity" {...register('ethnicity')} />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Preferred Language</Form.Label>
                            <Form.Select
                                {...register('preferredLanguage',
                                )}
                            >
                                <option value="">Select Preferred Language</option>
                                <option value="English">English</option>
                                <option value="Chinese">Chinese</option>
                                <option value="French">French</option>
                                <option value="Italian">Italian</option>
                                <option value="Japanese">Japanese</option>
                                <option value="Spanish">Spanish</option>
                                <option value="Portugese">Portugese</option>
                                <option value="Russian">Russian</option>
                                <option value="Castilian">Castilian</option>
                                <option value="Other">Other</option>
                                <option value="Unknown">Unknown</option>
                                <option value="Declined to specify">Declined to specify</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Patient Student Status</Form.Label>
                            <Form.Select
                                {...register('patientStudentStatus',
                                )}
                            >
                                <option value="">Select Patient Student Status</option>
                                <option value="Employed">Employed</option>
                                <option value="Full-time Student">Full-time Student</option>
                                <option value="Not a Student">Not a Student</option>
                                <option value="Part-time Student">Part-time Student</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col sm={12}>
                        <Row style={{ borderBottom: '1px solid #444141' }} className="pb-2">
                            <Col sm={12} className='mt-1'>
                                <span className='text-black fw-semibold form-label'>Primary Address</span>
                            </Col>
                            <Col sm={6}>
                                <Row className='position-relative'>
                                    <Col sm={12}>
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

                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0'>Latitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                defaultValue={latitude}
                                                placeholder="Latitude"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0'>Longitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                defaultValue={longitude}
                                                placeholder="Longitude" />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
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
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6}>
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
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0'>City</Form.Label>
                                            <Form.Select
                                                disabled={store?.getCitiesReducer?.loading}
                                                {...register('primaryCity')}
                                            >
                                                <option value='' hidden >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                {cities1?.map((data) => (
                                                    <option key={data?.name} value={data?.name}>
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {errors.city && <span className="text-danger">{errors.city.message}</span>}
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0'>Street</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register('primaryStreet')}
                                                placeholder="Street" />
                                            {errors.primaryStreet && <span className="text-danger">{errors.primaryStreet.message}</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
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
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ borderBottom: '1px solid #444141' }} className="pb-2">
                    <Col sm={12}>
                        <Row>
                            <Col sm={12} className='mt-1'>
                                <span className='text-black fw-semibold form-label'>Mailing Address</span>
                                <Form.Check
                                    type="checkbox"
                                    label="Same as Primary Address"
                                    onChange={(e) => {

                                        if (e.target.checked) {
                                            setSameAsPrimary(true);
                                            setValue('mailingAddress', getValues('primaryAddress'));
                                            setValue('mailingZip', getValues('primaryZip'));
                                            setValue('mailingStreet', getValues('primaryStreet'));
                                            setValue('mailingTimeZone', getValues('primaryTimeZone'));
                                            setMailingLatitude(latitude);
                                            setMailingLongitude(longitude);
                                        } else {
                                            setSameAsPrimary(false)
                                            setValue('mailingAddress', '');
                                            setValue('mailingZip', '');
                                            setValue('mailingStreet', '');
                                            setValue('mailingTimeZone', '');
                                            setMailingLatitude(null);
                                            setMailingLongitude(null);
                                        }
                                    }}
                                />
                            </Col>
                            <Col sm={6}>
                                <Row className='position-relative'>
                                    <Col sm={12}>
                                        <Form.Group className="">
                                            <Form.Label className="mb-0">Address</Form.Label>
                                            <div style={{ position: 'relative' }}>
                                                <Form.Control
                                                    type="text"
                                                    {...register('mailingAddress', {
                                                    })}
                                                    onChange={(e) => {
                                                        getMailingGeolocation(e);
                                                        setMailingFocused(true);
                                                        clearErrors('address');
                                                    }}

                                                    onFocus={() => setMailingFocused(true)}
                                                    onBlur={() => {
                                                        setTimeout(() => setMailingFocused(false), 200);
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
                                                    className={`scroll-container hover-bg-change ${searchedMailingLocations?.length === 0 || !mailingFocused ? 'd-none' : ''}`}
                                                >
                                                    {searchedMailingLocations?.map((data, index) => (
                                                        <p
                                                            key={index}
                                                            onClick={() => {
                                                                setValue('mailingZip', data?.components?.postcode)
                                                                setValue('mailingStateName', data?.components?.state_code)
                                                                setMailingLatitude(data?.bounds?.southwest?.lat);
                                                                setMailingCitySearch(data?.components?.county)
                                                                setMailingLongitude(data?.bounds?.southwest?.lng);
                                                                setValue('mailingAddress', data?.formatted)
                                                                setMailingFocused(false);
                                                                setValue('mailingStreet', data?.components?.road)
                                                                setValue('mailingTimeZone', data?.annotations?.timezone?.name)
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
                                                    {searchedMailingLocations?.length === 0 && <p className="text-muted px-2 py-1">No results found</p>}
                                                </div>
                                            </div>
                                            {errors.mailingAddress && <span className="text-danger">{errors.mailingAddress.message}</span>}
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0'>Latitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                defaultValue={mailingLatitude}
                                                placeholder="Latitude"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0'>Longitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                defaultValue={mailingLongitude}
                                                placeholder="Longitude" />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0'>Time Zone</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register('mailingTimeZone')}
                                                placeholder="Time Zone"
                                            />
                                            {errors.mailingTimeZone && <span className="text-danger">{errors.mailingTimeZone.message}</span>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0' >State</Form.Label>
                                            {sameAsPrimary ?
                                                <Form.Control value={statesData?.states?.find((data) => data?.state_code === getValues('primaryStateName'))?.name} readOnly />
                                                :
                                                <>
                                                    <Form.Select
                                                        {...register('mailingStateName')}
                                                    >
                                                        <option value='' hidden >State</option>
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
                                                </>
                                            }

                                        </Form.Group>

                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0'>City</Form.Label>
                                            {sameAsPrimary ?
                                                <Form.Control value={getValues('primaryCity')} readOnly />
                                                :
                                                <>
                                                    <Form.Select
                                                        disabled={store?.getCitiesReducer?.loading}
                                                        {...register('mailingCity')}

                                                    >
                                                        <option value='' hidden>{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                        {cities2?.map((data) => (
                                                            <option key={data?.name} value={data?.name}>
                                                                {data?.name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                    {errors.city && <span className="text-danger">{errors.city.message}</span>}
                                                </>
                                            }

                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0'>Street</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register('mailingStreet')}
                                                placeholder="Street" />
                                            {errors.street && <span className="text-danger">{errors.street.message}</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0'>Zip</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register('mailingZip', {
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
                                            {errors.zip && <span className="text-danger">{errors.zip.message}</span>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ borderBottom: '1px solid #444141' }} className="mt-1 pb-2">
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Notes</Form.Label>
                            <Form.Control type="text" placeholder="Enter Notes" {...register('notes')} />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label htmlFor="marital" className="mb-0">Marital Status</Form.Label>
                            <Form.Select
                                id="marital"
                                {...register('maritalStatus')}
                            >
                                <option value="">Select marital status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                            {errors.maritalStatus && <span className="text-danger">{errors.maritalStatus.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">EPSDT Services</Form.Label>
                            <Form.Select
                                {...register('epsdtServices')}
                            >
                                <option value="">Select EPSDT Services</option>
                                <option value="Children">Children</option>
                                <option value="Family Planning">Family Planning</option>
                                <option value="Children / Family Planning">Children / Family Planning</option>
                            </Form.Select>
                            {errors.epsdtServices && <span className="text-danger">{errors.epsdtServices.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">EPSDT Referral Condition </Form.Label>
                            <Form.Select {...register('epsdtReferralCondition')} >
                                <option value="">Select EPSDT Referral Condition</option>
                                <option value="AV">Available - Not Used</option>
                                <option value="NU">Not Used</option>
                                <option value="S2">Under Treatment</option>
                                <option value="ST">New Services Requested</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                            {errors.epsdtReferralCondition && <span className="text-danger">{errors.epsdtReferralCondition.message}</span>}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Emergency Contact Name</Form.Label>
                            <Form.Control {...register('emergencyContactName')} type="text" placeholder="Enter Emergency Contact Name" />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        {/* <Form.Group>
                            <Form.Label className="mb-0">Emergency Contact Phone</Form.Label>
                            <Form.Control {...register('emergencyContactPhone')} type="text" placeholder="Enter Emergency Contact Phone" />
                        </Form.Group> */}
                        <Form.Group className="mb-0 position-relative">
                            <Form.Label className='mb-0'>Emergency Contact Phone <span className='text-danger'>*</span></Form.Label>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Text className='ps-3 pe-1 fw-bold text-black' style={{ height: '33px' }}>&nbsp;+1</InputGroup.Text> {/* This is the prefix */}
                                    <Form.Control
                                        type="tel"
                                        style={{ height: '33px' }}
                                        {...register('emergencyContactPhone', {
                                            pattern: {
                                                value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                                message: 'Contact must be in the format (XXX)XXX-XXXX',
                                            },
                                            maxLength: {
                                                value: 13, // Includes characters for (XXX)XXX-XXXX
                                                message: 'Contact must not exceed 13 characters'
                                            },
                                            minLength: {
                                                value: 13,
                                                message: 'Contact must not be less than 13 characters'
                                            }
                                        })}
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
                                            clearErrors('emergencyContactPhone'); // Clear validation errors
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
                            </Form.Group>

                            <div
                                className='position-absolute ' style={{ top: '48%', left: '1%' }}
                            >
                                <img
                                    src={us}
                                    alt="country code flag"
                                    width={20} />
                            </div>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Emergency Contact Relation</Form.Label>
                            <Form.Control {...register('emergencyContactRelation')} type="text" placeholder="Enter Emergency Contact Relation" />
                        </Form.Group>
                    </Col>
                </Row>
                <Row >
                    <Col sm={12}>
                        <Row>
                            <Col sm={12} className='mt-1'>
                                <span className='text-black fw-semibold form-label'>Employer Details</span>
                            </Col>
                            <Col sm={12}>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label className="mb-0">Employer Name</Form.Label>
                                            <Form.Control {...register('employerName')} type="text" placeholder="Enter Employer Name" />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="mb-0 position-relative">
                                            <Form.Label className='mb-0'>Employer Phone <span className='text-danger'>*</span></Form.Label>
                                            <Form.Group>
                                                <InputGroup>
                                                    <InputGroup.Text className='ps-3 pe-1 fw-bold text-black' style={{ height: '33px' }}>&nbsp;+1</InputGroup.Text> {/* This is the prefix */}
                                                    <Form.Control
                                                        type="tel"
                                                        style={{ height: '33px' }}
                                                        {...register('employerPhone', {
                                                            pattern: {
                                                                value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                                                message: 'Contact must be in the format (XXX)XXX-XXXX',
                                                            },
                                                            maxLength: {
                                                                value: 13, // Includes characters for (XXX)XXX-XXXX
                                                                message: 'Contact must not exceed 13 characters'
                                                            },
                                                            minLength: {
                                                                value: 13,
                                                                message: 'Contact must not be less than 13 characters'
                                                            }
                                                        })}
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
                                                            clearErrors('employerPhone'); // Clear validation errors
                                                        }}
                                                        placeholder="(XXX)XXX-XXXX"
                                                        maxLength={14}
                                                        onKeyPress={(event) => {
                                                            if (!/[0-9]/.test(event.key)) {
                                                                event.preventDefault();
                                                            }
                                                        }}
                                                    />
                                                </InputGroup>
                                            </Form.Group>

                                            <div
                                                className='position-absolute ' style={{ top: '48%', left: '1%' }}
                                            >
                                                <img
                                                    src={us}
                                                    alt="country code flag"
                                                    width={20} />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row className='position-relative'>
                                    <Col sm={12}>
                                        <Form.Group className="">
                                            <Form.Label className="mb-0">Address</Form.Label>
                                            <div style={{ position: 'relative' }}>
                                                <Form.Control
                                                    type="text"
                                                    {...register('employerAddress', {
                                                    })}
                                                    onChange={(e) => {
                                                        getEmployerGeolocation(e);
                                                        setEmployerFocused(true);
                                                        clearErrors('employerAddress');
                                                    }}

                                                    onFocus={() => setEmployerFocused(true)}
                                                    onBlur={() => {
                                                        setTimeout(() => setEmployerFocused(false), 200);
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
                                                    className={`scroll-container hover-bg-change ${searchedEmployerLocations?.length === 0 || !employerFocused ? 'd-none' : ''}`}
                                                >
                                                    {searchedEmployerLocations?.map((data, index) => (
                                                        <p
                                                            key={index}
                                                            onClick={() => {
                                                                setValue('employerZip', data?.components?.postcode)
                                                                setValue('employerStateName', data?.components?.state_code)
                                                                setValue('employerStreet', data?.components?.road)
                                                                setValue('employerTimeZone', data?.annotations?.timezone?.name)
                                                                setEmployerCitySearch(data?.components?.county)
                                                                setEmployerLatitude(data?.bounds?.southwest?.lat);
                                                                setEmployerLongitude(data?.bounds?.southwest?.lng);
                                                                setValue('employerAddress', data?.formatted)
                                                                setEmployerFocused(false);
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
                                            {errors.employerAddress && <span className="text-danger">{errors.employerAddress.message}</span>}
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0'>Latitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                defaultValue={employerLatitude}
                                                placeholder="Latitude"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0'>Longitude</Form.Label>
                                            <Form.Control
                                                type="text"
                                                defaultValue={employerLongitude}
                                                placeholder="Longitude" />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0'>Time Zone</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register('employerTimeZone')}
                                                placeholder="Time Zone"
                                            />
                                            {errors.employerTimeZone && <span className="text-danger">{errors.employerTimeZone.message}</span>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0' >State</Form.Label>
                                            <Form.Select
                                                {...register('employerStateName')}
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
                                            {errors.employerStateName && <span className="text-danger">{errors.employerStateName.message}</span>}
                                        </Form.Group>

                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0'>City</Form.Label>
                                            <Form.Select
                                                disabled={store?.getCitiesReducer?.loading}
                                                {...register('employerCity')}
                                            >
                                                <option hidden value='' >{store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}</option>
                                                {cities3?.map((data) => (
                                                    <option key={data?.name} value={data?.name}>
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {errors.employerCity && <span className="text-danger">{errors.employerCity.message}</span>}
                                        </Form.Group>
                                    </Col>

                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0'>Street</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register('employerStreet')}
                                                placeholder="Street" />
                                            {errors.employerStreet && <span className="text-danger">{errors.employerStreet.message}</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className='mb-0'>Zip</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register('employerZip', {
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
                                            {errors.employerZip && <span className="text-danger">{errors.employerZip.message}</span>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex justify-content-end">
                        <Button className="custom-buttons btn-height" type="submit">Save</Button>
                    </Col>
                </Row>
            </Form >

        </>


    );
};

export default Demographicdetails;
