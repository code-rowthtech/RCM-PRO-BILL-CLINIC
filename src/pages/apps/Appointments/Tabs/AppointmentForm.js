import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row, Toast, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { getPatientsAction } from '../../../../redux/patients/actions';
import { createAppointmentAction, getAppointmentByIdAction, getDoctorsAction, rescheduleAppointmentAction } from '../../../../redux/actions';
import { useForm } from 'react-hook-form';
import { encryptMessage } from '../../../../cryptoUtils';
import { useDispatch, useSelector } from 'react-redux';
import Responsiblle from '../../Patients/Responsible';
import Insurance from '../../Patients/Insurance/Insurance';
import Demographicdetails from '../../Patients/Demographic';
import ReferringDoctor from '../../Patients/referringDoctor';
import { AiOutlinePlus } from 'react-icons/ai';
import NewPatient from '../../Patients/NewPatient';
import Spinner from '../../../../constants/Spinner';
import { getMastersDataAction, getMastersDataAction2 } from '../../../../redux/settings/action';
import { appointmentTypeOptions } from '../../../../utils/DataSets/apppointmenttype.data';
import { appointmentReasonOptions } from '../../../../utils/DataSets/appointmentreason.data';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { appointmentStatus } from '../../../../utils/DataSets/commonData';


