import React, { useState, useEffect } from 'react';
import { Row, Col, Form, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { FiDownloadCloud, FiEye, FiInfo } from 'react-icons/fi';
import { CiCircleMinus } from 'react-icons/ci';
import { handleUpload } from '../../../helpers/HandleUpload';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { identifierOptions, licensureOptions } from '../../../utils/DataSets/commonData';
import { useSearchParams } from 'react-router-dom';

const DoctorIdentifierForm = ({
    defaultIdentifiers = [],
    defaultLicensure = [],
    onChange,
    setIdentifiers,
    identifiers,
    licensure,
    setLicensure,
}) => {
    const {
        formState: { errors },
        setValue,
        watch,
    } = useForm();
    const store = useSelector((state) => state);
    const [searchParams] = useSearchParams();
    const [identifierDocument, setIdentifierDocument] = useState({}); // Fixed typo
    const [licensureDocument, setLicensureDocument] = useState({});
    const doctorDetails = store?.getDoctorDetailsReducer?.data?.result;
    const statesData = store?.getStatesReducer?.data?.states;
    const id = searchParams.get('id');
    const updateId = id?.replace(/^check/, '');
    const [showPreview, setShowPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

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
                    type,
                    number: '',
                    file: null,
                    expiry: '',
                    issuingAuthority: '',
                    system: '',
                    ennumerationDate: '',
                    status: '',
                }))
            );
        }
    }, [defaultIdentifiers, setIdentifiers, identifiers.length]);
    useEffect(() => {
        if (licensure.length === 0) {
            setLicensure(
                defaultLicensure.map((type) => ({
                    type: '',
                    state: '',
                    number: '',
                    file: null,
                    expiry: '',
                    issuingAuthority: '',
                    system: '',
                    ennumerationDate: '',
                    status: '',
                }))
            );
        }
    }, [defaultLicensure, setLicensure, licensure.length]);

    const addIdentifier = () => {
        setIdentifiers([
            ...identifiers,
            {
                type: null,
                number: '',
                file: null,
                expiry: '',
                issuingAuthority: '',
                system: '',
                status: '',
                ennumerationDate: '',
            },
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
        setIdentifierDocument((prev) => ({ ...prev, [index]: true })); // Set loading state
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
            {
                type: null,
                number: '',
                file: null,
                expiry: '',
                issuingAuthority: '',
                system: '',
                ennumerationDate: '',
                licenseState: '',
                status: '',
            },
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

    const handleLicensureFileChange = async (e, index) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        setLicensureDocument((prev) => ({ ...prev, [index]: true })); // Set loading state

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
            const identifiersWithState =
                doctorDetails?.identifier?.filter((item) => item?.hasOwnProperty('licenseState')) || [];
            const identifiersWithoutState =
                doctorDetails?.identifier?.filter((item) => !item?.hasOwnProperty('licenseState')) || [];
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
                ennumerationDate: item?.ennumerationDate
                    ? new Date(item?.ennumerationDate).toISOString().split('T')[0]
                    : '',
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
                ennumerationDate: item?.ennumerationDate
                    ? new Date(item?.ennumerationDate).toISOString().split('T')[0]
                    : '',
            }));
            setIdentifiers(updatedIdentifiers);
            setLicensure(updatedLicensure);
        }
    }, [doctorDetails, statesData]);
    const handlePreview = (file) => {
        if (file?.url && /\.(jpg|jpeg|png|svg)$/i.test(file.name)) {
            setPreviewUrl(file.url);
            setShowPreview(true);
        }
    };

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
                        <Form.Label className="mb-0 mt-2">Identifier Type</Form.Label>
                        {index === 0 && defaultIdentifiers.length > 0 ? (
                            <Form.Control
                                type="text"
                                value={item?.type?.label || defaultIdentifiers[0].label}
                                readOnly
                                style={{
                                    background: '#e9ecef', // Bootstrap's disabled bg
                                    color: '#212529', // Bootstrap's default text color
                                    cursor: 'not-allowed',
                                }}
                                className="fw-semibold"
                                tabIndex={-1}
                            />
                        ) : (
                            <Form.Select
                                value={item?.system || item?.type?.value || ''}
                                onChange={(e) => {
                                    const selectedType = identifierOptions.find((opt) => opt.value === e.target.value);
                                    handleChange(index, 'type', selectedType);
                                }}
                                disabled={defaultIdentifiers.some((d) => d.value === item.type?.value)}>
                                <option value="" disabled>
                                    Select Identifier Type
                                </option>
                                {identifierOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Select>
                        )}
                    </Col>
                    <Col sm={3}>
                        <Form.Label className="mb-0 mt-2">Identifier Number</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Document Number"
                            maxLength={12}
                            value={item?.number || item?.value}
                            onChange={(e) => {
                                // Only allow alphanumeric for Medicaid
                                if (
                                    item?.type?.code === 'Medicaid' &&
                                    e.target.value &&
                                    !/^[A-Za-z0-9]*$/.test(e.target.value)
                                ) {
                                    return;
                                }
                                handleChange(index, 'number', e.target.value);
                            }}
                        />
                        {/* Show error only for Medicaid */}
                        {item?.type?.code === 'Medicaid' &&
                            item?.number &&
                            !/^[A-Za-z0-9]{9,12}$/.test(item.number) && (
                                <span className="text-danger">
                                    Must be 9-12 alphanumeric characters (no special characters)
                                </span>
                            )}
                    </Col>
                    <Col sm={3}>
                        <Form.Label className="mb-0 mt-2">Issuing Authority</Form.Label>
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
                        <Form.Label className="mb-0 mt-2">Start Date (Ennumeration Date)</Form.Label>
                        <Form.Control
                            type="date"
                            value={item?.ennumerationDate || ''}
                            onChange={(e) => handleChange(index, 'ennumerationDate', e.target.value)}
                            max={item?.expiry ? new Date(item.expiry).toISOString().split('T')[0] : undefined}
                        />
                    </Col>
                    <Col sm={3}>
                        <Form.Label className="mb-0 mt-2">Expiry Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={item?.expiry ? new Date(item.expiry).toISOString().split('T')[0] : ''}
                            min={
                                item?.ennumerationDate
                                    ? (() => {
                                          const start = new Date(item.ennumerationDate);
                                          start.setDate(start.getDate() + 1);
                                          return start.toISOString().split('T')[0];
                                      })()
                                    : new Date().toISOString().split('T')[0]
                            }
                            onChange={(e) => handleChange(index, 'expiry', e.target.value)}
                        />
                    </Col>
                    <Col sm={3}>
                        <Form.Label className="mb-0 mt-2">Status</Form.Label>
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
                        <Form.Label className="mb-0 mt-2">
                            Identifier Document{' '}
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id="tooltip-identifier">
                                        File size should be less than 2MB. Supported formats: JPG, PNG, JPEG, PDF.
                                    </Tooltip>
                                }>
                                <span className="text-secondary cursor-pointer mb-2">
                                    <FiInfo size={15} />
                                </span>
                            </OverlayTrigger>
                        </Form.Label>
                        <div
                            onClick={() => document.getElementById(`fileInput-identifier-${index}`).click()}
                            className={`custom-file-upload justify-content-between cursor-pointer ${
                                item?.file?.name ? 'form-control' : 'custom-form-fields'
                            }`}>
                            <span>
                                {identifierDocument[index]
                                    ? 'Uploading...'
                                    : item.file?.name
                                      ? item.file.name.length > 30
                                          ? item.file.name.slice(0, 25) + '...'
                                          : item.file.name
                                      : 'Upload Document'}
                            </span>
                            <div className="d-flex align-items-center gap-2">
                                {item.file?.url && (
                                    <FiEye
                                        className="text-secondary"
                                        style={{ cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePreview(item.file);
                                        }}
                                        title="Preview"
                                    />
                                )}
                                <span className="mb-0 d-inline-flex align-items-center">
                                    <FiDownloadCloud />
                                </span>
                            </div>
                        </div>

                        <Form.Control
                            type="file"
                            id={`fileInput-identifier-${index}`}
                            style={{ display: 'none' }}
                            accept=".png, .jpg, .jpeg, .pdf"
                            onChange={(e) => handleIdentifierFileChange(e, index)}
                        />
                        {/* <Form.Control
                            type="file"
                            id={`fileInput-identifier-${index}`}
                            style={{ display: 'none' }}
                            accept=".png, .jpg, .jpeg, .pdf"
                            onChange={(e) => handleIdentifierFileChange(e, index)}
                        /> */}
                        {errors?.[index]?.file && <span className="text-danger">Please upload a document</span>}
                        {index >= defaultIdentifiers?.length && (
                            <span
                                className="text-danger position-absolute cursor-pointer fs-5 fw-bold"
                                style={{ marginTop: '-29px', right: '-5px' }}
                                onClick={() => removeIdentifier(index)}>
                                <CiCircleMinus />
                            </span>
                        )}
                    </Col>
                    {identifiers?.length > 1 && index < identifiers.length - 1}
                </Row>
            ))}
            <Row>
                <Col sm={12} className="">
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
                        <Form.Label className="mb-0 mt-2">License Type</Form.Label>
                        <Form.Select
                            value={item?.system || item?.type?.value || ''}
                            onChange={(e) => {
                                const selectedType = licensureOptions.find((opt) => opt.value === e.target.value);
                                handleLicensureChange(index, 'type', selectedType);
                            }}
                            disabled={defaultLicensure.some((d) => d.value === item.type?.value)}>
                            <option value="" disabled>
                                Select License Type
                            </option>
                            {licensureOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col sm={3}>
                        <Form.Label className="mb-0 mt-2">State</Form.Label>
                        <Form.Select
                            value={item?.licenseState || ''}
                            onChange={(e) => handleLicensureChange(index, 'licenseState', e.target.value)}>
                            <option value="">Select state</option>
                            {statesData?.map((data) => (
                                <option key={data?._id} value={data?.name}>
                                    {data?.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col sm={3}>
                        <Form.Label className="mb-0 mt-2">Number</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Document Number"
                            maxLength={10}
                            value={item?.number || item?.value}
                            onChange={(e) => handleLicensureChange(index, 'number', e.target.value)}
                        />
                    </Col>
                    <Col sm={3}>
                        <Form.Label className="mb-0 mt-2">Issuing Authority</Form.Label>
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
                        <Form.Label className="mb-0 mt-2">Start Date (Ennumeration Date)</Form.Label>
                        <Form.Control
                            type="date"
                            value={item?.ennumerationDate || ''}
                            onChange={(e) => handleLicensureChange(index, 'ennumerationDate', e.target.value)}
                            maxLength={10}
                            // onChange={(e) => handleChange(index, 'number', e.target.value)}
                        />
                    </Col>
                    <Col sm={3}>
                        <Form.Label className="mb-0 mt-2">Expiry Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={item?.expiry ? new Date(item.expiry).toISOString().split('T')[0] : ''}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => handleLicensureChange(index, 'expiry', e.target.value)}
                        />
                    </Col>
                    <Col sm={3}>
                        <Form.Label className="mb-0 mt-2">Status</Form.Label>
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
                        <Form.Label className="mb-0 mt-2">
                            Document{' '}
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id="tooltip-identifier">
                                        File size should be less than 2MB. Supported formats: JPG, PNG, JPEG, PDF.
                                    </Tooltip>
                                }>
                                <span className="text-secondary cursor-pointer mb-2">
                                    <FiInfo size={15} />
                                </span>
                            </OverlayTrigger>
                        </Form.Label>
                        <div
                            onClick={() => document.getElementById(`fileInput-licensure-${index}`).click()}
                            className={`custom-file-upload justify-content-between cursor-pointer ${
                                item?.file?.name ? 'form-control' : 'custom-form-fields'
                            }`}>
                            <span>
                                {licensureDocument[index]
                                    ? 'Uploading...'
                                    : item.file?.name
                                      ? item.file.name.length > 30
                                          ? item.file.name.slice(0, 25) + '...'
                                          : item.file.name
                                      : 'Upload Document'}
                            </span>
                            <div className="d-flex align-items-center gap-2">
                                {item.file?.url && (
                                    <FiEye
                                        className="text-secondary"
                                        style={{ cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePreview(item.file);
                                        }}
                                        title="Preview"
                                    />
                                )}
                                <span className="mb-0 d-inline-flex align-items-center">
                                    <FiDownloadCloud />
                                </span>
                            </div>
                        </div>
                        <Form.Control
                            type="file"
                            id={`fileInput-licensure-${index}`}
                            style={{ display: 'none' }}
                            accept=".png, .jpg, .jpeg, .pdf"
                            onChange={(e) => handleLicensureFileChange(e, index)}
                        />
                        {errors?.[index]?.file && <span className="text-danger">Please upload a document</span>}
                        {index >= defaultIdentifiers?.length && (
                            <span
                                className="text-danger position-absolute cursor-pointer fs-5 fw-bold"
                                style={{ marginTop: '-29px', right: '-5px' }}
                                onClick={() => removeLicensure(index)}>
                                <CiCircleMinus />
                            </span>
                        )}
                    </Col>
                    {licensure?.length > 1 && index < licensure.length - 1}
                    <Modal show={showPreview} onHide={() => setShowPreview(false)} centered>
                        <Modal.Body>
                            <div className="d-flex justify-content-center">
                                <p className="fw-bold" style={{ color: '#6169D0' }}>
                                    {' '}
                                    File Preview
                                </p>
                            </div>
                            <div
                                style={{
                                    overflow: 'hidden',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <img
                                    src={previewUrl} // Set the source of the image
                                    alt="File Preview"
                                    style={{
                                        maxWidth: '100%', // Ensures the image fits within the modal width
                                        maxHeight: '100vh', // Prevents the image from exceeding the viewport height
                                        objectFit: 'contain', // Ensures the image maintains its aspect ratio
                                        display: 'block',
                                    }}
                                />
                            </div>
                        </Modal.Body>
                    </Modal>
                </Row>
            ))}
        </>
    );
};

export default DoctorIdentifierForm;
