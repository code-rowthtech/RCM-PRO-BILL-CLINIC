export const appointmentType = [
    {
        "Code": "ROUTINE",
        "System": "http://terminology.hl7.org/CodeSystem/v2-0276",
        "Display": "Routine appointment - default if not valued",
        "Definition": "Routine appointment - default if not valued"
    },
    {
        "Code": "WALKIN",
        "System": "http://terminology.hl7.org/CodeSystem/v2-0276",
        "Display": "A previously unscheduled walk-in visit",
        "Definition": "A previously unscheduled walk-in visit"
    },
    {
        "Code": "CHECKUP",
        "System": "http://terminology.hl7.org/CodeSystem/v2-0276",
        "Display": "A routine check-up, such as an annual physical",
        "Definition": "A routine check-up, such as an annual physical"
    },
    {
        "Code": "FOLLOWUP",
        "System": "http://terminology.hl7.org/CodeSystem/v2-0276",
        "Display": "A follow-up visit from a previous appointment",
        "Definition": "A follow-up visit from a previous appointment"
    },
    {
        "Code": "EMERGENCY",
        "System": "http://terminology.hl7.org/CodeSystem/v2-0276",
        "Display": "Emergency appointment",
        "Definition": "Emergency appointment"
    }
]

export const encounterParticipantType = [
    {
        "code": "ADM",
        "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
        "display": "admitter",
        "definition": "The practitioner who is responsible for admitting a patient to a patient encounter."
    },
    {
        "code": "ATND",
        "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
        "display": "attender",
        "definition": "The practitioner that has responsibility for overseeing a patient's care during a patient encounter."
    },
    {
        "code": "CALLBCK",
        "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
        "display": "callback contact",
        "definition": "A person or organization who should be contacted for follow-up questions about the act in place of the author."
    },
    {
        "code": "CON",
        "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
        "display": "consultant",
        "definition": "An advisor participating in the service by performing evaluations and making recommendations."
    },
    {
        "code": "DIS",
        "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
        "display": "discharger",
        "definition": "The practitioner who is responsible for the discharge of a patient from a patient encounter."
    },
    {
        "code": "ESC",
        "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
        "display": "escort",
        "definition": "Only with Transportation services. A person who escorts the patient."
    },
    {
        "code": "REF",
        "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
        "display": "referrer",
        "definition": "A person having referred the subject of the service to the performer (referring physician). Typically, a referring physician will receive a report."
    },
    {
        "code": "translator",
        "system": "http://terminology.hl7.org/CodeSystem/participant-type",
        "display": "Translator",
        "definition": "A translator who is facilitating communication with the patient during the encounter."
    },
    {
        "code": "emergency",
        "system": "http://terminology.hl7.org/CodeSystem/participant-type",
        "display": "Emergency",
        "definition": "A person to be contacted in case of an emergency during the encounter."
    }
]

export const daysOfWeek = [
    {
        "code": "mon",
        "system": "http://hl7.org/fhir/days-of-week",
        "display": "Monday",
        "definition": "Monday."
    },
    {
        "code": "tue",
        "system": "http://hl7.org/fhir/days-of-week",
        "display": "Tuesday",
        "definition": "Tuesday."
    },
    {
        "code": "wed",
        "system": "http://hl7.org/fhir/days-of-week",
        "display": "Wednesday",
        "definition": "Wednesday."
    },
    {
        "code": "thu",
        "system": "http://hl7.org/fhir/days-of-week",
        "display": "Thursday",
        "definition": "Thursday."
    },
    {
        "code": "fri",
        "system": "http://hl7.org/fhir/days-of-week",
        "display": "Friday",
        "definition": "Friday."
    },
    {
        "code": "sat",
        "system": "http://hl7.org/fhir/days-of-week",
        "display": "Saturday",
        "definition": "Saturday."
    },
    {
        "code": "sun",
        "system": "http://hl7.org/fhir/days-of-week",
        "display": "Sunday",
        "definition": "Sunday."
    }
]


export const weekOfMonth =const weekPositions = [
    {
        code: "first",
        display: "First",
        definition: "First week of the month."
    },
    {
        code: "second",
        display: "Second",
        definition: "Second week of the month."
    },
    {
        code: "third",
        display: "Third",
        definition: "Third week of the month."
    },
    {
        code: "fourth",
        display: "Fourth",
        definition: "Fourth week of the month."
    },
    {
        code: "last",
        display: "Last",
        definition: "Last week of the month."
    }
];


