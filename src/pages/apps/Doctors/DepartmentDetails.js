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
import IdentifierForm from "../Common Pages/IdentifierForm";

const DepartmentDetails = ({ docId }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showCAQHPassword, setShowCAQHPassword] = useState(false);
  const defaultIdentifiers = ['NPI'];
  const [constantIdentifiers, setConstantIdentifiers] = useState([]);
  const [identifierDocument, setIdentifierDocumnent] = useState(false);
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const departmentId = store?.getMastersDataReducer?.data?.result;
  const doctorDetails = store?.getDoctorDetailsReducer?.data?.result
  console.log(doctorDetails, 'doctorDetails')
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
  const [identifiers, setIdentifiers] = useState([]);
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
      identifiers:identifiers,
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
                      </Form.Group>
                    </div>
                  </Row>

                  <IdentifierForm
                    defaultIdentifiers={[
                      {
                        label: 'National Provider Identifier (NPI)',
                        value: 'http://hl7.org/fhir/sid/us-npi',
                        code: 'NPI',
                      },
                    ]}
                    identifiers={identifiers}
                    setIdentifiers={setIdentifiers}
                    onChange={(data) => console.log('Updated Identifiers:', data)}
                  />
                </Col>
              </Row>

              <div className="d-flex justify-content-end gap-2 mt-1">
                <Button className="cancel-button">
                  Cancel
                </Button>
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
