import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createDoctorDetailAction } from "../../../redux/actions";
import { encryptMessage } from "../../../cryptoUtils";
import { useForm } from "react-hook-form";
import { getMastersDataAction } from "../../../redux/settings/action";
import { useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiDownloadCloud, FiUploadCloud, FiTrash2 } from "react-icons/fi";
import { CiCircleMinus } from "react-icons/ci";
import { handleUpload } from "../../../helpers/HandleUpload";
import IdentifierForm from "../Common Pages/IdentifierForm";
import Select from 'react-select';
import { qualificationsData } from "../../../utils/DataSets/qualification.data";

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
    // setConstantContact(
    //   contactDetails.map((system) => ({
    //     system,
    //     value: '',
    //     use: '',
    //   }))
    // );
  }, []);
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
  // const handleFileChangeDegree = async (e) => {
  //   const selectedFile = e.target.files[0];
  //   try {
  //     const url = await handleUpload(selectedFile, setDegreeUploading);
  //     setDegree(url);
  //     setDegreeName(selectedFile?.name)
  //   } catch (error) {
  //     // console.error('Error during file upload:', error);
  //   }
  // };
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

  const QualificationOptions = qualificationsData.map((qualification) => ({
    value: qualification.code,
    label: qualification.display,
    data: qualification, // Store full object for later use
  }));

  const [code, setCode] = useState([])
  // const handleQualificationChange = (selectedOption) => {

  //   const { definition, ...rest } = selectedOption.value; // Remove `definition`

  //   setCode(prevState => [
  //     ...prevState,
  //     {
  //       ...rest,
  //       url: '' // Add or update the `url` property
  //     }
  //   ]);

  //   setValue('degreeName', selectedOption ? selectedOption.display : '');
  // };
  const onsubmit = (data) => {
    const qualificationData = qualifications?.map((item) => ({
      code: item?.degreeName,
      documents: item?.degreeFile,
      issuer: item?.issuerOrganisation,
    }))
    let finalIdentifiersData = [];
    if(identifiers){
      identifiers.forEach((element)=>{
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
      // qualification: [{
      //   // identifier: [{
      //   //   use: "", // Example: "official", "usual", etc.
      //   //   system: "", // Example: "https://example.com/degree-system"
      //   //   value: data?.degreeName, // Degree name
      //   //   period: {
      //   //     start: "", 
      //   //     end: "" 
      //   //   }
      //   // }],
      //   code: {
      //     system: "http://hl7.org/fhir/ValueSet/degreeLicenseCertificate",
      //     code: "", // Example: "MD"
      //     display: "", // Degree display name
      //     url: "" // Degree document URL
      //   },
      //   // period: {
      //   //   start: "", 
      //   //   end: "" 
      //   // },
      //   issuer: {
      //     reference: "test" // Example: "Organization/12345" (Reference to issuing organization)
      //   },
      //   documents: [{
      //     url: degree?.url?.split('?')[0] || degree,
      //     fileName: degreeName,
      //   }] // Degree file name(s)
      // }]
      qualification: qualificationData,
      specialties: [data?.specialist],

    }
    dispatch(createDoctorDetailAction({ key: encryptMessage(payload) }));
  }
useEffect(() => {
  if (doctorDetails && updateId) {
    // Set qualifications data
    const updatedQualifications = doctorDetails?.qualification?.map((item, index) => ({
      id: index + 1,
      degreeName: {
        code:item?.code?.code,
        display:item?.code?.display,
        definition:item?.code?.display,
        system:item?.code?.system
      },
      specialist:item?.specialties?.[0] || 'N/A',
      degreeFile: item?.documents?.[0] || null, // Use the first document if available
      issuerOrganisation: item?.issuer?.reference || '', // Use the issuer reference if available
    }));
    setQualifications(updatedQualifications);
  }
}, [doctorDetails, setValue, updateId]);

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
                        {/* Delete Button */}
                        {/* {index > 0 && ( // Only show delete button for added rows
                        
                          <div className="d-flex justify-content-end">
                            <span
                              className="text-danger position-absolute cursor-pointer fs-5 fw-bold"
                              style={{ right: '0.5%', top: '58.5%' }}
                              onClick={() => removeQualification(qualification.id)}>
                              <CiCircleMinus />
                            </span>
                          </div>
                        )} */}
                        {index > 0 && ( // Only show delete button for added rows
                          <div className="col-md-12 text-end">
                            {/* <Button
                              variant="danger"
                              size="sm"
                              onClick={() => removeQualification(qualification.id)}
                            >
                              <FiTrash2 /> Remove
                            </Button> */}
                             <span
                              className="text-danger position-absolute cursor-pointer fs-5 fw-bold"
                              style={{ marginTop:'-35px' }}
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
