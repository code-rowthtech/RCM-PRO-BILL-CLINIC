import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiEdit } from 'react-icons/bi';
import ProfileDummy from "../../../assets/images/profileDummy.png";
import DepartmentDetails from './DepartmentDetails';
import Documents from './Documents';
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { IoMdClose } from 'react-icons/io';
import { FiUploadCloud } from "react-icons/fi";

const NewDoctor = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("personalDetails");
    const [show, setShow] = useState(false);

    const closeModal = () => {
        setShow(false);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const navigate = useNavigate();

    const handleNewDoctor = () => {
        navigate('/apps/doctors/list');
    };

    const onSubmit = (data) => {
        console.log('Form Submitted:', data);
        reset(); // Optional: Reset the form after submission for UI demo purposes
    };


    return (
        <>
            <div className='pt-1 pb-2' >
                <div className="container-fluid mt-4">
                    <Card className='px-3 py-2'>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-between align-itmes-center">
                                <p className="fw-bold" style={{ fontWeight: '600' }}>
                                    NEW DOCTOR
                                </p>
                                <div className='d-flex gap-2'>
                                    <Button className="custom-buttons "
                                        onClick={() => setShow(true)}
                                    >
                                        Email to Doctor
                                    </Button>
                                    <Button
                                        className=""
                                        onClick={handleNewDoctor}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <ul className="nav nav-underline">
                                    <li className="nav-item">
                                        <button
                                            className={`text-black nav-link ${activeTab === "personalDetails" ? "active" : ""}`}
                                            onClick={() => handleTabChange("personalDetails")}
                                        >
                                            Personal Details
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`text-black nav-link ${activeTab === "departmentDetails" ? "active" : ""}`}
                                            onClick={() => handleTabChange("departmentDetails")}
                                        >
                                            Professional Information
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`text-black nav-link ${activeTab === "documents" ? "active" : ""}`}
                                            onClick={() => handleTabChange("documents")}
                                        >
                                            Documents
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            {activeTab === "personalDetails" && (
                                <>
                                    <div className="col-12 mt-3" style={{ borderBottom: '1px solid #444141' }}>
                                        <div className="row">
                                            <div className="col-6">
                                                <form>
                                                    <div className="mb-3">
                                                        <label htmlFor="firstName" className="form-label">
                                                            First Name*
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-100 input ps-2 py-1"
                                                            placeholder="Enter first name"
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label htmlFor="Email" className="form-label">
                                                            Email*
                                                        </label>
                                                        <input
                                                            type="email"
                                                            className="w-100 input ps-2 py-1"
                                                            id="emailName"
                                                            placeholder="Enter Email"
                                                            aria-describedby="emailHelp"
                                                            style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141', paddingTop: "10px", paddingBottom: "10px" }}
                                                        />
                                                    </div>
                                                    <div className="mb-3">
                                                        <label htmlFor="Phone" className="form-label">
                                                            Phone*
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-100 input ps-2 py-1"
                                                            id="phone"
                                                            placeholder="Enter Phone number"
                                                            aria-describedby="phoneNumberHelp"
                                                            style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141', paddingTop: "10px", paddingBottom: "10px" }}
                                                        />
                                                    </div>
                                                    <div className="mb-3" style={{ position: "relative" }}>
                                                        <label htmlFor="Phone" className="form-label">
                                                            Profile image*
                                                        </label>
                                                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                                            <input
                                                                type="text"
                                                                className="w-100 input ps-2 py-1"
                                                                placeholder="Upload Image"
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
                                                    <div className="mb-3" style={{ position: "relative" }}>
                                                        <label htmlFor="Phone" className="form-label">
                                                            Degree
                                                        </label>
                                                        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                                            <input
                                                                type="text"
                                                                className="w-100 input ps-2 py-1"
                                                                placeholder="Upload Image"
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
                                                </form>
                                            </div>

                                            <div className="col-6">
                                                <form>
                                                    <div className="mb-3">
                                                        <label htmlFor="LastName" className="form-label">
                                                            Last Name*
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-100 input ps-2 py-1"
                                                            id="lastName"
                                                            placeholder="Enter Last name"
                                                            aria-describedby="lastNameHelp"
                                                            style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141' }}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label htmlFor="date of birth" className="form-label">
                                                            Date of Birth*
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-100 input ps-2 py-1"
                                                            id="dateofbirth"
                                                            placeholder="Enter Date of birth"
                                                            aria-describedby="lastNameHelp"
                                                            style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141', paddingTop: "10px", paddingBottom: "10px" }}
                                                        />
                                                    </div>

                                                    <div className='row mb-3'>
                                                        <div className=''>
                                                            <p>Gender*</p>
                                                            <div className='d-flex gap-2'>
                                                                <div class="form-check ">
                                                                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                                                    <label class="form-check-label" for="flexRadioDefault1">
                                                                        Male
                                                                    </label>
                                                                </div>
                                                                <div class="form-check ">
                                                                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                                                    <label class="form-check-label" for="flexRadioDefault1">
                                                                        Female
                                                                    </label>
                                                                </div>
                                                                <div class="form-check ">
                                                                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                                                    <label class="form-check-label" for="flexRadioDefault1">
                                                                        Transgender
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="row ">
                                                        <div className="col-6 mt-1">
                                                            <div className="mb-2 ">
                                                                <label htmlFor="Password" className="form-label">
                                                                    Password*
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="w-100 input ps-2 py-1"
                                                                    id="Password"
                                                                    placeholder="Password"
                                                                    aria-describedby="lastNameHelp"
                                                                    style={{
                                                                        border: '1px solid #444141',
                                                                        fontSize: '14px',
                                                                        color: '#444141',
                                                                        paddingTop: "10px", paddingBottom: "10px"
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-6 mt-1">
                                                            <div className="mb-3">
                                                                <label htmlFor="Confirm Password" className="form-label">
                                                                    Confirm Password*
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="w-100 input ps-2 py-1"
                                                                    id="confirmPassword"
                                                                    placeholder="Confirm Password"
                                                                    aria-describedby="lastNameHelp"
                                                                    style={{
                                                                        border: '1px solid #444141',
                                                                        fontSize: '14px',
                                                                        color: '#444141',
                                                                        paddingTop: "10px", paddingBottom: "10px"
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                </form>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 mt-3" >
                                        <p>Address Details*</p>
                                        <div className="row">
                                            <div className="col-6">
                                                <form>
                                                    <div className="mb-3">
                                                        <label htmlFor="firstName" className="form-label">
                                                            Address 1
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-100 input ps-2 py-1"
                                                            id="Address 1"
                                                            placeholder="Address 1 "
                                                            aria-describedby="Address 1Help"
                                                            style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141' }}
                                                        />
                                                    </div>
                                                </form>
                                                <div className="row mb-3">
                                                    <div className="col-6">
                                                        <form>
                                                            <div className="mb-3">
                                                                <label htmlFor="city" className="form-label">
                                                                    City*
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="w-100 input ps-2 py-1"
                                                                    id="city"
                                                                    placeholder="City "
                                                                    aria-describedby="cityHelp"
                                                                    style={{
                                                                        border: '1px solid #444141',
                                                                        fontSize: '14px',
                                                                        color: '#444141',
                                                                    }}
                                                                />
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="col-6">
                                                        <form>
                                                            <div className="mb-3">
                                                                <label htmlFor="Zip" className="form-label">
                                                                    Zip*
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="w-100 input ps-2 py-1"
                                                                    id="Zip"
                                                                    placeholder="Zip "
                                                                    aria-describedby="ZipHelp"
                                                                    style={{
                                                                        border: '1px solid #444141',
                                                                        fontSize: '14px',
                                                                        color: '#444141',
                                                                    }}
                                                                />
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="mb-3">
                                                    <label htmlFor="Address 2" className="form-label">
                                                        Address 2*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-100 input ps-2 py-1"
                                                        id="Address 2"
                                                        placeholder="Address 2 "
                                                        aria-describedby="Address 2Help"
                                                        style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='col-12'>
                                        <div className='d-flex justify-content-end gap-2'>
                                            <Button className=''>Cancel</Button>
                                            <Button className=''>Save</Button>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeTab === 'departmentDetails' ?
                                <DepartmentDetails />
                                :
                                activeTab === "documents" ?
                                    <Documents />
                                    : ''
                            }
                        </div>
                    </Card>
                </div>
            </div>

            <Modal centered show={show} onHide={closeModal}>
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">Email to Doctor</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} />
                        </Col>
                    </Row>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="my-2 mx-3">

                                    <Form.Control
                                        type="text"
                                        placeholder="Enter email address"
                                        {...register('name', { required: 'Name is required' })}
                                    />
                                    {errors.name && <span className="text-danger">{errors.name.message}</span>}
                                </Form.Group>

                                <div className='text-center'>
                                    <p className='mb-0'>The Doctor will receive an onboarding email on</p>
                                    <p > "xyz.com"</p>
                                </div>
                            </Col>

                        </Row>
                        <Modal.Footer className='d-flex justify-content-center'>
                            <Button type="submit" className="custom-buttons">
                                Send
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>


        </>
    );
};

export default NewDoctor;
