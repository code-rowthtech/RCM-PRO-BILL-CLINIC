import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Table } from 'react-bootstrap';
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorsListAction } from '../../../redux/schedule/action';

const ScheduleTab = () => {
    const [time, setTime] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const store = useSelector((state)=>state)
    const dispatch = useDispatch()
    const doctorLists = store?.getDoctorsListReducer?.data?.result;

    const { control, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            schedules: [
                { id: 1, availableOn: 'Monday', availableFrom: '08:00', availableTo: '17:00', doctorName: 'Dr. John Doe', reason: 'Vacation' },
                { id: 2, availableOn: 'Tuesday', availableFrom: '09:00', availableTo: '18:00', doctorName: 'Dr. Jane Smith', reason: 'Conference' },
                { id: 3, availableOn: 'Wednesday', availableFrom: '08:30', availableTo: '17:30', doctorName: 'Dr. Alex Johnson', reason: 'Checkup' },
                { id: 4, availableOn: 'Thursday', availableFrom: '10:00', availableTo: '19:00', doctorName: 'Dr. Emma Williams', reason: 'Research' },
                { id: 5, availableOn: 'Friday', availableFrom: '08:00', availableTo: '16:00', doctorName: 'Dr. Mike Davis', reason: 'Clinic' },
                { id: 6, availableOn: 'Saturday', availableFrom: '09:00', availableTo: '14:00', doctorName: 'Dr. Sarah Lee', reason: 'Routine Check' },
                { id: 7, availableOn: 'Sunday', availableFrom: '10:00', availableTo: '15:00', doctorName: 'Dr. Linda White', reason: 'Emergency' },
            ],
        },
    });

    const schedules = watch('schedules');

    const handleDoctorChange = (event) => {
        setSelectedDoctor(event.target.value);
    };
    useEffect(() => {
        dispatch(getDoctorsListAction());
    }, [dispatch]);

    const onSubmit = (data) => {
        console.log('Form Data:', data); // Logs all data, including updated schedules
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h4>Edit Schedule</h4>
            <div className='my-3'>
                <label htmlFor="doctorName" style={{ fontWeight: 'bold' }}>
                    Per Patient Time<span className="text-danger">*</span>
                </label>
                <input
                    type="time"
                    value={time}
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

            <div className="mb-3">
                <label htmlFor="doctorName" style={{ fontWeight: 'bold' }}>
                    Doctor Name<span className="text-danger">*</span>
                </label>
                <select
                    id="doctorName"
                    value={selectedDoctor}
                    onChange={handleDoctorChange}
                    style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        width: '100%',
                        marginTop: '10px',
                    }}
                >
                    <option value="">Select a doctor</option>
                    {doctorLists &&
                        doctorLists.map((doctor, index) => (
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

            <div>
                <Table responsive className="table-centered table-nowrap mb-0 mt-3">
                    <thead className="text-white">
                        <tr>
                            <th className="text-white">Available On</th>
                            <th className="text-white">Available From</th>
                            <th className="text-white">Available To</th>
                            <th className="text-white text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map((schedule, index) => (
                            <tr key={schedule.id}>
                                <td className='fw-bold'>{schedule.availableOn}</td>
                                <td>
                                    <Controller
                                        name={`schedules.${index}.availableFrom`}
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="time"
                                                className='w-100 px-2 py-1 rounded'
                                                {...field}
                                            />
                                        )}
                                    />
                                </td>
                                <td>
                                    <Controller
                                        name={`schedules.${index}.availableTo`}
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="time"
                                                className='w-100 px-2 py-1 rounded'
                                                {...field}
                                            />
                                        )}
                                    />
                                </td>
                                <td className='text-center'>
                                    <FiEdit className="fs-4 ms-2" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <div className='d-flex justify-content-end mt-3'>
                <Button type="submit" className='custom-buttons'>Save</Button>
            </div>
        </form>
    );
};

export default ScheduleTab;
