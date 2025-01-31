import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Modal, Row, InputGroup } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { createPatientsAction, updatePatientsAction, getPatientByIdAction, getResponsiblePartyAction, getPatientsAction } from "../../../../redux/patients/actions";
import { createAppointmentAction, getCitiesAction, getDoctorsAction, getStatesByCountryAction, getSubClinicCitiesAction, stateEmptydAction } from "../../../../redux/actions";
import { useForm } from "react-hook-form";
import { FiUploadCloud } from 'react-icons/fi';
import { encryptMessage } from '../../../../cryptoUtils';
import { handleUpload } from '../../../../helpers/HandleUpload';
import { useDispatch, useSelector } from 'react-redux';
import us from '../../../../assets/images/flags/us.jpg';
import Responsiblle from '../../Patients/Responsible';
import Insurance from '../../Patients/Insurance/Insurance';
import Demographicdetails from '../../Patients/Demographic';
import ReferringDoctor from '../../Patients/referringDoctor';
import { AiOutlinePlus } from 'react-icons/ai';
import { duration } from 'moment/moment';
import PatientDetails from '../../Patients/UpdatePatient/PatientDetails';
import NewPatient from '../../Patients/NewPatient';



const AppointmentForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('updateid');
    const store = useSelector((state) => state);
    const doctorRoleId = store?.getDoctorsRolesReducer?.data?.result?.[0]?._id;
    const createResponse = store?.createPatientsReducer?.data?.status;
    const createPatientResponse = store?.createPatientsReducer?.data?.patient;
    const statesData = store?.getStatesReducer?.data;
    const cities = store?.getCitiesReducer?.cities1?.data?.cities;
    const patientDetails = store?.getPatientByIdReducer?.data?.patient;
    const responsibleParties = store?.getResponsiblePartyReducer?.data?.responsibleParties;
    const getAppointment = store?.createAppointmentReducer;
    console.log(getAppointment, 'getAppointment')
    const doctorDetails = store?.getDoctorsReducer?.data?.response;
    const [focused, setFocused] = useState(false);
    const [submissionType, setSubmissionType] = useState(null);
    const [smShow, setSmShow] = useState(false);
    const [age, setAge] = useState(null);
    const [password, setPassword] = useState("");
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [patientId, setPatientId] = useState(null);
    const [formData, setFormData] = useState({
        role: doctorRoleId,
    });
    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(1)
    const [partySearch, setPartySearch] = useState('')
    const [selectedParty, setSelectedParty] = useState(null)
    const [doctorSearch, setDoctorSearch] = useState('');
    const logoFileInputRef = useRef(null);
    const [logoName, setLogoName] = useState('');
    const [logo, setLogo] = useState(null);
    const [searchedLocations, setSearchedLocations] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [activeTab, setActiveTab] = useState("personalDetails");
    const [btnShow, setBtnShow] = useState(true);
    const [stateToSelect, setStateToSelect] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [showModal, setShowModal] = useState(false);
    const handlePlusIconClick = () => {
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        if (age) {
            setValue('approxAge', age);
        }
    }, [age]);
    const { register, handleSubmit, watch, formState: { errors }, setValue, reset, clearErrors } = useForm();
    useEffect(() => {

        const doctorPayload = { status: true, search: doctorSearch, departmentId: '' }
        dispatch(getDoctorsAction({ key: encryptMessage(doctorPayload) }));
    }, [dispatch, doctorSearch])

    useEffect(() => {
        const data = {
            clinicId: clinicId,
            page: skip,
            limit: 10,
            search: search,
        }
        dispatch(getPatientsAction({ key: encryptMessage(data) }));
    }, [dispatch, skip, search]);

    const patientsData = store?.getPatientsReducer?.data?.patients;
    console.log('patientsData', patientsData)
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId
    function addDurationToTime(time, duration) {
        let [hours, minutes] = time?.split(':').map(Number);
        minutes += duration;
        if (minutes >= 60) {
            hours += Math.floor(minutes / 60);  // Add the extra hours
            minutes = minutes % 60;  // Keep only the remainder of minutes
        }
        if (hours >= 24) {
            hours = hours % 24;
        }

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    const onSubmit = (data) => {
        const payload = {
            patient: data.patient,
            clinic: clinicId,
            doctor: data?.doctorName,
            startTime: data?.startTime,
            endTime: addDurationToTime(data?.startTime, data?.duration),
            office: data?.office,
            date: data?.scheduled,
            duration: data?.duration,
            examRoom: data?.consultationRoom,
            reason: data?.reason,
            status: data?.status,
            profile: data?.profile,
            slot: data?.startTime

        }
        dispatch(createAppointmentAction({ key: encryptMessage(payload) }))
        reset()
        console.log({ payload })
    }
    useEffect(() => {
        if (getAppointment === 201) {
            reset();

        }
    }, [getAppointment])

    const handleDeleteAll = () =>{
        reset();
    }

    return (
        <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="patient">
                            <Form.Label className="mb-0">Patient</Form.Label>
                            <div style={{ position: "relative" }}>
                                <Form.Control
                                    as="select"
                                    data-has-value={!!watch('patient')}
                                    className=''
                                    {...register("patient", { required: "Patient is required" })}
                                    style={{ paddingRight: "40px" }}
                                >
                                    <option className='testing_select' value="" hidden>
                                        Select Patient
                                    </option>
                                    {patientsData &&
                                        patientsData.map((patient) => (
                                            <option key={patient?._id} value={patient?._id}>
                                                {patient?.firstName} {patient?.lastName}
                                            </option>

                                        ))}
                                </Form.Control>
                                {errors.patient && <p className="text-danger">{errors.patient.message}</p>}
                                <AiOutlinePlus
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "#007bff",
                                        fontSize: "20px",
                             }}
                                    onClick={handlePlusIconClick}
                                />
                            </div>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="doctorName">
                            <Form.Label className="mb-0">Select Doctor</Form.Label>
                            <div>
                                <Form.Control
                                    as="select"
                                    className='form-select'
                                    data-has-value={!!watch('doctorName')}

                                    {...register("doctorName", { required: "Doctor is required" })}
                                >
                                    <option value="" hidden>Select Doctor</option>
                                    {doctorDetails?.map((doctor) => (
                                        <option key={doctor?._id} value={doctor?._id}>
                                            {doctor?.userDetails?.firstName} {doctor?.userDetails?.lastName}
                                        </option>
                                    ))}
                                </Form.Control>
                                {errors.doctorName && <p className="text-danger">{errors.doctorName.message}</p>}
                            </div>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="office">
                            <Form.Label className="mb-0">Office</Form.Label>
                            <Form.Control as="select"
                                data-has-value={!!watch('office')}

                                className='form-select' {...register("office",
                                    { required: "Office is required" }
                                )}>
                                <option value="" hidden>Select Office</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </Form.Control>
                            {errors.office && <p className="text-danger">{errors.office.message}</p>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="reason">
                            <Form.Label className="mb-0">Reason</Form.Label>
                            <Form.Control
                                data-has-value={!!watch('reason')}
                                placeholder='Reason'
                                type="text"
                                {...register("reason",
                                    { required: "Reason is required" }
                                )}
                            />
                            {errors.reason && <p className="text-danger">{errors.reason.message}</p>}
                        </Form.Group>
                    </Col>
                    <Col sm={6} className="d-flex gap-2">
                        <Form.Group className="mb-1" style={{ width: "150px" }} controlId="scheduled">
                            <Form.Label className="mb-0">Scheduled</Form.Label>
                            <Form.Control
                                className=''
                                data-has-value={!!watch('scheduled')}
                                type="date"
                                {...register("scheduled",
                                    { required: "Scheduled date is required" }
                                )}
                            />
                            {errors.scheduled && <p className="text-danger">{errors.scheduled.message}</p>}
                        </Form.Group>
                        <Form.Group className="mb-1" style={{ width: "100px" }} controlId="starttime">
                            <Form.Label className="mb-0">Start Time</Form.Label>
                            <Form.Control
                                type="time"
                                data-has-value={!!watch('starttime')}
                                {...register("startTime",
                                    { required: "Time is required" }
                                )}
                            />
                            {errors.time && <p className="text-danger">{errors.time.message}</p>}
                        </Form.Group>

                        <div className="d-flex">
                            <Form.Group className="mb-1" style={{ width: "100px" }} controlId="duration">
                                <Form.Label className="mb-0">Duration</Form.Label>
                                <Form.Control
                                    data-has-value={!!watch('duration')}

                                    className=""
                                    type="number"
                                    {...register("duration",
                                        { required: "Duration is required" }
                                    )}
                                />
                                {errors.duration && <p className="text-danger">{errors.duration.message}</p>}
                            </Form.Group>
                            <span className="text-secondary fs-6 fw-bold mt-3 pt-1 ps-2">minutes</span>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="profile">
                            <Form.Label className="mb-0">Profile</Form.Label>
                            <Form.Control
                                data-has-value={!!watch('profile')}

                                className="form-select"
                                as="select" {...register("profile",
                                    { required: "Profile is required" }
                                )}>
                                <option value="" hidden>Select Profile</option>
                                <option value="New Patient Visit">New Patient Visit</option>
                                <option value="Followup Visit">Follow up Visit</option>
                            </Form.Control>
                            {errors.profile && <p className="text-danger">{errors.profile.message}</p>}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="consultationRoom">
                            <Form.Label className="mb-0">Consultation Room</Form.Label>
                            <Form.Control
                                as="select"
                                data-has-value={!!watch('consultationRoom')}
                                className="form-select"
                                {...register('consultationRoom',
                                    { required: 'Consultation room is required' }
                                )}
                            >
                                <option value="" hidden>Select Consultation Room</option>
                                <option value="1">Room 1</option>
                                <option value="2">Room 2</option>
                                <option value="3">Room 3</option>
                                <option value="4">Room 4</option>
                            </Form.Control>
                            {errors.consultationRoom && (
                                <p className="text-danger">{errors.consultationRoom.message}</p>
                            )}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1" >
                            <Form.Label className="mb-0">Consent Forms</Form.Label>
                            <Form.Control
                                as="select"
                                data-has-value={!!watch('consentForms')}
                                className="form-select"
                                {...register('consentForms',
                                    { required: 'Consent form selection is required' }
                                )}
                            >
                                <option value="" hidden>Select Consent Forms</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </Form.Control>
                            {errors.consentForms && (
                                <p className="text-danger">{errors.consentForms.message}</p>
                            )}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="mb-1 ">Status</Form.Label>
                            <Form.Control
                                as="select"
                                data-has-value={!!watch('status')}
                                className="form-select"
                                {...register('status', {
                                    required: 'Status is required',
                                })}
                            >
                                <option value="" hidden>Select Status</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Rescheduled">Rescheduled</option>
                                <option value="Noshow">No-Show</option>
                                <option value="Arrived">Arrived</option>
                                <option value="Checkedin">Checked In</option>
                                <option value="Checkedinonline">Checked In Online</option>
                                <option value="Inroom">In Room</option>
                                <option value="Insession">In Session</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Notconfirmed">Not Confirmed</option>
                            </Form.Control>
                            {errors.status && (
                                <p className="text-danger mt-1 text-sm">{errors.status.message}</p>
                            )}
                        </Form.Group>
                    </Col>

                </Row>
                <Row>
                    <Col sm={12} className="d-flex justify-content-end my-2 gap-2">
                        <Button
                            className="custom-buttons"
                            onClick={handleDeleteAll}
                        >
                            Delete
                        </Button>
                        <Button
                            type="submit"
                            className="custom-buttons"
                        >
                            Save and close
                        </Button>
                        <Button

                            className="custom-buttons"
                            type='submit'
                        >
                            Save
                        </Button>
                        <Button
                            className="cancel-button"
                        >
                            Cancel
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
                <Modal.Header className='py-0 px-2 ' closeButton>
                    <Modal.Title className='px-0 py-0'>Add New Patient</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        overflowY: "scroll",
                        height: "70vh",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                    className='px-0 py-0'
                >
                    <style>
                        {`::-webkit-scrollbar {
                           display: none; /* Chrome, Safari, and Edge */
                           }`}
                    </style>
                    {/* <div className="d-flex justify-content-between">
                       
                        <div className="d-flex">
                            {activeTab === "responsible" && (
                                <Button
                                    className="me-2 custom-buttons"
                                    onClick={() => handleTabChange("responsible")}
                                >
                                    Payment
                                </Button>
                            )}

                            <Button className="me-2">
                                Clear
                            </Button>
                            <Button className="me-2">
                                Set Password
                            </Button>
                            <Button className="cancel-button" onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </div> */}

                    <div className="px-2">
                        {/* Form Section */}
                        {activeTab === "personalDetails" && < NewPatient patientId={patientId} />}
                        {activeTab === "responsible" && <Responsiblle patientId={patientId} />}
                        {activeTab === "insurance" && <Insurance patientId={patientId} />}
                        {activeTab === "demographicDetails" && <Demographicdetails patientId={patientId} />}
                        {activeTab === "referringDoctor" && <ReferringDoctor patientId={patientId} />}
                    </div>
                </Modal.Body>
            </Modal>
        </div>

    );
};

export default AppointmentForm;
