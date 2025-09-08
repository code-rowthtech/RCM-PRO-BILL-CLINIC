import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createDoctorDetailAction, getDoctorDetailsAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import { useForm } from 'react-hook-form';
import { getMastersDataAction } from '../../../redux/settings/action';
import { useSearchParams } from 'react-router-dom';
import { CiCircleMinus } from 'react-icons/ci';
import DoctorIdentifierForm from './DoctorIdentifier';
import { taxonomyOptions as taxonomy } from '../../../utils/DataSets/commonData';
import AsyncSelect from 'react-select/async';
const DepartmentDetails = ({ setActiveTab, docId }) => {
    // const defaultIdentifiers = ['NPI'];
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const doctorDetails = store?.getDoctorDetailsReducer?.data?.result;
    const statesData = store?.getStatesReducer?.data?.states;
    const createResponse = store?.createtDoctorsDetailReducer?.data?.status
    const id = doctorDetails?._id;
    const { handleSubmit, setValue } = useForm();
    const [searchParams] = useSearchParams();

    const updateId = searchParams.get('id');
    const formattedTaxonomyOptions = taxonomy?.map((option) => ({
        value: option,
        label: option.code + ' - ' + option.displayName,
    }));

    const [identifiers, setIdentifiers] = useState([]);
    const [licensure, setLicensure] = useState([]);

    const defaultIdentifiers = [
        {
            label: 'National Provider Identifier (NPI)',
            value: 'http://hl7.org/fhir/sid/us-npi',
            code: 'NPI',
        },
    ];

    const defaultLicensure = [
        {
            label: '',
            value: '',
            code: '',
        },
    ];

    // Load data from API when doctorDetails is available
    useEffect(() => {
        if (doctorDetails?.identifier) {
            const identifierData = [];
            const licensureData = [];

            doctorDetails.identifier.forEach((item) => {
                const formattedItem = {
                    type: {
                        label: item.type?.text || item.identifierType,
                        value: item.system,
                        code: item.type?.coding?.[0]?.code || item.sliceName
                    },
                    number: item.value,
                    file: item.file?.[0] || item.documents?.[0],
                    expiry: item.expiry ? new Date(item.expiry).toISOString().split('T')[0] : '',
                    issuingAuthority: item.issuingAuthority,
                    status: item.status,
                    ennumerationDate: item.ennumerationDate ? new Date(item.ennumerationDate).toISOString().split('T')[0] : '',
                    licenseState: item.licenseState
                };

                if (item.licenseState) {
                    licensureData.push(formattedItem);
                } else {
                    identifierData.push(formattedItem);
                }
            });

            setIdentifiers(identifierData);
            setLicensure(licensureData);
        }
    }, [doctorDetails]);

    const onsubmit = (data) => {
        let finalIdentifiersData = [];
        if (identifiers) {
            identifiers.forEach((element) => {
                let data = {
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
                    status: element?.status,
                    ennumerationDate: element?.ennumerationDate,
                };
                finalIdentifiersData.push(data);
            });
        }
        let finalLicensureData = [];
        if (licensure) {
            licensure.forEach((element) => {
                let licensureData = {
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
                    licenseState: element?.licenseState,
                    status: element?.status,
                    ennumerationDate: element?.ennumerationDate,
                };
                finalLicensureData.push(licensureData);
            });
        }
        const taxonomyCodes = taxonomyCodesList?.map((item) => ({
            type: item?.type,
            code: item?.code?.code,
            Grouping: item?.code?.grouping,
            Classification: item?.code?.classification,
            Specialization: item?.code?.specialization,
            Definition: item?.code?.definition,
            Notes: item?.code?.notes,
            displayName: item?.code?.displayName,
            section: item?.code?.section,
            state: item?.state,
            licenseNumber: item?.licenseNumber,
            status: item?.status === 'active' ? true : false,
        }));
        const payload = {
            ...(updateId ? { doctorId: id } : { doctorId: docId }),
            identifier: [...finalIdentifiersData, ...finalLicensureData],
            taxonomy: taxonomyCodes,
        };
        dispatch(createDoctorDetailAction({ key: encryptMessage(payload) }));
    };

    useEffect(() => {
        if (createResponse === 200) {
            if (updateId) {
                const payload = { id: updateId };
                dispatch(getDoctorDetailsAction(payload));
            } else {
                const payload = { id: docId };
                dispatch(getDoctorDetailsAction(payload));
            }
            setActiveTab('qualifications');
        }
    }, [createResponse, setActiveTab, updateId, docId, dispatch])

    useEffect(() => {
        if (doctorDetails) {
            // Load taxonomy codes
            if (doctorDetails?.taxonomy?.length > 0) {
                const updatedTaxonomyCodes = doctorDetails.taxonomy.map((item) => ({
                    type: item?.type || '',
                    displayName: item?.displayName || '',
                    code: {
                        code: item?.code,
                        grouping: item?.Grouping,
                        classification: item?.Classification,
                        specialization: item?.Specialization,
                        definition: item?.Definition,
                        notes: item?.Notes,
                        displayName: item?.displayName,
                        section: item?.section
                    },
                    state: item?.state || '',
                    licenseNumber: item?.licenseNumber || '',
                    status: item?.status === true ? 'active' : 'inactive',
                }));
                setTaxonomyCodesList(updatedTaxonomyCodes);
            }
        }
    }, [doctorDetails]);

    useEffect(() => {
        dispatch(getMastersDataAction({ status: true, category: 'Department', search: '', skip: '', limit: '' }));

        // Load doctor details when component mounts
        if (updateId || docId) {
            const payload = { id: updateId || docId };
            dispatch(getDoctorDetailsAction(payload));
        }
    }, [dispatch, updateId, docId]);

    const [taxonomyCodesList, setTaxonomyCodesList] = useState([
        {
            type: 'primary',
            code: '',
            //   state: '', licenseNumber: '',
            status: ''
        },
    ]);
    const addTaxonomyCode = () => {
        setTaxonomyCodesList([
            ...taxonomyCodesList,
            {
                type: '',
                code: '',
                Grouping: '',
                Classification: '',
                Specialization: '',
                Definition: '',
                Notes: '',
                displayName: '',
                section: '',
                state: '',
                licenseNumber: '',
                status: '',
            },
        ]);
    };
    const handleTaxonomyChange = (selectedOption, index) => {
        const updatedList = [...taxonomyCodesList];
        updatedList[index] = {
            ...updatedList[index],
            code: selectedOption?.value || '',
            displayName: selectedOption?.label || '',
        };
        setTaxonomyCodesList(updatedList);
    };

    const loadTaxonomyOptions = (inputValue, callback) => {
        if (!inputValue) {
            callback(formattedTaxonomyOptions.slice(0, 10));
            return;
        }
        const filteredOptions = formattedTaxonomyOptions.filter((option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        callback(filteredOptions.slice(0, 20)); // Return up to 20 results on search
    };

    const removeTaxonomyItem = (index) => {
        setTaxonomyCodesList((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <>
            <div className="container-fluid px-0">
                <Form onSubmit={handleSubmit(onsubmit)}>
                    {store?.getDoctorDetailsReducer?.loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '75vh' }}>
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            <Row className="mt-1 scroll-container" style={{ height: '75vh', overflow: 'scroll' }}>
                                <Col sm={12}>
                                    <DoctorIdentifierForm
                                        defaultIdentifiers={defaultIdentifiers}
                                        defaultLicensure={defaultLicensure}
                                        identifiers={identifiers}
                                        setIdentifiers={setIdentifiers}
                                        licensure={licensure}
                                        setLicensure={setLicensure}
                                    />
                                    <Row>
                                        <Col sm={12} className="mt-2">
                                            <h5>
                                                Taxonomy Codes
                                                <span
                                                    className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                                    onClick={addTaxonomyCode}></span>
                                            </h5>
                                        </Col>
                                        {taxonomyCodesList?.map((data, index) => (
                                            <Row key={index} className={`mb-1 position-relative ${taxonomyCodesList?.length > 1 ? 'px-3 ' : ''}`}>
                                                {taxonomyCodesList?.length > 1 ? (
                                                    <strong className='position-absolute fw-semibold fs-6' style={{ top: '28%', left: '0.2%' }}>{index + 1}.</strong>
                                                ) : (<></>)}
                                                <Col sm={3} className="mb-1">
                                                    <Form.Group>
                                                        <Form.Label className="mb-0">Code</Form.Label>
                                                        <AsyncSelect
                                                            loadOptions={loadTaxonomyOptions}
                                                            defaultOptions={formattedTaxonomyOptions.slice(0, 10)}
                                                            isSearchable
                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            placeholder=" Select"
                                                            value={
                                                                formattedTaxonomyOptions.find(
                                                                    (opt) => opt.value === data.code
                                                                ) ||
                                                                formattedTaxonomyOptions.find(
                                                                    (opt) => opt.value.code === data.code.code
                                                                )
                                                            }
                                                            onChange={(selected) =>
                                                                handleTaxonomyChange(selected, index)
                                                            }
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
                                                                menuPortal: (base) => ({ ...base, zIndex: 9999 }), // ensures it's on top
                                                            }}
                                                            menuPortalTarget={document.body} // renders menu to body
                                                            menuPosition="fixed" // avoids clipping
                                                        />

                                                    </Form.Group>
                                                </Col>

                                                {/* <Col sm={3}>
                                                    <Form.Label className="mb-0">License Number</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="License Number"
                                                        value={data.licenseNumber}
                                                        onChange={(e) => {
                                                            const updatedList = [...taxonomyCodesList];
                                                            updatedList[index].licenseNumber =
                                                                e.target.value.toUpperCase();
                                                            setTaxonomyCodesList(updatedList);
                                                        }}
                                                        maxLength={10}
                                                    />
                                                </Col> */}
                                                <Col sm={3} style={{ paddingRight: '3px' }}>
                                                    <Form.Label className="mb-0">Type</Form.Label>
                                                    <Form.Select
                                                        value={data.type || 'primary'}
                                                        onChange={(e) => {
                                                            const updatedList = [...taxonomyCodesList];
                                                            updatedList[index].type = e.target.value;
                                                            setTaxonomyCodesList(updatedList);
                                                        }}>
                                                        <option value="">Select</option>
                                                        <option value="primary">Primary</option>
                                                        <option value="secondary">Secondary</option>
                                                    </Form.Select>
                                                </Col>
                                                {/* <Col sm={3} className="pe-0" style={{ paddingLeft: '20px ' }}>
                                                    <Form.Label className="mb-0">State</Form.Label>
                                                    <Form.Select
                                                        value={data.state}
                                                        onChange={(e) => {
                                                            const updatedList = [...taxonomyCodesList];
                                                            updatedList[index].state = e.target.value;
                                                            setTaxonomyCodesList(updatedList);
                                                        }}>
                                                        <option value="">Select State</option>
                                                        {statesData?.map((state, idx) => (
                                                            <option key={idx} value={state?.name}>
                                                                {state?.name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Col> */}
                                                <Col sm={3} className="position-relative">
                                                    <Form.Label className="mb-0">Status</Form.Label>
                                                    <Form.Select
                                                        value={data.status}
                                                        onChange={(e) => {
                                                            const updatedList = [...taxonomyCodesList];
                                                            updatedList[index].status = e.target.value;
                                                            setTaxonomyCodesList(updatedList);
                                                        }}>
                                                        <option value="" hidden>
                                                            Select Status
                                                        </option>
                                                        <option value="active">Active</option>
                                                        <option value="inactive">Inactive</option>
                                                    </Form.Select>
                                                    {index > 0 && (
                                                        <span
                                                            className="text-danger cursor-pointer position-absolute fs-5 fw-bold"
                                                            style={{ right: '-2%', top: '49%' }}
                                                            onClick={() => removeTaxonomyItem(index)}>
                                                            <CiCircleMinus />
                                                        </span>
                                                    )}
                                                </Col>

                                                {taxonomyCodesList?.length >= 1 &&
                                                    index < taxonomyCodesList?.length - 1 && <hr className="mt-2" />}
                                            </Row>
                                        ))}
                                    </Row>
                                </Col>
                            </Row>

                            <div
                                className="d-flex justify-content-end gap-2 mt-1"
                                style={{ height: '6vh', overflow: 'hidden' }}>
                                <Button className="cancel-button" onClick={() => setActiveTab('personalDetails')}>
                                    Previous
                                </Button>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="custom-buttons"
                                    disabled={store?.createtDoctorsDetailReducer?.loading}
                                    style={{ width: '120px' }}>
                                    {store?.createtDoctorsDetailReducer?.loading ? (
                                        <Spinner color="white" className="spinner-border-sm" />
                                    ) : (
                                        'Update & Next'
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
};

export default DepartmentDetails;
