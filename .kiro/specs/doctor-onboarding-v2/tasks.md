# Implementation Plan

- [x] 1. Set up v2 project structure and core infrastructure



  - Create v2 directory structure under src/pages/apps/Doctors/v2/
  - Set up folder structure for components, hooks, and main tab files
  - Create index.js file for easy imports and exports
  - _Requirements: 2.1, 2.4_

- [-] 2. Implement ActionButtons reusable component



  - [x] 2.1 Create ActionButtons component with TypeScript interfaces


    - Define props interface for mode, currentTab, validation state, and callback functions
    - Implement button rendering logic based on current tab and mode
    - Add proper button styling classes and loading states
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 2.2 Implement button state management and validation



    - Add disabled state logic based on form validation
    - Implement loading state management for all button types
    - Add proper button text rendering based on mode and tab
    - _Requirements: 3.5, 3.6, 4.1, 4.2_

  - [x] 2.3 Write unit tests for ActionButtons component








    - Test button rendering for different modes and tabs
    - Test disabled states and loading states
    - Test callback function execution
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
-

- [x] 3. Create custom hooks for form submission and button actions




  - [x] 3.1 Implement useFormSubmission hook


    - Create hook to handle form submission with different button actions
    - Implement tab navigation logic based on button action type
    - Add error handling and loading state management
    - _Requirements: 1.1, 1.2, 1.3, 4.3, 4.4, 4.5_


  - [x] 3.2 Implement useButtonActions hook





    - Create hook to manage button action state
    - Implement action type validation and state transitions
    - Add helper functions for determining button behavior
    - _Requirements: 1.1, 1.2, 1.3, 5.1, 5.2_

  - [ ]* 3.3 Write unit tests for custom hooks
    - Test useFormSubmission hook with different action types
    - Test useButtonActions hook state management
    - Test error handling scenarios
    - _Requirements: 1.1, 1.2, 1.3, 4.3, 4.4, 4.5_

- [x] 4. Create enhanced NewDoctorV2 main component





  - [x] 4.1 Set up NewDoctorV2 component structure


    - Copy existing NewDoctor.js as base and enhance with v2 functionality
    - Integrate ActionButtons component into the personal details tab
    - Implement button action state management using custom hooks
    - _Requirements: 2.3, 6.1, 6.2_

  - [x] 4.2 Implement enhanced form submission logic


    - Integrate useFormSubmission hook for handling different button actions
    - Modify existing submitData function to work with button actions
    - Implement save-without-navigation functionality for personal details tab
    - _Requirements: 1.1, 1.2, 4.1, 4.2, 4.3_

  - [x] 4.3 Add proper state management and navigation control


    - Implement logic to prevent tab switching on save-only actions
    - Add proper loading states and error handling for all button types
    - Ensure form validation works consistently across all button actions
    - _Requirements: 1.4, 1.5, 4.4, 4.5, 6.3, 6.4_

- [-] 5. Create enhanced DepartmentDetailsV2 component



  - [x] 5.1 Set up DepartmentDetailsV2 component structure


    - Copy existing DepartmentDetails.js as base for v2 enhancement
    - Integrate ActionButtons component for professional information tab
    - Implement button action handling for department details
    - _Requirements: 2.3, 6.1, 6.2_

  - [x] 5.2 Implement save and update functionality





    - Add save-without-navigation functionality for department details
    - Implement proper form submission with button action tracking
    - Add loading states and error handling for department operations
    - _Requirements: 1.1, 1.2, 4.1, 4.2, 6.3, 6.4_

- [x] 6. Create enhanced QualificationsV2 component with exit functionality





  - [x] 6.1 Set up QualificationsV2 component structure


    - Copy existing Qualifications.js as base for v2 enhancement
    - Integrate ActionButtons component for qualifications tab
    - Implement exit functionality for final tab completion
    - _Requirements: 2.3, 5.1, 5.2, 6.1, 6.2_

  - [x] 6.2 Implement save/update and exit functionality


    - Add save-without-navigation functionality for qualifications
    - Implement "Save & Exit" and "Update & Exit" button actions
    - Add navigation to doctor list upon exit actions
    - _Requirements: 1.1, 1.2, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 6.3 Add proper completion and navigation logic


    - Implement proper form validation before exit actions
    - Add loading states and error handling for exit operations
    - Ensure all data is saved before navigating away
    - _Requirements: 5.3, 5.4, 5.5, 6.3, 6.4, 6.5_

- [x] 7. Implement routing and accessibility for v2 version





  - [x] 7.1 Create v2 routing configuration


    - Add new route for v2 doctor onboarding (/apps/providers/new-v2)
    - Implement route parameters handling for edit mode
    - Add proper navigation guards and error boundaries
    - _Requirements: 2.2, 2.4_

  - [x] 7.2 Add feature toggle and testing mechanism


    - Implement environment variable or feature flag for v2 access
    - Create admin panel toggle for gradual rollout
    - Add easy rollback mechanism to original implementation
    - _Requirements: 2.2, 2.4_

- [x] 8. Integration testing and validation







  - [x] 8.1 Test complete form submission flows



    - Test all button actions across all tabs in create mode
    - Test all button actions across all tabs in edit mode
    - Validate data persistence and API integration
    - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 8.2 Test navigation and state management

    - Test tab switching behavior with different button types
    - Test form state preservation during save-only actions
    - Test error handling and recovery scenarios
    - _Requirements: 1.4, 1.5, 4.4, 4.5, 6.3, 6.4, 6.5_

  - [ ]* 8.3 Write integration tests
    - Create integration tests for complete onboarding flows
    - Test API integration with existing backend services
    - Test error scenarios and edge cases
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_