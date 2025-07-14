import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Spinner from '../constants/Spinner';

const DeletionModal = ({ show, onHide, onConfirm, item = 'item', isLoading = false }) => {

    return (
        <Modal show={show} onHide={onHide} size="md" centered>
            <Modal.Header className='text-center'>
                <Modal.Title className='text-center'>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body className='text-center py-4 fs-5'>Are you sure you want to delete the selected <strong>{item}</strong>?</Modal.Body>
            <Modal.Footer>
                <Button disabled={isLoading} className='cancel-button' onClick={onHide}>
                    Cancel
                </Button>
                <Button disabled={isLoading} className='custom-buttons' onClick={onConfirm}>
                    {isLoading ?
                        <Spinner className='spinner-border-sm' color='white' />
                        :
                        `Delete`
                    }
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeletionModal;
