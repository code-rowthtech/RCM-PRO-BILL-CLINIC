const BaseRoute = '/api/v1/clinic';
export const addPermissions = `${BaseRoute}/permissions`
export const getPermissions = `${BaseRoute}/getPermissions`;
export const deletePermissions = `${BaseRoute}/permisssions/delete`;
export const updatePermissions = `${BaseRoute}/permisssions`;
export const deleteClinicOnboarding = "";
export const getClinicsByParentId = '';

// ROLES 
export const createRoles = `${BaseRoute}/createSubUser`;
export const viewPassword = `${BaseRoute}/viewPassword`;
export const updateRoles = `${BaseRoute}/updateSubUser`;
export const getRoles = `${BaseRoute}/listAllUsers`;
export const getUserId = `${BaseRoute}/getUserDetails`;
export const deleterRoles = `${BaseRoute}/removeUser`;

// CLINIC
export const createClinic = `${BaseRoute}/edit-clinic-details`;
export const changeEmail = `${BaseRoute}/request-otp-email-verification`;
// export const updateClinic = '/api/v1/clinic/editClinicDetails';
export const getClinic = `${BaseRoute}/details`;
export const getClinicById = `${BaseRoute}/byId`;
export const getStatedByCountry = `${BaseRoute}/states/US`;
export const getCityByState = `${BaseRoute}/cities/`;
export const getClinicType = `${BaseRoute}/getClinicTypes`;

// SUB CLINIC
export const createSubClinic = `${BaseRoute}/createSubClinics`;
export const getSubClinic = `${BaseRoute}/getSubClinics`;
export const getSubClinicCityByState = `${BaseRoute}/cities/`;
export const updateSubClinic = `${BaseRoute}/edit-clinic-details`;
export const createUpgrade = `${BaseRoute}/upgradeSubscription`;
export const getSubClinicType = `${BaseRoute}/getClinicTypes`;
export const getSubscription = `${BaseRoute}/getSubscription/history`;

//CONTRACT
export const createContract = `${BaseRoute}/contract-details`;
export const standardContract = `${BaseRoute}/getStandardContact`;

// SETTING
export const addMastersData = `${BaseRoute}/createOrUpdateMasterData`;
export const getMastersData = `${BaseRoute}/getmasterData`;
export const getDepartmentData = `${BaseRoute}/getmasterData`;
export const updateMastersData = `${BaseRoute}/createOrUpdateMasterData`;
export const addRoleData = `${BaseRoute}/roles/create`;
export const getRoleData = `${BaseRoute}/getAllRoles`;
export const updateRoleData = `${BaseRoute}/roles/edit`;

// DOCTORS
export const getDoctor = `${BaseRoute}/practitioner/list`;
export const createDoctor = `${BaseRoute}/practitioner/create`;
export const getDoctorRoles = `${BaseRoute}/roles`;
export const createDoctorDetail = `${BaseRoute}/practitioner/update`;
export const getDoctorDetails = `${BaseRoute}/practitioner/details`;
export const addReferringDoctor = `${BaseRoute}/Patient/referring-doc`;

// PATIENTS
export const getPatients = `${BaseRoute}/Patients`;
export const getPatientById = `${BaseRoute}/patient/by/id`;
export const createPatients = `${BaseRoute}/Patient/add`;
export const updatePatients = `${BaseRoute}/Patient/update`;
export const createResponsibleParty = `${BaseRoute}/Patient/responsible-party`;
export const updateResponsibleParty = `${BaseRoute}/responsible-party-edit`;
export const getResponsibleParty = `${BaseRoute}/responsible-party-get`;
export const getResponsiblePartyById = `${BaseRoute}/responsible-party-getByPatientId`;
export const createInsurance = `${BaseRoute}/createInsurances`;
export const getInsuranceById = `${BaseRoute}/getInsuranceByPatientId`;
export const updateInsurance = `${BaseRoute}/updateInsurances`;

// DASHBOARD
export const getAnalytics = '/api/v1/admin/';

// SUBSCRIPTIONS
export const getSubscriptions = `${BaseRoute}/subscriptions-list`;
export const getSubSubscriptions = `${BaseRoute}/subscription-history`;
export const addSubscriptionPlan = `${BaseRoute}/add-subscription-plan`;

// SCHEDULE
export const createSchedule = `${BaseRoute}/practitioner/holiday/create`;
export const createTimings = `${BaseRoute}/practitioner/schedule/create`;
export const updateTimings = `${BaseRoute}/practitioner/schedule/update`;
export const getDoctorsList = `${BaseRoute}/getDoctorsList`;
export const deleteSchedule = `${BaseRoute}/practitioner/holiday/delete`
export const getSchedule = `${BaseRoute}/practitioner/holidays`;
export const getPractitionerTimings = `${BaseRoute}/practitioner/schedule`;

