import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Table, Spinner } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  createScheduleAction,
  createTimingsAction,
  getDoctorsListAction,
  getPractitionerTimingsAction,
  getScheduleAction,
} from "../../../redux/schedule/action";
import { encryptMessage } from "../../../cryptoUtils";
import Select from 'react-select';

const ScheduleTab = () => {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const [time, setTime] = useState("");
  console.log({ time })
  const [name, setName] = useState("");
  const doctorLists = store?.getDoctorsListReducer?.data?.result;
  const scheduleList = store?.getScheduleReducer?.data?.result || [];
  const isLoading = store?.getScheduleReducer?.loading;
  const [focusIndex, setFocusIndex] = useState(null);
  const inputRefs = useRef([]);
  const { control, handleSubmit, setValue, register } = useForm();
  const [doctorSearch, setDoctorSearch] = useState('');
  // const [selectedDoctor, setSelectedDoctor] = useState(null);
  const doctorDetails = store?.getDoctorsReducer?.data?.response;
  const doctorOptions = doctorDetails?.map((data) => ({
    value: data._id,
    label: data?.userDetails?.firstName + ' ' + data?.userDetails?.lastName,
  }));
  const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
  const practitionerTimings = store?.getPractitionerTimingsReducer?.data?.schedule;
  console.log(practitionerTimings, 'practitionerTimings')
  useEffect(() => {
    dispatch(getDoctorsListAction());
    dispatch(
      getScheduleAction({
        type: "Schedule",
        search: "",
        startDate: "",
        endDate: "",
      })
    );
  }, [dispatch]);
  useEffect(() => {
    if (selectedDoctor?.value) {
      const payload = {
        clinicId: clinicId,
        doctorId: selectedDoctor?.value
      }
      dispatch(getPractitionerTimingsAction({ key: encryptMessage(payload) }))
    }
  }, [selectedDoctor])

  // useEffect(() => {
  //   if (selectedDoctor) {
  //     // const doctorInfo = JSON.parse(selectedDoctor || "{}");
  //     const filteredScheduleList = scheduleList.filter(
  //       (schedule) => schedule?.doctorId === selectedDoctor?.value
  //     );

  //     if (filteredScheduleList.length > 0) {
  //       const firstSchedule = filteredScheduleList[0];
  //       setValue('perPatientTime', practitionerTimings?.[0]?.perPatientTime);
  //       setName(firstSchedule.name || "");

  //       firstSchedule?.availability?.forEach((schedule, index) => {
  //         setValue(
  //           `schedules.newSchedule.${index}.availableOn`,
  //           schedule.availableOn || "Not Available"
  //         );
  //         setValue(
  //           `schedules.newSchedule.${index}.availableFrom`,
  //           schedule.availableFrom || ""
  //         );
  //         setValue(
  //           `schedules.newSchedule.${index}.availableTo`,
  //           schedule.availableTo || ""
  //         );
  //       });
  //     } else {
  //       setTime("");
  //       setName("");

  //       scheduleList.forEach((schedule, index) => {
  //         setValue(`schedules.newSchedule.${index}.availableOn`, "");
  //         setValue(`schedules.newSchedule.${index}.availableFrom`, "");
  //         setValue(`schedules.newSchedule.${index}.availableTo`, "");
  //       });
  //     }
  //   } else {
  //     setTime("");
  //     setName("");
  //     scheduleList.forEach((schedule, index) => {
  //       setValue(`schedules.newSchedule.${index}.availableOn`, "");
  //       setValue(`schedules.newSchedule.${index}.availableFrom`, "");
  //       setValue(`schedules.newSchedule.${index}.availableTo`, "");
  //     });
  //   }
  // }, [selectedDoctor, scheduleList, setValue]);

  useEffect(() => {
    if (selectedDoctor && practitionerTimings?.length > 0) {
      setValue('perPatientTime', practitionerTimings?.[0]?.perPatientTime)
    }
  }, [selectedDoctor, practitionerTimings])
  const formatTime = (time) => {
    if (!time) return null;
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}:00`;
  };

  const onSubmit = (data) => {
    // const doctorInfo = JSON.parse(selectedDoctor || "{}");
    const availability = days.map((day, index) => ({
      day: day.day,
      slots: [
        {
          startTime: formatTime(data.schedules?.newSchedule?.[index]?.availableFrom),
          endTime: formatTime(data.schedules?.newSchedule?.[index]?.availableTo)
        }
      ]

    }));

    const payload = {
      doctorId: selectedDoctor?.value,
      name: selectedDoctor?.label,
      perPatientTime: data?.perPatientTime,
      availability: availability.filter(
        (day) => !(
          day.slots[0].startTime === null &&
          day.slots[0].endTime === null
        )
      ),
    };
    console.log(payload, '000000000000000000000')
    dispatch(createTimingsAction({ key: encryptMessage(payload) }));

    dispatch(
      getScheduleAction({
        type: "Schedule",
        search: "",
        startDate: "",
        endDate: "",
      })
    );
  };

  const days = [
    { day: "Monday" },
    { day: "Tuesday" },
    { day: "Wednesday" },
    { day: "Thursday" },
    { day: "Friday" },
    { day: "Saturday" },
    { day: "Sunday" },
  ];

  const handleEditClick = (index, fieldName) => {
    setFocusIndex({ index, fieldName }); // Update focus index
    setTimeout(() => {
      inputRefs.current[index]?.[fieldName]?.focus();
    }, 0);
  };

  const handleInputChange = (data, type) => {
    if (type === 'doctor') {
      setDoctorSearch(data)
    }
  }

  const handleSearchInputChange = (selectedOption, type) => {
    // setSelectedPatient(selectedOption, 'Selected Option');
    if (type === 'doctor') {
      setSelectedDoctor(selectedOption, 'Selected Option');
    }
  };
  const renderEmptyScheduleData = () => {
    return (
      <>
        {days && days?.map((day, index) => (
          <tr key={day.day}>
            <td>
              <input
                type="text"
                {...register(`schedules.newSchedule.${index}.availableOn`)}
                className="form-control"
                value={day?.day}
                disabled
              />
            </td>
            <td>
              <Controller
                name={`schedules.newSchedule.${index}.availableFrom`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    type="time"
                    className="form-control"
                    {...field}
                    ref={(el) => {
                      if (!inputRefs.current[index]) {
                        inputRefs.current[index] = {};
                      }
                      inputRefs.current[index]['availableFrom'] = el; // Assign the ref
                    }}
                    value={field.value || ""}
                  />
                )}
              />
            </td>
            <td>
              <Controller
                name={`schedules.newSchedule.${index}.availableTo`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input type="time" className="form-control" {...field}
                    ref={(el) => {
                      if (!inputRefs.current[index]) {
                        inputRefs.current[index] = {};
                      }
                      inputRefs.current[index]['availableTo'] = el; // Assign the ref
                    }}
                  />
                )}
              />
            </td>
            <td className="text-center">
              <div className="btn">
                <FiEdit className="fs-4 ms-2" onClick={() => handleEditClick(index, 'availableFrom')} />
              </div>
            </td>
          </tr>
        ))}
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h4 className="mt-0">Edit Schedule</h4>

      <div className="row">
        <div className="col-3 mb-1 responnsible-party-select">
          <label htmlFor="doctorName" style={{ fontWeight: "bold" }}>
            Doctor Name<span className="text-danger">*</span>
          </label>
          {/* <select
            id="doctorName"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          >
            <option value="">Select a doctor</option>
            {doctorLists?.map((doctor, index) => (
              <option
                key={index}
                value={JSON.stringify({
                  id: doctor?.userId?._id,
                  name: `${doctor?.userId?.firstName} ${doctor?.userId?.lastName}`,
                })}
              >
                {`${doctor?.userId?.firstName} ${doctor?.userId?.lastName}`}
              </option>
            ))}
          </select> */}
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

        <div className="col-3 mb-1 ">
          <label htmlFor="perPatientTime" style={{ fontWeight: "bold" }}>
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

      <Table striped className="mt-2 ">
        <thead>
          <tr>
            <th className="text-white">Available On</th>
            <th className="text-white">Available From</th>
            <th className="text-white">Available To</th>
            <th className="text-white">Action</th>
          </tr>
        </thead>
        <tbody>{renderEmptyScheduleData()}</tbody>
      </Table>

      <div className="d-flex justify-content-end">
        <Button variant="primary" disabled={store?.createScheduleReducer?.loading} type="submit">
          {store?.createScheduleReducer?.loading ?
            <Spinner className="spinner-border-sm" color="white" />
            :
            'Save Schedule'
          }
        </Button>
      </div>
    </form>
  );
};

export default ScheduleTab;
