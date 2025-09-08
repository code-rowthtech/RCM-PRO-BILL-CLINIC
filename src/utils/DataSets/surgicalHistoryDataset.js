const bodySiteList = [
    {
        code: "32849002",
        system: "http://snomed.info/sct",
        display: "Esophagus"
    },
    {
        code: "818983003",
        system: "http://snomed.info/sct",
        display: "Abdomen"
    },
    {
        code: "12738006",
        system: "http://snomed.info/sct",
        display: "Brain"
    },
    {
        code: "89545001",
        system: "http://snomed.info/sct",
        display: "Face"
    },
    {
        code: "10200004",
        system: "http://snomed.info/sct",
        display: "Liver"
    },
    {
        code: "421060004",
        system: "http://snomed.info/sct",
        display: "Structure of vertebral column (body structure)"
    },
    {
        code: "2748008",
        system: "http://snomed.info/sct",
        display: "Spinal cord"
    },
    {
        code: "90456006",
        system: "http://snomed.info/sct",
        display: "Sympathetic nerve"
    },
    {
        code: "51185008",
        system: "http://snomed.info/sct",
        display: "Thorax"
    },
    {
        code: "12921003",
        system: "http://snomed.info/sct",
        display: "Pelvis"
    },
    {
        code: "unknown",
        system: "http://terminology.hl7.org/codeSystem/data-absent-reason",
        display: "Unknown"
    },
    {
        code: "OTH",
        system: "http://terminology.hl7.org/codeSystem/v3-NullFlavor",
        display: "Osher"
    }
]
export const bodySite = bodySiteList.sort((a, b) =>
    a.display.localeCompare(b.display)
);
