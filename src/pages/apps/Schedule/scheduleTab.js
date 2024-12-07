import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Table, Spinner } from 'react-bootstrap';
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { createScheduleAction, getDoctorsListAction, getScheduleAction } from '../../../redux/schedule/action';
import { encryptMessage } from '../../../cryptoUtils';

const ScheduleTab = () => {
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [time, setTime] = useState('');
    const [name, setName] = useState('');
    const doctorLists = store?.getDoctorsListReducer?.data?.result || [];
    const scheduleList = store?.getScheduleReducer?.data?.result || [];
    console.log({scheduleList})
    const isLoading = store?.getScheduleReducer?.loading;

    const { control, handleSubmit, setValue, register } = useForm();

    useEffect(() => {
        dispatch(getDoctorsListAction());
        dispatch(getScheduleAction({ type: 'Schedule', search: '', startDate: '', endDate: '' }));
    }, [dispatch]);

    const filteredScheduleList = scheduleList.filter(schedule => {
        const doctorInfo = JSON.parse(selectedDoctor || '{}');
        return schedule?.doctorId === doctorInfo?.id;
    });

    useEffect(() => {
        if (selectedDoctor) {
            const doctorInfo = JSON.parse(selectedDoctor || '{}');
            const filteredScheduleList = scheduleList.filter(schedule => schedule?.doctorId === doctorInfo?.id);

            if (filteredScheduleList.length > 0) {
                const firstSchedule = filteredScheduleList[0];
                setTime(firstSchedule.perPatientTime || '');
                setName(firstSchedule.name || '');

                firstSchedule?.availability?.forEach((schedule, index) => {
                    setValue(`schedules.${schedule._id}.${index}.availableOn`, schedule.availableOn || "Not Available");
                    setValue(`schedules.${schedule._id}.${index}.availableFrom`, schedule.availableFrom || '');
                    setValue(`schedules.${schedule._id}.${index}.availableTo`, schedule.availableTo || '');
                });
            } else {
                setTime('');
                setName('');

                scheduleList.forEach((schedule, index) => {
                    setValue(`schedules.${schedule._id}.${index}.availableOn`, '');
                    setValue(`schedules.${schedule._id}.${index}.availableFrom`, '');
                    setValue(`schedules.${schedule._id}.${index}.availableTo`, '');
                });
            }
        } else {
            setTime('');
            setName('');
            scheduleList.forEach((schedule, index) => {
                setValue(`schedules.${schedule._id}.${index}.availableOn`, '');
                setValue(`schedules.${schedule._id}.${index}.availableFrom`, '');
                setValue(`schedules.${schedule._id}.${index}.availableTo`, '');
            });
        }
    }, [selectedDoctor, scheduleList, setValue]);

    const onSubmit = (data) => {
        const doctorInfo = JSON.parse(selectedDoctor || '{}');

        const formatTime = (time) => {
            const [hours, minutes] = time.split(':');
            return `${hours}:${minutes}:00`; // Append seconds as `00`
        };

        const availability = data.schedules
            ? Object.values(data.schedules).map((schedule) =>
                Object.values(schedule).map((availability) => ({
                    availableOn: availability?.availableOn || "Unknown",
                    availableFrom: availability?.availableFrom ? formatTime(availability?.availableFrom) : "00:00:00",
                    availableTo: availability?.availableTo ? formatTime(availability?.availableTo) : "00:00:00",
                })))
            : [];

        const payload = {
            doctorId: doctorInfo.id,
            type: 'Schedule',
            name: doctorInfo.name,
            perPatientTime: time,
            availability: availability.flat(),
        };

        dispatch(createScheduleAction({ key: encryptMessage(payload) }));

        if (payload.availability.length > 0) {
            dispatch(getScheduleAction({
                type: 'Schedule',
                search: '',
                startDate: '',
                endDate: '',
            }));
        }
    };
const days = [
    { day: 'Monday' },
    { day: 'Tuesday' },
    { day: 'Wednesday' },
    { day: 'Thursday' },
    { day: 'Friday' },
    { day: 'Saturday' },
    { day: 'Sunday' },
];

const renderEmptyScheduleData = () => {
    return (
        <>
            {days?.map((day, index) => (
                <tr key={index}>
                    <td>
                        <input
                            type="text"
                            {...register(`schedules.newSchedule.${index}.availableOn`)}
                            className="form-control"
                            defaultValue={day.day}
                        />
                    </td>
                    <td>
                        <Controller
                            name={`schedules.newSchedule.${index}.availableFrom`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => <input type="time" className="form-control" placeholder="00:00:00" {...field} />}
                        />
                    </td>
                    <td>
                        <Controller
                            name={`schedules.newSchedule.${index}.availableTo`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => <input type="time" className="form-control" {...field} />}
                        />
                    </td>
                    <td className="text-center">
                        <FiEdit className="fs-4 ms-2" />
                    </td>
                </tr>
            ))}
        </>
    );
};

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h4>Edit Schedule</h4>

            {/* Select Doctor */}
            <div className="mb-3 w-50">
                <label htmlFor="doctorName" style={{ fontWeight: 'bold' }}>
                    Doctor Name<span className="text-danger">*</span>
                </label>
                <select
                    id="doctorName"
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        width: '100%',
                        marginTop: '10px',
                    }}
                >
                    <option value="">Select a doctor</option>
                    {doctorLists.map((doctor, index) => (
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

            {/* Per Patient Time */}
            <div className="my-3 w-50">
                <label htmlFor="perPatientTime" style={{ fontWeight: 'bold' }}>
                    Per Patient Time<span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    id="perPatientTime"
                    value={time}
                    placeholder='00:00:00'
                    onChange={(e) => setTime(e.target.value)}
                    style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        width: '100%',
                        marginTop: '10px',
                    }}
                />
            </div>

            {/* Schedule Table */}
            <div>
                {isLoading ? (
                    <div className="text-center mt-4">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <Table responsive className="table-centered table-nowrap mb-0 mt-3">
                        <thead className="text-white bg-dark">
                            <tr>
                                <th className="text-white">Available On</th>
                                <th className="text-white">Available From</th>
                                <th className="text-white">Available To</th>
                                <th className="text-white text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredScheduleList?.length > 0 ? (
                                filteredScheduleList?.map((schedule) =>
                                    schedule?.availability?.map((day, index) => (
                                        <tr key={`${schedule._id}-${day._id}`}>
                                            <td>
                                                <input
                                                    type="text"
                                                    defaultValue={day.availableOn || "Not Available"}
                                                    {...register(`schedules.${schedule._id}.${index}.availableOn`)}
                                                    className="form-control"
                                                />
                                            </td>
                                            <td>
                                                <Controller
                                                    name={`schedules.${schedule._id}.${index}.availableFrom`}
                                                    control={control}
                                                    defaultValue={day.availableFrom || ""}
                                                    render={({ field }) => <input type="time" className="form-control" placeholder="00:00:00" {...field} />}
                                                />
                                            </td>
                                            <td>
                                                <Controller
                                                    name={`schedules.${schedule._id}.${index}.availableTo`}
                                                    control={control}
                                                    defaultValue={day.availableTo || ""}
                                                    render={({ field }) => <input type="time" className="form-control" {...field} />}
                                                />
                                            </td>
                                            <td className="text-center">
                                                <FiEdit className="fs-4 ms-2" />
                                            </td>
                                        </tr>
                                    ))
                                )
                            ) : (
                                renderEmptyScheduleData()
                            )}
                        </tbody>
                    </Table>
                )}
            </div>

            {/* Submit Button */}
            <div className="text-center">
                <Button type="submit" className="btn btn-primary">
                    {isLoading ? "Saving..." : "Save Schedule"}
                </Button>
            </div>
        </form>
    );
};

export default ScheduleTab;
