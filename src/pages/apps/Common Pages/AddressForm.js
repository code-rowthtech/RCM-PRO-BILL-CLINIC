import React, { useEffect, useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { FiDownloadCloud } from 'react-icons/fi';
import { CiCircleMinus } from 'react-icons/ci';
import { getCities2Action, getCities3Action, getCitiesAction } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import ToastHandle from '../../../helpers/ToastMessage';
import { useLocation } from 'react-router-dom';
import PatientDetails from '../Patients/UpdatePatient/PatientDetails';

const AddressForm = ({ addresses, setAddresses }) => {
    const [activeAddressIndex, setActiveAddressIndex] = useState(null);
    const [addressFocused, setAddressFocused] = useState(false);
    const [searchedLocations, setSearchedLocations] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const statesData = store?.getStatesReducer?.data;
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;
    const cities2 = store?.getCitiesReducer?.cities2?.data?.cities;
    const cities3 = store?.getCitiesReducer?.cities3?.data?.cities;
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
    // const addAddress = () => {
    //     if (addresses?.length === 3) {
    //         ToastHandle('Maximun 3 addresses are allowed.', 'danger');
    //         return;
    //     }
    //     setAddresses([
    //         ...addresses,
    //         { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: '' },
    //     ]);
    // };
    const addAddress = () => {
        if (addresses?.length === 3) {
            ToastHandle('Maximum 3 addresses are allowed.', 'danger');
            return;
        }

        // Find the first available address type
        const usedTypes = addresses.map((address) => address.type);
        const availableType = addressTypes.find((type) => !usedTypes.includes(type)) || addressTypes[0];

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

    const addressUses = ['home', 'work', 'temp', 'old', 'billing', 'mailing', 'primary'];
    const addressTypes = ['physical', 'postal', 'both'];

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

    // const handleAddressChange = (index, field, value) => {
    //     const updatedAddresses = [...addresses];
    //     if (field === 'line') {
    //         updatedAddresses[index].line[0] = value; // update street address
    //     } else {
    //         updatedAddresses[index][field] = value;
    //     }
    //     setAddresses(updatedAddresses);
    // };

    const handleAddressChange = (index, field, value) => {
        if (field === 'type' && addresses?.some((address, i) => i !== index && address?.type === value)) {
            ToastHandle('This address type is already selected. Please choose a different type.', 'danger');
            return; // Prevent selection
        }

        // if(addresses?.some((address) => address?.use === field)) {}
        const updatedAddresses = [...addresses];
        if (field === 'line') {
            updatedAddresses[index].line[0] = value; // update street address
        } else {
            updatedAddresses[index][field] = value;
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
            } else if (addressType === 'postal') {
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
                    skip: ''
                };

                switch (address?.type) {
                    case 'physical':
                        dispatch(getCitiesAction(cityPayload));
                        break;
                    case 'postal':
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
        setAddresses(prev => {
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
                        Address Details
                        <span
                            className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                            onClick={addAddress}></span>
                    </h5>
                </Col>
            </Row>
            {addresses?.map((item, index) => (
                <Row key={index} className="mb-0">
                    <Col sm={3} className="mb-0" style={{ height: 'fit-content' }}>
                        <Form.Label className="mb-0">Type</Form.Label>
                        <Form.Select
                            value={item.type}
                            className="text-capitalize"
                            data-has-value={!!watch(`address[${index}].type`)}
                            {...register(`address[${index}].type`)}
                            onChange={(e) => handleAddressChange(index, 'type', e.target.value)}>
                            <option value="" hidden>
                                Select
                            </option>
                            {addressTypes?.map((type) => (
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
                            data-has-value={!!watch(`address[${index}].use`)}
                            {...register(`address[${index}].use`)}
                            onChange={(e) => handleAddressChange(index, 'use', e.target.value)}>
                            <option value="" hidden>
                                Select
                            </option>
                            {addressUses?.map((use) => (
                                <option key={use} className="text-capitalize" value={use}>
                                    {use}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col sm={3} className="mb-1 position-relative" style={{ height: 'fit-content' }}>
                        <Form.Label className="mb-0">Line 1   <span
                            className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                            onClick={() => addAddressLine(index)}></span></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Street Address"
                            value={item.line[0]}
                            onChange={(e) => {
                                handleAddressChange(index, 'line', e.target.value);
                                // Set active index so suggestions appear for this address
                                setActiveAddressIndex(index);
                                setAddressFocused(true);
                                // Call your geolocation API with the current input value
                                getGeolocation(e)?.then((data) => {
                                    // Expecting your getGeolocation to return an object with results
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
                                            const state = statesData?.states?.find(s => s.name === data.components?.state);
                                            const stateCode = state?.id;
                                            const cityName = data.components?.city || data.components?.town || data.components?.village || '';

                                            // Dispatch city load based on address type
                                            if (item?.type === 'physical') {
                                                dispatch(getCitiesAction({ state_code: stateCode, name: cityName, limit: 25, skip: '' }));
                                            } else if (item?.type === 'postal') {
                                                dispatch(getCities2Action({ state_code: stateCode, name: cityName, limit: 25, skip: '' }));
                                            } else {
                                                dispatch(getCities3Action({ state_code: stateCode, name: cityName, limit: 25, skip: '' }));
                                            }

                                            // Update address
                                            const newAddress = {
                                                ...item,
                                                line: [data.formatted || '', ...(item.line?.slice(1) || [])],  // keep existing lines after the first
                                                state: data.components?.state || '',
                                                city: cityName,
                                                postalCode: data.components?.postcode || '',
                                                country: data.components?.country || '',
                                            };


                                            const updatedAddresses = [...addresses];
                                            updatedAddresses[index] = newAddress;
                                            setAddresses(updatedAddresses);

                                            // Clear suggestions
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
                        <Col key={lineIndex} sm={3} className="mb-1 position-relative" style={{ height: 'fit-content' }}>
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
                            <option value="">Select State</option>
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
                            data-has-value={!!getValues(`address[${index}].city`)}
                            {...register(`address[${index}].city`)}
                            // disabled={!selectedState || store?.getCitiesReducer?.loading}
                            onChange={(e) => {
                                handleAddressChange(index, 'city', e.target.value);
                            }}
                        >
                            <option value="">{store?.getCitiesReducer?.loading ? 'Loading...' : 'Select City'}</option>
                            {(() => {
                                const cities =
                                    item?.type === 'physical' ? cities1 :
                                        item?.type === 'postal' ? cities2 :
                                            cities3;

                                return cities?.map((data) => (
                                    <option key={data?._id} value={data?.name}>
                                        {data?.name}
                                    </option>
                                ));
                            })()}
                        </Form.Select>
                    </Col>

                    <Col sm={3} style={{ height: 'fit-content' }}>
                        <Form.Group className="mb-0">
                            <Form.Label className="mb-0">Postal Code</Form.Label>
                            <Form.Control
                                type="text"
                                value={item.postalCode || ''} // Ensure empty string if undefined
                                placeholder="Postal Code"
                                {...register(`address[${index}].postalCode`, {
                                    minLength: {
                                        value: 5,
                                        message: 'Postal code must be at least 5 characters long',
                                    },
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: 'Postal code must contain numbers only',
                                    },
                                })}
                                maxLength={5}
                                onChange={(e) => {
                                    handleAddressChange(index, 'postalCode', e.target.value);
                                }}
                            />
                            {addresses.length > 1 && index !== 0 && (
                                <span
                                    className="text-danger cursor-pointer position-absolute fs-5 fw-bold"
                                    style={{ right: '-2%', top: '50%' }}
                                    onClick={() => removeAddress(index)}>
                                    <CiCircleMinus />
                                </span>
                            )}
                            {errors.postalCode && <span className="text-danger">{errors.postalCode.message}</span>}
                        </Form.Group>
                    </Col>
                </Row>
            ))}
        </Form>
    );
};

export default AddressForm;
