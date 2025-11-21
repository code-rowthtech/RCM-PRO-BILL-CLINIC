# Design Document

## Overview

The enhanced doctor onboarding flow builds upon the existing multi-tab form interface to provide users with granular control over form submission and navigation. The design introduces separate save/update actions alongside the existing save-and-navigate functionality, implemented in a v2 folder structure for safe testing and deployment.

## Architecture

### Component Structure

```
src/pages/apps/Doctors/v2/
├── NewDoctorV2.js                 # Main enhanced onboarding component
├── DepartmentDetailsV2.js         # Enhanced professional information tab
├── QualificationsV2.js           # Enhanced qualifications tab with exit functionality
├── components/
│   ├── ActionButtons.js          # Reusable button component for all tabs
│   └── TabNavigation.js          # Enhanced tab navigation component
└── hooks/
    ├── useFormSubmission.js      # Custom hook for form submission logic
    └── useButtonActions.js       # Custom hook for button action management
```

### State Management

The enhanced flow introduces a centralized button action management system:

```javascript
const [buttonAction, setButtonAction] = useState('saveAndNext');
// Possible values: 'save', 'saveAndNext', 'update', 'updateAndNext', 'saveAndExit', 'updateAndExit'
```

## Components and Interfaces

### ActionButtons Component

A reusable component that renders appropriate buttons based on:
- Current tab (personalDetails, departmentDetails, qualifications)
- Mode (create/edit)
- Form validation state
- Loading states

**Props Interface:**
```typescript
interface ActionButtonsProps {
  mode: 'create' | 'edit';
  currentTab: 'personalDetails' | 'departmentDetails' | 'qualifications';
  isFormValid: boolean;
  isLoading: boolean;
  onSave: (data: FormData) => void;
  onSaveAndNext: (data: FormData) => void;
  onSaveAndExit?: (data: FormData) => void;
  onUpdate: (data: FormData) => void;
  onUpdateAndNext: (data: FormData) => void;
  onUpdateAndExit?: (data: FormData) => void;
}
```

### useFormSubmission Hook

Centralizes form submission logic and button action handling:

```typescript
interface UseFormSubmissionReturn {
  submitData: (data: FormData, action: ButtonAction) => void;
  isLoading: boolean;
  handleTabNavigation: (action: ButtonAction, currentTab: string) => void;
}
```

### Enhanced Tab Components

#### NewDoctorV2.js
- Extends existing NewDoctor.js functionality
- Integrates ActionButtons component
- Implements button action state management
- Maintains backward compatibility with existing data flow

#### DepartmentDetailsV2.js
- Mirrors existing DepartmentDetails.js structure
- Adds ActionButtons integration
- Implements save-without-navigation functionality

#### QualificationsV2.js
- Extends existing Qualifications.js
- Implements "Save & Exit" and "Update & Exit" functionality
- Handles navigation to doctor list upon completion

## Data Models

### Button Action Types
```typescript
type ButtonAction = 
  | 'save'           // Save without navigation
  | 'saveAndNext'    // Save and advance to next tab
  | 'saveAndExit'    // Save and return to doctor list
  | 'update'         // Update without navigation
  | 'updateAndNext'  // Update and advance to next tab
  | 'updateAndExit'; // Update and return to doctor list
```

### Form Submission Payload
The existing payload structure remains unchanged to maintain API compatibility:

```typescript
interface DoctorPayload {
  doctorId?: string;
  clinicId: string;
  email: string;
  password?: string;
  dob: string;
  gender: string;
  name: {
    use: string;
    text: string;
    family: string;
    given: string;
  };
  photo: Array<PhotoData>;
  telecom: Array<TelecomData>;
  address: Array<AddressData>;
  specialties: string[];
  department: string;
}
```

## Error Handling

### Form Validation
- Maintains existing validation rules across all tabs
- Prevents submission when validation fails
- Provides consistent error messaging

### API Error Handling
- Implements retry logic for failed submissions
- Maintains form state during error conditions
- Provides user feedback for all error scenarios

### Navigation Error Handling
- Prevents tab switching on save-only actions during errors
- Maintains current tab state when operations fail
- Provides clear error messaging without losing user data

## Testing Strategy

### Unit Testing
- Test ActionButtons component with different prop combinations
- Test useFormSubmission hook with various button actions
- Test form validation logic across all tabs
- Test error handling scenarios

### Integration Testing
- Test complete form submission flows for all button actions
- Test tab navigation behavior with different button types
- Test data persistence across tab switches
- Test API integration with existing backend services

### User Acceptance Testing
- Test user workflows with save-only actions
- Test complete onboarding flow with mixed button usage
- Test error recovery scenarios
- Test performance with large form data

## Implementation Approach

### Phase 1: Core Infrastructure
1. Create v2 folder structure
2. Implement ActionButtons component
3. Create useFormSubmission hook
4. Set up button action state management

### Phase 2: Tab Enhancement
1. Create NewDoctorV2.js with enhanced button functionality
2. Implement DepartmentDetailsV2.js
3. Create QualificationsV2.js with exit functionality
4. Integrate ActionButtons across all tabs

### Phase 3: Testing and Refinement
1. Implement comprehensive test suite
2. Conduct user acceptance testing
3. Performance optimization
4. Documentation and deployment preparation

### Deployment Strategy
The v2 implementation will be accessible through:
1. Feature flag or environment variable
2. Separate route for testing (`/apps/providers/new-v2`)
3. Admin panel toggle for gradual rollout
4. Easy rollback mechanism to original implementation

## Button Layout Design

### Personal Details & Professional Information Tabs
```
[Back] [Email to Provider]     [Save] [Save & Next]
                          or   [Update] [Update & Next]
```

### Qualifications Tab
```
[Back] [Previous]              [Save] [Save & Exit]
                          or   [Update] [Update & Exit]
```

## Styling Considerations

- **Save/Update buttons**: Outlined style to indicate non-navigational action
- **Save & Next/Update & Next buttons**: Primary style to indicate progression
- **Save & Exit/Update & Exit buttons**: Success style to indicate completion
- Consistent spacing and alignment across all tabs
- Loading states with spinners for all button types
- Disabled states with appropriate visual feedback