import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
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
console.log(id,'12345678998765432')
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
        <form onSubmit={handleSubmit(onsubmit)}>
          {docId}
          <div className="row mt-3" style={{ borderBottom: '1px solid #444141' }}>
            <p className="fw-bold">Identification & Credentials <span className='text-danger'>*</span></p>
            <div className="col-6">
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  TIN/SSN<span className='text-danger'>*</span>
                </label>
                <input
                  type="text"
                  className="w-100 input ps-2 py-1"
                  placeholder=""
                  {...register('TIN_SSN', { required: 'TIN/SSN is required' })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  NPI Username<span className='text-danger'>*</span>
                </label>
                <input
                  type="text"
                  className="w-100 input ps-2 py-1"
                  placeholder=""
                  {...register('NPIUsername', { required: 'TIN/SSN is required' })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  CAQH ID<span className='text-danger'>*</span>
                </label>
                <input
                  type="text"
                  className="w-100 input ps-2 py-1"
                  placeholder=""
                  {...register('CAQH_ID', { required: 'TIN/SSN is required' })}
                />
              </div>
            </div>
            <div className="col-6">
              <div>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    NPI (National Provider Identifier)<span className='text-danger'>*</span>
                  </label>
                  <input
                    type="text"
                    className="w-100 input ps-2 py-1"
                    placeholder=""
                    {...register('NPI', { required: 'TIN/SSN is required' })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    NPI Password<span className='text-danger'>*</span>
                  </label>
                  <input
                    type="text"
                    className="w-100 input ps-2 py-1"
                    placeholder=""
                    {...register('NPIPassword', { required: 'TIN/SSN is required' })}
                  />
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="mb-3">
                      <label htmlFor="firstName" className="form-label">
                        CAQH Username<span className='text-danger'>*</span>
                      </label>
                      <input
                        type="text"
                        className="w-100 input ps-2 py-1"
                        placeholder=""
                        {...register('CAQHUsername', { required: 'TIN/SSN is required' })}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mb-3">
                      <label htmlFor="firstName" className="form-label">
                        CAQH Password:<span className='text-danger'>*</span>
                      </label>
                      <input
                        type="text"
                        className="w-100 input ps-2 py-1"
                        placeholder=""
                        {...register('CAQHPassword', { required: 'TIN/SSN is required' })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3" style={{ borderBottom: '1px solid #444141' }}>
            <p className="fw-bold">Medicare & Medicaid Information<span className='text-danger'>*</span></p>
            <div className="col-6">
              <div>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    Medicare PTAN<span className='text-danger'>*</span>
                  </label>
                  <input
                    type="text"
                    className="w-100 input ps-2 py-1"
                    placeholder=""
                    {...register('medicarePTAN', { required: 'TIN/SSN is required' })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    Medicare SPOT Logins<span className='text-danger'>*</span>
                  </label>
                  <input
                    type="text"
                    className="w-100 input ps-2 py-1"
                    placeholder=""
                    {...register('Medicare_SPOT_Logins', { required: 'TIN/SSN is required' })}
                  />
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col-6">
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      Medicaid ID<span className='text-danger'>*</span>
                    </label>
                    <input
                      type="text"
                      className="w-100 input ps-2 py-1"
                      placeholder=""
                      {...register('medicaidID', { required: 'TIN/SSN is required' })}
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label htmlFor="stateLicense" className="form-label">
                      Department<span className='text-danger'>*</span>
                    </label>
                    <select
                      className="w-100 input ps-2 py-1"
                      style={{
                        border: "1px solid #444141",
                        fontSize: "14px",
                        color: "#444141",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                      }}
                      {...register('department')}
                    >
                      <option value="" disabled selected>
                        Select Department
                      </option>
                      {departmentId && departmentId.map((data) => (
                        <option key={data?._id} value={data?._id}>{data?.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  Medicare PECOS Login<span className='text-danger'>*</span>
                </label>
                <input
                  type="text"
                  className="w-100 input ps-2 py-1"
                  placeholder=""
                  {...register('Medicare_PECOS_Logins', { required: 'TIN/SSN is required' })}

                />
              </div>
            </div>
          </div>
          <div className="row mt-3" style={{ borderBottom: '1px solid #444141' }}>
            <p className="fw-bold">Licensing Information<span className='text-danger'>*</span></p>
            <div className="col-6">
              <div>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    State License<span className='text-danger'>*</span>
                  </label>
                  <input
                    type="text"
                    className="w-100 input ps-2 py-1"
                    placeholder=""
                    {...register('stateLicense', { required: 'TIN/SSN is required' })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    State License Obtained (state)<span className='text-danger'>*</span>
                  </label>
                  <input
                    type="text"
                    className="w-100 input ps-2 py-1"
                    placeholder=""
                    {...register('stateLicenseObtained', { required: 'State License Obtained is required' })}
                  />
                </div>

              </div>
            </div>
            <div className="col-6">
              <div>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    State License Provider (licensing authority name)<span className='text-danger'>*</span>
                  </label>
                  <input
                    type="text"
                    className="w-100 input ps-2 py-1"
                    placeholder=""
                    {...register('stateLicenseProvider', { required: 'TIN/SSN is required' })}
                  />
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="mb-3">
                      <label htmlFor="firstName" className="form-label">
                        State License Issue Date<span className='text-danger'>*</span>
                      </label>
                      <input
                        type="text"
                        className="w-100 input ps-2 py-1"
                        placeholder=""
                        {...register('stateLicenseIssueDate', { required: 'TIN/SSN is required' })}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mb-3">
                      <label htmlFor="firstName" className="form-label">
                        License Expiration Date<span className='text-danger'>*</span>
                      </label>
                      <input
                        type="text"
                        className="w-100 input ps-2 py-1"
                        placeholder=""
                        {...register('licenseExpirationDate', { required: 'TIN/SSN is required' })}
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-6">
              <div>

                {/* <div className="mb-3">
                  <label htmlFor="stateLicense" className="form-label">
                    DEA # (Drug Enforcement Administration number)<span className='text-danger'>*</span>
                  </label>
                  <select
                    id="stateLicense"
                    className="w-100 input ps-2 py-1"
                    style={{
                      border: "1px solid #444141",
                      fontSize: "14px",
                      color: "#444141",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                    }}
                  >
                    <option value="" disabled selected>
                      Select Number
                    </option>
                    <option value="California">Option-1</option>
                    <option value="Texas">Option-2</option>
                    <option value="New York">Option-3</option>
                  </select>
                </div> */}

                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    DEA # (Drug Enforcement Administration number)<span className='text-danger'>*</span>
                  </label>
                  <input
                    type="text"
                    className="w-100 input ps-2 py-1"
                    placeholder=""
                    {...register('DEA', { required: 'DEA is required' })}
                  />
                </div>
              </div>
            </div>
            <div className="col-6">
              <div>

                <div className="row">
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      DEA Issue Date<span className='text-danger'>*</span>
                    </label>
                    <input
                      type="text"
                      className="w-100 input ps-2 py-1"
                      placeholder=""
                      {...register('DEA_IssueDate', { required: 'TIN/SSN is required' })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                CLIA # (Clinical Laboratory Improvement Amendments)<span className='text-danger'>*</span>
              </label>
              <input
                type="text"
                className="w-100 input ps-2 py-1"
                placeholder=""
                {...register('CLIA', { required: 'CLIA is required' })}
              />
            </div>
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
        </form>
      </div>
    </>
  );
};

export default DepartmentDetails;
