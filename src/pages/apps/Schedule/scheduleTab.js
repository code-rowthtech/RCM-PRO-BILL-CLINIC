import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller, Form } from "react-hook-form";
import { Button, Table, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  createTimingsAction, getPractitionerTimingsAction, getScheduleAction, updateTimingsAction,
} from "../../../redux/schedule/action";
import { encryptMessage } from "../../../cryptoUtils";
import Select from 'react-select';
import { getDoctorsAction } from "../../../redux/actions";
import ToastHandle from "../../../helpers/ToastMessage";
const formatTimeTo12Hour = (time) => {
  if (!time) return null;

  let [hours, minutes] = time.split(":");
  hours = parseInt(hours, 10);
  let suffix = "AM";

  if (hours >= 12) {
    suffix = "PM";
    if (hours > 12) {
      hours = hours - 12;  // Convert hours from 24-hour format to 12-hour format
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

  if (period === "PM" && hour < 12) {
    hour += 12;
  } else if (period === "AM" && hour === 12) {
    hour = 0; // Midnight case
  }

  return `${String(hour).padStart(2, '0')}:${minutePart}`;
};
const ScheduleTab = () => {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  console.log(selectedDoctor, 'selectedDoctor')
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const [time, setTime] = useState("");
  const inputRefs = useRef([]);
  const { control, handleSubmit, setValue, register, reset } = useForm();
  const [doctorSearch, setDoctorSearch] = useState('');
  const [status, setStatus] = useState(true);
  const [days, setDays] = useState([
    { day: "Monday", slots: [{ startTime: '', endTime: '' }] },
    { day: "Tuesday", slots: [{ startTime: '', endTime: '' }] },
    { day: "Wednesday", slots: [{ startTime: '', endTime: '' }] },
    { day: "Thursday", slots: [{ startTime: '', endTime: '' }] },
    { day: "Friday", slots: [{ startTime: '', endTime: '' }] },
    { day: "Saturday", slots: [{ startTime: '', endTime: '' }] },
    { day: "Sunday", slots: [{ startTime: '', endTime: '' }] },
  ]);
  // const [selectedDoctor, setSelectedDoctor] = useState(null);
  const doctorDetails = store?.getDoctorsReducer?.data?.result;
  const doctorOptions = doctorDetails?.map((data) => ({
    value: data._id,
    label: data?.name[0]?.text + ' ',
  }));
  const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
  const practitionerTimings = store?.getPractitionerTimingsReducer?.data?.schedule;
  console.log(practitionerTimings, 'practitionerTimings')
  useEffect(() => {
    const payload = {
      search: doctorSearch,
      status: status,
    }
    dispatch(
      getDoctorsAction(payload)
    );
  }, [dispatch, doctorSearch]);
  useEffect(() => {
    if (selectedDoctor?.value) {
      const payload = {
        clinicId: clinicId,
        doctorId: selectedDoctor?.value
      }
      console.log({payload})
      dispatch(getPractitionerTimingsAction({ key: encryptMessage(payload) }))
      console.log(payload, 'payload')
    }
  }, [selectedDoctor])


  useEffect(() => {
    if (selectedDoctor && practitionerTimings?.availability) {
      setValue('perPatientTime', practitionerTimings?.perPatientTime);
      const updatedDays = days.map((day) => {
        const matchingAvailability = practitionerTimings.availability.find(
          (item) => item.day === day.day
        );
        return {
          ...day,
          slots: matchingAvailability?.slots.map((slot) => ({
            startTime: formatTo24Hour(slot.startTime) || "",
            endTime: formatTo24Hour(slot.endTime) || "",
          })) || [{ startTime: "", endTime: "" }],
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
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}:00`;
  };

  const onSubmit = (data) => {
    // Filter out days with empty start and end times
    const filteredDays = days.filter(day =>
      day.slots.some(slot => slot.startTime && slot.endTime)
    );
    const formattedDays = filteredDays.map(day => ({
      day: day.day,
      slots: day.slots.map(slot => ({
        startTime: formatTimeTo12Hour(slot.startTime),
        endTime: formatTimeTo12Hour(slot.endTime),
      }))
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
    console.log(payload,'payload')
  };



  const handleInputChange = (data, type) => {
    if (type === 'doctor') {
      setDoctorSearch(data)
    }
  }

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

      // Add new slot if no overlaps
      updatedDays[dayIndex].slots = [
        ...daySlots,
        { startTime: '', endTime: '' },
      ];
      return updatedDays;
    });
  };

  const handleRemoveSlot = (dayIndex, slotIndex) => {
    setDays((prevDays) => {
      const updatedDays = [...prevDays];
      if (updatedDays[dayIndex].slots.length > 1) {
        updatedDays[dayIndex].slots = updatedDays[dayIndex].slots.filter(
          (_, idx) => idx !== slotIndex
        );
      }
      return updatedDays;
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="mt-0 form_heading">Edit Schedule</p>

      <div className="row">
        <div className="col-md-3 col-sm-6 col-12 mb-1 responnsible-party-select">
          <label htmlFor="doctorName" className="form-label" style={{ fontWeight: "bold" }}>
            Doctor Name<span className="text-danger">*</span>
          </label>
          <Select
            className="basic-single"
            classNamePrefix="select"
            isLoading={store?.getDoctorsReducer?.loading}
            isClearable={true}
            isSearchable={true}
            onInputChange={(inputValue) => handleInputChange(inputValue, 'doctor')} // Pass inputValue and type
            onChange={(data) => handleSearchInputChange(data, 'doctor')}
            name="doctorName"
            options={doctorOptions}
            placeholder="Select Doctor"
          />
        </div>

        <div className="col-md-3 col-sm-6 col-12 mb-1 ">
          <label htmlFor="perPatientTime" className="form-label" style={{ fontWeight: "bold" }}>
            Per Patient Time (in minutes) <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="perPatientTime"
            className="form-control"
            {...register('perPatientTime')}
            defaultValue={time}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d{0,2}$/.test(value)) { // Matches numbers like "10", "10.", "10.0", "10.00"
                setTime(value);
              }
            }}
            placeholder="Enter time (e.g., 10.00)"
          />

        </div>
      </div>

      <Table striped className="mt-2">
        <thead>
          <tr>
            <th className="text-white">Available On</th>
            <th>
              <table className="schedule-table" style={{ width: "100%" }}>
                <thead>
                  <tr className="text-white">
                    <th style={{ width: "40%" }} className="pe-1">Available From</th>
                    <th style={{ width: "40%" }} className="ps-1">Available To</th>
                    <th style={{ width: "20%" }}>Action</th>
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
                  <input
                    className="form-control"
                    type="text"
                    value={day?.day}
                    readOnly
                  />
                </td>
                <td>
                  {/* Slot Table for Each Day */}
                  <table className="schedule-table" style={{ width: "100%" }}>
                    <tbody>
                      {day?.slots?.map((slot, slotIndex) => (
                        <tr key={slotIndex}>

                          <td style={{ width: "40%" }} className="text-black pe-1">
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
                                  updatedDays[dayIndex].slots[slotIndex].startTime = value;
                                  return updatedDays;
                                });
                              }}
                            />

                          </td>
                          <td style={{ width: "40%" }} className="ps-1">
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
                                  updatedDays[dayIndex].slots[slotIndex].endTime = value;
                                  return updatedDays;
                                });
                              }}
                            />

                          </td>
                          <td style={{ width: "20%" }}>
                            <span
                              className="uil-plus-circle plusicon fw-bold cursor-pointer"
                              onClick={() => handleAddSlots(dayIndex, slotIndex)}
                            >
                            </span>
                            {day.slots.length > 1 && (
                              <span
                                className="uil-minus-circle minusicon fw-bold cursor-pointer ms-2"
                                onClick={() => handleRemoveSlot(dayIndex, slotIndex)}
                              >
                              </span>
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

      <div className="d-flex justify-content-end">
        <Button className="custom-buttons" disabled={store?.createScheduleReducer?.loading} type="submit">
          {store?.updateTimingsReducer?.loading || store?.createTimingsReducer?.loading ?
            < Spinner className="spinner-border-sm" color="white" />
            :
            'Save Schedule'
          }
        </Button>
      </div>
    </form>
  );
};

export default ScheduleTab;
