import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, InputGroup, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiUploadCloud } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    getStatesByCountryAction,
    getCitiesAction,
    getCities2Action,
    getCities3Action,
    updatePatientsAction,
} from '../../../../redux/actions';
import us from '../../../../assets/images/flags/us.jpg';
import { encryptMessage } from '../../../../cryptoUtils';
import { genderIdentityOptions } from '../../../../utils/DataSets/genderIdentities';
import { sexParameterOptions } from '../../../../utils/DataSets/SexParameterforClinicalUse';
import { personalPronounsOptions } from '../../../../utils/DataSets/personalPronouns';
import { raceOptions } from '../../../../utils/DataSets/race.data';
import { dataList } from '../../../../utils/DataSets/relations.data';
import { ethnicityOptions } from '../../../../utils/DataSets/enthnicity.data';
import { tribalEntitiesOptions } from '../../../../utils/DataSets/tribalEntities';
import IdentifierForm from '../../Common Pages/IdentifierForm';
import { sexAssignedAtBirthOptions } from '../../../../utils/DataSets/sex';
import { maritalStatusOptions } from '../../../../utils/DataSets/maritalStatus';
import AddressForm from '../../Common Pages/AddressForm';
import Select from 'react-select';
import { error } from 'jquery';

const Demographicdetails = ({ patientId }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        clearErrors,
        watch,
        reset,
        getValues,
    } = useForm();
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

    const patientDetails = store?.getPatientByIdReducer?.data?.data;
    console.log(patientDetails,'patientDetails')

    const [demographicAddresses, setDemographicAddresses] = useState([
        { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: '' },
    ]);

    const updateResponse = store?.updatePatientsReducer?.data?.status;
    const formatPhoneNumber = (phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]})${match[2]}-${match[3]}`;
        }
        return phone; // fallback if not 10 digits
    };
    useEffect(() => {
        dispatch(getStatesByCountryAction());
    }, [dispatch]);

    useEffect(() => {
        if (employerState) {
            const stateCity = statesData?.states?.find((data) => data?.state_code === employerState)?.id;
            dispatch(getCities3Action({ state_code: stateCity, name: employerCitySearch, limit: 25, skip: '' }));
        }
    }, [employerState]);
    useEffect(() => {
        if (employerCitySearch) {
            setValue('employerCity', employerCitySearch);
        }
    }, [employerCitySearch, cities3]);
    useEffect(() => {
        if (patientDetails) {
            setValue('race', patientDetails?.race?.[0]?.code || '');
            setValue('raceSubcategories', patientDetails?.raceSubcategories);
            setValue('sex', patientDetails?.birthSex?.code || '');
            setValue('genderIdentity', patientDetails?.gender);
            setValue('sexualOrientation', patientDetails?.sexualOrientation);
            setValue('patientStudentStatus', patientDetails?.patientStudentStatus);
            setValue('nationalIdNumber', patientDetails?.nationalIdNumber);
            setValue('preferredLanguage', patientDetails?.communication?.[0]?.language?.coding?.[0]?.code || '');
            setValue('trible', patientDetails?.trible?.[0]?.code || '');
            setValue('ethnicity', patientDetails?.ethnicity?.[0]?.code || '');
            setValue('notes', patientDetails?.notes);
            setValue('maritalStatus', patientDetails?.maritalStatus?.coding?.[0]?.code || '');
            setValue('epsdtServices', patientDetails?.epsdtServices);
            setValue('epsdtReferralCondition', patientDetails?.epsdtReferralCondition);

            // ✅ Emergency Contact Fix
            setValue('emergencyContactName', patientDetails?.contact?.[0]?.name?.text || '');
            setValue(
                'emergencyContactPhone',
                formatPhoneNumber(patientDetails?.contact?.[0]?.telecom?.[0]?.value)
            );
            setValue('emergencyContactRelation', patientDetails?.contact?.[0]?.relationship?.[0]?.text || '');

            // ✅ Employer Details Fix
            setValue('employerName', patientDetails?.employerDetails?.employerName || '');
            setValue('employmentStatus', patientDetails?.employerDetails?.employmentStatus || '');
            setValue('occupation', patientDetails?.employerDetails?.occupation || '');

            // ✅ Employer Address Fix
            setValue('employerCity', patientDetails?.employerDetails?.workLocation?.address?.city || '');
            setValue('employerStateName', patientDetails?.employerDetails?.workLocation?.address?.state || '');
            setValue('employerZip', patientDetails?.employerDetails?.workLocation?.address?.postalCode || '');
            setValue(
                'employerPhone',
                formatPhoneNumber(patientDetails?.employerDetails?.employerPhone || '')
            );
         
        }
    }, [patientDetails]);
 

    const onSubmit = (data) => {
        console.log(data, 'formData');
        let finalIdentifiers = [];
        identifiers.forEach((element) => {
            console.log(element, 'element');
            data = {
                type: element?.type?.code,
                system: element?.type?.value,
                value: element?.number,
                issuingAuthority: element?.issuingAuthority,
                file: element?.file,
                expiry: element?.expiry,
            };
            finalIdentifiers.push(data);
        });
        console.log(finalIdentifiers, 'finalIdentifiers');
        const payload = {
            id: id,
            ...(data?.nationalIdNumber && { nationalIdNumber: data.nationalIdNumber }),
            ...(data?.sex && { birthSex: { code: data.sex } }),
            ...(data?.genderIdentity && { gender: data.genderIdentity }),
            ...(data?.sexualOrientation && { sexualOrientation: data.sexualOrientation }),
            // ✅ Fixing Race & Ethnicity Structure
            ...(data?.race && { race: [{ system: 'http://hl7.org/fhir/v3/Race', code: data.race }] }),
            // ...(data?.ethnicity && {
            // }),
            ethnicity: [{ system: 'http://hl7.org/fhir/v3/Ethnicity', display: eth }],
            trible: [{ system: 'http://hl7.org/fhir/v3/Ethnicity', display: tri }],
            trible: [{ system: 'http://hl7.org/fhir/v3/Ethnicity', display: rela }],



            // ✅ Fixing Marital Status Structure
            ...(data?.maritalStatus && {
                maritalStatus: {
                    coding: [
                        {
                            system: 'http://terminology.hl7.org/CodeSystem/v3-MaritalStatus',
                            code: data.maritalStatus,
                            display: data.maritalStatusDisplay || '',
                        },
                    ],
                },
            }),

            // ✅ Fixing Preferred Language Structure
            ...(data?.preferredLanguage && {
                communication: [
                    {
                        language: {
                            coding: [
                                {
                                    system: 'urn:ietf:bcp:47',
                                    code: data.preferredLanguage,
                                    display: data.languageDisplay || '',
                                },
                            ],
                        },
                        preferred: true,
                    },
                ],
            }),

            ...(data?.patientStudentStatus && { patientStudentStatus: data.patientStudentStatus }),
            ...(data?.notes && { notes: data.notes }),
            ...(data?.epsdtServices && { epsdtServices: data.epsdtServices }),
            ...(data?.epsdtReferralCondition && { epsdtReferralCondition: data.epsdtReferralCondition }),

            // ✅ Fixing Emergency Contact Field
            ...(data?.emergencyContactName && {
                contact: [
                    {
                        relationship: [{ text: data?.emergencyContactRelation }],
                        name: { text: data?.emergencyContactName },
                        telecom: [{ system: 'phone', value: data?.emergencyContactPhone.replace(/\D/g, '') }],
                    },
                ],
            }),

            ...(data?.employerName && { employerName: data.employerName }),
            ...(data?.employerPhone && {
                employerPhone: data.employerPhone ? data.employerPhone.replace(/\D/g, '') : '',
            }),
            // ✅ Fixing Employer Address (No latitude/longitude/timeZone)
            employerDetails: {
                employerName: data?.employerName,
                employerPhone: data?.employerPhone ? data.employerPhone.replace(/\D/g, '') : '', // ✅ Fixed
                employmentStatus: data?.employmentStatus,
                occupation: data?.occupation,
                workLocation: {
                    address: {
                        city: data?.employerCity,
                        state: data?.employerStateName,
                        postalCode: data?.employerZip,
                        country: 'US',
                    },
                },
            },

            identifier: finalIdentifiers,
            address: demographicAddresses,
        };
        console.log('Payload:', payload);
        dispatch(updatePatientsAction({ key: encryptMessage(payload) }));
    };

    const getEmployerGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed';
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
                location
            )}&key=${apiKey}&language=en&pretty=1&countrycode=us`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error fetching data: ${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Failed to fetch geocode data:', error);
                return null;
            }
        }
        fetchGeocodeData(addressToSearch).then((data) => {
            if (data) {
                setSearchedEmployerLocations(data?.results);
            } else {
                console.log('No data returned.');
            }
        });
    };

    const formattedEthnicityOptions = ethnicityOptions.map((ethnicity) => ({
        value: ethnicity, // Code as the value
        label: ethnicity.display, // Display text as the label
    }));
    const formattedTribleOptions = tribalEntitiesOptions.map((tribal) => ({
        value: tribal, // Code as the value
        label: tribal.display, // Display text as the label
    }));
    const relationshipOption = dataList?.map((relation) => ({
        value: relation, // Code as the value
        label: relation.display, // Display text as the label
    }));

    const [eth, setEth] = useState(null); // Store selected ethnicity
    const handleEthnicityChange = (selectedOption) => {
        setEth(selectedOption?.value?.display); // Store value in state
    };
    const [rela, setRela] = useState(null); // Store selected relationship
    const handleRelationChange = (selectedOption) => {
        setRela('relation', selectedOption ? selectedOption.display : '');
    };
