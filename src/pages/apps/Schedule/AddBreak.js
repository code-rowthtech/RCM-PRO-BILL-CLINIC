import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Dropdown } from "react-bootstrap";

const AddBreak = () => {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('option1');
    const [selectedDays, setSelectedDays] = useState([]);
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const handleRadioChange = (e) => {
        setSelectedOption(e.target.value);
        if (e.target.value === 'option1') {
            setSelectedDays(daysOfWeek); // Automatically select all days for "Every Day"
        } else {
            setSelectedDays([]); // Clear selection for "Single Day"
        }
    };

    const toggleDaySelection = (day) => {
        setSelectedDays((prevSelectedDays) =>
            prevSelectedDays.includes(day)
                ? prevSelectedDays.filter((selectedDay) => selectedDay !== day) // Deselect day
                : [...prevSelectedDays, day] // Select day
        );
    };

    return (
        <div className="background_Color pt-1 pb-2">
            <div className="container-fluid mt-4">
                <Card className="px-3 py-2" style={{ height: '85vh' }}>
                    <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: 600 }}>ADD BREAK</p>
                        <div>
                            <Button onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </div>

                    <div className="px-2">
                        {/* Form Section */}
                        <Form>
                            <div className="row pb-4 mt-3">
                                <div className="col-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="mb-1">Doctor Name<span className="text-danger">*</span></Form.Label>
                                        <Form.Select>
                                            <option value="">Select Doctor</option>
                                            <option value="doctor1">Doctor 1</option>
                                            <option value="doctor2">Doctor 2</option>
                                            <option value="doctor3">Doctor 3</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="mb-1">From<span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="time" placeholder="Time" />
                                    </Form.Group>
                                </div>
                                <div className="col-6">
                                    <Form.Group className="mb-3 mt-4 pb-1">
                                        <div className="d-flex gap-5">
                                            <Form.Check
                                                type="radio"
                                                id="option1"
                                                label="Every Day"
                                                name="fromDate"
                                                value="option1"
                                                checked={selectedOption === 'option1'}
                                                onChange={handleRadioChange}
                                            />
                                            <Form.Check
                                                type="radio"
                                                id="option2"
                                                label="Single Day"
                                                name="fromDate"
                                                value="option2"
                                                checked={selectedOption === 'option2'}
                                                onChange={handleRadioChange}
                                            />
                                        </div>
                                    </Form.Group>

                                    {/* Conditional Dropdown for Single Day */}
                                    {selectedOption === 'option2' && (
                                        <Form.Group className="mb-3">
                                            <Form.Label className="mb-1">Select Days<span className="text-danger">*</span></Form.Label>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                                                    {selectedDays.length > 0
                                                        ? `Selected Days: ${selectedDays.join(', ')}`
                                                        : "Select Days"}
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    {daysOfWeek.map((day) => (
                                                        <Form.Check
                                                            key={day}
                                                            type="radio"
                                                            label={day}
                                                            checked={selectedDays.includes(day)}
                                                            onChange={() => toggleDaySelection(day)}
                                                            className="dropdown-item"
                                                        />
                                                    ))}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Form.Group>
                                    )}

                                    <Form.Group className="mb-3">
                                        <Form.Label className="mb-1">To<span className="text-danger">*</span></Form.Label>
                                        <Form.Control type="time" placeholder="Time" />
                                    </Form.Group>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="d-flex gap-2 justify-content-end mb-2">
                                <Button variant="secondary">Cancel</Button>
                                <Button variant="primary">Save</Button>
                            </div>
                        </Form>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AddBreak;
