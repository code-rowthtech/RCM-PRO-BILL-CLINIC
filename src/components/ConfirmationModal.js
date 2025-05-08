import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmationModal = ({ show, onConfirm, onCancel }) => {
    return (
        <Modal centered show={show} onHide={onCancel}>
            <Modal.Body>
                <div className="p-4" style={{ maxWidth: '500px', width: '100%' }}>
                    <div className="card-body text-center">
                        <h4 className="card-title">Are you sure you want to logout!</h4>
                        <div className="d-flex justify-content-center gap-3">
                            <Button className="cancel-button" onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button type="button" className="custom-buttons" onClick={onConfirm}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ConfirmationModal;
