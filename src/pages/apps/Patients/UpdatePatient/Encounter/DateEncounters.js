import React, { useState } from 'react';
import { Col, Button, Row, Form, Table } from 'react-bootstrap';
import EncounterSummary from './EncounterSummary';
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { useSelector } from 'react-redux';

const DateEncounters = ({ isCollapsed }) => {
    const [leftTab, setLeftTab] = useState('Summary');
    const store = useSelector((state) => state);
    const settingsDataMainItems = store?.getEncounterSettingsReducer?.data?.data?.items;
    console.log(settingsDataMainItems, 'settingsDataMainItemssettingsDataMainItems')

    const defaultTabs = ['Summary', 'Templates', 'Past Encounters'];
    const visibleTabs =
        settingsDataMainItems?.length > 0
            ? settingsDataMainItems?.filter((item) => item?.show === true)
            : defaultTabs.map((name, index) => ({
                _id: index.toString(),
                name,
            }));
    return (
        <div className='px-0 mt-1 row border  mx-1 h-100' >
            {/* Collapsible Left Column */}
            <Col className={`px-0 ${isCollapsed ? 'd-none' : ''}`} sm={4}>
                <ul className='d-flex list-unstyled mt-0'>
                    {visibleTabs.map((item) => (
                        <li
                            key={item._id}
                            onClick={() => setLeftTab(item.name)}
                            className={`cursor-pointer p-1 fs-6 rounded-0 list-group-item  
                  d-flex align-items-center flex-fill justify-content-center fw-bold 
                  ${item.name === leftTab ? 'active-patient-chart-tab fw-medium' : 'border border-muted'}`}>
                            {item.name}
                        </li>
                    ))}
                </ul>

                <Row className='mx-auto'>
                    <Col sm={12} className='px-md-1'>
                        {leftTab === 'Summary' && <EncounterSummary />}
                        {leftTab === 'Templates' && <>Templates</>}
                        {leftTab === 'Past Encounters' && <>Past Encounters</>}
                        {leftTab === 'PMH' && <>PMH</>}
                    </Col>
                </Row>
            </Col>

            {/* Main Content Column */}
            <Col className='px-0 border-start pb-2 h-100' sm={isCollapsed ? 12 : 8}>
                {/* Encounter Details */}
                <div className="px-1 h-100" >
                    <Row
                        style={{ height: '16.5vh' }}
                        className="g-2 mt-0 bg-light rounded-top p-1 ">
                        <Col sm={4} className='mt-0'>
                            <Form.Group className='encounterHeaderGroup'>
                                <Form.Label className='mb-0 fw-bold small'>Encounter Type <span className='text-danger'>*</span></Form.Label>
                                <Form.Select className='border-primary'>
                                    <option>185349003 (SNOMED-CT) - Office Visit</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={4} className='mt-0'>
                            <Form.Group className='encounterHeaderGroup'>
                                <Form.Label className='mb-0 fw-bold small'>Note Type <span className='text-danger'>*</span></Form.Label>
                                <Form.Select className='border-primary'>
                                    <option>SOAP Note</option>
                                    <option>Progress Note</option>
                                    <option>Procedure Note</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={4} className='mt-0'>
                            <Form.Group className='encounterHeaderGroup'>
                                <Form.Label className='mb-0 fw-bold small'>Date <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type="date"
                                    defaultValue="2025-05-13"
                                    className='border-primary'
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={2} className='mt-0'>
                            <Form.Group className='encounterHeaderGroup'>
                                <Form.Label className='mb-0 fw-bold small'>Age at Encounter</Form.Label>
                                <Form.Control readOnly defaultValue="48 yrs" className='bg-white' />
                            </Form.Group>
                        </Col>
                        <Col sm={2} className='mt-0'>
                            <Form.Group className='encounterHeaderGroup'>
                                <Form.Label className='mb-0 fw-bold small'>Seen By <span className='text-danger'>*</span></Form.Label>
                                <Form.Select className='border-primary'>
                                    <option>Mohit Rawat</option>
                                    <option>Other Provider</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={2} className='mt-0'>
                            <Form.Group className='encounterHeaderGroup'>
                                <Form.Label className='mb-0 fw-bold small'>Facility <span className='text-danger'>*</span></Form.Label>
                                <Form.Select className='border-primary'>
                                    <option>Main Clinic</option>
                                    <option>Satellite Office</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={2} className='mt-0'>
                            <Form.Group className='encounterHeaderGroup'>
                                <Form.Label className='mb-0 fw-bold small'>Status</Form.Label>
                                <Form.Select className='border-primary'>
                                    <option>Signed</option>
                                    <option selected>Unsigned</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={4} className='mt-0'>
                            <Form.Group className='encounterHeaderGroup'>
                                <Form.Label className='mb-0 fw-bold small'>Self-pay Restriction</Form.Label>
                                <Form.Select>
                                    <option>No restriction</option>
                                    <option>Partial restriction</option>
                                    <option>Full restriction</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Secondary Header Row */}
                    {/* <Row className="g-2 bg-light p-1 " >
                     
                    </Row> */}
                    <Row className='g-2 px-2 mt-1 scroll-container' style={{ height: '59vh' }}>
                        {/* Chief Complaint */}
                        <Col sm={12} className="mb-0 mt-0  pt-0">
                            <Form.Group>
                                <Form.Label className='mb-0'>Chief Complaint</Form.Label>
                                <Form.Control as={'textarea'} placeholder='' />
                            </Form.Group>
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

                        <Col sm={12} className="mb-3 mt-0  pt-0">
                            <Form.Group>
                                <Form.Label className='mb-0'>Subjective</Form.Label>
                                <Form.Control as={'textarea'} placeholder='' />
                            </Form.Group>
                        </Col>
                        <Col sm={12} className="mb-3 mt-0  pt-0">
                            <Form.Group>
                                <Form.Label className='mb-0'>Objective</Form.Label>
                                <Form.Control as={'textarea'} placeholder='' />
                            </Form.Group>
                        </Col>
                        <Col sm={12} className="mb-3 mt-0  pt-0">
                            <Form.Group>
                                <Form.Label className='mb-0'>Assessment</Form.Label>
                                <Form.Control as={'textarea'} placeholder='' />
                            </Form.Group>
                        </Col>
                        <Col sm={12} className="mb-3 mt-0  pt-0">
                            <Form.Group>
                                <Form.Label className='mb-0'>Plan</Form.Label>
                                <Form.Control as={'textarea'} placeholder='' />
                            </Form.Group>
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
                                <Form.Label className='mb-0'>Was Medication Reconciliation Completed?</Form.Label>
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

                            {/* <div className="text-end mt-2 d-flex justify-content-end">
                                <Button className='custom-buttons'>Go to</Button>
                            </div> */}
                        </Col>
                    </Row>
                </div>
            </Col>
        </div>
    );
};

export default DateEncounters;
