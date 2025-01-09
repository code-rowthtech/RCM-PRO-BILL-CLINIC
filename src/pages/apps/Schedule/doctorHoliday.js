import React, { useEffect } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { RiDeleteBin5Line } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { deleteScheduleAction, getScheduleAction } from '../../../redux/schedule/action';
import { encryptMessage } from '../../../cryptoUtils';
import { stateEmptydAction } from '../../../redux/actions';

const DoctorHoliday = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
  const scheduleResponse = store?.getScheduleReducer?.data?.holidays || [];
  const isLoading = store?.getScheduleReducer?.loading;
  const deleteResponse = store?.deleteScheduleReducer?.data?.response?.status;
  useEffect(() => {
    const payload = {
      clinicId: clinicId,
    };
    dispatch(getScheduleAction({ key: encryptMessage(payload) }));
  }, [dispatch]);
  useEffect(() => {
    if (deleteResponse === 200) {
      dispatch(stateEmptydAction())
      const payload = {
        clinicId: clinicId,
      };
      dispatch(getScheduleAction({ key: encryptMessage(payload) }));
    }
  }, [deleteResponse]);


  const deleteHandle = (id) => {
    dispatch(deleteScheduleAction(id))
  }
  return (
    <div>
      <Table responsive  className="table-centered table-nowrap mb-0  rounded"
              style={{ height: scheduleResponse?.length === 0 ? '90vh' : 'auto' }}>
        <thead className="text-white">
          <tr>
            <th className="text-white py-2"  style={{ fontSize: '13px' }}>Sr.No.</th>
            <th className="text-white py-2"  style={{ fontSize: '13px' }}>Doctor Name</th>
            <th className="text-white py-2"  style={{ fontSize: '13px' }}>Reason</th>
            <th className="text-white py-2"  style={{ fontSize: '13px' }}>Date</th>
            <th className="text-white py-2"  style={{ fontSize: '13px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="text-center " >
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
              <tr key={holiday?.id || index}>
                <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>{index + 1}</td>
                <td className='text-capitalize py-1' style={{ fontSize: '13px', fontWeight: '400' }}>{holiday?.doctorId?.userId?.firstName + ' ' + holiday?.doctorId?.userId?.lastName}</td>
                <td className='text-capitalize py-1' style={{ fontSize: '13px', fontWeight: '400' }}>{holiday?.reason ? holiday?.reason : 'N/A'}</td>
                <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>
                  <div className=" py-1 text-white text-center bg-secondary rounded-2" style={{ width: '100px' }}>
                    {new Date(holiday?.date).toLocaleDateString('en-GB')}
                  </div>
                </td>
                <td className='py-1' style={{ fontSize: '13px', fontWeight: '400' }}>
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
