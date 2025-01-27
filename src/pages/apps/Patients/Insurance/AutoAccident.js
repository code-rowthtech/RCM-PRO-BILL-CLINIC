import React, { useEffect, useState } from 'react'
import { FiUploadCloud } from 'react-icons/fi';
import { Col, Form, Row, Button, Table, Modal, InputGroup, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createInsuranceAction, getCitiesAction, getStatesByCountryAction } from '../../../../redux/actions';
import { useForm } from 'react-hook-form';
import { encryptMessage } from '../../../../cryptoUtils';

const AutoAccident = ({ patientId, activeTab }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
        getValues,
        setError,
        clearErrors
    } = useForm();
    const [insuredPersonIsPatient, setInsuredPersonIsPatient] = useState(false)
    const [hasSimilarCondition, setHasSimilarCondition] = useState(false)
    const [claimRepresentativeIsInsurer, setClaimRepresentativeIsInsurer] = useState(true)
    const [permanentDisfigurement, setPermanentDisfigurment] = useState(false)
    const [isPatentStillUnderCare, setIsPatentStillUnderCare] = useState(false)
    const [requiredRehabilitation, setRequiredRehabilitation] = useState(false)
    const [searchedLocations, setSearchedLocations] = useState(null);
    const [citySearch, setCitySearch] = useState(null);

    const [focused, setFocused] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    const cities = store?.getCitiesReducer?.cities1?.data?.cities;

    console.log(cities, 'sele')
    useEffect(() => {
        if (selectedState) {
            dispatch(getCitiesAction({ state_code: selectedState?.id, name: citySearch ? citySearch : '', limit: 25, skip: '' }))
        }
    }, [selectedState])
    useEffect(() => {
        if (cities) {
            setValue('autoAccidentPayerCity', cities && cities?.find((data) => data?.name === citySearch)?.name)
        }
    }, [cities])
    // const [selectedLocation, setSelectedLocation] = useState(null);
    const statesData = store?.getStatesReducer?.data?.states;
    useEffect(() => {
        dispatch(getStatesByCountryAction());
    }, [dispatch])
    const onSubmit = (data) => {

        // Helper function to remove empty values
        const removeEmptyValues = (obj) => {
            return Object.fromEntries(
                Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null && value !== '')
            );
        };

        const payload = {
            ...removeEmptyValues(data),
            claimRepresentativeIsInsurer: claimRepresentativeIsInsurer,
            insuredPersonIsPatient: insuredPersonIsPatient,
            insuranceType: 'Auto Accident',
            patientId: patientId,
            similarConditionDetails: removeEmptyValues({
                hasSimilarCondition: hasSimilarCondition,
                when: data?.when,
                why: data?.why,
                // prepopulateLastRelatedVisit: { type: Boolean },
            }),
            permanentDisfigurment: removeEmptyValues({
                notDeterminable: data?.notDeterminable,
                description: data?.description
            }),
            rehabilitationDetails: removeEmptyValues({
                requiresRehab: requiredRehabilitation,
                recommendation: data?.recommendation
            })
        };

        console.log(payload, 'payyyyyyyyyyyy');
        dispatch(createInsuranceAction({ key: encryptMessage(payload) }));
    };

    const getGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed'; // Replace with your API key
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
                    setSearchedLocations(data?.results)
                }
            });
    }
    return (
        <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-6 mt-1 ">
                        <Form.Group className='d-flex'>
                            <Form.Check
                                type="checkbox"
                                style={{ cursor: "pointer", color: "#6c757d" }}
                                {...register('insuredPersonIsPatient')}
                                label="Insured person is the same person as the Patient"
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                        setInsuredPersonIsPatient(true);
                                    } else {
                                        setInsuredPersonIsPatient(false);
                                    }
                                }}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1 ">
                        <Form.Group className='d-flex'>
                            <Form.Check
                                type="checkbox"
                                defaultChecked={claimRepresentativeIsInsurer}
                                style={{ cursor: "pointer", color: "#6c757d" }}
                                {...register('claimRepresentativeIsInsurer')}
                                label="Claim representative is the insurer"
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                        setClaimRepresentativeIsInsurer(true);
                                    } else {
                                        setClaimRepresentativeIsInsurer(true);
                                    }
                                }}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Company</Form.Label>
                            <Form.Control placeholder='Auto Accident Company' {...register('autoAccidentCompany')} />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Payer ID</Form.Label>
                            <Form.Control placeholder='Auto Accident Company' {...register('autoAccidentPayerId')} />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Policy Number</Form.Label>
                            <Form.Control placeholder='Auto Accident Policy Number' {...register('autoAccidentPolicyNumber')} />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Case Number</Form.Label>
                            <Form.Control placeholder='Auto Accident Case Number' {...register('autoAccidentCaseNumber')} />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Payer Address</Form.Label>
                            <div style={{ position: 'relative' }}>

                                <Form.Control
                                    {...register('autoAccidentPayerAddress')}
                                    onChange={(e) => {
                                        getGeolocation(e);
                                        setFocused(true);
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
                                        overflow: 'auto',
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
                                                setValue('autoAccidentPayerZIP', data?.components?.postcode)
                                                setValue('autoAccidentPayerLatitude', data?.bounds?.southwest?.lat);
                                                setValue('autoAccidentPayerLongitude', data?.bounds?.southwest?.lng);
                                                setValue('autoAccidentPayerState', statesData && statesData?.find((state) => state?.state_code === data?.components?.state_code)?.name);
                                                setCitySearch(data?.components?.county)
                                                setSelectedState(statesData && statesData?.find((state) => state?.state_code === data?.components?.state_code))
                                                setValue('autoAccidentPayerAddress', data?.formatted)
                                                setFocused(false);
                                                setValue('mailingStreet', data?.components?.road)
                                                setValue('autoAccidentPayerTimeZone', data?.annotations?.timezone?.name)
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
                        </Form.Group>
                    </div>
                    <div className="col-3 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Payer State</Form.Label>
                            <Form.Select {...register('autoAccidentPayerState')}>
                                <option value="">Select State</option>
                                {statesData?.map((data, index) => (
                                    <option value={data?.name} key={data?._id}>{data?.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-3 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Payer City</Form.Label>
                            <Form.Select>
                                <option value=''>Select City</option>
                                {cities?.map((data) => (
                                    <option value={data?.name}>{data?.name}</option>
                                ))}
                            </Form.Select>
                            <Form.Control placeholder='Auto Accident Payer Address' {...register('autoAccidentPayerCity')} />
                        </Form.Group>
                    </div>
                    <div className="col-3 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Payer Longitude</Form.Label>
                            <Form.Control placeholder='Auto Accident Payer Address' {...register('autoAccidentPayerLongitude')} />
                        </Form.Group>
                    </div>
                    <div className="col-3 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Payer Latitude</Form.Label>
                            <Form.Control placeholder='Auto Accident Payer Address' {...register('autoAccidentPayerLatitude')} />
                        </Form.Group>
                    </div>
                    <div className="col-3 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Payer ZIP</Form.Label>
                            <Form.Control placeholder='Auto Accident Payer Address' {...register('autoAccidentPayerZIP')} />
                        </Form.Group>
                    </div>
                    <div className="col-3 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Payer Timezone</Form.Label>
                            <Form.Control placeholder='Auto Accident Payer Address' {...register('autoAccidentPayerTimeZone')} />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Date of Accident</Form.Label>
                            <Form.Control type='date' {...register('autoAccidentDateOfAccident')} />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>State of Occurence</Form.Label>
                            <Form.Select {...register('autoAccidentStateOfOccurrence')}>
                                <option value="">Select State</option>
                                {statesData?.map((data, index) => (
                                    <option value={data?.name} key={data?._id}>{data?.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Notes</Form.Label>
                            <Form.Control type='text' placeholder='Notes' {...register('autoAccidentNotes')} />
                        </Form.Group>
                    </div>
                    <hr className='mt-1 mb-0' />
                    <div className="col-6 mt-1  d-flex align-items-center">
                        <div className="row">
                            <div className="col-12 mt-1">
                                <Form.Group className=''>
                                    <Form.Check
                                        type="checkbox"
                                        defaultChecked={hasSimilarCondition}
                                        style={{ cursor: "pointer", color: "#6c757d" }}
                                        {...register('hasSimilarCondition')}
                                        label="Has patient ever had same or similar condition?"
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            if (isChecked) {
                                                setHasSimilarCondition(true);
                                            } else {
                                                setHasSimilarCondition(false);
                                            }
                                        }}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-12 mt-1">
                                <Form.Group>
                                    <Form.Label className='mb-0'>If yes, state when</Form.Label>
                                    <Form.Control type='date' {...register('when')}
                                        readOnly={!hasSimilarCondition}
                                    />
                                    {errors.when && (
                                        <span className="text-danger">{errors.when.message}</span>
                                    )}
                                </Form.Group>
                            </div>
                            <div className="col-12 mt-1">
                                <Form.Group>
                                    <Form.Label className='mb-0'>If yes, state why</Form.Label>
                                    <Form.Control type='text' {...register('why')}
                                        placeholder='Why'
                                        readOnly={!hasSimilarCondition}
                                    />
                                </Form.Group>
                            </div>
                        </div>

                    </div>
                    <div className="col-6 mt-1">
                        <div className="row">
                            <div className="col-12 mt-1">
                                <Form.Group className=''>
                                    <Form.Check
                                        type="checkbox"
                                        style={{ cursor: "pointer", color: "#6c757d" }}
                                        {...register('isPatientStillUnderCare')}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            if (isChecked) {
                                                setIsPatentStillUnderCare(true);
                                            } else {
                                                setIsPatentStillUnderCare(false);
                                            }
                                        }}
                                        label="Is patient still under your care for this condition ?"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-12 mt-1">
                                <Form.Group>
                                    <Form.Label className='mb-0'>Estimated duration of future treatment</Form.Label>
                                    <Form.Control as={'textarea'} readOnly={!isPatentStillUnderCare} {...register('estimatedDuration')} rows={3} />
                                </Form.Group>
                            </div>
                            <div className="col-12 mt-1"></div>
                        </div>
                    </div>

                    <hr className='mt-1 mb-0' />
                    <div className="col-6 mt-1">
                        <div className="row">
                            <div className="col-12 mt-1">
                                <Form.Group>
                                    <Form.Label className='mb-0'>Will injury result in permanent disfigurement or disability?</Form.Label>
                                    <Form.Select {...register('notDeterminable')} onChange={(e) => {
                                        if (e.target.value === 'Yes') {
                                            setPermanentDisfigurment(true)
                                        } else (
                                            setPermanentDisfigurment(false)
                                        )
                                    }}>
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                        <option value="Not determinable at this time">Not determinable at this time</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-12 mt-1">
                                <Form.Group>
                                    <Form.Label className='mb-0'>Patient was disabled (unable to work) from:</Form.Label>
                                    <Form.Control type='date' readOnly={!permanentDisfigurement} />
                                </Form.Group>
                            </div>

                        </div>

                    </div>
                    <div className="col-6 mt-1">
                        <div className="row">
                            <div className="col-12 mt-1">
                                <Form.Group>
                                    <Form.Label className='mb-0'>If yes, describe</Form.Label>
                                    <Form.Control as={'textarea'} readOnly={!permanentDisfigurement} {...register('description')} rows={3} />
                                </Form.Group>
                            </div>

                        </div>

                    </div>
                    <div className="col-12 mt-1">
                        <div className="row">
                            <div className="col-6 mt-1">
                                <Form.Group>
                                    <Form.Label className='mb-0'>Patient was disabled (unable to work) to:</Form.Label>
                                    <Form.Control type='date' readOnly={!permanentDisfigurement} />
                                </Form.Group>
                            </div>
                            <div className="col-6 mt-1"> <Form.Group>
                                <Form.Label className='mb-0'>If still disabled, patient should be able to return to work on:</Form.Label>
                                <Form.Control type='date' readOnly={!permanentDisfigurement} />
                            </Form.Group></div>
                        </div>
                    </div>
                    <hr className='mt-1 mb-0' />
                    <div className="col-12 mt-1  d-flex align-items-center">
                        <Form.Group className=''>
                            <Form.Check
                                type="checkbox"
                                style={{ cursor: "pointer", color: "#6c757d" }}
                                {...register('hasSimilarCondition')}
                                label="Will the patient require rehabilitation and/or occupational therapy as a result of the injuries sustained in this accident?"
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                        setRequiredRehabilitation(true);
                                    } else {
                                        setRequiredRehabilitation(false);
                                    }
                                }}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>If YES, please state your recommendation</Form.Label>
                            <Form.Control as={'textarea'} {...register('recommendation')} readOnly={!requiredRehabilitation} />
                        </Form.Group>
                    </div>
                </div>


                <div className="col-12 mt-1 d-flex align-items-center gap-2 justify-content-end">
                    <Button className='custom-buttons' disabled={store?.createInsuranceReducer?.loading} >Save and add another</Button>
                    <Button className='custom-buttons' disabled={store?.createInsuranceReducer?.loading} >Save and continue editing</Button>
                    <Button className='custom-buttons' disabled={store?.createInsuranceReducer?.loading} type='submit' >Save</Button>
                </div>
            </Form>
        </div>
    )
}

export default AutoAccident