# Lab Request Module Documentation

## Overview
Complete FHIR R4 compliant Lab Request (Lab Order) UI Module for EHR system following HIPAA, US Core ServiceRequest profile, and SMART-on-FHIR standards.

## Architecture

### Component Tree
```
LabRequest (Main Container)
├── LabRequestDashboard (List View)
│   ├── Search & Filters
│   ├── Lab Requests Table
│   └── Pagination
├── LabRequestForm (Create/Edit)
│   ├── Patient Info (Read-only)
│   ├── Order Details
│   ├── Specimen Instructions
│   └── Action Buttons
└── LabRequestDetails (View)
    ├── Order Metadata
    ├── Test Details
    ├── Clinical Information
    ├── Specimen Requirements
    ├── Status Timeline
    └── Action Buttons
```

## FHIR R4 Mapping

### ServiceRequest Resource Structure
```json
{
  "resourceType": "ServiceRequest",
  "id": "lab-order-123",
  "status": "active",
  "intent": "order",
  "category": [{
    "coding": [{
      "system": "http://snomed.info/sct",
      "code": "108252007",
      "display": "Laboratory procedure"
    }]
  }],
  "code": {
    "coding": [{
      "system": "http://loinc.org",
      "code": "33747-0",
      "display": "Complete Blood Count"
    }]
  },
  "subject": {
    "reference": "Patient/123",
    "display": "Doe, John"
  },
  "encounter": {
    "reference": "Encounter/456"
  },
  "occurrenceDateTime": "2024-01-15T10:00:00Z",
  "authoredOn": "2024-01-15T09:30:00Z",
  "requester": {
    "reference": "Practitioner/789",
    "display": "Dr. Smith"
  },
  "priority": "routine",
  "reasonCode": [{
    "coding": [{
      "system": "http://hl7.org/fhir/sid/icd-10-cm",
      "code": "Z00.00",
      "display": "Encounter for general adult medical examination"
    }],
    "text": "Annual physical"
  }],
  "specimen": [{
    "reference": "Specimen/spec-123",
    "type": {
      "coding": [{
        "system": "http://snomed.info/sct",
        "code": "119297000",
        "display": "Blood specimen"
      }]
    }
  }],
  "supportingInfo": [{
    "valueBoolean": true,
    "text": "Fasting required"
  }],
  "note": [{
    "text": "Patient has history of anemia"
  }]
}
```

## SMART-on-FHIR Integration

### Required Scopes
```
user/ServiceRequest.read
user/ServiceRequest.write
user/Patient.read
user/Practitioner.read
user/Specimen.read
```

### OAuth2 Flow
1. App launches from EHR
2. Receives authorization code
3. Exchanges for access token
4. Stores token in sessionStorage (HIPAA compliant - no localStorage)
5. Includes Bearer token in all FHIR API calls

### Session Management
- 15-minute inactivity timeout warning
- 30-minute absolute session timeout
- Auto-logout on token expiration
- No PHI in browser storage

## HIPAA Compliance

### Security Features
1. **Authentication & Authorization**
   - OAuth2 Bearer token authentication
   - Role-based access control (RBAC)
   - Only authorized providers can create orders

2. **Audit Logging**
   - All create/update/delete operations logged
   - AuditEvent resources created per FHIR spec
   - Includes: user, timestamp, action, resource, patient

3. **Data Protection**
   - No PHI in localStorage
   - Session timeout warnings
   - Encrypted data transmission (HTTPS)
   - Minimum necessary principle

4. **Access Controls**
   - View: All clinical staff
   - Create/Edit: Ordering providers only
   - Cancel: Ordering provider or supervisor

## UI Workflows

### 1. Dashboard View
**Purpose**: List all lab orders for selected patient

**Features**:
- Searchable table (test name, provider)
- Filters: status, priority, date range
- Sorting: newest, oldest, test name, status
- Actions: View, Edit, Cancel
- Status badges: Draft (gray), Active (blue), Completed (green), Cancelled (red)
- Priority badges: Routine (gray), Urgent (yellow), STAT (red)

### 2. Create New Order
**Steps**:
1. Click "New Lab Order"
2. Select test/panel from LOINC dropdown
3. Set priority (routine/urgent/STAT)
4. Enter reason (ICD-10 optional)
5. Add clinical notes
6. Specify specimen type
7. Set fasting requirement
8. Set collection date/time (optional)
9. Save as Draft OR Submit Order

**Validation**:
- Test selection: Required
- Priority: Required
- Specimen type: Required
- All other fields: Optional

### 3. Edit Order
**Rules**:
- Only Draft and Active orders can be edited
- Completed/Cancelled orders are read-only
- Audit trail maintained

### 4. View Details
**Displays**:
- Order metadata
- Requested tests with LOINC codes
- Clinical information
- Specimen requirements
- Status timeline
- Action buttons (Edit, Cancel, Print)

### 5. Cancel Order
**Rules**:
- Only Draft and Active orders can be cancelled
- Confirmation dialog required
- Status changed to "revoked"
- Audit event created

## Status Workflow

```
Draft → Active → Completed → Resulted
  ↓       ↓
Cancelled Cancelled
```

