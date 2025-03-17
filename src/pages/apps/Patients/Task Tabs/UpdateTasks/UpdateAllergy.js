import React, { useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../../../constants/Spinner';
import { getAllergiesOfPatientAction, updateAllergyAction } from '../../../../../redux/allergyList/action';
import { encryptMessage } from '../../../../../cryptoUtils';
import { useSearchParams } from 'react-router-dom';

const UpdateAllergy = ({ onCancel, allergy }) => {
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
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const allergyDetails = store?.getAllergyDetailsReducer?.data?.allergy;
    const updateAllergyStatus = store?.updateAllergyReducer?.data?.status;

    useEffect(() => {
        setValue('allergyType', allergyDetails?.allergyType);
        setValue('allergyname', allergyDetails?.allergyname);
        setValue('reaction', allergyDetails?.reaction);
        setValue('status', allergyDetails?.status);
        setValue('severity', allergyDetails?.severity);
        setValue('notes', allergyDetails?.notes);
    }, [allergyDetails]);

    const onSubmit = (data) => {
        const updateAllergy = { ...data };

        const payload = {
            id: allergy?._id,
            ...(updateAllergy?.allergyType ? { allergyType: updateAllergy?.allergyType } : {}),
            ...(updateAllergy?.allergyname ? { allergyname: updateAllergy?.allergyname } : {}),
            ...(updateAllergy?.reaction ? { reaction: updateAllergy?.reaction } : {}),
            ...(updateAllergy?.status ? { status: updateAllergy?.status } : {}),
            ...(updateAllergy?.severity ? { severity: updateAllergy?.severity } : {}),
            ...(updateAllergy?.notes ? { notes: updateAllergy?.notes } : {}),
        };

        dispatch(updateAllergyAction({ key: encryptMessage(payload) }));
    };

    useEffect(() => {
        const data = {
            patientId: patientId,
        };
        if (updateAllergyStatus === 200) {
            dispatch(getAllergiesOfPatientAction(data));
        }
    }, [ patientId,updateAllergyStatus]);

    return (
        <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                {store?.getAllergyDetailsReducer?.loading ? (
                    <div className="text-center my-5 py-5">
                        <Spinner className=" " />
                    </div>
                ) : (
                    <Row>
                        <Col sm={12} className="d-flex justify-content-between">
                            <h4>Update Allergy</h4>
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
                                    <option value="mild">Done</option>
                                    <option value="moderate">Pending</option>
                                    <option value="severe">Hold</option>
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
                            {/* <Button className="custom-buttons">Cancel</Button> */}
                            {/* <Button className='custom-buttons'>Save and Add Another</Button> */}
                            <Button className="custom-buttons" type="submit">
                                Update
                            </Button>
                        </Col>
                    </Row>
                )}
            </Form>
        </div>
    );
};

export default UpdateAllergy;
