import React, { useEffect } from 'react';
import { Col, Form, Modal, Row, Button, Spinner } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import {
    createNoteCategoriesAction,
    getNoteCategoriesAction,
    updateNoteCategoriesAction,
} from '../../../../redux/noteCategories/action';
import { useDispatch, useSelector } from 'react-redux';
import { encryptMessage } from '../../../../cryptoUtils';

const NOTE_TYPE_OPTIONS = {
    'Encounter-Based': [
        'Progress Notes',
        'History & Physical (H&P) / Admission Notes',
        'Consultation Notes',
        'Discharge Summary',
        'Operative Notes',
        'Procedure Notes',
        'Emergency Department (ED) Notes',
        'Follow-Up Visit Notes',
        'Pre-operative Assessment',
        'Post-operative Notes',
        'Anesthesia Notes',
    ],
    'Nursing & Allied Health': [
        'Nursing Notes',
        'Vital Signs Records',
        'Intake & Output (I&O)',
        'Wound Care Notes',
        'Nutrition/Dietitian Notes',
        'Rehabilitation/Physical Therapy Notes',
        'Occupational Therapy Notes',
        'Speech Therapy Notes',
        'Respiratory Therapy Notes',
        'Case Management Notes',
        'Social Work Notes',
    ],
    'Psychiatric & Behavioral Health': [
        'Psychiatric Evaluation',
        'Mental Status Exam (MSE)',
        'Psychotherapy Notes',
        'Substance Abuse Treatment Notes',
        'Behavioral Observation Notes',
        'Suicide Risk Assessment',
    ],
    'Administrative & Communication': [
        'Referral Notes',
        'Triage Notes',
        'Telephone Call Notes',
        'Care Coordination Notes',
        'Patient Instructions',
        'Consent Forms',
        'Education Notes (Patient/Family Teaching)',
        'Clerical Notes / Scheduling Comments',
        'Insurance/Authorization Notes',
    ],
    'Diagnostic & Monitoring': [
        'Radiology Reports',
        'Pathology Reports',
        'Lab Result Annotations',
        'EKG/ECG Interpretations',
        'Imaging Interpretation Notes',
        'Telemetry Monitoring Notes',
        'Sleep Study Notes',
    ],
    // 'Specialty-Specific': [
    //     'Prenatal Visit Notes',
    //     'Labor & Delivery Notes',
    //     'Postpartum Notes',
    //     'Growth & Development Notes',
    //     'Immunization Records',
    //     'Tumor Board Notes',
    //     'Chemotherapy Progress Notes',
    //     'Ventilation Settings Notes',
    //     'Sedation Scale Notes',
    //     'ICU Progress Notes',
    //     'Pain Management Notes',
    //     'Dermatology Procedure Notes',
    // ],
    // 'System & Meta': ['Amendment Notes', 'Addenda', 'Auto-Generated Summary Notes', 'Audit Trail / Access Logs'],
};

