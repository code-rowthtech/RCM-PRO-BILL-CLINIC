import React, { useEffect, useRef, useState } from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiDownloadCloud, FiEye } from 'react-icons/fi';
import { handleUpload } from '../../../../helpers/HandleUpload';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { createConsentFormAction, updateConsentFormAction } from '../../../../redux/settings/action';
import { encryptMessage } from '../../../../cryptoUtils';
import ToastHandle from '../../../../helpers/ToastMessage';

const ConsentModal = ({ show, onClose, defaultValues, isEdit }) => {
    const {
        register,
        handleSubmit,
        reset,
        clearErrors,
        formState: { errors },
    } = useForm({
        defaultValues: defaultValues || {},
    });
    const store = useSelector((state) => state);
    const createResponse = store?.createConsentFormReducer?.data?.status;
    const updateResponse = store?.updateConsentFormReducer?.data?.status;

    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');
    const [fileData, setFileData] = useState(null);
    const [fileUploading, setFileUploading] = useState(false);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            try {
                const url = await handleUpload(selectedFile, setFileUploading);
                setFileData(url);
                setFileName(selectedFile.name);
                clearErrors('customForm');
            } catch (error) {
                console.error('File upload error:', error);
            }
        }
    };

    const handleClose = () => {
        reset();
        setFileName('');
        setFileData(null);
        setFileUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    useEffect(() => {
        if (createResponse === 201 || updateResponse === 200) {
            handleClose();
        }
    }, [createResponse, updateResponse]);

    useEffect(() => {
        if (defaultValues && isEdit) {
            reset({
                title: defaultValues.title || '',
                requirePatientConsent: defaultValues.requirePatientConsent || false,
                defaultAssignment: defaultValues.defaultAssignment || false
            });
            if (defaultValues.consentDocument) {
                setFileName(defaultValues.consentDocument.fileName || '');
                setFileData(defaultValues.consentDocument);
            }
        } else {
            reset({});
            setFileName('');
            setFileData(null);
        }
    }, [defaultValues, isEdit, reset]);

    const onSubmit = (data) => {
        if (!fileData && !defaultValues) {
            return ToastHandle('Please upload consent form', 'danger');
        }
        const formData = {
            ...data,
            clinicId: store?.Auth?.user?.clinicId,
            consentDocument: fileData
        };
        // handleClose();
        if (defaultValues && isEdit) {
            const updateData = {
                id: defaultValues?._id,
                body: { ...formData }
            }
            dispatch(updateConsentFormAction({ id: updateData?.id, key: encryptMessage(updateData.body) }));
        } else {
            dispatch(createConsentFormAction({ key: encryptMessage(formData) }));
        }

    };

    return (
        <Modal centered show={show} onHide={handleClose}>
            <Modal.Body>
                <Row className="border-bottom mb-2">
                    <Col sm={12} className="text-center">
                        <h4>{isEdit ? 'Edit Consent Form' : 'New Consent Form'}</h4>
                    </Col>
                </Row>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        {/* Title for consent form */}
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Title for Consent Form <span className="text-danger">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter consent form title"
                                    {...register('title', {
                                        required: 'Title is required',
                                        validate: {
                                            noEmpty: (v) =>
                                                v.trim() !== '' || 'Cannot be empty',
                                        },
                                    })}
                                />
                                {errors.title && (
                                    <p className="text-danger">{errors.title.message}</p>
                                )}
                            </Form.Group>
                        </Col>

                        {/* Require patient to agree */}
                        <Col md={12}>
                            <Form.Group className="mb-2 d-flex align-items-center">
                                <Form.Check
                                    type="checkbox"
                                    label="Require patient to agree"
                                    {...register('requirePatientConsent')}
                                />
                            </Form.Group>
                        </Col>
                        {/* Assign by default on new appointments */}
                        <Col md={12}>
                            <Form.Group className="mb-2 d-flex align-items-center">
                                <Form.Check
                                    type="checkbox"
                                    label="Assign by default on new appointments"
                                    {...register('defaultAssignment')}
                                />
                            </Form.Group>
                        </Col>

                        {/* Custom Consent Form upload */}
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Custom Consent Form</Form.Label>
                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    style={{ height: '38px', marginTop: '3px' }}
                                    className={`custom-file-upload justify-content-between cursor-pointer d-flex align-items-center px-3 ${fileName || fileUploading ? 'form-control' : 'custom-form-fields'
                                        }`}>
                                    <span>
                                        {fileName
                                            ? fileName.length > 30 ? fileName.slice(0, 30) + '...' : fileName
                                            : fileUploading
                                                ? 'Uploading...'
                                                : 'Upload Document'}
                                    </span>
                                    <div className="d-flex align-items-center gap-2">
                                        {fileData?.url && (
                                            <FiEye
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(fileData.url.split('?')[0], '_blank');
                                                }}
                                                className="text-dark cursor-pointer"
                                            />
                                        )}
                                        <FiDownloadCloud />
                                    </div>
                                </div>
                                <Form.Control
                                    type="file" className="d-none"
                                    ref={fileInputRef} onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.jpg,.png"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Modal.Footer className="mt-3">
                        <Button className="custom-buttons" onClick={handleClose}>
                            Close
                        </Button>
                        <Button disabled={store?.updateConsentFormReducer?.loading || store?.createConsentFormReducer?.loading || fileUploading} type="submit" className="custom-buttons" style={{ width: '140px' }}>
                            {isEdit ? 'Update Document' : 'Upload Document'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ConsentModal;
