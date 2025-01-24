import React, { useState } from 'react'
import { FiUploadCloud } from 'react-icons/fi';
import { Col, Form, Row, Button, Table, Modal, InputGroup, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createInsuranceAction } from '../../../../redux/actions';
import { useForm } from 'react-hook-form';
import { encryptMessage } from '../../../../cryptoUtils';

const AutoAccident = ({ patientId, activeTab }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
        getValues,
        setError,
        clearErrors
    } = useForm(); const [insuredPersonIsPatient, setInsuredPersonIsPatient] = useState(false)
    const [hasSimilarCondition, setHasSimilarCondition] = useState(false)
    const [claimRepresentativeIsInsurer, setClaimRepresentativeIsInsurer] = useState(true)
    const onSubmit = (data) => {

        // Helper function to remove empty values
        const removeEmptyValues = (obj) => {
            return Object.fromEntries(
                Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null && value !== '')
            );
        };

        const payload = {
            ...removeEmptyValues(data),
            claimRepresentativeIsInsurer: claimRepresentativeIsInsurer,
            insuredPersonIsPatient: insuredPersonIsPatient,
            insuranceType: 'Auto Accident',
            patientId: patientId,
            hcfaOptions: removeEmptyValues({
                defaultOnsetDate: data?.defaultOnsetDate,
                defaultInitialVisitDate: data?.defaultInitialVisitDate,
                // prepopulateLastRelatedVisit: { type: Boolean },
            }),
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
                    <div className="col-6 mt-1 ">
                        <Form.Group className='d-flex'>
                            <Form.Check
                                type="checkbox"
                                style={{ cursor: "pointer", color: "#6c757d" }}
                                {...register('insuredPersonIsPatient')}
                                label="Insured person is the same person as the Patient"
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                        setInsuredPersonIsPatient(true);
                                    } else {
                                        setInsuredPersonIsPatient(false);
                                    }
                                }}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1 ">
                        <Form.Group className='d-flex'>
                            <Form.Check
                                type="checkbox"
                                defaultChecked={claimRepresentativeIsInsurer}
                                style={{ cursor: "pointer", color: "#6c757d" }}
                                {...register('claimRepresentativeIsInsurer')}
                                label="Claim representative is the insurer"
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                        setClaimRepresentativeIsInsurer(true);
                                    } else {
                                        setClaimRepresentativeIsInsurer(true);
                                    }
                                }}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Company</Form.Label>
                            <Form.Control placeholder='Auto Accident Company' {...register('autoAccidentCompany')} />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Payer ID</Form.Label>
                            <Form.Control placeholder='Auto Accident Company' {...register('autoAccidentPayerId')} />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Policy Number</Form.Label>
                            <Form.Control placeholder='Auto Accident Policy Number' {...register('autoAccidentPolicyNumber')} />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Case Number</Form.Label>
                            <Form.Control placeholder='Auto Accident Case Number' {...register('autoAccidentCaseNumber')} />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Payer Address</Form.Label>
                            <Form.Control placeholder='Auto Accident Payer Address' {...register('autoAccidentPayerAddress')} />
                        </Form.Group>
                    </div>
                    <div className="col-3 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Payer State</Form.Label>
                            <Form.Control placeholder='Auto Accident Payer Address' {...register('autoAccidentPayerAddress')} />
                        </Form.Group>
                    </div>
                    <div className="col-3 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Payer City</Form.Label>
                            <Form.Control placeholder='Auto Accident Payer Address' {...register('autoAccidentPayerAddress')} />
                        </Form.Group>
                    </div>
                    <div className="col-3 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Payer Longitude</Form.Label>
                            <Form.Control placeholder='Auto Accident Payer Address' {...register('autoAccidentPayerAddress')} />
                        </Form.Group>
                    </div>
                    <div className="col-3 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Payer Latitude</Form.Label>
                            <Form.Control placeholder='Auto Accident Payer Address' {...register('autoAccidentPayerAddress')} />
                        </Form.Group>
                    </div>
                    <div className="col-3 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Payer ZIP</Form.Label>
                            <Form.Control placeholder='Auto Accident Payer Address' {...register('autoAccidentPayerAddress')} />
                        </Form.Group>
                    </div>
                    <div className="col-3 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Payer Timezone</Form.Label>
                            <Form.Control placeholder='Auto Accident Payer Address' {...register('autoAccidentPayerAddress')} />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Date of Accident</Form.Label>
                            <Form.Control type='date' {...register('autoAccidentDateOfAccident')} />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>State of Occurence</Form.Label>
                            <Form.Control type='date' {...register('autoAccidentStateOfOccurrence')} />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Auto Accident Notes</Form.Label>
                            <Form.Control type='text' placeholder='Notes' {...register('autoAccidentNotes')} />
                        </Form.Group>
                    </div>
                    <hr className='mt-1 mb-0' />
                    <div className="col-6 mt-1  d-flex align-items-center">
                        <div className="row">
                            <div className="col-12 mt-1">
                                <Form.Group className=''>
                                    <Form.Check
                                        type="checkbox"
                                        defaultChecked={hasSimilarCondition}
                                        style={{ cursor: "pointer", color: "#6c757d" }}
                                        {...register('hasSimilarCondition')}
                                        label="Has patient ever had same or similar condition?"
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            if (isChecked) {
                                                setHasSimilarCondition(true);
                                            } else {
                                                setHasSimilarCondition(false);
                                            }
                                        }}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-12 mt-1">
                                <Form.Group>
                                    <Form.Label className='mb-0'>If yes, state when {hasSimilarCondition ? <span className='text-danger'>*</span> : ''}</Form.Label>
                                    <Form.Control type='date' {...register('when', {
                                        required: hasSimilarCondition ? 'This field is required' : false,
                                    })} />
                                    {errors.when && (
                                        <span className="text-danger">{errors.when.message}</span>
                                    )}
                                </Form.Group>
                            </div>
                            <div className="col-12 mt-1">
                                <Form.Group>
                                    <Form.Label className='mb-0'>If yes, state why</Form.Label>
                                    <Form.Control type='text' {...register('why')} />
                                </Form.Group>
                            </div>
                        </div>

                    </div>
                    <div className="col-6 mt-1">
                        <div className="row">
                            <div className="col-12 mt-1">
                                <Form.Group className=''>
                                    <Form.Check
                                        type="checkbox"
                                        defaultChecked={hasSimilarCondition}
                                        style={{ cursor: "pointer", color: "#6c757d" }}
                                        {...register('hasSimilarCondition')}
                                        label="Is patient still under your care for this condition?"
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            if (isChecked) {
                                                setHasSimilarCondition(true);
                                            } else {
                                                setHasSimilarCondition(false);
                                            }
                                        }}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-12 mt-1">
                                <Form.Group>
                                    <Form.Label className='mb-0'>Estimated duration of future treatment</Form.Label>
                                    <Form.Control as={'textarea'} rows={3} />
                                </Form.Group>
                            </div>
                            <div className="col-12 mt-1"></div>
                        </div>
                    </div>

                    <hr className='mt-1 mb-0' />
                    <div className="col-6 mt-1">
                        <div className="row">
                            <div className="col-12 mt-1">
                                <Form.Group>
                                    <Form.Label className='mb-0'>Will injury result in permanent disfigurement or disability?</Form.Label>
                                    <Form.Select {...register('notDeterminable')}>
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                        <option value="Not determinable at this time">Not determinable at this time</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-12 mt-1">
                                <Form.Group>
                                    <Form.Label className='mb-0'>Patient was disabled (unable to work) from:</Form.Label>
                                    <Form.Control type='date' />
                                </Form.Group>
                            </div>

                        </div>

                    </div>
                    <div className="col-6 mt-1">
                        <div className="row">
                            <div className="col-12 mt-1">
                                <Form.Group>
                                    <Form.Label className='mb-0'>If yes, describe</Form.Label>
                                    <Form.Control as={'textarea'} rows={3} />
                                </Form.Group>
                            </div>

                        </div>

                    </div>
                    <div className="col-12 mt-1">
                        <div className="row">
                            <div className="col-6 mt-1">
                                <Form.Group>
                                    <Form.Label className='mb-0'>Patient was disabled (unable to work) to:</Form.Label>
                                    <Form.Control type='date' />
                                </Form.Group>
                            </div>
                            <div className="col-6 mt-1"> <Form.Group>
                                <Form.Label className='mb-0'>If still disabled, patient should be able to return to work on:</Form.Label>
                                <Form.Control type='date' />
                            </Form.Group></div>
                        </div>
                    </div>
                    <hr className='mt-1 mb-0' />

                    <div className="col-12 mt-1  d-flex align-items-center">
                        <Form.Group className=''>
                            <Form.Check
                                type="checkbox"
                                defaultChecked={hasSimilarCondition}
                                style={{ cursor: "pointer", color: "#6c757d" }}
                                {...register('hasSimilarCondition')}
                                label="Will the patient require rehabilitation and/or occupational therapy as a result of the injuries sustained in this accident?"
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                        setHasSimilarCondition(true);
                                    } else {
                                        setHasSimilarCondition(false);
                                    }
                                }}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>If YES, please state your recommendation</Form.Label>
                            <Form.Control as={'textarea'} />
                        </Form.Group>
                    </div>
                </div>


                <div className="col-12 mt-1 d-flex align-items-center gap-2 justify-content-end">
                    <Button className='custom-buttons' disabled={store?.createInsuranceReducer?.loading} >Save and add another</Button>
                    <Button className='custom-buttons' disabled={store?.createInsuranceReducer?.loading} >Save and continue editing</Button>
                    <Button className='custom-buttons' disabled={store?.createInsuranceReducer?.loading} type='submit' >Save</Button>
                </div>
            </Form>
        </div>
    )
}

export default AutoAccident