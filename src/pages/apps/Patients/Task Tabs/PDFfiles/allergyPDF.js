import logo_sm from '../../../../../assets/images/logo_sm.png';
import { loggedInUser } from '../../../../../helpers/api/loggedInUser';

export const handlePrintAllergies = ({ patientDetails, allergyData = [] }) => {
    console.log(allergyData, 'allergyData');
    const originalContent = document.body.innerHTML;

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB');
    };

    const getAgeString = (birthDate) => {
        const dob = new Date(birthDate);
        const ageDifMs = Date.now() - dob.getTime();
        const ageDate = new Date(ageDifMs); // miliseconds from epoch
        return `${Math.abs(ageDate.getUTCFullYear() - 1970)} yrs`;
    };

    const filteredAllergies = allergyData.filter((a) =>
        ['medication', 'food', 'environment'].includes(a.category?.[0]?.code?.toLowerCase() || '')
    );

    const sectionHtml = `
  <div class="section-title">Allergy Report</div>
  <table>
    <thead>
      <tr>
        <th>TYPE</th>
        <th>ALLERGY</th>
        <th>CATEGORY</th>
        <th>CLINICAL STATUS</th>
      </tr>
    </thead>
    <tbody>
      ${
          filteredAllergies.length === 0
              ? `<tr><td colspan="4">No allergies recorded</td></tr>`
              : filteredAllergies
                    .map((a) => {
                        const typeMap = {
                            medication: 'Drug',
                            food: 'Food',
                            environment: 'Environmental',
                        };
                        const category = a.category?.[0]?.code?.toUpperCase();
                        const typeLabel = typeMap[category] || '-';
                        const substance = a.code?.text || a.code?.coding?.[0]?.display || '-';
                        const reactions = a.reaction?.[0];
                        const clinicalStatus = a.clinicalStatus?.text || a.clinicalStatus?.[0]?.coding?.[0]?.display || '-';
                        const type = a.code?.text || '-';
                        return `
                <tr>
                  <td>${type}</td>
                  <td>${substance}</td>
                 <td>${category}</td>
                  <td>${clinicalStatus}</td>
                </tr>`;
                    })
                    .join('')
      }
    </tbody>
  </table>
`;

    const printContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Allergy Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          font-size: 14px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .header div {
          width: 48%;
        }
        .section-title {
          background-color: #ccc;
          font-weight: bold;
          padding: 6px;
          margin-top: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #aaa;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #eaeaea;
        }
        .logo {
          text-align: right;
          margin-top: 40px;
        }
        .logo img {
          filter: grayscale(100%);
        }
        @media print {
          .cursor-pointer {
            display: none !important;
          }
          body {
            font-size: 12px;
            color: #000;
          }
        }
      </style>
    </head>
    <body>

      <div class="header">
        <div>
          <strong>PATIENT</strong><br>
          ${patientDetails?.name?.[0]?.prefix || ''} ${patientDetails?.name?.[0]?.given?.join(' ') || ''} ${
        patientDetails?.name?.[0]?.family || ''
    }<br>
          <strong>DOB:</strong> ${formatDate(patientDetails?.birthDate)}<br>
          <strong>AGE:</strong> ${getAgeString(patientDetails?.birthDate)}<br>
          <strong>SEX:</strong> ${patientDetails?.gender || 'Unknown'}<br>
          <strong>MRN:</strong> ${patientDetails?.chartNumber || ''}
        </div>
        <div>
          <strong>FACILITY</strong><br>
          ${loggedInUser?.name || ''}<br>
          <strong>Email:</strong> ${loggedInUser?.email || ''}<br>
        </div>
      </div>

      ${sectionHtml}

   

    </body>
    </html>
  `;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
};
