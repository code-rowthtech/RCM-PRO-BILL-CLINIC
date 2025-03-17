import React, { useState } from 'react';
import { Badge, Button, Card, Table, Modal } from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';
import { GoInfo } from "react-icons/go";
import { IoCloseCircleOutline } from "react-icons/io5";

const Drug = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <div className="mt-2">
                <Card className="px-2" style={{ height: '70vh' }}>
                    <div className='pt-2 px-2'>
                        <div className='d-flex justify-content-between'>
                            <h4>Drug-Drug Interactions and Drug-Allergy Interactions</h4>
                            <Button className="custom-buttons" onClick={() => setShowModal(true)}>
                                <FiPlus className="fs-5 text-white" /> &nbsp;Task
                            </Button>
                        </div>
                        <div>
                            <Table responsive className="table table-nowrap mb-0">
                                <thead className="text-white bg-dark">
                                    <tr>
                                        <th className="text-white">Risk</th>
                                        <th className="text-white">Severity</th>
                                        <th className="text-white">Drug 1</th>
                                        <th className="text-white">Drug 2</th>
                                        <th className="text-white">Interaction Summary</th>
                                        <th className="text-white">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-capitalize" style={{ width: "5%", whiteSpace: "normal" }}>
                                            <Badge className='px-2 py-1 fs-6'>C</Badge>
                                        </td>
                                        <td className="text-capitalize" style={{ width: "10%", whiteSpace: "normal" }}>
                                        <Badge className="px-3 py-1 fs-6 bg-warning">Moderate</Badge>
                                        </td>
                                        <td className="text-capitalize" style={{ width: "25%", whiteSpace: "normal" }}>
                                            citalopram hydrobromide 10 mg ORAL tablet
                                        </td>
                                        <td className="text-capitalize" style={{ width: "25%", whiteSpace: "normal" }}>
                                            fluticasone propionate/salmeterol xinafoate 250 mcg-50 mcg/dose INHALATION Blister, With Inhalation Device
                                        </td>
                                        <td style={{ width: "30%", whiteSpace: "normal" }}>
                                            citalopram hydrobromide 10 mg ORAL tablet and fluticasone propionate/salmeterol xinafoate 250 mcg-50 mcg/dose
                                            INHALATION Blister, With Inhalation Device may interact based on the potential interaction between CITALOPRAM and
                                            POSSIBLE QT PROLONGING AGENTS.
                                        </td>
                                        <td style={{ width: "5%", whiteSpace: "normal" }}>
                                            <GoInfo className="fs-4 ms-2 cursor-pointer text-black" onClick={() => setShowModal(true)} />
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                            <div className="my-2">
                                <div className="d-flex gap-2 flex-wrap align-items-start">
                                    <p className="bg-light rounded mb-0 px-2 py-1 text-nowrap">
                                        <span className="fw-bold">A:</span> <span>No known interaction</span>
                                    </p>
                                    <p className="bg-light rounded mb-0 px-2 py-1 text-nowrap">
                                        <span className="fw-bold">B:</span> <span>No action needed</span>
                                    </p>
                                    <p className="bg-primary rounded text-white mb-0 px-2 py-1 text-nowrap">
                                        <span className="fw-bold">C:</span> <span>Monitor therapy</span>
                                    </p>
                                    <p className="bg-warning rounded text-white mb-0 px-2 py-1 text-nowrap">
                                        <span className="fw-bold">D:</span> <span>Consider therapy modification</span>
                                    </p>
                                    <p className="bg-danger rounded text-white mb-0 px-2 py-1 text-nowrap">
                                        <span className="fw-bold">X:</span> <span>Avoid combination</span>
                                    </p>
                                </div>
                                <div className='mt-2'>
                                    <h5 className='mb-1'>Disclaimer :</h5>
                                    <p>The information contained in the First Databank (FDB) databases is intended to supplement the knowledge
                                        of physicians, pharmacists, and other healthcare professionals regarding drug therapy problems and
                                        patient counseling information. This information is advisory only and is not intended to replace sound
                                        clinical judgment in the delivery of healthcare services. FDB disclaims all warranties, whether
                                        expressed or implied, including any warranty as to the quality, accuracy, and suitability of this
                                        information for any purpose. Copyright 2022 First Databank, Inc.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Body>
                    <div>
                        <div className="row">
                            <div className="col-10">
                                <h4 className='text-black'>
                                    Drug Drug Interaction: citalopram hydrobromide 10 mg ORAL tablet and fluticasone propionate/salmeterol
                                    xinafoate 250 mcg-50 mcg/dose INHALATION Blister, With Inhalation Device
                                </h4>
                            </div>
                            <div className="col-2 d-flex justify-content-end pt-2">
                                <IoCloseCircleOutline className='text-danger fs-3 cursor-pointer' onClick={() => setShowModal(false)} />
                            </div>
                        </div>
                    </div>
                    <hr />
                    <h5 className='text-black'><strong>Summary:</strong></h5>
                    <p>
                        Citalopram hydrobromide 10 mg ORAL tablet and fluticasone propionate/salmeterol xinafoate 250 mcg-50 mcg/dose
                        INHALATION Blister, With Inhalation Device may interact based on the potential interaction between CITALOPRAM
                        and POSSIBLE QT PROLONGING AGENTS.
                    </p>
                    <h5 className='text-black'><strong>Patient Management:</strong></h5>
                    <p>
                        Concurrent use of citalopram with agents known to prolong the QT interval should be avoided.Due to the risk of QT
                        prolongation, citalopram doses greater than 40 mg once daily are not recommended. Citalopram doses should be
                        limited to 20 mg once daily in patients who are CYP2C19 poor metabolizers or patients receiving CYP2C19
                        inhibitors.If patients have a persistent QTc measurement 500 ms, discontinue citalopram. If a patient
                        develops symptoms including dizziness, palpitations, or syncope, further evaluation is warranted included
                        cardiac monitoring.The manufacturer recommends ECG monitoring in patients for whom citalopram is not recommended,
                        including those receiving concurrent therapy with agents known to prolong the QT interval. Citalopram should be
                        discontinued in patients with persistent QTc measurements greater than 500 ms.(1-2) Consider obtaining serum
                        calcium, magnesium, and potassium levels at regular intervals. Correct any electrolyte abnormalities. Instruct
                        patients to report any irregular heartbeat, dizziness, or fainting.
                    </p>
                    <hr />
                    <div className='d-flex gap-2 flex-wrap align-items-start justify-content-end mt-3 mb-1'>
                        <p className="bg-primary text-white rounded mb-0 px-2 py-1 text-nowrap">
                            <span className="fw-bold">C:</span> <span>Monitor therapy</span>
                        </p>
                        <p className="bg-light rounded mb-0 px-2 py-1 text-nowrap">
                            <span className="fw-bold">Severity(1):</span> <span>Moderate</span>
                        </p>
                    </div>
                </Modal.Body>

            </Modal>
        </div>
    );
}

export default Drug;
