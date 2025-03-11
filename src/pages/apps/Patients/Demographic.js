import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, InputGroup, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiDownloadCloud, FiUploadCloud } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    getStatesByCountryAction,
    getCitiesAction,
    getCities2Action,
    getCities3Action,
    updatePatientsAction,
    stateEmptydAction,
} from '../../../redux/actions';
import us from '../../../assets/images/flags/us.jpg';
import { encryptMessage } from '../../../cryptoUtils';
import { handleUpload } from '../../../helpers/HandleUpload';
import { CiCircleMinus } from 'react-icons/ci';
import { raceOptions } from '../../../utils/DataSets/race.data';
import { ethnicityOptions } from '../../../utils/DataSets/enthnicity.data';
import Select from 'react-select';
import { genderIdentityOptions } from '../../../utils/DataSets/genderIdentities';
import { sexAssignedAtBirthOptions } from '../../../utils/DataSets/sex';
import { sexParameterOptions } from '../../../utils/DataSets/SexParameterforClinicalUse';
import { personalPronounsOptions } from '../../../utils/DataSets/personalPronouns';
import { tribalEntitiesOptions } from '../../../utils/DataSets/tribalEntities';
import { maritalStatusOptions } from '../../../utils/DataSets/maritalStatus';
import AddressForm from '../Common Pages/AddressForm';
import IdentifierForm from '../Common Pages/IdentifierForm';

