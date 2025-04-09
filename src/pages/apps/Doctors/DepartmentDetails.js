import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createDoctorDetailAction } from "../../../redux/actions";
import { encryptMessage } from "../../../cryptoUtils";
import { useForm } from "react-hook-form";
import { getMastersDataAction } from "../../../redux/settings/action";
import { useSearchParams } from "react-router-dom";
import { CiCircleMinus } from "react-icons/ci";
import DoctorIdentifierForm from "./DoctorIdentifier";
import { taxonomyOptions as taxonomy } from "../../../utils/DataSets/commonData";
import AsyncSelect from 'react-select/async';
const DepartmentDetails = ({ setActiveTab }) => {
  // const defaultIdentifiers = ['NPI'];
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const doctorDetails = store?.getDoctorDetailsReducer?.data?.result;
  const statesData = store?.getStatesReducer?.data?.states;
  const id = doctorDetails?._id;
  const {
    handleSubmit,
    setValue,
  } = useForm();
  const [searchParams] = useSearchParams();

  const updateId = searchParams.get('id');
  const formattedTaxonomyOptions = taxonomy.map((option) => ({
    value: option,
    label: option.code + ' - ' + option.displayName,
  }))


  const [identifiers, setIdentifiers] = useState([]);
  const [licensure, setLicensure] = useState([])

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

  const onsubmit = (data) => {
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
      code: item?.code?.code,
      Grouping: item?.code?.grouping,
      Classification: item?.code?.classification,
      Specialization: item?.code?.specialization,
      Definition: item?.code?.definition,
      Notes: item?.code?.notes,
      displayName: item?.code?.displayName,
      section: item?.code?.section,
      state: item?.state,
      licenseNumber: item?.licenseNumber,
      status: item?.status === 'active' ? true : false,
    }))
    const payload = {
      ...(updateId ? { doctorId: id } : { doctorId: store?.createtDoctorsReducer?.data?.doctor?._id }),
      identifier: [...finalIdentifiersData, ...finalLicensureData],
      taxonomy: taxonomyCodes,
    }
    dispatch(createDoctorDetailAction({ key: encryptMessage(payload) }));
  }
  useEffect(() => {
    if (doctorDetails && updateId) {
      const updatedTaxonomyCodes = doctorDetails?.taxonomy?.map((item, index) => ({
        type: item?.type || '',
        displayName: item?.displayName || '',
        code: { code: item?.code, grouping: item?.Grouping, classification: item?.Classification } || {},
        state: item?.state || '',
        licenseNumber: item?.licenseNumber || '',
        status: item?.status === true ? 'active' : 'inactive' || ''
      }))
      setTaxonomyCodesList(updatedTaxonomyCodes)
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
  const handleTaxonomyChange = (selectedOption, index) => {
    const updatedList = [...taxonomyCodesList];
    updatedList[index] = {
      ...updatedList[index],
      code: selectedOption?.value || '',
      displayName: selectedOption?.label || ''
    };
    setTaxonomyCodesList(updatedList);
  };


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
                            value={formattedTaxonomyOptions.find(opt => opt.value === data.code) || formattedTaxonomyOptions.find(opt => opt.value.code === data.code.code)}
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
                            value={data.type || 'primary'}
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
                <Button className="cancel-button" onClick={() => setActiveTab('personalDetails')}>
                  Previous
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
                    'Update & Next'
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