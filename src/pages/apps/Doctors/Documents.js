import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { Button, ButtonGroup } from "react-bootstrap";
import { FiUploadCloud } from "react-icons/fi";

const Documents = () => {
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
          <p className="fw-bold">Licensing Information*</p>
          <div className="col-6">
            <form>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  State License #
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
                </div>
                <div className="col-6">
                  <div className="mb-3" style={{ position: "relative" }}>
                    <label htmlFor="Phone" className="form-label">
                      Upload Document
                    </label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="w-100 input ps-2 py-1"
                        placeholder="Upload Document"
                        style={{
                          border: "1px solid #444141",
                          fontSize: "14px",
                          color: "#444141",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          paddingRight: "35px", // Add padding to avoid text overlapping the icon
                        }}
                      />
                      <FiUploadCloud
                        style={{
                          position: "absolute",
                          right: "10px", // Adjust position
                          color: "#444141",
                          fontSize: "20px",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                </div>
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
        <div className="row mt-3" >
          <p className="fw-bold">Licensing Information*</p>
          <div className="col-6">
            <form>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  State License #
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
                </div>
                <div className="col-6">
                  <div className="mb-3" style={{ position: "relative" }}>
                    <label htmlFor="Phone" className="form-label">
                      Upload Document
                    </label>
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="w-100 input ps-2 py-1"
                        placeholder="Upload Document"
                        style={{
                          border: "1px solid #444141",
                          fontSize: "14px",
                          color: "#444141",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          paddingRight: "35px", // Add padding to avoid text overlapping the icon
                        }}
                      />
                      <FiUploadCloud
                        style={{
                          position: "absolute",
                          right: "10px", // Adjust position
                          color: "#444141",
                          fontSize: "20px",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                </div>
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

export default Documents;
