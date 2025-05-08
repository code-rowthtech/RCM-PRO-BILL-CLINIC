// VitalStatus.js
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Table, Button, Form } from 'react-bootstrap';
import { defaultVitals } from '../../../../utils/DataSets/commonData2';
import { useSearchParams } from 'react-router-dom';
import { loggedInUser } from '../../../../helpers/api/loggedInUser';
import { useDispatch, useSelector } from 'react-redux';
import { createVitalsAction, getVitalsByPatientIdAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { handlePrintVitals } from '../../../../helpers/printVitals';
import Spinner from '../../../../constants/Spinner';

const conversionMap = {
    Temperature: { imperial: '°F', metric: '°C' },
    Height: { imperial: 'in', metric: 'cm' },
    Weight: { imperial: 'lbs', metric: 'kg' },
};

const imperialUnits = {
    Temperature: '°F',
    Height: 'in',
    Weight: 'lbs',
};

const metricUnits = {
    Temperature: '°C',
    Height: 'cm',
    Weight: 'kg',
};

const convertValue = (value, fromUnit, toUnit) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;

    if (fromUnit === 'kg' && toUnit === 'lbs') return (num * 2.20462).toFixed(2);
    if (fromUnit === 'lbs' && toUnit === 'kg') return (num / 2.20462).toFixed(2);

    if (fromUnit === 'cm' && toUnit === 'in') return (num / 2.54).toFixed(2);
    if (fromUnit === 'in' && toUnit === 'cm') return (num * 2.54).toFixed(2);

    if (fromUnit === 'C' && toUnit === 'F') return ((num * 9) / 5 + 32).toFixed(2);
    if (fromUnit === 'F' && toUnit === 'C') return (((num - 32) * 5) / 9).toFixed(2);

    return value;
};

