import React from 'react'
import { FiUploadCloud } from 'react-icons/fi';
import { Col, Form, Row, Button, Table, Modal, InputGroup, Card } from 'react-bootstrap';

const PrimaryInsurance = () => {
    const tableData = [
        { type: 'Patient', values: Array(6).fill("0.00") },
        { type: 'Insurance', values: Array(6).fill("0.00") }, // Add more rows as needed
    ];
    return (
        <div>
            <Form>
                <div className="row">
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Company</Form.Label>
                            <Form.Control placeholder='Insurance Company' type='text' />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Carrier Payer ID</Form.Label>
                            <Form.Control placeholder='Carrier Payer ID' type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Alternate Eligible Payer</Form.Label>
                            <Form.Control placeholder='Alternate Eligible Payer' type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>TPL Code</Form.Label>
                            <Form.Control placeholder='TPL Code' type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance ID Number</Form.Label>
                            <Form.Control placeholder='Insurance ID Number' type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Group Name</Form.Label>
                            <Form.Control placeholder='Insurance Group Name' type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Group Number</Form.Label>
                            <Form.Control placeholder='Insurance Group Number' type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Plan Name</Form.Label>
                            <Form.Control placeholder='Insurance Plan Name' type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Plan Type</Form.Label>
                            <Form.Control placeholder='Insurance Plan Type' type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Claim Office Number</Form.Label>
                            <Form.Control placeholder='Insurance Claim Office Number' type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Number Of Visits Allowed Per Year</Form.Label>
                            <Form.Control placeholder='Number Of Visits Allowed Per Year' type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Card Issued Date</Form.Label>
                            <Form.Control type='date' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        {/* <Form.Group>
                                    <Form.Label className='mb-0'>Insurance Photo Front</Form.Label>
                                    <Form.Control placeholder='Insurance Company' type='text' />

                                </Form.Group> */}
                        <div className="mb-1 d-flex flex-column position-relative">
                            <Form.Label className="mb-0">Insurance Photo Front</Form.Label>
                            <div
                                className='custom-file-upload justify-content-between cursor-pointer'>
                                <p className="mb-0">
                                    Upload
                                </p>
                                <p className="mb-0">
                                    <FiUploadCloud />
                                </p>
                            </div>
                            <Form.Control
                                type="file"
                                className="d-none "
                            />
                        </div>
                    </div>
                    <div className="col-6 mt-1">
                        <div className="mb-1 d-flex flex-column position-relative">
                            <Form.Label className="mb-0">Insurance Photo Back</Form.Label>
                            <div className='custom-file-upload justify-content-between cursor-pointer'>
                                <p className="mb-0">
                                    Upload
                                </p>
                                <p className="mb-0">
                                    <FiUploadCloud />
                                </p>
                            </div>
                            <Form.Control
                                type="file"
                                className="d-none " />
                        </div>
                    </div>
                    <div className="col-12">
                        <Form.Group>
                            <Form.Label className='mb-0'>Primary Issuance Notes</Form.Label>
                            <Form.Control placeholder='Primary Issuance Notes' type='text' />
                        </Form.Group>
                    </div>
                </div>
                <hr className='my-3' />
                <div className="row ">
                    <div className="col-12">
                        <h4 className='my-0'>HCFA Options</h4>
                    </div>
                    <div className="col-6">
                        <Form.Group>
                            <Form.Label className='mb-0'>
                                Default Onset Date
                            </Form.Label>
                            <Form.Control type='date' />
                        </Form.Group>
                    </div>
                    <div className="col-6">
                        <Form.Group>
                            <Form.Label className='mb-0'>
                                Default Initial Visit Date
                            </Form.Label>
                            <Form.Control type='date' />
                        </Form.Group>
                    </div>
                </div>
                <Row className='my-2'>
                    <Col sm={6} className="">
                        <Table responsive className="table-centered table-nowrap mb-0 mt-1">
                            <thead className="text-white">
                                <tr>
                                    <th className='text-white'>Seq</th>
                                    <th className='text-white'>Coverage</th>
                                    <th className='text-white'>Carrier</th>
                                    <th className='text-white'>Subscriber</th>
                                    <th className='text-white'>Id#</th>
                                    <th className='text-white'>Capay</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Primary</td>
                                    <td>Anthem</td>
                                    <td>Test</td>
                                    <td>2333</td>
                                    <td>
                                        0.00
                                    </td>
                                </tr>


                            </tbody>
                        </Table>
                    </Col>
                    <Col sm={6}>
                        <Table responsive className="table-centered table-nowrap mb-0 mt-1 ">
                            <thead className="text-white">
                                <tr>
                                    <th className="text-white">Unapplied</th>
                                    <th className="text-white">0-30</th>
                                    <th className="text-white">31-60</th>
                                    <th className="text-white">61-90</th>
                                    <th className="text-white">91-120</th>
                                    <th className="text-white">121+</th>
                                    <th className="text-white">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td>{row.type}</td>
                                        {row.values.map((value, colIndex) => (
                                            <td key={colIndex}>
                                                <Form.Group>
                                                    <InputGroup>
                                                        <Form.Control
                                                            type="tel"
                                                            placeholder={value}
                                                        />
                                                    </InputGroup>
                                                </Form.Group>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>

                <div className="col-12 d-flex align-items-center gap-2 justify-content-end">
                    <Button className='custom-buttons' >Save and add another</Button>
                    <Button className='custom-buttons' >Save and continue editing</Button>
                    <Button className='custom-buttons' type='submit' >Save</Button>
                </div>
            </Form>
        </div>
    )
}

export default PrimaryInsurance