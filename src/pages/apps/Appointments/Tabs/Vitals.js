import React from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'

const Vitals = () => {
    return (
        <div className='mb-2'>
            <div className='rounded ' style={{ border: '1px solid #ced4da' }}>
                <div className='px-2 '>
                    {/* first section */}
                    <Row className=' pb-1' style={{ background: '#313A46', borderTopLeftRadius:'3px', borderTopRightRadius:'3px'}}>

                        <Col sm={3}>
                            <p className='text-nowrap mt-2 mb-0 fw-bold text-white'>System Vitals</p>

                        </Col>

                        <Col sm={9} className='d-flex gap-1 justify-content-end pt-1'>
                            <p className='text-nowrap mt-1 mb-0 fw-bold text-white'>Note Rendering Options:</p>

                            <Form.Group controlId="newestToOldest">
                                <Form.Select style={{ height: '33px' }}>
                                    <option>Newest to oldest</option>
                                    <option>Oldest to newest</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group controlId="dateOnTop">
                                <Form.Select style={{ height: '33px' }}>
                                    <option>Date on Top</option>
                                    <option>Date on Bottom</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group controlId="appointmentCount">
                                <Form.Select style={{ height: '33px' }}>
                                    <option>1 Appointment</option>
                                    <option>2 Appointments</option>
                                    <option>Multiple Appointments</option>
                                </Form.Select>
                            </Form.Group>

                        </Col>
                    </Row>
                    {/* second section */}
                    <Row className='pt-1' style={{ background: '#E6EBFF', }}>
                        <Col sm={4} style={{ borderRight: '1px solid #ced4da' }}>
                            <p className='mb-0 mt-1 fw-bold'>Name</p>
                        </Col>
                        <Col sm={4} className='text-center' style={{ borderRight: '1px solid #ced4da' }}>
                            <p className='m-0 fw-bold'>O1/10/2025</p>
                            <p className='m-0 fw-bold fs-6 text-secondary'>12:45 PM</p>
                        </Col>
                        <Col sm={4} className='text-center'>
                            <p className='m-0 fw-bold'>Current Visit</p>
                            <p className='m-0 fw-bold fs-6 text-secondary'>O1/11/2025 at 12:45 PM</p>
                        </Col>
                    </Row>
                    {/* third section  */}
                    <Row>
                        {[
                            { label: 'Temperature', unit: '(F)' },
                            { label: 'Height', unit: '(In)' },
                            { label: 'Blood Pressure', unit: '(mmHg)' },
                            { label: 'Respiratory Rate', unit: '(rpm)' },
                            { label: 'Oxygen Saturation', unit: '(%)' },
                            { label: 'Pulse', unit: '(bpm)' },
                            { label: 'Weight', unit: '(lbs)' },
                            { label: 'BMI', unit: '(kg/m2)' },
                            { label: 'Smoking Status', unit: '' },
                            { label: 'Pain', unit: '(0-10)' },
                            { label: 'Head Circumference', unit: '(in)' },
                            { label: 'Weight-for-length Percentile', unit: '(%)' },
                            { label: 'BMI Percentile', unit: '(%)' },
                            { label: 'Oxygen Concentration', unit: '(%)' },
                            { label: 'Head Occipital-frontal Circumference Percentile', unit: '(%)' }
                        ].map((item, index) => (
                            <>
                                <Col sm={4} className='pt-1' style={{ borderTop: '1px solid #ced4da' }} key={index}>
                                    <p className='mb-0'>{item.label} <span className='text-secondary'>{item.unit}</span></p>
                                </Col>
                                <Col sm={4} className='px-0' style={{ borderLeft: '1px solid #ced4da', borderRight: '1px solid #ced4da', borderTop: '1px solid #ced4da' }}>
                                    <Form.Control type="text" placeholder="0" className='border-0' />
                                </Col>
                                <Col sm={4} className='px-0' style={{ borderTop: '1px solid #ced4da' }}>
                                    <Form.Control type="text" placeholder="0" className='border-0' />
                                </Col>
                            </>
                        ))}
                    </Row>
                </div>
            </div>
            <Row>
                <Col className='d-flex justify-content-end mt-2'>
                    <Button
                        className='fs-6 d-flex align-items-center justify-content-center custom-buttons'
                    >
                        Mark as Done
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

export default Vitals