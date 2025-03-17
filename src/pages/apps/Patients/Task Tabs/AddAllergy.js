import React, { useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { encryptMessage } from '../../../../cryptoUtils';
import { useDispatch, useSelector } from 'react-redux';
import { createAllergyAction, getAllergiesOfPatientAction } from '../../../../redux/allergyList/action';

const AddAllergy = ({ onCancel }) => {
    const dispatch = useDispatch(); 
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const store = useSelector((state) => state);
    const createAllergyResponse = store?.createAllergyReducer?.data?.status;
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        clearErrors,
        watch,
        getValues,
    } = useForm();

    const onSubmit = (data) => {
        const createData = { ...data };

        const payload = {
            patientId: patientId,
            ...(createData?.allergyType ? { allergyType: createData?.allergyType } : {}),
            ...(createData?.allergyname ? { allergyname: createData?.allergyname } : {}),
            ...(createData?.reaction ? { reaction: createData?.reaction } : {}),
            ...(createData?.severity ? { severity: createData?.severity } : {}),
            ...(createData?.status ? { status: createData?.status } : {}),
            ...(createData?.notes ? { notes: createData?.notes } : {}),
        };

        dispatch(createAllergyAction({ key: encryptMessage(payload) }));
        console.log(payload, 'Allergy created');
    };

    useEffect(() => {
        const data = {
            patientId: patientId,
        };

        if (createAllergyResponse === 200) {
            dispatch(getAllergiesOfPatientAction(data));
        };
        reset();
    }, [dispatch, patientId, createAllergyResponse,reset]);

    return (
        <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <Col sm={12} className="d-flex justify-content-between">
                        <h4>Add Allergy</h4>
                        <Button className="custom-buttons" onClick={onCancel}>
                            Back
                        </Button>
                    </Col>

                    <Col sm={4}>
                        <Form.Group className="mb-1">
                            <Form.Label htmlFor="allergyType" className="mb-0">
                                Allergy Type
                            </Form.Label>
                            <Form.Select
                                id="allergyType"
                                {...register('allergyType', { required: 'Allergy Type is required' })}
                                data-has-value={!!watch('allergyType')}>
                                <option value="" hidden>
                                    Select Allergy Type
                                </option>
                                <option value="specificdrug">Specific Drug</option>
                                <option value="drugclass">Drug Class</option>
                                <option value="nondrug">Non-drug</option>
                                <option value="nkda">nkda</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col sm={4}>
                        <Form.Group className="mb-1">
                            <Form.Label htmlFor="allergyname" className="mb-0">
                                Specific Drug Allergy
                            </Form.Label>
                            <Form.Control
                                id="allergyname"
                                type="text"
                                placeholder="Enter Specific Drug Allergy"
                                {...register('allergyname', { required: 'Specific Drug Allergy is required' })}
                                data-has-value={!!watch('allergyname')}
                            />
                        </Form.Group>
                    </Col>

                    <Col sm={4}>
                        <Form.Group className="mb-1">
                            <Form.Label htmlFor="reaction" className="mb-0">
                                Reaction
                            </Form.Label>
                            <Form.Select
                                id="reaction"
                                {...register('reaction', { required: 'Reaction is required' })}
                                data-has-value={!!watch('reaction')}>
                                <option value="" hidden>
                                    Select Reaction
                                </option>
                                <option value="rash">Rash</option>
                                <option value="anaphylaxis">Anaphylaxis</option>
                                <option value="swelling">Swelling</option>
                                <option value="nausea">Nausea</option>
                                <option value="other">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label htmlFor="severity" className="mb-0">
                                Severity
                            </Form.Label>
                            <Form.Select
                                id="severity"
                                {...register('severity', { required: 'Severity is required' })}
                                data-has-value={!!watch('severity')}>
                                <option value="" hidden>
                                    Select Severity
                                </option>
                                <option value="Fatal">Fatal</option>
                                <option value="Severe">Severe</option>
                                <option value="Moderate to severe">Moderate to severe</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Mild to moderate">Mild to moderate</option>
                                <option value="Mild">Mild</option>
                                <option value="Unknown">Unknown</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col sm={6}>
                        <Form.Group className="mb-1">
                            <Form.Label htmlFor="status" className="mb-0">
                                Status
                            </Form.Label>
                            <Form.Select
                                {...register('status', { required: 'Status is required' })}
                                data-has-value={!!watch('status')}>
                                <option value="" hidden>
                                    Select Status
                                </option>
                                <option value="Done">Done</option>
                                <option value="Pending">Pending</option>
                                <option value="Hold">Hold</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col sm={12}>
                        <Form.Group className="mb-1">
                            <Form.Label htmlFor="notes" className="mb-0">
                                Note
                            </Form.Label>
                            <Form.Control
                                id="notes"
                                as="textarea"
                                placeholder="Note"
                                rows={4}
                                {...register('notes', { required: 'Note is required' })}
                                data-has-value={!!watch('notes')}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={12} className="d-flex justify-content-end gap-1 mt-1">
                        <Button className="custom-buttons">Cancel</Button>
                        {/* <Button className='custom-buttons'>Save and Add Another</Button> */}
                        <Button className="custom-buttons" type="submit">
                            Save
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default AddAllergy;
