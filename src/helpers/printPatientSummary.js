import { loggedInUser } from './api/loggedInUser';

export const handlePrintPatientSummary = ({
    toBePrinted,
    vitals = [],
    medicationList = [],
    patientDetails,
    allergyData = [],
    problemData = [],
    encounterData,
}) => {
    console.log(encounterData, 'encounterDataencounterData');
    // Backup original content
    const originalContent = document.body.innerHTML;
    try {
        // Define all possible vital types with their display names and units
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
            { key: 'Inhaled Oxygen Flow Rate', display: 'O₂ Flow Rate', unit: 'l/min' },
        ];

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

        // Helper functions
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

        const formatDateTime = (dateStr) => {
            if (!dateStr) return '';
            try {
                const date = new Date(dateStr);
                return date.toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });
            } catch (e) {
                return '';
            }
        };

        const capitalizeFirst = (str) => {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        };

        // Process vitals data
        const groupedByDate = vitals.reduce((acc, vitalGroup) => {
            try {
                const dateTime = formatDateTime(vitalGroup.effectiveDateTime);
                if (!dateTime) return acc;

                if (!acc[dateTime]) {
                    acc[dateTime] = [];
                }
                acc[dateTime].push(...(vitalGroup.vitals || []));
                return acc;
            } catch (e) {
                return acc;
            }
        }, {});

        // Sort dates chronologically
        const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
            try {
                return (
                    new Date(a.split(',')[0].split('/').reverse().join('-')) -
                    new Date(b.split(',')[0].split('/').reverse().join('-'))
                );
            } catch (e) {
                return 0;
            }
        });

        // Function to get vital value with proper formatting
        const getVitalValue = (entries, type) => {
            if (!entries || !type) return '';

            try {
                const vital = entries.find(
                    (v) => v.code?.text === type.key || v.code?.coding?.[0]?.display === type.key
                );

                if (!vital) return '';

                // Handle blood pressure specially
                if (vital.component?.length > 0) {
                    const systolic = vital.component.find(
                        (c) =>
                            c.code?.coding?.[0]?.code === '8480-6' || c.code?.coding?.[0]?.display?.includes('Systolic')
                    )?.valueQuantity?.value;

                    const diastolic = vital.component.find(
                        (c) =>
                            c.code?.coding?.[0]?.code === '8462-4' ||
                            c.code?.coding?.[0]?.display?.includes('Diastolic')
                    )?.valueQuantity?.value;

                    return systolic && diastolic ? `${systolic}/${diastolic}` : '';
                }

                // Handle string values (like Smoking Status)
                if (vital.valueString) {
                    return vital.valueString;
                }

                // Handle quantity values
                if (vital.valueQuantity) {
                    return `${vital.valueQuantity.value} ${vital.valueQuantity.unit || ''}`.trim();
                }

                return '';
            } catch (e) {
                return '';
            }
        };

        // Generate table rows for vitals
        const vitalsRows = vitalTypes.map((type) => {
            const rowData = sortedDates.map((date) => {
                return getVitalValue(groupedByDate[date], type);
            });

            const tds = rowData.map((val) => `<td class="${!val ? 'empty-value' : ''}">${val || '-'}</td>`).join('');
            return `<tr><td class="vital-name">${type.display} ${type.unit ? `(${type.unit})` : ''}</td>${tds}</tr>`;
        });

        // Process allergies data
        const filteredAllergies = (allergyData || []).filter((a) =>
            ['medication', 'food', 'environment'].includes((a.category?.[0]?.code || '').toLowerCase())
        );

        // Process problems data
        const filteredProblem = problemData || [];
        const filteredEncounters = encounterData || [];
        const renderEncounter = () => {
            return `
${encounterData?.data
    ?.map(
        (section, index) => `
                <div class="encounter-section">
                    <h3 class="section-header">${section?.type || 'Section'}</h3>
                    <div class="section-content">
                        ${section?.content?.value || 'No content available'}
                    </div>
                </div>
            `
    )
    .join('')}
`;
        };
        // Generate HTML sections
        const generateSection = (title, data, itemRenderer) => {
            if (!toBePrinted?.includes(title)) return '';

            return `
        <div class="section-container">
          <h3 class="section-title">${title}</h3>
          <div class="section-content">
            ${
                data.length === 0
                    ? `<div class="no-data">No ${title.toLowerCase()} recorded</div>`
                    : data.map((item, index) => itemRenderer(item, index)).join('')
            }
          </div>
        </div>
      `;
        };

        const renderAllergy = (allergy, index) => {
            const typeMap = {
                medication: 'Drug',
                food: 'Food',
                environment: 'Environmental',
            };
            const category = allergy.category?.[0]?.code?.toLowerCase();
            const typeLabel = typeMap[category] || '-';
            const substance = allergy.code?.text || allergy.code?.coding?.[0]?.display || '-';
            const clinicalStatus = capitalizeFirst(
                allergy.clinicalStatus?.text || allergy.clinicalStatus?.[0]?.coding?.[0]?.display || '-'
            );
            const date = allergy.onset?.onsetDateTime;
            const notes = allergy.note?.[0]?.text || allergy.note?.[0]?.coding?.[0]?.display || '-';

            return `
        <div class="record-item">
          <div class="record-header">
            <span class="record-number">${index + 1}.</span>
            <span class="record-title">${substance} <small>(${typeLabel})</small></span>
            <span>
            ${date ? `<div class="record-date">${formatDate(date)}</div>` : ''}
            </span>
            <span class="record-status ${statusClass(allergy.clinicalStatus?.text?.toLowerCase())}">
              ${clinicalStatus}
            </span>
          </div>
          <div class="record-details">
            ${notes ? `<div class="record-notes">${notes}</div>` : ''}
          </div>
        </div>
      `;
        };

        const renderProblem = (problem, index) => {
            const problemText = problem.code?.text || problem.code?.coding?.[0]?.display || '-';
            const code = problem.code?.coding?.[0]?.code || '';
            const clinicalStatus = capitalizeFirst(
                problem.clinicalStatus?.text || problem.clinicalStatus?.[0]?.coding?.[0]?.display || '-'
            );
            const date = problem?.onsetDateTime;
            const notes = problem.note?.[0]?.text || problem.note?.[0]?.coding?.[0]?.display || '-';

            return `
        <div class="record-item">
          <div class="record-header">
            <span class="record-number">${index + 1}.</span>
            <span class="record-title">${problemText} ${code ? `<small>(${code})</small>` : ''}</span>
            <span>
            ${date ? `<div class="record-date">${formatDate(date)}</div>` : ''}
            </span>
            <span class="record-status ${statusClass(problem.clinicalStatus?.text?.toLowerCase())}">
              ${clinicalStatus}
            </span>
          </div>
          <div class="record-details">
            ${notes ? `<div class="record-notes">${notes}</div>` : ''}
          </div>
        </div>
      `;
        };

        const renderMedication = (med, index) => {
            const proprietaryName = med?.drugId?.proprietaryName || 'Unknown medication';
            const nonProprietaryName = med?.drugId?.nonProprietaryName || '';
            const startDate = med?.startDate;
            const endDate = med?.endDate;
            const status = capitalizeFirst(med?.status || '');
            const dosage = med?.dosageInstruction?.[0]?.text || '';
            const notes = med?.note?.[0]?.text || '';

            return `
        <div class="record-item">
          <div class="record-header">
            <span class="record-number">${index + 1}.</span>
            <span class="record-title">${proprietaryName} ${nonProprietaryName ? `<small>(${nonProprietaryName})</small>` : ''}</span>
            <span>
               ${
                   startDate || endDate
                       ? `<div class="record-date">
                  ${startDate ? formatDate(startDate) : '?'} - ${endDate ? formatDate(endDate) : 'Present'}
                </div>`
                       : ''
               }
            </span>
            <span class="record-status ${statusClass(med?.status)}">
              ${status}
            </span>
          </div>
          <div class="record-details">
            ${dosage ? `<div class="record-dosage">${dosage}</div>` : ''}
            ${notes ? `<div class="record-notes">${notes}</div>` : ''}
          </div>
        </div>
      `;
        };

        // Generate the print content
        const printContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Patient Summary Report</title>
  <style>
    /* Base Styles */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 20px;
      font-size: 14px;
      background-color: #fff;
    }
    
    /* Header Styles */
    .report-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #e0e0e0;
      position: relative;
    }
    
    .logo {
      height: 60px;
      position: absolute;
      right: 0;
      top: 0;
    }
    
    .header-info {
      width: 100%;
    }
    
    .report-title {
      text-align: center;
      margin-bottom: 15px;
      color: #2c3e50;
      font-size: 22px;
    }
    
    .patient-info, .facility-info {
      width: 48%;
    }
    
    .patient-info h4, .facility-info h4 {
      color: #3498db;
      margin-bottom: 8px;
      padding-bottom: 5px;
      border-bottom: 1px solid #eee;
    }
    
    .info-row {
      margin-bottom: 5px;
    }
    
    /* Section Styles */
    .section-container {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    
    .section-title {
      background-color: #f8f9fa;
      padding: 8px 12px;
      margin-bottom: 12px;
      border-left: 4px solid #3498db;
      font-size: 16px;
      color: #2c3e50;
    }
    
    .section-content {
      padding: 0 10px;
    }
    
    /* Record Item Styles */
    .record-item {
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px dashed #e0e0e0;
    }
    
    .record-item:last-child {
      border-bottom: none;
    }
    
    .record-header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
    
    .record-number {
      font-weight: bold;
      margin-right: 8px;
      color: #7f8c8d;
    }
    
    .record-title {
      font-weight: 600;
      flex-grow: 1;
      margin-right: 10px;
    }
    
    .record-title small {
      color: #7f8c8d;
      font-weight: normal;
    }
    
    .record-status {
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      background-color: #ecf0f1;
    }
    
    .status-success { background-color: #d4edda; color: #155724; }
    .status-warning { background-color: #fff3cd; color: #856404; }
    .status-danger { background-color: #f8d7da; color: #721c24; }
    .status-primary { background-color: #cce5ff; color: #004085; }
    .status-secondary { background-color: #e2e3e5; color: #383d41; }
    .status-muted { background-color: #f7f7f7; color: #6c757d; }
    .status-dark { background-color: #d6d8d9; color: #1b1e21; }
    
    .record-details {
      padding-left: 20px;
      font-size: 13px;
    }
    
    .record-date {
      color: #7f8c8d;
    }
    
    .record-dosage {
      font-weight: 500;
      margin-bottom: 5px;
    }
    
    .record-notes {
      color: #555;
      font-style: italic;
    }
    
    /* Vitals Table Styles */
    .vitals-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      page-break-inside: avoid;
    }
    
    .vitals-table th {
      background-color: #3498db;
      color: white;
      padding: 10px;
      text-align: center;
      font-weight: 500;
    }
    
    .vitals-table td {
      padding: 8px;
      border: 1px solid #ddd;
      text-align: center;
    }
    
    .vitals-table tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    
    .vital-name {
      font-weight: 600;
      text-align: left;
      white-space: nowrap;
    }
    
    .empty-value {
      color: #bbb;
    }
    
    /* No Data Styles */
    .no-data {
      color: #7f8c8d;
      font-style: italic;
      text-align: center;
      padding: 15px;
    }
    
    /* Print Specific Styles */
    @media print {
      body {
        padding: 0;
        font-size: 12px;
      }
      
      .report-header {
        padding-top: 0;
      }
      
      .section-container {
        margin-bottom: 15px;
      }
      
      .record-item {
        margin-bottom: 10px;
      }
      
      @page {
        size: auto;
        margin: 10mm;
      }
    }
    
    /* Utility Classes */
    .capitalize-first {
      text-transform: capitalize;
    }
  </style>
</head>
<body>
  <div class="report-header">
    <div class="header-info">
      <h1 class="report-title">Patient Summary Report</h1>
      <div style="display: flex; justify-content: space-between;">
        <div class="patient-info">
          <h4>PATIENT INFORMATION</h4>
          <div class="info-row"><strong>Name:</strong> ${patientDetails?.name?.[0]?.prefix + ' ' || ''}${patientDetails?.name?.[0]?.given?.join(' ') + ' ' || ''}${patientDetails?.name?.[0]?.family || 'N/A'}</div>
          <div class="info-row"><strong>DOB:</strong> ${formatDate(patientDetails?.birthDate) || 'N/A'}</div>
          <div class="info-row"><strong>Age:</strong> ${patientDetails?.approxAge ? Math.floor(patientDetails.approxAge) + ' years' : 'N/A'}</div>
          <div class="info-row"><strong>Gender:</strong> ${capitalizeFirst(patientDetails?.gender) || 'N/A'}</div>
          <div class="info-row"><strong>MRN:</strong> ${patientDetails?.chartNumber || 'N/A'}</div>
        </div>
        
        <div class="facility-info">
          <h4>REPORT DETAILS</h4>
          <div class="info-row"><strong>Provider:</strong> ${loggedInUser?.name || 'N/A'}</div>
          <div class="info-row"><strong>Printed:</strong> ${formatDateTime(new Date())}</div>
          <div class="info-row"><strong>Includes:</strong> ${toBePrinted.join(', ')}</div>
        </div>
      </div>
    </div>
  </div>

  ${
      toBePrinted?.includes('Vitals') && sortedDates.length > 0
          ? `
    <div class="section-container">
      <h3 class="section-title">Vitals</h3>
      <div class="section-content">
        <table class="vitals-table">
          <thead>
            <tr>
              <th>Vital Sign</th>
              ${sortedDates.map((date) => `<th>${date}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${vitalsRows.join('')}
          </tbody>
        </table>
      </div>
    </div>
  `
          : ''
  }

  ${generateSection('Allergies', filteredAllergies, renderAllergy)}
  ${generateSection('Problems', filteredProblem, renderProblem)}
  ${generateSection('Medications', medicationList, renderMedication)}
  ${encounterData ? renderEncounter() : ''}

  
  <footer style="margin-top: 30px; text-align: center; font-size: 12px; color: #7f8c8d;">
    <p>This report was generated electronically and does not require a signature.</p>
  </footer>
</body>
</html>
    `;

        // Open print dialog
        document.body.innerHTML = printContent;
        window.print();
    } catch (error) {
        console.error('Error generating print summary:', error);
        alert('An error occurred while generating the report. Please try again.');
    } finally {
        // Restore original content
        document.body.innerHTML = originalContent;
    }
    window.location.reload();
};
