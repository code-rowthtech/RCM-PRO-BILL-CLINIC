import { loggedInUser } from './api/loggedInUser';

export const handlePrintMedication = ({ medicationList, patientDetails }) => {
    // Define all possible vital types with their display names and units
    const originalContent = document.body.innerHTML;
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

    const printContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Medication Request PDF</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h2 { margin-top: 40px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; box-shadow:none; }
    th, td { border: 1px solid #ccc; padding: 8px; }
    th { background-color: #f0f0f0; }
    pre { background: #f9f9f9; padding: 10px; border: 1px solid #ccc; white-space: pre-wrap; }
    .drug{
    display:flex; flex-direction:column;
    }
    .status-success { color: green; }
.status-warning { color: orange; }
.status-danger { color: red; }
.status-primary { color: blue; }
.status-secondary { color: gray; }
.status-muted { color: #6c757d; }
.status-dark { color: #343a40; }
.border-bottom{
    border-bottom:1px solid #ccc;
    padding-bottom:10px;
    margin-bottom:10px;
}
    .capitalize-first {
  text-transform: capitalize;
}
  .drug-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  }
  h5{
  margin-bottom:0px;}

  </style>
</head>
<body>

<div style="font-family: Arial, sans-serif; padding: 20px;">
  <h2>Medication Request Summary</h2>
  <div style="margin-bottom: 20px;">
    <strong>Patient MRN:</strong> ${patientDetails?.chartNumber}<br>
    <strong>Contact:</strong> ${patientDetails?.telecom?.find((data) => data?.system === 'phone' && data?.value !== '')?.value || 'Missing'}<br>
    <strong>Gender:</strong> ${patientDetails?.gender}<br>
    <strong>Approx Age:</strong> ${patientDetails?.approxAge} years<br>
  </div>

  <h4>Drug Details</h4>
${medicationList?.map(
    (data, index) =>
        `  <div class='border-bottom'>
<div class='drug-header'>
<div>
<h5>${index + 1}. ${data?.drugId?.proprietaryName} ${data?.startDate ? new Date(data?.startDate).toLocaleDateString('en-GB') : '-'}-${data?.endDate ? new Date(data?.endDate).toLocaleDateString('en-GB') : '-'}</h5>
<small>${data?.drugId?.nonProprietaryName}</small>
</div>
<strong class='capitalize-first ${statusClass(data?.status)}'>${data?.status}</strong>
</div>
  <p>${data?.dosageInstruction?.[0]?.text}</p>
  <p>${data?.note?.[0]?.text}</p>
  </div>`
)}

 
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
