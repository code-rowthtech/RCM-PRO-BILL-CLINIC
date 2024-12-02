import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { Button, ButtonGroup, Col, Container, Row, Table } from "react-bootstrap";
import { FiEdit, FiTrash, FiUploadCloud } from "react-icons/fi";

const Documents = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const navigate = useNavigate();
  const handleNewDoctor = () => {
    navigate("/doctor");
  };
  return (
    <>
     <Container fluid >
     <Row>

<Col>
    <Table responsive className="table-centered mt-4 table-nowrap mb-0">
        <thead className="text-white">
            <tr className=''>
                <th className='text-white'>CONTRACT NAME</th>
                <th className='text-white'>CLINIC SIGN</th>
                <th className='text-white'>PROBILL SIGN</th>
                <th className='text-white'>DATE</th>
                <th className='text-white'>ACTION</th>
            </tr>
        </thead>
        <tbody>
           
                    <tr >
                        <td> xyz</td>
                        <td>pending</td>
                        <td>pending</td>
                        <td>28-11-2024</td>
                      
                     
                        <td>
                            <div className="d-flex gap-2">
                                <FiEdit
                                    className="fs-5 cursor-pointer"
                                />
                                <FiTrash className="fs-5 cursor-pointer" />
                            </div>
                        </td>
                    </tr>
        </tbody>
    </Table>
</Col>
</Row>
     </Container>
    </>
  );
};

export default Documents;