const getVitalType = (vitalName) => {
    switch (vitalName) {
        case 'Blood Glucose':
        case 'Cholesterol':
        case 'Triglycerides':
            return 'dropdown';
        case 'Waist Circumference':
        case 'Hip Circumference':
            return 'number';
        default:
            return 'number';
    }
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function VitalStatus({ isAccordionOpen }) {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [unitSystem, setUnitSystem] = useState('imperial');
    const [vitals, setVitals] = useState(defaultVitals);
    const [newVital, setNewVital] = useState('');
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const visitTime = new Date().toLocaleString();
    const patientVitals = store?.getVitalsByPatientIdReducer?.data?.data || [];
    const patientDetails = store?.getPatientByIdReducer?.data?.data;

    const now = new Date();
    const formatTwoDigits = (n) => n.toString().padStart(2, '0');


    useEffect(() => {
        dispatch(getVitalsByPatientIdAction({ patientId }));
    }, [dispatch, patientId]);
    const validationSchema = {
        Temperature: { min: 93, max: 108 }, // °F
        Pulse: { min: 30, max: 200 },       // bpm
        'Blood Pressure': { systolic: { min: 70, max: 250 }, diastolic: { min: 40, max: 150 } }, // mmHg
        'Respiratory Rate': { min: 8, max: 40 }, // rpm
        'Oxygen Saturation': { min: 70, max: 100 }, // %
        Height: { min: 30 }, // cm or in (handle by unitSystem)
        Weight: { min: 2 }, // kg or lbs
        BMI: { min: 10, max: 60 },
        Pain: { min: 0, max: 10 },
        'Head Circumference': { min: 10, max: 60 },
    };

    const [validationErrors, setValidationErrors] = useState({});
    const validateVital = (vital, unitSystem) => {
        const rules = validationSchema[vital.name];
        if (!rules) return '';

        if (vital.type === 'bp') {
            const s = parseFloat(vital.value.systolic);
            const d = parseFloat(vital.value.diastolic);
            if (isNaN(s) || isNaN(d)) return 'Please enter valid systolic and diastolic values.';
            if (s < rules.systolic.min || s > rules.systolic.max) return `Systolic must be between ${rules.systolic.min} and ${rules.systolic.max}.`;
            if (d < rules.diastolic.min || d > rules.diastolic.max) return `Diastolic must be between ${rules.diastolic.min} and ${rules.diastolic.max}.`;
            return '';
        }

        const val = parseFloat(vital.value);
        if (isNaN(val)) return 'Please enter a valid number.';

        let { min, max } = rules;
        // Adjust for imperial units if needed
        if (unitSystem === 'imperial') {
            if (vital.unitKey === 'Height') {
                min /= 2.54;
                max /= 2.54;
            }
            if (vital.unitKey === 'Weight') {
                min *= 2.20462;
                max *= 2.20462;
            }
            if (vital.unitKey === 'Temperature') {
                min = (min * 9 / 5) + 32;
                max = (max * 9 / 5) + 32;
            }
        }

        if (val < min || val > max) return `${vital.name} must be between ${min.toFixed(1)} and ${max.toFixed(1)}.`;

        return '';
    };
    useEffect(() => {
        const heightVital = vitals.find(v => v.name === 'Height');
        const weightVital = vitals.find(v => v.name === 'Weight');
        const bmiVitalIndex = vitals.findIndex(v => v.name === 'BMI');

        if (!heightVital || !weightVital || bmiVitalIndex === -1) return;

        const height = parseFloat(heightVital.value);
        const weight = parseFloat(weightVital.value);

        if (!height || !weight) return;

        let bmi = 0;

        if (unitSystem === 'imperial') {
            // Convert inches to meters: inches * 0.0254
            const heightInMeters = height * 0.0254;
            // Convert pounds to kg: lbs / 2.20462
            const weightInKg = weight / 2.20462;
            bmi = weightInKg / (heightInMeters * heightInMeters);
        } else {
            // Metric: height in cm needs to be converted to meters
            const heightInMeters = height / 100;
            bmi = weight / (heightInMeters * heightInMeters);
        }

        const bmiValue = bmi.toFixed(1);

        // Only update if BMI has changed
        if (vitals[bmiVitalIndex].value !== bmiValue) {
            setVitals(prev => {
                const updated = [...prev];
                updated[bmiVitalIndex] = { ...updated[bmiVitalIndex], value: bmiValue };
                return updated;
            });

            // Dispatch the BMI observation
            const bmiVital = vitals[bmiVitalIndex];
            if (bmiVital) {
                const effectiveDateTime = formatEffectiveDateTime();
                const observation = {
                    code: {
                        coding: [{
                            system: bmiVital.system,
                            code: bmiVital.code,
                            display: bmiVital.name
                        }]
                    },
                    effectiveDateTime,
                    subject: patientId,
                    createdBy: loggedInUser?._id,
                    valueQuantity: {
                        value: parseFloat(bmiValue),
                        unit: "kg/m2",
                        system: "http://unitsofmeasure.org",
                        code: "kg/m2"
                    }
                };
                dispatch(createVitalsAction({ key: encryptMessage(observation) }));
            }
        }
    }, [vitals.find(v => v.name === 'Height')?.value, vitals.find(v => v.name === 'Weight')?.value, unitSystem]);

    // Group vitals by date and sort by date (newest first)
    const groupedVitals = patientVitals && patientVitals?.reduce((acc, vitalGroup) => {
        const date = vitalGroup.effectiveDateTime;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(...vitalGroup.vitals);
        return acc;
    }, {});

    // Get sorted dates (newest first)
    const sortedDates = Object.keys(groupedVitals).sort((a, b) =>
        new Date(b) - new Date(a)
    );

    const getDisplayUnit = (vital) => {
        if (vital.unitKey) {
            return unitSystem === 'imperial' ? imperialUnits[vital.unitKey] : metricUnits[vital.unitKey];
        }
        return vital.unit || '';
    };

    const handleUnitChange = (newSystem) => {
        setUnitSystem(newSystem);
    };

    const handleVitalChange = (index, field, value) => {
        setVitals(prevVitals => {
            const updated = [...prevVitals];
            const vital = { ...updated[index] };

            if (vital.type === 'bp') {
                vital.value = { ...vital.value, [field]: value };
            } else {
                vital.value = value;
            }

            updated[index] = vital;
            return updated;
        });
    };

    const submitObservation = (vital) => {
        if (!vital) return;
        const effectiveDateTime = formatEffectiveDateTime();

        const baseObservation = {
            code: {
                coding: [{
                    system: vital.system,
                    code: vital.code,
                    display: vital.name
                }]
            },
            effectiveDateTime,
            subject: patientId,
            createdBy: loggedInUser?._id,
        };

        if (vital.type === 'bp' && vital.value?.systolic && vital.value?.diastolic) {
            const bpObservation = {
                ...baseObservation,
                component: [
                    {
                        code: {
                            coding: [{
                                system: "http://loinc.org",
                                code: "8480-6",
                                display: "Systolic blood pressure"
                            }]
                        },
                        valueQuantity: {
                            value: parseFloat(vital.value.systolic),
                            unit: "mmHg",
                            system: "http://unitsofmeasure.org",
                            code: "mm[Hg]"
                        }
                    },
                    {
                        code: {
                            coding: [{
                                system: "http://loinc.org",
                                code: "8462-4",
                                display: "Diastolic blood pressure"
                            }]
                        },
                        valueQuantity: {
                            value: parseFloat(vital.value.diastolic),
                            unit: "mmHg",
                            system: "http://unitsofmeasure.org",
                            code: "mm[Hg]"
                        }
                    }
                ]

            };
            dispatch(createVitalsAction({ key: encryptMessage(bpObservation) }));
        } else if (vital.type === 'dropdown') {
            const observation = {
                ...baseObservation,
                valueString: vital.value
            };
            dispatch(createVitalsAction({ key: encryptMessage(observation) }));
        } else if (vital.type === 'number' && vital.value !== '') {
            const observation = {
                ...baseObservation,
                valueQuantity: {
                    value: parseFloat(vital.value),
                    unit: getDisplayUnit(vital),
                }
            };
            dispatch(createVitalsAction({ key: encryptMessage(observation) }));
        }
    };

    const findVitalValue = (vitalName, date) => {
        if (!groupedVitals[date]) return null;

        const vital = groupedVitals[date].find(v =>
            v.code?.coding?.[0]?.display === vitalName ||
            v.code?.text === vitalName
        );

        if (!vital) return null;

        if (vital.component && vital.component.length > 0) {
            // Handle blood pressure case
            const systolic = vital.component.find(c =>
                c.code?.coding?.[0]?.code === "8480-6"
            )?.valueQuantity?.value;

            const diastolic = vital.component.find(c =>
                c.code?.coding?.[0]?.code === "8462-4"
            )?.valueQuantity?.value;

            return { systolic: systolic || '', diastolic: diastolic || '' };
        }

        return vital.valueQuantity?.value || vital.valueString || '';
    };

    const renderVitalCell = (vital, date) => {
        const value = findVitalValue(vital.name, date);

        if (vital.type === 'bp') {
            const bpValue = value || { systolic: '', diastolic: '' };
            return (
                <div className="d-flex">
                    <span>{bpValue.systolic || '-'}</span>
                    <span>/</span>
                    <span>{bpValue.diastolic || '-'}</span>
                </div>
            );
        }

        return value || '-';
    };

    const formatEffectiveDateTime = () => {
        const { date, time } = visitDateTime;
        if (!date || !time) return new Date().toISOString(); // fallback

        return `${date}T${time}:00`; // keep local time, no 'Z'
    };
    const [visitDateTime, setVisitDateTime] = useState({
        date: now.toISOString().split('T')[0], // "YYYY-MM-DD"
        time: `${formatTwoDigits(now.getHours())}:${formatTwoDigits(now.getMinutes())}`, // "HH:mm"
    });

    // Extract disabled dates
    const disabledDates = patientVitals?.map(vital => vital.effectiveDateTime) || [];

    // Check if a date is disabled
    const isDateDisabled = (dateString) => disabledDates.includes(dateString);

    // Handle date change
    const handleDateChange = (e) => {
        const newDate = e.target.value;

        if (isDateDisabled(newDate)) {
            alert("This date already has recorded vitals. Please choose another date.");
            return;
        }

        setVisitDateTime(prev => ({
            ...prev,
            date: newDate,
        }));
    };

    // Handle time change (unchanged)
    const handleTimeChange = (e) => {
        setVisitDateTime(prev => ({
            ...prev,
            time: e.target.value,
        }));
    };
    return (
        <div>
            <div className="row mb-2">
                <div className="col-9">
                    <h5>Vitals</h5>
                </div>

                <div className="col-3 d-flex gap-2 align-items-center">
                    {!store?.getVitalsByPatientIdReducer?.loading &&
                        <span title='Print all vitals'
                            onClick={() => handlePrintVitals({ vitals: patientVitals, patientDetails: patientDetails })}
                            className='uil-print text-primary fs-4 cursor-pointer' />}
                    <div className="d-flex gap-1  border-start  ps-2 align-items-center w-100" >
                        <span className='fw-semibold fs-6'>Units:</span>
                        <Form.Select
                            onChange={(e) => handleUnitChange(e.target.value)}
                            value={unitSystem}
                            className="w-100"
                        >
                            <option value='imperial'>Imperial</option>
                            <option value='metric'>Metric</option>
                        </Form.Select>
                    </div>
                </div>
            </div>

            <div className='scroll-container ' style={{
                height: isAccordionOpen ? "55vh" : "73vh",
                overflowX: 'auto',
                overflowY: 'auto'
            }}>
                <Table bordered className={`mb-0 position-relative box-shadow-none vitalsTable ${store?.getVitalsByPatientIdReducer?.loading ? 'opacity-50' : ''}`} >
                    <thead>
                        <tr className='border'>
                            <th className='text-white'>
                                Vital Name
                            </th>
                            {sortedDates?.map(date => (
                                <th className='text-white' key={date}>
                                    {formatDate(date)}
                                </th>
                            ))}
                            <th style={{ background: '#f8f9fa' }}>
                                <div className="d-flex vitalsFormControl gap-2">
                                    <Form.Control
                                        type="date"
                                        value={visitDateTime.date}
                                        onChange={handleDateChange}
                                        min="2000-01-01" // Optional: Set a min date
                                        max="2100-12-31" // Optional: Set a max date
                                    />

                                    <Form.Control
                                        type="time"
                                        value={visitDateTime.time}
                                        onChange={handleTimeChange}
                                    />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {vitals.map((vital, index) => (
                            <tr className='' key={vital.name}>
                                <td className='p-0 vitalsTableBorder'>
                                    {vital.name} {getDisplayUnit(vital) && (
                                        <small className="text-muted">({getDisplayUnit(vital)})</small>
                                    )}
                                </td>

                                {sortedDates.map(date => (
                                    <td className='vitalsTableBorder p-0' key={`${vital.name}-${date}`}>
                                        {renderVitalCell(vital, date)}
                                    </td>
                                ))}

                                <td className='p-0 fs-6 w-25 vitalsTableBorder' style={{ background: '#f8f9fa' }}>
                                    {vital.name === 'BMI' ? (
                                        // Special case for BMI - disabled field
                                        <Form.Control
                                            type="number"
                                            value={vital.value}
                                            readOnly
                                            disabled
                                            size="sm"
                                            className="bg-light" // Optional: Add light background to visually indicate disabled state
                                        />
                                    ) : vital.type === 'bp' ? (
                                        <>
                                            <div className="d-flex">
                                                <Form.Control
                                                    type="number"
                                                    value={vital.value.systolic}
                                                    className="me-1"
                                                    step="0.1"
                                                    onChange={(e) => handleVitalChange(index, 'systolic', e.target.value)}
                                                    onBlur={() => {
                                                        const error = validateVital(vital);
                                                        setValidationErrors(prev => ({ ...prev, [vital.name]: error }));
                                                        if (!error) submitObservation(vital);
                                                    }}
                                                    size="sm"
                                                />
                                                /
                                                <Form.Control
                                                    type="number"
                                                    value={vital.value.diastolic}
                                                    className="ms-1"
                                                    step="0.1"
                                                    onChange={(e) => handleVitalChange(index, 'diastolic', e.target.value)}
                                                    onBlur={() => {
                                                        const error = validateVital(vital);
                                                        setValidationErrors(prev => ({ ...prev, [vital.name]: error }));
                                                        if (!error) submitObservation(vital);
                                                    }}
                                                    size="sm"
                                                />
                                            </div>
                                            {validationErrors[vital.name] && (
                                                <div className="text-danger small">{validationErrors[vital.name]}</div>
                                            )}
                                        </>
                                    ) : vital.type === 'dropdown' ? (
                                        <Form.Select
                                            value={vital.value}
                                            onChange={(e) => handleVitalChange(index, null, e.target.value)}
                                            onBlur={() => {
                                                const error = validateVital(vital);
                                                setValidationErrors(prev => ({ ...prev, [vital.name]: error }));
                                                if (!error) submitObservation(vital);
                                            }}
                                            size="sm"
                                        >
                                            <option value="">Select</option>
                                            {vital.options.map(opt => <option key={opt}>{opt}</option>)}
                                        </Form.Select>
                                    ) : (
                                        <>
                                            <Form.Control
                                                type="number"
                                                step="0.1"
                                                value={vital.value}
                                                onChange={(e) => handleVitalChange(index, null, e.target.value)}
                                                onBlur={() => {
                                                    const error = validateVital(vital);
                                                    setValidationErrors(prev => ({ ...prev, [vital.name]: error }));
                                                    if (!error) submitObservation(vital);
                                                }}
                                                size="sm"
                                            />
                                            {validationErrors[vital.name] && (
                                                <div className="text-danger small">{validationErrors[vital.name]}</div>
                                            )}
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    {store?.getVitalsByPatientIdReducer?.loading &&
                        <div className='position-absolute' style={{ top: '35%', left: '50%' }}>
                            <Spinner />
                        </div>
                    }
                </Table>
            </div>
        </div>
    );
}