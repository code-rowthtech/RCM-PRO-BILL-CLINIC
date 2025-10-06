import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import Spinner from '../../../../../../constants/Spinner';

const FilePreviewModal = ({ show, onHide, fileUrl, imageLoading, setImageLoading }) => {
  useEffect(() => {
    if (show && fileUrl) {
      setImageLoading(true);
    }
  }, [show, fileUrl, setImageLoading]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body>
        <div className="d-flex justify-content-center">
          <p className="fw-bold" style={{ color: '#6169D0' }}>
            File Preview
          </p>
        </div>
        <div
          style={{
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px'
          }}
        >
          {imageLoading && (
            <div className="d-flex justify-content-center align-items-center">
              <Spinner />
            </div>
          )}
          <img
            src={fileUrl?.url || fileUrl}
            alt="File Preview"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              maxWidth: '100%',
              maxHeight: '100vh',
              objectFit: 'contain',
              display: imageLoading ? 'none' : 'block'
            }}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default FilePreviewModal;