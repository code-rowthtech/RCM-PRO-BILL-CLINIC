import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button, Modal, Spinner } from 'react-bootstrap';
import { FiPlus, FiEdit } from 'react-icons/fi';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { MdDeleteOutline } from 'react-icons/md';
import AddMedication from './AddMedication';
import { getMedicationAction } from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

// Placeholder components for Add / Update
// const AddMedication = ({ onCancel }) => <div><AddMedication/></div>;

const Medication = ({ isAccordionOpen }) => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const store = useSelector((state) => state);
  const patientId = searchParams.get('id');
  const [medicationData, setMedicationData] = useState([]);
  const [showUpdateMedication, setShowUpdateMedication] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [medicationModal, setMedicationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const medicationList = store?.getMedicationReducer?.data?.medicationRequests;
  const createSuccess = store?.createMedicationReducer?.data?.status;
  useEffect(() => {
    if (createSuccess === 201) {
      setSelectedMedication(null);
    }
  }, [createSuccess]);

  const handleEditClick = (data) => {
    setSelectedMedication(data);
    // setShowUpdateMedication(true);
    setMedicationModal(true);
  };

  const closeMedicationModal = () => {
    setMedicationModal(false)
    setSelectedMedication(null)
  }

  return (
    <>
      <div className="scroll-container" style={{ overflowY: 'scroll', overflowX: 'hidden', height: isAccordionOpen ? '60vh' : '80vh' }}>
        <Row>
          <Col sm={12} className="d-flex justify-content-between">
            <h4>Medication List</h4>
            <Button
              className="custom-buttons text-nowrap"
              onClick={() => {
                setSelectedMedication(null);
                // setShowUpdateMedication(false);
                setMedicationModal(true);
              }}
            >
              <FiPlus className="fs-5 text-white" />
              &nbsp; Add Medication
            </Button>
          </Col>

          <Col sm={12}>
            <Table responsive className="table-centered table-nowrap mb-0">
              <thead className="text-white bg-dark">
                <tr>
                  <th className="text-white">S. No.</th>
                  <th className="text-white">Status</th>
                  <th className="text-white">Medication</th>
                  <th className="text-white">Dosage Instruction</th>
                  <th className="text-white">Start Date</th>
                  <th className="text-white">End Date</th>
                  <th className="text-white">Notes</th>
                  <th className="text-white">Action</th>
                </tr>
              </thead>
              {loading ? (
                <tbody>
                  <tr>
                    <td className="text-center" colSpan={7}>
                      <Spinner className="my-5" />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {store?.getMedicationReducer?.loading ?
                    <tr>
                      <td colSpan={8} className="text-center">
                        <Spinner />
                      </td>
                    </tr>
                    :
                    medicationList?.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center">
                          <h4 className="my-5">No Medication Found!</h4>
                        </td>
                      </tr>
                    ) : (
                      medicationList?.map((data, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className='text-capitalize'>{data?.status || 'N/A'}</td>
                          <td>
                            <div className='d-flex flex-column'>
                              <span className='text-capitalize'> {data?.drugId?.proprietaryName || 'N/A'}</span>
                              <small className='text-muted' title={data?.drugId?.nonProprietaryName}> {data?.drugId?.nonProprietaryName?.length > 30 ? data?.drugId?.nonProprietaryName?.slice(0, 29) + '...' : data?.drugId?.nonProprietaryName || 'N/A'}</small>
                            </div>
                          </td>
                          <td title={data?.dosageInstruction?.[0]?.text}>{data?.dosageInstruction?.[0]?.text?.length > 30 ? data?.dosageInstruction?.[0]?.text?.slice(0, 29) + '...' : data?.dosageInstruction?.[0]?.text || 'N/A'}</td>
                          <td>{data?.startDate ? new Date(data?.startDate).toLocaleDateString('en-GB') : '-'}</td>
                          <td>{data?.endDate ? new Date(data?.endDate).toLocaleDateString('en-GB') : '-'}</td>
                          <td title={data?.note?.[0]?.text}>
                            {
                              data?.note?.[0]?.text
                                ? (data.note[0].text.charAt(0).toUpperCase() + data.note[0].text.slice(1)).slice(0, 29) + (data.note[0].text.length > 30 ? '...' : '')
                                : 'N/A'
                            }
                          </td>
                          <td>
                            <FiEdit
                              className="fs-4 cursor-pointer text-black"
                              onClick={() => handleEditClick(data)}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                </tbody>
              )}
            </Table>
          </Col>
        </Row>
      </div>


      <AddMedication show={medicationModal} onCancel={closeMedicationModal} selectedMedication={selectedMedication} />
      {/* <Modal show={medicationModal} onHide={() => setMedicationModal(false)} size="lg" centered>
        <Modal.Header closeButton className="px-2 py-0">
          <Modal.Title className="mb-0">
            {showUpdateMedication ? 'Update Medication' : 'Add Medication'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showUpdateMedication ? (
            <UpdateMedication
              medication={selectedMedication}
              onCancel={() => {
                setShowUpdateMedication(false);
                setMedicationModal(false);
              }}
            />
          ) : (
            <AddMedication
              onCancel={() => {
                setShowUpdateMedication(false);
                setMedicationModal(false);
              }}
            />
          )}
        </Modal.Body>
      </Modal> */}
    </>
  );
};

export default Medication;
