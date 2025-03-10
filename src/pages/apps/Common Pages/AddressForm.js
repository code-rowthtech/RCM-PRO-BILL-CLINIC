import React, { useEffect, useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { FiDownloadCloud } from 'react-icons/fi';
import { CiCircleMinus } from 'react-icons/ci';
import { getCitiesAction } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';

const AddressForm = ({addresses,setAddresses}) => {
    const [activeAddressIndex, setActiveAddressIndex] = useState(null);
    const [addressFocused, setAddressFocused] = useState(false);
    const [searchedLocations, setSearchedLocations] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const statesData = store?.getStatesReducer?.data;
    console.log(statesData, 'statesData');
    const cities1 = store?.getCitiesReducer?.cities1?.data?.cities;
    console.log(cities1, 'cities');
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

    // const [addresses, setAddresses] = useState([
    //     { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: '' }, // Default address
    // ]);
    const addAddress = () => {
        setAddresses([
            ...addresses,
            { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: '' },
        ]);
    };

    const removeAddress = (index) => {
        if (addresses.length > 1) {
            setAddresses(addresses.filter((_, i) => i !== index));
        }
    };

    const addressUses = ['home', 'work', 'temp', 'old', 'billing', 'mailing', 'primary'];
    const addressTypes = ['postal', 'physical', 'both'];

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

    const handleAddressChange = (index, field, value) => {
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
    const handleStateSelection = (e, index) => {
        const selectedOption = e.target.selectedOptions[0];
        const stateData = JSON.parse(selectedOption.getAttribute('data-key'));

        if (stateData) {
            // Update the address with selected state
            const updatedAddresses = [...addresses];
            updatedAddresses[index].state = stateData.name;
            setAddresses(updatedAddresses);

            // Fetch cities for selected state
            dispatch(getCitiesAction({ state_code: stateData.id, name: '', limit: 25, skip: '' }));
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
                <Row key={index} className="mb-2">
                    <Col sm={3} className="mb-2">
                        <Form.Label className="mb-1">Type</Form.Label>
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
                    <Col sm={3} className="mb-2">
                        <Form.Label className="mb-1">Use</Form.Label>
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
                    <Col sm={3} className="mb-2 position-relative">
                        <Form.Label className="mb-1">Address</Form.Label>
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
                                            // Extract the necessary fields from the API response
                                            // const formatted = data.formatted || '';
                                            // const components = data.components || {};
                                            // Build the new address object with auto-populated fields
                                            const newAddress = {
                                                use: item.use, // preserve existing use
                                                line: [data?.formatted ? data?.formatted : ''],
                                                city:
                                                    data?.components.city ||
                                                    data?.components.town ||
                                                    data?.components.village ||
                                                    '',
                                                state: data?.components.state
                                                    ? data?.components.state
                                                    : data?.components.state_code,
                                                postalCode: data?.components.postcode || item.postalCode || '', // Auto-fill or keep user input
                                                country: data?.components?.country || '',
                                            };
                                            // Update the specific address entry
                                            const updatedAddresses = [...addresses];
                                            console.log(updatedAddresses, 'updatedAddresses11');
                                            updatedAddresses[index] = newAddress;
                                            setAddresses(updatedAddresses);
                                            // Clear suggestions and remove focus
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

                    <Col sm={3} className="mb-2">
                        <Form.Label className="mb-1">State</Form.Label>
                        <Form.Select
                            value={item.state || ''}
                            {...register(`address[${index}].state`)}
                            onChange={(e) => handleStateSelection(e, index)}>
                            <option value="">Select State</option>
                            {statesData?.states?.map((data) => (
                                <option key={data.id} data-key={JSON.stringify(data)} value={data.name}>
                                    {data.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col sm={3} className="mb-2">
                        <Form.Label className="mb-1">City</Form.Label>
                        <Form.Select
                            data-has-value={!!getValues(`address[${index}].city`)}
                            {...register(`address[${index}].city`)}
                            // disabled={!selectedState || store?.getCitiesReducer?.loading}
                        >
                            <option value="">{store?.getCitiesReducer?.loading ? 'Loading...' : 'Select City'}</option>
                            {cities1?.map((data) => (
                                <option selected={data?.name == addresses[0]?.city} key={data?.name} value={data?._id}>
                                    {data?.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>

                    <Col sm={3}>
                        <Form.Group className="mb-2">
                            <Form.Label className="mb-1">Postal Code</Form.Label>
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
