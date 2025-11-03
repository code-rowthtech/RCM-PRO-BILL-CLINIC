import React from 'react';
import { Container } from 'react-bootstrap';
import ConsentSection from './ConsentSection';

const ConsentSectionExample = () => {
    // Example submission handler
    const handleConsentSubmit = async (data) => {
        try {
            const response = await fetch('/api/patients/consent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to save consent information');
            }

            const result = await response.json();
            // You can add success handling here (e.g., redirect, show notification)

        } catch (error) {
            console.error('Error saving consent:', error);
            throw error; // Re-throw to let the component handle the error display
        }
    };

    // Example initial data (if editing existing consent)
    const initialConsentData = {
        immunizationRegistryStatus: 'active',
        immunizationEffectiveDate: '2024-01-01',
        immunizationNotificationPreference: 'email',
        stopImmunizationUploads: 'no',
        prescriptionHistoryConsent: 'yes',
        emailReminders: true,
        textSmsReminders: 'on',
        voiceReminders: 'off'
    };

    return (
        <Container className="py-4">
            <h2 className="mb-4">Patient Consent Management</h2>

            {/* For new consent (no initial data) */}
            <ConsentSection
                onSubmit={handleConsentSubmit}
            />

            {/* For editing existing consent (with initial data) */}
            {/* 
            <ConsentSection 
                onSubmit={handleConsentSubmit}
                initialData={initialConsentData}
            />
            */}
        </Container>
    );
};

export default ConsentSectionExample;