import React, { useEffect, useState } from 'react'
import { FiUploadCloud } from 'react-icons/fi';
import { Col, Form, Row, Button, Table, Modal, InputGroup, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createInsuranceAction, updateInsuranceAction } from '../../../../redux/actions';
import { useForm } from 'react-hook-form';
import { encryptMessage } from '../../../../cryptoUtils';
import { useSearchParams } from 'react-router-dom';

const SecondaryInsuance = ({ patientId, activeTab }) => {
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const { handleSubmit, reset, register, setValue } = useForm();
    const [insuredPersonIsPatient, setInsuredPersonIsPatient] = useState(false)
    const [subscriberIsPatient, setSubscriberIsPatient] = useState(true)
    const insuranceByPatient = store?.getInsuranceByIdReducer?.data?.insurance;
    const secondaryInsurance = insuranceByPatient && insuranceByPatient?.find((data) => data?.insuranceType === 'Secondary Ins')
    useEffect(() => {
        if (id && insuranceByPatient) {
            setValue('subscriberIsPatient', secondaryInsurance?.subscriberIsPatient);
            setValue('insuredPersonIsPatient', secondaryInsurance?.insuredPersonIsPatient);
            setValue('insuranceCompany', secondaryInsurance?.insuranceCompany);
            setValue('carrierPayerId', secondaryInsurance?.carrierPayerId);
            setValue('insuranceIdNumber', secondaryInsurance?.insuranceIdNumber);
            setValue('insuranceGroupName', secondaryInsurance?.insuranceGroupName);
            setValue('insuranceGroupNumber', secondaryInsurance?.insuranceGroupNumber);
            setValue('insurancePlanName', secondaryInsurance?.insurancePlanName);
            setValue('insurancePlanType', secondaryInsurance?.insurancePlanType);
            setValue('insuranceType', secondaryInsurance?.insuranceType);
            setValue('secondaryInsuranceTypeCode', secondaryInsurance?.secondaryInsuranceTypeCode);
            setValue('insuranceClaimOfficeNumber', secondaryInsurance?.insuranceClaimOfficeNumber);
            setValue('insuranceNotes', secondaryInsurance?.insuranceNotes);
            setValue('cardIssuedDate', new Date(secondaryInsurance?.cardIssuedDate).toISOString().split('T')[0]);
        }
    }, [insuranceByPatient, id])
    const onSubmit = (data) => {

        // Helper function to remove empty values
        const removeEmptyValues = (obj) => {
            return Object.fromEntries(
                Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null && value !== '')
            );
        };

        const payload = {
            ...removeEmptyValues(data),
            ...(id && secondaryInsurance ? { id: secondaryInsurance?._id } : {}),
            subscriberIsPatient: subscriberIsPatient,
            insuredPersonIsPatient: insuredPersonIsPatient,
            insuranceType: 'Secondary Ins',
            patientId: patientId,
            hcfaOptions: removeEmptyValues({
                defaultOnsetDate: data?.defaultOnsetDate,
                defaultInitialVisitDate: data?.defaultInitialVisitDate,
                // prepopulateLastRelatedVisit: { type: Boolean },
            }),
        };

        if (id && secondaryInsurance) {
            dispatch(updateInsuranceAction({ key: encryptMessage(payload) }))
        } else {
            dispatch(createInsuranceAction({ key: encryptMessage(payload) }));
        }
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
                                label="Subscriber is the patient"
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
                            <Form.Label className='mb-0'>Card Issued Date</Form.Label>
                            <Form.Control type='date' {...register('cardIssuedDate')} />

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
                        <Form.Group>
                            <Form.Label className='mb-0'>Secondary Insurance Type Code</Form.Label>
                            <Form.Select {...register('secondaryInsuranceTypeCode')} >
                                <option value="">Select Secondary Insurance Type Code</option>
                                <option value="Medicare Secondary Working Aged Beneficiary or Spouse with Employer Group Health Plan">
                                    Medicare Secondary Working Aged Beneficiary or Spouse with Employer Group Health Plan
                                </option>
                                <option value="Medicare Secondary End-Stage Renal Disease Beneficiary in the Mandated Coordination Period">
                                    Medicare Secondary End-Stage Renal Disease Beneficiary in the Mandated Coordination Period
                                </option>
                                <option value="Medicare Secondary, No-fault Insurance including Auto is Primary">
                                    Medicare Secondary, No-fault Insurance including Auto is Primary
                                </option>
                                <option value="Medicare Secondary Worker's Compensation">
                                    Medicare Secondary Worker's Compensation
                                </option>
                                <option value="Medicare Secondary Public Health Service (PHS) or Other Federal Agency">
                                    Medicare Secondary Public Health Service (PHS) or Other Federal Agency
                                </option>
                                <option value="Medicare Secondary Black Lung">
                                    Medicare Secondary Black Lung
                                </option>
                                <option value="Medicare Secondary Veteran's Administration">
                                    Medicare Secondary Veteran's Administration
                                </option>
                                <option value="Medicare Secondary Disabled Beneficiary Under Age 65 with Large Group Health Plan (LGHP)">
                                    Medicare Secondary Disabled Beneficiary Under Age 65 with Large Group Health Plan (LGHP)
                                </option>
                                <option value="Medicare Secondary, Other Liability Insurance is Primary">
                                    Medicare Secondary, Other Liability Insurance is Primary
                                </option>
                            </Form.Select>

                        </Form.Group>
                    </div>
                    <div className="col-6 mt-1">
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
                            <Form.Label className='mb-0'>Secondary Issuance Notes</Form.Label>
                            <Form.Control placeholder='Secondary Issuance Notes' {...register('insuranceNotes')} type='text' />
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
                    <Button className='custom-buttons btn-height' disabled={store?.createInsuranceReducer?.loading} >Save and add another</Button>
                    <Button className='custom-buttons btn-height' disabled={store?.createInsuranceReducer?.loading} >Save and continue editing</Button>
                    <Button className='custom-buttons btn-height' disabled={store?.createInsuranceReducer?.loading} type='submit' >Save</Button>
                </div>
            </Form>
        </div>
    )
}

export default SecondaryInsuance