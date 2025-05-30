// @flow
import React, { useEffect, useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import ToastHandle from '../../helpers/ToastMessage';
//actions
import { resetAuth, forgotPasswordChange, verifyToken } from '../../redux/actions';

// components
import { VerticalForm, FormInput } from '../../components/';
import AccountLayout from './AccountLayout';
import { decryptMessage } from '../../cryptoUtils';

/* bottom link */
const BottomLink = () => {
    const { t } = useTranslation();

    return (
        <Row className="mt-3">
            <Col className="text-center">
                <p className="text-muted">
                    {t('Back to')}{' '}
                    <Link to={'/account/login'} className="text-muted ms-1">
                        <b>{t('Log In')}</b>
                    </Link>
                </p>
            </Col>
        </Row>
    );
};

const ResetPassword = (): React$Element<any> => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [token, setToken] = useState('');

    useEffect(() => {
        // Get the current URL
        const url = window.location.href;
        const tokenFromUrl = url.split('/').pop(); // Gets the last segment of the URL
        setToken(tokenFromUrl);
        dispatch(verifyToken({ token: tokenFromUrl }));

    }, []);

    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    const store = useSelector((state) => state);
    const { loading, passwordChange, changePasswordSuccess } = useSelector((state) => ({
        loading: state.Auth.loading,
        passwordChange: state.Auth.passwordChange,
        changePasswordSuccess: state.Auth.changePasswordSuccess,
    }

    ));


    const schemaResolver = yupResolver(
        yup.object().shape({
            password: yup
                .string()
                .required(t('Please enter Password'))
                .min(8, t('At least 8 characters required, including 1 uppercase letter, 1 number, and 1 special character. Spaces are not allowed.'))
                .matches(/[A-Z]/, t('Password must contain at least one uppercase letter')) // Ensure at least one uppercase letter
                .matches(/[0-9]/, t('Password must contain at least one number')) // Ensure at least one number
                .matches(/[!@#$%^&*(),.?":{}|<>]/, t('Password must contain at least one special character')) // Ensure at least one special character
                .matches(/^\S*$/, t('Password cannot contain spaces')), // Ensure no spaces
            confirmPassword: yup
                .string()
                .oneOf([yup.ref('password'), null], t('Password must match'))
                .required(t('Please confirm your Password')),
        })
    );


    const onSubmit = (formData) => {
        dispatch(forgotPasswordChange({ token, newPassword: formData.password }));
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (changePasswordSuccess) {
            const successReset = JSON.parse(decryptMessage(changePasswordSuccess?.data));
            if (successReset?.status === 200) {
                ToastHandle(successReset?.message, 'success');
                navigate('/account/login');
            }
        }
    }, [changePasswordSuccess, navigate]);

    return (
        <AccountLayout bottomLinks={<BottomLink />}>
            <div className="text-center m-auto">
                <h4 className="text-dark-50 text-center mt-0 font-weight-bold">{t('Reset Password')}</h4>
                <p className="text-muted mb-4">
                    {t("Enter your new password, and we'll update your password.")}
                </p>
            </div>

            {!passwordChange && (
                <VerticalForm onSubmit={onSubmit} resolver={schemaResolver}>
                    <FormInput
                        label='New Password'
                        type="password"
                        name="password"
                        placeholder={t('Enter your Password')}
                        containerClass={'mb-3'}
                        onCopy={(e) => e.preventDefault()}
                        onCut={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                    />
                    <FormInput
                        label='Confirm Password'
                        type="password"
                        name="confirmPassword"
                        placeholder={t('Confirm your Password')}
                        containerClass={'mb-3'}
                        onCopy={(e) => e.preventDefault()}
                        onCut={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                    />

                    <div className="mb-3 mb-0 d-flex justify-content-center">
                        <Button variant="primary" className='custom-buttons' type="submit" disabled={loading}>
                            {t('Submit')}
                        </Button>
                    </div>
                </VerticalForm>
            )}
        </AccountLayout>
    );
};

export default ResetPassword;
