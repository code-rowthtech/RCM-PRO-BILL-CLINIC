import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createContractAction, standardContractAction } from '../../../../redux/actions';
import { encryptMessage } from '../../../../cryptoUtils';
import Spinner from '../../../../constants/Spinner';
import { IoMdClose } from 'react-icons/io';
import { FiDownload } from 'react-icons/fi';

const Contract = ({ billingId, activeTab }) => {
    const dispatch = useDispatch();
    const { createContractReducer, getContractReducer, standardContractReducer } = useSelector((state) => state);

    const [viewList, setViewList] = useState(false);
    const [show, setShow] = useState(false);
    const clinic_id = JSON.parse(sessionStorage.getItem('hyper_user'))?.clinicId;
    // Check if the createContract data is empty
    const contract =
        createContractReducer?.data &&
        Object.keys(createContractReducer?.data).length > 0
            ? createContractReducer?.data
            : null;
        console.log(contract,"contract")

    const standardContract = standardContractReducer?.data;
    console.log(standardContract,"standardContract")

    useEffect(() => {
        if (activeTab === 'contract') {
            const payload = {
                clinicId: clinic_id,
            };
            dispatch(createContractAction({ key: encryptMessage(payload) }));
        }
    }, [activeTab, clinic_id, dispatch]);

    useEffect(() => {
        dispatch(standardContractAction());
    }, [dispatch]);

    const handleCloseContractModal = () => setShow(false);

    const handleDownload = (fileUrl) => {
        if (fileUrl) window.open(fileUrl, '_blank');
    };

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
                            {createContractReducer?.loading || standardContractReducer?.loading ? (
                                <tr>
                                    <td className="text-center" colSpan={5}>
                                        <Spinner />
                                    </td>
                                </tr>
                            ) : (!contract && !standardContract) ? (
                                <tr>
                                    <td colSpan={5} className="text-center">
                                        <h3 className="my-5">No Contract Found</h3>
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td className="text-black">
                                        {contract?.contract?.contractName ||
                                            standardContract?.contract?.contractType ||
                                            'N/A'}
                                    </td>
                                    <td>
                                        <span
                                            className={`${
                                                (contract?.contract?.clinicSignStatus ||
                                                    standardContract?.contract?.clinicSignStatus)
                                                    ? 'bg-success'
                                                    : 'bg-secondary'
                                            } text-light px-1 rounded-1`}
                                        >
                                            {(contract?.contract?.clinicSignStatus ||
                                                standardContract?.contract?.clinicSignStatus)
                                                ? 'Signed'
                                                : 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={`${
                                                (contract?.contract?.adminSignStatus ||
                                                    standardContract?.contract?.adminSignStatus)
                                                    ? 'bg-success'
                                                    : 'bg-secondary'
                                            } text-light px-1 rounded-1`}
                                        >
                                            {(contract?.contract?.adminSignStatus ||
                                                standardContract?.contract?.adminSignStatus)
                                                ? 'Signed'
                                                : 'Pending'}
                                        </span>
                                    </td>
                                    <td>{contract?.contract?.sentDate || standardContract?.contract?.sentDate || 'N/A'}</td>
                                    <td>
                                        <i
                                            className="fs-4 me-1 uil-eye cursor-pointer"
                                            onClick={() => setShow(true)}
                                        ></i>
                                        <i
                                            className="cursor-pointer fs-4"
                                            onClick={() => {
                                                handleDownload(
                                                    contract?.contract?.certificateFileUrl ||
                                                        standardContract?.contract?.certificateFileUrl
                                                );
                                            }}
                                        >
                                            <FiDownload />
                                        </i>
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
                                src={contract?.contract?.fileUrl || standardContract?.contract?.fileUrl}
                                title={contract?.contract?.fileName || standardContract?.contract?.fileName}
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
