import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createDoctorDetailAction } from "../../../redux/actions";
import { encryptMessage } from "../../../cryptoUtils";
import { useForm } from "react-hook-form";
import { getMastersDataAction } from "../../../redux/settings/action";
import { useSearchParams } from "react-router-dom";
import { FiUploadCloud } from "react-icons/fi";
import { CiCircleMinus } from "react-icons/ci";
import { handleUpload } from "../../../helpers/HandleUpload";
import IdentifierForm from "../Common Pages/IdentifierForm";
import Select from 'react-select';
import { qualificationsData } from "../../../utils/DataSets/qualification.data";

const DepartmentDetails = () => {
  // const defaultIdentifiers = ['NPI'];
  const [constantIdentifiers, setConstantIdentifiers] = useState([]);
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const doctorDetails = store?.getDoctorDetailsReducer?.data?.result
  console.log(doctorDetails, 'doctorDetails')
  const id = doctorDetails?._id
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
  } = useForm();
  const [searchParams] = useSearchParams();
  const updateId = searchParams.get('id');
  const [qualifications, setQualifications] = useState([{ id: 1, degreeName: '', degreeFile: null, issuerOrganisation: '' }]);
  const degreeFileInputRef = useRef(null);

  // Add a new qualification
  const addQualification = () => {
    const newQualification = { id: qualifications.length + 1, degreeName: '', degreeFile: null, issuerOrganisation: '' };
    setQualifications([...qualifications, newQualification]);
  };

  // Remove a qualification by its ID, but ensure the first row is not deleted
  const removeQualification = (id) => {
    if (qualifications.length > 1) { // Ensure at least one row remains
      const updatedQualifications = qualifications.filter((qual) => qual.id !== id);
      setQualifications(updatedQualifications);
    }
  };

  // Handle changes in qualification fields
  const handleQualificationChange = (index, field, value) => {

    const updatedQualifications = qualifications.map((qual, i) =>
      i === index ? { ...qual, [field]: field === 'degreeName' ? value?.data : value } : qual
    );
    setQualifications(updatedQualifications);
  };

  // Handle file upload for degree
  const handleFileChangeDegree = async (index, event) => {
    const file = event.target.files[0];
    try {
      const url = await handleUpload(file, setDegreeUploading);
      const fileName = file.name
      handleQualificationChange(index, 'degreeFile', { url: url?.url, fileName });
    } catch (error) {

    }
  };

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
  }, []);
  const [identifiers, setIdentifiers] = useState([]);
  const [degreeUploading, setDegreeUploading] = useState(false);

  const defaultIdentifiers = [
    {
      label: 'National Provider Identifier (NPI)',
      value: 'http://hl7.org/fhir/sid/us-npi',
      code: 'NPI',
    },
  ];

  const QualificationOptions = qualificationsData.map((qualification) => ({
    value: qualification.code,
    label: qualification.display,
    data: qualification, // Store full object for later use
  }));

  const onsubmit = (data) => {
    const qualificationData = qualifications?.map((item) => ({
      code: item?.degreeName,
      documents: item?.degreeFile,
      issuer: item?.issuerOrganisation,
    }))
    let finalIdentifiersData = [];
    if (identifiers) {
      identifiers.forEach((element) => {
        let data = {
          identifierType: element?.type?.label,
          sliceName: element?.type?.code,
          system: element?.type?.value,
          value: element?.number,
          status: 'active',
          issuingAuthority: element?.issuingAuthority,
          expirationDate: element?.expiry,
          documents: [element?.file]
        };
        finalIdentifiersData.push(data);
      })
    }
    const payload = {
      ...(updateId ? { doctorId: id } : { doctorId: store?.createtDoctorsReducer?.data?.doctor?._id }),
      identifier: finalIdentifiersData,
      qualification: qualificationData,
      specialties: [data?.specialist],

    }
    console.log({ payload })
    dispatch(createDoctorDetailAction({ key: encryptMessage(payload) }));
  }
  useEffect(() => {
    if (doctorDetails && updateId) {
      // Set qualifications data
      const updatedQualifications = doctorDetails?.qualification?.map((item, index) => ({
        id: index + 1,
        degreeName: {
          code: item?.code?.code,
          display: item?.code?.display,
          definition: item?.code?.display,
          system: item?.code?.system
        },
        specialties: item?.specialties?.[0] || 'N/A',
        degreeFile: item?.documents?.[0] || null, // Use the first document if available
        issuerOrganisation: item?.issuer || '', // Use the issuer reference if available
      }));
      setQualifications(updatedQualifications);
      setValue('specialist', doctorDetails?.specialties?.[0])
    }
  }, [doctorDetails, setValue, updateId]);

  useEffect(() => {
    dispatch(
      getMastersDataAction({ status: true, category: 'Department', search: '', skip: '', limit: '' })
    );
  }, [dispatch]);

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
                  <IdentifierForm
                    defaultIdentifiers={defaultIdentifiers}
                    identifiers={identifiers}
                    setIdentifiers={setIdentifiers}
                  />
                  <Row>
                    <h5>
                      Qualifications
                      <span
                        className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                        onClick={addQualification}
                      ></span>
                    </h5>
                    {qualifications?.map((qualification, index) => (
                      <React.Fragment key={index}>
                        <div className="col-md-4 col-12">
                          <Form.Group className="mb-1">
                            <Form.Label className="mb-0">Select Degree Name</Form.Label>
                            <Select
                              options={QualificationOptions}
                              isSearchable
                              className="basic-single"
                              classNamePrefix="select"
                              placeholder="&nbsp; Select "
                              value={QualificationOptions.find(option => option.value === qualification?.degreeName?.code)}
                              onChange={(selectedOption) =>
                                handleQualificationChange(index, 'degreeName', selectedOption) // Access the full object from 'data'
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
                              }}
                            />
                          </Form.Group>
                        </div>
                        <div className="col-md-4 col-12">
                          <div className="mb-1 d-flex flex-column position-relative">
                            <Form.Label className="mb-0">Degree</Form.Label>
                            <div
                              onClick={() => degreeFileInputRef.current.click()}
                              className={`custom-file-upload justify-content-between cursor-pointer form-control ${qualification.degreeName || qualification.degreeFile ? '' : 'custom-form-fields'}`}
                            >
                              {degreeUploading ? 'Uploading...' : qualification.degreeFile?.fileName ? qualification.degreeFile.fileName : 'Upload Degree'}
                              {/* {qualification.degreeFile ? qualification.degreeFile.name : 'Upload Degree'} */}
                              <p className="mb-0">
                                <FiUploadCloud />
                              </p>
                            </div>
                            <Form.Control
                              type="file"
                              className="d-none"
                              ref={degreeFileInputRef}
                              onChange={(event) => handleFileChangeDegree(index, event)}
                            />
                          </div>
                        </div>
                        <div className="col-md-4 col-12">
                          <Form.Group className="mb-1">
                            <Form.Label className="mb-0">Issuer Organisation</Form.Label>
                            <Form.Control
                              type="text"
                              value={qualification.issuerOrganisation}
                              onChange={(e) => handleQualificationChange(index, 'issuerOrganisation', e.target.value)}
                              placeholder="Enter Issuer Organisation"
                            />
                          </Form.Group>
                        </div>
                        {index > 0 && ( // Only show delete button for added rows
                          <div className="col-md-12 text-end">
                            <span
                              className="text-danger position-absolute cursor-pointer fs-5 fw-bold"
                              style={{ marginTop: '-35px' }}
                              onClick={() => removeQualification(qualification.id)}>
                              <CiCircleMinus />
                            </span>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </Row>
                  <Row>
                    <hr className="my-1" />
                    <div className="col-md-4 col-12">
                      <Form.Group className="mb-1">
                        <Form.Label className="mb-0">Specialist </Form.Label>
                        <Form.Control
                          type="text"
                          {...register('specialist')}
                          onChange={(e) => {
                            clearErrors('specialist');
                          }}
                          placeholder="Enter Specialist Name"
                        />
                      </Form.Group>
                    </div>
                  </Row>
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
