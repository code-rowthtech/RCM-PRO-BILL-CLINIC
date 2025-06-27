import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, InputGroup, Table, Spinner } from 'react-bootstrap';
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
    getCities4Action,
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
import { use } from 'react';

const Demographicdetails = ({ patientId, isAccordionOpen }) => {
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
    const [employerCitySearch, setEmployerCitySearch] = useState('');
    const [searchedEmployerLocations, setSearchedEmployerLocations] = useState(null);
    const [sameAsPrimary, setSameAsPrimary] = useState(false);
    const [identifiers, setIdentifiers] = useState([]);

    const statesData = store?.getStatesReducer?.data;
    const cities4 = store?.getCitiesReducer?.cities4?.data?.cities;
    const employerState = watch('employerStateName');

    const patientDetails = store?.getPatientByIdReducer?.data?.data;
    const [demographicAddresses, setDemographicAddresses] = useState([
        { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: 'USA' },
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
        if (employerState && statesData?.states) {
            const stateCity = statesData?.states?.find((data) => data?.state_code === employerState)?.id;
            dispatch(getCities4Action({ state_code: stateCity, name: employerCitySearch, limit: 25, skip: '' }));
        }
    }, [employerState, statesData]);

    useEffect(() => {
        setValue('employerCity', patientDetails?.employerDetails?.workLocation?.address?.city);
    }, [cities4]);

    useEffect(() => {
        if (employerCitySearch) {
            setValue('employerCity', employerCitySearch);
        }
    }, [employerCitySearch, cities4]);

    useEffect(() => {
        if (patientDetails && id) {
            setValue('race', patientDetails?.race?.[0]?.display || '');
            setValue('raceSubcategories', patientDetails?.raceSubcategories);
            setValue('sex', patientDetails?.birthSex?.[0]?.value || '');
            setValue('genderIdentity', patientDetails?.genderIdentity?.[0]?.code || '');
            setValue('sexParameter', patientDetails?.sexParameterForClinicalUse?.[0]?.code || '');
            setValue('personalPronouns', patientDetails?.personalPronouns?.[0]?.code || '');
            setValue('patientStudentStatus', patientDetails?.patientStudentStatus);
            setValue('nationalIdNumber', patientDetails?.nationalIdNumber);
            setValue('preferredLanguage', patientDetails?.communication?.[0]?.language?.coding?.[0]?.code || '');
            // setValue('trible', patientDetails?.trible?.[0]?.code || '');
            // setValue('ethnicity', patientDetails?.ethnicity?.[0]?.value || '');
            setEth(patientDetails?.ethnicity);
            setTri(patientDetails?.tribalAffiliation);
            setValue('notes', patientDetails?.notes);
            setValue('maritalStatus', patientDetails?.maritalStatus?.[0]?.display || '');
            setValue('epsdtServices', patientDetails?.epsdtServices);
            setValue('epsdtReferralCondition', patientDetails?.epsdtReferralCondition);

            // ✅ Emergency Contact Fix
            setValue('emergencyContactName', patientDetails?.contact?.[0]?.relationship?.[0]?.text || '');
            setValue('emergencyContactPhone', formatPhoneNumber(patientDetails?.contact?.[0]?.telecom?.[0]?.value));
            // setValue('emergencyContactRelation', patientDetails?.contact?.[0]?.relationship?.[0]?.text || '');
            setRela(patientDetails?.contact?.[0]?.relationship?.[0]?.coding);

            // ✅ Employer Details Fix
            setValue('employerName', patientDetails?.employerDetails?.employerName || '');
            setValue('employmentStatus', patientDetails?.employerDetails?.employmentStatus || '');
            setValue('occupation', patientDetails?.employerDetails?.occupation || '');

            // ✅ Employer Address Fix
            setValue('employerCity', patientDetails?.employerDetails?.workLocation?.address?.city || '');
            setEmployerCitySearch(patientDetails?.employerDetails?.workLocation?.address?.city);
            setValue('employerStateName', patientDetails?.employerDetails?.workLocation?.address?.state || '');
            setValue('employerZip', patientDetails?.employerDetails?.workLocation?.address?.postalCode || '');
            setValue('employerPhone', formatPhoneNumber(patientDetails?.employerDetails?.employerPhone || ''));
            setValue('employerAddress', patientDetails?.employerDetails?.workLocation?.address?.line[0] || '');
            const defaultIdentifiers = patientDetails?.identifier?.map((data, index) => ({
                expiry: data?.expiry,
                file: data?.file?.[0],
                issuingAuthority: data?.issuingAuthority,
                number: data?.value,
                system: '',
                type: {
                    label: data?.type?.coding?.[0]?.display,
                    value: data?.type?.coding?.[0]?.system,
                    code: data?.type?.coding?.[0]?.code,
                },
            }));
            setIdentifiers(defaultIdentifiers || []);
            // setDemographicAddresses(patientDetails?.address || []);
            const newAddresses = patientDetails?.address?.map((addr) => ({
                type: addr.type || '', // Make sure type is included
                use: addr.use || '',
                line: addr.line && Array.isArray(addr.line) ? addr.line : [''],
                city: addr.city || '',
                state: addr.state || '',
                postalCode: addr.postalCode || '',
                country: addr.country || 'US',
            })) || [{ type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: 'US' }];
            setDemographicAddresses(newAddresses);
            if (statesData?.states) {
                newAddresses.forEach((address) => {
                    const state = statesData.states.find((s) => s.name === address.state);
                    if (!state) return;
                    if (address.type === 'physical') {
                        dispatch(
                            getCitiesAction({
                                state_code: state.id,
                                name: address.city,
                                limit: 25,
                                skip: '',
                            })
                        );
                    } else if (address.type === 'postal') {
                        dispatch(
                            getCities2Action({
                                state_code: state.id,
                                name: address.city,
                                limit: 25,
                                skip: '',
                            })
                        );
                    } else {
                        dispatch(
                            getCities3Action({
                                state_code: state.id,
                                name: address.city,
                                limit: 25,
                                skip: '',
                            })
                        );
                    }
                });
            }
        }
    }, [patientDetails, statesData]);

    const onSubmit = (data) => {
        const selectedGenderIdentity = genderIdentityOptions.find((option) => option.value === data.genderIdentity);
        const selectedSexualOrientation = sexParameterOptions.find((option) => option.value === data.sexParameter);
        const selectedPersonalPronouns = personalPronounsOptions.find(
            (option) => option.value === data.personalPronouns
        );
        const selectedMaritalStatus = maritalStatusOptions.find((option) => option.show === data.maritalStatus);
        const selectedRaceOption = raceOptions.find((option) => option.display === data.race);
        const selectedSexOption = sexAssignedAtBirthOptions.find((option) => option.value === data.sex);

        let finalIdentifiers = [];
        identifiers.forEach((element) => {
            const identifierData = {
                expiry: element?.expiry,
                file: element?.file,
                value: element?.number || element?.value,
                use: 'official',
                system: element?.type?.value || element?.system,
                type: {
                    coding: [
                        {
                            system: element?.type?.value || element?.system,
                            code: element?.type?.code || element?.type?.coding?.[0]?.code,
                            display: element?.type?.label || element?.type?.coding?.[0]?.display,
                        },
                    ],
                    text: element?.type?.label || element?.type?.coding?.[0]?.display,
                },
                issuingAuthority: element?.issuingAuthority,
            };
            finalIdentifiers.push(identifierData);
        });
        const payload = {
            id: id,
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

            contact: [
                {
                    relationship: [
                        {
                            coding: [rela], //code:'I" , system:url, display:'Ins Company
                            text: data?.emergencyContactName,
                        },
                    ],
                    telecom: [
                        {
                            system: 'phone',
                            value: data?.emergencyContactPhone?.replace(/\D/g, ''),
                            use: 'home',
                        },
                    ],
                },
            ],
            // ✅ Fixing Employer Address (No latitude/longitude/timeZone)
            employerDetails: {
                employerName: data?.employerName,
                employerPhone: data?.employerPhone?.replace(/\D/g, ''),
                employmentStatus: data?.employmentStatus,
                occupation: data?.occupation,
                workLocation: data?.employerAddress
                    ? {
                        address: {
                            line: [data?.employerAddress],
                            city: data?.employerCity,
                            state: data?.employerStateName,
                            postalCode: data?.employerZip,
                            country: 'United States',
                        },
                    }
                    : {},
            },
            identifier: finalIdentifiers,
            ...(demographicAddresses && { address: demographicAddresses }),
            ...(data?.notes && { notes: data.notes }),
        };
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
        setEth(selectedOption?.value); // Store value in state
    };
    const [rela, setRela] = useState(null); // Store selected relationship
    const handleRelationChange = (selectedOption) => {
        setRela(selectedOption ? selectedOption.value : '');
    };
    const [tri, setTri] = useState(null); // Store selected tribal entity
    const handleTribalChange = (selectedOption) => {
        setTri(selectedOption ? selectedOption.value : '');
    };
    const selectedEthnicityOption =
        formattedEthnicityOptions.find((option) => option?.value?.code === eth?.[0]?.code) ||
        formattedEthnicityOptions.find((option) => option?.value?.display === eth);
    const selectedTribleOption =
        formattedTribleOptions.find((option) => option?.value?.code == tri?.[0]?.code) ||
        formattedTribleOptions.find((option) => option?.value?.code == tri);
    const selectedRelationOption =
        relationshipOption.find((option) => option?.value?.code === rela?.[0]?.code) ||
        relationshipOption.find((option) => option?.value?.display === rela?.[0]?.coding?.[0]?.display);

    return (
        <Form className="" onSubmit={handleSubmit(onSubmit)}>
            <div
                className=" scroll-container "
                style={{ overflowX: 'hidden', height: isAccordionOpen ? '54.7vh' : '70vh' }}>
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
                                    <option key={race.code} value={race.display} className="text-capitalize">
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
                                // value={
                                // formattedEthnicityOptions.find((option) => option?.value?.display === eth||option?.value?.display === eth?.display) || null
                                // } // Show selected value
                                value={selectedEthnicityOption}
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
                                // value={formattedTribleOptions.find((option) => option?.value?.display === tri) || null} // Show selected value
                                value={selectedTribleOption}
                                placeholder="&nbsp; Select "
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
                                // value={relationshipOption.find((option) => option?.value?.display === rela) || null} // Show selected value
                                value={selectedRelationOption}
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
                                                disabled={store?.getCitiesReducer?.loading || store?.getCitiesReducer?.cities4?.loading}
                                                {...register('employerCity')}>
                                                {(store?.getCitiesReducer?.loading || store?.getCitiesReducer?.cities4?.loading) ? (
                                                    <option value="" hidden>Loading...</option>
                                                ) : (
                                                    <>
                                                        <option value="" hidden>City</option>
                                                        {cities4?.map((data) => (
                                                            <option key={data?.name} value={data?.name}>
                                                                {data?.name}
                                                            </option>
                                                        ))}
                                                    </>
                                                )}
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
                                            <Form.Label className="mb-0">Postal Code </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Postal code"
                                                maxLength={5}
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
                                                onKeyDown={(e) => {
                                                    if (
                                                        !/[0-9]/.test(e.key) &&
                                                        ![
                                                            'Backspace',
                                                            'Tab',
                                                            'ArrowLeft',
                                                            'ArrowRight',
                                                            'Delete',
                                                        ].includes(e.key)
                                                    ) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                            {errors.employerZip && (
                                                <span className="text-danger">{errors.employerZip.message}</span>
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
            </div>
            <div className="d-flex gap-2 align-items-end justify-content-end my-2">
                <Button
                    className="custom-buttons btn-height"
                    disabled={store?.updatePatientsReducer?.loading}
                    style={{ width: '70px' }}
                    type="submit">
                    {store?.updatePatientsReducer?.loading ? (
                        <Spinner animation="border" variant="primary" size="sm" />
                    ) : (
                        'Update'
                    )}
                </Button>
            </div>
        </Form>
    );
};

export default Demographicdetails;
