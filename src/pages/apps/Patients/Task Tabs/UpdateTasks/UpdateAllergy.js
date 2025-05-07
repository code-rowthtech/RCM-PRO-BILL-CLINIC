import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { encryptMessage } from '../../../../../cryptoUtils';
import AsyncSelect from 'react-select/async';
import { allergyType, severityData } from '../../../../../utils/DataSets/Allergy/allergyType';
import { clinicalStatus } from '../../../../../utils/DataSets/Allergy/clinicalStatus';
import { verificationStatus } from '../../../../../utils/DataSets/Allergy/verificationStatus';
import { category, criticality } from '../../../../../utils/DataSets/Allergy/category';
import { allergyCode } from '../../../../../utils/DataSets/Allergy/allergyCode';
import { manifestationData } from '../../../../../utils/DataSets/Allergy/manification';
import { exposureRouteData } from '../../../../../utils/DataSets/Allergy/exposureRoute';
import { useSearchParams } from 'react-router-dom';
import { getAllergiesOfPatientAction, updateAllergyAction } from '../../../../../redux/allergyList/action';
import { getPatientAppointmentAction } from '../../../../../redux/ProblemList/action';
import { createSuggestionAction } from '../../../../../redux/suggestions/action';
import ReactQuill from 'react-quill';
import SuggestionOffcanvas from '../../UpdatePatient/SuggestionOffcanvas';

