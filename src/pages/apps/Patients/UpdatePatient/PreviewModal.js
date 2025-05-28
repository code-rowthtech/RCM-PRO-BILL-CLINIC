import React from 'react';
import { Modal } from 'react-bootstrap';

const getFileExtension = (url) => {
    return url?.split('.').pop().toLowerCase();
};

const isImage = (ext) => ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
const isPdf = (ext) => ext === 'pdf';
const isDoc = (ext) => ['doc', 'docx'].includes(ext);

// Office viewer URL (alternative to Google Viewer)
const getDocPreviewUrl = (url) =>
    `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;

const PreviewModal = ({ show, closePreviewModal, previewLink }) => {
    const ext = getFileExtension(previewLink);

    const renderPreview = () => {
        if (!previewLink) return <p>No file to preview.</p>;

        if (isImage(ext)) {
            return <img src={previewLink} alt="Document Preview" style={{ maxWidth: '100%', maxHeight: '600px' }} />;
        }

        if (isPdf(ext)) {
            return (
                <iframe
                    src={previewLink}
                    width="100%"
                    height="600px"
                    title="PDF Preview"
                    style={{ border: 'none' }}
                ></iframe>
            );
        }

        if (isDoc(ext)) {
            return (
                <iframe
                    src={getDocPreviewUrl(previewLink)}
                    width="100%"
                    height="600px"
                    title="Document Preview"
                    style={{ border: 'none' }}
                ></iframe>
            );
        }

        return <p>Unsupported file format.</p>;
    };

    return (
        <Modal show={show} onHide={closePreviewModal} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>Document Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                    {renderPreview()}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default PreviewModal;
