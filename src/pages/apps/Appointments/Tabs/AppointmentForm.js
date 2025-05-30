import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Button, Col, Form, Modal, Row, Toast, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { debounce } from 'lodash';
import { AiOutlinePlus } from 'react-icons/ai';
import AsyncSelect from 'react-select/async';
import { useDispatch, useSelector } from 'react-redux';

// Redux actions
import { getPatientsAction } from '../../../../redux/patients/actions';
import { createAppointmentAction, getAppointmentByIdAction, getDoctorsAction, rescheduleAppointmentAction } from '../../../../redux/actions';
import { getMastersDataAction, getMastersDataAction2 } from '../../../../redux/settings/action';

// Components
import Responsiblle from '../../Patients/Responsible';
import Insurance from '../../Patients/Insurance/Insurance';
import Demographicdetails from '../../Patients/Demographic';
import ReferringDoctor from '../../Patients/referringDoctor';
import NewPatient from '../../Patients/NewPatient';
import Spinner from '../../../../constants/Spinner';

// Utils and data
import { encryptMessage } from '../../../../cryptoUtils';
import { appointmentTypeOptions } from '../../../../utils/DataSets/apppointmenttype.data';
import { appointmentReasonOptions } from '../../../../utils/DataSets/appointmentreason.data';
import { appointmentRecurrence, appointmentStatus } from '../../../../utils/DataSets/commonData';
import DateUtils from '../../../../utils/dateUtils'; // Import DateUtils

// Memoized components
const Daily = React.memo(({ register, watch, setValue, onDatesCalculated, appointmentDetails, scheduledDate, id }) => {
    const daysNumberDaily = watch('daysNumberDaily') || 1;
    const dailyOccurrenceDate = watch('dailyOccurrenceDate');
    const startDate = watch('scheduled');

    // Calculate dates whenever dependencies change
    useEffect(() => {
        if (!daysNumberDaily || daysNumberDaily < 1) {
            onDatesCalculated?.([]);
            setValue('dailyOccurenceCount', 0);
            return;
        }

        if (!startDate || !scheduledDate || !dailyOccurrenceDate) return;

        try {
            const dates = DateUtils.calculateDailyAppointments({
                daysNumber: daysNumberDaily,
                startDate: scheduledDate,
                endDate: dailyOccurrenceDate
            });
            setValue('dailyOccurenceCount', dates.length);
            onDatesCalculated?.(dates);
        } catch (error) {
            console.error('Error calculating daily appointments:', error);
            onDatesCalculated?.([]);
            setValue('dailyOccurenceCount', 0);
        }
    }, [daysNumberDaily, dailyOccurrenceDate, scheduledDate, DateUtils]);

    const todayString = DateUtils.formatDate(new Date());
    const oneMonthLaterString = DateUtils.formatDate(new Date(new Date().setMonth(new Date().getMonth() + 1)));

    // const oneYearLaterString = DateUtils.formatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
    const isReadOnly = appointmentDetails?.repeat && id;

    return (
        <>
            <Col sm={6}>
                <Form.Group className="mb-1" controlId="appointmentType">
                    <Form.Label className="mb-0">Every</Form.Label>
                    <Form.Control {...register('daysNumberDaily', { valueAsNumber: true })}
                        placeholder='Enter number of days'
                        type='number'
                        min={1}
                        readOnly={isReadOnly}
                        style={{ cursor: isReadOnly ? 'not-allowed' : '' }}
                    />
                </Form.Group>
            </Col>
            <Col sm={4}>
                <Form.Group className="mb-1">
                    <Form.Label className="mb-0">Ends On</Form.Label>
                    <span className='d-flex'>
                        <Form.Control
                            {...register('dailyOccurrenceDate')}
                            type='date'
                            min={todayString}
                            max={oneMonthLaterString}
                            readOnly={isReadOnly}
                            style={{ cursor: isReadOnly ? 'not-allowed' : '' }}
                        />
                        <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;after</Form.Text>
                    </span>
                </Form.Group>
            </Col>
            <Col sm={2}>
                <Form.Group className="mb-1">
                    <Form.Label className="mb-0"></Form.Label>
                    <span className='d-flex'>
                        <Form.Control
                            {...register('dailyOccurenceCount', { valueAsNumber: true })}
                            placeholder='Enter number of days' type='number' min={1}
                            readOnly={isReadOnly}
                            style={{ cursor: isReadOnly ? 'not-allowed' : '' }} />
                        <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;days</Form.Text>
                    </span>
                </Form.Group>
            </Col>
        </>
    );
});


