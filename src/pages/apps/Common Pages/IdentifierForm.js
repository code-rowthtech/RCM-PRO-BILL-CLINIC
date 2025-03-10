import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { FiDownloadCloud } from 'react-icons/fi';
import { CiCircleMinus } from 'react-icons/ci';
import { handleUpload } from '../../../helpers/HandleUpload';

const IdentifierForm = () => {
    const [identifiers, setIdentifiers] = useState([]);
    const defaultIdentifiers = ['NPI', 'CLIA', 'NAIC'];
    const [constantIdentifiers, setConstantIdentifiers] = useState([]);
    const [identifierDocument, setIdentifierDocumnent] = useState(false);

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
    const identifierOptions = [
        'NPI',
        'TIN',
        'NAIC',
        'Medicare',
        'Medicaid',
        'State License',
        'Accreditation',
        'CLIA',
        'DUNS',
        'Facility ID',
    ];

    useEffect(() => {
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
        setIdentifiers([...identifiers, { type: '', number: '', file: null, expiry: '', issuingAuthority: '' }]);
    };

    const removeIdentifier = (index) => {
        if (index < defaultIdentifiers.length) return;
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
            const url = await handleUpload(selectedFile, setIdentifierDocumnent); // Upload file
            setConstantIdentifiers((prevDetails) => {
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
                            value={item.type}
                            onChange={(e) => handleChange(index, 'type', e.target.value)}
                            disabled={defaultIdentifiers.includes(item.type)}>
                            <option value="" disabled>
                                Select Identifier Type
                            </option>
                            {identifierOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
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
                            <span
                                className="text-danger cursor-pointer"
                                style={{ position: 'absolute', right: '-2%', top: '12%' }}
                                onClick={() => removeIdentifier(index)}>
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
