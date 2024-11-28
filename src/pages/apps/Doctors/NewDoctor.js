import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiDownloadCloud, FiUploadCloud } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { createDoctorAction, getDoctorsrolesAction } from '../../../redux/actions';
import EmailToDoctorModal from './EmailToDoctorModal';
import DepartmentDetails from './DepartmentDetails';
import Documents from './Documents';
import { handleUpload } from '../../../helpers/HandleUpload';
import { encryptMessage } from '../../../cryptoUtils';


const NewDoctor = () => {
    const [activeTab, setActiveTab] = useState("personalDetails");
    const [show, setShow] = useState(false);
    const logoFileInputRef = useRef(null);
    const [logo, setLogo] = useState(null);
    const [logoName, setLogoName] = useState('');
    const [docId, setDocId] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();

    useEffect(() => {
        dispatch(
            getDoctorsrolesAction({ search: 'Doctor' })
        );
    }, [dispatch]);

    const store = useSelector((state) => state);
    // const response = store?.getDoctorsRolesReducer?.data?.result?._id
    const createResponse = store?.createtDoctorsReducer?.data?.status
    // console.log(store?.createtDoctorsReducer?.data, '12345678')
    const newDoctorId = store?.createtDoctorsReducer?.data?.response?._id
    const doctorRoleId = store?.getDoctorsRolesReducer?.data?.result?.[0]?._id;
    console.log(doctorRoleId, 'newDoctorId')
    // const doctorRoleId=doctorRole&&doctorRole.find((data=>data?.name==='doctor')?._id)
    // console.log(doctorRoleId, 'id')
    useEffect(() => {
        if (createResponse === 200) {
            setDocId(newDoctorId)
        }
    }, [createResponse])
    const closeModal = () => {
        setShow(false);
    };

    const handleNewDoctor = () => {
        navigate('/apps/doctors/list');
    };

    // const handleFileChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         setLogoName(file.name);
    //         // You can upload the file or store it in the form state here if required.
    //     }
    // };
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile);
            setLogo(url);
            setLogoName(selectedFile?.name)
        } catch (error) {
            console.error('Error during file upload:', error);
        }
    };
    console.log(logo)

    const submitData = (data) => {
        const payload = {
            ...data,
            profileImage: logo?.url.split('?')[0], // Add uploaded logo to the payload
            role: doctorRoleId
        };
        dispatch(createDoctorAction({ key: encryptMessage(payload) })); // Dispatch with payload

    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div className='pt-1 pb-2'>
                <div className="container-fluid mt-4">
                    <Card className='px-3 py-2'>
                        <div className="row">
                            <div className="col-12 d-flex justify-content-between align-items-center">
                                <p className="fw-bold" style={{ fontWeight: '600' }}>
                                    NEW DOCTOR
                                </p>
                                <div className='d-flex gap-2'>
                                    <Button onClick={() => setShow(true)}>Email to Doctor</Button>
                                    <Button onClick={handleNewDoctor}>Back</Button>
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
                                <Form onSubmit={handleSubmit(submitData)}>
                                    <div className="col-12 mt-3">
                                        <div className="row" style={{ borderBottom: '1px solid #444141' }}>
                                            <div className="col-6">
                                                <Form.Group className="mb-3">
                                                    <Form.Label>First Name<span className='text-danger'>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        {...register('firstName', { required: 'First name is required' })}
                                                        placeholder="Enter first name"
                                                    />
                                                    {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Email<span className='text-danger'>*</span></Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        {...register('email', { required: 'Email is required' })}
                                                        placeholder="Enter email"
                                                    />
                                                    {errors.email && <span className="text-danger">{errors.email.message}</span>}
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Phone<span className='text-danger'>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        {...register('phone', { required: 'Phone is required' })}
                                                        placeholder="Enter phone number"
                                                    />
                                                    {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
                                                </Form.Group>

                                                <div className="mb-3 d-flex flex-column position-relative">
                                                    <Form.Label>Profile Image<span className='text-danger'>*</span></Form.Label>
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
                                                            // required: 'Profile image is required',
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
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Last Name<span className='text-danger'>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        {...register('lastName', { required: 'Last name is required' })}
                                                        placeholder="Enter last name"
                                                    />
                                                    {errors.lastName && <span className="text-danger">{errors.lastName.message}</span>}
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Date of Birth<span className='text-danger'>*</span></Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        {...register('dateOfBirth', { required: 'Date of birth is required' })}
                                                    />
                                                    {errors.dateOfBirth && <span className="text-danger">{errors.dateOfBirth.message}</span>}
                                                </Form.Group>
                                                <Form.Group className='mb-3'>
                                                    <Form.Label>Gender<span className='text-danger'>*</span></Form.Label>
                                                    <div className="d-flex gap-2 mt-1">
                                                        <Form.Check
                                                            type="radio"
                                                            label="Male"
                                                            value="Male"
                                                            {...register('gender', { required: 'Gender is required' })}
                                                        />
                                                        <Form.Check
                                                            type="radio"
                                                            label="Female"
                                                            value="Female"
                                                            {...register('gender')}
                                                        />
                                                        <Form.Check
                                                            type="radio"
                                                            label="Transgender"
                                                            value="Transgender"
                                                            {...register('gender')}
                                                        />
                                                    </div>
                                                    {errors.gender && <span className="text-danger">{errors.gender.message}</span>}
                                                </Form.Group>

                                                <div className='row '>
                                                    <div className='col-6 '>
                                                        <Form.Group className="mb-3 mt-2 ">
                                                            <Form.Label>Password<span className='text-danger'>*</span></Form.Label>
                                                            <Form.Control
                                                                type="password"
                                                                {...register('password', { required: 'Password is required' })}
                                                                placeholder="Enter password"
                                                            />
                                                            {errors.password && <span className="text-danger">{errors.password.message}</span>}
                                                        </Form.Group>
                                                    </div>
                                                    <div className='col-6'>
                                                        <Form.Group className="mb-3 mt-2 ">
                                                            <Form.Label>Confirm Password<span className='text-danger'>*</span></Form.Label>
                                                            <Form.Control
                                                                type="password"
                                                                {...register('confirmPassword', {
                                                                    required: 'Please confirm your password',
                                                                    validate: (value) => value === watch('password') || 'Passwords do not match',
                                                                })}
                                                                placeholder="Confirm password"
                                                            />
                                                            {errors.confirmPassword && (
                                                                <span className="text-danger">{errors.confirmPassword.message}</span>
                                                            )}
                                                        </Form.Group>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className='row mt-2'>
                                            <div className='col-6'>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Address 1<span className='text-danger'>*</span></Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        {...register('address1', { required: 'Address 1 is required' })}
                                                        placeholder="Enter address line 1"
                                                    />
                                                    {errors.address1 && <span className="text-danger">{errors.address1.message}</span>}
                                                </Form.Group>
                                                <div className='row'>
                                                    <div className='col-6'>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>City<span className='text-danger'>*</span></Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                {...register('city', { required: 'City is required' })}
                                                                placeholder="Enter city"
                                                            />
                                                            {errors.city && <span className="text-danger">{errors.city.message}</span>}
                                                        </Form.Group>
                                                    </div>
                                                    <div className='col-6'>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Zip Code<span className='text-danger'>*</span></Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                {...register('zip', { required: 'Zip code is required' })}
                                                                placeholder="Enter zip code"
                                                            />
                                                            {errors.zip && <span className="text-danger">{errors.zip.message}</span>}
                                                        </Form.Group>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-6'>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Address 2</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        {...register('address2')}
                                                        placeholder="Enter address line 2"
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                                        <Button variant="secondary">Cancel</Button>
                                        <Button variant="primary" type='submit' className='custom-buttons' disabled={store?.createtDoctorsDetailReducer?.loading} >
                                            {store?.createtDoctorsDetailReducer?.loading ?
                                                <Spinner color='white' className='spinner-border-sm' />
                                                :
                                                'Save'
                                            }
                                        </Button>
                                    </div>
                                </Form>
                            )}
                            {activeTab === "departmentDetails" && <DepartmentDetails docId={docId} />}
                            {activeTab === "documents" && <Documents />}
                        </div>
                    </Card>
                </div>
                <EmailToDoctorModal closeModal={closeModal} show={show} />
            </div>
        </>
    );
};

export default NewDoctor;
