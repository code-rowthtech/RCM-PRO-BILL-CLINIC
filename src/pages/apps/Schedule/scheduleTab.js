import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Table, Spinner, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    createTimingsAction,
    getPractitionerTimingsAction,
    getScheduleAction,
    updateTimingsAction,
} from '../../../redux/schedule/action';
import { decryptMessage, encryptMessage } from '../../../cryptoUtils';
import Select from 'react-select';
import { getDoctorsAction } from '../../../redux/actions';
import ToastHandle from '../../../helpers/ToastMessage';
const formatTimeTo12Hour = (time) => {
    if (!time) return null;

    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    let suffix = 'AM';

    if (hours >= 12) {
        suffix = 'PM';
        if (hours > 12) {
            hours = hours - 12; // Convert hours from 24-hour format to 12-hour format
        }
    } else if (hours === 0) {
        hours = 12; // Midnight is represented as 12 AM
    }

    return `${hours}:${minutes} ${suffix}`;
};

const formatTo24Hour = (time) => {
    if (!time) return '';

    let [hour, minute] = time.split(':');
    let [minutePart, period] = minute.split(' ');
    hour = parseInt(hour, 10);

    if (period === 'PM' && hour < 12) {
        hour += 12;
    } else if (period === 'AM' && hour === 12) {
        hour = 0; // Midnight case
    }

    return `${String(hour).padStart(2, '0')}:${minutePart}`;
};
const ScheduleTab = () => {
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [time, setTime] = useState('');
    const inputRefs = useRef([]);
    const { control, handleSubmit, setValue, register, reset } = useForm();
    const [doctorSearch, setDoctorSearch] = useState('');
    const [status, setStatus] = useState(true);
    const [days, setDays] = useState([
        { day: 'Monday', slots: [{ startTime: '', endTime: '' }] },
        { day: 'Tuesday', slots: [{ startTime: '', endTime: '' }] },
        { day: 'Wednesday', slots: [{ startTime: '', endTime: '' }] },
        { day: 'Thursday', slots: [{ startTime: '', endTime: '' }] },
        { day: 'Friday', slots: [{ startTime: '', endTime: '' }] },
        { day: 'Saturday', slots: [{ startTime: '', endTime: '' }] },
        { day: 'Sunday', slots: [{ startTime: '', endTime: '' }] },
    ]);
    // const [selectedDoctor, setSelectedDoctor] = useState(null);
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const doctorOptions = doctorDetails?.map((data) => ({
        value: data._id,
        label: (data?.name?.[0]?.prefix?.[0]
            ? data?.name?.[0]?.prefix?.[0] + ' '
            : '') +
            (data?.name?.[0]?.family || '') +
            (data?.name?.[0]?.given?.length > 0
                ? ' ' + data?.name?.[0]?.given?.join(' ')
                : '') + ' ' +
            (data?.identifier?.find((tel) => tel?.type?.coding?.[0]?.code === 'NPI')?.value ?
                `(******${data?.identifier?.find((tel) => tel?.type?.coding?.[0]?.code === 'NPI')?.value.slice(-4)})`
                : '') || ''
    }));

    // const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const clinicId = decryptMessage(localStorage?.getItem('subClinicLocation')) || '';
    const practitionerTimings = store?.getPractitionerTimingsReducer?.data?.schedule;
    useEffect(() => {
        const payload = {
            search: doctorSearch,
            status: status,
        };
        dispatch(getDoctorsAction(payload));
    }, [dispatch, doctorSearch]);
    useEffect(() => {
        if (selectedDoctor?.value) {
            setDays([
                { day: 'Monday', slots: [{ startTime: '', endTime: '' }] },
                { day: 'Tuesday', slots: [{ startTime: '', endTime: '' }] },
                { day: 'Wednesday', slots: [{ startTime: '', endTime: '' }] },
                { day: 'Thursday', slots: [{ startTime: '', endTime: '' }] },
                { day: 'Friday', slots: [{ startTime: '', endTime: '' }] },
                { day: 'Saturday', slots: [{ startTime: '', endTime: '' }] },
                { day: 'Sunday', slots: [{ startTime: '', endTime: '' }] },
            ]);
            const payload = {
                clinicId: clinicId,
                doctorId: selectedDoctor?.value,
            };
            dispatch(getPractitionerTimingsAction({ key: encryptMessage(payload) }));
        }
    }, [selectedDoctor]);

    useEffect(() => {
        if (selectedDoctor && practitionerTimings?.availability) {
            setValue('perPatientTime', practitionerTimings?.perPatientTime);
            const updatedDays = days.map((day) => {
                const matchingAvailability = practitionerTimings.availability.find((item) => item.day === day.day);
                return {
                    ...day,
                    slots: matchingAvailability?.slots.map((slot) => ({
                        startTime: formatTo24Hour(slot.startTime) || '',
                        endTime: formatTo24Hour(slot.endTime) || '',
                    })) || [{ startTime: '', endTime: '' }],
                };
            });

            // Only update state if `updatedDays` is different from current `days`
            if (JSON.stringify(updatedDays) !== JSON.stringify(days)) {
                setDays(updatedDays);
            }
        } else {
            reset();
        }
        // Removed `days` from dependency array
    }, [selectedDoctor, practitionerTimings, reset]);

    const formatTime = (time) => {
        if (!time) return null;
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}:00`;
    };

    const onSubmit = (data) => {
        // Filter out days with empty start and end times
        const filteredDays = days.filter((day) => day.slots.some((slot) => slot.startTime && slot.endTime));
        const formattedDays = filteredDays.map((day) => ({
            day: day.day,
            slots: day.slots.map((slot) => ({
                startTime: formatTimeTo12Hour(slot.startTime),
                endTime: formatTimeTo12Hour(slot.endTime),
            })),
        }));
        const payload = {
            ...(selectedDoctor && practitionerTimings?.availability ? { scheduleId: practitionerTimings?._id } : {}),
            doctorId: selectedDoctor?.value,
            name: selectedDoctor?.label,
            perPatientTime: data?.perPatientTime,
            availability: formattedDays,
        };

        if (selectedDoctor && practitionerTimings?.availability) {
            dispatch(updateTimingsAction({ key: encryptMessage(payload) }));
        } else {
            dispatch(createTimingsAction({ key: encryptMessage(payload) }));
        }
    };

    const handleInputChange = (data, type) => {
        if (type === 'doctor') {
            setDoctorSearch(data);
        }
    };

    const handleSearchInputChange = (selectedOption, type) => {
        if (type === 'doctor') {
            setSelectedDoctor(selectedOption, 'Selected Option');
        }
    };

    const handleAddSlots = (dayIndex) => {
        setDays((prevDays) => {
            const updatedDays = [...prevDays];
            const daySlots = updatedDays[dayIndex].slots;

            // Check for overlapping slots
            const hasOverlap = daySlots.some((slot, idx1) =>
                daySlots.some((slotToCompare, idx2) => {
                    if (idx1 !== idx2) {
                        const start1 = slot.startTime || '';
                        const end1 = slot.endTime || '';
                        const start2 = slotToCompare.startTime || '';
                        const end2 = slotToCompare.endTime || '';
                        return start1 < end2 && start2 < end1;
                    }
                    return false;
                })
            );

            if (hasOverlap) {
                ToastHandle(`Overlapping time ranges detected for day ${updatedDays[dayIndex].day}.`, 'danger');
                return prevDays;
            }

            // Limit slots to 10
            if (daySlots.length >= 5) {
                ToastHandle('You have reached the maximum limit of 5 slots.', 'danger');
                return prevDays;
            }

            // Add new slot if no overlaps and the limit is not reached
            updatedDays[dayIndex].slots = [...daySlots, { startTime: '', endTime: '' }];
            return updatedDays;
        });
    };

    const handleRemoveSlot = (dayIndex, slotIndex) => {
        setDays((prevDays) => {
            const updatedDays = [...prevDays];
            if (updatedDays[dayIndex].slots.length > 1) {
                updatedDays[dayIndex].slots = updatedDays[dayIndex].slots.filter((_, idx) => idx !== slotIndex);
            }
            return updatedDays;
        });
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* <p className="mt-0 form_heading">Edit Schedule</p> */}
            <div className="row">
                <Col sm={3}>
                    <Form.Group>
                        <Form.Label className="mb-0">
                            Provider Name <span className="text-danger ">*</span>
                        </Form.Label>
                        <Select
                            options={doctorOptions || []} // Use the formatted array
                            isLoading={store?.getDoctorsReducer?.loading}
                            isSearchable={true}
                            isClearable={true}
                            onInputChange={(inputValue) => handleInputChange(inputValue, 'doctor')} // Pass inputValue and type
                            onChange={(data) => handleSearchInputChange(data, 'doctor')}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="&nbsp; Select "
                            name="doctorName"
                            value={selectedDoctor}
                            getOptionLabel={(e) => e.label.replace(/\b\w/g, (char) => char.toUpperCase())}
                            filterOption={() => true}
                            noOptionsMessage={() => 'No providers found'}
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

                <div className="col-md-3 col-sm-6 col-12 mb-1">
                    <label htmlFor="perPatientTime" className="form-label mb-0" style={{ fontWeight: 'bold' }}>
                        Per Patient Time (in minutes) <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        id="perPatientTime"
                        className="form-control"
                        {...register('perPatientTime')}
                        defaultValue={time}
                        onChange={(e) => {
                            let value = e.target.value;
                            // Remove any non-digit and non-decimal characters
                            value = value.replace(/[^\d.]/g, '');
                            // Ensure only one decimal point
                            const parts = value.split('.');
                            if (parts.length > 2) {
                                value = parts[0] + '.' + parts.slice(1).join('');
                            }
                            // Limit to 3 digits before decimal
                            if (parts[0].length > 3) {
                                parts[0] = parts[0].slice(0, 3);
                                value = parts.join('.');
                            }
                            // Limit to 2 digits after decimal
                            if (parts[1] && parts[1].length > 2) {
                                parts[1] = parts[1].slice(0, 2);
                                value = parts.join('.');
                            }
                            e.target.value = value;
                            setTime(value);
                        }}
                        placeholder="Enter time (e.g., 10.00)"
                        maxLength={6}
                    />
                </div>
            </div>
            <div className=" scroll-container" style={{ height: '60vh' }}>
                <Table striped className="mt-2">
                    <thead>
                        <tr>
                            <th className="text-white">Available On</th>
                            <th>
                                <table className="schedule-table" style={{ width: '100%' }}>
                                    <thead>
                                        <tr className="text-white">
                                            <th style={{ width: '40%' }} className="pe-1">
                                                Available From
                                            </th>
                                            <th style={{ width: '40%' }} className="ps-1">
                                                Available To
                                            </th>
                                            <th style={{ width: '20%' }}>Action</th>
                                        </tr>
                                    </thead>
                                </table>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Loading State */}
                        {store?.getPractitionerTimingsReducer?.loading ? (
                            <tr>
                                <td className="text-center" colSpan={2}>
                                    <Spinner />
                                </td>
                            </tr>
                        ) : (
                            days?.map((day, dayIndex) => (
                                <tr key={dayIndex}>
                                    <td>
                                        {/* Day Name */}
                                        <input className="form-control" type="text" value={day?.day} readOnly />
                                    </td>
                                    <td>
                                        {/* Slot Table for Each Day */}
                                        <table className="schedule-table" style={{ width: '100%' }}>
                                            <tbody>
                                                {day?.slots?.map((slot, slotIndex) => (
                                                    <tr key={slotIndex}>
                                                        <td style={{ width: '40%' }} className="text-black pe-1">
                                                            {/* <input
                              className="form-control"
                              type="time"
                              defaultValue={slot?.startTime}
                            /> */}
                                                            <input
                                                                className="form-control"
                                                                type="time"
                                                                value={slot.startTime || ''}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    setDays((prevDays) => {
                                                                        const updatedDays = [...prevDays];
                                                                        updatedDays[dayIndex].slots[
                                                                            slotIndex
                                                                        ].startTime = value;
                                                                        return updatedDays;
                                                                    });
                                                                }}
                                                            />
                                                        </td>
                                                        <td style={{ width: '40%' }} className="ps-1">
                                                            {/* <input
                              className="form-control"
                              type="time"
                              defaultValue={slot?.endTime}
                            // value={slot?.endTime}
                            /> */}
                                                            <input
                                                                className="form-control"
                                                                type="time"
                                                                value={slot.endTime || ''}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    setDays((prevDays) => {
                                                                        const updatedDays = [...prevDays];
                                                                        updatedDays[dayIndex].slots[slotIndex].endTime =
                                                                            value;
                                                                        return updatedDays;
                                                                    });
                                                                }}
                                                            />
                                                        </td>
                                                        <td style={{ width: '20%' }}>
                                                            <span
                                                                className={`uil-plus-circle plusicon fw-bold cursor-pointer ${day.slots.length >= 10 ? 'disabled' : ''
                                                                    }`}
                                                                onClick={() =>
                                                                    day.slots.length < 10 && handleAddSlots(dayIndex)
                                                                }></span>
                                                            {day.slots.length > 1 && (
                                                                <span
                                                                    className="uil-minus-circle minusicon fw-bold cursor-pointer ms-2"
                                                                    onClick={() =>
                                                                        handleRemoveSlot(dayIndex, slotIndex)
                                                                    }></span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </div>

            <div className="d-flex justify-content-end pt-1">
                <Button className="custom-buttons" disabled={store?.createScheduleReducer?.loading} type="submit">
                    {store?.updateTimingsReducer?.loading || store?.createTimingsReducer?.loading ? (
                        <Spinner className="spinner-border-sm" color="white" />
                    ) : (
                        'Save Schedule'
                    )}
                </Button>
            </div>
        </form>
    );
};

export default ScheduleTab;
