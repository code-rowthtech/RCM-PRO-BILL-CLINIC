import { Button, Modal } from 'react-bootstrap'
import { useSelector } from 'react-redux';

const ChangeNoteTypeModal = ({ showModal, closeModal, onConfirm }) => {
    const store = useSelector((state) => state);

    return (
        <Modal show={showModal} onHide={closeModal} size="md" centered>
            <Modal.Header closeButton className="border-0 pb-0">
            </Modal.Header>
            <Modal.Body className="px-4 py-3">
                <div className="row pt-0 mt-0">
                    <div className="col-12 mt-0 pt-0 text-center">
                        <i className="bi bi-exclamation-circle-fill text-warning fs-3"></i>
                        <h4 className='mb-0'>Change Note Type?</h4>
                    </div>
                    <div className="col-12 mt-2 text-center text-muted">
                        <p className='my-0'>
                            You're about to change the note type from your current selection.
                            This may affect how your note is formatted and displayed.
                        </p>
                        <p className="my-0">
                            Are you sure you want to proceed?
                        </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-center gap-2 mt-2">
                        <Button
                            className="custom-buttons"
                            onClick={closeModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="custom-buttons"
                            onClick={() => {
                                onConfirm();
                                closeModal();
                            }}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ChangeNoteTypeModal