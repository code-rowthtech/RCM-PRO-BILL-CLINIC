import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { getEncounterAction } from '../../../../../redux/actions';
import { handlePrintPatientSummary } from '../../../../../helpers/printPatientSummary';

const ModalPrint = ({ show, onHide, patientDetails, store, id }) => {
    const dispatch = useDispatch();
    const [printOptions, setPrintOptions] = useState(['Encounter']);
    const [selectedEncounter, setSelectedEncounter] = useState('');
    const [skip, setSkip] = useState(1);
    const encounters = store?.getEncounterReducer?.data?.encounters;
    console.log('encounters', encounters);
    const patientInfoOptions = ['Patient Details', 'Demographic', 'Responsible Party', 'Referring Doctor'];
    const clinicalReviewOptions = ['Allergies', 'Problems', 'Medications', 'Vitals'];
    const socialHistoryOptions = ['Tobacco History', 'Medical History', 'Family History', 'Alcohol History'];
    const encounterOptions = [
        '15/10/2023',
        '14/10/2023',
        '13/10/2023',
        '12/10/2023',
        '11/10/2023',
        '10/10/2023',
        '09/10/2023',
        '08/10/2023',
        '07/10/2023',
        '06/10/2023',
        '05/10/2023',
        '04/10/2023',
        '03/10/2023',
        '02/10/2023',
        '01/10/2023',
    ];

    useEffect(() => {
        dispatch(getEncounterAction({ patientId: id, skip: skip }));
    }, [skip, dispatch, id]);
    const handleCheckboxChange = (option) => {
        if (printOptions.includes(option)) {
            setPrintOptions(printOptions.filter((item) => item !== option));
        } else {
            setPrintOptions([...printOptions, option]);
        }
    };

    return (
        <Modal show={show} centered onHide={onHide} size="lg" className="print_documents_modal">
            <Modal.Header closeButton className="px-2 py-0">
                <Modal.Title>Print Patient Summary</Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-2 py-1" style={{ maxHeight: 'calc(50vh - 120px)', overflow: 'hidden' }}>
                {/* Top Row - Horizontal Sections */}
                <div className="d-flex gap-4 mb-2">
                    {/* Patient Information */}
                    <div className="flex-grow-1 pe-3">
                        <h5 className="fw-bold mb-2">Patient Information</h5>
                        <div className="d-flex flex-column gap-2">
                            {patientInfoOptions.map((option) => (
                                <div className="form-check d-flex align-items-center" key={option}>
                                    <input
                                        className="form-check-input me-2"
                                        type="checkbox"
                                        id={`patient-${option}`}
                                        checked={printOptions.includes(option)}
                                        onChange={() => handleCheckboxChange(option)}
                                    />
                                    <label className="form-check-label" htmlFor={`patient-${option}`}>
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Clinical Review */}
                    <div className="flex-grow-1 pe-3">
                        <h5 className="fw-bold mb-2">Clinical Review</h5>
                        <div className="d-flex flex-column gap-2">
                            {clinicalReviewOptions.map((option) => (
                                <div className="form-check d-flex align-items-center" key={option}>
                                    <input
                                        className="form-check-input me-2"
                                        type="checkbox"
                                        id={`clinical-${option}`}
                                        checked={printOptions.includes(option)}
                                        onChange={() => handleCheckboxChange(option)}
                                    />
                                    <label className="form-check-label" htmlFor={`clinical-${option}`}>
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Social History */}
                    <div className="flex-grow-1">
                        <h5 className="fw-bold mb-2">Social History</h5>
                        <div className="d-flex flex-column gap-2">
                            {socialHistoryOptions.map((option) => (
                                <div className="form-check d-flex align-items-center" key={option}>
                                    <input
                                        className="form-check-input me-2"
                                        type="checkbox"
                                        id={`social-${option}`}
                                        checked={printOptions.includes(option)}
                                        onChange={() => handleCheckboxChange(option)}
                                    />
                                    <label className="form-check-label" htmlFor={`social-${option}`}>
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Row - Encounter Section */}
                <div className="border-top pt-0 scroll-container" style={{ maxHeight: '200px' }}>
                    <h5 className="fw-bold mb-2 mt-0 sticky-top bg-white py-2">Select Encounter</h5>
                    <div className="d-flex flex-wrap gap-4 pb-2">
                        {encounters?.map((option) => (
                            <div className="form-check d-flex align-items-center" key={option}>
                                <input
                                    className="form-check-input me-2"
                                    type="radio"
                                    name="encounter-radio"
                                    id={`encounter-${option?._id}`}
                                    checked={selectedEncounter === option}
                                    onChange={() => setSelectedEncounter(option)}
                                />
                                <label className="form-check-label" htmlFor={`encounter-${option}`}>
                                    {option?.period?.start
                                        ? new Date(option?.period?.start).toISOString().split('T')[0]
                                        : 'No Date Available'}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-between align-items-center w-100">
                    <small className="text-muted">{printOptions.length} sections selected</small>
                    <div className="d-flex">
                        <Button variant="" onClick={onHide} className="me-2 custom-buttons text-white">
                            Preview Report
                        </Button>
                        <Button
                            variant="primary"
                            className="custom-buttons text-white"
                            onClick={() => {
                                handlePrintPatientSummary({
                                    toBePrinted: printOptions,
                                    patientDetails,
                                    vitals: store?.getVitalsByPatientIdReducer?.data?.data,
                                    medicationList: store?.getMedicationReducer?.data?.medicationRequests,
                                    allergyData: store?.getAllergiesOfAPatientReducer?.data?.allergies,
                                    problemData: store?.getProblemListReducer?.data?.problems,
                                    selectedEncounter,
                                    socialHistory: store?.getSocialHistoryReducer?.data,
                                    encounterData:selectedEncounter,
                                });
                                onHide();
                            }}
                           >
                            {store?.getVitalsByPatientIdReducer?.loading ||
                            store?.getMedicationReducer?.loading ||
                            store?.getAllergiesOfAPatientReducer?.loading ||
                            store?.getProblemListReducer?.loading ||
                            store?.getSocialHistoryReducer?.loading
                                ? 'Preparing Report...'
                                : 'Print Report'}
                        </Button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalPrint;
