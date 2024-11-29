import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createScheduleAction, getDoctorsListAction } from "../../../redux/schedule/action";

const AddHoliday = () => {
    const store = useSelector((state) => state);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const doctorLists = store?.getDoctorsListReducer?.data?.response?.data
    console.log(doctorLists, 'doctor list');

    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId 
    const doctor_id = JSON.parse(sessionStorage.getItem('hyper_user'))
   
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const doctor_Id = "6748316e08b1a41d733d1a02";
    const reason = 'Weekly availability setup';

    const onSubmit = (data) => {
        const payload = {
            ...data,
            clinic_id,
            doctor_Id,
            reason,
        };
        dispatch(createScheduleAction(payload));
    };

    useEffect(()=>{
dispatch(getDoctorsListAction());
    },[dispatch])

    return (
        <div className="background_Color pt-1 pb-2">
            <div className="container-fluid mt-4">
                <Card className="px-3 py-2 " style={{ height: "85vh" }}>
                    <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: 600 }}>ADD HOLIDAY</p>
                        <div>
                            <Button onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </div>

                    <div className="px-2">
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row pb-4 mt-3">
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
                                          {/* {doctorLists?.map((doctor)=>(
                                             <option key={doctor._id} value={doctor._id}>{doctor.name}</option>
                                          ))} */}
                                        </Form.Select>
                                        {errors.doctorName && (
                                            <small className="text-danger">{errors.doctorName.message}</small>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="mb-1">
                                            Till Date<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            {...register("tillDate", {
                                                required: "Till date is required",
                                            })}
                                        />
                                        {errors.tillDate && (
                                            <small className="text-danger">{errors.tillDate.message}</small>
                                        )}
                                    </Form.Group>
                                </div>

                                <div className="col-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="mb-1">
                                            From Date<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            {...register("fromDate", {
                                                required: "From date is required",
                                            })}
                                        />
                                        {errors.fromDate && (
                                            <small className="text-danger">{errors.fromDate.message}</small>
                                        )}
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="d-flex gap-2 justify-content-end mb-2">
                                <Button
                                    variant="secondary"
                                    type="button"
                                >
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

export default AddHoliday;