const Weekly = React.memo(({ register, watch, setValue, onDatesCalculated, appointmentDetails, id }) => {
    const appointmentDays = watch('appointmentDay');
    const weekInterval = watch('weekInterval');
    const weeklyOccurrenceDate = watch('weeklyOccurrenceDate');

    const calculateAppointments = useCallback(
        debounce(() => {
            if (!appointmentDays || !weeklyOccurrenceDate) {
                setValue('weeklyOccurenceCount', '');
                onDatesCalculated([]);
                return;
            }

            const selectedDays = Object.entries(appointmentDays)
                .filter(([_, selected]) => selected)
                .map(([day]) => ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day));

            const interval = parseInt(weekInterval) || 1;
            const endDate = new Date(weeklyOccurrenceDate);

            if (selectedDays.length === 0 || isNaN(endDate.getTime())) {
                setValue('weeklyOccurenceCount', '');
                onDatesCalculated([]);
                return;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const appointments = [];
            let currentDate = new Date(today);

            while (currentDate <= endDate) {
                selectedDays.forEach(dayIndex => {
                    const weekStartDate = new Date(currentDate);
                    const appointmentDate = new Date(weekStartDate);
                    appointmentDate.setDate(weekStartDate.getDate() + (dayIndex - weekStartDate.getDay() + 7) % 7);

                    if (appointmentDate >= today && appointmentDate <= endDate) {
                        appointments.push(appointmentDate);
                    }
                });
                currentDate.setDate(currentDate.getDate() + (7 * interval));
            }

            appointments.sort((a, b) => a.getTime() - b.getTime());
            setValue('weeklyOccurenceCount', appointments.length);
            onDatesCalculated(appointments);
        }, 300),
        [appointmentDays, weekInterval, weeklyOccurrenceDate, setValue, onDatesCalculated]
    );

    useEffect(() => {
        calculateAppointments();
        return () => {
            calculateAppointments.cancel();
        };
    }, [calculateAppointments]);

    const todayString = new Date().toISOString().split('T')[0];
    const oneYearLaterString = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];

    return (
        <>
            <Col sm={12}>
                <Form.Group className="mb-1">
                    <Form.Label className="mb-0">Occurs On</Form.Label>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                        {["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].map((day) => (
                            <Form.Check
                                key={`day-${day}`}
                                type="checkbox"
                                label={day.charAt(0).toUpperCase() + day.slice(1)}
                                id={`day-${day}`}
                                {...register(`appointmentDay.${day}`)}
                                disabled={appointmentDetails?.repeat && id}
                                style={{ cursor: appointmentDetails?.repeat && id ? 'not-allowed' : '' }}
                            />
                        ))}
                    </div>
                </Form.Group>
            </Col>

            <Col sm={6}>
                <Form.Group className="mb-1">
                    <Form.Label className="mb-0">Every</Form.Label>
                    <span className="d-flex">
                        <Form.Control
                            placeholder="Enter number of weeks"
                            {...register('weekInterval', { valueAsNumber: true })}
                            type="number"
                            min={1}
                            readOnly={appointmentDetails?.repeat && id}
                            style={{ cursor: appointmentDetails?.repeat && id ? 'not-allowed' : '' }}
                        />
                        <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;week(s)</Form.Text>
                    </span>
                </Form.Group>
            </Col>

            <Col sm={4}>
                <Form.Group className="mb-1" controlId="weeklyOccurrenceDate">
                    <Form.Label className="mb-0">Ends On</Form.Label>
                    <span className="d-flex">
                        <Form.Control
                            {...register('weeklyOccurrenceDate')}
                            type="date"
                            min={todayString}
                            max={oneYearLaterString}
                            readOnly={appointmentDetails?.repeat && id}
                            style={{ cursor: appointmentDetails?.repeat && id ? 'not-allowed' : '' }}
                        />
                        <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;after</Form.Text>
                    </span>
                </Form.Group>
            </Col>

            <Col sm={2}>
                <Form.Group className="mb-1" controlId="weeklyOccurenceCount">
                    <Form.Label className="mb-0"></Form.Label>
                    <span className="d-flex">
                        <Form.Control
                            {...register('weeklyOccurenceCount')}
                            placeholder="Calculated"
                            type="text"
                            min={1}
                            readOnly
                            style={{ cursor: 'not-allowed' }}
                        />
                        <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;appointments</Form.Text>
                    </span>
                </Form.Group>
            </Col>
        </>
    );
});

