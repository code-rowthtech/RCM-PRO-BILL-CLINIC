export const clinicalStatus = [
    {
      system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
      code: "active",
      display: "Active",
      definition:
        "The subject is currently experiencing, or is at risk of, a reaction to the identified substance.",
      canonicalMapping: "accepted",
    },
    {
      system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
      code: "inactive",
      display: "Inactive",
      definition:
        "The subject is no longer at risk of a reaction to the identified substance.",
      canonicalMapping: "declined",
    },
    {
      system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
      code: "resolved",
      display: "Resolved",
      definition:
        "A reaction to the identified substance has been clinically reassessed by testing or re-exposure and is considered no longer to be present. Re-exposure could be accidental, unplanned, or outside of any clinical setting.",
      canonicalMapping: "active",
    },
  ];
  
  