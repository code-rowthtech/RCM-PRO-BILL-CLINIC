import { loggedInUser } from "../../../../../helpers/api/loggedInUser";

export const handlePrintEverything = (printData) => {
    const originalContent = document?.body?.innerHTML;
    const addressData = printData?.patientDetails?.address;
    const relatedAddressData = printData?.patientDetails?.relatedPerson?.address;
    const referringAddressData = printData?.patientDetails?.referringDocId?.address;
    const selectedAddress =
        addressData?.find(a => a.type === 'physical') ||
        addressData?.find(a => a.type === 'postal') ||
        addressData?.find(a => a.type === 'both');

    const selectedRelatedPersonAddress =
        relatedAddressData?.find(a => a.type === 'physical') ||
        relatedAddressData?.find(a => a.type === 'postal') ||
        relatedAddressData?.find(a => a.type === 'both');

    const selectedReferringAddress =
        referringAddressData?.find(a => a.type === 'physical') ||
        referringAddressData?.find(a => a.type === 'postal') ||
        referringAddressData?.find(a => a.type === 'both');

    const addressString = selectedAddress
        ? `${selectedAddress?.line?.join(', ')}, ${selectedAddress?.city}, ${selectedAddress?.state}, ${selectedAddress?.postalCode || ''}`
        : 'Not available';

    const relatedAddressString = selectedRelatedPersonAddress
        ? `${selectedRelatedPersonAddress?.line?.join(', ')}, ${selectedRelatedPersonAddress?.city}, ${selectedRelatedPersonAddress?.state}, ${selectedRelatedPersonAddress?.postalCode || ''}`
        : 'Not available';

    const referringAddressString = selectedRelatedPersonAddress
        ? `${selectedReferringAddress?.line?.join(', ')}, ${selectedReferringAddress?.city}, ${selectedReferringAddress?.state}, ${selectedReferringAddress?.postalCode || ''}`
        : 'Not available';

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        } catch (e) {
            return '';
        }
    };

    const statusClass = (status) => {
        const map = {
            active: 'status-success',
            'on-hold': 'status-warning',
            cancelled: 'status-danger',
            completed: 'status-primary',
            'entered-in-error': 'status-danger',
            stopped: 'status-secondary',
            draft: 'status-muted',
            unknown: 'status-dark',
        };
        return map[status] || '';
    };

    const capitalizeFirst = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // VITALS
    const vitalTypes = [
        { key: 'Height', display: 'Height', unit: 'cm/in' },
        { key: 'Weight', display: 'Weight', unit: 'kg/lbs' },
        { key: 'BMI', display: 'BMI', unit: 'kg/m²' },
        { key: 'BMI Percentile', display: 'BMI Percentile', unit: '%' },
        { key: 'Blood Pressure', display: 'BP', unit: 'mmHg' },
        { key: 'Temperature', display: 'Temperature', unit: '°C/°F' },
        { key: 'Pulse', display: 'Pulse', unit: 'bpm' },
        { key: 'Respiratory Rate', display: 'Respiratory Rate', unit: 'rpm' },
        { key: 'Oxygen Saturation', display: 'O₂ Saturation', unit: '%' },
        { key: 'Pain', display: 'Pain', unit: '(0-10)' },
        { key: 'Head Circumference', display: 'Head Circumference', unit: 'cm/in' },
        { key: 'Smoking Status', display: 'Smoking Status', unit: '' },
        { key: 'Weight-for-Length Percentile', display: 'Weight-for-Length %', unit: '%' },
        { key: 'Head Occipital-frontal Circumference Percentile', display: 'Head Circumference %', unit: '%' },
        { key: 'Oxygen Concentration', display: 'O₂ Concentration', unit: '%' },
        { key: 'Inhaled Oxygen Flow Rate', display: 'O₂ Flow Rate', unit: 'l/min' }
    ];

    // Group by date and sort chronologically
    const groupedByDate = printData?.vitals?.reduce((acc, vitalGroup) => {
        const date = new Date(vitalGroup?.effectiveDateTime).toLocaleDateString('en-GB');
        const time = new Date(vitalGroup?.effectiveDateTime).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const key = `${date} (${time})`;

        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(...vitalGroup?.vitals);
        return acc;
    }, {});

    // Sort dates chronologically
    const sortedDates = groupedByDate && typeof groupedByDate === 'object'
        ? Object.keys(groupedByDate).sort((a, b) => {
            return new Date(a.split(' ')[0].split('/').reverse().join('-')) -
                new Date(b.split(' ')[0].split('/').reverse().join('-'));
        })
        : [];


    // Function to get vital value with proper formatting
    const getVitalValue = (entries, type) => {
        const vital = entries.find(v =>
            v.code?.text === type.key ||
            v.code?.coding?.[0]?.display === type.key
        );

        if (!vital) return '';

        // Handle blood pressure specially
        if (vital.component?.length > 0) {
            const systolic = vital.component.find(c =>
                c.code?.coding?.[0]?.code === '8480-6' ||
                c.code?.coding?.[0]?.display?.includes('Systolic')
            )?.valueQuantity?.value;

            const diastolic = vital.component.find(c =>
                c.code?.coding?.[0]?.code === '8462-4' ||
                c.code?.coding?.[0]?.display?.includes('Diastolic')
            )?.valueQuantity?.value;

            return systolic && diastolic ? `${systolic}/${diastolic} mmHg` : '';
        }

        // Handle string values (like Smoking Status)
        if (vital?.valueString) {
            return vital?.valueString;
        }

        // Handle quantity values
        if (vital?.valueQuantity) {
            return `${vital?.valueQuantity.value} ${vital?.valueQuantity.unit || ''}`.trim();
        }

        return '';
    };

    // Generate table rows
    const rows = vitalTypes?.map(type => {
        const rowData = sortedDates.map(date => {
            return getVitalValue(groupedByDate[date], type);
        });

        const tds = rowData.map(val => `<td>${val || '-'}</td>`).join('');
        return `<tr><td>${type?.display} (${type?.unit})</td>${tds}</tr>`;
    });

    const printContent = `   
    <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Medical Encounter Report</title>
            <style>
                @media print {
                    @page {
                        margin: 0.5in;
                        size: A4;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                        color-adjust: exact;
                    }
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.4;
                    color: #333;
                    background: white;
                }

                .header {
                    background: linear-gradient(135deg, rgb(249, 139, 55) 0%,rgba(97, 104, 208, 0.79) 100%);
                    color: white;
                    padding: 20px;
                    margin-bottom: 30px;
                    border-radius: 8px;
                }

                .header h1 {
                    font-size: 24px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }

                .header-info {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 15px;
                    font-size: 14px;
                }

                .patient-info {
                    background: #f8fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 25px;
                }

                .patient-info h2 {
                    color: #6169D0;
                    font-size: 18px;
                    margin-bottom: 15px;
                    border-bottom: 2px solid #6169D0;
                    padding-bottom: 8px;
                }

                .patient-details {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                }

                .detail-item {
                    display: flex;
                    flex-direction: column;
                }

                .detail-label {
                    font-weight: 600;
                    color: #374151;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 4px;
                }

                .detail-value {
                    font-size: 14px;
                    color: #1f2937;
                }

                .encounter-section {
                    margin-bottom: 25px;
                    break-inside: avoid;
                }

                .section-header {
                    background: #6169D0;
                    color: white;
                    padding: 12px 16px;
                    font-weight: 600;
                    font-size: 16px;
                    border-radius: 6px 6px 0 0;
                    margin-bottom: 0;
                }

                .section-content {
                    background: white;
                    border: 2px solid #6169D0;
                    border-top: none;
                    padding: 20px;
                    border-radius: 0 0 6px 6px;
                    min-height: 60px;
                }

                .vitals-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 12px;
                    margin-top: 10px;
                }

                .vital-item {
                    background: #f1f5f9;
                    padding: 8px 12px;
                    border-radius: 4px;
                    text-align: center;
                    border-left: 3px solid #3b82f6;
                }

                .vital-label {
                    font-size: 11px;
                    color: #64748b;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .vital-value {
                    font-size: 14px;
                    font-weight: 600;
                    color: #1e40af;
                    margin-top: 2px;
                }

                .prescription-item {
                    background: #fef3e2;
                    border: 1px solid #f59e0b;
                    border-radius: 6px;
                    padding: 15px;
                    margin-bottom: 10px;
                    border-left: 4px solid #f59e0b;
                }

                .prescription-header {
                    font-weight: 600;
                    color: #92400e;
                    margin-bottom: 8px;
                    font-size: 15px;
                }

                .assessment-list {
                    counter-reset: assessment-counter;
                }

                .assessment-item {
                    counter-increment: assessment-counter;
                    margin-bottom: 8px;
                    padding-left: 25px;
                    position: relative;
                }

                .assessment-item::before {
                    content: counter(assessment-counter);
                    position: absolute;
                    left: 0;
                    top: 0;
                    background: #1e40af;
                    color: white;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: 600;
                }

                .lab-results {
                    background: #f0fdf4;
                    border: 1px solid #16a34a;
                    border-radius: 6px;
                    padding: 15px;
                    margin-top: 10px;
                    border-left: 4px solid #16a34a;
                }

                .emergency-banner {
                    background: #fee2e2;
                    border: 2px solid #dc2626;
                    color: #dc2626;
                    padding: 15px;
                    margin-bottom: 20px;
                    border-radius: 6px;
                    font-weight: 600;
                    text-align: center;
                    font-size: 16px;
                }

                .provider-signature {
                    margin-top: 30px;
                    padding: 20px;
                    background: #f9fafb;
                    border-radius: 6px;
                    border: 1px solid #d1d5db;
                    text-align:right;
                }

                .signature-line {
                    width: 300px;
                    margin: 20px 0 10px 0;
                }

                ol, ul {
                    margin-left: 20px;
                    margin-top: 10px;
                }

                li {
                    margin-bottom: 5px;
                }

                p {
                    margin-bottom: 10px;
                    text-align: justify;
                }

                .text-content {
                    white-space: pre-line;
                    line-height: 1.5;
                }

                @media print {
                    .no-print {
                        display: none;
                    }
                    
                    .encounter-section {
                        page-break-inside: avoid;
                    }
                    
                    .header {
                        page-break-after: avoid;
                    }
                }
                    .summary-headers{
width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    }
                     .status-success { background-color: #d4edda; color: #155724; }
    .status-warning { background-color: #fff3cd; color: #856404; }
    .status-danger { background-color: #f8d7da; color: #721c24; }
    .status-primary { background-color: #cce5ff; color: #004085; }
    .status-secondary { background-color: #e2e3e5; color: #383d41; }
    .status-muted { background-color: #f7f7f7; color: #6c757d; }
    .status-dark { background-color: #d6d8d9; color: #1b1e21; }

     table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      page-break-inside: avoid;
      box-shadow: none !important;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 6px;
      text-align: center;
    }
    th {
      background-color: #f2f2f2;
      font-weight: bold;
      color: black !important;
    }
            </style>
        </head>
        <body>
            <div class="header">
            <img src=${loggedInUser?.logo?.split('?')[0]}/>
                <h1>Patient Summary</h1>
            </div>
${printData?.toBePrinted?.some((data) => data === 'Patient Details') ?
            ` <div class="patient-info">
                <h2>Patient Information</h2>
                <div class="patient-details">
                    <div class="detail-item">
                        <span class="detail-label">Name</span>
                        <span class="detail-value">${printData?.patientDetails?.name?.find((data) => data?.use === 'official')?.text || 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">DOB</span>
                        <span class="detail-value">${printData?.patientDetails?.birthDate ? new Date(printData?.patientDetails?.birthDate)?.toISOString()?.split('T')[0] : 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Gender</span>
                        <span class="detail-value">${printData?.patientDetails?.gender || 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email</span>
                        <span class="detail-value">${printData?.patientDetails?.telecom?.find((data) => data?.system === 'email')?.value || 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Contact no.</span>
                        <span class="detail-value">${'+1-' + printData?.patientDetails?.telecom?.find((data) => data?.system === 'phone')?.value || 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Address</span>
                        <span class="detail-value">${addressString}</span>
                    </div>
                </div>
            </div>`
            :
            ''
        }

        ${printData?.toBePrinted?.some((data) => data === 'Responsible Party') ?
            ` <div class="patient-info">
                <h2>Responsible Party</h2>
                <div class="patient-details">
                    <div class="detail-item">
                        <span class="detail-label">Name</span>
                        <span class="detail-value">${printData?.patientDetails?.relatedPerson?.name?.[0]?.prefix + ' ' || ''}
                        ${printData?.patientDetails?.relatedPerson?.name?.[0]?.text + ' ' || 'Not available'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Relation</span>
                        <span class="detail-value"> ${printData?.patientDetails?.relatedPerson?.relationship?.[0]?.coding?.[0]?.display || 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Phone No.</span>
                        <span class="detail-value">${'+1-' + printData?.patientDetails?.relatedPerson?.telecom?.find((data) => data?.system === 'phone')?.value || 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Gender</span>
                        <span class="detail-value">${printData?.patientDetails?.relatedPerson?.gender || 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Address</span>
                        <span class="detail-value">${relatedAddressString}</span>
                    </div>
                </div>
            </div>`
            :
            ''
        }
     
            ${printData?.toBePrinted?.some((data) => data === "Referring Doctor") ?
            ` <div class="patient-info">
                   <h2>Referring Doctor</h2>
                   <div class="patient-details">
                       <div class="detail-item">
                           <span class="detail-label">Name</span>
                           <span class="detail-value">${printData?.patientDetails?.referringDocId?.name?.[0]?.prefix + ' ' || ''}
                          ${printData?.patientDetails?.referringDocId?.name?.[0]
                ? `${printData?.patientDetails?.referringDocId?.name?.[0]?.given?.join(' ') || ''} ${printData?.patientDetails?.referringDocId?.name?.[0]?.family || ''}`?.trim()
                : 'Not available'
            }

                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Phone No.</span>
                        <span class="detail-value">${'+1-' + printData?.patientDetails?.referringDocId?.telecom?.find((data) => data?.system === 'phone')?.value || 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Address</span>
                        <span class="detail-value">${referringAddressString}</span>
                    </div>
                </div>
            </div>`
            :
            ''
        }
           
        ${printData?.toBePrinted?.some((data) => data === "Referring Doctor") ?
            ` <div class="patient-info">
                   <h2>Referring Doctor</h2>
                   <div class="patient-details">
                       <div class="detail-item">
                           <span class="detail-label">Name</span>
                           <span class="detail-value">${printData?.patientDetails?.referringDocId?.name?.[0]?.prefix + ' ' || ''}
                          ${printData?.patientDetails?.referringDocId?.name?.[0]
                ? `${printData?.patientDetails?.referringDocId?.name?.[0]?.given?.join(' ') || ''} ${printData?.patientDetails?.referringDocId?.name?.[0]?.family || ''}`?.trim()
                : 'Not available'
            }

                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Phone No.</span>
                        <span class="detail-value">${'+1-' + printData?.patientDetails?.referringDocId?.telecom?.find((data) => data?.system === 'phone')?.value || 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Address</span>
                        <span class="detail-value">${referringAddressString}</span>
                    </div>
                </div>
            </div>`
            :
            ''
        }
       
        ${printData?.toBePrinted?.some((data) => data === "Allergies") ?
            ` <div class="patient-info">
                   <h2>Allergies</h2>

        ${printData?.allergyData?.map((allergy, index) => (
                `<div class="summary-headers">
                    <b class="detail-label">
        ${index + 1 + '.'} ${allergy?.code?.text || allergy?.code?.coding?.[0]?.display || ' '}
                    <small>${allergy?.code?.coding?.[0]?.code || ''}</small>
                    </b>
                     <div class="detail-value">
                     <p>
                     ${formatDate(allergy?.onset?.onsetDateTime)}
                     </p>
                     <p class="${statusClass(allergy?.clinicalStatus?.text?.toLowerCase() || allergy?.clinicalStatus?.coding?.[0]?.display?.toLowerCase())}">
                     ${capitalizeFirst(
                    allergy?.clinicalStatus?.text || allergy?.clinicalStatus?.coding?.[0]?.display
                )}
                     </p>
                     </div>
             </div>
             <div>
             ${allergy?.note?.[0]?.text || ''}
             </div>
             `
            ))}
            </div>`
            :
            ''
        }

        ${printData?.toBePrinted?.some((data) => data === "Problems") ?
            ` <div class="patient-info">
                   <h2>Problems</h2>

        ${printData?.problemData?.map((problem, index) => (
                `<div class="summary-headers">
                    <b class="detail-label">
        ${index + 1 + '.'} ${problem?.code?.text || problem?.code?.coding?.[0]?.display || ' '}
                    <small>${problem?.code?.coding?.[0]?.code || ''}</small>
                    </b>
                     <div class="detail-value">
                     <p>
                     ${formatDate(problem?.onsetDateTime)}
                     </p>
                     <p class="${statusClass(problem?.clinicalStatus?.text?.toLowerCase())}">
                     ${capitalizeFirst(
                    problem?.clinicalStatus?.text || problem?.clinicalStatus?.[0]?.coding?.[0]?.display || '-'
                )}
                     </p>
                     </div>
             </div>
             <div>
             ${problem?.note?.[0]?.text || problem?.note?.[0]?.coding?.[0]?.display}
             </div>
             `
            ))}
            </div>`
            :
            ''
        }

        ${printData?.toBePrinted?.some((data) => data === "Medications") ?
            ` <div class="patient-info">
                   <h2>Medications</h2>

        ${printData?.medicationList?.map((medication, index) => (
                `<div class="summary-headers">
                    <b class="detail-label">
                    ${index + 1 + '.'} ${medication?.drugId?.proprietaryName}
                    <small>${medication?.drugId?.nonProprietaryName || ''}</small>
                    </b>
                     <div class="detail-value">
                     <p>
                     ${formatDate(medication?.startDate) + ' - '}${formatDate(medication?.endDate)}
                     </p>
                     <p class="${statusClass(medication?.status?.toLowerCase())}">
                     ${capitalizeFirst(medication?.status)}
                     </p>
                     </div>
             </div>
             <div>
             ${medication?.timing?.code?.text || ''}
             </div>
             <div>
             ${medication?.note?.[0]?.text || ''}
             </div>
             `
            ))}
            </div > `
            :
            ''
        }
       
        ${printData?.toBePrinted?.some((data) => data === "Vitals") ?
            ` <div class="patient-info">
                   <h2>VITALS FLOWSHEET</h2>
 <table>
    <thead>
      <tr>
        <th>Vital Sign</th>
        ${sortedDates?.map(date => `<th>${date}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${rows.join('')}
    </tbody>
  </table>
              </div > `
            :
            ''
        }

         ${printData?.toBePrinted?.some((data) => data === "Tobacco History") ?
            ` <div class="patient-info">
                   <h2>Tobacco History</h2>

        ${printData?.tobaccoHistory?.map((tobacco, index) => (
                `<div class="summary-headers">
                    <b class="detail-label">
                    ${index + 1 + '.'} ${tobacco?.tobaccoUse}
                   
                    </b>
                     <div class="detail-value">
                     <p>
                     ${formatDate(tobacco?.effectiveDateTime)}
                     </p>
                     </div>
             </div>
             <div>
             ${tobacco?.note?.[0]?.text || ''}
             </div>
             `
            ))}
            </div > `
            :
            ''
        }
        
       
        ${printData?.toBePrinted?.some((data) => data === "Family History") ?
            ` <div class="patient-info">
                   <h2>Family History</h2>

        ${printData?.familyHistory?.map((family, index) => (
                `<div class="summary-headers">
                    <b class="detail-label">
                    ${index + 1 + '.'} ${family?.name}
                    <small>${family?.condition?.[0]?.code?.coding?.[0]?.display || ''}</small>
                    </b>
                     <div class="detail-value">
                     <p class="${statusClass(family?.status?.toLowerCase())}">
                     ${capitalizeFirst(family?.status)}
                     </p>
                     </div>
             </div>
            <div class="patient-details">
                    <div class="detail-item">
                        <span class="detail-label">Relation ${family?.relationship?.coding?.[0]?.display || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">DOB ${formatDate(family?.bornDate) || ''}</span>
                    </div>
            </div>
             <div>
             ${family?.note?.[0]?.text || ''}
             </div>
             `
            ))}
            </div > `
            :
            ''
        }

         ${printData?.toBePrinted?.some((data) => data === "Alcohol History") ?
            ` <div class="patient-info">
                   <h2>Alcohol History</h2>

        ${printData?.alcoholHistory?.map((alcohol, index) => (
                `<div class="summary-headers">
                    <b class="detail-label">
                    ${index + 1 + '.'} ${alcohol?.code?.coding?.[0]?.display || alcohol?.code?.text}
                    <small>Frequency: ${alcohol?.frequency || '-'}</small>
                    </b>
                     <div class="detail-value">
                     <p>
                     ${formatDate(alcohol?.effectiveDateTime)}
                     </p>
                     <p class="${statusClass(alcohol?.status?.toLowerCase())}">
                     ${capitalizeFirst(alcohol?.status)}
                     </p>
                     </div>
             </div>
             <div>
             ${alcohol?.note?.[0]?.text || ''}
             </div>
             `
            ))}
            </div > `
            :
            ''
        }
       
        ${printData?.toBePrinted?.some((data) => data === "Medical History") ?
            ` <div class="patient-info">
                   <h2>Medical History</h2>

        ${printData?.medicalHistory?.map((medHistory, index) => (
                `<div class="summary-headers">
                    <b class="detail-label">
                    ${index + 1 + '.'} ${medHistory?.code?.coding?.[0]?.display || medHistory?.code?.text}
                    <small>Frequency: ${medHistory?.frequency || '-'}</small>
                    </b>
                     <div class="detail-value">
                     <p>
                     ${formatDate(medHistory?.effectiveDateTime)}
                     </p>
                     <p class="${statusClass(medHistory?.status?.toLowerCase())}">
                     ${capitalizeFirst(medHistory?.status)}
                     </p>
                     </div>
             </div>
             <div>
             ${medHistory?.note?.[0]?.text || ''}
             </div>
             `
            ))}
            </div > `
            :
            ''
        }
        ${printData?.toBePrinted?.some((data) => data === "Surgical History") ?
            ` <div class="patient-info">
                   <h2>Surgical History</h2>

        ${printData?.surgicalHistory?.map((surgical, index) => (
                `<div class="summary-headers">
                    <b class="detail-label">
                    ${index + 1 + '.'} ${surgical?.code?.coding?.[0]?.display || surgical?.code?.text}
                    </b>
                     <div class="detail-value">
                     <p>
                     ${formatDate(surgical?.performedDateTime)}
                     </p>
                     <p class="${statusClass(surgical?.status?.toLowerCase())}">
                     ${capitalizeFirst(surgical?.status)}
                     </p>
                     </div>
             </div>
             <p>Bodysite: ${surgical?.bodySite?.[0]?.coding?.[0]?.display || surgical?.bodySite?.[0]?.text}</p>
             <br/>
             <div>
             ${surgical?.note?.[0]?.text || ''}
             </div>
             `
            ))}
            </div > `
            :
            ''
        }
       
        ${printData?.toBePrinted?.some((data) => data === "Encounter") ?
            ` <div class="patient-info">
                   <h2>Encounter Data</h2>

                <div class="summary-headers">
                    <b class="detail-label">
                     ${printData?.encounterData?.class?.coding?.[0]?.display || printData?.encounterData?.class?.text}
                    </b>
                     <div class="detail-value">
                     <p>
                     ${formatDate(printData?.encounterData?.period?.start)}
                     </p>
                     <p class="${statusClass(printData?.encounterData?.status?.toLowerCase())}">
                     ${capitalizeFirst(printData?.encounterData?.status)}
                     </p>
                     </div>
             </div>
             <p>Type: ${printData?.encounterData?.type?.[0]?.coding?.[0]?.display || printData?.encounterData?.type?.[0]?.text}</p>
             <br/>
             ${printData?.encounterData?.data?.map((encData, index) => (
                `
                  <div class='patient-info'>
             <h2>${index + 1}. ${encData?.type}</h2>
             <div>
             ${encData?.content?.value}
             </div>
             </div>
                `
            ))}
            </div > `
            :
            ''
        }

        </body >
        </html >
    `;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
};