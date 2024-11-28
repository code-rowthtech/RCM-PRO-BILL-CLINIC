import React, { useState } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Eye icons
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { confirmPasswordAction, resetAuth } from '../redux/actions';
import { encryptMessage } from '../cryptoUtils';

const ChangePasswordModal = ({ show, closeModal }) => {
  const dispatch = useDispatch();

  // Initialize useForm
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();

  // Watch new password field to compare with confirmPassword
  const newPassword = watch('newPassword');
  const oldPassword = watch('oldPassword');

  // State to toggle password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form submission handler
  const onSubmit = (data) => {
    console.log('Old Password:', data.oldPassword);  
    console.log('New Password:', data.newPassword); 
    const payload = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    };
    dispatch(confirmPasswordAction({key: encryptMessage(payload)}));
    closeModal();
    reset();
  };

  return (
    <Modal centered size="md" show={show} onHide={closeModal}>
      <Modal.Body className='p-3'>
        <Row className="mb-2 pb-2  d-flex align-items-center">
          <Col sm={1}></Col>
          <Col sm={10}>
            <h4 className="mb-0 text-center">Change Your Password</h4>
          </Col>
          <Col sm={1}>
            <IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} />
          </Col>
        </Row>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Old Password */}
          <Row>
            <Col md={12} className="d-flex justify-content-center">
              <Form.Group className="mb-3 w-100 position-relative">
                <Form.Label>Old Password</Form.Label>
                <Form.Control
                  type={showOldPassword ? 'text' : 'password'} 
                  placeholder="Enter old password"
                  {...register('oldPassword', {
                    required: 'Old password is required'
                  })}
                />
                <span 
                  className="position-absolute" 
                  style={{ top: '50%', right: '10px', transform: 'translateY(20%)', cursor: 'pointer' }} 
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.oldPassword && (
                  <span className="text-danger">{errors.oldPassword.message}</span>
                )}
              </Form.Group>
            </Col>

            {/* New Password */}
            <Col md={12} className="d-flex justify-content-center">
              <Form.Group className="mb-3 w-100 position-relative">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type={showNewPassword ? 'text' : 'password'}  
                  placeholder="Enter new password"
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long'
                    },
                    validate: value => 
                      value !== oldPassword || 'New password cannot be the same as the old password'
                  })}
                />
                <span 
                  className="position-absolute" 
                  style={{ top: '50%', right: '10px', transform: 'translateY(20%)', cursor: 'pointer' }} 
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.newPassword && (
                  <span className="text-danger">{errors.newPassword.message}</span>
                )}
              </Form.Group>
            </Col>

            {/* Confirm New Password */}
            <Col md={12} className="d-flex justify-content-center">
              <Form.Group className="mb-2 w-100 position-relative">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type={showConfirmPassword ? 'text' : 'password'}  // Toggle password visibility
                  placeholder="Confirm new password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your new password',
                    validate: value =>
                      value === newPassword || 'Passwords do not match'
                  })}
                />
                <span 
                  className="position-absolute" 
                  style={{ top: '50%', right: '10px', transform: 'translateY(20%)', cursor: 'pointer' }} 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.confirmPassword && (
                  <span className="text-danger">{errors.confirmPassword.message}</span>
                )}
              </Form.Group>
            </Col>

            <Col sm={12} className="text-center mt-2">
              <Button className="custom-buttons" type="submit">
                Change Password
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;
