import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Dropdown } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createScheduleAction } from "../../../redux/schedule/action";

const AddBreak = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [breakDay, setbreakDay] = useState("option1");
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const clinicId = "673c2af0bb78fd313f4a752c";
    const doctorId = "6737353f66b5859c2182146a";

    // Handle Radio Option Change
    const handleRadioChange = (e) => {
        setbreakDay(e.target.value);
        if (e.target.value === "option1") {
            setSelectedDays(daysOfWeek); // Automatically select all days for "Every Day"
        } else {
            setSelectedDays([]); // Clear selection for "Single Day"
        }
    };

    // Toggle Single Day Selection
    const toggleDaySelection = (day) => {
        setSelectedDays((prevSelectedDays) =>
            prevSelectedDays.includes(day)
                ? prevSelectedDays.filter((selectedDay) => selectedDay !== day)
                : [...prevSelectedDays, day]
        );
    };

    // Submit Handler
    const onSubmit = (data) => {
        const payload = {
            ...data,
            clinicId,
            doctorId,
            breakDay,
            // selectedDays,
        };

        dispatch(createScheduleAction(payload));
        console.log("Payload Submitted:", payload);
    };

    return (
        <div className="background_Color pt-1 pb-2">
            <div className="container-fluid mt-4">
                <Card className="px-3 py-2" style={{ height: "85vh" }}>
                    <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: 600 }}>ADD BREAK</p>
                        <Button onClick={() => navigate(-1)}>Back</Button>
                    </div>

                    <div className="px-2">
                        {/* Form Section */}
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row pb-4 mt-3">
                                {/* Left Column */}
                                <div className="col-6">
                                <Form.Group className="mb-3">
                                        <Form.Label className="mb-1">
                                            Doctor Name<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            {...register("doctorName", {
                                                required: "Doctor name is required",
                                            })}
                                        >
                                            <option value="">Select doctor</option>
                                            <option value="Doctor A">Doctor A</option>
                                            <option value="Doctor B">Doctor B</option>
                                            <option value="Doctor C">Doctor C</option>
                                        </Form.Select>
                                        {errors.doctorName && (
                                            <small className="text-danger">{errors.doctorName.message}</small>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            From<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="time"
                                            {...register("breakFrom", { required: "Please select a start time" })}
                                        />
                                        {errors.breakFrom && <p className="text-danger">{errors.breakFrom.message}</p>}
                                    </Form.Group>
                                </div>

                                {/* Right Column */}
                                <div className="col-6">
                                    <Form.Group className="mb-3 mt-4 pb-1">
                                        <div className="d-flex gap-5">
                                            <Form.Check
                                                type="radio"
                                                id="option1"
                                                label="Every Day"
                                                name="scheduleType"
                                                value="Every Day"
                                                checked={breakDay === "Every Day"}
                                                onChange={handleRadioChange}
                                            />
                                            <Form.Check
                                                type="radio"
                                                id="option2"
                                                label="Single Day"
                                                name="scheduleType"
                                                value="Single Day"
                                                checked={breakDay === "Single Day"}
                                                onChange={handleRadioChange}
                                            />
                                        </div>
                                    </Form.Group>

                                    {/* Dropdown for Single Day */}
                                    {breakDay === "Single Day" && (
                                        <Form.Group className="mb-3">
                                            <Form.Label>
                                                Select Days<span className="text-danger">*</span>
                                            </Form.Label>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="outline-primary">
                                                    {selectedDays.length > 0
                                                        ? `Selected Days: ${selectedDays.join(", ")}`
                                                        : "Select Days"}
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    {daysOfWeek.map((day) => (
                                                        <Dropdown.Item key={day}>
                                                            <Form.Check
                                                                type="checkbox"
                                                                label={day}
                                                                checked={selectedDays.includes(day)}
                                                                onChange={() => toggleDaySelection(day)}
                                                            />
                                                        </Dropdown.Item>
                                                    ))}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Form.Group>
                                    )}

                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            To<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="time"
                                            {...register("breakTo", { required: "Please select an end time" })}
                                        />
                                        {errors.breakTo && <p className="text-danger">{errors.breakTo.message}</p>}
                                    </Form.Group>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="d-flex gap-2 justify-content-end mb-2">
                                <Button variant="secondary" type="button" onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit">
                                    Save
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AddBreak;
