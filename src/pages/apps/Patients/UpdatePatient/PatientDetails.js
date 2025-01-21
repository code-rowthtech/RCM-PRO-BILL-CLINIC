import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Form, Modal, Row, InputGroup, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getStatesByCountryAction, getCitiesAction, getCities2Action, getCities3Action, updatePatientsAction, getDoctorsAction } from "../../../../redux/actions";
import us from '../../../../assets/images/flags/us.jpg'
import { encryptMessage } from "../../../../cryptoUtils";
import Select from 'react-select';
import { handleUpload } from "../../../../helpers/HandleUpload";

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  // Adjust if the current month/day is before the birth month/day
  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months += 12; // Add 12 months to the negative month difference
  }

  // Adjust the month difference for the day of the month
  if (today.getDate() < birthDate.getDate()) {
    months--;
  }
  if (months < 0) {
    months += 12;
  }

  return `${years}.${months}`;
};


const PatientDetails = ({ patientId }) => {
  const store = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue, reset, clearErrors, watch, getValues } = useForm();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [profileUploading, setProfileUploading] = useState(false);
  const [logoName, setLogoName] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const logoFileInputRef = useRef(null);
  const [logo, setLogo] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const doctorDetails = store?.getDoctorsReducer?.data?.response;
  const patientDetails = store?.getPatientByIdReducer?.data?.patient;
  const doctorOptions = doctorDetails?.map((data) => ({
    value: data?._id,
    label: data?.userDetails?.firstName + ' ' + data?.userDetails?.lastName,
  }));
  useEffect(() => {
    const doctorPayload = { status: true, search: doctorSearch, departmentId: '' }
    dispatch(getDoctorsAction({ key: encryptMessage(doctorPayload) }));
  }, [dispatch])
  useEffect(() => {
    if (patientDetails && doctorDetails) {
      const doctor = doctorOptions && doctorOptions?.find((data) => data?.value === patientDetails?.primaryProvider?._id);
      setSelectedDoctor(doctor);

      setValue('patientStatus', patientDetails?.patientStatus);
      setValue('firstName', patientDetails?.firstName);
      setValue('middleName', patientDetails?.middleName);
      setValue('lastName', patientDetails?.lastName);
      setValue('title', patientDetails?.title);
      setValue('birthName', patientDetails?.birthName);
      setValue('suffix', patientDetails?.suffix);
      setValue('homePhone', patientDetails?.homePhone
        ? patientDetails?.homePhone.replace(/\D/g, '') // Remove all non-numeric characters
          .replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) =>
            p3 ? `(${p1})${p2}-${p3}` : `(${p1})${p2}` // Format dynamically as (XXX)XXX-XXXX
          )
        : '');
      setValue('cellPhone', patientDetails?.cellPhone
        ? patientDetails?.cellPhone.replace(/\D/g, '') // Remove all non-numeric characters
          .replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) =>
            p3 ? `(${p1})${p2}-${p3}` : `(${p1})${p2}` // Format dynamically as (XXX)XXX-XXXX
          )
        : '');
      setValue('officePhone', patientDetails?.officePhone
        ? patientDetails?.officePhone.replace(/\D/g, '') // Remove all non-numeric characters
          .replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) =>
            p3 ? `(${p1})${p2}-${p3}` : `(${p1})${p2}` // Format dynamically as (XXX)XXX-XXXX
          )
        : '');
      setValue('email', patientDetails?.email);
      setValue('alternateEmail', patientDetails?.alternativeEmail);
      setValue('preferredCommunication', patientDetails?.preferredCommunication);
      setValue('reminderLanguage', patientDetails?.reminderLanguage);
      setValue('medicationHistoryConsent', patientDetails?.medicationHistoryConsent);
      setValue('paymentProfile', patientDetails?.paymentProfile);
      setValue('patientCopayAmount', patientDetails?.patientCopayAmount);
      setValue(
        'followupDate',
        patientDetails?.followupDate
          ? new Date(patientDetails.followupDate).toISOString().split('T')[0] // Extract YYYY-MM-DD
          : ''
      );
      setValue('followupReason', patientDetails?.followupReason);
      setLogo(patientDetails?.patientChartPhoto?.url);
      setLogoName(patientDetails?.patientChartPhoto?.fileName);

    }
  }, [patientDetails && doctorDetails])

  const onSubmit = () => {

  }
  const handleInputChange = (data) => {
    setDoctorSearch(data)
  }
  const handleChange = (selectedOption) => {
    setSelectedDoctor(selectedOption);
  };
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    try {
      const url = await handleUpload(selectedFile, setProfileUploading);
      setLogo(url);
      setLogoName(selectedFile?.name);
      clearErrors('profileImage')
    } catch (error) {
      // console.error('Error during file upload:', error);
    }
  };

  return (
    <>
      <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="row my-2">
          <div className="col-6">
            <Form.Group className="responnsible-party-select">
              <Form.Label className="mb-0">
                Primary Provider
              </Form.Label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                isLoading={store?.getDoctorsReducer?.loading}
                isClearable={true}
                value={selectedDoctor}
                isSearchable={true}
                {...register('selectedDoctor')}
                onInputChange={(inputValue) => handleInputChange(inputValue, 'doctor')}
                onChange={(data) => {
                  setValue('selectedDoctor', data);
                  handleChange(data);
                  clearErrors('selectedDoctor')
                }}
                name="doctorName"
                options={doctorOptions}
                placeholder="Select Doctor Name"
              />
            </Form.Group>
          </div>
          <div className="col-6">
            <Form.Group>
              <Form.Label htmlFor="patientstatus" className="mb-0">Status</Form.Label>
              <Form.Select
                as="select"  // Use 'select' to make it a dropdown
                id="patientstatus"
                {...register('patientStatus')}
              >
                <option value="">Select status</option>  {/* Default option */}
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Inactive-Deceased">Inactive-Deceased</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </div>
          <div className="col-6">
            <Form.Group>
              <Form.Label htmlFor="title" className="mb-0">Title</Form.Label>
              <Form.Select
                {...register('title')}
                aria-label="Select Title"
              >
                <option value="">Select Title</option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Miss">Miss</option>
                <option value="Dr.">Dr.</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </div>

          <div className="col-6">
            <Form.Group>
              <Form.Label htmlFor="firstName" className="mb-0">First Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                id="firstName"
                type="text"
                placeholder="First Name"
                {...register('firstName', { required: "First name is required" })}
              />
              {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
            </Form.Group>
          </div>

          <div className="col-6">
            <Form.Group>
              <Form.Label htmlFor="middleName" className="mb-0">Middle Name</Form.Label>
              <Form.Control
                id="middleName"
                type="text"
                placeholder="Middle Name"
                {...register('middleName')}
              />
              {errors.middleName && <span className="text-danger">{errors.middleName.message}</span>}
            </Form.Group>
          </div>

          <div className="col-6">
            <Form.Group>
              <Form.Label htmlFor="lastName" className="mb-0">Last Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                id="lastName"
                type="text"
                placeholder="Last Name"
                {...register('lastName', { required: 'Last Name is required' })}
              />
              {errors.lastName && <span className="text-danger">{errors.lastName.message}</span>}
            </Form.Group>
          </div>

          <div className="col-6">
            <Form.Group>
              <Form.Label className="mb-0">Previous Birth Name </Form.Label>
              <Form.Control
                type="text"
                placeholder="Previous Birth Name"
                {...register('birthName')}
              />
              {errors.birthName && <span className="text-danger">{errors.birthName.message}</span>}
            </Form.Group>
          </div>
          <div className="col-6">
            <Form.Group>
              <Form.Label className="mb-0">Suffix </Form.Label>
              <Form.Control
                type="text"
                placeholder="Suffix"
                {...register('suffix')}
              />
              {errors.suffix && <span className="text-danger">{errors.suffix.message}</span>}
            </Form.Group>
          </div>
          <div className="col-6">
            <div className="mb-1 d-flex flex-column position-relative">
              <Form.Label className="mb-0">Patient Chart Photo</Form.Label>
              <div
                onClick={() => logoFileInputRef.current.click()}
                className={`custom-file-upload justify-content-between cursor-pointer ${logoName || profileUploading ? '' : 'custom-form-fields'}`}
              >
                {logoName ? logoName : profileUploading ? 'Uploading...' : 'Upload Patient Chart Photo'}
                <p className="mb-0">
                  <FiUploadCloud />
                </p>
              </div>
              <Form.Control
                type="file"
                className="d-none "
                {...register('profileImage', {
                })}
                accept=".png, .jpg, .jpeg, .svg" // Allow only specific file types
                ref={logoFileInputRef}
                onChange={handleFileChange}

              />
              {errors.profileImage && (<span className="text-danger">{errors.profileImage.message}</span>
              )}
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-6">
            <Form.Group className="mb-1 position-relative">
              <Form.Label className='mb-0'>Home Phone</Form.Label>
              <Form.Group>
                <InputGroup>
                  <InputGroup.Text className='ps-3 pe-1 fw-bold text-black'>&nbsp;&nbsp;+1</InputGroup.Text>
                  <Form.Control
                    type="tel"
                    {...register('homePhone', !id ? {
                      pattern: {
                        value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                        message: 'Contact must be in the format (XXX)XXX-XXXX',
                      },
                      maxLength: {
                        value: 13,
                        message: 'Contact must not exceed 13 digits'
                      },
                      minLength: {
                        value: 13,
                        message: 'Contact must not be less than 13 digits'
                      }
                    } : {}
                    )}
                    onChange={(e) => {
                      let rawValue = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters
                      if (rawValue.length > 10) rawValue = rawValue.slice(0, 10); // Limit to 10 digits
                      const formattedValue = rawValue.replace(
                        /(\d{1,3})(\d{0,3})(\d{0,4})/,
                        (match, p1, p2, p3) => {
                          if (p3) return `(${p1})${p2}-${p3}`;
                          if (p2) return `(${p1})${p2}`;
                          return `(${p1}`;
                        }
                      ); // Format dynamically as (XXX)XXX-XXXX
                      e.target.value = formattedValue; // Update input value
                      clearErrors('homePhone'); // Clear validation errors
                    }}
                    placeholder="(###)###-####"
                    maxLength={14}
                    onKeyPress={(event) => {
                      // Only allow numeric characters (0-9)
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </InputGroup>
              </Form.Group>

              <div
                className='position-absolute ' style={{ top: '52%', left: '1%' }}
              >
                <img
                  src={us}
                  alt="country code flag"
                  width={20} />
              </div>


            </Form.Group>
          </div>
          <div className="col-6">
            <Form.Group className="mb-1 position-relative">
              <Form.Label className='mb-0'>Cell Phone</Form.Label>
              <Form.Group>
                <InputGroup>
                  <InputGroup.Text className='ps-3 pe-1 fw-bold text-black'>&nbsp;&nbsp;+1</InputGroup.Text>
                  <Form.Control
                    type="tel"
                    {...register('cellPhone', !id ? {
                      pattern: {
                        value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                        message: 'Contact must be in the format (XXX)XXX-XXXX',
                      },
                      maxLength: {
                        value: 13,
                        message: 'Contact must not exceed 13 digits'
                      },
                      minLength: {
                        value: 13,
                        message: 'Contact must not be less than 13 digits'
                      }
                    } : {}
                    )}
                    onChange={(e) => {
                      let rawValue = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters
                      if (rawValue.length > 10) rawValue = rawValue.slice(0, 10); // Limit to 10 digits
                      const formattedValue = rawValue.replace(
                        /(\d{1,3})(\d{0,3})(\d{0,4})/,
                        (match, p1, p2, p3) => {
                          if (p3) return `(${p1})${p2}-${p3}`;
                          if (p2) return `(${p1})${p2}`;
                          return `(${p1}`;
                        }
                      ); // Format dynamically as (XXX)XXX-XXXX
                      e.target.value = formattedValue; // Update input value
                      clearErrors('cellPhone'); // Clear validation errors
                    }}
                    placeholder="(###)###-####"
                    maxLength={14}
                    onKeyPress={(event) => {
                      // Only allow numeric characters (0-9)
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </InputGroup>
              </Form.Group>

              <div
                className='position-absolute ' style={{ top: '52%', left: '1%' }}
              >
                <img
                  src={us}
                  alt="country code flag"
                  width={20} />
              </div>


            </Form.Group>
          </div>
          <div className="col-6">
            <Form.Group className="mb-1 position-relative">
              <Form.Label className='mb-0'>Office Phone</Form.Label>
              <Form.Group>
                <InputGroup>
                  <InputGroup.Text className='ps-3 pe-1 fw-bold text-black'>&nbsp;&nbsp;+1</InputGroup.Text>
                  <Form.Control
                    type="tel"
                    {...register('officePhone', !id ? {
                      pattern: {
                        value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                        message: 'Contact must be in the format (XXX)XXX-XXXX',
                      },
                      maxLength: {
                        value: 13,
                        message: 'Contact must not exceed 13 digits'
                      },
                      minLength: {
                        value: 13,
                        message: 'Contact must not be less than 13 digits'
                      }
                    } : {}
                    )}
                    onChange={(e) => {
                      let rawValue = e.target.value.replace(/\D/g, ''); // Remove all non-numeric characters
                      if (rawValue.length > 10) rawValue = rawValue.slice(0, 10); // Limit to 10 digits
                      const formattedValue = rawValue.replace(
                        /(\d{1,3})(\d{0,3})(\d{0,4})/,
                        (match, p1, p2, p3) => {
                          if (p3) return `(${p1})${p2}-${p3}`;
                          if (p2) return `(${p1})${p2}`;
                          return `(${p1}`;
                        }
                      ); // Format dynamically as (XXX)XXX-XXXX
                      e.target.value = formattedValue; // Update input value
                      clearErrors('officePhone'); // Clear validation errors
                    }}
                    placeholder="(###)###-####"
                    maxLength={14}
                    onKeyPress={(event) => {
                      // Only allow numeric characters (0-9)
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </InputGroup>
              </Form.Group>

              <div
                className='position-absolute ' style={{ top: '52%', left: '1%' }}
              >
                <img
                  src={us}
                  alt="country code flag"
                  width={20} />
              </div>


            </Form.Group>
          </div>
          <div className="col-6">
            <Form.Group>
              <Form.Label htmlFor="email" className="mb-0">Email ID</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email ID"
                {...register('email', { pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: "Invalid email address" } })}
              />
            </Form.Group>
          </div>
          <div className="col-6">
            <Form.Group>
              <Form.Label className="mb-0">Alternate Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Alternate Email ID"
                {...register('alternateEmail', {
                  pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: "Invalid email address" }
                })}
              />
            </Form.Group>
          </div>
          <div className="col-6">
            <Form.Group>
              <Form.Label className="mb-0">Preferred Communication</Form.Label>
              <Form.Select
                {...register('preferredCommunication')}
                aria-label="Select Title"
              >
                <option value="">Select Preferred Communication</option>
                <option value="Home Phone">Home Phone</option>
                <option value="Work Phone">Work Phone</option>
                <option value="Cell Phone">Cell Phone</option>
                <option value="Email">Email</option>
                <option value="Text Message">Text Message</option>
                <option value="Declined">Declined</option>
                <option value="Snail Mail">Snail Mail</option>
                <option value="Other">Other</option>
              </Form.Select>
              {errors.preferredCommunication && <span className="text-danger">{errors.preferredCommunication.message}</span>}
            </Form.Group>
          </div>

          <div className="col-6">
            <Form.Group>
              <Form.Label className="mb-0">Reminder Language</Form.Label>
              <Form.Select
                {...register('reminderLanguage',
                )}
              >
                <option value="">Select Reminder Language</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </Form.Select>
            </Form.Group>
          </div>

          <div className="col-6">
            <Form.Group>
              <Form.Label className="mb-0">Medication History Concent</Form.Label>
              <Form.Select
                {...register('medicationHistoryConsent',
                )}
              >
                <option value="">Select Medication History Concent</option>
                <option value={'true'}>Yes</option>
                <option value={'false'}>No</option>
              </Form.Select>
            </Form.Group>
          </div>

          <div className="col-6">
            <Form.Group>
              <Form.Label className="mb-0">Payment Profile</Form.Label>
              <Form.Select
                {...register('paymentProfile')}
                aria-label="Payment Profile"
              >
                <option value="">Select Payment Profile</option>
                <option value="Cash">Cash</option>
                <option value="Insurance">Insurance</option>
                <option value="Insurance Out of Network">Insurance Out of Network</option>
                <option value="Auto Accident">Auto Accident</option>
                <option value="Worker's Comp">Worker's Comp</option>
                <option value="Other">Other</option>
              </Form.Select>
              {errors.paymentProfile && <span className="text-danger">{errors.paymentProfile.message}</span>}
            </Form.Group>
          </div>
          <div className="col-6">
            <Form.Group>
              <Form.Label className="mb-0">Patient's Copay (in $)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Patient's Copay"
                {...register('patientCopayAmount', {
                  pattern: {
                    value: /^[0-9]+(\.[0-9]+)?$/,
                    message: 'Only numbers or decimals are allowed'
                  }
                })}
              />
            </Form.Group>
          </div>
          <div className="col-6">
            <Form.Group>
              <Form.Label htmlFor="DOB" className="mb-0">Follow Up Date</Form.Label>
              <Form.Control
                type="date"  // Change type to "date" for date input
                placeholder="Follow Up Date"
                {...register('followupDate')}
              />
              {errors.followupDate && <span className="text-danger">{errors.followupDate.message}</span>}
            </Form.Group>
          </div>
          <div className="col-6">
            <Form.Group>
              <Form.Label className="mb-0">Follow Up Reason</Form.Label>
              <Form.Control
                type="text"
                placeholder="Follow Up Reason"
                {...register('followupReason')}
              />
            </Form.Group>
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex gap-2 justify-content-end my-2">
          <Button className="custom-buttons">Update</Button>
        </div>
      </Form>
    </>


  );
};

export default PatientDetails;