// appointments
export const createAppointment = `${BaseRoute}/appointment/create`;
export const rescheduleAppointment = `${BaseRoute}/appointment/update/`;
export const getPractitionerSchedule = `${BaseRoute}/getPractitionerSchedule`;
export const getAppointments = `${BaseRoute}/appointments/`;
export const getAppointmentById = `${BaseRoute}/appointment/`;
export const getPractitionerSlots = `${BaseRoute}/practitioner/slots`;
export const getPatientsByAppointment = `${BaseRoute}/appiontments/today-upcoming-history`;

// ASSIGN NOTES
export const getClinicEmployees = `${BaseRoute}/getClinicEmployees`;
export const createTask = `${BaseRoute}/createTask`;
export const getAllTasks = `${BaseRoute}/getAllTasks`;
export const updateTask = `${BaseRoute}/updateTask`;
export const getTaskDetails = `${BaseRoute}/getTaskDetails`;

// Problem List
export const getProblemList = `${BaseRoute}/getPatientProblems`;
export const createProblemList = `${BaseRoute}/createProblems`;
export const updateProblemList = `${BaseRoute}/updateProblems`;
export const deleteProblemList = `${BaseRoute}/deleteProblems`;
export const allCodes = `${BaseRoute}/codes/search`;
export const getPatientAppointment = `${BaseRoute}/app/get-by-patientId`;
export const getProblemDetails = `${BaseRoute}/getProblemDetails`;


// Allergy List
// export const getAllergylist = `${BaseRoute}/getAllergiesList`;
export const createAllergy = `${BaseRoute}/addAllergy`;
export const updateAllergy = `${BaseRoute}/updateAllergy`;
export const deleteAllergyList = `${BaseRoute}/deleteAllergy`;
export const getAllergiesOfAPatient = `${BaseRoute}/getAllergiesOfAPatient`;
export const getAllergyDetails = `${BaseRoute}/getAllergyDetails`;


// vitals
export const createVitals = `${BaseRoute}/addVitals`;
export const getVitals = `${BaseRoute}/getAllVitals`;
export const getVitalsByPatientId = `${BaseRoute}/vitalsByPatientId`;
export const getVitalsByAppointmentId = `${BaseRoute}/vitalsByAppointmentId`;
export const updateVitals = `${BaseRoute}/updateVitals`;

// Medication
export const getMedicationDrugs = `${BaseRoute}/codes/search-ndc-products`;
export const createMedication = `${BaseRoute}/medication`;
export const updateMedication = `${BaseRoute}/medication`;
export const getMedication = `${BaseRoute}/medication`;
// Suggestions
export const createSuggestions = `${BaseRoute}/suggestions`;

// Tobaccoo
export const createTobaccoo = `${BaseRoute}/tobaccoHistory`;
export const deleteTobaccoo = `${BaseRoute}/tobaccoHistory`;
export const updateTobacco = `${BaseRoute}/tobaccoHistory`;
export const getTobaccoo = `${BaseRoute}/tobaccoHistory`;

// Family/Genetic
export const createFamily = `${BaseRoute}/familyMedicalHistory`;
export const updateFamily = `${BaseRoute}/familyMedicalHistory`;
export const getFamily = `${BaseRoute}/familyMedicalHistory`;
export const deleteFamily = `${BaseRoute}/familyMedicalHistory/`;

// Surgical 
export const createSurgicalHistory = `${BaseRoute}/surgicalHistory`;
export const updateSurgicalHistory = `${BaseRoute}/surgicalHistory`;
export const getSurgicalHistory = `${BaseRoute}/surgicalHistory`;
export const deleteSurgicalHistory = `${BaseRoute}/surgicalHistory`;
// ALCOHOL HISTORY
export const alcoholHistory = `${BaseRoute}/alcoholHistory`;

// Surgical 
export const createMedicalHistory = `${BaseRoute}/medicalHistory`;
export const updateMedicalHistory = `${BaseRoute}/medicalHistory`;
export const getMedicalHistory = `${BaseRoute}/medicalHistory`;
export const deleteMedicalHistory = `${BaseRoute}/medicalHistory`;
// ICD CODES
export const icdProcedures = `${BaseRoute}/codes/pcs`;

// Encounter
export const encounter = `${BaseRoute}/encounter`;

// NoteCategories
export const createNoteCategories = `${BaseRoute}/notes-type/`;
export const updateNoteCategories = `${BaseRoute}/notes-type/`;
export const getNoteCategories = `${BaseRoute}/notes-type/`;

// Template
export const templates = `${BaseRoute}/notes-templates`;
