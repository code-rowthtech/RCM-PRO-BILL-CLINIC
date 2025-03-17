import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
    createProblemListAction,
    getAllCodeAction,
    getPatientAppointmentAction,
    getProblemListAction,
} from '../../../../redux/ProblemList/action';
import { encryptMessage } from '../../../../cryptoUtils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Spinner from '../../../../constants/Spinner';

const AddProblem = ({ onCancel }) => {
    const dispatch = useDispatch(); // Declare dispatch
    const navigate = useNavigate();
    const store = useSelector((state) => state);
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    // State for ICD-10 search functionality
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredICDCodes, setFilteredICDCodes] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const allCodeICDs = store?.getALLCodesReducer?.data?.codes || [];
    const patientAppointmentproblem = store?.getPatientAppointmentReducer?.data?.appointments || [];
    const responseStatus = store?.createProblemListReducer?.data?.status;
    const [selectedAppointment, setSelectedAppointment] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm();
    // Watch for changes in the ICD code field
    const icdCodeValue = watch('icdCode');

    // Function to filter ICD-10 codes based on user input
    const handleICDSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 0) {
            const filtered = allCodeICDs.filter(
                (code) =>
                    code.value.toLowerCase().includes(query.toLowerCase()) ||
                    code.title.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredICDCodes(filtered);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    // Function to select an ICD-10 code
    const selectICDCode = (code) => {
        setValue('icdCode', code.value);
        setSearchQuery(code.value);
        setShowDropdown(false);
    };
    useEffect(() => {
        if (patientId) {
            dispatch(getPatientAppointmentAction({ key: encryptMessage({ patientId }) }));
        }
    }, [dispatch, patientId]);

    useEffect(() => {
        dispatch(getAllCodeAction({ search: searchQuery }));
    }, [dispatch, searchQuery]);

    const onSubmit = (data) => {
        const payload = {
            patientId: patientId,
            problem: data.problem,
            icdVersion: data.icdVersion,
            icdCode: data.icdCode,
            status: data.status,
            appointmentId: data.appointment,
            datetimeDiagnosis: data.diagnosisDate,
            datetimeOnset: data.onsetDate,
            datetimeChanged: data.changedDate,
            notes: data.note,
        };

        dispatch(createProblemListAction({ key: encryptMessage(payload) }));
    };

    // **Handle success response (status 201)**
    useEffect(() => {
        if (responseStatus === 201) {
            reset();
            onCancel();
            dispatch(getProblemListAction({ patientId }));
        }
    }, [responseStatus, reset, onCancel, dispatch]);

    const handleAppointmentChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedAppointment(selectedValue);

        // Find the selected appointment object
        const selectedAppointmentObj = patientAppointmentproblem.find(
            (appointment) => appointment._id === selectedValue
        );

        // Set diagnosis date to the selected appointment date
        if (selectedAppointmentObj) {
            setValue('diagnosisDate', selectedAppointmentObj.date.split('T')[0]);
        }
    };
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col sm={12} className="d-flex justify-content-between">
                    <h4>Add Problem</h4>
                    <Button className="custom-buttons" onClick={onCancel} type="button">
                        Back
                    </Button>
                </Col>

                {/* Problem */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Problem</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Problem"
                            {...register('problem', { required: 'Problem is required' })}
                        />
                        {errors.problem && <small className="text-danger">{errors.problem.message}</small>}
                    </Form.Group>
                </Col>

                {/* ICD Version */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">ICD Version</Form.Label>
                        <Form.Select {...register('icdVersion')} data-has-value={!!watch('icdVersion')}>
                            <option value="">Select ICD Version</option>
                            <option value="ICD-10">ICD-10</option>
                            <option value="ICD-10">ICD-10</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">ICD 10 Code</Form.Label>
                        <div style={{ position: 'relative' }}>
                            <Form.Control
                                type="text"
                                placeholder="Enter ICD 10 Code"
                                {...register('icdCode', { required: 'ICD 10 Code is required' })}
                                value={searchQuery}
                                onChange={handleICDSearch}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            />
                            {errors.icdCode && <small className="text-danger">{errors.icdCode.message}</small>}

                            {/* Dropdown for ICD Code Search */}
                            {showDropdown && filteredICDCodes.length > 0 && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        width: '100%',
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        zIndex: 111,
                                        backgroundColor: '#fff',
                                        border: '1px solid #ced4da',
                                        borderTop: 'none',
                                    }}
                                    className="scroll-container">
                                    {filteredICDCodes.map((code) => (
                                        <p
                                            key={code._id}
                                            onClick={() => selectICDCode(code)}
                                            style={{
                                                margin: 0,
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                            }}
                                            className="hover-bg-change text-black">
                                            {code.value} - {code.title} - {code.codeType}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Form.Group>
                </Col>

                {/* Status */}
                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Status</Form.Label>
                        <Form.Select {...register('status')} data-has-value={!!watch('status')}>
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group className="mb-1">
                        <Form.Label htmlFor="Appointment" className="mb-0">
                            Appointment
                        </Form.Label>
                        <Form.Select
                            data-has-value={!!watch('appointment')}
                            {...register('appointment')}
                            value={selectedAppointment}
                            onChange={handleAppointmentChange} // Handle selection change
                        >
                            <option value="">Select Appointment</option>
                            {patientAppointmentproblem.length === 0 ? (
                                <option value="" disabled>
                                    {store?.getPatientAppointmentReducer?.data?.message}
                                </option>
                            ) : (
                                patientAppointmentproblem.map((appointment) => {
                                    const dateObj = new Date(appointment.date);
                                    const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(
                                        dateObj.getMonth() + 1
                                    ).padStart(2, '0')}/${dateObj.getFullYear()}`;

                                    return (
                                        <option key={appointment._id} value={appointment._id}>
                                            {formattedDate}
                                        </option>
                                    );
                                })
                            )}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col sm={6}>
                    <Form.Group>
                        <Form.Label className="mb-0">Date Diagnosis</Form.Label>
                        <Form.Control
                            type="date"
                            {...register('diagnosisDate', { required: 'Diagnosis Date is required' })}
                            value={watch('diagnosisDate') || ''}
                            onChange={(e) => setValue('diagnosisDate', e.target.value)}
                            disabled={selectedAppointment !== ''} // Disable if an appointment is selected
                        />
                        {errors.diagnosisDate && <small className="text-danger">{errors.diagnosisDate.message}</small>}
                    </Form.Group>
                </Col>

                {/* Datetime Onset */}
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
                        <Form.Control as="textarea" placeholder="Note" rows={4} {...register('note')} />
                    </Form.Group>
                </Col>

                {/* Buttons */}
                <Col sm={12} className="d-flex justify-content-end gap-1 mt-3">
                    <Button className="custom-buttons" type="button" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        className="custom-buttons"
                        type="submit"
                        onClick={() => reset()} 
                    >
                        Save and Add Another
                    </Button>
                    <Button className="custom-buttons" type="submit">
                        {store?.createProblemListReducer?.loading ? (
                            <Spinner color="white" className="spinner-border-sm" />
                        ) : (
                            'Save'
                        )}
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default AddProblem;
