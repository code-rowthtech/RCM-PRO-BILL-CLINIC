import React, { useEffect, useState } from 'react';
import { Col, Form, InputGroup, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FiMinusCircle } from "react-icons/fi";

import us from '../../../assets/images/flags/us.jpg';

const TelecomFrom = ({ constantContact, setConstantContact }) => {
    const contactDetails = ['phone', 'email'];
    const contactOptions = ['phone', 'fax', 'email', 'pager', 'url', 'sms', 'other'];
    const {
        control,
        register,
        setValue,
        getValues,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();
    useEffect(() => {
        setConstantContact(
            contactDetails.map((system) => ({
                system,
                value: '',
                use: '',
            }))
        );
    }, []);
    const addContactDetails = () => {
        setConstantContact([...constantContact, { system: '', value: '', use: '' }]);
    };
    const removeContact = (index) => {
        if (index < contactDetails.length) return;
        setConstantContact(constantContact.filter((_, i) => i !== index));
    };
    const handleContactChange = (index, field, value) => {
        const updatedContacts = [...constantContact];

        if (field === 'value' && updatedContacts[index].system === 'phone') {
            // Remove non-numeric characters
            let rawValue = value.replace(/\D/g, '');
            if (rawValue.length > 10) rawValue = rawValue.slice(0, 10);

            // Format as (XXX)XXX-XXXX
            const formattedValue = rawValue.replace(/(\d{1,3})(\d{0,3})(\d{0,4})/, (match, p1, p2, p3) => {
                if (p3) return `(${p1})${p2}-${p3}`;
                if (p2) return `(${p1})${p2}`;
                return `(${p1}`;
            });

            updatedContacts[index][field] = formattedValue; // Store formatted phone number
        } else {
            updatedContacts[index][field] = value; // Store other fields as they are
        }

        setConstantContact(updatedContacts);
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
    // Function to handle Telecom (Contact) field changes inside POCs
    const handleTelecomChange = (pocIndex, telecomIndex, field, value) => {
        let rawValue = value.replace(/\D/g, ''); // Remove non-numeric characters

        // Limit to 10 digits
        if (rawValue.length > 10) rawValue = rawValue.slice(0, 10);

        // Format as (XXX)XXXXXXX
        const formattedValue = rawValue.replace(/(\d{1,3})(\d{0,7})/, (match, p1, p2) => {
            if (p2) return `(${p1})${p2}`;
            return `(${p1}`;
        });
    };

    return (
        <div>
            <Row>
                <Col sm={12}>
                    <Row className="">
                        <Col sm={12}>
                            <h5>
                                Contact Details
                                <span
                                    className="fs-5 uil-plus-circle plusicon ms-1 fw-bold cursor-pointer"
                                    onClick={addContactDetails}></span>
                            </h5>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={4}>
                            <Form.Label>Contact Type</Form.Label>
                        </Col>
                        <Col sm={4}>
                            <Form.Label>Value </Form.Label>
                        </Col>
                        <Col sm={4}>
                            <Form.Label>Use</Form.Label>
                        </Col>
                    </Row>

                    {constantContact.map((item, index) => (
                        <Row key={index} className="mb-2">
                            <Col sm={4}>
                                <Form.Select
                                    className="text-capitalize"
                                    value={item.system}
                                    data-has-value={!!watch(`constantContact[${index}].system`)}
                                    {...register(`constantContact[${index}].system`)}
                                    onChange={(e) => handleContactChange(index, 'system', e.target.value)}
                                    disabled={contactDetails.includes(item.type)}>
                                    <option value="" disabled>
                                        Select Contact Type
                                    </option>
                                    {contactOptions.map((option) => (
                                        <option className="text-capitalize" key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col sm={4}>
                                {item.system === 'phone' ? (
                                    <InputGroup className="position-relative">
                                        {/* Country Code Prefix */}
                                        <InputGroup.Text className="ps-4 p-0 pe-1 fw-bold text-black">
                                            +1
                                        </InputGroup.Text>

                                        {/* Phone Input */}
                                        <Form.Control
                                            type="tel"
                                            placeholder="(123)456-7890"
                                            value={formatDisplayValue(item.value)}
                                            onChange={(e) => handleContactChange(index, 'value', e.target.value)}
                                            maxLength={14}
                                            onKeyPress={(event) => {
                                                if (!/[0-9]/.test(event.key)) event.preventDefault();
                                            }}
                                            style={{ paddingLeft: '40px' }}
                                        />
                                        {/* Flag Icon */}
                                        <div
                                            className="position-absolute"
                                            style={{
                                                left: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                            }}>
                                            <img src={us} alt="flag" width={20} />
                                        </div>
                                    </InputGroup>
                                ) : (
                                    <Form.Control
                                        type={item.system === 'email' ? 'email' : 'text'}
                                        placeholder={item.system === 'email' ? 'Enter email' : 'Enter value'}
                                        value={item.value || ''}
                                        onChange={(e) => handleContactChange(index, 'value', e.target.value)}
                                    />
                                )}
                            </Col>

                            <Col sm={4} className={`position-relative  ${contactDetails?.length > 1 ? 'd-flex align-items-center' : ''}`}>
                                <Form.Select
                                    value={item.use}
                                    data-has-value={!!watch(`constantContact[${index}].use`)}
                                    {...register(`constantContact[${index}].use`)}
                                    onChange={(e) => handleContactChange(index, 'use', e.target.value)}>
                                    <option value="">Select Option</option> {/* Placeholder option */}
                                    <option value="temp">Temp</option>
                                    <option value="home">Home</option>
                                    <option value="work">Work</option>
                                    <option value="old">Old</option>
                                    <option value="mobile">Mobile</option>
                                    {/* Add more options as needed */}
                                </Form.Select>
                                {index >= contactDetails.length && (
                                    <span
                                        className="text-danger cursor-pointer fs-5 ms-2"
                                        onClick={() => removeContact(index)}
                                        title="Remove">
                                        <FiMinusCircle  />
                                    </span>
                                )}
                            </Col>
                        </Row>
                    ))}
                </Col>
            </Row>
        </div>
    );
};

export default TelecomFrom;
