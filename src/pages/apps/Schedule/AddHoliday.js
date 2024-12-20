import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createScheduleAction, getDoctorsListAction } from "../../../redux/schedule/action";
import { encryptMessage } from "../../../cryptoUtils";

const AddHoliday = () => {
    const store = useSelector((state) => state);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const doctorLists = store?.getDoctorsListReducer?.data?.result;
    // const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

   const onSubmit = (data) => {
    const doctorInfo = JSON.parse(data.doctorInfo);

    const payload = {
        doctorId: doctorInfo.id,
        type : 'Holiday',
        name: doctorInfo.name,
        reason: data.reason,
        fromDate:data.fromDate,
        tillDate: data.tillDate,
    };

    dispatch(createScheduleAction({ key: encryptMessage(payload) }));
    reset();
};

    useEffect(() => {
        dispatch(getDoctorsListAction());
    }, [dispatch]);

    return (
        <div className="background_Color pt-1 pb-2">
            <div className="container-fluid mt-4">
                <Card className="px-3 py-2" style={{ height: "85vh" }}>
                    <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: 600 }}>ADD HOLIDAY</p>
                        <div>
                            <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </div>

                    <div className="px-2">
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row pb-2 mt-1">
                                <div className="col-6">
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">
                                            Doctor Name<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            {...register("doctorInfo", {
                                                required: "Doctor selection is required",
                                            })}
                                        >
                                            <option value="">Select doctor</option>
                                            {doctorLists &&
                                                doctorLists.map((doctor, index) => (
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
                                        {errors.doctorName && (
                                            <span className="text-danger">{errors.doctorName.message}</span>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">
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
                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">
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

                                    <Form.Group className="mb-1">
                                        <Form.Label className="mb-0">
                                            Reason<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            {...register("reason", {
                                                required: "Reason is required",
                                            })}
                                        />
                                        {errors.reason && (
                                            <small className="text-danger">{errors.reason.message}</small>
                                        )}
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="d-flex gap-2 justify-content-end mb-2">
                                <Button variant="secondary" type="button">
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
