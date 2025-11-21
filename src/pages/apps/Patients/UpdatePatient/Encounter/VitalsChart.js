import React, { useEffect, useState } from 'react';
import { Table, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createVitalsAction, getVitalsByPatientIdAction, updateVitalsAction } from '../../../../../redux/actions';
import { useSearchParams } from 'react-router-dom';
import { loggedInUser } from '../../../../../helpers/api/loggedInUser';
import { encryptMessage } from '../../../../../cryptoUtils';
import Spinner from '../../../../../constants/Spinner';
import ToastHandle from '../../../../../helpers/ToastMessage';
import { defaultVitals } from '../../../../../utils/DataSets/commonData2';

export default function VitalsChart({ isAccordionOpen }) {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const { data: vitalsData, loading } = useSelector((state) => state.getVitalsByPatientIdReducer) || {};
    const patientVitals = vitalsData?.data || [];
    const [vitals, setVitals] = useState(defaultVitals);
    const [visitDateTime, setVisitDateTime] = useState({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [editingDate, setEditingDate] = useState(null);

    const validationSchema = {
        Temperature: { min: 93, max: 108 },
        Pulse: { min: 30, max: 200 },
        'Blood Pressure': { systolic: { min: 70, max: 250 }, diastolic: { min: 40, max: 150 } },
        'Respiratory Rate': { min: 8, max: 40 },
        'Oxygen Saturation': { min: 70, max: 100 },
        Height: { min: 10 },
        Weight: { min: 2 },
        Pain: { min: 0, max: 10 },
        'Head Circumference': { min: 10, max: 60 },
    };

    const validateVital = (vital) => {
        const rules = validationSchema[vital.name];
        if (!rules) return '';
        if (vital.type === 'bp') {
            const s = parseFloat(vital.value.systolic);
            const d = parseFloat(vital.value.diastolic);
            if (isNaN(s) || isNaN(d)) return 'Invalid BP values';
            if (s < rules.systolic.min || s > rules.systolic.max) return `Systolic: ${rules.systolic.min}-${rules.systolic.max}`;
            if (d < rules.diastolic.min || d > rules.diastolic.max) return `Diastolic: ${rules.diastolic.min}-${rules.diastolic.max}`;
        } else {
            const val = parseFloat(vital.value);
            if (isNaN(val)) return 'Enter a valid number';
            if (rules.min && val < rules.min) return `Min value is ${rules.min}`;
            if (rules.max && val > rules.max) return `Max value is ${rules.max}`;
        }
        return '';
    };

    const handleVitalChange = (index, field, value) => {
        setVitals((prev) => {
            const updated = [...prev];
            const vital = { ...updated[index] };
            if (vital.type === 'bp') vital.value = { ...vital.value, [field]: value };
            else vital.value = value;
            updated[index] = vital;
            return updated;
        });
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        const alreadyExists = patientVitals.some(
            (v) => v.effectiveDateTime.split('T')[0] === newDate
        );
        if (alreadyExists) {
            ToastHandle('Vitals already exist for this date.', 'danger');
            return;
        }
        setVisitDateTime((prev) => ({ ...prev, date: newDate }));
    };

    const handleTimeChange = (e) => setVisitDateTime((prev) => ({ ...prev, time: e.target.value }));

    const handleSubmit = () => {
        const errors = {};
        const observations = [];
        vitals.forEach((vital) => {
            if (!vital.value || (vital.type === 'bp' && (!vital.value.systolic || !vital.value.diastolic))) {
                return;
            }

            const error = validateVital(vital);
            if (error) {
                errors[vital.name] = error;
                return;
            }

            const effectiveDateTime = `${visitDateTime.date}T${visitDateTime.time}:00`;
            const observation = {
                code: {
                    coding: [{ system: vital.system, code: vital.code, display: vital.name }],
                },
                effectiveDateTime,
                subject: patientId,
                createdBy: loggedInUser?._id,
            };

            if (vital.type === 'bp') {
                observation.component = [
                    {
                        code: { coding: [{ code: '8480-6', display: 'Systolic' }] },
                        valueQuantity: { value: parseFloat(vital.value.systolic), unit: 'mmHg' },
                    },
                    {
                        code: { coding: [{ code: '8462-4', display: 'Diastolic' }] },
                        valueQuantity: { value: parseFloat(vital.value.diastolic), unit: 'mmHg' },
                    },
                ];
            } else if (vital.type === 'dropdown') {
                observation.valueString = vital.value;
            } else {
                observation.valueQuantity = { value: parseFloat(vital.value), unit: vital.unit || '' };
            }
            observations.push(observation);
        });

        setValidationErrors(errors);

        if (Object.keys(errors).length > 0) {
            ToastHandle('Please fix validation errors', 'danger');
            return;
        }

        if (observations.length === 0) {
            ToastHandle('Please enter at least one vital', 'warning');
            return;
        }

        observations.forEach((obs) => {
            dispatch(createVitalsAction({ key: encryptMessage(obs) }));
        });

        setVitals(defaultVitals);
    };

    const groupedVitals = patientVitals && patientVitals?.reduce((acc, vitalGroup) => {
        vitalGroup.vitals?.forEach(vital => {
            const date = vital.effectiveDateTime;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(vital);
        });
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedVitals).sort((a, b) => new Date(b) - new Date(a));

    return (
        <div
            className="scroll-container"
            style={{
                height: isAccordionOpen ? '55vh' : '73vh',
                overflowX: 'auto',
                overflowY: 'auto',
            }}
        >
            <Table bordered className={`mb-0 position-relative vitalsTable ${loading ? 'opacity-50' : ''}`}>
                <thead>
                    <tr className="border">
                        <th className="text-white">Vital Name</th>
                        {sortedDates.map((date) => (
                            <th key={date} className="text-white text-nowrap">
                                {new Date(date).toLocaleString()}
                                {editingDate === date ? (
                                    <i
                                        className="bi bi-check-square ms-2 text-success cursor-pointer"
                                        onClick={() => setEditingDate(null)}
                                    />
                                ) : (
                                    <i
                                        className="mdi mdi-square-edit-outline ms-2 text-warning cursor-pointer"
                                        onClick={() => setEditingDate(date)}
                                    />
                                )}
                            </th>
                        ))}
                        <th style={{ background: '#f8f9fa' }}>
                            <div className="d-flex gap-2 vitalsFormControl">
                                <Form.Control
                                    type="date"
                                    value={visitDateTime.date}
                                    onChange={handleDateChange}
                                    min={new Date(new Date().setMonth(new Date().getMonth() - 1))
                                        .toISOString()
                                        .split('T')[0]}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                                <Form.Control
                                    type="time"
                                    value={visitDateTime.time}
                                    onChange={handleTimeChange}
                                />
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    Save
                                </button>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {vitals?.map((vital, index) => (
                        <tr key={vital?.name}>
                            <td>{vital?.name}</td>
                            {sortedDates?.map((date) => (
                                <td key={`${vital?.name}-${date}`}>
                                    {vital?.type === 'bp'
                                        ? `${groupedVitals[date]?.find(
                                            (v) => v.code?.coding?.[0]?.display === vital?.name
                                        )?.component?.[0]?.valueQuantity?.value || '-'
                                        } / ${groupedVitals[date]?.find(
                                            (v) => v.code?.coding?.[0]?.display === vital?.name
                                        )?.component?.[1]?.valueQuantity?.value || '-'
                                        }`
                                        : groupedVitals[date]?.find(
                                            (v) => v.code?.coding?.[0]?.display === vital?.name
                                        )?.valueQuantity?.value || '-'}
                                </td>
                            ))}

                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip>
                                        Add or update vitals for selected date
                                    </Tooltip>
                                }
                            >
                                <td style={{ background: '#f8f9fa' }}>
                                    {vital?.type === 'bp' ? (
                                        <div className="d-flex">
                                            <Form.Control
                                                type="number"
                                                size="sm"
                                                className="me-1"
                                                placeholder="Sys"
                                                value={vital.value.systolic}
                                                onChange={(e) =>
                                                    handleVitalChange(index, 'systolic', e.target.value)
                                                }
                                            />
                                            <Form.Control
                                                type="number"
                                                size="sm"
                                                placeholder="Dia"
                                                value={vital.value.diastolic}
                                                onChange={(e) =>
                                                    handleVitalChange(index, 'diastolic', e.target.value)
                                                }
                                            />
                                        </div>
                                    ) : (
                                        vital.type === 'dropdown' ? (
                                            <Form.Select
                                                size="sm"
                                                value={vital.value}
                                                onChange={(e) => handleVitalChange(index, null, e.target.value)}
                                            >
                                                <option value="">Select</option>
                                                {vital.options.map((opt) => (
                                                    <option key={opt} value={opt}>
                                                        {opt}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        ) : (
                                            <Form.Control
                                                type="number"
                                                size="sm"
                                                value={vital.value}
                                                onChange={(e) => handleVitalChange(index, null, e.target.value)}
                                            />
                                        )
                                    )}
                                    {validationErrors[vital.name] && (
                                        <div className="text-danger small mt-1">
                                            {validationErrors[vital.name]}
                                        </div>
                                    )}
                                </td>
                            </OverlayTrigger>
                        </tr>
                    ))}
                </tbody>
                {loading && (
                    <div className="position-absolute" style={{ top: '35%', left: '50%' }}>
                        <Spinner />
                    </div>
                )}
            </Table>
        </div>
    );
}
