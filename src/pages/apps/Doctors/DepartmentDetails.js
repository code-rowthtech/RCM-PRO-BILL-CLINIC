import React, { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createDoctorDetailAction } from "../../../redux/actions";
import { encryptMessage } from "../../../cryptoUtils";
import { useForm } from "react-hook-form";
import { getMastersDataAction } from "../../../redux/settings/action";
import { useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const DepartmentDetails = ({ docId }) => {

  const [showPassword, setShowPassword] = useState(false);
  const [showCAQHPassword, setShowCAQHPassword] = useState(false);
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const departmentId = store?.getMastersDataReducer?.data?.result;
  const doctorDetails = store?.getDoctorDetailsReducer?.data?.result
  const id = doctorDetails?._id
  // console.log(departmentId, 'departmentId')
  // console.log(doctorDetails,'123456789876543')
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  // const id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId
  // console.log(id, '12345678998765432')
  const [searchParams] = useSearchParams();
  const updateId = searchParams.get('id');

  const onsubmit = (data) => {
    const payload = {
      ...(updateId ? { id: id } : { id: store?.createtDoctorsReducer?.data?.doctor?._id }),
      TIN_SSN: data?.TIN_SSN,
      NPI: data?.NPI,
      NPIUsername: data?.NPIUsername,
      NPIPassword: data?.NPIPassword,
      CAQH_ID: data?.CAQH_ID,
      CAQHUsername: data?.CAQHUsername,
      CAQHPassword: data?.CAQHPassword,
      medicarePTAN: data?.medicarePTAN,
      medicaidID: data?.medicaidID,
      Medicare_SPOT_Logins: data?.Medicare_SPOT_Logins,
      Medicare_PECOS_Logins: data?.Medicare_PECOS_Logins,
      DEA_IssueDate: data?.DEA_IssueDate,
      DEA: data?.DEA,
      CLIA: data?.CLIA,
      LicensingInformation: [
        {
          stateLicense: data?.stateLicense,
          stateLicenseProvider: data?.stateLicenseProvider,
          stateLicenseObtained: data?.stateLicenseObtained,
          uploadedDocument: data?.uploadedDocument,
          stateLicenseIssueDate: data?.stateLicenseIssueDate,
          licenseExpirationDate: data?.licenseExpirationDate,
        }
      ],
      AccreditationDetails: [
        {
          documentName: data?.documentName,
          documentNumber: data?.documentNumber,
          uploadedDocument: data?.uploadedDocument,

        }
      ],
      // clinicId: id,
      // userId: docId,
      // id: id ,
      // departmentId: data?.department,
    }
    // console.log('Form Submitted:', payload);
    dispatch(createDoctorDetailAction({ key: encryptMessage(payload) }));
  }

  useEffect(() => {
    if (doctorDetails && updateId) {
      setValue('TIN_SSN', doctorDetails?.TIN_SSN)
      setValue('NPI', doctorDetails?.NPI)
      setValue('NPIUsername', doctorDetails?.NPIUsername)
      setValue('CAQH_ID', doctorDetails?.CAQH_ID)
      setValue('CAQHUsername', doctorDetails?.CAQHUsername)
      setValue('medicarePTAN', doctorDetails?.medicarePTAN)
      setValue('medicaidID', doctorDetails?.medicaidID)
      // setValue('department', doctorDetails?.departmentId?._id)
      setValue('Medicare_SPOT_Logins', doctorDetails?.Medicare_SPOT_Logins)
      setValue('Medicare_PECOS_Logins', doctorDetails?.Medicare_PECOS_Logins)
      setValue('stateLicense', doctorDetails?.LicensingInformation?.[0]?.stateLicense)
      setValue('stateLicenseProvider', doctorDetails?.LicensingInformation?.[0]?.stateLicenseProvider)
      setValue('stateLicenseObtained', doctorDetails?.LicensingInformation?.[0]?.stateLicenseObtained)
      setValue('DEA', doctorDetails?.DEA)
      setValue('CLIA', doctorDetails?.CLIA)

      const formattedDEAIssueDate = doctorDetails?.DEA_IssueDate
        ? new Date(doctorDetails?.DEA_IssueDate).toISOString().split('T')[0]
        : '';
      const formattedStateLicenseIssueDate = doctorDetails?.LicensingInformation?.[0]?.stateLicenseIssueDate
        ? new Date(doctorDetails?.LicensingInformation?.[0]?.stateLicenseIssueDate).toISOString().split('T')[0]
        : '';
      const formattedLicenseExpirationDate = doctorDetails?.LicensingInformation?.[0]?.licenseExpirationDate
        ? new Date(doctorDetails?.LicensingInformation?.[0]?.licenseExpirationDate).toISOString().split('T')[0]
        : '';

      setValue('DEA_IssueDate', formattedDEAIssueDate);
      setValue('stateLicenseIssueDate', formattedStateLicenseIssueDate);
      setValue('licenseExpirationDate', formattedLicenseExpirationDate);
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
              <div className="row mt-1" style={{ borderBottom: '1px solid #444141' }}>
                <p className="fw-bold mb-1">
                  Identification & Credentials  {!updateId && <span className='text-danger'>*</span>}
                </p>
                <div className="col-6">
                  {/* TIN/SSN Field */}
                  <Form.Group className="mb-1">
                    <Form.Label className="mb-0">
                      TIN/SSN {!updateId && <span className='text-danger'>*</span>}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register('TIN_SSN', !updateId && {
                        required: 'TIN/SSN is required',
                        pattern: {
                          value: /^\d{3}-\d{2}-\d{4}$/, // Example: TIN/SSN format
                          message: 'Invalid TIN/SSN format, valid format (XXX-XX-XXXX).',
                        },
                      })}
                      placeholder="Enter TIN/SSN"
                      maxLength={11}
                    />
                    {errors.TIN_SSN && (
                      <span className="text-danger">{errors.TIN_SSN.message}</span>
                    )}
                  </Form.Group>

                  {/* NPI Username Field */}
                  <Form.Group className="mb-1">
                    <Form.Label className="mb-0">
                      NPI Username  {!updateId && <span className='text-danger'>*</span>}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register('NPIUsername', !updateId ? {
                        required: 'NPI Username is required',
                      } : {}
                      )}
                      placeholder="Enter NPI Username"
                      maxLength={10}
                    />
                    {errors.NPIUsername && (
                      <span className="text-danger">{errors.NPIUsername.message}</span>
                    )}
                  </Form.Group>

                  {/* CAQH ID Field */}
                  <Form.Group className="mb-1">
                    <Form.Label className="mb-0">
                      CAQH ID  {!updateId && <span className='text-danger'>*</span>}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register('CAQH_ID', {
                        ...(!updateId ? {
                          required: 'CAQH ID is required'
                        } : {})
                      })}
                      maxLength={10}
                      placeholder="Enter CAQH ID"
                    />
                    {errors.CAQH_ID && (
                      <span className="text-danger">{errors.CAQH_ID.message}</span>
                    )}
                  </Form.Group>
                </div>

                <div className="col-6">
                  {/* NPI Field */}
                  <Form.Group className="mb-1">
                    <Form.Label className="mb-0">
                      NPI (National Provider Identifier)  {!updateId && <span className='text-danger'>*</span>}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register('NPI',
                        !updateId ? {
                          required: 'NPI is required',
                          pattern: {
                            value: /^\d{10}$/, // NPI should be a 10-digit number
                            message: 'Invalid NPI format',
                          },
                        } : {}
                      )}
                      maxLength={10}
                      placeholder="Enter NPI"
                    />
                    {errors.NPI && <span className="text-danger">{errors.NPI.message}</span>}
                  </Form.Group>

                  {/* NPI Password Field */}
                  <Form.Group className='mb-1'>
                    <Form.Label className="mb-0">NPI Password {!updateId && <span className="text-danger">*</span>}</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder={updateId ? '' : 'NPI Password'}
                        readOnly={updateId}
                        // onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        {...register('NPIPassword', {
                          required: !updateId ? 'NPIPassword is required' : false,
                          pattern: {
                            value: updateId ? '' : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                            message: 'At least 8 characters required, including 1 uppercase letter, 1 number, and 1 special character',
                          },
                        })}
                      />
                      <span
                        className="position-absolute end-0 top-0 mt-1 me-2 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                      {errors.password && <span className="text-danger">{errors.NPIPassword.message}</span>}
                    </div>
                  </Form.Group>
                  <div className="row">
                    {/* CAQH Username Field */}
                    <div className="col-6">
                      <Form.Group className="mb-1">
                        <Form.Label className="mb-0">
                          CAQH Username  {!updateId && <span className='text-danger'>*</span>}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          {...register('CAQHUsername',
                            !updateId ? {
                              required: 'CAQH Username is required',
                            } : {}
                          )}
                          placeholder="Enter CAQH Username"
                        />
                        {errors.CAQHUsername && (
                          <span className="text-danger">{errors.CAQHUsername.message}</span>
                        )}
                      </Form.Group>
                    </div>

                    {/* CAQH Password Field */}
                    <div className="col-6">
                      <Form.Group className='mb-2 '>
                        <Form.Label className="mb-0">CAQH Password {!updateId && <span className="text-danger">*</span>}</Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showCAQHPassword ? "text" : "password"}
                            placeholder={updateId ? '' : 'CAQH Password'}
                            readOnly={updateId}
                            // onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            {...register('CAQHPassword', {
                              required: !updateId ? 'CAQHPassword is required' : false,
                              pattern: {
                                value: updateId ? '' : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                                message: 'At least 8 characters required, including 1 uppercase letter, 1 number, and 1 special character',
                              },
                            })}
                          />
                          <span
                            className="position-absolute end-0 top-0 mt-1 me-2 cursor-pointer"
                            onClick={() => setShowCAQHPassword(!showCAQHPassword)}
                          >
                            {showCAQHPassword ? <FaEyeSlash /> : <FaEye />}
                          </span>
                          {errors.password && <span className="text-danger">{errors.CAQHPassword.message}</span>}
                        </div>
                      </Form.Group>

                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-1" style={{ borderBottom: '1px solid #444141' }}>
                <p className="fw-bold mb-1">
                  Medicare & Medicaid Information  {!updateId && <span className='text-danger'>*</span>}
                </p>
                <div className="col-6">
                  {/* Medicare PTAN */}
                  <Form.Group className="mb-1">
                    <Form.Label className="mb-0">
                      Medicare PTAN  {!updateId && <span className='text-danger'>*</span>}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      maxLength={10}
                      {...register('medicarePTAN',
                        !updateId ? {
                          required: 'Medicare PTAN is required',
                          pattern: {
                            value: /^[A-Za-z0-9]{10}$/, // Example pattern for Medicare PTAN
                            message: 'Medicare PTAN must be 10 alphanumeric characters',
                          },
                        } : {}
                      )}
                      placeholder="Enter Medicare PTAN"
                    />
                    {errors.medicarePTAN && (
                      <span className="text-danger">{errors.medicarePTAN.message}</span>
                    )}
                  </Form.Group>

                  {/* Medicare SPOT Logins */}
                  <Form.Group className="mb-1">
                    <Form.Label className="mb-0">
                      Medicare SPOT Logins  {!updateId && <span className='text-danger'>*</span>}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register('Medicare_SPOT_Logins',
                        !updateId ? {
                          required: 'Medicare SPOT Logins is required',
                        } : {}
                      )}
                      placeholder="Enter Medicare SPOT Logins"
                    />
                    {errors.Medicare_SPOT_Logins && (
                      <span className="text-danger">{errors.Medicare_SPOT_Logins.message}</span>
                    )}
                  </Form.Group>
                </div>

                <div className="col-6">
                  <div className="row">
                    {/* Medicaid ID */}
                    <div className="col-12">
                      <Form.Group className="mb-1">
                        <Form.Label className="mb-0">
                          Medicaid ID  {!updateId && <span className='text-danger'>*</span>}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          {...register('medicaidID',
                            !updateId ? {
                              required: 'Medicaid ID is required',
                            } : {}
                          )}
                          placeholder="Enter Medicaid ID"
                        />
                        {errors.medicaidID && (
                          <span className="text-danger">{errors.medicaidID.message}</span>
                        )}
                      </Form.Group>
                    </div>

                    {/* Department */}
                    {/* <div className="col-6">
                      <Form.Group className="mb-1">
                        <Form.Label className="mb-0">
                          Department  {!updateId && <span className='text-danger'>*</span>}
                        </Form.Label>
                        <Form.Select
                          {...register('department',
                            !updateId ? {
                              required: 'Department is required',
                            } : {}
                          )}
                        >
                          <option value="" disabled selected>
                            Select Department
                          </option>
                          {departmentId &&
                            departmentId.map((data) => (
                              <option key={data?._id} value={data?._id}>
                                {data?.name}
                              </option>
                            ))}
                        </Form.Select>
                        {errors.department && (
                          <span className="text-danger">{errors.department.message}</span>
                        )}
                      </Form.Group>
                    </div> */}
                  </div>

                  {/* Medicare PECOS Logins */}
                  <Form.Group className="mb-2">
                    <Form.Label className="mb-0">
                      Medicare PECOS Login  {!updateId && <span className='text-danger'>*</span>}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register('Medicare_PECOS_Logins',
                        !updateId ? {
                          required: 'Medicare PECOS Login is required',
                        } : {}
                      )}
                      placeholder="Enter Medicare PECOS Logins"
                    />
                    {errors.Medicare_PECOS_Logins && (
                      <span className="text-danger">{errors.Medicare_PECOS_Logins.message}</span>
                    )}
                  </Form.Group>
                </div>
              </div>

              <div className="row mt-1" style={{ borderBottom: '1px solid #444141' }}>
                <p className="fw-bold mt-1 mb-1">
                  Licensing Information  {!updateId && <span className='text-danger'>*</span>}
                </p>
                <div className="col-6">
                  {/* State License */}
                  <Form.Group className="mb-1">
                    <Form.Label className="mb-0">
                      State License  {!updateId && <span className='text-danger'>*</span>}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register('stateLicense', !updateId && {
                        required: 'State License is required',
                      })}
                      placeholder="Enter State License"
                    />
                    {errors.stateLicense && (
                      <span className="text-danger">{errors.stateLicense.message}</span>
                    )}
                  </Form.Group>

                  {/* State License Obtained */}
                  <Form.Group className="mb-1">
                    <Form.Label className="mb-0">
                      State License Obtained (state)  {!updateId && <span className='text-danger'>*</span>}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register('stateLicenseObtained', {
                        ...(!updateId ? {
                          required: 'State License Obtained is required',
                        } : {})
                      })}
                      placeholder="Enter State of License"
                    />
                    {errors.stateLicenseObtained && (
                      <span className="text-danger">{errors.stateLicenseObtained.message}</span>
                    )}
                  </Form.Group>
                </div>

                <div className="col-6">
                  {/* State License Provider */}
                  <Form.Group className="mb-1">
                    <Form.Label className="mb-0">
                      State License Provider (licensing authority name)  {!updateId && <span className='text-danger'>*</span>}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register('stateLicenseProvider',
                        !updateId ? {
                          required: 'Licensing Authority Name is required',
                        } : {}
                      )}
                      placeholder="Enter Licensing Authority Name"
                    />
                    {errors.stateLicenseProvider && (
                      <span className="text-danger">{errors.stateLicenseProvider.message}</span>
                    )}
                  </Form.Group>

                  <div className="row">
                    {/* State License Issue Date */}
                    <div className="col-6">
                      <Form.Group className="mb-1">
                        <Form.Label className="mb-0">
                          State License Issue Date  {!updateId && <span className='text-danger'>*</span>}
                        </Form.Label>
                        <Form.Control
                          type="date"
                          {...register('stateLicenseIssueDate',
                            !updateId ? {
                              required: 'Issue Date is required',
                              validate: (value) =>
                                new Date(value) <= new Date() || 'Issue date cannot be in the future',
                            } : {}
                          )}
                          placeholder="Enter Issue Date"
                        />
                        {errors.stateLicenseIssueDate && (
                          <span className="text-danger">{errors.stateLicenseIssueDate.message}</span>
                        )}
                      </Form.Group>
                    </div>

                    {/* License Expiration Date */}
                    <div className="col-6">
                      <Form.Group className="mb-2">
                        <Form.Label className="mb-0">
                          License Expiration Date  {!updateId && <span className='text-danger'>*</span>}
                        </Form.Label>
                        <Form.Control
                          type="date"
                          {...register('licenseExpirationDate',
                            !updateId ? {
                              required: 'Expiration Date is required',
                              validate: (value) =>
                                new Date(value) > new Date() || 'Expiration date must be in the future',
                            } : {}
                          )}
                          placeholder="Enter Expiration Date"
                        />
                        {errors.licenseExpirationDate && (
                          <span className="text-danger">{errors.licenseExpirationDate.message}</span>
                        )}
                      </Form.Group>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-1">
                <div className="col-4">
                  <div>
                    <Form.Group className="mb-1">
                      <Form.Label htmlFor="DEA" className="form-label mb-0">
                        DEA # (Drug Enforcement Administration number) {!updateId && <span className='text-danger'>*</span>}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="DEA"
                        className="w-100 input ps-2 py-1"
                        placeholder="Enter DEA #"
                        {...register('DEA',
                          !updateId ? {
                            required: 'DEA is required',
                            pattern: {
                              value: /^[A-Za-z0-9]{9}$/, // Example: DEA # format
                              message: 'DEA # must be 9 alphanumeric characters',
                            },
                          } : {}
                        )}
                        maxLength={9}
                      />
                      {errors.DEA && <span className="text-danger">{errors.DEA.message}</span>}
                    </Form.Group>
                  </div>
                </div>
                <div className="col-4">
                  <div>
                    <div className="row">
                      <Form.Group className="mb-1">
                        <Form.Label htmlFor="DEA_IssueDate" className="form-label mb-0">
                          DEA Issue Date {!updateId && <span className='text-danger'>*</span>}
                        </Form.Label>
                        <Form.Control
                          type="date"
                          id="DEA_IssueDate"
                          className="w-100 input ps-2 py-1"
                          placeholder="Select Issue Date"
                          {...register('DEA_IssueDate',
                            !updateId ? {
                              required: 'DEA Issue Date is required',
                              validate: (value) =>
                                new Date(value) <= new Date() || 'Issue date cannot be in the future',
                            } : {}
                          )}
                        />
                        {errors.DEA_IssueDate && <span className="text-danger">{errors.DEA_IssueDate.message}</span>}
                      </Form.Group>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div>
                    <div className="row">
                      <Form.Group className="mb-1">
                        <Form.Label htmlFor="CLIA" className="form-label mb-0">
                          CLIA # (Clinical Laboratory Improvement Amendments) {!updateId && <span className='text-danger'>*</span>}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="CLIA"
                          className="w-100 input ps-2 py-1"
                          placeholder="Enter CLIA #"
                          minLength={10}
                          maxLength={15}
                          {...register('CLIA',
                            !updateId ? {
                              required: 'CLIA is required',
                              pattern: {
                                value: /^[A-Za-z0-9]{10,15}$/, // Example: CLIA # format (10-15 alphanumeric chars)
                                message: 'CLIA # must be between 10 and 15 alphanumeric characters',
                              },
                            } : {}
                          )}
                        />
                        {errors.CLIA && <span className="text-danger">{errors.CLIA.message}</span>}
                      </Form.Group>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-1">
                <Button className="" variant="secondary">
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
