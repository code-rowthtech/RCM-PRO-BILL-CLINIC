const specialitiesList = [
    {
        code: "101200000X",
        system: "101200000X",
        display: "http://nucc.org/provider-taxonomy Drama Therapist"
    },
    {
        code: "101Y00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Counselor"
    },
    {
        code: "101YA0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Addiction (Substance Use Disorder) Counselor"
    },
    {
        code: "101YM0800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Mental Health Counselor"
    },
    {
        code: "101YP1600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pastoral Counselor"
    },
    {
        code: "101YP2500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Professional Counselor"
    },
    {
        code: "101YS0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "School Counselor"
    },
    {
        code: "102L00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Psychoanalyst"
    },
    {
        code: "102X00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Poetry Therapist"
    },
    {
        code: "103G00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Neuropsychologist"
    },
    {
        code: "103K00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Behavioral Analyst"
    },
    {
        code: "103T00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Psychologist"
    },
    {
        code: "103TA0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Addiction (Substance Use Disorder) Psychologist"
    },
    {
        code: "103TA0700X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Adult Development & Aging Psychologist"
    },
    {
        code: "103TB0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Cognitive & Behavioral Psychologist"
    },
    {
        code: "103TC0700X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Psychologist"
    },
    {
        code: "103TC1900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Counseling Psychologist"
    },
    {
        code: "103TC2200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Child & Adolescent Psychologist"
    },
    {
        code: "103TE1100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Exercise & Sports Psychologist"
    },
    {
        code: "103TF0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Family Psychologist"
    },
    {
        code: "103TF0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Forensic Psychologist"
    },
    {
        code: "103TH0004X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Health Psychologist"
    },
    {
        code: "103TH0100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Health Service Psychologist"
    },
    {
        code: "103TM1800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Intellectual & Developmental Disabilities Psychologist"
    },
    {
        code: "103TP0016X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Prescribing (Medical) Psychologist"
    },
    {
        code: "103TP0814X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Psychoanalysis Psychologist"
    },
    {
        code: "103TP2701X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Group Psychotherapy Psychologist"
    },
    {
        code: "103TR0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Rehabilitation Psychologist"
    },
    {
        code: "103TS0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "School Psychologist"
    },
    {
        code: "104100000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Social Worker"
    },
    {
        code: "1041C0700X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Social Worker"
    },
    {
        code: "1041S0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "School Social Worker"
    },
    {
        code: "106E00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Assistant Behavior Analyst"
    },
    {
        code: "106H00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Marriage & Family Therapist"
    },
    {
        code: "106S00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Behavior Technician"
    },
    {
        code: "111N00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Chiropractor"
    },
    {
        code: "111NI0013X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Independent Medical Examiner Chiropractor"
    },
    {
        code: "111NI0900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Internist Chiropractor"
    },
    {
        code: "111NN0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neurology Chiropractor"
    },
    {
        code: "111NN1001X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nutrition Chiropractor"
    },
    {
        code: "111NP0017X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Chiropractor"
    },
    {
        code: "111NR0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Radiology Chiropractor"
    },
    {
        code: "111NR0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Rehabilitation Chiropractor"
    },
    {
        code: "111NS0005X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sports Physician Chiropractor"
    },
    {
        code: "111NT0100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Thermography Chiropractor"
    },
    {
        code: "111NX0100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Occupational Health Chiropractor"
    },
    {
        code: "111NX0800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Orthopedic Chiropractor"
    },
    {
        code: "122300000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Dentist"
    },
    {
        code: "1223D0001X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Public Health Dentist"
    },
    {
        code: "1223D0004X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Dentist Anesthesiologist"
    },
    {
        code: "1223E0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Endodontist"
    },
    {
        code: "1223G0001X",
        system: "http://nucc.org/provider-taxonomy",
        display: "General Practice Dentistry"
    },
    {
        code: "1223P0106X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Oral and Maxillofacial Pathology Dentist"
    },
    {
        code: "1223P0221X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Dentist"
    },
    {
        code: "1223P0300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Periodontist"
    },
    {
        code: "1223P0700X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Prosthodontist"
    },
    {
        code: "1223S0112X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Oral and Maxillofacial Surgery (Dentist)"
    },
    {
        code: "1223X0008X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Oral and Maxillofacial Radiology Dentist"
    },
    {
        code: "1223X0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Orthodontics and Dentofacial Orthopedic Dentist"
    },
    {
        code: "1223X2210X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Orofacial Pain Dentist"
    },
    {
        code: "122400000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Denturist"
    },
    {
        code: "124Q00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Dental Hygienist"
    },
    {
        code: "125J00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Dental Therapist"
    },
    {
        code: "125K00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Advanced Practice Dental Therapist"
    },
    {
        code: "125Q00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Oral Medicinist"
    },
    {
        code: "126800000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Dental Assistant"
    },
    {
        code: "126900000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Dental Laboratory Technician"
    },
    {
        code: "132700000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Dietary Manager"
    },
    {
        code: "133N00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nutritionist"
    },
    {
        code: "133NN1002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nutrition Education Nutritionist"
    },
    {
        code: "133V00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Registered Dietitian"
    },
    {
        code: "133VN1004X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Nutrition Registered Dietitian"
    },
    {
        code: "133VN1005X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Renal Nutrition Registered Dietitian"
    },
    {
        code: "133VN1006X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Metabolic Nutrition Registered Dietitian"
    },
    {
        code: "133VN1101X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Gerontological Nutrition Registered Dietitian"
    },
    {
        code: "133VN1201X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Obesity and Weight Management Nutrition Registered Dietitian"
    },
    {
        code: "133VN1301X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Oncology Nutrition Registered Dietitian"
    },
    {
        code: "133VN1401X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Critical Care Nutrition Registered Dietitian"
    },
    {
        code: "133VN1501X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sports Dietetics Nutrition Registered Dietitian"
    },
    {
        code: "136A00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Registered Dietetic Technician"
    },
    {
        code: "146D00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Personal Emergency Response Attendant"
    },
    {
        code: "146L00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Paramedic"
    },
    {
        code: "146M00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Intermediate Emergency Medical Technician"
    },
    {
        code: "146N00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Basic Emergency Medical Technician"
    },
    {
        code: "152W00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Optometrist"
    },
    {
        code: "152WC0802X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Corneal and Contact Management Optometrist"
    },
    {
        code: "152WL0500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Low Vision Rehabilitation Optometrist"
    },
    {
        code: "152WP0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Optometrist"
    },
    {
        code: "152WS0006X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sports Vision Optometrist"
    },
    {
        code: "152WV0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Vision Therapy Optometrist"
    },
    {
        code: "152WX0102X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Occupational Vision Optometrist"
    },
    {
        code: "156F00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Technician/Technologist"
    },
    {
        code: "156FC0800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Contact Lens Technician/Technologist"
    },
    {
        code: "156FC0801X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Contact Lens Fitter"
    },
    {
        code: "156FX1100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ophthalmic Technician/Technologist"
    },
    {
        code: "156FX1101X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ophthalmic Assistant"
    },
    {
        code: "156FX1201X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Optometric Assistant Technician"
    },
    {
        code: "156FX1202X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Optometric Technician"
    },
    {
        code: "156FX1700X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ocularist"
    },
    {
        code: "156FX1800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Optician"
    },
    {
        code: "156FX1900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Orthoptist"
    },
    {
        code: "163W00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Registered Nurse"
    },
    {
        code: "163WA0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Addiction (Substance Use Disorder) Registered Nurse"
    },
    {
        code: "163WA2000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Administrator Registered Nurse"
    },
    {
        code: "163WC0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Critical Care Medicine Registered Nurse"
    },
    {
        code: "163WC0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Case Management Registered Nurse"
    },
    {
        code: "163WC1400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "College Health Registered Nurse"
    },
    {
        code: "163WC1500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Community Health Registered Nurse"
    },
    {
        code: "163WC1600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Continuing Education/Staff Development Registered Nurse"
    },
    {
        code: "163WC2100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Continence Care Registered Nurse"
    },
    {
        code: "163WC3500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Cardiac Rehabilitation Registered Nurse"
    },
    {
        code: "163WD0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Diabetes Educator Registered Nurse"
    },
    {
        code: "163WD1100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Peritoneal Dialysis Registered Nurse"
    },
    {
        code: "163WE0003X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Emergency Registered Nurse"
    },
    {
        code: "163WE0900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Enterostomal Therapy Registered Nurse"
    },
    {
        code: "163WF0300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Flight Registered Nurse"
    },
    {
        code: "163WG0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "General Practice Registered Nurse"
    },
    {
        code: "163WG0100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Gastroenterology Registered Nurse"
    },
    {
        code: "163WG0600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Gerontology Registered Nurse"
    },
    {
        code: "163WH0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Home Health Registered Nurse"
    },
    {
        code: "163WH0500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hemodialysis Registered Nurse"
    },
    {
        code: "163WH1000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hospice Registered Nurse"
    },
    {
        code: "163WI0500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Infusion Therapy Registered Nurse"
    },
    {
        code: "163WI0600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Infection Control Registered Nurse"
    },
    {
        code: "163WL0100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Lactation Consultant (Registered Nurse)"
    },
    {
        code: "163WM0102X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Maternal Newborn Registered Nurse"
    },
    {
        code: "163WM0705X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Medical-Surgical Registered Nurse"
    },
    {
        code: "163WM1400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nurse Massage Therapist (NMT)"
    },
    {
        code: "163WN0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neonatal Intensive Care Registered Nurse"
    },
    {
        code: "163WN0003X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Low-Risk Neonatal Registered Nurse"
    },
    {
        code: "163WN0300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nephrology Registered Nurse"
    },
    {
        code: "163WN0800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neuroscience Registered Nurse"
    },
    {
        code: "163WN1003X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nutrition Support Registered Nurse"
    },
    {
        code: "163WP0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pain Management Registered Nurse"
    },
    {
        code: "163WP0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Registered Nurse"
    },
    {
        code: "163WP0218X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Oncology Registered Nurse"
    },
    {
        code: "163WP0807X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Child & Adolescent Psychiatric/Mental Health Registered Nurse"
    },
    {
        code: "163WP0808X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Psychiatric/Mental Health Registered Nurse"
    },
    {
        code: "163WP0809X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Adult Psychiatric/Mental Health Registered Nurse"
    },
    {
        code: "163WP1700X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Perinatal Registered Nurse"
    },
    {
        code: "163WP2201X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ambulatory Care Registered Nurse"
    },
    {
        code: "163WR0006X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Registered Nurse First Assistant"
    },
    {
        code: "163WR0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Rehabilitation Registered Nurse"
    },
    {
        code: "163WR1000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Reproductive Endocrinology/Infertility Registered Nurse"
    },
    {
        code: "163WS0121X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Plastic Surgery Registered Nurse"
    },
    {
        code: "163WS0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "School Registered Nurse"
    },
    {
        code: "163WU0100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Urology Registered Nurse"
    },
    {
        code: "163WW0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Wound Care Registered Nurse"
    },
    {
        code: "163WW0101X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ambulatory Women's Health Care Registered Nurse"
    },
    {
        code: "163WX0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "High-Risk Obstetric Registered Nurse"
    },
    {
        code: "163WX0003X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Inpatient Obstetric Registered Nurse"
    },
    {
        code: "163WX0106X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Occupational Health Registered Nurse"
    },
    {
        code: "163WX0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Oncology Registered Nurse"
    },
    {
        code: "163WX0601X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Otorhinolaryngology & Head-Neck Registered Nurse"
    },
    {
        code: "163WX0800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Orthopedic Registered Nurse"
    },
    {
        code: "163WX1100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ophthalmic Registered Nurse"
    },
    {
        code: "163WX1500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ostomy Care Registered Nurse"
    },
    {
        code: "164W00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Licensed Practical Nurse"
    },
    {
        code: "164X00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Licensed Vocational Nurse"
    },
    {
        code: "167G00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Licensed Psychiatric Technician"
    },
    {
        code: "170100000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ph.D. Medical Genetics"
    },
    {
        code: "170300000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Genetic Counselor (M.S.)"
    },
    {
        code: "171000000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Military Health Care Provider"
    },
    {
        code: "1710I1002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Independent Duty Corpsman"
    },
    {
        code: "1710I1003X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Independent Duty Medical Technicians"
    },
    {
        code: "171100000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Acupuncturist"
    },
    {
        code: "171400000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Health & Wellness Coach"
    },
    {
        code: "171M00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Case Manager/Care Coordinator"
    },
    {
        code: "171R00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Interpreter"
    },
    {
        code: "171W00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Contractor"
    },
    {
        code: "171WH0202X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Home Modifications Contractor"
    },
    {
        code: "171WV0202X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Vehicle Modifications Contractor"
    },
    {
        code: "172A00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Driver"
    },
    {
        code: "172M00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Mechanotherapist"
    },
    {
        code: "172P00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Naprapath"
    },
    {
        code: "172V00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Community Health Worker"
    },
    {
        code: "173000000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Legal Medicine"
    },
    {
        code: "173C00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Reflexologist"
    },
    {
        code: "173F00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sleep Specialist (PhD)"
    },
    {
        code: "174400000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Specialist"
    },
    {
        code: "1744G0900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Graphics Designer"
    },
    {
        code: "1744P3200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Prosthetics Case Management"
    },
    {
        code: "1744R1102X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Research Study Specialist"
    },
    {
        code: "1744R1103X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Research Study Abstracter/Coder"
    },
    {
        code: "174H00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Health Educator"
    },
    {
        code: "174M00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Veterinarian"
    },
    {
        code: "174MM1900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Medical Research Veterinarian"
    },
    {
        code: "174N00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Lactation Consultant (Non-RN)"
    },
    {
        code: "174V00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Ethicist"
    },
    {
        code: "175F00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Naturopath"
    },
    {
        code: "175L00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Homeopath"
    },
    {
        code: "175M00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Lay Midwife"
    },
    {
        code: "175T00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Peer Specialist"
    },
    {
        code: "176B00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Midwife"
    },
    {
        code: "176P00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Funeral Director"
    },
    {
        code: "183500000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pharmacist"
    },
    {
        code: "1835C0205X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Critical Care Pharmacist"
    },
    {
        code: "1835G0303X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Geriatric Pharmacist"
    },
    {
        code: "1835N0905X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nuclear Pharmacist"
    },
    {
        code: "1835N1003X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nutrition Support Pharmacist"
    },
    {
        code: "1835P0018X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pharmacist Clinician (PhC)/ Clinical Pharmacy Specialist"
    },
    {
        code: "1835P0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Pharmacist"
    },
    {
        code: "1835P1200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pharmacotherapy Pharmacist"
    },
    {
        code: "1835P1300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Psychiatric Pharmacist"
    },
    {
        code: "1835P2201X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ambulatory Care Pharmacist"
    },
    {
        code: "1835X0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Oncology Pharmacist"
    },
    {
        code: "183700000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pharmacy Technician"
    },
    {
        code: "193200000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Multi-Specialty Group"
    },
    {
        code: "202C00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Independent Medical Examiner Physician"
    },
    {
        code: "202K00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Phlebology Physician"
    },
    {
        code: "204C00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sports Medicine (Neuromusculoskeletal Medicine) Physician"
    },
    {
        code: "204D00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neuromusculoskeletal Medicine & OMM Physician"
    },
    {
        code: "204E00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Oral & Maxillofacial Surgery (D.M.D.)"
    },
    {
        code: "204F00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Transplant Surgery Physician"
    },
    {
        code: "204R00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Electrodiagnostic Medicine Physician"
    },
    {
        code: "207K00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Allergy & Immunology Physician"
    },
    {
        code: "207KA0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Allergy Physician"
    },
    {
        code: "207KI0005X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical & Laboratory Immunology (Allergy & Immunology) Physician"
    },
    {
        code: "207L00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Anesthesiology Physician"
    },
    {
        code: "207LA0401X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Addiction Medicine (Anesthesiology) Physician"
    },
    {
        code: "207LC0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Critical Care Medicine (Anesthesiology) Physician"
    },
    {
        code: "207LH0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hospice and Palliative Medicine (Anesthesiology) Physician"
    },
    {
        code: "207LP2900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pain Medicine (Anesthesiology) Physician"
    },
    {
        code: "207LP3000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Anesthesiology Physician"
    },
    {
        code: "207N00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Dermatology Physician"
    },
    {
        code: "207ND0101X",
        system: "http://nucc.org/provider-taxonomy",
        display: "MOHS-Micrographic Surgery Physician"
    },
    {
        code: "207ND0900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Dermatopathology Physician"
    },
    {
        code: "207NI0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical & Laboratory Dermatological Immunology Physician"
    },
    {
        code: "207NP0225X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Dermatology Physician"
    },
    {
        code: "207NS0135X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Procedural Dermatology Physician"
    },
    {
        code: "207P00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Emergency Medicine Physician"
    },
    {
        code: "207PE0004X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Emergency Medical Services (Emergency Medicine) Physician"
    },
    {
        code: "207PE0005X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Undersea and Hyperbaric Medicine (Emergency Medicine) Physician"
    },
    {
        code: "207PH0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hospice and Palliative Medicine (Emergency Medicine) Physician"
    },
    {
        code: "207PP0204X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Emergency Medicine (Emergency Medicine) Physician"
    },
    {
        code: "207PS0010X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sports Medicine (Emergency Medicine) Physician"
    },
    {
        code: "207PT0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Medical Toxicology (Emergency Medicine) Physician"
    },
    {
        code: "207Q00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Family Medicine Physician"
    },
    {
        code: "207QA0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Adolescent Medicine (Family Medicine) Physician"
    },
    {
        code: "207QA0401X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Addiction Medicine (Family Medicine) Physician"
    },
    {
        code: "207QA0505X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Adult Medicine Physician"
    },
    {
        code: "207QB0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Obesity Medicine (Family Medicine) Physician"
    },
    {
        code: "207QG0300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Geriatric Medicine (Family Medicine) Physician"
    },
    {
        code: "207QH0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hospice and Palliative Medicine (Family Medicine) Physician"
    },
    {
        code: "207QS0010X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sports Medicine (Family Medicine) Physician"
    },
    {
        code: "207QS1201X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sleep Medicine (Family Medicine) Physician"
    },
    {
        code: "207R00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Internal Medicine Physician"
    },
    {
        code: "207RA0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Adolescent Medicine (Internal Medicine) Physician"
    },
    {
        code: "207RA0001X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Advanced Heart Failure and Transplant Cardiology Physician"
    },
    {
        code: "207RA0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Adult Congenital Heart Disease Physician"
    },
    {
        code: "207RA0201X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Allergy & Immunology (Internal Medicine) Physician"
    },
    {
        code: "207RA0401X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Addiction Medicine (Internal Medicine) Physician"
    },
    {
        code: "207RB0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Obesity Medicine (Internal Medicine) Physician"
    },
    {
        code: "207RC0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Cardiovascular Disease Physician"
    },
    {
        code: "207RC0001X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Cardiac Electrophysiology Physician"
    },
    {
        code: "207RC0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Critical Care Medicine (Internal Medicine) Physician"
    },
    {
        code: "207RE0101X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Endocrinology, Diabetes & Metabolism Physician"
    },
    {
        code: "207RG0100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Gastroenterology Physician"
    },
    {
        code: "207RG0300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Geriatric Medicine (Internal Medicine) Physician"
    },
    {
        code: "207RH0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hematology (Internal Medicine) Physician"
    },
    {
        code: "207RH0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hospice and Palliative Medicine (Internal Medicine) Physician"
    },
    {
        code: "207RH0003X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hematology & Oncology Physician"
    },
    {
        code: "207RH0005X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hypertension Specialist Physician"
    },
    {
        code: "207RI0001X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical & Laboratory Immunology (Internal Medicine) Physician"
    },
    {
        code: "207RI0008X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hepatology Physician"
    },
    {
        code: "207RI0011X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Interventional Cardiology Physician"
    },
    {
        code: "207RI0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Infectious Disease Physician"
    },
    {
        code: "207RM1200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Magnetic Resonance Imaging (MRI) Internal Medicine Physician"
    },
    {
        code: "207RN0300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nephrology Physician"
    },
    {
        code: "207RP1001X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pulmonary Disease Physician"
    },
    {
        code: "207RR0500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Rheumatology Physician"
    },
    {
        code: "207RS0010X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sports Medicine (Internal Medicine) Physician"
    },
    {
        code: "207RS0012X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sleep Medicine (Internal Medicine) Physician"
    },
    {
        code: "207RT0003X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Transplant Hepatology Physician"
    },
    {
        code: "207RX0202X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Medical Oncology Physician"
    },
    {
        code: "207SC0300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Cytogenetics Physician"
    },
    {
        code: "207SG0201X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Genetics (M.D.) Physician"
    },
    {
        code: "207SG0202X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Biochemical Genetics Physician"
    },
    {
        code: "207SG0203X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Molecular Genetics Physician"
    },
    {
        code: "207SG0205X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ph.D. Medical Genetics Physician"
    },
    {
        code: "207SM0001X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Molecular Genetic Pathology (Medical Genetics) Physician"
    },
    {
        code: "207T00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neurological Surgery Physician"
    },
    {
        code: "207U00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nuclear Medicine Physician"
    },
    {
        code: "207UN0901X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nuclear Cardiology Physician"
    },
    {
        code: "207UN0902X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nuclear Imaging & Therapy Physician"
    },
    {
        code: "207UN0903X",
        system: "http://nucc.org/provider-taxonomy",
        display: "In Vivo & In Vitro Nuclear Medicine Physician"
    },
    {
        code: "207V00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Obstetrics & Gynecology Physician"
    },
    {
        code: "207VB0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Obesity Medicine (Obstetrics & Gynecology) Physician"
    },
    {
        code: "207VC0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Critical Care Medicine (Obstetrics & Gynecology) Physician"
    },
    {
        code: "207VE0102X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Reproductive Endocrinology Physician"
    },
    {
        code: "207VF0040X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Female Pelvic Medicine and Reconstructive Surgery (Obstetrics & Gynecology) Physician"
    },
    {
        code: "207VG0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Gynecology Physician"
    },
    {
        code: "207VH0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hospice and Palliative Medicine (Obstetrics & Gynecology) Physician"
    },
    {
        code: "207VM0101X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Maternal & Fetal Medicine Physician"
    },
    {
        code: "207VX0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Obstetrics Physician"
    },
    {
        code: "207VX0201X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Gynecologic Oncology Physician"
    },
    {
        code: "207W00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ophthalmology Physician"
    },
    {
        code: "207WX0009X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Glaucoma Specialist (Ophthalmology) Physician"
    },
    {
        code: "207WX0107X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Retina Specialist (Ophthalmology) Physician"
    },
    {
        code: "207WX0108X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Uveitis and Ocular Inflammatory Disease (Ophthalmology) Physician"
    },
    {
        code: "207WX0109X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neuro-ophthalmology Physician"
    },
    {
        code: "207WX0110X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Ophthalmology and Strabismus Specialist Physician Physician"
    },
    {
        code: "207WX0120X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Cornea and External Diseases Specialist Physician"
    },
    {
        code: "207WX0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ophthalmic Plastic and Reconstructive Surgery Physician"
    },
    {
        code: "207X00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Orthopaedic Surgery Physician"
    },
    {
        code: "207XP3100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Orthopaedic Surgery Physician"
    },
    {
        code: "207XS0106X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Orthopaedic Hand Surgery Physician"
    },
    {
        code: "207XS0114X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Adult Reconstructive Orthopaedic Surgery Physician"
    },
    {
        code: "207XS0117X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Orthopaedic Surgery of the Spine Physician"
    },
    {
        code: "207XX0004X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Orthopaedic Foot and Ankle Surgery Physician"
    },
    {
        code: "207XX0005X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sports Medicine (Orthopaedic Surgery) Physician"
    },
    {
        code: "207XX0801X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Orthopaedic Trauma Physician"
    },
    {
        code: "207Y00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Otolaryngology Physician"
    },
    {
        code: "207YP0228X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Otolaryngology Physician"
    },
    {
        code: "207YS0012X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sleep Medicine (Otolaryngology) Physician"
    },
    {
        code: "207YS0123X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Facial Plastic Surgery Physician"
    },
    {
        code: "207YX0007X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Plastic Surgery within the Head & Neck (Otolaryngology) Physician"
    },
    {
        code: "207YX0602X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Otolaryngic Allergy Physician"
    },
    {
        code: "207YX0901X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Otology & Neurotology Physician"
    },
    {
        code: "207YX0905X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Otolaryngology/Facial Plastic Surgery Physician"
    },
    {
        code: "207ZB0001X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Blood Banking & Transfusion Medicine Physician"
    },
    {
        code: "207ZC0006X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Pathology Physician"
    },
    {
        code: "207ZC0008X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Informatics (Pathology) Physician"
    },
    {
        code: "207ZC0500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Cytopathology Physician"
    },
    {
        code: "207ZD0900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Dermatopathology (Pathology) Physician"
    },
    {
        code: "207ZF0201X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Forensic Pathology Physician"
    },
    {
        code: "207ZH0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hematology (Pathology) Physician"
    },
    {
        code: "207ZI0100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Immunopathology Physician"
    },
    {
        code: "207ZM0300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Medical Microbiology Physician"
    },
    {
        code: "207ZN0500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neuropathology Physician"
    },
    {
        code: "207ZP0007X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Molecular Genetic Pathology (Pathology) Physician"
    },
    {
        code: "207ZP0101X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Anatomic Pathology Physician"
    },
    {
        code: "207ZP0102X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Anatomic Pathology & Clinical Pathology Physician"
    },
    {
        code: "207ZP0104X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Chemical Pathology Physician"
    },
    {
        code: "207ZP0105X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Pathology/Laboratory Medicine Physician"
    },
    {
        code: "207ZP0213X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Pathology Physician"
    },
    {
        code: "208000000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatrics Physician"
    },
    {
        code: "2080A0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Adolescent Medicine Physician"
    },
    {
        code: "2080B0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Obesity Medicine Physician"
    },
    {
        code: "2080C0008X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Child Abuse Pediatrics Physician"
    },
    {
        code: "2080H0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Hospice and Palliative Medicine Physician"
    },
    {
        code: "2080I0007X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Clinical & Laboratory Immunology Physician"
    },
    {
        code: "2080N0001X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neonatal-Perinatal Medicine Physician"
    },
    {
        code: "2080P0006X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Developmental - Behavioral Pediatrics Physician"
    },
    {
        code: "2080P0008X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Neurodevelopmental Disabilities Physician"
    },
    {
        code: "2080P0201X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Allergy/Immunology Physician"
    },
    {
        code: "2080P0202X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Cardiology Physician"
    },
    {
        code: "2080P0203X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Critical Care Medicine Physician"
    },
    {
        code: "2080P0204X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Emergency Medicine (Pediatrics) Physician"
    },
    {
        code: "2080P0205X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Endocrinology Physician"
    },
    {
        code: "2080P0206X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Gastroenterology Physician"
    },
    {
        code: "2080P0207X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Hematology & Oncology Physician"
    },
    {
        code: "2080P0208X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Infectious Diseases Physician"
    },
    {
        code: "2080P0210X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Nephrology Physician"
    },
    {
        code: "2080P0214X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Pulmonology Physician"
    },
    {
        code: "2080P0216X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Rheumatology Physician"
    },
    {
        code: "2080S0010X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Sports Medicine Physician"
    },
    {
        code: "2080S0012X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Sleep Medicine Physician"
    },
    {
        code: "2080T0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Medical Toxicology Physician"
    },
    {
        code: "2080T0004X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Transplant Hepatology Physician"
    },
    {
        code: "208100000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Physical Medicine & Rehabilitation Physician"
    },
    {
        code: "2081H0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hospice and Palliative Medicine (Physical Medicine & Rehabilitation) Physician"
    },
    {
        code: "2081N0008X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neuromuscular Medicine (Physical Medicine & Rehabilitation) Physician"
    },
    {
        code: "2081P0004X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Spinal Cord Injury Medicine Physician"
    },
    {
        code: "2081P0010X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Rehabilitation Medicine Physician"
    },
    {
        code: "2081P0301X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Brain Injury Medicine (Physical Medicine & Rehabilitation) Physician"
    },
    {
        code: "2081P2900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pain Medicine (Physical Medicine & Rehabilitation) Physician"
    },
    {
        code: "2081S0010X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sports Medicine (Physical Medicine & Rehabilitation) Physician"
    },
    {
        code: "208200000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Plastic Surgery Physician"
    },
    {
        code: "2082S0099X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Plastic Surgery Within the Head and Neck (Plastic Surgery) Physician"
    },
    {
        code: "2082S0105X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Surgery of the Hand (Plastic Surgery) Physician"
    },
    {
        code: "2083A0100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Aerospace Medicine Physician"
    },
    {
        code: "2083A0300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Addiction Medicine (Preventive Medicine) Physician"
    },
    {
        code: "2083B0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Obesity Medicine (Preventive Medicine) Physician"
    },
    {
        code: "2083C0008X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Informatics Physician"
    },
    {
        code: "2083P0011X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Undersea and Hyperbaric Medicine (Preventive Medicine) Physician"
    },
    {
        code: "2083P0500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Preventive Medicine/Occupational Environmental Medicine Physician"
    },
    {
        code: "2083P0901X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Public Health & General Preventive Medicine Physician"
    },
    {
        code: "2083S0010X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sports Medicine (Preventive Medicine) Physician"
    },
    {
        code: "2083T0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Medical Toxicology (Preventive Medicine) Physician"
    },
    {
        code: "2083X0100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Occupational Medicine Physician"
    },
    {
        code: "2084A0401X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Addiction Medicine (Psychiatry & Neurology) Physician"
    },
    {
        code: "2084A2900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neurocritical Care Physician"
    },
    {
        code: "2084B0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Obesity Medicine (Psychiatry & Neurology) Physician"
    },
    {
        code: "2084B0040X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Behavioral Neurology & Neuropsychiatry Physician"
    },
    {
        code: "2084D0003X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Diagnostic Neuroimaging (Psychiatry & Neurology) Physician"
    },
    {
        code: "2084F0202X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Forensic Psychiatry Physician"
    },
    {
        code: "2084H0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hospice and Palliative Medicine (Psychiatry & Neurology) Physician"
    },
    {
        code: "2084N0008X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neuromuscular Medicine (Psychiatry & Neurology) Physician"
    },
    {
        code: "2084N0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neurology Physician"
    },
    {
        code: "2084N0402X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neurology with Special Qualifications in Child Neurology Physician"
    },
    {
        code: "2084N0600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Neurophysiology Physician"
    },
    {
        code: "2084P0005X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neurodevelopmental Disabilities Physician"
    },
    {
        code: "2084P0015X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Psychosomatic Medicine Physician"
    },
    {
        code: "2084P0301X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Brain Injury Medicine (Psychiatry & Neurology) Physician"
    },
    {
        code: "2084P0800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Psychiatry Physician"
    },
    {
        code: "2084P0802X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Addiction Psychiatry Physician"
    },
    {
        code: "2084P0804X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Child & Adolescent Psychiatry Physician"
    },
    {
        code: "2084P0805X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Geriatric Psychiatry Physician"
    },
    {
        code: "2084P2900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pain Medicine (Psychiatry & Neurology) Physician"
    },
    {
        code: "2084S0010X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sports Medicine (Psychiatry & Neurology) Physician"
    },
    {
        code: "2084S0012X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sleep Medicine (Psychiatry & Neurology) Physician"
    },
    {
        code: "2084V0102X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Vascular Neurology Physician"
    },
    {
        code: "2085B0100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Body Imaging Physician"
    },
    {
        code: "2085D0003X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Diagnostic Neuroimaging (Radiology) Physician"
    },
    {
        code: "2085H0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hospice and Palliative Medicine (Radiology) Physician"
    },
    {
        code: "2085N0700X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neuroradiology Physician"
    },
    {
        code: "2085N0904X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nuclear Radiology Physician"
    },
    {
        code: "2085P0229X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Radiology Physician"
    },
    {
        code: "2085R0001X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Radiation Oncology Physician"
    },
    {
        code: "2085R0202X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Diagnostic Radiology Physician"
    },
    {
        code: "2085R0203X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Therapeutic Radiology Physician"
    },
    {
        code: "2085R0204X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Vascular & Interventional Radiology Physician"
    },
    {
        code: "2085R0205X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Radiological Physics Physician"
    },
    {
        code: "2085U0001X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Diagnostic Ultrasound Physician"
    },
    {
        code: "208600000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Surgery Physician"
    },
    {
        code: "2086H0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hospice and Palliative Medicine (Surgery) Physician"
    },
    {
        code: "2086S0102X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Surgical Critical Care Physician"
    },
    {
        code: "2086S0105X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Surgery of the Hand (Surgery) Physician"
    },
    {
        code: "2086S0120X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Surgery Physician"
    },
    {
        code: "2086S0122X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Plastic and Reconstructive Surgery Physician"
    },
    {
        code: "2086S0127X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Trauma Surgery Physician"
    },
    {
        code: "2086S0129X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Vascular Surgery Physician"
    },
    {
        code: "2086X0206X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Surgical Oncology Physician"
    },
    {
        code: "208800000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Urology Physician"
    },
    {
        code: "2088F0040X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Female Pelvic Medicine and Reconstructive Surgery (Urology) Physician"
    },
    {
        code: "2088P0231X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Urology Physician"
    },
    {
        code: "208C00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Colon & Rectal Surgery Physician"
    },
    {
        code: "208D00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "General Practice Physician"
    },
    {
        code: "208G00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Thoracic Surgery (Cardiothoracic Vascular Surgery) Physician"
    },
    {
        code: "208M00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hospitalist Physician"
    },
    {
        code: "208U00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Pharmacology Physician"
    },
    {
        code: "208VP0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pain Medicine Physician"
    },
    {
        code: "208VP0014X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Interventional Pain Medicine Physician"
    },
    {
        code: "209800000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Legal Medicine (M.D./D.O.) Physician"
    },
    {
        code: "211D00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Podiatric Assistant"
    },
    {
        code: "213E00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Podiatrist"
    },
    {
        code: "213EP0504X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Public Medicine Podiatrist"
    },
    {
        code: "213EP1101X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Primary Podiatric Medicine Podiatrist"
    },
    {
        code: "213ER0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Radiology Podiatrist"
    },
    {
        code: "213ES0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sports Medicine Podiatrist"
    },
    {
        code: "213ES0103X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Foot & Ankle Surgery Podiatrist"
    },
    {
        code: "213ES0131X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Foot Surgery Podiatrist"
    },
    {
        code: "221700000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Art Therapist"
    },
    {
        code: "222Q00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Developmental Therapist"
    },
    {
        code: "222Z00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Orthotist"
    },
    {
        code: "224900000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Mastectomy Fitter"
    },
    {
        code: "224L00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pedorthist"
    },
    {
        code: "224P00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Prosthetist"
    },
    {
        code: "224Y00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Exercise Physiologist"
    },
    {
        code: "224Z00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Occupational Therapy Assistant"
    },
    {
        code: "224ZE0001X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Environmental Modification Occupational Therapy Assistant"
    },
    {
        code: "224ZF0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Feeding, Eating & Swallowing Occupational Therapy Assistant"
    },
    {
        code: "224ZL0004X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Low Vision Occupational Therapy Assistant"
    },
    {
        code: "224ZR0403X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Driving and Community Mobility Occupational Therapy Assistant"
    },
    {
        code: "225000000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Orthotic Fitter"
    },
    {
        code: "225100000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Physical Therapist"
    },
    {
        code: "2251C2600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Cardiopulmonary Physical Therapist"
    },
    {
        code: "2251E1200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ergonomics Physical Therapist"
    },
    {
        code: "2251E1300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Electrophysiology Physical Therapist"
    },
    {
        code: "2251G0304X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Geriatric Physical Therapist"
    },
    {
        code: "2251H1200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hand Physical Therapist"
    },
    {
        code: "2251H1300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Human Factors Physical Therapist"
    },
    {
        code: "2251N0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neurology Physical Therapist"
    },
    {
        code: "2251P0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Physical Therapist"
    },
    {
        code: "2251S0007X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sports Physical Therapist"
    },
    {
        code: "2251X0800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Orthopedic Physical Therapist"
    },
    {
        code: "225200000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Physical Therapy Assistant"
    },
    {
        code: "225400000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Rehabilitation Practitioner"
    },
    {
        code: "225500000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Respiratory/Developmental/Rehabilitative Specialist/Technologist"
    },
    {
        code: "2255A2300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Athletic Trainer"
    },
    {
        code: "2255R0406X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Blind Rehabilitation Specialist/Technologist"
    },
    {
        code: "225600000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Dance Therapist"
    },
    {
        code: "225700000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Massage Therapist"
    },
    {
        code: "225800000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Recreation Therapist"
    },
    {
        code: "225A00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Music Therapist"
    },
    {
        code: "225B00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pulmonary Function Technologist"
    },
    {
        code: "225C00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Rehabilitation Counselor"
    },
    {
        code: "225CA2400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Assistive Technology Practitioner Rehabilitation Counselor"
    },
    {
        code: "225CA2500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Assistive Technology Supplier Rehabilitation Counselor"
    },
    {
        code: "225CX0006X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Orientation and Mobility Training Rehabilitation Counselor"
    },
    {
        code: "225X00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Occupational Therapist"
    },
    {
        code: "225XE0001X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Environmental Modification Occupational Therapist"
    },
    {
        code: "225XE1200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ergonomics Occupational Therapist"
    },
    {
        code: "225XF0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Feeding, Eating & Swallowing Occupational Therapist"
    },
    {
        code: "225XG0600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Gerontology Occupational Therapist"
    },
    {
        code: "225XH1200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hand Occupational Therapist"
    },
    {
        code: "225XH1300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Human Factors Occupational Therapist"
    },
    {
        code: "225XL0004X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Low Vision Occupational Therapist"
    },
    {
        code: "225XM0800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Mental Health Occupational Therapist"
    },
    {
        code: "225XN1300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neurorehabilitation Occupational Therapist"
    },
    {
        code: "225XP0019X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Physical Rehabilitation Occupational Therapist"
    },
    {
        code: "225XP0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Occupational Therapist"
    },
    {
        code: "225XR0403X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Driving and Community Mobility Occupational Therapist"
    },
    {
        code: "226000000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Recreational Therapist Assistant"
    },
    {
        code: "226300000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Kinesiotherapist"
    },
    {
        code: "227800000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Certified Respiratory Therapist"
    },
    {
        code: "2278C0205X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Critical Care Certified Respiratory Therapist"
    },
    {
        code: "2278E0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Emergency Care Certified Respiratory Therapist"
    },
    {
        code: "2278E1000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Educational Certified Respiratory Therapist"
    },
    {
        code: "2278G0305X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Geriatric Care Certified Respiratory Therapist"
    },
    {
        code: "2278G1100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "General Care Certified Respiratory Therapist"
    },
    {
        code: "2278H0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Home Health Certified Respiratory Therapist"
    },
    {
        code: "2278P1004X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pulmonary Diagnostics Certified Respiratory Therapist"
    },
    {
        code: "2278P1005X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pulmonary Rehabilitation Certified Respiratory Therapist"
    },
    {
        code: "2278P1006X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pulmonary Function Technologist Certified Respiratory Therapist"
    },
    {
        code: "2278P3800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Palliative/Hospice Certified Respiratory Therapist"
    },
    {
        code: "2278P3900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neonatal/Pediatric Certified Respiratory Therapist"
    },
    {
        code: "2278P4000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Patient Transport Certified Respiratory Therapist"
    },
    {
        code: "2278S1500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "SNF/Subacute Care Certified Respiratory Therapist"
    },
    {
        code: "227900000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Registered Respiratory Therapist"
    },
    {
        code: "2279C0205X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Critical Care Registered Respiratory Therapist"
    },
    {
        code: "2279E0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Emergency Care Registered Respiratory Therapist"
    },
    {
        code: "2279E1000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Educational Registered Respiratory Therapist"
    },
    {
        code: "2279G0305X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Geriatric Care Registered Respiratory Therapist"
    },
    {
        code: "2279G1100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "General Care Registered Respiratory Therapist"
    },
    {
        code: "2279H0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Home Health Registered Respiratory Therapist"
    },
    {
        code: "2279P1004X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pulmonary Diagnostics Registered Respiratory Therapist"
    },
    {
        code: "2279P1005X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pulmonary Rehabilitation Registered Respiratory Therapist"
    },
    {
        code: "2279P1006X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pulmonary Function Technologist Registered Respiratory Therapist"
    },
    {
        code: "2279P3800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Palliative/Hospice Registered Respiratory Therapist"
    },
    {
        code: "2279P3900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neonatal/Pediatric Registered Respiratory Therapist"
    },
    {
        code: "2279P4000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Patient Transport Registered Respiratory Therapist"
    },
    {
        code: "2279S1500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "SNF/Subacute Care Registered Respiratory Therapist"
    },
    {
        code: "229N00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Anaplastologist"
    },
    {
        code: "231H00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Audiologist"
    },
    {
        code: "231HA2400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Assistive Technology Practitioner Audiologist"
    },
    {
        code: "231HA2500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Assistive Technology Supplier Audiologist"
    },
    {
        code: "235500000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Speech/Language/Hearing Specialist/Technologist"
    },
    {
        code: "2355A2700X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Audiology Assistant"
    },
    {
        code: "2355S0801X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Speech-Language Assistant"
    },
    {
        code: "235Z00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Speech-Language Pathologist"
    },
    {
        code: "237600000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Audiologist-Hearing Aid Fitter"
    },
    {
        code: "237700000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hearing Instrument Specialist"
    },
    {
        code: "242T00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Perfusionist"
    },
    {
        code: "243U00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Radiology Practitioner Assistant"
    },
    {
        code: "246Q00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pathology Specialist/Technologist"
    },
    {
        code: "246QB0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Blood Banking Specialist/Technologist"
    },
    {
        code: "246QC1000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Chemistry Pathology Specialist/Technologist"
    },
    {
        code: "246QC2700X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Cytotechnology Specialist/Technologist"
    },
    {
        code: "246QH0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hematology Specialist/Technologist"
    },
    {
        code: "246QH0401X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hemapheresis Practitioner"
    },
    {
        code: "246QH0600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Histology Specialist/Technologist"
    },
    {
        code: "246QI0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Immunology Pathology Specialist/Technologist"
    },
    {
        code: "246QL0900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Laboratory Management Specialist/Technologist"
    },
    {
        code: "246QL0901X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Diplomate Laboratory Management Specialist/Technologist"
    },
    {
        code: "246QM0706X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Medical Technologist"
    },
    {
        code: "246QM0900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Microbiology Specialist/Technologist"
    },
    {
        code: "246R00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pathology Technician"
    },
    {
        code: "246RH0600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Histology Technician"
    },
    {
        code: "246RM2200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Medical Laboratory Technician"
    },
    {
        code: "246RP1900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Phlebotomy Technician"
    },
    {
        code: "246W00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Cardiology Technician"
    },
    {
        code: "246X00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Cardiovascular Specialist/Technologist"
    },
    {
        code: "246XC2901X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Cardiovascular Invasive Specialist/Technologist"
    },
    {
        code: "246XC2903X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Vascular Specialist/Technologist"
    },
    {
        code: "246XS1301X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sonography Specialist/Technologist"
    },
    {
        code: "246Y00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Health Information Specialist/Technologist"
    },
    {
        code: "246YC3301X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hospital Based Coding Specialist"
    },
    {
        code: "246YC3302X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Physician Office Based Coding Specialist"
    },
    {
        code: "246YR1600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Registered Record Administrator"
    },
    {
        code: "246Z00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Other Specialist/Technologist"
    },
    {
        code: "246ZA2600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Medical Art Specialist/Technologist"
    },
    {
        code: "246ZB0301X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Biomedical Engineer"
    },
    {
        code: "246ZB0302X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Biomedical Photographer"
    },
    {
        code: "246ZB0500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Biochemist"
    },
    {
        code: "246ZB0600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Biostatiscian"
    },
    {
        code: "246ZC0007X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Surgical Assistant"
    },
    {
        code: "246ZE0500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "EEG Specialist/Technologist"
    },
    {
        code: "246ZE0600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Electroneurodiagnostic Specialist/Technologist"
    },
    {
        code: "246ZG0701X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Graphics Methods Specialist/Technologist"
    },
    {
        code: "246ZG1000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Medical Geneticist (PhD) Specialist/Technologist"
    },
    {
        code: "246ZI1000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Medical Illustrator"
    },
    {
        code: "246ZN0300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nephrology Specialist/Technologist"
    },
    {
        code: "246ZS0410X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Surgical Technologist"
    },
    {
        code: "246ZX2200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Orthopedic Assistant"
    },
    {
        code: "247000000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Health Information Technician"
    },
    {
        code: "2470A2800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Assistant Health Information Record Technician"
    },
    {
        code: "247100000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Radiologic Technologist"
    },
    {
        code: "2471B0102X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Bone Densitometry Radiologic Technologist"
    },
    {
        code: "2471C1101X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Cardiovascular-Interventional Technology Radiologic Technologist"
    },
    {
        code: "2471C1106X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Cardiac-Interventional Technology Radiologic Technologist"
    },
    {
        code: "2471C3401X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Computed Tomography Radiologic Technologist"
    },
    {
        code: "2471C3402X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Radiography Radiologic Technologist"
    },
    {
        code: "2471M1202X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Magnetic Resonance Imaging Radiologic Technologist"
    },
    {
        code: "2471M2300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Mammography Radiologic Technologist"
    },
    {
        code: "2471N0900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nuclear Medicine Technology Radiologic Technologist"
    },
    {
        code: "2471Q0001X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Quality Management Radiologic Technologist"
    },
    {
        code: "2471R0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Radiation Therapy Radiologic Technologist"
    },
    {
        code: "2471S1302X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sonography Radiologic Technologist"
    },
    {
        code: "2471V0105X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Vascular Sonography Radiologic Technologist"
    },
    {
        code: "2471V0106X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Vascular-Interventional Technology Radiologic Technologist"
    },
    {
        code: "247200000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Other Technician"
    },
    {
        code: "2472B0301X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Biomedical Engineering Technician"
    },
    {
        code: "2472D0500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Darkroom Technician"
    },
    {
        code: "2472E0500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "EEG Technician"
    },
    {
        code: "2472R0900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Renal Dialysis Technician"
    },
    {
        code: "2472V0600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Veterinary Technician"
    },
    {
        code: "247ZC0005X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Laboratory Director (Non-physician)"
    },
    {
        code: "363A00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Physician Assistant"
    },
    {
        code: "363AM0700X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Medical Physician Assistant"
    },
    {
        code: "363AS0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Surgical Physician Assistant"
    },
    {
        code: "363L00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nurse Practitioner"
    },
    {
        code: "363LA2100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Acute Care Nurse Practitioner"
    },
    {
        code: "363LA2200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Adult Health Nurse Practitioner"
    },
    {
        code: "363LC0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Critical Care Medicine Nurse Practitioner"
    },
    {
        code: "363LC1500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Community Health Nurse Practitioner"
    },
    {
        code: "363LF0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Family Nurse Practitioner"
    },
    {
        code: "363LG0600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Gerontology Nurse Practitioner"
    },
    {
        code: "363LN0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neonatal Nurse Practitioner"
    },
    {
        code: "363LN0005X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Critical Care Neonatal Nurse Practitioner"
    },
    {
        code: "363LP0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Nurse Practitioner"
    },
    {
        code: "363LP0222X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Critical Care Pediatric Nurse Practitioner"
    },
    {
        code: "363LP0808X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Psychiatric/Mental Health Nurse Practitioner"
    },
    {
        code: "363LP1700X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Perinatal Nurse Practitioner"
    },
    {
        code: "363LP2300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Primary Care Nurse Practitioner"
    },
    {
        code: "363LS0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "School Nurse Practitioner"
    },
    {
        code: "363LW0102X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Women's Health Nurse Practitioner"
    },
    {
        code: "363LX0001X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Obstetrics & Gynecology Nurse Practitioner"
    },
    {
        code: "363LX0106X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Occupational Health Nurse Practitioner"
    },
    {
        code: "364S00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Nurse Specialist"
    },
    {
        code: "364SA2100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Acute Care Clinical Nurse Specialist"
    },
    {
        code: "364SA2200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Adult Health Clinical Nurse Specialist"
    },
    {
        code: "364SC0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Critical Care Medicine Clinical Nurse Specialist"
    },
    {
        code: "364SC1501X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Community Health/Public Health Clinical Nurse Specialist"
    },
    {
        code: "364SC2300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Chronic Care Clinical Nurse Specialist"
    },
    {
        code: "364SE0003X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Emergency Clinical Nurse Specialist"
    },
    {
        code: "364SE1400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ethics Clinical Nurse Specialist"
    },
    {
        code: "364SF0001X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Family Health Clinical Nurse Specialist"
    },
    {
        code: "364SG0600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Gerontology Clinical Nurse Specialist"
    },
    {
        code: "364SH0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Home Health Clinical Nurse Specialist"
    },
    {
        code: "364SH1100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Holistic Clinical Nurse Specialist"
    },
    {
        code: "364SI0800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Informatics Clinical Nurse Specialist"
    },
    {
        code: "364SL0600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Long-Term Care Clinical Nurse Specialist"
    },
    {
        code: "364SM0705X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Medical-Surgical Clinical Nurse Specialist"
    },
    {
        code: "364SN0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neonatal Clinical Nurse Specialist"
    },
    {
        code: "364SN0800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Neuroscience Clinical Nurse Specialist"
    },
    {
        code: "364SP0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Clinical Nurse Specialist"
    },
    {
        code: "364SP0807X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Child & Adolescent Psychiatric/Mental Health Clinical Nurse Specialist"
    },
    {
        code: "364SP0808X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Psychiatric/Mental Health Clinical Nurse Specialist"
    },
    {
        code: "364SP0809X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Adult Psychiatric/Mental Health Clinical Nurse Specialist"
    },
    {
        code: "364SP0810X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Child & Family Psychiatric/Mental Health Clinical Nurse Specialist"
    },
    {
        code: "364SP0811X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Chronically Ill Psychiatric/Mental Health Clinical Nurse Specialist"
    },
    {
        code: "364SP0812X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Community Psychiatric/Mental Health Clinical Nurse Specialist"
    },
    {
        code: "364SP0813X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Geropsychiatric Psychiatric/Mental Health Clinical Nurse Specialist"
    },
    {
        code: "364SP1700X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Perinatal Clinical Nurse Specialist"
    },
    {
        code: "364SP2800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Perioperative Clinical Nurse Specialist"
    },
    {
        code: "364SR0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Rehabilitation Clinical Nurse Specialist"
    },
    {
        code: "364SS0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "School Clinical Nurse Specialist"
    },
    {
        code: "364ST0500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Transplantation Clinical Nurse Specialist"
    },
    {
        code: "364SW0102X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Women's Health Clinical Nurse Specialist"
    },
    {
        code: "364SX0106X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Occupational Health Clinical Nurse Specialist"
    },
    {
        code: "364SX0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Oncology Clinical Nurse Specialist"
    },
    {
        code: "364SX0204X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Oncology Clinical Nurse Specialist"
    },
    {
        code: "367500000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Certified Registered Nurse Anesthetist"
    },
    {
        code: "367A00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Advanced Practice Midwife"
    },
    {
        code: "367H00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Anesthesiologist Assistant"
    },
    {
        code: "372500000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Chore Provider"
    },
    {
        code: "372600000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Adult Companion"
    },
    {
        code: "373H00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Day Training/Habilitation Specialist"
    },
    {
        code: "374700000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Technician"
    },
    {
        code: "3747A0650X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Attendant Care Provider"
    },
    {
        code: "3747P1801X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Personal Care Attendant"
    },
    {
        code: "374J00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Doula"
    },
    {
        code: "374K00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Religious Nonmedical Practitioner"
    },
    {
        code: "374T00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Religious Nonmedical Nursing Personnel"
    },
    {
        code: "374U00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Home Health Aide"
    },
    {
        code: "376G00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nursing Home Administrator"
    },
    {
        code: "376J00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Homemaker"
    },
    {
        code: "376K00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nurse's Aide"
    },
    {
        code: "405300000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Prevention Professional"
    },
    {
        code: "251300000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Local Education Agency (LEA)"
    },
    {
        code: "251B00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Case Management Agency"
    },
    {
        code: "251C00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Developmentally Disabled Services Day Training Agency"
    },
    {
        code: "251E00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Home Health Agency"
    },
    {
        code: "251F00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Home Infusion Agency"
    },
    {
        code: "251G00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Community Based Hospice Care Agency"
    },
    {
        code: "251J00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nursing Care Agency"
    },
    {
        code: "251K00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Public Health or Welfare Agency"
    },
    {
        code: "251S00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Community/Behavioral Health Agency"
    },
    {
        code: "251T00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "PACE Provider Organization"
    },
    {
        code: "251V00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Voluntary or Charitable Agency"
    },
    {
        code: "251X00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Supports Brokerage Agency"
    },
    {
        code: "252Y00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Early Intervention Provider Agency"
    },
    {
        code: "253J00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Foster Care Agency"
    },
    {
        code: "253Z00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "In Home Supportive Care Agency"
    },
    {
        code: "261Q00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinic/Center"
    },
    {
        code: "261QA0005X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ambulatory Family Planning Facility"
    },
    {
        code: "261QA0006X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ambulatory Fertility Facility"
    },
    {
        code: "261QA0600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Adult Day Care Clinic/Center"
    },
    {
        code: "261QA0900X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Amputee Clinic/Center"
    },
    {
        code: "261QA1903X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ambulatory Surgical Clinic/Center"
    },
    {
        code: "261QA3000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Augmentative Communication Clinic/Center"
    },
    {
        code: "261QB0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Birthing Clinic/Center"
    },
    {
        code: "261QC0050X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Critical Access Hospital Clinic/Center"
    },
    {
        code: "261QC1500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Community Health Clinic/Center"
    },
    {
        code: "261QC1800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Corporate Health Clinic/Center"
    },
    {
        code: "261QD0000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Dental Clinic/Center"
    },
    {
        code: "261QD1600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Developmental Disabilities Clinic/Center"
    },
    {
        code: "261QE0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Emergency Care Clinic/Center"
    },
    {
        code: "261QE0700X",
        system: "http://nucc.org/provider-taxonomy",
        display: "End-Stage Renal Disease (ESRD) Treatment Clinic/Center"
    },
    {
        code: "261QE0800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Endoscopy Clinic/Center"
    },
    {
        code: "261QF0050X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Non-Surgical Family Planning Clinic/Center"
    },
    {
        code: "261QF0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Federally Qualified Health Center (FQHC)"
    },
    {
        code: "261QG0250X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Genetics Clinic/Center"
    },
    {
        code: "261QH0100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Health Service Clinic/Center"
    },
    {
        code: "261QH0700X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hearing and Speech Clinic/Center"
    },
    {
        code: "261QI0500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Infusion Therapy Clinic/Center"
    },
    {
        code: "261QL0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Lithotripsy Clinic/Center"
    },
    {
        code: "261QM0801X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Mental Health Clinic/Center (Including Community Mental Health Center)"
    },
    {
        code: "261QM0850X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Adult Mental Health Clinic/Center"
    },
    {
        code: "261QM0855X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Adolescent and Children Mental Health Clinic/Center"
    },
    {
        code: "261QM1000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Migrant Health Clinic/Center"
    },
    {
        code: "261QM1100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Military/U.S. Coast Guard Outpatient Clinic/Center"
    },
    {
        code: "261QM1101X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Military and U.S. Coast Guard Ambulatory Procedure Clinic/Center"
    },
    {
        code: "261QM1102X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Military Outpatient Operational (Transportable) Component Clinic/Center"
    },
    {
        code: "261QM1103X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Military Ambulatory Procedure Visits Operational (Transportable) Clinic/Center"
    },
    {
        code: "261QM1200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Magnetic Resonance Imaging (MRI) Clinic/Center"
    },
    {
        code: "261QM1300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Multi-Specialty Clinic/Center"
    },
    {
        code: "261QM2500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Medical Specialty Clinic/Center"
    },
    {
        code: "261QM2800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Methadone Clinic"
    },
    {
        code: "261QM3000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Medically Fragile Infants and Children Day Care"
    },
    {
        code: "261QP0904X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Federal Public Health Clinic/Center"
    },
    {
        code: "261QP0905X",
        system: "http://nucc.org/provider-taxonomy",
        display: "State or Local Public Health Clinic/Center"
    },
    {
        code: "261QP1100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Podiatric Clinic/Center"
    },
    {
        code: "261QP2000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Physical Therapy Clinic/Center"
    },
    {
        code: "261QP2300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Primary Care Clinic/Center"
    },
    {
        code: "261QP2400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Prison Health Clinic/Center"
    },
    {
        code: "261QP3300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pain Clinic/Center"
    },
    {
        code: "261QR0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Radiology Clinic/Center"
    },
    {
        code: "261QR0206X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Mammography Clinic/Center"
    },
    {
        code: "261QR0207X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Mobile Mammography Clinic/Center"
    },
    {
        code: "261QR0208X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Mobile Radiology Clinic/Center"
    },
    {
        code: "261QR0400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Rehabilitation Clinic/Center"
    },
    {
        code: "261QR0401X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Comprehensive Outpatient Rehabilitation Facility (CORF)"
    },
    {
        code: "261QR0404X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Cardiac Rehabilitation Clinic/Center"
    },
    {
        code: "261QR0405X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Substance Use Disorder Rehabilitation Clinic/Center"
    },
    {
        code: "261QR0800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Recovery Care Clinic/Center"
    },
    {
        code: "261QR1100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Research Clinic/Center"
    },
    {
        code: "261QR1300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Rural Health Clinic/Center"
    },
    {
        code: "261QS0112X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Oral and Maxillofacial Surgery Clinic/Center"
    },
    {
        code: "261QS0132X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ophthalmologic Surgery Clinic/Center"
    },
    {
        code: "261QS1000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Student Health Clinic/Center"
    },
    {
        code: "261QS1200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Sleep Disorder Diagnostic Clinic/Center"
    },
    {
        code: "261QU0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Urgent Care Clinic/Center"
    },
    {
        code: "261QV0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "VA Clinic/Center"
    },
    {
        code: "261QX0100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Occupational Medicine Clinic/Center"
    },
    {
        code: "261QX0200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Oncology Clinic/Center"
    },
    {
        code: "261QX0203X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Radiation Oncology Clinic/Center"
    },
    {
        code: "273100000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Epilepsy Hospital Unit"
    },
    {
        code: "273R00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Psychiatric Hospital Unit"
    },
    {
        code: "273Y00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Rehabilitation Hospital Unit"
    },
    {
        code: "275N00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Medicare Defined Swing Bed Hospital Unit"
    },
    {
        code: "276400000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Substance Use Disorder Rehabilitation Hospital Unit"
    },
    {
        code: "281P00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Chronic Disease Hospital"
    },
    {
        code: "281PC2000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Children' s Chronic Disease Hospital"
    },
    {
        code: "282E00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Long Term Care Hospital"
    },
    {
        code: "282J00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Religious Nonmedical Health Care Institution"
    },
    {
        code: "282N00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "General Acute Care Hospital"
    },
    {
        code: "282NC0060X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Critical Access Hospital"
    },
    {
        code: "282NC2000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Children's Hospital"
    },
    {
        code: "282NR1301X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Rural Acute Care Hospital"
    },
    {
        code: "282NW0100X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Women's Hospital"
    },
    {
        code: "283Q00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Psychiatric Hospital"
    },
    {
        code: "283X00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Rehabilitation Hospital"
    },
    {
        code: "283XC2000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Children's Rehabilitation Hospital"
    },
    {
        code: "284300000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Special Hospital"
    },
    {
        code: "286500000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Military Hospital"
    },
    {
        code: "2865M2000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Military General Acute Care Hospital"
    },
    {
        code: "2865X1600X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Operational (Transportable) Military General Acute Care Hospital"
    },
    {
        code: "291900000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Military Clinical Medical Laboratory"
    },
    {
        code: "291U00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinical Medical Laboratory"
    },
    {
        code: "292200000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Dental Laboratory"
    },
    {
        code: "293D00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Physiological Laboratory"
    },
    {
        code: "302F00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Exclusive Provider Organization"
    },
    {
        code: "302R00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Health Maintenance Organization"
    },
    {
        code: "305R00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Preferred Provider Organization"
    },
    {
        code: "305S00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Point of Service"
    },
    {
        code: "310400000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Assisted Living Facility"
    },
    {
        code: "3104A0625X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Assisted Living Facility (Mental Illness)"
    },
    {
        code: "3104A0630X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Assisted Living Facility (Behavioral Disturbances)"
    },
    {
        code: "310500000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Mental Illness Intermediate Care Facility"
    },
    {
        code: "311500000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Alzheimer Center (Dementia Center)"
    },
    {
        code: "311Z00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Custodial Care Facility"
    },
    {
        code: "311ZA0620X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Adult Care Home Facility"
    },
    {
        code: "313M00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nursing Facility/Intermediate Care Facility"
    },
    {
        code: "314000000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Skilled Nursing Facility"
    },
    {
        code: "3140N1450X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pediatric Skilled Nursing Facility"
    },
    {
        code: "315D00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Inpatient Hospice"
    },
    {
        code: "315P00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Intellectual Disabilities Intermediate Care Facility"
    },
    {
        code: "174200000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Meals Provider"
    },
    {
        code: "177F00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Lodging Provider"
    },
    {
        code: "320600000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Intellectual and/or Developmental Disabilities Residential Treatment Facility"
    },
    {
        code: "320700000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Physical Disabilities Residential Treatment Facility"
    },
    {
        code: "320800000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Mental Illness Community Based Residential Treatment Facility"
    },
    {
        code: "320900000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Intellectual and/or Developmental Disabilities Community Based Residential Treatment Facility"
    },
    {
        code: "322D00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Emotionally Disturbed Childrens' Residential Treatment Facility"
    },
    {
        code: "323P00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Psychiatric Residential Treatment Facility"
    },
    {
        code: "324500000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Substance Abuse Rehabilitation Facility"
    },
    {
        code: "3245S0500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Children's Substance Abuse Rehabilitation Facility"
    },
    {
        code: "385H00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Respite Care"
    },
    {
        code: "385HR2050X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Respite Care Camp"
    },
    {
        code: "385HR2055X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Child Mental Illness Respite Care"
    },
    {
        code: "385HR2060X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Child Intellectual and/or Developmental Disabilities Respite Care"
    },
    {
        code: "385HR2065X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Child Physical Disabilities Respite Care"
    },
    {
        code: "331L00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Blood Bank"
    },
    {
        code: "332000000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Military/U.S. Coast Guard Pharmacy"
    },
    {
        code: "332100000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Department of Veterans Affairs (VA) Pharmacy"
    },
    {
        code: "332800000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Indian Health Service/Tribal/Urban Indian Health (I/T/U) Pharmacy"
    },
    {
        code: "332900000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Non-Pharmacy Dispensing Site"
    },
    {
        code: "332B00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Durable Medical Equipment & Medical Supplies"
    },
    {
        code: "332BC3200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Customized Equipment (DME)"
    },
    {
        code: "332BD1200X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Dialysis Equipment & Supplies (DME)"
    },
    {
        code: "332BN1400X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nursing Facility Supplies (DME)"
    },
    {
        code: "332BP3500X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Parenteral & Enteral Nutrition Supplies (DME)"
    },
    {
        code: "332BX2000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Oxygen Equipment & Supplies (DME)"
    },
    {
        code: "332G00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Eye Bank"
    },
    {
        code: "332H00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Eyewear Supplier"
    },
    {
        code: "332S00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Hearing Aid Equipment"
    },
    {
        code: "332U00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Home Delivered Meals"
    },
    {
        code: "333300000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Emergency Response System Companies"
    },
    {
        code: "333600000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Pharmacy"
    },
    {
        code: "3336C0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Clinic Pharmacy"
    },
    {
        code: "3336C0003X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Community/Retail Pharmacy"
    },
    {
        code: "3336C0004X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Compounding Pharmacy"
    },
    {
        code: "3336H0001X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Home Infusion Therapy Pharmacy"
    },
    {
        code: "3336I0012X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Institutional Pharmacy"
    },
    {
        code: "3336L0003X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Long Term Care Pharmacy"
    },
    {
        code: "3336M0002X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Mail Order Pharmacy"
    },
    {
        code: "3336M0003X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Managed Care Organization Pharmacy"
    },
    {
        code: "3336N0007X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Nuclear Pharmacy"
    },
    {
        code: "3336S0011X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Specialty Pharmacy"
    },
    {
        code: "335E00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Prosthetic/Orthotic Supplier"
    },
    {
        code: "335G00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Medical Foods Supplier"
    },
    {
        code: "335U00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Organ Procurement Organization"
    },
    {
        code: "335V00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Portable X-ray and/or Other Portable Diagnostic Imaging Supplier"
    },
    {
        code: "341600000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Ambulance"
    },
    {
        code: "3416A0800X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Air Ambulance"
    },
    {
        code: "3416L0300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Land Ambulance"
    },
    {
        code: "3416S0300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Water Ambulance"
    },
    {
        code: "341800000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Military/U.S. Coast Guard Transport,"
    },
    {
        code: "3418M1110X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Military or U.S. Coast Guard Ground Transport Ambulance"
    },
    {
        code: "3418M1120X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Military or U.S. Coast Guard Air Transport Ambulance"
    },
    {
        code: "3418M1130X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Military or U.S. Coast Guard Water Transport Ambulance"
    },
    {
        code: "342000000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Transportation Network Company"
    },
    {
        code: "343800000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Secured Medical Transport (VAN)"
    },
    {
        code: "343900000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Non-emergency Medical Transport (VAN)"
    },
    {
        code: "344600000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Taxi"
    },
    {
        code: "344800000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Air Carrier"
    },
    {
        code: "347B00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Bus"
    },
    {
        code: "347C00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Private Vehicle"
    },
    {
        code: "347D00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Train"
    },
    {
        code: "347E00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Transportation Broker"
    },
    {
        code: "202D00000X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Integrative Medicine Physician"
    },
    {
        code: "207VC0300X",
        system: "http://nucc.org/provider-taxonomy",
        display: "Complex Family Planning Physician"
    }
]

export const specialitiesData = specialitiesList.sort((a, b) =>
    a.display.localeCompare(b.display)
);