import { useState, useEffect, useRef, useCallback } from 'react';
import ToastHandle from '../../../../../../helpers/ToastMessage';

export const useFieldPopulation = () => {
    const [populatedFields, setPopulatedFields] = useState({});
    const [populatedFieldIds, setPopulatedFieldIds] = useState({});
    const dataLoadedRef = useRef(false);

    // Global function to populate encounter fields from EncounterSummary
    useEffect(() => {
        window.populateEncounterField = (fieldName, data, itemId) => {
            // Check for duplicates
            const existingData = populatedFields[fieldName] || [];
            if (existingData.includes(data)) {
                ToastHandle('This data has already been added to the related field.', 'danger');
                return;
            }

            // Track populated data for removal functionality (only in side panel)
            setPopulatedFields(prev => ({
                ...prev,
                [fieldName]: [...(prev[fieldName] || []), data]
            }));

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
    }, [populatedFields]);

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