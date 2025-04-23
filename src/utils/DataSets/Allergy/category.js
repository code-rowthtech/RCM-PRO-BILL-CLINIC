export const category = [
    {
        system: 'http://hl7.org/fhir/allergy-intolerance-category',
        code: 'food',
        display: 'Food',
        definition: 'Any substance consumed to provide nutritional support for the body.',
    },
    {
        system: 'http://hl7.org/fhir/allergy-intolerance-category',
        code: 'medication',
        display: 'Medication',
        definition: 'Substances administered to achieve a physiological effect.',
    },
    {
        system: 'http://hl7.org/fhir/allergy-intolerance-category',
        code: 'environment',
        display: 'Environment',
        definition:
            'Any substances that are encountered in the environment, including any substance not already classified as food, medication, or biologic.',
    },
    {
        system: 'http://hl7.org/fhir/allergy-intolerance-category',
        code: 'biologic',
        display: 'Biologic',
        definition:
            'A preparation that is synthesized from living organisms or their products, especially a human or animal protein, such as a hormone or antitoxin, that is used as a diagnostic, preventive, or therapeutic agent. Examples of biologic medications include: vaccines; allergenic extracts, which are used for both diagnosis and treatment (for example, allergy shots); gene therapies; cellular therapies. There are other biologic products, such as tissues, which are not typically associated with allergies.',
    },
];

export const criticality = [
    {
        system: 'http://hl7.org/fhir/allergy-intolerance-criticality',
        code: 'low',
        display: 'Low Risk',
        definition:
            'Worst case result of a future exposure is not assessed to be life-threatening or having high potential for organ system failure.',
    },
    {
        system: 'http://hl7.org/fhir/allergy-intolerance-criticality',
        code: 'high',
        display: 'High Risk',
        definition:
            'Worst case result of a future exposure is assessed to be life-threatening or having high potential for organ system failure.',
    },
    {
        system: 'http://hl7.org/fhir/allergy-intolerance-criticality',
        code: 'unable-to-assess',
        display: 'Unable to Assess Risk',
        definition: 'Unable to assess the worst case result of a future exposure.',
    },
];
