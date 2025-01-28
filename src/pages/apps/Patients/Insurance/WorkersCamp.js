import React, { useEffect, useState } from 'react'
import { Col, Form, Row, Button, Table, Modal, InputGroup, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createInsuranceAction, getCitiesAction, getStatesByCountryAction, updateInsuranceAction } from '../../../../redux/actions';
import { useForm } from 'react-hook-form';
import { encryptMessage } from '../../../../cryptoUtils';
import { useSearchParams } from 'react-router-dom';

const WorkersCamp = ({ patientId, activeTab }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const { handleSubmit, reset, register, errors, setValue } = useForm();
    const [searchedLocations, setSearchedLocations] = useState(null);
    const cities = store?.getCitiesReducer?.cities1?.data?.cities;
    const [selectedState, setSelectedState] = useState(null);
    const [citySearch, setCitySearch] = useState(null);
    const [focused, setFocused] = useState(false);
    const statesData = store?.getStatesReducer?.data?.states;
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const insuranceByPatient = store?.getInsuranceByIdReducer?.data?.insurance;

    const workersComp = insuranceByPatient && insuranceByPatient?.find((data) => data?.insuranceType === `Worker's Comp`)
    useEffect(() => {
        if (id && insuranceByPatient) {
            setValue('carrierPayerId', workersComp?.carrierPayerId)
            setValue('insuranceCarrierCode', workersComp?.insuranceCarrierCode)
            setValue('insuranceCaseNumber', workersComp?.insuranceCaseNumber)
            setValue('insuranceGroupName', workersComp?.insuranceGroupName)
            setValue('insuranceGroupNumber', workersComp?.insuranceGroupNumber)
            setValue('insurancePayerCity', workersComp?.insurancePayerCity)
            setValue('insurancePayerState', workersComp?.insurancePayerState)
            setValue('insurancePayerZip', workersComp?.insurancePayerZip)
            setValue('insuranceProvider', workersComp?.insuranceProvider)
            setValue('insuranceWcbNumber', workersComp?.insuranceWcbNumber)
            setValue('insurancePayerAddress', workersComp?.insurancePayerAddress)
            setValue('insuranceWcbRatingCode', workersComp?.insuranceWcbRatingCode)
            setValue('propertyCasualtyClaimNumber', workersComp?.propertyCasualtyClaimNumber)
            setValue('stateOfOccurrence', workersComp?.stateOfOccurrence)
            setValue('workerCampLatitude', workersComp?.workerCampLatitude)
            setValue('workerCampLongitude', workersComp?.workerCampLongitude)
            setValue('workerCampTimeZone', workersComp?.workerCampTimeZone)
            setValue('workersCompNotes', workersComp?.workersCompNotes)
            setValue('dateOfAccident', new Date(workersComp?.dateOfAccident).toISOString().split('T')[0]);
        }
    }, [insuranceByPatient, id])

    useEffect(() => {
        if (selectedState) {
            dispatch(getCitiesAction({ state_code: selectedState?.id, name: citySearch ? citySearch : '', limit: 25, skip: '' }))
        }
    }, [selectedState])

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
            ...(id && workersComp ? { id: workersComp?._id } : {}),
            insuranceType: `Worker's Comp`,
            patientId: patientId,
        };

        if (id && workersComp) {
            dispatch(updateInsuranceAction({ key: encryptMessage(payload) }))
        } else {
            dispatch(createInsuranceAction({ key: encryptMessage(payload) }));
        }
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
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Provider</Form.Label>
                            <Form.Control className='mb-1' type='text' placeholder='Insurance Provider' {...register("insuranceProvider")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Payer ID</Form.Label>
                            <Form.Control className='mb-1' type='text' placeholder='Insurance Payer ID' {...register("carrierPayerId")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Group Name</Form.Label>
                            <Form.Control className='mb-1' type='text' placeholder='Insurance Group Name' {...register("insuranceGroupName")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Group Number</Form.Label>
                            <Form.Control className='mb-1' type='text' placeholder='Insurance Group Number' {...register("insuranceGroupNumber")} />
                        </Form.Group>
                    </div>
                    <div className="col-6">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Payer Address</Form.Label>
                            <div style={{ position: 'relative' }}>
                                <Form.Control
                                    {...register('insurancePayerAddress')}
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
                                                setValue('insurancePayerZip', data?.components?.postcode)
                                                setValue('workerCampLatitude', data?.bounds?.southwest?.lat);
                                                setValue('workerCampLongitude', data?.bounds?.southwest?.lng);
                                                setValue('insurancePayerState', statesData && statesData?.find((state) => state?.state_code === data?.components?.state_code)?.name);
                                                setCitySearch(data?.components?.county)
                                                setSelectedState(statesData && statesData?.find((state) => state?.state_code === data?.components?.state_code))
                                                setValue('insurancePayerAddress', data?.formatted)
                                                setFocused(false);
                                                setValue('workerCampTimeZone', data?.annotations?.timezone?.name)
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
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Payer State</Form.Label>
                            <Form.Select {...register('insurancePayerState')}>
                                <option value="">Select State</option>
                                {statesData?.map((data, index) => (
                                    <option value={data?.name} key={data?._id}>{data?.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Payer City</Form.Label>
                            <Form.Select
                                {...register("insurancePayerCity")}
                            >
                                <option value=''>Select City</option>
                                {cities?.map((data) => (
                                    <option value={data?.name}>{data?.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Longitude</Form.Label>
                            <Form.Control className='mb-1' type='text' placeholder='Longitude' {...register("workerCampLongitude")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Latitude</Form.Label>
                            <Form.Control className='mb-1' type='text' placeholder='Latitude' {...register("workerCampLatitude")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>ZIP</Form.Label>
                            <Form.Control className='mb-1' type='text' maxLength={5} placeholder='ZIP' {...register("insurancePayerZip")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>TimeZone</Form.Label>
                            <Form.Control className='mb-1' type='text' placeholder='TimeZone' {...register("workerCampTimeZone")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Date of Accident</Form.Label>
                            <Form.Control className='mb-1' type='date' {...register("dateOfAccident")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance W.C.B. #</Form.Label>
                            <Form.Control className='mb-1' placeholder='Insurance W.C.B. #' {...register("insuranceWcbNumber")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance W.C.B. Rating Code</Form.Label>
                            <Form.Control className='mb-1' placeholder='Insurance W.C.B. Rating Code' {...register("insuranceWcbRatingCode")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Carrier Code</Form.Label>
                            <Form.Control className='mb-1' placeholder='Insurance Carrier Code' {...register("insuranceCarrierCode")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Case #</Form.Label>
                            <Form.Control className='mb-1' placeholder='Insurance Case #' {...register("insuranceCaseNumber")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>State of Occurence</Form.Label>
                            <Form.Select {...register('stateOfOccurrence')}>
                                <option value="">Select State</option>
                                {statesData?.map((data, index) => (
                                    <option value={data?.name} key={data?._id}>{data?.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Property & Casualty Agency Claim # </Form.Label>
                            <Form.Control className='mb-1' placeholder='Property & Casualty Agency Claim #' {...register("propertyCasualtyClaimNumber")} />
                        </Form.Group>
                    </div>
                    <div className="col-6">
                        <Form.Group>
                            <Form.Label className='mb-0'>Workers comp notes </Form.Label>
                            <Form.Control className='mb-1' rows={3} as={'textarea'} placeholder='Workers comp notes' {...register("workersCompNotes")} />
                        </Form.Group>
                    </div>
                </div>

                <div className="col-12 d-flex my-2 align-items-center gap-2 justify-content-end">
                    <Button className='custom-buttons btn-height' disabled={store?.createInsuranceReducer?.loading} >Save and add another</Button>
                    <Button className='custom-buttons btn-height' disabled={store?.createInsuranceReducer?.loading} >Save and continue editing</Button>
                    <Button className='custom-buttons btn-height' disabled={store?.createInsuranceReducer?.loading} type='submit' >Save</Button>
                </div>
            </Form>
        </div>
    )
}

export default WorkersCamp