import * as yup from 'yup';

export const consentSchema = yup.object({
  // Immunization Registry
  immunizationRegistryStatus: yup.string().required('Status is required'),
  immunizationEffectiveDate: yup.date().nullable(),
  immunizationNotificationPreference: yup.string(),
  stopImmunizationUploads: yup.string().required('Please select an option'),

  // Prescription History
  prescriptionHistoryConsent: yup.string().required('Please select consent option'),

  // Appointment Reminders
  emailReminders: yup.boolean().default(false),
  textSmsReminders: yup.string().oneOf(['off', 'on'], 'Invalid option').default('off'),
  voiceReminders: yup.string().oneOf(['off', 'on'], 'Invalid option').default('off')
});

export const consentDefaultValues = {
  immunizationRegistryStatus: '',
  immunizationEffectiveDate: null,
  immunizationNotificationPreference: '',
  stopImmunizationUploads: '',
  prescriptionHistoryConsent: '',
  emailReminders: false,
  textSmsReminders: 'off',
  voiceReminders: 'off'
};