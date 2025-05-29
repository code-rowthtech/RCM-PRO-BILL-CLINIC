import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Form, Modal, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import {
    FiUpload as UploadIcon,
    FiTrash2 as DeleteIcon,
    FiX as CloseIcon,
    FiFile as FileIcon,
    FiPlus as PlusIcon,
    FiFileText
} from 'react-icons/fi';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useSelector } from 'react-redux';
import { documentCategories, documentTypes } from '../../../../utils/documentsJson';
import { encryptMessage } from '../../../../cryptoUtils';
import { getEncounterAction, uploadPatientDocumentsAction } from '../../../../redux/actions';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { handleUpload as handleS3Upload } from '../../../../helpers/HandleUpload';
import { loggedInUser } from '../../../../helpers/api/loggedInUser';
import { doc } from 'prettier';

const MAX_FILE_SIZE_MB = 2;

const CreateDocumentsModal = ({ showUploadModal, closeModal, documentData }) => {
    console.log('documentData', documentData);
    const store = useSelector((state) => state);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const subjectId = searchParams.get('id');
    const [previewFile, setPreviewFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [encounter, setEncounter] = useState('')
    const [searchEncounter, setSearchEncounter] = useState('');
    const [notes, setNotes] = useState(null);
    const [error, setError] = useState(null);
    const [loadingUpload, setLoadingUpload] = useState(false);

    const uploadDocumentsResponse = store?.uploadDocumentsReducer;
    const encounterOptions = store?.getEncounterReducer?.data?.encounters?.map((data) => ({
        label: data?.period?.start ? new Date(data?.period?.start)?.toISOString().split('T')?.[0] : '', value: data?._id
    }));
    const loadingRedux = store?.uploadDocumentsReducer?.loading;
    const isLoading = loadingRedux || loadingUpload;

    useEffect(() => {
        if (uploadDocumentsResponse?.data?.status === 201) {
            setEncounter('');
            setDocumentCategory(null);
            setFiles([]);
            setNotes('');
            setPreviewFile(null);
            setDocumentType(null);
        }
    }, [uploadDocumentsResponse])

    const handleEncounterChange = (selectedOption) => {
        // dispatch(getEncounterAction({ patientId: subjectId }))
        setEncounter(selectedOption ? selectedOption.value : '');
    };

    // DOCUMENT TYPE HANDLING
    const [documentType, setDocumentType] = useState(null);
    console.log(documentType, 'documentType');
    const formattedDocumentTypes = useMemo(() =>
        documentTypes.map((type) => ({
            value: type,
            label: type?.display,
        })), []);
    const selectedDocumentTypeOption = useMemo(() =>
        formattedDocumentTypes.find((option) => option?.value?.display === documentType?.text) ||
        formattedDocumentTypes.find((option) => option?.display === documentType),
        [formattedDocumentTypes, documentType]
    );

    const loadDocumentTypeOptions = useCallback((inputValue, callback) => {
        if (!inputValue) {
            callback(formattedDocumentTypes.slice(0, 10));
            return;
        }

        const filteredOptions = formattedDocumentTypes.filter((option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
        );

        callback(filteredOptions.slice(0, 20));
    }, [formattedDocumentTypes]);

    const handleDocumentTypeChange = useCallback((selectedOption) => {
        setDocumentType(selectedOption ? selectedOption.value : '');
    }, []);

    // DOCUMENT Category HANDLING
    const [documentCategory, setDocumentCategory] = useState(null);
    console.log(documentCategory, 'documentCategory');

    // const formattedDocumentCategory = useMemo(() =>
    //     documentCategories.map((type) => ({
    //         value: type,
    //         label: type?.display,
    //     })), []);
    // const selectedDocumentCategoryOption = useMemo(() =>
    //     formattedDocumentCategory.find((option) => option?.value?.display === documentCategory?.text) ||
    //     formattedDocumentCategory.find((option) => option?.display === documentCategory),
    //     [formattedDocumentCategory, documentCategory]
    // );

    // const loadDocumentCategoryOptions = useCallback((inputValue, callback) => {
    //     if (!inputValue) {
    //         callback(formattedDocumentCategory.slice(0, 10));
    //         return;
    //     }

    //     const filteredOptions = formattedDocumentCategory.filter((option) =>
    //         option.label.toLowerCase().includes(inputValue.toLowerCase())
    //     );

    //     callback(filteredOptions.slice(0, 20));
    // }, [formattedDocumentCategory]);

    // const handleDocumentCategoryChange = useCallback((selectedOption) => {
    //     setDocumentCategory(selectedOption ? selectedOption.value : '');
    // }, []);


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

        const documentTypePayload = {
            coding: [{
                system: documentType.system,
                code: documentType.code,
                display: documentType.display,
            }],
            text: documentType.display,
        };
        const documentCategoryPayload = {
            coding: [{
                system: documentCategory.system,
                code: documentCategory.code,
                display: documentCategory.display,
            }],
            text: documentCategory.display,
        };
        dispatch(uploadPatientDocumentsAction({
            key: encryptMessage({
                status: 'current',
                subject: subjectId,
                date: new Date().toISOString().split('T')[0],
                author: loggedInUser?._id,
                notes,
                content,
                type: documentTypePayload,
                category: [documentCategoryPayload],
                context: {
                    encounter: [encounter]
                }
            })
        }));
    };

    const formatFileSize = (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (!bytes) return '0 Byte';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
    };

    // Add state for selected files
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Handler for checkbox toggle
    const handleCheckboxChange = (index) => {
        setSelectedFiles((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    // Handler for select all
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedFiles(files.map((_, idx) => idx));
        } else {
            setSelectedFiles([]);
        }
    };

    // Handler for deleting selected files
    const handleDeleteSelected = () => {
        setFiles((prev) => prev.filter((_, idx) => !selectedFiles.includes(idx)));
        setSelectedFiles([]);
        if (selectedFiles.some(idx => files[idx] === previewFile)) setPreviewFile(null);
    };

    useEffect(() => {
        if (documentData) {
            setEncounter(documentData?.context?.encounter?.[0] || '');
            setDocumentType(documentData?.type?.[0]?.coding?.[0] || null);
            setDocumentCategory(documentData?.category?.[0]?.coding?.[0] || null);
            setNotes(documentData?.notes || '');
        }
    }, [documentData])
    return (
        <Modal className={`${documentData ? '' : 'upload-documents'}`} show={showUploadModal} onHide={closeModal} size="lg" centered>
            <Modal.Header className="p-0 pb-0 d-flex justify-content-center">
                <Modal.Title className="fw-semibold ">
                    Upload Documents
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    {!documentData && (
                        <Col xs={6}>
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
                    )}
                    <Col xs={documentData ? 12 : 6}>
                        <Row>
                            <Col xs={documentData ? 4 : 12}>
                                <Form.Group>
                                    <Form.Label className='mb-0 mt-1'>Document Type</Form.Label>
                                    <AsyncSelect
                                        loadOptions={loadDocumentTypeOptions}
                                        defaultOptions={formattedDocumentTypes.slice(0, 10)}
                                        isSearchable
                                        className="basic-single"
                                        classNamePrefix="select"
                                        placeholder="&nbsp; Select"
                                        value={selectedDocumentTypeOption}
                                        onChange={handleDocumentTypeChange}
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
                            <Col xs={documentData ? 4 : 12}>
                                <Form.Group>
                                    <Form.Label className='mb-0 mt-1'>Document Category</Form.Label>
                                    <Form.Select onChange={(e) => {
                                        setDocumentCategory(documentCategories.find(category => category.code === e.target.value) || null);
                                    }}>
                                        <option value="" hidden>Select</option>
                                        {documentCategories.map((category, index) => (
                                            <option key={index} value={category.code}>{category.display}</option>
                                        ))}
                                    </Form.Select>
                                    {/* <AsyncSelect
                                        loadOptions={loadDocumentCategoryOptions}
                                        defaultOptions={formattedDocumentCategory.slice(0, 10)}
                                        isSearchable
                                        className="basic-single"
                                        classNamePrefix="select"
                                        placeholder="&nbsp; Select"
                                        value={selectedDocumentCategoryOption}
                                        onChange={handleDocumentCategoryChange}
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
                                    /> */}
                                </Form.Group>
                            </Col>
                            <Col xs={documentData ? 4 : 12}>
                                <Form.Group>
                                    <Form.Label className='mb-0 mt-1'>Encounter</Form.Label>
                                    <Select
                                        options={encounterOptions}
                                        isSearchable
                                        isLoading={store?.getEncounterReducer?.loading}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        placeholder="Select"
                                        value={encounterOptions?.find(option => option?.value === encounter) || null}
                                        onChange={(selected) => {
                                            setEncounter(selected?.value);
                                            handleEncounterChange?.(selected);
                                        }}
                                        inputValue={searchEncounter}
                                        onInputChange={(value) => setSearchEncounter(value)}
                                        isDisabled={store?.updateEncounterReducer?.loading && store?.updateEncounterReducer?.fieldUpdating === 'noteType'}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                height: '30px',
                                                minHeight: '30px',
                                                border: 'none',
                                                background: "#e8f0fe !important",
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
                        </Row>
                    </Col>
                    <Col xs={12} className="mt-1 scroll-container" style={{ height: '15vh' }}>
                        <Form.Label className='mb-0'>Notes & Comments</Form.Label>
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
                    {files.length > 0 && (
                        <Col xs={12} className='mt-2'>
                            <Row>
                                <Col style={{ height: '28vh' }} xs={12} className="mt-0 scroll-container ">
                                    <Table
                                        responsive
                                        className="table-centered table-nowrap mb-0  rounded">
                                        <thead className="text-white">
                                            <tr>
                                                <th className='text-white' >
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={selectedFiles.length === files.length && files.length > 0}
                                                        onChange={handleSelectAll}
                                                        aria-label="Select all files"
                                                        style={{ marginLeft: 4 }}
                                                    />
                                                </th>
                                                <th className='text-white'>File</th>
                                                <th className='text-white'>Type</th>
                                                <th className='text-white'>Size</th>
                                                {selectedFiles.length > 0 && (
                                                    <OverlayTrigger overlay={<Tooltip>Delete Selected</Tooltip>}>
                                                        <th className='text-white'>
                                                            <DeleteIcon onClick={handleDeleteSelected} />
                                                        </th>
                                                    </OverlayTrigger>

                                                )}

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {files?.map((file, index) => (
                                                <tr key={index} onClick={() => setPreviewFile(file)} style={{ cursor: 'pointer' }}>
                                                    <td>
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={selectedFiles.includes(index)}
                                                            onChange={e => {
                                                                e.stopPropagation();
                                                                handleCheckboxChange(index);
                                                            }}
                                                            aria-label={`Select file ${file.name}`}
                                                        />
                                                    </td>
                                                    <td title={file.name}>{file.name?.length > 25 ? file.name?.slice(0, 24) + '...' : file.name}</td>
                                                    <td title={file.type.split('/').pop().toUpperCase()}>{file.type.split('/').pop().toUpperCase()?.length > 20
                                                        ? file.type.split('/').pop().toUpperCase()?.slice(0, 19) + '...' :
                                                        file.type.split('/').pop().toUpperCase()}
                                                    </td>
                                                    <td>{formatFileSize(file.size)}</td>
                                                    {selectedFiles.length > 0 && (
                                                        <td></td>
                                                    )}


                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>

                        </Col>
                    )}
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Row className='my-0'>
                    <Col xs={12} className="d-flex py-0 gap-2 align-items-center justify-content-end">
                        <Button className='custom-buttons' onClick={() => {
                            closeModal();
                            setFiles([]);
                            setDocumentType(null);
                            setDocumentCategory(null);
                            setNotes('');
                            setEncounter('');
                        }} disabled={isLoading}>Cancel</Button>
                        <Button className='custom-buttons' onClick={handleUpload} disabled={isLoading}>
                            {isLoading ? 'Uploading...' : documentData ? 'Update' : 'Upload'}
                        </Button>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>)
}

export default CreateDocumentsModal