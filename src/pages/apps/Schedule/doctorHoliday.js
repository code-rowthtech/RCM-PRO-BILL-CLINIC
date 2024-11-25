import React from 'react';
import { Table } from 'react-bootstrap';
import { RiDeleteBin5Line } from "react-icons/ri";

const DoctorHoliday = () => {
  // Sample data for the table
  const holidays = [
    { id: 1, doctorName: "Dr. John Doe", reason: "Vacation", date: "25/12/2023" },
    { id: 2, doctorName: "Dr. Jane Smith", reason: "Conference", date: "15/01/2024" },
    { id: 3, doctorName: "Dr. Emily Brown", reason: "Family Emergency", date: "10/02/2024" },
    { id: 4, doctorName: "Dr. Michael Green", reason: "Health Issues", date: "05/03/2024" },
    { id: 5, doctorName: "Dr. Sarah White", reason: "Training", date: "20/03/2024" },
    { id: 6, doctorName: "Dr. David Black", reason: "Research", date: "30/03/2024" },
  ];

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
          {holidays.map((holiday, index) => (
            <tr key={holiday.id}>
              <td>{index + 1}</td>
              <td>{holiday.doctorName}</td>
              <td>{holiday.reason}</td>
              <td>
                <span className="px-1 py-1 text-white bg-secondary rounded-2">
                  {holiday.date}
                </span>
              </td>
              <td>
                <RiDeleteBin5Line className="fs-4 ms-2" />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DoctorHoliday;
