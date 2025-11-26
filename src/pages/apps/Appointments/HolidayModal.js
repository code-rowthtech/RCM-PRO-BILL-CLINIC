import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { FiCalendar } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import ToastHandle from '../../../helpers/ToastMessage';

const HolidayModal = ({
    showModal,
    handleCloseModal,
    scheduledDate,
    setScheduledDate,
    minDate
}) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [hasConflict, setHasConflict] = useState(false);

    const practitionerSchedule = useSelector(
        (state) => state?.getPractitionerScheduleReducer?.data?.holidays
    );

    useEffect(() => {
        setSelectedDate(scheduledDate);
    }, [scheduledDate]);

    useEffect(() => {
        if (!selectedDate || !practitionerSchedule?.length) {
            setHasConflict(false);
            return;
        }

        const selectedDateOnly = new Date(selectedDate).toISOString().split('T')[0];
        const conflict = practitionerSchedule.some((data) => {
            const scheduleDateOnly = new Date(data.date).toISOString().split('T')[0];
            return scheduleDateOnly === selectedDateOnly;
        });

        setHasConflict(conflict);
    }, [selectedDate, practitionerSchedule]);

    const onConfirm = () => {
        if (hasConflict) {
            ToastHandle('This date is already a holiday for the provider.', 'danger');
            return;
        }
        setScheduledDate(selectedDate);
        handleCloseModal();
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal} size="md" centered>
            <Modal.Header closeButton className="border-0 pb-0">
            </Modal.Header>
            <Modal.Body className="px-4 py-3">
                {hasConflict && (
                    <div className="alert alert-warning mb-3">
                        <p className="mb-0">
                            <strong>Conflict Detected:</strong> The selected provider is unavailable on <strong>{selectedDate}</strong>.
                        </p>
                    </div>
                )}

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className="d-flex align-items-center gap-2">
                            <FiCalendar size={18} />
                            Change Appointment Date
                        </Form.Label>
                        <Form.Control
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={minDate || new Date().toISOString().split('T')[0]}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-1 pt-2">
                        <Button
                            onClick={handleCloseModal}
                            className="custom-buttons"
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            className="custom-buttons"
                            variant="primary"
                            disabled={!selectedDate}
                        >
                            Confirm
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default HolidayModal;
