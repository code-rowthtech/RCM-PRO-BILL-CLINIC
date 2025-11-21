/**
 * FHIR R4 Utility Functions for Lab Request Module
 * Implements SMART-on-FHIR and US Core ServiceRequest profile
 */

const FHIR_BASE_URL = process.env.REACT_APP_FHIR_BASE_URL || 'https://fhir-server.example.com/fhir';

/**
 * Get authorization headers with Bearer token
 */
const getAuthHeaders = () => {
    const token = sessionStorage.getItem('fhir_access_token');
    return {
        'Content-Type': 'application/fhir+json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/fhir+json'
    };
};

/**
 * Create a new ServiceRequest (Lab Order)
 * @param {Object} serviceRequest - FHIR ServiceRequest resource
 * @returns {Promise<Object>} Created ServiceRequest
 */
export const createServiceRequest = async (serviceRequest) => {
    try {
        const response = await fetch(`${FHIR_BASE_URL}/ServiceRequest`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(serviceRequest)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.issue?.[0]?.diagnostics || 'Failed to create lab request');
        }

        const data = await response.json();
        
        // Audit log
        logAuditEvent('create', 'ServiceRequest', data.id, serviceRequest.subject.reference);
        
        return data;
    } catch (error) {
        console.error('Error creating ServiceRequest:', error);
        throw error;
    }
};

/**
 * Update an existing ServiceRequest
 * @param {string} id - ServiceRequest ID
 * @param {Object} serviceRequest - Updated FHIR ServiceRequest resource
 * @returns {Promise<Object>} Updated ServiceRequest
 */
export const updateServiceRequest = async (id, serviceRequest) => {
    try {
        const response = await fetch(`${FHIR_BASE_URL}/ServiceRequest/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(serviceRequest)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.issue?.[0]?.diagnostics || 'Failed to update lab request');
        }

        const data = await response.json();
        
        // Audit log
        logAuditEvent('update', 'ServiceRequest', id, serviceRequest.subject.reference);
        
        return data;
    } catch (error) {
        console.error('Error updating ServiceRequest:', error);
        throw error;
    }
};

/**
 * Get ServiceRequests for a patient
 * @param {string} patientId - Patient ID
 * @param {Object} filters - Optional filters (status, date, etc.)
 * @returns {Promise<Array>} Array of ServiceRequests
 */
export const getServiceRequests = async (patientId, filters = {}) => {
    try {
        const params = new URLSearchParams({
            subject: `Patient/${patientId}`,
            category: 'laboratory',
            _sort: '-authored',
            ...filters
        });

        const response = await fetch(`${FHIR_BASE_URL}/ServiceRequest?${params}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch lab requests');
        }

        const bundle = await response.json();
        return bundle.entry?.map(e => e.resource) || [];
    } catch (error) {
        console.error('Error fetching ServiceRequests:', error);
        throw error;
    }
};

/**
 * Get a single ServiceRequest by ID
 * @param {string} id - ServiceRequest ID
 * @returns {Promise<Object>} ServiceRequest resource
 */
export const getServiceRequestById = async (id) => {
    try {
        const response = await fetch(`${FHIR_BASE_URL}/ServiceRequest/${id}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch lab request');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching ServiceRequest:', error);
        throw error;
    }
};

/**
 * Cancel a ServiceRequest
 * @param {string} id - ServiceRequest ID
 * @returns {Promise<Object>} Updated ServiceRequest
 */
export const cancelServiceRequest = async (id) => {
    try {
        const serviceRequest = await getServiceRequestById(id);
        serviceRequest.status = 'revoked';

        const response = await fetch(`${FHIR_BASE_URL}/ServiceRequest/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(serviceRequest)
        });

        if (!response.ok) {
            throw new Error('Failed to cancel lab request');
        }

        const data = await response.json();
        
        // Audit log
        logAuditEvent('cancel', 'ServiceRequest', id, serviceRequest.subject.reference);
        
        return data;
    } catch (error) {
        console.error('Error canceling ServiceRequest:', error);
        throw error;
    }
};

