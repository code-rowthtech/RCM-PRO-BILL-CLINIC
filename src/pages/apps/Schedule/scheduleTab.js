import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Table, Spinner } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  createScheduleAction,
  getDoctorsListAction,
  getScheduleAction,
} from "../../../redux/schedule/action";
import { encryptMessage } from "../../../cryptoUtils";

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
    if (selectedDoctor) {
      const doctorInfo = JSON.parse(selectedDoctor || "{}");
      const filteredScheduleList = scheduleList.filter(
        (schedule) => schedule?.doctorId === doctorInfo?.id
      );

      if (filteredScheduleList.length > 0) {
        const firstSchedule = filteredScheduleList[0];
        setTime(firstSchedule.perPatientTime || "");
        setName(firstSchedule.name || "");

        firstSchedule?.availability?.forEach((schedule, index) => {
          setValue(
            `schedules.newSchedule.${index}.availableOn`,
            schedule.availableOn || "Not Available"
          );
          setValue(
            `schedules.newSchedule.${index}.availableFrom`,
            schedule.availableFrom || ""
          );
          setValue(
            `schedules.newSchedule.${index}.availableTo`,
            schedule.availableTo || ""
          );
        });
      } else {
        setTime("");
        setName("");

        scheduleList.forEach((schedule, index) => {
          setValue(`schedules.newSchedule.${index}.availableOn`, "");
          setValue(`schedules.newSchedule.${index}.availableFrom`, "");
          setValue(`schedules.newSchedule.${index}.availableTo`, "");
        });
      }
    } else {
      setTime("");
      setName("");
      scheduleList.forEach((schedule, index) => {
        setValue(`schedules.newSchedule.${index}.availableOn`, "");
        setValue(`schedules.newSchedule.${index}.availableFrom`, "");
        setValue(`schedules.newSchedule.${index}.availableTo`, "");
      });
    }
  }, [selectedDoctor, scheduleList, setValue]);

  const formatTime = (time) => {
    if (!time) return null;
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}:00`;
  };

  const onSubmit = (data) => {
    const doctorInfo = JSON.parse(selectedDoctor || "{}");
    const availability = days.map((day, index) => ({
      availableOn: day.day,
      availableFrom:
        formatTime(data.schedules?.newSchedule?.[index]?.availableFrom) ||
        "00:00:00",
      availableTo:
        formatTime(data.schedules?.newSchedule?.[index]?.availableTo) ||
        "00:00:00",
    }));

    const payload = {
      doctorId: doctorInfo.id,
      type: "Schedule",
      name: doctorInfo.name,
      perPatientTime: time,
      availability,
    };
    console.log({ payload })
    dispatch(createScheduleAction({ key: encryptMessage(payload) }));

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
        <div className="col-3 mb-1">
          <label htmlFor="doctorName" style={{ fontWeight: "bold" }}>
            Doctor Name<span className="text-danger">*</span>
          </label>
          <select
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
          </select>
        </div>

        <div className="col-3 mb-1">
          <label htmlFor="perPatientTime" style={{ fontWeight: "bold" }}>
            Per Patient Time (in minutes) <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="perPatientTime"
            className="form-control"
            value={time}
            onChange={(e) => setTime(e.target.value)}
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
