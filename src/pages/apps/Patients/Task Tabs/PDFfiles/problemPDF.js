import logo_sm from '../../../../../assets/images/logo_sm.png';
import { loggedInUser } from '../../../../../helpers/api/loggedInUser';

export const handlePrintProblems = ({ patientDetails, problemData = [] }) => {

  const originalContent = document.body.innerHTML;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  };

  const getAgeString = (birthDate) => {
    const dob = new Date(birthDate);
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return `${Math.abs(ageDate.getUTCFullYear() - 1970)} yrs`;
  };

  const filteredProblem = problemData;

  const sectionHtml = `
  <div class="section-title">Problem Report</div>
  <table>
    <thead>
      <tr>
        <th>PROBLEM</th>
        <th>ICD-CM Code</th>
        <th>DIAGONSED DATE</th>
        <th>CLINICAL STATUS</th>
        <th>NOTES</th>
      </tr>
    </thead>
    <tbody>
    
    ${filteredProblem.length === 0
      ? `<tr><td colspan="5">No Problem recorded</td></tr>`
      : filteredProblem
        .map((a) => {
          const problem = a.code?.text || a.code?.coding?.[0]?.display || '-';
          const code = a.code?.coding?.[0]?.code;
          const clinicalStatus =
            a.clinicalStatus?.text || a.clinicalStatus?.[0]?.coding?.[0]?.display || '-';
          const date = a?.onsetDateTime;
          const notes = a.note?.[0]?.text || a.note?.[0]?.coding?.[0]?.display || '-';
          return `
                <tr>
                  <td>${problem}</td>
                  <td>${code}</td>
                  <td>${formatDate(date)}</td>
                  <td>${clinicalStatus}</td>
                  <td>${notes}</td>
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
          ${patientDetails?.name?.[0]?.prefix || ''} ${patientDetails?.name?.[0]?.given?.join(' ') || ''} ${patientDetails?.name?.[0]?.family || ''
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
