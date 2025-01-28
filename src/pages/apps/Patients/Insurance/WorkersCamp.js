import React, { useState } from 'react'
import { FiUploadCloud } from 'react-icons/fi';
import { Col, Form, Row, Button, Table, Modal, InputGroup, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createInsuranceAction } from '../../../../redux/actions';
import { useForm } from 'react-hook-form';
import { encryptMessage } from '../../../../cryptoUtils';

const WorkersCamp = ({ patientId, activeTab }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const { handleSubmit, reset, register, errors } = useForm();
    const [insuredPersonIsPatient, setInsuredPersonIsPatient] = useState(false)
    const [subscriberIsPatient, setSubscriberIsPatient] = useState(true)
    const onSubmit = (data) => {

        // Helper function to remove empty values
        const removeEmptyValues = (obj) => {
            return Object.fromEntries(
                Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null && value !== '')
            );
        };

        const payload = {
            ...removeEmptyValues(data),
            subscriberIsPatient: subscriberIsPatient,
            insuredPersonIsPatient: insuredPersonIsPatient,
            insuranceType: `Worker's Comp`,
            patientId: patientId,
        };

        console.log(payload, 'payyyyyyyyyyyy');
        dispatch(createInsuranceAction({ key: encryptMessage(payload) }));
    };

    const tableData = [
        { type: 'Patient', values: Array(6).fill("0.00") },
        { type: 'Insurance', values: Array(6).fill("0.00") }, // Add more rows as needed
    ];
    return (
        <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Provider</Form.Label>
                            <Form.Control className='mb-1' type='text' placeholder='Insurance Provider' {...register("insuranceProvider")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Payer ID</Form.Label>
                            <Form.Control className='mb-1' type='text' placeholder='Insurance Payer ID' {...register("carrierPayerId")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Group Name</Form.Label>
                            <Form.Control className='mb-1' type='text' placeholder='Insurance Group Name' {...register("insuranceGroupName")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Group Number</Form.Label>
                            <Form.Control className='mb-1' type='text' placeholder='Insurance Group Number' {...register("insuranceGroupNumber")} />
                        </Form.Group>
                    </div>
                    <div className="col-6">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Payer Address</Form.Label>
                            <Form.Control className='mb-1' type='text' placeholder='Insurance Payer Address' {...register("insurancePayerAddress")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Payer State</Form.Label>
                            <Form.Control className='mb-1' type='text' placeholder='Insurance Payer Address' {...register("insurancePayerState")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Payer City</Form.Label>
                            <Form.Control className='mb-1' type='text' placeholder='Insurance Payer Address' {...register("insurancePayerCity")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Longitude</Form.Label>
                            <Form.Control className='mb-1' type='text' placeholder='Longitude' {...register("longitude")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Latitude</Form.Label>
                            <Form.Control className='mb-1' type='text' placeholder='Latitude' {...register("latitude")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>ZIP</Form.Label>
                            <Form.Control className='mb-1' type='text' placeholder='ZIP' {...register("insurancePayerZip")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>TimeZone</Form.Label>
                            <Form.Control className='mb-1' type='text' placeholder='TimeZone' {...register("insurancePayerTimeZone")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Date of Accident</Form.Label>
                            <Form.Control className='mb-1' type='date' {...register("dateOfAccident")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance W.C.B. #</Form.Label>
                            <Form.Control className='mb-1' placeholder='Insurance W.C.B. #' {...register("insuranceWcbNumber")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance W.C.B. Rating Code</Form.Label>
                            <Form.Control className='mb-1' placeholder='Insurance W.C.B. Rating Code' {...register("insuranceWcbRatingCode")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Carrier Code</Form.Label>
                            <Form.Control className='mb-1' placeholder='Insurance Carrier Code' {...register("insuranceCarrierCode")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Case #</Form.Label>
                            <Form.Control className='mb-1' placeholder='Insurance Case #' {...register("insuranceCaseNumber")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>State of Occurence</Form.Label>
                            <Form.Control className='mb-1' placeholder='Insurance Case #' {...register("stateOfOccurrence")} />
                        </Form.Group>
                    </div>
                    <div className="col-3">
                        <Form.Group>
                            <Form.Label className='mb-0'>Property & Casualty Agency Claim # </Form.Label>
                            <Form.Control className='mb-1' placeholder='Property & Casualty Agency Claim #' {...register("propertyCasualtyClaimNumber")} />
                        </Form.Group>
                    </div>
                    <div className="col-6">
                        <Form.Group>
                            <Form.Label className='mb-0'>Workers comp notes </Form.Label>
                            <Form.Control className='mb-1' rows={3} as={'textarea'} placeholder='Workers comp notes' {...register("workersCompNotes")} />
                        </Form.Group>
                    </div>
                </div>

                <div className="col-12 d-flex my-2 align-items-center gap-2 justify-content-end">
                    <Button className='custom-buttons btn-height' disabled={store?.createInsuranceReducer?.loading} >Save and add another</Button>
                    <Button className='custom-buttons btn-height' disabled={store?.createInsuranceReducer?.loading} >Save and continue editing</Button>
                    <Button className='custom-buttons btn-height' disabled={store?.createInsuranceReducer?.loading} type='submit' >Save</Button>
                </div>
            </Form>
        </div>
    )
}

export default WorkersCamp