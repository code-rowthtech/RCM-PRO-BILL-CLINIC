import React, { useEffect, useRef, useState } from "react";
import { Form, useNavigate, useSearchParams } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { Button, ButtonGroup } from "react-bootstrap";
import { FiUploadCloud } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createDoctorDetailAction, getStatesByCountryAction } from "../../../redux/actions";
import { handleUpload } from "../../../helpers/HandleUpload";
import { encryptMessage } from "../../../cryptoUtils";

const Documents = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch, getValues,
    setValue,
    clearErrors,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const states = store?.getStatesReducer?.data?.states;
  const licenseFileInputRef = useRef(null);
  const [license, setLicense] = useState(null);
  const [licenseName, setLicenseName] = useState('');
  const [licenseUploading, setLicenseUploading] = useState(false);

  useEffect(() => {
    dispatch(getStatesByCountryAction())
  }, [dispatch])



  const handleNewDoctor = () => {
    navigate("/doctor");
  };
  const [searchParams] = useSearchParams();
  const updateId = searchParams.get('id');
  const onSubmit = (data) => {
    const payload = {
      LicensingInformation: [{
        stateLicense: data?.stateLicense,
        stateLicenseProvider: data?.licenseProvider,
        stateLicenseObtained: data?.licensingState,
        uploadedDocument: {
          url: license?.url?.split('?')[0] || license,
          fileName: licenseName,
        },
        stateLicenseIssueDate: data?.issueDate,
        licenseExpirationDate: data?.expiryDate,
      }],
    }
    console.log(payload);
    dispatch(createDoctorDetailAction({ key: encryptMessage(payload) }));
    // Proceed with form submission logic
  };
  const handleFileChangeDegree = async (e) => {
    const selectedFile = e.target.files[0];
    try {
      const url = await handleUpload(selectedFile, setLicenseUploading);
      setLicense(url);
      setLicenseName(selectedFile?.name)
    } catch (error) {
      // console.error('Error during file upload:', error);
    }
  };
  return (
    <>
      <div className="container-fluid">
        <div className="row mt-1" >
          <p className="fw-bold mb-1">Licensing Information<span className='text-danger'>*</span></p>
          <div className="col-12">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-6 col-12">
                  <div className="mb-1">
                    <label htmlFor="firstName" className="form-label mb-0">
                      State License #
                    </label>
                    <input
                      type="text"
                      {...register('stateLicense')}
                      className="w-100 input ps-2 py-1"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-md-6 col-12">
                  <div className="mb-1">
                    <label htmlFor="firstName" className="form-label mb-0">
                      State License Provider (licensing authority name)
                    </label>
                    <input
                      {...register('licenseProvider')}
                      type="text"
                      className="w-100 input ps-2 py-1"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="row">
                    <div className="col-6">
                      <div className="mb-1">
                        <label htmlFor="firstName" className="form-label mb-0">
                          State License Issue Date<span className='text-danger'>*</span>
                        </label>
                        <input
                          type="date"
                          {...register('issueDate')}
                          className="w-100 input ps-2 py-1"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="mb-1">
                        <label htmlFor="firstName" className="form-label mb-0">
                          License Expiration Date<span className='text-danger'>*</span>
                        </label>
                        <input
                          type="date"
                          {...register('expiryDate')}
                          className="w-100 input ps-2 py-1"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="row">
                    <div className="col-6">
                      <div className="mb-1">
                        <label htmlFor="stateLicense" className="form-label mb-0">
                          State License Obtained (state)<span className='text-danger'>*</span>
                        </label>
                        <select
                          id="stateLicense"
                          className="w-100 input ps-2 py-1"
                          {...register('licensingState')}
                          style={{
                            border: "1px solid #444141",
                            fontSize: "14px",
                            color: "#444141",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                          }}
                        >
                          <option value="" >
                            Select State
                          </option>
                          {states?.map((data) => (
                            <option value={data?.name} className="text-capitalize">{data?.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="mb-1 d-flex flex-column position-relative">
                        <label className="mb-0">Upload Document</label>
                        <div
                          onClick={() => licenseFileInputRef.current.click()}
                          className={`custom-file-upload justify-content-between cursor-pointer ${licenseName || licenseUploading ? '' : 'custom-form-fields'}`}
                        >
                          {licenseName ? licenseName : licenseUploading ? 'Uploading...' : 'Upload Degree'}
                          <p className="mb-0">
                            <FiUploadCloud />
                          </p>
                        </div>
                        <input
                          type="file"
                          className="d-none "
                          {...register('stateDoc', {
                          })}
                          ref={licenseFileInputRef}
                          onChange={handleFileChangeDegree}
                        />
                        {errors.stateDoc && (
                          <p className="text-danger">{errors.stateDoc.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-1">
                <Button variant="secondary" className="">
                  Cancel
                </Button>
                <Button type="submit" className="">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </>
  );
};

export default Documents;
