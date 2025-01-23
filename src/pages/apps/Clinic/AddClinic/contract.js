import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createContractAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';
import { IoMdClose } from 'react-icons/io';
import { FiDownload } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Contract = ({ billingId, activeTab }) => {
    const dispatch = useDispatch();
    const { createContractReducer, getContractReducer } = useSelector((state) => state);

    const [show, setShow] = useState(false);
    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    const contract = createContractReducer?.data;
    useEffect(() => {
        if (activeTab === 'contract') {
            const payload = {
                clinicId: clinic_id,
            };
            dispatch(createContractAction({ key: encryptMessage(payload) }));
        }
    }, [activeTab, clinic_id, dispatch]);

    const handleCloseContractModal = () => setShow(false);

    return (
        <>
            <Row style={{ height: '100%' }}>
                {getContractReducer?.loading ? (
                    <Row>
                        <Col className="d-flex justify-content-center align-items-center">
                            <Spinner />
                        </Col>
                    </Row>
                ) : (
                    <Table responsive className="table-centered border border-muted table-nowrap mb-0 mt-2">
                        <thead>
                            <tr>
                                <th className="text-white">Contract Name</th>
                                <th className="text-white">Practice Sign</th>
                                <th className="text-white">Probill Sign</th>
                                <th className="text-white">Date</th>
                                <th className="text-white">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {createContractReducer?.loading ? (
                                <tr>
                                    <td className="text-center" colSpan={5}>
                                        <Spinner />
                                    </td>
                                </tr>
                            ) : !contract ? (
                                <tr>
                                    <td colSpan={5} className="text-center">
                                        <h3 className="my-5">No Contract Found</h3>
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td className="text-black">
                                        {contract?.contract?.contractName || "Standard Agreement Document" || 'N/A'}
                                    </td>
                                    <td>
                                        <span
                                            className={`${contract?.contract?.clinicSignStatus ? 'bg-success' : 'bg-secondary'} text-light px-1 rounded-1`}
                                        >
                                            {contract?.contract?.clinicSignStatus ? 'Signed' : 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={`${contract?.contract?.adminSignStatus ? 'bg-success' : 'bg-secondary'} text-light px-1 rounded-1`}
                                        >
                                            {contract?.contract?.adminSignStatus ? 'Signed' : 'Pending'}
                                        </span>
                                    </td>
                                    <td>{contract?.contract?.sentDate ||
                                         (contract?.standardContract?.createdAt ? 
                                            new Date(contract.standardContract.createdAt)
                                              .toLocaleDateString('en-GB') : // 'en-GB' ensures DD/MM/YYYY format
                                            'N/A')}</td>
                                    <td>
                                        <i
                                            className="fs-4 me-1 uil-eye cursor-pointer"
                                            onClick={() => setShow(true)}
                                        ></i>
                                        <Link
                                            to={contract?.contract?.documentFileUrl || contract?.standardContract?.fileUrl}
                                            target="blank"
                                            className="cursor-pointer fs-4"
                                        >
                                            <FiDownload />
                                        </Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </Row>

            <Modal centered show={show} size="xl" onHide={handleCloseContractModal}>
                <Modal.Body>
                    <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
                        <Col sm={1}></Col>
                        <Col sm={10}>
                            <h4 className="mb-0 text-center">Contract</h4>
                        </Col>
                        <Col sm={1}>
                            <IoMdClose className="fs-4 cursor-pointer" onClick={handleCloseContractModal} />
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                         
                             <iframe
                                src={contract?.contract?.contractSignStatus === true ? contract?.contract?.documentFileUrl : contract?.contract?.contractTemplateId?.fileUrl || contract?.standardContract?.fileUrl}
                                title={contract?.contract?.contractSignStatus === true ? contract?.contract?.documentFileName : contract?.contract?.contractName}
                                width="100%"
                                height="620px"
                                className="px-4"
                                style={{ border: 'none' }}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Contract;
