import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { getPatientsAccessLogsAction } from '../../../../redux/actions';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Paginations from '../../../../helpers/Paginations';
import DatePicker from 'react-datepicker';
import Spinner from '../../../../constants/Spinner';

const PatientAccess = () => {

    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [skip, setSkip] = useState(1);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const PatientAccessLogs = store?.getPatientsAccessLogsReducer?.data?.data;

    const handlePageChange = (pageNumber) => {
        setSkip(pageNumber);
    };

    const handleChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    useEffect(() => {
        dispatch(getPatientsAccessLogsAction(({ patientId: id, page: skip, limit: 12, startDate: startDate || '', endDate: endDate || '', })));
    }, [dispatch, skip, startDate, endDate]);

    return (
        <div>
            <div className='d-flex justify-content-between'>
                <h5>Patient Access History</h5>
                <div className='d-flex gap-2'>
                    <div>
                        <DatePicker
                            selected={startDate}
                            onChange={handleChange}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            isClearable
                            placeholderText="Select a date range"
                            className="date-picker-input border-0 "
                        />
                    </div>
                    {/* <div style={{ width: '200px' }}>
                        <Form.Select aria-label="Filter Options" >
                            <option hidden >Action Taken</option>
                            <option value="View">View</option>
                            <option value="Edit">Edit</option>
                            <option value="Delete">Delete</option>
                        </Form.Select>
                    </div> */}
                </div>
            </div>
            <div>
                <Table responsive className="table-centered table-nowrap mb-0">
                    <thead className="text-white bg-dark">
                        <tr>
                            <th className="text-white">User Name</th>
                            <th className="text-white">User Role</th>
                            <th className="text-white">Action Taken</th>
                            <th className="text-white">Resource Accessed</th>
                            <th className="text-white">Time</th>
                            <th className="text-white">Device Address</th>
                        </tr>
                    </thead>
                    {PatientAccessLogs && PatientAccessLogs?.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center">
                                <h3 className="my-5">No Data Found</h3>
                            </td>
                        </tr>
                    ) : (
                        <tbody>
                            {store?.getPatientsAccessLogsReducer?.loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        <Spinner />
                                    </td>
                                </tr>
                            ) : (
                                PatientAccessLogs?.map((data, index) => (
                                    <tr key={index}>
                                        <td className="text-capitalize">{data?.userId?.name?.text}</td>
                                        <td className="text-capitalize">{data.role === 'clinic' ? 'Admin' : data.role}</td>
                                        <td className="text-capitalize">{data.actionTaken}</td>
                                        <td className="text-capitalize">{data.resourceAccessed}</td>
                                        <td className="text-capitalize">
                                            {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                        </td>
                                        <td className="text-capitalize">{data.ipAddress}</td>
                                    </tr>
                                )))}
                        </tbody>
                    )}
                </Table>
            </div>
            <div className="mt-2 d-flex justify-content-end">
                <Paginations
                    currentPage={skip}
                    totalPages={store?.getPatientsAccessLogsReducer?.data?.pagination?.pages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    )
}

export default PatientAccess
