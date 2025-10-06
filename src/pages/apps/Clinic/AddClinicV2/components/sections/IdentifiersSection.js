import React, { useState } from 'react';
import { Col, Form, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FiInfo, FiMinusCircle, FiEye, FiDownloadCloud } from 'react-icons/fi';
import { handleUpload } from '../../../../../../helpers/HandleUpload';

const IdentifiersSection = ({
  constantIdentifiers,
  setConstantIdentifiers,
  register,
  errors,
  setShowModalPic,
  setModalFileUrl
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  const defaultIdentifiers = ['NPI', 'CLIA', 'NAIC'];
  const identifierOptions = [
    'NPI', 'TIN', 'NAIC', 'Medicare', 'Medicaid', 'State License',
    'Accreditation', 'CLIA', 'DUNS', 'CCN', 'Taxonomy', 'Facility ID'
  ];
  const defaultIssuingAuthority = [
    'NPPES', 'CLIA', 'State Licensing Authority', 'IRS', 'CMS',
    'The Joint Commission', 'Dun & Bradstreet', 'Other'
  ];

  const addIdentifier = () => {
    setConstantIdentifiers([
      ...constantIdentifiers,
      { type: '', number: '', file: '', expiry: '', issuingAuthority: '', use: '' }
    ]);
  };

  const removeIdentifier = (index) => {
    if (index < defaultIdentifiers.length) return;
    setConstantIdentifiers(constantIdentifiers.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updatedIdentifiers = [...constantIdentifiers];
    updatedIdentifiers[index][field] = value;
    setConstantIdentifiers(updatedIdentifiers);
  };

  const handleIdentifierFileChange = async (e, index) => {
    setSelectedIndex(index);
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    try {
      const url = await handleUpload(selectedFile, setImageLoading);
      setConstantIdentifiers((prevDetails) => {
        const updatedDetails = [...prevDetails];
        updatedDetails[index] = {
          ...updatedDetails[index],
          file: {
            url: url?.url?.split('?')[0],
            name: selectedFile.name
          }
        };
        setSelectedIndex(null);
        return updatedDetails;
      });
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const getValidationRules = (type) => {
    const rules = {
      NPI: { pattern: /^\d{10}$/, message: 'NPI must be exactly 10 digits' },
      CLIA: { pattern: /^[A-Z0-9]{2}D\d{7}$/, message: 'CLIA must be in format XXDXXXXXXX' },
      NAIC: { pattern: /^\d{5,10}$/, message: 'NAIC must be 5 to 10 digits' },
      Medicare: { pattern: /^[A-Z0-9]{11}$/, message: 'Medicare ID must be 11 alphanumeric characters' },
      Medicaid: { pattern: /^[A-Z0-9]{9,12}$/, message: 'Medicaid ID must be 9–12 alphanumeric characters' },
      'State License': { pattern: /^[A-Z0-9]{5,15}$/, message: 'State License must be 5–15 alphanumeric characters' },
      Accreditation: { pattern: /^[A-Z0-9]{6,10}$/, message: 'Accreditation ID must be 6–10 alphanumeric characters' },
      CCN: { pattern: /^\d{6}$/, message: 'CCN must be exactly 6 digits' },
      'Taxonomy Code': { pattern: /^\d{9}[A-Z]$/, message: 'Taxonomy Code must be 9 digits + 1 uppercase letter' },
      DUNS: { pattern: /^\d{9}$/, message: 'DUNS must be exactly 9 digits' },
      'Facility ID': { pattern: /^[A-Z0-9]{6,12}$/, message: 'Facility ID must be 6–12 alphanumeric characters' }
    };
    return rules[type] || { pattern: /.+/, message: 'Invalid format' };
  };

  const getMaxLength = (type) => {
    const lengths = {
      NPI: 10, CLIA: 10, NAIC: 10, Medicare: 11, Medicaid: 12,
      'State License': 15, Accreditation: 10, CCN: 6, 'Taxonomy Code': 10,
      DUNS: 9, 'Facility ID': 12
    };
    return lengths[type] || 20;
  };

  const handleFilePreview = (e, fileUrl) => {
    e.preventDefault();
    e.stopPropagation();
    setModalFileUrl(fileUrl);
    setShowModalPic(true);
  };

  const handleFileDownload = async (e, file) => {
    e.preventDefault();
    e.stopPropagation();
    if (file?.url) {
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
      } catch (error) {
        console.error('Fetch download failed, trying direct download:', error);
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name || 'document';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      window.open(file.url, '_blank');
    }
  };

  return (
    <Row>
      <Col sm={12}>
        <Row>
          <Col sm={12}>
            <h5>
              Identifiers
              <span
                className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                onClick={addIdentifier}
              />
            </h5>
          </Col>
        </Row>

        <Row className="fw-bold">
          <Col><Form.Label>Identifier Type</Form.Label></Col>
          <Col><Form.Label>Identifier Number</Form.Label></Col>
          <Col className="d-flex align-items-center gap-2">
            <Form.Label>Identifier Document</Form.Label>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip-identifier">
                  File size should be less than 2MB. Supported formats: JPG, PNG, JPEG, PDF.
                </Tooltip>
              }
            >
              <span className="text-secondary cursor-pointer mb-2">
                <FiInfo size={15} />
              </span>
            </OverlayTrigger>
          </Col>
          <Col><Form.Label>Issuing Authority</Form.Label></Col>
          <Col>
            <Form.Label>
              Identifier Expiry <span className="text-secondary">(If Applicable)</span>
            </Form.Label>
          </Col>
        </Row>

        {constantIdentifiers.map((item, index) => (
          <Row key={index} className="mb-2">
            <Col>
              <Form.Select
                value={item.type}
                {...register(`identifiers[${index}].type`)}
                onChange={(e) => handleChange(index, 'type', e.target.value)}
                disabled={defaultIdentifiers.includes(item.type)}
              >
                <option value="" disabled>Select Identifier Type</option>
                {identifierOptions?.sort((a, b) => a.localeCompare(b))?.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Form.Select>
            </Col>

            <Col>
              <Form.Control
                type="text"
                placeholder="Document Number"
                value={item.number}
                maxLength={getMaxLength(item.type)}
                {...register(`identifiers[${index}].number`, {
                  validate: (value) => {
                    if (!value) return true;
                    const rule = getValidationRules(item.type);
                    return rule.pattern.test(value) || rule.message;
                  }
                })}
                onChange={(e) => {
                  let value = e.target.value;
                  if (item.type === 'NPI' || item.type === 'CLIA' || item.type === 'NAIC') {
                    value = value.slice(0, 10);
                  }
                  handleChange(index, 'number', value);
                }}
              />
              {errors.identifiers?.[index]?.number && (
                <span className="text-danger">
                  {errors.identifiers[index].number.message}
                </span>
              )}
            </Col>

            <Col className="mb-2 position-relative">
              <div
                onClick={() => document.getElementById(`fileInput-identifier-${index}`).click()}
                className={`custom-file-upload justify-content-between cursor-pointer ${
                  item.file ? 'form-control' : 'custom-form-fields'
                }`}
              >
                {index === selectedIndex
                  ? 'Uploading...'
                  : item.file?.name
                  ? item.file.name.length > 30
                    ? item.file.name.slice(0, 25) + '...'
                    : item.file.name
                  : 'Upload Document'}
                <div className="d-flex align-items-center gap-2">
                  {item?.file?.url && (
                    <FiEye
                      className="cursor-pointer"
                      onClick={(e) => handleFilePreview(e, item?.file?.url)}
                    />
                  )}
                  <p
                    className="mb-0 cursor-pointer"
                    onClick={(e) => handleFileDownload(e, item.file)}
                  >
                    <FiDownloadCloud />
                  </p>
                </div>
              </div>
              <Form.Control
                type="file"
                id={`fileInput-identifier-${index}`}
                style={{ display: 'none' }}
                accept=".png, .jpg, .jpeg, .pdf"
                onChange={(e) => handleIdentifierFileChange(e, index)}
              />
            </Col>

            <Col>
              <Form.Select
                value={item.issuingAuthority}
                {...register(`identifiers[${index}].issuingAuthority`)}
                onChange={(e) => handleChange(index, 'issuingAuthority', e.target.value)}
              >
                <option value="" disabled>Select Issuing Authority</option>
                {defaultIssuingAuthority?.sort((a, b) => a.localeCompare(b))?.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Form.Select>
            </Col>

            <Col className="position-relative">
              <Form.Control
                type="date"
                value={item?.expiry ? formatDateForInput(item.expiry) : ''}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleChange(index, 'expiry', e.target.value)}
              />
              {index >= defaultIdentifiers?.length && (
                <span
                  className="minusIcons cursor-pointer position-absolute fs-5 fw-bold"
                  style={{ right: '-2%', top: '12%' }}
                  onClick={() => removeIdentifier(index)}
                >
                  <FiMinusCircle />
                </span>
              )}
            </Col>
          </Row>
        ))}
      </Col>
    </Row>
  );
};

export default IdentifiersSection;