/**
 * Search for LOINC codes
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Array of LOINC codes
 */
export const searchLOINCCodes = async (searchTerm) => {
    try {
        const response = await fetch(`${FHIR_BASE_URL}/ValueSet/$expand?url=http://loinc.org&filter=${searchTerm}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to search LOINC codes');
        }

        const valueSet = await response.json();
        return valueSet.expansion?.contains || [];
    } catch (error) {
        console.error('Error searching LOINC codes:', error);
        return [];
    }
};

/**
 * Search for ICD-10 codes
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Array of ICD-10 codes
 */
export const searchICD10Codes = async (searchTerm) => {
    try {
        const response = await fetch(`${FHIR_BASE_URL}/ValueSet/$expand?url=http://hl7.org/fhir/sid/icd-10-cm&filter=${searchTerm}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to search ICD-10 codes');
        }

        const valueSet = await response.json();
        return valueSet.expansion?.contains || [];
    } catch (error) {
        console.error('Error searching ICD-10 codes:', error);
        return [];
    }
};

/**
 * Create audit log entry (HIPAA compliance)
 * @param {string} action - Action performed
 * @param {string} resourceType - FHIR resource type
 * @param {string} resourceId - Resource ID
 * @param {string} patientRef - Patient reference
 */
const logAuditEvent = async (action, resourceType, resourceId, patientRef) => {
    try {
        const auditEvent = {
            resourceType: 'AuditEvent',
            type: {
                system: 'http://terminology.hl7.org/CodeSystem/audit-event-type',
                code: 'rest',
                display: 'RESTful Operation'
            },
            action: action === 'create' ? 'C' : action === 'update' ? 'U' : 'D',
            recorded: new Date().toISOString(),
            outcome: '0',
            agent: [{
                type: {
                    coding: [{
                        system: 'http://terminology.hl7.org/CodeSystem/extra-security-role-type',
                        code: 'humanuser'
                    }]
                },
                who: {
                    reference: 'Practitioner/current-user'
                },
                requestor: true
            }],
            source: {
                observer: {
                    display: 'EHR Lab Request Module'
                }
            },
            entity: [{
                what: {
                    reference: `${resourceType}/${resourceId}`
                },
                type: {
                    system: 'http://terminology.hl7.org/CodeSystem/audit-entity-type',
                    code: '2',
                    display: 'System Object'
                }
            }, {
                what: {
                    reference: patientRef
                },
                type: {
                    system: 'http://terminology.hl7.org/CodeSystem/audit-entity-type',
                    code: '1',
                    display: 'Person'
                },
                role: {
                    system: 'http://terminology.hl7.org/CodeSystem/object-role',
                    code: '1',
                    display: 'Patient'
                }
            }]
        };

        await fetch(`${FHIR_BASE_URL}/AuditEvent`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(auditEvent)
        });
    } catch (error) {
        console.error('Error logging audit event:', error);
    }
};

/**
 * Validate FHIR ServiceRequest resource
 * @param {Object} serviceRequest - ServiceRequest to validate
 * @returns {Object} Validation result
 */
export const validateServiceRequest = (serviceRequest) => {
    const errors = [];

    if (!serviceRequest.status) {
        errors.push('Status is required');
    }

    if (!serviceRequest.intent) {
        errors.push('Intent is required');
    }

    if (!serviceRequest.code?.coding?.[0]?.code) {
        errors.push('Test code is required');
    }

    if (!serviceRequest.subject?.reference) {
        errors.push('Patient reference is required');
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

export default {
    createServiceRequest,
    updateServiceRequest,
    getServiceRequests,
    getServiceRequestById,
    cancelServiceRequest,
    searchLOINCCodes,
    searchICD10Codes,
    validateServiceRequest
};