const AddModalSetting = ({ setAddModal, addModal, selectedNote, setSelectedNote }) => {
    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'));
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const createResponse = store?.createNoteCategoriesReducer?.data?.status;
    const updateResponse = store?.updateNoteCategoriesReducer?.data?.status;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm();

    const noteType = watch('noteType');
    const title = watch('title');
    const showCustomTitle = title === 'Other';
    const titleOptions = NOTE_TYPE_OPTIONS[noteType] || [];

    useEffect(() => {
        if (selectedNote) {
            console.log(selectedNote, 'selectedNote in AddModalSetting');
            const type = selectedNote?.noteType;
            const predefinedTitles = NOTE_TYPE_OPTIONS[type] || [];
            const isCustom = !predefinedTitles.includes(selectedNote?.title);

            setValue('noteType', type || '');
            setValue('title', isCustom ? 'Other' : selectedNote?.title || '');
            setValue('customTitle', isCustom ? selectedNote?.title : '');
            setValue('isActive', selectedNote?.active?.toString() || 'true');
            setValue('format', selectedNote?.format || '');
            setValue('private', selectedNote?.private?.toString() || 'false');
        }
    }, [selectedNote, setValue]);

    const onSubmit = (data) => {
        console.log(data, 'data in AddModalSetting');
        const payload = {
            ...(selectedNote?.title!==data?.title&&({title: data.title === 'Other' ? data.customTitle : data.title})),
            clinicId: clinic_id?.clinicId,
            noteType: data.noteType,
            active: 'true',
            format: data.format,
            private: data.private === 'true',
        };

        if (selectedNote?._id) {
            dispatch(updateNoteCategoriesAction({ id: selectedNote._id, key: encryptMessage(payload) }));
        } else {
            dispatch(createNoteCategoriesAction({ key: encryptMessage(payload) }));
        }
    };

    useEffect(() => {
        if (createResponse === 201 || updateResponse === 200) {
            dispatch(
                getNoteCategoriesAction({
                    search: '',
                    skip: 1,
                    limit: 8,
                    clinicId: clinic_id?.clinicId,
                    active: true,
                    noteType: '',
                })
            );
            setAddModal(false);
            reset();
            setSelectedNote(null);
        }
    }, [createResponse, updateResponse]);

    return (
        <Modal
            show={addModal}
            onHide={() => {
                reset();
                setAddModal(false);
                setSelectedNote(null);
            }}
            size="lg"
            centered>
            <Modal.Header closeButton className="px-2 py-0">
                <Modal.Title>{selectedNote ? 'Edit Note Category' : 'Add Note Category'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="mb-1">
                        <Col md={6}>
                            <Form.Group className="mb-1">
                                <Form.Label>Type <span className="text-danger">*</span></Form.Label>
                                <Controller
                                    name="noteType"
                                    control={control}
                                    rules={{ required: 'Note Type is required' }}
                                    render={({ field }) => (
                                        <Form.Select
                                            {...field}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                field.onChange(val);
                                                setValue('title', '');
                                                setValue('customTitle', '');
                                            }}>
                                            <option value="">Select Note Type</option>
                                            {Object.keys(NOTE_TYPE_OPTIONS).map((type) => (
                                                <option
                                                    key={type}
                                                    value={type}
                                                    disabled={type !== 'Encounter-Based'}
                                                    title={type !== 'Encounter-Based' ? 'In Progress' : ''}>
                                                    {type}
                                                </option>
                                            ))}
                                            <option value="Other" disabled title="In Progress">
                                                Other
                                            </option>
                                        </Form.Select>
                                    )}
                                />
                                {errors.noteType && <span className="text-danger">{errors.noteType.message}</span>}
                            </Form.Group>
                        </Col>

                        {noteType && (
                            <Col md={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label>Note Title <span className="text-danger">*</span></Form.Label>
                                    <Controller
                                        name="title"
                                        control={control}
                                        rules={{ required: 'Title is required' }}
                                        render={({ field }) => (
                                            <Form.Select {...field}>
                                                <option value="">Select Title</option>
                                                {titleOptions.map((title) => (
                                                    <option key={title} value={title}>
                                                        {title}
                                                    </option>
                                                ))}
                                                <option value="Other">Other</option>
                                            </Form.Select>
                                        )}
                                    />
                                    {errors.title && <span className="text-danger">{errors.title.message}</span>}
                                </Form.Group>
                            </Col>
                        )}
                        {showCustomTitle && (
                            <Col md={6}>
                                <Form.Group className="mb-1">
                                    <Form.Label>Custom Title <span className="text-danger">*</span></Form.Label>
                                    <Controller
                                        name="customTitle"
                                        control={control}
                                        rules={{ required: 'Custom title is required when "Other" is selected' }}
                                        render={({ field }) => (
                                            <Form.Control {...field} placeholder="Enter custom title" />
                                        )}
                                    />
                                    {errors.customTitle && (
                                        <span className="text-danger">{errors.customTitle.message}</span>
                                    )}
                                </Form.Group>
                            </Col>
                        )}
                        {/* <Col md={6}>
                            <Form.Group controlId="isActive">
                                <Form.Label>Status</Form.Label>
                                <Form.Select {...register('isActive')}>
                                    <option value="true">True</option>
                                    <option value="false">False</option>
                                </Form.Select>
                            </Form.Group>
                        </Col> */}
                        <Col md={6}>
                            <Form.Group controlId="format">
                                <Form.Label>Format <span className="text-danger">*</span></Form.Label>
                                <Form.Select {...register('format', { required: 'Format is required' })}>
                                    <option value="SOAP">SOAP</option>
                                    <option value="Simple">Simple</option>
                                    <option value="Custom">Custom</option>
                                </Form.Select>
                                {errors.format && <span className="text-danger">{errors.format.message}</span>}
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="private">
                                <Form.Label>Keep This Clinical Note Private? <span className="text-danger">*</span></Form.Label>
                                <Form.Select {...register('private', { required: 'private is required' })}>
                                    <option value="false">False</option>
                                    <option value="true">True</option>
                                </Form.Select>
                                {errors.private && <span className="text-danger">{errors.private.message}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end mt-2">
                        <Button
                            variant="primary"
                            type="submit"
                            className="custom-buttons"
                            style={{ width: '65px' }}
                            disabled={
                                store?.createNoteCategoriesReducer?.loading ||
                                store?.updateNoteCategoriesReducer?.loading
                            }>
                            {store?.createNoteCategoriesReducer?.loading ||
                                store?.updateNoteCategoriesReducer?.loading ? (
                                <Spinner animation="border" size="sm" />
                            ) : selectedNote ? (
                                'Update'
                            ) : (
                                'Add'
                            )}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddModalSetting;
