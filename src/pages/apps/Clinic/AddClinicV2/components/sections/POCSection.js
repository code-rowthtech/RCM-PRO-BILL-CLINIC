import React from 'react';
import { Col, Form, Row, InputGroup } from 'react-bootstrap';
import { FiMinusCircle } from 'react-icons/fi';
import us from '../../../../../../assets/images/flags/us.jpg';

const POCSection = ({ pocs, setPocs }) => {
  const handlePocChange = (index, field, value) => {
    setPocs((prevPocs) => {
      const updatedPocs = [...prevPocs];
      const keys = field.split('.');
      let target = updatedPocs[index];
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]] = { ...target[keys[i]] };
      }
      target[keys[keys.length - 1]] = value;
      return updatedPocs;
    });
  };

  const handleTelecomChange = (pocIndex, telecomIndex, field, value) => {
    const updatedPoc = [...pocs];
    let rawValue = value.replace(/\D/g, '');
    
    if (rawValue.length > 10) rawValue = rawValue.slice(0, 10);
    
    const formattedValue = rawValue.replace(/(\d{1,3})(\d{0,7})/, (match, p1, p2) => {
      if (p2) return `(${p1})${p2}`;
      return `(${p1}`;
    });

    updatedPoc[pocIndex].telecom[telecomIndex][field] = formattedValue;
    setPocs(updatedPoc);
  };

  const addPoc = () => {
    setPocs([
      ...pocs,
      {
        name: {
          use: 'official',
          text: '',
          family: '',
          given: [''],
          prefix: [''],
          suffix: []
        },
        email: '',
        role: '',
        telecom: [{ system: '', value: '', use: '' }]
      }
    ]);
  };

  const removePoc = (index) => {
    if (pocs.length > 1) {
      setPocs(pocs.filter((_, i) => i !== index));
    }
  };

  const formatDisplayValue = (value) => {
    if (!value) return '';
    const rawValue = value.replace(/\D/g, '');
    return rawValue.replace(/(\d{1,3})(\d{0,3})(\d{0,4})/, (match, p1, p2, p3) => {
      if (p3) return `(${p1})${p2}-${p3}`;
      if (p2) return `(${p1})${p2}`;
      return `(${p1}`;
    });
  };

  return (
    <Row>
      <Col sm={12} className="mt-2">
        <h5>
          Points of Contact (POC)
          <span
            className="fs-5 uil-plus-circle plusicon fw-bold cursor-pointer"
            onClick={addPoc}
          />
        </h5>
      </Col>
      
      {pocs.map((poc, pocIndex) => (
        <div key={pocIndex} className="mb-2">
          <Row>
            <Col sm={6}>
              <Form.Group>
                <Form.Label className="mb-0">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={poc.name.text}
                  onChange={(e) => handlePocChange(pocIndex, 'name.text', e.target.value)}
                  placeholder="Enter full name"
                />
              </Form.Group>
            </Col>
            
            <Col sm={6} className="position-relative">
              <Form.Group>
                <Form.Label className="mb-0">Role</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Role"
                  value={poc.role}
                  onChange={(e) => handlePocChange(pocIndex, 'role', e.target.value)}
                />
              </Form.Group>
              {pocs.length > 1 && (
                <span
                  className="minusIcons cursor-pointer position-absolute fs-5 fw-bold fw-bolder"
                  style={{ right: '-1%', top: '45%' }}
                  onClick={() => removePoc(pocIndex)}
                >
                  <FiMinusCircle />
                </span>
              )}
            </Col>

            <Col sm={6}>
              <Form.Group>
                <Form.Label className="mb-0">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  value={poc.email}
                  onChange={(e) => handlePocChange(pocIndex, 'email', e.target.value)}
                />
              </Form.Group>
            </Col>
            
            {poc?.telecom?.map((telecom, telecomIndex) => (
              <Col sm={6} key={telecomIndex}>
                <Form.Group className="mb-2 position-relative">
                  <Form.Label className="mb-0">Phone Number</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="ps-3 pe-1 p-0 fw-bold text-black">
                      &nbsp;&nbsp;+1
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Phone Number"
                      value={formatDisplayValue(telecom.value)}
                      onChange={(e) =>
                        handleTelecomChange(pocIndex, telecomIndex, 'value', e.target.value)
                      }
                      maxLength={14}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </InputGroup>
                  <div className="position-absolute" style={{ top: '52%', left: '1%' }}>
                    <img src={us} alt="country code flag" width={20} />
                  </div>
                </Form.Group>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </Row>
  );
};

export default POCSection;