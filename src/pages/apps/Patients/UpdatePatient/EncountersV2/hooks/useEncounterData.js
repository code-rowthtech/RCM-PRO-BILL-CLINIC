import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { decryptMessage } from '../../../../../../cryptoUtils';
import { formatDateByUserTimeZone } from '../../../../../../components/timeZonePipe';

let decryptedUser = null;

const encryptedData = localStorage.getItem('encryptedUserData');

if (encryptedData) {
    try {
        decryptedUser = JSON.parse(decryptMessage(encryptedData));
    } catch (err) {
        console.error("Failed to decrypt user data:", err);
    }
} else {
    console.warn("No encrypted user data found in localStorage.");
}

export const useEncounterData = (id, encounterId, encounterAction) => {
    const store = useSelector((state) => state);

    // Patient data
    const patientDetails = store?.getPatientByIdReducer?.data?.data;

    // Encounter data
    const encounterData = store?.getEncounterByIdReducer?.data?.encounter;
    const createEncounterData = store?.createEncounterReducer;
    const updateEncounterData = store?.updateEncounterReducer;

    // ENCOUNTER SUMMARY DATA
    const allergyData = store?.getAllergiesOfAPatientReducer?.data?.allergies;
    const problemData = store?.getProblemListReducer?.data?.problems;
    const medicationList = store?.getMedicationReducer?.data?.medicationRequests;
    const patientVitals = store?.getVitalsByPatientIdReducer?.data?.data || [];

    const groupedVitals = useMemo(() => {
        return patientVitals?.reduce((acc, vitalGroup) => {
            const date = vitalGroup.effectiveDateTime;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(...vitalGroup.vitals);
            return acc;
        }, {}) || {};
    }, [patientVitals]);

    // Notes and settings data
    const notesFields = store?.getEncounterNotesFieldsReducer?.data?.data?.displaySettings?.mainPanel?.[0]?.sections;
    const notesTypeOptions = store?.getEncounterNotesTypeReducer?.data?.data?.map((data) => ({
        label: data?.title,
        value: data?._id,
        isDefault: data?.default
    }));
    const defaultNoteTypeOption = notesTypeOptions?.find(opt => opt.isDefault);
    const settingsDataMainItems = store?.getEncounterSettingsReducer?.data?.data?.items;

    // Doctor/Provider data
    const doctorDetails = store?.getDoctorsReducer?.data?.result;
    const providerOptions = doctorDetails?.map((data) => ({
        value: data?._id,
        label: (data?.name?.[0]?.prefix?.[0]
            ? data?.name?.[0]?.prefix?.[0] + ' '
            : '') +
            (data?.name?.[0]?.family || '') +
            (data?.name?.[0]?.given?.length > 0
                ? ' ' + data?.name?.[0]?.given?.join(' ')
                : '') + ' ' +
            (data?.identifier?.find((tel) => tel?.type?.coding?.[0]?.code === 'NPI')?.value ?
                `(******${data?.identifier?.find((tel) => tel?.type?.coding?.[0]?.code === 'NPI')?.value.slice(-4)})`
                : '') || ''
    }));

    // APPOINTMENTS DATA
    const appointmentsData = store?.getAppointmentsReducer?.data?.appointments;
    const appointmentOptions = appointmentsData?.map((data) => ({
        value: data?._id,
        label: `${data?.appointmentType?.text || data?.appointmentType?.coding?.[0]?.display || 'Appointment'} - ${data?.start ? formatDateByUserTimeZone(data.start) : ''}`,
        consentDocument: data?.consentDocument || []
    }));

    return {
        store,
        patientDetails,
        encounterData,
        createEncounterData,
        updateEncounterData,
        allergyData,
        problemData,
        medicationList,
        patientVitals,
        groupedVitals,
        notesFields,
        notesTypeOptions,
        defaultNoteTypeOption,
        settingsDataMainItems,
        doctorDetails,
        providerOptions,
        appointmentsData,
        appointmentOptions
    };
};