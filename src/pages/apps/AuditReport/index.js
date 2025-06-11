import React from 'react'
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
import DatePicker from 'react-datepicker'

const index = () => {

  const AuditReport = [
    {
      type: 'View',
      patientDataType: 'Allergies',
      detail: 'Accessed allergy information',
      user: 'Dr. John Doe',
      date: '2024-10-15'
    },
    {
      type: 'Edit',
      patientDataType: 'Medications',
      detail: 'Updated dosage',
      user: 'Nurse Jane Smith',
      date: '2024-11-01'
    },
    {
      type: 'Delete',
      patientDataType: 'Lab Results',
      detail: 'Removed outdated report',
      user: 'Admin Mike Lee',
      date: '2024-09-22'
    }
  ]

  return (
    <div>
      <Row className="mt-2">
        <Col xs={12}>
          <Card className=" scroll-container page-height">
            <Card.Body>
              <div>
                <div>
                  <Row>
                    <Col sm={2} className='pe-0'>
                      <DatePicker
                        // selected={startDate}
                        // onChange={handleChange}
                        // startDate={startDate}
                        // endDate={endDate}
                        selectsRange
                        isClearable
                        placeholderText="Select a date range"
                        className=" border-0"
                        style={{width:'14rem!important'}}
                      />
                    </Col>
                    <Col sm={2}>
                      <Form.Select aria-label="Filter Options">
                        <option hidden  >Date</option>
                        <option value="Activity Type">Activity Type</option>
                        <option value="Patient Data Type">Patient Data Type</option>
                        <option value="Date">Date</option>
                        <option value="EPCS Incident Report">EPCS Incident Report</option>
                        <option value="Patient (First Last)">Patient (First Last)</option>
                        <option value="User (First Last)">User (First Last)</option>
                      </Form.Select>
                    </Col>
                    <Col sm={2}>
                      <Form.Select aria-label="Filter Options">
                        <option hidden  >Descending order</option>
                        <option value="Ascending order">Ascending order</option>
                        <option value="Descending order">Descending order</option>
                      </Form.Select>
                    </Col>
                    <Col sm={2} className='d-flex gap-1'>
                      <Form.Check
                        type="checkbox"
                        // label="Show only my activity"
                        id="enable-filter"
                        style={{ marginTop: '4px' }}
                      />
                      <span style={{ marginTop: '6px' }} className='fs-6 text-nowrap'>Show only my activity</span>
                    </Col>
                    <Col sm={4} className='d-flex justify-content-end'>
                      <Button
                        className="custom-buttons d-none d-md-block"
                      >
                        Apply
                      </Button>
                    </Col>
                  </Row>
                  <div className='mt-2'>
                    <Table responsive className="table-centered table-nowrap mb-0">
                      <thead className="text-white bg-dark">
                        <tr>
                          <th className="text-white">Activity Type</th>
                          <th className="text-white">Patient Data Type</th>
                          <th className="text-white">Detail</th>
                          <th className="text-white">User</th>
                          <th className="text-white">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {AuditReport.map((data, index) => (
                          <tr key={index}>
                            <td className="text-capitalize">{data.type}</td>
                            <td className="text-capitalize">{data.patientDataType}</td>
                            <td className="text-capitalize">{data.detail}</td>
                            <td className="text-capitalize">{data.user}</td>
                            <td className="text-capitalize">{data.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default index