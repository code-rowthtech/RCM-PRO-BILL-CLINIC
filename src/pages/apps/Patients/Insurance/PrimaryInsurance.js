import React, { useState } from 'react'
import { FiUploadCloud } from 'react-icons/fi';
import { Col, Form, Row, Button, Table, Modal, InputGroup, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createInsuranceAction } from '../../../../redux/actions';
import { useForm } from 'react-hook-form';
import { encryptMessage } from '../../../../cryptoUtils';

const PrimaryInsurance = ({ patientId, activeTab }) => {
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
            insuranceType: 'Primary Ins',
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
                                    setInsuredPersonIsPatient(true);
                                }}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1 ">
                        <Form.Group className='d-flex'>
                            <Form.Check
                                type="checkbox"
                                defaultChecked={subscriberIsPatient}
                                style={{ cursor: "pointer", color: "#6c757d" }}
                                {...register('subscriberIsPatient')}
                                label="Insured person is the same person as the Patient"
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setSubscriberIsPatient(true);
                                }}
                            />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Company</Form.Label>
                            <Form.Control placeholder='Insurance Company' {...register('insuranceCompany')} type='text' />
                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Carrier Payer ID</Form.Label>
                            <Form.Control placeholder='Carrier Payer ID' {...register('carrierPayerId')} type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Alternate Eligible Payer</Form.Label>
                            <Form.Control placeholder='Alternate Eligible Payer' {...register('alternateEligibilityPayer')} type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>TPL Code</Form.Label>
                            <Form.Control placeholder='TPL Code' {...register('tplCode')} type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance ID Number</Form.Label>
                            <Form.Control placeholder='Insurance ID Number' {...register('insuranceIdNumber')} type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Group Name</Form.Label>
                            <Form.Control placeholder='Insurance Group Name' {...register('insuranceGroupName')} type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Group Number</Form.Label>
                            <Form.Control placeholder='Insurance Group Number' {...register('insuranceGroupNumber')} type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Plan Name</Form.Label>
                            <Form.Control placeholder='Insurance Plan Name' {...register('insurancePlanName')} type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Plan Type</Form.Label>
                            <Form.Control placeholder='Insurance Plan Type' {...register('insurancePlanType')} type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Insurance Claim Office Number</Form.Label>
                            <Form.Control placeholder='Insurance Claim Office Number' {...register('insuranceClaimOfficeNumber')} type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Number Of Visits Allowed Per Year</Form.Label>
                            <Form.Control placeholder='Number Of Visits Allowed Per Year'
                                {...register('numberVisitsAllowedPerYear', {
                                    pattern: {
                                        value: /^[1-9]\d*$/, // Matches positive integers only
                                        message: 'Please enter a valid positive number', // Custom error message
                                    },
                                })}
                                type='text' />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Card Issued Date</Form.Label>
                            <Form.Control type='date' {...register('cardIssuedDate')} />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        {/* <Form.Group>
                                    <Form.Label className='mb-0'>Insurance Photo Front</Form.Label>
                                    <Form.Control placeholder='Insurance Company' type='text' />

                                </Form.Group> */}
                        <div className="mb-1 d-flex flex-column position-relative">
                            <Form.Label className="mb-0">Insurance Photo Front</Form.Label>
                            <div
                                className='custom-file-upload justify-content-between cursor-pointer'>
                                <p className="mb-0">
                                    Upload
                                </p>
                                <p className="mb-0">
                                    <FiUploadCloud />
                                </p>
                            </div>
                            <Form.Control
                                type="file"
                                className="d-none "
                            />
                        </div>
                    </div>
                    <div className="col-6 mt-1">
                        <div className="mb-1 d-flex flex-column position-relative">
                            <Form.Label className="mb-0">Insurance Photo Back</Form.Label>
                            <div className='custom-file-upload justify-content-between cursor-pointer'>
                                <p className="mb-0">
                                    Upload
                                </p>
                                <p className="mb-0">
                                    <FiUploadCloud />
                                </p>
                            </div>
                            <Form.Control
                                type="file"
                                className="d-none " />
                        </div>
                    </div>
                    <div className="col-12">
                        <Form.Group>
                            <Form.Label className='mb-0'>Primary Issuance Notes</Form.Label>
                            <Form.Control placeholder='Primary Issuance Notes' {...register('insuranceNotes')} type='text' />
                        </Form.Group>
                    </div>
                </div>
                <hr className='my-3' />
                <div className="row ">
                    <div className="col-12">
                        <h4 className='my-0'>HCFA Options</h4>
                    </div>
                    <div className="col-6">
                        <Form.Group>
                            <Form.Label className='mb-0'>
                                Default Onset Date
                            </Form.Label>
                            <Form.Control type='date' {...register('defaultOnsetDate')} />
                        </Form.Group>
                    </div>
                    <div className="col-6">
                        <Form.Group>
                            <Form.Label className='mb-0'>
                                Default Initial Visit Date
                            </Form.Label>
                            <Form.Control type='date' {...register('defaultInitialVisitDate')} />
                        </Form.Group>
                    </div>
                </div>
                <Row className='my-2'>
                    <Col sm={6} className="">
                        <Table responsive className="table-centered table-nowrap mb-0 mt-1">
                            <thead className="text-white">
                                <tr>
                                    <th className='text-white'>Seq</th>
                                    <th className='text-white'>Coverage</th>
                                    <th className='text-white'>Carrier</th>
                                    <th className='text-white'>Subscriber</th>
                                    <th className='text-white'>Id#</th>
                                    <th className='text-white'>Capay</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Primary</td>
                                    <td>Anthem</td>
                                    <td>Test</td>
                                    <td>2333</td>
                                    <td>
                                        0.00
                                    </td>
                                </tr>


                            </tbody>
                        </Table>
                    </Col>
                    <Col sm={6}>
                        <Table responsive className="table-centered table-nowrap mb-0 mt-1 ">
                            <thead className="text-white">
                                <tr>
                                    <th className="text-white">Unapplied</th>
                                    <th className="text-white">0-30</th>
                                    <th className="text-white">31-60</th>
                                    <th className="text-white">61-90</th>
                                    <th className="text-white">91-120</th>
                                    <th className="text-white">121+</th>
                                    <th className="text-white">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td>{row.type}</td>
                                        {row.values.map((value, colIndex) => (
                                            <td key={colIndex}>
                                                <Form.Group>
                                                    <InputGroup>
                                                        <Form.Control
                                                            type="tel"
                                                            placeholder={value}
                                                        />
                                                    </InputGroup>
                                                </Form.Group>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>

                <div className="col-12 d-flex align-items-center gap-2 justify-content-end">
                    <Button className='custom-buttons' disabled={store?.createInsuranceReducer?.loading} >Save and add another</Button>
                    <Button className='custom-buttons' disabled={store?.createInsuranceReducer?.loading} >Save and continue editing</Button>
                    <Button className='custom-buttons' disabled={store?.createInsuranceReducer?.loading} type='submit' >Save</Button>
                </div>
            </Form>
        </div>
    )
}

export default PrimaryInsurance