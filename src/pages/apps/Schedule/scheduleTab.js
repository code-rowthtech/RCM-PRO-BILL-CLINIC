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
    const isLoading = store?.getScheduleReducer?.loading;

    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

    const { control, handleSubmit, setValue, register } = useForm();

    useEffect(() => {
        dispatch(getDoctorsListAction());
        dispatch(getScheduleAction({ flag: 'Schedule' }));
        if (scheduleList.length > 0) {
            const firstSchedule = scheduleList[0];
            setTime(firstSchedule.perPatientTime || "");
            setName(firstSchedule.name || "");
        }
    }, [dispatch]);

    const onSubmit = (data) => {
        const doctorInfo = JSON.parse(selectedDoctor || '{}');
        const availability = Array.isArray(data.schedules) 
            ? data.schedules.map((schedule) => ({
                  availableOn: schedule.availableOn,
                  availableFrom: schedule.availableFrom,
                  availableTo: schedule.availableTo,
            }))
            : [];  
    
        const payload = {
            doctorId: doctorInfo.id,
            name: doctorInfo.name,
            clinicId: clinic_id,
            perPatientTime: time,
            availability: availability,
        };
    
        dispatch(createScheduleAction({ key: encryptMessage(payload) }));
        dispatch(getScheduleAction({ flag: 'Schedule' }));
    };
    

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h4>Edit Schedule</h4>

            {/* Per Patient Time */}
            <div className="my-3">
                <label htmlFor="perPatientTime" style={{ fontWeight: 'bold' }}>
                    Per Patient Time<span className="text-danger">*</span>
                </label>
                <input
                    type="time"
                    id="perPatientTime"
                    value={time} 
                    defaultValue={time}
                    onChange={(e) => setTime(e.target.value)} // Update state when value changes
                    style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        width: '100%',
                        marginTop: '10px',
                    }}
                />
            </div>

            {/* Select Doctor */}
            <div className="mb-3">
                <label htmlFor="doctorName" style={{ fontWeight: 'bold' }}>
                    Doctor Name<span className="text-danger">*</span>
                </label>
                <select
                    id="doctorName"
                    value={selectedDoctor} // Use selectedDoctor state here
                    onChange={(e) => setSelectedDoctor(e.target.value)} // Update state when value changes
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
                            {scheduleList?.map((schedule) =>
                                schedule?.availability?.length > 0 ? (
                                    schedule?.availability?.map((day, index) => (
                                        <tr key={`${schedule._id}-${day._id}`}>
                                            <td>
                                                <input
                                                    type="text"
                                                    disabled
                                                    defaultValue={day.availableOn || ""}
                                                    {...register(`schedules.${schedule._id}.${index}.availableOn`)}
                                                    className="form-control"
                                                />
                                            </td>
                                            <td>
                                                <Controller
                                                    name={`schedules.${schedule._id}.${index}.availableFrom`}
                                                    control={control}
                                                    defaultValue={day.availableFrom || ""}
                                                    render={({ field }) => (
                                                        <input type="time" className="form-control" {...field} />
                                                    )}
                                                />
                                            </td>
                                            <td>
                                                <Controller
                                                    name={`schedules.${schedule._id}.${index}.availableTo`}
                                                    control={control}
                                                    defaultValue={day.availableTo || ""}
                                                    render={({ field }) => (
                                                        <input type="time" className="form-control" {...field} />
                                                    )}
                                                />
                                            </td>
                                            <td className="text-center">
                                                <FiEdit className="fs-4 ms-2" />
                                            </td>
                                        </tr>
                                    ))
                                ) : null
                            )}
                        </tbody>

                    </Table>
                )}
            </div>

            {/* Save Button */}
            <div className="d-flex justify-content-end mt-3">
                <Button type="submit" className="btn btn-primary">
                    Save
                </Button>
            </div>
        </form>
    );
};

export default ScheduleTab;
