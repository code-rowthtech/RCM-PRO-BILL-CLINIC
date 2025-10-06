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
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      font-size: 12px;
    }
    h2, h4 {
      margin-bottom: 5px;
      color: #333;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
    }
    .patient-info, .facility-info {
      width: 48%;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 6px;
      text-align: center;
    }
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    .logo {
      position: absolute;
      right: 20px;
      top: 20px;
      width: 80px;
      height: auto;
    }
    @page {
      size: auto;
      margin: 10mm;
    }
    @media print {
      body {
        padding: 0;
        font-size: 10pt;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <img src='https://bitplatypus.s3.eu-north-1.amazonaws.com/logo_sm.png' alt="Logo" height="50" />
  
  <div class="header">
    <div class="patient-info">
      <h4>PATIENT INFORMATION</h4>
      <strong>Name:</strong> ${capitalize(patientDetails?.name?.[0]?.prefix) ? capitalize(patientDetails?.name?.[0]?.prefix) + ' ' : ''}${patientDetails?.name?.[0]?.given?.map(name => capitalize(name)).join(' ') || ''}${patientDetails?.name?.[0]?.given?.length ? ' ' : ''}${capitalize(patientDetails?.name?.[0]?.family) || 'N/A'}<br>
      <strong>DOB:</strong> ${patientDetails?.birthDate ? new Date(patientDetails.birthDate).toLocaleDateString('en-US') : 'N/A'}<br>
      <strong>Age:</strong> ${patientDetails?.approxAge ? Math.floor(patientDetails.approxAge) + ' years' : 'N/A'}<br>
      <strong>Gender:</strong> ${patientDetails?.gender ? patientDetails.gender.charAt(0).toUpperCase() + patientDetails.gender.slice(1) : 'N/A'}<br>
      <strong>MRN:</strong> ${patientDetails?.chartNumber || 'N/A'}
    </div>
    
    <div class="facility-info">
      <h4>FACILITY INFORMATION</h4>
      <strong>Provider:</strong> ${loggedInUser?.name || 'N/A'}<br>
      <strong>Email:</strong> ${loggedInUser?.email || 'N/A'}<br>
      <strong>Date Printed:</strong> ${new Date().toLocaleDateString('en-US')}<br>
    </div>
  </div>

  <h4>VITALS FLOWSHEET</h4>

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

  <div class="no-print" style="margin-top: 20px; text-align: center;">
    <button onclick="window.print()" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
      Print Vitals
    </button>
    <button onclick="window.close()" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
      Close
    </button>
  </div>
</body>
</html>
`;

  // document.body.innerHTML = printContent;
  // window.print();
  // document.body.innerHTML = originalContent;
  // window.location.reload();
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Popup blocked. Please allow popups for this site.');
    return;
  }

  printWindow.document.open();
  printWindow.document.write(printContent);
  printWindow.document.close();

  // Wait for window to finish loading styles and layout
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    // printWindow.close(); // optional
  };
};
