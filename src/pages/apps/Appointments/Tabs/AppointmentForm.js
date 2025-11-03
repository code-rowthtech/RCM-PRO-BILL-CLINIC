import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Modal, Row, Toast, OverlayTrigger, Tooltip, FormGroup } from 'react-bootstrap';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { debounce } from 'lodash';
import { AiOutlinePlus } from 'react-icons/ai';
import AsyncSelect from 'react-select/async';
import { useDispatch, useSelector } from 'react-redux';
// Redux actions
import { getPatientsAction } from '../../../../redux/patients/actions';
import {
    createAppointmentAction, getAppointmentByIdAction, getDoctorsAction,
    getPractitionerScheduleAction, rescheduleAppointmentAction,
} from '../../../../redux/actions';
import { getConsentFormAction, getMastersDataAction, getMastersDataAction2 } from '../../../../redux/settings/action';

// Components
import Responsiblle from '../../Patients/Responsible';
import Insurance from '../../Patients/Insurance/Insurance';
import Demographicdetails from '../../Patients/Demographic';
import ReferringDoctor from '../../Patients/referringDoctor';
import NewPatient from '../../Patients/NewPatient';
import Spinner from '../../../../constants/Spinner';

// Utils and data
import { decryptMessage, encryptMessage } from '../../../../cryptoUtils';
import { appointmentTypeOptions, timezoneOptions } from '../../../../utils/DataSets/apppointmenttype.data';
import { appointmentReasonOptions } from '../../../../utils/DataSets/appointmentreason.data';
import { appointmentRecurrence, appointmentStatus } from '../../../../utils/DataSets/commonData';
import DateUtils from '../../../../utils/dateUtils'; // Import DateUtils
import { loggedInUser } from '../../../../helpers/api/loggedInUser';
import HolidayModal from '../HolidayModal';
import ConsultationModal from '../../Settings/Consultation Room/ConsultationModal';

// Memoized components
const Daily = React.memo(({ register, watch, setValue, onDatesCalculated, appointmentDetails, scheduledDate, id, errors }) => {
    const daysNumberDaily = watch('daysNumberDaily') || 1;
    const dailyOccurrenceDate = watch('dailyOccurrenceDate');
    const startDate = watch('scheduled');
    // const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
                endDate: dailyOccurrenceDate,
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
    const minEndDate = scheduledDate ? DateUtils.formatDate(new Date(scheduledDate)) : todayString;

    // const oneYearLaterString = DateUtils.formatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
    const isReadOnly = appointmentDetails?.repeat && id;

    return (
        <>
            <Col sm={6}>
                <Form.Group className="mb-1" controlId="appointmentType">
                    <Form.Label className="mb-0">Every</Form.Label>
                    <Form.Control
                        {...register('daysNumberDaily', { valueAsNumber: true })}
                        placeholder="Enter number of days"
                        type="number"
                        min={1}
                        readOnly={isReadOnly}
                        style={{ cursor: isReadOnly ? 'not-allowed' : '' }}
                    />
                </Form.Group>
            </Col>
            <Col sm={4}>
                <Form.Group className="mb-1">
                    <Form.Label className="mb-0">Ends On <span className="text-danger">*</span></Form.Label>
                    <span className="d-flex">
                        <Form.Control
                            {...register('dailyOccurrenceDate', { required: 'End date is required' })}
                            type="date"
                            min={minEndDate}
                            max={oneMonthLaterString}
                            readOnly={isReadOnly}
                            style={{ cursor: isReadOnly ? 'not-allowed' : '' }}
                        />
                        <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;after</Form.Text>
                    </span>
                    {errors.dailyOccurrenceDate && <span className="text-danger small">{errors.dailyOccurrenceDate.message}</span>}
                </Form.Group>
            </Col>

            <Col sm={2}>
                <Form.Group className="mb-1">
                    <Form.Label className="mb-0"></Form.Label>
                    <span className="d-flex">
                        <Form.Control
                            {...register('dailyOccurenceCount', { valueAsNumber: true })}
                            placeholder="Enter number of days"
                            type="number"
                            min={1}
                            readOnly={isReadOnly}
                            style={{ cursor: isReadOnly ? 'not-allowed' : '' }}
                        />
                        <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;days</Form.Text>
                    </span>
                </Form.Group>
            </Col>
        </>
    );
});