const [tri, setTri] = useState(null); // Store selected tribal entity
    const handleTribalChange = (selectedOption) => {
        setTri('tribal', selectedOption ? selectedOption.display : '');
    };
    const [identifiers, setIdentifiers] = useState([]);

    return (
        <div className="scroll-container" style={{ overflow: 'scroll', height: '65vh' }}>
            <Form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
                <IdentifierForm
                    defaultIdentifiers={[
                        {
                            label: 'National Provider Identifier (NPI)',
                            value: 'http://hl7.org/fhir/sid/us-npi',
                            code: 'NPI',
                        },
                    ]}
                    identifiers={identifiers}
                    setIdentifiers={setIdentifiers}
                    onChange={(data) => console.log('Updated Identifiers:', data)}
                />

                <hr className="mt-0" />
                <Row className="pb-2">
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Sex</Form.Label>
                            <Form.Select {...register('sex')}>
                                <option value="" hidden>
                                    Select Sex
                                </option>
                                {sexAssignedAtBirthOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Gender Identity</Form.Label>
                            <Form.Select {...register('genderIdentity')}>
                                <option value="" hidden>
                                    Select
                                </option>
                                {genderIdentityOptions?.map((option) => (
                                    <option key={option?.value} value={option?.value}>
                                        {option?.show}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Sexual Orientation</Form.Label>
                            <Form.Select {...register('sexualOrientation')}>
                                <option value="" hidden>
                                    Select
                                </option>
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
                            <Form.Label className="mb-0">Sex Parameter for Clinical Use</Form.Label>
                            <Form.Select {...register('sexParameter')}>
                                <option value="" hidden>
                                    Select
                                </option>
                                {sexParameterOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.show}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Personal Pronouns</Form.Label>
                            <Form.Select {...register('personalPronouns')}>
                                <option value="" hidden>
                                    Select Pronouns
                                </option>
                                {personalPronounsOptions?.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.show}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Race</Form.Label>
                            <Form.Select {...register('race')}>
                                <option value="">Select Race</option>
                                {raceOptions.map((race) => (
                                    <option key={race.code} value={race.display}>
                                        {race.display}
                                    </option>
                                ))}
                                <option value="Declined To Specify">Declined To Specify</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Ethnicity</Form.Label>
                            <Select
                                options={formattedEthnicityOptions}
                                isSearchable
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="&nbsp; Select"
                                value={
                                    formattedEthnicityOptions.find((option) => option?.value?.display === eth) ||
                                    null
                                } // Show selected value
                                onChange={handleEthnicityChange}
                                onMenuOpen={() => console.log('Dropdown Opened')}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '30px',
                                        minHeight: '30px',
                                        border: '0px',
                                    }),
                                    placeholder: (provided) => ({
                                        ...provided,
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        paddingBottom: '5px',
                                    }),
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Preferred Language</Form.Label>
                            <Form.Select {...register('preferredLanguage')}>
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
                            <Form.Label className="mb-0">Tribal Entity</Form.Label>
                            <Select
                                options={formattedTribleOptions} // Use the formatted array
                                isSearchable
                                className="basic-single"
                                classNamePrefix="select"
                                value={
                                    formattedTribleOptions.find((option) => option?.value?.display === tri) ||
                                    null
                                } // Show selected value
                                placeholder="&nbsp; Select "
                                onChange={handleTribalChange}
                                onMenuOpen={() => console.log('Dropdown Opened')}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '30px',
                                        minHeight: '30px',
                                        border: '0px',
                                    }),
                                    placeholder: (provided) => ({
                                        ...provided,
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        paddingBottom: '5px',
                                    }),
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label htmlFor="marital" className="mb-0">
                                Marital Status
                            </Form.Label>
                            <Form.Select id="marital" {...register('maritalStatus')}>
                                <option value="">Select marital status</option>
                                {maritalStatusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.show}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.maritalStatus && (
                                <span className="text-danger">{errors.maritalStatus.message}</span>
                            )}
                        </Form.Group>
                    </Col>
                </Row>
                <hr />
                <AddressForm addresses={demographicAddresses} setAddresses={setDemographicAddresses} />
                <hr />

                <Row className="mt-1 pb-2">
                    <Col sm={12}>
                        <h5>Emergency Contact Details</h5>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Emergency Contact Name</Form.Label>
                            <Form.Control
                                {...register('emergencyContactName')}
                                type="text"
                                placeholder="Enter Emergency Contact Name"
                            />
                            {errors.emergencyContactName && (
                                <span className="text-danger">{errors.emergencyContactName.message}</span>
                            )}
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group className="mb-0 position-relative">
                            <Form.Label className="mb-0">Emergency Contact Phone </Form.Label>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Text
                                        className="ps-3 pe-1 fw-bold text-black"
                                        style={{ height: '33px' }}>
                                        &nbsp;+1
                                    </InputGroup.Text>{' '}
                                    {/* This is the prefix */}
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
                                                message: 'Contact must not exceed 13 characters',
                                            },
                                            minLength: {
                                                value: 13,
                                                message: 'Contact must not be less than 13 characters',
                                            },
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

                            <div className="position-absolute " style={{ top: '48%', left: '1%' }}>
                                <img src={us} alt="country code flag" width={20} />
                            </div>
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Emergency Contact Relation</Form.Label>
                            <Select
                                options={relationshipOption} // Use the formatted array
                                isSearchable
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="&nbsp; Select "
                                value={
                                    relationshipOption.find((option) => option?.value?.display === rela) ||
                                    null
                                } // Show selected value
                                onChange={handleRelationChange}
                                onMenuOpen={() => console.log('Dropdown Opened')}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '30px',
                                        minHeight: '30px',
                                        border: '0px',
                                    }),
                                    placeholder: (provided) => ({
                                        ...provided,
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        paddingBottom: '5px',
                                    }),
                                }}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col sm={12}>
                        <Row>
                            <Col sm={12} className="mt-1">
                                <h5>Employer Details</h5>
                            </Col>
                            <Col sm={12}>
                                <Row>
                                    <Col sm={3}>
                                        <Form.Group>
                                            <Form.Label className="mb-0">Employer Name</Form.Label>
                                            <Form.Control
                                                {...register('employerName')}
                                                type="text"
                                                placeholder="Enter Employer Name"
                                            />
                                            {errors.employerName && (
                                                <span className="text-danger">{errors.employerName.message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Group className="mb-0 position-relative">
                                            <Form.Label className="mb-0">Employer Phone </Form.Label>
                                            <Form.Group>
                                                <InputGroup>
                                                    <InputGroup.Text
                                                        className="ps-3 pe-1 fw-bold text-black"
                                                        style={{ height: '33px' }}>
                                                        &nbsp;+1
                                                    </InputGroup.Text>{' '}
                                                    {/* This is the prefix */}
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
                                                                message: 'Contact must not exceed 13 characters',
                                                            },
                                                            minLength: {
                                                                value: 13,
                                                                message: 'Contact must not be less than 13 characters',
                                                            },
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
                                                    {errors.employerPhone && (
                                                        <span className="text-danger">
                                                            {errors.employerPhone.message}
                                                        </span>
                                                    )}
                                                </InputGroup>
                                            </Form.Group>

                                            <div className="position-absolute " style={{ top: '48%', left: '1%' }}>
                                                <img src={us} alt="country code flag" width={20} />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Employment Status</Form.Label>
                                            <Form.Select {...register('employmentStatus')}>
                                                <option value="">Select Employment Status</option>
                                                <option value="employed">Employed</option>
                                                <option value="self-employed">Self-Employed</option>
                                                <option value="unemployed">Unemployed</option>
                                                <option value="retired">Retired</option>
                                                <option value="student">Student</option>
                                                <option value="unknown">Unknown</option>
                                            </Form.Select>
                                            {errors.employmentStatus && (
                                                <span className="text-danger">{errors.employmentStatus.message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={3}>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="mb-1">Occupation</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Occupation"
                                                {...register('occupation', {
                                                    minLength: {
                                                        value: 2,
                                                        message: 'Occupation must be at least 2 characters long',
                                                    },
                                                })}
                                            />
                                            {errors.occupation && (
                                                <span className="text-danger">{errors.occupation.message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row className="position-relative">
                                    <Col sm={12}>
                                        <Form.Group className="">
                                            <Form.Label className="mb-0">Address</Form.Label>
                                            <div style={{ position: 'relative' }}>
                                                <Form.Control
                                                    type="text"
                                                    {...register('employerAddress', {})}
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
                                                    className={`scroll-container hover-bg-change ${
                                                        searchedEmployerLocations?.length === 0 || !employerFocused
                                                            ? 'd-none'
                                                            : ''
                                                    }`}>
                                                    {searchedEmployerLocations?.map((data, index) => (
                                                        <p
                                                            key={index}
                                                            onClick={() => {
                                                                setValue('employerZip', data?.components?.postcode);
                                                                setValue(
                                                                    'employerStateName',
                                                                    data?.components?.state_code
                                                                );
                                                                setValue('employerStreet', data?.components?.road);
                                                                setValue(
                                                                    'employerTimeZone',
                                                                    data?.annotations?.timezone?.name
                                                                );
                                                                setEmployerCitySearch(data?.components?.county);
                                                                setEmployerLatitude(data?.bounds?.southwest?.lat);
                                                                setEmployerLongitude(data?.bounds?.southwest?.lng);
                                                                setValue('employerAddress', data?.formatted);
                                                                setEmployerFocused(false);
                                                            }}
                                                            style={{
                                                                margin: 0,
                                                                padding: '8px 12px',
                                                                cursor: 'pointer',
                                                            }}
                                                            className="hover-bg-change text-black">
                                                            {data?.formatted}
                                                        </p>
                                                    ))}
                                                    {searchedLocations?.length === 0 && (
                                                        <p className="text-muted px-2 py-1">No results found</p>
                                                    )}
                                                </div>
                                            </div>
                                            {errors.employerAddress && (
                                                <span className="text-danger">{errors.employerAddress.message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className="mb-0">State</Form.Label>
                                            <Form.Select {...register('employerStateName')}>
                                                <option value="" hidden>
                                                    State
                                                </option>
                                                {statesData?.states?.map((data) => (
                                                    <option
                                                        key={data?.name}
                                                        data-key={data?.id}
                                                        value={data?.state_code}>
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {errors.employerStateName && (
                                                <span className="text-danger">{errors.employerStateName.message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className="mb-0">City</Form.Label>
                                            <Form.Select
                                                disabled={store?.getCitiesReducer?.loading}
                                                {...register('employerCity')}>
                                                <option hidden value="">
                                                    {store?.getCitiesReducer?.loading ? 'Loading...' : 'City'}
                                                </option>
                                                {cities3?.map((data) => (
                                                    <option key={data?.name} value={data?.name}>
                                                        {data?.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {errors.employerCity && (
                                                <span className="text-danger">{errors.employerCity.message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={6}>
                                <Row>
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className="mb-0">Zip</Form.Label>
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
                                            {errors.employerZip && (
                                                <span className="text-danger">{errors.employerZip.message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group className="">
                                            <Form.Label className="mb-0">Time Zone</Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...register('employerTimeZone')}
                                                placeholder="Time Zone"
                                            />
                                            {errors.employerTimeZone && (
                                                <span className="text-danger">{errors.employerTimeZone.message}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col sm={6}>
                        <Form.Group>
                            <Form.Label className="mb-0">Notes</Form.Label>
                            <Form.Control type="text" placeholder="Enter Notes" {...register('notes')} />
                            {errors.notes && <span className="text-danger">{errors.notes.message}</span>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="my-2">
                    <Col className="d-flex justify-content-end">
                        <Button
                            className="custom-buttons btn-height"
                            disabled={store?.updatePatientsReducer?.loading}
                            type="submit">
                            Save
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default Demographicdetails;
