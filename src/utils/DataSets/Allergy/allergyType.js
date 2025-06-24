export const allergyType = [
    {
        system: 'http://hl7.org/fhir/allergy-intolerance-type',
        code: 'allergy',
        display: 'Allergy',
        definition:
            'A propensity for hypersensitive reaction(s) to a substance. These reactions are most typically type I hypersensitivity, plus other "allergy-like" reactions, including pseudoallergy.',
    },
    {
        system: 'http://hl7.org/fhir/allergy-intolerance-type',
        code: 'intolerance',
        display: 'Intolerance',
        definition:
            'A propensity for adverse reactions to a substance that is judged to be not allergic or "allergy-like". These reactions are typically (but not necessarily) non-immune. They are to some degree idiosyncratic and/or patient-specific (i.e. are not a reaction that is expected to occur with most or all patients given similar circumstances).',
    },
];

export const severityData = [
    {
        code: 'mild',
        system: 'http://hl7.org/fhir/reaction-event-severity',
        display: 'Mild',
        definition: 'Causes mild physiological effects.',
    },
    {
        code: 'moderate',
        system: 'http://hl7.org/fhir/reaction-event-severity',
        display: 'Moderate',
        definition: 'Causes moderate physiological effects.',
    },
    {
        code: 'severe',
        system: 'http://hl7.org/fhir/reaction-event-severity',
        display: 'Severe',
        definition: 'Causes severe physiological effects.',
    },
];
