import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { FiUploadCloud } from "react-icons/fi";

const AddHoliday = () => {

    const navigate = useNavigate();

    return (
        <div className="background_Color pt-1 pb-2">
            <div className="container-fluid mt-4">
                <Card className="px-3 py-2 " style={{ height: '85vh' }}>
                    <div className="d-flex justify-content-between">
                        <p style={{ fontWeight: 600 }}>ADD HOLIDAY</p>
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
                                        <Form.Label className='mb-1'>Doctor Name<span className='text-danger'>*</span></Form.Label>
                                        <Form.Select
                                        // defaultValue={updatePage ? clinicDataToUpdate?.clinicType : ''}
                                        // {...register('clinicType', { required: 'This field is required' })}
                                        >
                                            <option value="">Select doctor</option>
                                            <option value=""> doctor</option>
                                            <option value=""> doctor</option>
                                            <option value=""> doctor</option>
                                            {/* {clinicTypeData?.map((data) => (
                                                <option key={data?._id} value={data?.name}>{data?.name}</option>
                                            ))} */}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label className='mb-1'> Till Date*</Form.Label>
                                        <Form.Control
                                            type="date"
                                            // {...register('taxId')}
                                            // defaultValue={updatePage ? clinicDataToUpdate?.taxIdOrEIN : ''}
                                            placeholder="" />
                                    </Form.Group>

                                </div>
                                <div className="col-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label className='mb-1'> From Date</Form.Label>
                                        <Form.Control
                                            type="text"
                                            // {...register('taxId')}
                                            // defaultValue={updatePage ? clinicDataToUpdate?.taxIdOrEIN : ''}
                                            placeholder="Date" />
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

export default AddHoliday;
