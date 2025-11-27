import React, { useEffect } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { RiDeleteBin5Line } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { deleteScheduleAction, getScheduleAction } from '../../../redux/schedule/action';
const Breaks = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);

    const scheduleResponse = store?.getScheduleReducer?.data?.result || [];
    const isLoading = store?.getScheduleReducer?.loading;

    useEffect(() => {
        const payload = {
            startDate: '',
            endDate: '',
            type: "Break",
            search: ''
        };
        dispatch(getScheduleAction(payload));
    }, [dispatch]);

    const deleteHandle = (id) => {
        dispatch(deleteScheduleAction(id))
        const payload = {
            startDate: '',
            endDate: '',
            type: "Break",
            search: ''
        };
        dispatch(getScheduleAction(payload));
    }

    return (
        <div>
            <Table responsive className="table-centered table-nowrap mb-0">
                <thead className="text-white">
                    <tr>
                        {["Sr. No.", "Provider Name", "Break From", "Break To", "Day", "Action"]?.map((header, index) => (
                            <th className='text-white' key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="text-center">
                                <Spinner animation="border" role="status" />
                            </td>
                        </tr>
                    ) : scheduleResponse.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center">
                                <h3 className="my-5">No Data Found</h3>
                            </td>
                        </tr>
                    ) : (
                        scheduleResponse.map((breakItem, index) => (
                            <tr key={breakItem.id}>
                                <td>{index + 1}</td>
                                <td>{breakItem.name}</td>
                                <td>{breakItem.breakFrom}</td>
                                <td>{breakItem.breakTo}</td>
                                <td>
                                    {breakItem.breakDay}
                                </td>
                                <td>
                                    <RiDeleteBin5Line onClick={() => deleteHandle(breakItem?._id)} className="fs-4 text-danger ms-2 cursor-pointer" />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default Breaks;
