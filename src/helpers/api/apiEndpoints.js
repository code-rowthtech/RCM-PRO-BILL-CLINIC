export const addPermissions = '/api/v1/permisssions';
export const getPermissions = '/api/v1/permisssions';
export const deletePermissions = '/api/v1/permisssions/delete';
export const updatePermissions = '/api/v1/permisssions';
export const deleteClinicOnboarding= "";
export const getClinicsByParentId = '';

// ROLES
export const createRoles = '/api/v1/roles/create';
export const updateRoles = '/api/v1/roles/edit';
export const getRoles = '/api/v1/roles';

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
export const getSubClinic = ''
export const getSubClinicType = '/api/v1/clinic/getClinicTypes'



//CONTRACT
export const createContract = '/api/v1/clinic/getContractDetails';

// SETTING
export const addMastersData = '/api/v1/clinic/masterdata';
export const getMastersData = '/api/v1/clinic/masterdata';
export const updateMastersData = '/api/v1/clinic/masterdata';
// DOCTORS
export const getDoctor = '/api/v1/doctors/getClinicDoctors';
export const createDoctor = '/api/v1/clinics/createOrUpdateUser';
export const getDoctorRoles = '/api/v1/clinic/getRoles';
export const createDoctorDetail = '/api/v1/clinics/createOrUpdateDoctor';
// PATIENTS
export const getPatients = '/api/v1/clinics/patient/all';
export const createPatients = '/api/v1/clinics/patient';
export const updatePatients = '/api/v1/clinics/patient';

// DASHBOARD
export const getAnalytics = '/api/v1/admin/';
// SUBSCRIPTIONS
export const getSubscriptions = '/api/v1/clinic/getSubscriptionsList';
export const addSubscriptionPlan='/api/v1/clinic/addSubscriptionPlan';
