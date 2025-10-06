import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import { FiDownload } from 'react-icons/fi';

import Spinner from '../../../../../constants/Spinner';
import { createContractAction } from '../../../../../redux/actions';
import { decryptMessage, encryptMessage } from '../../../../../cryptoUtils';

const Contract = ({ activeTab }) => {
  const dispatch = useDispatch();
  const { createContractReducer, getContractReducer } = useSelector((state) => state);
  
  const [show, setShow] = useState(false);
  const clinic_id = decryptMessage(localStorage?.getItem('subClinicLocation')) || '';
  const contract = createContractReducer?.data;

  useEffect(() => {
    if (activeTab === 'contract') {
      const payload = { clinicId: clinic_id };
      dispatch(createContractAction({ key: encryptMessage(payload) }));
    }
  }, [activeTab, clinic_id, dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getContractUrl = () => {
    return contract?.contract?.documentFileUrl || contract?.standardContract?.fileUrl;
  };

  const getIframeUrl = () => {
    return contract?.contract?.contractSignStatus === true 
      ? contract?.contract?.documentFileUrl 
      : contract?.contract?.contractTemplateId?.fileUrl || contract?.standardContract?.fileUrl;
  };

  const getContractName = () => {
    return contract?.contract?.contractName || "Standard Agreement Document" || 'N/A';
  };

  const getContractDate = () => {
    return contract?.contract?.sentDate || 
           (contract?.standardContract?.createdAt ? formatDate(contract.standardContract.createdAt) : 'N/A');
  };

  const renderStatusBadge = (status, label) => (
    <span className={`${status ? 'bg-success' : 'bg-secondary'} text-light px-1 rounded-1`}>
      {status ? 'Signed' : 'Pending'}
    </span>
  );

  const renderTableContent = () => {
    if (createContractReducer?.loading) {
      return (
        <tr>
          <td className="text-center" colSpan={5}>
            <Spinner />
          </td>
        </tr>
      );
    }

    if (!contract) {
      return (
        <tr>
          <td colSpan={5} className="text-center">
            <h3 className="my-5">No Contract Found</h3>
          </td>
        </tr>
      );
    }

    return (
      <tr>
        <td className="text-black">{getContractName()}</td>
        <td>{renderStatusBadge(contract?.contract?.clinicSignStatus, 'Practice Sign')}</td>
        <td>{renderStatusBadge(contract?.contract?.adminSignStatus, 'Probill Sign')}</td>
        <td>{getContractDate()}</td>
        <td>
          <i
            className="fs-4 me-1 uil-eye cursor-pointer"
            onClick={() => setShow(true)}
          />
          <Link
            to={getContractUrl()}
            target="blank"
            className="cursor-pointer fs-4"
          >
            <FiDownload />
          </Link>
        </td>
      </tr>
    );
  };

  return (
    <>
      <Row>
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
              {renderTableContent()}
            </tbody>
          </Table>
        )}
      </Row>

      <Modal centered show={show} size="xl" onHide={() => setShow(false)}>
        <Modal.Body>
          <Row className="border-bottom mb-2 pb-2 d-flex align-items-center">
            <Col sm={1} />
            <Col sm={10}>
              <h4 className="mb-0 text-center">Contract</h4>
            </Col>
            <Col sm={1}>
              <IoMdClose className="fs-4 cursor-pointer" onClick={() => setShow(false)} />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <iframe
                src={getIframeUrl()}
                title={getContractName()}
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