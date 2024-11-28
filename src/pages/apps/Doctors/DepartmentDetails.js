import React, { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createDoctorDetailAction } from "../../../redux/actions";
import { encryptMessage } from "../../../cryptoUtils";
import { useForm } from "react-hook-form";
import { getMastersDataAction } from "../../../redux/settings/action";

const DepartmentDetails = ({ docId }) => {

  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const departmentId = store?.getMastersDataReducer?.data?.result

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId
  console.log(id, '12345678998765432')
  const onsubmit = (data) => {
    const payload = {
      ...data,
      clinicId: id,
      userId: docId,
      departmentId: data?.department,
    }
    console.log('Form Submitted:', payload);
    dispatch(createDoctorDetailAction({ key: encryptMessage(payload) })); // Dispatch with payload
  }

  useEffect(() => {
    dispatch(
      getMastersDataAction({ status: true, category: 'Department', search: '', skip: '', limit: '' })
    );
  }, [dispatch]);

  return (
    <>
      <div className="container-fluid">
        <Form onSubmit={handleSubmit(onsubmit)}>
          <div className="row mt-3" style={{ borderBottom: '1px solid #444141' }}>
            <p className="fw-bold">
              Identification & Credentials <span className="text-danger">*</span>
            </p>
            <div className="col-6">
              {/* TIN/SSN Field */}
              <Form.Group className="mb-3">
                <Form.Label>
                  TIN/SSN <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  {...register('TIN_SSN', {
                    required: 'TIN/SSN is required',
                    pattern: {
                      value: /^\d{3}-\d{2}-\d{4}$/, // Example: TIN/SSN format
                      message: 'Invalid TIN/SSN format',
                    },
                  })}
                  placeholder="Enter TIN/SSN"
                />
                {errors.TIN_SSN && (
                  <span className="text-danger">{errors.TIN_SSN.message}</span>
                )}
              </Form.Group>

              {/* NPI Username Field */}
              <Form.Group className="mb-3">
                <Form.Label>
                  NPI Username <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  {...register('NPIUsername', {
                    required: 'NPI Username is required',
                  })}
                  placeholder="Enter NPI Username"
                />
                {errors.NPIUsername && (
                  <span className="text-danger">{errors.NPIUsername.message}</span>
                )}
              </Form.Group>

              {/* CAQH ID Field */}
              <Form.Group className="mb-3">
                <Form.Label>
                  CAQH ID <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  {...register('CAQH_ID', {
                    required: 'CAQH ID is required',
                  })}
                  placeholder="Enter CAQH ID"
                />
                {errors.CAQH_ID && (
                  <span className="text-danger">{errors.CAQH_ID.message}</span>
                )}
              </Form.Group>
            </div>

            <div className="col-6">
              {/* NPI Field */}
              <Form.Group className="mb-3">
                <Form.Label>
                  NPI (National Provider Identifier) <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  {...register('NPI', {
                    required: 'NPI is required',
                    pattern: {
                      value: /^\d{10}$/, // NPI should be a 10-digit number
                      message: 'Invalid NPI format',
                    },
                  })}
                  placeholder="Enter NPI"
                />
                {errors.NPI && <span className="text-danger">{errors.NPI.message}</span>}
              </Form.Group>

              {/* NPI Password Field */}
              <Form.Group className="mb-3">
                <Form.Label>
                  NPI Password <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  {...register('NPIPassword', {
                    required: 'NPI Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long',
                    },
                  })}
                  placeholder="Enter NPI Password"
                />
                {errors.NPIPassword && (
                  <span className="text-danger">{errors.NPIPassword.message}</span>
                )}
              </Form.Group>

              <div className="row">
                {/* CAQH Username Field */}
                <div className="col-6">
                  <Form.Group className="mb-3">
                    <Form.Label>
                      CAQH Username <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register('CAQHUsername', {
                        required: 'CAQH Username is required',
                      })}
                      placeholder="Enter CAQH Username"
                    />
                    {errors.CAQHUsername && (
                      <span className="text-danger">{errors.CAQHUsername.message}</span>
                    )}
                  </Form.Group>
                </div>

                {/* CAQH Password Field */}
                <div className="col-6">
                  <Form.Group className="mb-3">
                    <Form.Label>
                      CAQH Password <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="password"
                      {...register('CAQHPassword', {
                        required: 'CAQH Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters long',
                        },
                      })}
                      placeholder="Enter CAQH Password"
                    />
                    {errors.CAQHPassword && (
                      <span className="text-danger">{errors.CAQHPassword.message}</span>
                    )}
                  </Form.Group>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-3" style={{ borderBottom: '1px solid #444141' }}>
            <p className="fw-bold">
              Medicare & Medicaid Information <span className="text-danger">*</span>
            </p>
            <div className="col-6">
              {/* Medicare PTAN */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Medicare PTAN <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  {...register('medicarePTAN', {
                    required: 'Medicare PTAN is required',
                    pattern: {
                      value: /^[A-Za-z0-9]{10}$/, // Example pattern for Medicare PTAN
                      message: 'Medicare PTAN must be 10 alphanumeric characters',
                    },
                  })}
                  placeholder="Enter Medicare PTAN"
                />
                {errors.medicarePTAN && (
                  <span className="text-danger">{errors.medicarePTAN.message}</span>
                )}
              </Form.Group>

              {/* Medicare SPOT Logins */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Medicare SPOT Logins <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  {...register('Medicare_SPOT_Logins', {
                    required: 'Medicare SPOT Logins is required',
                  })}
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
                <div className="col-6">
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Medicaid ID <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register('medicaidID', {
                        required: 'Medicaid ID is required',
                      })}
                      placeholder="Enter Medicaid ID"
                    />
                    {errors.medicaidID && (
                      <span className="text-danger">{errors.medicaidID.message}</span>
                    )}
                  </Form.Group>
                </div>

                {/* Department */}
                <div className="col-6">
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Department <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      {...register('department', {
                        required: 'Department is required',
                      })}
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
                </div>
              </div>

              {/* Medicare PECOS Logins */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Medicare PECOS Login <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  {...register('Medicare_PECOS_Logins', {
                    required: 'Medicare PECOS Login is required',
                  })}
                  placeholder="Enter Medicare PECOS Logins"
                />
                {errors.Medicare_PECOS_Logins && (
                  <span className="text-danger">{errors.Medicare_PECOS_Logins.message}</span>
                )}
              </Form.Group>
            </div>
          </div>

          <div className="row mt-3" style={{ borderBottom: '1px solid #444141' }}>
            <p className="fw-bold">
              Licensing Information <span className="text-danger">*</span>
            </p>
            <div className="col-6">
              {/* State License */}
              <Form.Group className="mb-3">
                <Form.Label>
                  State License <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  {...register('stateLicense', {
                    required: 'State License is required',
                  })}
                  placeholder="Enter State License"
                />
                {errors.stateLicense && (
                  <span className="text-danger">{errors.stateLicense.message}</span>
                )}
              </Form.Group>

              {/* State License Obtained */}
              <Form.Group className="mb-3">
                <Form.Label>
                  State License Obtained (state) <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  {...register('stateLicenseObtained', {
                    required: 'State License Obtained is required',
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
              <Form.Group className="mb-3">
                <Form.Label>
                  State License Provider (licensing authority name) <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  {...register('stateLicenseProvider', {
                    required: 'Licensing Authority Name is required',
                  })}
                  placeholder="Enter Licensing Authority Name"
                />
                {errors.stateLicenseProvider && (
                  <span className="text-danger">{errors.stateLicenseProvider.message}</span>
                )}
              </Form.Group>

              <div className="row">
                {/* State License Issue Date */}
                <div className="col-6">
                  <Form.Group className="mb-3">
                    <Form.Label>
                      State License Issue Date <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      {...register('stateLicenseIssueDate', {
                        required: 'Issue Date is required',
                        validate: (value) =>
                          new Date(value) <= new Date() || 'Issue date cannot be in the future',
                      })}
                      placeholder="Enter Issue Date"
                    />
                    {errors.stateLicenseIssueDate && (
                      <span className="text-danger">{errors.stateLicenseIssueDate.message}</span>
                    )}
                  </Form.Group>
                </div>

                {/* License Expiration Date */}
                <div className="col-6">
                  <Form.Group className="mb-3">
                    <Form.Label>
                      License Expiration Date <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      {...register('licenseExpirationDate', {
                        required: 'Expiration Date is required',
                        validate: (value) =>
                          new Date(value) > new Date() || 'Expiration date must be in the future',
                      })}
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
          
          <div className="row mt-3">
            <div className="col-6">
              <div>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="DEA" className="form-label">
                    DEA # (Drug Enforcement Administration number)<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="DEA"
                    className="w-100 input ps-2 py-1"
                    placeholder="Enter DEA #"
                    {...register('DEA', {
                      required: 'DEA is required',
                      pattern: {
                        value: /^[A-Za-z0-9]{9}$/, // Example: DEA # format
                        message: 'DEA # must be 9 alphanumeric characters',
                      },
                    })}
                  />
                  {errors.DEA && <span className="text-danger">{errors.DEA.message}</span>}
                </Form.Group>
              </div>
            </div>
            <div className="col-6">
              <div>
                <div className="row">
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="DEA_IssueDate" className="form-label">
                      DEA Issue Date<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      id="DEA_IssueDate"
                      className="w-100 input ps-2 py-1"
                      placeholder="Select Issue Date"
                      {...register('DEA_IssueDate', {
                        required: 'DEA Issue Date is required',
                        validate: (value) =>
                          new Date(value) <= new Date() || 'Issue date cannot be in the future',
                      })}
                    />
                    {errors.DEA_IssueDate && <span className="text-danger">{errors.DEA_IssueDate.message}</span>}
                  </Form.Group>
                </div>
              </div>
            </div>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="CLIA" className="form-label">
                CLIA # (Clinical Laboratory Improvement Amendments)<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                id="CLIA"
                className="w-100 input ps-2 py-1"
                placeholder="Enter CLIA #"
                {...register('CLIA', {
                  required: 'CLIA is required',
                  pattern: {
                    value: /^[A-Za-z0-9]{10,15}$/, // Example: CLIA # format (10-15 alphanumeric chars)
                    message: 'CLIA # must be between 10 and 15 alphanumeric characters',
                  },
                })}
              />
              {errors.CLIA && <span className="text-danger">{errors.CLIA.message}</span>}
            </Form.Group>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-2">
            <Button className="" variant="secondary">
              Cancel
            </Button>
            {/* <Button className="" type="submit">
              Save
            </Button> */}
            <Button variant="primary" type='submit' className='custom-buttons' disabled={store?.createtDoctorsDetailReducer?.loading} >
              {store?.createtDoctorsDetailReducer?.loading ?
                <Spinner color='white' className='spinner-border-sm' />
                :
                'Save'
              }
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default DepartmentDetails;