const Weekly = React.memo(({ register, watch, setValue, onDatesCalculated, appointmentDetails, id, scheduledDate, errors }) => {
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
                .map(([day]) =>
                    ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day)
                );

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
                selectedDays.forEach((dayIndex) => {
                    const weekStartDate = new Date(currentDate);
                    const appointmentDate = new Date(weekStartDate);
                    appointmentDate.setDate(weekStartDate.getDate() + ((dayIndex - weekStartDate.getDay() + 7) % 7));

                    if (appointmentDate >= today && appointmentDate <= endDate) {
                        appointments.push(appointmentDate);
                    }
                });
                currentDate.setDate(currentDate.getDate() + 7 * interval);
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
    const oneYearLaterString = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split('T')[0];

    const minEndDate = scheduledDate ? new Date(scheduledDate).toISOString().split('T')[0] : todayString;
    return (
        <>
            <Col sm={12}>
                <Form.Group className="mb-1">
                    <Form.Label className="mb-0">Occurs On</Form.Label>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                        {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
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
                    <Form.Label className="mb-0">Ends On <span className="text-danger">*</span></Form.Label>
                    <span className="d-flex">
                        <Form.Control
                            {...register('weeklyOccurrenceDate', { required: 'End date is required' })}
                            type="date"
                            min={minEndDate}
                            max={oneYearLaterString}
                            readOnly={appointmentDetails?.repeat && id}
                            style={{ cursor: appointmentDetails?.repeat && id ? 'not-allowed' : '' }}
                        />
                        <Form.Text className="text-black fs-6 fw-semibold">&nbsp;&nbsp;after</Form.Text>
                    </span>
                    {errors.weeklyOccurrenceDate && <span className="text-danger small">{errors.weeklyOccurrenceDate.message}</span>}
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
    const practitionerSchedule = useMemo(() => store?.getPractitionerScheduleReducer?.data?.holidays, [store]);
    const isLoading = store?.getAppointmentByIdReducer?.loading;
    // const clinicId = useMemo(() => JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId, []);
    const clinicId = decryptMessage(localStorage?.getItem('subClinicLocation')) || '';

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
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [selectedConsultationRoom, setSelectedConsultationRoom] = useState(null);
    const [selectedConsentForm, setSelectedConsentForm] = useState([]);
    const [scheduledDate, setScheduledDate] = useState();
    const [showHolidayModal, setShowHolidayModal] = useState(false);
    const [consultationModal, setConsultationModal] = useState(false);
    const [showPastDateModal, setShowPastDateModal] = useState(false);
    const [pendingDate, setPendingDate] = useState('');
    const [consentFormsLoaded, setConsentFormsLoaded] = useState(false);


    function formatDateToYYYYMMDD(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

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
            startTime: new Date().toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/New_York',
            }),
            timezone: 'America/New_York',
            duration: 30,
        },
    });

    // Add effect to update time when timezone changes
    useEffect(() => {
        const timezone = watch('timezone');
        if (timezone) {
            setValue(
                'startTime',
                new Date().toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: timezone,
                })
            );
        }
    }, [watch('timezone'), setValue]); // Refs for frequently accessed values
    const watchedDoctorName = watch('doctorName');
    const watchedPatient = watch('patient');
    const watchedAppointmentType = watch('appointmentType');
    const watchedtimezone = watch('timezone');
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
    const renderTooltip = useCallback(
        (props) => (!watchedDoctorName ? <Tooltip {...props}>Please select a doctor first</Tooltip> : <></>),
        [watchedDoctorName]
    );

    // Fetch appointment details when ID changes
    useEffect(() => {
        if (appointmentId) {
            dispatch(getAppointmentByIdAction({ id: appointmentId }));
        }
    }, [appointmentId, dispatch]);

    // Set form values when selectedSlot changes
    useEffect(() => {
        if (selectedSlot) {
            const rawDate = new Date(calendarView === 'month' ? selectedSlot?.slots?.[0] : selectedSlot?.start);
            // Use local date string to avoid timezone issues
            const year = rawDate.getFullYear();
            const month = String(rawDate.getMonth() + 1).padStart(2, '0');
            const day = String(rawDate.getDate()).padStart(2, '0');
            const localDateString = `${year}-${month}-${day}`;

            setScheduledDate(localDateString);

            if (calendarView !== 'month') {
                setValue('startTime', formatTime(selectedSlot?.start));
            }
        } else {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;
            setScheduledDate(todayStr);
            setValue('startTime', getDefaultTime());
            setValue('duration', '30');
        }
    }, [selectedSlot, calendarView]);

    // Fetch doctors when search or status changes
    useEffect(() => {
        const doctorPayload = { status, search };
        dispatch(getDoctorsAction(doctorPayload));
    }, [dispatch, search, status]);

    // Fetch consultation rooms
    useEffect(() => {
        dispatch(getConsentFormAction());
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
            const selectedPatientOption = formattedPatientOptions.find(option => option.value === details?.subject);
            setSelectedPatient(selectedPatientOption || null);
            setValue('doctorName', details?.doctorId);
            const selectedProviderOption = formattedProviderOptions.find(option => option.value === details?.doctorId);
            setSelectedProvider(selectedProviderOption || null);
            setAppointmentReason(details?.reason?.[0]);
            setValue('appointmentType', details?.appointmentType?.coding?.[0]?.display || '');
            setValue('consultationRoom', details?.examRoom);
            const selectedConsultationRoomOption = formattedConsultationRoomOptions.find(option => option.value === details?.examRoom);
            setSelectedConsultationRoom(selectedConsultationRoomOption || null);

            setValue('duration', details?.minutesDuration);
            setValue('startTime', formatTime(details?.start));
            setValue('status', details?.status);
            setValue('timezone', details?.timeZone || 'America/New_York');
            if (appointmentDetails?.repeat) {
                setRepeat(true);
                setRepeatType(appointmentDetails?.recurrenceTemplate?.recurrenceType?.coding?.[0]?.display);
            }
            if (appointmentDetails?.recurrenceTemplate?.recurrenceType?.coding?.[0]?.display === 'day') {
                setValue('dailyOccurenceCount');
                setValue(
                    'dailyOccurrenceDate',
                    appointmentDetails?.recurrenceTemplate?.lastOccurrenceDate
                        ? new Date(appointmentDetails?.recurrenceTemplate?.lastOccurrenceDate)
                            ?.toISOString()
                            .split('T')[0]
                        : ''
                );
                setValue('daysNumberDaily', appointmentDetails?.recurrenceTemplate?.every);
            } else if (appointmentDetails?.recurrenceTemplate?.recurrenceType?.coding?.[0]?.display === 'week') {
                const template = appointmentDetails?.recurrenceTemplate?.weeklyTemplate;
                const { weekInterval, ...days } = template;
                setValue('appointmentDay', days);
                setValue('weeklyOccurenceCount', appointmentDetails?.recurrenceTemplate?.occurrenceCount);
                setValue(
                    'weeklyOccurrenceDate',
                    appointmentDetails?.recurrenceTemplate?.lastOccurrenceDate
                        ? new Date(appointmentDetails?.recurrenceTemplate?.lastOccurrenceDate)
                            ?.toISOString()
                            .split('T')[0]
                        : ''
                );
                setValue('weekInterval', appointmentDetails?.recurrenceTemplate?.every);
            }
            if (details?.start) {
                setScheduledDate(new Date(details?.start).toISOString().split('T')[0]);
            }
        }
    }, [appointmentDetails, id, patientsData, doctorDetails, setValue, formatTime]);

    // Handle consent forms separately to avoid conflicts
    useEffect(() => {
        if (appointmentDetails && id && store?.getConsentFormReducer?.data?.documents && !consentFormsLoaded) {
            const details = appointmentDetails;
            if (details?.consentForms && Array.isArray(details.consentForms)) {
                const consentFormOptions = details.consentForms.map(formId => {
                    const form = store?.getConsentFormReducer?.data?.documents?.find(doc => doc._id === formId);
                    return form ? {
                        value: form._id,
                        label: form.title,
                        data: form
                    } : null;
                }).filter(Boolean);
                setSelectedConsentForm(consentFormOptions);
                setValue('consentForm', details.consentForms);
            } else {
                setSelectedConsentForm([]);
                setValue('consentForm', []);
            }
            setConsentFormsLoaded(true);
        }
    }, [appointmentDetails, id, store?.getConsentFormReducer?.data?.documents, consentFormsLoaded, setValue]);

    useEffect(() => {
        if (watchedDoctorName) {
            dispatch(getPractitionerScheduleAction({ clinicId: loggedInUser?.clinicId, doctorId: watchedDoctorName }));
        }
    }, [watchedDoctorName]);

    useEffect(() => {
        if (scheduledDate && practitionerSchedule?.length) {
            const scheduledDateOnly = new Date(scheduledDate).toISOString().split('T')[0];
            const match = practitionerSchedule.some((item) => {
                const itemDateOnly = new Date(item.date).toISOString().split('T')[0];
                return itemDateOnly === scheduledDateOnly;
            });

            if (match) {
                setShowHolidayModal(true);
            }
        }
    }, [practitionerSchedule, scheduledDate]);

    // Create a local Date object from a scheduled date string and time string
    function createLocalDateTime(dateStr, timeStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const [hours, minutes] = timeStr.split(':').map(Number);
        // month-1 because JS months are 0-based
        return new Date(year, month - 1, day, hours, minutes);
    }
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
        const selectedAppointmentRecurrence = appointmentRecurrence?.find((item) => item?.display === repeatType);

        // const startDateTime = new Date(`${formatDateToYYYYMMDD(scheduledDate)}T${data.startTime}:00Z`);
        // const endDateTime = new Date(startDateTime.getTime() + data.duration * 60000);

        const startDateTime = createLocalDateTime(scheduledDate, data.startTime);
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
                            nthWeekOfMonth: { system: '', code: '', display: data?.nthWeekOfMonth },
                            dayOfWeek: { system: '', code: '', display: data?.dayOfWeek },
                            monthInterval: data?.monthInterval,
                        },
                    }),
                },
            };
        }
        const payload = {
            ...(id && appointmentDetails ? { id } : {}),
            subject: data.patient,
            consentForms: data?.consentForm || [],
            clinicId,
            appointmentType: appointmentTypePayload,
            doctorId: data?.doctorName,
            start: startDateTime,
            end: endDateTime,
            minutesDuration: data.duration,
            examRoom: data?.consultationRoom,
            ...(appointmentReason?.text ||
                appointmentReason?.display === appointmentDetails?.reason?.[0]?.coding?.[0]?.display
                ? {}
                : {
                    reason: [
                        {
                            coding: [appointmentReason],
                            text: appointmentReason?.display,
                        },
                    ],
                }),
            status: data?.status,
            slot: data?.startTime,
            ...recurrenceTemplate,
        };
        if (id && appointmentDetails) {
            dispatch(rescheduleAppointmentAction({ id, key: encryptMessage(payload) }));
        } else {
            dispatch(createAppointmentAction({ key: encryptMessage(payload) }));
        }
    };

    // Reset form and navigate after successful submission
    useEffect(() => {
        if (getAppointment === 201) {
            reset();
            navigate('/apps/appointments/list');
        }
    }, [getAppointment, reset, navigate]);

    // Handle new patient modal
    const handlePlusIconClick = useCallback(() => setShowModal(true), []);
    const handleClosePatientModal = useCallback(() => setShowModal(false), []);

    // Patient options formatting
    const formattedPatientOptions = useMemo(
        () =>
            patientsData?.map((patient) => ({
                value: patient?._id,
                label: (patient?.name?.[0]?.prefix?.[0]
                    ? patient?.name?.[0]?.prefix?.[0].charAt(0).toUpperCase() + patient?.name?.[0]?.prefix?.[0].slice(1) + ' '
                    : '') +
                    (patient?.name?.[0]?.family
                        ? patient?.name?.[0]?.family.charAt(0).toUpperCase() + patient?.name?.[0]?.family.slice(1)
                        : '') +
                    (patient?.name?.[0]?.given?.length > 0
                        ? ' ' + patient?.name?.[0]?.given.map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ')
                        : '') + " " + `(${patient?.chartNumber})` || 'N/A',
            })) || [],
        [patientsData]
    );

    // Provider options formatting
    const formattedProviderOptions = useMemo(
        () =>
            doctorDetails?.map((doctor) => {
                const doctorName = (doctor?.name?.[0]?.prefix?.[0]
                    ? doctor?.name?.[0]?.prefix?.[0] + ' '
                    : '') +
                    (doctor?.name?.[0]?.family || '') +
                    (doctor?.name?.[0]?.given?.length > 0
                        ? ' ' + doctor?.name?.[0]?.given?.join(' ')
                        : '') + ' ' +
                    (doctor?.identifier?.find((tel) => tel?.type?.coding?.[0]?.code === 'NPI')?.value ?
                        `(******${doctor?.identifier?.find((tel) => tel?.type?.coding?.[0]?.code === 'NPI')?.value.slice(-4)})`
                        : '') || '';
                const emailObj = doctor?.telecom?.find((t) => t.system === 'email');
                const email = emailObj?.value ? ` (${emailObj.value})` : '';
                return {
                    value: doctor?._id,
                    label: doctorName,
                };
            }) || [],
        [doctorDetails]
    );

    // Consultation room options formatting
    const formattedConsultationRoomOptions = useMemo(
        () =>
            consultationRoomData?.map((room) => ({
                value: room?._id,
                label: room?.name,
            })) || [],
        [consultationRoomData]
    );

    // Patient handling
    const handlePatientChange = useCallback((selectedOption) => {
        setSelectedPatient(selectedOption);
        setValue('patient', selectedOption ? selectedOption.value : '');
    }, [setValue]);

    // Provider handling
    const handleProviderChange = useCallback((selectedOption) => {
        setSelectedProvider(selectedOption);
        setValue('doctorName', selectedOption ? selectedOption.value : '');
    }, [setValue]);

    // Consultation room handling
    const handleConsultationRoomChange = useCallback((selectedOption) => {
        setSelectedConsultationRoom(selectedOption);
        setValue('consultationRoom', selectedOption ? selectedOption.value : '');
    }, [setValue]);

    // Consent form handling
    const handleConsentFormChange = useCallback((selectedOptions) => {
        setSelectedConsentForm(selectedOptions);
        setValue('consentForm', selectedOptions ? selectedOptions.map(option => option.value) : []);
    }, [setValue]);

    const loadPatientOptions = useCallback(
        (inputValue, callback) => {
            if (!inputValue) {
                callback(formattedPatientOptions.slice(0, 10));
                return;
            }
            const filteredOptions = formattedPatientOptions.filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );
            callback(filteredOptions.slice(0, 20));
        },
        [formattedPatientOptions]
    );

    const loadProviderOptions = useCallback(
        (inputValue, callback) => {
            if (!inputValue) {
                callback(formattedProviderOptions.slice(0, 10));
                return;
            }
            const filteredOptions = formattedProviderOptions.filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );

            callback(filteredOptions.slice(0, 20));
        },
        [formattedProviderOptions]
    );

    const loadConsultationRoomOptions = useCallback(
        (inputValue, callback) => {
            if (!inputValue) {
                callback(formattedConsultationRoomOptions.slice(0, 10));
                return;
            }
            const filteredOptions = formattedConsultationRoomOptions.filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );
            callback(filteredOptions.slice(0, 20));
        },
        [formattedConsultationRoomOptions]
    );

    // Appointment reason handling
    const formattedReasonOptions = useMemo(
        () =>
            appointmentReasonOptions.map((reason) => ({
                value: reason,
                label: reason.display,
            })),
        []
    );

    const handleReasonChange = useCallback((selectedOption) => {
        setAppointmentReason(selectedOption ? selectedOption.value : '');
    }, []);

    const selectedReasonOption = useMemo(
        () =>
            formattedReasonOptions.find((option) => option?.value?.display === appointmentReason?.text) ||
            formattedReasonOptions.find((option) => option?.display === appointmentReason),
        [formattedReasonOptions, appointmentReason]
    );

    const loadReasonOptions = useCallback(
        (inputValue, callback) => {
            if (!inputValue) {
                callback(formattedReasonOptions.slice(0, 30));
                return;
            }
            const filteredOptions = formattedReasonOptions.filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );
            callback(filteredOptions.slice(0, 40));
        },
        [formattedReasonOptions]
    );

    const loadConsentFormOptions = useCallback(
        (inputValue, callback) => {
            const options = store?.getConsentFormReducer?.data?.documents?.map((form) => ({
                value: form?._id,
                label: form?.title,
                data: form
            })) || [];

            if (!inputValue) {
                callback(options);
                return;
            }

            const filteredOptions = options.filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );
            callback(filteredOptions);
        },
        [store?.getConsentFormReducer?.data?.documents]
    );

    const handleViewConsentForm = useCallback((consentForm) => {
        if (consentForm?.consentDocument?.url) {
            window.open(consentForm?.consentDocument?.url?.split('?')[0], '_blank');
        }
    }, []);

    const closeHolidayModal = () => {
        setShowHolidayModal(false);
    };

    const closeConsultationModal = () => {
        setConsultationModal(false);
    };

    return (
        <div>
            {isLoading ? (
                <Row style={{ height: '40vh' }}>
                    <Col className="d-flex align-items-center justify-content-center ">
                        <Spinner />
                    </Col>
                </Row>
            ) : (
                <Form className='d-flex flex-column align-items-between' onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ height: '55vh' }}>
                        <Row>
                            <Col sm={6}>
                                <Form.Group className="mb-1" controlId="patient">
                                    <Form.Label className="mb-0">
                                        Patient <span className="text-danger">*</span>
                                    </Form.Label>

                                    <div style={{ position: 'relative' }}>
                                        <AsyncSelect
                                            loadOptions={loadPatientOptions}
                                            defaultOptions={formattedPatientOptions.slice(0, 10)}
                                            isSearchable
                                            className="basic-single"
                                            classNamePrefix="select"
                                            placeholder={store?.getPatientsReducer?.loading ? 'Loading...' : 'Select Patient'}
                                            value={selectedPatient}
                                            onChange={handlePatientChange}
                                            noOptionsMessage={() => 'No Patient added yet'}
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    height: '30px',
                                                    minHeight: '30px',
                                                    border: 'none',
                                                    paddingRight: '40px',
                                                    outline: 'none',
                                                }),
                                                placeholder: (provided) => ({
                                                    ...provided,
                                                    fontSize: '12px',
                                                }),
                                            }}
                                        />
                                        <input
                                            type="hidden"
                                            {...register('patient', { required: 'Patient is required' })}
                                            value={selectedPatient?.value || ''}
                                        />

                                        <AiOutlinePlus
                                            title="Add Patient"
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                cursor: 'pointer',
                                                color: '#007bff',
                                                fontSize: '20px',
                                                pointerEvents: 'auto',
                                                zIndex: 10,
                                            }}
                                            onClick={handlePlusIconClick}
                                        />
                                    </div>
                                    {errors.patient && (
                                        <span className="text-danger small" style={{ display: 'block', marginTop: '2px' }}>
                                            {errors.patient.message}
                                        </span>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col sm={6}>
                                <Form.Group className="mb-1" controlId="doctorName">
                                    <Form.Label className="mb-0">
                                        Select Provider <span className="text-danger">*</span>
                                    </Form.Label>
                                    <div>
                                        <AsyncSelect
                                            loadOptions={loadProviderOptions}
                                            defaultOptions={formattedProviderOptions.slice(0, 10)}
                                            isSearchable
                                            className="basic-single"
                                            classNamePrefix="select"
                                            placeholder={store?.getDoctorsReducer?.loading ? 'Loading...' : 'Select Provider'}
                                            value={selectedProvider}
                                            onChange={handleProviderChange}
                                            noOptionsMessage={() => 'No Doctor added yet'}
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    height: '30px',
                                                    minHeight: '30px',
                                                    border: 'none',
                                                    outline: 'none',
                                                }),
                                                placeholder: (provided) => ({
                                                    ...provided,
                                                    fontSize: '12px',
                                                }),
                                            }}
                                        />
                                        <input
                                            type="hidden"
                                            {...register('doctorName', { required: 'Doctor is required' })}
                                            value={selectedProvider?.value || ''}
                                        />
                                        {errors.doctorName && <span className="text-danger small">{errors.doctorName.message}</span>}
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-1" controlId="appointmentType">
                                    <Form.Label className="mb-0">
                                        Appointment Type <span className="text-danger">*</span>
                                    </Form.Label>
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
                                    {errors.appointmentType && (
                                        <span className="text-danger small">{errors.appointmentType.message}</span>
                                    )}
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
                                <Toast.Body>Please select a provider first!</Toast.Body>
                            </Toast>
                            <Col sm={6} className="d-flex gap-2">
                                <Form.Group className="mb-1" style={{ width: '150px' }} controlId="scheduled">
                                    <Form.Label className="mb-0">Scheduled</Form.Label>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={renderTooltip}
                                        delay={{ show: 200, hide: 200 }}>
                                        <span>
                                            <Form.Control
                                                type="date"
                                                className=""
                                                {...register('scheduled', {
                                                    required: 'Scheduled date is required'
                                                })}
                                                value={scheduledDate}
                                                onChange={(e) => {
                                                    const selectedDate = new Date(e.target.value).setHours(0, 0, 0, 0);
                                                    const today = new Date().setHours(0, 0, 0, 0);

                                                    if (selectedDate < today) {
                                                        setPendingDate(e.target.value);
                                                        setShowPastDateModal(true);
                                                    } else {
                                                        setScheduledDate(e.target.value);
                                                    }
                                                }}
                                                onClick={handleDisabledClick}
                                                style={{ pointerEvents: watchedDoctorName ? 'auto' : 'none' }}
                                            />
                                        </span>
                                    </OverlayTrigger>
                                </Form.Group>
                                <Form.Group className="mb-1" style={{ width: '100px' }} controlId="starttime">
                                    <Form.Label className="mb-0">Start Time</Form.Label>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={renderTooltip}
                                        delay={{ show: 200, hide: 200 }}>
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
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={renderTooltip}
                                            delay={{ show: 200, hide: 200 }}>
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
                                        value={repeat}
                                        disabled={appointmentDetails?.repeat && id}
                                        style={{ cursor: appointmentDetails?.repeat && id ? 'not-allowed' : '' }}
                                        onChange={(e) => {
                                            setRepeat(e.target.checked);
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group>
                                    <Form.Label className="mb-0">Reason</Form.Label>
                                    <AsyncSelect
                                        loadOptions={loadReasonOptions}
                                        defaultOptions={formattedReasonOptions.slice(0, 30)}
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
                                    <Form.Label className="mb-0">
                                        Consultation Room
                                        <span>
                                            <i
                                                className="bi bi-plus-circle text-primary ms-1 cursor-pointer"
                                                style={{ fontSize: '0.7rem' }}
                                                title="Add Consultation Room"
                                                onClick={() => setConsultationModal(true)}></i>
                                        </span>
                                    </Form.Label>
                                    <div style={{ position: 'relative' }}>
                                        <AsyncSelect
                                            loadOptions={loadConsultationRoomOptions}
                                            defaultOptions={formattedConsultationRoomOptions.slice(0, 10)}
                                            isSearchable
                                            className="basic-single"
                                            classNamePrefix="select"
                                            placeholder="Select Consultation Room"
                                            value={selectedConsultationRoom}
                                            onChange={handleConsultationRoomChange}
                                            noOptionsMessage={() => 'No Consultation added yet'}
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    height: '30px',
                                                    minHeight: '30px',
                                                    border: 'none',
                                                    outline: 'none',
                                                }),
                                                placeholder: (provided) => ({
                                                    ...provided,
                                                    fontSize: '12px',
                                                }),
                                            }}
                                        />
                                        <input
                                            type="hidden"
                                            {...register('consultationRoom')}
                                            value={selectedConsultationRoom?.value || ''}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="mb-0">
                                        Status <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        data-has-value={!!watchedStatus}
                                        className="form-select"
                                        {...register('status', { required: 'Status is required' })}
                                        defaultValue="proposed">
                                        <option value="" key={''} hidden>
                                            Select Status
                                        </option>
                                        {(id
                                            ? appointmentStatus
                                            : appointmentStatus.filter((data) =>
                                                ['proposed', 'booked', 'arrived', 'checked-in', 'checked-out'].includes(data.code)
                                            )
                                        ).map((data, index) => (
                                            <option value={data.code} key={index}>
                                                {data.display}
                                            </option>
                                        ))}
                                    </Form.Control>
                                    {errors.status && <span className="text-danger mt-1 small">{errors.status.message}</span>}
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="mb-0">
                                        Consent Form
                                    </Form.Label>
                                    <div className="position-relative">
                                        <AsyncSelect
                                            loadOptions={loadConsentFormOptions}
                                            defaultOptions={store?.getConsentFormReducer?.data?.documents?.slice(0, 10)?.map((form) => ({
                                                value: form?._id,
                                                label: form?.title,
                                                data: form
                                            })) || []}
                                            onInputChange={(inputValue) => dispatch(getConsentFormAction({ search: inputValue || '' }))}
                                            isSearchable
                                            isMulti
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            placeholder="Select Consent Forms"
                                            value={selectedConsentForm}
                                            onChange={handleConsentFormChange}
                                            noOptionsMessage={() => 'No consent forms available'}
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    minHeight: '30px',
                                                    border: 'none',
                                                    outline: 'none',
                                                }),
                                                placeholder: (provided) => ({
                                                    ...provided,
                                                    fontSize: '12px',
                                                }),
                                                multiValue: (provided) => ({
                                                    ...provided,
                                                    backgroundColor: '#e9ecef',
                                                    borderRadius: '3px',
                                                }),
                                                multiValueLabel: (provided) => ({
                                                    ...provided,
                                                    fontSize: '12px',
                                                }),
                                            }}
                                            formatOptionLabel={(option, { context }) => (
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span>{option.label}</span>
                                                    {context === 'menu' && option.data?.document?.url && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-primary ms-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleViewConsentForm(option.data);
                                                            }}
                                                            style={{ fontSize: '10px', padding: '2px 6px' }}
                                                        >
                                                            View
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        />
                                        <input
                                            type="hidden"
                                            {...register('consentForm')}
                                            value={JSON.stringify(selectedConsentForm?.map(option => option.value) || [])}
                                        />
                                    </div>
                                    {selectedConsentForm?.length > 0 && (
                                        <div className="mt-2">
                                            <small className="text-muted">Selected forms:</small>
                                            <div className="d-flex flex-wrap gap-1 mt-1">
                                                {selectedConsentForm?.map((form, index) => (
                                                    <span key={index} className="badge bg-light text-dark border d-flex align-items-center">
                                                        {form?.label}
                                                        {form?.data?.consentDocument?.url && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm p-0 ms-1"
                                                                onClick={() => handleViewConsentForm(form.data)}
                                                                style={{ fontSize: '10px', color: '#007bff' }}
                                                                title="View consent form"
                                                            >
                                                                <i className="bi bi-eye"></i>
                                                            </button>
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            {repeat && (
                                <Col sm={12} className="mt-2">
                                    <div className="time-period-tabs">
                                        <ul
                                            style={{ cursor: appointmentDetails?.repeat && id ? 'not-allowed' : '' }}
                                            className="nav nav-pills">
                                            {appointmentRecurrence?.map((data, index) => (
                                                <li
                                                    key={index}
                                                    style={{
                                                        cursor: appointmentDetails?.repeat && id ? 'not-allowed' : '',
                                                    }}
                                                    className="nav-item">
                                                    <span
                                                        className={`cursor-pointer text-capitalize mx-1 border border-muted nav-link py-1  
                                                ${repeatType === data.display ? 'active' : 'text-black'}`}
                                                        onClick={() => {
                                                            if (appointmentDetails?.repeat && id) {
                                                                return;
                                                            } else {
                                                                setRepeatType(data?.display);
                                                            }
                                                        }}>
                                                        {data?.display === 'day' && 'Daily'}
                                                        {data?.display === 'week' && 'Weekly'}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </Col>
                            )}
                        </Row>
                        {repeat && (
                            <Row className="mt-2">
                                {repeatType === 'day' && (
                                    <Daily
                                        register={register}
                                        watch={watch}
                                        setValue={setValue}
                                        id={id}
                                        appointmentDetails={appointmentDetails}
                                        scheduledDate={scheduledDate}
                                        errors={errors}
                                        onDatesCalculated={(dates) => setAppointmentDates(dates)}
                                    />
                                )}
                                {repeatType === 'week' && (
                                    <Weekly
                                        errors={errors}
                                        register={register}
                                        watch={watch}
                                        id={id}
                                        setValue={setValue}
                                        appointmentDetails={appointmentDetails}
                                        scheduledDate={scheduledDate}
                                        onDatesCalculated={(dates) => setAppointmentDates(dates)}
                                    />
                                )}
                            </Row>
                        )}
                    </div>
                    <Row>
                        <Col sm={12} className="d-flex justify-content-end my-2">
                            <Button
                                className="custom-buttons"
                                type="submit"
                                style={{ width: '65px' }}
                                disabled={
                                    store?.createAppointmentReducer?.loading ||
                                    store?.rescheduleAppointmentReducer?.loading
                                }>
                                {store?.createAppointmentReducer?.loading ||
                                    store?.rescheduleAppointmentReducer?.loading ? (
                                    <Spinner color="white" className="spinner-border-sm" />
                                ) : (
                                    'Save'
                                )}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            )}

            <Modal show={showModal} size="xl" centered>
                <Modal.Header className="py-0 px-2">
                    <Modal.Title className="px-1 py-2">{`Add Patient`}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    // style={{
                    //     overflowY: 'scroll',
                    //     height: '70vh',
                    //     scrollbarWidth: 'none',
                    //     msOverflowStyle: 'none',
                    // }}
                    className="px-0 py-0">
                    <div className="p-0">
                        {activeTab === 'personalDetails' && <NewPatient isModal={true} patientId={patientId} handleClosePatientModal={handleClosePatientModal} />}
                        {activeTab === 'responsible' && <Responsiblle patientId={patientId} />}
                        {activeTab === 'demographicDetails' && <Demographicdetails patientId={patientId} />}
                        {activeTab === 'referringDoctor' && <ReferringDoctor patientId={patientId} />}
                    </div>
                </Modal.Body>
            </Modal>
            <HolidayModal
                showModal={showHolidayModal}
                handleCloseModal={closeHolidayModal}
                setScheduledDate={setScheduledDate}
                scheduledDate={scheduledDate}
            />
            <ConsultationModal
                show={consultationModal}
                onClose={closeConsultationModal}
            />
            <Modal show={showPastDateModal} onHide={() => setShowPastDateModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Past Date Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You are scheduling an appointment for a past date. Do you want to continue?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='cancel-button' onClick={() => setShowPastDateModal(false)}>
                        Cancel
                    </Button>
                    <Button className='custom-buttons' onClick={() => {
                        setScheduledDate(pendingDate);
                        setShowPastDateModal(false);
                    }}>
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default React.memo(AppointmentForm);
