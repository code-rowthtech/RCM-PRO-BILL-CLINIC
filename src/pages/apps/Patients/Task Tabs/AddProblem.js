import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    getAllCodeAction,
    getPatientAppointmentAction,
} from '../../../../redux/ProblemList/action';

const AddProblem = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const [searchQuery, setSearchQuery] = useState('');
    const store = useSelector((state) => state);
    const allCodeICDs = store?.getALLCodesReducer?.data?.codes || [];
    const appointments = store?.getPatientAppointmentReducer?.data || [];
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm();

    const selectedProblem = watch('problem');

    // Fetch dynamic ICD codes
    useEffect(() => {
        if (searchQuery) {
            dispatch(getAllCodeAction({ search: searchQuery }));
        }
    }, [dispatch, searchQuery]);

    // Fetch dynamic appointments
    useEffect(() => {
        dispatch(getPatientAppointmentAction({ patientId }));
    }, [dispatch, patientId]);

    // Set ICD code from selected problem
    useEffect(() => {
        if (selectedProblem) {
            setValue('icdCode', selectedProblem.value);
        }
    }, [selectedProblem, setValue]);

    const formattedOptions = allCodeICDs.map((code) => ({
        value: code.value,
        label: `${code.value} - ${code.title} - ${code.codeType}`,
    }));

    const onSubmit = (data) => {
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col sm={12} className="d-flex justify-content-between">
                    <h4>Add Problem</h4>
                    <Button className="custom-buttons" type="button">
                        Back
                    </Button>
                </Col>

                {/* Problem selection with dynamic ICD lookup */}
                <Col sm={6}>
                    <Form.Group className="mb-3">
                        <Form.Label className="mb-0">Problem</Form.Label>
                        <Controller
                            name="problem"
                            control={control}
                            rules={{ required: 'Problem is required' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    classNamePrefix="react-select"
                                    options={formattedOptions}
                                    onInputChange={(value) => setSearchQuery(value)}
                                    placeholder="Search Problem"
                                    isClearable
                                    isSearchable
                                />
                            )}
                        />
                        {errors.problem && (
                            <Form.Text className="text-danger">
                                {errors.problem.message}
                            </Form.Text>
                        )}
                    </Form.Group>
                </Col>

                {/* ICD Version - fixed to ICD-10 */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">ICD Version</Form.Label>
                        <Form.Select disabled {...register('icdVersion')} style={{ cursor: 'not-allowed' }}>
                            <option value="ICD-10">ICD-10</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* ICD 10 Code - auto-filled */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">ICD 10 Code</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter ICD 10 Code"
                            {...register('icdCode')}
                            readOnly
                        />
                    </Form.Group>
                </Col>

                {/* Status */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Status</Form.Label>
                        <Form.Select {...register('status')}>
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Appointment - dynamically loaded */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Appointment</Form.Label>
                        <Form.Select {...register('appointment')}>
                            <option value="">Select Appointment</option>
                            {appointments?.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item?.date ? new Date(item?.date).toISOString().split('T')[0] : 'N/A'}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Diagnosis Date */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Date Diagnosis</Form.Label>
                        <Form.Control type="date" {...register('diagnosisDate')} />
                    </Form.Group>
                </Col>

                {/* Onset Date */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Datetime Onset</Form.Label>
                        <Form.Control type="date" {...register('onsetDate')} />
                    </Form.Group>
                </Col>

                {/* Note */}
                <Col sm={12}>
                    <Form.Group>
                        <Form.Label className="mb-0">Note</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Note"
                            rows={4}
                            {...register('note')}
                        />
                    </Form.Group>
                </Col>

                {/* Action Buttons */}
                <Col sm={12} className="d-flex justify-content-end gap-1 mt-3">
                    <Button className="custom-buttons" type="button" onClick={() => reset()}>
                        Cancel
                    </Button>
                    <Button className="custom-buttons" type="submit">
                        Save
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default AddProblem;
