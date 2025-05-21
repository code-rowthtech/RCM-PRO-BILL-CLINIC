import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, InputGroup, Table, Spinner } from 'react-bootstrap';
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
} from '../../../redux/actions';
import Select from 'react-select';
import us from '../../../assets/images/flags/us.jpg';
import { encryptMessage } from '../../../cryptoUtils';
import { handleUpload } from '../../../helpers/HandleUpload';
import { CiCircleMinus } from 'react-icons/ci';
import { raceOptions } from '../../../utils/DataSets/race.data';
import { ethnicityOptions } from '../../../utils/DataSets/enthnicity.data';
import { genderIdentityOptions } from '../../../utils/DataSets/genderIdentities';
import { sexAssignedAtBirthOptions } from '../../../utils/DataSets/sex';
import { sexParameterOptions } from '../../../utils/DataSets/SexParameterforClinicalUse';
import { personalPronounsOptions } from '../../../utils/DataSets/personalPronouns';
import { tribalEntitiesOptions } from '../../../utils/DataSets/tribalEntities';
import { maritalStatusOptions } from '../../../utils/DataSets/maritalStatus';
import AddressForm from '../Common Pages/AddressForm';
import IdentifierForm from '../Common Pages/IdentifierForm';
import { dataList } from '../../../utils/DataSets/relations.data';

