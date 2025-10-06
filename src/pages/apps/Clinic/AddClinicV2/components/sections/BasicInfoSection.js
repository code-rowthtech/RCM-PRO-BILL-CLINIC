import React, { useRef } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FiDownloadCloud, FiEye } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import { handleUpload } from '../../../../../../helpers/HandleUpload';
import { handleFirstSpace } from '../../../../../../helpers/noSpace';

const BasicInfoSection = ({
  register,
  errors,
  setValue,
  logo,
  setLogo,
  logoName,
  setLogoName,
  logoUploading,
  setLogoUploading,
  clinicsDataGet,
  setShowModalPic,
  setModalFileUrl
}) => {
  const store = useSelector((state) => state);
  const logoFileInputRef = useRef(null);
  const clinectypes = store?.getClinicTypeReducer?.data?.result;

  const handleLogoClick = () => {
    logoFileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    try {
      const url = await handleUpload(selectedFile, setLogoUploading);
      setLogo({ url: url?.url?.split('?')[0] });
      setLogoName(selectedFile?.name);
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  };

  const handleLogoPreview = (e) => {
    e.stopPropagation();
    setModalFileUrl(logo || clinicsDataGet?.orgLogo?.url);
    setShowModalPic(true);
  };

  const handleLogoDownload = async (e) => {
    e.stopPropagation();
    const fileUrl = logo?.url || clinicsDataGet?.orgLogo?.url;
    const fileName = logoName || 'logo';
    
    if (fileUrl) {
      try {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Fetch download failed, trying direct download:', error);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <Row>
      <Col sm={3}>
        <Form.Group className="mb-1">
          <Form.Label className="mb-0">
            Practice Name <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            {...register('clinicname', {
              required: 'This field is required',
              validate: (value) => !value.startsWith(' ') || 'First character cannot be a space'
            })}
            placeholder="Practice name"
            onKeyPress={handleFirstSpace}
          />
          {errors.clinicname && (
            <span className="text-danger">{errors.clinicname.message}</span>
          )}
        </Form.Group>
      </Col>

      <Col sm={3}>
        <Form.Group className="mb-1">
          <Form.Label className="mb-0">
            Practice type <span className="text-danger">*</span>
          </Form.Label>
          <Form.Select
            className="form-control"
            {...register('clinicType', { required: 'This field is required' })}
          >
            <option value="" hidden>Select Practice type</option>
            {clinectypes?.map((data) => (
              <option key={data?._id} value={data?.name}>
                {data?.name}
              </option>
            ))}
          </Form.Select>
          {errors.clinicType && (
            <span className="text-danger">{errors.clinicType.message}</span>
          )}
        </Form.Group>
      </Col>

      <Col sm={3}>
        <Form.Group className="mb-1 position-relative">
          <Form.Label className="mb-0">
            Email ID <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            disabled={true}
            type="text"
            {...register('email', {
              required: 'This field is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
              }
            })}
            placeholder="Email ID"
          />
          <span
            style={{ right: '2%', top: '43%' }}
            className={`${
              clinicsDataGet?.userId?.verified_email
                ? 'text-success position-absolute fs-4'
                : 'd-none'
            }`}
          >
            <MdVerified />
          </span>
          {errors.email && <span className="text-danger">{errors.email.message}</span>}
        </Form.Group>
      </Col>

      <Col sm={3}>
        <Form.Label className="mb-0">Upload Logo</Form.Label>
        <div
          onClick={handleLogoClick}
          className={`custom-file-upload justify-content-between cursor-pointer ${
            logoName || logoUploading ? 'form-control' : 'custom-form-fields'
          }`}
        >
          {logoName
            ? logoName.split('/').pop().slice(0, 30) + '...'
            : logoUploading
            ? 'Uploading...'
            : 'Upload Logo'}
          <div className="d-flex align-items-center gap-2">
            <FiEye
              onClick={handleLogoPreview}
              className="text-dark cursor-pointer"
            />
            <p className="mb-0 cursor-pointer" onClick={handleLogoDownload}>
              <FiDownloadCloud />
            </p>
          </div>
        </div>
        <Form.Control
          type="file"
          ref={logoFileInputRef}
          style={{ display: 'none' }}
          accept=".png, .jpg, .jpeg, .svg"
          onChange={handleFileChange}
        />
      </Col>
    </Row>
  );
};

export default BasicInfoSection;