const Demographicdetails = ({ patientId, activeTab, setActiveTab }) => {
    console.log(patientId, 'patientId');
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        clearErrors,
        watch,
        getValues,
    } = useForm();
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [mailingLongitude, setMailingLongitude] = useState(null);
    const [mailingLatitude, setMailingLatitude] = useState(null);
    const [employerLongitude, setEmployerLongitude] = useState(null);
    const [demographicAddresses, setDemographicAddresses] = useState([
        { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: '' },
    ]);
    const [employerLatitude, setEmployerLatitude] = useState(null);
    const [focused, setFocused] = useState(false);
    const [mailingFocused, setMailingFocused] = useState(false);
    const [employerFocused, setEmployerFocused] = useState(false);
    const [searchedLocations, setSearchedLocations] = useState(null);
    const [primaryCitySearch, setPrimaryCitySearch] = useState(null);
    const [mailingCitySearch, setMailingCitySearch] = useState(null);
    const [employerCitySearch, setEmployerCitySearch] = useState(null);
    const [submissionType, setSubmissionType] = useState(null);
    const [searchedMailingLocations, setSearchedMailingLocations] = useState(null);
    const [searchedEmployerLocations, setSearchedEmployerLocations] = useState(null);
    const [sameAsPrimary, setSameAsPrimary] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    const statesData = store?.getStatesReducer?.data;
    console.log(statesData, 'statesData');
    // const [activeTab, setActiveTab] = useState('personalDetails');

    const updateResponse = store?.updatePatientsReducer?.data?.status;
    console.log(updateResponse, 'updateResponse');
    const cities3 = store?.getCitiesReducer?.cities3?.data?.cities;
    const employerState = watch('employerStateName');
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
    // const onSubmit = (data) => {
    //     const payload = {
    //         id: patientId,
    //         ...(data?.nationalIdNumber ? { nationalIdNumber: data?.nationalIdNumber } : {}),
    //         // ...(data?.dateOfBirth ? { dateOfBirth: data?.dateOfBirth } : {}),
    //         // ...(data?.approxAge ? { approxAge: data?.approxAge } : {}),
    //         ...(data?.sex ? { sex: data?.sex } : {}),
    //         ...(data?.genderIdentity ? { genderIdentity: data?.genderIdentity } : {}),
    //         ...(data?.sexualOrientation ? { sexualOrientation: data?.sexualOrientation } : {}),
    //         ...(data?.race ? { race: data?.race } : {}),
    //         ...(data?.raceSubcategories ? { raceSubcategories: data?.raceSubcategories } : {}),
    //         ...(data?.ethnicity ? { ethnicity: data?.ethnicity } : {}),
    //         ...(data?.preferredLanguage ? { preferredLanguage: data?.preferredLanguage } : {}),
    //         ...(data?.patientStudentStatus ? { patientStudentStatus: data?.patientStudentStatus } : {}),
    //         ...(data?.notes ? { notes: data?.notes } : {}),
    //         ...(data?.maritalStatus ? { maritalStatus: data?.maritalStatus } : {}),
    //         ...(data?.epsdtServices ? { epsdtServices: data?.epsdtServices } : {}),
    //         ...(data?.epsdtReferralCondition ? { epsdtReferralCondition: data?.epsdtReferralCondition } : {}),
    //         ...(data?.emergencyContactName ? { emergencyContactName: data?.emergencyContactName } : {}),
    //         ...(data?.emergencyContactPhone
    //             ? { emergencyContactPhone: data?.emergencyContactPhone?.replace(/\D/g, '') }
    //             : {}),
    //         ...(data?.emergencyContactRelation ? { emergencyContactRelation: data?.emergencyContactRelation } : {}),
    //         ...(data?.employerName ? { employerName: data?.employerName } : {}),
    //         ...(data?.employerPhone ? { employerPhone: data?.employerPhone?.replace(/\D/g, '') } : {}),
    //         employerAddress: {
    //             address: data?.employerAddress,
    //             street: data?.employerStreet,
    //             city: data?.employerCity,
    //             state: data?.employerStateName,
    //             zip: data?.employerZip,
    //             latitude: employerLatitude,
    //             longitude: employerLongitude,
    //             timeZone: data?.employerTimeZone,
    //         },
    //         identifier: constantIdentifiers.map((item) => ({
    //             identifierType: item.type,
    //             use: item.use,
    //             value: item.number,
    //             // documents: item.file ? {  url: item.file.url,fileName: item.file.name || '' } : null,
    //             documents: [item?.file?.url],
    //             expirationDate: item.expiry,
    //             status: 'active',
    //             system: 'urn:oid:2.16.840.1.113883.4.7',
    //             sliceName: item.type,
    //             issuingAuthority: item.issuingAuthority,
    //         })),
    //         address: addresses,

    //     };
    //     dispatch(updatePatientsAction({ key: encryptMessage(payload) }));
    // };
    // const onSubmit = (data) => {
    //     const payload = {
    //         id: patientId,

    //         ...(data?.nationalIdNumber && { nationalIdNumber: data.nationalIdNumber }),
    //         ...(data?.sex && { birthSex: { code: data.sex } }),
    //         ...(data?.genderIdentity && { gender: data.genderIdentity }),
    //         ...(data?.sexualOrientation && { sexualOrientation: data.sexualOrientation }),
    //         ...(data?.race && [{ system: 'http://hl7.org/fhir/v3/Race', code: data.race }]),
    //         ...(data?.ethnicity && [{ system: 'http://hl7.org/fhir/v3/Ethnicity', code: data.ethnicity }]),
    //         ...(data?.maritalStatus && {
    //             maritalStatus: {
    //                 coding: [
    //                     {
    //                         system: 'http://terminology.hl7.org/CodeSystem/v3-MaritalStatus',
    //                         code: data.maritalStatus,
    //                         display: data.maritalStatusDisplay || '',
    //                     },
    //                 ],
    //             },
    //         }),
    //         ...(data?.preferredLanguage && {
    //             communication: [
    //                 {
    //                     language: {
    //                         coding: [
    //                             {
    //                                 system: 'urn:ietf:bcp:47',
    //                                 code: data.preferredLanguage,
    //                                 display: data.languageDisplay || '',
    //                             },
    //                         ],
    //                     },
    //                     preferred: true,
    //                 },
    //             ],
    //         }),
    //         ...(data?.patientStudentStatus && { patientStudentStatus: data.patientStudentStatus }),
    //         ...(data?.notes && { notes: data.notes }),
    //         ...(data?.epsdtServices && { epsdtServices: data.epsdtServices }),
    //         ...(data?.epsdtReferralCondition && { epsdtReferralCondition: data.epsdtReferralCondition }),
    //         ...(data?.emergencyContactName && { emergencyContactName: data.emergencyContactName }),
    //         ...(data?.emergencyContactPhone && {
    //             emergencyContactPhone: data.emergencyContactPhone.replace(/\D/g, ''),
    //         }),
    //         ...(data?.emergencyContactRelation && { emergencyContactRelation: data.emergencyContactRelation }),
    //         ...(data?.employerName && { employerName: data.employerName }),
    //         ...(data?.employerPhone && { employerPhone: data.employerPhone.replace(/\D/g, '') }),

    //         employerAddress: {
    //             use: 'work',
    //             type: 'physical',
    //             text: data?.employerAddress,
    //             line: [data?.employerStreet].filter(Boolean),
    //             city: data?.employerCity,
    //             state: data?.employerStateName,
    //             postalCode: data?.employerZip,
    //             country: 'US',
    //             latitude: employerLatitude,
    //             longitude: employerLongitude,
    //             timeZone: data?.employerTimeZone,
    //         },
    //         address: addresses,
    //         identifier: constantIdentifiers.map((item) => ({
    //             use: item.use,
    //             system: item.system || 'urn:oid:2.16.840.1.113883.4.7',
    //             value: item.number,
    //             period: {
    //                 start: item.startDate,
    //                 end: item.expiry,
    //             },
    //             documents: item?.file?.url ? [{ url: item.file.url, fileName: item.file.name || '' }] : [],
    //             status: 'active',
    //             sliceName: item.type,
    //             issuingAuthority: item.issuingAuthority,
    //         })),
    //     };
    //     console.log('hit hua ', payload);

    //     dispatch(updatePatientsAction({ key: encryptMessage(payload) }));
    // };
    const onSubmit = (data) => {
        const payload = {
            id: patientId,
            ...(data?.nationalIdNumber && { nationalIdNumber: data.nationalIdNumber }),
            ...(data?.sex && { birthSex: { code: data.sex } }),
            ...(data?.genderIdentity && { gender: data.genderIdentity }),
            ...(data?.sexualOrientation && { sexualOrientation: data.sexualOrientation }),
            // ✅ Fixing Race & Ethnicity Structure
            ...(data?.race && { race: [{ system: 'http://hl7.org/fhir/v3/Race', code: data.race }] }),
            ...(data?.ethnicity && {
                ethnicity: [{ system: 'http://hl7.org/fhir/v3/Ethnicity', code: data.ethnicity }],
            }),

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
            ...(data?.employerPhone && { employerPhone: data.employerPhone.replace(/\D/g, '') }),

            // ✅ Fixing Employer Address (No latitude/longitude/timeZone)
            employerDetails: {
                employerName: data?.employerName,
                employerPhone: data?.employerPhone.replace(/\D/g, ''),
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

         
            address: demographicAddresses,
        };

        console.log('Payload:', payload);
        dispatch(updatePatientsAction({ key: encryptMessage(payload) }));
    };
    useEffect(() => {
        if (updateResponse === 200) {
            if (submissionType === 'saveAndNext') {
                reset();
                setActiveTab('responsible');
                dispatch(stateEmptydAction());
            } else if (submissionType === 'saveAndReset') {
                setActiveTab('personelDetails');

                dispatch(stateEmptydAction());
            }
        }
    }, [updateResponse, submissionType]);

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

    const handleStateSelection = (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const key = JSON.parse(selectedOption.getAttribute('data-key'));
        setSelectedState(e.target.value);
        dispatch(getCitiesAction({ state_code: key, name: '', limit: 25 }));
    };
    const formattedEthnicityOptions = ethnicityOptions.map((ethnicity) => ({
        value: ethnicity, // Code as the value
        label: ethnicity.display, // Display text as the label
    }));
    const formattedTribleOptions = tribalEntitiesOptions.map((tribal) => ({
        value: tribal, // Code as the value
        label: tribal.display, // Display text as the label
    }));

    const handleEthnicityChange = (selectedOption) => {
        console.log(selectedOption, 'selectedOption');
        setValue('ethnicity', selectedOption ? selectedOption.display : '');
    };

    const handleTribalChange = (selectedOption) => {
        console.log(selectedOption, 'selectedOption');
        setValue('ethnicity', selectedOption ? selectedOption.display : '');
    };

    return (
        <>
            <Form className="mt-1" onSubmit={handleSubmit(onSubmit)}>
                <IdentifierForm
                    defaultIdentifiers={[
                        {
                            label: 'National Provider Identifier (NPI)',
                            value: 'http://hl7.org/fhir/sid/us-npi',
                            code: 'NPI',
                        },
                    
                    ]}
                />

                <hr className="mt-0" />
                <Row className="pb-2">
                    {/* <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Patient National ID Number</Form.Label>
                            <Form.Control
                                placeholder="Patient National ID Number"
                                type="text"
                                {...register('nationalIdNumber')}
                            />
                        </Form.Group>
                    </Col> */}
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
                    {/* <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Race SubCategories</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Race SubCategories"
                                {...register('raceSubcategories')}
                            />
                        </Form.Group>
                    </Col> */}
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Ethnicity</Form.Label>
                            <Select
                                options={formattedEthnicityOptions} // Use the formatted array
                                isSearchable
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="&nbsp; Select "
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
                    {/* <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Patient Student Status</Form.Label>
                            <Form.Select {...register('patientStudentStatus')}>
                                <option value="">Select Patient Student Status</option>
                                <option value="Employed">Employed</option>
                                <option value="Full-time Student">Full-time Student</option>
                                <option value="Not a Student">Not a Student</option>
                                <option value="Part-time Student">Part-time Student</option>
                            </Form.Select>
                        </Form.Group>
                    </Col> */}
                </Row>
                <hr />
                <AddressForm addresses={demographicAddresses} setAddresses={setDemographicAddresses} />
                <hr />

                <Row className="mt-1 pb-2">
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Notes</Form.Label>
                            <Form.Control type="text" placeholder="Enter Notes" {...register('notes')} />
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
                    {/* <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">EPSDT Services</Form.Label>
                            <Form.Select {...register('epsdtServices')}>
                                <option value="">Select EPSDT Services</option>
                                <option value="Children">Children</option>
                                <option value="Family Planning">Family Planning</option>
                                <option value="Children / Family Planning">Children / Family Planning</option>
                            </Form.Select>
                            {errors.epsdtServices && (
                                <span className="text-danger">{errors.epsdtServices.message}</span>
                            )}
                        </Form.Group>
                    </Col> */}
                    {/* <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">EPSDT Referral Condition </Form.Label>
                            <Form.Select {...register('epsdtReferralCondition')}>
                                <option value="">Select EPSDT Referral Condition</option>
                                <option value="AV">Available - Not Used</option>
                                <option value="NU">Not Used</option>
                                <option value="S2">Under Treatment</option>
                                <option value="ST">New Services Requested</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                            {errors.epsdtReferralCondition && (
                                <span className="text-danger">{errors.epsdtReferralCondition.message}</span>
                            )}
                        </Form.Group>
                    </Col> */}
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Emergency Contact Name</Form.Label>
                            <Form.Control
                                {...register('emergencyContactName')}
                                type="text"
                                placeholder="Enter Emergency Contact Name"
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        {/* <Form.Group>
                            <Form.Label className="mb-0">Emergency Contact Phone</Form.Label>
                            <Form.Control {...register('emergencyContactPhone')} type="text" placeholder="Enter Emergency Contact Phone" />
                        </Form.Group> */}
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
                            <Form.Control
                                {...register('emergencyContactRelation')}
                                type="text"
                                placeholder="Enter Emergency Contact Relation"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col sm={12}>
                        <Row>
                            <Col sm={12} className="mt-1">
                                <span className="text-black fw-semibold form-label">Employer Details</span>
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
                <div className="d-flex gap-2 justify-content-end mb-2 mt-md-4">
                    <Button className="cancel-button" onClick={() => reset()}>
                        Clear
                    </Button>
                    <Button
                        onClick={() => {
                            setSubmissionType('saveAndReset');
                        }}
                        className="custom-buttons"
                        type="submit">
                        Save & Add Another
                    </Button>
                    <Button
                        onClick={() => {
                            setSubmissionType('saveAndNext');
                        }}
                        disabled={store?.updatePatientsReducer?.loading}
                        className="custom-buttons"
                        type="submit">
                        Save & Continue Editing
                    </Button>
                </div>
                {/* <Row>
                    <Col className="d-flex justify-content-end">
                        <Button
                            disabled={store?.updatePatientsReducer?.loading}
                            className="custom-buttons btn-height"
                            type="submit">
                            Save & Continue
                        </Button>
                    </Col>
                </Row> */}
            </Form>
        </>
    );
};

export default Demographicdetails;