**Status Definitions**:
- **draft**: Order created but not submitted
- **active**: Order submitted to lab
- **on-hold**: Temporarily suspended
- **completed**: Specimen collected, awaiting results
- **revoked**: Order cancelled
- **entered-in-error**: Created by mistake

## Common Lab Tests (LOINC Codes)

| Test Name | LOINC Code | Specimen | Fasting |
|-----------|------------|----------|---------|
| Complete Blood Count (CBC) | 33747-0 | Blood | No |
| Comprehensive Metabolic Panel (CMP) | 24323-8 | Blood | Yes |
| Basic Metabolic Panel (BMP) | 24362-6 | Blood | Yes |
| Lipid Panel | 57698-3 | Blood | Yes |
| Thyroid Function Panel | 33743-4 | Blood | No |
| Hemoglobin A1C | 4548-4 | Blood | No |
| Urinalysis | 24356-8 | Urine | No |
| Prothrombin Time (PT) | 5902-2 | Blood | No |

## API Integration

### Create Order
```javascript
import { createServiceRequest } from '../../../../../utils/fhirUtils';

const serviceRequest = {
  resourceType: 'ServiceRequest',
  status: 'active',
  intent: 'order',
  code: { coding: [{ system: 'http://loinc.org', code: '33747-0' }] },
  subject: { reference: 'Patient/123' },
  priority: 'routine'
};

const result = await createServiceRequest(serviceRequest);
```

### Fetch Orders
```javascript
import { getServiceRequests } from '../../../../../utils/fhirUtils';

const orders = await getServiceRequests('patient-123', {
  status: 'active',
  _sort: '-authored'
});
```

### Cancel Order
```javascript
import { cancelServiceRequest } from '../../../../../utils/fhirUtils';

await cancelServiceRequest('order-123');
```

## Form Validation

### Required Fields
- Test/Panel selection
- Priority
- Specimen type

### Optional Fields
- ICD-10 code
- Reason text
- Clinical notes
- Fasting requirement
- Collection date/time

### Validation Rules
- Test code must be valid LOINC
- ICD-10 code must match format (e.g., Z00.00)
- Collection date cannot be in past (if specified)
- Priority must be: routine, urgent, asap, or stat

## Error Handling

### Network Errors
- Display user-friendly error messages
- Retry mechanism for transient failures
- Fallback to cached data when available

### Validation Errors
- Inline field validation
- Summary error alert at top of form
- Prevent submission until resolved

### Authorization Errors
- Redirect to login if token expired
- Display "Access Denied" for insufficient permissions

## Accessibility

### WCAG 2.1 AA Compliance
- Keyboard navigation support
- ARIA labels on all interactive elements
- Color contrast ratios meet standards
- Screen reader compatible
- Focus indicators visible

### Keyboard Shortcuts
- Tab: Navigate fields
- Enter: Submit form
- Esc: Cancel/Close
- Arrow keys: Navigate dropdowns

## Testing

### Unit Tests
- Form validation logic
- FHIR resource mapping
- Status badge rendering
- Filter/sort functions

### Integration Tests
- API calls with mock server
- Form submission flow
- Edit/cancel workflows
- Session timeout handling

### E2E Tests
- Complete order creation flow
- Dashboard filtering/sorting
- View details workflow
- Cancel order flow

## Performance

### Optimization Strategies
- Lazy load LOINC/ICD-10 dropdowns
- Debounce search inputs (300ms)
- Paginate large result sets
- Cache frequently used data
- Memoize expensive computations

### Metrics
- Initial load: < 2s
- Form submission: < 1s
- Search response: < 500ms
- Page navigation: < 200ms

## Deployment

### Environment Variables
```env
REACT_APP_FHIR_BASE_URL=https://fhir-server.example.com/fhir
REACT_APP_CLIENT_ID=your-smart-client-id
REACT_APP_REDIRECT_URI=https://your-app.com/callback
REACT_APP_SESSION_TIMEOUT=1800000
```

### Build Configuration
```bash
npm run build
# Outputs to build/ directory
# Deploy to HIPAA-compliant hosting
```

## Troubleshooting

### Common Issues

**Issue**: Orders not loading
- Check FHIR server connectivity
- Verify access token validity
- Check patient ID parameter

**Issue**: Form submission fails
- Validate required fields
- Check FHIR resource structure
- Verify user permissions

**Issue**: Session timeout
- Increase timeout in config
- Implement token refresh
- Check for network issues

## Future Enhancements

1. **Batch Ordering**: Order multiple tests at once
2. **Order Sets**: Pre-configured test panels
3. **Result Notifications**: Alert when results available
4. **Electronic Signature**: Digital signature for orders
5. **Mobile Optimization**: Responsive design for tablets
6. **Voice Input**: Dictation for clinical notes
7. **Smart Suggestions**: AI-powered test recommendations
8. **Integration**: Link to Lab Results module

## Support

For technical support or questions:
- Email: support@example.com
- Documentation: https://docs.example.com/lab-requests
- FHIR Spec: https://www.hl7.org/fhir/servicerequest.html
