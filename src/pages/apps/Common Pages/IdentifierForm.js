import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { FiDownloadCloud } from 'react-icons/fi';
import { CiCircleMinus } from 'react-icons/ci';
import { handleUpload } from '../../../helpers/HandleUpload';

const IdentifierForm = ({ defaultIdentifiers = []  }) => {
    const identifierOptions = [
        { label: 'National Provider Identifier (NPI)', value: 'http://hl7.org/fhir/sid/us-npi', code: 'NPI' },
        { label: 'State Medical License', value: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'MED-LIC' },
        { label: 'DEA Number (Controlled Substances)', value: 'http://www.nabp.pharmacy/DEA', code: 'DEA' },
        { label: 'Board Certification', value: 'http://www.abms.org/certification', code: 'BOARD-CERT' },
        { label: 'Tax Identification Number (TIN)', value: 'http://hl7.org/fhir/sid/us-tin', code: 'TIN' },
        { label: 'Medicare Provider Number', value: 'http://hl7.org/fhir/sid/us-medicare', code: 'Medicare' },
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

    const [identifiers, setIdentifiers] = useState([]);
    const [identifierDocument, setIdentifierDocument] = useState(false);

    useEffect(() => {
        // Initialize identifiers with default types
        setIdentifiers(
            defaultIdentifiers.map((type) => ({
                type,
                number: '',
                file: null,
                expiry: '',
                issuingAuthority: '',
            }))
        );
    }, []);

    const addIdentifier = () => {
        setIdentifiers([...identifiers, { type: null, number: '', file: null, expiry: '', issuingAuthority: '' }]);
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
            const updatedIdentifiers = [...identifiers];
            updatedIdentifiers[index].file = {
                url: url?.url?.split('?')[0],
                name: selectedFile.name,
            };
            setIdentifiers(updatedIdentifiers);
        } catch (error) {
            console.error('Error during file upload:', error);
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

            {/* Table Header */}
            <Row className="fw-bold">
                <Col>
                    <Form.Label>Identifier Type</Form.Label>
                </Col>
                <Col>
                    <Form.Label>Identifier Number</Form.Label>
                </Col>
                <Col>
                    <Form.Label>Identifier Document</Form.Label>
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
                    {/* Identifier Type */}
                    <Col>
                        <Form.Select
                            value={item.type?.value || ''}
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
                    </Col>

                    {/* Identifier Number */}
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Document Number"
                            value={item.number}
                            onChange={(e) => handleChange(index, 'number', e.target.value)}
                        />
                    </Col>

                    {/* File Upload */}
                    <Col>
                        <div
                            onClick={() => document.getElementById(`fileInput-identifier-${index}`).click()}
                            className="custom-file-upload cursor-pointer">
                            {item.file?.name || 'Upload Document'}
                            <FiDownloadCloud />
                        </div>
                        <Form.Control
                            type="file"
                            id={`fileInput-identifier-${index}`}
                            style={{ display: 'none' }}
                            accept=".png, .jpg, .jpeg, .pdf"
                            onChange={(e) => handleIdentifierFileChange(e, index)}
                        />
                    </Col>

                    {/* Issuing Authority */}
                    <Col>
                        <Form.Select
                            value={item.issuingAuthority}
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

                    {/* Expiry Date */}
                    <Col>
                        <Form.Control
                            type="date"
                            value={item.expiry}
                            onChange={(e) => handleChange(index, 'expiry', e.target.value)}
                        />
                        {index >= defaultIdentifiers.length && (
                            <span className="text-danger cursor-pointer" onClick={() => removeIdentifier(index)}>
                                <CiCircleMinus />
                            </span>
                        )}
                    </Col>
                </Row>
            ))}
        </>
    );
};

export default IdentifierForm;
