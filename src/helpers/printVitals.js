import { loggedInUser } from './api/loggedInUser';

export const handlePrintVitals = ({ vitals, patientDetails }) => {
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

  // Group by date and sort chronologically
  const groupedByDate = vitals.reduce((acc, vitalGroup) => {
    const date = new Date(vitalGroup.effectiveDateTime).toLocaleDateString('en-US');
    const time = new Date(vitalGroup.effectiveDateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const key = `${date} (${time})`;

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(...vitalGroup.vitals);
    return acc;
  }, {});

  // Sort dates chronologically
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    return (
      new Date(a.split(' ')[0].split('/').reverse().join('-')) -
      new Date(b.split(' ')[0].split('/').reverse().join('-'))
    );
  });

  // Function to get vital value with proper formatting
  const getVitalValue = (entries, type) => {
    const vital = entries.find((v) => v.code?.text === type.key || v.code?.coding?.[0]?.display === type.key);

    if (!vital) return '';

    // Handle blood pressure specially
    if (vital.component?.length > 0) {
      const systolic = vital.component.find(
        (c) => c.code?.coding?.[0]?.code === '8480-6' || c.code?.coding?.[0]?.display?.includes('Systolic')
      )?.valueQuantity?.value;

      const diastolic = vital.component.find(
        (c) => c.code?.coding?.[0]?.code === '8462-4' || c.code?.coding?.[0]?.display?.includes('Diastolic')
      )?.valueQuantity?.value;

      return systolic && diastolic ? `${systolic}/${diastolic} mmHg` : '';
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
  };

  // Generate table rows
  const rows = vitalTypes.map((type) => {
    const rowData = sortedDates.map((date) => {
      return getVitalValue(groupedByDate[date], type);
    });

    const tds = rowData.map((val) => `<td>${val || '-'}</td>`).join('');
    return `<tr><td>${type.display} (${type.unit})</td>${tds}</tr>`;
  });

  // Helper function to capitalize first letter
  const capitalize = (str) => str && typeof str === 'string' ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

  const originalContent = document.body.innerHTML;

  const printContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vitals Flowsheet</title>
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

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 12px;
      background: white;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    th, td {
      border: 1px solid #e2e8f0;
      padding: 12px 8px;
      text-align: center;
    }

    th {
      background: #6169D0;
      color: white;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .provider-signature {
      margin-top: 30px;
      padding: 20px;
      background: #f9fafb;
      border-radius: 6px;
      border: 1px solid #d1d5db;
      text-align: right;
    }

    .signature-line {
      width: 300px;
      margin: 20px 0 10px 0;
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
  </style>
</head>
<body>
  <div class="header">
    <img src=${loggedInUser?.logo?.split('?')[0]}/>
    <h1>Vitals Flowsheet Report</h1>
    <div class="header-info">
      <div>
        <strong>Generated:</strong> ${new Date().toLocaleString()}
      </div>
      <div>
        <strong>Clinic:</strong> ${loggedInUser?.name || 'Not available'}
      </div>
    </div>
  </div>

  <div class="patient-info">
    <h2>Patient Information</h2>
    <div class="patient-details">
      <div class="detail-item">
        <span class="detail-label">Name</span>
        <span class="detail-value">${capitalize(patientDetails?.name?.[0]?.prefix) ? capitalize(patientDetails?.name?.[0]?.prefix) + ' ' : ''}${patientDetails?.name?.[0]?.given?.map(name => capitalize(name)).join(' ') || ''}${patientDetails?.name?.[0]?.given?.length ? ' ' : ''}${capitalize(patientDetails?.name?.[0]?.family) || 'N/A'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">DOB</span>
        <span class="detail-value">${patientDetails?.birthDate ? new Date(patientDetails.birthDate).toLocaleDateString('en-US') : 'N/A'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Age</span>
        <span class="detail-value">${patientDetails?.approxAge ? Math.floor(patientDetails.approxAge) + ' years' : 'N/A'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Gender</span>
        <span class="detail-value">${patientDetails?.gender ? patientDetails.gender.charAt(0).toUpperCase() + patientDetails.gender.slice(1) : 'N/A'}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">MRN</span>
        <span class="detail-value">${patientDetails?.chartNumber || 'N/A'}</span>
      </div>
    </div>
  </div>

  <div class="encounter-section">
    <h3 class="section-header">Vitals Flowsheet</h3>
    <div class="section-content">
      <table>
        <thead>
          <tr>
            <th>Vital Sign</th>
            ${sortedDates.map((date) => `<th>${date}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div class="provider-signature">
    <div class="signature-line"></div>
    <strong>Provider Signature</strong>
    <br/>
    <span>${new Date()?.toISOString()?.split('T')?.[0]}</span>
  </div>
</body>
</html>
`;

  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;
  window.location.reload();
};