const AppointmentForm = ({ selectedSlot, appointmentId, calendarView }) => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = appointmentId ? appointmentId : searchParams.get('updateid');
    const store = useSelector((state) => state);
    const doctorRoleId = store?.getDoctorsRolesReducer?.data?.result?.[0]?._id;
    const getAppointment = store?.createAppointmentReducer?.data?.appointment;
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const appointmentDetails = store?.getAppointmentByIdReducer?.data;
    const [age, setAge] = useState(null);
    const [status, setStatus] = useState(true);
    const [patientId, setPatientId] = useState(null);
    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(1);
    const [activeTab, setActiveTab] = useState('personalDetails');
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [repeat, setRepeat] = useState(false);
    const [repeatType, setRepeatType] = useState('')

    useEffect(() => {
        if (appointmentId) {
            dispatch(getAppointmentByIdAction({ id: appointmentId }))
        }
    }, [appointmentId])
    const handlePlusIconClick = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        if (age) {
            setValue('approxAge', age);
        }
    }, [age]);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
        reset,
    } = useForm({
        defaultValues: {
            scheduled: new Date().toISOString().split('T')[0],
            startTime: '10:00',
            duration: 30,
        },
    });
    useEffect(() => {
        const doctorPayload = { status: status, search: search };
        dispatch(getDoctorsAction(doctorPayload));
    }, [dispatch, search]);
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Format YYYY-MM-DD
    };
    const getDefaultTime = () => {
        return '10:00'; // Default Start Time
    };
    // Handle user click on disabled fields
    const handleDisabledClick = () => {
        if (!watch('doctorName')) {
            setShowToast(true);
        }
    };
    const renderTooltip = (props) => {
        return !watch('doctorName') ? <Tooltip {...props}>Please select a doctor first</Tooltip> : <></>;
    };

    useEffect(() => {
        if (selectedSlot && calendarView === 'month') {
            const date = new Date(selectedSlot?.slots);
            const localDateString = date.toLocaleDateString('en-CA'); // returns YYYY-MM-DD in local time
            setValue('scheduled', localDateString);
        } else if (calendarView !== 'month' && selectedSlot) {
            const date = new Date(selectedSlot?.start);
            const localDateString = date.toLocaleDateString('en-CA'); // returns YYYY-MM-DD in local time
            setValue('scheduled', localDateString);
            setValue('startTime', formatTime(selectedSlot?.start));
        } else {
            setValue('scheduled', getTodayDate());
            setValue('startTime', getDefaultTime());
            setValue('duration', '30');
        }
    }, [selectedSlot, setValue, calendarView])
    useEffect(() => {
        dispatch(
            getMastersDataAction({ status: true, category: 'Consultation Room', limit: 10, skip, search: search })
        );
    }, [dispatch, search, skip]);
    useEffect(() => {
        dispatch(getMastersDataAction2({ status: true, category: 'Office', limit: 10, skip, search: search }));
    }, [dispatch, search, skip]);

    const consultationRoomData = store?.getMastersDataReducer?.data1?.data?.result;
    // const officeData = store?.getMastersDataReducer?.data2?.data?.result;
    useEffect(() => {
        const data = {
            clinicId: clinicId,
            page: skip,
            limit: 10,
            search: search,
        };
        dispatch(getPatientsAction(data));
    }, [dispatch, skip, search]);

    const patientsData = store?.getPatientsReducer?.data?.data;
    const formatTime = (isoDateString) => {
        if (!isoDateString) return '';
        const date = new Date(isoDateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

    useEffect(() => {
        if (appointmentDetails && id) {
            setValue('patient', appointmentDetails?.subject);
            setValue('doctorName', appointmentDetails?.doctorId);
            setAppointmentReason(appointmentDetails?.reason?.[0]);
            setValue('appointmentType', appointmentDetails?.appointmentType?.coding?.[0]?.display || '');
            setValue('consultationRoom', appointmentDetails?.examRoom);
            setValue('duration', appointmentDetails?.minutesDuration);
            setValue('startTime', formatTime(appointmentDetails?.start));
            setValue('status', appointmentDetails?.status);
            // setValue('office', appointmentDetails?.office);
            setValue(
                'scheduled',
                appointmentDetails?.date ? new Date(appointmentDetails?.date).toISOString().split('T')[0] : ''
            );
        }
    }, [appointmentDetails, id, doctorDetails, patientsData]);
    const onSubmit = (data) => {
        const selectedAppointmentType = appointmentTypeOptions.find((option) => option.show === data.appointmentType);
        const appointmentTypePayload = {
            coding: [
                {
                    system: selectedAppointmentType.system,
                    code: selectedAppointmentType.value,
                    display: selectedAppointmentType.show,
                },
            ],
            text: selectedAppointmentType.label,
        };
        // ✅ Define startDateTime and endDateTime here, BEFORE using in payload
        const startDateTime = new Date(`${data.scheduled}T${data.startTime}:00`);
        const endDateTime = new Date(startDateTime.getTime() + data.duration * 60000);
        const payload = {
            ...(id && appointmentDetails ? { id: id } : {}),
            subject: data.patient,
            clinicId: clinicId,
            appointmentType: appointmentTypePayload,
            doctorId: data?.doctorName,
            start: startDateTime.toISOString(), // ✅ ISO format
            end: endDateTime.toISOString(), // ✅ ISO format
            created: new Date().toISOString(), // ✅ Now in ISO
            minutesDuration: data.duration, // ✅ Number
            // office: data?.office,
            date: data?.scheduled,
            duration: data?.duration,
            examRoom: data?.consultationRoom,
            ...(appointmentReason?.text || appointmentReason?.display === appointmentDetails?.reason?.[0]?.coding?.[0]?.display ? {} :
                {
                    reason: [
                        {
                            coding: appointmentReason,
                            text: appointmentReason?.display, // use display text
                        },
                    ]
                }
            ),
            status: data?.status,
            slot: data?.startTime,
        };
        if (id && appointmentDetails) {
            dispatch(rescheduleAppointmentAction({ id: id, key: encryptMessage(payload) }));
        } else {
            dispatch(createAppointmentAction({ key: encryptMessage(payload) }));
        }
    };

    useEffect(() => {
        if (getAppointment === 201) {
            reset();
            navigate('/apps/appointments/list');
        }
    }, [getAppointment]);

    const handleDeleteAll = () => {
        reset();
    };

    const formattedReasonOptions = appointmentReasonOptions.map((reason) => ({
        value: reason, // Code as the value
        label: reason.display, // Display text as the label
    }));
    const [appointmentReason, setAppointmentReason] = useState(null);
    const handleReasonChange = (selectedOption) => {
        setAppointmentReason(selectedOption ? selectedOption.value : '');
    };
    const selectedReasonOption =
        formattedReasonOptions.find((option) => option?.value?.display === appointmentReason?.text) ||
        formattedReasonOptions.find((option) => option?.display === appointmentReason);
    const loadReasonOptions = (inputValue, callback) => {
        // If there's no search input, show only the first 10 options
        if (!inputValue) {
            callback(formattedReasonOptions.slice(0, 10));
            return;
        }

        // Filter options based on search input
        const filteredOptions = formattedReasonOptions.filter((option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
        );

        callback(filteredOptions.slice(0, 20)); // Return up to 20 results on search
    };

    // const Daily = () => {
    //     return (
    //         <Row>
    //             <Col sm={6}>
    //                 <Form.Group className="mb-1" controlId="appointmentType">
    //                     <Form.Label className="mb-0">Every</Form.Label>
    //                     <Form.Control placeholder='Enter number of days' type='number' min={1} />
    //                 </Form.Group>
    //             </Col>
    //             <Col sm={4}>
    //                 <Form.Group className="mb-1" controlId="appointmentType">
    //                     <Form.Label className="mb-0">Ends On</Form.Label>
    //                     <span className='d-flex'> <Form.Control type='date' />
    //                         <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;after</Form.Text></span>
    //                 </Form.Group>
    //             </Col>
    //             <Col sm={2}>
    //                 <Form.Group className="mb-1" controlId="appointmentType">
    //                     <Form.Label className="mb-0">Every</Form.Label>
    //                     <span className='d-flex'> <Form.Control placeholder='Enter number of days' type='number' min={1} />
    //                         <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;days</Form.Text></span>

    //                 </Form.Group>
    //             </Col>
    //         </Row>
    //     )
    // }
    return (
        <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="patient">
                            <Form.Label className="mb-0">Patient</Form.Label>
                            <div style={{ position: 'relative' }}>
                                <Form.Control
                                    as="select"
                                    data-has-value={!!watch('patient')}
                                    className=""
                                    {...register('patient', { required: 'Patient is required' })}
                                    style={{ paddingRight: '40px' }}>
                                    <option className="testing_select" value="" hidden>
                                        Select Patient
                                    </option>
                                    {patientsData &&
                                        patientsData.map((patient) => (
                                            <option key={patient?._id} value={patient?._id}>
                                                {patient?.name?.[0]?.text}
                                            </option>
                                        ))}
                                </Form.Control>
                                {errors.patient && <p className="text-danger">{errors.patient.message}</p>}
                                <AiOutlinePlus
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                        color: '#007bff',
                                        fontSize: '20px',
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
                                    className="form-select"
                                    data-has-value={!!watch('doctorName')}
                                    {...register('doctorName', { required: 'Doctor is required' })}>
                                    <option value="" hidden>
                                        Select Doctor
                                    </option>
                                    {doctorDetails?.map((doctor) => (
                                        <option key={doctor?._id} value={doctor?._id}>
                                            {doctor?.name?.[0]?.text}
                                        </option>
                                    ))}
                                </Form.Control>
                                {errors.doctorName && <p className="text-danger">{errors.doctorName.message}</p>}
                            </div>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="appointmentType">
                            <Form.Label className="mb-0">Appointment Type</Form.Label>
                            <Form.Select
                                className="form-select"
                                {...register('appointmentType', { required: 'Appointment Type is required' })}
                                data-has-value={!!watch('appointmentType')}>
                                <option value="" hidden>
                                    Select
                                </option>
                                {appointmentTypeOptions.map((option) => (
                                    <option key={option.value} value={option.show}>
                                        {option.show}
                                    </option>
                                ))}
                            </Form.Select>
                            {errors.appointmentType && <p className="text-danger">{errors.appointmentType.message}</p>}
                        </Form.Group>
                    </Col>
                    <Toast
                        show={showToast}
                        onClose={() => setShowToast(false)}
                        delay={2000}
                        autohide
                        style={{
                            position: 'fixed',
                            top: '10px',
                            right: '10px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '5px',
                        }}>
                        <Toast.Body>Please select a doctor first!</Toast.Body>
                    </Toast>
                    <Col sm={6} className="d-flex gap-2">
                        {/* Scheduled Date with Tooltip on Hover */}
                        <Form.Group className="mb-1" style={{ width: '150px' }} controlId="scheduled">
                            <Form.Label className="mb-0">Scheduled</Form.Label>
                            <OverlayTrigger
                                placement="top"
                                overlay={renderTooltip}
                                delay={{ show: 200, hide: 200 }} // Tooltip shows on hover
                            >
                                <span>
                                    <Form.Control
                                        type="date"
                                        className=""
                                        {...register('scheduled', { required: 'Scheduled date is required' })}
                                        value={watch('scheduled')}
                                        disabled={!watch('doctorName')}
                                        min={new Date().toISOString().split('T')[0]} // Prevents past dates
                                        onClick={handleDisabledClick} // Show popup if clicked
                                        style={{ pointerEvents: watch('doctorName') ? 'auto' : 'none' }} // Ensure tooltip works on disabled fields
                                    />
                                </span>
                            </OverlayTrigger>
                        </Form.Group>

                        {/* Start Time with Tooltip on Hover */}
                        <Form.Group className="mb-1" style={{ width: '100px' }} controlId="starttime">
                            <Form.Label className="mb-0">Start Time</Form.Label>
                            <OverlayTrigger
                                placement="top"
                                overlay={renderTooltip}
                                delay={{ show: 200, hide: 200 }} // Tooltip shows on hover
                            >
                                <span>
                                    <Form.Control
                                        type="time"
                                        {...register('startTime', { required: 'Time is required' })}
                                        value={watch('startTime')}
                                        disabled={!watch('doctorName')}
                                        onClick={handleDisabledClick} // Show popup if clicked
                                        style={{ pointerEvents: watch('doctorName') ? 'auto' : 'none' }} // Ensure tooltip works on disabled fields
                                    />
                                </span>
                            </OverlayTrigger>
                        </Form.Group>

                        {/* Duration with Tooltip on Hover */}
                        <div className="d-flex">
                            <Form.Group className="mb-1" style={{ width: '100px' }} controlId="duration">
                                <Form.Label className="mb-0">Duration</Form.Label>
                                <OverlayTrigger
                                    placement="top"
                                    overlay={renderTooltip}
                                    delay={{ show: 200, hide: 200 }} // Tooltip shows on hover
                                >
                                    <span>
                                        <Form.Control
                                            type="number"
                                            {...register('duration', { required: 'Duration is required' })}
                                            value={watch('duration')}
                                            disabled={!watch('doctorName')}
                                            onClick={handleDisabledClick} // Show popup if clicked
                                            style={{ pointerEvents: watch('doctorName') ? 'auto' : 'none' }} // Ensure tooltip works on disabled fields
                                        />
                                    </span>
                                </OverlayTrigger>
                            </Form.Group>
                            <span className="text-secondary fs-6 fw-bold mt-3 pt-1 ps-2">minutes</span>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <Form.Group>
                            <Form.Label className="mb-0">Reason</Form.Label>
                            <AsyncSelect
                                loadOptions={loadReasonOptions}
                                defaultOptions={formattedReasonOptions.slice(0, 10)} // Show first 10 options initially
                                isSearchable
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="&nbsp; Select"
                                value={selectedReasonOption}
                                onChange={handleReasonChange}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '30px',
                                        minHeight: '30px',
                                        border: '0px',
                                    }),
                                    placeholder: (provided) => ({
                                        ...provided,
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        paddingBottom: '5px',
                                    }),
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-1" controlId="consultationRoom">
                            <Form.Label className="mb-0">Consultation Room</Form.Label>
                            <Form.Control
                                as="select"
                                data-has-value={!!watch('consultationRoom')}
                                className="form-select"
                                {...register('consultationRoom', { required: 'Consultation room is required' })}>
                                <option value="" hidden>
                                    Select Consultation Room
                                </option>
                                {consultationRoomData &&
                                    consultationRoomData.map((room) => (
                                        <option key={room?._id} value={room?.name}>
                                            {room?.name}
                                        </option>
                                    ))}
                            </Form.Control>
                            {errors.consultationRoom && (
                                <p className="text-danger">{errors.consultationRoom.message}</p>
                            )}
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="mb-1">Status</Form.Label>
                            <Form.Control
                                as="select"
                                data-has-value={!!watch('status')}
                                className="form-select"
                                {...register('status', {
                                    required: 'Status is required',
                                })}
                                defaultValue="Scheduled" // Default value set to "Scheduled"
                            >
                                <option value='' key={''} hidden>Select Status</option>
                                {appointmentStatus?.map((data, index) => (
                                    <option value={data?.code} key={index}>{data?.display}</option>
                                ))}
                            </Form.Control>
                            {errors.status && <p className="text-danger mt-1 text-sm">{errors.status.message}</p>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    {/* <Col sm={12}>
                        <Form.Group className="mb-1" controlId="doctorName">
                            <Form.Check // prettier-ignore
                                type={'checkbox'}
                                label={`Repeat`}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setRepeat(true)
                                    } else {
                                        setRepeat(false)
                                    }
                                }}
                            />
                        </Form.Group>
                    </Col> */}
                    {/* {repeat &&
                        <Col sm={12} className='mt-2'>
                            <div className="time-period-tabs">
                                <ul className="nav nav-pills">
                                    <li className="nav-item">
                                        <span
                                            className={`cursor-pointer border border-muted nav-link py-1  ${repeatType === 'daily' ? 'active' : 'text-black'}`}
                                            onClick={() => setRepeatType('daily')}
                                        >
                                            Daily
                                        </span>
                                    </li>
                                    <li className="nav-item ms-2">
                                        <span
                                            className={`cursor-pointer border border-muted nav-link py-1  ${repeatType === 'weekly' ? 'active' : 'text-black'}`}
                                            onClick={() => setRepeatType('weekly')}
                                        >
                                            Weekly
                                        </span>
                                    </li>
                                    <li className="nav-item ms-2">
                                        <span
                                            className={`cursor-pointer border border-muted nav-link py-1  ${repeatType === 'monthly' ? 'active' : 'text-black'}`}
                                            onClick={() => setRepeatType('monthly')}
                                        >
                                            Monthly
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </Col>
                    } */}
                </Row>
                <Row>
                    <Col sm={12} className="d-flex justify-content-end my-2 gap-2">
                        <Button
                            className="cancel-button"
                            disabled={
                                store?.createAppointmentReducer?.loading || store?.rescheduleAppointmentReducer?.loading
                            }
                            onClick={() => {
                                reset();
                                navigate(-1)
                            }}>
                            Cancel
                        </Button>
                        <Button
                            className="custom-buttons"
                            type="submit"
                            disabled={
                                store?.createAppointmentReducer?.loading || store?.rescheduleAppointmentReducer?.loading
                            }>
                            {store?.createAppointmentReducer?.loading ? (
                                <Spinner color="white" className="spinner-border-sm" />
                            ) : (
                                'Save'
                            )}
                        </Button>
                    </Col>
                </Row>

            </Form>

            <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
                <Modal.Header className="py-0 px-2 " closeButton>
                    <Modal.Title className="px-0 py-0">Add New Patient</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        overflowY: 'scroll',
                        height: '70vh',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                    className="px-0 py-0">
                    <style>
                        {`::-webkit-scrollbar {
                           display: none; /* Chrome, Safari, and Edge */
                           }`}
                    </style>
                    <div className="px-2">
                        {/* Form Section */}
                        {activeTab === 'personalDetails' && <NewPatient patientId={patientId} />}
                        {activeTab === 'responsible' && <Responsiblle patientId={patientId} />}
                        {activeTab === 'insurance' && <Insurance patientId={patientId} />}
                        {activeTab === 'demographicDetails' && <Demographicdetails patientId={patientId} />}
                        {activeTab === 'referringDoctor' && <ReferringDoctor patientId={patientId} />}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AppointmentForm;