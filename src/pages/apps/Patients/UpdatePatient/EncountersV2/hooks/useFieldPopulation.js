import { useState, useEffect, useRef, useCallback } from 'react';
import ToastHandle from '../../../../../../helpers/ToastMessage';

export const useFieldPopulation = () => {
    const [populatedFields, setPopulatedFields] = useState({});
    const [populatedFieldIds, setPopulatedFieldIds] = useState({});
    const dataLoadedRef = useRef(false);
    const pendingOperations = useRef(new Set());

    // Global function to populate encounter fields from EncounterSummary
    useEffect(() => {
        window.populateEncounterField = (fieldName, data, itemId) => {
            const operationKey = `${fieldName}:${data}`;
            
            // Prevent duplicate operations that are already in progress
            if (pendingOperations.current.has(operationKey)) {
                return;
            }
            
            // Mark operation as pending immediately
            pendingOperations.current.add(operationKey);
            
            // Use functional update to get latest state
            setPopulatedFields(prev => {
                const existingData = prev[fieldName] || [];
                if (existingData.includes(data)) {
                    pendingOperations.current.delete(operationKey);
                    ToastHandle('This data has already been added to the related field.', 'danger');
                    return prev;
                }
                
                // Clear pending after successful addition
                setTimeout(() => pendingOperations.current.delete(operationKey), 100);
                
                return {
                    ...prev,
                    [fieldName]: [...existingData, data]
                };
            });

            // Track IDs if provided
            if (itemId) {
                setPopulatedFieldIds(prev => ({
                    ...prev,
                    [fieldName]: [...(prev[fieldName] || []), itemId]
                }));
            }
        };

        return () => {
            delete window.populateEncounterField;
        };
    }, []);

    // Function to remove populated data from field
    const removePopulatedData = useCallback((fieldName, dataToRemove) => {
        const indexToRemove = (populatedFields[fieldName] || []).indexOf(dataToRemove);

        setPopulatedFields(prev => ({
            ...prev,
            [fieldName]: (prev[fieldName] || []).filter(item => item !== dataToRemove)
        }));

        // Remove corresponding ID
        if (indexToRemove !== -1) {
            setPopulatedFieldIds(prev => ({
                ...prev,
                [fieldName]: (prev[fieldName] || []).filter((_, index) => index !== indexToRemove)
            }));
        }
        
        // Clear any pending operations for this data
        const operationKey = `${fieldName}:${dataToRemove}`;
        pendingOperations.current.delete(operationKey);
    }, [populatedFields]);

    return {
        populatedFields,
        populatedFieldIds,
        setPopulatedFields,
        setPopulatedFieldIds,
        removePopulatedData,
        dataLoadedRef
    };
};