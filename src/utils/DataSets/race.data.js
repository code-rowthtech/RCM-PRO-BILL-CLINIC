
export const raceOptionsList = [
  {
    "code": "1002-5",
    "system": "urn:oid:2.16.840.1.113883.6.238",
    "display": "American Indian or Alaska Native"
  },
  {
    "code": "2028-9",
    "system": "urn:oid:2.16.840.1.113883.6.238",
    "display": "Asian"
  },
  {
    "code": "2054-5",
    "system": "urn:oid:2.16.840.1.113883.6.238",
    "display": "Black or African American"
  },
  {
    "code": "2076-8",
    "system": "urn:oid:2.16.840.1.113883.6.238",
    "display": "Native Hawaiian or Other Pacific Islander"
  },
  {
    "code": "2106-3",
    "system": "urn:oid:2.16.840.1.113883.6.238",
    "display": "White"
  },
  {
    "code": "2131-1",
    "system": "urn:oid:2.16.840.1.113883.6.238",
    "display": "Other Race"
  },
  {
    "code": "ASKU",
    "system": "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",
    "display": "asked but unknown",
    "definition": "Information was sought but not found (e.g., patient was asked but didn't know)."
  },
  {
    "code": "UNK",
    "system": "http://terminology.hl7.org/CodeSystem/v3-NullFlavor",
    "display": "unknown",
    "definition": "A proper value is applicable, but not known.",
    "usageNotes": "This means the actual value is not known. If the only thing that is unknown is how to properly express the value in the necessary constraints (value set, datatype, etc.), then the OTH or UNC flavor should be used. No properties should be included for a datatype with this property unless:\n\n1. Those properties themselves directly translate to a semantic of 'unknown'. (E.g. a local code sent as a translation that conveys 'unknown').\n2. Those properties further qualify the nature of what is unknown. (E.g. specifying a use code of 'H' and a URL prefix of 'tel:' to convey that it is the home phone number that is unknown.)"
  }
]

export const raceOptions = raceOptionsList?.sort((a, b) =>
  a.display.localeCompare(b.display)
);
