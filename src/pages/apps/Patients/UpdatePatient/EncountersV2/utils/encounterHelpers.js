export const buildEncounterPayload = (data, encounterTypes, encounterClassCodes, selectedProvider, noteType, fieldsData, attachedRecords, patientId) => {
    const encounterTypeSelected = encounterTypes?.find((e) => e?.code === data?.type);
    const encounterClassSelected = encounterClassCodes?.find((e) => e?.code === data?.class);

    const type = {
        coding: [{
            system: encounterTypeSelected.system,
            code: encounterTypeSelected.code,
            display: encounterTypeSelected.display,
        }],
        text: encounterTypeSelected.display,
    };

    const encounterClass = {
        coding: [{
            system: '',
            code: encounterClassSelected.code,
            display: encounterClassSelected.display,
        }],
        text: encounterClassSelected.display,
    };

    return {
        type,
        class: encounterClass,
        subject: patientId,
        status: data?.status,
        providerId: selectedProvider,
        noteType,
        data: fieldsData,
        attachedRecords,
        period: {
            start: data?.startDate,
        }
    };
};

export const processFormFields = (notesFields, getValues, populatedFieldIds, populatedFields) => {
    const fieldsData = [];
    const fieldsToRender = (notesFields || [])
        .filter(field => field.isShown)
        .sort((a, b) => a.order - b.order);

    fieldsToRender.forEach(field => {
        const { name, inputType = 'textarea' } = field;

        if (name === 'Notes (SOAP)') {
            ['Subjective', 'Objective', 'Assessment', 'Plan'].forEach(section => {
                const value = getValues(section) || '';
                const fieldData = {
                    type: section,
                    content: {
                        type: inputType === 'text-editor' ? 'html' : 'text',
                        value: value
                    }
                };
                if (populatedFieldIds[section]?.length > 0) {
                    fieldData.populatedIds = populatedFieldIds[section];
                }
                if (populatedFields[section]?.length > 0) {
                    fieldData.populatedData = populatedFields[section];
                }
                fieldsData.push(fieldData);
            });
        } else if (name !== 'Attached Records') {
            const value = getValues(name) || '';
            const fieldData = {
                type: name,
                content: {
                    type: inputType === 'text-editor' ? 'html' : 'text',
                    value: value
                }
            };
            if (populatedFieldIds[name]?.length > 0) {
                fieldData.populatedIds = populatedFieldIds[name];
            }
            if (populatedFields[name]?.length > 0) {
                fieldData.populatedData = populatedFields[name];
            }
            fieldsData.push(fieldData);
        }
    });

    return fieldsData;
};
