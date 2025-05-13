import React from 'react'
import { Badge, Button, Col, Row, Table } from 'react-bootstrap'
import { FaUserMd } from 'react-icons/fa'

const EncounterList = (tab) => {
    return (
        <div className="p-2 pt-0">
            <Row className="mb-0">
                <Col sm={6}>
                    <h5 className="fs-6 mt-0 d-flex align-items-center ">
                        Encounter Details
                    </h5>
                </Col>
                <Col sm={6} className="text-end">
                    <Badge bg={tab.status === 'Completed' ? 'success' : 'warning'}>
                        {tab.status}
                    </Badge>
                </Col>
            </Row>

            <Table bordered responsive className="mb-1">
                <thead className="">
                    <tr>
                        <th className='text-white'>Date</th>
                        <th className='text-white'>Provider</th>
                        <th className='text-white'>Type</th>
                        <th className='text-white'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{tab.date}</td>
                        <td>
                            <div className="d-flex align-items-center">
                                <FaUserMd className="me-2 text-info" />
                                {tab.provider}
                            </div>
                        </td>
                        <td>
                            {tab.type === 'date' ? 'Initial Visit' : 'Follow-up'}
                        </td>
                        <td>
                            <i
                                className=" bi bi-pencil text-info cursor-pointer"

                            />
                            &nbsp;
                            <i
                                className="bi bi-trash-fill text-danger cursor-pointer"

                            />
                        </td>
                    </tr>
                </tbody>
            </Table>

            <div className="mb-1">
                <h6 className="mb-2  fs-6">Clinical Notes</h6>
                <div className="p-2  fs-6 border rounded bg-light">
                    {tab.notes || <span className="text-muted">No notes recorded</span>}
                </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
                <Button className='custom-buttons'>
                    Save Encounter
                </Button>
                <Button className='custom-buttons'>
                    Print Summary
                </Button>
            </div>
        </div>
    )
}

export default EncounterList