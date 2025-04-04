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
import DoctorIdentifierForm from "./DoctorIdentifier";
import { getFilteredTaxonomies } from "../../../utils/DataSets/commonData";
import { taxonomyOptions as taxonomy } from "../../../utils/DataSets/commonData";
import AsyncSelect from 'react-select/async';
const DepartmentDetails = () => {
  // const defaultIdentifiers = ['NPI'];
  const [constantIdentifiers, setConstantIdentifiers] = useState([]);
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const doctorDetails = store?.getDoctorDetailsReducer?.data?.result;
  const statesData = store?.getStatesReducer?.data?.states;
  const id = doctorDetails?._id;

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
  const [inputValue, setInputValue] = useState('');
  const formattedTaxonomyOptions = taxonomy.map((option) => ({
    value: option,
    label: option.code + ' - ' + option.displayName,
  }))

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
  const [licensure, setLicensure] = useState([])
  const [degreeUploading, setDegreeUploading] = useState(false);

  const defaultIdentifiers = [
    {
      label: 'National Provider Identifier (NPI)',
      value: 'http://hl7.org/fhir/sid/us-npi',
      code: 'NPI',
    },
  ];

  const defaultLicensure = [{
    label: '', value: '', code: ''
  }];


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
          expiry: element?.expiry,
          file: element?.file,
          value: element?.number,
          use: 'official',
          system: element?.type?.value,
          type: {
            coding: [{
              system: element?.type?.value,
              code: element?.type?.code,
              display: element?.type?.label,
            }],
            text: element?.type?.label,
          },
          issuingAuthority: element?.issuingAuthority,
          status: element?.status,
          ennumerationDate: element?.ennumerationDate,
        };
        finalIdentifiersData.push(data);
      })
    }
    let finalLicensureData = [];
    if (licensure) {
      licensure.forEach((element) => {
        let licensureData = {
          expiry: element?.expiry,
          file: element?.file,
          value: element?.number,
          use: 'official',
          system: element?.type?.value,
          type: {
            coding: [{
              system: element?.type?.value,
              code: element?.type?.code,
              display: element?.type?.label,
            }],
            text: element?.type?.label,
          },
          issuingAuthority: element?.issuingAuthority,
          licenseState: element?.licenseState,
          status: element?.status,
          ennumerationDate: element?.ennumerationDate,
        };
        finalLicensureData.push(licensureData);
      })
    }
    const taxonomyCodes = taxonomyCodesList?.map((item) => ({
      type: item?.type,
      code: item?.code?.code, // Taxonomy code
      Grouping: item?.code?.grouping, // Taxonomy grouping
      Classification: item?.code?.classification, // Taxonomy classification
      Specialization: item?.code?.specialization, // Taxonomy specialization
      Definition: item?.code?.definition, // Taxonomy definition
      Notes: item?.code?.notes, // Taxonomy notes
      displayName: item?.code?.displayName, // Taxonomy display name
      section: item?.code?.section, // Taxonomy section
      state: item?.state, // Taxonomy state
      licenseNumber: item?.licenseNumber, // Taxonomy license number
      status: item?.status === 'active' ? true : false, // Taxonomy sta
    }))
    const payload = {
      ...(updateId ? { doctorId: id } : { doctorId: store?.createtDoctorsReducer?.data?.doctor?._id }),
      identifier: [...finalIdentifiersData, ...finalLicensureData],
      taxonomy: taxonomyCodes,
    }
    console.log(payload, 'payload')
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

  const [taxonomyCodesList, setTaxonomyCodesList] = useState([
    { type: 'primary', code: '', state: "", licenseNumber: '', status: '' },
  ]);
  const addTaxonomyCode = () => {
    setTaxonomyCodesList([
      ...taxonomyCodesList,
      {
        type: '',
        code: '',
        Grouping: '',
        Classification: "",
        Specialization: '',
        Definition: "",
        Notes: "",
        displayName: "",
        section: "",
        state: "",
        licenseNumber: '',
        status: ''
      }
    ]);
  };
  const [taxonmy, setTaxonomy] = useState(null);
  const handleTaxonomyChange = (selectedOption, index) => {
    const updatedList = [...taxonomyCodesList];
    updatedList[index] = {
      ...updatedList[index],
      code: selectedOption?.value || '',
      displayName: selectedOption?.label || ''
    };
    setTaxonomyCodesList(updatedList);
  };


  const selectedTaxonomyOption =
    formattedTaxonomyOptions.find((option) => option?.value?.displayName === taxonomy?.text) ||
    formattedTaxonomyOptions.find((option) => option?.displayName === taxonomy);
  const loadTaxonomyOptions = (inputValue, callback) => {
    if (!inputValue) {
      callback(formattedTaxonomyOptions.slice(0, 10));
      return;
    }
    const filteredOptions = formattedTaxonomyOptions.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filteredOptions.slice(0, 20)); // Return up to 20 results on search
  };


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
                  <DoctorIdentifierForm
                    defaultIdentifiers={defaultIdentifiers}
                    defaultLicensure={defaultLicensure}
                    identifiers={identifiers}
                    setIdentifiers={setIdentifiers}
                    licensure={licensure}
                    setLicensure={setLicensure}
                  />
                  {/* <Row>
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
                                handleQualificationChange(index, 'degreeName', selectedOption) 
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
                        {index > 0 && (
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
                  </Row> */}
                  <hr />
                  <Row>
                    <Col sm={12} >
                      <h5>
                        Taxonomy Codes
                        <span
                          className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                          onClick={addTaxonomyCode}
                        ></span>
                      </h5>
                    </Col>
                    {taxonomyCodesList?.map((data, index) => (
                      <Row key={index} className="mb-2">
                        <Col sm={3}>
                          <Form.Label className='mb-0'>Code</Form.Label>
                          <AsyncSelect
                            loadOptions={loadTaxonomyOptions}
                            defaultOptions={formattedTaxonomyOptions.slice(0, 10)}
                            isSearchable
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="&nbsp; Select"
                            value={formattedTaxonomyOptions.find(opt => opt.value === data.code)}
                            onChange={(selected) => handleTaxonomyChange(selected, index)}
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
                        </Col>

                        <Col sm={3}>
                          <Form.Label className='mb-0'>License Number</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="License Number"
                            value={data.licenseNumber}
                            onChange={(e) => {
                              const updatedList = [...taxonomyCodesList];
                              updatedList[index].licenseNumber = e.target.value.toUpperCase();
                              setTaxonomyCodesList(updatedList);
                            }}
                            maxLength={10}
                          />
                        </Col>
                        <Col sm={3}>
                          <Form.Label className='mb-0'>Type</Form.Label>
                          <Form.Select
                            value={data.type}
                            onChange={(e) => {
                              const updatedList = [...taxonomyCodesList];
                              updatedList[index].type = e.target.value;
                              setTaxonomyCodesList(updatedList);
                            }}
                          >
                            <option value="">Select</option>
                            <option value="primary">Primary</option>
                            <option value="secondary">Secondary</option>
                          </Form.Select>
                        </Col>
                        <Col sm={3}>
                          <Form.Label className='mb-0'>State</Form.Label>
                          <Form.Select
                            value={data.state}
                            onChange={(e) => {
                              const updatedList = [...taxonomyCodesList];
                              updatedList[index].state = e.target.value;
                              setTaxonomyCodesList(updatedList);
                            }}
                          >
                            <option value="">Select State</option>
                            {statesData?.map((state, idx) => (
                              <option key={idx} value={state?.name}>{state?.name}</option>
                            ))}
                          </Form.Select>
                        </Col>
                        <Col sm={3}>
                          <Form.Label className='mb-0'>Status</Form.Label>
                          <Form.Select
                            value={data.status}
                            onChange={(e) => {
                              const updatedList = [...taxonomyCodesList];
                              updatedList[index].status = e.target.value;
                              setTaxonomyCodesList(updatedList);
                            }}
                          >
                            <option value="" hidden>Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </Form.Select>
                          {index > 0 && (
                            <span
                              className="text-danger cursor-pointer position-absolute fs-5 fw-bold"
                              style={{ right: '-2%', top: '12%' }}
                              onClick={() => {
                                const updatedList = taxonomyCodesList.filter((_, i) => i !== index);
                                setTaxonomyCodesList(updatedList);
                              }}>
                              <CiCircleMinus />
                            </span>
                          )}
                        </Col>
                        {taxonomyCodesList?.length >= 1 && index < taxonomyCodesList?.length - 1 && <hr className="mt-2" />}
                      </Row>
                    ))}

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
                    'Update'
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
