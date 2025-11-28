import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getConsentFormAction } from '../../../../../../redux/settings/action';

export const useAppointmentIntegration = () => {
    const dispatch = useDispatch();
    const [selectedAppointmentData, setSelectedAppointmentData] = useState(null);
    const [appointmentBasedProvider, setAppointmentBasedProvider] = useState(null);
    const [appointmentBasedConsentForms, setAppointmentBasedConsentForms] = useState([]);

    // Extract provider information from appointment
    const extractProviderFromAppointment = (appointment) => {
        if (!appointment?.participant) return null;

        const providerParticipant = appointment.participant.find(
            p => p.actor?.reference?.includes('Practitioner') || p.type?.coding?.[0]?.code === 'ATND'
        );

        if (providerParticipant?.actor) {
            // Extract provider ID from reference (e.g., "Practitioner/123" -> "123")
            const providerId = providerParticipant.actor.reference?.split('/')[1];
            return {
                id: providerId,
                name: providerParticipant.actor.display,
                reference: providerParticipant.actor.reference
            };
        }

        return null;
    };

    // Extract consent forms from appointment
    const extractConsentFormsFromAppointment = (appointment) => {
        const consentForms = [];
        
        // Check multiple possible locations for consent forms
        if (appointment?.consentDocument) {
            consentForms.push(...appointment.consentDocument.map(consent => ({
                id: consent._id || consent.id,
                title: consent.title || consent.name,
                url: consent.url || consent.documentUrl,
                status: consent.status || 'active',
                type: consent.type || 'consent'
            })));
        }
        
        // Check if consent forms are in supportingInformation
        if (appointment?.supportingInformation) {
            appointment.supportingInformation.forEach(info => {
                if (info.type === 'consent' || info.category === 'consent') {
                    consentForms.push({
                        id: info.reference?.split('/')[1] || info.id,
                        title: info.display || info.title || 'Consent Form',
                        url: info.url,
                        status: 'active',
                        type: 'consent'
                    });
                }
            });
        }
        
        return consentForms;
    };

    // Process selected appointment data
    const processAppointmentSelection = (appointment) => {
        if (!appointment) {
            setSelectedAppointmentData(null);
            setAppointmentBasedProvider(null);
            setAppointmentBasedConsentForms([]);
            return;
        }

        setSelectedAppointmentData(appointment);

        // Extract and set provider
        const provider = extractProviderFromAppointment(appointment);
        setAppointmentBasedProvider(provider);

        // Extract and set consent forms
        const consentForms = extractConsentFormsFromAppointment(appointment);
        setAppointmentBasedConsentForms(consentForms);

        // Load consent forms if clinic ID is available
        const clinicId = appointment.serviceProvider?.reference?.split('/')[1];
        if (clinicId) {
            dispatch(getConsentFormAction({ clinicId }));
        }
    };

    // Get appointment-based encounter defaults
    const getAppointmentBasedDefaults = () => {
        if (!selectedAppointmentData) return {};

        const defaults = {};

        // Set appointment-related fields
        if (selectedAppointmentData._id) {
            defaults.appointmentId = selectedAppointmentData._id;
        }

        // Set provider if available
        if (appointmentBasedProvider?.id) {
            defaults.providerId = appointmentBasedProvider.id;
        }

        // Set encounter type based on appointment type
        if (selectedAppointmentData.appointmentType?.coding?.[0]?.code) {
            defaults.encounterType = selectedAppointmentData.appointmentType.coding[0].code;
        } else if (selectedAppointmentData.appointmentType?.text) {
            defaults.encounterTypeText = selectedAppointmentData.appointmentType.text;
        }

        // Set start date based on appointment date
        if (selectedAppointmentData.start) {
            defaults.startDate = new Date(selectedAppointmentData.start).toISOString().split('T')[0];
        }
        
        // Set appointment reason if available
        if (selectedAppointmentData.reason?.[0]?.coding?.[0]?.display) {
            defaults.appointmentReason = selectedAppointmentData.reason[0].coding[0].display;
        }
        
        // Set service category if available
        if (selectedAppointmentData.serviceCategory?.[0]?.coding?.[0]?.display) {
            defaults.serviceCategory = selectedAppointmentData.serviceCategory[0].coding[0].display;
        }

        // Set status based on appointment status
        const statusMapping = {
            'booked': 'planned',
            'confirmed': 'planned', 
            'arrived': 'arrived',
            'fulfilled': 'finished',
            'cancelled': 'cancelled'
        };
        
        if (selectedAppointmentData.status) {
            defaults.status = statusMapping[selectedAppointmentData.status.toLowerCase()] || 'planned';
        }

        return defaults;
    };

    // Reset appointment integration
    const resetAppointmentIntegration = () => {
        setSelectedAppointmentData(null);
        setAppointmentBasedProvider(null);
        setAppointmentBasedConsentForms([]);
    };

    return {
        selectedAppointmentData,
        appointmentBasedProvider,
        appointmentBasedConsentForms,
        processAppointmentSelection,
        getAppointmentBasedDefaults,
        resetAppointmentIntegration,
        extractProviderFromAppointment,
        extractConsentFormsFromAppointment
    };
};