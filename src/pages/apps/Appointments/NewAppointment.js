// @flow
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiEdit } from 'react-icons/bi';
import { Button, Card } from 'react-bootstrap';

const NewAppointment = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const navigate = useNavigate();
    const handleAppointment = () => {
        navigate('/apps/appointments/list');
    };

    return (
        <Card className="mt-2" style={{ height: '87vh' }}>
            {/* Card Header */}
            <div className="d-flex justify-content-between align-items-center mx-3 mt-2">
                <h5 className="fw-bold mb-0">New Appointment</h5>
                <Button variant='secondary' onClick={handleAppointment}>Back</Button>
            </div>

            {/* Card Body */}
            <Card.Body className='py-1'>
                <div className="row">
                    {/* Left Column */}
                    <div className="col-6">
                        <form>
                            <div className="mb-1">
                                <label htmlFor="patient" className="form-label mb-0">
                                    Patient
                                </label>
                                <select id="patient" className="w-100 input ps-2 py-1">
                                    <option selected>Select Name</option>
                                    <option value="">Select Department</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                </select>
                            </div>

                            <div className="mb-1">
                                <label htmlFor="doctor" className="form-label mb-0">
                                    Doctor
                                </label>
                                <select id="doctor" className="w-100 input ps-2 py-1" style={{ border: '1px solid #444141' }}>
                                    <option selected>Select Doctor</option>
                                    <option value="">Select Department</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                </select>
                            </div>
                            <div className="mb-1">
                                <label htmlFor="belongToDoctor" className="form-label mb-0">
                                    Belong to Doctor
                                </label>
                                <select id="belongToDoctor" className="w-100 input ps-2 py-1" style={{ border: '1px solid #444141' }}>
                                    <option selected>Belong to Doctor</option>
                                    <option value="">Select Department</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                </select>
                            </div>
                            <div className="mb-1">
                                <label htmlFor="description" className="form-label mb-0">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    className="w-100 input ps-2 py-1"
                                    style={{ border: '1px solid #444141', fontSize: '14px', color: '#444141' }}
                                    rows="3"
                                ></textarea>
                            </div>
                        </form>
                    </div>

                    {/* Right Column */}
                    <div className="col-6">
                        <form>
                            <div className="mb-1">
                                <label htmlFor="doctorDepartment" className="form-label mb-0">
                                    Doctor Department
                                </label>
                                <select id="doctorDepartment" className="w-100 input ps-2 py-1" style={{ border: '1px solid #444141' }}>
                                    <option selected>Doctor Department</option>
                                    <option value="">Select Department</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                </select>
                            </div>

                            <div className="mb-1">
                                <label htmlFor="date" className="form-label mb-0">
                                    Date:
                                </label>
                                <input
                                    type="date"
                                    className="w-100 input ps-2 py-1"
                                    id="date"
                                    placeholder="Enter Date of birth"
                                    style={{ border: '1px solid #444141', fontSize: '14px' }}
                                />
                            </div>
                            <div className="mt-1">
                                <label htmlFor="taraq" className="form-label mb-0">
                                    Taraq
                                </label>
                                <input
                                    type="text"
                                    className="w-100 input ps-2 py-1"
                                    id="taraq"
                                    placeholder="Taraq"
                                    style={{ border: '1px solid #444141', fontSize: '14px' }}
                                />
                            </div>
                            <div className="mt-2">
                                <p className='mb-1 fw-bold'>Status</p>
                                <div className="form-check form-switch mt-0">
                                    <input className="form-check-input" type="checkbox" id="statusSwitch" />
                                </div>
                            </div>

                        </form>
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant='secondary'>Cancel</Button>
                        <Button>Save</Button>
                    </div>
                </div>
            </Card.Body>

            {/* Card Footer */}

        </Card>
    );
};

export default NewAppointment;
