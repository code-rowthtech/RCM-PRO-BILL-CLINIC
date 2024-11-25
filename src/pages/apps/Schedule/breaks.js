import React from 'react';
import { Table } from 'react-bootstrap';
import { RiDeleteBin5Line } from "react-icons/ri";

const Breaks = () => {
    // Sample data for the table
    const breaks = [
        { id: 1, doctorName: "Dr. John Doe", breakFrom: "14:00:00", breakTo: "15:00:00", date: "2023-12-25" },
        { id: 2, doctorName: "Dr. Jane Smith", breakFrom: "10:00:00", breakTo: "12:00:00", date: "2023-12-26" },
        { id: 3, doctorName: "Dr. Emily Brown", breakFrom: "16:30:00", breakTo: "17:30:00", date: "2023-12-27" },
        { id: 4, doctorName: "Dr. Michael Green", breakFrom: "13:00:00", breakTo: "14:30:00", date: "2023-12-28" },
        { id: 5, doctorName: "Dr. Sarah White", breakFrom: "09:00:00", breakTo: "10:00:00", date: "2023-12-29" },
        { id: 6, doctorName: "Dr. David Black", breakFrom: "18:00:00", breakTo: "19:00:00", date: "2023-12-30" },
    ];

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
                    {breaks.map((breakItem, index) => (
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
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Breaks;
