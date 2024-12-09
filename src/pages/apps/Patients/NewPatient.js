import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import ProfileDummy from "../../../assets/images/profileDummy.png";
import { Button, Card, Col, Form, Modal, Row, InputGroup } from "react-bootstrap";
import { FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { createPatientsAction, updatePatientsAction } from "../../../redux/patients/actions";
import { useForm } from "react-hook-form";
import us from '../../../assets/images/flags/us.jpg';
import { encryptMessage } from "../../../cryptoUtils";
import { handleUpload } from '../../../helpers/HandleUpload';


const NewPatient = () => {
    const store = useSelector((state) => state);
    const doctorRoleId = store?.getDoctorsRolesReducer?.data?.result?.[0]?._id;
    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [smShow, setSmShow] = useState(false);
    const [password, setPassword] = useState("");
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [formData, setFormData] = useState({
        role: doctorRoleId,
    });
    const logoFileInputRef = useRef(null);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);




    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === "1234") {
            setIsPasswordCorrect(true);
            setSmShow(false);
            setIsVisible(true);

            const id = setTimeout(() => {
                setIsPasswordCorrect(false);
                setIsVisible(false);
            }, 300000);

            setTimeoutId(id);
        }
    };
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setLogo(url);
            setLogoName(selectedFile?.name)
        } catch (error) {
            // console.error('Error during file upload:', error);
        }
    };

 
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId

    const onSubmit = (data) => {
        const payload = {
            clinicId: clinicId,
            profile: {
                url: logo?.url?.split('?')[0],
                fileName: logoName
            },
            gender: data?.gender,
            title: data?.title,
            fullName: data?.fullName,
            chartNumber: data?.chartNumber,
            responsiblePartyName: data?.responsiblePartyName,
            address: {
                // street: data?.street,
                city: data?.city,
                state: data?.state,
                zipCode: data?.zipCode,
            },
            email: data?.email,
            contactNumber: data?.contactNumber,
            note: data?.note,
            maritalStatus: data?.maritalStatus,
            dateOfBirth: data?.dateOfBirth,
            deceased: data?.deceased,
            ssn: data?.ssn,
            additionalMRN: data?.additionalMRN,
            financialClass: data?.financialClass,
            providerProfile: data?.providerProfile,
            employer: data?.employer,
            relationship: data?.relationship,
            preferredLanguage: data?.preferredLanguage,
            pcp: data?.pcp,
            raceEthnicity: data?.raceEthnicity,

        }
        console.log({ payload });
        reset();
        dispatch(createPatientsAction({ key: encryptMessage(payload) }))
    };

    return (
        <div className="background_Color pt-1 pb-2">
            <div className="container-fluid mt-4">
                <Card className="px-3 py-2">
                    <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: 600 }}>NEW PATIENT</p>
                        <div>
                            <Button className="me-3" onClick={() => setSmShow(true)}>
                                View Info
                            </Button>
                            <Button onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </div>

                    <div className="px-2">
                        {/* Navigation Tabs */}
                        <ul className="nav nav-underline">
                            <li className="nav-item">
                                <a className="nav-link active fw-medium" href="#">
                                    Personal Details
                                </a>
                            </li>
                        </ul>

                        {/* Form Section */}
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row pb-3 mt-3" style={{ borderBottom: "1px solid #444141" }}>
                                <div className="col-6">
                                    <div className="mb-3 d-flex flex-column position-relative">
                                        <Form.Label>Profile Image{!id && <span className='text-danger'>*</span>}</Form.Label>
                                        <div
                                            onClick={() => logoFileInputRef.current.click()}
                                            className={`custom-file-upload justify-content-between cursor-pointer ${logoName ? '' : 'custom-form-fields'}`}
                                        >
                                            {logoName ? logoName : 'Upload Profile Image'}
                                            <p className="mb-0">
                                                <FiUploadCloud />
                                            </p>
                                        </div>
                                        <Form.Control
                                            type="file"
                                            className="d-none "
                                            {...register('profileImage', {
                                            })}
                                            ref={logoFileInputRef}
                                            onChange={handleFileChange}
                                       
                                        />
                                        {errors.profileImage && (
                                            <p className="text-danger">{errors.profileImage.message}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div>
                                        <Form.Label htmlFor="gender">Gender*</Form.Label>
                                        <div className="d-flex gap-2">
                                            <Form.Check
                                                type="radio"
                                                label="Male"
                                                value="Male"
                                                {...register('gender', { required: "Gender is required" })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Female"
                                                value="Female"
                                                {...register('gender', { required: "Gender is required" })}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Others"
                                                value="Others"
                                                {...register('gender', { required: "Gender is required" })}
                                            />

                                        </div>
                                        {errors.gender && <span className="text-danger">{errors.gender.message}</span>}

                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="mt-3">
                                        <Form.Label htmlFor="title">Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Title"
                                            {...register('title')}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="row pb-3 mt-3" style={{ borderBottom: "1px solid #444141" }}>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="fileName">Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Full Name"
                                        {...register('fullName', { required: "Full name is required" })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="chartNumber">Chart Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Chart Number"
                                        {...register('chartNumber', { required: "Chart number is required" })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="responsibleParty">Responsible Party Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Responsible party name"
                                        {...register('responsiblePartyName', { required: "Responsible party name is required" })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="address">Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Address"
                                        {...register('address', { required: "Address is required" })}
                                    />
                                </div>
                                <div className="col-6 ">
                                    <Form.Label htmlFor="state">State</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="State"
                                        {...register('state', { required: "State is required" })}
                                    />
                                </div>
                                <div className="col-6 ">
                                    <div className="row">
                                        <div className="col-6">
                                            <Form.Label htmlFor="city">City</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="City"
                                                {...register('city', { required: "City is required" })}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <Form.Label htmlFor="zipCode">Zip Code</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Zip Code"
                                                {...register('zipCode', { required: "Zip code is required" })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Email and Phone Section */}
                            <div className="row pb-3 mt-3" style={{ borderBottom: "1px solid #444141" }}>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="email">Email ID</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Email ID"
                                        {...register('email', { required: "Email is required", pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: "Invalid email address" } })}
                                    />
                                </div>
                                <div className='mb-3 col-6'>
                                    <Form.Group className="mb-0 position-relative">
                                        <Form.Label className='mb-1'>Phone{!id && <span className='text-danger'>*</span>}</Form.Label>
                                        <Form.Group>
                                            <InputGroup>
                                                <InputGroup.Text className='ps-3 pe-1 fw-bold text-black'>&nbsp;&nbsp;+1</InputGroup.Text>
                                                <Form.Control
                                                    type="tel"
                                                    {...register('contactNumber', !id ? {
                                                        required: 'This field is required',
                                                        pattern: {
                                                            value: /^[0-9]*$/,
                                                            message: 'Contact must be a number'
                                                        },
                                                        maxLength: {
                                                            value: 10,
                                                            message: 'Contact must not exceed 10 digits'
                                                        },
                                                        minLength: {
                                                            value: 10,
                                                            message: 'Contact must not be less than 10 digits'
                                                        }
                                                    } : {}
                                                    )}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}                                                                                // value={formData.phone}
                                                    placeholder="1234-234-234"
                                                    maxLength={10}
                                                // onKeyPress={(event) => handleFirstSpace(event, 0)}
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
                                <div className="col-12 ">
                                    <Form.Label htmlFor="note">Note (Text)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Note"
                                        {...register('note')}
                                    />
                                </div>
                            </div>
                            <div className="row pb-3 mt-3" style={{ borderBottom: "1px solid #444141" }}>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="marital">Marital status</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Marital statu"
                                        {...register('maritalStatus', { required: "Marital is required" })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="DOB">Date of Birth</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Date of Birth"
                                        {...register('dateOfBirth', { required: "Date of Birth is required" })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="deceased">Deceased</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Deceased"
                                        {...register('deceased', { required: "Deceased is required" })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="SSN">SSN#</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="SSN#"
                                        {...register('ssn', { required: "SSN# is required" })}
                                    />
                                </div>
                                <div className="col-6 ">
                                    <Form.Label htmlFor="additional">Additional MRN</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Additional MRN"
                                        {...register('additionalMRN', { required: "Additional MRN is required" })}
                                    />
                                </div>
                            </div>
                            <div className="row pb-3 mt-3" >
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="financial">Financial Class</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Financial Class"
                                        {...register('financialClass', { required: "Financial Class is required" })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="provider">Provider Profile</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Provider Profile"
                                        {...register('providerProfile', { required: "Provider Profile is required" })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="employer">Employer</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Employer"
                                        {...register('employer', { required: "Employer is required" })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="relationship">Relationship</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Relationship"
                                        {...register('relationship', { required: "Relationship is required" })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="preferred">Preferred Language</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Preferred Language"
                                        {...register('preferredLanguage', { required: "Preferred Language is required" })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <Form.Label htmlFor="PCP">PCP</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="PCP"
                                        {...register('pcp', { required: "PCP is required" })}
                                    />
                                </div>
                                <div className="col-12">
                                    <Form.Label htmlFor="race">Race & Ethnicity</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Race & Ethnicity"
                                        {...register('raceEthnicity', { required: "Race & Ethnicity is required" })}
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="d-flex gap-2 justify-content-end mb-2">
                                <Button variant="secondary">Cancel</Button>
                                <Button variant="primary" type="submit">Save</Button>
                            </div>
                        </Form>
                    </div>
                </Card>
            </div>

            {/* Password Modal */}
            <Modal
                size="sm"
                show={smShow}
                centered
                onHide={() => setSmShow(false)}
                aria-labelledby="password-modal"
            >
                <Modal.Body className="rounded-4 p-4">
                    <Form onSubmit={handlePasswordSubmit}>
                        <Form.Group controlId="password" className="text-center my-2">
                            <Form.Label className="mb-2">View Details</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Row className="mt-2">
                            <Col sm={12} className="text-center">
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                                <p className="fw-bold mt-2">Show the number for 5 min only</p>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default NewPatient;