export const appointmentRecurrenceType =const timeUnits = [
    {
        code: "d",
        display: "day",
        definition: "day",
        chinese: "天"
    },
    {
        code: "wk",
        display: "week",
        definition: "week",
        chinese: "星期"
    },
    {
        code: "mo",
        display: "month",
        definition: "month - Normal practice is to use the 'mo' code as a calendar month when calculating the next occurrence.",
        chinese: "月"
    },
    {
        code: "a",
        display: "year",
        definition: "year",
        chinese: "年"
    }
];


export const participationStatus = [
    {
        code: "accepted",
        system: "http://hl7.org/fhir/participationstatus",
        display: "Accepted",
        definition: "The participant has accepted the appointment.",
        canonicalMapping: "accepted"
    },
    {
        code: "declined",
        system: "http://hl7.org/fhir/participationstatus",
        display: "Declined",
        definition: "The participant has declined the appointment and will not participate in the appointment.",
        canonicalMapping: "declined"
    },
    {
        code: "tentative",
        system: "http://hl7.org/fhir/participationstatus",
        display: "Tentative",
        definition: "The participant has tentatively accepted the appointment. This could be automatically created by a system and requires further processing before it can be accepted. There is no commitment that attendance will occur.",
        canonicalMapping: "draft"
    },
    {
        code: "needs-action",
        system: "http://hl7.org/fhir/participationstatus",
        display: "Needs Action",
        definition: "The participant needs to indicate if they accept the appointment by changing this status to one of the other statuses.",
        canonicalMapping: "failed"
    }
];

export const priority = [
    {
        "Code": "A",
        "System": "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
        "Display": "ASAP",
        "Definition": "As soon as possible, next highest priority after stat."
    },
    {
        "Code": "CR",
        "System": "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
        "Display": "Callback results",
        "Definition": "Filler should contact the placer as soon as results are available, even for preliminary results. (Was 'C' in HL7 version 2.3's reporting priority.)"
    },
    {
        "Code": "EL",
        "System": "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
        "Display": "Elective",
        "Definition": "Beneficial to the patient but not essential for survival."
    },
    {
        "Code": "EM",
        "System": "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
        "Display": "Emergency",
        "Definition": "An unforeseen combination of circumstances or the resulting state that calls for immediate action."
    },
    {
        "Code": "P",
        "System": "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
        "Display": "Preop",
        "Definition": "Used to indicate that a service is to be performed prior to a scheduled surgery..."
    },
    {
        "Code": "PRN",
        "System": "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
        "Display": "As needed",
        "Definition": "An 'as needed' order should be accompanied by a description of what constitutes a need..."
    },
    {
        "Code": "R",
        "System": "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
        "Display": "Routine",
        "Definition": "Routine service, do at usual work hours."
    },
    {
        "Code": "RR",
        "System": "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
        "Display": "Rush reporting",
        "Definition": "A report should be prepared and sent as quickly as possible."
    },
    {
        "Code": "S",
        "System": "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
        "Display": "Stat",
        "Definition": "With highest priority (e.g., emergency)."
    },
    {
        "Code": "T",
        "System": "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
        "Display": "Timing critical",
        "Definition": "It is critical to come as close as possible to the requested time..."
    },
    {
        "Code": "UD",
        "System": "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
        "Display": "Use as directed",
        "Definition": "Drug is to be used as directed by the prescriber."
    },
    {
        "Code": "UR",
        "System": "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
        "Display": "Urgent",
        "Definition": "Calls for prompt action."
    },
    {
        "Code": "CS",
        "System": "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
        "Display": "Callback for scheduling",
        "Definition": "Filler should contact the placer (or target) to schedule the service..."
    },
    {
        "Code": "CSP",
        "System": "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
        "Display": "Callback placer for scheduling",
        "Definition": "Filler should contact the placer to schedule the service..."
    },
    {
        "Code": "CSR",
        "System": "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
        "Display": "Contact recipient for scheduling",
        "Definition": "Filler should contact the service recipient (target) to schedule the service..."
    }
]


