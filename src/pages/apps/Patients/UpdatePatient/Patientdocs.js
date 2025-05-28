import React, { useState, useCallback, useEffect } from 'react';
import {
    Container, Button, Card, Table, Modal, Row, Col,
    Form, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import {
    FiUpload as UploadIcon,
    FiTrash2 as DeleteIcon,
    FiX as CloseIcon,
    FiFile as FileIcon,
    FiImage as ImageIcon,
    FiPlus as PlusIcon,
    FiDownload,
    FiEye
} from 'react-icons/fi';
import {
    BsFileEarmarkPdf,
    BsFileWord,
    BsFileImage,
    BsFileEarmark
} from 'react-icons/bs';
import { IoIosDocument } from "react-icons/io";

import { FaFilePdf, FaFileWord } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loggedInUser } from '../../../../helpers/api/loggedInUser';
import { getDocumentsAction, uploadPatientDocumentsAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import { handleUpload as handleS3Upload } from '../../../../helpers/HandleUpload';
import Spinner from '../../../../constants/Spinner';
import PreviewModal from './PreviewModal';
import { set } from 'react-hook-form';

const MAX_FILE_SIZE_MB = 2;

const PatientDocs = ({ isAccordionOpen }) => {
    const [searchParams] = useSearchParams();
    const subjectId = searchParams.get('id');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const store = useSelector((state) => state);
    const loadingRedux = store?.uploadDocumentsReducer?.loading;
    const uploadDocumentsResponse = store?.uploadDocumentsReducer;
    const patientDocuments = store?.getDocumentsReducer?.data?.patientDocuments;
    // const [existingDocs, setExistingDocs] = useState([
    //     { id: 1, name: 'medical_report.pdf', type: 'application/pdf', size: 2456789, uploadedAt: '2023-05-15' },
    //     { id: 2, name: 'prescription.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 123456, uploadedAt: '2023-05-10' },
    //     { id: 3, name: 'xray_scan.jpg', type: 'image/jpeg', size: 3456789, uploadedAt: '2023-05-05' }
    // ]);

    const [files, setFiles] = useState([]);
    const [previewFile, setPreviewFile] = useState(null);
    const [previewLink, setPreviewLink] = useState(null);
    const [previewModal, setPreviewModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [notes, setNotes] = useState(null);
    const [error, setError] = useState(null);
    const [loadingUpload, setLoadingUpload] = useState(false);

    const closePreviewModal = () => {
        setPreviewModal(false);
        setPreviewLink(null);
    }
    const isLoading = loadingRedux || loadingUpload;
    useEffect(() => {
        if (uploadDocumentsResponse?.data?.status === 201) {
            setShowUploadModal(false);
            setFiles([]);
            setPreviewFile(null);
            setNotes('');
            setError(null);
            dispatch(getDocumentsAction());
        }
    }, [uploadDocumentsResponse])

    const validMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg', 'image/png', 'image/gif'
    ];

    const validateFile = (file) => {
        if (!validMimeTypes.includes(file.type)) {
            setError(`Unsupported type: ${file.name}`);
            return false;
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setError(`Too large: ${file.name}`);
            return false;
        }
        return true;
    };
    useEffect(() => {
        dispatch(getDocumentsAction())
    }, [dispatch])

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const dropped = Array.from(e.dataTransfer.files).filter(validateFile);
        setFiles((prev) => [...prev, ...dropped]);
    }, []);

    const handleFileInput = (e) => {
        const selected = Array.from(e.target.files).filter(validateFile);
        setFiles((prev) => [...prev, ...selected]);
        e.target.value = '';
    };

    const handleRemoveFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        if (previewFile === files[index]) setPreviewFile(null);
    };

    const handleUpload = async () => {
        if (!files.length) return setError('No files selected');
        setError(null);

        const uploadedDocs = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const urlObj = await handleS3Upload(file, setLoadingUpload);
            if (!urlObj?.url) {
                setError(`Failed to upload: ${file?.name}`);
                return;
            }
            uploadedDocs.push({
                name: file?.name,
                type: file?.type,
                size: file?.size,
                uploadedAt: new Date().toISOString().split('T')[0],
                s3Url: urlObj?.url
            });
        }

        const content = uploadedDocs?.map(doc => ({
            attachment: {
                contentType: doc?.type,
                url: doc?.s3Url ? doc?.s3Url?.split('?')[0] : '',
                size: doc?.size,
                title: doc?.name,
                creation: new Date(doc?.uploadedAt),
                fileName: doc?.name,
                name: doc?.name,
            }
        }));

        dispatch(uploadPatientDocumentsAction({
            key: encryptMessage({
                status: 'current',
                subject: subjectId,
                date: new Date().toISOString().split('T')[0],
                author: loggedInUser?._id,
                notes,
                content
            })
        }));
    };

    const formatFileSize = (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (!bytes) return '0 Byte';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
    };

    {/* Helper functions */ }

    function getFileIcon(contentType, fileName) {
        const extension = fileName?.split('.').pop().toLowerCase();
        const size = 24;

        if (contentType === 'application/pdf' || extension === 'pdf') {
            return <BsFileEarmarkPdf size={size} color="red" />;
        }
        if (['doc', 'docx'].includes(extension) || contentType.includes('word')) {
            return <BsFileWord size={size} color="#6169d0" />;
        }
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension) || contentType.includes('image')) {
            return <BsFileImage size={size} color="rgb(255 124 7 / 84%)" />;
        }
        return <BsFileEarmark size={size} color="#757575" />;
    }

    // function getFileTypeColor(contentType, fileName) {
    //     const extension = fileName?.split('.').pop().toLowerCase();

    //     if (contentType === 'application/pdf' || extension === 'pdf') return '#313A46';
    //     if (['doc', 'docx'].includes(extension) || contentType.includes('word')) return '#6169d0';
    //     if (['jpg', 'jpeg', 'png', 'gif'].includes(extension) || contentType.includes('image')) return 'rgb(249, 139, 55)';
    //     return '#757575';
    // }


    // {
    //     function formatFileSize(bytes) {
    //         if (!bytes) return '0 Bytes';
    //         const k = 1024;
    //         const sizes = ['Bytes', 'KB', 'MB'];
    //         const i = Math.floor(Math.log(bytes) / Math.log(k));
    //         return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    //     }
    // }
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h5>Patient Documents</h5>
                <Button className='custom-buttons' onClick={() => setShowUploadModal(true)}>
                    <PlusIcon className="me-1" /> Upload New
                </Button>
            </div>
            <div className='scroll-container row mt-1' style={{ overflowX: 'hidden', height: isAccordionOpen ? '1vh' : '73vh' }}>
                {store?.getDocumentsReducer?.loading ?
                    <div className="col-12 h-100 py-5 d-flex justify-content-center align-items-center">
                        <Spinner />
                    </div>
                    :
                    patientDocuments?.map((doc) =>
                        doc?.content?.map((content, index) => (
                            <div className="col-3 ">
                                <Card
                                    title={content?.attachment?.fileName}
                                    key={`${doc?._id}-${index}`}
                                    className="mb-3 p-2  rounded-1 cursor-pointer d-flex align-items-center justify-content-between"
                                    style={{
                                        // borderLeft: '4px solid ' + getFileTypeColor(content?.attachment?.contentType, content?.attachment?.fileName),
                                        borderLeft: '4px solid #e8f0fe',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <div className="d-flex align-items-center w-100 gap-3">
                                        {/* File Icon */}
                                        <div className="flex-shrink-0">
                                            {getFileIcon(content?.attachment?.contentType, content?.attachment?.fileName)}
                                        </div>

                                        {/* File Info */}
                                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                            <div className="text-truncate fw-medium">
                                                {content?.attachment?.fileName}
                                            </div>
                                            <div className="text-muted small">
                                                {formatFileSize(content?.attachment?.size)}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="d-flex gap-1 flex-shrink-0">
                                            {/* <FiDownload title="Download" size={18} /> */}
                                            <i title='Preview' onClick={() => {
                                                setPreviewModal(true);
                                                setPreviewLink(content?.attachment?.url);
                                            }} className='bi bi-eye fs-4 text-info cursor-pointer' />
                                            <i title='Edit Status' className='mdi mdi-square-edit-outline cursor-pointer fs-4' />
                                            <i title='Delete' className='bi bi-trash text-danger fs-4 cursor-pointer' />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))
                    )}
            </div>

            <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Documents</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12}>
                            <div
                                className="border rounded p-2 text-center"
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                style={{ borderStyle: 'dashed', backgroundColor: '#f8f9fa' }}
                            >
                                <UploadIcon size={24} className="mb-1" />
                                <p>Drag and drop files or</p>
                                <input
                                    type="file"
                                    multiple
                                    accept={validMimeTypes.join(',')}
                                    onChange={handleFileInput}
                                    hidden
                                    id="file-upload"
                                />
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => document.getElementById('file-upload').click()}
                                >
                                    Browse Files
                                </Button>
                                <p className="small text-muted mt-2">
                                    Allowed: PDF, DOC, DOCX, JPG, PNG, GIF. Max size: {MAX_FILE_SIZE_MB}MB
                                </p>
                            </div>
                        </Col>

                        {files.length > 0 && (
                            <>
                                <Col xs={12} className="mt-3">
                                    <div className="d-flex justify-content-between">
                                        <strong>Selected Files </strong>
                                        <div className="d-flex gap-2">
                                            <Button className='custom-buttons' onClick={() => setFiles([])} disabled={isLoading}>
                                                <DeleteIcon className="me-1" /> Clear
                                            </Button>
                                            <Button className='custom-buttons' onClick={handleUpload} disabled={isLoading}>
                                                {isLoading ? 'Uploading...' : 'Upload'}
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={12} className="mt-2">
                                    <Table hover responsive>
                                        <thead className="table-light">
                                            <tr>
                                                <th className='text-white'>#</th>
                                                <th className='text-white'>File</th>
                                                <th className='text-white'>Type</th>
                                                <th className='text-white'>Size</th>
                                                <th className='text-white'>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {files?.map((file, index) => (
                                                <tr key={index} onClick={() => setPreviewFile(file)} style={{ cursor: 'pointer' }}>
                                                    <td>{index + 1}</td>
                                                    <td className="d-flex align-items-center">{file.name}</td>
                                                    <td>{file.type.split('/').pop().toUpperCase()}</td>
                                                    <td>{formatFileSize(file.size)}</td>
                                                    <td>
                                                        <OverlayTrigger overlay={<Tooltip>Remove</Tooltip>}>
                                                            <Button variant="link" className="text-danger p-0" onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveFile(index);
                                                            }}>
                                                                <DeleteIcon />
                                                            </Button>
                                                        </OverlayTrigger>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </>
                        )}

                        <Col xs={12} className="mt-3">
                            <Form.Label>Notes & Comments</Form.Label>
                            <ReactQuill
                                theme="snow"
                                value={notes || ''}
                                onChange={setNotes}
                                modules={{
                                    toolbar: [
                                        ['bold', 'italic', 'underline'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        ['link'],
                                        ['clean']
                                    ]
                                }}
                            />
                        </Col>

                        {previewFile && (
                            <Col xs={12} className="mt-4">
                                <Card>
                                    <Card.Header className="d-flex justify-content-between">
                                        <strong>Preview</strong>
                                        <Button variant="link" onClick={() => setPreviewFile(null)}><CloseIcon /></Button>
                                    </Card.Header>
                                    <Card.Body className="text-center">
                                        {previewFile?.type.startsWith('image/') ? (
                                            <img src={URL.createObjectURL(previewFile)} alt="Preview" className="img-fluid rounded" style={{ maxHeight: '300px' }} />
                                        ) : (
                                            <>
                                                <FileIcon size={48} className="text-muted" />
                                                <p className="mt-2">No preview available</p>
                                            </>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </Modal.Body>
            </Modal>
            <PreviewModal show={previewModal} closePreviewModal={closePreviewModal} previewLink={previewLink} />
        </div>
    );
};

export default PatientDocs;
