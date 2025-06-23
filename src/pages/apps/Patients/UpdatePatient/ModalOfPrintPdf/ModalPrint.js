import React, { useEffect, useState, useMemo } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { getAlcoholHistoryAction, getEncounterAction, getFamilyGeneticAction, getMedicalHistoryAction, getMedicationAction, getSurgicalHistoryAction, getTobaccooAction, getVitalsByPatientIdAction } from '../../../../../redux/actions';
import { handlePrintPatientSummary } from '../../../../../helpers/printPatientSummary';
import { handlePrintEverything } from './handlePrintEverything';
import { loggedInUser } from '../../../../../helpers/api/loggedInUser';
import { getProblemListAction } from '../../../../../redux/ProblemList/action';
import { useSearchParams } from 'react-router-dom';
import { getAllergiesOfPatientAction } from '../../../../../redux/allergyList/action';

const ModalPrint = ({ show, onHide, patientDetails, store, id }) => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const patientId = searchParams.get('id');
    const [printOptions, setPrintOptions] = useState([]);
    const [selectedEncounter, setSelectedEncounter] = useState('');
    const [skip, setSkip] = useState(1);

    const encounters = store?.getEncounterReducer?.data?.encounters || [];

    const patientInfoOptions = useMemo(() => [
        'Patient Details', 'Responsible Party', 'Referring Doctor'
    ], []);

    const clinicalReviewOptions = useMemo(() => [
        'Allergies', 'Problems', 'Medications', 'Vitals'
    ], []);

    const socialHistoryOptions = useMemo(() => [
        'Tobacco History', 'Medical History', 'Family History', 'Alcohol History', 'Surgical History'
    ], []);

    useEffect(() => {
        dispatch(getEncounterAction({ patientId: id, skip }));
    }, [dispatch, id, skip]);

    const handleCheckboxChange = (option) => {
        const skip = 1;
        if (option === 'Allergies') {
            dispatch(getAllergiesOfPatientAction({ patientId, skip }));
        } else if (option === 'Problems') {
            dispatch(getProblemListAction({ patientId, skip }));
        } else if (option === 'Medications') {
            dispatch(getMedicationAction({ patientId, skip, limit: 10 }));
        } else if (option === 'Vitals') {
            dispatch(getVitalsByPatientIdAction({ patientId, limit: 5 }))
        } else if (option === 'Alcohol History') {
            dispatch(getAlcoholHistoryAction({ patientId }))
        } else if (option === 'Family History') {
            dispatch(getFamilyGeneticAction({ patientId }));
        } else if (option === 'Medical History') {
            dispatch(getMedicalHistoryAction({ patientId }));
        } else if (option === 'Tobacco History') {
            dispatch(getTobaccooAction({ patientId }));
        } else if (option === 'Surgical History') {
            dispatch(getSurgicalHistoryAction({ patientId }));
        }
        setPrintOptions((prev) =>
            prev.includes(option)
                ? prev.filter((item) => item !== option)
                : [...prev, option]
        );
    };

    const printData = useMemo(() => ({
        toBePrinted: printOptions,
        patientDetails,
        vitals: store?.getVitalsByPatientIdReducer?.data?.data,
        medicationList: store?.getMedicationReducer?.data?.medicationRequests,
        allergyData: store?.getAllergiesOfAPatientReducer?.data?.allergies,
        problemData: store?.getProblemListReducer?.data?.problems,
        socialHistory: store?.getSocialHistoryReducer?.data,
        encounterData: selectedEncounter,
        tobaccoHistory: store?.getTobaccooReducer?.data?.tobaccoHistory,
        familyHistory: store.getFamilyGeneticReducer.data.familyMedicalHistory,
        alcoholHistory: store?.getAlcoholHistoryReducer?.data?.data,
        medicalHistory: store?.getMedicalHistoryReducer?.data?.medicalHistory,
        surgicalHistory: store?.getSurgicalHistoryReducer?.data?.result,
    }), [printOptions, patientDetails, selectedEncounter, store]);

    const isLoading = store?.getVitalsByPatientIdReducer?.loading ||
        store?.getMedicationReducer?.loading ||
        store?.getAllergiesOfAPatientReducer?.loading ||
        store?.getProblemListReducer?.loading ||
        store?.getSocialHistoryReducer?.loading ||
        store?.getSurgicalHistoryReducer?.loading;

    return (
        <Modal show={show} centered onHide={onHide} size="lg" className="print_documents_modal">
            <Modal.Header closeButton className="px-2 py-0">
                <Modal.Title>Print Patient Summary</Modal.Title>
            </Modal.Header>

            <Modal.Body className="px-2 py-1" style={{ maxHeight: 'calc(50vh - 120px)', overflow: 'hidden' }}>
                <div className="d-flex gap-4 mb-2">
                    {[['Patient Information', patientInfoOptions],
                    ['Clinical Review', clinicalReviewOptions],
                    ['Social History', socialHistoryOptions]
                    ].map(([title, options]) => (
                        <div className="flex-grow-1 pe-3" key={title}>
                            <h5 className="fw-bold mb-2">{title}</h5>
                            <div className="d-flex flex-column gap-2">
                                {options.map((option) => (
                                    <div className="form-check d-flex align-items-center" key={option}>
                                        <input
                                            className="form-check-input me-2"
                                            type="checkbox"
                                            id={`${title}-${option}`}
                                            checked={printOptions.includes(option)}
                                            onChange={() => handleCheckboxChange(option)}
                                        />
                                        <label className="form-check-label" htmlFor={`${title}-${option}`}>
                                            {option}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-top pt-0 scroll-container" style={{ maxHeight: '200px' }}>
                    <h5 className="fw-bold mb-2 mt-0 sticky-top bg-white py-2">Select Encounter</h5>
                    <div className="d-flex flex-wrap gap-4 pb-2">
                        {encounters.map((encounter) => {
                            const encounterId = encounter?._id;
                            const encounterDate = encounter?.period?.start
                                ? new Date(encounter.period.start).toISOString().split('T')[0]
                                : 'No Date Available';

                            return (
                                <div className="form-check d-flex align-items-center" key={encounterId}>
                                    <input
                                        className="form-check-input me-2"
                                        type="radio"
                                        name="encounter-radio"
                                        id={`encounter-${encounterId}`}
                                        checked={selectedEncounter?._id === encounterId}
                                        onChange={(e) => {
                                            setSelectedEncounter(encounter);
                                            setPrintOptions((prev) =>
                                                prev.includes('Encounter') ? prev : [...prev, 'Encounter']
                                            );
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor={`encounter-${encounterId}`}>
                                        {encounterDate}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <div className="d-flex justify-content-between align-items-center w-100">
                    <small className="text-muted">{printOptions.length} sections selected</small>
                    <div className="d-flex">
                        <Button variant="" onClick={onHide} disabled={isLoading || printOptions?.length === 0} className="me-2 custom-buttons text-white">
                            Preview Report
                        </Button>
                        <Button
                            variant="primary"
                            className="custom-buttons text-white"
                            onClick={() => {
                                handlePrintEverything(printData);
                                onHide();
                            }}
                            disabled={isLoading || printOptions?.length === 0}
                        >
                            {isLoading ? 'Preparing Report...' : 'Print Report'}
                        </Button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalPrint;
