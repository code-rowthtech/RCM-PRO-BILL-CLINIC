import { loggedInUser } from "./api/loggedInUser";

export const handlePrintAutopopulatedFields = ({ populatedFields, patientDetails, encounterData, fieldLabels, fieldContent, vitals }) => {
    const originalContent = document?.body?.innerHTML;
    let printContent = `
         <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Medical Encounter Report</title>
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

                @page {
                    margin: 1in;
                    size: letter;
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

                .header-info {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 8px;
                    font-size: 7pt;
                    color: rgba(255,255,255,0.95);
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

                .populated-item {
                    background: #fef3e2;
                    border: 1px solid #f59e0b;
                    border-radius: 6px;
                    padding: 15px;
                    margin-bottom: 10px;
                    border-left: 4px solid #f59e0b;
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

                .provider-signature {
                    margin-top: 20px;
                    padding: 12px;
                    background: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 4px;
                }

                .signature-line {
                    border-bottom: 1px solid #6168d0;
                    width: 250px;
                    margin: 15px 0 3px 0;
                    display: inline-block;
                }

                .text-content {
                    white-space: pre-line;
                    line-height: 1.5;
                    padding: 8px;
                    background: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 4px;
                    margin-top: 8px;
                    font-size: 8pt;
                    color: #374151;
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
                <h1>Medical Encounter Report</h1>
                <div class="header-info">
                    <div>
                        <strong>Provider:</strong> ${encounterData?.providerId?.name?.find((data) => data?.use === 'official')?.text || 'Not available'}
                    </div>
                    <div>
                        <strong>Date:</strong> ${encounterData?.period?.start ? new Date(encounterData?.period?.start)?.toISOString()?.split('T')?.[0] : 'Not specified'}
                    </div>
                    <div>
                        <strong>Status:</strong> ${encounterData?.status?.charAt(0).toUpperCase() + encounterData?.status.slice(1) || 'UNKNOWN'}
                    </div>
                    <div>
                        <strong>Encounter Type:</strong> ${encounterData?.type?.[0]?.coding?.[0]?.display || 'Standard Visit'}
                    </div>
                </div>
            </div>
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
            <div class="document-title">Medical Encounter Report</div>
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
    `;

    // Add vitals if provided
    if (vitals && vitals.length > 0) {
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

        const groupedByDate = vitals.reduce((acc, vitalGroup) => {
            const date = new Date(vitalGroup.effectiveDateTime).toLocaleDateString('en-US');
            const time = new Date(vitalGroup.effectiveDateTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            });
            const key = `${date} (${time})`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(...vitalGroup.vitals);
            return acc;
        }, {});

        const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
            return new Date(a.split(' ')[0].split('/').reverse().join('-')) - new Date(b.split(' ')[0].split('/').reverse().join('-'));
        });

        const getVitalValue = (entries, type) => {
            const vital = entries.find((v) => v.code?.text === type.key || v.code?.coding?.[0]?.display === type.key);
            if (!vital) return '';
            if (vital.component?.length > 0) {
                const systolic = vital.component.find((c) => c.code?.coding?.[0]?.code === '8480-6' || c.code?.coding?.[0]?.display?.includes('Systolic'))?.valueQuantity?.value;
                const diastolic = vital.component.find((c) => c.code?.coding?.[0]?.code === '8462-4' || c.code?.coding?.[0]?.display?.includes('Diastolic'))?.valueQuantity?.value;
                return systolic && diastolic ? `${systolic}/${diastolic} mmHg` : '';
            }
            if (vital.valueString) return vital.valueString;
            if (vital.valueQuantity) return `${vital.valueQuantity.value} ${vital.valueQuantity.unit || ''}`.trim();
            return '';
        };

        const rows = vitalTypes.map((type) => {
            const rowData = sortedDates.map((date) => getVitalValue(groupedByDate[date], type));
            const tds = rowData.map((val) => `<td style="text-align: center;">${val || '-'}</td>`).join('');
            return `<tr><td>${type.display} (${type.unit})</td>${tds}</tr>`;
        });

        printContent += `
            <div class="encounter-section">
                <h3 class="section-header">Vitals Flowsheet</h3>
                <div class="section-content">
                    <table>
                        <thead>
                            <tr>
                                <th>Vital Sign</th>
                                ${sortedDates.map((date) => `<th style="text-align: center;">${date}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.join('')}
                        </tbody>
                    </table>
                </div>
            </div>`;
    } else {
        printContent += `
            <div class="encounter-section">
                <h3 class="section-header">Vitals Flowsheet</h3>
                <div class="section-content">
                    <div style="text-align: center; color: #6b7280; font-style: italic; padding: 15px;">No vitals recorded</div>
                </div>
            </div>`;
    }

    // Add each field section
    Object.keys(fieldLabels).forEach(fieldName => {
        const label = fieldLabels[fieldName];
        const content = fieldContent[fieldName];
        const populated = populatedFields[fieldName] || [];

        printContent += `
            <div class="encounter-section">
                <h3 class="section-header">${label}</h3>
                <div class="section-content">`;

        const hasPopulatedData = populated.length > 0;
        const cleanContent = content ? content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '';
        const hasContent = !!cleanContent;

        // Add populated data
        if (hasPopulatedData) {
            // Check if data is structured (contains : and \n)
            if (populated.some(data => data.includes(':') && data.includes('\n'))) {
                const groupedData = {};
                populated.forEach(data => {
                    if (data.includes(':') && data.includes('\n')) {
                        const type = data.split('\n')[0].split(': ')[1];
                        if (!groupedData[type]) groupedData[type] = [];
                        groupedData[type].push(data);
                    }
                });
                Object.entries(groupedData).forEach(([type, items]) => {
                    const firstItem = items[0];
                    const lines = firstItem.split('\n');
                    const headers = lines.map(line => line.split(': ')[0]).filter(Boolean).slice(1);

                    printContent += `<div style="margin-bottom: 15px;"><strong style="color: #6169D0; font-size: 14px;">${type}</strong>`;
                    printContent += `<table><thead><tr><th>Sr.</th>`;
                    headers.forEach(header => {
                        printContent += `<th>${header}</th>`;
                    });
                    printContent += `</tr></thead><tbody>`;
                    items.forEach((data, index) => {
                        const lines = data.split('\n');
                        const parsedData = {};
                        lines.forEach(line => {
                            const [label, value] = line.split(': ');
                            if (label && value) parsedData[label] = value;
                        });
                        const values = Object.entries(parsedData).slice(1).map(([_, v]) => v);

                        printContent += `<tr><td>${index + 1}</td>`;
                        values.forEach(val => {
                            printContent += `<td>${val}</td>`;
                        });
                        printContent += `</tr>`;
                    });

                    printContent += `</tbody></table></div>`;
                });
            } else {
                // Simple list format - convert to table
                printContent += `<table><thead><tr><th>Sr.</th><th>Data</th></tr></thead><tbody>`;
                populated.forEach((item, index) => {
                    printContent += `<tr><td>${index + 1}</td><td>${item}</td></tr>`;
                });
                printContent += `</tbody></table>`;
            }
        }

        // Add field content
        if (hasContent) {
            printContent += `<div class="text-content">${content}</div>`;
        }

        // Show "No data recorded" if both are empty
        if (!hasPopulatedData && !hasContent) {
            printContent += `<div style="text-align: center; color: #6b7280; font-style: italic; padding: 15px;">No data recorded</div>`;
        }

        printContent += `</div></div>`;
    });

    printContent += `
            <div class="provider-signature">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 8pt;">
                    <div>
                        <div style="font-weight: 600; color: #6168d0; margin-bottom: 3px; font-size: 7pt;">Provider Name:</div>
                        <div style="border-bottom: 1px solid #6168d0; padding-bottom: 3px; min-height: 18px;"></div>
                    </div>
                    <div>
                        <div style="font-weight: 600; color: #6168d0; margin-bottom: 3px; font-size: 7pt;">License Number:</div>
                        <div style="border-bottom: 1px solid #6168d0; padding-bottom: 3px; min-height: 18px;"></div>
                    </div>
                    <div>
                        <div style="font-weight: 600; color: #6168d0; margin-bottom: 3px; font-size: 7pt;">Provider Signature:</div>
                        <div style="border-bottom: 1px solid #6168d0; padding-bottom: 3px; min-height: 18px;"></div>
                    </div>
                    <div>
                        <div style="font-weight: 600; color: #6168d0; margin-bottom: 3px; font-size: 7pt;">Date:</div>
                        <div style="border-bottom: 1px solid #6168d0; padding-bottom: 3px; min-height: 18px;">${new Date().toLocaleDateString('en-US')}</div>
                    </div>
                </div>
            </div>
            <div style="margin-top: 15px; font-size: 6pt; text-align: center; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 10px; line-height: 1.4;">
                This document contains confidential patient health information protected by HIPAA regulations.<br/>
                Unauthorized disclosure or use of this information is prohibited by federal and state law.
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
