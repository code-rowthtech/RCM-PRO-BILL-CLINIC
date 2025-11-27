import { loggedInUser } from "./api/loggedInUser";

export const handlePrintEncounterList = (encounters, patientDetails) => {
    const printContent = `
         <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Encounter List Report</title>
            <style>
                @media print {
                    @page {
                        margin: 1in;
                        size: letter;
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
                    font-family: 'Segoe UI', Arial, sans-serif;
                    line-height: 1.4;
                    color: #2c3e50;
                    background: white;
                    font-size: 9pt;
                }

                .header {
                    background: #6168d0;
                    color: white;
                    padding: 12px 15px;
                    margin-bottom: 15px;
                    border-radius: 6px;
                }

                .header h1 {
                    font-size: 14pt;
                    font-weight: 600;
                    margin-bottom: 3px;
                    color: white;
                }

                .patient-info {
                    border: 1px solid #e5e7eb;
                    padding: 10px;
                    margin-bottom: 12px;
                    background: #f9fafb;
                    border-radius: 4px;
                }

                .patient-info h2 {
                    color: #6168d0;
                    font-size: 10pt;
                    font-weight: 600;
                    margin-bottom: 8px;
                    border-bottom: 2px solid #6168d0;
                    padding-bottom: 4px;
                }

                .patient-details {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 8px;
                }

                .detail-item {
                    display: flex;
                    flex-direction: column;
                }

                .detail-label {
                    font-weight: 600;
                    color: #6b7280;
                    font-size: 7pt;
                    margin-bottom: 2px;
                    text-transform: uppercase;
                    letter-spacing: 0.2px;
                }

                .detail-value {
                    font-size: 8pt;
                    color: #1f2937;
                    font-weight: 500;
                }

                .encounter-section {
                    margin-bottom: 12px;
                    break-inside: avoid;
                    page-break-inside: avoid;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .section-header {
                    background: #6168d0;
                    color: white;
                    padding: 6px 10px;
                    font-weight: 600;
                    font-size: 9pt;
                    margin-bottom: 0;
                }

                .section-content {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-top: none;
                    padding: 10px;
                    min-height: 40px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 8px;
                    font-size: 7pt;
                    background: white;
                    border: 1px solid #e5e7eb;
                }

                th, td {
                    border: 1px solid #e5e7eb;
                    padding: 5px 8px;
                    text-align: left;
                }

                th {
                    background: #6168d0;
                    color: white;
                    font-weight: 600;
                    font-size: 7pt;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }

                tbody tr:nth-child(even) {
                    background: #f9fafb;
                }

                .document-title {
                    text-align: center;
                    font-size: 12pt;
                    font-weight: 600;
                    margin: 10px 0 8px 0;
                    color: #6168d0;
                    letter-spacing: 0.3px;
                }

                .confidential {
                    text-align: center;
                    font-size: 7pt;
                    font-weight: 600;
                    margin: 5px 0 12px 0;
                    color: #dc2626;
                    background: #fee2e2;
                    padding: 5px;
                    border-radius: 3px;
                    border: 1px solid #fecaca;
                }

                .status-planned { color: #6b7280; }
                .status-arrived { color: #2563eb; }
                .status-triaged { color: #0891b2; }
                .status-in-progress { color: #ca8a04; }
                .status-onleave { color: #6b7280; }
                .status-finished { color: #16a34a; }
                .status-cancelled { color: #dc2626; }

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
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        ${loggedInUser?.logo ? `<img src="${loggedInUser.logo.split('?')[0]}" style="max-height: 40px; margin-bottom: 5px;" />` : ''}
                        <div style="font-weight: 600; font-size: 11pt;">${loggedInUser?.name || 'Medical Facility'}</div>
                        <div style="font-size: 7pt; margin-top: 2px; opacity: 0.9;">${loggedInUser?.address || ''}</div>
                        <div style="font-size: 7pt; opacity: 0.9;">${loggedInUser?.phone || ''}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 7pt; opacity: 0.9;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-US')}</div>
                        <div style="font-size: 7pt; opacity: 0.9;"><strong>Time:</strong> ${new Date().toLocaleTimeString('en-US')}</div>
                    </div>
                </div>
            </div>
            <div class="document-title">Patient Encounter List</div>
            <div class="confidential">⚠ CONFIDENTIAL PATIENT INFORMATION - HIPAA PROTECTED</div>

            <div class="patient-info">
                <h2>Patient Information</h2>
                <div class="patient-details">
                    <div class="detail-item">
                        <span class="detail-label">Name</span>
                        <span class="detail-value">${patientDetails?.name?.[0]?.text || 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Gender</span>
                        <span class="detail-value">${patientDetails?.gender ? patientDetails.gender.charAt(0).toUpperCase() + patientDetails.gender.slice(1) : 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">DOB</span>
                        <span class="detail-value">${patientDetails?.birthDate ? new Date(patientDetails?.birthDate)?.toISOString()?.split('T')?.[0] : 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Age</span>
                        <span class="detail-value">${patientDetails?.approxAge ? `${patientDetails.approxAge} years` : 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email</span>
                        <span class="detail-value">${patientDetails?.telecom?.find?.((data) => data?.system === 'email')?.value || 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Phone</span>
                        <span class="detail-value">${patientDetails?.telecom?.find?.((data) => data?.system === 'phone')?.value || 'Not available'}</span>
                    </div>
                </div>
            </div>

            <div class="encounter-section">
                <h3 class="section-header">Encounter History</h3>
                <div class="section-content">
                    ${encounters?.length > 0 ? `
                        <table>
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Provider</th>
                                    <th>Encounter Type</th>
                                    <th>Status</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${encounters.map((item, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td style="text-transform: capitalize;">
                                            ${(item?.providerId?.name?.[0]?.prefix?.[0]
                                                ? item?.providerId?.name?.[0]?.prefix?.[0] + ' '
                                                : '') +
                                                (item?.providerId?.name?.[0]?.family || '') +
                                                (item?.providerId?.name?.[0]?.given?.length > 0
                                                    ? ' ' + item?.providerId?.name?.[0]?.given?.join(' ')
                                                    : '') || 'N/A'}
                                        </td>
                                        <td>${item?.type?.[0]?.coding?.[0]?.display || 'N/A'}</td>
                                        <td class="status-${item?.status}" style="text-transform: capitalize; font-weight: 600;">
                                            ${item?.status || 'N/A'}
                                        </td>
                                        <td>
                                            ${item?.period?.start ? new Date(item?.period?.start)?.toISOString().split('T')?.[0] : '-'}
                                        </td>
                                        <td>
                                            ${item?.period?.end ? new Date(item?.period?.end)?.toISOString().split('T')?.[0] : '-'}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : `
                        <div style="text-align: center; color: #6b7280; font-style: italic; padding: 15px;">
                            No encounters found for this patient
                        </div>
                    `}
                </div>
            </div>

            <div style="margin-top: 15px; font-size: 6pt; text-align: center; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 10px; line-height: 1.4;">
                This document contains confidential patient health information protected by HIPAA regulations.<br/>
                Unauthorized disclosure or use of this information is prohibited by federal and state law.
            </div>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Popup blocked. Please allow popups for this site.');
        return;
    }

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
    };
};