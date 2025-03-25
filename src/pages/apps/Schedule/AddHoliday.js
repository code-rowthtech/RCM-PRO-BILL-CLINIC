import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createScheduleAction } from "../../../redux/schedule/action";
import { encryptMessage } from "../../../cryptoUtils";
import { getDoctorsAction } from "../../../redux/actions";
import Spinner from "../../../constants/Spinner";
import Select from 'react-select';

const AddHoliday = () => {
    const store = useSelector((state) => state);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [status, setStatus] = useState(true);
    const [doctorSearch, setDoctorSearch] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const addResponse = store?.createScheduleReducer?.data?.response?.status;
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const doctorOptions = doctorDetails?.map((data) => ({
        value: data._id,
        label: data?.name[0]?.text + ' ' 
    }));

    useEffect(() => {
        if (addResponse === 200) {
            reset();
            const payload = {
                search: doctorSearch,
                status: status,
            }
            dispatch(
                getDoctorsAction(payload)
            );
        }
    }, [addResponse])
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;

    const onSubmit = (data) => {
        // const doctorInfo = JSON.parse(data.doctorInfo);
        const payload = {
            doctorId: selectedDoctor?.value,
            clinicId: clinicId,
            fromDate: data.fromDate,
            toDate: data.tillDate,
            // type: 'Holiday',
            // name: selectedDoctor?.label,
            reason: data?.reason,
        };
        dispatch(createScheduleAction({ key: encryptMessage(payload) }));
    };

    useEffect(() => {
        const payload = {
            search: doctorSearch,
            status: status,
        }
        dispatch(
            getDoctorsAction(payload)
        );

    }, [dispatch, doctorSearch]);

    const handleInputChange = (data, type) => {
        if (type === 'doctor') {
            setDoctorSearch(data)
        }
    }

    const handleChange = (selectedOption, type) => {
        // setSelectedPatient(selectedOption, 'Selected Option');
        if (type === 'doctor') {
            setSelectedDoctor(selectedOption, 'Selected Option');
        }
    };
    return (
        <div className="background_Color ">
            <div className="container-fluid mt-2  px-0">
                <Card className="px-md-3 py-md-2" style={{ height: "85vh" }}>
                    <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: 600 }}>ADD HOLIDAY</p>
                        <div>
                            <Button className="cancel-button" onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </div>

                    <div className="px-" >
                        {
                            store?.getDoctorsReducer?.loading ?
                                <div className="d-flex justify-content-center align-items-center h-100">
                                    <Spinner />
                                </div>
                                :
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="row pb-2 mt-1">
                                        <div className="col-md-6 col-sm-6 col-12">
                                            <Form.Group className="mb-1 responnsible-party-select">
                                                <Form.Label className="mb-0">
                                                    Doctor Name<span className="text-danger">*</span>
                                                </Form.Label>
                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    isLoading={store?.getDoctorsReducer?.loading}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    onInputChange={(inputValue) => handleInputChange(inputValue, 'doctor')} // Pass inputValue and type
                                                    onChange={(data) => handleChange(data, 'doctor')}
                                                    name="doctorName"
                                                    options={doctorOptions}
                                                    placeholder="Select Doctor Name"
                                                />
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

                                        <div className="col-md-6 col-sm-6 col-12">
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
                                        <Button className="cancel-button" type="button" onClick={() => navigate(-1)}>
                                            Cancel
                                        </Button>
                                        <Button className="custom-buttons" disabled={store?.createScheduleReducer?.loading} type="submit">
                                            {store?.createScheduleReducer?.loading ?
                                                <Spinner className="spinner-border-sm" color="white" />
                                                :
                                                'Save'
                                            }
                                        </Button>
                                    </div>
                                </Form>
                        }

                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AddHoliday;
