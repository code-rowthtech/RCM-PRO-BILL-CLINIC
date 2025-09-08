const allergyCodeList = [
  {
    code: "105590001",
    system: "http://snomed.info/sct",
    display: "Substance",
    otherDisplay: "Substance (substance)"
  },
  {
    code: "102002",
    system: "http://snomed.info/sct",
    display: "Hemoglobin Okaloosa",
    otherDisplay: "Hemoglobin Okaloosa (substance)"
  },
  {
    code: "120006",
    system: "http://snomed.info/sct",
    display: "Ornithine racemase",
    otherDisplay: "Ornithine racemase (substance)"
  },
  {
    code: "125001",
    system: "http://snomed.info/sct",
    display: "Ferrous (59-Fe) sulfate (substance)",
    otherDisplay: "Ferrous (59-Fe) sulfate"
  },
  {
    code: "126000",
    system: "http://snomed.info/sct",
    display: "Galactosyl-N-acetylglucosaminylgalactosylglucosylceramide alpha-galactosyltransferase",
    otherDisplay: "Galactosyl-N-acetylglucosaminylgalactosylglucosylceramide alpha-galactosyltransferase (substance)"
  },
  {
    code: "130002",
    system: "http://snomed.info/sct",
    display: "Hemoglobin Hopkins-II",
    otherDisplay: "Hemoglobin Hopkins-II (substance)"
  },
  {
    code: "131003",
    system: "http://snomed.info/sct",
    display: "Dolichyl-phosphate mannosyltransferase",
    otherDisplay: "Dolichyl-phosphate mannosyltransferase (substance)"
  },
  {
    code: "159002",
    system: "http://snomed.info/sct",
    display: "Ferrocyanide salt",
    otherDisplay: "Ferrocyanide salt (substance)"
  },
  {
    code: "164003",
    system: "http://snomed.info/sct",
    display: "Phosphoenolpyruvate-protein phosphotransferase",
    otherDisplay: "Phosphoenolpyruvate-protein phosphotransferase (substance)"
  },
  {
    code: "178002",
    system: "http://snomed.info/sct",
    display: "Uridine diphosphate galactose",
    otherDisplay: "UDP - Uridyl diphosphate galactose"
  },
  {
    code: "186002",
    system: "http://snomed.info/sct",
    display: "HLA-Cw9 antigen",
    otherDisplay: "Human leukocyte antigen Cw9 (substance)"
  },
  {
    code: "187006",
    system: "http://snomed.info/sct",
    display: "Cyanocobalamin (57-Co) (substance)",
    otherDisplay: "Cyanocobalamin (57-Co)"
  },
  {
    code: "200001",
    system: "http://snomed.info/sct",
    display: "Berberine",
    otherDisplay: "Berberine (substance)"
  },
  {
    code: "217008",
    system: "http://snomed.info/sct",
    display: "Blood group antigen IH",
    otherDisplay: "Blood group antigen IH (substance)"
  },
  {
    code: "231008",
    system: "http://snomed.info/sct",
    display: "3-hydroxyisobutyrate dehydrogenase",
    otherDisplay: "3-hydroxyisobutyrate dehydrogenase (substance)"
  },
  {
    code: "238002",
    system: "http://snomed.info/sct",
    display: "Heptachlor",
    otherDisplay: "Heptachlor (substance)"
  },
  {
    code: "261000",
    system: "http://snomed.info/sct",
    display: "Codeine phosphate",
    otherDisplay: "Codeine phosphate (substance)"
  },
  {
    code: "296000",
    system: "http://snomed.info/sct",
    display: "Coumachlor",
    otherDisplay: "Coumachlor (substance)"
  },
  {
    code: "327000",
    system: "http://snomed.info/sct",
    display: "Arsenic-76 (substance)",
    otherDisplay: "76-As"
  },
  {
    code: "329002",
    system: "http://snomed.info/sct",
    display: "Antimony-127 (substance)",
    otherDisplay: "127-Sb"
  },
  {
    code: "336001",
    system: "http://snomed.info/sct",
    display: "Fibrinogen Tokyo II",
    otherDisplay: "Fibrinogen Tokyo II (substance)"
  },
  {
    code: "340005",
    system: "http://snomed.info/sct",
    display: "Enzyme variant",
    otherDisplay: "Enzyme variant (substance)"
  },
  {
    code: "363000",
    system: "http://snomed.info/sct",
    display: "Fibrinogen San Juan",
    otherDisplay: "Fibrinogen San Juan (substance)"
  },
  {
    code: "370000",
    system: "http://snomed.info/sct",
    display: "Beta>2S< glycoprotein (substance)",
    otherDisplay: "Beta>2S< glycoprotein"
  },
  {
    code: "371001",
    system: "http://snomed.info/sct",
    display: "Acylcarnitine hydrolase",
    otherDisplay: "Acylcarnitine hydrolase (substance)"
  },
  {
    code: "377002",
    system: "http://snomed.info/sct",
    display: "Sparteine",
    otherDisplay: "Sparteine (substance)"
  },
  {
    code: "392001",
    system: "http://snomed.info/sct",
    display: "Gadolinium-151 (substance)",
    otherDisplay: "Gadolinium-151"
  },
  {
    code: "395004",
    system: "http://snomed.info/sct",
    display: "Immunoglobulin pentamer",
    otherDisplay: "Immunoglobulin pentamer (substance)"
  },
  {
    code: "412004",
    system: "http://snomed.info/sct",
    display: "Ribose-5-phosphate isomerase",
    otherDisplay: "Ribose-5-phosphate isomerase (substance)"
  },
  {
    code: "424006",
    system: "http://snomed.info/sct",
    display: "Citramalyl-CoA lyase",
    otherDisplay: "Citramalyl-coenzyme A lyase (substance)"
  },
  {
    code: "425007",
    system: "http://snomed.info/sct",
    display: "Hemoglobin Nagoya",
    otherDisplay: "Hemoglobin Nagoya (substance)"
  },
  {
    code: "432003",
    system: "http://snomed.info/sct",
    display: "Carminic acid",
    otherDisplay: "Carminic acid stain"
  },
  {
    code: "438004",
    system: "http://snomed.info/sct",
    display: "2-hydroxyglutarate dehydrogenase (substance)",
    otherDisplay: "2-hydroxyglutarate dehydrogenase"
  },
  {
    code: "462009",
    system: "http://snomed.info/sct",
    display: "Urease (ATP-hydrolysing)",
    otherDisplay: "Urease (adenosine triphosphate-hydrolysing)"
  },
  {
    code: "472007",
    system: "http://snomed.info/sct",
    display: "Vegetable textile fiber",
    otherDisplay: "Vegetable textile fiber (substance)"
  },
  {
    code: "476005",
    system: "http://snomed.info/sct",
    display: "Lymphocyte antigen CD1b",
    otherDisplay: "Cluster of differentiation antigen 1b"
  },
  {
    code: "498001",
    system: "http://snomed.info/sct",
    display: "Nitrilase",
    otherDisplay: "Nitrilase (substance)"
  },
  {
    code: "501001",
    system: "http://snomed.info/sct",
    display: "Blood group antibody Sf^a^",
    otherDisplay: "Blood group antibody Sf^a^ (substance)"
  },
  {
    code: "505005",
    system: "http://snomed.info/sct",
    display: "Blood group antibody M'",
    otherDisplay: "Blood group antibody M' (substance)"
  },
  {
    code: "506006",
    system: "http://snomed.info/sct",
    display: "3-oxosteroid delta^1^-dehydrogenase (substance)",
    otherDisplay: "3-oxosteroid delta^1^-dehydrogenase"
  },
  {
    code: "515004",
    system: "http://snomed.info/sct",
    display: "Blood group antigen Giaigue",
    otherDisplay: "Blood group antigen Giaigue (substance)"
  },
  {
    code: "519005",
    system: "http://snomed.info/sct",
    display: "Free protein S",
    otherDisplay: "Free protein S (substance)"
  },
  {
    code: "521000",
    system: "http://snomed.info/sct",
    display: "Mercury-197 (substance)",
    otherDisplay: "197-Hg"
  },
  {
    code: "529003",
    system: "http://snomed.info/sct",
    display: "Guanosine",
    otherDisplay: "Guanosine (substance)"
  },
  {
    code: "538001",
    system: "http://snomed.info/sct",
    display: "2,3-dihydroxybenzoate 3,4-dioxygenase (substance)",
    otherDisplay: "O-pyrocatechuate oxygenase"
  },
  {
    code: "566009",
    system: "http://snomed.info/sct",
    display: "Acrosin",
    otherDisplay: "Acrosin (substance)"
  },
  {
    code: "576007",
    system: "http://snomed.info/sct",
    display: "Blood group antibody Duck",
    otherDisplay: "Blood group antibody Duck (substance)"
  },
  {
    code: "578008",
    system: "http://snomed.info/sct",
    display: "Hemoglobin Jianghua",
    otherDisplay: "Hemoglobin Jianghua (substance)"
  },
  {
    code: "584006",
    system: "http://snomed.info/sct",
    display: "Blood group antibody Wr^b^",
    otherDisplay: "Blood group antibody Wr^b^ (substance)"
  },
  {
    code: "585007",
    system: "http://snomed.info/sct",
    display: "Substance P",
    otherDisplay: "SP - Substance P"
  },
  {
    code: "591009",
    system: "http://snomed.info/sct",
    display: "2-oxoisovalerate dehydrogenase (acylating) (substance)",
    otherDisplay: "2-oxoisovalerate dehydrogenase (acylating)"
  },
  {
    code: "593007",
    system: "http://snomed.info/sct",
    display: "Blood group antibody Holmes",
    otherDisplay: "Blood group antibody Holmes (substance)"
  },
  {
    code: "594001",
    system: "http://snomed.info/sct",
    display: "2-oxoglutarate synthase (substance)",
    otherDisplay: "2-oxoglutarate synthase"
  },
  {
    code: "597008",
    system: "http://snomed.info/sct",
    display: "Californium-247 (substance)",
    otherDisplay: "Californium-247"
  },
  {
    code: "604000",
    system: "http://snomed.info/sct",
    display: "Plant sapogenin glycoside",
    definition: "Plant sapogenin glycoside (substance)"
  },
  {
    code: "611001",
    system: "http://snomed.info/sct",
    display: "Hippurate hydrolase",
    definition: "Hippurate hydrolase (substance)"
  },
  {
    code: "620005",
    system: "http://snomed.info/sct",
    display: "Trichlorophenol",
    definition: "Trichlorophenol (substance)"
  },
  {
    code: "648005",
    system: "http://snomed.info/sct",
    display: "Oil of calamus",
    definition: "Oil of calamus (substance)"
  },
  {
    code: "662003",
    system: "http://snomed.info/sct",
    display: "Aeromonas proteolytica aminopeptidase",
    definition: "Aeromonas proteolytica aminopeptidase (substance)"
  },
  {
    code: "668004",
    system: "http://snomed.info/sct",
    display: "Osmium-185 (substance)",
    definition: "Osmium-185"
  },
  {
    code: "683009",
    system: "http://snomed.info/sct",
    display: "Mercuric acetate",
    definition: "Mercuric acetate (substance)"
  },
  {
    code: "686001",
    system: "http://snomed.info/sct",
    display: "Plastoquinol-plastocyanin reductase",
    definition: "Plastoquinol-plastocyanin reductase (substance)"
  },
  {
    code: "693002",
    system: "http://snomed.info/sct",
    display: "Trichothecenes",
    definition: "Trichothecene"
  },
  {
    code: "698006",
    system: "http://snomed.info/sct",
    display: "Erythromycin lactobionate",
    definition: "Erythromycin lactobionate (substance)"
  },
  {
    code: "699003",
    system: "http://snomed.info/sct",
    display: "Coal tar extract",
    definition: "Coal tar extract (substance)"
  },
  {
    code: "704006",
    system: "http://snomed.info/sct",
    display: "Blood group antigen Rx",
    definition: "Blood group antigen Rx (substance)"
  },
  {
    code: "732002",
    system: "http://snomed.info/sct",
    display: "N-valeraldehyde",
    definition: "N-valeraldehyde (substance)"
  },
  {
    code: "735000",
    system: "http://snomed.info/sct",
    display: "Blood group antigen Jobbins",
    definition: "Blood group antigen Jobbins (substance)"
  },
  {
    code: "747006",
    system: "http://snomed.info/sct",
    display: "Oxamniquine",
    definition: "Oxamniquine (substance)"
  },
  {
    code: "773001",
    system: "http://snomed.info/sct",
    display: "Hemoglobin M-Iwate",
    definition: "Hemoglobin M-Iwate (substance)"
  },
  {
    code: "785009",
    system: "http://snomed.info/sct",
    display: "Dextranase",
    definition: "Dextranase (substance)"
  },
  {
    code: "804003",
    system: "http://snomed.info/sct",
    display: "Creosotic acid",
    definition: "Creosotic acid (substance)"
  },
  {
    code: "819002",
    system: "http://snomed.info/sct",
    display: "Lytic antibody",
    definition: "Lytic antibody (substance)"
  },
  {
    code: "850000",
    system: "http://snomed.info/sct",
    display: "Stizolobate synthase",
    definition: "Stizolobate synthase (substance)"
  },
  {
    code: "859004",
    system: "http://snomed.info/sct",
    display: "Peptide-N^4^-(N-acetyl-b-glucosaminyl) asparagine amidase",
    definition: "Peptide N-glycosidase"
  },
  {
    code: "860009",
    system: "http://snomed.info/sct",
    display: "Immunoglobulin, aggregated",
    definition: "Immunoglobulin, aggregated (substance)"
  },
  {
    code: "873008",
    system: "http://snomed.info/sct",
    display: "Urethan",
    definition: "Ethyl carbamate"
  },
  {
    code: "876000",
    system: "http://snomed.info/sct",
    display: "Blood group antigen D",
    definition: "D antigen"
  }
];

export const allergyCode = allergyCodeList.sort((a, b) =>
  a.display.localeCompare(b.display)
);
