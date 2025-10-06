import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { getAppointmentsAction } from '../../../../redux/appointments/action';
import Spinner from '../../../../constants/Spinner';
import Paginations from '../../../../helpers/Paginations';
import AppointmentRow from './sections/AppointmentRow';

const AppointmentsList = ({ appointmentPeriod, setSkip, skip, selectedDoctor, clinicId }) => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  
  const appointmentsList = store?.getAppointmentsReducer?.data?.appointments;
  const loading = store?.getAppointmentsReducer?.loading;
  const totalPages = store?.getAppointmentsReducer?.data?.pagination?.totalPages;

  useEffect(() => {
    dispatch(getAppointmentsAction({
      clinicId: clinicId,
      doctorId: selectedDoctor?.value || '',
      status: appointmentPeriod,
      skip: skip,
      limit: 10,
    }));
  }, [dispatch, selectedDoctor, appointmentPeriod, skip, clinicId]);

  const handlePageChange = (pageNumber) => {
    setSkip(pageNumber);
  };

  const tableHeaders = [
    "Sr.No.", "Status", "Patient", "Booked Slot", 
    "Date", "Provider", "Type", "Reason", "Action"
  ];

  const renderTableContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={tableHeaders.length} className="text-center">
            <Spinner />
          </td>
        </tr>
      );
    }

    if (!appointmentsList || appointmentsList.length === 0) {
      return (
        <tr>
          <td colSpan={tableHeaders.length} className="text-center">
            <h5>No Appointments Found</h5>
          </td>
        </tr>
      );
    }

    return appointmentsList.map((appointment, index) => (
      <AppointmentRow
        key={appointment._id || index}
        appointment={appointment}
        index={index}
        appointmentPeriod={appointmentPeriod}
        skip={skip}
        clinicId={clinicId}
      />
    ));
  };

  return (
    <div className="scroll-container mt-2" style={{ height: '69vh', overflowY: 'auto' }}>
      <Table responsive className="table-centered mb-0 rounded">
        <thead className="text-white">
          <tr>
            {tableHeaders.map((header, index) => (
              <th key={index} className="text-white">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {renderTableContent()}
        </tbody>
      </Table>
      
      <div className="col-12">
        <div className="mt-2 d-flex justify-content-end">
          <Paginations
            currentPage={skip}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentsList;