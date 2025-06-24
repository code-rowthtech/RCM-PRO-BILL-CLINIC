import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Modal, OverlayTrigger, Row, Spinner, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createDoctorDetailAction } from '../../../redux/actions';
import { encryptMessage } from '../../../cryptoUtils';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { FiEye, FiInfo, FiUploadCloud } from 'react-icons/fi';
import { CiCircleMinus } from 'react-icons/ci';
import { handleUpload } from '../../../helpers/HandleUpload';
import Select from 'react-select';
import { qualificationsData } from '../../../utils/DataSets/qualification.data';

const DoctorQualifications = ({ setActiveTab, docId }) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const doctorDetails = store?.getDoctorDetailsReducer?.data?.result;
    const id = doctorDetails?._id;
    const { register, handleSubmit, setValue, clearErrors } = useForm();
    const [searchParams] = useSearchParams();
    const [showDocPreview, setShowDocPreview] = useState(false);
    const [docPreviewUrl, setDocPreviewUrl] = useState('');
    const updateId = searchParams.get('id');
    const [qualifications, setQualifications] = useState([
        { degreeName: '', degreeFile: null, issuerOrganisation: '' },
    ]);
    const [documents, setDocuments] = useState([
        { name: '', number: '', issuingAuthority: '', document: null, note: '' },
    ]);
    const [documentUploading, setDocumentUploading] = useState({});
    const [degreeUploading, setDegreeUploading] = useState({});

    const addQualification = () => {
        const newQualification = { degreeName: '', degreeFile: null, issuerOrganisation: '' };
        setQualifications([...qualifications, newQualification]);
    };

    const removeQualification = (index) => {
        if (qualifications.length > 1) {
            // Ensure at least one row remains
            const updatedQualifications = qualifications.filter((_, i) => i !== index);
            setQualifications(updatedQualifications);
        }
    };

    // Handle changes in qualification fields
    const handleQualificationChange = (index, field, value) => {
        if (field === 'degreeName') {
            const selectedQualification = qualificationsData.find(
                (qualification) => qualification.code === value?.data?.code
            );
            if (selectedQualification) {
                const updatedQualifications = qualifications.map((qual, i) =>
                    i === index ? { ...qual, [field]: selectedQualification, degreeFile: null } : qual
                );
                setQualifications(updatedQualifications);
            }
        }
        const updatedQualifications = qualifications.map((qual, i) =>
            i === index ? { ...qual, [field]: field === 'degreeName' ? value?.data : value } : qual
        );
        setQualifications(updatedQualifications);
    };

    // Handle file upload for degree
    const handleFileChangeDegree = async (index, event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            alert('Only PDF files are allowed for degree upload.');
            return;
        }
        const fileName = file.name;
        const localPreviewUrl = URL.createObjectURL(file);
        setDegreeUploading((prev) => ({ ...prev, [index]: true }));
        handleQualificationChange(index, 'degreeFile', { url: localPreviewUrl, fileName, localPreviewUrl });
        try {
            const url = await handleUpload(file, setDegreeUploading);
            if (url?.url) {
                handleQualificationChange(index, 'degreeFile', { url: url.url, fileName, localPreviewUrl });
            }
        } catch (error) { }
        setDegreeUploading((prev) => ({ ...prev, [index]: false }));
    };
    const QualificationOptions = qualificationsData.map((qualification) => ({
        value: qualification.code,
        label: qualification.display,
        data: qualification, // Store full object for later use
    }));

    const onsubmit = (data) => {
        const qualificationData = qualifications?.map((item) => ({
            code: item?.degreeName?.data || item?.degreeName,
            documents: item?.degreeFile,
            issuer: item?.issuerOrganisation,
        }));
        const payload = {
            ...(updateId ? { doctorId: id } : { doctorId: docId }),
            qualification: qualificationData,
            otherDocuments: documents,
        };
        dispatch(createDoctorDetailAction({ key: encryptMessage(payload) }));
    };
    useEffect(() => {
        if (doctorDetails && updateId) {
            // Set qualifications data
            const updatedQualifications = doctorDetails?.qualification?.map((item, index) => ({
                degreeName: {
                    code: item?.code?.code,
                    display: item?.code?.display,
                    definition: item?.code?.display,
                    system: item?.code?.system,
                },
                specialties: item?.specialties?.[0] || 'N/A',
                degreeFile: item?.documents?.[0] || null, // Use the first document if available
                issuerOrganisation: item?.issuer || '', // Use the issuer reference if available
            }));

            const updateDocuments = doctorDetails?.otherDocuments?.map((item, index) => ({
                name: item?.name || '',
                number: item?.number || '',
                issuingAuthority: item?.issuingAuthority || '',
                document: item?.document || null,
                note: item?.note || '',
            }));
            setQualifications(updatedQualifications);
            setDocuments(updateDocuments);
        }
    }, [doctorDetails, setValue, updateId]);

    const addDocuments = () => {
        setDocuments((prev) => [
            ...prev,
            {
                // id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
                name: '',
                number: '',
                issuingAuthority: '',
                document: null,
                note: '',
            },
        ]);
    };
    const handleDocumentsChange = (index, field, value) => {
        const updatedDocuments = documents.map((docs, i) =>
            i === index ? { ...docs, [field]: field === 'degreeName' ? value?.data : value } : docs
        );
        setDocuments(updatedDocuments);
    };
    const handleFileChangeDocuments = async (index, event) => {
        const file = event.target.files[0];
        if (!file) return;
        const fileName = file.name;
        const localPreviewUrl = URL.createObjectURL(file);
        setDocumentUploading((prev) => ({ ...prev, [index]: true }));
        handleDocumentsChange(index, 'document', { url: localPreviewUrl, fileName, localPreviewUrl });
        try {
            const url = await handleUpload(file, setDocumentUploading);
            if (url?.url) {
                // Save both backend and local preview URL
                handleDocumentsChange(index, 'document', { url: url.url, fileName, localPreviewUrl });
            }
        } catch (error) { }
        setDocumentUploading((prev) => ({ ...prev, [index]: false }));
    };
    const removeDocument = (index) => {
        setDocuments((prev) => prev.filter((_, i) => i !== index));
    };
    useEffect(() => {
        return () => {
            if (docPreviewUrl && docPreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(docPreviewUrl);
            }
        };
    }, [docPreviewUrl]);

    const handlePreview = (file) => {
        console.log(file,"file")
        if (file?.localPreviewUrl && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.fileName)) {
            setDocPreviewUrl(file.localPreviewUrl);
            setShowDocPreview(true);
        } else if (file?.url && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.fileName)) {
            setDocPreviewUrl(file.url?.split('?')[0]);
            setShowDocPreview(true);
        }
    };

    const handlePreviewDegree = (file) => {
        if (file?.localPreviewUrl && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.fileName)) {
            setDocPreviewUrl(file.localPreviewUrl);
            setShowDocPreview(true);
        } else if (file?.url && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.fileName)) {
            setDocPreviewUrl(file.url);
            setShowDocPreview(true);
        }
    };
    return (
        <>
            <div className="container-fluid px-0">
                <Form onSubmit={handleSubmit(onsubmit)}>
                    {store?.getDoctorDetailsReducer?.loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '75vh' }}>
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            <div className="scroll-container" style={{ height: '75vh' }}>
                                <Row>
                                    <Col sm={12}>
                                        <h5>
                                            Qualifications
                                            <span
                                                className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                                onClick={addQualification}></span>
                                        </h5>
                                        {qualifications?.map((qualification, index) => (
                                            <Row key={index} className="align-items-end g-3 mb-2">
                                                <Col md={4} xs={12}>
                                                    <Form.Group>
                                                        <Form.Label>Select Degree Name</Form.Label>
                                                        <Select
                                                            options={QualificationOptions}
                                                            isSearchable
                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            placeholder="Select"
                                                            value={QualificationOptions.find(
                                                                (option) =>
                                                                    option.value === qualification?.degreeName?.code
                                                            )}
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
                                                            onChange={(selectedOption) =>
                                                                handleQualificationChange(
                                                                    index,
                                                                    'degreeName',
                                                                    selectedOption
                                                                )
                                                            }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4} xs={12}>
                                                    <Form.Group>
                                                        <Form.Label className="d-flex align-items-center gap-1">
                                                            Degree
                                                            <OverlayTrigger
                                                                placement="top"
                                                                overlay={
                                                                    <Tooltip id="tooltip-degree">
                                                                        Only PDF files are supported for degree uploads.
                                                                    </Tooltip>
                                                                }>
                                                                <span className="text-secondary cursor-pointer">
                                                                    <FiInfo size={15} />
                                                                </span>
                                                            </OverlayTrigger>
                                                        </Form.Label>
                                                        <div
                                                            onClick={() =>
                                                                document
                                                                    .getElementById(`degree-file-input-${index}`)
                                                                    .click()
                                                            }
                                                            className={`custom-file-upload d-flex justify-content-between align-items-center cursor-pointer form-control ${qualification.degreeName || qualification.degreeFile
                                                                    ? ''
                                                                    : 'custom-form-fields'
                                                                }`}
                                                            style={{ minHeight: '30px' }}>
                                                            <span>
                                                                {degreeUploading[index]
                                                                    ? 'Uploading...'
                                                                    : qualification.degreeFile?.fileName
                                                                        ? qualification.degreeFile.fileName.length > 30
                                                                            ? qualification.degreeFile.fileName.slice(
                                                                                0,
                                                                                30
                                                                            ) + '...'
                                                                            : qualification.degreeFile.fileName
                                                                        : 'Upload Degree'}
                                                            </span>
                                                            <div className="d-flex align-items-center gap-2">
                                                                {qualification.degreeFile?.url &&
                                                                    /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(
                                                                        qualification.degreeFile.fileName
                                                                    ) && (
                                                                        <FiEye
                                                                            className="text-secondary"
                                                                            style={{ cursor: 'pointer' }}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handlePreviewDegree(
                                                                                    qualification.degreeFile
                                                                                );
                                                                            }}
                                                                            title="Preview"
                                                                        />
                                                                    )}
                                                                <span className="mb-0 d-inline-flex align-items-center">
                                                                    <FiUploadCloud />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <Form.Control
                                                            type="file"
                                                            className="d-none"
                                                            id={`degree-file-input-${index}`}
                                                            accept="application/pdf"
                                                            onChange={(event) => handleFileChangeDegree(index, event)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={4} xs={12} className="position-relative">
                                                    <Form.Group>
                                                        <Form.Label>Issuer Organisation</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={qualification.issuerOrganisation}
                                                            onChange={(e) =>
                                                                handleQualificationChange(
                                                                    index,
                                                                    'issuerOrganisation',
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Enter Issuer Organisation"
                                                        />
                                                    </Form.Group>
                                                    {index > 0 && (
                                                        <span
                                                            className="text-danger cursor-pointer position-absolute fs-4 fw-bold"
                                                            onClick={() => removeQualification(index)}
                                                            style={{ right: '-5px', top: '50%' }}
                                                            title="Remove">
                                                            <CiCircleMinus />
                                                        </span>
                                                    )}
                                                </Col>
                                                {/* {qualifications?.length > 1 && index < qualifications.length - 1 && (
                                                    <hr className="" />
                                            )} */}
                                            </Row>
                                        ))}
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col sm={12}>
                                        <Row className='pe-0'>
                                            <h5>
                                                Other Documents
                                                <span
                                                    className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                                    onClick={addDocuments}></span>
                                            </h5>
                                            {documents?.map((data, index) => (
                                                <>
                                                    <Row key={data.id} className='pe-0'>
                                                        <div className="col-md-3 col-12">
                                                            <Form.Group className="mb-1">
                                                                <Form.Label className="mb-0">Document Name</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={data?.name}
                                                                    // {...register(`documentName[${index}]`)}
                                                                    onChange={(e) =>
                                                                        handleDocumentsChange(
                                                                            index,
                                                                            'name',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    placeholder="Enter Document Name"
                                                                />
                                                            </Form.Group>
                                                        </div>
                                                        <div className="col-md-3 col-12">
                                                            <div className="mb-1 d-flex flex-column ">
                                                                <Form.Group className="mb-1">
                                                                    <Form.Label className="mb-0">
                                                                        Document Number
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={data?.number}
                                                                        // {...register(`documentNumber[${index}]`)}
                                                                        onChange={(e) =>
                                                                            handleDocumentsChange(
                                                                                index,
                                                                                'number',
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        placeholder="Enter Document Number"
                                                                    />
                                                                </Form.Group>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3 col-12">
                                                            <Form.Group className="mb-1">
                                                                <Form.Label className="mb-0">
                                                                    Issuing Authority
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    value={data?.issuingAuthority}
                                                                    // {...register(`issuingAuthority[${index}]`)}
                                                                    onChange={(e) =>
                                                                        handleDocumentsChange(
                                                                            index,
                                                                            'issuingAuthority',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    placeholder="Enter Issuing Authority"
                                                                />
                                                            </Form.Group>
                                                        </div>

                                                        <div className="col-md-3 col-12 pe-0">
                                                            <div className="mb-1 d-flex flex-column position-relative">
                                                                <Form.Group className="mb-1">
                                                                    <Form.Label className="mb-0">Document</Form.Label>
                                                                    <div
                                                                        onClick={() =>
                                                                            document
                                                                                .getElementById(
                                                                                    `documents-file-input-${index}`
                                                                                )
                                                                                .click()
                                                                        }
                                                                        className={`custom-file-upload justify-content-between cursor-pointer form-control ${data?.document?.fileName || data.degreeFile
                                                                                ? ''
                                                                                : 'custom-form-fields'
                                                                            }`}>
                                                                        <span>
                                                                            {documentUploading[index]
                                                                                ? 'Uploading...'
                                                                                : data?.document?.fileName
                                                                                    ? data.document.fileName.length > 25
                                                                                        ? data.document.fileName.slice(
                                                                                            0,
                                                                                            25
                                                                                        ) + '...'
                                                                                        : data.document.fileName
                                                                                    : 'Upload Degree'}
                                                                        </span>
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            {data?.document?.url &&
                                                                                /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(
                                                                                    data.document.fileName
                                                                                ) && (
                                                                                    <FiEye
                                                                                        className="text-secondary"
                                                                                        style={{ cursor: 'pointer' }}
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handlePreview(
                                                                                                data.document
                                                                                            );
                                                                                        }}
                                                                                        title="Preview"
                                                                                    />
                                                                                )}
                                                                            <span className="mb-0 d-inline-flex align-items-center">
                                                                                <FiUploadCloud />
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <Form.Control
                                                                        type="file"
                                                                        // {...register(`document[${index}]`)}
                                                                        className="d-none"
                                                                        id={`documents-file-input-${index}`}
                                                                        // ref={documentsFileInputRef}
                                                                        onChange={(event) =>
                                                                            handleFileChangeDocuments(index, event)
                                                                        }
                                                                    />
                                                                </Form.Group>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3 col-12">
                                                            <Form.Group className="mb-1">
                                                                <Form.Label className="mb-0">Note</Form.Label>
                                                                <Form.Control
                                                                    as="textarea"
                                                                    value={data?.note}
                                                                    // {...register(`note[${index}]`)}
                                                                    onChange={(e) =>
                                                                        handleDocumentsChange(
                                                                            index,
                                                                            'note',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    placeholder="Enter Note"
                                                                />
                                                            </Form.Group>
                                                        </div>
                                                        {index > 0 && (
                                                            <div className="col-3 d-flex align-items-center">
                                                                <span
                                                                    className="text-danger cursor-pointer fs-5 fw-bold"
                                                                    onClick={() => removeDocument(index)}>
                                                                    <CiCircleMinus />
                                                                </span>
                                                            </div>
                                                        )}
                                                        {documents?.length > 1 && index < documents.length - 1 && (
                                                            <hr className="mt-2" />
                                                        )}
                                                    </Row>
                                                </>
                                            ))}
                                        </Row>
                                    </Col>
                                </Row>
                            </div>

                            <div className="d-flex justify-content-end gap-2 mt-1" style={{ height: '6vh' }}>
                                <Button className="cancel-button" onClick={() => setActiveTab('departmentDetails')}>
                                    Previous
                                </Button>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="custom-buttons"
                                    disabled={store?.createtDoctorsDetailReducer?.loading}
                                    style={{ width: '120px' }}>
                                    {store?.createtDoctorsDetailReducer?.loading ? (
                                        <Spinner color="white" className="spinner-border-sm" />
                                    ) : (
                                        'Update & Exit'
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
                <Modal show={showDocPreview} onHide={() => setShowDocPreview(false)} centered>
                    <Modal.Body>
                        <div className="d-flex justify-content-center">
                            <p className="fw-bold" style={{ color: '#6169D0' }}>
                                Document Preview
                            </p>
                        </div>
                        <div
                            style={{
                                overflow: 'hidden',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            {docPreviewUrl ? (
                                <img
                                    src={docPreviewUrl}
                                    alt="Document Preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '70vh',
                                        objectFit: 'contain',
                                        display: 'block',
                                    }}
                                />
                            ) : (
                                <div>No preview available</div>
                            )}
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
};

export default DoctorQualifications;
