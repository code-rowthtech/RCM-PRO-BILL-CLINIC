import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import Spinner from '../../../../../constants/Spinner';

const PreviewModal = ({ showModalPic, handleCloseModal, modalFileUrl }) => {
    const [imageLoading, setImageLoading] = useState(true);
    return (
        <Modal show={showModalPic} onHide={handleCloseModal} centered>
            <Modal.Body>
                <div className="d-flex justify-content-center">
                    <p className="fw-bold" style={{ color: '#6169D0' }}>
                        {`File Yolo Preview`}
                    </p>
                </div>
                <div
                    style={{
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '300px',
                    }}>
                    {imageLoading && (
                        <div className="d-flex justify-content-center align-items-center">
                            <Spinner />
                        </div>
                    )}
                    <img
                        src={modalFileUrl}
                        alt="File Preview"
                        onLoad={() => setImageLoading(false)}
                        onError={() => setImageLoading(false)}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100vh',
                            objectFit: 'contain',
                            display: imageLoading ? 'none' : 'block',
                        }}
                    />
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default PreviewModal