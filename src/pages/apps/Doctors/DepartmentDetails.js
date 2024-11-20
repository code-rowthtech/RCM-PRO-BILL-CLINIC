import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { Button, ButtonGroup } from "react-bootstrap";

const DepartmentDetails = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const navigate = useNavigate();
  const handleNewDoctor = () => {
    navigate("/doctor");
  };
  return (
    <>
      <div className="container-fluid">
        <div className="row mt-3" style={{ borderBottom: '1px solid #444141' }}>
          <p className="fw-bold">Identification & Credentials *</p>
          <div className="col-6">
            <form>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  TIN/SSN*
                </label>
                <input
                  type="text"
                  className="w-100 input ps-2 py-1"
                  placeholder=""
                />
              </div>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  NPI Username*
                </label>
                <input
                  type="text"
                  className="w-100 input ps-2 py-1"
                  placeholder=""
                />
              </div>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  CAQH ID*
                </label>
                <input
                  type="text"
                  className="w-100 input ps-2 py-1"
                  placeholder=""
                />
              </div>

            </form>
          </div>
          <div className="col-6">
            <form>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  NPI (National Provider Identifier)*
                </label>
                <input
                  type="text"
                  className="w-100 input ps-2 py-1"
                  placeholder=""
                />
              </div>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  NPI Password*
                </label>
                <input
                  type="text"
                  className="w-100 input ps-2 py-1"
                  placeholder=""
                />
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      CAQH Username*
                    </label>
                    <input
                      type="text"
                      className="w-100 input ps-2 py-1"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      CAQH Password:*
                    </label>
                    <input
                      type="text"
                      className="w-100 input ps-2 py-1"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="row mt-3" style={{ borderBottom: '1px solid #444141' }}>
          <p className="fw-bold">Medicare & Medicaid Information*</p>
          <div className="col-6">
            <form>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  Medicare PTAN*
                </label>
                <input
                  type="text"
                  className="w-100 input ps-2 py-1"
                  placeholder=""
                />
              </div>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  Medicare SPOT Logins*
                </label>
                <input
                  type="text"
                  className="w-100 input ps-2 py-1"
                  placeholder=""
                />
              </div>
            </form>
          </div>
          <div className="col-6">
            <form>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  Medicaid ID*
                </label>
                <input
                  type="text"
                  className="w-100 input ps-2 py-1"
                  placeholder=""
                />
              </div>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  Medicare PECOS Login*
                </label>
                <input
                  type="text"
                  className="w-100 input ps-2 py-1"
                  placeholder=""
                />
              </div>
            </form>
          </div>
        </div>
        <div className="row mt-3" style={{ borderBottom: '1px solid #444141' }}>
          <p className="fw-bold">Licensing Information*</p>
          <div className="col-6">
            <form>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  State License*
                </label>
                <input
                  type="text"
                  className="w-100 input ps-2 py-1"
                  placeholder=""
                />
              </div>
              <div className="mb-3">
                <label htmlFor="stateLicense" className="form-label">
                  State License Obtained (state)*
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
                    Select State
                  </option>
                  <option value="California">California</option>
                  <option value="Texas">Texas</option>
                  <option value="New York">New York</option>
                  <option value="Florida">Florida</option>
                  <option value="Illinois">Illinois</option>
                  {/* Add more options as needed */}
                </select>
              </div>
            </form>
          </div>
          <div className="col-6">
            <form>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  State License Provider (licensing authority name)
                </label>
                <input
                  type="text"
                  className="w-100 input ps-2 py-1"
                  placeholder=""
                />
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      State License Issue Date*
                    </label>
                    <input
                      type="text"
                      className="w-100 input ps-2 py-1"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      License Expiration Date*
                    </label>
                    <input
                      type="text"
                      className="w-100 input ps-2 py-1"
                      placeholder=""
                    />
                  </div>
                </div>

              </div>
            </form>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-6">
            <form>
             
              <div className="mb-3">
                <label htmlFor="stateLicense" className="form-label">
                  DEA # (Drug Enforcement Administration number)*
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
                  {/* Add more options as needed */}
                </select>
              </div>


            </form>
          </div>
          <div className="col-6">
            <form>

              <div className="row">
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    DEA Issue Date*
                  </label>
                  <input
                    type="text"
                    className="w-100 input ps-2 py-1"
                    placeholder=""
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">
              CLIA # (Clinical Laboratory Improvement Amendments) *
            </label>
            <input
              type="text"
              className="w-100 input ps-2 py-1"
              placeholder=""
            />
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2 mt-2">
          <Button className="">
            Cancel
          </Button>
          <Button className="">
            Save
          </Button>
        </div>
      </div>
    </>
  );
};

export default DepartmentDetails;
