import React, { useEffect } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { RiDeleteBin5Line } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { getScheduleAction } from '../../../redux/schedule/action';
const Breaks = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);

    const scheduleResponse = store?.getScheduleReducer?.data?.result || [];
    console.log(scheduleResponse, 'break')
    const isLoading = store?.getScheduleReducer?.loading;

    useEffect(() => {
        const payload = {
            startDate: '',
            endDate: '',
            flag: "Break",
            search: ''
        };
        dispatch(getScheduleAction(payload));
    }, [dispatch]);

    return (
        <div>
            <Table responsive className="table-centered table-nowrap mb-0">
                <thead className="text-white">
                    <tr>
                        <th className="text-white">Sr.No.</th>
                        <th className="text-white">Doctor Name</th>
                        <th className="text-white">Break From</th>
                        <th className="text-white">Break To</th>
                        <th className="text-white">Day</th>
                        <th className="text-white">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={5} className="text-center">
                                <Spinner animation="border" role="status" />
                            </td>
                        </tr>
                    ) : scheduleResponse.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center">
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
                                    <RiDeleteBin5Line className="fs-4 ms-2" />
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
