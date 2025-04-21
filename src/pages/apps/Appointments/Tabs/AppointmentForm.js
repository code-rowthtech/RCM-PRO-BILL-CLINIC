import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Button, Col, Form, Modal, Row, Toast, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

// Memoized components
const Daily = React.memo(({ register, watch, setValue, onDatesCalculated, appointmentDetails, id }) => {
    const daysNumberDaily = watch('daysNumberDaily');
    const dailyOccurrenceDate = watch('dailyOccurrenceDate');
    const dailyOccurenceCount = watch('dailyOccurenceCount');

    useEffect(() => {
        if (!daysNumberDaily || (!dailyOccurrenceDate && !dailyOccurenceCount)) {
            return;
        }

        const startDate = new Date();
        const dates = [];

        if (dailyOccurenceCount) {
            for (let i = 0; i < dailyOccurenceCount; i++) {
                const nextDate = new Date(startDate);
                nextDate.setDate(startDate.getDate() + i * daysNumberDaily);
                dates.push(nextDate.toISOString());
            }
        } else if (dailyOccurrenceDate) {
            const endDate = new Date(dailyOccurrenceDate);
            let currentDate = new Date(startDate);

            while (currentDate <= endDate) {
                dates.push(currentDate.toISOString());
                currentDate.setDate(currentDate.getDate() + daysNumberDaily);
            }
        }

        // Only call if onDatesCalculated exists
        onDatesCalculated?.(dates);
        setValue('dailyOccurenceCount', dates?.length)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [daysNumberDaily, dailyOccurrenceDate, dailyOccurenceCount]);


    return (
        <>
            <Col sm={6}>
                <Form.Group className="mb-1" controlId="appointmentType">
                    <Form.Label className="mb-0">Every</Form.Label>
                    <Form.Control {...register('daysNumberDaily', { valueAsNumber: true })}
                        placeholder='Enter number of days'
                        type='number'
                        min={1}
                        readOnly={appointmentDetails?.repeat && id}
                        style={{ cursor: appointmentDetails?.repeat && id ? 'not-allowed' : '' }}
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
                            readOnly={appointmentDetails?.repeat && id}
                            style={{ cursor: appointmentDetails?.repeat && id ? 'not-allowed' : '' }}
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
                            readOnly={appointmentDetails?.repeat && id}
                            style={{ cursor: appointmentDetails?.repeat && id ? 'not-allowed' : '' }} />
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


const Monthly = React.memo(({ register }) => (
    <>
        <Col sm={6}>
            <Form.Group className="mb-1" controlId="dayOfMonth">
                <Form.Label className="mb-0">Day of Month</Form.Label>
                <Form.Control
                    placeholder="Enter day of month (1-31)"
                    {...register('dayOfMonth', { valueAsNumber: true, min: 1, max: 31 })}
                    type="number"
                    min={1}
                    max={31}
                />
            </Form.Group>
        </Col>

        <Col sm={6}>
            <Form.Group className="mb-1" controlId="nthWeekOfMonth">
                <Form.Label className="mb-0">Nth Week of Month</Form.Label>
                <Form.Control
                    placeholder="Select week (e.g., First, Second)"
                    {...register('nthWeekOfMonth')}
                    type="text"
                />
            </Form.Group>
        </Col>

        <Col sm={6}>
            <Form.Group className="mb-1" controlId="dayOfWeek">
                <Form.Label className="mb-0">Day of Week</Form.Label>
                <Form.Select {...register('dayOfWeek')}>
                    <option value="">Select day</option>
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                        <option key={day} value={day}>
                            {day}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
        </Col>

        <Col sm={6}>
            <Form.Group className="mb-1" controlId="monthInterval">
                <Form.Label className="mb-0">Every</Form.Label>
                <span className='d-flex'>
                    <Form.Control
                        placeholder='Enter number of months'
                        {...register('monthInterval', { valueAsNumber: true, min: 1, required: true })}
                        type='number'
                        min={1}
                    />
                    <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;month(s)</Form.Text>
                </span>
            </Form.Group>
        </Col>

        <Col sm={4}>
            <Form.Group className="mb-1">
                <Form.Label className="mb-0">Ends On</Form.Label>
                <span className='d-flex'>
                    <Form.Control {...register('monthlyOccurrenceDate')} type='date' />
                    <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;after</Form.Text>
                </span>
            </Form.Group>
        </Col>

        <Col sm={2}>
            <Form.Group className="mb-1">
                <Form.Label className="mb-0"></Form.Label>
                <span className='d-flex'>
                    <Form.Control {...register('monthlyOccurenceCount')} placeholder='Enter number of appointments' type='number' min={1} />
                    <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;appointments</Form.Text>
                </span>
            </Form.Group>
        </Col>
    </>
));

const AppointmentForm = ({ selectedSlot, appointmentId, calendarView }) => {
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

    // Get today's date helper
    const getTodayDate = useCallback(() => {
        return new Date().toISOString().split('T')[0];
    }, []);

    // Get default time helper
    const getDefaultTime = useCallback(() => '10:00', []);

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
            const date = new Date(calendarView === 'month' ? selectedSlot?.slots : selectedSlot?.start);
            const localDateString = date.toLocaleDateString('en-CA');

            setValue('scheduled', localDateString);

            if (calendarView !== 'month') {
                setValue('startTime', formatTime(selectedSlot?.start));
            }
        } else {
            setValue('scheduled', getTodayDate());
            setValue('startTime', getDefaultTime());
            setValue('duration', '30');
        }
    }, [selectedSlot, calendarView, setValue, formatTime, getTodayDate, getDefaultTime]);

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
                // weeklyOccurenceCount
                // weeklyOccurrenceDate
                // weekInterval
                // appointmentDay
                // setValue("weeklyOccurenceCount",)
                // setValue("weeklyOccurrenceDate", appointmentDetails?.recurrenceTemplate?.lastOccurrenceDate ? new Date(appointmentDetails?.recurrenceTemplate?.lastOccurrenceDate)?.toISOString().split('T')[0] : '')
                // setValue("weeksNumberDaily", appointmentDetails?.recurrenceTemplate?.every)
            }
            if (details?.date) {
                setValue('scheduled', new Date(details?.date).toISOString().split('T')[0]);
            }
        }
    }, [appointmentDetails, id, setValue, formatTime]);

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

        const startDateTime = new Date(`${data.scheduled}T${data.startTime}:00`);
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
            // ...(repeat && repeatType !== '' && {
            //     recurrenceTemplate: {
            //         ...(repeat && {
            //             recurrenceType: {
            //                 coding: [selectedAppointmentRecurrence],
            //                 text: selectedAppointmentRecurrence.display,
            //             }
            //         }),
            //         ...(repeatType === 'day' && {
            //             occurrenceCount: appointmentDates?.length,
            //             occurrenceDate: appointmentDates,
            //             lastOccurrenceDate: data?.dailyOccurrenceDate,
            //             every: data?.daysNumberDaily
            //         }),
            //         ...(repeatType === 'week' && {
            //             occurrenceCount: appointmentDates?.length,
            //             occurrenceDate: appointmentDates,
            //             lastOccurrenceDate: data?.weeklyOccurrenceDate,
            //             every: data?.weekInterval,
            //             weeklyTemplate: {
            //                 ...(data?.appointmentDay || {}),
            //                 weekInterval: data?.weekInterval,
            //             }
            //         }),
            //         ...(repeatType === 'month' && {
            //             monthlyTemplate: {
            //                 dayOfMonth: data?.dayOfMonth,
            //                 nthWeekOfMonth: { system: "", code: "", display: data?.nthWeekOfMonth },
            //                 dayOfWeek: { system: "", code: "", display: data?.dayOfWeek },
            //                 monthInterval: data?.monthInterval,
            //             }
            //         }),
            //     }
            // })
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
                                        Select Patient
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
                                data-has-value={!!watchedAppointmentType}>
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
                        <Form.Group className="mb-1" style={{ width: '150px' }} controlId="scheduled">
                            <Form.Label className="mb-0">Scheduled</Form.Label>
                            <OverlayTrigger placement="top" overlay={renderTooltip} delay={{ show: 200, hide: 200 }}>
                                <span>
                                    <Form.Control
                                        type="date"
                                        className=""
                                        {...register('scheduled', { required: 'Scheduled date is required' })}
                                        value={watchedScheduled}
                                        disabled={!watchedDoctorName}
                                        min={getTodayDate()}
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
                                checked={repeat}
                                disabled={appointmentDetails?.repeat && id}
                                style={{ cursor: appointmentDetails?.repeat && id ? 'not-allowed' : '' }}
                                onChange={(e) => setRepeat(e.target.checked)}
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
                                {...register('consultationRoom', { required: 'Consultation room is required' })}>
                                <option value="" hidden>
                                    Select Consultation Room
                                </option>
                                {consultationRoomData?.map((room) => (
                                    <option key={room?._id} value={room?.name}>
                                        {room?.name}
                                    </option>
                                ))}
                            </Form.Control>
                            {errors.consultationRoom && <p className="text-danger">{errors.consultationRoom.message}</p>}
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
                                {appointmentStatus?.map((data, index) => (
                                    <option value={data?.code} key={index}>{data?.display}</option>
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
                                                {data?.display === 'month' && 'Monthly'}
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
                                onDatesCalculated={(dates) => setAppointmentDates(dates)}
                            />}
                        {repeatType === 'month' && <Monthly register={register} />}
                    </Row>
                )}
                <Row>
                    <Col sm={12} className="d-flex justify-content-end my-2 gap-2">
                        <Button
                            className="cancel-button"
                            disabled={store?.createAppointmentReducer?.loading || store?.rescheduleAppointmentReducer?.loading}
                            onClick={() => {
                                reset();
                                navigate(-1);
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