const Demographicdetails = ({
    patientId,
    activeTab,
    setActiveTab,
    showResponsibleTab,
    setShowResponsibleTab,
    gender,
}) => {
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
        { type: 'physical', use: '', line: [''], city: '', state: '', postalCode: '', country: '' },
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
    const updateResponse = store?.updatePatientsReducer?.data?.status;
    const cities3 = store?.getCitiesReducer?.cities3?.data?.cities;
    useEffect(() => {
        dispatch(getStatesByCountryAction());
    }, [dispatch]);

    useEffect(() => {
        if (employerCitySearch) {
            setValue('employerCity', employerCitySearch);
        }
    }, [employerCitySearch, cities3]);

    const onSubmit = (data) => {
        const selectedGenderIdentity = genderIdentityOptions.find((option) => option.show === data.genderIdentity);
        const selectedSexualOrientation = sexParameterOptions.find((option) => option.show === data.sexParameter);
        const selectedPersonalPronouns = personalPronounsOptions.find(
            (option) => option.show === data.personalPronouns
        );
        const selectedMaritalStatus = maritalStatusOptions.find((option) => option.show === data.maritalStatus);
        const selectedRaceOption = raceOptions.find((option) => option.code === data.race);
        const selectedSexOption = sexAssignedAtBirthOptions.find((option) => option.value === data.sex);
        let finalIdentifiers = [];
        identifiers.forEach((element) => {
            const identifierData = {
                expiry: element?.expiry,
                file: element?.file,
                value: element?.number,
                use: 'official',
                system: element?.type?.value,
                type: {
                    coding: [
                        {
                            system: element?.type?.value,
                            code: element?.type?.code,
                            display: element?.type?.label,
                        },
                    ],
                    text: element?.type?.label,
                },
                issuingAuthority: element?.issuingAuthority,
            };
            finalIdentifiers.push(identifierData);
        });
        const payload = {
            id: patientId,
            birthSex: [
                {
                    ...selectedSexOption,
                    code: selectedSexOption?.value,
                    display: selectedSexOption?.label,
                    system: selectedSexOption?.system,
                },
            ],
            genderIdentity: [
                {
                    ...selectedGenderIdentity,
                    code: selectedGenderIdentity?.value,
                    display: selectedGenderIdentity?.show,
                    text: selectedGenderIdentity?.label,
                },
            ],
            sexParameterForClinicalUse: [
                {
                    ...selectedSexualOrientation,
                    code: selectedSexualOrientation?.value,
                    display: selectedSexualOrientation?.show,
                    text: selectedSexualOrientation?.label,
                    system: selectedSexualOrientation?.system,
                },
            ],
            personalPronouns: [
                {
                    ...selectedPersonalPronouns,
                    code: selectedPersonalPronouns?.value,
                    display: selectedPersonalPronouns?.show,
                    text: selectedPersonalPronouns?.label,
                    system: selectedPersonalPronouns?.system,
                },
            ],
            // ✅ Fixing Race
            race: [
                {
                    ...selectedRaceOption,
                    code: selectedRaceOption?.code,
                    display: selectedRaceOption?.display,
                    text: selectedRaceOption?.display,
                },
            ],
            // ✅ Fixing Ethnicity
            ethnicity: [
                {
                    ...eth,
                    text: eth?.display,
                },
            ],
            // ✅ Fixing Tribal Entity
            tribalAffiliation: [
                {
                    ...tri,
                    text: tri?.display,
                },
            ],
            // ✅ Fixing Marital Status Structure
            maritalStatus: [
                {
                    ...selectedMaritalStatus,
                    code: selectedMaritalStatus?.value,
                    display: selectedMaritalStatus?.show,
                    text: selectedMaritalStatus?.label,
                    system: selectedMaritalStatus?.system,
                },
            ],
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
            ...(data?.notes && { notes: data.notes }),
            // ✅ Fixing Emergency Contact Field
            contact: [
                {
                    relationship: [
                        {
                            coding: [rela],
                            text: data?.emergencyContactName, // Human-readable relationship (e.g., "Father", "Aunt")
                        },
                    ],
                    telecom: [
                        {
                            system: 'phone', //enum: ["phone", "email"]
                            value: data?.emergencyContactPhone?.replace(/\D/g, ''),
                            use: 'home', //, enum: ["home", "work", "mobile"]
                        },
                    ],
                },
                // {

                // },
            ],
            // ✅ Fixing Employer Address (No latitude/longitude/timeZone)
            employerDetails: {
                employerName: data?.employerName,
                employerPhone: data?.employerPhone?.replace(/\D/g, ''),
                employmentStatus: data?.employmentStatus,
                occupation: data?.occupation,
                workLocation: {
                    address: {
                        line: [data?.employerAddress],
                        city: data?.employerCity,
                        state: data?.employerStateName,
                        postalCode: data?.employerZip,
                        country: 'United States',
                    },
                },
            },
            identifier: finalIdentifiers,
            address: demographicAddresses,
            ...(data?.notes && { notes: data.notes }),
        };
        dispatch(updatePatientsAction({ key: encryptMessage(payload) }));
    };

    useEffect(() => {
        if (updateResponse === 200) {
            if (submissionType === 'saveAndNext') {
                reset();
                if (showResponsibleTab) {
                    setActiveTab('responsible'); // Go to Responsible tab if allowed
                } else {
                    setActiveTab('insurance'); // Otherwise, go to Insurance tab
                }
            } else if (submissionType === 'saveAndReset') {
                setActiveTab('personalDetails');
            }
        }
    }, [updateResponse, submissionType, showResponsibleTab]); // Dependency added

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
    const relationshipOption = dataList?.map((relation) => ({
        value: relation, // Code as the value
        label: relation.display, // Display text as the label
    }));

    const [eth, setEth] = useState(null);
    const handleEthnicityChange = (selectedOption) => {
        setEth(selectedOption ? selectedOption.value : '');
    };
    const [rela, setRela] = useState(null); // Store selected relationship
    const handleRelationChange = (selectedOption) => {
        setRela(selectedOption ? selectedOption.value : '');
    };
    const [tri, setTri] = useState(null); // Store selected tribal entity
    const handleTribalChange = (selectedOption) => {
        setTri(selectedOption ? selectedOption.value : '');
    };
    const [identifiers, setIdentifiers] = useState([]);

    return (
        <>
            <Form className="mt-1" onSubmit={handleSubmit(onSubmit)}>
                <IdentifierForm
                    defaultIdentifiers={[
                        {
                            label: 'Social Security Number (SSN)',
                            value: 'http://hl7.org/fhir/sid/us-ssn',
                            code: 'SSN',
                        },
                    ]}
                    identifiers={identifiers}
                    setIdentifiers={setIdentifiers}
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
                                    <option key={option.value} value={option?.value}>
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
                                    <option key={option?.value} value={option?.show}>
                                        {option?.show}
                                    </option>
                                ))}
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
                                    <option key={option.value} value={option?.show}>
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
                                    <option key={option?.value} value={option?.show}>
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
                                    <option key={race.code} value={race.code} className="text-capitalize">
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
                                options={formattedEthnicityOptions} // Use the formatted array
                                isSearchable
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="&nbsp; Select "
                                value={
                                    formattedEthnicityOptions.find(
                                        (option) => option?.value?.display === eth?.display
                                    ) || null
                                } // Show selected value
                                onChange={handleEthnicityChange}
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
                            <Form.Select
                                {...register('preferredLanguage')}
                                data-has-value={!!watch('preferredLanguage')}
                                defaultValue={'English'}>
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
                                value={
                                    formattedTribleOptions.find((option) => option?.value?.display === tri?.display) ||
                                    null
                                } // Show selected value
                                onChange={handleTribalChange}
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
                                    <option key={option.value} value={option?.show}>
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
                                    relationshipOption.find((option) => option?.value?.display === rela?.display) ||
                                    null
                                } // Show selected value
                                onChange={handleRelationChange}
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
                                                    className={`scroll-container hover-bg-change ${searchedEmployerLocations?.length === 0 || !employerFocused
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
                                    {/* <Col sm={6}>
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
                                    </Col> */}
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
                            <Form.Control as="textarea" rows={3} placeholder="Enter Notes" {...register('notes')} />
                        </Form.Group>
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
                        style={{ width: '200px' }}
                        disabled={store?.updatePatientsReducer?.loading}
                        className="custom-buttons"
                        type="submit">
                        {store?.updatePatientsReducer?.loading ? (
                            <Spinner animation="border" variant="primary" size="sm" />
                        ) : (
                            ' Save & Continue Editing'
                        )}
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default Demographicdetails;
