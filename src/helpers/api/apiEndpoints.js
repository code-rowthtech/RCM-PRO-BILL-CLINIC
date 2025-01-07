export const addPermissions = '/api/v1/permisssions';
export const getPermissions = '/api/v1/clinic/getPermissions';
export const deletePermissions = '/api/v1/permisssions/delete';
export const updatePermissions = '/api/v1/permisssions';
export const deleteClinicOnboarding = "";
export const getClinicsByParentId = '';

// ROLES
export const createRoles = '/api/v1/clinic/createSubUser';
export const updateRoles = '/api/v1/clinic/updateSubUser';
export const getRoles = '/api/v1/clinic/listAllUsers';
export const getUserId = '/api/v1/clinic/getUserDetails';
export const deleterRoles = '/api/v1/clinic/removeUser'

// CLINIC
export const createClinic = '/api/v1/clinic/editClinicDetails';
// export const updateClinic = '/api/v1/clinic/editClinicDetails';
export const getClinic = '/api/v1/clinic/getClinicDetails';
export const getClinicById = '/api/v1/clinic/byId';
export const getStatedByCountry = '/api/v1/clinic/states/US';
export const getCityByState = '/api/v1/clinic/cities/';
export const getClinicType = '/api/v1/clinic/getClinicTypes';



// SUB CLINIC
export const createSubClinic = '/api/v1/clinic/createSubClinics'
export const getSubClinic = '/api/v1/clinic/getSubClinics'
export const getSubClinicCityByState = '/api/v1/clinic/cities/';
export const updateSubClinic = '/api/v1/clinic/editClinicDetails';
export const createUpgrade = '/api/v1/clinic/upgradeSubscription'
export const getSubClinicType = '/api/v1/clinic/getClinicTypes'
export const getSubscription = '/api/v1/clinic/getSubscription/history'

//CONTRACT
export const createContract = '/api/v1/clinic/getContractDetails';
export const standardContract = 'api/v1/clinic/getStandardContact';

// SETTING
export const addMastersData = '/api/v1/clinic/createOrUpdateMasterData';
export const getMastersData = '/api/v1/clinic/getmasterData';
export const getDepartmentData = '/api/v1/clinic/getmasterData';
export const updateMastersData = '/api/v1/clinic/createOrUpdateMasterData';

export const addRoleData = '/api/v1/clinic/roles/create';
export const getRoleData = '/api/v1/clinic/roles';
export const updateRoleData = '/api/v1/clinic/roles/edit';

// DOCTORS
export const getDoctor = '/api/v1/doctors/getClinicDoctors';
export const createDoctor = '/api/v1/clinics/practitioner/add';
export const getDoctorRoles = '/api/v1/clinic/roles';
export const createDoctorDetail = '/api/v1/clinics/practitioner/update';
export const getDoctorDetails = '/api/v1/doctors/getDoctorDetails';

// PATIENTS
export const getPatients = '/api/v1/clinics/patient-get';
export const getPatientById = '/api/v1/clinics/patient-getById';
export const createPatients = '/api/v1/clinics/patient-onboard';
export const updatePatients = '/api/v1/clinics/patient-edit';
export const createResponsibleParty = '/api/v1/clinics/responsible-party-add';
export const getResponsibleParty = '/api/v1/clinics/responsible-party-get';

// DASHBOARD
export const getAnalytics = '/api/v1/admin/';

// SUBSCRIPTIONS
export const getSubscriptions = '/api/v1/clinic/getSubscriptionsList';
export const getSubSubscriptions = '/api/v1/clinic/getSubscription/history'
export const addSubscriptionPlan = '/api/v1/clinic/addSubscriptionPlan';

// SCHEDULE
export const createSchedule = '/api/v1/clinic/practitioner/holiday/create';
export const createTimings = '/api/v1/clinic/practitioner/schedule/create';
export const updateTimings = '/api/v1/clinic/practitioner/schedule/update';
export const getDoctorsList = 'api/v1/clinic/getDoctorsList';
export const deleteSchedule = '/api/v1/clinic/practitioner/holiday/delete'
export const getSchedule = '/api/v1/clinic/practitioner/holidays';
export const getPractitionerTimings = '/api/v1/clinic/practitioner/schedule';

// appointments
export const createAppointment = '/api/v1/appointments'
export const getPractitionerSchedule = '/api/v1/clinic/getPractitionerSchedule'
export const getAppointments = '/api/v1/clinic/appointment/getAll/';
export const getPractitionerSlots = '/api/v1/clinic/practitioner/slots';