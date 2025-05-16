import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form } from 'react-bootstrap';

const NOTE_TYPE_OPTIONS = {
  'Encounter-Based': [
    'Progress Notes',
    'History & Physical (H&P) / Admission Notes',
    'Consultation Notes',
    'Discharge Summary',
    'Operative Notes',
    'Procedure Notes',
    'Emergency Department (ED) Notes',
    'Follow-Up Visit Notes',
    'Pre-operative Assessment',
    'Post-operative Notes',
    'Anesthesia Notes'
  ],
  'Nursing & Allied Health': [
    'Nursing Notes',
    'Vital Signs Records',
    'Intake & Output (I&O)',
    'Wound Care Notes',
    'Nutrition/Dietitian Notes',
    'Rehabilitation/Physical Therapy Notes',
    'Occupational Therapy Notes',
    'Speech Therapy Notes',
    'Respiratory Therapy Notes',
    'Case Management Notes',
    'Social Work Notes'
  ],
  'Psychiatric & Behavioral Health': [
    'Psychiatric Evaluation',
    'Mental Status Exam (MSE)',
    'Psychotherapy Notes',
    'Substance Abuse Treatment Notes',
    'Behavioral Observation Notes',
    'Suicide Risk Assessment'
  ],
  'Administrative & Communication': [
    'Referral Notes',
    'Triage Notes',
    'Telephone Call Notes',
    'Care Coordination Notes',
    'Patient Instructions',
    'Consent Forms',
    'Education Notes (Patient/Family Teaching)',
    'Clerical Notes / Scheduling Comments',
    'Insurance/Authorization Notes'
  ],
  'Diagnostic & Monitoring': [
    'Radiology Reports',
    'Pathology Reports',
    'Lab Result Annotations',
    'EKG/ECG Interpretations',
    'Imaging Interpretation Notes',
    'Telemetry Monitoring Notes',
    'Sleep Study Notes'
  ],
  'Specialty-Specific': [
    'Prenatal Visit Notes',
    'Labor & Delivery Notes',
    'Postpartum Notes',
    'Growth & Development Notes',
    'Immunization Records',
    'Tumor Board Notes',
    'Chemotherapy Progress Notes',
    'Ventilation Settings Notes',
    'Sedation Scale Notes',
    'ICU Progress Notes',
    'Pain Management Notes',
    'Dermatology Procedure Notes'
  ],
  'System & Meta': [
    'Amendment Notes',
    'Addenda',
    'Auto-Generated Summary Notes',
    'Audit Trail / Access Logs'
  ]
};

const NoteTypeForm = () => {
  const { control, watch, setValue } = useForm({
    defaultValues: {
      noteType: '',
      title: '',
      customTitle: ''
    }
  });

  const noteType = watch('noteType');
  const title = watch('title');

  const showCustomTitle = title === 'Other';
  const titleOptions = NOTE_TYPE_OPTIONS[noteType] || [];

  return (
    <Form className="p-4">
      <Form.Group className="mb-3">
        <Form.Label>Note Type</Form.Label>
        <Controller
          name="noteType"
          control={control}
          render={({ field }) => (
            <Form.Select
              {...field}
              onChange={(e) => {
                const val = e.target.value;
                field.onChange(val);
                setValue('title', '');
                setValue('customTitle', '');
              }}
            >
              <option value="">Select Note Type</option>
              {Object.keys(NOTE_TYPE_OPTIONS).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
              <option value="Other">Other</option>
            </Form.Select>
          )}
        />
      </Form.Group>

      {noteType && (
        <Form.Group className="mb-3">
          <Form.Label>Note Title</Form.Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Form.Select {...field}>
                <option value="">Select Title</option>
                {titleOptions.map((title) => (
                  <option key={title} value={title}>{title}</option>
                ))}
                <option value="Other">Other</option>
              </Form.Select>
            )}
          />
        </Form.Group>
      )}

      {showCustomTitle && (
        <Form.Group className="mb-3">
          <Form.Label>Custom Title</Form.Label>
          <Controller
            name="customTitle"
            control={control}
            render={({ field }) => (
              <Form.Control {...field} placeholder="Enter custom title" />
            )}
          />
        </Form.Group>
      )}
    </Form>
  );
};

export default NoteTypeForm;