export const medicalSpecialties = [
    {
        code: "408467006",
        system: "http://snomed.info/sct",
        display: "Adult mental illness - specialty (qualifier value)",
        inactive: false,
        designation: "Adult mental illness"
    },
    {
        code: "394577000",
        system: "http://snomed.info/sct",
        display: "Anesthetics",
        inactive: false,
        designation: "Anesthetics (qualifier value)"
    },
    {
        code: "394578005",
        system: "http://snomed.info/sct",
        display: "Audiological medicine (qualifier value)",
        inactive: false,
        designation: "Audiological medicine"
    },
    {
        code: "421661004",
        system: "http://snomed.info/sct",
        display: "Blood banking and transfusion medicine (specialty) (qualifier value)",
        inactive: false,
        designation: "Blood banking and transfusion medicine"
    },
    {
        code: "408462000",
        system: "http://snomed.info/sct",
        display: "Burns care (qualifier value)",
        inactive: false,
        designation: "Burns care"
    },
    {
        code: "394579002",
        system: "http://snomed.info/sct",
        display: "Cardiology (qualifier value)",
        inactive: false,
        designation: "Cardiology"
    },
    {
        code: "394804000",
        system: "http://snomed.info/sct",
        display: "Clinical cytogenetics and molecular genetics (qualifier value)",
        inactive: false,
        designation: "Clinical cytogenetics and molecular genetics"
    },
    {
        code: "394580004",
        system: "http://snomed.info/sct",
        display: "Clinical genetics (qualifier value)",
        inactive: false,
        designation: "Clinical genetics"
    },
    {
        code: "394803006",
        system: "http://snomed.info/sct",
        display: "Clinical hematology",
        inactive: false,
        designation: "Clinical hematology (qualifier value)"
    },
    {
        code: "394812008",
        system: "http://snomed.info/sct",
        display: "Dental medicine specialties (qualifier value)",
        inactive: true,
        designation: "Dental medicine specialties"
    },
    {
        code: "408476004",
        system: "http://snomed.info/sct",
        display: "Bone and marrow transplantation (qualifier value)",
        inactive: true,
        designation: "Surgery-Bone and marrow transplantation"
    },
    {
        code: "394576009",
        system: "http://snomed.info/sct",
        display: "Accident & emergency (qualifier value)",
        inactive: true,
        designation: "Surgical-Accident & emergency"
    },
    {
        code: "394590007",
        system: "http://snomed.info/sct",
        display: "Thoracic medicine (qualifier value)",
        inactive: true,
        designation: "Thoracic medicine"
    },
    {
        code: "394612005",
        system: "http://snomed.info/sct",
        display: "Urology (qualifier value)",
        inactive: false,
        designation: "Urology"
    },
    {
        code: "394733009",
        system: "http://snomed.info/sct",
        display: "Medical specialty--OTHER--NOT LISTED",
        inactive: false,
        designation: "Medical speciality"
    },
    {
        code: "394732004",
        system: "http://snomed.info/sct",
        display: "Surgical specialty--OTHER-NOT LISTED",
        inactive: false,
        designation: "Surgical specialty"
    }
];

