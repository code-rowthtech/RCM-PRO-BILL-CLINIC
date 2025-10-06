import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { IoCloseCircleOutline } from 'react-icons/io5';

const CancellationPopup = ({ show, onClose, onSubmit, reason, onReasonChange }) => {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div
      className="position-absolute cancellation-popup border bg-white"
      style={{
        left: '84%',
        top: '0%',
        width: '14vw',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
      }}
    >
      <p className="fs-4 px-2 mb-0 text-end">
        <IoCloseCircleOutline onClick={onClose} />
      </p>
      <div className="p-2 pt-0">
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Cancelation Reason</Form.Label>
            <Form.Control
              className="mb-2"
              onChange={(e) => onReasonChange(e.target.value)}
              type="text"
              placeholder="Enter the cancellation reason"
              value={reason}
            />
          </Form.Group>
          <div className="text-end">
            <Button
              disabled={!reason}
              className="custom-buttons"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CancellationPopup;