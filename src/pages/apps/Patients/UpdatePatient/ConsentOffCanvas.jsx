import React, { useEffect } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getPatientConsentAction } from '../../../../redux/actions';
import Spinner from '../../../../constants/Spinner';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa6';

const ConsentOffCanvas = ({ show, handleClose }) => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { data, loading } = useSelector((state) => state?.getPatientConsentReducer || {});
    const patientConsents = data?.data || [];
    const patientId = searchParams.get('id');

    useEffect(() => {
        if (show && patientId) {
            dispatch(getPatientConsentAction({ patientId }));
        }
    }, [show, patientId, dispatch]);

    const handleDownload = async (url, fileName) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName || 'download.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    return (
        <Offcanvas show={show} placement="end" onHide={handleClose} className="consent-offcanvas">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title className="fw-semibold">Patient Consents</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body className="bg-light">
                {loading ? (
                    <div className="d-flex align-items-center justify-content-center h-100">
                        <Spinner />
                    </div>
                ) : patientConsents?.length > 0 ? (
                    <div className="d-flex flex-column gap-3">
                        {patientConsents.map((consent, idx) => {
                            const attachment = consent?.sourceAttachment?.[0];
                            const consentName = attachment?.fileName || `Consent #${idx + 1}`;
                            const consentDate = new Date(consent?.date).toLocaleDateString();
                            const status = consent?.status || 'Unknown';
                            const decision = consent?.decision || 'N/A';

                            return (
                                <div
                                    key={consent?._id}
                                    className="border rounded-3 bg-white shadow-sm p-3 d-flex justify-content-between align-items-center"
                                >
                                    <div className="d-flex flex-column">
                                        <h6 className="mb-1 text-info fw-semibold">{consentName}</h6>
                                        <small className="text-muted">
                                            <strong>Status:</strong> <span className='text-capitalize'>{status}</span> &nbsp;|&nbsp;
                                            {/* <strong>Decision:</strong> {decision} &nbsp;|&nbsp; */}
                                            <strong>Date:</strong> {consentDate}
                                        </small>
                                    </div>

                                    <div className="d-flex gap-2 align-items-center">
                                        {attachment?.url && (
                                            <>
                                                <FaCloudDownloadAlt
                                                    className="text-info m-0 fs-5 cursor-pointer"
                                                    title="Download"
                                                    onClick={() => handleDownload(attachment?.url?.split('?')[0], attachment?.fileName)}
                                                />

                                                <a
                                                    href={attachment?.url?.split('?')[0]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-secondary mb-1 fs-5"
                                                    title="View"
                                                >
                                                    <FaEye />
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center text-muted py-5">
                        No consents available for this patient.
                    </div>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default ConsentOffCanvas;