export const serviceCategories = [
    { code: "1", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Adoption", definition: "Adoption" },
    { code: "2", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Aged Care", definition: "Aged Care" },
    { code: "34", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Allied Health", definition: "Allied Health" },
    { code: "3", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Alternative/Complementary Therapies", definition: "Alternative & Complementary Therapies" },
    { code: "4", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Child Care /Kindergarten", definition: "Child Care and/or Kindergarten" },
    { code: "5", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Child Development", definition: "Child Development" },
    { code: "6", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Child Protection & Family Services", definition: "Child Protection & Family Services" },
    { code: "7", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Community Health Care", definition: "Community Health Care" },
    { code: "8", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Counselling", definition: "Counselling" },
    { code: "36", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Crisis Line (GPAH use only)", definition: "Crisis Line (GPAH use only)" },
    { code: "9", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Death Services", definition: "Death Services" },
    { code: "10", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Dental", definition: "Dental" },
    { code: "11", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Disability Support", definition: "Disability Support" },
    { code: "12", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Drug/Alcohol", definition: "Drug/Alcohol" },
    { code: "13", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Education & Learning", definition: "Education & Learning" },
    { code: "14", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Emergency Department", definition: "Emergency Department" },
    { code: "15", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Employment", definition: "Employment" },
    { code: "16", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Financial & Material Aid", definition: "Financial & Material aid" },
    { code: "17", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "General Practice", definition: "General Practice/GP (doctor)" },
    { code: "35", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Hospital", definition: "Hospital" },
    { code: "18", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Housing/Homelessness", definition: "Housing/Homelessness" },
    { code: "19", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Interpreting", definition: "Interpreting" },
    { code: "20", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Justice", definition: "Justice" },
    { code: "21", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Legal", definition: "Legal" },
    { code: "22", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Mental Health", definition: "Mental Health" },
    { code: "38", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "NDIA", definition: "NDIA" },
    { code: "23", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Physical Activity & Recreation", definition: "Physical Activity & Recreation" },
    { code: "24", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Regulation", definition: "Regulation" },
    { code: "25", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Respite/Carer Support", definition: "Respite/Carer Support" },
    { code: "26", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Specialist Clinical Pathology", definition: "Specialist Clinical Pathology - requires referral" },
    { code: "27", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Specialist Medical", definition: "Specialist Medical - requires referral" },
    { code: "28", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Specialist Obstetrics & Gynecology", definition: "Specialist Obstetrics & Gynecology - requires referral" },
    { code: "29", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Specialist Paediatric", definition: "Specialist Paediatric - requires referral" },
    { code: "30", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Specialist Radiology/Imaging", definition: "Specialist Radiology/Imaging - requires referral" },
    { code: "31", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Specialist Surgical", definition: "Specialist Surgical - requires referral" },
    { code: "32", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Support Group/s", definition: "Support group/s" },
    { code: "37", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Test Message (HSD admin)", definition: "Test Message (HSD admin use only)" },
    { code: "33", system: "http://terminology.hl7.org/CodeSystem/service-category", display: "Transport", definition: "Transport" }
];

export const encounterClasses = [
    {
        code: "AMB",
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        display: "Ambulatory",
        definition: "A patient visit that occurs in an outpatient setting, without an overnight stay."
    },
    {
        code: "EMER",
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        display: "Emergency",
        definition: "An unplanned patient visit to the emergency department."
    },
    {
        code: "FLD",
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        display: "Field",
        definition: "A visit where healthcare is provided at a location other than a traditional healthcare facility, such as at the scene of an accident."
    },
    {
        code: "HH",
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        display: "Home Health",
        definition: "Healthcare services provided in the patient's home."
    },
    {
        code: "IMP",
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        display: "Inpatient",
        definition: "A patient visit that includes an overnight stay in a healthcare facility."
    },
    {
        code: "ACUTE",
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        display: "Inpatient Acute",
        definition: "An inpatient visit for acute care."
    },
    {
        code: "NONAC",
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        display: "Inpatient Non-Acute",
        definition: "An inpatient visit for non-acute care."
    },
    {
        code: "OBSENC",
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        display: "Observation Encounter",
        definition: "An encounter where the patient is under observation."
    },
    {
        code: "PRENC",
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        display: "Pre-Admission",
        definition: "An encounter prior to formal admission."
    },
    {
        code: "SS",
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        display: "Short Stay",
        definition: "An encounter with a short duration, typically less than 24 hours."
    },
    {
        code: "VR",
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        display: "Virtual",
        definition: "An encounter that occurs via telecommunication mechanisms."
    }
];

export const appointmentStatuses = [
    {
        code: "proposed",
        system: "http://hl7.org/fhir/appointmentstatus",
        display: "Proposed",
        definition: "None of the participant(s) have finalized their acceptance of the appointment request, and the start/end time might not be set yet.",
        canonicalMapping: "proposed"
    },
    {
        code: "pending",
        system: "http://hl7.org/fhir/appointmentstatus",
        display: "Pending",
        definition: "Some or all of the participant(s) have not finalized their acceptance of the appointment request.",
        canonicalMapping: "draft"
    },
    {
        code: "booked",
        system: "http://hl7.org/fhir/appointmentstatus",
        display: "Booked",
        definition: "All participant(s) have been considered and the appointment is confirmed to go ahead at the date/times specified.",
        canonicalMapping: "accepted"
    },
    {
        code: "arrived",
        system: "http://hl7.org/fhir/appointmentstatus",
        display: "Arrived",
        definition: "The patient/patients has/have arrived and is/are waiting to be seen.",
        canonicalMapping: "arrived"
    },
    {
        code: "fulfilled",
        system: "http://hl7.org/fhir/appointmentstatus",
        display: "Fulfilled",
        definition: "The planning stages of the appointment are now complete, the encounter resource will exist and will track further status changes. Note that an encounter may exist before the appointment status is fulfilled for many reasons.",
        canonicalMapping: "complete"
    },
    {
        code: "cancelled",
        system: "http://hl7.org/fhir/appointmentstatus",
        display: "Cancelled",
        definition: "The appointment has been cancelled.",
        canonicalMapping: "abandoned"
    },
    {
        code: "noshow",
        system: "http://hl7.org/fhir/appointmentstatus",
        display: "No Show",
        definition: "Some or all of the participant(s) have not/did not appear for the appointment (usually the patient).",
        canonicalMapping: "suspended"
    },
    {
        code: "entered-in-error",
        system: "http://hl7.org/fhir/appointmentstatus",
        display: "Entered in error",
        definition: "This instance should not have been part of this patient's medical record.",
        canonicalMapping: "error"
    },
    {
        code: "checked-in",
        system: "http://hl7.org/fhir/appointmentstatus",
        display: "Checked In",
        definition: "When checked in, all pre-encounter administrative work is complete, and the encounter may begin. (where multiple patients are involved, they are all present).",
        canonicalMapping: "partial"
    },
    {
        code: "waitlist",
        system: "http://hl7.org/fhir/appointmentstatus",
        display: "Waitlisted",
        definition: "The appointment has been placed on a waitlist, to be scheduled/confirmed in the future when a slot/service is available. A specific time might or might not be pre-allocated.",
        canonicalMapping: "proposed"
    }
];

export const cancellationReasons = [
    {
        level: 1,
        code: "pat",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Patient"
    },
    {
        level: 2,
        code: "pat-crs",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Patient: Canceled via automated reminder system"
    },
    {
        level: 2,
        code: "pat-cpp",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Patient: Canceled via Patient Portal"
    },
    {
        level: 2,
        code: "pat-dec",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Patient: Deceased"
    },
    {
        level: 2,
        code: "pat-fb",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Patient: Feeling Better"
    },
    {
        level: 2,
        code: "pat-lt",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Patient: Lack of Transportation"
    },
    {
        level: 2,
        code: "pat-mt",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Patient: No longer covered by insurance or other payers"
    },
    {
        level: 2,
        code: "pat-mv",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Patient: Moved Residence"
    },
    {
        level: 2,
        code: "pat-preg",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Patient: Pregnant"
    },
    {
        level: 2,
        code: "pat-swl",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Patient: Scheduled from Wait List"
    },
    {
        level: 2,
        code: "pat-ucp",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Patient: Unhappy/Changed Provider"
    },
    {
        level: 1,
        code: "prov",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Provider"
    },
    {
        level: 2,
        code: "prov-pers",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Provider: Personal"
    },
    {
        level: 2,
        code: "prov-dch",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Provider: Discharged"
    },
    {
        level: 2,
        code: "prov-edu",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Provider: Edu/Meeting"
    },
    {
        level: 2,
        code: "prov-hosp",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Provider: Hospitalized"
    },
    {
        level: 2,
        code: "prov-labs",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Provider: Labs Out of Acceptable Range"
    },
    {
        level: 2,
        code: "prov-mri",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Provider: MRI Screening Form Marked Do Not Proceed"
    },
    {
        level: 2,
        code: "prov-onc",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Provider: Oncology Treatment Plan Changes"
    },
    {
        level: 1,
        code: "maint",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Equipment Maintenance/Repair"
    },
    {
        level: 1,
        code: "meds-inc",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Prep/Med Incomplete"
    },
    {
        level: 1,
        code: "other",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Other"
    },
    {
        level: 2,
        code: "oth-cms",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Other: CMS Therapy Cap Service Not Authorized"
    },
    {
        level: 2,
        code: "oth-err",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Other: Error"
    },
    {
        level: 2,
        code: "oth-fin",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Other: Financial"
    },
    {
        level: 2,
        code: "oth-iv",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Other: Improper IV Access/Infiltrate IV"
    },
    {
        level: 2,
        code: "oth-int",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Other: No Interpreter Available"
    },
    {
        level: 2,
        code: "oth-mu",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Other: Prep/Med/Results Unavailable"
    },
    {
        level: 2,
        code: "oth-room",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Other: Room/Resource Maintenance"
    },
    {
        level: 2,
        code: "oth-oerr",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Other: Schedule Order Error"
    },
    {
        level: 2,
        code: "oth-swie",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Other: Silent Walk In Error"
    },
    {
        level: 2,
        code: "oth-weath",
        system: "http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason",
        display: "Other: Weather"
    }
];


