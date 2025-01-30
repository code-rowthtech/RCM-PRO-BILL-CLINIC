import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { createVitalsAction, getVitalsByPatientIdAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';

const VitalStatus = ({ patientId }) => {
    const [yesterdayVitals, setYesterdayVitals] = useState({});
    const [todayVitals, setTodayVitals] = useState({ weight: '', height: '', bmi: '', smoking_status: '' });
    const [todayDate, setTodayDate] = useState(new Date());
    const [yesterdayDate, setYesterdayDate] = useState(new Date());
    const [previousVitals, setPreviousVitals] = useState();
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const patientVitals = store?.getVitalsByPatientIdReducer?.data?.vitals;
    useEffect(() => {
        dispatch(getVitalsByPatientIdAction({ key: encryptMessage({ patientId: patientId }) }))
    }, [patientId, dispatch]);

    const smokingOptions = [
        'Former smoker', 'Smoker, current status unknown', 'Never smoker', 'Unknown if ever smoked',
        'Current every day smoker', 'Light tobacco smoker', 'Heavy tobacco smoker', 'Current some day smoker'
    ];

    const vitalsList = [
        { key: 'temperature', label: 'Temperature', unit: '°F' },
        { key: 'height', label: 'Height', unit: 'in' },
        { key: 'systolic', label: 'Systolic BP', unit: 'mmHg' },
        { key: 'diastolic', label: 'Diastolic BP', unit: 'mmHg' },
        { key: 'respiratory_rate', label: 'Respiratory Rate', unit: 'rpm' },
        { key: 'oxygen_saturation', label: 'Oxygen Saturation', unit: '%' },
        { key: 'pulse', label: 'Pulse', unit: 'bpm' },
        { key: 'weight', label: 'Weight', unit: 'lbs' },
        { key: 'bmi', label: 'BMI', unit: 'kg/m²', calculated: true },
        { key: 'pain_level', label: 'Pain', unit: '(0-10)' },
        { key: 'head_circumference', label: 'Head Circumference', unit: 'in' },
        { key: 'weight_for_length_percentile', label: 'Weight-for-length Percentile', unit: '%' },
        { key: 'bmi_percentile', label: 'BMI Percentile', unit: '%' },
        { key: 'oxygen_concentration', label: 'Oxygen Concentration', unit: '%' },
        { key: 'inhaled_oxygen_flow_rate', label: 'Inhaled Oxygen Flow Rate', unit: 'l/min' },
        { key: 'smoking_status', label: 'Smoking Status' },
    ];

    const handleInputChange = (key, value) => {
        setTodayVitals((prevVitals) => {
            const newVitals = { ...prevVitals, [key]: key === 'smoking_status' ? value : parseInt(value) };

            // Calculate BMI when weight or height changes
            if (key === 'weight' || key === 'height') {
                const weight = (newVitals.weight) || 0;
                const height = (newVitals.height) || 0;

                if (weight > 0 && height > 0) {
                    newVitals.bmi = parseInt(((weight / (height * height)) * 703).toFixed(2));
                } else {
                    newVitals.bmi = '';
                }
            }

            return newVitals;
        });
    };

    const handleSubmit = () => {
        // console.log(todayVitals);

        const payload = {
            patientId: patientId,
            temperature: { value: todayVitals.temperature, unit: 'F' },
            pulse: { value: todayVitals.pulse, unit: 'bpm' },
            blood_pressure: { systolic: todayVitals.systolic, diastolic: todayVitals.diastolic, unit: 'mmHg' },
            respiratory_rate: { value: todayVitals.respiratory_rate, unit: 'rpm' },
            oxygen_saturation: { value: todayVitals.oxygen_saturation, unit: '%' },
            height: { value: todayVitals.height, unit: 'in' },
            weight: { value: todayVitals.weight, unit: 'lbs' },
            bmi: { value: todayVitals.bmi, unit: 'kg/m²' },
            pain_level: { value: todayVitals.pain_level, unit: 'scale (0-10)' },
            ...(todayVitals.smoking_status !== '' ? { smoking_status: todayVitals.smoking_status } : {}),
            head_circumference: { value: todayVitals.head_circumference, unit: 'in' },
            weight_for_length_percentile: { value: todayVitals.weight_for_length_percentile, unit: '%' },
            bmi_percentile: { value: todayVitals.bmi_percentile, unit: '%' },
            oxygen_concentration: { value: todayVitals.oxygen_concentration, unit: '%' },
            inhaled_oxygen_flow_rate: { value: todayVitals.inhaled_oxygen_flow_rate, unit: 'l/min' },
        };
        dispatch(createVitalsAction({ key: encryptMessage(payload) }))

    };

    useEffect(() => {
        if (patientVitals && patientVitals.length > 0) {
            // Sort vitals by date (newest first)
            const sortedVitals = [...patientVitals].sort((a, b) => new Date(b.date) - new Date(a.date));

            // The latest entry will be the first after sorting
            const latestVitals = sortedVitals[0];

            setTodayVitals({
                temperature: latestVitals.temperature?.value || '',
                height: latestVitals.height?.value || '',
                systolic: latestVitals.blood_pressure?.systolic || '',
                diastolic: latestVitals.blood_pressure?.diastolic || '',
                respiratory_rate: latestVitals.respiratory_rate?.value || '',
                oxygen_saturation: latestVitals.oxygen_saturation?.value || '',
                pulse: latestVitals.pulse?.value || '',
                weight: latestVitals.weight?.value || '',
                bmi: latestVitals.bmi?.value || '',
                pain_level: latestVitals.pain_level?.value || '',
                head_circumference: latestVitals.head_circumference?.value || '',
                weight_for_length_percentile: latestVitals.weight_for_length_percentile?.value || '',
                bmi_percentile: latestVitals.bmi_percentile?.value || '',
                oxygen_concentration: latestVitals.oxygen_concentration?.value || '',
                inhaled_oxygen_flow_rate: latestVitals.inhaled_oxygen_flow_rate?.value || '',
                smoking_status: latestVitals.smoking_status || '',
            });

            // Store all previous vitals (excluding the latest one)
            setPreviousVitals(sortedVitals.slice(1));

            setTodayDate(new Date(latestVitals.date));
        }
    }, [patientVitals]);


    return (
        <>
            {store?.getVitalsByPatientIdReducer?.loading ?
                <div className='d-flex justify-content-center align-items-center'>
                    <Spinner />
                </div>
                :
                <div className='mb-2'>
                    <div className='rounded' style={{ border: '1px solid #ced4da' }}>
                        <div className='px-2'>
                            <Row className='pb-1' style={{ background: '#313A46', borderTopLeftRadius: '3px', borderTopRightRadius: '3px' }}>
                                <Col sm={3}><p className='text-nowrap mt-2 mb-0 fw-bold text-white'>System Vitals</p></Col>
                                <Col sm={9} className='d-flex gap-1 justify-content-end pt-1'>
                                    <p className='text-nowrap mt-1 mb-0 fw-bold text-white'>Note Rendering Options:</p>
                                    <Form.Group controlId="newestToOldest">
                                        <Form.Select style={{ height: '33px' }}>
                                            <option value='1'>Newest to oldest</option>
                                            <option value='-1'>Oldest to newest</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className='px-2'>
                                <Row className='' >
                                    <Col className='px-0'
                                    ><p className='m-0  fw-bold'>Name</p></Col>
                                    {previousVitals && previousVitals?.map((data) => (
                                        <Col key={data?._id} style={{ background: '#E6EBFF' }}>
                                            <p className='m-0 fw-bold'>
                                                {new Date(data?.date).toISOString().split('T')[0]}
                                            </p>
                                        </Col>
                                    ))}
                                    <Col className='text-center px-0'
                                        style={{ background: '#E6EBFF' }}
                                    >
                                        <p className='m-0 fw-bold'>{todayDate.toISOString().split('T')[0]}</p>
                                    </Col>
                                </Row>
                            </div>


                            {vitalsList.map((vital, index) => (
                                <React.Fragment key={index}>
                                    {/* Vital Name & Today's Data */}
                                    <Row className='border-bottom px-2'>
                                        <Col className='px-0'>
                                            <p className='mb-0'>{vital.label} <span className='text-secondary'>{vital.unit}</span></p>
                                        </Col>

                                        {/* Display previous vitals under respective sections */}
                                        {previousVitals?.map((prev, idx) => (
                                            <Col key={idx} className="px-0 text-center" style={{ background: idx % 2 === 0 ? '#E6EBFF' : '#E6EBFF' }}>
                                                {/* Check if the vital is blood_pressure and render systolic and diastolic */}
                                                {vital.key === 'systolic' ? (
                                                    prev.blood_pressure?.systolic || '—'
                                                ) : vital.key === 'diastolic' ? (
                                                    prev.blood_pressure?.diastolic || '—'
                                                ) : (
                                                    prev[vital.key]?.value || '—'
                                                )}
                                            </Col>
                                        ))}

                                        {/* Today's Value */}
                                        <Col className='px-0'>
                                            {vital.key === 'bmi' ? (
                                                <p className='mb-0'>{todayVitals.bmi || '—'}</p>
                                            ) : vital.key === 'smoking_status' ? (
                                                <Form.Select value={todayVitals.smoking_status} onChange={(e) => handleInputChange('smoking_status', e.target.value)}>
                                                    <option value="" hidden>Select Smoking Status</option>
                                                    {smokingOptions.map(opt => <option key={opt}>{opt}</option>)}
                                                </Form.Select>
                                            ) : (
                                                <Form.Control
                                                    type="number"
                                                    value={todayVitals[vital.key] || ''}
                                                    onChange={(e) => handleInputChange(vital.key, e.target.value)}
                                                />
                                            )}
                                        </Col>
                                    </Row>
                                </React.Fragment>
                            ))}

                        </div>
                    </div>
                    <Row><Col className='d-flex justify-content-end  mt-2'><Button disabled={store?.createVitalsReducer?.loading}
                        onClick={handleSubmit} className='custom-buttons'>Mark as Done</Button></Col></Row>
                </div>
            }
        </>

    );
};

export default VitalStatus;
