import React, { useEffect } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { RiDeleteBin5Line } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { getScheduleAction } from '../../../redux/schedule/action';
const Breaks = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);

    const scheduleResponse = store?.getScheduleReducer?.data?.result || [];
    const isLoading = store?.getScheduleReducer?.loading;

    useEffect(() => {
        dispatch(getScheduleAction({ flag: "Break" }));
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
                        <th className="text-white">Date</th>
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
                                <td>{breakItem.doctorName}</td>
                                <td>{breakItem.breakFrom}</td>
                                <td>{breakItem.breakTo}</td>
                                <td>
                                    <span className="px-1 py-1 text-white bg-secondary rounded-2">
                                        {breakItem.date}
                                    </span></td>
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
