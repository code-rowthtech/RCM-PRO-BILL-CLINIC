import React, { useState, useEffect } from 'react';
import { Row, Col, Form, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { FiDownloadCloud, FiInfo, FiEye } from 'react-icons/fi';
import { CiCircleMinus } from 'react-icons/ci';
import { handleUpload } from '../../../helpers/HandleUpload';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const IdentifierForm = ({ defaultIdentifiers = [], onChange, setIdentifiers, identifiers }) => {
    const {
        formState: { errors },
        setValue,
        watch,
    } = useForm();
    const store = useSelector((state) => state);

    const [identifierDocument, setIdentifierDocument] = useState(false); // Fixed typo
    const [constantIdentifiers, setConstantIdentifiers] = useState([]);
    const doctorDetails = store?.getDoctorDetailsReducer?.data?.result;
    const patientDetails = store?.getPatientByIdReducer?.data?.data;

    const identifierOptions = [
        { label: 'National Provider Identifier (NPI)', value: 'http://hl7.org/fhir/sid/us-npi', code: 'NPI' },
        // { label: 'State Medical License', value: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'MED-LIC' },
        { label: 'DEA Number (Controlled Substances)', value: 'http://www.nabp.pharmacy/DEA', code: 'DEA' },
        { label: 'Board Certification', value: 'http://www.abms.org/certification', code: 'BOARD-CERT' },
        { label: `Tax Identification Number (TIN)`, value: 'http://hl7.org/fhir/sid/us-tin', code: 'TIN' },
        // { label: 'Medicare Provider Number', value: 'http://hl7.org/fhir/sid/us-medicare', code: 'Medicare' },
        { label: 'Medicaid Provider Number', value: 'http://hl7.org/fhir/sid/us-medicaid', code: 'Medicaid' },
        { label: 'Medical Record Number (MRN)', value: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'MR' },
        { label: 'Social Security Number (SSN)', value: 'http://hl7.org/fhir/sid/us-ssn', code: 'SSN' },
        { label: 'Driver’s License Number', value: 'urn:oid:2.16.840.1.113883.4.3.25', code: 'DL' },
        { label: 'Health Plan Beneficiary Number', value: 'http://hl7.org/fhir/sid/us-medicare', code: 'HPI' },
        { label: 'Passport Number', value: 'urn:oid:2.16.840.1.113883.4.3.2', code: 'PPN' },
        { label: 'Veterans Affairs ID (VA ID)', value: 'http://va.gov/fhir/sid/va', code: 'VA' },
    ];

    const defaultIssuingAuthority = [
        'NPPES',
        'CLIA',
        'State Licensing Authority',
        'IRS',
        'CMS',
        'The Joint Commission',
        'Dun & Bradstreet',
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
                }))
            );
        }
    }, [defaultIdentifiers, setIdentifiers, identifiers.length]);

    // useEffect(() => {
    //     onChange?.(identifiers);
    // }, [identifiers, onChange]);

    const addIdentifier = () => {
        setIdentifiers([
            ...identifiers,
            { type: null, number: '', file: null, expiry: '', issuingAuthority: '', system: '' },
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

    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    const handlePreview = (file) => {
        if (file?.url) {
            setPreviewUrl(file.url.split('?')[0]);
            setShowPreview(true);
        }
    };

    const handleDownload = async (file) => {
        if (!file?.url) return;
        try {
            const response = await fetch(file.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name || 'document';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            window.open(file.url, '_blank');
        } catch (error) {
            window.open(file.url, '_blank');
        }
    };

    const handleIdentifierFileChange = async (e, index) => {
        setSelectedIndex(index)
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        try {
            const uploadResult = await handleUpload(selectedFile, setIdentifierDocument);
            if (uploadResult?.url) {
                setIdentifiers((prevDetails) => {
                    const updatedDetails = [...prevDetails];
                    updatedDetails[index] = {
                        ...updatedDetails[index],
                        file: {
                            url: uploadResult.url,
                            name: selectedFile.name,
                        },
                    };
                    setSelectedIndex(null)
                    return updatedDetails;
                });
            }
        } catch (error) {
            console.error('Error during file upload:', error);
            setSelectedIndex(null);
        }
    };
    useEffect(() => {
        if (patientDetails) {
            // Set qualifications data

            setValue('specialist', patientDetails?.specialties?.[0]);
        }
    }, [patientDetails]);
    return (
        <div >
            <Row>
                <Col sm={12}>
                    <h5>
                        Identifier
                        <span
                            className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                            onClick={addIdentifier}></span>
                    </h5>
                </Col>
            </Row>

            {/* Table Header */}
            <Row className="fw-bold">
                <Col>
                    <Form.Label>Identifier Type</Form.Label>
                </Col>
                <Col>
                    <Form.Label>Identifier Number</Form.Label>
                </Col>
                <Col className="d-flex align-items-center gap-2">
                    <Form.Label>Identifier Document</Form.Label>

                    {/* Tooltip Icon */}
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
                </Col>
                <Col>
                    <Form.Label>Issuing Authority</Form.Label>
                </Col>
                <Col>
                    <Form.Label>Identifier Expiry (If Applicable)</Form.Label>
                </Col>
            </Row>

            {/* Dynamic Identifier Fields */}
            {identifiers.map((item, index) => (
                <Row key={index} className="mb-2">
                    <Col>
                        <Form.Select
                            value={item?.system || item?.type?.value || ''}
                            data-has-value={!!(item?.system || item?.type?.value)}
                            onChange={(e) => {
                                const selectedType = identifierOptions.find((opt) => opt.value === e.target.value);
                                handleChange(index, 'type', selectedType);
                            }}
                        >
                            <option value="" disabled>Select Identifier Type</option>
                            {identifierOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Select>

                    </Col>

                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Document Number"
                            maxLength={10}
                            value={item?.number || item?.value}
                            data-has-value={!!(item?.number || item?.value)}
                            onChange={(e) => handleChange(index, 'number', e.target.value)}
                        />

                    </Col>
                    <Col className="mb-2 position-relative">
                        <div
                            onClick={() => document.getElementById(`fileInput-identifier-${index}`).click()}
                            className={`custom-file-upload justify-content-between cursor-pointer ${item?.file?.name ? 'form-control' : 'custom-form-fields'
                                }`}>
                            <span>
                                {index === selectedIndex
                                    ? 'Uploading...'
                                    : item.file?.name
                                        ? item?.file?.name?.length > 30
                                            ? item?.file?.name?.slice(0, 25) + '...'
                                            : item?.file?.name
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
                                {item.file?.url && (
                                    <FiDownloadCloud
                                        className="text-secondary"
                                        style={{ cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownload(item.file);
                                        }}
                                        title="Download"
                                    />
                                )}
                            </div>
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

                    <Col>
                        <Form.Select
                            value={item?.issuingAuthority || ''}
                            data-has-value={!!(item?.issuingAuthority)}
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

                    <Col className={`position-relative ${identifiers?.length > 1 ? 'pe-4' : ''}`}>
                        <Form.Control
                            type="date"
                            value={item?.expiry ? new Date(item.expiry).toISOString().split('T')[0] : ''}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => handleChange(index, 'expiry', e.target.value)}
                        />
                        {index >= defaultIdentifiers?.length && (
                            <span
                                className="text-danger position-absolute cursor-pointer fs-5 fw-bold"
                                style={{ marginTop: '-29px', right: '12px' }}
                                onClick={() => removeIdentifier(index)}>
                                <CiCircleMinus />
                            </span>
                        )}
                    </Col>
                </Row>
            ))}

            <Modal show={showPreview} onHide={() => setShowPreview(false)} centered>
                <Modal.Body>
                    <div className="d-flex justify-content-center">
                        <p className="fw-bold" style={{ color: '#6169D0' }}>
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
                        {previewUrl?.toLowerCase().endsWith('.pdf') ? (
                            <iframe
                                src={previewUrl}
                                title="PDF Preview"
                                width="100%"
                                height="500px"
                                style={{ border: 'none' }}
                            />
                        ) : (
                            <img
                                src={previewUrl}
                                alt="File Preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100vh',
                                    objectFit: 'contain',
                                    display: 'block',
                                }}
                            />
                        )}
                    </div>
                </Modal.Body>
            </Modal>        </div>
    );
};

export default IdentifierForm;