const AppointmentForm = ({ selectedSlot, appointmentId, calendarView }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = appointmentId || searchParams.get('updateid');
    const store = useSelector((state) => state);

    // Memoized selectors
    const getAppointment = useMemo(() => store?.createAppointmentReducer?.data?.appointment, [store]);
    const doctorDetails = useMemo(() => store?.getDoctorsReducer?.data?.result, [store]);
    const appointmentDetails = useMemo(() => store?.getAppointmentByIdReducer?.data, [store]);
    const consultationRoomData = useMemo(() => store?.getMastersDataReducer?.data1?.data?.result, [store]);
    const patientsData = useMemo(() => store?.getPatientsReducer?.data?.data, [store]);

    const isLoading = store?.getAppointmentByIdReducer?.loading
    const clinicId = useMemo(() => JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId, []);
    const [status, setStatus] = useState(true);
    const [patientId, setPatientId] = useState(null);
    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(1);
    const [activeTab, setActiveTab] = useState('personalDetails');
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [repeat, setRepeat] = useState(false);
    const [repeatType, setRepeatType] = useState('day');
    const [appointmentDates, setAppointmentDates] = useState();
    const [appointmentReason, setAppointmentReason] = useState(null);
    const [scheduledDate, setScheduledDate] = useState()
    function formatDateToYYYYMMDD(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const { register, handleSubmit, watch, formState: { errors }, setValue, reset } = useForm({
        defaultValues: {
            scheduled: new Date().toISOString().split('T')[0],
            startTime: '10:00',
            duration: 30,
        },
    });

    // Refs for frequently accessed values
    const watchedDoctorName = watch('doctorName');
    const watchedPatient = watch('patient');
    const watchedAppointmentType = watch('appointmentType');
    const watchedScheduled = watch('scheduled');
    const watchedStartTime = watch('startTime');
    const watchedDuration = watch('duration');
    const watchedStatus = watch('status');

    // Format time helper
    const formatTime = useCallback((isoDateString) => {
        if (!isoDateString) return '';
        const date = new Date(isoDateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }, []);

    const getDefaultTime = useCallback(() => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }, []);

    // Handle disabled field click
    const handleDisabledClick = useCallback(() => {
        if (!watchedDoctorName) {
            setShowToast(true);
        }
    }, [watchedDoctorName]);

    // Tooltip renderer
    const renderTooltip = useCallback((props) => (
        !watchedDoctorName ? <Tooltip {...props}>Please select a doctor first</Tooltip> : <></>
    ), [watchedDoctorName]);

    // Fetch appointment details when ID changes
    useEffect(() => {
        if (appointmentId) {
            dispatch(getAppointmentByIdAction({ id: appointmentId }));
        }
    }, [appointmentId, dispatch]);

    // Set form values when selectedSlot changes
    useEffect(() => {
        if (selectedSlot) {
            const date = new Date(calendarView === 'month' ? selectedSlot?.slots?.[0] : selectedSlot?.start);
            const localDateString = date.toLocaleDateString('en-CA');

            setScheduledDate(localDateString);

            if (calendarView !== 'month') {
                setValue('startTime', formatTime(selectedSlot?.start));
            }
        } else {
            setScheduledDate(new Date().toISOString().split('T')[0]);
            setValue('startTime', getDefaultTime());
            setValue('duration', '30');
        }
    }, [selectedSlot, calendarView, scheduledDate]);

    // Fetch doctors when search or status changes
    useEffect(() => {
        const doctorPayload = { status, search };
        dispatch(getDoctorsAction(doctorPayload));
    }, [dispatch, search, status]);

    // Fetch consultation rooms
    useEffect(() => {
        dispatch(getMastersDataAction({ status: true, category: 'Consultation Room', limit: 10, skip, search }));
    }, [dispatch, search, skip]);

    // Fetch offices
    useEffect(() => {
        dispatch(getMastersDataAction2({ status: true, category: 'Office', limit: 10, skip, search }));
    }, [dispatch, search, skip]);

    // Fetch patients
    useEffect(() => {
        const data = { clinicId, page: skip, limit: 10, search };
        dispatch(getPatientsAction(data));
    }, [dispatch, skip, search, clinicId]);

    // Set form values when appointmentDetails changes
    useEffect(() => {
        if (appointmentDetails && id) {
            const details = appointmentDetails;
            setValue('patient', details?.subject);
            setValue('doctorName', details?.doctorId);
            setAppointmentReason(details?.reason?.[0]);
            setValue('appointmentType', details?.appointmentType?.coding?.[0]?.display || '');
            setValue('consultationRoom', details?.examRoom);
            setValue('duration', details?.minutesDuration);
            setValue('startTime', formatTime(details?.start));
            setValue('status', details?.status);
            if (appointmentDetails?.repeat) {
                setRepeat(true)
                setRepeatType(appointmentDetails?.recurrenceTemplate?.recurrenceType?.coding?.[0]?.display)
            }
            if (appointmentDetails?.recurrenceTemplate?.recurrenceType?.coding?.[0]?.display === 'day') {
                setValue("dailyOccurenceCount",)
                setValue("dailyOccurrenceDate", appointmentDetails?.recurrenceTemplate?.lastOccurrenceDate ? new Date(appointmentDetails?.recurrenceTemplate?.lastOccurrenceDate)?.toISOString().split('T')[0] : '')
                setValue("daysNumberDaily", appointmentDetails?.recurrenceTemplate?.every)
            } else if (appointmentDetails?.recurrenceTemplate?.recurrenceType?.coding?.[0]?.display === 'week') {
                const template = appointmentDetails?.recurrenceTemplate?.weeklyTemplate;
                const { weekInterval, ...days } = template;
                setValue('appointmentDay', days);
                setValue('weeklyOccurenceCount', appointmentDetails?.recurrenceTemplate?.occurrenceCount)
                setValue('weeklyOccurrenceDate', appointmentDetails?.recurrenceTemplate?.lastOccurrenceDate ? new Date(appointmentDetails?.recurrenceTemplate?.lastOccurrenceDate)?.toISOString().split('T')[0] : '')
                setValue('weekInterval', appointmentDetails?.recurrenceTemplate?.every)
            }
            if (details?.date) {
                setScheduledDate(new Date(details?.date).toISOString().split('T')[0]);
            }
        }
    }, [appointmentDetails, id, patientsData, doctorDetails, setValue, formatTime]);

    // Handle form submission
    // const onSubmit = useCallback((data) => {

    // }, [id, appointmentDetails, clinicId, appointmentReason, repeat, repeatType, appointmentDates, dispatch]);
    const onSubmit = (data) => {
        const selectedAppointmentType = appointmentTypeOptions.find((option) => option.show === data.appointmentType);
        const appointmentTypePayload = {
            coding: [{
                system: selectedAppointmentType.system,
                code: selectedAppointmentType.value,
                display: selectedAppointmentType.show,
            }],
            text: selectedAppointmentType.label,
        };

        const selectedAppointmentRecurrence = appointmentRecurrence?.find((item) => item?.display === repeatType);

        const startDateTime = new Date(`${formatDateToYYYYMMDD(scheduledDate)}T${data.startTime}:00`);
        const endDateTime = new Date(startDateTime.getTime() + data.duration * 60000);
        let recurrenceTemplate = {};

        if (!(appointmentDetails && id) && repeat && repeatType !== '') {
            recurrenceTemplate = {
                recurrenceTemplate: {
                    recurrenceType: {
                        coding: [selectedAppointmentRecurrence],
                        text: selectedAppointmentRecurrence.display,
                    },
                    ...(repeatType === 'day' && {
                        occurrenceCount: appointmentDates?.length,
                        occurrenceDate: appointmentDates,
                        lastOccurrenceDate: data?.dailyOccurrenceDate,
                        every: data?.daysNumberDaily,
                    }),
                    ...(repeatType === 'week' && {
                        occurrenceCount: appointmentDates?.length,
                        occurrenceDate: appointmentDates,
                        lastOccurrenceDate: data?.weeklyOccurrenceDate,
                        every: data?.weekInterval,
                        weeklyTemplate: {
                            ...(data?.appointmentDay || {}),
                            weekInterval: data?.weekInterval,
                        },
                    }),
                    ...(repeatType === 'month' && {
                        monthlyTemplate: {
                            dayOfMonth: data?.dayOfMonth,
                            nthWeekOfMonth: { system: "", code: "", display: data?.nthWeekOfMonth },
                            dayOfWeek: { system: "", code: "", display: data?.dayOfWeek },
                            monthInterval: data?.monthInterval,
                        },
                    }),
                }
            };
        }

        const payload = {
            ...(id && appointmentDetails ? { id } : {}),
            subject: data.patient,
            clinicId,
            appointmentType: appointmentTypePayload,
            doctorId: data?.doctorName,
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
            created: new Date().toISOString(),
            minutesDuration: data.duration,
            examRoom: data?.consultationRoom,
            ...(appointmentReason?.text || appointmentReason?.display === appointmentDetails?.reason?.[0]?.coding?.[0]?.display ? {} : {
                reason: [{
                    coding: appointmentReason,
                    text: appointmentReason?.display,
                }]
            }),
            status: data?.status,
            slot: data?.startTime,
            ...recurrenceTemplate
        };

        if (id && appointmentDetails) {
            dispatch(rescheduleAppointmentAction({ id, key: encryptMessage(payload) }));
        } else {
            dispatch(createAppointmentAction({ key: encryptMessage(payload) }));
        }
    }

    // Reset form and navigate after successful submission
    useEffect(() => {
        if (getAppointment === 201) {
            reset();
            navigate('/apps/appointments/list');
        }
    }, [getAppointment, reset, navigate]);

    // Handle new patient modal
    const handlePlusIconClick = useCallback(() => setShowModal(true), []);
    const handleCloseModal = useCallback(() => setShowModal(false), []);

    // Handle delete all
    const handleDeleteAll = useCallback(() => reset(), [reset]);

    // Appointment reason handling
    const formattedReasonOptions = useMemo(() =>
        appointmentReasonOptions.map((reason) => ({
            value: reason,
            label: reason.display,
        })), []);


    const handleReasonChange = useCallback((selectedOption) => {
        setAppointmentReason(selectedOption ? selectedOption.value : '');
    }, []);

    const selectedReasonOption = useMemo(() =>
        formattedReasonOptions.find((option) => option?.value?.display === appointmentReason?.text) ||
        formattedReasonOptions.find((option) => option?.display === appointmentReason),
        [formattedReasonOptions, appointmentReason]
    );

    const loadReasonOptions = useCallback((inputValue, callback) => {
        if (!inputValue) {
            callback(formattedReasonOptions.slice(0, 10));
            return;
        }

        const filteredOptions = formattedReasonOptions.filter((option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
        );

        callback(filteredOptions.slice(0, 20));
    }, [formattedReasonOptions]);
    return (
        <div>
            {isLoading ?
                <Row style={{ height: '40vh' }}>
                    <Col className='d-flex align-items-center justify-content-center '>
                        <Spinner />
                    </Col>
                </Row>
                :
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="mb-1" controlId="patient">
                                <Form.Label className="mb-0">Patient</Form.Label>
                                <div style={{ position: 'relative' }}>
                                    <Form.Control
                                        as="select"
                                        data-has-value={!!watchedPatient}
                                        className=""
                                        {...register('patient', { required: 'Patient is required' })}
                                        style={{ paddingRight: '40px' }}>
                                        <option className="testing_select" value="" hidden>
                                            {store?.getPatientsReducer?.loading ? "Loading..." : "Select Patient"}
                                        </option>
                                        {patientsData?.map((patient) => (
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
                                        data-has-value={!!watchedDoctorName}
                                        {...register('doctorName', { required: 'Doctor is required' })}>
                                        <option value="" hidden>
                                            {store?.getDoctorsReducer?.loading ? "Loading..." : 'Select Doctor'}
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
                                    data-has-value={!!watchedAppointmentType}>
                                    <option value="" hidden>
                                        Select
                                    </option>
                                    {appointmentTypeOptions.map((option) => (
                                        <option key={option?.value} value={option?.show}>
                                            {option?.show}
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
                            <Form.Group className="mb-1" style={{ width: '150px' }} controlId="scheduled">
                                <Form.Label className="mb-0">Scheduled</Form.Label>
                                <OverlayTrigger placement="top" overlay={renderTooltip} delay={{ show: 200, hide: 200 }}>
                                    <span>
                                        <Form.Control
                                            type="date"
                                            className=""
                                            {...register('scheduled', { required: 'Scheduled date is required' })}
                                            value={scheduledDate}
                                            // disabled={!watchedDoctorName}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setScheduledDate(e.target.value)}
                                            onClick={handleDisabledClick}
                                            style={{ pointerEvents: watchedDoctorName ? 'auto' : 'none' }}
                                        />
                                    </span>
                                </OverlayTrigger>
                            </Form.Group>

                            <Form.Group className="mb-1" style={{ width: '100px' }} controlId="starttime">
                                <Form.Label className="mb-0">Start Time</Form.Label>
                                <OverlayTrigger placement="top" overlay={renderTooltip} delay={{ show: 200, hide: 200 }}>
                                    <span>
                                        <Form.Control
                                            type="time"
                                            {...register('startTime', { required: 'Time is required' })}
                                            value={watchedStartTime}
                                            disabled={!watchedDoctorName}
                                            onClick={handleDisabledClick}
                                            style={{ pointerEvents: watchedDoctorName ? 'auto' : 'none' }}
                                        />
                                    </span>
                                </OverlayTrigger>
                            </Form.Group>

                            <div className="d-flex">
                                <Form.Group className="mb-1" style={{ width: '100px' }} controlId="duration">
                                    <Form.Label className="mb-0">Duration</Form.Label>
                                    <OverlayTrigger placement="top" overlay={renderTooltip} delay={{ show: 200, hide: 200 }}>
                                        <span>
                                            <Form.Control
                                                type="number"
                                                {...register('duration', { required: 'Duration is required' })}
                                                value={watchedDuration}
                                                disabled={!watchedDoctorName}
                                                onClick={handleDisabledClick}
                                                style={{ pointerEvents: watchedDoctorName ? 'auto' : 'none' }}
                                            />
                                        </span>
                                    </OverlayTrigger>
                                </Form.Group>
                                <span className="text-secondary fs-6 fw-bold mt-3 pt-1 ps-2">minutes</span>
                            </div>
                            <Form.Group className="mb-0 ms-2">
                                <Form.Label className="mb-0"></Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    label="Repeat"
                                    value={repeat}
                                    disabled={appointmentDetails?.repeat && id}
                                    style={{ cursor: appointmentDetails?.repeat && id ? 'not-allowed' : '' }}
                                    onChange={(e) => { setRepeat(e.target.checked) }}
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="mb-0">Reason</Form.Label>
                                <AsyncSelect
                                    loadOptions={loadReasonOptions}
                                    defaultOptions={formattedReasonOptions.slice(0, 10)}
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
                                    {...register('consultationRoom')}>
                                    <option value="" hidden>
                                        Select Consultation Room
                                    </option>
                                    {consultationRoomData?.map((room) => (
                                        <option key={room?._id} value={room?.name}>
                                            {room?.name}
                                        </option>
                                    ))}
                                </Form.Control>
                                {/* {errors.consultationRoom && <p className="text-danger">{errors.consultationRoom.message}</p>} */}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="mb-1">Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    data-has-value={!!watchedStatus}
                                    className="form-select"
                                    {...register('status', { required: 'Status is required' })}
                                    defaultValue="Scheduled">
                                    <option value='' key={''} hidden>Select Status</option>
                                    {(id
                                        ? appointmentStatus
                                        : appointmentStatus.filter(data =>
                                            ['proposed', 'booked', 'arrived', 'checked-in'].includes(data.code)
                                        )
                                    ).map((data, index) => (
                                        <option value={data.code} key={index}>
                                            {data.display}
                                        </option>
                                    ))}
                                </Form.Control>
                                {errors.status && <p className="text-danger mt-1 text-sm">{errors.status.message}</p>}
                            </Form.Group>
                        </Col>

                    </Row>
                    <Row>
                        {repeat && (
                            <Col sm={12} className='mt-2'>
                                <div className="time-period-tabs">
                                    <ul
                                        style={{ cursor: appointmentDetails?.repeat && id ? 'not-allowed' : '' }}
                                        className="nav nav-pills">
                                        {appointmentRecurrence?.map((data, index) => (
                                            <li
                                                key={index}
                                                style={{ cursor: appointmentDetails?.repeat && id ? 'not-allowed' : '' }}
                                                className="nav-item">
                                                <span
                                                    className={`cursor-pointer text-capitalize mx-1 border border-muted nav-link py-1  
                                                ${repeatType === data.display ? 'active' : 'text-black'}`}
                                                    onClick={() => {
                                                        if (appointmentDetails?.repeat && id) {
                                                            return;
                                                        } else {
                                                            setRepeatType(data?.display)
                                                        }
                                                    }}
                                                >
                                                    {data?.display === 'day' && 'Daily'}
                                                    {data?.display === 'week' && 'Weekly'}
                                                    {/* {data?.display === 'month' && 'Monthly'} */}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Col>
                        )}
                    </Row>
                    {repeat && (
                        <Row className='mt-2'>
                            {repeatType === 'day' &&
                                <Daily
                                    register={register}
                                    watch={watch}
                                    setValue={setValue}
                                    id={id}
                                    appointmentDetails={appointmentDetails}
                                    scheduledDate={scheduledDate}
                                    onDatesCalculated={(dates) => setAppointmentDates(dates)}
                                />}
                            {repeatType === 'week' &&
                                <Weekly
                                    errors={errors}
                                    register={register}
                                    watch={watch}
                                    id={id}
                                    setValue={setValue}
                                    appointmentDetails={appointmentDetails}
                                    scheduledDate={scheduledDate}
                                    onDatesCalculated={(dates) => setAppointmentDates(dates)}
                                />}
                            {/* {repeatType === 'month' && <Monthly register={register} />} */}
                        </Row>
                    )}
                    <Row>
                        <Col sm={12} className="d-flex justify-content-end my-2 gap-2">
                            <Button
                                className="cancel-button"
                                disabled={store?.createAppointmentReducer?.loading || store?.rescheduleAppointmentReducer?.loading}
                                onClick={() => {
                                    reset();
                                    if (location?.pathname !== '/apps/appointments/list') {
                                        navigate(-1);
                                    }
                                }}>
                                Cancel
                            </Button>
                            <Button
                                className="custom-buttons"
                                type="submit"
                                disabled={store?.createAppointmentReducer?.loading || store?.rescheduleAppointmentReducer?.loading}>
                                {store?.createAppointmentReducer?.loading ? (
                                    <Spinner color="white" className="spinner-border-sm" />
                                ) : (
                                    'Save'
                                )}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            }
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
                        {`::-webkit-scrollbar { display: none; }`}
                    </style>
                    <div className="px-2">
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

export default React.memo(AppointmentForm);