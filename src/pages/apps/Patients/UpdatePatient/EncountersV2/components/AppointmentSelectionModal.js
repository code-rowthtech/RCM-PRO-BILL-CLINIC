import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointmentsAction } from '../../../../../../redux/actions';
import { formatDateByUserTimeZone } from '../../../../../../components/timeZonePipe';
import Spinner from '../../../../../../constants/Spinner';

const AppointmentSelectionModal = ({
    show,
    onHide,
    onAppointmentSelect,
    patientId
}) => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const appointmentsData = store?.getAppointmentsReducer?.data?.appointments || [];
    const loading = store?.getAppointmentsReducer?.loading;

    // Filter appointments for today and future dates, and only confirmed/scheduled ones
    const availableAppointments = appointmentsData.filter(appointment => {
        const appointmentDate = new Date(appointment.start);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return appointmentDate >= today &&
            ['booked', 'confirmed', 'arrived'].includes(appointment.status?.toLowerCase());
    });

    const appointmentOptions = availableAppointments.map((appointment) => ({
        value: appointment._id,
        label: `${appointment.appointmentType?.text || appointment.appointmentType?.coding?.[0]?.display || 'Appointment'} - ${formatDateByUserTimeZone(appointment.start)} - ${appointment.status}`,
        appointment: appointment
    }));

    useEffect(() => {
        if (show && patientId) {
            dispatch(getAppointmentsAction({
                patientId: patientId,
                status: '',
                limit: 50,
                skip: 1,
            }));
        }
    }, [show, patientId, dispatch]);

    const handleConfirm = () => {
        if (selectedAppointment) {
            const appointmentData = availableAppointments.find(apt => apt._id === selectedAppointment.value);
            const providerInfo = appointmentData.participant?.find(p => p.actor?.reference?.includes('Practitioner'))?.actor ||
                appointmentData.doctorId;
            const consentForms = appointmentData.consentForms || appointmentData.supportingInformation || [];
            const enhancedAppointmentData = {
                ...appointmentData,
                providerInfo: providerInfo,
                consentForms: consentForms
            };
            onAppointmentSelect(enhancedAppointmentData);
            onHide();
            setSelectedAppointment(null);
        }
    };

    const handleCancel = () => {
        setSelectedAppointment(null);
        onHide();
    };

    return (
        <Modal show={show} onHide={handleCancel} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Select Appointment for Encounter</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert variant="info" className="mb-3">
                    <strong>Select an appointment to start the encounter.</strong>
                    <br />
                    The provider, appointment details, and consent forms will be automatically populated based on your selection.
                </Alert>
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Related Appointment</Form.Label>
                    <Select
                        options={appointmentOptions}
                        isSearchable
                        isClearable
                        isLoading={loading}
                        className="basic-single"
                        classNamePrefix="select"
                        placeholder="Search and select an appointment..."
                        value={selectedAppointment}
                        onChange={setSelectedAppointment}
                        onInputChange={(value, { action }) => {
                            if (action === 'input-change') {
                                setSearchTerm(value);
                                if (value.length > 2) {
                                    dispatch(getAppointmentsAction({
                                        patientId: patientId,
                                        status: '',
                                        search: value,
                                        limit: 50,
                                        skip: 1,
                                    }));
                                }
                            }
                        }}
                        filterOption={null}
                        noOptionsMessage={() =>
                            availableAppointments.length === 0
                                ? "No available appointments found for this patient"
                                : "No appointments match your search"
                        }
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                minHeight: '40px',
                                border: '2px solid #dee2e6',
                            }),
                            placeholder: (provided) => ({
                                ...provided,
                                fontSize: '14px',
                            }),
                        }}
                    />
                </Form.Group>

                {selectedAppointment && (
                    <Alert variant="success" className="mt-3">
                        <strong>Selected Appointment Details:</strong>
                        <br />
                        <strong>Type:</strong> {selectedAppointment.appointment.appointmentType?.text || selectedAppointment.appointment.appointmentType?.coding?.[0]?.display || 'N/A'}
                        <br />
                        <strong>Date & Time:</strong> {formatDateByUserTimeZone(selectedAppointment.appointment.start)} - {formatDateByUserTimeZone(selectedAppointment.appointment.end)}
                        <br />
                        <strong>Provider:</strong> {selectedAppointment.appointment.participant?.find(p => p.actor?.reference?.includes('Practitioner'))?.actor?.display || selectedAppointment.appointment.doctorId?.name?.[0]?.text || 'N/A'}
                        <br />
                        <strong>Status:</strong> <span className="text-capitalize">{selectedAppointment.appointment.status}</span>
                        {selectedAppointment.appointment.reason?.[0]?.coding?.[0]?.display && (
                            <>
                                <br />
                                <strong>Reason:</strong> {selectedAppointment.appointment.reason[0].coding[0].display}
                            </>
                        )}
                        {selectedAppointment.appointment.serviceCategory?.[0]?.coding?.[0]?.display && (
                            <>
                                <br />
                                <strong>Service Category:</strong> {selectedAppointment.appointment.serviceCategory[0].coding[0].display}
                            </>
                        )}
                    </Alert>
                )}

                {loading && (
                    <div className="text-center py-3">
                        <Spinner />
                        <p className="mt-2 text-muted">Loading appointments...</p>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button className='custom-buttons' onClick={handleCancel}>
                    Cancel
                </Button>
                <Button
                    className='custom-buttons'
                    onClick={handleConfirm}
                    disabled={!selectedAppointment || loading}
                >
                    Start Encounter
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AppointmentSelectionModal;