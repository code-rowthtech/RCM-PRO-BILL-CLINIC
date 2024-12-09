import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createScheduleAction, getDoctorsListAction } from "../../../redux/schedule/action";
import { encryptMessage } from "../../../cryptoUtils";

const AddBreak = () => {
    const store = useSelector((state) => state);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [selectedDays, setSelectedDays] = useState([]); // Array for selected days
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const doctorLists = store?.getDoctorsListReducer?.data?.result;

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm();

    const breakDay = watch("breakDay", "Every Day"); // Watch breakDay and set default value

    useEffect(() => {
        dispatch(getDoctorsListAction());
    }, [dispatch]);

    const handleRadioChange = (e) => {
        const value = e.target.value;
        setValue("breakDay", value);

        if (value === "Every Day") {
            setSelectedDays(daysOfWeek); // Select all days if "Every Day" is chosen
        } else {
            setSelectedDays([]); // Clear selected days for "Break Day"
        }
    };

    const handleDayChange = (e) => {
        const selectedDay = e.target.value;
        if (selectedDay) {
            setSelectedDays([selectedDay]); // Only keep the newly selected day
            setValue("breakDay", selectedDay); // Update breakDay with the selected day
        }
    };

    const onSubmit = (data) => {
        const formattedBreakFrom = `${data.breakFrom}:00`;
        const formattedBreakTo = `${data.breakTo}:00`;
        const doctorInfo = JSON.parse(data.doctorInfo);
        const payload = {
            doctorId: doctorInfo.id,
            type: "Break",
            name: doctorInfo.name,
            breakDay: data.breakDay === "Every Day" ? "Every Day" : selectedDays.join(", "),
            breakFrom: formattedBreakFrom,
            breakTo: formattedBreakTo,
        };

        dispatch(createScheduleAction({ key: encryptMessage(payload) }));
        reset();
        console.log(payload, "payload");
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
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row pb-4 mt-3">
                                <div className="col-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Doctor Name<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            {...register("doctorInfo", { required: "Doctor selection is required" })}
                                        >
                                            <option value="">Select doctor</option>
                                            {doctorLists?.map((doctor, index) => (
                                                <option
                                                    key={index}
                                                    value={JSON.stringify({
                                                        id: doctor?.userId?._id,
                                                        name: `${doctor?.userId?.firstName} ${doctor?.userId?.lastName}`,
                                                    })}
                                                >
                                                    {`${doctor?.userId?.firstName} ${doctor?.userId?.lastName}`}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        {errors.doctorInfo && (
                                            <span className="text-danger">{errors.doctorInfo.message}</span>
                                        )}
                                    </Form.Group>
                                    <Form.Group className="mt-4">
                                        <Form.Label>
                                            From<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="time"
                                            {...register("breakFrom", { required: "Please select a start time" })}
                                        />
                                        {errors.breakFrom && (
                                            <p className="text-danger">{errors.breakFrom.message}</p>
                                        )}
                                    </Form.Group>
                                </div>

                                <div className="col-6">
                                    <Form.Group className="mb-3 mt-4 pb-1">
                                        <div className="d-flex gap-5">
                                            <Form.Check
                                                type="radio"
                                                label="Every Day"
                                                value="Every Day"
                                                {...register("breakDay", { required: "Please select a break type" })}
                                                onChange={handleRadioChange}
                                                checked={breakDay === "Every Day"}
                                                className="mt-1"
                                            />
                                            <div className="d-flex">
                                                <Form.Check
                                                    type="radio"
                                                    label={!selectedDays.length > 0 ? 'Break Day' : selectedDays}
                                                    value= "Break Day"
                                                    {...register("breakDay", { required: "Please select a break type" })}
                                                    onChange={handleRadioChange}
                                                    checked={breakDay !== "Every Day"}
                                                    className="mt-1"
                                                />
                                                <Form.Select
                                                    onChange={handleDayChange}
                                                    disabled={breakDay === "Every Day"}
                                                    className="border-0 w-25"
                                                >
                                                    <option value="">Select a Day</option>
                                                    {daysOfWeek.map((day) => (
                                                        <option key={day} value={day}>
                                                            {day}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            To<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="time"
                                            {...register("breakTo", { required: "Please select an end time" })}
                                        />
                                        {errors.breakTo && (
                                            <p className="text-danger">{errors.breakTo.message}</p>
                                        )}
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <Button variant="secondary" onClick={() => navigate(-1)}>
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
