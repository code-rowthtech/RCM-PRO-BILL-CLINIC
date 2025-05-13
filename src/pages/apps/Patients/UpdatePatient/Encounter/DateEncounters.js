import React, { useState } from 'react';
import { Col, Button, Row, Form, Table } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EncounterSummary from './EncounterSummary';
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarRightCollapseFilled } from 'react-icons/tb';

const DateEncounters = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [leftTab, setLeftTab] = useState('Summary');
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);

    return (
        <div className='px-2 mt-1 row position-relative'>
            <Button
                variant='transparent'
                onClick={toggleCollapse}
                className="position-absolute text-black fs-4 fw-bold translate-middle-y p-0   "
                style={{
                    width: '24px',
                    height: '24px',
                    zIndex: 1,
                    left: '95%', top: '-2%'
                }}
            >
                {isCollapsed ? <TbLayoutSidebarLeftCollapseFilled size={18} /> : <TbLayoutSidebarRightCollapseFilled size={18} />}
            </Button>

            {/* Collapsible Left Column */}
            <Col className={`border-end ${isCollapsed ? 'd-none' : ''}`} sm={4}>
                <ul className='d-flex list-unstyled'>
                    {['Summary', 'Templates', 'Past Encounters'].map((data) => (
                        <li
                            key={data}
                            onClick={() => setLeftTab(data)}
                            className={`flex-fill border-bottom fs-6 fw-semibold cursor-pointer text-center 
                            ${data === leftTab ? 'border-2 fw-bold border-primary text-primary' : ''}`}>
                            {data}
                        </li>
                    ))}
                </ul>
                <Row>
                    <Col sm={12}>
                        {leftTab === 'Summary' && <EncounterSummary />}
                        {leftTab === 'Templates' && <>Templates</>}
                        {leftTab === 'Past Encounters' && <>Past Encounters</>}
                        {leftTab === 'PMH' && <>PMH</>}
                    </Col>
                </Row>
            </Col>

            {/* Main Content Column */}
            <Col sm={isCollapsed ? 12 : 8}>
                {/* Encounter Details */}
                <div className=" px-2 mb-3 ">
                    {/* <h5 className='m-0'>Encounter details</h5> */}
                    <Row className="g-2 ">
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Encounter Type *</Form.Label>
                                <Form.Select>
                                    <option>185349003 (SNOMED-CT) - Office Visit</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Note Type *</Form.Label>
                                <Form.Select>
                                    <option>SOAP Note</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Date *</Form.Label>
                                <Form.Control type="date" defaultValue="2025-05-13" />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Age at Encounter</Form.Label>
                                <Form.Control plaintext readOnly defaultValue="48 yrs" />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Seen By *</Form.Label>
                                <Form.Select>
                                    <option>Mohit Rawat</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Facility *</Form.Label>
                                <Form.Select>
                                    <option>Mohit Rawat...</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Status</Form.Label>
                                <Form.Control plaintext readOnly defaultValue="Unsigned" />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label>Self-pay Restriction</Form.Label>
                                <Form.Select>
                                    <option>No restriction</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        {/* Chief Complaint */}

                        <Col sm={12} className="mb-3">
                            <h6>Chief complaint</h6>
                            <Form.Control as="textarea" placeholder="Add any problems or symptoms here" rows={2} />
                        </Col>
                        {/* Health Concerns */}
                        <Col sm={12} className="mb-3 border-top pt-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">Health concerns</h6>
                                <Button variant="link" size="sm">Expand</Button>
                            </div>
                        </Col>

                        {/* Flowsheets */}
                        <Col sm={12} className="mb-3 border-top pt-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">Flowsheets</h6>
                                <Button variant="link" size="sm">Expand</Button>
                            </div>
                        </Col>

                        {/* Medications */}
                        <Col sm={12} className="border-top pt-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">Medications</h6>
                                <div>
                                    <Button variant="link" size="sm">Add</Button>
                                    <Button variant="link" size="sm">Show ▼</Button>
                                    <Button variant="link" size="sm">Print</Button>
                                    <Button variant="link" size="sm">Minimize</Button>
                                </div>
                            </div>
                            <Form.Group className="my-2">
                                <Form.Label>Was Medication Reconciliation Completed?</Form.Label>
                                <Form.Select>
                                    <option>Select...</option>
                                </Form.Select>
                            </Form.Group>
                            <Table responsive className="table-centered table-nowrap mb-0  rounded">
                                <thead className="">
                                    <tr>
                                        <th className='text-white'>Name ▲</th>
                                        <th className='text-white'>Sig</th>
                                        <th className='text-white'>Start</th>
                                        <th className='text-white'>Prescriptions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={4} className="text-center text-muted">No data</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <div className="text-end mt-2 d-flex justify-content-end">
                                <Button className='custom-buttons'>Go to</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Col>
        </div>
    );
};

export default DateEncounters;
