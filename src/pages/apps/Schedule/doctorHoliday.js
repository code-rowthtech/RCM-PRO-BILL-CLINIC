import React, { useEffect } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { RiDeleteBin5Line } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { getScheduleAction } from '../../../redux/schedule/action';

const DoctorHoliday = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);

  const scheduleResponse = store?.getScheduleReducer?.data?.result || [];
  console.log(scheduleResponse,' scheduleResponse')
  const isLoading = store?.getScheduleReducer?.loading;

  useEffect(() => {
    dispatch(getScheduleAction({ flag: "Holiday" }));
  }, [dispatch]);

  return (
    <div>
      <Table responsive className="table-centered table-nowrap mb-0">
        <thead className="text-white">
          <tr>
            <th className="text-white">Sr.No.</th>
            <th className="text-white">Doctor Name</th>
            <th className="text-white">Reason</th>
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
            scheduleResponse.map((holiday, index) => (
              <tr key={holiday.id || index}>
                <td>{index + 1}</td>
                <td>{holiday.name}</td>
                <td>{holiday.reason}</td>
                <td>
                  <span className="px-2 py-1 text-white bg-secondary rounded-2">
                    {new Date(holiday.fromDate).toLocaleDateString()}
                  </span>
                </td>
                <td>
                  <RiDeleteBin5Line className="fs-4 text-danger ms-2 cursor-pointer" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default DoctorHoliday;
