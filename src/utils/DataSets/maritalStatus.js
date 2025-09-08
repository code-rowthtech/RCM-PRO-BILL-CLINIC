const maritalStatusOptionsList = [
    { show: "Separated", value: "A", label: "Separated", system: "http://terminology.hl7.org/CodeSystem/v2-0002" },
    { show: "Divorced", value: "D", label: "Divorced", system: "http://terminology.hl7.org/CodeSystem/v2-0002" },
    { show: "Married", value: "M", label: "Married", system: "http://terminology.hl7.org/CodeSystem/v2-0002" },
    { show: "Single", value: "S", label: "Single", system: "http://terminology.hl7.org/CodeSystem/v2-0002" },
    { show: "Widowed", value: "W", label: "Widowed", system: "http://terminology.hl7.org/CodeSystem/v2-0002" },
    { show: "Common Law", value: "C", label: "Common law", system: "http://terminology.hl7.org/CodeSystem/v2-0002" },
    { show: "Living Together", value: "G", label: "Living together", system: "http://terminology.hl7.org/CodeSystem/v2-0002" },
    { show: "Domestic Partner", value: "P", label: "Domestic partner", system: "http://terminology.hl7.org/CodeSystem/v2-0002" },
    { show: "Registered Domestic Partner", value: "R", label: "Registered domestic partner", system: "http://terminology.hl7.org/CodeSystem/v2-0002" },
    { show: "Legally Separated", value: "E", label: "Legally Separated", system: "http://terminology.hl7.org/CodeSystem/v2-0002" },
    { show: "Annulled", value: "N", label: "Annulled", system: "http://terminology.hl7.org/CodeSystem/v2-0002" },
    { show: "Interlocutory", value: "I", label: "Interlocutory", system: "http://terminology.hl7.org/CodeSystem/v2-0002" },
    { show: "Unmarried", value: "B", label: "Unmarried", system: "http://terminology.hl7.org/CodeSystem/v2-0002" },
    { show: "Unknown", value: "U", label: "Unknown", system: "http://terminology.hl7.org/CodeSystem/v2-0002" },
    { show: "Other", value: "O", label: "Other", system: "http://terminology.hl7.org/CodeSystem/v2-0002" },
    { show: "Unreported", value: "T", label: "Unreported", system: "http://terminology.hl7.org/CodeSystem/v2-0002" }
];

export const maritalStatusOptions = maritalStatusOptionsList.sort((a, b) =>
    a.show.localeCompare(b.show)
);
