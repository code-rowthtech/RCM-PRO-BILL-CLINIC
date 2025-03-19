import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, InputGroup, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiUploadCloud } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    getStatesByCountryAction,
    getCitiesAction,
    getCities2Action,
    getCities3Action,
    updatePatientsAction,
    getDoctorsAction,
} from '../../../../redux/actions';
import us from '../../../../assets/images/flags/us.jpg';
import { encryptMessage } from '../../../../cryptoUtils';
import Select from 'react-select';
import { handleUpload } from '../../../../helpers/HandleUpload';
import Spinner from '../../../../constants/Spinner';

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
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        clearErrors,
        watch,
        getValues,
    } = useForm();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [profileUploading, setProfileUploading] = useState(false);
    const [logoName, setLogoName] = useState('');
    const [doctorSearch, setDoctorSearch] = useState('');
    const logoFileInputRef = useRef(null);
    const [logo, setLogo] = useState(null);
    const [age, setAge] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const [status, setStatus] = useState(true);
    const [search, setSearch] = useState('');
    const patientDetails = store?.getPatientByIdReducer?.data?.data;
    console.log(patientDetails,'patientDetials')
    const doctorOptions = doctorDetails?.map((data) => ({
        value: data?._id,
        label: data?.name?.[0]?.text,
    }));
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

    useEffect(() => {
        const doctorPayload = { status: status, search: search };
        dispatch(getDoctorsAction(doctorPayload));
    }, [dispatch]);
  
    useEffect(() => {
        if (patientDetails && doctorDetails) {
            // Finding the selected doctor
            const doctor = doctorOptions?.find((data) => data?.value === patientDetails?.doctorId?._id);
            setSelectedDoctor(doctor);

            // Setting patient values
            setValue('patientStatus', patientDetails?.patientStatus || '');
            setValue('firstName', patientDetails?.name[0]?.given[0] || '');
            setValue('middleName', patientDetails?.name?.[0]?.given?.[1] || '');
            setValue('lastName', patientDetails?.name?.[0]?.family || '');
            setValue('suffix', patientDetails?.name?.[0]?.suffix?.[0] || '');
            setValue('title', patientDetails?.name?.[0]?.suffix?.[0] || '');
            setValue('approxAge', patientDetails?.approxAge || '');

            setValue(
                'dateOfBirth',
                patientDetails?.birthDate ? new Date(patientDetails.birthDate).toISOString().split('T')[0] : ''
            );
            setValue('gender', patientDetails?.gender || '');
            setValue('maritalStatus', patientDetails?.maritalStatus?.coding?.[0]?.code || '');
            setValue('medicationHistoryConsent', patientDetails?.medicationHistoryConsent || false);
            setValue('paymentProfile', patientDetails?.paymentProfile || '');
            setValue('patientCopayAmount', patientDetails?.patientCopayAmount || '');
            setValue('preferredCommunication',patientDetails?.preferredCommunication || '');
            setValue('reminderLanguage' , patientDetails?.reminderLanguage || '');
            setValue('previousBirthName' , patientDetails?.name[1]?.text || '');

            setValue('title', patientDetails?.name[0]?.prefix[0] || '')
            // Extracting telecom details
            const homePhone =
                patientDetails?.telecom?.find((t) => t.use === 'home' && t.system === 'phone')?.value || '';
            const cellPhone =
                patientDetails?.telecom?.find((t) => t.use === 'mobile' && t.system === 'phone')?.value || '';
            const officePhone =
                patientDetails?.telecom?.find((t) => t.use === 'work' && t.system === 'phone')?.value || '';
            const email = patientDetails?.telecom?.find((t) => t.system === 'email' && t.use === 'mobile')?.value || '';
            const alternateEmail =
                patientDetails?.telecom?.find((t) => t.system === 'email' && t.use === 'work')?.value || '';

            // Formatting phone numbers
            const formatPhoneNumber = (number) =>
                number
                    ?.replace(/\D/g, '')
                    .replace(/(\d{3})(\d{3})(\d{0,4})/, (match, p1, p2, p3) =>
                        p3 ? `(${p1})${p2}-${p3}` : `(${p1})${p2}`
                    ) || '';

            setValue('homePhone', formatPhoneNumber(homePhone));
            setValue('cellPhone', formatPhoneNumber(cellPhone));
            setValue('officePhone', formatPhoneNumber(officePhone));
            setValue('email', email);
            setValue('alternateEmail', alternateEmail);

            // Setting follow-up details
            setValue(
                'followupDate',
                patientDetails?.followupDate ? new Date(patientDetails.followupDate).toISOString().split('T')[0] : ''
            );
            setValue('followupReason', patientDetails?.followupReason || '');

            // Setting profile picture
            setLogo(patientDetails.photo[0].url);
            setLogoName(patientDetails.photo[0].title); // Set file name for display
        }
    }, [patientDetails, doctorDetails]);

    const onSubmit = (data) => {
        const payload = {
            id: id, // Ensure patient ID is included for update
            clinicId: clinicId || '',
            birthDate: data?.dateOfBirth || '',
            approxAge: data?.approxAge || '0',
            followupDate: data?.followupDate || '',
            gender: data?.gender || '',
            followupReason: data?.followupReason || '',
            medicationHistoryConsent: data?.medicationHistoryConsent ?? false,
            patientCopayAmount: data?.patientCopayAmount || '0',
            paymentProfile: data?.paymentProfile || '',
            preferredCommunication: data?.preferredCommunication || '',
            reminderLanguage: data?.reminderLanguage || '',
            patientStatus: data?.patientStatus || '',
            doctorId: selectedDoctor?.value || '', // Ensure _id of selected doctor is sent
          };

        // **Name structure (FHIR compliant)**
        payload.name = [
            {
                given: [data?.firstName || '', data?.middleName || ''].filter(Boolean),
                family: data?.lastName || '',
                preferred: true,
                text: `${data?.firstName || ''} ${data?.lastName || ''}`.trim(),
                use: 'official',
                suffix: [data?.suffix || ''],
                prefix: [data?.title || ''],
            },
        ];
        if (data?.previousBirthName) {
         
            payload.name.push({
                use: 'old',
                text: data.previousBirthName,
                family: data.lastName || '',
                given: [data.firstName || '', data.middleName || ''].filter(Boolean),
                period: {
                    start: data?.previousBirthNameStartDate
                        ? new Date(data.previousBirthNameStartDate).toISOString()
                        : null,
                    end: data?.previousBirthNameEndDate ? new Date(data.previousBirthNameEndDate).toISOString() : null,
                },
            });
        }

        // **Telecom (Phone & Email)**
        payload.telecom = [
            { system: 'phone', use: 'home', value: data?.homePhone || '' },
            { system: 'phone', use: 'mobile', value: data?.cellPhone || '' },
            { system: 'phone', use: 'work', value: data?.officePhone || '' },
            { system: 'email', use: 'mobile', value: data?.email || '' },
            { system: 'email', use: 'work', value: data?.alternateEmail || '' },
        ].filter((t) => t.value); // Remove empty values

        // **Photo (if exists)**
        if (logo?.url) {
            payload.photo = [
                {
                    contentType: logo?.fileType || 'image/jpeg',
                    url: logo?.url?.split('?')[0],
                    data: logo?.base64 || undefined,
                    hash: logo?.hash || '',
                    title: logoName || '',
                    creation: new Date().toISOString(),
                },
            ];
        }

        // **Handle Deceased Status**
        if (data?.patientStatus === 'Inactive-Deceased') {
            payload.deceasedBoolean = true;
            if (data?.deceasedDateTime) {
                payload.deceasedDateTime = new Date(data.deceasedDateTime).toISOString();
            }
        }

        dispatch(updatePatientsAction({ key: encryptMessage(payload) }));
    };

    const handleInputChange = (data) => {
        setDoctorSearch(data);
    };
    const handleChange = (selectedOption) => {
        setSelectedDoctor(selectedOption);
    };
    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        try {
            const url = await handleUpload(selectedFile, setProfileUploading);
            setLogo(url);
            setLogoName(selectedFile?.name);
            clearErrors('profileImage');
        } catch (error) {
            // console.error('Error during file upload:', error);
        }
    };

    return (
        <div style={{ height: '70vh', overflow: 'scroll' }} className="scroll-container">
            <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <div className="row my-2">
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">
                                First Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                // value={patientDetails?.name[0]?.given[0] || ''}
                                placeholder="First Name"
                                {...register('firstName', { required: 'First name is required' })}
                            />
                            {errors.firstName && <span className="text-danger">{errors.firstName.message}</span>}
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label htmlFor="lastName" className="mb-0">
                                Last Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                id="lastName"
                                type="text"
                                placeholder="Last Name"
                                {...register('lastName', { required: 'Last Name is required' })}
                            />
                            {errors.lastName && <span className="text-danger">{errors.lastName.message}</span>}
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group className="mb-1 position-relative">
                            <Form.Label className="mb-0">Cell Phone</Form.Label>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Text
                                        className="ps-3 pe-1 fw-bold text-black"
                                        style={{ height: '33px' }}>
                                        &nbsp;&nbsp;+1
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="tel"
                                        height={'33px'}
                                        {...register(
                                            'cellPhone',
                                            !id
                                                ? {
                                                      pattern: {
                                                          value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                                          message: 'Contact must be in the format (XXX)XXX-XXXX',
                                                      },
                                                      maxLength: {
                                                          value: 13,
                                                          message: 'Contact must not exceed 13 digits',
                                                      },
                                                      minLength: {
                                                          value: 13,
                                                          message: 'Contact must not be less than 13 digits',
                                                      },
                                                  }
                                                : {}
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

                            <div className="position-absolute " style={{ top: '48%', left: '1%' }}>
                                <img src={us} alt="country code flag" width={20} />
                            </div>
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label htmlFor="email" className="mb-0">
                                Email ID
                            </Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Email ID"
                                {...register('email', {
                                    pattern: {
                                        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />
                        </Form.Group>
                    </div>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Patient Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                max={new Date().toISOString().split('T')[0]} // Restricts future dates
                                {...register('dateOfBirth')}
                                onChange={(e) => {
                                    const calculatedAge = calculateAge(e.target.value);
                                    setAge(calculatedAge);
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={3}>
                        <Form.Group>
                            <Form.Label className="mb-0">Approx age</Form.Label>
                            <Form.Control type="text" placeholder="Approx. age" {...register('approxAge')} />
                        </Form.Group>
                    </Col>

                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label htmlFor="gender" className="mb-0">
                                Gender
                            </Form.Label>
                            <Form.Select
                                id="gender"
                                {...register(
                                    'gender'
                                    //  { required: 'Gender is required' }
                                )}
                                data-has-value={!!watch('gender')}
                                >
                                <option value="" hidden>
                                    Select
                                </option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="unknown">Unknown</option>
                            </Form.Select>
                            {errors.gender && <span className="text-danger">{errors.gender.message}</span>}
                        </Form.Group>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-3 col-12">
                        <div className="mb-1 d-flex flex-column position-relative">
                            <Form.Label className="mb-0">Patient Photo</Form.Label>
                            <div
                                onClick={() => logoFileInputRef.current.click()}
                                className={`custom-file-upload justify-content-between cursor-pointer ${
                                    logoName || profileUploading ? '' : 'custom-form-fields'
                                }`}
                                style={{ backgroundColor: '#d9ddd6' }}>
                                {logoName
                                    ? logoName.length > 25
                                        ? `${logoName.substring(0, 22)}...`
                                        : logoName
                                    : profileUploading
                                    ? 'Uploading...'
                                    : 'Upload Patient Chart Photo'}
                                <p className="mb-0">
                                    <FiUploadCloud />
                                </p>
                            </div>
                            <Form.Control
                                type="file"
                                className="d-none  border-0"
                                {...register('profileImage', {})}
                                accept=".png, .jpg, .jpeg, .svg" // Allow only specific file types
                                ref={logoFileInputRef}
                                onChange={handleFileChange}
                            />
                            {errors.profileImage && <span className="text-danger">{errors.profileImage.message}</span>}
                        </div>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label htmlFor="patientstatus" className="mb-0">
                                Status
                            </Form.Label>
                            <Form.Select
                                as="select" // Use 'select' to make it a dropdown
                                id="patientstatus"
                                {...register('patientStatus')}
                                data-has-value={!!watch('patientStatus')}>
                                <option value="">Select status</option> {/* Default option */}
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Inactive-Deceased">Inactive-Deceased</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </div>

                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label htmlFor="title" className="mb-0">
                                Title
                            </Form.Label>
                            <Form.Select
                                {...register('title')}
                                data-has-value={!!watch('title')}
                                aria-label="Select Title">
                                <option value="">Select Title</option>
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Miss">Miss</option>
                                <option value="Dr.">Dr.</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label htmlFor="middleName" className="mb-0">
                                Middle Name
                            </Form.Label>
                            <Form.Control
                                id="middleName"
                                type="text"
                                placeholder="Middle Name"
                                {...register('middleName')}
                            />
                            {errors.middleName && <span className="text-danger">{errors.middleName.message}</span>}
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group className="mb-1 position-relative">
                            <Form.Label className="mb-0">Home Phone</Form.Label>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Text
                                        className="ps-3 pe-1 fw-bold text-black"
                                        style={{ height: '33px' }}>
                                        &nbsp;&nbsp;+1
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="tel"
                                        height={'33px'}
                                        {...register(
                                            'homePhone',
                                            !id
                                                ? {
                                                      pattern: {
                                                          value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                                          message: 'Contact must be in the format (XXX)XXX-XXXX',
                                                      },
                                                      maxLength: {
                                                          value: 13,
                                                          message: 'Contact must not exceed 13 digits',
                                                      },
                                                      minLength: {
                                                          value: 13,
                                                          message: 'Contact must not be less than 13 digits',
                                                      },
                                                  }
                                                : {}
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

                            <div className="position-absolute " style={{ top: '48%', left: '1%' }}>
                                <img src={us} alt="country code flag" width={20} />
                            </div>
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Alternate Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Alternate Email ID"
                                {...register('alternateEmail', {
                                    pattern: {
                                        value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />
                        </Form.Group>
                    </div>

                    <div className="col-md-3 col-12">
                        <Form.Group className="mb-1 position-relative">
                            <Form.Label className="mb-0">Office Phone</Form.Label>
                            <Form.Group>
                                <InputGroup>
                                    <InputGroup.Text
                                        className="ps-3 pe-1 fw-bold text-black"
                                        style={{ height: '33px' }}>
                                        &nbsp;&nbsp;+1
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="tel"
                                        height={'33px'}
                                        {...register(
                                            'officePhone',
                                            !id
                                                ? {
                                                      pattern: {
                                                          value: /^\(\d{3}\)\d{3}-\d{4}$/, // Matches (XXX)XXX-XXXX format
                                                          message: 'Contact must be in the format (XXX)XXX-XXXX',
                                                      },
                                                      maxLength: {
                                                          value: 13,
                                                          message: 'Contact must not exceed 13 digits',
                                                      },
                                                      minLength: {
                                                          value: 13,
                                                          message: 'Contact must not be less than 13 digits',
                                                      },
                                                  }
                                                : {}
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
                            <div className="position-absolute " style={{ top: '48%', left: '1%' }}>
                                <img src={us} alt="country code flag" width={20} />
                            </div>
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Previous Birth Name </Form.Label>
                            <Form.Control type="text" placeholder="Previous Birth Name" {...register('previousBirthName')} />
                            {errors.birthName && <span className="text-danger">{errors.birthName.message}</span>}
                        </Form.Group>
                    </div>

                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Preferred Communication</Form.Label>
                            <Form.Select {...register('preferredCommunication')} aria-label="Select Title">
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
                            {errors.preferredCommunication && (
                                <span className="text-danger">{errors.preferredCommunication.message}</span>
                            )}
                        </Form.Group>
                    </div>

                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Reminder Language</Form.Label>
                            <Form.Select {...register('reminderLanguage')}>
                                <option value="">Select Reminder Language</option>
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                </div>
                <hr />
                <Row>
                    <div className="col-md-3 col-12">
                        <Form.Group controlId="doctorName">
                            <Form.Label className="mb-0">Select Doctor Name</Form.Label>
                            <Form.Control
                                as="select"
                                className="border-0"
                                {...register('selectedDoctor')}
                                value={selectedDoctor ? selectedDoctor.value : ''}
                                onChange={(e) => {
                                    const selectedOption = doctorOptions.find(
                                        (option) => option.value === e.target.value
                                    );
                                    setValue('selectedDoctor', selectedOption);
                                    handleChange(selectedOption);
                                    clearErrors('selectedDoctor');
                                }}>
                                <option value="" hidden>
                                    Select Doctor Name
                                </option>
                                {doctorOptions &&
                                    doctorOptions?.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                            </Form.Control>
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Medication History Concent</Form.Label>
                            <Form.Select {...register('medicationHistoryConsent')}>
                                <option value="">Select Medication History Concent</option>
                                <option value={'true'}>Yes</option>
                                <option value={'false'}>No</option>
                            </Form.Select>
                        </Form.Group>
                    </div>

                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Payment Profile</Form.Label>
                            <Form.Select {...register('paymentProfile')} aria-label="Payment Profile">
                                <option value="">Select Payment Profile</option>
                                <option value="Cash">Cash</option>
                                <option value="Insurance">Insurance</option>
                                <option value="Insurance Out of Network">Insurance Out of Network</option>
                                <option value="Auto Accident">Auto Accident</option>
                                <option value="Worker's Comp">Worker's Comp</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                            {errors.paymentProfile && (
                                <span className="text-danger">{errors.paymentProfile.message}</span>
                            )}
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Patient's Copay (in $)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Patient's Copay"
                                {...register('patientCopayAmount', {
                                    pattern: {
                                        value: /^[0-9]+(\.[0-9]+)?$/,
                                        message: 'Only numbers or decimals are allowed',
                                    },
                                })}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label htmlFor="DOB" className="mb-0">
                                Follow Up Date
                            </Form.Label>
                            <Form.Control
                                type="date" // Change type to "date" for date input
                                placeholder="Follow Up Date"
                                {...register('followupDate')}
                            />
                            {errors.followupDate && <span className="text-danger">{errors.followupDate.message}</span>}
                        </Form.Group>
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Group>
                            <Form.Label className="mb-0">Follow Up Reason</Form.Label>
                            <Form.Control type="text" placeholder="Follow Up Reason" {...register('followupReason')} />
                        </Form.Group>
                    </div>
                </Row>

                {/* Buttons */}
                <div className="d-flex gap-2 justify-content-end my-2">
                    <Button
                        type="submit"
                        className="custom-buttons btn-height"
                        disabled={store?.updatePatientsReducer?.loading}>
                        {store?.updatePatientsReducer?.loading ? (
                            <Spinner className="spinner-border-sm" color="white" />
                        ) : (
                            'Update'
                        )}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default PatientDetails;