const UpdateAllergy = ({ onCancel, allergy }) => {
    console.log(allergy, 'allergy');
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const clinicId = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const userId = JSON.parse(sessionStorage.getItem('hyper_user'))?.userId;
    console.log(userId, 'userId');
    const [code, setCode] = useState(null);
    const [substance, setSubstance] = useState(null);
    const appointments = store?.getPatientAppointmentReducer?.data || [];
    const [manifestation, setManifestation] = useState(null); // State to store selected manifestation
    const [exposureRoute, setExposureRoute] = useState(null);
    const updateStatus = store?.updateAllergyReducer?.data?.status;
    const [selectMode, setSelectMode] = useState('appointment'); // 'appointment' or 'date'
    const [showSuggestions, setShowSuggestions] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        reset,
        clearErrors,
        watch,
        getValues,
    } = useForm();
    // Fetch dynamic appointments
    useEffect(() => {
        dispatch(getPatientAppointmentAction({ patientId }));
    }, [dispatch, patientId]);
    const allergyDetails = store?.getAllergyDetailsReducer?.data?.allergy;
    console.log(allergyDetails, 'allergyDetails');
    useEffect(() => {
        setValue('allergyType', allergyDetails?.type?.coding[0]?.code);
        setValue('category', allergyDetails?.category?.[0]?.code);
        setValue('criticality', allergyDetails?.criticality?.code);
        setValue('verificationStatus', allergyDetails?.verificationStatus?.coding[0]?.code);
        setValue('reaction', allergyDetails?.reaction[0]?.manifestation[0]?.concept?.coding[0]?.code);
        setValue('status', allergyDetails?.clinicalStatus?.coding[0]?.code);
        setValue('severity', allergyDetails?.reaction[0]?.severity?.coding[0]?.code);
        setValue('note', allergyDetails?.note[0]?.text);
        setManifestation(allergyDetails?.reaction?.[0]?.manifestation?.[0]?.concept?.coding[0]);
        setCode(allergyDetails?.code?.coding[0]);
        setExposureRoute(allergyDetails?.reaction?.[0]?.exposureRoute?.coding?.[0]);
        setSubstance(allergyDetails?.reaction[0]?.substance?.coding[0]);
        // setValue('appointment', allergyDetails?.appointmentId?.date);
        // setValue('appointmentDate', allergyDetails?.onset?.onsetDateTime);
        if (allergyDetails) {
            if (allergyDetails?.appointmentId) {
                setSelectMode('appointment');
                const selected = appointments.find(
                    (appt) =>
                        appt._id === allergyDetails.appointmentId._id || appt.id === allergyDetails.appointmentId.id
                );
                if (selected) {
                    setValue('appointment', JSON.stringify(selected));
                }
                // Clear the date field to avoid conflict
                setValue('appointmentDate', null);
            } else if (allergyDetails?.onset?.onsetDateTime) {
                setSelectMode('date');
                setValue('appointmentDate', new Date(allergyDetails.onset.onsetDateTime).toISOString().split('T')[0]);
                // Clear the appointment select to avoid conflict
                setValue('appointment', null);
            }
        }
    }, [allergyDetails, setValue, appointments]);

    // const onSubmit = (data) => {
    //     const updateAllergy = { ...data };

    //     const payload = {
    //         id: allergy?._id,
    //         ...(updateAllergy?.allergyType ? { allergyType: updateAllergy?.allergyType } : {}),
    //         ...(updateAllergy?.allergyname ? { allergyname: updateAllergy?.allergyname } : {}),
    //         ...(updateAllergy?.reaction ? { reaction: updateAllergy?.reaction } : {}),
    // ...(updateAllergy?.status ? { status: updateAllergy?.status } : {}),
    //         ...(updateAllergy?.severity ? { severity: updateAllergy?.severity } : {}),
    //         ...(updateAllergy?.notes ? { notes: updateAllergy?.notes } : {}),
    //     };

    //     dispatch(updateAllergyAction({ key: encryptMessage(payload) }));
    //     // reset();
    // };

    const onSubmit = (data) => {
        const selectedType = allergyType.find((type) => type?.code === data?.allergyType);
        const selectedStatus = clinicalStatus.find((item) => item?.code === data?.status);
        const selectedVerificationStatus = verificationStatus.find(
            (status) => status?.code === data?.verificationStatus
        );
        const selectedCategory = category.find((item) => item?.code === data?.category);
        const selectedCriticalityOption = criticality.find((option) => option?.code === data?.criticality);
        const selectedSeverityOption = severityData.find((option) => option?.code === data?.severity);
        console.log(severityData, 'severityData');

        const payload = {
            id: allergyDetails?._id,
            patientId: patientId,
            clinicId: clinicId,
            // doctorId: doctorId,
            // asserterId: doctorId,
            recorderId: userId,
            // id: selectedCategory?.display,
            resourceType: 'AllergyIntolerance',
            type: {
                coding: [
                    {
                        system: selectedType?.system,
                        code: selectedType?.code,
                        display: selectedType?.display,
                    },
                ],
                text: selectedType?.display,
            },
            clinicalStatus: {
                coding: [
                    {
                        system: selectedStatus?.system,
                        code: selectedStatus?.code,
                        display: selectedStatus?.display,
                    },
                ],
                text: selectedStatus?.display,
            },
            // verificationStatus: {
            //     coding: [
            //         {
            //             system: selectedVerificationStatus?.system,
            //             code: selectedVerificationStatus?.code,
            //             display: selectedVerificationStatus?.display,
            //         },
            //     ],
            //     text: selectedVerificationStatus?.display,
            // },
            category: [
                {
                    system: selectedCategory?.system,
                    code: selectedCategory?.code,
                    display: selectedCategory?.display,
                },
            ],
            criticality: {
                system: selectedCriticalityOption?.system,
                code: selectedCriticalityOption?.code,
                display: selectedCriticalityOption?.display,
            },
            code: {
                coding: code,
                text: code?.display, // use display text
            },
            reaction: [
                {
                    // substance: {
                    //     coding: code,
                    // },
                    // manifestation: [
                    //     {
                    //         concept: {
                    //             coding: manifestation,
                    //             text: code?.display, // use display text
                    //         },
                    //     },
                    // ],
                    // severity: {
                    //     coding: [
                    //         {
                    //             system: selectedSeverityOption?.system,
                    //             code: selectedSeverityOption?.code,
                    //             display: selectedSeverityOption?.display,
                    //         },
                    //     ],
                    //     text: selectedSeverityOption?.display,
                    // },
                    // exposureRoute: {
                    //     coding: exposureRoute,
                    //     text: exposureRoute?.display,
                    // },
                    // note: [
                    //     {
                    //         text: '',
                    //         time: '',
                    //         authorReference: {
                    //             reference: '',
                    //             type: '',
                    //             identifier: {
                    //                 use: '',
                    //                 system: '',
                    //                 value: '',
                    //             },
                    //             display: '',
                    //         },
                    //     },
                    // ],
                },
            ],
            note: [
                {
                    text: data?.note,
                    time: '',
                    authorReference: {
                        reference: '',
                        type: '',
                        identifier: {
                            use: '',
                            system: '',
                            value: '',
                        },
                        display: '',
                    },
                },
            ],
        };
        if (selectMode === 'appointment' && data.appointment) {
            let appData = JSON.parse(data.appointment);
            payload.appointmentId = appData?._id;
            payload.onset = {
                onsetDateTime: appData?.date, // optionally use actual date
            };
        } else if (selectMode === 'date' && data.appointmentDate) {
            payload.onset = {
                onsetDateTime: data.appointmentDate,
            };
        }

        dispatch(updateAllergyAction({ key: encryptMessage(payload) }));
        console.log(payload, 'payload');
    };
    const formattedCodeOption = useMemo(
        () =>
            allergyCode?.map((reason) => ({
                value: reason,
                label: reason.display,
            })),
        []
    );
    const handleCodeChange = useCallback((selectedOption) => {
        setCode(selectedOption ? selectedOption.value : '');
    }, []);

    const selectedCodeOption =
        formattedCodeOption.find((option) => option?.value?.code === code?.code) ||
        formattedCodeOption.find((option) => option?.display === code);

    const loadCodeOptions = useCallback(
        (inputValue, callback) => {
            if (!inputValue) {
                callback(formattedCodeOption.slice(0, 10));
                return;
            }

            const filteredOptions = formattedCodeOption.filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );

            callback(filteredOptions.slice(0, 20));
        },
        [formattedCodeOption]
    );
    // Manifestation Options
    const formattedManifestationOption = useMemo(
        () =>
            manifestationData?.map((reason) => ({
                value: reason, // The whole object or unique identifier
                label: reason.display, // What will be displayed in the dropdown
            })),
        [manifestationData]
    );

    const handleManifestationChange = useCallback((selectedOption) => {
        setManifestation(selectedOption ? selectedOption.value : null); // Store the whole object or identifier
    }, []);

    const selectedManifestationOption =
        formattedManifestationOption.find((option) => option?.value?.code === manifestation?.code) ||
        formattedManifestationOption.find((option) => option?.value?.display === manifestation);

    const loadManifestationOptions = useCallback(
        (inputValue, callback) => {
            if (!inputValue) {
                callback(formattedManifestationOption.slice(0, 10)); // Load first 10 options initially
                return;
            }

            const filteredOptions = formattedManifestationOption.filter((option) => {
                // Check if option.label exists before calling toLowerCase()
                return option.label && option.label.toLowerCase().includes(inputValue.toLowerCase());
            });

            callback(filteredOptions.slice(0, 20)); // Limit to first 20 results
        },
        [formattedManifestationOption]
    );
    const formattedExposurRouteOption = useMemo(
        () =>
            exposureRouteData?.map((reason) => ({
                value: reason, // The whole object or unique identifier
                label: reason.display, // What will be displayed in the dropdown
            })),
        [exposureRouteData]
    );
    const handleExposureRouteChange = useCallback((selectedOption) => {
        setExposureRoute(selectedOption ? selectedOption.value : null); // Store the whole object or identifier
    }, []);

    const selectedExposureRouteOption =
        formattedExposurRouteOption.find((option) => option?.value?.code === exposureRoute?.code) ||
        formattedExposurRouteOption.find((option) => option?.value?.display === exposureRoute);

    const loadExposureRouteOptions = useCallback(
        (inputValue, callback) => {
            if (!inputValue) {
                callback(formattedExposurRouteOption.slice(0, 10)); // Load first 10 options initially
                return;
            }

            const filteredOptions = formattedExposurRouteOption.filter((option) => {
                // Check if option.label exists before calling toLowerCase()
                return option.label && option.label.toLowerCase().includes(inputValue.toLowerCase());
            });

            callback(filteredOptions.slice(0, 20)); // Limit to first 20 results
        },
        [formattedExposurRouteOption]
    );
    useEffect(() => {
        if (updateStatus === 200) {
            const data = {
                patientId: patientId,
            };
            dispatch(getAllergiesOfPatientAction(data));
            onCancel();
        }
    }, [updateStatus, dispatch, patientId, onCancel]);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const handleEditorFocus = () => {
        dispatch(createSuggestionAction({ module: 'allergy' }));
        setShowSuggestions(true);
    };
    const handleSuggestionSelect = (suggestionText) => {
        // Append suggestion to existing note
        const current = getValues('note'); // from useFormContext or pass as prop
        setValue('note', `${current}<p>${suggestionText}</p>`);
    };
    return (
        <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                {store?.getAllergyDetailsReducer?.loading ? (
                    <div className="text-center my-5 py-5">
                        <Spinner className=" " />
                    </div>
                ) : (
                    <Row>
                        {/* <Col sm={12} className="d-flex justify-content-between">
                            <h4>Update Allergy</h4>
                            <Button className="custom-buttons" onClick={onCancel}>
                                Back
                            </Button>
                        </Col> */}

                        {/* <Col sm={4}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="allergyType" className="mb-0">
                                    Allergy Type
                                </Form.Label>
                                <Form.Select
                                    {...register('allergyType', { required: 'Allergy Type is required' })}
                                    data-has-value={!!watch('allergyType')}>
                                    <option value="" hidden>
                                        Select Allergy Type
                                    </option>
                                    {allergyType?.map((type) => (
                                        <option key={type?.code} value={type?.code}>
                                            {type?.display}
                                        </option>
                                    ))}
                                </Form.Select>
                                {errors.allergyType && (
                                    <Form.Text className="text-danger">{errors.allergyType.message}</Form.Text>
                                )}
                            </Form.Group>
                        </Col> */}

                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="category" className="mb-0">
                                    Allergy Category
                                </Form.Label>
                                <Form.Select
                                    {...register('category', { required: 'Allergy Category is required' })}
                                    data-has-value={!!watch('category')}>
                                    <option value="" hidden>
                                        Select Allergy Category
                                    </option>
                                    {category?.map((item) => (
                                        <option key={item?.code} value={item?.code}>
                                            {item?.display}
                                        </option>
                                    ))}
                                </Form.Select>
                                {errors.category && (
                                    <Form.Text className="text-danger">{errors.category.message}</Form.Text>
                                )}
                            </Form.Group>
                        </Col>

                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="criticality" className="mb-0">
                                    Criticality
                                </Form.Label>
                                <Form.Select
                                    {...register('criticality', { required: 'Criticality is required' })}
                                    data-has-value={!!watch('criticality')}>
                                    <option value="" hidden>
                                        Select Criticality
                                    </option>
                                    {criticality?.map((item) => (
                                        <option key={item?.code} value={item?.code}>
                                            {item?.display}
                                        </option>
                                    ))}
                                </Form.Select>
                                {errors.criticality && (
                                    <Form.Text className="text-danger">{errors.criticality.message}</Form.Text>
                                )}
                            </Form.Group>
                        </Col>

                        {/* <Col sm={4}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="verificationStatus" className="mb-0">
                                    Verification Status
                                </Form.Label>
                                <Form.Select
                                    {...register('verificationStatus', { required: 'Verification Status is required' })}
                                    data-has-value={!!watch('verificationStatus')}>
                                    <option value="">Select Verification Status</option>
                                    {verificationStatus.map((status) => (
                                        <option key={status?.code} value={status?.code} className="text-capitalize">
                                            {status?.display}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col> */}
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="mb-0">Select Allergy </Form.Label>
                                <AsyncSelect
                                    loadOptions={loadCodeOptions}
                                    defaultOptions={formattedCodeOption.slice(0, 10)} // Show first 10 options initially
                                    isSearchable
                                    className="basic-single"
                                    classNamePrefix="select"
                                    placeholder="&nbsp; Select"
                                    value={selectedCodeOption}
                                    onChange={handleCodeChange}
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

                        {/* <Col sm={4}>
                            <Form.Group>
                                <Form.Label className="mb-0">Substance</Form.Label>
                                <AsyncSelect
                                    loadOptions={loadCodeOptions}
                                    defaultOptions={formattedCodeOption.slice(0, 10)} // Show first 10 options initially
                                    isSearchable
                                    className="basic-single"
                                    classNamePrefix="select"
                                    placeholder="&nbsp; Select"
                                    value={selectedCodeOption}
                                    onChange={handleCodeChange}
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
                        </Col> */}
                        {/* <Col sm={4}>
                            <Form.Group>
                                <Form.Label className="mb-0">Manifestation</Form.Label>
                                <AsyncSelect
                                    loadOptions={loadManifestationOptions}
                                    defaultOptions={formattedManifestationOption.slice(0, 10)} // Show first 10 options initially
                                    isSearchable
                                    className="basic-single"
                                    classNamePrefix="select"
                                    placeholder="&nbsp; Select"
                                    value={selectedManifestationOption} // Ensure this matches the { label, value } format
                                    onChange={handleManifestationChange}
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
                        </Col> */}
                        <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="status" className="mb-0">
                                    Clinical Status
                                </Form.Label>
                                <Form.Select
                                    {...register(
                                        'status'
                                        //  { required: 'Clinical Status is required' }
                                    )}
                                    data-has-value={!!watch('status')}>
                                    <option value="" hidden>
                                        Select Clinical Status
                                    </option>
                                    {clinicalStatus?.map((status) => (
                                        <option key={status?.code} value={status?.code}>
                                            {status?.display}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        {/* <Col sm={6}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="severity" className="mb-0">
                                    Severity
                                </Form.Label>
                                <Form.Select
                                    {...register('severity', { required: 'Clinical severity is required' })}
                                    data-has-value={!!watch('severity')}>
                                    <option value="" hidden>
                                        Select Clinical Status
                                    </option>
                                    {severityData?.map((severity) => (
                                        <option key={severity?.code} value={severity?.code}>
                                            {severity?.display}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col> */}

                        {/* <Col sm={4}>
                            <Form.Group>
                                <Form.Label className="mb-0"> Exposure Route</Form.Label>
                                <AsyncSelect
                                    loadOptions={loadExposureRouteOptions}
                                    defaultOptions={formattedExposurRouteOption.slice(0, 10)} // Show first 10 options initially
                                    isSearchable
                                    className="basic-single"
                                    classNamePrefix="select"
                                    placeholder="&nbsp; Select"
                                    value={selectedExposureRouteOption} // Ensure this matches the { label, value } format
                                    onChange={handleExposureRouteChange}
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
                        </Col> */}
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Label className="mb-0">Select Mode</Form.Label>
                                <div className="d-flex gap-3 mb-0">
                                    <Form.Check
                                        type="radio"
                                        label="By Appointment"
                                        name="selectionMode"
                                        value="appointment"
                                        checked={selectMode === 'appointment'}
                                        onChange={() => setSelectMode('appointment')}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="By Date"
                                        name="selectionMode"
                                        value="date"
                                        checked={selectMode === 'date'}
                                        onChange={() => setSelectMode('date')}
                                    />
                                </div>

                                {selectMode === 'appointment' ? (
                                    <>
                                        <Form.Label className="mb-0">Appointment</Form.Label>
                                        <Form.Select {...register('appointment')}>
                                            <option>Select Appointment Date </option>
                                            {appointments?.map((item) => (
                                                <option key={item?._id} value={JSON.stringify(item)}>
                                                    {item?.date
                                                        ? new Date(item.date).toISOString().split('T')[0]
                                                        : 'N/A'}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </>
                                ) : (
                                    <>
                                        <Form.Label className="mb-0">Select Date (till today)</Form.Label>
                                        <Form.Control type="date" max={today} {...register('appointmentDate')} />
                                    </>
                                )}
                            </Form.Group>
                        </Col>
                        {/* <Col sm={4}>
                            <Form.Group className="mb-1">
                                <Form.Label htmlFor="Encounter" className="mb-0">
                                    Encounter
                                </Form.Label>
                                <Form.Select
                                    {...register('encounter', { required: 'Encounter is required' })}
                                    data-has-value={!!watch('encounter')}>
                                    <option value="" hidden>
                                        Select Encounter
                                    </option>
                                    <option value="1">Encounter 1</option>
                                    <option value="2">Encounter 2</option>
                                </Form.Select>
                            </Form.Group>
                        </Col> */}

                        <Col xs={12}>
                            <Form.Group controlId="note">
                                <Form.Label className="fw-medium mb-0">
                                    Notes{' '}
                                    <span
                                        style={{ cursor: 'pointer' }}
                                        title="Notes Suggestions"
                                        onClick={handleEditorFocus}>
                                        ✨
                                    </span>
                                </Form.Label>

                                <Controller
                                    name="note"
                                    control={control}
                                    defaultValue="<ul><li></li></ul>"
                                    render={({ field: { onChange, value } }) => (
                                        <ReactQuill
                                            value={value}
                                            onChange={(content, delta, source) => {
                                                if (source === 'user') {
                                                    onChange(content);
                                                }
                                            }}
                                            theme="snow"
                                            placeholder="Enter detailed notes here..."
                                            style={{ backgroundColor: 'white' }}
                                            modules={{
                                                toolbar: [
                                                    [{ header: [1, 2, false] }],
                                                    ['bold', 'italic', 'underline', 'strike'],
                                                    [{ list: 'ordered' }, { list: 'bullet' }],
                                                    ['link', 'image'],
                                                    ['clean'],
                                                ],
                                            }}
                                        />
                                    )}
                                />

                                <SuggestionOffcanvas
                                    show={showSuggestions}
                                    onClose={() => setShowSuggestions(false)}
                                    onSelect={handleSuggestionSelect}
                                    className="custom-suggestion-offcanvas"
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={12} className="d-flex justify-content-end gap-1 mt-1">
                            {/* <Button className="custom-buttons">Cancel</Button> */}
                            {/* <Button className='custom-buttons'>Save and Add Another</Button> */}
                            <Button
                                className="custom-buttons"
                                type="submit"
                                style={{ width: '65px' }}
                                disabled={store?.updateAllergyReducer?.loading}>
                                {store?.updateAllergyReducer?.loading ? (
                                    <Spinner animation="border" size="sm" className="text-white" />
                                ) : (
                                    'Update'
                                )}
                            </Button>
                        </Col>
                    </Row>
                )}
            </Form>
        </div>
    );
};

export default UpdateAllergy;
