import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { IoMdClose } from 'react-icons/io';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { confirmPasswordAction } from '../redux/actions';
import { decryptMessage, encryptMessage } from '../cryptoUtils';
import Spinner from '../constants/Spinner';

const ChangePasswordModal = ({ show, closeModal }) => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        reset,
        watch,
    } = useForm();
    const [passwordStrength, setPasswordStrength] = useState('');

    const newPassword = watch('newPassword');
    const oldPassword = watch('oldPassword');
    const { loading, changeConfirmPasswordSuccess } = useSelector((state) => ({
        loading: state.Auth.loading,
        changeConfirmPasswordSuccess: state.Auth.changeConfirmPasswordSuccess,
    }));
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (changeConfirmPasswordSuccess?.data) {
            try {
                const decrypted = JSON.parse(decryptMessage(changeConfirmPasswordSuccess.data));
                if (decrypted?.status === 200) {
                    closeModal();
                    reset();
                }
            } catch (error) { }
        }
    }, [changeConfirmPasswordSuccess, closeModal, reset]);

    const changePasswordSubmit = async (data) => {
        const payload = { oldPassword: data.oldPassword, newPassword: data.newPassword };
        dispatch(confirmPasswordAction({ key: encryptMessage(payload) }));
    };
    const strongRegex = /^[a-zA-Z\d!@#$%^&*]{8,16}$/;

    const checkPasswordStrength = (password) => {
        if (strongRegex.test(password)) {
            setPasswordStrength('');
        } else {
            setPasswordStrength(
                'Password is too weak. Please use a mix of uppercase, lowercase, numbers, and special characters.'
            );
        }
    };

    return (
        <Modal centered size="md" show={show} onHide={closeModal}>
            <Modal.Body className="p-3">
                <Row className="mb-2 pb-2 d-flex align-items-center">
                    <Col sm={1}></Col>
                    <Col sm={10}>
                        <h4 className="mb-0 text-center">Change Your Password</h4>
                    </Col>
                    <Col sm={1}>
                        <IoMdClose className="fs-4 cursor-pointer" onClick={closeModal} />
                    </Col>
                </Row>
                <Form onSubmit={handleSubmit(changePasswordSubmit)}>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3 position-relative">
                                <Form.Label>Old Password</Form.Label>
                                <Form.Control
                                    type={showOldPassword ? 'text' : 'password'}
                                    placeholder="Enter old password"
                                    {...register('oldPassword', { required: 'Old password is required' })}
                                    onCopy={(e) => e.preventDefault()}
                                    onCut={(e) => e.preventDefault()}
                                    onPaste={(e) => e.preventDefault()}
                                />
                                <span
                                    className="position-absolute"
                                    style={{ top: '35px', right: '10px', cursor: 'pointer' }}
                                    onClick={() => setShowOldPassword(!showOldPassword)}>
                                    {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                {errors.oldPassword && (
                                    <span className="text-danger">{errors.oldPassword.message}</span>
                                )}
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group className="mb-3 position-relative">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type={showNewPassword ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    {...register('newPassword', {
                                        validate: {
                                            isRequired: (value) =>
                                                value?.trim() !== '' ||
                                                'Password is too weak. Please use a mix of uppercase, lowercase, numbers, and special characters',
                                            isDifferent: (value) =>
                                                value !== oldPassword ||
                                                'New password cannot be the same as the old password',
                                            isStrongEnough: (value) =>
                                                !value ||
                                                strongRegex.test(value) ||
                                                'Password must include uppercase, lowercase, number, and special character',
                                        },
                                    })}
                                    onCopy={(e) => e.preventDefault()}
                                    onCut={(e) => e.preventDefault()}
                                    onPaste={(e) => e.preventDefault()}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        checkPasswordStrength(value);
                                        trigger('newPassword');
                                    }}
                                />
                                <span
                                    className="position-absolute"
                                    style={{ top: '35px', right: '10px', cursor: 'pointer' }}
                                    onClick={() => setShowNewPassword(!showNewPassword)}>
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                {errors.newPassword && errors.newPassword.type === 'isRequired' ? (
                                    <span className="text-danger">{errors.newPassword.message}</span>
                                ) : passwordStrength ? (
                                    <span className="text-warning">{passwordStrength}</span>
                                ) : errors.newPassword ? (
                                    <span className="text-danger">{errors.newPassword.message}</span>
                                ) : null}
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group className="mb-2 position-relative">
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your new password',
                                        validate: (value) => value === newPassword || 'Passwords do not match',
                                    })}
                                    onCopy={(e) => e.preventDefault()}
                                    onCut={(e) => e.preventDefault()}
                                    onPaste={(e) => e.preventDefault()}
                                />
                                <span
                                    className="position-absolute"
                                    style={{ top: '35px', right: '10px', cursor: 'pointer' }}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                {errors.confirmPassword && (
                                    <span className="text-danger">{errors.confirmPassword.message}</span>
                                )}
                            </Form.Group>
                        </Col>

                        <Col sm={12} className="d-flex justify-content-center mt-2">
                            <Button className="custom-buttons" type="submit" disabled={loading}
                                style={{ width: '160px' }}>
                                {loading ? <Spinner color="white" className="spinner-border-sm" /> : 'Change Password'}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ChangePasswordModal;
