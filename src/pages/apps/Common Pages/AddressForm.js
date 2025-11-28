import React, { useEffect, useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { FiDownloadCloud } from 'react-icons/fi';
import { FiMinusCircle } from "react-icons/fi";
import { getCities2Action, getCities3Action, getCitiesAction, getStatesByCountryAction } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import ToastHandle from '../../../helpers/ToastMessage';
import { useLocation } from 'react-router-dom';
import PatientDetails from '../Patients/UpdatePatient/PatientDetails';

const AddressForm = ({ addresses, setAddresses }) => {
    const [activeAddressIndex, setActiveAddressIndex] = useState(null);
    const [addressFocused, setAddressFocused] = useState(false);
    const [searchedLocations, setSearchedLocations] = useState([]);
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const statesData = store?.getStatesReducer?.data;
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;
    const cities2 = store?.getCitiesReducer?.cities2?.data?.cities;
    const cities3 = store?.getCitiesReducer?.cities3?.data?.cities;

    useEffect(() => {
        if (statesData?.length === 0) {
            dispatch(getStatesByCountryAction());
        }
    }, [statesData, dispatch]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const {
        control,
        register,
        setValue,
        getValues,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();
    const addressUses = ['home', 'work', 'temp', 'old', 'billing', 'mailing', 'primary'];
    const addressTypes = ['physical', 'mailing'];

    const addAddress = () => {
        if (addresses?.length === addressTypes?.length) {
            ToastHandle(`Maximum ${addressTypes?.length} addresses are allowed.`, 'danger');
            return;
        }

        // Find the first available address type
        const usedTypes = addresses?.map((address) => address?.type);
        const availableType = addressTypes?.find((type) => !usedTypes?.includes(type)) || addressTypes[0];

        setAddresses([
            ...addresses,
            { type: availableType, use: '', line: [''], city: '', state: '', postalCode: '', country: '' },
        ]);
    };
    const removeAddress = (index) => {
        if (addresses.length > 1) {
            setAddresses(addresses.filter((_, i) => i !== index));
        }
    };

    const getGeolocation = (e) => {
        const addressToSearch = e.target.value;
        async function fetchGeocodeData(location) {
            const apiKey = '2a77840d874f4c35848e37042ce7c8ed'; // Replace with your API key
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
                setSearchedLocations(data?.results);
            }
        });
    };

    const fetchLocationByZip = async (zipCode) => {
        if (zipCode.length === 5 && /^[0-9]+$/.test(zipCode)) {
            try {
                const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
                if (response.ok) {
                    const data = await response.json();
                    return {
                        state: data.places[0]['state'],
                        city: data.places[0]['place name']
                    };
                }
            } catch (error) {
                console.error('Error fetching location:', error);
            }
        }
        return null;
    };

    const handleAddressChange = async (index, field, value, lineIndex = 0) => {
        if (field === 'type' && addresses?.some((address, i) => i !== index && address?.type === value)) {
            ToastHandle('This address type is already selected. Please choose a different type.', 'danger');
            return; // Prevent selection
        }

        const updatedAddresses = [...addresses];
        if (field === 'line') {
            const updatedLines = [...updatedAddresses[index].line];
            updatedLines[lineIndex] = value;
            updatedAddresses[index].line = updatedLines;
        } else {
            updatedAddresses[index][field] = value;

            if (field === 'postalCode') {
                const locationData = await fetchLocationByZip(value);
                if (locationData) {
                    updatedAddresses[index].state = locationData.state;
                    updatedAddresses[index].city = locationData.city;
                    const stateObj = statesData?.states?.find((s) => s.name === locationData.state);
                    if (stateObj) {
                        const cityPayload = {
                            state_code: stateObj.id,
                            name: locationData.city,
                            limit: 25,
                            skip: '',
                        };
                        if (updatedAddresses[index].type === 'physical') {
                            dispatch(getCitiesAction(cityPayload));
                        } else if (updatedAddresses[index].type === 'mailing') {
                            dispatch(getCities2Action(cityPayload));
                        } else {
                            dispatch(getCities3Action(cityPayload));
                        }
                    }
                }
            }
            if (field === 'type' && updatedAddresses[index].state) {
                updatedAddresses[index].city = ''; // Clear city selection
                const stateObj = statesData?.states?.find((s) => s.name === updatedAddresses[index].state);
                if (stateObj) {
                    const cityPayload = {
                        state_code: stateObj.id,
                        name: '',
                        limit: 25,
                        skip: '',
                    };

                    if (value === 'physical') {
                        dispatch(getCitiesAction(cityPayload));
                    } else if (value === 'mailing') {
                        dispatch(getCities2Action(cityPayload));
                    } else {
                        dispatch(getCities3Action(cityPayload));
                    }
                }
            }
        }
        setAddresses(updatedAddresses);
    };

    useEffect(() => {
        if (selectedLocation) {
            setValue('address', selectedLocation?.formatted);
            const stateId =
                statesData?.states &&
                statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?.id;
            const selectedState =
                statesData?.states &&
                statesData?.states.find((data) => data?.state_code === selectedLocation?.components?.state_code)?._id;
            setValue('stateName', selectedState);
            const countyName = selectedLocation?.components?.county;
            dispatch(getCitiesAction({ state_code: stateId, name: countyName, limit: '', skip: '' }));
        }
    }, [selectedLocation, setValue, statesData, dispatch]);
    const handleStateSelection = (e, addressType, index) => {
        const selectedOption = e.target.selectedOptions[0];
        const stateData = JSON.parse(selectedOption.getAttribute('data-key'));
        if (stateData) {
            // Update the address with selected state
            const updatedAddresses = [...addresses];
            updatedAddresses[index].state = stateData.name;
            setAddresses(updatedAddresses);
            // Fetch cities for selected state
            if (addressType === 'physical') {
                dispatch(getCitiesAction({ state_code: stateData?.id, name: '', limit: 25, skip: '' }));
            } else if (addressType === 'mailing') {
                dispatch(getCities2Action({ state_code: stateData?.id, name: '', limit: 25, skip: '' }));
            } else {
                dispatch(getCities3Action({ state_code: stateData?.id, name: '', limit: 25, skip: '' }));
            }
        }
    };

    const patientDetails = store?.getPatientByIdReducer?.data?.data;

    useEffect(() => {
        if (patientDetails && statesData?.states) {
            patientDetails?.address?.forEach((address) => {
                const stateObj = statesData?.states?.find((data) => data?.name === address?.state);
                const stateCode = stateObj?.id;

                if (!stateCode) return;

                const cityPayload = {
                    state_code: stateCode,
                    name: address?.city || '',
                    limit: 25,
                    skip: '',
                };

                switch (address?.type) {
                    case 'physical':
                        dispatch(getCitiesAction(cityPayload));
                        break;
                    case 'mailing':
                        dispatch(getCities2Action(cityPayload));
                        break;
                    default:
                        dispatch(getCities3Action(cityPayload));
                        break;
                }
            });
        }
    }, [patientDetails, statesData]);

    const addAddressLine = (index) => {
        if (addresses[index]?.line?.length === 3) {
            ToastHandle('Maximum 3 address lines are allowed.', 'danger');
            return;
        }
        setAddresses((prev) => {
            const updated = [...prev];
            const currentAddress = { ...updated[index] };

            // Copy the line array and add a new empty line
            currentAddress.line = [...(currentAddress.line || []), ''];

            updated[index] = currentAddress;
            return updated;
        });
    };

    const removeAddressLine = (addressIndex, lineIndex) => {
        if (addresses[addressIndex].line.length > 1) {
            const updatedAddresses = [...addresses];
            updatedAddresses[addressIndex].line.splice(lineIndex, 1);
            setAddresses(updatedAddresses);
        }
    };

    return (
        <Form>
            <Row>
                <Col sm={12}>
                    <h5>
                        {`Address Details`}
                        <span
                            className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                            onClick={addAddress}></span>
                    </h5>
                </Col>
            </Row>
            {addresses?.map((item, index) => (
                <Row key={index} className="mb-1 position-relative">
                    <Col sm={3} className="mb-0" style={{ height: 'fit-content' }}>
                        <Form.Label className="mb-0">Type</Form.Label>
                        <Form.Select
                            value={item.type}
                            className="text-capitalize"
                            {...register(`address[${index}].type`)}
                            onChange={(e) => handleAddressChange(index, 'type', e.target.value)}>
                            <option value="" hidden>
                                {`Select`}
                            </option>
                            {addressTypes?.sort((a, b) => a.localeCompare(b))?.map((type) => (
                                <option key={type} className="text-capitalize" value={type}>
                                    {type}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col sm={3} className="mb-0" style={{ height: 'fit-content' }}>
                        <Form.Label className="mb-0">Use</Form.Label>
                        <Form.Select
                            value={item.use}
                            className="text-capitalize"
                            {...register(`address[${index}].use`)}
                            onChange={(e) => handleAddressChange(index, 'use', e.target.value)}>
                            <option value="" hidden>
                                {`Select`}
                            </option>
                            {addressUses?.sort((a, b) => a.localeCompare(b))?.map((use) => (
                                <option key={use} className="text-capitalize" value={use}>
                                    {use}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col sm={3} className="mb-1 position-relative" style={{ height: 'fit-content' }}>
                        <Form.Label className="mb-0">
                            Line 1{' '}
                            <span
                                className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                onClick={() => addAddressLine(index)}></span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Street Address"
                            value={item.line[0]}
                            onChange={(e) => {
                                handleAddressChange(index, 'line', e.target.value);
                                setActiveAddressIndex(index);
                                setAddressFocused(true);
                                getGeolocation(e)?.then((data) => {
                                    if (data && data.results) {
                                        setSearchedLocations(data.results);
                                    }
                                });
                            }}
                            onFocus={() => {
                                setActiveAddressIndex(index);
                                setAddressFocused(true);
                            }}
                            onBlur={() => {
                                setTimeout(() => setAddressFocused(false), 200);
                            }}
                        />
                        {activeAddressIndex === index && addressFocused && searchedLocations?.length > 0 && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    width: '100%',
                                    maxHeight: '150px',
                                    overflowY: 'auto',
                                    zIndex: 111,
                                    backgroundColor: '#fff',
                                    border: '1px solid #ced4da',
                                    borderTop: 'none',
                                }}>
                                {searchedLocations?.map((data, suggestionIndex) => (
                                    <p
                                        key={suggestionIndex}
                                        onClick={() => {
                                            const state = statesData?.states?.find(
                                                (s) => s.name === data.components?.state
                                            );
                                            const stateCode = state?.id;
                                            const cityName =
                                                data.components?.city ||
                                                data.components?.town ||
                                                data.components?.village ||
                                                data.components?.normalize_city ||
                                                '';
                                            if (item?.type === 'physical') {
                                                dispatch(
                                                    getCitiesAction({
                                                        state_code: stateCode,
                                                        name: cityName,
                                                        limit: 25,
                                                        skip: '',
                                                    })
                                                );
                                            } else if (item?.type === 'mailing') {
                                                dispatch(
                                                    getCities2Action({
                                                        state_code: stateCode,
                                                        name: cityName,
                                                        limit: 25,
                                                        skip: '',
                                                    })
                                                );
                                            } else {
                                                dispatch(
                                                    getCities3Action({
                                                        state_code: stateCode,
                                                        name: cityName,
                                                        limit: 25,
                                                        skip: '',
                                                    })
                                                );
                                            }
                                            const newAddress = {
                                                ...item,
                                                line: [data.formatted || '', ...(item.line?.slice(1) || [])], // keep existing lines after the first
                                                state: data.components?.state || '',
                                                city: cityName,
                                                postalCode: data.components?.postcode || '',
                                                country: data.components?.country || '',
                                            };
                                            const updatedAddresses = [...addresses];
                                            updatedAddresses[index] = newAddress;
                                            setAddresses(updatedAddresses);
                                            setSearchedLocations([]);
                                            setAddressFocused(false);
                                        }}
                                        style={{
                                            margin: 0,
                                            padding: '8px 12px',
                                            cursor: 'pointer',
                                        }}
                                        className="hover-bg-change text-black">
                                        {data.formatted}
                                    </p>
                                ))}
                            </div>
                        )}
                    </Col>
                    {item.line.slice(1).map((line, lineIndex) => (
                        <Col key={lineIndex} sm={3} className="mb-1" style={{ height: 'fit-content' }}>
                            <Form.Label className="mb-0">
                                Line {lineIndex + 2}
                                <span
                                    className="fs-5 uil-minus-circle minusicon ms-1 fw-bold cursor-pointer text-danger"
                                    onClick={() => removeAddressLine(index, lineIndex + 1)}></span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Additional Address"
                                value={line || ''}
                                onChange={(e) => handleAddressChange(index, 'line', e.target.value, lineIndex + 1)}
                            />
                        </Col>
                    ))}
                    <Col sm={3} className="mb-0" style={{ height: 'fit-content' }}>
                        <Form.Label className="mb-0">State</Form.Label>
                        <Form.Select
                            value={item.state || ''}
                            {...register(`address[${index}].state`)}
                            onChange={(e) => handleStateSelection(e, item?.type, index)}>
                            <option value="">{store?.getStatesReducer?.loading ? `Loading...` : `Select State`}</option>
                            {statesData?.states?.map((data) => (
                                <option key={data.id} data-key={JSON.stringify(data)} value={data.name}>
                                    {data.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col sm={3} className="mb-0" style={{ height: 'fit-content' }}>
                        <Form.Label className="mb-0">City</Form.Label>
                        <Form.Select
                            value={item?.city}
                            {...register(`address[${index}].city`)}
                            onChange={(e) => {
                                handleAddressChange(index, 'city', e.target.value);
                            }}
                            disabled={
                                item?.type === 'physical'
                                    ? store?.getCitiesReducer?.cities1?.loading
                                    : item?.type === 'mailing'
                                        ? store?.getCitiesReducer?.cities2?.loading
                                        : store?.getCitiesReducer?.cities3?.loading
                            }>
                            <option value="">
                                {item?.type === 'physical'
                                    ? store?.getCitiesReducer?.cities1?.loading
                                        ? 'Loading...'
                                        : 'Select City'
                                    : item?.type === 'mailing'
                                        ? store?.getCitiesReducer?.cities2?.loading
                                            ? 'Loading...'
                                            : 'Select City'
                                        : store?.getCitiesReducer?.cities3?.loading
                                            ? 'Loading...'
                                            : 'Select City'}
                            </option>
                            {(() => {
                                const cities =
                                    item?.type === 'physical' ? cities1 : item?.type === 'mailing' ? cities2 : cities3;

                                return cities?.map((data) => (
                                    <option key={data?._id} value={data?.name}>
                                        {item?.type === 'physical'
                                            ? store?.getCitiesReducer?.cities1?.loading
                                                ? 'Loading...'
                                                : data?.name
                                            : item?.type === 'mailing'
                                                ? store?.getCitiesReducer?.cities2?.loading
                                                    ? 'Loading...'
                                                    : data?.name
                                                : store?.getCitiesReducer?.cities3?.loading
                                                    ? 'Loading...'
                                                    : data?.name}
                                    </option>
                                ));
                            })()}
                        </Form.Select>
                    </Col>
                    <Col sm={2} style={{ height: 'fit-content' }} className={` ${addresses?.length > 1 ? 'pe-4 d-flex align-items-center' : ''}`}>
                        <Form.Group className="mb-0">
                            <Form.Label className="mb-0">ZIP Code</Form.Label>
                            <Form.Control
                                type="text"
                                value={item.postalCode || ''}
                                placeholder="ZIP Code"
                                maxLength={5}
                                {...register(`address[${index}].postalCode`, {
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
                                        !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                            />
                            {errors?.address?.[index]?.postalCode && (
                                <span className="text-danger">{errors.address[index].postalCode.message}</span>
                            )}
                        </Form.Group>
                        {addresses.length > 1 && index !== 0 && (
                            <span
                                onClick={() => removeAddress(index)}
                                className="text-danger cursor-pointer fs-5 ms-2 mt-3"
                                title="Remove Address">
                                <FiMinusCircle />
                            </span>
                        )}
                    </Col>
                </Row>
            ))}
        </Form>
    );
};

export default AddressForm;