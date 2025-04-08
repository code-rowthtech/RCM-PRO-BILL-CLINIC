import React, { useState, useEffect } from 'react';
import { Row, Col, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FiDownloadCloud, FiInfo } from 'react-icons/fi';
import { CiCircleMinus } from 'react-icons/ci';
import { handleUpload } from '../../../helpers/HandleUpload';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { identifierOptions, licensureOptions } from '../../../utils/DataSets/commonData'
import { useSearchParams } from 'react-router-dom';

const DoctorIdentifierForm = ({ defaultIdentifiers = [], defaultLicensure = [], onChange, setIdentifiers, identifiers, licensure, setLicensure }) => {
    const {
        formState: { errors },
        setValue,
        watch,
    } = useForm();
    const store = useSelector((state) => state);
    const [searchParams] = useSearchParams();
    const [identifierDocument, setIdentifierDocument] = useState(false); // Fixed typo
    const doctorDetails = store?.getDoctorDetailsReducer?.data?.result;
    const statesData = store?.getStatesReducer?.data?.states;
    const id = searchParams.get('id');
    const updateId = id?.replace(/^check/, '');

    const defaultIssuingAuthority = [
        'NPPES',
        'CLIA',
        'State Licensing Authority',
        'IRS',
        'CMS',
        'The Joint Commission',
        'Other',
    ];
    useEffect(() => {
        if (identifiers.length === 0) {
            setIdentifiers(
                defaultIdentifiers.map((type) => ({
                    type, number: '', file: null, expiry: '', issuingAuthority: '', system: '', ennumerationDate: '', status: '',
                }))
            );
        }
    }, [defaultIdentifiers, setIdentifiers, identifiers.length]);
    useEffect(() => {
        if (licensure.length === 0) {
            setLicensure(
                defaultLicensure.map((type) => ({
                    type: '', state: '', number: '', file: null, expiry: '', issuingAuthority: '', system: '', ennumerationDate: '', status: '',
                }))
            );
        }
    }, [defaultLicensure, setLicensure, licensure.length]);

    // useEffect(() => {
    //     onChange?.(identifiers);
    // }, [identifiers, onChange]);

    const addIdentifier = () => {
        setIdentifiers([
            ...identifiers,
            { type: null, number: '', file: null, expiry: '', issuingAuthority: '', system: '', status: '', ennumerationDate: '' },
        ]);
    };

    const removeIdentifier = (index) => {
        if (index < defaultIdentifiers.length) return; // Prevent removing default identifiers
        setIdentifiers(identifiers.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        const updatedIdentifiers = [...identifiers];
        updatedIdentifiers[index][field] = value;
        setIdentifiers(updatedIdentifiers);
    };

    const handleIdentifierFileChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        try {
            const url = await handleUpload(selectedFile, setIdentifierDocument); // Upload file
            setIdentifiers((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    file: {
                        url: url?.url?.split('?')[0],
                        name: selectedFile.name,
                    },
                };
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };



    // Licensure
    const addLicensure = () => {
        setLicensure([
            ...licensure,
            { type: null, number: '', file: null, expiry: '', issuingAuthority: '', system: '', ennumerationDate: '', licenseState: '', status: '' },
        ]);
    };

    const removeLicensure = (index) => {
        if (index < defaultLicensure.length) return; // Prevent removing default identifiers
        setLicensure(licensure.filter((_, i) => i !== index));
    };

    const handleLicensureChange = (index, field, value) => {
        const updatedLicensure = [...licensure];
        updatedLicensure[index][field] = value;
        setLicensure(updatedLicensure);
    };

    const [licensureDocument, setLicensureDocument] = useState(false)
    const handleLicensureFileChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        try {
            const url = await handleUpload(selectedFile, setLicensureDocument); // Upload file
            setLicensure((prevDetails) => {
                const updatedDetails = [...prevDetails];
                updatedDetails[index] = {
                    ...updatedDetails[index],
                    file: {
                        url: url?.url?.split('?')[0],
                        name: selectedFile.name,
                    },
                };
                return updatedDetails;
            });
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };
    useEffect(() => {
        if (doctorDetails && updateId) {
            const identifiersWithState = doctorDetails?.identifier?.filter(item => item?.hasOwnProperty('licenseState')) || [];
            const identifiersWithoutState = doctorDetails?.identifier?.filter(item => !item?.hasOwnProperty('licenseState')) || [];
            // Set qualifications data
            const updatedIdentifiers = identifiersWithoutState?.map((item, index) => ({
                expiry: item?.expiry ? new Date(item?.expiry).toISOString().split('T')[0] : '',
                file: item?.documents?.[0],
                issuingAuthority: item?.issuingAuthority,
                number: item?.value,
                system: '',
                type: {
                    code: item?.sliceName || '',
                    label: item?.identifierType || '',
                    value: item?.system || '',
                },
                file: item?.file?.[0],
                status: item?.status || '',
                ennumerationDate: item?.ennumerationDate ? new Date(item?.ennumerationDate).toISOString().split('T')[0] : '',
            }));
            const updatedLicensure = identifiersWithState?.map((item, index) => ({
                expiry: item?.expiry ? new Date(item?.expiry).toISOString().split('T')[0] : '',
                file: item?.documents?.[0],
                issuingAuthority: item?.issuingAuthority,
                number: item?.value,
                system: '',
                type: {
                    code: item?.sliceName || '',
                    label: item?.identifierType || '',
                    value: item?.system || '',
                },
                file: item?.file?.[0],
                licenseState: item?.licenseState || '',
                status: item?.status || '',
                ennumerationDate: item?.ennumerationDate ? new Date(item?.ennumerationDate).toISOString().split('T')[0] : '',
            }));
            setIdentifiers(updatedIdentifiers);
            setLicensure(updatedLicensure);
        }
    }, [doctorDetails, statesData]);
    return (
        <>
            <Row>
                <Col sm={12}>
                    <h5>
                        Identifiers
                        <span
                            className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                            onClick={addIdentifier}></span>
                    </h5>
                </Col>
            </Row>
            {/* Dynamic Identifier Fields */}
            {identifiers.map((item, index) => (
                <Row key={index} className="mb-0">
                    <Col sm={3}>
                        <Form.Label className='mb-0 mt-2'>Identifier Type</Form.Label>
                        <Form.Select
                            value={item?.system || item?.type?.value || ''}
                            onChange={(e) => {
                                const selectedType = identifierOptions.find((opt) => opt.value === e.target.value);
                                handleChange(index, 'type', selectedType);
                            }}
                            disabled={defaultIdentifiers.some((d) => d.value === item.type?.value)}
                        >
                            <option value="" disabled>Select Identifier Type</option>
                            {identifierOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Select>

                    </Col>
                    <Col sm={3}>
                        <Form.Label className='mb-0 mt-2'>Identifier Number</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Document Number"
                            maxLength={10}
                            value={item?.number || item?.value}
                            onChange={(e) => handleChange(index, 'number', e.target.value)}
                        />
                    </Col>
                    <Col sm={3}>
                        <Form.Label className='mb-0 mt-2'>Issuing Authority</Form.Label>
                        <Form.Select
                            value={item?.issuingAuthority || ''}
                            onChange={(e) => handleChange(index, 'issuingAuthority', e.target.value)}>
                            <option value="" disabled>
                                Select Issuing Authority
                            </option>
                            {defaultIssuingAuthority.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col sm={3}>
                        <Form.Label className='mb-0 mt-2'>Start Date (Ennumeration Date)</Form.Label>
                        <Form.Control
                            type="date"
                            value={item?.ennumerationDate || ''}
                            onChange={(e) => handleChange(index, 'ennumerationDate', e.target.value)}
                        />
                    </Col>
                    <Col sm={3}>
                        <Form.Label className='mb-0 mt-2'>Expiry Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={item?.expiry ? new Date(item.expiry).toISOString().split('T')[0] : ''}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => handleChange(index, 'expiry', e.target.value)}
                        />
                        {index >= defaultIdentifiers?.length && (
                            <span
                                className="text-danger position-absolute cursor-pointer fs-5 fw-bold"
                                style={{ marginTop: '-29px', right: '9px' }}
                                onClick={() => removeIdentifier(index)}>
                                <CiCircleMinus />
                            </span>
                        )}
                    </Col>
                    <Col sm={3}>
                        <Form.Label className='mb-0 mt-2'>Status</Form.Label>
                        <Form.Select
                            value={item?.status || 'active'}
                            onChange={(e) => handleChange(index, 'status', e.target.value)}>
                            <option value="">Select</option>
                            <option value="active">Active</option>
                            <option value="hold">Hold</option>
                            <option value="restricted">Restricted</option>
                            <option value="unrestricted">Unrestricted</option>
                        </Form.Select>
                    </Col>
                    <Col sm={3} className="mb-2 position-relative">
                        <Form.Label className='mb-0 mt-2'>Identifier Document  <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip id="tooltip-identifier">
                                    File size should be less than 2MB. Supported formats: JPG, PNG, JPEG, PDF.
                                </Tooltip>
                            }>
                            <span className="text-secondary cursor-pointer mb-2">
                                <FiInfo size={15} />
                            </span>
                        </OverlayTrigger></Form.Label>
                        <div
                            onClick={() => document.getElementById(`fileInput-identifier-${index}`).click()}
                            className={`custom-file-upload justify-content-between cursor-pointer ${item?.file?.name ? 'form-control' : 'custom-form-fields'
                                }`}>
                            {identifierDocument
                                ? 'Uploading...'
                                : item.file?.name
                                    ? item.file.name.length > 30
                                        ? item.file.name.slice(0, 25) + '...'
                                        : item.file.name
                                    : 'Upload Document'}
                            <p className="mb-0">
                                <FiDownloadCloud />
                            </p>
                        </div>
                        <Form.Control
                            type="file"
                            id={`fileInput-identifier-${index}`}
                            style={{ display: 'none' }}
                            accept=".png, .jpg, .jpeg, .pdf"
                            onChange={(e) => handleIdentifierFileChange(e, index)}
                        />
                        {errors?.[index]?.file && <span className="text-danger">Please upload a document</span>}
                    </Col>
                    {identifiers?.length > 1 && index < identifiers.length - 1 && <hr className="mt-2" />}

                </Row>
            ))}
            <hr />
            <Row>
                <Col sm={12}>
                    <h5>
                        Licensure & Certification
                        <span
                            className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                            onClick={addLicensure}></span>
                    </h5>
                </Col>
            </Row>

            {licensure?.map((item, index) => (
                <Row key={index} className="mb-0">
                    <Col sm={3}>
                        <Form.Label className='mb-0 mt-2'>License Type</Form.Label>
                        <Form.Select
                            value={item?.system || item?.type?.value || ''}
                            onChange={(e) => {
                                const selectedType = licensureOptions.find((opt) => opt.value === e.target.value);
                                handleLicensureChange(index, 'type', selectedType);
                            }}
                            disabled={defaultLicensure.some((d) => d.value === item.type?.value)}
                        >
                            <option value="" disabled>Select License Type</option>
                            {licensureOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Select>

                    </Col>
                    <Col sm={3}>
                        <Form.Label className='mb-0 mt-2'>State</Form.Label>
                        <Form.Select
                            value={item?.licenseState || ''}
                            onChange={(e) => handleLicensureChange(index, 'licenseState', e.target.value)}
                        >
                            <option value="">Select state</option>
                            {statesData?.map((data) => (
                                <option key={data?._id} value={data?.name}>
                                    {data?.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col sm={3}>
                        <Form.Label className='mb-0 mt-2'>Number</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Document Number"
                            maxLength={10}
                            value={item?.number || item?.value}
                            onChange={(e) => handleLicensureChange(index, 'number', e.target.value)}
                        />
                    </Col>
                    <Col sm={3}>
                        <Form.Label className='mb-0 mt-2'>Issuing Authority</Form.Label>
                        <Form.Select
                            value={item?.issuingAuthority || ''}
                            onChange={(e) => handleLicensureChange(index, 'issuingAuthority', e.target.value)}>
                            <option value="" disabled>
                                Select Issuing Authority
                            </option>
                            {defaultIssuingAuthority.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col sm={3}>
                        <Form.Label className='mb-0 mt-2'>Start Date (Ennumeration Date)</Form.Label>
                        <Form.Control
                            type="date"
                            value={item?.ennumerationDate || ''}
                            onChange={(e) => handleLicensureChange(index, 'ennumerationDate', e.target.value)}
                            maxLength={10}
                        // onChange={(e) => handleChange(index, 'number', e.target.value)}
                        />
                    </Col>
                    <Col sm={3}>
                        <Form.Label className='mb-0 mt-2'>Expiry Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={item?.expiry ? new Date(item.expiry).toISOString().split('T')[0] : ''}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => handleLicensureChange(index, 'expiry', e.target.value)}
                        />
                        {index >= defaultIdentifiers?.length && (
                            <span
                                className="text-danger position-absolute cursor-pointer fs-5 fw-bold"
                                style={{ marginTop: '-29px', right: '9px' }}
                                onClick={() => removeLicensure(index)}>
                                <CiCircleMinus />
                            </span>
                        )}
                    </Col>
                    <Col sm={3}>
                        <Form.Label className='mb-0 mt-2'>Status</Form.Label>
                        <Form.Select
                            value={item?.status || 'active'}
                            onChange={(e) => handleLicensureChange(index, 'status', e.target.value)}>
                            <option value="">Select</option>
                            <option value="active">Active</option>
                            <option value="hold">Hold</option>
                            <option value="restricted">Restricted</option>
                            <option value="unrestricted">Unrestricted</option>
                        </Form.Select>
                    </Col>
                    <Col sm={3} className=" position-relative">
                        <Form.Label className='mb-0 mt-2'>Document  <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip id="tooltip-identifier">
                                    File size should be less than 2MB. Supported formats: JPG, PNG, JPEG, PDF.
                                </Tooltip>
                            }>
                            <span className="text-secondary cursor-pointer mb-2">
                                <FiInfo size={15} />
                            </span>
                        </OverlayTrigger></Form.Label>
                        <div
                            onClick={() => document.getElementById(`fileInput-licensure-${index}`).click()}
                            className={`custom-file-upload justify-content-between cursor-pointer ${item?.file?.name ? 'form-control' : 'custom-form-fields'
                                }`}>
                            {licensureDocument
                                ? 'Uploading...'
                                : item.file?.name
                                    ? item.file.name.length > 30
                                        ? item.file.name.slice(0, 25) + '...'
                                        : item.file.name
                                    : 'Upload Document'}
                            <p className="mb-0">
                                <FiDownloadCloud />
                            </p>
                        </div>
                        <Form.Control
                            type="file"
                            id={`fileInput-licensure-${index}`}
                            style={{ display: 'none' }}
                            accept=".png, .jpg, .jpeg, .pdf"
                            onChange={(e) => handleLicensureFileChange(e, index)}
                        />
                        {errors?.[index]?.file && <span className="text-danger">Please upload a document</span>}
                    </Col>
                    {licensure?.length > 1 && index < licensure.length - 1 && <hr className="mt-2" />}
                </Row>
            ))}

        </>
    );
};

export default DoctorIdentifierForm;
