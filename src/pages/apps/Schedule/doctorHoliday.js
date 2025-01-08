import React, { useEffect } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { RiDeleteBin5Line } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { deleteScheduleAction, getScheduleAction } from '../../../redux/schedule/action';

const DoctorHoliday = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);

  const scheduleResponse = store?.getScheduleReducer?.data?.result || [];
  const isLoading = store?.getScheduleReducer?.loading;

  useEffect(() => {
    const payload = {
      startDate: '',
      endDate: '',
      type: "Holiday",
      search: ''
    };
    dispatch(getScheduleAction(payload));
  }, [dispatch]);


  const deleteHandle = (id) => {
    dispatch(deleteScheduleAction(id))
    const payload = {
      startDate: '',
      endDate: '',
      type: "Holiday",
      search: ''
    };
    dispatch(getScheduleAction(payload));
  }
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
                <td>{holiday.reason ? holiday.reason : 'NAN'}</td>
                <td>
                  <div className=" py-1 text-white text-center bg-secondary rounded-2" style={{ width: '100px' }}>
                    {new Date(holiday.fromDate).toLocaleDateString('en-GB')}
                  </div>
                </td>
                <td>
                  <RiDeleteBin5Line onClick={() => deleteHandle(holiday?._id)} className="fs-4 text-danger ms-2 cursor-pointer" />
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
