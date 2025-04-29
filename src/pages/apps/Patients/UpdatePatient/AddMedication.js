import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';

const AddMedication = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    status: '',
    code: { coding: [{ display: '' }] },
    doseForm: { coding: [{ display: '' }] },
    totalVolume: { value: '', unit: '' },
    ingredient: [{
      itemCodeableConcept: { coding: [{ display: '' }] },
      isActive: true,
      strength: {
        numerator: { value: '', unit: '' },
        denominator: { value: '', unit: '' }
      }
    }],
    batch: {
      lotNumber: '',
      expirationDate: ''
    }
  });

  const handleChange = (e, path) => {
    const keys = path.split('.');
    const updatedForm = { ...formData };
    let obj = updatedForm;
    while (keys.length > 1) obj = obj[keys.shift()];
    obj[keys[0]] = e.target.value;
    setFormData(updatedForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submit:', formData);
    // Save logic here
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h4 className="mb-4">Add Medication</h4>

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Select value={formData.status} onChange={(e) => handleChange(e, 'status')}>
                  <option value="">Select</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="entered-in-error">Entered in Error</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="code">
                <Form.Label>Medication Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Paracetamol"
                  value={formData.code.coding[0].display}
                  onChange={(e) => handleChange(e, 'code.coding.0.display')}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="doseForm">
                <Form.Label>Dose Form</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Tablet"
                  value={formData.doseForm.coding[0].display}
                  onChange={(e) => handleChange(e, 'doseForm.coding.0.display')}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group controlId="totalVolumeValue">
                <Form.Label>Total Volume (Value)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 500"
                  value={formData.totalVolume.value}
                  onChange={(e) => handleChange(e, 'totalVolume.value')}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="totalVolumeUnit">
                <Form.Label>Total Volume (Unit)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. mL"
                  value={formData.totalVolume.unit}
                  onChange={(e) => handleChange(e, 'totalVolume.unit')}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Ingredient</h5>
          <Row>
            <Col md={6}>
              <Form.Group controlId="ingredientName">
                <Form.Label>Ingredient Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Acetaminophen"
                  value={formData.ingredient[0].itemCodeableConcept.coding[0].display}
                  onChange={(e) => handleChange(e, 'ingredient.0.itemCodeableConcept.coding.0.display')}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="strengthNumeratorValue">
                <Form.Label>Strength (Numerator)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Value"
                  value={formData.ingredient[0].strength.numerator.value}
                  onChange={(e) => handleChange(e, 'ingredient.0.strength.numerator.value')}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="strengthNumeratorUnit">
                <Form.Label>&nbsp;</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Unit"
                  value={formData.ingredient[0].strength.numerator.unit}
                  onChange={(e) => handleChange(e, 'ingredient.0.strength.numerator.unit')}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={3}>
              <Form.Group controlId="strengthDenominatorValue">
                <Form.Label>Strength (Denominator)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Value"
                  value={formData.ingredient[0].strength.denominator.value}
                  onChange={(e) => handleChange(e, 'ingredient.0.strength.denominator.value')}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="strengthDenominatorUnit">
                <Form.Label>&nbsp;</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Unit"
                  value={formData.ingredient[0].strength.denominator.unit}
                  onChange={(e) => handleChange(e, 'ingredient.0.strength.denominator.unit')}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="ingredientActive">
                <Form.Label>Is Active</Form.Label>
                <Form.Select
                  value={formData.ingredient[0].isActive ? 'true' : 'false'}
                  onChange={(e) => handleChange(e, 'ingredient.0.isActive')}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Batch Information</h5>
          <Row>
            <Col md={6}>
              <Form.Group controlId="lotNumber">
                <Form.Label>Lot Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. ABC12345"
                  value={formData.batch.lotNumber}
                  onChange={(e) => handleChange(e, 'batch.lotNumber')}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="expirationDate">
                <Form.Label>Expiration Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.batch.expirationDate}
                  onChange={(e) => handleChange(e, 'batch.expirationDate')}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-end">
        <Button variant="secondary" className="me-2" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">Save Medication</Button>
      </div>
    </Form>
  );
};

export default AddMedication;
