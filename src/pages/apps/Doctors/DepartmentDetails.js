import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createDoctorDetailAction } from "../../../redux/actions";
import { encryptMessage } from "../../../cryptoUtils";
import { useForm } from "react-hook-form";
import { getMastersDataAction } from "../../../redux/settings/action";
import { useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiDownloadCloud, FiUploadCloud } from "react-icons/fi";
import { CiCircleMinus } from "react-icons/ci";
import { handleUpload } from "../../../helpers/HandleUpload";

const DepartmentDetails = ({ docId }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCAQHPassword, setShowCAQHPassword] = useState(false);
  const defaultIdentifiers = ['NPI'];
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
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const departmentId = store?.getMastersDataReducer?.data?.result;
  const doctorDetails = store?.getDoctorDetailsReducer?.data?.result
  console.log(doctorDetails,'doctorDetails')
  const id = doctorDetails?._id
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    clearErrors,
  } = useForm();


  const [searchParams] = useSearchParams();
  const updateId = searchParams.get('id');
  useEffect(() => {
    setConstantIdentifiers(
      defaultIdentifiers.map((type) => ({
        type,
        number: '',
        file: '',
        expiry: '',
        issuingAuthority: '',
        use: '',
      }))
    );
    // setConstantContact(
    //   contactDetails.map((system) => ({
    //     system,
    //     value: '',
    //     use: '',
    //   }))
    // );
  }, []);
  const logoFileInputRef = useRef(null);
  const degreeFileInputRef = useRef(null);
  const [logo, setLogo] = useState(null);
  const [logoName, setLogoName] = useState('');
  const [degree, setDegree] = useState(null);
  const [degreeName, setDegreeName] = useState('');
  const [logoUploading, setLogoUploading] = useState(false)
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    try {
      const url = await handleUpload(selectedFile, setLogoUploading);
      setLogo(url);
      setLogoName(selectedFile?.name)
    } catch (error) {
      // console.error('Error during file upload:', error);
    }
  };
  const [degreeUploading, setDegreeUploading] = useState(false);
  const handleFileChangeDegree = async (e) => {
    const selectedFile = e.target.files[0];
    try {
      const url = await handleUpload(selectedFile, setDegreeUploading);
      setDegree(url);
      setDegreeName(selectedFile?.name)
    } catch (error) {
      // console.error('Error during file upload:', error);
    }
  };
  const addIdentifier = () => {
    setConstantIdentifiers([
      ...constantIdentifiers,
      { type: '', number: '', file: '', expiry: '', issuingAuthority: '', use: '' },
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
  const identifierOptions = [
    { label: "National Provider Identifier (NPI)", value: "http://hl7.org/fhir/sid/us-npi", code: "NPI" },
    { label: "State Medical License", value: "http://terminology.hl7.org/CodeSystem/v2-0203", code: "MED-LIC" },
    { label: "DEA Number (Controlled Substances)", value: "http://www.nabp.pharmacy/DEA", code: "DEA" },
    { label: "Board Certification", value: "http://www.abms.org/certification", code: "BOARD-CERT" },
    { label: "Tax Identification Number (TIN)", value: "http://hl7.org/fhir/sid/us-tin", code: "TIN" },
    { label: "Medicare Provider Number", value: "http://hl7.org/fhir/sid/us-medicare", code: "Medicare" },
    { label: "Medicaid Provider Number", value: "http://hl7.org/fhir/sid/us-medicaid", code: "Medicaid" }
  ];

  const handleIdentifierFileChange = async (e, index) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    try {
      const url = await handleUpload(selectedFile, setIdentifierDocumnent); // Upload file
      setConstantIdentifiers((prevDetails) => {
        const updatedDetails = [...prevDetails];
        console.log(url, 'constantIdentifierurl');
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

  const onsubmit = (data) => {
    const payload = {
      ...(updateId ? { doctorId: id } : { doctorId: store?.createtDoctorsReducer?.data?.doctor?._id }),
      identifier: constantIdentifiers.map((item) => ({
        identifierType: item.type,
        use: item.use,
        value: item.number,
        // documents: item.file ? {  url: item.file.url,fileName: item.file.name || '' } : null,
        documents: [item?.file?.url],
        expirationDate: item.expiry,
        status: 'active',
        system: 'urn:oid:2.16.840.1.113883.4.7',
        sliceName: item.type,
        issuingAuthority: item.issuingAuthority,
      })),
      profileImage: {
        url: logo?.url?.split('?')[0] || logo,
        fileName: logoName,
      },
      degree: [{
        name: data?.degreeName,
        uploadedDocument: {
          url: degree?.url?.split('?')[0] || degree,
          fileName: degreeName,
        }
      }],
      specialities: [data?.specialist],

    }
    console.log(payload, 'payload')
    dispatch(createDoctorDetailAction({ key: encryptMessage(payload) }));
  }

  useEffect(() => {
    if (doctorDetails && updateId) {
      setValue('degreeName', doctorDetails?.degree?.[0]?.name);
      setValue('specialist', doctorDetails?.specialities?.[0]);
      // setValue('TIN_SSN', doctorDetails?.TIN_SSN)
      // setValue('NPI', doctorDetails?.NPI)
      // setValue('NPIUsername', doctorDetails?.NPIUsername)
      // setValue('CAQH_ID', doctorDetails?.CAQH_ID)
      // setValue('CAQHUsername', doctorDetails?.CAQHUsername)
      // setValue('medicarePTAN', doctorDetails?.medicarePTAN)
      // setValue('medicaidID', doctorDetails?.medicaidID)
      // // setValue('department', doctorDetails?.departmentId?._id)
      // setValue('Medicare_SPOT_Logins', doctorDetails?.Medicare_SPOT_Logins)
      // setValue('Medicare_PECOS_Logins', doctorDetails?.Medicare_PECOS_Logins)
      // setValue('stateLicense', doctorDetails?.LicensingInformation?.[0]?.stateLicense)
      // setValue('stateLicenseProvider', doctorDetails?.LicensingInformation?.[0]?.stateLicenseProvider)
      // setValue('stateLicenseObtained', doctorDetails?.LicensingInformation?.[0]?.stateLicenseObtained)
      // setValue('DEA', doctorDetails?.DEA)
      // setValue('CLIA', doctorDetails?.CLIA)

      // const formattedDEAIssueDate = doctorDetails?.DEA_IssueDate
      //   ? new Date(doctorDetails?.DEA_IssueDate).toISOString().split('T')[0]
      //   : '';
      // const formattedStateLicenseIssueDate = doctorDetails?.LicensingInformation?.[0]?.stateLicenseIssueDate
      //   ? new Date(doctorDetails?.LicensingInformation?.[0]?.stateLicenseIssueDate).toISOString().split('T')[0]
      //   : '';
      // const formattedLicenseExpirationDate = doctorDetails?.LicensingInformation?.[0]?.licenseExpirationDate
      //   ? new Date(doctorDetails?.LicensingInformation?.[0]?.licenseExpirationDate).toISOString().split('T')[0]
      //   : '';

      // setValue('DEA_IssueDate', formattedDEAIssueDate);
      // setValue('stateLicenseIssueDate', formattedStateLicenseIssueDate);
      // setValue('licenseExpirationDate', formattedLicenseExpirationDate);
    }
  }, [doctorDetails, setValue])

  useEffect(() => {
    dispatch(
      getMastersDataAction({ status: true, category: 'Department', search: '', skip: '', limit: '' })
    );
  }, [dispatch]);

  useEffect(() => {
    if (updateId) {
      setValue('NPIPassword', '********')
      setValue('CAQHPassword', '********')
    }
  }, [updateId]);

  return (
    <>
      <div className="container-fluid">
        <Form onSubmit={handleSubmit(onsubmit)}>
          {store?.getDoctorDetailsReducer?.loading ?
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: '75vh' }}
            >
              <Spinner />
            </div>

            :
            <>
              <Row>
                <Col sm={12}>
                  <Row>
                    <div className="col-md-6 col-12">
                      <Form.Group className="mb-1">
                        <Form.Label className="mb-0">Degree Name</Form.Label>
                        <Form.Control
                          className='form-control'
                          type="text"
                          {...register('degreeName',
                            // { required: 'Degree Name is required' }
                          )}
                          onChange={(e) => {
                            clearErrors('degreeName');
                            // setFormData({ ...formData, degreeName: e.target.value });
                          }}
                          // value={formData.Degree Name}
                          placeholder="Enter Degree Name"
                        />
                        {errors.email && <span className="text-danger">{errors?.degreeName?.message}</span>}
                      </Form.Group>
                    </div>
                    <div className="col-md-6 col-12">
                      <div className="mb-1 d-flex flex-column position-relative">
                        <Form.Label className="mb-0">Degree</Form.Label>
                        <div
                          onClick={() => degreeFileInputRef.current.click()}
                          className={`custom-file-upload justify-content-between cursor-pointer form-control ${degreeName || degreeUploading ? '' : 'custom-form-fields'}`}
                        >
                          {degreeName ? degreeName : degreeUploading ? 'Uploading...' : 'Upload Degree'}
                          <p className="mb-0">
                            <FiUploadCloud />
                          </p>
                        </div>
                        <Form.Control
                          type="file"
                          className="d-none "
                          {...register('degreeDoc', {
                          })}
                          ref={degreeFileInputRef}
                          onChange={handleFileChangeDegree}
                        />
                        {errors.degreeDoc && (
                          <p className="text-danger">{errors.degreeDoc.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6 col-12 ">
                      <div className="mb-2 d-flex flex-column position-relative">
                        <Form.Label className="mb-0">Profile Image</Form.Label>
                        <div
                          onClick={() => logoFileInputRef.current.click()}
                          className={`custom-file-upload justify-content-between cursor-pointer form-control ${logoName || logoUploading ? '' : 'custom-form-fields'}`}
                        >
                          {logoName ? logoName : logoUploading ? 'Uploading...' : 'Upload Profile Image'}
                          <p className="mb-0">
                            <FiUploadCloud />
                          </p>
                        </div>
                        <Form.Control

                          type="file"
                          className="d-none "
                          {...register('profileImage', {
                          })}
                          accept=".png, .jpg, .jpeg, .svg"
                          ref={logoFileInputRef}
                          onChange={handleFileChange}
                        />
                        {errors.profileImage &&
                          <p className="text-danger">{errors.profileImage.message}</p>
                        }
                      </div>
                    </div>

                    <div className="col-md-6 col-12">
                      <Form.Group className="mb-1">
                        <Form.Label className="mb-0">Specialist </Form.Label>
                        <Form.Control
                          type="text"
                          {...register('specialist',
                            // { required: 'Specialist Name is required' }
                          )}
                          onChange={(e) => {
                            clearErrors('specialist');
                            // setFormData({ ...formData, specialties: e.target.value });
                          }}
                          placeholder="Enter Specialist Name"
                        />
                        {/* {errors.specialist && <span className="text-danger">{errors?.specialist?.message}</span>} */}
                      </Form.Group>
                    </div>
                    <Col sm={12}>
                      <h5>
                        Identifiers
                        <span
                          className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                          onClick={addIdentifier}></span>
                      </h5>
                    </Col>
                  </Row>

                  {/* {/ Table Header /} */}
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

                  {/* {/ Dynamic Identifier Fields /} */}
                  {constantIdentifiers.map((item, index) => (
                    <Row key={index} className="mb-2">
                      {/* {/ Identifier Type /} */}
                      <Col>
                        <Form.Select
                          value={item.type}
                          {...register(`identifiers[${index}].type`)}
                          onChange={(e) => handleChange(index, "type", e.target.value)}
                          disabled={defaultIdentifiers.includes(item.type)}
                        >
                          <option value="" disabled>Select Identifier Type</option>
                          {identifierOptions.map((option) => (
                            <option key={option.code} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Select>
                        {errors?.[index]?.type && (
                          <span className="text-danger">This field is required</span>
                        )}
                      </Col>

                      {/* {/ Identifier Number /} */}
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Document Number"
                          value={item.number}
                          maxLength={
                            item.type === 'NPI' || item.type === 'CLIA'
                              ? 10
                              : item.type === 'NAIC'
                                ? 5
                                : undefined
                          }
                          {...register(`identifiers[${index}].number`, {
                            // required: defaultIdentifiers.includes(item.type)
                            //     ? 'Document Number is required'
                            //     : false,
                            validate: (value) => {
                              if (!value) return true; // Skip validation if field is empty (for dynamic fields)

                              if (item.type === 'NPI' && !/^[0-9]{10}$/.test(value)) {
                                return 'NPI number must be exactly 10 digits long';
                              }
                              if (item.type === 'CLIA' && !/^[A-Z0-9]{2}D[0-9]{7}$/.test(value)) {
                                return 'CLIA number must be in the format XXDXXXXXXX, where X is alphanumeric and the rest are digits';
                              }
                              if (item.type === 'NAIC' && !/^[0-9]{5}$/.test(value)) {
                                return 'NAIC number must be exactly 5 digits long';
                              }
                              return true; // No validation for other types (like DUNS, etc.)
                            },
                          })}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Enforce length limit only for NPI, CLIA, and NAIC
                            if (item.type === 'NPI' || item.type === 'CLIA') {
                              value = value.slice(0, 10);
                            } else if (item.type === 'NAIC') {
                              value = value.slice(0, 5);
                            }

                            handleChange(index, 'number', value);
                          }}
                        />
                        {errors.identifiers?.[index]?.number && (
                          <span className="text-danger">{errors.identifiers[index].number.message}</span>
                        )}
                      </Col>

                      {/* {/ File Upload /} */}
                      <Col className="mb-2 position-relative">
                        <div
                          onClick={() => document.getElementById(`fileInput-identifier-${index}`).click()}
                          className={`custom-file-upload justify-content-between cursor-pointer ${item.file ? 'form-control' : 'custom-form-fields'
                            }`}>
                          {item.file?.name
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
                        {errors?.[index]?.file && (
                          <span className="text-danger">Please upload a document</span>
                        )}
                      </Col>

                      {/* {/ Issuing Authority /} */}
                      <Col>
                        <Form.Select
                          value={item.issuingAuthority}
                          data-has-value={!!watch(`identifiers[${index}].issuingAuthority`)}
                          {...register(`identifiers[${index}].issuingAuthority`)}
                          onChange={(e) => handleChange(index, 'issuingAuthority', e.target.value)}>
                          <option value="" hidden>
                            Select Issuing Authority
                          </option>
                          {defaultIssuingAuthority.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Form.Select>
                        {errors?.[index]?.issuingAuthority && (
                          <span className="text-danger">This field is required</span>
                        )}
                      </Col>
                      {/* {/ Expiry Date /} */}
                      <Col className="position-relative">
                        <Form.Control
                          type="date"
                          value={item.expiry}
                          onChange={(e) => handleChange(index, 'expiry', e.target.value)}
                        />
                        {errors?.[index]?.expiry && (
                          <span className="text-danger">Select a valid expiry date</span>
                        )}

                        {/* {/ Remove Identifier Button /} */}
                        {index >= defaultIdentifiers.length && (
                          <span
                            className="text-danger cursor-pointer position-absolute fs-5 fw-bold"
                            style={{ right: '-2%', top: '12%' }}
                            onClick={() => removeIdentifier(index)}>
                            <CiCircleMinus />
                          </span>
                        )}
                      </Col>
                    </Row>
                  ))}
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-1">
                <Button className="cancel-button">
                  Cancel
                </Button>
                {/* <Button className="" type="submit">
              Save
            </Button> */}
                <Button
                  variant="primary"
                  type="submit"
                  className="custom-buttons"
                  disabled={store?.createtDoctorsDetailReducer?.loading}
                >
                  {store?.createtDoctorsDetailReducer?.loading ? (
                    <Spinner color="white" className="spinner-border-sm" />
                  ) : (
                    updateId ? "Update" : "Save"
                  )}
                </Button>

              </div>
            </>
          }
        </Form>
      </div>
    </>
  );
};

export default DepartmentDetails;
