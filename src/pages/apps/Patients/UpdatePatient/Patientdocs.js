import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
    Button, Card, Table, Modal, Row, Col,
    Form
} from 'react-bootstrap';
import {
    FiPlus as PlusIcon,
    FiFileText
} from 'react-icons/fi';

import {
    BsFileEarmarkPdf,
    BsFileWord,
    BsFileImage,
    BsFileEarmark
} from 'react-icons/bs';
import AsyncSelect from 'react-select/async';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loggedInUser } from '../../../../helpers/api/loggedInUser';
import { deletePatientDocumentsAction, getDocumentByIdAction, getDocumentsAction, getEncounterAction, updatePatientDocumentsAction, uploadPatientDocumentsAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';
import PreviewModal from './PreviewModal';
import { documentCategories, documentTypes } from '../../../../utils/documentsJson';
import CreateDocumentsModal from './CreateDocumentsModal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DeletionModal from '../../../../helpers/deletionModal';

const MAX_FILE_SIZE_MB = 2;

const PatientDocs = ({ isAccordionOpen }) => {
    const [searchParams] = useSearchParams();
    const subjectId = searchParams.get('id');
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const uploadDocumentsResponse = store?.uploadDocumentsReducer;
    const deleteDocumentsResponse = store?.deleteDocumentsReducer;
    const patientDocuments = store?.getDocumentsReducer?.data?.patientDocuments || [];
    const updateDocumentsResponse = store?.updateDocumentsReducer;
    useEffect(() => {
        if (updateDocumentsResponse?.data?.status === 200 || deleteDocumentsResponse?.data?.status === 200) {
            dispatch(getDocumentsAction({ subject: subjectId }));
            closeDeleteModal();
        }
    }, [updateDocumentsResponse, deleteDocumentsResponse]);

    const [previewLink, setPreviewLink] = useState(null);
    const [previewModal, setPreviewModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [documentData, setDocumentData] = useState(null);
    const [expandedDocId, setExpandedDocId] = useState(null);
    const [expandedDoc, setExpandedDoc] = useState(null);
    const [isExpandedView, setIsExpandedView] = useState(false);
    const documentById = store?.getDocumentsByIdReducer?.data;
    const [notes, setNotes] = useState()
    useEffect(() => {
        if (documentById) {
            setNotes(documentById?.notes)
        }
    }, [documentById])
    // DOCUMENT TYPE HANDLING
    const [documentTypesMap, setDocumentTypesMap] = useState({});
    const formattedDocumentTypes = useMemo(() =>
        documentTypes.map((type) => ({
            value: type,
            label: type?.display,
        })), []);

    const loadDocumentTypeOptions = useCallback((inputValue, callback) => {
        if (!inputValue) {
            callback(formattedDocumentTypes.slice(0, 10));
            return;
        }

        const filteredOptions = formattedDocumentTypes.filter((option) =>
            option?.label?.toLowerCase()?.includes(inputValue?.toLowerCase())
        );

        callback(filteredOptions.slice(0, 20));
    }, [formattedDocumentTypes]);
    const handleDocumentTypeChange = useCallback((docId, selectedOption) => {
        const documentTypePayload = {
            coding: [{
                system: selectedOption?.value?.system,
                code: selectedOption?.value?.code,
                display: selectedOption?.value?.display,
            }],
            text: selectedOption?.value?.display,
        };
        dispatch(updatePatientDocumentsAction({ key: encryptMessage({ type: documentTypePayload }), patientDocId: docId }));
    }, []);
    useEffect(() => {
        const initialTypes = {};
        patientDocuments?.forEach(doc => {
            initialTypes[doc._id] = doc?.type?.text || null;
        });
        setDocumentTypesMap(initialTypes);
    }, [patientDocuments]);

    useEffect(() => {
        if (isExpandedView && expandedDoc) {
            dispatch(getDocumentByIdAction({ docId: expandedDoc?._id }));
        }
    }, [isExpandedView, expandedDoc]);

    useEffect(() => {
        if (updateDocumentsResponse?.data?.status === 200) {
            dispatch(getDocumentByIdAction({ docId: expandedDoc?._id }));
        }
    }, [updateDocumentsResponse]);

    const closePreviewModal = () => {
        setPreviewModal(false);
        setPreviewLink(null);
    }

    useEffect(() => {
        if (uploadDocumentsResponse?.data?.status === 201) {
            setShowUploadModal(false);
            dispatch(getDocumentsAction({ subject: subjectId }));
        }
    }, [uploadDocumentsResponse])

    useEffect(() => {
        dispatch(getDocumentsAction({ subject: subjectId }))
    }, [dispatch])

    const formatFileSize = (bytes) => {
        const sizes = ['B', 'KB', 'MB', 'GB'];
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
        if (['doc', 'docx']?.includes(extension) || contentType?.includes('word')) {
            return <BsFileWord size={size} color="#6169d0" />;
        }
        if (['jpg', 'jpeg', 'png', 'gif']?.includes(extension) || contentType?.includes('image')) {
            return <BsFileImage size={size} color="rgb(255 124 7 / 84%)" />;
        }
        return <BsFileEarmark size={size} color="#757575" />;
    }

    const closeDocumentModal = () => {
        setDocumentData(null);
        setShowUploadModal(false);
    }
    const handleDeleteAttachment = (document, attachmentId) => () => {
        const content = document?.content
            ?.filter(doc => doc._id !== attachmentId) // Remove the matching attachment
            ?.map(doc => ({
                attachment: {
                    contentType: doc?.attachment?.contentType,
                    url: doc?.attachment?.url?.split('?')[0] || '',
                    size: doc?.attachment?.size,
                    title: doc?.attachment?.title,
                    creation: new Date(doc?.attachment?.creation),
                    fileName: doc?.attachment?.fileName,
                    name: doc?.attachment?.name,
                },
                _id: doc?._id,
            }));
        dispatch(updatePatientDocumentsAction({ key: encryptMessage({ content: content }), patientDocId: document?._id }));
    };

    const [deleteModal, setDeleteModal] = useState(false);
    const closeDeleteModal = () => {
        setDocToDeleteId(null);
        setDocToDelete(null);
        setCollectionId(null);
        setDeleteModal(false);
    }
    const [docToDeleteId, setDocToDeleteId] = useState(null);
    const [docToDelete, setDocToDelete] = useState(null);
    const [collectionId, setCollectionId] = useState(null);
    const handleDeleteCollection = () => {
        dispatch(deletePatientDocumentsAction({ patientDocId: collectionId }));
    }
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h5>Patient Documents</h5>
                <Button className='custom-buttons' onClick={() => setShowUploadModal(true)}>
                    <PlusIcon className="me-1" /> Upload
                </Button>
            </div>
            <div className='scroll-container g-0 row mt-1' style={{ overflowX: 'hidden', height: isAccordionOpen ? '58vh' : '73vh' }}>
                {store?.getDocumentsReducer?.loading ?
                    <div className="col-12 h-100 py-5 d-flex justify-content-center align-items-center">
                        <Spinner />
                    </div>
                    :
                    patientDocuments?.length === 0 ?
                        <div className="col-12 h-100 py-5 d-flex justify-content-center align-items-center">
                            <div className="d-flex flex-column align-items-center">
                                <FiFileText size={48} className="text-muted mb-1" />
                                <h5>No Documents found</h5>
                            </div>
                        </div>
                        :

                        patientDocuments?.map((doc) => (
                            <div className="col-12  mb-2 p-0 position-relative" key={doc?._id}>
                                <div className='d-flex gap-1 align-items-center' style={{ position: 'absolute', left: '96%', top: '1%', zIndex: 111 }}>
                                    <i
                                        title='Expand'
                                        onClick={() => {
                                            setExpandedDoc(doc);
                                            setIsExpandedView(true);
                                        }}
                                        className='mdi mdi-square-edit-outline fs-5 cursor-pointer '
                                    />
                                    <i
                                        title='Delete'
                                        onClick={() => {
                                            setCollectionId(doc?._id);
                                            setDeleteModal(true);
                                        }}
                                        className='bi bi-trash text-danger fs-5 cursor-pointer'
                                    />

                                </div>

                                <Card className='p-1 mb-0 border' style={{ height: '32vh' }}>
                                    <Card.Body className='p-0'>
                                        <div className="row">
                                            <div className="col-12">
                                                <h5 className='mt-0'>Document Notes ({doc?.date ? new Date(doc?.date)?.toISOString()?.split('T')?.[0] : ''})</h5>
                                            </div>
                                            <div className="col-7">
                                                <div className="row">
                                                    <div className="col-12 overflow-auto thin-scrollbar" style={{ height: '26vh' }}>
                                                        {!doc?.notes || doc?.notes === '' ?
                                                            <h5 className='d-flex fs-6 align-items-center justify-content-center py-5'>No Notes Found</h5>
                                                            :
                                                            <div
                                                                dangerouslySetInnerHTML={{
                                                                    __html:
                                                                        doc?.notes,
                                                                }}
                                                            />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-5">
                                                <div className="row g-1 mt-0 overflow-auto thin-scrollbar" style={{ height: '26.2vh' }} >
                                                    {doc?.content?.map((content, index) => (
                                                        <div className="col-6" >
                                                            <div
                                                                title={content?.attachment?.fileName}
                                                                key={`${doc?._id}-${index}`}
                                                                className="p-2 shadow-sm  rounded-1 cursor-pointer d-flex align-items-center justify-content-between"
                                                                style={{
                                                                    borderLeft: '4px solid rgba(97, 104, 208, 0.73)',
                                                                    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                                                                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                                                                    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                                                                    transition: 'all 0.2s ease',
                                                                    marginBottom: '0px',
                                                                }}
                                                            >
                                                                <div className="d-flex align-items-center w-100 gap-2">
                                                                    <div className="flex-shrink-0">
                                                                        {getFileIcon(content?.attachment?.contentType, content?.attachment?.fileName)}
                                                                    </div>

                                                                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                                        <div className="text-truncate fw-medium">
                                                                            {content?.attachment?.fileName?.length > 35 ? content?.attachment?.fileName?.slice(0, 34) + '...' : content?.attachment?.fileName}
                                                                        </div>
                                                                        <div className="text-muted small">
                                                                            {formatFileSize(content?.attachment?.size)}
                                                                        </div>
                                                                    </div>

                                                                    <div className="d-flex gap-1 flex-shrink-0">
                                                                        <i title='Preview' onClick={() => {
                                                                            setPreviewModal(true);
                                                                            setPreviewLink(content?.attachment?.url);
                                                                        }} className='bi bi-eye fs-5 text-info cursor-pointer' />
                                                                        <i title='Delete' onClick={() => {
                                                                            setDocToDelete(doc);
                                                                            setDocToDeleteId(content?._id);
                                                                            setDeleteModal(true);
                                                                            // handleDeleteAttachment(doc, content?._id)
                                                                        }} className='bi bi-trash text-danger fs-5 cursor-pointer' />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* <div className="col-12 p-0 m-0 mt-1">
                                            </div> */}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}

                {/* Expanded view modal */}
                {isExpandedView && expandedDoc && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            zIndex: 9999,
                            display: previewModal ? 'none' : 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '10px'
                        }}>
                        <div className='scroll-container' style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            width: '45%',
                            height: '77vh',
                            maxWidth: '1200px',
                            maxHeight: '90vh',
                            padding: '10px',
                            position: 'relative'
                        }}>
                            {/* Close button */}
                            <button
                                onClick={() => setIsExpandedView(false)}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '20px',
                                    cursor: 'pointer'
                                }}
                            >
                                ×
                            </button>

                            {/* Expanded content - you can reuse your card structure but make it larger */}
                            <div className='mt-1' style={{ padding: '10px' }}>
                                {store?.getDocumentsByIdReducer?.loading ?
                                    <div className='row'>
                                        <div className="col-12 d-flex align-items-center justify-content-center p-5">
                                            <Spinner />
                                        </div>
                                    </div>
                                    :
                                    <div className="row">
                                        <div className="col-md-12" style={{ height: '7.5vh' }}>
                                            <div className="row mb-3">
                                                <div className="col-md-4">
                                                    <Form.Label className='mb-0'>Date</Form.Label>
                                                    <Form.Control
                                                        type='date'
                                                        style={{ cursor: 'not-allowed' }}
                                                        value={expandedDoc?.date ? new Date(expandedDoc?.date)?.toISOString()?.split('T')?.[0] : ''}
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="col-4 ">
                                                    <Form.Label className='mb-0'>Category</Form.Label>
                                                    <Form.Select
                                                        onChange={(e) => {
                                                            const selectedCategory = documentCategories.find(category => category.code === e.target.value);
                                                            const categoryPayload = {
                                                                coding: [{
                                                                    system: selectedCategory?.system,
                                                                    code: selectedCategory?.code,
                                                                    display: selectedCategory?.display,
                                                                }],
                                                                text: selectedCategory?.display,
                                                            };
                                                            dispatch(updatePatientDocumentsAction({ key: encryptMessage({ category: categoryPayload }), patientDocId: expandedDoc?._id }));
                                                        }}
                                                        defaultValue={expandedDoc?.category?.[0]?.coding?.[0]?.code || ''}>
                                                        <option value="" hidden>Select</option>
                                                        {documentCategories?.map((category, index) => (
                                                            <option key={index} value={category.code}>{category.display}</option>
                                                        ))}
                                                    </Form.Select>
                                                </div>
                                                <div className="col-4 ">
                                                    <Form.Label className='mb-0'>Type</Form.Label>
                                                    <AsyncSelect
                                                        loadOptions={loadDocumentTypeOptions}
                                                        defaultOptions={formattedDocumentTypes.slice(0, 10)}
                                                        isSearchable
                                                        className="basic-single flex-fill"
                                                        classNamePrefix="select"
                                                        placeholder="Select"
                                                        value={
                                                            formattedDocumentTypes.find(
                                                                (option) => option.value.code === expandedDoc?.type?.coding?.[0]?.code
                                                            )
                                                        }
                                                        onChange={(selectedOption) => handleDocumentTypeChange(expandedDoc?._id, selectedOption)}
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
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <Form.Label className='mb-0'>Notes & Comments</Form.Label>
                                            <ReactQuill
                                                theme="snow"
                                                value={notes || ''}
                                                onChange={setNotes}
                                                style={{ height: '50vh' }}
                                                modules={{
                                                    toolbar: [
                                                        ['bold', 'italic', 'underline'],
                                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                        ['link'],
                                                        ['clean']
                                                    ]
                                                }}
                                            />
                                        </div>
                                        {notes !== documentById?.notes &&
                                            <div className="row mt-2 pe-0">
                                                <div className="col-12 mt-4 pe-0 d-flex justify-content-end   ">
                                                    <Button disabled={store?.updateDocumentsReducer?.loading} onClick={() => {
                                                        dispatch(updatePatientDocumentsAction({ key: encryptMessage({ notes: notes }), patientDocId: documentById?._id }));
                                                    }} className='custom-buttons'>
                                                        {store?.updateDocumentsReducer?.loading ?
                                                            <Spinner className='spinner-border-sm' color='white' />
                                                            :
                                                            `Save`
                                                        }
                                                    </Button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }

                            </div>

                        </div>

                        <div className='position-absolute thin-scrollbar' style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            width: '20vw',
                            overflowY: 'scroll',
                            overflowX: 'hidden',
                            maxWidth: '1200px',
                            height: '77vh',
                            overflow: 'auto',
                            padding: '10px',
                            top: '11.5vh',
                            left: '72.6vw',
                            zIndex: 111
                        }}>
                            <div className="row">
                                {store?.getDocumentsByIdReducer?.loading ?
                                    <div className='row'>
                                        <div className="col-12 d-flex align-items-center justify-content-center p-5">
                                            <Spinner />
                                        </div>
                                    </div>
                                    : documentById?.content?.map((content, index) => (
                                        <div className="col-12 mb-1" >
                                            <div
                                                title={content?.attachment?.fileName}
                                                key={`${expandedDoc?._id}-${index}`}
                                                className="p-2 shadow-sm  rounded-1 cursor-pointer d-flex align-items-center justify-content-between"
                                                style={{
                                                    borderLeft: '4px solid rgba(97, 104, 208, 0.73)',
                                                    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                                                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                                                    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                                                    transition: 'all 0.2s ease',
                                                    marginBottom: '0px',
                                                }}
                                            >
                                                <div className="d-flex align-items-center w-100 gap-2">
                                                    <div className="flex-shrink-0">
                                                        {getFileIcon(content?.attachment?.contentType, content?.attachment?.fileName)}
                                                    </div>

                                                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                        <div className="text-truncate fw-medium">
                                                            {content?.attachment?.fileName?.length > 35 ? content?.attachment?.fileName?.slice(0, 34) + '...' : content?.attachment?.fileName}
                                                        </div>
                                                        <div className="text-muted small">
                                                            {formatFileSize(content?.attachment?.size)}
                                                        </div>
                                                    </div>

                                                    <div className="d-flex gap-1 flex-shrink-0">
                                                        <i title='Preview' onClick={() => {
                                                            setPreviewModal(true);
                                                            setPreviewLink(content?.attachment?.url);
                                                        }} className='bi bi-eye fs-5 text-info cursor-pointer' />
                                                        <i title='Delete' onClick={handleDeleteAttachment(expandedDoc, content?._id)} className='bi bi-trash text-danger fs-5 cursor-pointer' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )
                }
            </div>

            <CreateDocumentsModal documentData={documentData} showUploadModal={showUploadModal} closeModal={closeDocumentModal} />
            <PreviewModal show={previewModal} closePreviewModal={closePreviewModal} previewLink={previewLink} />
            <DeletionModal show={deleteModal} onHide={closeDeleteModal} onConfirm={collectionId ? handleDeleteCollection : handleDeleteAttachment(docToDelete, docToDeleteId)} item={collectionId ? 'selected document collection' : 'selected attachment'} isLoading={store?.updateDocumentsReducer?.loading || store?.deleteDocumentsReducer?.loading} />
        </div>
    );
};

export default PatientDocs;