import React, { useState } from 'react';
import { Table, Row, Col, Button, Modal, Spinner } from 'react-bootstrap';
import { FiPlus, FiEdit } from 'react-icons/fi';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { MdDeleteOutline } from 'react-icons/md';
import AddMedication from './AddMedication';

// Placeholder components for Add / Update
// const AddMedication = ({ onCancel }) => <div><AddMedication/></div>;
const UpdateMedication = ({ medication, onCancel }) => <div>Update Medication Form <Button onClick={onCancel}>Cancel</Button></div>;

const Medication = () => {
  const [medicationData, setMedicationData] = useState([]);
  const [showUpdateMedication, setShowUpdateMedication] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [medicationModal, setMedicationModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEditClick = (data) => {
    setSelectedMedication(data);
    setShowUpdateMedication(true);
    setMedicationModal(true);
  };

  return (
    <>
      <div className="scroll-container" style={{ overflowY: 'scroll', overflowX: 'hidden', height: '70vh' }}>
        <Row>
          <Col sm={12} className="d-flex justify-content-between">
            <h4>Medication List</h4>
            <Button
              className="custom-buttons text-nowrap"
              onClick={() => {
                setSelectedMedication(null);
                setShowUpdateMedication(false);
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
                  <th className="text-white">Sr.No.</th>
                  <th className="text-white">Status</th>
                  <th className="text-white">Medication</th>
                  <th className="text-white">Dosage</th>
                  <th className="text-white">Route</th>
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
                  {medicationData?.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center">
                        <h3 className="my-5">No Medication Found!</h3>
                      </td>
                    </tr>
                  ) : (
                    medicationData.map((data, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data.status || 'N/A'}</td>
                        <td>{data.medication || 'N/A'}</td>
                        <td>{data.dosage || 'N/A'}</td>
                        <td>{data.route || 'N/A'}</td>
                        <td>{data.notes || 'N/A'}</td>
                        <td>
                          <IoInformationCircleOutline className="fs-4 cursor-pointer text-black" />
                          &nbsp;
                          <FiEdit
                            className="fs-4 cursor-pointer text-black"
                            onClick={() => handleEditClick(data)}
                          />
                          &nbsp;
                          <MdDeleteOutline
                            className="fs-4 cursor-pointer text-black"
                            onClick={() => {
                              // Replace with delete logic
                              console.log('Delete:', data.id);
                            }}
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

      <Modal show={medicationModal} onHide={() => setMedicationModal(false)} size="lg" centered>
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
      </Modal>
    </>
  );
};

export default Medication;
