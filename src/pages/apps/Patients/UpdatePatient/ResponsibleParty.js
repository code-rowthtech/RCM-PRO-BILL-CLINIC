import React, { useEffect, useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import AddressForm from '../../Common Pages/AddressForm';
import TelecomFrom from '../../Common Pages/TelecomFrom';
import { useDispatch, useSelector } from 'react-redux';
import { encryptMessage } from '../../../../cryptoUtils';
import { createResponsiblePartyAction, getPatientByIdAction } from '../../../../redux/actions';
import { dataList } from '../../../../utils/DataSets/relations.data';
import Select from 'react-select';
import Spinner from '../../../../constants/Spinner';

const ResponsiblleParty = ({ activeTab, setActiveTab, isAccordionOpen }) => {
    const store = useSelector((state) => state);
    const [submissionType, setSubmissionType] = useState(null);
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    console.log('patientId', patientId);
    const [responsibleAddresses, setResponsibleAddresses] = useState([
        { type: '', use: '', line: [''], city: '', state: '', postalCode: '', country: '' },
    ]);

    const [responsibleTelecom, setResponsibleTelecom] = useState([{ system: '', value: '', use: '' }]);
    const createResponse = store?.createResponsiblePartyReducer?.data?.status;
    const patientDetails = store?.getPatientByIdReducer?.data?.data;
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm();

    useEffect(() => {
        if ((patientDetails && patientId) && patientDetails?._id === patientId) {
            setValue('title', patientDetails?.relatedPerson?.name?.[0]?.prefix);
            setValue('fullName', patientDetails?.relatedPerson?.name?.find((data) => data?.use === 'official')?.text);
            setValue('gender', patientDetails?.gender);
            setRela(patientDetails?.relatedPerson?.relationship?.[0]?.coding?.[0]);
            setValue(
                'dateOfBirth',
                patientDetails?.relatedPerson?.dateOfBirth
                    ? new Date(patientDetails?.relatedPerson?.dateOfBirth).toISOString().split('T')[0]
                    : ''
            );
            const updateAddress = patientDetails?.address?.map((data, index) => ({
                city: data?.city,
                country: data?.country,
                line: data?.line,
                postalCode: data?.postalCode,
                state: data?.state,
                type: data?.type,
                use: data?.use,
            }));
            setResponsibleAddresses(updateAddress);
            const rawTelecom = patientDetails?.relatedPerson?.telecom;
            const updateTelecom = Array.isArray(rawTelecom)
                ? rawTelecom.map((data) => ({
                    system: data?.system || '',
                    value: data?.value || '',
                    use: data?.use || '',
                }))
                : [];

            setResponsibleTelecom(updateTelecom);
        }
    }, [patientDetails, patientId]);
    const onSubmit = (data) => {
        const payload = {
            patientId: patientId,
            clinicId: clinicId,
            id: patientDetails?.relatedPerson?._id, // ✅ This is the referring doctor ID you want
            name: [
                {
                    use: 'official', // You can set this dynamically if needed
                    text: data?.fullName,
                    family: data?.lastName || '', // Assuming you have a last name field
                    given: [data?.firstName || '', data?.middleName || ''], // Assuming first & middle name exist
                    prefix: data?.title || '', // Using title as prefix
                    suffix: [], // Add suffix if available
                    preferred: true,
                },
            ],
            relationship: [
                {
                    coding: [rela],
                    text: data?.fullName, // Human-readable relationship (e.g., "Father", "Aunt")
                },
            ],
            address: responsibleAddresses,
            gender: data?.gender,
            dateOfBirth: data?.dateOfBirth,
            telecom: responsibleTelecom,
        };
        dispatch(createResponsiblePartyAction({ key: encryptMessage(payload) }));
    };

  useEffect(() => {
        if(createResponse === 201) {
            dispatch(getPatientByIdAction({ patientId }));
        }
    }, [createResponse]);
    const relationshipOption = dataList?.map((relation) => ({
        value: relation, // Code as the value
        label: relation.display, // Display text as the label
    }));
    const [rela, setRela] = useState(null);
    const handleRelationChange = (selectedOption) => {
        setRela(selectedOption ? selectedOption.value : '');
    };
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div className='scroll-container ' style={{ overflowX: 'hidden', height: isAccordionOpen ? '54.7vh' : '70vh' }}>
                <div className="row  pb-2 pt-1 pe-0">
                    <div className="col-md-3 col-12 pe-1">
                        <Form.Label className="mb-0">
                            Title <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select {...register('title', { required: 'This field is required' })}>
                            <option value="">Select Title</option>
                            <option value="Mr.">Mr.</option>
                            <option value="Mrs.">Mrs.</option>
                            <option value="Miss">Miss</option>
                            <option value="Dr.">Dr.</option>
                            <option value="Other">Other</option>
                        </Form.Select>
                        {errors.title && <span className="text-danger">{errors.title.message}</span>}
                    </div>
                    <div className="col-md-3 col-12">
                        <Form.Label htmlFor="fileName" className="mb-0">
                            Full Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Full Name"
                            {...register('fullName', { required: 'Full name is required' })}
                        />
                        {errors.fullName && <span className="text-danger">{errors.fullName.message}</span>}
                    </div>

                    <div className="col-md-3 col-12">
                        <Form.Label htmlFor="gender" className="mb-0">
                            Gender <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="d-flex gap-2">
                            <Form.Select
                                {...register('gender', { required: 'Gender is required' })}
                                aria-label="Select Gender">
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </Form.Select>
                        </div>
                        {errors.gender && <span className="text-danger">{errors.gender.message}</span>}
                    </div>
                    <div className="col-md-3 col-12 pe-0">
                        <Form.Label htmlFor="DOB" className="mb-0">
                            Date of Birth <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                            type="date"
                            placeholder="Date of Birth"
                            {...register('dateOfBirth', { required: 'This field is required' })}
                        />
                        {errors.dateOfBirth && <span className="text-danger">{errors.dateOfBirth.message}</span>}
                    </div>
                    <Col sm={3} className="mb-2">
                        <Form.Group>
                            <Form.Label className="mb-0">Emergency Contact Relation</Form.Label>
                            <Select
                                options={relationshipOption} // Use the formatted array
                                isSearchable
                                className="basic-single"
                                classNamePrefix="select"
                                placeholder="&nbsp; Select "
                                onChange={handleRelationChange}
                                value={
                                    relationshipOption.find((option) => option?.value?.display === rela?.display) ||
                                    null
                                } // Show selected value
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '30px',
                                        minHeight: '30px',
                                        border: '0px',
                                    }),
                                    placeholder: (provided) => ({
                                        ...provided,
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        paddingBottom: '5px',
                                    }),
                                }}
                            />
                        </Form.Group>
                    </Col>
                </div>
                <hr />
                <AddressForm addresses={responsibleAddresses} setAddresses={setResponsibleAddresses} />
                <hr />
                <TelecomFrom constantContact={responsibleTelecom} setConstantContact={setResponsibleTelecom} />
            </div>
            <div className="d-flex gap-2 align-items-end justify-content-end my-1 pt-2">
                {/* <Button className="cancel-button" onClick={() => reset()}>
                    Clear
                </Button> */}
                {/* <Button
                    onClick={() => {
                        setSubmissionType('saveAndReset');
                    }}
                    className="custom-buttons"
                    type="submit">
                    Save & Add Another
                </Button> */}
                <Button
                    // onClick={() => {
                    //     setSubmissionType('saveAndNext');
                    // }}
                    disabled={store?.createResponsiblePartyReducer?.loading}
                    className="custom-buttons"
                    style={{ width: '200px' }}
                    type="submit">
                    {store?.createResponsiblePartyReducer?.loading ? (
                        <Spinner className='spinner-border-sm' color='white' />
                    ) : (
                        'Save & Continue Editing'
                    )}
                </Button>
            </div>
        </Form>
    );
};

export default ResponsiblleParty;
